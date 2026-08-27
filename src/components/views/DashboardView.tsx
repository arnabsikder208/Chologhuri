import React, { useState } from 'react';
import {
  User,
  Calendar,
  Image as ImageIcon,
  Bell,
  MapPin,
  Sparkles,
  Edit2,
  LogOut,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { UserProfile, TripPlan } from '../../types/travel';
import { useI18n } from '../../i18n';

interface DashboardViewProps {
  user: UserProfile;
  setUser: (u: UserProfile) => void;
  trips: TripPlan[];
  currency: 'BDT' | 'USD';
  openAuthModal: () => void;
  onLogout: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  setUser,
  trips,
  currency,
  openAuthModal,
  onLogout,
}) => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'profile' | 'gallery'>('profile');

  // Edit Profile Form state
  const [editName, setEditName] = useState(user.name);
  const [editPhone, setEditPhone] = useState(user.phone);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editDob, setEditDob] = useState(user.dob);
  const [isEditing, setIsEditing] = useState(false);

  const formatCost = (bdt: number) => {
    if (currency === 'USD') {
      return `$${Math.round(bdt / 115)}`;
    }
    return `৳${bdt.toLocaleString()} BDT`;
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      ...user,
      name: editName,
      phone: editPhone,
      email: editEmail,
      dob: editDob,
    });
    setIsEditing(false);
  };

  // Gallery Pictures of Place Visited
  const picturesVisited = [
    { title: 'Sajek Valley Helipad Sunset', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80', date: 'Aug 2025' },
    { title: 'Nilgiri Clouds Bandarban', url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80', date: 'Jul 2025' },
    { title: "Cox's Bazar Marine Drive", url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80', date: 'Jan 2025' },
    { title: 'Kaptai Lake Sunset Boat', url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=600&q=80', date: 'Nov 2024' },
  ];

  return (
    <div className="space-y-8 pb-16">
      
      {/* HEADER & USER PROFILE IDENTITY */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--glass-border)] pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            Account Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tracking-tight flex items-center gap-2.5">
            <User className="w-7 h-7 text-emerald-500" />
            <span>{t('dash.title')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">{t('dash.subtitle')}</p>
        </div>

        <div className="flex items-center gap-3.5 self-start sm:self-auto glass-card p-2 rounded-2xl border border-[var(--glass-border)]">
          <img src={user.avatar} alt={user.name} className="w-11 h-11 rounded-xl object-cover ring-2 ring-emerald-500/50 shadow-sm" />
          <div className="hidden sm:block pr-2">
            <p className="text-xs font-black text-[var(--text-primary)]">{user.name}</p>
            <p className="text-[10px] text-[var(--text-secondary)] font-medium">{user.email}</p>
          </div>
          <button
            onClick={onLogout}
            className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            title={t('dash.signOut')}
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">{t('dash.signOut')}</span>
          </button>
        </div>
      </div>

      {/* NAVIGATION SUB-TABS */}
      <div className="flex items-center gap-2 glass-pill p-1.5 rounded-2xl w-fit border border-[var(--glass-border)]">
        {[
          { id: 'profile', label: t('dash.profileTab'), icon: User },
          { id: 'gallery', label: t('dash.galleryTab'), icon: ImageIcon },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PERSONAL DETAILS & TOUR CALENDAR */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* PERSONAL DETAILS CARD */}
          <div className="glass-card rounded-3xl p-6 border border-[var(--glass-border)] shadow-sm space-y-5 h-fit">
            <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-4">
              <h2 className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-500" />
                <span>{t('dash.personal')}</span>
              </h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{isEditing ? t('dash.cancel') : t('dash.edit')}</span>
              </button>
            </div>

            {!isEditing ? (
              <div className="space-y-4 text-xs">
                <div className="flex items-center gap-3.5 p-3.5 bg-black/5 dark:bg-white/5 rounded-2xl border border-[var(--glass-border)]">
                  <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-500/40" />
                  <div className="space-y-1">
                    <h3 className="font-black text-sm text-[var(--text-primary)]">{user.name}</h3>
                    <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px] rounded-full border border-emerald-500/20 inline-block">
                      {t('dash.role')}: {user.role}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--glass-border)]">
                    <span className="text-[10px] text-[var(--text-muted)] font-extrabold block uppercase tracking-wider">{t('dash.phone')}</span>
                    <span className="font-extrabold text-[var(--text-primary)] mt-0.5 block">{user.phone || '—'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--glass-border)]">
                    <span className="text-[10px] text-[var(--text-muted)] font-extrabold block uppercase tracking-wider">{t('dash.email')}</span>
                    <span className="font-extrabold text-[var(--text-primary)] mt-0.5 block">{user.email}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--glass-border)]">
                    <span className="text-[10px] text-[var(--text-muted)] font-extrabold block uppercase tracking-wider">{t('dash.dob')}</span>
                    <span className="font-extrabold text-[var(--text-primary)] mt-0.5 block">{user.dob || '—'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[var(--text-secondary)] font-extrabold mb-1 uppercase tracking-wider text-[10px]">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="glass-input w-full px-4 py-3 rounded-2xl outline-none font-medium text-[var(--text-primary)] border border-[var(--glass-border)] focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-secondary)] font-extrabold mb-1 uppercase tracking-wider text-[10px]">Phone</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="glass-input w-full px-4 py-3 rounded-2xl outline-none font-medium text-[var(--text-primary)] border border-[var(--glass-border)] focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-secondary)] font-extrabold mb-1 uppercase tracking-wider text-[10px]">Email</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="glass-input w-full px-4 py-3 rounded-2xl outline-none font-medium text-[var(--text-primary)] border border-[var(--glass-border)] focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-secondary)] font-extrabold mb-1 uppercase tracking-wider text-[10px]">Date of Birth</label>
                  <input
                    type="date"
                    value={editDob}
                    onChange={(e) => setEditDob(e.target.value)}
                    className="glass-input w-full px-4 py-3 rounded-2xl outline-none font-medium text-[var(--text-primary)] border border-[var(--glass-border)] focus:border-emerald-500 cursor-pointer"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-brand w-full py-3 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-600/20 cursor-pointer active:scale-95 mt-2"
                >
                  {t('dash.saveChanges')}
                </button>
              </form>
            )}
          </div>

          {/* TOUR CALENDAR & NOTIFICATIONS */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-3xl p-6 sm:p-7 border border-[var(--glass-border)] shadow-sm space-y-4">
              <h2 className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2 border-b border-[var(--glass-border)] pb-4">
                <Calendar className="w-4 h-4 text-emerald-500" />
                <span>{t('dash.calendar')}</span>
              </h2>

              <div className="space-y-3">
                {trips.length === 0 && (
                  <p className="text-xs text-[var(--text-muted)] p-6 bg-black/5 dark:bg-white/5 border border-dashed border-[var(--glass-border)] rounded-2xl text-center font-medium">
                    {t('dash.noTrips')}
                  </p>
                )}
                {trips.map((tr) => (
                  <div
                    key={tr.id}
                    className="p-4 bg-black/5 dark:bg-white/5 border border-[var(--glass-border)] rounded-2xl flex items-center justify-between text-xs hover:border-emerald-500/40 transition-colors"
                  >
                    <div className="space-y-1.5">
                      <span
                        className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full uppercase tracking-wider inline-flex items-center gap-1 ${
                          tr.status === 'Upcoming'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-slate-500/10 text-[var(--text-secondary)] border border-slate-500/20'
                        }`}
                      >
                        {tr.status === 'Upcoming' ? <Clock className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                        {tr.status}
                      </span>
                      <h3 className="font-black text-sm text-[var(--text-primary)]">{tr.title}</h3>
                      <p className="text-[var(--text-secondary)] flex items-center gap-1.5 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-emerald-500" /> {tr.destination} <span className="text-[var(--text-muted)]">({tr.startDate})</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm sm:text-base block">
                        {formatCost(tr.budgetBDT)}
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)] font-bold">{tr.travelersCount} Travelers</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications Box */}
            <div className="glass-card rounded-3xl p-6 sm:p-7 border border-[var(--glass-border)] shadow-sm space-y-3.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-500" />
                <span>{t('dash.notifications')}</span>
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-[var(--text-primary)] space-y-1">
                  <span className="font-extrabold block text-emerald-600 dark:text-emerald-400">Sajek Valley Weather Alert</span>
                  <p className="text-[11px] text-[var(--text-secondary)] font-medium">Clear morning skies expected for cloud viewing at Konglak Peak.</p>
                </div>
                <div className="p-3.5 bg-black/5 dark:bg-white/5 border border-[var(--glass-border)] rounded-2xl text-[var(--text-primary)] space-y-1">
                  <span className="font-extrabold block">Chander Gari Army Convoy Timing</span>
                  <p className="text-[11px] text-[var(--text-secondary)] font-medium">Dighinala camp convoy departs promptly at 10:30 AM & 3:00 PM.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: TOUR GALLERY & PICTURES VISITED */}
      {activeTab === 'gallery' && (
        <div className="space-y-5">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-emerald-500" />
              <span>Pictures of Places Visited</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {picturesVisited.map((pic, idx) => (
              <div
                key={idx}
                className="glass-card rounded-3xl overflow-hidden border border-[var(--glass-border)] shadow-sm space-y-3 p-3 hover-lift transition-all"
              >
                <div className="overflow-hidden rounded-2xl aspect-video relative">
                  <img src={pic.url} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt={pic.title} />
                </div>
                <div className="px-1 pb-1">
                  <h3 className="font-black text-xs sm:text-sm text-[var(--text-primary)] leading-snug">{pic.title}</h3>
                  <span className="text-[10px] text-[var(--text-muted)] font-bold mt-1 block">{pic.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
