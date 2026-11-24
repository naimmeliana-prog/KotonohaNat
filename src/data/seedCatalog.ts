import { SEED_DICTIONARY, SEED_LESSONS, STARTER_SRS_CARDS } from '../../server/seedData';
import type { DailyPrompt, DictionaryEntry, Lesson, SrsCard } from '../types/kotonoha';

export { SEED_DICTIONARY, SEED_LESSONS, STARTER_SRS_CARDS };

export const FALLBACK_LESSONS: Lesson[] = SEED_LESSONS.map((l, idx) => ({
  id: `seed-${l.level.toLowerCase()}-${l.unitNumber}-${idx + 1}`,
  ...l,
  published: true,
}));

export const FALLBACK_DICTIONARY: DictionaryEntry[] = SEED_DICTIONARY.map((d, idx) => ({
  id: `seed-dict-${idx + 1}`,
  ...d,
  published: true,
}));

export const SEED_DAILY_PROMPTS: DailyPrompt[] = [
  {
    id: 'seed_prompt_1',
    promptEs: '¿Qué comida típica de tu país recomiendas probar al menos una vez y por qué?',
    promptJa: 'あなたの国のどんな郷土料理をおすすめしますか？その理由も教えてください。',
    topicTag: 'gastronomy',
    authorUid: 'kotonoha_system',
    isAiGenerated: false,
    responsesCount: 0,
    createdAt: '2026-11-20T09:00:00.000Z',
  },
  {
    id: 'seed_prompt_2',
    promptEs: '¿Cómo es un fin de semana ideal en tu ciudad o barrio?',
    promptJa: 'あなたの街や近所での理想的な週末の過ごし方はどんな感じですか？',
    topicTag: 'daily_life',
    authorUid: 'kotonoha_system',
    isAiGenerated: false,
    responsesCount: 0,
    createdAt: '2026-11-21T09:00:00.000Z',
  },
  {
    id: 'seed_prompt_3',
    promptEs: '¿Qué canción, película, anime o libro en tu idioma recomendarías a alguien que lo está aprendiendo?',
    promptJa: 'あなたの母語を学んでいる人に、どんな音楽・映画・アニメ・本をおすすめしますか？',
    topicTag: 'culture',
    authorUid: 'kotonoha_system',
    isAiGenerated: false,
    responsesCount: 0,
    createdAt: '2026-11-22T09:00:00.000Z',
  },
];

export function buildGuestSrsCards(): SrsCard[] {
  const now = new Date().toISOString();
  return STARTER_SRS_CARDS.map((c, idx) => ({
    id: `guest-${idx + 1}`,
    userId: 'guest',
    ...c,
    easeFactor: 2.5,
    intervalDays: 0,
    repetitions: 0,
    nextReviewAt: now,
    lastReviewedAt: null,
    correctCount: 0,
    wrongCount: 0,
  }));
}
