export default async function handler(req: any, res: any) {
  const { text = '', pace = 'natural' } = req.body || req.query || {};
  if (!text) return res.status(400).json({ error: 'Falta texto' });

  try {
    const speed = pace === 'slow' ? '0.75' : '1.0';
    const url =
      'https://google.com' +
      speed +
      '&q=' +
      encodeURIComponent(String(text).slice(0, 200));

    const audioRes = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    if (!audioRes.ok) throw new Error('TTS no disponible');

    const arrayBuffer = await audioRes.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    return res.status(200).json({ audioBase64: base64, mimeType: 'audio/mpeg' });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || 'Error TTS' });
  }
}
async function generateSmart(
  contents: any,
  fallbackInfo?: { promptText: string; imageBase64?: string }
): Promise<string> {
  if (fallbackInfo && import.meta.env.VITE_OPENROUTER_API_KEY) {
    const orResult = await callOpenRouter(fallbackInfo.promptText, fallbackInfo.imageBase64);
    if (orResult) return orResult;
  }

  const ai = getAiClient();
  if (!ai) {
    throw new Error('Configura VITE_OPENROUTER_API_KEY o VITE_GEMINI_API_KEY en Vercel.');
  }

  for (let i = 0; i < 2; i++) {
    try {
      const res = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: { responseMimeType: 'application/json' },
      });
      if (res.text) return res.text;
    } catch (err: any) {
      const msg = String(err?.message || err);
      const isBusy = msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('429');
      if (isBusy && i === 0) {
        await new Promise((r) => setTimeout(r, 1500));
        continue;
      }
      if (isBusy) {
        throw new Error(
          'Gemini alcanzó su límite gratuito por minuto (429). Añade VITE_GROQ_API_KEY (gratis en ://groq.com) en Vercel para transcribir voz sin límites, o escribe en texto.'
        );
      }
      throw new Error(msg);
    }
  }

  throw new Error('No se obtuvo respuesta de la IA. Inténtalo de nuevo en unos segundos.');
}

type VoiceProfile = 'Kore' | 'Puck' | 'Zephyr';

function speakJapaneseBrowser(
  text: string,
  pace: 'slow' | 'natural' = 'natural',
  voiceProfile: VoiceProfile = 'Kore'
): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    const baseRate = pace === 'slow' ? 0.78 : 1.0;
    utterance.pitch = voiceProfile === 'Puck' ? 0.8 : voiceProfile === 'Zephyr' ? 1.18 : 1.0;
    utterance.rate = baseRate;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
}

let lastSpokenText = '';
let lastPace: 'slow' | 'natural' = 'natural';
let lastVoice: VoiceProfile = 'Kore';

