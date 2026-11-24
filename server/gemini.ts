import { GoogleGenAI, Type } from '@google/genai';
import type {
  BridgeExplanation,
  BridgeReplySuggestion,
  JlptLevel,
  OralTurnResponse,
  UiLanguage,
  WritingEvaluation,
} from '../src/types/kotonoha.ts';

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('GEMINI_API_KEY no está configurada en el servidor. Añádela en Settings > Secrets.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export type JapaneseVoiceName = 'Kore' | 'Puck' | 'Zephyr';

export async function synthesizeJapaneseSpeech(
  text: string,
  options?: {
    voiceName?: JapaneseVoiceName;
    pace?: 'slow' | 'natural';
  }
): Promise<{ audioBase64: string; mimeType: string }> {
  const ai = getAiClient();
  const voiceName: JapaneseVoiceName = options?.voiceName || 'Kore';
  const style =
    options?.pace === 'slow'
      ? 'Native Tokyo Japanese tutor speaking slowly, warmly, and very clearly for a learner, articulating each mora naturally.'
      : 'Native Tokyo Japanese speaker speaking warmly, naturally, and expressively with authentic standard pitch accent.';

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash-lite-tts',
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: text.slice(0, 600),
            speechMetadata: {
              style,
            },
          },
        ],
      },
    ],
    config: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName },
        },
      },
    },
  });

  const inline = response.candidates?.[0]?.content?.parts?.[0]?.inlineData;
  if (!inline?.data) {
    throw new Error('No se pudo sintetizar la voz japonesa desde el modelo TTS.');
  }
  return {
    audioBase64: inline.data,
    mimeType: inline.mimeType || 'audio/wav',
  };
}

export interface OralTurnInput {
  audioBase64?: string;
  audioMimeType?: string;
  userText?: string;
  scenario: string;
  jlptLevel: JlptLevel;
  voiceName: JapaneseVoiceName;
  pace: 'slow' | 'natural';
  history: { role: 'user' | 'sensei'; text: string }[];
  uiLang?: UiLanguage;
}

