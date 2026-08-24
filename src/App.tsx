import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AIChatbotModal } from './components/AIChatbotModal';
import { AuthModal } from './components/AuthModal';
import { DestinationDetailModal } from './components/DestinationDetailModal';
import { HotelDetailModal } from './components/HotelDetailModal';
import { PriceComparisonModal } from './components/PriceComparisonModal';
import { I18nProvider } from './i18n';
import { API_URL } from './config';

// Views
import { HomeView } from './components/views/HomeView';
import { ExploreView } from './components/views/ExploreView';
import { AITripPlannerView } from './components/views/AITripPlannerView';
import { HotelsView } from './components/views/HotelsView';
import { BlogsView } from './components/views/BlogsView';
import { MyTripsView } from './components/views/MyTripsView';
import { CommunityView } from './components/views/CommunityView';
import { DashboardView } from './components/views/DashboardView';

// Data & Types
import {
  CHATTOGRAM_DESTINATIONS,
  CHATTOGRAM_HOTELS,
  CHATTOGRAM_BLOGS,
  COMMUNITY_POSTS,
  TRAVEL_GROUPS,
  avatarFor,
} from './data/chattogramData';
import {
  Destination,
  Hotel,
  Blog,
  TripPlan,
  CommunityPost,
  TravelGroup,
  PersonaType,
  UserProfile,
  AuthUser,
  ThemeMode,
} from './types/travel';

/* -------------------------------------------------------------
 * Session helpers (token persisted in localStorage)
 * ----------------------------------------------------------- */
const TOKEN_KEY = 'chologhuri-token';
const THEME_KEY = 'chologhuri-theme';
const PROTECTED_TABS = ['dashboard', 'my-trips'];

const readToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

