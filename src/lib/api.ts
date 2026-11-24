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

function extractJsonObject(rawText: string): any {
  const cleaned = rawText.replace(/```json|```/g, '').trim();
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
  }
  return JSON.parse(cleaned);
}

async function callOpenRouterFallback(promptText: string, imageBase64?: string): Promise<string | null> {
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
    const res = await fetch('https://openrouter.ai', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + orKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: imageBase64 ? 'google/gemma-3-27b-it:free' : 'meta-llama/llama-3.3-70b-instruct:free',
        messages: [{ role: 'user', content }],
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const firstChoice = Array.isArray(data?.choices) ? data.choices : null;
    return firstChoice?.message?.content || null;
  } catch {
    return null;
  }
}

async function generateWithRetry(
  contents: any,
  fallbackInfo?: { promptText: string; imageBase64?: string }
): Promise<string> {
  const ai = getAiClient();

  for (let i = 0; i < 3; i++) {
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
      if (isBusy && i < 2) {
        await new Promise((r) => setTimeout(r, 1200 * (i + 1)));
        continue;
      }
      if (!isBusy) {
        throw new Error(msg);
      }
    }
  }

  if (fallbackInfo) {
    const orResult = await callOpenRouterFallback(fallbackInfo.promptText, fallbackInfo.imageBase64);
    if (orResult) return orResult;
  }

  throw new Error(
    'Los servidores gratuitos de IA están saturados ahora mismo. Inténtalo de nuevo en unos segundos.'
  );
}

function pcmBase64ToWavBase64(pcmBase64: string, sampleRate = 24000): string {
  const binary = atob(pcmBase64);
  const pcmLength = binary.length;
  const wavBuffer = new ArrayBuffer(44 + pcmLength);
  const view = new DataView(wavBuffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + pcmLength, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, pcmLength, true);

  const bytes = new Uint8Array(wavBuffer, 44);
  for (let i = 0; i < pcmLength; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  let wavBinary = '';
  const fullBytes = new Uint8Array(wavBuffer);
  for (let i = 0; i < fullBytes.length; i++) {
    wavBinary += String.fromCharCode(fullBytes[i]);
  }
  return btoa(wavBinary);
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
      jaVoices ||
      jaVoices;

    const baseRate = pace === 'slow' ? 0.78 : 1.0;

    if (voiceProfile === 'Puck') {
      if (maleVoice) utterance.voice = maleVoice;
      utterance.pitch = maleVoice && /keita|otoya|ichiro/i.test(maleVoice.name) ? 0.95 : 0.74;
      utterance.rate = baseRate * 0.96;
    } else if (voiceProfile === 'Zephyr') {
      if (femaleVoice) utterance.voice = femaleVoice;
      utterance.pitch = 1.2;
      utterance.rate = baseRate * 1.04;
    } else {
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
let ttsBlockedUntil = 0;

export const api = {
  synthesizeSpeech: async (
    text: string,
    voiceName: VoiceProfile = 'Kore',
    pace: 'slow' | 'natural' = 'natural'
  ) => {
    lastSpokenText = text;
    lastPace = pace;
    lastVoice = voiceName;

    if (Date.now() < ttsBlockedUntil) {
      return { audioBase64: 'BROWSER_TTS', mimeType: 'audio/browser-tts' };
    }

    try {
      const ai = getAiClient();
      const stylePrompt =
        pace === 'slow'
          ? 'Lee en japonés de forma clara, amable y ligeramente pausada para un estudiante: '
          : 'Lee en japonés con entonación natural y expresiva: ';
      const res = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-tts',
        contents: [{ parts: [{ text: stylePrompt + text }] }],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
          },
        },
      });
      const firstCandidate = Array.isArray(res.candidates) ? res.candidates : null;
      const firstPart = Array.isArray(firstCandidate?.content?.parts) ? firstCandidate.content.parts : null;
      const inlineData = firstPart?.inlineData;

      if (inlineData?.data) {
        const mime = inlineData.mimeType || 'audio/L16;rate=24000';
        if (mime.includes('L16') || mime.includes('pcm')) {
          const rateMatch = mime.match(/rate=(\d+)/);
          const rate = rateMatch ? Number(rateMatch) : 24000;
          return {
            audioBase64: pcmBase64ToWavBase64(inlineData.data, rate),
            mimeType: 'audio/wav',
          };
        }
        return {
          audioBase64: inlineData.data,
          mimeType: mime,
        };
      }
    } catch (err: any) {
      const msg = String(err?.message || err);
      if (msg.includes('429')) {
        // Pausa las llamadas a Gemini TTS durante 60 segundos si se alcanza el límite gratuito
        ttsBlockedUntil = Date.now() + 60000;
      }
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
      '", "correctedJa": "forma más natural de decirlo en japonés (o la misma si ya es perfecta)", "senseiReplyJa": "tu respuesta en japonés para continuar la conversación según el nivel ' +
      payload.jlptLevel +
      '", "senseiReplyReading": "lectura en hiragana de tu respuesta", "senseiReplyRomaji": "romaji de tu respuesta", "senseiReplyEs": "traducción de tu respuesta al ' +
      explanationLang +
      '" }';

    const parts: any[] = [{ text: prompt }];
if (payload.audioBase64 && payload.audioMimeType) {
const mimeParts = String(payload.audioMimeType).split(';');
const cleanMime = (mimeParts || 'audio/webm').trim();
parts.unshift({
inlineData: {
data: payload.audioBase64,
mimeType: cleanMime,
},
});
}
const raw = await generateWithRetry(parts, payload.userText ? { promptText: prompt } : undefined);
const parsed = extractJsonObject(raw);
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
}): Promise => {
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
' con: { "score": number (0-100), "isCorrect": boolean, "feedback": string, "tips": string[] }';
const raw = await generateWithRetry(
[
{ inlineData: { data: cleanBase64, mimeType: 'image/png' } },
{ text: promptText },
],
{ promptText, imageBase64: cleanBase64 }
);
return extractJsonObject(raw);
},
generateDailyPrompt: async (uiLang: UiLanguage = 'es') => {
const promptText =
'Genera una pregunta diaria interesante para intercambio cultural entre hispanohablantes y japoneses (idioma UI: ' +
uiLang +
'). Devuelve ÚNICAMENTE JSON: { "promptEs": string, "promptJa": string, "topicTag": string }';
const raw = await generateWithRetry(promptText, { promptText });
return extractJsonObject(raw);
},
bridgeExplain: async (messageText: string, uiLang: UiLanguage = 'es'): Promise => {
const targetLang = uiLang === 'ja' ? 'japonés' : 'español';
const promptText =
'Analiza este mensaje de intercambio de idiomas: "' +
messageText +
'". Explica en ' +
targetLang +
'. Devuelve ÚNICAMENTE JSON: { "translation": string, "reading": string, "grammarNotes": [{ "point": string, "explanation": string }] }';
const raw = await generateWithRetry(promptText, { promptText });
return extractJsonObject(raw);
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
const raw = await generateWithRetry(promptText, { promptText });
return extractJsonObject(raw);
},
adminTelemetry: async (): Promise =>
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
const raw = await generateWithRetry([
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
export function playBase64Audio(base64: string, mimeType = 'audio/wav'): Promise {
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