export async function processOralTurn(input: OralTurnInput): Promise<OralTurnResponse> {
  const ai = getAiClient();
  const uiLang: UiLanguage = input.uiLang === 'ja' ? 'ja' : 'es';
  const feedbackLangLabel = uiLang === 'ja' ? 'japonés natural y claro (日本語)' : 'español';

  let transcriptHint = input.userText?.trim() || '';

  // When audio is provided, transcribe first with gemini-3.5-transcribe for high phonetic fidelity
  if (input.audioBase64 && input.audioMimeType) {
    try {
      const tr = await ai.models.generateContent({
        model: 'gemini-3.5-transcribe',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: input.audioMimeType,
                data: input.audioBase64,
              },
            },
            {
              text: 'Transcribe verbatim the Japanese speech (preserving any mispronunciations or Spanish words if spoken). Output only the transcription.',
            },
          ],
        },
      });
      if (tr.text?.trim()) {
        transcriptHint = tr.text.trim();
      }
    } catch {
      // Fallback: gemini-4-hydrogen below also receives the audio directly
    }
  }

  const historyText = input.history
    .slice(-8)
    .map((h) => `${h.role === 'user' ? 'Estudiante' : 'Sensei'}: ${h.text}`)
    .join('\n');

  const systemInstruction = `Eres Haruka-sensei, profesora nativa de japonés de Tokio, cercana, paciente y experta en fonética japonesa (acento tonal / pitch accent, moras, vocales largas 長音, consonantes geminadas っ y claridad de partículas).
Escenario actual: ${input.scenario}.
Nivel objetivo JLPT: ${input.jlptLevel}.
Idioma de las explicaciones y traducciones: ${feedbackLangLabel}.
Reglas estrictas:
1. Analiza el audio (o texto si escribió) del estudiante. Evalúa su pronunciación, ritmo moráico, acento tonal y naturalidad gramatical en japonés con puntuación 0 a 100.
2. Da feedback fonético concreto, amable y accionable en ${feedbackLangLabel} (2-4 puntos específicos en pronunciationDetails, y pronunciationSummary en ${feedbackLangLabel}).
3. Proporciona la versión natural y corregida de lo que quiso decir el estudiante en correctedJapanese.
4. Continúa la conversación de forma natural, breve (1-3 frases en japonés acorde al nivel ${input.jlptLevel}) y motivadora haciendo una pregunta o siguiendo el rol del escenario en senseiReplyJa.
5. En userMeaningEs y senseiReplyEs escribe la traducción/explicación en ${feedbackLangLabel}.
6. Devuelve exclusivamente el JSON estructurado según el esquema.`;

  const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];
  if (input.audioBase64 && input.audioMimeType) {
    parts.push({
      inlineData: {
        mimeType: input.audioMimeType,
        data: input.audioBase64,
      },
    });
  }
  parts.push({
    text: `Historial reciente:\n${historyText || '(Inicio de la conversación)'}\n\nEntrada del estudiante${transcriptHint ? ` (transcripción preliminar: ${transcriptHint})` : ''}: ${input.userText || '[Audio adjunto]'}\n\nEvalúa la pronunciación y responde como Sensei.`,
  });

  const response = await ai.models.generateContent({
    model: 'gemini-4-hydrogen',
    contents: { parts },
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          userTranscriptJa: { type: Type.STRING, description: 'Lo que dijo el estudiante en japonés' },
          userTranscriptReading: { type: Type.STRING, description: 'Lectura en hiragana con espacios' },
          userMeaningEs: { type: Type.STRING, description: `Significado en ${feedbackLangLabel} de lo que dijo el estudiante` },
          pronunciationScore: { type: Type.INTEGER, description: 'Puntuación de pronunciación y claridad de 0 a 100' },
          pronunciationSummary: { type: Type.STRING, description: `Resumen conciso en ${feedbackLangLabel} del desempeño oral` },
          pronunciationDetails: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                aspect: { type: Type.STRING, description: `Aspecto fonético en ${feedbackLangLabel}` },
                status: { type: Type.STRING, description: 'correcto o mejorable' },
                feedback: { type: Type.STRING, description: `Consejo específico en ${feedbackLangLabel}` },
              },
              required: ['aspect', 'status', 'feedback'],
            },
          },
          correctedJapanese: { type: Type.STRING, description: 'Versión más natural/corregida de la frase del estudiante' },
          senseiReplyJa: { type: Type.STRING, description: 'Respuesta conversacional de Sensei en japonés natural' },
          senseiReplyReading: { type: Type.STRING, description: 'Lectura en hiragana de la respuesta de Sensei' },
          senseiReplyRomaji: { type: Type.STRING, description: 'Romaji de la respuesta de Sensei' },
          senseiReplyEs: { type: Type.STRING, description: `Traducción/nota en ${feedbackLangLabel} de la respuesta de Sensei` },
        },
        required: [
          'userTranscriptJa',
          'userTranscriptReading',
          'userMeaningEs',
          'pronunciationScore',
          'pronunciationSummary',
          'pronunciationDetails',
          'correctedJapanese',
          'senseiReplyJa',
          'senseiReplyReading',
          'senseiReplyRomaji',
          'senseiReplyEs',
        ],
      },
    },
  });

  const parsed = JSON.parse((response.text || '{}').trim()) as Omit<
    OralTurnResponse,
    'audioBase64' | 'audioMimeType'
  >;

  let audioBase64: string | null = null;
  let audioMimeType: string | null = null;
  if (parsed.senseiReplyJa) {
    try {
      const tts = await synthesizeJapaneseSpeech(parsed.senseiReplyJa, {
        voiceName: input.voiceName,
        pace: input.pace,
      });
      audioBase64 = tts.audioBase64;
      audioMimeType = tts.mimeType;
    } catch {
      audioBase64 = null;
      audioMimeType = null;
    }
  }

  return {
    ...parsed,
    pronunciationDetails: (parsed.pronunciationDetails || []).map((d) => ({
      aspect: d.aspect,
      status: d.status === 'correcto' ? 'correcto' : 'mejorable',
      feedback: d.feedback,
    })),
    audioBase64,
    audioMimeType,
  };
}

