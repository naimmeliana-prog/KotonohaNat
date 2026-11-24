import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { UiLanguage } from '../types/kotonoha';
import { TRANSLATIONS, type TranslationTree } from './translations';

interface LanguageContextValue {
  lang: UiLanguage;
  setLang: (lang: UiLanguage) => void;
  t: TranslationTree;
}

const STORAGE_KEY = 'kotonoha-lang';

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'es',
  setLang: () => {},
  t: TRANSLATIONS.es,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<UiLanguage>(() => {
    if (typeof window === 'undefined') return 'es';
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved === 'ja' ? 'ja' : 'es';
  });

  const setLang = (next: UiLanguage) => {
    setLangState(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      document.title = TRANSLATIONS[lang].meta.title;
    }
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: TRANSLATIONS[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}
