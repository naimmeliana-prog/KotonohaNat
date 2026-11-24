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
  return new GoogleGenAI({ apiKey });
}

async function generateWithRetry(contents: any, retries = 2): Promise<string> {
  const ai = getAiClient();
  const models = ['gemini-3.8-flash', 'gemini-3.8-flash-lite', 'gemini-3.8-flash'];

  for (let i = 0; i <= retries; i++) {
    try {
      const res = await ai.models.generateContent({
        model: models[i] || 'gemini-3.8-flash',
        contents,
        config: { responseMimeType: 'application/json' },
      });
      return res.text || '{}';
    } catch (err: any) {
      const msg = String(err?.message || err);
      const isTemporary = msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('429');
      if (isTemporary && i < retries) {
        await new Promise((r) => setTimeout(r, 1200));
        continue;
      }
      throw new Error(
        isTemporary
          ? 'Los servidores de IA están muy ocupados ahora mismo. Inténtalo de nuevo en unos segundos.'
          : msg
      );
    }
  }
  return '{}';
}

function speakJapaneseBrowser(text: string, pace: 'slow' | 'natural' = 'natural'): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = pace === 'slow' ? 0.75 : 1.0;

    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find((v) => v.lang.includes('ja'));
    if (jaVoice) utterance.voice = jaVoice;

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
}

let lastSpokenText = '';
let lastPace: 'slow' | 'natural' = 'natural';

export const api = {
  synthesizeSpeech: async (
    text: string,
    _voiceName: 'Kore' | 'Puck' | 'Zephyr' = 'Kore',
    pace: 'slow' | 'natural' = 'natural'
  ) => {
    lastSpokenText = text;
    lastPace = pace;
    return { audioBase64: 'BROWSER_TTS', mimeType: 'audio/browser-tts' };
  },

  sendOralTurn: async (payload: {
    audioBase64?: string;
    audioMimeType?: string;
    userText?: string;
    scenario: string;
    jlptLevel: JlptLevel;
    voiceName: 'Kore' | 'Puck' | 'Zephyr';
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
    return speakJapaneseBrowser(lastSpokenText, lastPace);
  }
  return new Promise((resolve, reject) => {
    try {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
      }
      const audio = new Audio(`data:${mimeType};base64,${base64}`);
      currentAudio = audio;
      audio.onended = () => resolve();
      audio.onerror = () => reject(new Error('No se pudo reproducir el audio.'));
      audio.play().catch(reject);
    } catch (e) {
      reject(e);
    }
  });
}
