import {
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  increment,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
  type Unsubscribe,
} from 'firebase/firestore';
import {
  FALLBACK_DICTIONARY,
  FALLBACK_LESSONS,
  SEED_DAILY_PROMPTS,
  SEED_DICTIONARY,
  SEED_LESSONS,
  STARTER_SRS_CARDS,
} from '../data/seedCatalog';
import type {
  AuthUser,
  ChatMessage,
  DailyProgressPoint,
  DailyPrompt,
  DictionaryEntry,
  ExchangeLevel,
  ExchangeResponse,
  ForumPost,
  ForumReply,
  JlptLevel,
  Lesson,
  ResponseCorrection,
  SrsCard,
  UiLanguage,
  UserDashboardStats,
} from '../types/kotonoha';
import { ADMIN_EMAIL, db, handleFirestoreError, OperationType } from './firebase';

function tsToIso(val: unknown): string {
  if (val instanceof Timestamp) return val.toDate().toISOString();
  if (typeof val === 'string') return val;
  return new Date().toISOString();
}

function makeDocId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now()}_${rand}`;
}

export function sanitizeUsername(raw: string): string {
  const cleaned = raw.replace(/[^a-zA-Z0-9_\-]/g, '_').slice(0, 24);
  if (cleaned.length >= 3) return cleaned;
  return `kotonoha_${Math.random().toString(36).slice(2, 6)}`;
}

// ============================================================================
// USER PROFILE & AUTH SYNC
// ============================================================================
export async function getUserProfile(uid: string, email?: string | null, emailVerified?: boolean): Promise<AuthUser | null> {
  const path = `users/${uid}`;
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (!snap.exists()) return null;
    const d = snap.data();
    const isAdmin = email === ADMIN_EMAIL && Boolean(emailVerified);
    return {
      uid: String(d.uid || uid),
      username: String(d.username),
      nativeLang: (d.nativeLang as 'es' | 'ja' | 'other') || 'es',
      learningLang:
        d.learningLang === 'es' || d.learningLang === 'ja' ? (d.learningLang as 'es' | 'ja') : undefined,
      learningLevel:
        d.learningLevel === 'beginner' || d.learningLevel === 'intermediate' || d.learningLevel === 'advanced'
          ? (d.learningLevel as ExchangeLevel)
          : undefined,
      interests: Array.isArray(d.interests) ? d.interests.map(String).slice(0, 3) : undefined,
      jlptLevel: (d.jlptLevel as JlptLevel) || 'N5',
      bio: String(d.bio || ''),
      role: isAdmin ? 'admin' : ((d.role as 'student' | 'native_partner' | 'admin') || 'student'),
      isAdmin,
      xp: Number(d.xp || 0),
      streakDays: Number(d.streakDays || 1),
      lastStudyDate: d.lastStudyDate ? String(d.lastStudyDate) : null,
      createdAt: tsToIso(d.createdAt),
    };
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
  }
}

export async function createOrLoadUserProfile(params: {
  uid: string;
  username: string;
  nativeLang: 'es' | 'ja' | 'other';
  jlptLevel: JlptLevel;
  bio?: string;
  email?: string | null;
  emailVerified?: boolean;
}): Promise<AuthUser> {
  const existing = await getUserProfile(params.uid, params.email, params.emailVerified);
  if (existing) return existing;

  const path = `users/${params.uid}`;
  const safeUsername = sanitizeUsername(params.username);
  const role: 'student' | 'native_partner' = params.nativeLang === 'ja' ? 'native_partner' : 'student';
  const today = new Date().toISOString().slice(0, 10);

  try {
    await setDoc(doc(db, 'users', params.uid), {
      uid: params.uid,
      username: safeUsername,
      nativeLang: params.nativeLang,
      jlptLevel: params.jlptLevel,
      bio: (params.bio || '').trim().slice(0, 180),
      role,
      xp: 0,
      streakDays: 1,
      lastStudyDate: today,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    await seedStarterCardsIfEmpty(params.uid);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }

  const created = await getUserProfile(params.uid, params.email, params.emailVerified);
  if (!created) {
    throw new Error('No se pudo cargar el perfil recién creado.');
  }
  return created;
}

export async function updateUserProfile(
  uid: string,
  updates: { nativeLang: 'es' | 'ja' | 'other'; jlptLevel: JlptLevel; bio: string }
): Promise<void> {
  const path = `users/${uid}`;
  try {
    await updateDoc(doc(db, 'users', uid), {
      nativeLang: updates.nativeLang,
      jlptLevel: updates.jlptLevel,
      bio: updates.bio.trim().slice(0, 180),
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function updateExchangeProfile(
  uid: string,
  updates: {
    username: string;
    nativeLang: 'es' | 'ja' | 'other';
    learningLang: 'es' | 'ja';
    learningLevel: ExchangeLevel;
    interests: string[];
  }
): Promise<void> {
  const path = `users/${uid}`;
  const cleanName = updates.username.trim().slice(0, 30);
  const safeName = cleanName.length >= 2 ? cleanName : 'KotonohaUser';
  const cleanInterests = updates.interests.map((s) => String(s).trim().slice(0, 40)).filter(Boolean).slice(0, 3);
  try {
    await updateDoc(doc(db, 'users', uid), {
      username: safeName,
      nativeLang: updates.nativeLang,
      learningLang: updates.learningLang,
      learningLevel: updates.learningLevel,
      interests: cleanInterests,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

// ============================================================================
// SRS CARDS (SM-2)
// ============================================================================
export function computeSm2(
  quality: number,
  prevEase: number,
  prevInterval: number,
  prevReps: number
): { easeFactor: number; intervalDays: number; repetitions: number } {
  let ease = prevEase + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (ease < 1.3) ease = 1.3;

  let reps = prevReps;
  let interval = prevInterval;

  if (quality < 3) {
    reps = 0;
    interval = 1;
  } else {
    reps += 1;
    if (reps === 1) interval = quality === 5 ? 3 : 1;
    else if (reps === 2) interval = quality === 5 ? 7 : 4;
    else interval = Math.round(prevInterval * ease * (quality === 3 ? 0.8 : quality === 5 ? 1.25 : 1));
  }

  return {
    easeFactor: Number(ease.toFixed(2)),
    intervalDays: Math.max(1, Math.min(interval, 180)),
    repetitions: reps,
  };
}

export async function seedStarterCardsIfEmpty(uid: string): Promise<void> {
  const path = `users/${uid}/srsCards`;
  try {
    const q = query(collection(db, 'users', uid, 'srsCards'), where('userId', '==', uid), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) return;

    const batch = writeBatch(db);
    const nowTs = Timestamp.now();
    STARTER_SRS_CARDS.forEach((c, idx) => {
      const ref = doc(db, 'users', uid, 'srsCards', `starter_${idx + 1}`);
      batch.set(ref, {
        userId: uid,
        cardType: c.cardType,
        front: c.front,
        reading: c.reading,
        back: c.back,
        hint: c.hint,
        jlptLevel: c.jlptLevel,
        easeFactor: 2.5,
        intervalDays: 0,
        repetitions: 0,
        nextReviewAt: nowTs,
        correctCount: 0,
        wrongCount: 0,
        createdAt: serverTimestamp(),
      });
    });
    await batch.commit();
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function fetchUserSrsCards(uid: string): Promise<SrsCard[]> {
  const path = `users/${uid}/srsCards`;
  try {
    await seedStarterCardsIfEmpty(uid);
    const q = query(collection(db, 'users', uid, 'srsCards'), where('userId', '==', uid));
    const snap = await getDocs(q);
    const items: SrsCard[] = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        userId: String(data.userId),
        cardType: (data.cardType as 'vocab' | 'kanji' | 'grammar') || 'vocab',
        front: String(data.front),
        reading: String(data.reading || ''),
        back: String(data.back),
        hint: String(data.hint || ''),
        jlptLevel: (data.jlptLevel as JlptLevel) || 'N5',
        easeFactor: Number(data.easeFactor ?? 2.5),
        intervalDays: Number(data.intervalDays ?? 0),
        repetitions: Number(data.repetitions ?? 0),
        nextReviewAt: tsToIso(data.nextReviewAt),
        lastReviewedAt: data.lastReviewedAt ? tsToIso(data.lastReviewedAt) : null,
        correctCount: Number(data.correctCount ?? 0),
        wrongCount: Number(data.wrongCount ?? 0),
      };
    });
    return items.sort((a, b) => a.nextReviewAt.localeCompare(b.nextReviewAt));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function createUserSrsCard(
  uid: string,
  payload: {
    cardType: 'vocab' | 'kanji' | 'grammar';
    front: string;
    reading: string;
    back: string;
    hint?: string;
    jlptLevel: JlptLevel;
  }
): Promise<string> {
  const id = makeDocId('srs');
  const path = `users/${uid}/srsCards/${id}`;
  try {
    await setDoc(doc(db, 'users', uid, 'srsCards', id), {
      userId: uid,
      cardType: payload.cardType,
      front: payload.front.trim().slice(0, 120),
      reading: payload.reading.trim().slice(0, 140),
      back: payload.back.trim().slice(0, 240),
      hint: (payload.hint || '').trim().slice(0, 180),
      jlptLevel: payload.jlptLevel,
      easeFactor: 2.5,
      intervalDays: 0,
      repetitions: 0,
      nextReviewAt: Timestamp.now(),
      correctCount: 0,
      wrongCount: 0,
      createdAt: serverTimestamp(),
    });
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

export async function reviewUserSrsCard(
  uid: string,
  card: SrsCard,
  quality: 1 | 3 | 4 | 5
): Promise<{ intervalDays: number; xpEarned: number }> {
  const path = `users/${uid}/srsCards/${card.id}`;
  const { easeFactor, intervalDays, repetitions } = computeSm2(
    quality,
    card.easeFactor,
    card.intervalDays,
    card.repetitions
  );
  const nextReview = new Date(Date.now() + intervalDays * 86400 * 1000);
  const isCorrect = quality >= 3;
  const xpEarned = quality === 5 ? 15 : quality === 4 ? 12 : quality === 3 ? 8 : 4;

  try {
    await updateDoc(doc(db, 'users', uid, 'srsCards', card.id), {
      easeFactor,
      intervalDays,
      repetitions,
      nextReviewAt: Timestamp.fromDate(nextReview),
      lastReviewedAt: serverTimestamp(),
      correctCount: card.correctCount + (isCorrect ? 1 : 0),
      wrongCount: card.wrongCount + (isCorrect ? 0 : 1),
    });
    await recordStudyProgress(
      uid,
      'srs',
      isCorrect ? 100 : 35,
      25,
      xpEarned,
      `Repaso SRS: ${card.front}`
    );
    return { intervalDays, xpEarned };
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

// ============================================================================
// STUDY PROGRESS & PERSONALIZED DASHBOARD
// ============================================================================
export async function recordStudyProgress(
  uid: string,
  activityType: 'srs' | 'lesson' | 'writing' | 'oral' | 'exam',
  score: number,
  durationSeconds: number,
  xpEarned: number,
  details: string
): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  const logId = makeDocId('log');
  const clampedXp = Math.max(0, Math.min(300, Math.round(xpEarned)));
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));
  const clampedDuration = Math.max(1, Math.min(7200, Math.round(durationSeconds)));

  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    let nextStreak = 1;
    let currentXp = 0;

    if (userSnap.exists()) {
      const d = userSnap.data();
      currentXp = Number(d.xp || 0);
      nextStreak = Number(d.streakDays || 1);
      const prevDate = d.lastStudyDate ? String(d.lastStudyDate) : null;
      if (prevDate) {
        const prev = new Date(prevDate + 'T00:00:00Z');
        const curr = new Date(today + 'T00:00:00Z');
        const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 3600 * 24));
        if (diffDays === 1) nextStreak += 1;
        else if (diffDays > 1) nextStreak = 1;
      }
    }

    const batch = writeBatch(db);
    batch.set(doc(db, 'users', uid, 'studyLogs', logId), {
      userId: uid,
      activityType,
      score: clampedScore,
      durationSeconds: clampedDuration,
      xpEarned: clampedXp,
      details: details.slice(0, 300),
      dayKey: today,
      createdAt: serverTimestamp(),
    });
    if (userSnap.exists()) {
      batch.update(userRef, {
        xp: currentXp + clampedXp,
        streakDays: nextStreak,
        lastStudyDate: today,
        updatedAt: serverTimestamp(),
      });
    }
    await batch.commit();
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `users/${uid}/studyLogs/${logId}`);
  }
}

export async function recordUnitCompletion(
  uid: string,
  lesson: Lesson,
  score: number
): Promise<{ passed: boolean; score: number; xpEarned: number }> {
  const cleanScore = Math.max(0, Math.min(100, Math.round(score)));
  const passed = cleanScore >= 70;
  const xpEarned = passed ? Math.round(40 + cleanScore * 0.6) : 15;
  const path = `users/${uid}/unitCompletions/${lesson.id}`;

  try {
    const ref = doc(db, 'users', uid, 'unitCompletions', lesson.id);
    const snap = await getDoc(ref);
    const prevBest = snap.exists() ? Number(snap.data().bestScore || 0) : 0;
    const prevPassed = snap.exists() ? Boolean(snap.data().passed) : false;

    await setDoc(ref, {
      userId: uid,
      lessonId: lesson.id,
      bestScore: Math.max(prevBest, cleanScore),
      passed: prevPassed || passed,
      completedAt: serverTimestamp(),
    });

    await recordStudyProgress(
      uid,
      'exam',
      cleanScore,
      180,
      xpEarned,
      `Evaluación ${lesson.level}: ${lesson.title} (${cleanScore}%)`
    );

    return { passed, score: cleanScore, xpEarned };
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function fetchDashboardStats(
  uid: string | null,
  totalLessonsCount: number,
  uiLang: UiLanguage = 'es'
): Promise<UserDashboardStats> {
  const days: DailyProgressPoint[] = [];
  const weekdayFmt = new Intl.DateTimeFormat(uiLang === 'ja' ? 'ja-JP' : 'es-ES', { weekday: 'short' });

  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400 * 1000);
    days.push({
      date: d.toISOString().slice(0, 10),
      label: weekdayFmt.format(d).replace('.', ''),
      xp: 0,
      minutes: 0,
      accuracy: 0,
      sessions: 0,
    });
  }

  if (!uid) {
    return {
      xp: 0,
      streakDays: 1,
      dueCards: STARTER_SRS_CARDS.length,
      totalCards: STARTER_SRS_CARDS.length,
      masteredCards: 0,
      completedUnits: 0,
      totalUnits: totalLessonsCount || FALLBACK_LESSONS.length,
      weeklyAccuracy: 0,
      todayMinutes: 0,
      dailySeries: days,
      completedLessonIds: [],
      recentActivities: [],
    };
  }

  try {
    const [userSnap, cardsSnap, logsSnap, completionsSnap] = await Promise.all([
      getDoc(doc(db, 'users', uid)),
      getDocs(query(collection(db, 'users', uid, 'srsCards'), where('userId', '==', uid))),
      getDocs(query(collection(db, 'users', uid, 'studyLogs'), where('userId', '==', uid))),
      getDocs(query(collection(db, 'users', uid, 'unitCompletions'), where('userId', '==', uid))),
    ]);

    const userData = userSnap.exists() ? userSnap.data() : {};
    const nowMs = Date.now();
    let dueCards = 0;
    let masteredCards = 0;
    cardsSnap.docs.forEach((d) => {
      const c = d.data();
      const nextMs = c.nextReviewAt instanceof Timestamp ? c.nextReviewAt.toMillis() : nowMs;
      if (nextMs <= nowMs) dueCards += 1;
      if (Number(c.repetitions || 0) >= 3 && Number(c.intervalDays || 0) >= 7) masteredCards += 1;
    });

    const completedLessonIds = completionsSnap.docs
      .filter((d) => Boolean(d.data().passed))
      .map((d) => String(d.data().lessonId));

    const logs = logsSnap.docs
      .map((d) => {
        const data = d.data();
        return {
          id: d.id,
          activityType: String(data.activityType),
          score: Number(data.score || 0),
          durationSeconds: Number(data.durationSeconds || 0),
          xpEarned: Number(data.xpEarned || 0),
          details: String(data.details || ''),
          dayKey: String(data.dayKey || ''),
          createdAt: tsToIso(data.createdAt),
        };
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    const byDay = new Map<string, { xp: number; secs: number; scoreSum: number; count: number }>();
    for (const l of logs) {
      const cur = byDay.get(l.dayKey) || { xp: 0, secs: 0, scoreSum: 0, count: 0 };
      cur.xp += l.xpEarned;
      cur.secs += l.durationSeconds;
      cur.scoreSum += l.score;
      cur.count += 1;
      byDay.set(l.dayKey, cur);
    }

    let accSum = 0;
    let accDays = 0;
    for (const pt of days) {
      const m = byDay.get(pt.date);
      if (m) {
        pt.xp = m.xp;
        pt.minutes = Math.max(1, Math.round(m.secs / 60));
        pt.accuracy = Math.round(m.scoreSum / m.count);
        pt.sessions = m.count;
        accSum += pt.accuracy;
        accDays += 1;
      }
    }

    const todayPoint = days[days.length - 1];
    return {
      xp: Number(userData.xp || 0),
      streakDays: Number(userData.streakDays || 1),
      dueCards,
      totalCards: cardsSnap.size,
      masteredCards,
      completedUnits: completedLessonIds.length,
      totalUnits: totalLessonsCount || FALLBACK_LESSONS.length,
      weeklyAccuracy: accDays > 0 ? Math.round(accSum / accDays) : 0,
      todayMinutes: todayPoint?.minutes || 0,
      dailySeries: days,
      completedLessonIds,
      recentActivities: logs.slice(0, 8),
    };
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `users/${uid}`);
  }
}

// ============================================================================
// LESSONS & DICTIONARY (Live Firestore + Seamless Starter Catalog Fallback)
// ============================================================================
const LEVEL_RANK: Record<JlptLevel, number> = { N5: 1, N4: 2, N3: 3, N2: 4, N1: 5 };

export async function fetchLessons(level?: JlptLevel): Promise<{ lessons: Lesson[]; fromFirestore: boolean }> {
  try {
    const q = query(collection(db, 'lessons'), where('published', '==', true));
    const snap = await getDocs(q);
    if (snap.empty) {
      const filtered = level ? FALLBACK_LESSONS.filter((l) => l.level === level) : FALLBACK_LESSONS;
      return { lessons: filtered, fromFirestore: false };
    }
    let items: Lesson[] = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        level: (data.level as JlptLevel) || 'N5',
        unitNumber: Number(data.unitNumber || 1),
        title: String(data.title),
        subtitle: String(data.subtitle || ''),
        sourceBook: String(data.sourceBook || ''),
        grammarPoints: Array.isArray(data.grammarPoints) ? data.grammarPoints : [],
        vocabulary: Array.isArray(data.vocabulary) ? data.vocabulary : [],
        kanjiList: Array.isArray(data.kanjiList) ? data.kanjiList : [],
        dialogue: Array.isArray(data.dialogue) ? data.dialogue : [],
        exercises: Array.isArray(data.exercises) ? data.exercises : [],
        unitExam: Array.isArray(data.unitExam) ? data.unitExam : [],
        published: Boolean(data.published),
        createdAt: tsToIso(data.createdAt),
        updatedAt: tsToIso(data.updatedAt),
      };
    });
    if (level) items = items.filter((l) => l.level === level);
    items.sort((a, b) => LEVEL_RANK[a.level] - LEVEL_RANK[b.level] || a.unitNumber - b.unitNumber);
    return { lessons: items, fromFirestore: true };
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'lessons');
  }
}

export async function fetchDictionaryEntries(params: {
  q?: string;
  level?: JlptLevel;
  source?: string;
}): Promise<{ entries: DictionaryEntry[]; sources: string[]; fromFirestore: boolean }> {
  try {
    const q = query(collection(db, 'dictionaryEntries'), where('published', '==', true));
    const snap = await getDocs(q);
    const fromFirestore = !snap.empty;
    const raw: DictionaryEntry[] = fromFirestore
      ? snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            word: String(data.word),
            reading: String(data.reading),
            romaji: String(data.romaji || ''),
            meaningEs: String(data.meaningEs),
            partOfSpeech: String(data.partOfSpeech || 'sustantivo'),
            jlptLevel: (data.jlptLevel as JlptLevel) || 'N5',
            exampleJa: String(data.exampleJa || ''),
            exampleReading: String(data.exampleReading || ''),
            exampleEs: String(data.exampleEs || ''),
            dictionarySource: String(data.dictionarySource || 'Diccionario'),
            tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
            published: true,
          };
        })
      : FALLBACK_DICTIONARY;

    const sources = Array.from(new Set(raw.map((e) => e.dictionarySource))).sort();
    const search = (params.q || '').trim().toLowerCase();

    const filtered = raw.filter((e) => {
      if (params.level && e.jlptLevel !== params.level) return false;
      if (params.source && e.dictionarySource !== params.source) return false;
      if (search) {
        const hay = `${e.word} ${e.reading} ${e.romaji} ${e.meaningEs} ${e.tags.join(' ')}`.toLowerCase();
        if (!hay.includes(search)) return false;
      }
      return true;
    });

    return { entries: filtered, sources, fromFirestore };
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'dictionaryEntries');
  }
}

// ============================================================================
// FORUM & LIVE CHAT (Real-time onSnapshot)
// ============================================================================
export async function fetchForumPosts(category?: string): Promise<ForumPost[]> {
  try {
    const q = query(collection(db, 'forumPosts'), where('published', '==', true));
    const snap = await getDocs(q);
    const posts: ForumPost[] = await Promise.all(
      snap.docs.map(async (d) => {
        const data = d.data();
        const repliesSnap = await getDocs(
          query(collection(db, 'forumPosts', d.id, 'replies'), where('published', '==', true))
        );
        const replies: ForumReply[] = repliesSnap.docs
          .map((r) => {
            const rd = r.data();
            return {
              id: r.id,
              postId: String(rd.postId),
              authorUid: String(rd.authorUid),
              authorUsername: String(rd.authorUsername),
              authorNativeLang: String(rd.authorNativeLang || 'es'),
              content: String(rd.content),
              createdAt: tsToIso(rd.createdAt),
            };
          })
          .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

        return {
          id: d.id,
          authorUid: String(data.authorUid),
          authorUsername: String(data.authorUsername),
          authorRole: String(data.authorRole || 'student'),
          authorNativeLang: String(data.authorNativeLang || 'es'),
          category: (data.category as ForumPost['category']) || 'gramatica',
          title: String(data.title),
          content: String(data.content),
          jlptLevel: (data.jlptLevel as JlptLevel) || 'N5',
          likesCount: Number(data.likesCount || 0),
          repliesCount: Number(data.repliesCount || replies.length),
          createdAt: tsToIso(data.createdAt),
          replies,
        };
      })
    );

    const filtered = category ? posts.filter((p) => p.category === category) : posts;
    return filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'forumPosts');
  }
}

export async function createForumPost(
  user: AuthUser,
  payload: { category: ForumPost['category']; title: string; content: string; jlptLevel: JlptLevel }
): Promise<string> {
  const id = makeDocId('post');
  const path = `forumPosts/${id}`;
  try {
    await setDoc(doc(db, 'forumPosts', id), {
      authorUid: user.uid,
      authorUsername: user.username,
      authorNativeLang: user.nativeLang,
      authorRole: user.role === 'admin' ? 'admin' : user.role,
      category: payload.category,
      title: payload.title.trim().slice(0, 140),
      content: payload.content.trim().slice(0, 2500),
      jlptLevel: payload.jlptLevel,
      likesCount: 0,
      repliesCount: 0,
      published: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

export async function replyToForumPost(user: AuthUser, postId: string, content: string): Promise<string> {
  const replyId = makeDocId('rep');
  const path = `forumPosts/${postId}/replies/${replyId}`;
  try {
    const batch = writeBatch(db);
    batch.set(doc(db, 'forumPosts', postId, 'replies', replyId), {
      postId,
      authorUid: user.uid,
      authorUsername: user.username,
      authorNativeLang: user.nativeLang,
      content: content.trim().slice(0, 1500),
      published: true,
      createdAt: serverTimestamp(),
    });
    batch.update(doc(db, 'forumPosts', postId), {
      repliesCount: increment(1),
      updatedAt: serverTimestamp(),
    });
    await batch.commit();
    return replyId;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function likeForumPost(postId: string): Promise<void> {
  const path = `forumPosts/${postId}`;
  try {
    await updateDoc(doc(db, 'forumPosts', postId), {
      likesCount: increment(1),
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export function subscribeChatRoom(
  room: ChatMessage['room'],
  onMessages: (messages: ChatMessage[]) => void
): Unsubscribe {
  const q = query(collection(db, 'chatMessages'), where('published', '==', true));
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs
        .map((d) => {
          const data = d.data();
          return {
            id: d.id,
            room: (data.room as ChatMessage['room']) || 'general',
            authorUid: String(data.authorUid),
            authorUsername: String(data.authorUsername),
            authorNativeLang: String(data.authorNativeLang || 'es'),
            content: String(data.content),
            translationHint: String(data.translationHint || ''),
            createdAt: tsToIso(data.createdAt),
          };
        })
        .filter((m) => m.room === room)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
        .slice(-60);
      onMessages(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'chatMessages');
    }
  );
}

export async function sendChatMessage(
  user: AuthUser,
  payload: { room: ChatMessage['room']; content: string; translationHint?: string }
): Promise<string> {
  const id = makeDocId('msg');
  const path = `chatMessages/${id}`;
  try {
    await setDoc(doc(db, 'chatMessages', id), {
      room: payload.room,
      authorUid: user.uid,
      authorUsername: user.username,
      authorNativeLang: user.nativeLang,
      content: payload.content.trim().slice(0, 600),
      translationHint: (payload.translationHint || '').trim().slice(0, 280),
      published: true,
      createdAt: serverTimestamp(),
    });
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

// ============================================================================
// LANGUAGE EXCHANGE: DAILY PROMPTS, ASYNC RESPONSES & CORRECTIONS
// ============================================================================
export async function fetchDailyPrompts(): Promise<DailyPrompt[]> {
  try {
    const q = query(collection(db, 'daily_prompts'), where('published', '==', true));
    const snap = await getDocs(q);
    const live: DailyPrompt[] = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        promptEs: String(data.promptEs),
        promptJa: String(data.promptJa),
        topicTag: String(data.topicTag || 'daily_life'),
        authorUid: String(data.authorUid || 'kotonoha_system'),
        isAiGenerated: Boolean(data.isAiGenerated),
        responsesCount: Number(data.responsesCount || 0),
        createdAt: tsToIso(data.createdAt),
      };
    });

    const existingIds = new Set(live.map((p) => p.id));
    const merged = [...live];
    for (const starter of SEED_DAILY_PROMPTS) {
      if (!existingIds.has(starter.id)) {
        merged.push(starter);
      }
    }
    return merged.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'daily_prompts');
  }
}

export async function createDailyPrompt(
  user: AuthUser,
  payload: { promptEs: string; promptJa: string; topicTag: string; isAiGenerated: boolean }
): Promise<DailyPrompt> {
  const id = makeDocId('prompt');
  const path = `daily_prompts/${id}`;
  const promptEs = payload.promptEs.trim().slice(0, 300);
  const promptJa = payload.promptJa.trim().slice(0, 300);
  const topicTag = (payload.topicTag || 'daily_life').trim().slice(0, 40);
  try {
    await setDoc(doc(db, 'daily_prompts', id), {
      promptEs,
      promptJa,
      topicTag,
      authorUid: user.uid,
      isAiGenerated: Boolean(payload.isAiGenerated),
      responsesCount: 0,
      published: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return {
      id,
      promptEs,
      promptJa,
      topicTag,
      authorUid: user.uid,
      isAiGenerated: Boolean(payload.isAiGenerated),
      responsesCount: 0,
      createdAt: new Date().toISOString(),
    };
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

export async function fetchExchangeResponses(promptId?: string): Promise<ExchangeResponse[]> {
  try {
    const q = promptId
      ? query(
          collection(db, 'responses'),
          where('published', '==', true),
          where('promptId', '==', promptId)
        )
      : query(collection(db, 'responses'), where('published', '==', true));
    const snap = await getDocs(q);
    const items: ExchangeResponse[] = await Promise.all(
      snap.docs.map(async (d) => {
        const data = d.data();
        const corrSnap = await getDocs(
          query(collection(db, 'responses', d.id, 'corrections'), where('published', '==', true))
        );
        const corrections: ResponseCorrection[] = corrSnap.docs
          .map((c) => {
            const cd = c.data();
            return {
              id: c.id,
              responseId: String(cd.responseId || d.id),
              authorUid: String(cd.authorUid),
              authorUsername: String(cd.authorUsername),
              authorNativeLang: String(cd.authorNativeLang || 'es'),
              kind: cd.kind === 'correction' ? ('correction' as const) : ('reply' as const),
              correctedText: cd.correctedText ? String(cd.correctedText) : undefined,
              comment: String(cd.comment),
              createdAt: tsToIso(cd.createdAt),
            };
          })
          .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

        return {
          id: d.id,
          promptId: String(data.promptId),
          authorUid: String(data.authorUid),
          authorUsername: String(data.authorUsername),
          authorNativeLang: String(data.authorNativeLang || 'es'),
          targetLang: data.targetLang === 'es' ? ('es' as const) : ('ja' as const),
          authorLevel:
            data.authorLevel === 'intermediate' || data.authorLevel === 'advanced'
              ? (data.authorLevel as ExchangeLevel)
              : 'beginner',
          content: String(data.content),
          correctionsCount: Number(data.correctionsCount ?? corrections.length),
          createdAt: tsToIso(data.createdAt),
          corrections,
        };
      })
    );

    return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'responses');
  }
}

export async function createExchangeResponse(
  user: AuthUser,
  prompt: DailyPrompt,
  content: string,
  level: ExchangeLevel
): Promise<string> {
  const responseId = makeDocId('resp');
  const path = `responses/${responseId}`;
  const cleanUsername = user.username.trim().slice(0, 30);
  const safeUsername = cleanUsername.length >= 2 ? cleanUsername : 'KotonohaUser';
  const targetLang: 'es' | 'ja' = user.learningLang || (user.nativeLang === 'ja' ? 'es' : 'ja');

  try {
    const promptRef = doc(db, 'daily_prompts', prompt.id);
    const promptSnap = await getDoc(promptRef);
    if (!promptSnap.exists()) {
      await setDoc(promptRef, {
        promptEs: prompt.promptEs.slice(0, 300),
        promptJa: prompt.promptJa.slice(0, 300),
        topicTag: (prompt.topicTag || 'daily_life').slice(0, 40),
        authorUid: user.uid,
        isAiGenerated: Boolean(prompt.isAiGenerated),
        responsesCount: 0,
        published: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    const batch = writeBatch(db);
    batch.set(doc(db, 'responses', responseId), {
      promptId: prompt.id,
      authorUid: user.uid,
      authorUsername: safeUsername,
      authorNativeLang: user.nativeLang,
      targetLang,
      authorLevel: level,
      content: content.trim().slice(0, 2000),
      correctionsCount: 0,
      published: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    batch.update(promptRef, {
      responsesCount: increment(1),
      updatedAt: serverTimestamp(),
    });
    await batch.commit();
    return responseId;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function addResponseCorrection(
  user: AuthUser,
  responseId: string,
  payload: { kind: 'correction' | 'reply'; correctedText?: string; comment: string }
): Promise<string> {
  const correctionId = makeDocId('corr');
  const path = `responses/${responseId}/corrections/${correctionId}`;
  const cleanUsername = user.username.trim().slice(0, 30);
  const safeUsername = cleanUsername.length >= 2 ? cleanUsername : 'KotonohaUser';
  const trimmedCorrection = payload.correctedText?.trim().slice(0, 2000);

  try {
    const batch = writeBatch(db);
    const docPayload: Record<string, unknown> = {
      responseId,
      authorUid: user.uid,
      authorUsername: safeUsername,
      authorNativeLang: user.nativeLang,
      kind: payload.kind,
      comment: payload.comment.trim().slice(0, 1500),
      published: true,
      createdAt: serverTimestamp(),
    };
    if (trimmedCorrection) {
      docPayload.correctedText = trimmedCorrection;
    }

    batch.set(doc(db, 'responses', responseId, 'corrections', correctionId), docPayload);
    batch.update(doc(db, 'responses', responseId), {
      correctionsCount: increment(1),
      updatedAt: serverTimestamp(),
    });
    await batch.commit();
    return correctionId;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// ============================================================================
// ADMIN FIRESTORE OPERATIONS (Seeding, Dynamic Content, Counts)
// ============================================================================
export async function seedFirestoreCatalogIfEmpty(adminUser: AuthUser): Promise<{
  lessonsSeeded: number;
  dictSeeded: number;
  forumSeeded: number;
}> {
  if (!adminUser.isAdmin) {
    throw new Error('Solo el administrador verificado puede inicializar el catálogo en Firestore.');
  }

  let lessonsSeeded = 0;
  let dictSeeded = 0;
  let forumSeeded = 0;

  const [lessonsSnap, dictSnap, forumSnap, promptsSnap] = await Promise.all([
    getDocs(collection(db, 'lessons')),
    getDocs(collection(db, 'dictionaryEntries')),
    getDocs(query(collection(db, 'forumPosts'), where('published', '==', true), limit(1))),
    getDocs(collection(db, 'daily_prompts')),
  ]);

  const existingLessonIds = new Set(lessonsSnap.docs.map((d) => d.id));
  const missingLessons = SEED_LESSONS.map((l, idx) => ({
    id: `seed_${l.level.toLowerCase()}_${l.unitNumber}_${idx + 1}`,
    data: l,
  })).filter((item) => !existingLessonIds.has(item.id));

  if (missingLessons.length > 0) {
    const batch = writeBatch(db);
    missingLessons.forEach(({ id, data }) => {
      batch.set(doc(db, 'lessons', id), {
        ...data,
        published: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      lessonsSeeded += 1;
    });
    await batch.commit();
  }

  const existingDictIds = new Set(dictSnap.docs.map((d) => d.id));
  const missingDict = SEED_DICTIONARY.map((d, idx) => ({
    id: `seed_dict_${idx + 1}`,
    data: d,
  })).filter((item) => !existingDictIds.has(item.id));

  if (missingDict.length > 0) {
    const batch = writeBatch(db);
    missingDict.forEach(({ id, data }) => {
      batch.set(doc(db, 'dictionaryEntries', id), {
        ...data,
        published: true,
        createdAt: serverTimestamp(),
      });
      dictSeeded += 1;
    });
    await batch.commit();
  }

  const existingPromptIds = new Set(promptsSnap.docs.map((d) => d.id));
  const missingPrompts = SEED_DAILY_PROMPTS.filter((p) => !existingPromptIds.has(p.id));
  if (missingPrompts.length > 0) {
    const batch = writeBatch(db);
    missingPrompts.forEach((p) => {
      batch.set(doc(db, 'daily_prompts', p.id), {
        promptEs: p.promptEs,
        promptJa: p.promptJa,
        topicTag: p.topicTag,
        authorUid: adminUser.uid,
        isAiGenerated: false,
        responsesCount: 0,
        published: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    });
    await batch.commit();
  }

  if (forumSnap.empty) {
    const batch = writeBatch(db);
    batch.set(doc(db, 'forumPosts', 'welcome_intercambio_es_ja'), {
      authorUid: adminUser.uid,
      authorUsername: adminUser.username,
      authorNativeLang: 'ja',
      authorRole: 'admin',
      category: 'intercambio',
      title: 'Cómo atraer hablantes nativos japoneses a esta comunidad (Guía ES ↔ JA)',
      content:
        'En Japón hay miles de estudiantes universitarios de español buscando intercambio seguro y sin exponer datos personales. Usa la pestaña "Conectar nativos" para copiar la invitación en japonés natural y compartir el enlace en comunidades de estudio.',
      jlptLevel: 'N5',
      likesCount: 0,
      repliesCount: 0,
      published: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    batch.set(doc(db, 'chatMessages', 'welcome_chat_general'), {
      room: 'general',
      authorUid: adminUser.uid,
      authorUsername: adminUser.username,
      authorNativeLang: 'ja',
      content: 'ようこそ！Kotonohaのコミュニティへ。気軽に日本語で挨拶してみましょう。',
      translationHint: '¡Bienvenida a la comunidad de Kotonoha! Anímate a saludar en japonés.',
      published: true,
      createdAt: serverTimestamp(),
    });
    await batch.commit();
    forumSeeded = 1;
  }

  return { lessonsSeeded, dictSeeded, forumSeeded };
}

export async function adminSaveLesson(lesson: Omit<Lesson, 'id'>): Promise<string> {
  const id = makeDocId(`lesson_${lesson.level.toLowerCase()}`);
  const path = `lessons/${id}`;
  try {
    await setDoc(doc(db, 'lessons', id), {
      level: lesson.level,
      unitNumber: lesson.unitNumber,
      title: lesson.title.trim().slice(0, 180),
      subtitle: lesson.subtitle.trim().slice(0, 240),
      sourceBook: lesson.sourceBook.trim().slice(0, 140),
      grammarPoints: lesson.grammarPoints || [],
      vocabulary: lesson.vocabulary || [],
      kanjiList: lesson.kanjiList || [],
      dialogue: lesson.dialogue || [],
      exercises: lesson.exercises || [],
      unitExam: lesson.unitExam || [],
      published: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

export async function adminDeleteLesson(lessonId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'lessons', lessonId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `lessons/${lessonId}`);
  }
}

export async function adminSaveDictionaryEntries(entries: Omit<DictionaryEntry, 'id'>[]): Promise<number> {
  try {
    const batch = writeBatch(db);
    let count = 0;
    for (const e of entries.slice(0, 40)) {
      const id = makeDocId('dict');
      batch.set(doc(db, 'dictionaryEntries', id), {
        word: e.word.trim().slice(0, 80),
        reading: e.reading.trim().slice(0, 100),
        romaji: (e.romaji || '').trim().slice(0, 120),
        meaningEs: e.meaningEs.trim().slice(0, 260),
        partOfSpeech: (e.partOfSpeech || 'sustantivo').trim().slice(0, 60),
        jlptLevel: e.jlptLevel,
        exampleJa: (e.exampleJa || '').trim().slice(0, 240),
        exampleReading: (e.exampleReading || '').trim().slice(0, 260),
        exampleEs: (e.exampleEs || '').trim().slice(0, 260),
        dictionarySource: e.dictionarySource.trim().slice(0, 120),
        tags: Array.isArray(e.tags) ? e.tags.slice(0, 8) : [],
        published: true,
        createdAt: serverTimestamp(),
      });
      count += 1;
    }
    await batch.commit();
    return count;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'dictionaryEntries');
  }
}

export async function adminDeleteDictionaryEntry(entryId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'dictionaryEntries', entryId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `dictionaryEntries/${entryId}`);
  }
}

export async function fetchAdminFirestoreCounts(): Promise<{
  users: number;
  lessons: number;
  dictionaryEntries: number;
  forumPosts: number;
  chatMessages: number;
}> {
  try {
    const [u, l, d, f, c] = await Promise.all([
      getCountFromServer(collection(db, 'users')),
      getCountFromServer(query(collection(db, 'lessons'), where('published', '==', true))),
      getCountFromServer(query(collection(db, 'dictionaryEntries'), where('published', '==', true))),
      getCountFromServer(query(collection(db, 'forumPosts'), where('published', '==', true))),
      getCountFromServer(query(collection(db, 'chatMessages'), where('published', '==', true))),
    ]);
    return {
      users: u.data().count,
      lessons: l.data().count,
      dictionaryEntries: d.data().count,
      forumPosts: f.data().count,
      chatMessages: c.data().count,
    };
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, 'admin/counts');
  }
}
