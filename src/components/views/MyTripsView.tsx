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
  const [budgetBDT, setBudgetBDT] = useState(10000);
  const [travelersCount, setTravelersCount] = useState(2);
  const [startDate, setStartDate] = useState('2026-09-01');

  const filteredTrips = trips.filter((tr) => activeSubTab === 'All' || tr.status === activeSubTab);

  const totalTripsCount = trips.length;
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
    // Guests must log in before they can add a trip
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

  const subTabLabel = (tab: 'All' | 'Upcoming' | 'Completed') =>
    tab === 'All' ? t('trips.all') : tab === 'Upcoming' ? t('trips.upcoming') : t('trips.completed');

  /* ---------------- Guest view: no trip data, prompt login ---------------- */
  if (!user) {
    return (
      <div className="pb-12">
        <div className="glass-card rounded-3xl p-10 sm:p-16 text-center max-w-2xl mx-auto space-y-5 animate-in fade-in zoom-in-95">
          <div className="w-20 h-20 rounded-3xl mx-auto bg-gradient-to-br from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-xl shadow-emerald-500/30">
            <Lock className="w-9 h-9" />
          </div>
          <h2 className="text-2xl font-black text-[var(--text-primary)]">{t('trips.loginPrompt')}</h2>
          <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">{t('trips.loginPromptDesc')}</p>
          <button onClick={openAuthModal} className="btn-brand inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-bold text-sm">
            <LogIn className="w-4 h-4" />
            <span>{t('auth.login')}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--glass-border)] pb-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-emerald-500" />
            <span>{t('trips.title')}</span>
          </h1>
          <p className="text-xs text-[var(--text-muted)]">{t('trips.subtitle')}</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="btn-brand px-5 py-2.5 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t('trips.create')}</span>
        </button>
      </div>

      {/* Summary */}
      <div className="glass-card-dark rounded-3xl p-6 sm:p-8 text-white space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-sm font-bold tracking-wider text-emerald-400 uppercase flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span>{t('trips.summary')}</span>
          </h2>
          <span className="text-xs text-slate-400">{t('trips.stats')}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-xs text-slate-400 font-semibold">{t('trips.total')}</p>
            <p className="text-3xl font-black text-white mt-1">{totalTripsCount}</p>
          </div>
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-xs text-slate-400 font-semibold">{t('trips.places')}</p>
            <p className="text-3xl font-black text-emerald-400 mt-1">{totalPlacesVisitedCount}</p>
          </div>
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-xs text-slate-400 font-semibold">{t('trips.spent')}</p>
            <p className="text-3xl font-black text-white mt-1">{formatCost(totalSpentBDT)}</p>
          </div>
        </div>

        <div className="p-4 bg-black/20 rounded-2xl border border-white/10 space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-300">{t('trips.tracker')}</span>
            <span className="text-emerald-400">{formatCost(totalSpentBDT)} / ৳1,00,000 Cap</span>
          </div>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, (totalSpentBDT / 100000) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 glass-pill p-1.5 rounded-2xl w-fit">
        {(['All', 'Upcoming', 'Completed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeSubTab === tab ? 'nav-link-active text-white shadow' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {subTabLabel(tab)} {t('trips.tours')}
          </button>
        ))}
      </div>

      {/* Trip cards */}
      {isLoading ? (
        <div className="p-12 text-center glass-card rounded-2xl flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          <p className="text-xs text-[var(--text-muted)]">{t('trips.loading')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTrips.map((tr) => (
            <div key={tr.id} className="glass-card rounded-2xl p-5 space-y-4 flex flex-col justify-between hover-lift">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                      tr.status === 'Upcoming'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-500/15 text-[var(--text-secondary)]'
                    }`}
                  >
                    {tr.status}
                  </span>
                  <button onClick={() => onDeleteTrip(tr.id)} className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors" title={t('trips.delete')}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-[var(--text-primary)]">{tr.title}</h3>
                  <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                    <span>
                      {tr.destination} ({tr.days} {t('trips.days')})
                    </span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2.5 glass-pill rounded-xl">
                    <span className="text-[10px] text-[var(--text-muted)] block font-bold uppercase">{t('trips.dates')}</span>
                    <span className="font-bold text-[var(--text-primary)]">{tr.startDate}</span>
                  </div>
                  <div className="p-2.5 glass-pill rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[var(--text-muted)] block font-bold uppercase">{t('trips.travelers')}</span>
                      <span className="font-bold text-[var(--text-primary)]">
                        {tr.travelersCount} {t('trips.persons')}
                      </span>
                    </div>
                    <button onClick={() => setActiveTab('explore')} className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-500/25 transition-colors" title={t('trips.viewMap')}>
                      <Map className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {tr.placesVisited.length > 0 && (
                  <div className="text-[11px] text-[var(--text-secondary)]">
                    <span className="font-bold">{t('trips.spots')}</span> {tr.placesVisited.join(', ')}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[var(--glass-border)] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] font-semibold block">{t('trips.budget')}</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-300 text-sm">{formatCost(tr.budgetBDT)}</span>
                </div>
                <button onClick={() => setActiveTab('ai-planner')} className="btn-brand px-3 py-1.5 text-white font-bold text-xs rounded-lg flex items-center gap-1">
                  <span>{t('trips.edit')}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && filteredTrips.length === 0 && (
        <div className="p-12 text-center glass-card rounded-2xl space-y-2">
          <Calendar className="w-10 h-10 text-[var(--text-muted)] mx-auto" />
          <h3 className="text-sm font-bold text-[var(--text-primary)]">{t('trips.none')}</h3>
          <p className="text-xs text-[var(--text-muted)]">{t('trips.noneHint')}</p>
        </div>
      )}

      {/* Create Plan Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in" onMouseDown={(e) => e.target === e.currentTarget && setShowCreateModal(false)}>
          <div className="glass-card w-full max-w-md rounded-3xl p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-[var(--glass-border)] pb-3">
              <h3 className="font-bold text-[var(--text-primary)] text-sm">{t('trips.newPlan')}</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[var(--text-secondary)] font-medium mb-1">{t('trips.tripTitle')}</label>
                <input type="text" required placeholder="e.g. Sajek Cloud Trek 2026" value={title} onChange={(e) => setTitle(e.target.value)} className="glass-input w-full px-3 py-2.5 rounded-xl outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[var(--text-secondary)] font-medium mb-1">{t('trips.destination')}</label>
                  <select value={destination} onChange={(e) => setDestination(e.target.value)} className="glass-input w-full px-3 py-2.5 rounded-xl outline-none">
                    <option value="Sajek Valley">Sajek Valley</option>
                    <option value="Cox's Bazar">Cox's Bazar</option>
                    <option value="Bandarban">Bandarban</option>
                    <option value="Kaptai Lake">Kaptai Lake</option>
                    <option value="Chandranath Hill">Chandranath Hill</option>
                    <option value="Patenga Beach">Patenga Beach</option>
                    <option value="Saint Martin's Island">Saint Martin's Island</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[var(--text-secondary)] font-medium mb-1">{t('trips.days')}</label>
                  <input type="number" min="1" max="14" value={days} onChange={(e) => setDays(Number(e.target.value))} className="glass-input w-full px-3 py-2.5 rounded-xl outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[var(--text-secondary)] font-medium mb-1">{t('trips.budgetBdt')}</label>
                  <input type="number" step="1000" value={budgetBDT} onChange={(e) => setBudgetBDT(Number(e.target.value))} className="glass-input w-full px-3 py-2.5 rounded-xl outline-none" />
                </div>
                <div>
                  <label className="block text-[var(--text-secondary)] font-medium mb-1">{t('trips.startDate')}</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="glass-input w-full px-3 py-2.5 rounded-xl outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] font-medium mb-1">{t('trips.travelers')}</label>
                <input type="number" min="1" max="50" value={travelersCount} onChange={(e) => setTravelersCount(Number(e.target.value))} className="glass-input w-full px-3 py-2.5 rounded-xl outline-none" />
              </div>

              <button type="submit" disabled={saving} className="btn-brand w-full py-3 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 disabled:opacity-60">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{saving ? t('planner.saving') : t('trips.save')}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
