import { GoogleGenAI } from '@google/genai';
import type {
  AdminTelemetryResponse,
  BridgeExplanation,
  BridgeReplySuggestion,
  JlptLevel,
  OralTurnResponse,
  UiLanguage,
  WritingEvaluation,
} from '../types/kotonoha';

function getAiClient() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Falta configurar VITE_GEMINI_API_KEY en las variables de entorno de Vercel.');
  }
  return new GoogleGenAI({ apiKey, apiVersion: 'v1beta' });
}

async function generateWithRetry(contents: any): Promise<string> {
  const ai = getAiClient();
  // Rota entre distintos modelos gratuitos si alguno devuelve 503 (saturado) o 404
  const candidateModels = [
    'gemini-3.8-flash',
    'gemini-2.5-pro',
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
  ];

  let lastError = 'No se pudo conectar con la IA.';

  for (const modelName of candidateModels) {
    try {
      const res = await ai.models.generateContent({
        model: modelName,
        contents,
        config: { responseMimeType: 'application/json' },
      });
      if (res.text) return res.text;
    } catch (err: any) {
      const msg = String(err?.message || err);
      lastError = msg;
      const shouldFallback =
        msg.includes('503') ||
        msg.includes('UNAVAILABLE') ||
        msg.includes('429') ||
        msg.includes('404') ||
        msg.includes('NOT_FOUND');

      if (shouldFallback) {
        await new Promise((r) => setTimeout(r, 600));
        continue;
      }
      throw new Error(msg);
    }
  }

  throw new Error(
    `Los servidores gratuitos de IA están saturados ahora mismo. Inténtalo de nuevo en unos segundos. (${lastError.slice(0, 80)})`
  );
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
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

    const voices = window.speechSynthesis.getVoices();
    const jaVoices = voices.filter((v) => v.lang.toLowerCase().includes('ja'));

    const femaleVoice =
      jaVoices.find((v) => /nanami|kyoko|haruka|ayumi|sayaka|google/i.test(v.name)) ||
      jaVoices;
    const maleVoice =
      jaVoices.find((v) => /keita|otoya|ichiro|takumi|male/i.test(v.name)) ||
      jaVoices[1] ||
      jaVoices;

    const baseRate = pace === 'slow' ? 0.78 : 1.0;

    // Diferencia timbre y velocidad entre Haruka (Kore), Kenji (Puck) y Aoi (Zephyr)
    if (voiceProfile === 'Puck') {
      // Kenji (voz masculina / más grave)
      if (maleVoice) utterance.voice = maleVoice;
      utterance.pitch = maleVoice && /keita|otoya|ichiro/i.test(maleVoice.name) ? 0.95 : 0.72;
      utterance.rate = baseRate * 0.96;
    } else if (voiceProfile === 'Zephyr') {
      // Aoi (voz juvenil / más aguda y viva)
      if (femaleVoice) utterance.voice = femaleVoice;
      utterance.pitch = 1.22;
      utterance.rate = baseRate * 1.05;
    } else {
      // Haruka (Kore - voz femenina estándar y pausada)
      if (femaleVoice) utterance.voice = femaleVoice;
      utterance.pitch = 1.0;
      utterance.rate = baseRate;
    }

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

    const prompt = `Eres un profesor nativo de japonés (Sensei) amable. Escenario: "${payload.scenario}". Nivel del estudiante: ${payload.jlptLevel}.
Historial reciente: ${JSON.stringify(payload.history.slice(-6))}
${payload.userText ? `El estudiante escribió: "${payload.userText}"` : 'El estudiante envió un audio. Transcríbelo en japonés y evalúa su pronunciación y naturalidad.'}

Responde ÚNICAMENTE en JSON válido con esta estructura exacta:
{
  "userTranscriptJa": "lo que dijo el usuario en japonés",
  "userTranscriptReading": "lectura en hiragana",
  "userMeaningEs": "traducción al ${explanationLang}",
  "pronunciationScore": 85,
  "feedbackEs": "consejo breve y amable en ${explanationLang}",
  "correctedJa": "forma más natural de decirlo en japonés (o la misma si ya es perfecta)",
  "senseiReplyJa": "tu respuesta en japonés para continuar la conversación según el nivel ${payload.jlptLevel}",
  "senseiReplyReading": "lectura en hiragana de tu respuesta",
  "senseiReplyRomaji": "romaji de tu respuesta",
  "senseiReplyEs": "traducción de tu respuesta al ${explanationLang}"
}`;

    const parts: any[] = [{ text: prompt }];
    if (payload.audioBase64 && payload.audioMimeType) {
      parts.unshift({
        inlineData: {
          data: payload.audioBase64,
          mimeType: payload.audioMimeType,
        },
      });
    }

    const raw = await generateWithRetry(parts);
    const parsed = JSON.parse(raw);
    lastSpokenText = parsed.senseiReplyJa || '';
    lastPace = payload.pace;
    lastVoice = payload.voiceName;

    return {
      ...parsed,
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
    const cleanBase64 = payload.imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const raw = await generateWithRetry([
      { inlineData: { data: cleanBase64, mimeType: 'image/png' } },
      {
        text: `Evalúa este trazo manuscrito del carácter ${payload.characterType} "${payload.targetCharacter}". Responde en ${langText} en JSON con: { "score": number (0-100), "isCorrect": boolean, "feedback": string, "tips": string[] }`,
      },
    ]);

    return JSON.parse(raw);
  },

  generateDailyPrompt: async (uiLang: UiLanguage = 'es') => {
    const raw = await generateWithRetry(
      `Genera una pregunta diaria interesante para intercambio cultural entre hispanohablantes y japoneses (idioma UI: ${uiLang}). Devuelve JSON: { "promptEs": string, "promptJa": string, "topicTag": string }`
    );
    return JSON.parse(raw);
  },

  bridgeExplain: async (messageText: string, uiLang: UiLanguage = 'es'): Promise<BridgeExplanation> => {
    const targetLang = uiLang === 'ja' ? 'japonés' : 'español';
    const raw = await generateWithRetry(
      `Analiza este mensaje de intercambio de idiomas: "${messageText}". Explica en ${targetLang}. Devuelve JSON: { "translation": string, "reading": string, "grammarNotes": [{ "point": string, "explanation": string }] }`
    );
    return JSON.parse(raw);
  },

  bridgeReplies: async (
    messageText: string,
    promptContext: string,
    uiLang: UiLanguage = 'es'
  ): Promise<{ suggestions: BridgeReplySuggestion[] }> => {
    const targetLang = uiLang === 'ja' ? 'japonés' : 'español';
    const raw = await generateWithRetry(
      `Contexto del tema: "${promptContext}". Mensaje recibido: "${messageText}". Sugiere 3 respuestas naturales (sencilla, estándar, coloquial) en el idioma opuesto al mensaje recibido, con traducción en ${targetLang}. Devuelve JSON: { "suggestions": [{ "tone": string, "text": string, "reading": string, "translation": string }] }`
    );
    return JSON.parse(raw);
  },

  adminTelemetry: async (): Promise<AdminTelemetryResponse> =>
    ({
      status: 'ok',
      activeUsers: 1,
      totalLessons: 0,
      totalDictionaryEntries: 0,
      serverMode: 'client-serverless',
    }) as unknown as AdminTelemetryResponse,

  adminExtractPdf: async (payload: {
    pdfBase64: string;
    mode: 'lesson' | 'dictionary';
    jlptLevel: JlptLevel;
    sourceName: string;
  }) => {
    const cleanPdf = payload.pdfBase64.replace(/^data:application\/pdf;base64,/, '');
    const raw = await generateWithRetry([
      { inlineData: { data: cleanPdf, mimeType: 'application/pdf' } },
      {
        text: `Extrae contenido educativo de japonés nivel ${payload.jlptLevel} en modo ${payload.mode} desde "${payload.sourceName}". Devuelve JSON estructurado.`,
      },
    ]);
    return {
      mode: payload.mode,
      jlptLevel: payload.jlptLevel,
      sourceName: payload.sourceName,
      extracted: JSON.parse(raw),
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
