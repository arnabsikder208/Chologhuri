import React, { useEffect, useRef, useState } from 'react';
import {
  Compass,
  MapPin,
  Search,
  Calendar,
  Sparkles,
  Hotel as HotelIcon,
  BookOpen,
  Users,
  LayoutDashboard,
  Menu,
  X,
  DollarSign,
  Sun,
  Moon,
  Languages,
  LogIn,
  LogOut,
  ChevronDown,
  Mail,
  BadgeCheck,
  Lock,
} from 'lucide-react';
import { UserProfile, ThemeMode } from '../types/travel';
import { useI18n, TranslationKey } from '../i18n';
import logo from '../assets/logo.jpeg';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile | null;
  currency: 'BDT' | 'USD';
  setCurrency: (curr: 'BDT' | 'USD') => void;
  openAuthModal: () => void;
  onLogout: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  theme: ThemeMode;
  toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  currency,
  setCurrency,
  openAuthModal,
  onLogout,
  searchQuery,
  setSearchQuery,
  theme,
  toggleTheme,
}) => {
  const { t, lang, toggleLang } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const navItems: { id: string; label: TranslationKey; icon: React.ElementType; highlight?: boolean; protected?: boolean }[] = [
    { id: 'home', label: 'nav.home', icon: Compass },
    { id: 'explore', label: 'nav.explore', icon: MapPin },
    { id: 'hotels', label: 'nav.hotels', icon: HotelIcon },
    { id: 'blogs', label: 'nav.blogs', icon: BookOpen },
    { id: 'community', label: 'nav.community', icon: Users },
    { id: 'ai-planner', label: 'nav.planner', icon: Sparkles, highlight: true },
    { id: 'my-trips', label: 'nav.myTrips', icon: Calendar, protected: true },
    { id: 'dashboard', label: 'nav.dashboard', icon: LayoutDashboard, protected: true },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  // Close popovers on outside click / Escape
  useEffect(() => {
    if (!profileOpen && !searchOpen) return;
    const onClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setProfileOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [profileOpen, searchOpen]);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const firstName = user ? user.name.trim().split(/\s+/)[0] : '';

  const iconBtn =
    'glass-btn inline-flex items-center justify-center w-9 h-9 rounded-xl text-[var(--text-secondary)] hover:text-[var(--brand)] transition-all';

  return (
    <header className="sticky top-0 z-40">
      <div className="glass-header">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 h-[72px]">
            {/* Brand */}
            <button onClick={() => handleNavClick('home')} className="flex items-center gap-3 group shrink-0">
              <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform duration-300">
                <img src={logo} alt="CholoGhuri logo" className="w-full h-full object-cover" />
              </div>
              <div className="text-left">
                <div className="text-lg font-extrabold tracking-tight leading-none text-[var(--text-primary)]">
                  Cholo<span className="text-gradient-brand">Ghuri</span>
                </div>
                <p className="text-[10.5px] text-[var(--text-muted)] hidden sm:block lg:hidden xl:block font-medium mt-0.5">{t('nav.tagline')}</p>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 glass-pill px-1.5 py-1.5 rounded-2xl">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const locked = item.protected && !user;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    title={locked ? t('auth.requiredTitle') : t(item.label)}
                    className={`nav-link relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-medium whitespace-nowrap transition-all duration-300 ${
                      isActive
                        ? 'nav-link-active text-white shadow-md shadow-emerald-500/25'
                        : item.highlight
                        ? 'text-emerald-600 dark:text-emerald-300'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0 xl:hidden" />
                    <span className="hidden xl:inline">{t(item.label)}</span>
                    {locked && <Lock className="w-3 h-3 opacity-60 hidden xl:inline" />}
                    {item.highlight && !isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                  </button>
                );
              })}
            </nav>

            {/* Right controls */}
            <div className="hidden md:flex items-center gap-1.5 xl:gap-2 shrink-0">
              {/* Search (popover keeps the header compact) */}
              <div className="relative" ref={searchRef}>
                <button
                  onClick={() => setSearchOpen((o) => !o)}
                  className={`${iconBtn} ${searchOpen || searchQuery ? 'text-[var(--brand)] ring-2 ring-emerald-500/30' : ''}`}
                  title={t('nav.search')}
                  aria-label={t('nav.search')}
                >
                  <Search className="w-4 h-4" />
                </button>
                {searchOpen && (
                  <div className="profile-dropdown glass-card absolute right-0 mt-3 w-72 p-2 rounded-2xl z-50">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder={t('nav.searchLong')}
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          if (activeTab !== 'explore') setActiveTab('explore');
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && setSearchOpen(false)}
                        className="glass-input w-full pl-9 pr-3 py-2.5 text-xs rounded-xl outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Currency */}
              <button
                onClick={() => setCurrency(currency === 'BDT' ? 'USD' : 'BDT')}
                className="glass-btn flex items-center gap-1 px-2.5 h-9 rounded-xl text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--brand)]"
                title={t('nav.currency')}
              >
                <span>{currency}</span>
              </button>

              {/* Language */}
              <button onClick={toggleLang} className={`${iconBtn} w-auto px-2.5 gap-1 text-xs font-bold`} title={t('nav.language')}>
                <span>{lang === 'en' ? 'বাং' : 'EN'}</span>
              </button>

              {/* Theme */}
              <button
                onClick={toggleTheme}
                className={`${iconBtn} theme-toggle`}
                title={theme === 'dark' ? t('nav.theme.light') : t('nav.theme.dark')}
                aria-label="Toggle dark mode"
              >
                <span className="theme-toggle-icon" key={theme}>
                  {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
                </span>
              </button>

              {/* Auth: login button OR profile dropdown */}
              {!user ? (
                <button
                  onClick={openAuthModal}
                  className="btn-brand flex items-center gap-2 pl-3 pr-4 h-9 rounded-xl text-xs font-bold text-white"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden 2xl:inline">{t('auth.login')}</span>
                  <span className="2xl:hidden">{t('auth.signIn')}</span>
                </button>
              ) : (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen((o) => !o)}
                    className={`glass-btn flex items-center gap-2 pl-1 pr-2.5 h-9 rounded-xl text-xs font-semibold text-[var(--text-primary)] ${
                      profileOpen ? 'ring-2 ring-emerald-500/40' : ''
                    }`}
                    aria-haspopup="menu"
                    aria-expanded={profileOpen}
                  >
                    <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-lg object-cover ring-2 ring-emerald-500/50" />
                    <span className="truncate max-w-[90px]">{firstName}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-[var(--text-muted)] transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {profileOpen && (
                    <div className="profile-dropdown glass-card absolute right-0 mt-3 w-72 rounded-2xl overflow-hidden z-50" role="menu">
                      <div className="relative p-5 pb-4 text-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent" />
                        <div className="relative">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-16 h-16 rounded-2xl object-cover mx-auto ring-4 ring-white/60 dark:ring-white/10 shadow-lg"
                          />
                          <h4 className="mt-3 text-sm font-bold text-[var(--text-primary)] flex items-center justify-center gap-1">
                            {user.name}
                            <BadgeCheck className="w-4 h-4 text-emerald-500" />
                          </h4>
                          <p className="text-[11px] text-[var(--text-muted)] flex items-center justify-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3" />
                            <span className="truncate">{user.email}</span>
                          </p>
                          <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 text-[10px] font-bold">
                            {user.role}
                          </span>
                        </div>
                      </div>
                      <div className="p-2 border-t border-[var(--glass-border)] space-y-1">
                        <button
                          onClick={() => {
                            setProfileOpen(false);
                            handleNavClick('dashboard');
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--glass-hover)] hover:text-[var(--text-primary)] transition-colors"
                          role="menuitem"
                        >
                          <LayoutDashboard className="w-4 h-4 text-emerald-500" />
                          <span>{t('auth.viewProfile')}</span>
                        </button>
                        <button
                          onClick={() => {
                            setProfileOpen(false);
                            onLogout();
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors"
                          role="menuitem"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>{t('auth.signOut')}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile controls */}
            <div className="flex lg:hidden items-center gap-1.5">
              <button onClick={toggleLang} className={`${iconBtn} md:hidden w-auto px-2 text-[11px] font-bold`} title={t('nav.language')}>
                {lang === 'en' ? 'বাং' : 'EN'}
              </button>
              <button onClick={toggleTheme} className={`${iconBtn} md:hidden theme-toggle`} aria-label="Toggle dark mode">
                <span className="theme-toggle-icon" key={theme}>
                  {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
                </span>
              </button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={iconBtn} aria-label={t('nav.menu')}>
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[var(--glass-border)] px-4 pt-4 pb-6 space-y-4 animate-in slide-in-from-top-2 fade-in">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder={t('nav.searchLong')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => activeTab !== 'explore' && setActiveTab('explore')}
                className="glass-input w-full pl-9 pr-3 py-2.5 text-xs rounded-xl outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl text-xs font-semibold transition-all ${
                      isActive ? 'nav-link-active text-white' : 'glass-btn text-[var(--text-secondary)]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="truncate">{t(item.label)}</span>
                    {item.protected && !user && <Lock className="w-3 h-3 ml-auto opacity-60" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[var(--glass-border)] flex items-center justify-between gap-3">
              <button
                onClick={() => setCurrency(currency === 'BDT' ? 'USD' : 'BDT')}
                className="glass-btn px-3 h-9 rounded-xl text-xs font-bold text-[var(--text-secondary)] flex items-center gap-1"
              >
                <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> {currency}
              </button>

              {!user ? (
                <button
                  onClick={() => {
                    openAuthModal();
                    setMobileMenuOpen(false);
                  }}
                  className="btn-brand flex items-center gap-2 px-4 h-9 rounded-xl text-xs font-bold text-white"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{t('auth.login')}</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 flex-1 justify-end">
                  <img src={user.avatar} className="w-9 h-9 rounded-xl object-cover ring-2 ring-emerald-500/50" alt={user.name} />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[var(--text-primary)] truncate">{user.name}</p>
                    <p className="text-[10px] text-[var(--text-muted)] truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="p-2 rounded-xl text-red-500 hover:bg-red-500/10"
                    title={t('auth.signOut')}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