export async function evaluateHandwriting(
  targetCharacter: string,
  characterType: 'hiragana' | 'katakana' | 'kanji',
  imageBase64: string,
  uiLang: UiLanguage = 'es'
): Promise<WritingEvaluation> {
  const ai = getAiClient();
  const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
  const feedbackLang = uiLang === 'ja' ? 'japonés natural y amable (日本語)' : 'español';

  const response = await ai.models.generateContent({
    model: 'gemini-4-hydrogen',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/png',
            data: cleanBase64,
          },
        },
        {
          text: `Evalúa la caligrafía japonesa dibujada por una estudiante. El carácter objetivo es "${targetCharacter}" (${characterType}). Analiza proporciones, equilibrio dentro del cuadrado, claridad de trazos y parecido real con "${targetCharacter}". Responde íntegramente en ${feedbackLang} en JSON.`,
        },
      ],
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.INTEGER, description: 'Puntuación de 0 a 100' },
          verdict: { type: Type.STRING, description: `Veredicto breve en ${feedbackLang}` },
          strokeFeedback: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: `Lista de 2 a 3 consejos concretos sobre trazos y proporción en ${feedbackLang}`,
          },
          encouragement: { type: Type.STRING, description: `Frase breve de ánimo en ${feedbackLang}` },
        },
        required: ['score', 'verdict', 'strokeFeedback', 'encouragement'],
      },
    },
  });

  return JSON.parse((response.text || '{}').trim()) as WritingEvaluation;
}

export async function generateDailyPrompt(
  uiLang: UiLanguage = 'es'
): Promise<{ promptEs: string; promptJa: string; topicTag: string }> {
  const ai = getAiClient();
  const angle =
    uiLang === 'ja'
      ? 'El usuario está navegando en japonés; crea una pregunta que invite especialmente a conversar sobre vida cotidiana, cultura, gastronomía, viajes o aficiones entre Japón y el mundo hispanohablante.'
      : 'El usuario está navegando en español; crea una pregunta cotidiana, cálida y fácil de responder para estudiantes de japonés y español.';

  const response = await ai.models.generateContent({
    model: 'gemini-4-hydrogen',
    contents: {
      parts: [
        {
          text: `Genera 1 tema diario de conversación bilingüe (Español y Japonés natural) para un muro de intercambio de idiomas entre hispanohablantes y japoneses. ${angle}
Elige topicTag exclusivamente entre: anime_manga, travel, gastronomy, music, culture, daily_life.
Cada pregunta debe ser clara, cercana y menor de 180 caracteres.`,
        },
      ],
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          promptEs: { type: Type.STRING, description: 'Pregunta natural en español' },
          promptJa: { type: Type.STRING, description: 'Pregunta natural y amigable en japonés' },
          topicTag: {
            type: Type.STRING,
            description: 'Uno de: anime_manga, travel, gastronomy, music, culture, daily_life',
          },
        },
        required: ['promptEs', 'promptJa', 'topicTag'],
      },
    },
  });

  const parsed = JSON.parse((response.text || '{}').trim()) as {
    promptEs?: string;
    promptJa?: string;
    topicTag?: string;
  };
  const validTags = ['anime_manga', 'travel', 'gastronomy', 'music', 'culture', 'daily_life'];
  return {
    promptEs: String(parsed.promptEs || '¿Qué lugar te gustaría visitar este año y por qué?').slice(0, 290),
    promptJa: String(parsed.promptJa || '今年行ってみたい場所はどこですか？その理由も教えてください。').slice(0, 290),
    topicTag: validTags.includes(String(parsed.topicTag)) ? String(parsed.topicTag) : 'daily_life',
  };
}

