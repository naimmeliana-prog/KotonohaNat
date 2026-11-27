import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export interface WordPair {
  ja: string;
  reading?: string;
  es: string;
}

const PAIR_COLORS = [
  { text: 'text-[#C9372C] dark:text-[#FF7A70]', bg: 'bg-[#C9372C]/15 border-[#C9372C]' },
  { text: 'text-[#1D4ED8] dark:text-[#60A5FA]', bg: 'bg-[#2563EB]/15 border-[#2563EB]' },
  { text: 'text-[#047857] dark:text-[#34D399]', bg: 'bg-[#059669]/15 border-[#059669]' },
  { text: 'text-[#B45309] dark:text-[#FBBF24]', bg: 'bg-[#D97706]/15 border-[#D97706]' },
  { text: 'text-[#6D28D9] dark:text-[#A78BFA]', bg: 'bg-[#7C3AED]/15 border-[#7C3AED]' },
  { text: 'text-[#0E7490] dark:text-[#22D3EE]', bg: 'bg-[#0891B2]/15 border-[#0891B2]' },
];

function quickSegmentJa(ja: string): string[] {
  try {
    if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
      const segmenter = new (Intl as any).Segmenter('ja', { granularity: 'word' });
      const rawSegments: string[] = Array.from(segmenter.segment(ja))
        .map((s: any) => String(s.segment).trim())
        .filter(Boolean);

      const merged: string[] = [];
      for (const seg of rawSegments) {
        const isParticleOrSuffix = /^(は|が|を|に|へ|で|と|も|の|から|まで|よ|ね|か|ます|ました|ません|です|でした|ください|、|。|！|？)$/.test(
          seg
        );
        if (merged.length > 0 && isParticleOrSuffix) {
          merged[merged.length - 1] += seg;
        } else {
          merged.push(seg);
        }
      }
      if (merged.length > 1) return merged;
    }
  } catch {
    // Fallback abajo
  }

  const parts = ja
    .split(/(は|が|を|に|へ|で|と|も|の|から|まで|です|ます|ました|ません|、|。|！|？)/g)
    .filter(Boolean);
  const result: string[] = [];
  for (let i = 0; i < parts.length; i++) {
    if (
      i > 0 &&
      /^(は|が|を|に|へ|で|と|も|の|から|まで|です|ます|ました|ません|、|。|！|？)$/.test(parts[i])
    ) {
      result[result.length - 1] += parts[i];
    } else {
      result.push(parts[i]);
    }
  }
  return result.length > 0 ? result : [ja];
}

interface KaraokePhraseProps {
  ja: string;
  es?: string;
  isPlaying: boolean;
  durationMs?: number;
}

export function KaraokePhrase({ ja, es = '', isPlaying, durationMs }: KaraokePhraseProps) {
  const [pairs, setPairs] = useState<WordPair[]>(() =>
    quickSegmentJa(ja).map((seg) => ({ ja: seg, es: '' }))
  );
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    setPairs(quickSegmentJa(ja).map((seg) => ({ ja: seg, es: '' })));

    if (!ja || !es) return;

    api
      .alignWords(ja, es)
      .then((aligned) => {
        if (!cancelled && Array.isArray(aligned) && aligned.length > 0) {
          setPairs(aligned);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [ja, es]);

  useEffect(() => {
    if (!isPlaying) {
      setActiveIndex(-1);
      return;
    }

    const totalChars = pairs.reduce((acc, p) => acc + Math.max(1, p.ja.length), 0);
    const estimatedTotalMs = durationMs || Math.max(1400, totalChars * 230);
    let elapsed = 0;
    const stepMs = 60;

    const timer = window.setInterval(() => {
      elapsed += stepMs;
      const ratio = Math.min(0.999, elapsed / estimatedTotalMs);
      let acc = 0;
      for (let i = 0; i < pairs.length; i++) {
        acc += Math.max(1, pairs[i].ja.length) / totalChars;
        if (ratio <= acc) {
          setActiveIndex(i);
          break;
        }
      }
      if (elapsed >= estimatedTotalMs) {
        window.clearInterval(timer);
      }
    }, stepMs);

    return () => window.clearInterval(timer);
  }, [isPlaying, pairs, durationMs]);

  const highlighted = hoveredIndex !== null ? hoveredIndex : activeIndex;

  return (
    <div className="space-y-2.5">
      {/* Frase en Japonés segmentada por colores */}
      <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-1 font-jp text-lg sm:text-xl leading-relaxed">
        {pairs.map((pair, idx) => {
          const palette = PAIR_COLORS[idx % PAIR_COLORS.length];
          const isLit = highlighted === idx;
          return (
            <span
              key={idx}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`px-1.5 py-0.5 rounded-md border transition-all duration-150 cursor-default ${
                isLit
                  ? `${palette.bg} ${palette.text} scale-105 font-bold shadow-xs`
                  : `border-transparent ${palette.text} font-medium`
              }`}
            >
              {pair.ja}
            </span>
          );
        })}
      </div>

      {/* Traducción en Español con los mismos colores emparejados */}
      {es && (
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm">
          {pairs.some((p) => p.es) ? (
            pairs.map((pair, idx) => {
              if (!pair.es) return null;
              const palette = PAIR_COLORS[idx % PAIR_COLORS.length];
              const isLit = highlighted === idx;
              return (
                <span
                  key={idx}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`px-1.5 py-0.5 rounded-md border transition-all duration-150 cursor-default ${
                    isLit
                      ? `${palette.bg} ${palette.text} font-semibold scale-105`
                      : `border-transparent ${palette.text}`
                  }`}
                >
                  {pair.es}
                </span>
              );
            })
          ) : (
            <span className="text-[#5A606B] dark:text-[#9BA1AE]">{es}</span>
          )}
        </div>
      )}
    </div>
  );
}
