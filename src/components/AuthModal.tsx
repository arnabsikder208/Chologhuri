import React, { useEffect, useState } from 'react';
import { X, User, Mail, Lock, CheckCircle2, Compass, ShieldCheck } from 'lucide-react';
import { PersonaType, AuthUser } from '../types/travel';
import { useI18n } from '../i18n';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: AuthUser, token: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const { t } = useI18n();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<PersonaType>('Solo Travelers');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const personas: PersonaType[] = [
    'Foreign Tourists',
    'Solo Travelers',
    'Couples',
    'Families',
    'Female Travelers',
    'Backpackers',
    'Tour Guides',
    'Hotels',
    'Restaurants',
    'Travel Agencies',
    'Admin',
  ];

  const switchMode = (login: boolean) => {
    setIsLogin(login);
    setError('');
    setSuccess('');
    setPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/routes/auth/login' : '/routes/auth/register';
      const body = isLogin ? { email, password } : { name, email, password, phone, role };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.token) {
        setError(data.message || 'Something went wrong');
        return;
      }

      setSuccess(data.message);
      setTimeout(() => {
        onAuthSuccess(data.user as AuthUser, data.token as string);
        setPassword('');
        setSuccess('');
      }, 500);
    } catch (err) {
      console.error('Authentication error:', err);
      setError(t('auth.networkError'));
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    'glass-input w-full pl-9 pr-3 py-2.5 rounded-xl outline-none text-[var(--text-primary)] text-xs';

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="glass-card w-full max-w-md rounded-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="relative p-6 text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-slate-900" />
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold leading-tight">{isLogin ? t('auth.welcomeBack') : t('auth.createTitle')}</h3>
                <p className="text-[11px] text-emerald-100/90 mt-0.5">{t('auth.subtitle')}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors" aria-label={t('common.close')}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="p-2 mx-5 mt-4 glass-pill rounded-2xl grid grid-cols-2 gap-1 text-xs font-bold">
          <button
            onClick={() => switchMode(true)}
            className={`py-2 rounded-xl transition-all ${isLogin ? 'nav-link-active text-white shadow' : 'text-[var(--text-secondary)]'}`}
          >
            {t('auth.signIn')}
          </button>
          <button
            onClick={() => switchMode(false)}
            className={`py-2 rounded-xl transition-all ${!isLogin ? 'nav-link-active text-white shadow' : 'text-[var(--text-secondary)]'}`}
          >
            {t('auth.createAccount')}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {!isLogin && (
            <div>
              <label className="block text-[var(--text-secondary)] font-semibold mb-1">{t('auth.fullName')}</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Tanvir Hossain" className={inputCls} />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[var(--text-secondary)] font-semibold mb-1">{t('auth.email')}</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className={inputCls} />
            </div>
          </div>

          <div>
            <label className="block text-[var(--text-secondary)] font-semibold mb-1">{t('auth.password')}</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.passwordPlaceholder')}
                minLength={6}
                className={inputCls}
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-[var(--text-secondary)] font-semibold mb-1">{t('auth.persona')}</label>
              <select value={role} onChange={(e) => setRole(e.target.value as PersonaType)} className="glass-input w-full px-3 py-2.5 rounded-xl outline-none text-xs">
                {personas.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-[var(--text-muted)] mt-1">{t('auth.personaHint')}</p>
            </div>
          )}

          {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs animate-in fade-in">{error}</div>}
          {success && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs animate-in fade-in">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-brand w-full py-3 rounded-2xl text-white font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{loading ? t('auth.pleaseWait') : isLogin ? t('auth.signInBtn') : t('auth.registerBtn')}</span>
          </button>

          <div className="pt-3 text-center border-t border-[var(--glass-border)] text-[10.5px] text-[var(--text-muted)] flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>{t('auth.secured')}</span>
          </div>
        </form>
      </div>
    </div>
  );
};