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
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey, apiVersion: 'v1beta' });
}

function extractJsonObject(rawText: string): any {
  const cleaned = rawText.replace(/```json|```/g, '').trim();
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
  }
  return JSON.parse(cleaned);
}

async function callOpenRouter(promptText: string, imageBase64?: string): Promise<string | null> {
  const orKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!orKey) return null;

  const content: any[] = [{ type: 'text', text: promptText }];
  if (imageBase64) {
    content.push({
      type: 'image_url',
      image_url: { url: 'data:image/png;base64,' + imageBase64 },
    });
  }

  try {
    const endpoint = 'https://openrouter.ai' + '/api/v1/chat/completions';
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + orKey,
        'Content-Type': 'application/json',
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://vercel.app',
        'X-Title': 'Kotonoha Japonés',
      },
      body: JSON.stringify({
        model: 'openrouter/free',
        messages: [{ role: 'user', content }],
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const firstChoice = Array.isArray(data?.choices) ? data.choices.at(0) : null;
    return firstChoice?.message?.content || null;
  } catch {
    return null;
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
          'Has alcanzado el límite gratuito por minuto de Gemini. Espera 30 segundos o escribe tu respuesta en texto.'
        );
      }
      throw new Error(msg);
    }
  }

  throw new Error('No se obtuvo respuesta de la IA. Inténtalo de nuevo en unos segundos.');
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

    const naturalFemale =
      jaVoices.find((v) => /nanami|kyoko|haruka|ayumi|sayaka|google/i.test(v.name)) ||
      jaVoices.at(0);
    const naturalMale =
      jaVoices.find((v) => /keita|otoya|ichiro|takumi|male/i.test(v.name)) ||
      jaVoices.at(1) ||
      naturalFemale;

    const baseRate = pace === 'slow' ? 0.78 : 1.0;

    if (voiceProfile === 'Puck') {
      if (naturalMale) utterance.voice = naturalMale;
      utterance.pitch = naturalMale && /keita|otoya|ichiro/i.test(naturalMale.name) ? 0.96 : 0.76;
      utterance.rate = baseRate * 0.96;
    } else if (voiceProfile === 'Zephyr') {
      if (naturalFemale) utterance.voice = naturalFemale;
      utterance.pitch = 1.18;
      utterance.rate = baseRate * 1.04;
    } else {
      if (naturalFemale) utterance.voice = naturalFemale;
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

    const prompt =
      'Eres un profesor nativo de japonés (Sensei) amable. Escenario: "' +
      payload.scenario +
      '". Nivel del estudiante: ' +
      payload.jlptLevel +
      '. Historial reciente: ' +
      JSON.stringify(payload.history.slice(-6)) +
      '. ' +
      (payload.userText
        ? 'El estudiante escribió: "' + payload.userText + '"'
        : 'El estudiante envió un audio. Transcríbelo en japonés y evalúa su pronunciación y naturalidad.') +
      ' Responde ÚNICAMENTE en JSON válido con esta estructura exacta: { "userTranscriptJa": "lo que dijo el usuario en japonés", "userTranscriptReading": "lectura en hiragana", "userMeaningEs": "traducción al ' +
      explanationLang +
      '", "pronunciationScore": 85, "feedbackEs": "consejo breve y amable en ' +
      explanationLang +
      '", "correctedJa": "forma más natural de decirlo en japonés", "senseiReplyJa": "tu respuesta en japonés para continuar la conversación según el nivel ' +
      payload.jlptLevel +
      '", "senseiReplyReading": "lectura en hiragana de tu respuesta", "senseiReplyRomaji": "romaji de tu respuesta", "senseiReplyEs": "traducción de tu respuesta al ' +
      explanationLang +
      '" }';

    const parts: any[] = [{ text: prompt }];
    if (payload.audioBase64 && payload.audioMimeType) {
      const cleanMime = String(payload.audioMimeType).split(';').at(0)?.trim() || 'audio/webm';
      parts.unshift({
        inlineData: {
          data: payload.audioBase64,
          mimeType: cleanMime,
        },
      });
    }

    const raw = await generateSmart(parts, payload.userText ? { promptText: prompt } : undefined);
    const parsed = extractJsonObject(raw);
    lastSpokenText = parsed.senseiReplyJa || '';
    lastPace = payload.pace;
    lastVoice = payload.voiceName;

    return {
      userTranscriptJa: parsed.userTranscriptJa || payload.userText || '...',
      userTranscriptReading: parsed.userTranscriptReading || '',
      userMeaningEs: parsed.userMeaningEs || '',
      pronunciationScore: Number(parsed.pronunciationScore) || 85,
      feedbackEs: parsed.feedbackEs || '',
      correctedJa: parsed.correctedJa || parsed.userTranscriptJa || '',
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
      ' con esta estructura exacta: { "score": 85, "isCorrect": true, "feedback": "comentario breve", "tips": ["consejo 1", "consejo 2"] }';

    const raw = await generateSmart(
      [
        { inlineData: { data: cleanBase64, mimeType: 'image/png' } },
        { text: promptText },
      ],
      { promptText, imageBase64: cleanBase64 }
    );

    const parsed = extractJsonObject(raw);
    const safeTips = Array.isArray(parsed.tips)
      ? parsed.tips
      : Array.isArray(parsed.improvements)
        ? parsed.improvements
        : Array.isArray(parsed.suggestions)
          ? parsed.suggestions
          : ['Mantén las proporciones equilibradas dentro del recuadro.'];

    return {
      score: typeof parsed.score === 'number' ? parsed.score : 82,
      isCorrect: typeof parsed.isCorrect === 'boolean' ? parsed.isCorrect : true,
      feedback: parsed.feedback || 'Buen trabajo con el carácter ' + payload.targetCharacter + '.',
      tips: safeTips,
      improvements: safeTips,
      suggestions: safeTips,
      strokeOrderTips: safeTips,
    } as unknown as WritingEvaluation;
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
      '". Sugiere 3 respuestas naturales (sencilla, estándar, coloquial) en el idioma opuesto al mensaje recibido, con traducción en ' +
      targetLang +
      '. Devuelve ÚNICAMENTE JSON: { "suggestions": [{ "tone": string, "text": string, "reading": string, "translation": string }] }';
    const raw = await generateSmart(promptText, { promptText });
    const parsed = extractJsonObject(raw);
    return {
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
    };
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