export async function bridgeExplainMessage(
  messageText: string,
  uiLang: UiLanguage = 'es'
): Promise<BridgeExplanation> {
  const ai = getAiClient();
  const targetExplainLang = uiLang === 'ja' ? '日本語（自然な敬体でわかりやすく）' : 'español claro y cercano';

  const response = await ai.models.generateContent({
    model: 'gemini-4-hydrogen',
    contents: {
      parts: [
        {
          text: `Actúa como puente lingüístico experto Español <-> Japonés.
Mensaje a analizar: """${messageText.slice(0, 1800)}"""
Instrucciones:
1. Traduce el mensaje de forma natural al idioma de explicación (${targetExplainLang}). Si el mensaje ya está en el idioma de explicación, ofrece una paráfrasis natural o traducción al otro idioma del intercambio (japonés/español) aclarando el matiz.
2. En "reading": si el mensaje contiene japonés, incluye lectura completa en hiragana/furigana + romaji. Si está en español, incluye guía breve de pronunciación/matiz para un lector japonés (o cadena vacía si no aplica).
3. En "grammarNotes": incluye exactamente 1 o 2 puntos gramaticales o expresiones naturales clave del mensaje, explicados en ${targetExplainLang}.`,
        },
      ],
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          translation: { type: Type.STRING },
          reading: { type: Type.STRING },
          grammarNotes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                point: { type: Type.STRING },
                explanation: { type: Type.STRING },
              },
              required: ['point', 'explanation'],
            },
          },
        },
        required: ['translation', 'reading', 'grammarNotes'],
      },
    },
  });

  const parsed = JSON.parse((response.text || '{}').trim()) as Partial<BridgeExplanation>;
  return {
    translation: String(parsed.translation || ''),
    reading: String(parsed.reading || ''),
    grammarNotes: Array.isArray(parsed.grammarNotes) ? parsed.grammarNotes.slice(0, 3) : [],
  };
}

export async function bridgeSuggestReplies(
  messageText: string,
  promptContext: string,
  uiLang: UiLanguage = 'es'
): Promise<{ suggestions: BridgeReplySuggestion[] }> {
  const ai = getAiClient();
  const glossLang = uiLang === 'ja' ? '日本語（意味とニュアンス）' : 'español (significado y matiz)';

  const response = await ai.models.generateContent({
    model: 'gemini-4-hydrogen',
    contents: {
      parts: [
        {
          text: `Actúa como puente lingüístico en un intercambio Español <-> Japonés.
Tema del muro: """${promptContext.slice(0, 400)}"""
Mensaje publicado por otro usuario: """${messageText.slice(0, 1500)}"""
Sugiere exactamente 3 posibles respuestas naturales adaptadas al contexto del mensaje:
1) register: "simple" (sencilla y directa para principiantes)
2) register: "standard" (natural y amable)
3) register: "colloquial" (cercana y coloquial entre amigos)
Importante:
- Redacta "text" en el idioma en que el usuario respondería para mantener la conversación fluida (si el mensaje está escrito en japonés, sugiere respuestas en japonés natural para responderle; si el mensaje está en español, sugiere respuestas en español natural para responderle).
- En "reading": si "text" está en japonés, escribe hiragana + romaji; si está en español, escribe una breve pista de tono/pronunciación o déjalo breve.
- En "gloss": explica el significado de cada sugerencia en ${glossLang}.`,
        },
      ],
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          suggestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                register: { type: Type.STRING, description: 'simple | standard | colloquial' },
                text: { type: Type.STRING },
                reading: { type: Type.STRING },
                gloss: { type: Type.STRING },
              },
              required: ['register', 'text', 'reading', 'gloss'],
            },
          },
        },
        required: ['suggestions'],
      },
    },
  });

  const parsed = JSON.parse((response.text || '{"suggestions":[]}').trim()) as {
    suggestions?: Partial<BridgeReplySuggestion>[];
  };
  const registers: ('simple' | 'standard' | 'colloquial')[] = ['simple', 'standard', 'colloquial'];
  const normalized: BridgeReplySuggestion[] = (parsed.suggestions || []).slice(0, 3).map((s, idx) => ({
    register:
      s.register === 'simple' || s.register === 'standard' || s.register === 'colloquial'
        ? s.register
        : registers[idx] || 'standard',
    text: String(s.text || ''),
    reading: String(s.reading || ''),
    gloss: String(s.gloss || ''),
  }));
  return { suggestions: normalized };
}

