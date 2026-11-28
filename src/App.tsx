/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { onAuthStateChanged } from 'firebase/auth';
import { Moon, Shield, Sun } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';
import { AdminView } from './components/AdminView';
import { AuthModal } from './components/AuthModal';
import { CommunityView } from './components/CommunityView';
import { CoursesView } from './components/CoursesView';
import { DashboardView } from './components/DashboardView';
import { KanjiSection } from './components/KanjiSection';
import { CotidianoSection } from './components/CotidianoSection';
import { DictionaryView } from './components/DictionaryView';
import { ErrorBoundary } from './components/ErrorBoundary';
import { HiraganaView } from './components/HiraganaView';
import { LanguageExchangeView } from './components/LanguageExchangeView';
import { Navbar, type NavSection } from './components/Navbar';
import { PracticeView, type PracticeMode } from './components/PracticeView';
import { useLanguage } from './i18n/LanguageContext';
import { auth } from './lib/firebase';
import {
  createOrLoadUserProfile,
  fetchDashboardStats,
  fetchLessons,
  getUserProfile,
  sanitizeUsername,
  seedFirestoreCatalogIfEmpty,
} from './lib/firestoreService';
import type { AuthUser, UserDashboardStats } from './types/kotonoha';

export default function App() {
  const { lang, t } = useLanguage();
  const [activeSection, setActiveSection] = useState<NavSection>('inicio');
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('oral');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [stats, setStats] = useState<UserDashboardStats | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const saved = window.localStorage.getItem('kotonoha-theme');
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      window.localStorage.setItem('kotonoha-theme', 'dark');
    } else {
      root.classList.remove('dark');
      window.localStorage.setItem('kotonoha-theme', 'light');
    }
  }, [darkMode]);

  const refreshDashboard = useCallback(async () => {
    try {
      const { lessons } = await fetchLessons();
      const s = await fetchDashboardStats(user?.uid ?? null, lessons.length, lang);
      setStats(s);
    } catch {
      // ignore transient offline error
    }
  }, [user?.uid, lang]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setUser(null);
        return;
      }

      try {
        let profile = await getUserProfile(fbUser.uid, fbUser.email, fbUser.emailVerified);
        if (!profile) {
          await new Promise((r) => window.setTimeout(r, 650));
          profile = await getUserProfile(fbUser.uid, fbUser.email, fbUser.emailVerified);
        }
        if (!profile) {
          const fallbackName = sanitizeUsername(
            fbUser.displayName?.split(' ')[0] ||
              fbUser.email?.split('@')[0] ||
              `kotonoha_${fbUser.uid.slice(0, 5)}`
          );
          profile = await createOrLoadUserProfile({
            uid: fbUser.uid,
            username: fallbackName,
            nativeLang: lang === 'ja' ? 'ja' : 'es',
            jlptLevel: 'N5',
            email: fbUser.email,
            emailVerified: fbUser.emailVerified,
          });
        }
        setUser(profile);

        if (profile.isAdmin) {
          seedFirestoreCatalogIfEmpty(profile)
            .then((seeded) => {
              if (seeded.lessonsSeeded > 0 || seeded.dictSeeded > 0) {
                refreshDashboard();
              }
            })
            .catch(() => {});
        }
      } catch {
        setUser(null);
      }
    });
    return () => unsub();
  }, [refreshDashboard, lang]);

  useEffect(() => {
    refreshDashboard();
  }, [refreshDashboard]);

  const handleNavigate = (section: NavSection, subTab?: string) => {
    setActiveSection(section);
    if (section === 'practica' && (subTab === 'oral' || subTab === 'srs' || subTab === 'escritura')) {
      setPracticeMode(subTab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-[#F7F5F0] dark:bg-[#111317] text-[#1A1D21] dark:text-[#F2EFE9] transition-colors duration-200">
        <Navbar
          activeSection={activeSection}
          onNavigate={(sec) => handleNavigate(sec)}
          user={user}
          onOpenAuth={() => setAuthModalOpen(true)}
        />

        <main className="flex-1 w-full max-w-7xl mx-auto px-6 pt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              {activeSection === 'inicio' && (
                <DashboardView
                  user={user}
                  stats={stats}
                  darkMode={darkMode}
                  onToggleDarkMode={() => setDarkMode((d) => !d)}
                  onNavigate={handleNavigate}
                  onOpenAuth={() => setAuthModalOpen(true)}
                />
              )}

              {activeSection === 'hiragana' && (
                <HiraganaView onGoToWritingPractice={() => handleNavigate('practica', 'escritura')} />
              )}

              {activeSection === 'cursos' && (
                <CoursesView
                  user={user}
                  completedLessonIds={stats?.completedLessonIds || []}
                  onRefreshDashboard={refreshDashboard}
                  onRequireAuth={() => setAuthModalOpen(true)}
                />
              )}

              {activeSection === 'practica' && (
                <PracticeView
                  initialMode={practiceMode}
                  user={user}
                  onRefreshDashboard={refreshDashboard}
                  onRequireAuth={() => setAuthModalOpen(true)}
                />
              )}

              {activeSection === 'diccionario' && (
                <DictionaryView
                  user={user}
                  onRefreshDashboard={refreshDashboard}
                  onRequireAuth={() => setAuthModalOpen(true)}
                />
              )}

              {activeSection === 'intercambio' && (
                <LanguageExchangeView
                  user={user}
                  onRequireAuth={() => setAuthModalOpen(true)}
                  onUserUpdated={(updated) => setUser(updated)}
                />
              )}

              {activeSection === 'comunidad' && (
                <CommunityView user={user} onRequireAuth={() => setAuthModalOpen(true)} />
              )}

              {activeSection === 'admin' && (
                <AdminView
                  user={user}
                  darkMode={darkMode}
                  onOpenAuth={() => setAuthModalOpen(true)}
                  onContentUpdated={refreshDashboard}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="border-t border-[#DFD9CD] dark:border-[#252A34] bg-[#F7F5F0] dark:bg-[#111317]">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5A606B] dark:text-[#9BA1AE]">
            <div className="flex items-center gap-3">
              <img src="/favicon.svg" alt="Kotonoha" className="w-5 h-5" />
              <span className="font-display text-base font-semibold text-[#1A1D21] dark:text-[#F2EFE9]">
                Kotonoha
              </span>
              <span aria-hidden="true">·</span>
              <span>{t.footer.tagline}</span>
            </div>

            <div className="flex flex-wrap items-center gap-5">
              <button
                type="button"
                onClick={() => setDarkMode((d) => !d)}
                className="inline-flex items-center gap-1.5 hover:text-[#1A1D21] dark:hover:text-[#F2EFE9] transition-colors cursor-pointer"
              >
                {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                <span>{darkMode ? t.footer.lightMode : t.footer.darkMode}</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavigate('admin')}
                className="inline-flex items-center gap-1.5 hover:text-[#1A1D21] dark:hover:text-[#F2EFE9] transition-colors cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>{t.navbar.admin}</span>
              </button>
            </div>
          </div>
        </footer>

             <AuthModal
       open={authModalOpen}
       onClose={() => setAuthModalOpen(false)}
       user={user}
       onAuthChange={(authUser) => setUser(authUser)}
     />

      </div>
    </ErrorBoundary>
  );
}
