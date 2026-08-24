import React, { useState } from 'react';
import {
  User,
  Calendar,
  Image as ImageIcon,
  Bell,
  CheckCircle,
  Clock,
  MapPin,
  Settings,
  Database,
  Code2,
  Server,
  Terminal,
  FileCode,
  Layout,
  Send,
  Sparkles,
  ShieldCheck,
  Edit2
} from 'lucide-react';
import { UserProfile, TripPlan } from '../../types/travel';
import { useI18n } from '../../i18n';
import { LogOut } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'profile' | 'gallery' | 'architecture'>('profile');
  
  // API Tester State inside Architecture Hub
  const [apiEndpoint, setApiEndpoint] = useState('/api/plan-trip');
  const [apiMethod, setApiMethod] = useState<'GET' | 'POST'>('POST');
  const [apiReqBody, setApiReqBody] = useState(
    JSON.stringify({ destination: 'Sajek Valley', days: 3, budgetBDT: 12000, persona: 'Solo Travelers' }, null, 2)
  );
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isTestingApi, setIsTestingApi] = useState(false);

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

  const handleRunApiTest = async () => {
    setIsTestingApi(true);
    setApiResponse(null);
    try {
      if (apiMethod === 'POST') {
        const res = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: apiReqBody,
        });
        const data = await res.json();
        setApiResponse(JSON.stringify(data, null, 2));
      } else {
        const res = await fetch(apiEndpoint);
        const data = await res.json();
        setApiResponse(JSON.stringify(data, null, 2));
      }
    } catch (err: any) {
      setApiResponse(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setIsTestingApi(false);
    }
  };

  // Gallery Pictures of Place Visited (Page 18 wireframe)
  const picturesVisited = [
    { title: 'Sajek Valley Helipad Sunset', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80', date: 'Aug 2025' },
    { title: 'Nilgiri Clouds Bandarban', url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80', date: 'Jul 2025' },
    { title: 'Cox\'s Bazar Marine Drive', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80', date: 'Jan 2025' },
    { title: 'Kaptai Lake Sunset Boat', url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=600&q=80', date: 'Nov 2024' },
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* 1. Header & Navigation Tabs matching Wireframe Page 18 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <User className="w-6 h-6 text-emerald-600" />
            <span>{t('dash.title')}</span>
          </h1>
          <p className="text-xs text-slate-500">{t('dash.subtitle')}</p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/50" />
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-slate-900">{user.name}</p>
            <p className="text-[10px] text-slate-500">{user.email}</p>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold text-xs rounded-xl transition-colors flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('dash.signOut')}</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs matching Page 18 Wireframe */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('profile')}
          className={`py-3 px-6 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'profile' ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {t('dash.profileTab')}
        </button>
        <button
          onClick={() => setActiveTab('gallery')}
          className={`py-3 px-6 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'gallery' ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {t('dash.galleryTab')}
        </button>
        <button
          onClick={() => setActiveTab('architecture')}
          className={`py-3 px-6 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'architecture' ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t('dash.archTab')}</span>
        </button>
      </div>

      {/* TAB 1: PERSONAL DETAILS & TOUR CALENDAR */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* PERSONAL DETAILS CARD matching Wireframe Page 18 (Name, Phone, Email, Date of Birth) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5 h-fit">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-600" />
                <span>{t('dash.personal')}</span>
              </h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs text-emerald-700 font-bold flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{isEditing ? t('dash.cancel') : t('dash.edit')}</span>
              </button>
            </div>

            {!isEditing ? (
              <div className="space-y-4 text-xs">
                <div className="flex items-center gap-3">
                  <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/40" />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{user.name}</h3>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full">
                      {t('dash.role')}: {user.role}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">{t('dash.phone')}</span>
                    <span className="font-bold text-slate-800">{user.phone || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">{t('dash.email')}</span>
                    <span className="font-bold text-slate-800">{user.email}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">{t('dash.dob')}</span>
                    <span className="font-bold text-slate-800">{user.dob || '—'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Phone</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={editDob}
                    onChange={(e) => setEditDob(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-lg"
                  />
                </div>
                <button type="submit" className="w-full py-2 bg-emerald-600 text-white font-bold rounded-lg">
                  {t('dash.saveChanges')}
                </button>
              </form>
            )}
          </div>

          {/* TOUR CALENDAR & TRIP MANAGEMENT matching Page 18 Wireframe */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>{t('dash.calendar')}</span>
              </h2>

              <div className="space-y-3">
                {trips.length === 0 && (
                  <p className="text-xs text-slate-500 p-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center">{t('dash.noTrips')}</p>
                )}
                {trips.map((tr) => (
                  <div key={tr.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
                    <div className="space-y-1">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">
                        {tr.status}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900">{tr.title}</h3>
                      <p className="text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {tr.destination} ({tr.startDate})
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-emerald-800 text-sm block">{formatCost(tr.budgetBDT)}</span>
                      <span className="text-[10px] text-slate-400">{tr.travelersCount} Travelers</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications Box */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-600" />
                <span>{t('dash.notifications')}</span>
              </h3>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-emerald-900">
                  <span className="font-bold block">Sajek Valley Weather Alert</span>
                  <p className="text-[11px] text-emerald-800">Clear morning skies expected for cloud viewing at Konglak Peak.</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700">
                  <span className="font-bold block">Chander Gari Army Convoy Timing</span>
                  <p className="text-[11px] text-slate-500">Dighinala camp convoy departs promptly at 10:30 AM & 3:00 PM.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: TOUR GALLERY & PICTURES VISITED */}
      {activeTab === 'gallery' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              <span>Pictures of Places Visited</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {picturesVisited.map((pic, idx) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs space-y-2 p-2">
                <img src={pic.url} className="w-full h-44 object-cover rounded-xl" alt={pic.title} />
                <div className="px-2 pb-2">
                  <h3 className="font-bold text-xs text-slate-900">{pic.title}</h3>
                  <span className="text-[10px] text-slate-400">{pic.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ADMIN ARCHITECTURE HUB & API TESTER */}
      {activeTab === 'architecture' && (
        <div className="space-y-8">
          
          <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>SYSTEM ARCHITECTURE & MONGODB SCHEMAS</span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] rounded font-mono">Documentation</span>
                </h2>
                <p className="text-xs text-slate-400">Complete database entities, REST APIs, ER Diagrams, and Site Architecture</p>
              </div>
            </div>

            {/* Entity Schemas Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
              
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2 font-mono">
                <span className="text-emerald-400 font-bold text-xs block">1. Destination Schema (MongoDB / Mongoose)</span>
                <pre className="text-[10px] text-slate-300 overflow-x-auto bg-slate-950 p-3 rounded-xl">
{`{
  _id: ObjectId,
  name: String, // e.g., "Sajek Valley"
  district: String, // "Rangamati"
  category: String, // "Hill Tracts & Valleys"
  shortDesc: String,
  fullDesc: String,
  attractions: [String],
  travelRoutes: [{
    from: String,
    to: String,
    mode: String,
    costBDT: Number,
    duration: String
  }],
  estimatedBudgetBDT: {
    budget: Number,
    midRange: Number,
    luxury: Number
  },
  rating: Number,
  popular: Boolean
}`}
                </pre>
              </div>

              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2 font-mono">
                <span className="text-teal-400 font-bold text-xs block">2. TripPlan Schema (AI Itineraries)</span>
                <pre className="text-[10px] text-slate-300 overflow-x-auto bg-slate-950 p-3 rounded-xl">
{`{
  _id: ObjectId,
  userId: String,
  title: String,
  destination: String,
  days: Number,
  budgetBDT: Number,
  persona: String,
  itinerary: [{
    day: Number,
    title: String,
    morning: String,
    afternoon: String,
    evening: String,
    estExpenseBDT: Number
  }],
  status: String, // "Upcoming" | "Completed"
  createdDate: Date
}`}
                </pre>
              </div>

            </div>

            {/* System REST Endpoints Map */}
            <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" />
                <span>Backend REST API Endpoints Map</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold rounded">POST /api/plan-trip</span>
                    <p className="text-[10px] text-slate-400 mt-1">Generates custom Gemini AI travel plan</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="px-2 py-0.5 bg-teal-500/20 text-teal-400 font-mono text-[10px] font-bold rounded">POST /api/chat</span>
                    <p className="text-[10px] text-slate-400 mt-1">Real-time Gemini AI travel chatbot</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Interactive REST API Tester Widget */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Terminal className="w-4 h-4 text-emerald-600" />
              <span>Interactive Backend REST API Tester</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex gap-2">
                <select
                  value={apiMethod}
                  onChange={(e) => setApiMethod(e.target.value as any)}
                  className="px-3 py-2 bg-slate-100 font-bold rounded-xl border border-slate-200"
                >
                  <option value="POST">POST</option>
                  <option value="GET">GET</option>
                </select>

                <input
                  type="text"
                  value={apiEndpoint}
                  onChange={(e) => setApiEndpoint(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                />

                <button
                  onClick={handleRunApiTest}
                  disabled={isTestingApi}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Execute</span>
                </button>
              </div>

              {apiMethod === 'POST' && (
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Request Payload (JSON)</label>
                  <textarea
                    rows={4}
                    value={apiReqBody}
                    onChange={(e) => setApiReqBody(e.target.value)}
                    className="w-full p-3 bg-slate-900 text-emerald-300 font-mono text-[11px] rounded-xl outline-none"
                  />
                </div>
              )}

              {apiResponse && (
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Server Response Output</label>
                  <pre className="w-full p-3 bg-slate-950 text-slate-200 font-mono text-[10px] rounded-xl overflow-x-auto max-h-60">
                    {apiResponse}
                  </pre>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
