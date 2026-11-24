import { Plus, Search, Volume2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatT } from '../i18n/translations';
import { useLanguage } from '../i18n/LanguageContext';
import { api, playBase64Audio } from '../lib/api';
import { createUserSrsCard, fetchDictionaryEntries } from '../lib/firestoreService';
import type { AuthUser, DictionaryEntry, JlptLevel } from '../types/kotonoha';

interface DictionaryViewProps {
  user: AuthUser | null;
  onRefreshDashboard: () => void;
  onRequireAuth: () => void;
}

const LEVELS: ('ALL' | JlptLevel)[] = ['ALL', 'N5', 'N4', 'N3', 'N2', 'N1'];

export function DictionaryView({ user, onRefreshDashboard, onRequireAuth }: DictionaryViewProps) {
  const { t } = useLanguage();
  const d = t.dictionary;

  const [queryText, setQueryText] = useState('');
  const [level, setLevel] = useState<'ALL' | JlptLevel>('ALL');
  const [source, setSource] = useState('');
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let active = true;
    const handle = window.setTimeout(() => {
      setLoading(true);
      setError(null);
      fetchDictionaryEntries({
        q: queryText.trim() || undefined,
        level: level === 'ALL' ? undefined : level,
        source: source || undefined,
      })
        .then((res) => {
          if (!active) return;
          setEntries(res.entries);
          setSources(res.sources);
        })
        .catch((err) => {
          if (!active) return;
          setError(err instanceof Error ? err.message : d.loadError);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 160);

    return () => {
      active = false;
      window.clearTimeout(handle);
    };
  }, [queryText, level, source, d.loadError]);

  const handleSpeak = async (entry: DictionaryEntry) => {
    setSpeakingId(entry.id);
    try {
      const tts = await api.synthesizeSpeech(entry.word, 'Kore', 'slow');
      await playBase64Audio(tts.audioBase64, tts.mimeType);
    } catch (err) {
      setError(err instanceof Error ? err.message : d.audioError);
    } finally {
      setSpeakingId(null);
    }
  };

  const handleSaveToSrs = async (entry: DictionaryEntry) => {
    if (!user) {
      onRequireAuth();
      return;
    }
    try {
      await createUserSrsCard(user.uid, {
        cardType: 'vocab',
        front: entry.word,
        reading: `${entry.reading} (${entry.romaji})`,
        back: entry.meaningEs,
        hint: entry.exampleJa ? `${entry.exampleJa} — ${entry.exampleEs}` : entry.dictionarySource,
        jlptLevel: entry.jlptLevel,
      });
      setSavedIds((prev) => ({ ...prev, [entry.id]: true }));
      onRefreshDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : d.srsError);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="border-b border-[#DFD9CD] dark:border-[#262C36] pb-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE]">
              {formatT(d.eyebrow, { count: sources.length })}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#1A1D21] dark:text-[#F2EFE9] mt-1">
              {d.title}
            </h1>
          </div>

          <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-[#ECE8DF] dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36] self-start">
            {LEVELS.map((lv) => (
              <button
                key={lv}
                type="button"
                onClick={() => setLevel(lv)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  level === lv
                    ? 'bg-white dark:bg-[#272D38] text-[#C9372C] dark:text-[#E04F44] shadow-xs'
                    : 'text-[#5A606B] dark:text-[#9BA1AE]'
                }`}
              >
                {lv === 'ALL' ? d.allLevels : lv}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-[#5A606B] dark:text-[#9BA1AE] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              placeholder={d.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#DFD9CD] dark:border-[#2C323E] bg-white dark:bg-[#191C22] text-sm text-[#1A1D21] dark:text-[#F2EFE9]"
            />
          </div>
          <div className="md:col-span-4">
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              aria-label={d.filterSourceLabel}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#DFD9CD] dark:border-[#2C323E] bg-white dark:bg-[#191C22] text-sm text-[#1A1D21] dark:text-[#F2EFE9]"
            >
              <option value="">{d.allSources}</option>
              {sources.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-[#C9372C]/40 bg-[#C9372C]/5 text-sm text-[#C9372C] dark:text-[#F06B60]">
          {error}
        </div>
      )}

      {loading ? (
        <p className="py-16 text-center text-sm text-[#5A606B] dark:text-[#9BA1AE]">{d.searching}</p>
      ) : entries.length === 0 ? (
        <div className="py-16 text-center rounded-xl border border-[#DFD9CD] dark:border-[#262C36] bg-white dark:bg-[#191C22]">
          <p className="text-sm text-[#5A606B] dark:text-[#9BA1AE]">
            {formatT(d.emptyResult, { q: queryText })}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs font-mono-num text-[#5A606B] dark:text-[#9BA1AE]">
            {formatT(d.resultsCount, { count: entries.length })}
          </p>
          <div className="divide-y divide-[#DFD9CD] dark:divide-[#262C36] rounded-2xl bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36] px-6">
            {entries.map((entry) => (
              <article key={entry.id} className="py-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h2 className="font-jp-serif text-2xl font-medium text-[#1A1D21] dark:text-[#F2EFE9]">
                      {entry.word}
                    </h2>
                    <span className="font-jp text-sm text-[#C9372C] dark:text-[#E04F44]">{entry.reading}</span>
                    <span className="text-xs font-mono-num text-[#5A606B] dark:text-[#9BA1AE]">{entry.romaji}</span>
                  </div>

                  <p className="text-sm font-medium text-[#1A1D21] dark:text-[#F2EFE9]">{entry.meaningEs}</p>

                  <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE]">
                    {entry.jlptLevel} <span aria-hidden="true">·</span> {entry.partOfSpeech}{' '}
                    <span aria-hidden="true">·</span> {entry.dictionarySource}
                  </p>

                  {entry.exampleJa && (
                    <div className="pt-2 text-xs space-y-0.5 text-[#4A505A] dark:text-[#B3B8C4]">
                      <p className="font-jp text-sm text-[#1A1D21] dark:text-[#F2EFE9]">{entry.exampleJa}</p>
                      <p className="font-jp text-[#5A606B] dark:text-[#9BA1AE]">{entry.exampleReading}</p>
                      <p>{entry.exampleEs}</p>
                    </div>
                  )}
                </div>

                <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleSpeak(entry)}
                    disabled={speakingId === entry.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#DFD9CD] dark:border-[#2C323E] text-[#1E3A5F] dark:text-[#7FAEE3] hover:border-[#C9372C] hover:text-[#C9372C] whitespace-nowrap cursor-pointer disabled:opacity-50"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    {d.listen}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveToSrs(entry)}
                    disabled={Boolean(savedIds[entry.id])}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#DFD9CD] dark:border-[#2C323E] text-[#1A1D21] dark:text-[#F2EFE9] hover:border-[#2E6F52] whitespace-nowrap cursor-pointer disabled:opacity-50"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {savedIds[entry.id] ? d.inYourSrs : d.addToSrs}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
