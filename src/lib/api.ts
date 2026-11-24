import type {
  AdminTelemetryResponse,
  BridgeExplanation,
  BridgeReplySuggestion,
  JlptLevel,
  OralTurnResponse,
  UiLanguage,
  WritingEvaluation,
} from '../types/kotonoha';
import { auth } from './firebase';

async function serverRequest<T>(url: string, options: RequestInit = {}, includeIdToken = false): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (includeIdToken && auth.currentUser) {
    const token = await auth.currentUser.getIdToken();
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Error de servidor (${res.status})`);
  }
  return data as T;
}

export const api = {
  synthesizeSpeech: (text: string, voiceName: 'Kore' | 'Puck' | 'Zephyr' = 'Kore', pace: 'slow' | 'natural' = 'natural') =>
    serverRequest<{ audioBase64: string; mimeType: string }>('/api/ai/tts', {
      method: 'POST',
      body: JSON.stringify({ text, voiceName, pace }),
    }),

  sendOralTurn: (payload: {
    audioBase64?: string;
    audioMimeType?: string;
    userText?: string;
    scenario: string;
    jlptLevel: JlptLevel;
    voiceName: 'Kore' | 'Puck' | 'Zephyr';
    pace: 'slow' | 'natural';
    history: { role: 'user' | 'sensei'; text: string }[];
    uiLang?: UiLanguage;
  }) => serverRequest<OralTurnResponse>('/api/ai/oral-turn', { method: 'POST', body: JSON.stringify(payload) }),

  evaluateWriting: (payload: {
    targetCharacter: string;
    characterType: 'hiragana' | 'katakana' | 'kanji';
    imageBase64: string;
    uiLang?: UiLanguage;
  }) => serverRequest<WritingEvaluation>('/api/ai/evaluate-writing', { method: 'POST', body: JSON.stringify(payload) }),

  generateDailyPrompt: (uiLang: UiLanguage = 'es') =>
    serverRequest<{ promptEs: string; promptJa: string; topicTag: string }>('/api/ai/generate-prompt', {
      method: 'POST',
      body: JSON.stringify({ uiLang }),
    }),

  bridgeExplain: (messageText: string, uiLang: UiLanguage = 'es') =>
    serverRequest<BridgeExplanation>('/api/ai/bridge-explain', {
      method: 'POST',
      body: JSON.stringify({ messageText, uiLang }),
    }),

  bridgeReplies: (messageText: string, promptContext: string, uiLang: UiLanguage = 'es') =>
    serverRequest<{ suggestions: BridgeReplySuggestion[] }>('/api/ai/bridge-replies', {
      method: 'POST',
      body: JSON.stringify({ messageText, promptContext, uiLang }),
    }),

  adminTelemetry: () => serverRequest<AdminTelemetryResponse>('/api/admin/telemetry', {}, true),

  adminExtractPdf: (payload: {
    pdfBase64: string;
    mode: 'lesson' | 'dictionary';
    jlptLevel: JlptLevel;
    sourceName: string;
  }) =>
    serverRequest<{
      mode: 'lesson' | 'dictionary';
      jlptLevel: JlptLevel;
      sourceName: string;
      extracted: Record<string, unknown>;
    }>('/api/admin/extract-pdf', { method: 'POST', body: JSON.stringify(payload) }, true),
};

let currentAudio: HTMLAudioElement | null = null;

export function playBase64Audio(base64: string, mimeType = 'audio/wav'): Promise<void> {
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
