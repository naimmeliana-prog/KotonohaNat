import {
  BookOpenCheck,
  Check,
  Languages,
  MessageSquarePlus,
  Send,
  Sparkles,
  UserCheck,
  Wand2,
} from 'lucide-react';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { formatT } from '../i18n/translations';
import { useLanguage } from '../i18n/LanguageContext';
import { api } from '../lib/api';
import {
  addResponseCorrection,
  createDailyPrompt,
  createExchangeResponse,
  fetchDailyPrompts,
  fetchExchangeResponses,
  updateExchangeProfile,
} from '../lib/firestoreService';
import type {
  AuthUser,
  BridgeExplanation,
  BridgeReplySuggestion,
  DailyPrompt,
  ExchangeInterest,
  ExchangeLevel,
  ExchangeResponse,
} from '../types/kotonoha';

interface LanguageExchangeViewProps {
  user: AuthUser | null;
  onRequireAuth: () => void;
  onUserUpdated: (user: AuthUser) => void;
}

const INTEREST_KEYS: ExchangeInterest[] = [
  'anime_manga',
  'travel',
  'gastronomy',
  'music',
  'culture',
  'daily_life',
];

export function LanguageExchangeView({
  user,
  onRequireAuth,
  onUserUpdated,
}: LanguageExchangeViewProps) {
  const { lang, t } = useLanguage();
  const ex = t.exchange;

  // Profile form state
  const hasCompleteProfile = Boolean(
    user?.learningLang && user?.learningLevel && user?.interests && user.interests.length > 0
  );
  const [profileExpanded, setProfileExpanded] = useState(!hasCompleteProfile);
  const [nickname, setNickname] = useState(user?.username || '');
  const [nativeLang, setNativeLang] = useState<'es' | 'ja' | 'other'>(
    user?.nativeLang || (lang === 'ja' ? 'ja' : 'es')
  );
  const [learningLang, setLearningLang] = useState<'es' | 'ja'>(
    user?.learningLang || (user?.nativeLang === 'ja' || lang === 'ja' ? 'es' : 'ja')
  );
  const [learningLevel, setLearningLevel] = useState<ExchangeLevel>(user?.learningLevel || 'beginner');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    user?.interests && user.interests.length > 0 ? user.interests : ['culture', 'gastronomy', 'daily_life']
  );
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [profileErr, setProfileErr] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setNickname(user.username);
      setNativeLang(user.nativeLang);
      setLearningLang(user.learningLang || (user.nativeLang === 'ja' ? 'es' : 'ja'));
      setLearningLevel(user.learningLevel || 'beginner');
      if (user.interests && user.interests.length > 0) {
        setSelectedInterests(user.interests);
      }
      setProfileExpanded(!(user.learningLang && user.learningLevel && user.interests && user.interests.length > 0));
    } else {
      setProfileExpanded(true);
    }
  }, [user]);

  // Daily prompts & responses state
  const [prompts, setPrompts] = useState<DailyPrompt[]>([]);
  const [selectedPromptId, setSelectedPromptId] = useState<string>('');
  const [responses, setResponses] = useState<ExchangeResponse[]>([]);
  const [wallLoading, setWallLoading] = useState(true);
  const [wallError, setWallError] = useState<string | null>(null);
  const [generatingPrompt, setGeneratingPrompt] = useState(false);

  // Composer state
  const [responseDraft, setResponseDraft] = useState('');
  const [publishingResp, setPublishingResp] = useState(false);

  // Inline correction / reply drawer state per response
  const [openThreadId, setOpenThreadId] = useState<string | null>(null);
  const [threadKind, setThreadKind] = useState<Record<string, 'correction' | 'reply'>>({});
  const [correctedDrafts, setCorrectedDrafts] = useState<Record<string, string>>({});
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [sendingThreadId, setSendingThreadId] = useState<string | null>(null);

  // AI Bridge state per response ID
  const [explainOpen, setExplainOpen] = useState<Record<string, boolean>>({});
  const [explainLoading, setExplainLoading] = useState<Record<string, boolean>>({});
  const [explainData, setExplainData] = useState<Record<string, BridgeExplanation>>({});

  const [repliesOpen, setRepliesOpen] = useState<Record<string, boolean>>({});
  const [repliesLoading, setRepliesLoading] = useState<Record<string, boolean>>({});
  const [repliesData, setRepliesData] = useState<Record<string, BridgeReplySuggestion[]>>({});

  const loadWall = useCallback(async (preferredPromptId?: string) => {
    setWallLoading(true);
    setWallError(null);
    try {
      const promptList = await fetchDailyPrompts();
      setPrompts(promptList);
      const activeId = preferredPromptId || selectedPromptId || promptList[0]?.id || '';
      if (activeId && activeId !== selectedPromptId) {
        setSelectedPromptId(activeId);
      }
      if (activeId) {
        const respList = await fetchExchangeResponses(activeId);
        setResponses(respList);
      } else {
        setResponses([]);
      }
    } catch (err) {
      setWallError(err instanceof Error ? err.message : t.errors.fallbackMsg);
    } finally {
      setWallLoading(false);
    }
  }, [selectedPromptId, t.errors.fallbackMsg]);

  useEffect(() => {
    loadWall();
  }, [loadWall]);

  const activePrompt = prompts.find((p) => p.id === selectedPromptId) || prompts[0] || null;

  const toggleInterest = (key: ExchangeInterest) => {
    setProfileErr(null);
    setSelectedInterests((prev) => {
      if (prev.includes(key)) {
        return prev.filter((item) => item !== key);
      }
      if (prev.length >= 3) {
        setProfileErr(ex.errors.maxInterests);
        return prev;
      }
      return [...prev, key];
    });
  };

  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      onRequireAuth();
      return;
    }
    if (nickname.trim().length < 2) {
      setProfileErr(ex.errors.minLength);
      return;
    }
    setSavingProfile(true);
    setProfileErr(null);
    setProfileMsg(null);
    try {
      await updateExchangeProfile(user.uid, {
        username: nickname.trim().slice(0, 30),
        nativeLang,
        learningLang,
        learningLevel,
        interests: selectedInterests.slice(0, 3),
      });
      onUserUpdated({
        ...user,
        username: nickname.trim().slice(0, 30),
        nativeLang,
        learningLang,
        learningLevel,
        interests: selectedInterests.slice(0, 3),
      });
      setProfileMsg(ex.profileSavedNotice);
      setProfileExpanded(false);
    } catch (err) {
      setProfileErr(err instanceof Error ? err.message : t.errors.fallbackMsg);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleGeneratePrompt = async () => {
    setGeneratingPrompt(true);
    setWallError(null);
    try {
      const generated = await api.generateDailyPrompt(lang);
      if (user) {
        const saved = await createDailyPrompt(user, {
          promptEs: generated.promptEs,
          promptJa: generated.promptJa,
          topicTag: generated.topicTag,
          isAiGenerated: true,
        });
        setPrompts((prev) => [saved, ...prev]);
        setSelectedPromptId(saved.id);
        setResponses([]);
      } else {
        const localPrompt: DailyPrompt = {
          id: `local_ai_${Date.now()}`,
          promptEs: generated.promptEs,
          promptJa: generated.promptJa,
          topicTag: generated.topicTag,
          authorUid: 'guest_preview',
          isAiGenerated: true,
          responsesCount: 0,
          createdAt: new Date().toISOString(),
        };
        setPrompts((prev) => [localPrompt, ...prev]);
        setSelectedPromptId(localPrompt.id);
        setResponses([]);
      }
    } catch (err) {
      setWallError(err instanceof Error ? err.message : t.errors.fallbackMsg);
    } finally {
      setGeneratingPrompt(false);
    }
  };

  const handlePublishResponse = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      onRequireAuth();
      return;
    }
    if (!activePrompt) return;
    if (responseDraft.trim().length < 2) {
      setWallError(ex.errors.minLength);
      return;
    }
    setPublishingResp(true);
    setWallError(null);
    try {
      await createExchangeResponse(
        user,
        activePrompt,
        responseDraft.trim(),
        user.learningLevel || learningLevel
      );
      setResponseDraft('');
      await loadWall(activePrompt.id);
    } catch (err) {
      setWallError(err instanceof Error ? err.message : t.errors.fallbackMsg);
    } finally {
      setPublishingResp(false);
    }
  };

  const handleSendCorrection = async (responseId: string) => {
    if (!user) {
      onRequireAuth();
      return;
    }
    const comment = (commentDrafts[responseId] || '').trim();
    if (comment.length < 2) {
      setWallError(ex.errors.commentMinLength);
      return;
    }
    const kind = threadKind[responseId] || 'correction';
    const correctedText = (correctedDrafts[responseId] || '').trim();

    setSendingThreadId(responseId);
    setWallError(null);
    try {
      await addResponseCorrection(user, responseId, {
        kind,
        correctedText: kind === 'correction' && correctedText ? correctedText : undefined,
        comment,
      });
      setCommentDrafts((prev) => ({ ...prev, [responseId]: '' }));
      setCorrectedDrafts((prev) => ({ ...prev, [responseId]: '' }));
      setOpenThreadId(null);
      await loadWall(activePrompt?.id);
    } catch (err) {
      setWallError(err instanceof Error ? err.message : t.errors.fallbackMsg);
    } finally {
      setSendingThreadId(null);
    }
  };

  const handleBridgeExplain = async (resp: ExchangeResponse) => {
    const isCurrentlyOpen = Boolean(explainOpen[resp.id]);
    if (isCurrentlyOpen) {
      setExplainOpen((prev) => ({ ...prev, [resp.id]: false }));
      return;
    }
    setExplainOpen((prev) => ({ ...prev, [resp.id]: true }));
    if (explainData[resp.id]) return;

    setExplainLoading((prev) => ({ ...prev, [resp.id]: true }));
    setWallError(null);
    try {
      const result = await api.bridgeExplain(resp.content, lang);
      setExplainData((prev) => ({ ...prev, [resp.id]: result }));
    } catch (err) {
      setWallError(err instanceof Error ? err.message : t.errors.fallbackMsg);
      setExplainOpen((prev) => ({ ...prev, [resp.id]: false }));
    } finally {
      setExplainLoading((prev) => ({ ...prev, [resp.id]: false }));
    }
  };

  const handleBridgeReplies = async (resp: ExchangeResponse) => {
    const isCurrentlyOpen = Boolean(repliesOpen[resp.id]);
    if (isCurrentlyOpen) {
      setRepliesOpen((prev) => ({ ...prev, [resp.id]: false }));
      return;
    }
    setRepliesOpen((prev) => ({ ...prev, [resp.id]: true }));
    if (repliesData[resp.id]) return;

    setRepliesLoading((prev) => ({ ...prev, [resp.id]: true }));
    setWallError(null);
    try {
      const promptCtx = activePrompt ? `${activePrompt.promptEs} / ${activePrompt.promptJa}` : '';
      const result = await api.bridgeReplies(resp.content, promptCtx, lang);
      setRepliesData((prev) => ({ ...prev, [resp.id]: result.suggestions }));
    } catch (err) {
      setWallError(err instanceof Error ? err.message : t.errors.fallbackMsg);
      setRepliesOpen((prev) => ({ ...prev, [resp.id]: false }));
    } finally {
      setRepliesLoading((prev) => ({ ...prev, [resp.id]: false }));
    }
  };

  const handleApplySuggestion = (respId: string, text: string) => {
    setOpenThreadId(respId);
    setThreadKind((prev) => ({ ...prev, [respId]: 'reply' }));
    setCommentDrafts((prev) => ({ ...prev, [respId]: text }));
  };

  const interestLabel = (key: string) => {
    const map = ex.interests as Record<string, string>;
    return map[key] || key;
  };

  const levelLabel = (lv: ExchangeLevel) => ex.levels[lv] || lv;

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#DFD9CD] dark:border-[#262C36] pb-6">
        <div className="space-y-1.5">
          <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE]">{ex.eyebrow}</p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#1A1D21] dark:text-[#F2EFE9]">
            {ex.title}
          </h1>
          <p className="text-sm text-[#4A505A] dark:text-[#B3B8C4] max-w-2xl leading-relaxed">{ex.subtitle}</p>
        </div>

        {user && (
          <button
            type="button"
            onClick={() => setProfileExpanded((v) => !v)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium border border-[#DFD9CD] dark:border-[#2C323E] bg-white dark:bg-[#191C22] text-[#1A1D21] dark:text-[#F2EFE9] hover:border-[#C9372C] self-start md:self-auto cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-[#C9372C] dark:text-[#E04F44]" />
            {ex.profileTitle}
          </button>
        )}
      </div>

      {/* Section 1: Exchange Profile Card (Firestore users collection) */}
      {(profileExpanded || !user) && (
        <section className="rounded-2xl bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36] p-6 sm:p-7 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-semibold text-[#1A1D21] dark:text-[#F2EFE9]">
                {ex.profileTitle}
              </h2>
              <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE] mt-1">{ex.profileIncompleteHint}</p>
            </div>
            {!user && (
              <button
                type="button"
                onClick={onRequireAuth}
                className="px-4 py-2 rounded-lg text-xs font-medium bg-[#C9372C] hover:bg-[#AE2D23] text-white cursor-pointer"
              >
                {ex.signInBtn}
              </button>
            )}
          </div>

          {!user ? (
            <p className="text-sm text-[#5A606B] dark:text-[#9BA1AE]">{ex.signInPrompt}</p>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#5A606B] dark:text-[#9BA1AE] mb-1.5">
                    {ex.nicknameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    minLength={2}
                    maxLength={30}
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder={ex.nicknamePlaceholder}
                    className="w-full rounded-lg border border-[#DFD9CD] dark:border-[#2C323E] bg-[#F7F5F0] dark:bg-[#111317] px-3 py-2 text-sm text-[#1A1D21] dark:text-[#F2EFE9]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#5A606B] dark:text-[#9BA1AE] mb-1.5">
                    {ex.nativeLangLabel}
                  </label>
                  <select
                    value={nativeLang}
                    onChange={(e) => {
                      const val = e.target.value as 'es' | 'ja' | 'other';
                      setNativeLang(val);
                      if (val === 'ja') setLearningLang('es');
                      else if (val === 'es') setLearningLang('ja');
                    }}
                    className="w-full rounded-lg border border-[#DFD9CD] dark:border-[#2C323E] bg-[#F7F5F0] dark:bg-[#111317] px-3 py-2 text-sm text-[#1A1D21] dark:text-[#F2EFE9]"
                  >
                    <option value="es">{ex.nativeEs}</option>
                    <option value="ja">{ex.nativeJa}</option>
                    <option value="other">{ex.nativeOther}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#5A606B] dark:text-[#9BA1AE] mb-1.5">
                    {ex.learningLangLabel}
                  </label>
                  <select
                    value={learningLang}
                    onChange={(e) => setLearningLang(e.target.value as 'es' | 'ja')}
                    className="w-full rounded-lg border border-[#DFD9CD] dark:border-[#2C323E] bg-[#F7F5F0] dark:bg-[#111317] px-3 py-2 text-sm text-[#1A1D21] dark:text-[#F2EFE9]"
                  >
                    <option value="ja">{ex.learningJa}</option>
                    <option value="es">{ex.learningEs}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#5A606B] dark:text-[#9BA1AE] mb-1.5">
                    {ex.levelLabel}
                  </label>
                  <select
                    value={learningLevel}
                    onChange={(e) => setLearningLevel(e.target.value as ExchangeLevel)}
                    className="w-full rounded-lg border border-[#DFD9CD] dark:border-[#2C323E] bg-[#F7F5F0] dark:bg-[#111317] px-3 py-2 text-sm text-[#1A1D21] dark:text-[#F2EFE9]"
                  >
                    <option value="beginner">{ex.levels.beginner}</option>
                    <option value="intermediate">{ex.levels.intermediate}</option>
                    <option value="advanced">{ex.levels.advanced}</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                  <label className="text-xs font-medium text-[#5A606B] dark:text-[#9BA1AE]">
                    {formatT(ex.interestsLabel, { count: selectedInterests.length })}
                  </label>
                  <span className="text-xs text-[#5A606B] dark:text-[#9BA1AE]">{ex.interestsHelper}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {INTEREST_KEYS.map((key) => {
                    const active = selectedInterests.includes(key);
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => toggleInterest(key)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-colors cursor-pointer flex items-center justify-between gap-1.5 ${
                          active
                            ? 'border-[#C9372C] dark:border-[#E04F44] bg-[#C9372C]/8 text-[#C9372C] dark:text-[#E04F44]'
                            : 'border-[#DFD9CD] dark:border-[#2C323E] bg-[#F7F5F0] dark:bg-[#111317] text-[#1A1D21] dark:text-[#F2EFE9]'
                        }`}
                      >
                        <span className="truncate">{interestLabel(key)}</span>
                        {active && <Check className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {profileErr && <p className="text-xs text-[#C9372C] dark:text-[#F06B60]">{profileErr}</p>}
              {profileMsg && <p className="text-xs text-[#2E6F52] dark:text-[#5DC293]">{profileMsg}</p>}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium bg-[#1E3A5F] hover:bg-[#162C49] dark:bg-[#4978B0] text-white transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {savingProfile ? ex.savingProfileBtn : ex.saveProfileBtn}
                </button>
              </div>
            </form>
          )}
        </section>
      )}

      {/* Compact summary bar when profile is saved */}
      {user && !profileExpanded && hasCompleteProfile && (
        <div className="rounded-xl bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36] px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[#5A606B] dark:text-[#9BA1AE]">
            <span className="font-medium text-[#1A1D21] dark:text-[#F2EFE9]">{user.username}</span>
            <span>
              {user.nativeLang === 'ja' ? ex.nativeJa : user.nativeLang === 'es' ? ex.nativeEs : ex.nativeOther} →{' '}
              {user.learningLang === 'es' ? ex.learningEs : ex.learningJa} ({levelLabel(user.learningLevel || 'beginner')})
            </span>
            <span>{(user.interests || []).map(interestLabel).join(' · ')}</span>
          </div>
          {profileMsg && <span className="text-[#2E6F52] dark:text-[#5DC293]">{profileMsg}</span>}
        </div>
      )}

      {/* Section 2: Daily Prompts Wall + AI Topic Generator */}
      <section className="rounded-2xl bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36] p-6 sm:p-7 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#5A606B] dark:text-[#9BA1AE]">
            <span>{ex.dailyPromptEyebrow}</span>
            {activePrompt && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#1E3A5F] dark:text-[#7FAEE3] font-medium">
                  {interestLabel(activePrompt.topicTag)}
                </span>
                {activePrompt.isAiGenerated && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#C9372C] dark:text-[#E04F44]">{ex.aiGeneratedBadge}</span>
                  </>
                )}
              </>
            )}
          </div>

          <button
            type="button"
            onClick={handleGeneratePrompt}
            disabled={generatingPrompt}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-[#C9372C] hover:bg-[#AE2D23] dark:bg-[#D9463B] text-white transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Wand2 className="w-3.5 h-3.5" />
            {generatingPrompt ? ex.generatingPromptBtn : ex.generatePromptBtn}
          </button>
        </div>

        {activePrompt && (
          <div className="p-5 rounded-xl bg-[#F7F5F0] dark:bg-[#111317] border border-[#DFD9CD]/70 dark:border-[#262C36] space-y-2">
            {lang === 'ja' ? (
              <>
                <p className="font-jp text-xl sm:text-2xl font-medium text-[#1A1D21] dark:text-[#F2EFE9] leading-snug">
                  {activePrompt.promptJa}
                </p>
                <p className="text-sm text-[#5A606B] dark:text-[#9BA1AE]">{activePrompt.promptEs}</p>
              </>
            ) : (
              <>
                <p className="font-display text-2xl sm:text-[1.75rem] font-semibold text-[#1A1D21] dark:text-[#F2EFE9] leading-snug">
                  {activePrompt.promptEs}
                </p>
                <p className="font-jp text-sm text-[#5A606B] dark:text-[#9BA1AE]">{activePrompt.promptJa}</p>
              </>
            )}
          </div>
        )}

        {prompts.length > 1 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#5A606B] dark:text-[#9BA1AE]">{ex.otherPromptsLabel}</span>
            {prompts.slice(0, 6).map((p, idx) => {
              const selected = p.id === activePrompt?.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setSelectedPromptId(p.id);
                    loadWall(p.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    selected
                      ? 'border-[#1E3A5F] dark:border-[#7FAEE3] bg-[#1E3A5F]/10 text-[#1E3A5F] dark:text-[#7FAEE3]'
                      : 'border-[#DFD9CD] dark:border-[#2C323E] text-[#5A606B] dark:text-[#9BA1AE] hover:text-[#1A1D21] dark:hover:text-[#F2EFE9]'
                  }`}
                >
                  #{idx + 1} · {interestLabel(p.topicTag)} ({p.responsesCount} {ex.responsesCountSuffix})
                </button>
              );
            })}
          </div>
        )}
      </section>

      {wallError && (
        <div className="p-4 rounded-xl border border-[#C9372C]/40 bg-[#C9372C]/5 text-xs text-[#C9372C] dark:text-[#F06B60]">
          {wallError}
        </div>
      )}

      {/* Section 3: Composer + Async Responses Thread with AI Bridge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36] p-6 space-y-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-[#1A1D21] dark:text-[#F2EFE9]">
              {ex.composerTitle}
            </h2>
            <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE] mt-1 leading-relaxed">
              {learningLang === 'ja' ? ex.composerSubtitleEs : ex.composerSubtitleJa}
            </p>
          </div>

          <form onSubmit={handlePublishResponse} className="space-y-3">
            <textarea
              rows={5}
              maxLength={2000}
              value={responseDraft}
              onChange={(e) => setResponseDraft(e.target.value)}
              placeholder={ex.composerPlaceholder}
              className="w-full rounded-lg border border-[#DFD9CD] dark:border-[#2C323E] bg-[#F7F5F0] dark:bg-[#111317] px-3.5 py-2.5 text-sm text-[#1A1D21] dark:text-[#F2EFE9]"
            />
            <button
              type="submit"
              disabled={publishingResp}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-[#1E3A5F] hover:bg-[#162C49] dark:bg-[#4978B0] text-white transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              {publishingResp ? ex.publishingResponseBtn : ex.publishResponseBtn}
            </button>
          </form>
        </div>

        <div className="lg:col-span-7 space-y-4">
          {wallLoading ? (
            <div className="p-10 text-center text-sm text-[#5A606B] dark:text-[#9BA1AE]">{ex.loadingWall}</div>
          ) : responses.length === 0 ? (
            <div className="rounded-2xl bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36] p-8 text-center">
              <p className="text-sm text-[#5A606B] dark:text-[#9BA1AE]">{ex.emptyResponses}</p>
            </div>
          ) : (
            responses.map((resp) => {
              const explainInfo = explainData[resp.id];
              const isExplainOpen = Boolean(explainOpen[resp.id]);
              const isExplainBusy = Boolean(explainLoading[resp.id]);

              const replySuggestions = repliesData[resp.id];
              const isRepliesOpen = Boolean(repliesOpen[resp.id]);
              const isRepliesBusy = Boolean(repliesLoading[resp.id]);

              const threadOpen = openThreadId === resp.id;
              const currentKind = threadKind[resp.id] || 'correction';

              return (
                <article
                  key={resp.id}
                  className="rounded-2xl bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36] p-6 space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#5A606B] dark:text-[#9BA1AE]">
                    <div className="flex flex-wrap items-center gap-2">
                      <strong className="text-sm text-[#1A1D21] dark:text-[#F2EFE9]">{resp.authorUsername}</strong>
                      <span>
                        · {resp.authorNativeLang === 'ja' ? ex.nativeJa : resp.authorNativeLang === 'es' ? ex.nativeEs : ex.nativeOther}
                      </span>
                      <span>
                        · {ex.learningBadgePrefix}{' '}
                        {resp.targetLang === 'ja' ? ex.learningJa : ex.learningEs} ({levelLabel(resp.authorLevel)})
                      </span>
                    </div>
                    <span>{resp.createdAt.slice(0, 10)}</span>
                  </div>

                  <p className="font-jp text-base text-[#1A1D21] dark:text-[#F2EFE9] leading-relaxed whitespace-pre-line">
                    {resp.content}
                  </p>

                  {/* AI Bridge + Correct/Reply Action Row */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#ECE8DF] dark:border-[#262C36]">
                    <button
                      type="button"
                      onClick={() => handleBridgeExplain(resp)}
                      disabled={isExplainBusy}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#1E3A5F]/30 dark:border-[#7FAEE3]/30 text-[#1E3A5F] dark:text-[#7FAEE3] hover:bg-[#1E3A5F]/5 cursor-pointer disabled:opacity-50"
                    >
                      <Languages className="w-3.5 h-3.5" />
                      {isExplainBusy ? ex.bridgeExplainingBtn : ex.bridgeExplainBtn}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleBridgeReplies(resp)}
                      disabled={isRepliesBusy}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#2E6F52]/30 dark:border-[#5DC293]/30 text-[#2E6F52] dark:text-[#5DC293] hover:bg-[#2E6F52]/5 cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {isRepliesBusy ? ex.bridgeSuggestingBtn : ex.bridgeRepliesBtn}
                    </button>

                    <button
                      type="button"
                      onClick={() => setOpenThreadId(threadOpen ? null : resp.id)}
                      className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#F7F5F0] dark:bg-[#111317] border border-[#DFD9CD] dark:border-[#2C323E] text-[#1A1D21] dark:text-[#F2EFE9] hover:border-[#C9372C] cursor-pointer"
                    >
                      <MessageSquarePlus className="w-3.5 h-3.5 text-[#C9372C]" />
                      {threadOpen ? ex.closeFormBtn : ex.correctReplyBtn}
                    </button>
                  </div>

                  {/* AI Bridge Panel 1: Translate & Explain */}
                  {isExplainOpen && (
                    <div className="p-4 rounded-xl bg-[#F7F5F0] dark:bg-[#111317] border border-[#1E3A5F]/20 dark:border-[#7FAEE3]/20 space-y-2.5 text-xs">
                      <p className="font-semibold text-[#1E3A5F] dark:text-[#7FAEE3]">{ex.bridgeExplainTitle}</p>
                      {isExplainBusy ? (
                        <p className="text-[#5A606B] dark:text-[#9BA1AE]">{ex.bridgeExplainingBtn}</p>
                      ) : explainInfo ? (
                        <>
                          <div>
                            <span className="font-medium text-[#5A606B] dark:text-[#9BA1AE]">
                              {ex.bridgeTranslationLabel}:{' '}
                            </span>
                            <span className="text-[#1A1D21] dark:text-[#F2EFE9]">{explainInfo.translation}</span>
                          </div>
                          {explainInfo.reading && (
                            <div>
                              <span className="font-medium text-[#5A606B] dark:text-[#9BA1AE]">
                                {ex.bridgeReadingLabel}:{' '}
                              </span>
                              <span className="font-jp text-[#C9372C] dark:text-[#E04F44]">{explainInfo.reading}</span>
                            </div>
                          )}
                          {explainInfo.grammarNotes.length > 0 && (
                            <div className="pt-1 space-y-1">
                              <p className="font-medium text-[#5A606B] dark:text-[#9BA1AE]">{ex.bridgeGrammarLabel}:</p>
                              <ul className="space-y-1">
                                {explainInfo.grammarNotes.map((g, i) => (
                                  <li key={i} className="text-[#3B404A] dark:text-[#C4C9D4]">
                                    <strong className="font-jp text-[#1A1D21] dark:text-[#F2EFE9]">{g.point}:</strong>{' '}
                                    {g.explanation}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </>
                      ) : null}
                    </div>
                  )}

                  {/* AI Bridge Panel 2: Suggest 3 Natural Replies */}
                  {isRepliesOpen && (
                    <div className="p-4 rounded-xl bg-[#F7F5F0] dark:bg-[#111317] border border-[#2E6F52]/20 dark:border-[#5DC293]/20 space-y-3 text-xs">
                      <p className="font-semibold text-[#2E6F52] dark:text-[#5DC293]">{ex.bridgeRepliesTitle}</p>
                      {isRepliesBusy ? (
                        <p className="text-[#5A606B] dark:text-[#9BA1AE]">{ex.bridgeSuggestingBtn}</p>
                      ) : replySuggestions ? (
                        <div className="space-y-2">
                          {replySuggestions.map((s, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-lg bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                            >
                              <div className="space-y-0.5 min-w-0">
                                <span className="text-[11px] font-semibold text-[#1E3A5F] dark:text-[#7FAEE3]">
                                  {ex.registers[s.register]}
                                </span>
                                <p className="font-jp text-sm font-medium text-[#1A1D21] dark:text-[#F2EFE9]">
                                  {s.text}
                                </p>
                                {s.reading && (
                                  <p className="font-jp text-[11px] text-[#5A606B] dark:text-[#9BA1AE]">{s.reading}</p>
                                )}
                                <p className="text-[#4A505A] dark:text-[#B3B8C4]">{s.gloss}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleApplySuggestion(resp.id, s.text)}
                                className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-[#1E3A5F] hover:bg-[#162C49] text-white shrink-0 self-start sm:self-center cursor-pointer"
                              >
                                {ex.useSuggestionBtn}
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  )}

                  {/* Inline Correction / Reply Form */}
                  {threadOpen && (
                    <div className="p-4 rounded-xl bg-[#F7F5F0] dark:bg-[#111317] border border-[#DFD9CD] dark:border-[#2C323E] space-y-3">
                      <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-[#ECE8DF] dark:bg-[#191C22]">
                        <button
                          type="button"
                          onClick={() => setThreadKind((prev) => ({ ...prev, [resp.id]: 'correction' }))}
                          className={`py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                            currentKind === 'correction'
                              ? 'bg-white dark:bg-[#272D38] text-[#C9372C] dark:text-[#E04F44]'
                              : 'text-[#5A606B] dark:text-[#9BA1AE]'
                          }`}
                        >
                          {ex.kindCorrection}
                        </button>
                        <button
                          type="button"
                          onClick={() => setThreadKind((prev) => ({ ...prev, [resp.id]: 'reply' }))}
                          className={`py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                            currentKind === 'reply'
                              ? 'bg-white dark:bg-[#272D38] text-[#1E3A5F] dark:text-[#7FAEE3]'
                              : 'text-[#5A606B] dark:text-[#9BA1AE]'
                          }`}
                        >
                          {ex.kindReply}
                        </button>
                      </div>

                      {currentKind === 'correction' && (
                        <div>
                          <label className="block text-xs font-medium text-[#5A606B] dark:text-[#9BA1AE] mb-1">
                            {ex.correctedTextLabel}
                          </label>
                          <input
                            type="text"
                            maxLength={2000}
                            value={correctedDrafts[resp.id] || ''}
                            onChange={(e) =>
                              setCorrectedDrafts((prev) => ({ ...prev, [resp.id]: e.target.value }))
                            }
                            placeholder={ex.correctedTextPlaceholder}
                            className="w-full rounded-lg border border-[#DFD9CD] dark:border-[#2C323E] bg-white dark:bg-[#191C22] px-3 py-2 text-xs text-[#1A1D21] dark:text-[#F2EFE9]"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-medium text-[#5A606B] dark:text-[#9BA1AE] mb-1">
                          {ex.commentLabel}
                        </label>
                        <textarea
                          rows={2}
                          maxLength={1500}
                          value={commentDrafts[resp.id] || ''}
                          onChange={(e) =>
                            setCommentDrafts((prev) => ({ ...prev, [resp.id]: e.target.value }))
                          }
                          placeholder={ex.commentPlaceholder}
                          className="w-full rounded-lg border border-[#DFD9CD] dark:border-[#2C323E] bg-white dark:bg-[#191C22] px-3 py-2 text-xs text-[#1A1D21] dark:text-[#F2EFE9]"
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          disabled={sendingThreadId === resp.id}
                          onClick={() => handleSendCorrection(resp.id)}
                          className="px-4 py-2 rounded-lg text-xs font-medium bg-[#C9372C] hover:bg-[#AE2D23] text-white cursor-pointer disabled:opacity-50"
                        >
                          {sendingThreadId === resp.id ? ex.sendingFeedbackBtn : ex.sendFeedbackBtn}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Threaded Corrections & Replies */}
                  {resp.corrections && resp.corrections.length > 0 && (
                    <div className="pl-4 border-l-2 border-[#DFD9CD] dark:border-[#2C323E] space-y-3 pt-1">
                      <p className="text-[11px] font-medium text-[#5A606B] dark:text-[#9BA1AE] flex items-center gap-1.5">
                        <BookOpenCheck className="w-3.5 h-3.5 text-[#2E6F52] dark:text-[#5DC293]" />
                        {ex.correctionsTitle} ({resp.corrections.length})
                      </p>
                      {resp.corrections.map((c) => (
                        <div key={c.id} className="space-y-1 text-xs">
                          <p className="text-[#5A606B] dark:text-[#9BA1AE]">
                            <strong className="text-[#1A1D21] dark:text-[#F2EFE9]">{c.authorUsername}</strong> ·{' '}
                            <span
                              className={
                                c.kind === 'correction'
                                  ? 'text-[#2E6F52] dark:text-[#5DC293] font-medium'
                                  : 'text-[#1E3A5F] dark:text-[#7FAEE3] font-medium'
                              }
                            >
                              {c.kind === 'correction' ? ex.correctionTag : ex.replyTag}
                            </span>{' '}
                            · {c.createdAt.slice(0, 16)}
                          </p>
                          {c.correctedText && (
                            <p className="font-jp px-2.5 py-1.5 rounded-md bg-[#2E6F52]/10 text-[#1F543D] dark:text-[#6AD1A1]">
                              <span className="font-semibold">{ex.correctedLabel} </span>
                              {c.correctedText}
                            </p>
                          )}
                          <p className="text-[#3B404A] dark:text-[#C4C9D4] leading-relaxed">{c.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
