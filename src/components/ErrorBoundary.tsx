import { Component, type ErrorInfo, type ReactNode } from 'react';
import { TRANSLATIONS } from '../i18n/translations';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem('kotonoha-lang') : 'es';
    const lang = saved === 'ja' ? 'ja' : 'es';
    return { hasError: true, message: error.message || TRANSLATIONS[lang].errors.fallbackMsg };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Kotonoha ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      const saved = typeof window !== 'undefined' ? window.localStorage.getItem('kotonoha-lang') : 'es';
      const lang = saved === 'ja' ? 'ja' : 'es';
      const errT = TRANSLATIONS[lang].errors;

      return (
        <div className="min-h-screen bg-[#F7F5F0] dark:bg-[#111317] text-[#1A1D21] dark:text-[#F2EFE9] flex items-center justify-center p-6">
          <div className="max-w-lg w-full rounded-2xl bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36] p-8 space-y-4">
            <h1 className="font-display text-2xl font-semibold">{errT.title}</h1>
            <p className="text-sm text-[#5A606B] dark:text-[#9BA1AE]">{errT.subtitle}</p>
            <pre className="p-3 rounded-lg bg-[#F7F5F0] dark:bg-[#111317] text-xs overflow-x-auto text-[#C9372C] dark:text-[#F06B60]">
              {this.state.message}
            </pre>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-[#C9372C] text-white cursor-pointer"
            >
              {errT.reloadBtn}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
