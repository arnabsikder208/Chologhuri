import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  MapPin,
  Map,
  TrendingUp,
  X,
  Trash2,
  ChevronRight,
  Lock,
  LogIn,
  Loader2,
  Compass,
  Sparkles,
  Clock,
  CheckCircle2,
  Users,
  DollarSign
} from 'lucide-react';
import { TripPlan, UserProfile } from '../../types/travel';
import { useI18n } from '../../i18n';

interface MyTripsViewProps {
  trips: TripPlan[];
  onAddTrip: (trip: TripPlan) => Promise<boolean>;
  onDeleteTrip: (id: string) => void;
  currency: 'BDT' | 'USD';
  setActiveTab: (tab: string) => void;
  user: UserProfile | null;
  isLoading: boolean;
  openAuthModal: () => void;
}

export const MyTripsView: React.FC<MyTripsViewProps> = ({
  trips,
  onAddTrip,
  onDeleteTrip,
  currency,
  setActiveTab,
  user,
  isLoading,
  openAuthModal,
}) => {
  const { t } = useI18n();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'All' | 'Upcoming' | 'Completed'>('All');
  const [saving, setSaving] = useState(false);

  // Form state for Create Plan modal
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('Sajek Valley');
  const [days, setDays] = useState(3);
  const [budgetBDT, setBudgetBDT] = useState(12000);
  const [travelersCount, setTravelersCount] = useState(2);
  const [startDate, setStartDate] = useState('2026-09-01');

  const filteredTrips = trips.filter((tr) => activeSubTab === 'All' || tr.status === activeSubTab);

  const totalTripsCount = trips.length;
  const upcomingCount = trips.filter((tr) => tr.status === 'Upcoming').length;
  const completedCount = trips.filter((tr) => tr.status === 'Completed').length;

  const placesVisitedSet = new Set<string>();
  trips.forEach((tr) => tr.placesVisited.forEach((p) => placesVisitedSet.add(p)));
  const totalPlacesVisitedCount = placesVisitedSet.size;
  const totalSpentBDT = trips.reduce((acc, curr) => acc + curr.budgetBDT, 0);

  const formatCost = (bdt: number) => {
    if (currency === 'USD') return `$${Math.round(bdt / 115)}`;
    return `৳${bdt.toLocaleString()} BDT`;
  };

  const districtFor = (dest: string): TripPlan['district'] => {
    if (dest.includes('Sajek') || dest.includes('Kaptai')) return 'Rangamati';
    if (dest.includes('Cox')) return "Cox's Bazar";
    if (dest.includes('Bandarban')) return 'Bandarban';
    if (dest.includes('Chandranath')) return 'Sitakunda';
    return 'Chattogram City';
  };

  const handleOpenCreate = () => {
    if (!user) {
      openAuthModal();
      return;
    }
    setShowCreateModal(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal();
      return;
    }
    const end = new Date(startDate);
    end.setDate(end.getDate() + Number(days));

    const created: TripPlan = {
      id: '',
      title: title || `${days}-Day ${destination} Escape`,
      destination,
      district: districtFor(destination),
      days: Number(days),
      budgetBDT: Number(budgetBDT),
      budgetUSD: Math.round(Number(budgetBDT) / 115),
      persona: user.role,
      status: 'Upcoming',
      startDate,
      endDate: end.toISOString().split('T')[0],
      itinerary: [
        {
          day: 1,
          title: 'Arrival & Scenic Exploration',
          morning: 'Arrival & check in',
          afternoon: 'Local sightseeing',
          evening: 'Sunset viewpoint',
          estExpenseBDT: Math.round(budgetBDT / Math.max(1, days)),
        },
      ],
      placesVisited: [destination],
      travelersCount: Number(travelersCount),
      notes: 'Custom user travel plan',
      createdDate: new Date().toISOString().split('T')[0],
    };

    setSaving(true);
    const ok = await onAddTrip(created);
    setSaving(false);
    if (ok) {
      setShowCreateModal(false);
      setTitle('');
    }
  };

  /* ---------------- Guest view: no trip data, prompt login ---------------- */
  if (!user) {
    return (
      <div className="pb-16 pt-6">
        <div className="glass-card rounded-3xl p-10 sm:p-16 text-center max-w-xl mx-auto space-y-6 shadow-2xl border border-[var(--glass-border)]">
          <div className="w-20 h-20 rounded-3xl mx-auto bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center shadow-xl shadow-emerald-500/20">
            <Lock className="w-9 h-9 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">{t('trips.loginPrompt')}</h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-sm mx-auto leading-relaxed">
              {t('trips.loginPromptDesc')}
            </p>
          </div>
          <button
            onClick={openAuthModal}
            className="btn-brand inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-white font-extrabold text-xs tracking-wide shadow-lg shadow-emerald-600/20 transition-all cursor-pointer active:scale-95"
          >
            <LogIn className="w-4 h-4" />
            <span>{t('auth.login')}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--glass-border)] pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            Personal Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tracking-tight flex items-center gap-2.5">
            <Calendar className="w-7 h-7 text-emerald-500" />
            <span>{t('trips.title')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            {t('trips.subtitle')}
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="btn-brand px-5 py-3 text-white font-extrabold text-xs rounded-2xl flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t('trips.create')}</span>
        </button>
      </div>

      {/* COMPREHENSIVE STATS & SUMMARY CARD */}
      <div className="glass-card-dark rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
          <h2 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span>{t('trips.summary')}</span>
          </h2>
          <span className="text-[11px] font-bold text-slate-400 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            {t('trips.stats')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
          <div className="p-4 bg-white/5 hover:bg-white/10 transition-colors rounded-2xl border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-extrabold uppercase tracking-wider">{t('trips.total')}</span>
              <Calendar className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-3xl font-black text-white">{totalTripsCount}</p>
          </div>

          <div className="p-4 bg-white/5 hover:bg-white/10 transition-colors rounded-2xl border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-extrabold uppercase tracking-wider">{t('trips.places')}</span>
              <MapPin className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-3xl font-black text-emerald-400">{totalPlacesVisitedCount}</p>
          </div>

          <div className="p-4 bg-white/5 hover:bg-white/10 transition-colors rounded-2xl border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-extrabold uppercase tracking-wider">{t('trips.spent')}</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white truncate">{formatCost(totalSpentBDT)}</p>
          </div>
        </div>

        {/* Dynamic Budget Tracker Bar */}
        <div className="p-4 bg-black/30 rounded-2xl border border-white/10 space-y-2.5 relative z-10">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              {t('trips.tracker')}
            </span>
            <span className="text-emerald-400 font-extrabold">{formatCost(totalSpentBDT)} / ৳1,00,000 Cap</span>
          </div>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700 shadow-sm"
              style={{ width: `${Math.min(100, (totalSpentBDT / 100000) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 glass-pill p-1.5 rounded-2xl w-fit border border-[var(--glass-border)]">
        {(['All', 'Upcoming', 'Completed'] as const).map((tab) => {
          const count = tab === 'All' ? totalTripsCount : tab === 'Upcoming' ? upcomingCount : completedCount;
          return (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeSubTab === tab
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <span>{tab === 'All' ? t('trips.all') : tab === 'Upcoming' ? t('trips.upcoming') : t('trips.completed')}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeSubTab === tab ? 'bg-white/20 text-white' : 'bg-[var(--glass-border)] text-[var(--text-muted)]'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* TRIPS GRID LIST */}
      {isLoading ? (
        <div className="p-16 text-center glass-card rounded-3xl flex flex-col items-center gap-3 border border-[var(--glass-border)]">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          <p className="text-xs text-[var(--text-muted)] font-medium">{t('trips.loading')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTrips.map((tr) => (
            <div
              key={tr.id}
              className="glass-card rounded-3xl p-6 space-y-4 flex flex-col justify-between hover-lift border border-[var(--glass-border)] shadow-sm transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 text-[10px] font-extrabold rounded-full uppercase tracking-wider flex items-center gap-1.5 ${
                      tr.status === 'Upcoming'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-500/10 text-[var(--text-secondary)] border border-slate-500/20'
                    }`}
                  >
                    {tr.status === 'Upcoming' ? <Clock className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                    {tr.status}
                  </span>

                  <button
                    onClick={() => onDeleteTrip(tr.id)}
                    className="p-2 rounded-xl text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title={t('trips.delete')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h3 className="font-black text-base sm:text-lg text-[var(--text-primary)] leading-snug">{tr.title}</h3>
                  <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5 mt-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>
                      {tr.destination} <strong className="text-[var(--text-primary)] font-bold">({tr.days} {t('trips.days')})</strong>
                    </span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-3 bg-black/5 dark:bg-white/5 rounded-2xl border border-[var(--glass-border)]">
                    <span className="text-[10px] text-[var(--text-muted)] block font-bold uppercase tracking-wider">{t('trips.dates')}</span>
                    <span className="font-extrabold text-[var(--text-primary)] mt-0.5 block">{tr.startDate}</span>
                  </div>

                  <div className="p-3 bg-black/5 dark:bg-white/5 rounded-2xl border border-[var(--glass-border)] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[var(--text-muted)] block font-bold uppercase tracking-wider">{t('trips.travelers')}</span>
                      <span className="font-extrabold text-[var(--text-primary)] mt-0.5 block flex items-center gap-1">
                        <Users className="w-3 h-3 text-emerald-500" />
                        {tr.travelersCount} {t('trips.persons')}
                      </span>
                    </div>

                    <button
                      onClick={() => setActiveTab('explore')}
                      className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25 transition-colors cursor-pointer"
                      title={t('trips.viewMap')}
                    >
                      <Map className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {tr.placesVisited.length > 0 && (
                  <div className="text-[11px] text-[var(--text-secondary)] bg-emerald-500/5 p-2.5 rounded-xl border border-emerald-500/10">
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{t('trips.spots')}</span> {tr.placesVisited.join(', ')}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[var(--glass-border)] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider block">{t('trips.budget')}</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm sm:text-base">
                    {formatCost(tr.budgetBDT)}
                  </span>
                </div>

                <button
                  onClick={() => setActiveTab('ai-planner')}
                  className="btn-brand px-4 py-2 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
                >
                  <span>{t('trips.edit')}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!isLoading && filteredTrips.length === 0 && (
        <div className="p-16 text-center glass-card rounded-3xl space-y-3 border border-[var(--glass-border)]">
          <Calendar className="w-12 h-12 text-[var(--text-muted)] mx-auto opacity-60" />
          <h3 className="text-base font-black text-[var(--text-primary)]">{t('trips.none')}</h3>
          <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">{t('trips.noneHint')}</p>
          <button
            onClick={handleOpenCreate}
            className="btn-brand mt-2 inline-flex items-center gap-2 px-5 py-2.5 text-white font-extrabold text-xs rounded-xl cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('trips.create')}</span>
          </button>
        </div>
      )}

      {/* CREATE PLAN MODAL */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onMouseDown={(e) => e.target === e.currentTarget && setShowCreateModal(false)}
        >
          <div className="glass-card w-full max-w-lg rounded-3xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 border border-[var(--glass-border)] shadow-2xl">
            <div className="flex justify-between items-center border-b border-[var(--glass-border)] pb-4">
              <div>
                <h3 className="font-black text-[var(--text-primary)] text-base">{t('trips.newPlan')}</h3>
                <p className="text-[11px] text-[var(--text-secondary)]">Customize your upcoming Chattogram adventure</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[var(--text-secondary)] font-extrabold mb-1.5 uppercase tracking-wider text-[10px]">
                  {t('trips.tripTitle')}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sajek Cloud Trek 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="glass-input w-full px-4 py-3 rounded-2xl outline-none font-medium text-[var(--text-primary)] border border-[var(--glass-border)] focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-secondary)] font-extrabold mb-1.5 uppercase tracking-wider text-[10px]">
                    {t('trips.destination')}
                  </label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="glass-input w-full px-4 py-3 rounded-2xl outline-none font-medium text-[var(--text-primary)] border border-[var(--glass-border)] cursor-pointer"
                  >
                    <option value="Sajek Valley" className="bg-white dark:bg-slate-900">Sajek Valley</option>
                    <option value="Cox's Bazar" className="bg-white dark:bg-slate-900">Cox's Bazar</option>
                    <option value="Bandarban" className="bg-white dark:bg-slate-900">Bandarban</option>
                    <option value="Kaptai Lake" className="bg-white dark:bg-slate-900">Kaptai Lake</option>
                    <option value="Chandranath Hill" className="bg-white dark:bg-slate-900">Chandranath Hill</option>
                    <option value="Patenga Beach" className="bg-white dark:bg-slate-900">Patenga Beach</option>
                    <option value="Saint Martin's Island" className="bg-white dark:bg-slate-900">Saint Martin's Island</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[var(--text-secondary)] font-extrabold mb-1.5 uppercase tracking-wider text-[10px]">
                    {t('trips.days')}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="glass-input w-full px-4 py-3 rounded-2xl outline-none font-medium text-[var(--text-primary)] border border-[var(--glass-border)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-secondary)] font-extrabold mb-1.5 uppercase tracking-wider text-[10px]">
                    {t('trips.budgetBdt')}
                  </label>
                  <input
                    type="number"
                    step="1000"
                    value={budgetBDT}
                    onChange={(e) => setBudgetBDT(Number(e.target.value))}
                    className="glass-input w-full px-4 py-3 rounded-2xl outline-none font-medium text-[var(--text-primary)] border border-[var(--glass-border)]"
                  />
                </div>

                <div>
                  <label className="block text-[var(--text-secondary)] font-extrabold mb-1.5 uppercase tracking-wider text-[10px]">
                    {t('trips.startDate')}
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="glass-input w-full px-4 py-3 rounded-2xl outline-none font-medium text-[var(--text-primary)] border border-[var(--glass-border)] cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] font-extrabold mb-1.5 uppercase tracking-wider text-[10px]">
                  {t('trips.travelers')}
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={travelersCount}
                  onChange={(e) => setTravelersCount(Number(e.target.value))}
                  className="glass-input w-full px-4 py-3 rounded-2xl outline-none font-medium text-[var(--text-primary)] border border-[var(--glass-border)]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-brand w-full py-3.5 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 disabled:opacity-60 cursor-pointer active:scale-95"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{saving ? t('planner.saving') : t('trips.save')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
