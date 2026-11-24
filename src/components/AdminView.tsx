import { signInWithPopup } from 'firebase/auth';
import {
  Activity,
  Database,
  FileUp,
  Lock,
  Plus,
  RefreshCw,
  Shield,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatT } from '../i18n/translations';
import { useLanguage } from '../i18n/LanguageContext';
import { api } from '../lib/api';
import { ADMIN_EMAIL, auth, googleProvider } from '../lib/firebase';
import {
  adminDeleteDictionaryEntry,
  adminDeleteLesson,
  adminSaveDictionaryEntries,
  adminSaveLesson,
  fetchAdminFirestoreCounts,
  fetchDictionaryEntries,
  fetchLessons,
  seedFirestoreCatalogIfEmpty,
} from '../lib/firestoreService';
import type {
  AdminTelemetryResponse,
  AuthUser,
  DictionaryEntry,
  ExerciseQuestion,
  JlptLevel,
  Lesson,
} from '../types/kotonoha';

interface AdminViewProps {
  user: AuthUser | null;
  darkMode: boolean;
  onOpenAuth: () => void;
  onContentUpdated: () => void;
}

const LEVELS: JlptLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1'];

interface FirestoreCounts {
  users: number;
  lessons: number;
  dictionaryEntries: number;
  forumPosts: number;
  chatMessages: number;
}

function normalizeExercises(raw: unknown, prefix: string): ExerciseQuestion[] {
  if (!Array.isArray(raw)) return [];
  const out: ExerciseQuestion[] = [];
  raw.forEach((item, idx) => {
    const q = item as Partial<ExerciseQuestion>;
    const options = Array.isArray(q.options) ? q.options.map(String).filter(Boolean) : [];
    if (!q.prompt || options.length < 2) return;
    const correctIdx =
      typeof q.correctIndex === 'number' && q.correctIndex >= 0 && q.correctIndex < options.length
        ? q.correctIndex
        : 0;
    const qType: ExerciseQuestion['type'] =
      q.type === 'fill' || q.type === 'translate' ? q.type : 'choice';
    const base: ExerciseQuestion = {
      id: String(q.id || `${prefix}_${idx + 1}`),
      type: qType,
      prompt: String(q.prompt),
      options,
      correctIndex: correctIdx,
      explanation: String(q.explanation || ''),
    };
    if (q.promptJa) {
      base.promptJa = String(q.promptJa);
    }
    out.push(base);
  });
  return out;
}