export async function extractPdfResource(
  pdfBase64: string,
  mode: 'lesson' | 'dictionary',
  jlptLevel: JlptLevel,
  sourceName: string
): Promise<unknown> {
  const ai = getAiClient();
  const cleanPdf = pdfBase64.replace(/^data:application\/pdf;base64,/, '');

  if (mode === 'dictionary') {
    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'application/pdf',
              data: cleanPdf,
            },
          },
          {
            text: `Extrae hasta 25 entradas clave de vocabulario japonés-español de este recurso PDF ("${sourceName}") para el nivel ${jlptLevel}. Incluye palabra en japonés, lectura en kana, romaji, significado preciso en español, categoría gramatical y una oración de ejemplo con traducción.`,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            entries: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  reading: { type: Type.STRING },
                  romaji: { type: Type.STRING },
                  meaningEs: { type: Type.STRING },
                  partOfSpeech: { type: Type.STRING },
                  exampleJa: { type: Type.STRING },
                  exampleReading: { type: Type.STRING },
                  exampleEs: { type: Type.STRING },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['word', 'reading', 'romaji', 'meaningEs', 'partOfSpeech', 'exampleJa', 'exampleReading', 'exampleEs'],
              },
            },
          },
          required: ['entries'],
        },
      },
    });
    return JSON.parse((response.text || '{"entries":[]}').trim());
  }

  const response = await ai.models.generateContent({
    model: 'gemini-4-hydrogen',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'application/pdf',
            data: cleanPdf,
          },
        },
        {
          text: `A partir de este recurso PDF ("${sourceName}"), crea una unidad didáctica completa de japonés de nivel ${jlptLevel} en español con puntos gramaticales, vocabulario, kanji relevantes, diálogo natural, ejercicios prácticos y evaluación de unidad.`,
        },
      ],
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          subtitle: { type: Type.STRING },
          grammarPoints: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                pattern: { type: Type.STRING },
                reading: { type: Type.STRING },
                meaning: { type: Type.STRING },
                explanation: { type: Type.STRING },
                formation: { type: Type.STRING },
                examples: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      ja: { type: Type.STRING },
                      reading: { type: Type.STRING },
                      romaji: { type: Type.STRING },
                      es: { type: Type.STRING },
                    },
                    required: ['ja', 'reading', 'romaji', 'es'],
                  },
                },
              },
              required: ['pattern', 'reading', 'meaning', 'explanation', 'formation', 'examples'],
            },
          },
          vocabulary: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                reading: { type: Type.STRING },
                romaji: { type: Type.STRING },
                meaning: { type: Type.STRING },
                pos: { type: Type.STRING },
              },
              required: ['word', 'reading', 'romaji', 'meaning', 'pos'],
            },
          },
          kanjiList: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                character: { type: Type.STRING },
                meaning: { type: Type.STRING },
                onyomi: { type: Type.STRING },
                kunyomi: { type: Type.STRING },
                strokes: { type: Type.INTEGER },
                mnemonic: { type: Type.STRING },
                compounds: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ['character', 'meaning', 'onyomi', 'kunyomi', 'strokes', 'mnemonic', 'compounds'],
            },
          },
          dialogue: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                speaker: { type: Type.STRING },
                ja: { type: Type.STRING },
                reading: { type: Type.STRING },
                romaji: { type: Type.STRING },
                es: { type: Type.STRING },
              },
              required: ['speaker', 'ja', 'reading', 'romaji', 'es'],
            },
          },
          exercises: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                type: { type: Type.STRING },
                prompt: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
              },
              required: ['id', 'type', 'prompt', 'options', 'correctIndex', 'explanation'],
            },
          },
          unitExam: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                type: { type: Type.STRING },
                prompt: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
              },
              required: ['id', 'type', 'prompt', 'options', 'correctIndex', 'explanation'],
            },
          },
        },
        required: ['title', 'subtitle', 'grammarPoints', 'vocabulary', 'kanjiList', 'dialogue', 'exercises', 'unitExam'],
      },
    },
  });

  return JSON.parse((response.text || '{}').trim());
}
