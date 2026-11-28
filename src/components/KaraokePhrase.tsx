import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export interface WordPair {
  ja: string;
  romaji?: string;
  es: string;
}

const PAIR_COLORS = [
  {
    text: 'text-[#C9372C] dark:text-[#FF7A70]',
    underline: 'border-b-2 border-[#C9372C] dark:border-[#FF7A70]',
    activeBg: 'bg-[#C9372C]/20 ring-1 ring-[#C9372C]',
  },
  {
    text: 'text-[#1D4ED8] dark:text-[#60A5FA]',
    underline: 'border-b-2 border-[#1D4ED8] dark:border-[#60A5FA]',
    activeBg: 'bg-[#2563EB]/20 ring-1 ring-[#2563EB]',
  },
  {
    text: 'text-[#047857] dark:text-[#34D399]',
    underline: 'border-b-2 border-[#047857] dark:border-[#34D399]',
    activeBg: 'bg-[#059669]/20 ring-1 ring-[#059669]',
  },
  {
    text: 'text-[#B45309] dark:text-[#FBBF24]',
    underline: 'border-b-2 border-[#B45309] dark:border-[#FBBF24]',
    activeBg: 'bg-[#D97706]/20 ring-1 ring-[#D97706]',
  },
  {
    text: 'text-[#6D28D9] dark:text-[#A78BFA]',
    underline: 'border-b-2 border-[#6D28D9] dark:border-[#A78BFA]',
    activeBg: 'bg-[#7C3AED]/20 ring-1 ring-[#7C3AED]',
  },
  {
    text: 'text-[#0E7490] dark:text-[#22D3EE]',
    underline: 'border-b-2 border-[#0E7490] dark:border-[#22D3EE]',
    activeBg: 'bg-[#0891B2]/20 ring-1 ring-[#0891B2]',
  },
];

const KANA_MAP: Record<string, string> = {
  あ:'a',い:'i',う:'u',え:'e',お:'o',か:'ka',き:'ki',く:'ku',け:'ke',こ:'ko',
  さ:'sa',し:'shi',す:'su',せ:'se',そ:'so',た:'ta',ち:'chi',つ:'tsu',て:'te',と:'to',
  な:'na',に:'ni',ぬ:'nu',ね:'ne',の:'no',は:'ha',ひ:'hi',ふ:'fu',へ:'he',ほ:'ho',
  ま:'ma',み:'mi',む:'mu',め:'me',も:'mo',や:'ya',ゆ:'yu',よ:'yo',
  ら:'ra',り:'ri',る:'ru',れ:'re',ろ:'ro',わ:'wa',を:'o',ん:'n',
  が:'ga',ぎ:'gi',ぐ:'gu',げ:'ge',ご:'go',ざ:'za',じ:'ji',ず:'zu',ぜ:'ze',ぞ:'zo',
  だ:'da',ぢ:'ji',づ:'zu',で:'de',ど:'do',ば:'ba',び:'bi',ぶ:'bu',べ:'be',ぼ:'bo',
  ぱ:'pa',ぴ:'pi',ぷ:'pu',ぺ:'pe',ぽ:'po',
  ア:'a',イ:'i',ウ:'u',エ:'e',オ:'o',カ:'ka',キ:'ki',ク:'ku',ケ:'ke',コ:'ko',
  サ:'sa',シ:'shi',ス:'su',セ:'se',ソ:'so',タ:'ta',チ:'chi',ツ:'tsu',テ:'te',ト:'to',
  ナ:'na',ニ:'ni',ヌ:'nu',ネ:'ne',ノ:'no',ハ:'ha',ヒ:'hi',フ:'fu',ヘ:'he',ホ:'ho',
  マ:'ma',ミ:'mi',ム:'mu',メ:'me',モ:'mo',ヤ:'ya',ユ:'yu',ヨ:'yo',
  ラ:'ra',リ:'ri',ル:'ru',レ:'re',ロ:'ro',ワ:'wa',ヲ:'o',ン:'n',
  ガ:'ga',ギ:'gi',グ:'gu',ゲ:'ge',ゴ:'go',ザ:'za',ジ:'ji',ズ:'zu',ゼ:'ze',ゾ:'zo',
  ダ:'da',ヂ:'ji',ヅ:'zu',デ:'de',ド:'do',バ:'ba',ビ:'bi',ブ:'bu',ベ:'be',ボ:'bo',
  パ:'pa',ピ:'pi',プ:'pu',ペ:'pe',ポ:'po',ー:'-',
};
function quickKanaReading(text: string): string {
  let out = '';
  for (const ch of text) {
    if (KANA_MAP[ch]) out += KANA_MAP[ch];
  }
  return out;
}

