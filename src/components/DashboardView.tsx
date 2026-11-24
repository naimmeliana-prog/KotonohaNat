import { ArrowRight, BookOpen, CheckCircle2, Globe2, Mic, Moon, PenTool, Repeat, Sun, Users } from 'lucide-react';
import { useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatT } from '../i18n/translations';
import { useLanguage } from '../i18n/LanguageContext';
import type { AuthUser, UserDashboardStats } from '../types/kotonoha';
import type { NavSection } from './Navbar';

const HERO_ART_SRC = '/src/assets/images/hero_fuji_kanagawa_1795521028207.jpg';
const SHODO_ART_SRC = '/src/assets/images/card_shodo_writing_1795521007105.jpg';
const COMMUNITY_ART_SRC = '/src/assets/images/card_kanagawa_community_1795521087201.jpg';

interface DashboardViewProps {
  user: AuthUser | null;
  stats: UserDashboardStats | null;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onNavigate: (section: NavSection, subTab?: string) => void;
  onOpenAuth: () => void;
}

export function DashboardView({
  user,
  stats,
  darkMode,
  onToggleDarkMode,
  onNavigate,
  onOpenAuth,
}: DashboardViewProps) {
  const { lang, t } = useLanguage();
  const d = t.dashboard;

  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [shodoImgFailed, setShodoImgFailed] = useState(false);
  const [commImgFailed, setCommImgFailed] = useState(false);

  const series = stats?.dailySeries || [];
  const hasRealStudyData = series.some((pt) => pt.xp > 0);

  return (
    <div className="space-y-14 pb-16">
      {/* Editorial 2-Column Hero Split (items-stretch) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch pt-4">
        <div className="lg:col-span-6 flex flex-col justify-between py-2">
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE]">{d.eyebrow}</p>
              <button
                type="button"
                onClick={onToggleDarkMode}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#DFD9CD] dark:border-[#2C323E] bg-white dark:bg-[#191C22] text-[#1A1D21] dark:text-[#F2EFE9] hover:border-[#C9372C] dark:hover:border-[#E04F44] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                {darkMode ? d.lightMode : d.darkMode}
              </button>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.35rem] font-semibold leading-[1.1] tracking-tight text-[#1A1D21] dark:text-[#F2EFE9]">
              {d.heroTitle}
            </h1>

            <p className="text-base leading-relaxed text-[#4A505A] dark:text-[#B3B8C4] max-w-xl">
              {d.heroSubtitle}
            </p>
          </div>

          <div className="pt-8 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              {lang === 'ja' ? (
                <>
                  <button
                    type="button"
                    onClick={() => onNavigate('intercambio')}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium bg-[#C9372C] hover:bg-[#AE2D23] dark:bg-[#D9463B] dark:hover:bg-[#C2392F] text-white transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <Globe2 className="w-4 h-4" />
                    {d.primaryCta}
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('practica', 'oral')}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium border border-[#1E3A5F]/25 dark:border-[#5B8CC4]/35 bg-white dark:bg-[#191C22] text-[#1A1D21] dark:text-[#F2EFE9] hover:border-[#1E3A5F] dark:hover:border-[#5B8CC4] transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {d.secondaryCta}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => onNavigate('practica', 'oral')}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium bg-[#C9372C] hover:bg-[#AE2D23] dark:bg-[#D9463B] dark:hover:bg-[#C2392F] text-white transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <Mic className="w-4 h-4" />
                    {d.primaryCta}
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('cursos')}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium border border-[#1E3A5F]/25 dark:border-[#5B8CC4]/35 bg-white dark:bg-[#191C22] text-[#1A1D21] dark:text-[#F2EFE9] hover:border-[#1E3A5F] dark:hover:border-[#5B8CC4] transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {d.secondaryCta}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('intercambio')}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium border border-[#DFD9CD] dark:border-[#2C323E] bg-white/70 dark:bg-[#191C22]/70 text-[#1E3A5F] dark:text-[#7FAEE3] hover:border-[#C9372C] transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <Globe2 className="w-4 h-4" />
                    {d.exchangeCta}
                  </button>
                </>
              )}
            </div>

            {!user && (
              <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE]">
                {d.guestPromptPrefix}{' '}
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="underline underline-offset-4 text-[#1E3A5F] dark:text-[#7FAEE3] hover:text-[#C9372C] cursor-pointer"
                >
                  {d.guestPromptLink}
                </button>
                .
              </p>
            )}
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="h-full min-h-[280px] sm:min-h-[340px] rounded-2xl overflow-hidden border border-[#DFD9CD] dark:border-[#262C36] bg-[#ECE8DF] dark:bg-[#191C22]">
            {!heroImgFailed ? (
              <img
                src={HERO_ART_SRC}
                alt={d.heroAlt}
                referrerPolicy="no-referrer"
                onError={() => setHeroImgFailed(true)}
                className="w-full h-full lg:h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-10 bg-gradient-to-b from-[#F7F5F0] to-[#E8E2D6] dark:from-[#171B24] dark:to-[#111317]">
                <svg viewBox="0 0 240 160" className="w-56 h-36" aria-hidden="true">
                  <circle cx="120" cy="64" r="34" fill="#C9372C" />
                  <path d="M30 132 L105 64 L120 72 L135 64 L210 132 Z" fill="#1E3A5F" />
                  <path d="M105 64 L120 72 L135 64 L145 78 L120 84 L95 78 Z" fill="#F7F5F0" />
                </svg>
                <p className="font-jp-serif text-sm text-[#5A606B] dark:text-[#9BA1AE] mt-2">{d.fallbackCaption}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Full-width 4-column KPI strip below hero split */}
      <section aria-label={d.kpiSectionLabel} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36] p-5">
          <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE]">{d.kpiStreakTitle}</p>
          <p className="font-mono-num text-3xl font-semibold text-[#1A1D21] dark:text-[#F2EFE9] mt-2">
            {stats?.streakDays ?? 1}{' '}
            <span className="text-sm font-normal text-[#5A606B] dark:text-[#9BA1AE]">{d.kpiStreakUnit}</span>
          </p>
          <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE] mt-1">
            {formatT(d.kpiTodayMin, { min: stats?.todayMinutes ?? 0 })}
          </p>
        </div>

        <div className="rounded-xl bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36] p-5">
          <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE]">{d.kpiDueTitle}</p>
          <p className="font-mono-num text-3xl font-semibold text-[#C9372C] dark:text-[#E04F44] mt-2">
            {stats?.dueCards ?? 8}
          </p>
          <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE] mt-1">
            {formatT(d.kpiMasteredSub, {
              mastered: stats?.masteredCards ?? 0,
              total: stats?.totalCards ?? 8,
            })}
          </p>
        </div>

        <div className="rounded-xl bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36] p-5">
          <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE]">{d.kpiUnitsTitle}</p>
          <p className="font-mono-num text-3xl font-semibold text-[#1E3A5F] dark:text-[#7FAEE3] mt-2">
            {stats?.completedUnits ?? 0}
            <span className="text-base font-normal text-[#5A606B] dark:text-[#9BA1AE]">
              /{stats?.totalUnits ?? 11}
            </span>
          </p>
          <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE] mt-1">
            {d.kpiWeeklyAccPrefix} {stats?.weeklyAccuracy ? `${stats.weeklyAccuracy}%` : d.kpiNoSessions}
          </p>
        </div>

        <div className="rounded-xl bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36] p-5">
          <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE]">{d.kpiXpTitle}</p>
          <p className="font-mono-num text-3xl font-semibold text-[#2E6F52] dark:text-[#5DC293] mt-2">
            {stats?.xp ?? 0} <span className="text-sm font-normal text-[#5A606B] dark:text-[#9BA1AE]">XP</span>
          </p>
          <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE] mt-1">
            {d.kpiGoalPrefix} {user?.jlptLevel || 'N5'}
          </p>
        </div>
      </section>

      {/* Personalized Progress Chart + Daily Plan */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 rounded-xl bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36] p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-6">
            <div>
              <h2 className="font-display text-2xl font-semibold text-[#1A1D21] dark:text-[#F2EFE9]">
                {d.chartTitle}
              </h2>
              <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE] mt-0.5">{d.chartSubtitle}</p>
            </div>
            <span className="text-xs font-mono-num text-[#5A606B] dark:text-[#9BA1AE]">
              {hasRealStudyData ? d.chartSynced : d.chartEmpty}
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="xpFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9372C" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#C9372C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#262C36' : '#E7E2D8'} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: darkMode ? '#9BA1AE' : '#5A606B' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: darkMode ? '#9BA1AE' : '#5A606B' }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#191C22' : '#FFFFFF',
                    borderColor: darkMode ? '#2E3440' : '#DFD9CD',
                    borderRadius: 10,
                    fontSize: 12,
                    color: darkMode ? '#F2EFE9' : '#1A1D21',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="xp"
                  name={d.chartTooltipXp}
                  stroke="#C9372C"
                  strokeWidth={2.2}
                  fill="url(#xpFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {stats && stats.recentActivities.length > 0 && (
            <div className="mt-6 pt-5 border-t border-[#ECE8DF] dark:border-[#262C36]">
              <p className="text-xs font-medium text-[#5A606B] dark:text-[#9BA1AE] mb-3">{d.recentActivityTitle}</p>
              <ul className="divide-y divide-[#ECE8DF] dark:divide-[#262C36]">
                {stats.recentActivities.slice(0, 4).map((act) => (
                  <li key={act.id} className="py-2 flex items-center justify-between gap-4 text-sm">
                    <span className="text-[#1A1D21] dark:text-[#F2EFE9] truncate">{act.details || act.activityType}</span>
                    <span className="font-mono-num text-xs text-[#2E6F52] dark:text-[#5DC293] shrink-0">
                      +{act.xpEarned} XP · {act.score}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Daily Study / Exchange Plan */}
        <div className="lg:col-span-5 rounded-xl bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36] p-6 flex flex-col justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-[#1A1D21] dark:text-[#F2EFE9]">
              {d.routineTitle}
            </h2>
            <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE] mt-1 mb-5">{d.routineSubtitle}</p>

            <div className="divide-y divide-[#ECE8DF] dark:divide-[#262C36]">
              <button
                type="button"
                onClick={() => onNavigate('intercambio')}
                className="w-full py-3.5 flex items-center justify-between gap-4 text-left hover:opacity-80 transition-opacity cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <Globe2 className="w-5 h-5 text-[#C9372C] dark:text-[#E04F44] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#1A1D21] dark:text-[#F2EFE9]">{d.routineExchangeTitle}</p>
                    <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE] mt-0.5">
                      {formatT(d.routineExchangeSub, { due: stats?.dueCards ?? 8 })}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#5A606B] dark:text-[#9BA1AE] shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('practica', 'srs')}
                className="w-full py-3.5 flex items-center justify-between gap-4 text-left hover:opacity-80 transition-opacity cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <Repeat className="w-5 h-5 text-[#1E3A5F] dark:text-[#7FAEE3] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#1A1D21] dark:text-[#F2EFE9]">{d.routineSrsTitle}</p>
                    <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE] mt-0.5">
                      {formatT(d.routineSrsSub, { due: stats?.dueCards ?? 8 })}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#5A606B] dark:text-[#9BA1AE] shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('practica', 'oral')}
                className="w-full py-3.5 flex items-center justify-between gap-4 text-left hover:opacity-80 transition-opacity cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <Mic className="w-5 h-5 text-[#2E6F52] dark:text-[#5DC293] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#1A1D21] dark:text-[#F2EFE9]">{d.routineOralTitle}</p>
                    <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE] mt-0.5">{d.routineOralSub}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#5A606B] dark:text-[#9BA1AE] shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('cursos')}
                className="w-full py-3.5 flex items-center justify-between gap-4 text-left hover:opacity-80 transition-opacity cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-[#7A542E] dark:text-[#D9A76A] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#1A1D21] dark:text-[#F2EFE9]">{d.routineCoursesTitle}</p>
                    <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE] mt-0.5">{d.routineCoursesSub}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#5A606B] dark:text-[#9BA1AE] shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('practica', 'escritura')}
                className="w-full py-3.5 flex items-center justify-between gap-4 text-left hover:opacity-80 transition-opacity cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <PenTool className="w-5 h-5 text-[#5A606B] dark:text-[#9BA1AE] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#1A1D21] dark:text-[#F2EFE9]">{d.routineWritingTitle}</p>
                    <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE] mt-0.5">{d.routineWritingSub}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#5A606B] dark:text-[#9BA1AE] shrink-0" />
              </button>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[#ECE8DF] dark:border-[#262C36] flex items-center gap-2 text-xs text-[#5A606B] dark:text-[#9BA1AE]">
            <CheckCircle2 className="w-4 h-4 text-[#2E6F52] dark:text-[#5DC293] shrink-0" />
            <span>{d.routineFooter}</span>
          </div>
        </div>
      </section>

      {/* Two Curated Feature Spotlights with Generated Artworks */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <article className="rounded-2xl overflow-hidden bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36] flex flex-col">
          <div className="aspect-[16/9] overflow-hidden bg-[#ECE8DF] dark:bg-[#151820]">
            {!shodoImgFailed ? (
              <img
                src={SHODO_ART_SRC}
                alt={d.spotlight1Alt}
                referrerPolicy="no-referrer"
                onError={() => setShodoImgFailed(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-jp-serif text-4xl text-[#5A606B]">
                書道
              </div>
            )}
          </div>
          <div className="p-6 flex-1 flex flex-col justify-between gap-4">
            <div>
              <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE]">{d.spotlight1Eyebrow}</p>
              <h3 className="font-display text-2xl font-semibold text-[#1A1D21] dark:text-[#F2EFE9] mt-1">
                {d.spotlight1Title}
              </h3>
              <p className="text-sm text-[#4A505A] dark:text-[#B3B8C4] mt-2 leading-relaxed">{d.spotlight1Desc}</p>
            </div>
            <div>
              <button
                type="button"
                onClick={() => onNavigate(lang === 'ja' ? 'intercambio' : 'practica', lang === 'ja' ? undefined : 'escritura')}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#C9372C] dark:text-[#E04F44] hover:underline underline-offset-4 cursor-pointer"
              >
                {d.spotlight1Cta}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </article>

        <article className="rounded-2xl overflow-hidden bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36] flex flex-col">
          <div className="aspect-[16/9] overflow-hidden bg-[#ECE8DF] dark:bg-[#151820]">
            {!commImgFailed ? (
              <img
                src={COMMUNITY_ART_SRC}
                alt={d.spotlight2Alt}
                referrerPolicy="no-referrer"
                onError={() => setCommImgFailed(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-jp-serif text-4xl text-[#1E3A5F]">
                交流
              </div>
            )}
          </div>
          <div className="p-6 flex-1 flex flex-col justify-between gap-4">
            <div>
              <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE]">{d.spotlight2Eyebrow}</p>
              <h3 className="font-display text-2xl font-semibold text-[#1A1D21] dark:text-[#F2EFE9] mt-1">
                {d.spotlight2Title}
              </h3>
              <p className="text-sm text-[#4A505A] dark:text-[#B3B8C4] mt-2 leading-relaxed">{d.spotlight2Desc}</p>
            </div>
            <div>
              <button
                type="button"
                onClick={() => onNavigate(lang === 'ja' ? 'comunidad' : 'intercambio')}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#1E3A5F] dark:text-[#7FAEE3] hover:underline underline-offset-4 cursor-pointer"
              >
                <Users className="w-4 h-4" />
                {d.spotlight2Cta}
              </button>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