export const api = {
  synthesizeSpeech: async (
    text: string,
    voiceName: VoiceProfile = 'Kore',
    pace: 'slow' | 'natural' = 'natural'
  ) => {
    lastSpokenText = text;
    lastPace = pace;
    lastVoice = voiceName;

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, pace, voiceName }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.audioBase64) {
          return { audioBase64: data.audioBase64, mimeType: data.mimeType || 'audio/mpeg' };
        }
      }
    } catch {
      // Si aún no creaste api/tts.ts, usa navegador
    }
    return { audioBase64: 'BROWSER_TTS', mimeType: 'audio/browser-tts' };
  },
  sendOralTurn: async (payload: {
    audioBase64?: string;
    audioMimeType?: string;
    userText?: string;
    scenario: string;
    jlptLevel: JlptLevel;
    voiceName: VoiceProfile;
    pace: 'slow' | 'natural';
    history: { role: 'user' | 'sensei'; text: string }[];
    uiLang?: UiLanguage;
  }): Promise<OralTurnResponse> => {
    const uiLang = payload.uiLang || 'es';
    const explanationLang = uiLang === 'ja' ? 'japonés natural' : 'español';

    let spokenText = payload.userText || '';
    if (!spokenText && payload.audioBase64 && payload.audioMimeType) {
      const groqTranscript = await transcribeWithGroqOrFallback(payload.audioBase64, payload.audioMimeType);
      if (groqTranscript) spokenText = groqTranscript;
    }

    const prompt =
      'Eres un profesor nativo de japonés (Sensei) amable. Escenario: "' +
      payload.scenario +
      '". Nivel del estudiante: ' +
      payload.jlptLevel +
      '. Historial reciente: ' +
      JSON.stringify(payload.history.slice(-6)) +
      '. ' +
      (spokenText
        ? 'El estudiante dijo: "' + spokenText + '"'
        : 'El estudiante envió un audio. Transcríbelo en japonés y evalúa su pronunciación.') +
      ' Responde ÚNICAMENTE en JSON válido con esta estructura exacta: { "userTranscriptJa": "lo que dijo el usuario en japonés", "userTranscriptReading": "lectura en hiragana", "userMeaningEs": "traducción al ' +
      explanationLang +
      '", "pronunciationScore": 88, "pronunciationSummary": "resumen breve en ' +
      explanationLang +
      '", "pronunciationDetails": [{ "aspect": "Pronunciación y naturalidad", "status": "correcto", "feedback": "comentario breve en ' +
      explanationLang +
      '" }], "correctedJapanese": "forma más natural en japonés", "senseiReplyJa": "tu respuesta en japonés nivel ' +
      payload.jlptLevel +
      '", "senseiReplyReading": "hiragana de tu respuesta", "senseiReplyRomaji": "romaji de tu respuesta", "senseiReplyEs": "traducción al ' +
      explanationLang +
      '" }';

    const parts: any[] = [{ text: prompt }];
    if (!spokenText && payload.audioBase64 && payload.audioMimeType) {
      const cleanMime = String(payload.audioMimeType).split(';').at(0)?.trim() || 'audio/webm';
      parts.unshift({
        inlineData: {
          data: payload.audioBase64,
          mimeType: cleanMime,
        },
      });
    }

    const raw = await generateSmart(parts, spokenText ? { promptText: prompt } : undefined);
    const parsed = extractJsonObject(raw);
    lastSpokenText = parsed.senseiReplyJa || '';
    lastPace = payload.pace;
    lastVoice = payload.voiceName;

    return {
      userTranscriptJa: parsed.userTranscriptJa || spokenText || '...',
      userTranscriptReading: parsed.userTranscriptReading || '',
      userMeaningEs: parsed.userMeaningEs || '',
      pronunciationScore: Number(parsed.pronunciationScore) || 85,
      pronunciationSummary: parsed.pronunciationSummary || parsed.feedbackEs || '¡Buen trabajo!',
      pronunciationDetails: Array.isArray(parsed.pronunciationDetails) ? parsed.pronunciationDetails : [],
      correctedJapanese: parsed.correctedJapanese || parsed.userTranscriptJa || spokenText || '',
      senseiReplyJa: parsed.senseiReplyJa || 'いいですね！続けましょう。',
      senseiReplyReading: parsed.senseiReplyReading || '',
      senseiReplyRomaji: parsed.senseiReplyRomaji || '',
      senseiReplyEs: parsed.senseiReplyEs || '',
      audioBase64: parsed.senseiReplyJa ? 'BROWSER_TTS' : null,
      audioMimeType: 'audio/browser-tts',
    };
  },

  evaluateWriting: async (payload: {
    targetCharacter: string;
    characterType: 'hiragana' | 'katakana' | 'kanji';
    imageBase64: string;
    uiLang?: UiLanguage;
  }): Promise<WritingEvaluation> => {
    const langText = payload.uiLang === 'ja' ? 'japonés' : 'español';
    const cleanBase64 = payload.imageBase64
      .replace('data:image/png;base64,', '')
      .replace('data:image/jpeg;base64,', '');
    const promptText =
      'Evalúa este trazo manuscrito del carácter ' +
      payload.characterType +
      ' "' +
      payload.targetCharacter +
      '". Responde ÚNICAMENTE en JSON válido en ' +
      langText +
      ' con esta estructura exacta: { "score": 85, "verdict": "Muy bien trazado", "strokeFeedback": ["consejo 1 sobre proporciones", "consejo 2 sobre orden de trazos"], "encouragement": "¡Sigue así!" }';

    const raw = await generateSmart(
      [
        { inlineData: { data: cleanBase64, mimeType: 'image/png' } },
        { text: promptText },
      ],
      { promptText, imageBase64: cleanBase64 }
    );

    const parsed = extractJsonObject(raw);
    const feedbackList = Array.isArray(parsed.strokeFeedback)
      ? parsed.strokeFeedback
      : Array.isArray(parsed.tips)
        ? parsed.tips
        : ['Buena proporción general del carácter ' + payload.targetCharacter + '.'];

    return {
      score: typeof parsed.score === 'number' ? parsed.score : 82,
      verdict: parsed.verdict || (parsed.isCorrect === false ? 'Necesita un poco más de práctica' : '¡Muy buen trazo!'),
      strokeFeedback: feedbackList,
      encouragement: parsed.encouragement || parsed.feedback || '¡Sigue practicando así!',
    };
  },

  generateDailyPrompt: async (uiLang: UiLanguage = 'es') => {
    const promptText =
      'Genera una pregunta diaria interesante para intercambio cultural entre hispanohablantes y japoneses (idioma UI: ' +
      uiLang +
      '). Devuelve ÚNICAMENTE JSON: { "promptEs": string, "promptJa": string, "topicTag": string }';
    const raw = await generateSmart(promptText, { promptText });
    return extractJsonObject(raw);
  },

  bridgeExplain: async (messageText: string, uiLang: UiLanguage = 'es'): Promise<BridgeExplanation> => {
    const targetLang = uiLang === 'ja' ? 'japonés' : 'español';
    const promptText =
      'Analiza este mensaje de intercambio de idiomas: "' +
      messageText +
      '". Explica en ' +
      targetLang +
      '. Devuelve ÚNICAMENTE JSON: { "translation": string, "reading": string, "grammarNotes": [{ "point": string, "explanation": string }] }';
    const raw = await generateSmart(promptText, { promptText });
    const parsed = extractJsonObject(raw);
    return {
      translation: parsed.translation || '',
      reading: parsed.reading || '',
      grammarNotes: Array.isArray(parsed.grammarNotes) ? parsed.grammarNotes : [],
    };
  },

  bridgeReplies: async (
    messageText: string,
    promptContext: string,
    uiLang: UiLanguage = 'es'
  ): Promise<{ suggestions: BridgeReplySuggestion[] }> => {
    const targetLang = uiLang === 'ja' ? 'japonés' : 'español';
    const promptText =
      'Contexto del tema: "' +
      promptContext +
      '". Mensaje recibido: "' +
      messageText +
      '". Sugiere 3 respuestas naturales (register: "simple", "standard", "colloquial") en el idioma opuesto al mensaje recibido, con traducción en ' +
      targetLang +
      '. Devuelve ÚNICAMENTE JSON: { "suggestions": [{ "register": "simple", "text": string, "reading": string, "gloss": string }] }';
    const raw = await generateSmart(promptText, { promptText });
    const parsed = extractJsonObject(raw);
    const list = Array.isArray(parsed.suggestions) ? parsed.suggestions : [];
    return {
      suggestions: list.map((s: any, idx: number) => ({
        register: s.register || (idx === 0 ? 'simple' : idx === 1 ? 'standard' : 'colloquial'),
        text: s.text || '',
        reading: s.reading || '',
        gloss: s.gloss || s.translation || '',
      })),
    };
  },

  adminTelemetry: async (): Promise<AdminTelemetryResponse> =>
    ({
      performance: {
        avgLatencyMs: 120,
        p95LatencyMs: 240,
        requestsLastHour: 1,
        errorRatePercent: 0,
        uptimeSeconds: 3600,
        memoryMb: 64,
      },
      latencySeries: [],
      recentRequests: [],
    }),

  adminExtractPdf: async (payload: {
    pdfBase64: string;
    mode: 'lesson' | 'dictionary';
    jlptLevel: JlptLevel;
    sourceName: string;
  }) => {
    const cleanPdf = payload.pdfBase64.replace('data:application/pdf;base64,', '');
    const raw = await generateSmart([
      { inlineData: { data: cleanPdf, mimeType: 'application/pdf' } },
      {
        text:
          'Extrae contenido educativo de japonés nivel ' +
          payload.jlptLevel +
          ' en modo ' +
          payload.mode +
          ' desde "' +
          payload.sourceName +
          '". Devuelve JSON estructurado.',
      },
    ]);
    return {
      mode: payload.mode,
      jlptLevel: payload.jlptLevel,
      sourceName: payload.sourceName,
      extracted: extractJsonObject(raw),
    };
  },
};

let currentAudio: HTMLAudioElement | null = null;

export function playBase64Audio(base64: string, mimeType = 'audio/wav'): Promise<void> {
  if (base64 === 'BROWSER_TTS' || mimeType === 'audio/browser-tts') {
    return speakJapaneseBrowser(lastSpokenText, lastPace, lastVoice);
  }
  return new Promise((resolve, reject) => {
    try {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
      }
      const audio = new Audio('data:' + mimeType + ';base64,' + base64);
      currentAudio = audio;
      audio.playbackRate = lastVoice === 'Zephyr' ? 1.06 : lastVoice === 'Puck' ? 0.94 : 1.0;
      audio.onended = () => resolve();
      audio.onerror = () => {
        speakJapaneseBrowser(lastSpokenText, lastPace, lastVoice).then(resolve).catch(reject);
      };
      audio.play().catch(() => {
        speakJapaneseBrowser(lastSpokenText, lastPace, lastVoice).then(resolve).catch(reject);
      });
    } catch (e) {
      reject(e);
    }
  });
}