function segmentJapaneseWords(ja: string): string[] {
  try {
    if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
      const segmenter = new (Intl as any).Segmenter('ja', { granularity: 'word' });
      const rawSegments: string[] = Array.from(segmenter.segment(ja))
        .map((s: any) => String(s.segment).trim())
        .filter(Boolean);

      const merged: string[] = [];
      for (const seg of rawSegments) {
        const isSuffix = /^(は|が|を|に|へ|で|と|も|の|から|まで|よ|ね|か|ます|ました|ません|です|でした|ください|、|。|！|？)$/.test(
          seg
        );
        if (merged.length > 0 && isSuffix) {
          merged[merged.length - 1] += seg;
        } else {
          merged.push(seg);
        }
      }
      if (merged.length > 0) return merged;
    }
  } catch {
    // Fallback abajo
  }
  return [ja];
}

function buildInitialPairs(ja: string, es: string): WordPair[] {
  const jaWords = segmentJapaneseWords(ja);
  const esWords = es.trim().split(/\s+/).filter(Boolean);

  if (esWords.length === 0) {
    return jaWords.map((w) => ({ ja: w, romaji: quickKanaReading(w), es: '' }));
  }

  let prevEnd = 0;
  return jaWords.map((jaWord, idx) => {
    const targetEnd =
      idx === jaWords.length - 1
        ? esWords.length
        : Math.round(((idx + 1) * esWords.length) / jaWords.length);
    const start = prevEnd;
    const end = Math.max(start, Math.min(esWords.length, targetEnd));
    prevEnd = end;
    return {
      ja: jaWord,
      romaji: quickKanaReading(jaWord),
      es: esWords.slice(start, end).join(' '),
    };
  });
}
interface KaraokePhraseProps {
  ja: string;
  es?: string;
  isPlaying: boolean;
  progress?: number;
}

export function KaraokePhrase({ ja, es = '', isPlaying, progress = 0 }: KaraokePhraseProps) {
  const [pairs, setPairs] = useState<WordPair[]>(() => buildInitialPairs(ja, es));
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    setPairs(buildInitialPairs(ja, es));

    if (!ja || !es) return;

    api
      .alignWords(ja, es)
      .then((aligned) => {
        if (!cancelled && Array.isArray(aligned) && aligned.length > 0) {
          const joinedEs = aligned.map((p) => p.es || '').join(' ').trim();
          if (joinedEs.length >= es.trim().length * 0.85) {
            setPairs(
              aligned.map((item) => ({
                ...item,
                romaji: item.romaji || quickKanaReading(item.ja),
              }))
            );
          }
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [ja, es]);

  useEffect(() => {
    if (!isPlaying || progress <= 0 || progress >= 1) {
      setActiveIndex(-1);
      return;
    }

    const totalChars = pairs.reduce((acc, p) => acc + Math.max(1, p.ja.length), 0);
    let acc = 0;
    for (let i = 0; i < pairs.length; i++) {
      acc += Math.max(1, pairs[i].ja.length) / totalChars;
      if (progress <= acc) {
        setActiveIndex(i);
        break;
      }
    }
  }, [isPlaying, progress, pairs]);

  const highlighted = hoveredIndex !== null ? hoveredIndex : activeIndex;

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1.5 font-jp text-lg sm:text-xl leading-relaxed">
        {pairs.map((pair, idx) => {
          const palette = PAIR_COLORS[idx % PAIR_COLORS.length];
          const isLit = highlighted === idx;
          return (
            <span
              key={idx}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`inline-flex flex-col items-center px-2 py-1 rounded-md transition-all duration-150 cursor-pointer ${palette.text} ${palette.underline} ${
                isLit ? `${palette.activeBg} font-bold scale-105` : 'font-medium'
              }`}
            >
              <span>{pair.ja}</span>
              {pair.romaji && (
                <span className="text-[11px] font-mono opacity-80 leading-tight mt-0.5">
                  {pair.romaji}
                </span>
              )}
            </span>
          );
        })}
      </div>

      {es && (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm">
          {pairs.map((pair, idx) => {
            if (!pair.es) return null;
            const palette = PAIR_COLORS[idx % PAIR_COLORS.length];
            const isLit = highlighted === idx;
            return (
              <span
                key={idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`px-1.5 py-0.5 rounded-md transition-all duration-150 cursor-pointer ${palette.text} ${palette.underline} ${
                  isLit ? `${palette.activeBg} font-bold scale-105` : 'font-medium'
                }`}
              >
                {pair.es}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
