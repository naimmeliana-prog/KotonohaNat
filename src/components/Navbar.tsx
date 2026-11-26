import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import type { AuthUser } from '../types/kotonoha';

export type NavSection =
  | 'inicio'
  | 'hiragana'
  | 'cursos'
  | 'practica'
  | 'diccionario'
  | 'intercambio'
  | 'comunidad'
  | 'admin';

interface NavbarProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  user: AuthUser | null;
  onOpenAuth: () => void;
}

export function Navbar({ activeSection, onNavigate, user, onOpenAuth }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();

  const navItems: { id: NavSection; label: string }[] = [
    { id: 'inicio', label: t.navbar.inicio },
    { id: 'hiragana', label: lang === 'ja' ? 'ひらがな' : 'Hiragana' },
    { id: 'cursos', label: t.navbar.cursos },
    { id: 'practica', label: t.navbar.practica },
    { id: 'diccionario', label: t.navbar.diccionario },
    { id: 'intercambio', label: t.navbar.intercambio },
    { id: 'comunidad', label: t.navbar.comunidad },
  ];

  const handleNav = (section: NavSection) => {
    onNavigate(section);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F7F5F0]/95 dark:bg-[#111317]/95 backdrop-blur-md border-b border-[#DFD9CD] dark:border-[#252A34]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => handleNav('inicio')}
          className="font-display text-2xl font-semibold tracking-tight text-[#1A1D21] dark:text-[#F2EFE9] hover:text-[#C9372C] dark:hover:text-[#E04F44] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C9372C]"
        >
          Kotonoha
        </button>

        <nav aria-label={t.navbar.ariaNav} className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => {
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`relative py-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C9372C] ${
                  active
                    ? 'text-[#1A1D21] dark:text-[#F2EFE9]'
                    : 'text-[#5A606B] dark:text-[#9BA1AE] hover:text-[#1A1D21] dark:hover:text-[#F2EFE9]'
                }`}
              >
                {item.label}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-[21px] h-[2px] bg-[#C9372C] dark:bg-[#E04F44]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5 shrink-0">
          <div
            role="group"
            aria-label={t.navbar.switchLanguage}
            className="inline-flex items-center p-0.5 rounded-lg bg-[#ECE8DF] dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#2C323E]"
          >
            <button
              type="button"
              onClick={() => setLang('es')}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                lang === 'es'
                  ? 'bg-white dark:bg-[#272D38] text-[#C9372C] dark:text-[#E04F44] shadow-xs'
                  : 'text-[#5A606B] dark:text-[#9BA1AE] hover:text-[#1A1D21] dark:hover:text-[#F2EFE9]'
              }`}
            >
              🇪🇸 Español
            </button>
            <button
              type="button"
              onClick={() => setLang('ja')}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                lang === 'ja'
                  ? 'bg-white dark:bg-[#272D38] text-[#C9372C] dark:text-[#E04F44] shadow-xs'
                  : 'text-[#5A606B] dark:text-[#9BA1AE] hover:text-[#1A1D21] dark:hover:text-[#F2EFE9]'
              }`}
            >
              🇯🇵 日本語
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenAuth}
            className="px-3.5 py-2 text-sm font-medium rounded-lg bg-[#C9372C] hover:bg-[#AE2D23] dark:bg-[#D9463B] dark:hover:bg-[#C2392F] text-white transition-colors whitespace-nowrap shrink-0 max-w-[140px] truncate cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9372C]"
          >
            {user ? user.username : t.navbar.signIn}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? t.navbar.closeMenu : t.navbar.openMenu}
            className="lg:hidden p-2 rounded-lg text-[#1A1D21] dark:text-[#F2EFE9] hover:bg-[#ECE8DF] dark:hover:bg-[#1E232D] transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-[#DFD9CD] dark:border-[#252A34] bg-[#F7F5F0] dark:bg-[#111317] px-6 py-4 flex flex-col gap-2">
          {navItems.map((item) => {
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`text-left py-2.5 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#ECE8DF] dark:bg-[#1E232D] text-[#C9372C] dark:text-[#E04F44]'
                    : 'text-[#1A1D21] dark:text-[#F2EFE9] hover:bg-[#ECE8DF]/60 dark:hover:bg-[#1E232D]/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
