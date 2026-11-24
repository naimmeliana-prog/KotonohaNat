import { CheckCircle2, Plus, Volume2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatT } from '../i18n/translations';
import { useLanguage } from '../i18n/LanguageContext';
import { api, playBase64Audio } from '../lib/api';
import { createUserSrsCard, fetchLessons, recordUnitCompletion } from '../lib/firestoreService';
import type { AuthUser, ExerciseQuestion, JlptLevel, Lesson } from '../types/kotonoha';

interface CoursesViewProps {
  user: AuthUser | null;
  completedLessonIds: string[];
  onRefreshDashboard: () => void;
  onRequireAuth: () => void;
}

const LEVELS: JlptLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1'];
type LessonTab = 'gramatica' | 'vocabulario' | 'dialogo' | 'ejercicios' | 'evaluacion';

export function CoursesView({
  user,
  completedLessonIds,
  onRefreshDashboard,
  onRequireAuth,
}: CoursesViewProps) {
  const { t } = useLanguage();
  const c = t.courses;

  const [selectedLevel, setSelectedLevel] = useState<JlptLevel>(user?.jlptLevel || 'N5');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<LessonTab>('gramatica');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [speakingText, setSpeakingText] = useState<string | null>(null);
  const [addedWords, setAddedWords] = useState<Record<string, boolean>>({});
  const [showDialogueEs, setShowDialogueEs] = useState(true);

  const [exerciseAnswers, setExerciseAnswers] = useState<Record<string, number>>({});
  const [examAnswers, setExamAnswers] = useState<Record<string, number>>({});
  const [examResult, setExamResult] = useState<{ score: number; passed: boolean; xpEarned: number } | null>(null);
  const [submittingExam, setSubmittingExam] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    fetchLessons(selectedLevel)
      .then((res) => {
        if (!mounted) return;
        setLessons(res.lessons);
        setActiveLessonId(res.lessons[0]?.id ?? null);
        setActiveTab('gramatica');
        setExerciseAnswers({});
        setExamAnswers({});
        setExamResult(null);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : c.loadError);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [selectedLevel, c.loadError]);

  const activeLesson = lessons.find((l) => l.id === activeLessonId) || lessons[0] || null;

  const handleSelectLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
    setActiveTab('gramatica');
    setExerciseAnswers({});
    setExamAnswers({});
    setExamResult(null);
  };

  const handleSpeak = async (text: string) => {
    setSpeakingText(text);
    try {
      const tts = await api.synthesizeSpeech(text, 'Kore', selectedLevel === 'N5' ? 'slow' : 'natural');
      await playBase64Audio(tts.audioBase64, tts.mimeType);
    } catch (err) {
      setError(err instanceof Error ? err.message : c.audioError);
    } finally {
      setSpeakingText(null);
    }
  };

  const handleAddToSrs = async (front: string, reading: string, back: string, type: 'vocab' | 'kanji') => {
    if (!user) {
      onRequireAuth();
      return;
    }
    try {
      await createUserSrsCard(user.uid, {
        cardType: type,
        front,
        reading,
        back,
        jlptLevel: selectedLevel,
        hint: activeLesson ? `${activeLesson.level} · ${c.unitLabel} ${activeLesson.unitNumber}` : '',
      });
      setAddedWords((prev) => ({ ...prev, [front]: true }));
      onRefreshDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : c.srsSaveError);
    }
  };

  const handleSubmitExam = async (questions: ExerciseQuestion[]) => {
    if (!activeLesson || questions.length === 0) return;
    let correct = 0;
    for (const q of questions) {
      if (examAnswers[q.id] === q.correctIndex) correct += 1;
    }
    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= 70;
    const xpEarned = passed ? Math.round(40 + score * 0.6) : 15;

    if (!user) {
      setExamResult({ score, passed, xpEarned });
      return;
    }

    setSubmittingExam(true);
    try {
      const res = await recordUnitCompletion(user.uid, activeLesson, score);
      setExamResult(res);
      onRefreshDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : c.examSaveError);
    } finally {
      setSubmittingExam(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#DFD9CD] dark:border-[#262C36] pb-6">
        <div>
          <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE]">{c.eyebrow}</p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#1A1D21] dark:text-[#F2EFE9] mt-1">
            {c.title}
          </h1>
        </div>

        <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-[#ECE8DF] dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36] self-start">
          {LEVELS.map((lv) => (
            <button
              key={lv}
              type="button"
              onClick={() => setSelectedLevel(lv)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedLevel === lv
                  ? 'bg-white dark:bg-[#272D38] text-[#C9372C] dark:text-[#E04F44] shadow-xs'
                  : 'text-[#5A606B] dark:text-[#9BA1AE] hover:text-[#1A1D21] dark:hover:text-[#F2EFE9]'
              }`}
            >
              {lv}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-[#C9372C]/40 bg-[#C9372C]/5 text-sm text-[#C9372C] dark:text-[#F06B60]">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-sm text-[#5A606B] dark:text-[#9BA1AE]">
          {formatT(c.loading, { level: selectedLevel })}
        </div>
      ) : lessons.length === 0 ? (
        <div className="py-16 text-center rounded-xl border border-[#DFD9CD] dark:border-[#262C36] bg-white dark:bg-[#191C22]">
          <p className="text-sm text-[#5A606B] dark:text-[#9BA1AE]">
            {formatT(c.emptyLevel, { level: selectedLevel })}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <aside className="lg:col-span-4 space-y-3">
            <p className="text-xs font-medium text-[#5A606B] dark:text-[#9BA1AE]">
              {formatT(c.availableUnits, { count: lessons.length })}
            </p>
            <div className="space-y-2.5">
              {lessons.map((lesson) => {
                const isSelected = activeLesson?.id === lesson.id;
                const isDone = completedLessonIds.includes(lesson.id);
                return (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => handleSelectLesson(lesson.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-white dark:bg-[#1E232D] border-[#C9372C] dark:border-[#E04F44]'
                        : 'bg-white/70 dark:bg-[#191C22] border-[#DFD9CD] dark:border-[#262C36] hover:border-[#1E3A5F]/50 dark:hover:border-[#5B8CC4]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-xs text-[#5A606B] dark:text-[#9BA1AE]">
                      <span>
                        {lesson.level} <span aria-hidden="true">·</span> {c.unitLabel} {lesson.unitNumber}
                      </span>
                      {isDone && (
                        <span className="inline-flex items-center gap-1 text-[#2E6F52] dark:text-[#5DC293]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {c.approvedBadge}
                        </span>
                      )}
                    </div>
                    <h2 className="font-medium text-sm text-[#1A1D21] dark:text-[#F2EFE9] mt-1.5 leading-snug">
                      {lesson.title}
                    </h2>
                    <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE] mt-1 line-clamp-2">
                      {lesson.sourceBook}
                    </p>
                  </button>
                );
              })}
            </div>
          </aside>

          {activeLesson && (
            <div className="lg:col-span-8 rounded-2xl bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36] p-6 sm:p-8 space-y-6">
              <div>
                <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE]">
                  {activeLesson.level} <span aria-hidden="true">·</span> {c.unitLabel} {activeLesson.unitNumber}{' '}
                  <span aria-hidden="true">·</span> {activeLesson.sourceBook}
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1A1D21] dark:text-[#F2EFE9] mt-1">
                  {activeLesson.title}
                </h2>
                <p className="text-sm text-[#4A505A] dark:text-[#B3B8C4] mt-1.5">{activeLesson.subtitle}</p>
              </div>

              <div className="flex flex-wrap items-center gap-1 p-1 rounded-lg bg-[#ECE8DF] dark:bg-[#111317]">
                {(
                  [
                    { id: 'gramatica', label: c.tabGrammar },
                    { id: 'vocabulario', label: c.tabVocab },
                    { id: 'dialogo', label: c.tabDialogue },
                    { id: 'ejercicios', label: c.tabExercises },
                    { id: 'evaluacion', label: c.tabExam },
                  ] as { id: LessonTab; label: string }[]
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-white dark:bg-[#22262F] text-[#1A1D21] dark:text-[#F2EFE9] shadow-xs'
                        : 'text-[#5A606B] dark:text-[#9BA1AE] hover:text-[#1A1D21] dark:hover:text-[#F2EFE9]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === 'gramatica' && (
                <div className="divide-y divide-[#ECE8DF] dark:divide-[#262C36]">
                  {activeLesson.grammarPoints.map((gp, idx) => (
                    <div key={idx} className="py-6 first:pt-2 space-y-4">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="font-jp text-xl font-semibold text-[#1A1D21] dark:text-[#F2EFE9]">
                          {gp.pattern}
                        </h3>
                        <span className="text-xs font-mono-num text-[#5A606B] dark:text-[#9BA1AE]">
                          {gp.reading} · {gp.meaning}
                        </span>
                      </div>
                      <p className="text-sm text-[#3B404A] dark:text-[#C4C9D4] leading-relaxed">
                        {gp.explanation}
                      </p>
                      <p className="text-xs font-mono-num text-[#1E3A5F] dark:text-[#7FAEE3] bg-[#F7F5F0] dark:bg-[#111317] px-3.5 py-2.5 rounded-lg">
                        {c.structurePrefix} {gp.formation}
                      </p>
                      <div className="space-y-3 pt-1">
                        {gp.examples.map((ex, exIdx) => (
                          <div
                            key={exIdx}
                            className="flex items-start justify-between gap-4 py-2.5 border-b border-[#ECE8DF]/70 dark:border-[#262C36]/70 last:border-b-0"
                          >
                            <div className="space-y-0.5">
                              <p className="font-jp text-base font-medium text-[#1A1D21] dark:text-[#F2EFE9]">
                                {ex.ja}
                              </p>
                              <p className="font-jp text-xs text-[#5A606B] dark:text-[#9BA1AE]">
                                {ex.reading} <span aria-hidden="true">/</span> {ex.romaji}
                              </p>
                              <p className="text-sm text-[#4A505A] dark:text-[#B3B8C4]">{ex.es}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleSpeak(ex.ja)}
                              disabled={speakingText === ex.ja}
                              aria-label={`${c.listenPronunciation}: ${ex.ja}`}
                              className="p-2.5 rounded-lg border border-[#DFD9CD] dark:border-[#2C323E] text-[#1E3A5F] dark:text-[#7FAEE3] hover:border-[#C9372C] hover:text-[#C9372C] transition-colors shrink-0 cursor-pointer disabled:opacity-50"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'vocabulario' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-sm font-semibold text-[#1A1D21] dark:text-[#F2EFE9] mb-3">
                      {formatT(c.essentialVocab, { count: activeLesson.vocabulary.length })}
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-[#DFD9CD] dark:border-[#262C36] text-xs text-[#5A606B] dark:text-[#9BA1AE]">
                            <th className="py-2.5 pr-4 font-medium">{c.colWord}</th>
                            <th className="py-2.5 pr-4 font-medium">{c.colReading}</th>
                            <th className="py-2.5 pr-4 font-medium">{c.colMeaning}</th>
                            <th className="py-2.5 text-right font-medium">{c.colActions}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#ECE8DF] dark:divide-[#262C36] text-sm">
                          {activeLesson.vocabulary.map((v, i) => (
                            <tr key={i}>
                              <td className="py-3 pr-4 font-jp font-medium text-[#1A1D21] dark:text-[#F2EFE9]">
                                {v.word}
                              </td>
                              <td className="py-3 pr-4">
                                <span className="font-jp text-xs text-[#1A1D21] dark:text-[#F2EFE9] block">
                                  {v.reading}
                                </span>
                                <span className="text-xs text-[#5A606B] dark:text-[#9BA1AE]">{v.romaji}</span>
                              </td>
                              <td className="py-3 pr-4 text-[#3B404A] dark:text-[#C4C9D4]">
                                {v.meaning}
                                <span className="block text-xs text-[#5A606B] dark:text-[#9BA1AE]">{v.pos}</span>
                              </td>
                              <td className="py-3 text-right whitespace-nowrap">
                                <div className="inline-flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleSpeak(v.word)}
                                    disabled={speakingText === v.word}
                                    aria-label={`${c.listenPronunciation}: ${v.word}`}
                                    className="p-2 rounded-lg text-[#1E3A5F] dark:text-[#7FAEE3] hover:bg-[#ECE8DF] dark:hover:bg-[#252A34] cursor-pointer"
                                  >
                                    <Volume2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleAddToSrs(v.word, `${v.reading} (${v.romaji})`, v.meaning, 'vocab')
                                    }
                                    disabled={Boolean(addedWords[v.word])}
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-[#DFD9CD] dark:border-[#2C323E] text-[#1A1D21] dark:text-[#F2EFE9] hover:border-[#C9372C] disabled:opacity-50 cursor-pointer"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                    {addedWords[v.word] ? c.inSrs : c.addSrs}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {activeLesson.kanjiList.length > 0 && (
                    <div className="pt-4 border-t border-[#ECE8DF] dark:border-[#262C36]">
                      <h3 className="text-sm font-semibold text-[#1A1D21] dark:text-[#F2EFE9] mb-4">
                        {formatT(c.keyKanji, { count: activeLesson.kanjiList.length })}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {activeLesson.kanjiList.map((k, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-xl bg-[#F7F5F0] dark:bg-[#111317] flex items-start gap-4"
                          >
                            <div className="w-16 h-16 rounded-lg bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36] flex items-center justify-center font-jp-serif text-3xl text-[#1A1D21] dark:text-[#F2EFE9] shrink-0">
                              {k.character}
                            </div>
                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <p className="font-medium text-sm text-[#1A1D21] dark:text-[#F2EFE9]">{k.meaning}</p>
                                <span className="text-xs font-mono-num text-[#5A606B] dark:text-[#9BA1AE]">
                                  {k.strokes} {c.strokesSuffix}
                                </span>
                              </div>
                              <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE]">
                                On: {k.onyomi} <span aria-hidden="true">·</span> Kun: {k.kunyomi}
                              </p>
                              <p className="text-xs text-[#3B404A] dark:text-[#C4C9D4]">{k.mnemonic}</p>
                              <p className="text-xs text-[#1E3A5F] dark:text-[#7FAEE3] pt-0.5">
                                {k.compounds.join(' · ')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'dialogo' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE]">{c.dialogueHint}</p>
                    <button
                      type="button"
                      onClick={() => setShowDialogueEs((v) => !v)}
                      className="text-xs font-medium text-[#1E3A5F] dark:text-[#7FAEE3] hover:underline whitespace-nowrap cursor-pointer"
                    >
                      {showDialogueEs ? c.hideEs : c.showEs}
                    </button>
                  </div>

                  <div className="divide-y divide-[#ECE8DF] dark:divide-[#262C36]">
                    {activeLesson.dialogue.map((line, i) => (
                      <div key={i} className="py-4 flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-[#C9372C] dark:text-[#E04F44]">
                            {line.speaker}
                          </p>
                          <p className="font-jp text-base font-medium text-[#1A1D21] dark:text-[#F2EFE9]">
                            {line.ja}
                          </p>
                          <p className="font-jp text-xs text-[#5A606B] dark:text-[#9BA1AE]">
                            {line.reading} <span aria-hidden="true">/</span> {line.romaji}
                          </p>
                          {showDialogueEs && (
                            <p className="text-sm text-[#4A505A] dark:text-[#B3B8C4] pt-0.5">{line.es}</p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSpeak(line.ja)}
                          disabled={speakingText === line.ja}
                          aria-label={`${c.listenPronunciation}: ${line.speaker}`}
                          className="p-2.5 rounded-lg border border-[#DFD9CD] dark:border-[#2C323E] text-[#1E3A5F] dark:text-[#7FAEE3] hover:border-[#C9372C] hover:text-[#C9372C] shrink-0 cursor-pointer disabled:opacity-50"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'ejercicios' && (
                <div className="space-y-6">
                  {activeLesson.exercises.map((q, idx) => {
                    const chosen = exerciseAnswers[q.id];
                    const isAnswered = chosen !== undefined;
                    const isCorrect = chosen === q.correctIndex;
                    return (
                      <div key={q.id} className="space-y-3 pb-6 border-b border-[#ECE8DF] dark:border-[#262C36] last:border-b-0">
                        <p className="text-sm font-medium text-[#1A1D21] dark:text-[#F2EFE9]">
                          {idx + 1}. {q.prompt}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {q.options.map((opt, optIdx) => {
                            const selected = chosen === optIdx;
                            let style =
                              'border-[#DFD9CD] dark:border-[#2C323E] bg-[#F7F5F0] dark:bg-[#111317] text-[#1A1D21] dark:text-[#F2EFE9] hover:border-[#1E3A5F]';
                            if (isAnswered && optIdx === q.correctIndex) {
                              style = 'border-[#2E6F52] bg-[#2E6F52]/10 text-[#1F543D] dark:text-[#6AD1A1]';
                            } else if (isAnswered && selected && !isCorrect) {
                              style = 'border-[#C9372C] bg-[#C9372C]/10 text-[#C9372C] dark:text-[#F06B60]';
                            }
                            return (
                              <button
                                key={optIdx}
                                type="button"
                                onClick={() => setExerciseAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                                className={`text-left px-4 py-2.5 rounded-lg border text-sm font-jp transition-colors cursor-pointer ${style}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {isAnswered && (
                          <p
                            className={`text-xs ${
                              isCorrect ? 'text-[#2E6F52] dark:text-[#5DC293]' : 'text-[#C9372C] dark:text-[#F06B60]'
                            }`}
                          >
                            {isCorrect ? c.correctPrefix : c.reviewPrefix}
                            {q.explanation}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'evaluacion' && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE]">{c.examHint}</p>
                    {examResult && (
                      <span
                        className={`text-sm font-mono-num font-semibold ${
                          examResult.passed
                            ? 'text-[#2E6F52] dark:text-[#5DC293]'
                            : 'text-[#C9372C] dark:text-[#F06B60]'
                        }`}
                      >
                        {c.examResultPrefix} {examResult.score}% · {examResult.passed ? c.examPassed : c.examRetryNote} (+
                        {examResult.xpEarned} XP)
                      </span>
                    )}
                  </div>

                  {activeLesson.unitExam.map((q, idx) => {
                    const chosen = examAnswers[q.id];
                    return (
                      <div key={q.id} className="space-y-3 pb-5 border-b border-[#ECE8DF] dark:border-[#262C36] last:border-b-0">
                        <p className="text-sm font-medium text-[#1A1D21] dark:text-[#F2EFE9]">
                          {c.questionPrefix} {idx + 1}. {q.prompt}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {q.options.map((opt, optIdx) => {
                            const selected = chosen === optIdx;
                            let style = selected
                              ? 'border-[#1E3A5F] dark:border-[#7FAEE3] bg-[#1E3A5F]/10 text-[#1A1D21] dark:text-[#F2EFE9]'
                              : 'border-[#DFD9CD] dark:border-[#2C323E] bg-[#F7F5F0] dark:bg-[#111317] text-[#1A1D21] dark:text-[#F2EFE9]';
                            if (examResult) {
                              if (optIdx === q.correctIndex) {
                                style = 'border-[#2E6F52] bg-[#2E6F52]/10 text-[#1F543D] dark:text-[#6AD1A1]';
                              } else if (selected && optIdx !== q.correctIndex) {
                                style = 'border-[#C9372C] bg-[#C9372C]/10 text-[#C9372C] dark:text-[#F06B60]';
                              }
                            }
                            return (
                              <button
                                key={optIdx}
                                type="button"
                                disabled={Boolean(examResult)}
                                onClick={() => setExamAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                                className={`text-left px-4 py-2.5 rounded-lg border text-sm font-jp transition-colors cursor-pointer disabled:cursor-default ${style}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {examResult && (
                          <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE]">{q.explanation}</p>
                        )}
                      </div>
                    );
                  })}

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      disabled={
                        submittingExam || Object.keys(examAnswers).length < activeLesson.unitExam.length
                      }
                      onClick={() => handleSubmitExam(activeLesson.unitExam)}
                      className="px-5 py-2.5 rounded-lg text-sm font-medium bg-[#C9372C] hover:bg-[#AE2D23] dark:bg-[#D9463B] text-white transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {submittingExam ? c.evaluatingExam : c.gradeExamBtn}
                    </button>
                    {examResult && (
                      <button
                        type="button"
                        onClick={() => {
                          setExamAnswers({});
                          setExamResult(null);
                        }}
                        className="px-4 py-2.5 rounded-lg text-sm font-medium border border-[#DFD9CD] dark:border-[#2C323E] text-[#1A1D21] dark:text-[#F2EFE9] cursor-pointer"
                      >
                        {c.retryExamBtn}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
