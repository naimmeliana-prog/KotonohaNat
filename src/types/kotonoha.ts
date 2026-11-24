export type JlptLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export interface GrammarPoint {
  pattern: string;
  reading: string;
  meaning: string;
  explanation: string;
  formation: string;
  examples: {
    ja: string;
    reading: string;
    romaji: string;
    es: string;
  }[];
}

export interface VocabItem {
  word: string;
  reading: string;
  romaji: string;
  meaning: string;
  pos: string;
  exampleJa?: string;
  exampleEs?: string;
}

export interface KanjiItem {
  character: string;
  meaning: string;
  onyomi: string;
  kunyomi: string;
  strokes: number;
  mnemonic: string;
  compounds: string[];
}

export interface DialogueLine {
  speaker: string;
  ja: string;
  reading: string;
  romaji: string;
  es: string;
}

export interface ExerciseQuestion {
  id: string;
  type: 'choice' | 'fill' | 'translate';
  prompt: string;
  promptJa?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  level: JlptLevel;
  unitNumber: number;
  title: string;
  subtitle: string;
  sourceBook: string;
  grammarPoints: GrammarPoint[];
  vocabulary: VocabItem[];
  kanjiList: KanjiItem[];
  dialogue: DialogueLine[];
  exercises: ExerciseQuestion[];
  unitExam: ExerciseQuestion[];
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface DictionaryEntry {
  id: string;
  word: string;
  reading: string;
  romaji: string;
  meaningEs: string;
  partOfSpeech: string;
  jlptLevel: JlptLevel;
  exampleJa: string;
  exampleReading: string;
  exampleEs: string;
  dictionarySource: string;
  tags: string[];
  published?: boolean;
}

export interface SrsCard {
  id: string;
  userId: string;
  cardType: 'vocab' | 'kanji' | 'grammar';
  front: string;
  reading: string;
  back: string;
  hint: string;
  jlptLevel: JlptLevel;
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  nextReviewAt: string;
  lastReviewedAt: string | null;
  correctCount: number;
  wrongCount: number;
}

export type UiLanguage = 'es' | 'ja';
export type ExchangeLevel = 'beginner' | 'intermediate' | 'advanced';
export type ExchangeInterest =
  | 'anime_manga'
  | 'travel'
  | 'gastronomy'
  | 'music'
  | 'culture'
  | 'daily_life';

export interface AuthUser {
  uid: string;
  username: string;
  nativeLang: 'es' | 'ja' | 'other';
  learningLang?: 'es' | 'ja';
  learningLevel?: ExchangeLevel;
  interests?: string[];
  jlptLevel: JlptLevel;
  bio: string;
  role: 'student' | 'native_partner' | 'admin';
  isAdmin: boolean;
  xp: number;
  streakDays: number;
  lastStudyDate: string | null;
  createdAt: string;
}

export interface DailyPrompt {
  id: string;
  promptEs: string;
  promptJa: string;
  topicTag: string;
  authorUid: string;
  isAiGenerated: boolean;
  responsesCount: number;
  createdAt: string;
}

export interface ResponseCorrection {
  id: string;
  responseId: string;
  authorUid: string;
  authorUsername: string;
  authorNativeLang: string;
  kind: 'correction' | 'reply';
  correctedText?: string;
  comment: string;
  createdAt: string;
}

export interface ExchangeResponse {
  id: string;
  promptId: string;
  authorUid: string;
  authorUsername: string;
  authorNativeLang: string;
  targetLang: 'es' | 'ja';
  authorLevel: ExchangeLevel;
  content: string;
  correctionsCount: number;
  createdAt: string;
  corrections?: ResponseCorrection[];
}

export interface BridgeExplanation {
  translation: string;
  reading: string;
  grammarNotes: {
    point: string;
    explanation: string;
  }[];
}

export interface BridgeReplySuggestion {
  register: 'simple' | 'standard' | 'colloquial';
  text: string;
  reading: string;
  gloss: string;
}

export interface DailyProgressPoint {
  date: string;
  label: string;
  xp: number;
  minutes: number;
  accuracy: number;
  sessions: number;
}

export interface UserDashboardStats {
  xp: number;
  streakDays: number;
  dueCards: number;
  totalCards: number;
  masteredCards: number;
  completedUnits: number;
  totalUnits: number;
  weeklyAccuracy: number;
  todayMinutes: number;
  dailySeries: DailyProgressPoint[];
  completedLessonIds: string[];
  recentActivities: {
    id: string;
    activityType: string;
    score: number;
    xpEarned: number;
    details: string;
    createdAt: string;
  }[];
}

export interface ForumReply {
  id: string;
  postId: string;
  authorUid: string;
  authorUsername: string;
  authorNativeLang: string;
  content: string;
  createdAt: string;
}

export interface ForumPost {
  id: string;
  authorUid: string;
  authorUsername: string;
  authorRole: string;
  authorNativeLang: string;
  category: 'gramatica' | 'pronunciacion' | 'intercambio' | 'cultura' | 'recursos';
  title: string;
  content: string;
  jlptLevel: JlptLevel;
  likesCount: number;
  repliesCount: number;
  createdAt: string;
  replies?: ForumReply[];
}

export interface ChatMessage {
  id: string;
  room: 'general' | 'intercambio-es-ja' | 'principiantes-n5' | 'practica-oral';
  authorUid: string;
  authorUsername: string;
  authorNativeLang: string;
  content: string;
  translationHint: string;
  createdAt: string;
}

export interface OralPronunciationDetail {
  aspect: string;
  status: 'correcto' | 'mejorable';
  feedback: string;
}

export interface OralTurnResponse {
  userTranscriptJa: string;
  userTranscriptReading: string;
  userMeaningEs: string;
  pronunciationScore: number;
  pronunciationSummary: string;
  pronunciationDetails: OralPronunciationDetail[];
  correctedJapanese: string;
  senseiReplyJa: string;
  senseiReplyReading: string;
  senseiReplyRomaji: string;
  senseiReplyEs: string;
  audioBase64: string | null;
  audioMimeType: string | null;
}

export interface WritingEvaluation {
  score: number;
  verdict: string;
  strokeFeedback: string[];
  encouragement: string;
}

export interface AdminTelemetryResponse {
  performance: {
    avgLatencyMs: number;
    p95LatencyMs: number;
    requestsLastHour: number;
    errorRatePercent: number;
    uptimeSeconds: number;
    memoryMb: number;
  };
  latencySeries: {
    bucket: string;
    avgMs: number;
    requests: number;
  }[];
  recentRequests: {
    id: number;
    endpoint: string;
    method: string;
    statusCode: number;
    latencyMs: number;
    createdAt: string;
  }[];
}
