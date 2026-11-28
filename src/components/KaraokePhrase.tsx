import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export interface WordPair {
  ja: string;
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
    return jaWords.map((w) => ({ ja: w, es: '' }));
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
            setPairs(aligned);
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
      {/* Frase en Japonés con cada palabra coloreada */}
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1.5 font-jp text-lg sm:text-xl leading-relaxed">
        {pairs.map((pair, idx) => {
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
              {pair.ja}
            </span>
          );
        })}
      </div>

      {/* Traducción en Español con los MISMOS colores emparejados */}
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
