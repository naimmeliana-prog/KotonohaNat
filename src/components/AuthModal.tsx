import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { LogOut, ShieldCheck, X } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { formatT } from '../i18n/translations';
import { useLanguage } from '../i18n/LanguageContext';
import { auth, googleProvider } from '../lib/firebase';
import {
  createOrLoadUserProfile,
  sanitizeUsername,
  updateUserProfile,
} from '../lib/firestoreService';
import type { AuthUser, JlptLevel } from '../types/kotonoha';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  user: AuthUser | null;
  onAuthChange: (user: AuthUser | null) => void;
}

const LEVELS: JlptLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1'];

export function AuthModal({ open, onClose, user, onAuthChange }: AuthModalProps) {
  const { lang, t } = useLanguage();
  const m = t.authModal;

  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nativeLang, setNativeLang] = useState<'es' | 'ja' | 'other'>(lang === 'ja' ? 'ja' : 'es');
  const [jlptLevel, setJlptLevel] = useState<JlptLevel>('N5');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setNativeLang(user.nativeLang);
      setJlptLevel(user.jlptLevel);
      setBio(user.bio);
    } else {
      setNativeLang(lang === 'ja' ? 'ja' : 'es');
    }
  }, [user, lang]);

  if (!open) return null;

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const fallbackHandle = sanitizeUsername(
        cred.user.displayName?.split(' ')[0] || `kotonoha_${cred.user.uid.slice(0, 5)}`
      );
      const profile = await createOrLoadUserProfile({
        uid: cred.user.uid,
        username: fallbackHandle,
        nativeLang: lang === 'ja' ? 'ja' : 'es',
        jlptLevel: 'N5',
        email: cred.user.email,
        emailVerified: cred.user.emailVerified,
      });
      onAuthChange(profile);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : m.googleError);
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const clean = username.trim();
    if (!/^[a-zA-Z0-9_\-]{3,24}$/.test(clean)) {
      setError(m.usernameInvalid);
      return;
    }
    setLoading(true);
    const internalEmail = `${clean.toLowerCase()}@kotonoha.local`;
    try {
      if (mode === 'register') {
        const cred = await createUserWithEmailAndPassword(auth, internalEmail, password);
        const profile = await createOrLoadUserProfile({
          uid: cred.user.uid,
          username: clean,
          nativeLang,
          jlptLevel,
          bio,
          email: cred.user.email,
          emailVerified: cred.user.emailVerified,
        });
        onAuthChange(profile);
      } else {
        const cred = await signInWithEmailAndPassword(auth, internalEmail, password);
        const profile = await createOrLoadUserProfile({
          uid: cred.user.uid,
          username: clean,
          nativeLang: lang === 'ja' ? 'ja' : 'es',
          jlptLevel: 'N5',
          email: cred.user.email,
          emailVerified: cred.user.emailVerified,
        });
        onAuthChange(profile);
      }
      setPassword('');
      onClose();
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || '';
      if (code === 'auth/operation-not-allowed') {
        setError(m.emailDisabledError);
      } else if (code === 'auth/email-already-in-use') {
        setError(m.usernameTakenError);
      } else if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        setError(m.badCredentialsError);
      } else {
        setError(err instanceof Error ? err.message : m.genericAuthError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError(null);
    setSavedMsg(null);
    setLoading(true);
    try {
      await updateUserProfile(user.uid, { jlptLevel, nativeLang, bio });
      onAuthChange({ ...user, jlptLevel, nativeLang, bio });
      setSavedMsg(m.profileSaved);
    } catch (err) {
      setError(err instanceof Error ? err.message : m.profileSaveError);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    onAuthChange(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#2B313D] p-6 sm:p-7 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h2
              id="auth-modal-title"
              className="font-display text-2xl font-semibold text-[#1A1D21] dark:text-[#F2EFE9]"
            >
              {user ? `${m.accountTitlePrefix} ${user.username}` : m.accessTitle}
            </h2>
            <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE] mt-1">
              {user
                ? formatT(m.userSummary, { level: user.jlptLevel, xp: user.xp, days: user.streakDays })
                : m.guestSummary}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={m.closeLabel}
            className="p-2 rounded-lg text-[#5A606B] dark:text-[#9BA1AE] hover:bg-[#ECE8DF] dark:hover:bg-[#252A34] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {user ? (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#5A606B] dark:text-[#9BA1AE] mb-1.5">
                  {m.jlptGoal}
                </label>
                <select
                  value={jlptLevel}
                  onChange={(e) => setJlptLevel(e.target.value as JlptLevel)}
                  className="w-full rounded-lg border border-[#DFD9CD] dark:border-[#2F3643] bg-[#F7F5F0] dark:bg-[#111317] px-3 py-2 text-sm text-[#1A1D21] dark:text-[#F2EFE9]"
                >
                  {LEVELS.map((lv) => (
                    <option key={lv} value={lv}>
                      JLPT {lv}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#5A606B] dark:text-[#9BA1AE] mb-1.5">
                  {m.nativeLangLabel}
                </label>
                <select
                  value={nativeLang}
                  onChange={(e) => setNativeLang(e.target.value as 'es' | 'ja' | 'other')}
                  className="w-full rounded-lg border border-[#DFD9CD] dark:border-[#2F3643] bg-[#F7F5F0] dark:bg-[#111317] px-3 py-2 text-sm text-[#1A1D21] dark:text-[#F2EFE9]"
                >
                  <option value="es">{m.nativeEsStudent}</option>
                  <option value="ja">{m.nativeJaPartner}</option>
                  <option value="other">{m.nativeOther}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5A606B] dark:text-[#9BA1AE] mb-1.5">
                {m.shortBioLabel}
              </label>
              <textarea
                rows={3}
                maxLength={180}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={m.shortBioPlaceholder}
                className="w-full rounded-lg border border-[#DFD9CD] dark:border-[#2F3643] bg-[#F7F5F0] dark:bg-[#111317] px-3 py-2 text-sm text-[#1A1D21] dark:text-[#F2EFE9]"
              />
            </div>

            {error && <p className="text-xs text-[#C9372C] dark:text-[#F06B60]">{error}</p>}
            {savedMsg && <p className="text-xs text-[#2E6F52] dark:text-[#5DC293]">{savedMsg}</p>}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#5A606B] dark:text-[#9BA1AE] hover:text-[#C9372C] dark:hover:text-[#F06B60] transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                {m.logout}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-[#1E3A5F] hover:bg-[#162C49] dark:bg-[#4978B0] text-white transition-colors disabled:opacity-60 cursor-pointer"
              >
                {loading ? m.saving : m.saveProfile}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-5">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg text-sm font-medium border border-[#DFD9CD] dark:border-[#2F3643] bg-[#F7F5F0] dark:bg-[#111317] text-[#1A1D21] dark:text-[#F2EFE9] hover:border-[#C9372C] transition-colors cursor-pointer disabled:opacity-50"
            >
              {m.googleContinue}
            </button>

            <div className="relative flex items-center py-1">
              <div className="flex-grow border-t border-[#ECE8DF] dark:border-[#262C36]" />
              <span className="shrink mx-3 text-[11px] text-[#5A606B] dark:text-[#9BA1AE]">{m.orDivider}</span>
              <div className="flex-grow border-t border-[#ECE8DF] dark:border-[#262C36]" />
            </div>

            <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-[#ECE8DF] dark:bg-[#111317]">
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
                className={`py-2 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  mode === 'register'
                    ? 'bg-white dark:bg-[#22262F] text-[#1A1D21] dark:text-[#F2EFE9] shadow-xs'
                    : 'text-[#5A606B] dark:text-[#9BA1AE]'
                }`}
              >
                {m.tabRegister}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className={`py-2 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white dark:bg-[#22262F] text-[#1A1D21] dark:text-[#F2EFE9] shadow-xs'
                    : 'text-[#5A606B] dark:text-[#9BA1AE]'
                }`}
              >
                {m.tabLogin}
              </button>
            </div>

            <form onSubmit={handleUsernameSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-[#5A606B] dark:text-[#9BA1AE] mb-1">
                  {m.usernameLabel}
                </label>
                <input
                  type="text"
                  required
                  minLength={3}
                  maxLength={24}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={m.usernamePlaceholder}
                  className="w-full rounded-lg border border-[#DFD9CD] dark:border-[#2F3643] bg-[#F7F5F0] dark:bg-[#111317] px-3 py-2 text-sm text-[#1A1D21] dark:text-[#F2EFE9]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5A606B] dark:text-[#9BA1AE] mb-1">
                  {m.passwordLabel}
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  maxLength={100}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={m.passwordPlaceholder}
                  className="w-full rounded-lg border border-[#DFD9CD] dark:border-[#2F3643] bg-[#F7F5F0] dark:bg-[#111317] px-3 py-2 text-sm text-[#1A1D21] dark:text-[#F2EFE9]"
                />
              </div>

              {mode === 'register' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#5A606B] dark:text-[#9BA1AE] mb-1">
                      {m.langProfileLabel}
                    </label>
                    <select
                      value={nativeLang}
                      onChange={(e) => setNativeLang(e.target.value as 'es' | 'ja' | 'other')}
                      className="w-full rounded-lg border border-[#DFD9CD] dark:border-[#2F3643] bg-[#F7F5F0] dark:bg-[#111317] px-3 py-2 text-xs text-[#1A1D21] dark:text-[#F2EFE9]"
                    >
                      <option value="es">{m.learningJaOption}</option>
                      <option value="ja">{m.nativeJaOption}</option>
                      <option value="other">{m.otherLangOption}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#5A606B] dark:text-[#9BA1AE] mb-1">
                      {m.initialLevelLabel}
                    </label>
                    <select
                      value={jlptLevel}
                      onChange={(e) => setJlptLevel(e.target.value as JlptLevel)}
                      className="w-full rounded-lg border border-[#DFD9CD] dark:border-[#2F3643] bg-[#F7F5F0] dark:bg-[#111317] px-3 py-2 text-xs text-[#1A1D21] dark:text-[#F2EFE9]"
                    >
                      {LEVELS.map((lv) => (
                        <option key={lv} value={lv}>
                          JLPT {lv}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-2 text-xs text-[#5A606B] dark:text-[#9BA1AE]">
                <ShieldCheck className="w-4 h-4 shrink-0 text-[#2E6F52] dark:text-[#5DC293] mt-0.5" />
                <span>{m.privacyNote}</span>
              </div>

              {error && <p className="text-xs text-[#C9372C] dark:text-[#F06B60]">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-lg text-sm font-medium bg-[#C9372C] hover:bg-[#AE2D23] dark:bg-[#D9463B] text-white transition-colors disabled:opacity-60 cursor-pointer"
              >
                {loading ? m.connecting : mode === 'register' ? m.createAccountBtn : m.loginBtn}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