export function AdminView({ user, darkMode, onOpenAuth, onContentUpdated }: AdminViewProps) {
  const { t } = useLanguage();
  const a = t.admin;

  const [telemetry, setTelemetry] = useState<AdminTelemetryResponse | null>(null);
  const [counts, setCounts] = useState<FirestoreCounts | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [dictEntries, setDictEntries] = useState<DictionaryEntry[]>([]);
  const [adminTab, setAdminTab] = useState<'monitor' | 'pdf' | 'contenido'>('monitor');
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [actionErr, setActionErr] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [signingInAdmin, setSigningInAdmin] = useState(false);

  // PDF Importer state
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfMode, setPdfMode] = useState<'lesson' | 'dictionary'>('lesson');
  const [pdfLevel, setPdfLevel] = useState<JlptLevel>('N5');
  const [pdfSourceName, setPdfSourceName] = useState('');
  const [pdfImporting, setPdfImporting] = useState(false);

  // Quick dictionary add form
  const [dWord, setDWord] = useState('');
  const [dReading, setDReading] = useState('');
  const [dRomaji, setDRomaji] = useState('');
  const [dMeaning, setDMeaning] = useState('');
  const [dLevel, setDLevel] = useState<JlptLevel>('N5');
  const [dSource, setDSource] = useState('');

  const autoSeedTriggeredRef = useRef(false);

  const loadAdminData = useCallback(async () => {
    if (!user?.isAdmin) return;
    try {
      const [tel, cnt, ls, dc] = await Promise.all([
        api.adminTelemetry(),
        fetchAdminFirestoreCounts(),
        fetchLessons(),
        fetchDictionaryEntries({}),
      ]);
      setTelemetry(tel);
      setCounts(cnt);
      setLessons(ls.lessons);
      setDictEntries(dc.entries);

      if (!autoSeedTriggeredRef.current && cnt.lessons === 0) {
        autoSeedTriggeredRef.current = true;
        const seeded = await seedFirestoreCatalogIfEmpty(user);
        if (seeded.lessonsSeeded > 0 || seeded.dictSeeded > 0) {
          const [cnt2, ls2, dc2] = await Promise.all([
            fetchAdminFirestoreCounts(),
            fetchLessons(),
            fetchDictionaryEntries({}),
          ]);
          setCounts(cnt2);
          setLessons(ls2.lessons);
          setDictEntries(dc2.entries);
          onContentUpdated();
        }
      }
    } catch (err) {
      setActionErr(err instanceof Error ? err.message : t.errors.fallbackMsg);
    }
  }, [user, onContentUpdated, t.errors.fallbackMsg]);

  useEffect(() => {
    if (!user?.isAdmin) return;
    loadAdminData();
    const timer = window.setInterval(loadAdminData, 8000);
    return () => window.clearInterval(timer);
  }, [user?.isAdmin, loadAdminData]);

  const handleAdminGoogleSignIn = async () => {
    setActionErr(null);
    setSigningInAdmin(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setActionErr(err instanceof Error ? err.message : t.errors.fallbackMsg);
    } finally {
      setSigningInAdmin(false);
    }
  };

  const handleSeedCatalog = async () => {
    if (!user?.isAdmin) return;
    setSeeding(true);
    setActionErr(null);
    setActionMsg(null);
    try {
      const res = await seedFirestoreCatalogIfEmpty(user);
      if (res.lessonsSeeded === 0 && res.dictSeeded === 0 && res.forumSeeded === 0) {
        setActionMsg(a.alreadySyncedMsg);
      } else {
        setActionMsg(
          `Firestore: +${res.lessonsSeeded} ${a.unitsShort}, +${res.dictSeeded} ${a.dictShort}`
        );
      }
      await loadAdminData();
      onContentUpdated();
    } catch (err) {
      setActionErr(err instanceof Error ? err.message : t.errors.fallbackMsg);
    } finally {
      setSeeding(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setPdfFile(f);
    if (f && !pdfSourceName) {
      setPdfSourceName(f.name.replace(/\.pdf$/i, ''));
    }
  };

  const handleImportPdf = async (e: FormEvent) => {
    e.preventDefault();
    if (!user?.isAdmin) return;
    if (!pdfFile) {
      setActionErr(a.selectPdfError);
      return;
    }
    if (pdfFile.size > 11 * 1024 * 1024) {
      setActionErr(a.pdfSizeError);
      return;
    }
    setPdfImporting(true);
    setActionErr(null);
    setActionMsg(null);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || '').split(',')[1] || '');
        reader.onerror = () => reject(new Error(t.errors.fallbackMsg));
        reader.readAsDataURL(pdfFile);
      });

      const res = await api.adminExtractPdf({
        pdfBase64: base64,
        mode: pdfMode,
        jlptLevel: pdfLevel,
        sourceName: pdfSourceName.trim() || pdfFile.name,
      });

      if (res.mode === 'dictionary') {
        const rawEntries = Array.isArray(res.extracted?.entries)
          ? (res.extracted.entries as Record<string, unknown>[])
          : [];
        const prepared: Omit<DictionaryEntry, 'id'>[] = rawEntries
          .filter((item) => item?.word && item?.meaningEs)
          .map((item) => ({
            word: String(item.word),
            reading: String(item.reading || item.word),
            romaji: String(item.romaji || ''),
            meaningEs: String(item.meaningEs),
            partOfSpeech: String(item.partOfSpeech || 'sustantivo'),
            jlptLevel: pdfLevel,
            exampleJa: String(item.exampleJa || ''),
            exampleReading: String(item.exampleReading || ''),
            exampleEs: String(item.exampleEs || ''),
            dictionarySource: res.sourceName,
            tags: Array.isArray(item.tags) ? item.tags.map(String) : ['pdf-import'],
            published: true,
          }));
        if (prepared.length === 0) {
          throw new Error(a.noValidDictError);
        }
        const savedCount = await adminSaveDictionaryEntries(prepared);
        setActionMsg(`${res.sourceName}: +${savedCount} (${a.entrySavedMsg})`);
      } else {
        const ext = res.extracted as Record<string, unknown>;
        const nextUnitNum = lessons.filter((l) => l.level === pdfLevel).length + 1;
        const lessonTitle = String(ext.title || `U${nextUnitNum} (${res.sourceName})`).slice(0, 180);
        const lessonPayload: Omit<Lesson, 'id'> = {
          level: pdfLevel,
          unitNumber: nextUnitNum,
          title: lessonTitle.length >= 2 ? lessonTitle : `U${nextUnitNum}`,
          subtitle: String(ext.subtitle || res.sourceName).slice(0, 240),
          sourceBook: res.sourceName.slice(0, 140),
          grammarPoints: Array.isArray(ext.grammarPoints) ? (ext.grammarPoints as Lesson['grammarPoints']) : [],
          vocabulary: Array.isArray(ext.vocabulary) ? (ext.vocabulary as Lesson['vocabulary']) : [],
          kanjiList: Array.isArray(ext.kanjiList) ? (ext.kanjiList as Lesson['kanjiList']) : [],
          dialogue: Array.isArray(ext.dialogue) ? (ext.dialogue as Lesson['dialogue']) : [],
          exercises: normalizeExercises(ext.exercises, 'pdf_ex'),
          unitExam: normalizeExercises(ext.unitExam, 'pdf_exam'),
          published: true,
        };
        await adminSaveLesson(lessonPayload);
        setActionMsg(`Firestore (${pdfLevel}): ${lessonPayload.title}`);
      }

      setPdfFile(null);
      setPdfSourceName('');
      await loadAdminData();
      onContentUpdated();
    } catch (err) {
      setActionErr(err instanceof Error ? err.message : t.errors.fallbackMsg);
    } finally {
      setPdfImporting(false);
    }
  };

  const handleAddDict = async (e: FormEvent) => {
    e.preventDefault();
    if (!user?.isAdmin) return;
    setActionErr(null);
    setActionMsg(null);
    try {
      await adminSaveDictionaryEntries([
        {
          word: dWord,
          reading: dReading,
          romaji: dRomaji,
          meaningEs: dMeaning,
          partOfSpeech: 'sustantivo',
          jlptLevel: dLevel,
          exampleJa: '',
          exampleReading: '',
          exampleEs: '',
          dictionarySource: dSource.trim() || 'Kotonoha Dictionary',
          tags: ['manual'],
          published: true,
        },
      ]);
      setDWord('');
      setDReading('');
      setDRomaji('');
      setDMeaning('');
      setActionMsg(a.entrySavedMsg);
      await loadAdminData();
      onContentUpdated();
    } catch (err) {
      setActionErr(err instanceof Error ? err.message : t.errors.fallbackMsg);
    }
  };

  if (!user || !user.isAdmin) {
    return (
      <div className="max-w-md mx-auto py-12">
        <div className="rounded-2xl bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36] p-7 space-y-5">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-[#C9372C] dark:text-[#E04F44] shrink-0 mt-0.5" />
            <div>
              <h1 className="font-display text-2xl font-semibold text-[#1A1D21] dark:text-[#F2EFE9]">
                {a.restrictedTitle}
              </h1>
              <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE] mt-1 leading-relaxed">
                {a.restrictedDescPrefix}{' '}
                <strong className="text-[#1A1D21] dark:text-[#F2EFE9]">{ADMIN_EMAIL}</strong>{' '}
                {a.restrictedDescSuffix}
              </p>
            </div>
          </div>

          {user && !user.isAdmin && (
            <div className="p-3.5 rounded-xl bg-[#F7F5F0] dark:bg-[#111317] border border-[#DFD9CD] dark:border-[#262C36] text-xs text-[#5A606B] dark:text-[#9BA1AE]">
              {a.currentSessionPrefix}{' '}
              <strong className="text-[#1A1D21] dark:text-[#F2EFE9]">{user.username}</strong> ({a.rolePrefix}{' '}
              {user.role}).
            </div>
          )}

          {actionErr && <p className="text-xs text-[#C9372C] dark:text-[#F06B60]">{actionErr}</p>}

          <div className="space-y-2.5">
            <button
              type="button"
              disabled={signingInAdmin}
              onClick={handleAdminGoogleSignIn}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium bg-[#1E3A5F] hover:bg-[#162C49] dark:bg-[#4978B0] text-white cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              {signingInAdmin ? a.verifyingAdmin : a.googleAdminBtn}
            </button>

            <button
              type="button"
              onClick={onOpenAuth}
              className="w-full py-2 px-4 rounded-lg text-xs font-medium border border-[#DFD9CD] dark:border-[#2C323E] text-[#5A606B] dark:text-[#9BA1AE] hover:text-[#1A1D21] dark:hover:text-[#F2EFE9] cursor-pointer"
            >
              {a.manageStudentBtn}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#DFD9CD] dark:border-[#262C36] pb-6">
        <div>
          <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE]">{a.eyebrow}</p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#1A1D21] dark:text-[#F2EFE9] mt-1">
            {a.title}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-[#ECE8DF] dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36]">
            {(
              [
                { id: 'monitor', label: a.tabMonitor },
                { id: 'pdf', label: a.tabPdf },
                { id: 'contenido', label: a.tabFirestore },
              ] as const
            ).map((tabItem) => (
              <button
                key={tabItem.id}
                type="button"
                onClick={() => setAdminTab(tabItem.id)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  adminTab === tabItem.id
                    ? 'bg-white dark:bg-[#272D38] text-[#C9372C] dark:text-[#E04F44] shadow-xs'
                    : 'text-[#5A606B] dark:text-[#9BA1AE]'
                }`}
              >
                {tabItem.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleSeedCatalog}
            disabled={seeding}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-[#DFD9CD] dark:border-[#2C323E] text-[#1A1D21] dark:text-[#F2EFE9] hover:border-[#C9372C] cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C9372C]" />
            {seeding ? a.syncingBtn : a.syncCatalogBtn}
          </button>

          <button
            type="button"
            onClick={loadAdminData}
            aria-label={a.refreshAria}
            className="p-2 rounded-lg border border-[#DFD9CD] dark:border-[#2C323E] text-[#1A1D21] dark:text-[#F2EFE9] hover:border-[#C9372C] cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {actionMsg && (
        <div className="p-4 rounded-xl border border-[#2E6F52]/40 bg-[#2E6F52]/10 text-sm text-[#1F543D] dark:text-[#6AD1A1]">
          {actionMsg}
        </div>
      )}
      {actionErr && (
        <div className="p-4 rounded-xl border border-[#C9372C]/40 bg-[#C9372C]/10 text-sm text-[#C9372C] dark:text-[#F06B60]">
          {actionErr}
        </div>
      )}

      {adminTab === 'monitor' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36]">
              <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE]">{a.latencyTitle}</p>
              <p className="font-mono-num text-2xl font-semibold text-[#1A1D21] dark:text-[#F2EFE9] mt-2">
                {telemetry?.performance.avgLatencyMs ?? 0}ms{' '}
                <span className="text-sm font-normal text-[#5A606B] dark:text-[#9BA1AE]">
                  / {telemetry?.performance.p95LatencyMs ?? 0}ms
                </span>
              </p>
              <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE] mt-1">
                {telemetry?.performance.requestsLastHour ?? 0} {a.requestsSuffix} · {a.errorRatePrefix}{' '}
                {telemetry?.performance.errorRatePercent ?? 0}%
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36]">
              <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE]">{a.communityTitle}</p>
              <p className="font-mono-num text-2xl font-semibold text-[#1E3A5F] dark:text-[#7FAEE3] mt-2">
                {counts?.users ?? 0} {a.usersSuffix}
              </p>
              <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE] mt-1">
                {counts?.forumPosts ?? 0} {a.forumTopicsSuffix} · {counts?.chatMessages ?? 0} {a.chatMsgSuffix}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36]">
              <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE]">{a.catalogTitle}</p>
              <p className="font-mono-num text-2xl font-semibold text-[#2E6F52] dark:text-[#5DC293] mt-2">
                {counts?.lessons ?? 0} {a.unitsShort} · {counts?.dictionaryEntries ?? 0} {a.dictShort}
              </p>
              <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE] mt-1">{a.catalogSub}</p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36]">
              <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE]">{a.serverHealthTitle}</p>
              <p className="font-mono-num text-2xl font-semibold text-[#1A1D21] dark:text-[#F2EFE9] mt-2">
                {telemetry?.performance.memoryMb ?? 0} MB
              </p>
              <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE] mt-1">
                {a.uptimePrefix} {Math.floor((telemetry?.performance.uptimeSeconds ?? 0) / 60)}m
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-semibold text-[#1A1D21] dark:text-[#F2EFE9]">
                  {a.chartTitle}
                </h2>
                <Activity className="w-4 h-4 text-[#C9372C]" />
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={telemetry?.latencySeries || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#262C36' : '#E7E2D8'} />
                    <XAxis dataKey="bucket" tick={{ fontSize: 11, fill: darkMode ? '#9BA1AE' : '#5A606B' }} />
                    <YAxis tick={{ fontSize: 11, fill: darkMode ? '#9BA1AE' : '#5A606B' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: darkMode ? '#191C22' : '#FFFFFF',
                        borderColor: darkMode ? '#2E3440' : '#DFD9CD',
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="avgMs" name={a.chartTooltip} fill="#1E3A5F" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36] p-6">
              <h2 className="font-display text-xl font-semibold text-[#1A1D21] dark:text-[#F2EFE9] mb-4">
                {a.recentReqTitle}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#DFD9CD] dark:border-[#262C36] text-[#5A606B] dark:text-[#9BA1AE]">
                      <th className="py-2 pr-2 font-medium">{a.colRoute}</th>
                      <th className="py-2 pr-2 font-medium">{a.colStatus}</th>
                      <th className="py-2 text-right font-medium">ms</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ECE8DF] dark:divide-[#262C36] font-mono-num">
                    {(telemetry?.recentRequests || []).slice(0, 8).map((r) => (
                      <tr key={r.id}>
                        <td className="py-2 pr-2 text-[#1A1D21] dark:text-[#F2EFE9] truncate max-w-[180px]">
                          {r.method} {r.endpoint}
                        </td>
                        <td
                          className={`py-2 pr-2 ${
                            r.statusCode >= 500
                              ? 'text-[#C9372C]'
                              : r.statusCode >= 400
                                ? 'text-[#B06D22]'
                                : 'text-[#2E6F52] dark:text-[#5DC293]'
                          }`}
                        >
                          {r.statusCode}
                        </td>
                        <td className="py-2 text-right text-[#5A606B] dark:text-[#9BA1AE]">{r.latencyMs}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {adminTab === 'pdf' && (
        <div className="max-w-2xl rounded-2xl bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36] p-6 sm:p-8 space-y-6">
          <div className="flex items-start gap-3">
            <FileUp className="w-6 h-6 text-[#C9372C] dark:text-[#E04F44] shrink-0 mt-0.5" />
            <div>
              <h2 className="font-display text-2xl font-semibold text-[#1A1D21] dark:text-[#F2EFE9]">{a.pdfTitle}</h2>
              <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE] mt-1">{a.pdfDesc}</p>
            </div>
          </div>

          <form onSubmit={handleImportPdf} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#5A606B] dark:text-[#9BA1AE] mb-1.5">
                  {a.pdfModeLabel}
                </label>
                <select
                  value={pdfMode}
                  onChange={(e) => setPdfMode(e.target.value as 'lesson' | 'dictionary')}
                  className="w-full rounded-lg border border-[#DFD9CD] dark:border-[#2C323E] bg-[#F7F5F0] dark:bg-[#111317] px-3 py-2 text-sm text-[#1A1D21] dark:text-[#F2EFE9]"
                >
                  <option value="lesson">{a.pdfModeLesson}</option>
                  <option value="dictionary">{a.pdfModeDict}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#5A606B] dark:text-[#9BA1AE] mb-1.5">
                  {a.pdfLevelLabel}
                </label>
                <select
                  value={pdfLevel}
                  onChange={(e) => setPdfLevel(e.target.value as JlptLevel)}
                  className="w-full rounded-lg border border-[#DFD9CD] dark:border-[#2C323E] bg-[#F7F5F0] dark:bg-[#111317] px-3 py-2 text-sm text-[#1A1D21] dark:text-[#F2EFE9]"
                >
                  {LEVELS.map((lv) => (
                    <option key={lv} value={lv}>
                      JLPT {lv}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5A606B] dark:text-[#9BA1AE] mb-1.5">
                {a.pdfSourceLabel}
              </label>
              <input
                type="text"
                value={pdfSourceName}
                onChange={(e) => setPdfSourceName(e.target.value)}
                placeholder={a.pdfSourcePlaceholder}
                className="w-full rounded-lg border border-[#DFD9CD] dark:border-[#2C323E] bg-[#F7F5F0] dark:bg-[#111317] px-3.5 py-2 text-sm text-[#1A1D21] dark:text-[#F2EFE9]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5A606B] dark:text-[#9BA1AE] mb-1.5">
                {a.pdfFileLabel}
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="w-full text-sm text-[#5A606B] dark:text-[#9BA1AE] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-[#ECE8DF] dark:file:bg-[#252A34] file:text-[#1A1D21] dark:file:text-[#F2EFE9] cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={pdfImporting || !pdfFile}
              className="px-5 py-2.5 rounded-lg text-sm font-medium bg-[#C9372C] hover:bg-[#AE2D23] text-white disabled:opacity-50 cursor-pointer"
            >
              {pdfImporting ? a.pdfImportingBtn : a.pdfImportBtn}
            </button>
          </form>
        </div>
      )}

      {adminTab === 'contenido' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#C9372C]" />
              <h2 className="font-display text-xl font-semibold text-[#1A1D21] dark:text-[#F2EFE9]">
                {a.addDictTitle}
              </h2>
            </div>

            <form onSubmit={handleAddDict} className="space-y-3">
              <input
                required
                value={dWord}
                onChange={(e) => setDWord(e.target.value)}
                placeholder={a.wordPlaceholder}
                className="w-full rounded-lg border border-[#DFD9CD] dark:border-[#2C323E] bg-[#F7F5F0] dark:bg-[#111317] px-3 py-2 text-sm text-[#1A1D21] dark:text-[#F2EFE9]"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  required
                  value={dReading}
                  onChange={(e) => setDReading(e.target.value)}
                  placeholder={a.readingPlaceholder}
                  className="rounded-lg border border-[#DFD9CD] dark:border-[#2C323E] bg-[#F7F5F0] dark:bg-[#111317] px-3 py-2 text-sm text-[#1A1D21] dark:text-[#F2EFE9]"
                />
                <input
                  value={dRomaji}
                  onChange={(e) => setDRomaji(e.target.value)}
                  placeholder={a.romajiPlaceholder}
                  className="rounded-lg border border-[#DFD9CD] dark:border-[#2C323E] bg-[#F7F5F0] dark:bg-[#111317] px-3 py-2 text-sm text-[#1A1D21] dark:text-[#F2EFE9]"
                />
              </div>
              <input
                required
                value={dMeaning}
                onChange={(e) => setDMeaning(e.target.value)}
                placeholder={a.meaningPlaceholder}
                className="w-full rounded-lg border border-[#DFD9CD] dark:border-[#2C323E] bg-[#F7F5F0] dark:bg-[#111317] px-3 py-2 text-sm text-[#1A1D21] dark:text-[#F2EFE9]"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={dLevel}
                  onChange={(e) => setDLevel(e.target.value as JlptLevel)}
                  className="rounded-lg border border-[#DFD9CD] dark:border-[#2C323E] bg-[#F7F5F0] dark:bg-[#111317] px-3 py-2 text-sm text-[#1A1D21] dark:text-[#F2EFE9]"
                >
                  {LEVELS.map((lv) => (
                    <option key={lv} value={lv}>
                      {lv}
                    </option>
                  ))}
                </select>
                <input
                  value={dSource}
                  onChange={(e) => setDSource(e.target.value)}
                  placeholder={a.sourcePlaceholder}
                  className="rounded-lg border border-[#DFD9CD] dark:border-[#2C323E] bg-[#F7F5F0] dark:bg-[#111317] px-3 py-2 text-sm text-[#1A1D21] dark:text-[#F2EFE9]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg text-sm font-medium bg-[#1E3A5F] text-white cursor-pointer"
              >
                {a.saveEntryBtn}
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36] p-6 space-y-5">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#1E3A5F] dark:text-[#7FAEE3]" />
              <h2 className="font-display text-xl font-semibold text-[#1A1D21] dark:text-[#F2EFE9]">
                {formatT(a.publishedUnitsTitle, { count: lessons.length })}
              </h2>
            </div>

            <div className="divide-y divide-[#ECE8DF] dark:divide-[#262C36] max-h-72 overflow-y-auto">
              {lessons.map((l) => (
                <div key={l.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#1A1D21] dark:text-[#F2EFE9] truncate">
                      {l.level} · U{l.unitNumber}: {l.title}
                    </p>
                    <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE]">{l.sourceBook}</p>
                  </div>
                  {!l.id.startsWith('seed-') && (
                    <button
                      type="button"
                      onClick={async () => {
                        await adminDeleteLesson(l.id);
                        await loadAdminData();
                        onContentUpdated();
                      }}
                      aria-label={l.title}
                      className="p-2 rounded-lg text-[#5A606B] hover:text-[#C9372C] cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#ECE8DF] dark:border-[#262C36] space-y-2">
              <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE]">
                {a.activeDictPrefix}{' '}
                <strong className="font-mono-num text-[#1A1D21] dark:text-[#F2EFE9]">{dictEntries.length}</strong>{' '}
                {a.activeDictSuffix}
              </p>
              <div className="divide-y divide-[#ECE8DF] dark:divide-[#262C36] max-h-44 overflow-y-auto">
                {dictEntries
                  .filter((d) => !d.id.startsWith('seed-dict-'))
                  .slice(0, 12)
                  .map((d) => (
                    <div key={d.id} className="py-2 flex items-center justify-between gap-3 text-xs">
                      <span className="truncate text-[#1A1D21] dark:text-[#F2EFE9]">
                        <strong className="font-jp">{d.word}</strong> ({d.reading}) — {d.meaningEs}
                      </span>
                      <button
                        type="button"
                        onClick={async () => {
                          await adminDeleteDictionaryEntry(d.id);
                          await loadAdminData();
                          onContentUpdated();
                        }}
                        aria-label={d.word}
                        className="p-1 text-[#5A606B] hover:text-[#C9372C] cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