const readTheme = (): ThemeMode => {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
  } catch {
    /* ignore */
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

/** Convert API user → UI profile (adds generated avatar + stats placeholders) */
export const toProfile = (u: AuthUser, prev?: UserProfile | null): UserProfile => ({
  id: u.id,
  name: u.name,
  email: u.email,
  phone: u.phone || '',
  dob: prev?.dob || '',
  avatar: u.avatar || avatarFor(u.name),
  role: (u.role as PersonaType) || 'Solo Travelers',
  totalTrips: prev?.totalTrips || 0,
  placesVisitedCount: prev?.placesVisitedCount || 0,
  totalSpentBDT: prev?.totalSpentBDT || 0,
  currency: prev?.currency || 'BDT',
});

export function App() {
  // Global State
  const [activeTab, setActiveTabState] = useState<string>('home');
  const [currency, setCurrency] = useState<'BDT' | 'USD'>('BDT');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [theme, setTheme] = useState<ThemeMode>(readTheme);

  // Datasets
  const [destinations] = useState<Destination[]>(CHATTOGRAM_DESTINATIONS);
  const [hotels] = useState<Hotel[]>(CHATTOGRAM_HOTELS);
  const [blogs, setBlogs] = useState<Blog[]>(CHATTOGRAM_BLOGS);
  const [posts, setPosts] = useState<CommunityPost[]>(COMMUNITY_POSTS);
  const [groups, setGroups] = useState<TravelGroup[]>(TRAVEL_GROUPS);

  // Auth session: user is null when nobody is logged in
  const [token, setToken] = useState<string | null>(readToken);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);

  // Trips are loaded from MongoDB for the logged-in user only
  const [trips, setTrips] = useState<TripPlan[]>([]);
  const [tripsLoading, setTripsLoading] = useState(false);

  // Modal States
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [selectedHotelsForCompare, setSelectedHotelsForCompare] = useState<Hotel[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [plannerInitialDestination, setPlannerInitialDestination] = useState('Sajek Valley');

  /* ---------------- Theme (dark / light) ---------------- */
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('theme-transition');
    root.classList.toggle('dark', theme === 'dark');
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* ignore */
    }
    const id = window.setTimeout(() => root.classList.remove('theme-transition'), 600);
    return () => window.clearTimeout(id);
  }, [theme]);

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);

  /* ---------------- Authenticated fetch helper ---------------- */
  const authFetch = useCallback(
    (input: RequestInfo, init: RequestInit = {}) => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...((init.headers as Record<string, string>) || {}),
      };
      if (token) headers.Authorization = `Bearer ${token}`;
      const url = typeof input === 'string' && input.startsWith('/api/')
        ? `${API_URL}${input}`
        : input;
      return fetch(url, { ...init, headers });
    },
    [token]
  );

  /* ---------------- Restore session on reload ---------------- */
  useEffect(() => {
    let cancelled = false;
    const restore = async () => {
      if (!token) {
        setSessionChecked(true);
        return;
      }
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (!cancelled) {
          if (res.ok && data.user) {
            setUser((prev) => toProfile(data.user, prev));
          } else {
            setToken(null);
            localStorage.removeItem(TOKEN_KEY);
          }
        }
      } catch {
        /* offline: keep token, user stays null until reachable */
      } finally {
        if (!cancelled) setSessionChecked(true);
      }
    };
    restore();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- Load trips for the current user ---------------- */
  useEffect(() => {
    if (!user || !token) {
      setTrips([]);
      return;
    }
    let cancelled = false;
    setTripsLoading(true);
    authFetch('/api/trips')
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && data.success) setTrips(data.trips);
      })
      .catch((err) => console.error('Failed to load trips', err))
      .finally(() => {
        if (!cancelled) setTripsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user?.id, token, authFetch]);

  /* ---------------- Auth handlers ---------------- */
  const handleAuthSuccess = (authUser: AuthUser, newToken: string) => {
    setToken(newToken);
    try {
      localStorage.setItem(TOKEN_KEY, newToken);
    } catch {
      /* ignore */
    }
    setUser((prev) => toProfile(authUser, prev));
    setIsAuthModalOpen(false);
    if (pendingTab) {
      setActiveTabState(pendingTab);
      setPendingTab(null);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setTrips([]);
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* ignore */
    }
    if (PROTECTED_TABS.includes(activeTab)) setActiveTabState('home');
  };

  const openAuthModal = () => setIsAuthModalOpen(true);

  /** Navigation guard: protected tabs require a logged-in user */
  const setActiveTab = (tab: string) => {
    if (PROTECTED_TABS.includes(tab) && !user) {
      setPendingTab(tab);
      setIsAuthModalOpen(true);
      if (tab === 'my-trips') setActiveTabState(tab); // My Trips shows its own login prompt
      return;
    }
    setActiveTabState(tab);
  };

  // If the session is lost while on a protected page, go back to landing
  useEffect(() => {
    if (sessionChecked && !user && activeTab === 'dashboard') setActiveTabState('home');
  }, [sessionChecked, user, activeTab]);

  /** Persist profile edits to MongoDB */
  const handleUpdateProfile = async (updated: UserProfile) => {
    setUser(updated);
    try {
      const res = await authFetch('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({ name: updated.name, phone: updated.phone, avatar: updated.avatar }),
      });
      const data = await res.json();
      if (res.ok && data.user) setUser((prev) => ({ ...toProfile(data.user, prev), dob: updated.dob }));
    } catch (err) {
      console.error('Profile update failed', err);
    }
  };

  /* ---------------- Content handlers ---------------- */
  const handlePlanTripToHere = (destName: string) => {
    setPlannerInitialDestination(destName);
    setActiveTab('ai-planner');
  };

  const handleAddBlog = (newBlog: Blog) => {
    setBlogs([newBlog, ...blogs]);
  };

  /** Save a trip for the logged-in user. Guests get the auth modal instead. */
  const handleAddTrip = async (newTrip: TripPlan): Promise<boolean> => {
    if (!user || !token) {
      setIsAuthModalOpen(true);
      return false;
    }
    try {
      const { id, ...payload } = newTrip;
      const res = await authFetch('/api/trips', { method: 'POST', body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok || !data.success) {
        if (res.status === 401) {
          handleLogout();
          setIsAuthModalOpen(true);
        }
        return false;
      }
      setTrips((prev) => [data.trip, ...prev]);
      return true;
    } catch (err) {
      console.error('Failed to save trip', err);
      return false;
    }
  };

  const handleDeleteTrip = async (id: string) => {
    if (!user) return;
    const previous = trips;
    setTrips(trips.filter((t) => t.id !== id));
    try {
      const res = await authFetch(`/api/trips/${id}`, { method: 'DELETE' });
      if (!res.ok) setTrips(previous);
    } catch {
      setTrips(previous);
    }
  };

  const handleAddPost = (newPost: CommunityPost) => {
    setPosts([newPost, ...posts]);
  };

  const handleJoinGroup = (groupId: string) => {
    setGroups(
      groups.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            isJoined: !g.isJoined,
            membersCount: g.isJoined ? g.membersCount - 1 : g.membersCount + 1,
          };
        }
        return g;
      })
    );
  };

  const selectedPersona: PersonaType = user?.role || 'Solo Travelers';

  // Lightweight animated particles for the background scene
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        left: `${(i * 53) % 100}%`,
        size: 3 + ((i * 7) % 6),
        delay: `${-(i * 1.7) % 20}s`,
        duration: `${18 + ((i * 5) % 14)}s`,
      })),
    []
  );

  return (
    <I18nProvider>
      <div className="app-shell min-h-screen flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-white">
        {/* 0. Ambient animated background (floating gradients + particles) */}
        <div className="bg-scene" aria-hidden="true">
          <div className="bg-blob bg-blob-1" />
          <div className="bg-blob bg-blob-2" />
          <div className="bg-blob bg-blob-3" />
          <div className="bg-particles">
            {particles.map((p, i) => (
              <span
                key={i}
                className="bg-particle"
                style={{
                  left: p.left,
                  width: p.size,
                  height: p.size,
                  animationDelay: p.delay,
                  animationDuration: p.duration,
                }}
              />
            ))}
          </div>
        </div>

        {/* 1. Navbar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          currency={currency}
          setCurrency={setCurrency}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          openAuthModal={openAuthModal}
          onLogout={handleLogout}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        {/* 2. Main View Content */}
        <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {activeTab === 'home' && (
            <HomeView
              destinations={destinations}
              hotels={hotels}
              blogs={blogs}
              posts={posts}
              setActiveTab={setActiveTab}
              onSelectDestination={setSelectedDestination}
              onSelectHotel={setSelectedHotel}
              onSelectBlog={setSelectedBlog}
              currency={currency}
              selectedPersona={selectedPersona}
              onPlanTripToHere={handlePlanTripToHere}
            />
          )}

          {activeTab === 'explore' && (
            <ExploreView
              destinations={destinations}
              onSelectDestination={setSelectedDestination}
              currency={currency}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onPlanTripToHere={handlePlanTripToHere}
            />
          )}

          {activeTab === 'ai-planner' && (
            <AITripPlannerView
              onSaveTrip={handleAddTrip}
              currency={currency}
              selectedPersona={selectedPersona}
              initialDestination={plannerInitialDestination}
              isAuthenticated={!!user}
              openAuthModal={openAuthModal}
            />
          )}

          {activeTab === 'hotels' && (
            <HotelsView
              hotels={hotels}
              onSelectHotel={setSelectedHotel}
              currency={currency}
              selectedHotelsForCompare={selectedHotelsForCompare}
              setSelectedHotelsForCompare={setSelectedHotelsForCompare}
              openCompareModal={() => setIsCompareModalOpen(true)}
            />
          )}

          {activeTab === 'blogs' && (
            <BlogsView
              blogs={blogs}
              onAddBlog={handleAddBlog}
              selectedBlog={selectedBlog}
              onSelectBlog={setSelectedBlog}
            />
          )}

          {activeTab === 'my-trips' && (
            <MyTripsView
              trips={trips}
              onAddTrip={handleAddTrip}
              onDeleteTrip={handleDeleteTrip}
              currency={currency}
              setActiveTab={setActiveTab}
              user={user}
              isLoading={tripsLoading}
              openAuthModal={openAuthModal}
            />
          )}

          {activeTab === 'community' && (
            <CommunityView
              posts={posts}
              groups={groups}
              onAddPost={handleAddPost}
              onJoinGroup={handleJoinGroup}
            />
          )}

          {/* Dashboard is strictly login-only */}
          {activeTab === 'dashboard' && user && (
            <DashboardView
              user={user}
              setUser={handleUpdateProfile}
              trips={trips}
              currency={currency}
              openAuthModal={openAuthModal}
              onLogout={handleLogout}
            />
          )}
        </main>

        {/* 3. Floating AI Chatbot Assistant */}
        <AIChatbotModal />

        {/* 4. Footer */}
        <Footer setActiveTab={setActiveTab} />

        {/* 5. Modals */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => {
            setIsAuthModalOpen(false);
            setPendingTab(null);
          }}
          onAuthSuccess={handleAuthSuccess}
        />

        <DestinationDetailModal
          destination={selectedDestination}
          onClose={() => setSelectedDestination(null)}
          currency={currency}
          nearbyHotels={hotels.filter((h) => h.destinationName === selectedDestination?.name)}
          onPlanTripToHere={handlePlanTripToHere}
        />

        <HotelDetailModal hotel={selectedHotel} onClose={() => setSelectedHotel(null)} currency={currency} />

        <PriceComparisonModal
          hotels={selectedHotelsForCompare}
          onClose={() => setIsCompareModalOpen(false)}
          currency={currency}
          onSelectHotel={(h) => setSelectedHotel(h)}
        />
      </div>
    </I18nProvider>
  );
}

export default App;
