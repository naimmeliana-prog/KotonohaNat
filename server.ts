import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import { getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth, type DecodedIdToken } from 'firebase-admin/auth';
import fs from 'node:fs';
import path from 'node:path';
import { createServer as createViteServer } from 'vite';
import {
  bridgeExplainMessage,
  bridgeSuggestReplies,
  evaluateHandwriting,
  extractPdfResource,
  generateDailyPrompt,
  processOralTurn,
  synthesizeJapaneseSpeech,
  type JapaneseVoiceName,
} from './server/gemini.ts';
import type { JlptLevel, UiLanguage } from './src/types/kotonoha.ts';

const firebaseConfigPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, 'utf8')) as {
  projectId: string;
};

const adminApp = getApps().length
  ? getApp()
  : initializeApp({ projectId: firebaseConfig.projectId });
const adminAuth = getAuth(adminApp);

const app = express();
const PORT = 3000;
const SERVER_START = Date.now();
const ADMIN_EMAIL = 'faridmazari@gmail.com';
const VALID_LEVELS: JlptLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1'];

app.use(express.json({ limit: '16mb' }));

// Baseline security headers (iframe-safe)
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  next();
});

// Real-time in-memory ring buffer for server API telemetry (zero SQLite)
interface MetricPoint {
  id: number;
  endpoint: string;
  method: string;
  statusCode: number;
  latencyMs: number;
  createdAt: string;
  ts: number;
}

const metricsBuffer: MetricPoint[] = [];
let nextMetricId = 1;

app.use('/api', (req, res, next) => {
  const start = performance.now();
  res.on('finish', () => {
    const latency = Math.round((performance.now() - start) * 10) / 10;
    metricsBuffer.push({
      id: nextMetricId++,
      endpoint: req.path.slice(0, 120),
      method: req.method,
      statusCode: res.statusCode,
      latencyMs: latency,
      createdAt: new Date().toISOString(),
      ts: Date.now(),
    });
    if (metricsBuffer.length > 500) {
      metricsBuffer.shift();
    }
  });
  next();
});

interface AuthedRequest extends Request {
  firebaseUser?: DecodedIdToken;
}

async function requireFirebaseAdmin(req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Inicia sesión como administrador en Firebase para continuar.' });
    return;
  }
  const idToken = header.slice(7).trim();
  try {
    const decoded = await adminAuth.verifyIdToken(idToken);
    if (decoded.email !== ADMIN_EMAIL || decoded.email_verified !== true) {
      res.status(403).json({ error: 'Acceso restringido al administrador verificado.' });
      return;
    }
    req.firebaseUser = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Sesión de Firebase inválida o caducada.' });
  }
}

// ============================================================================
// AI ORAL TUTOR, REALISTIC TTS, HANDWRITING & EXCHANGE BRIDGE (Server-side Gemini)
// ============================================================================
app.post('/api/ai/tts', async (req, res) => {
  const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
  const voiceName: JapaneseVoiceName =
    req.body?.voiceName === 'Puck' || req.body?.voiceName === 'Zephyr' ? req.body.voiceName : 'Kore';
  const pace = req.body?.pace === 'slow' ? 'slow' : 'natural';

  if (!text) {
    res.status(400).json({ error: 'Falta el texto japonés para sintetizar.' });
    return;
  }

  try {
    const result = await synthesizeJapaneseSpeech(text, { voiceName, pace });
    res.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error al generar voz japonesa.';
    res.status(502).json({ error: msg });
  }
});

app.post('/api/ai/oral-turn', async (req, res) => {
  const { audioBase64, audioMimeType, userText, scenario, jlptLevel, voiceName, pace, history, uiLang } = req.body ?? {};
  if (!audioBase64 && (!userText || typeof userText !== 'string' || !userText.trim())) {
    res.status(400).json({ error: 'Graba tu voz o escribe una frase en japonés para practicar.' });
    return;
  }

  const cleanLevel: JlptLevel = VALID_LEVELS.includes(jlptLevel) ? jlptLevel : 'N5';
  const cleanVoice: JapaneseVoiceName =
    voiceName === 'Puck' || voiceName === 'Zephyr' ? voiceName : 'Kore';
  const cleanPace = pace === 'slow' ? 'slow' : 'natural';
  const cleanLang: UiLanguage = uiLang === 'ja' ? 'ja' : 'es';

  try {
    const turn = await processOralTurn({
      audioBase64: typeof audioBase64 === 'string' ? audioBase64 : undefined,
      audioMimeType: typeof audioMimeType === 'string' ? audioMimeType : undefined,
      userText: typeof userText === 'string' ? userText.slice(0, 400) : undefined,
      scenario: typeof scenario === 'string' ? scenario.slice(0, 120) : 'Cafetería en Tokio',
      jlptLevel: cleanLevel,
      voiceName: cleanVoice,
      pace: cleanPace,
      history: Array.isArray(history) ? history.slice(-8) : [],
      uiLang: cleanLang,
    });
    res.json(turn);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error en la sesión oral con IA.';
    res.status(502).json({ error: msg });
  }
});

app.post('/api/ai/evaluate-writing', async (req, res) => {
  const { targetCharacter, characterType, imageBase64, uiLang } = req.body ?? {};
  if (typeof targetCharacter !== 'string' || !targetCharacter.trim() || typeof imageBase64 !== 'string') {
    res.status(400).json({ error: 'Dibuja un carácter en el lienzo antes de evaluar.' });
    return;
  }

  const cleanType = characterType === 'katakana' || characterType === 'kanji' ? characterType : 'hiragana';
  const cleanLang: UiLanguage = uiLang === 'ja' ? 'ja' : 'es';

  try {
    const evaluation = await evaluateHandwriting(
      targetCharacter.trim().slice(0, 4),
      cleanType,
      imageBase64,
      cleanLang
    );
    res.json(evaluation);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error al evaluar el trazo.';
    res.status(502).json({ error: msg });
  }
});

app.post('/api/ai/generate-prompt', async (req, res) => {
  const cleanLang: UiLanguage = req.body?.uiLang === 'ja' ? 'ja' : 'es';
  try {
    const prompt = await generateDailyPrompt(cleanLang);
    res.json(prompt);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'No se pudo generar un nuevo tema de conversación.';
    res.status(502).json({ error: msg });
  }
});

app.post('/api/ai/bridge-explain', async (req, res) => {
  const messageText = typeof req.body?.messageText === 'string' ? req.body.messageText.trim() : '';
  const cleanLang: UiLanguage = req.body?.uiLang === 'ja' ? 'ja' : 'es';
  if (!messageText) {
    res.status(400).json({ error: 'Falta el mensaje para traducir y explicar.' });
    return;
  }
  try {
    const explanation = await bridgeExplainMessage(messageText, cleanLang);
    res.json(explanation);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'No se pudo analizar el mensaje con Gemini.';
    res.status(502).json({ error: msg });
  }
});

app.post('/api/ai/bridge-replies', async (req, res) => {
  const messageText = typeof req.body?.messageText === 'string' ? req.body.messageText.trim() : '';
  const promptContext = typeof req.body?.promptContext === 'string' ? req.body.promptContext.trim() : '';
  const cleanLang: UiLanguage = req.body?.uiLang === 'ja' ? 'ja' : 'es';
  if (!messageText) {
    res.status(400).json({ error: 'Falta el mensaje de contexto para sugerir respuestas.' });
    return;
  }
  try {
    const result = await bridgeSuggestReplies(messageText, promptContext, cleanLang);
    res.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'No se pudieron generar sugerencias de respuesta.';
    res.status(502).json({ error: msg });
  }
});

// ============================================================================
// ADMIN TELEMETRY & PDF RESOURCE EXTRACTION (Verified via Firebase ID Token)
// ============================================================================
app.get('/api/admin/telemetry', requireFirebaseAdmin, (_req, res) => {
  const oneHourAgo = Date.now() - 3600 * 1000;
  const recent = metricsBuffer.filter((m) => m.ts >= oneHourAgo);
  const latencies = recent.map((m) => m.latencyMs).sort((a, b) => a - b);
  const avgLatencyMs =
    latencies.length > 0 ? Math.round((latencies.reduce((s, v) => s + v, 0) / latencies.length) * 10) / 10 : 0;
  const p95LatencyMs =
    latencies.length > 0 ? latencies[Math.min(latencies.length - 1, Math.floor(latencies.length * 0.95))] : 0;
  const errorCount = recent.filter((m) => m.statusCode >= 500).length;
  const errorRatePercent = recent.length > 0 ? Math.round((errorCount / recent.length) * 1000) / 10 : 0;

  const bucketMap = new Map<string, { total: number; count: number }>();
  for (const m of recent) {
    const bucket = m.createdAt.slice(11, 16);
    const cur = bucketMap.get(bucket) || { total: 0, count: 0 };
    cur.total += m.latencyMs;
    cur.count += 1;
    bucketMap.set(bucket, cur);
  }
  const latencySeries = Array.from(bucketMap.entries())
    .slice(-24)
    .map(([bucket, val]) => ({
      bucket,
      avgMs: Math.round((val.total / val.count) * 10) / 10,
      requests: val.count,
    }));

  res.json({
    performance: {
      avgLatencyMs,
      p95LatencyMs,
      requestsLastHour: recent.length,
      errorRatePercent,
      uptimeSeconds: Math.round((Date.now() - SERVER_START) / 1000),
      memoryMb: Math.round(process.memoryUsage().rss / (1024 * 1024)),
    },
    latencySeries,
    recentRequests: [...recent].reverse().slice(0, 14),
  });
});

app.post('/api/admin/extract-pdf', requireFirebaseAdmin, async (req, res) => {
  const { pdfBase64, mode, jlptLevel, sourceName } = req.body ?? {};
  if (typeof pdfBase64 !== 'string' || pdfBase64.length < 100) {
    res.status(400).json({ error: 'Adjunta un archivo PDF válido.' });
    return;
  }
  const cleanMode = mode === 'dictionary' ? 'dictionary' : 'lesson';
  const cleanLevel: JlptLevel = VALID_LEVELS.includes(jlptLevel) ? jlptLevel : 'N5';
  const cleanSource =
    typeof sourceName === 'string' && sourceName.trim() ? sourceName.trim().slice(0, 120) : 'Recurso PDF importado';

  try {
    const extracted = await extractPdfResource(pdfBase64, cleanMode, cleanLevel, cleanSource);
    res.json({ mode: cleanMode, jlptLevel: cleanLevel, sourceName: cleanSource, extracted });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'No se pudo procesar el recurso PDF.';
    res.status(502).json({ error: msg });
  }
});

// ============================================================================
// VITE DEV MIDDLEWARE / PRODUCTION STATIC HOSTING
// ============================================================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kotonoha server listening on http://localhost:${PORT}`);
  });
}

startServer();
