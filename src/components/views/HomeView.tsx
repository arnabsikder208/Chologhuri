import React, { useEffect, useRef, useState } from 'react';
import {
  Search,
  MapPin,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Hotel as HotelIcon,
  BookOpen,
  Users,
  DollarSign,
  Compass,
  Star,
  ChevronRight,
  Calculator,
  ShieldCheck,
  Mountain,
  RotateCcw,
  ChevronLeft
} from 'lucide-react';
import { Destination, Hotel, Blog, CommunityPost, PersonaType } from '../../types/travel';
import { SHOWCASE_SPOTS } from '../../data/chattogramData';
import { useI18n } from '../../i18n';

interface HomeViewProps {
  destinations: Destination[];
  hotels: Hotel[];
  blogs: Blog[];
  posts: CommunityPost[];
  setActiveTab: (tab: string) => void;
  onSelectDestination: (d: Destination) => void;
  onSelectHotel: (h: Hotel) => void;
  onSelectBlog: (b: Blog) => void;
  currency: 'BDT' | 'USD';
  selectedPersona: PersonaType;
  onPlanTripToHere: (destName: string) => void;
}

/* -------------------------------------------------------------
 * 3D Chattogram Showcase — CSS 3D carousel (GPU-friendly, no libs)
 * Drag / swipe to orbit, hover to tilt, arrows & dots snap to a spot,
 * depth-aware shading, floating motion, auto-rotates when idle.
 * ----------------------------------------------------------- */
interface Showcase3DProps {
  destinations: Destination[];
  onSelectDestination: (d: Destination) => void;
  onPlanTripToHere: (destName: string) => void;
}

const normalizeDeg = (deg: number) => ((deg % 360) + 360) % 360;

const Showcase3D: React.FC<Showcase3DProps> = ({ destinations, onSelectDestination, onPlanTripToHere }) => {
  const { t, lang } = useI18n();
  const spots = SHOWCASE_SPOTS;
  const count = spots.length;
  const step = 360 / count;

  const [radius, setRadius] = useState(320);
  const [isDragging, setIsDragging] = useState(false);
  const [tilt, setTilt] = useState({ x: -8, y: 0 });
  const [activeIndex, setActiveIndex] = useState(0);

  const angleRef = useRef(0);
  const velocityRef = useRef(0);
  const targetRef = useRef<number | null>(null); // angle we are easing toward (arrows / dots)
  const idleUntilRef = useRef(0); // timestamp: auto-rotate resumes after this
  const activeRef = useRef(0);
  const dragRef = useRef<{ x: number; angle: number; moved: boolean } | null>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const frameRef = useRef<number>(0);
  const hoverRef = useRef(false);
  const reduceMotion = useRef(typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);

  // Responsive ring radius
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setRadius(w < 480 ? 165 : w < 768 ? 215 : w < 1024 ? 260 : 300);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Animation loop — writes transforms directly (no React re-render per frame)
  useEffect(() => {
    const loop = (now: number) => {
      if (!dragRef.current) {
        if (targetRef.current !== null) {
          // Ease toward a requested card angle
          const diff = targetRef.current - angleRef.current;
          if (Math.abs(diff) < 0.05) {
            angleRef.current = targetRef.current;
            targetRef.current = null;
          } else {
            angleRef.current += diff * 0.09;
          }
        } else if (Math.abs(velocityRef.current) > 0.02) {
          angleRef.current += velocityRef.current;
          velocityRef.current *= 0.94;
        } else if (!hoverRef.current && now > idleUntilRef.current && !reduceMotion.current) {
          angleRef.current += 0.1;
        }
      }

      const bob = reduceMotion.current ? 0 : Math.sin(now / 1400) * 6;
      if (ringRef.current) {
        ringRef.current.style.transform = `translateY(${bob}px) rotateY(${angleRef.current}deg)`;
      }

      // Depth shading: cards facing the viewer are bright & sharp, cards behind recede
      let frontIdx = 0;
      let frontDepth = -2;
      for (let i = 0; i < count; i++) {
        const rel = normalizeDeg(i * step + angleRef.current);
        const depth = Math.cos((rel * Math.PI) / 180); // 1 = front, -1 = back
        if (depth > frontDepth) {
          frontDepth = depth;
          frontIdx = i;
        }
        const el = cardRefs.current[i];
        if (el) {
          const k = (depth + 1) / 2; // 0..1
          el.style.filter = `brightness(${0.45 + k * 0.55}) saturate(${0.6 + k * 0.4})`;
          el.style.opacity = `${0.55 + k * 0.45}`;
        }
      }
      if (frontIdx !== activeRef.current) {
        activeRef.current = frontIdx;
        setActiveIndex(frontIdx);
      }
      frameRef.current = requestAnimationFrame(loop);
    };
    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [count, step]);

  const pauseAutoRotate = (ms = 4000) => {
    idleUntilRef.current = performance.now() + ms;
  };

  /** Rotate the ring so that card `index` faces the viewer (shortest path) */
  const goTo = (index: number) => {
    const desired = -index * step;
    const current = angleRef.current;
    let delta = normalizeDeg(desired - current);
    if (delta > 180) delta -= 360;
    targetRef.current = current + delta;
    velocityRef.current = 0;
    pauseAutoRotate(6000);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    dragRef.current = { x: e.clientX, angle: angleRef.current, moved: false };
    velocityRef.current = 0;
    targetRef.current = null;
    setIsDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (dragRef.current) {
      const dx = e.clientX - dragRef.current.x;
      if (Math.abs(dx) > 4) dragRef.current.moved = true;
      const next = dragRef.current.angle + dx * 0.35;
      velocityRef.current = (next - angleRef.current) * 0.6;
      angleRef.current = next;
      return;
    }
    // Hover parallax tilt
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -8 - py * 10, y: px * 12 });
  };

  const endDrag = () => {
    if (dragRef.current) pauseAutoRotate();
    dragRef.current = null;
    setIsDragging(false);
  };

  const openSpot = (spot: (typeof spots)[number]) => {
    const match = destinations.find((d) => d.id === spot.destinationId);
    if (match) onSelectDestination(match);
    else onPlanTripToHere(spot.name);
  };

  const handleCardClick = (spot: (typeof spots)[number], index: number) => {
    if (dragRef.current?.moved) return;
    // First click brings a side card to the front; clicking the front card opens it
    if (index !== activeRef.current) {
      goTo(index);
      return;
    }
    openSpot(spot);
  };

  const active = spots[activeIndex];

  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Mountain className="w-5 h-5 text-emerald-600" />
            <span>{t('home.showcase')}</span>
          </h2>
          <p className="text-xs text-slate-500">{t('home.showcaseDesc')}</p>
        </div>
        <button
          onClick={() => goTo(0)}
          className="glass-btn hidden sm:flex items-center gap-1.5 px-3 h-9 rounded-xl text-xs font-semibold text-[var(--text-secondary)]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      <div
        className={`showcase-stage glass-card rounded-3xl relative overflow-hidden select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ ['--active-accent' as any]: active.accent }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={() => {
          endDrag();
          setTilt({ x: -8, y: 0 });
          hoverRef.current = false;
        }}
        onPointerEnter={() => {
          hoverRef.current = true;
        }}
      >
        {/* Ambient glow tinted by the active card */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="showcase-aura" />
          <div className="showcase-grid" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[var(--bg-base)] to-transparent" />
          <div className="showcase-floor" />
        </div>

        <div className="showcase-scene" style={{ perspective: `${radius * 5}px` }}>
          <div className="showcase-tilt" style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}>
            <div ref={ringRef} className="showcase-ring">
              {spots.map((spot, i) => (
                <div
                  key={spot.id}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={spot.name}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleCardClick(spot, i)}
                  className={`showcase-card group ${i === activeIndex ? 'is-front' : ''}`}
                  style={{
                    transform: `rotateY(${i * step}deg) translateZ(${radius}px)`,
                    ['--accent' as any]: spot.accent,
                  }}
                  onClick={() => handleCardClick(spot, i)}
                >
                  <img src={spot.image} alt={spot.name} loading="lazy" draggable={false} className="showcase-img" />
                  <div className="showcase-overlay" />
                  <div className="showcase-content">
                    <span className="showcase-district">{spot.district}</span>
                    <h3 className="showcase-title">{lang === 'bn' ? spot.nameBn : spot.name}</h3>
                    <p className="showcase-tagline">{spot.tagline}</p>
                  </div>
                  <span className="showcase-shine" />
                </div>
              ))}
              {/* Dimmed glass backs so the far side of the ring stays visible */}
              {spots.map((spot, i) => (
                <div
                  key={`${spot.id}-back`}
                  aria-hidden="true"
                  className="showcase-card-back"
                  style={{ transform: `rotateY(${i * step}deg) translateZ(${radius}px) rotateY(180deg)` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Prev / Next */}
        <button
          type="button"
          aria-label="Previous"
          onClick={(e) => {
            e.stopPropagation();
            goTo((activeRef.current - 1 + count) % count);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="showcase-arrow left-3 sm:left-5"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          aria-label="Next"
          onClick={(e) => {
            e.stopPropagation();
            goTo((activeRef.current + 1) % count);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="showcase-arrow right-3 sm:right-5"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Live caption for the card facing the viewer */}
        <div className="showcase-caption" onPointerDown={(e) => e.stopPropagation()}>
          <div key={active.id} className="showcase-caption-inner">
            <span className="showcase-caption-dot" />
            <div className="min-w-0">
              <p className="showcase-caption-title">{lang === 'bn' ? active.nameBn : active.name}</p>
              <p className="showcase-caption-sub">
                {active.district} • {active.tagline}
              </p>
            </div>
            <button type="button" onClick={() => openSpot(active)} className="btn-brand showcase-caption-btn">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('home.planDetails')}</span>
            </button>
          </div>
          <div className="showcase-dots" role="tablist">
            {spots.map((spot, i) => (
              <button
                key={spot.id}
                type="button"
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={spot.name}
                onClick={() => goTo(i)}
                className={`showcase-dot ${i === activeIndex ? 'is-active' : ''}`}
                style={{ ['--accent' as any]: spot.accent }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const HomeView: React.FC<HomeViewProps> = ({
  destinations,
  hotels,
  blogs,
  posts,
  setActiveTab,
  onSelectDestination,
  onSelectHotel,
  onSelectBlog,
  currency,
  selectedPersona,
  onPlanTripToHere,
}) => {
  const { t } = useI18n();
  const [homeSearch, setHomeSearch] = useState('');
  
  // Interactive Budget Estimator state on Homepage
  const [calcDays, setCalcDays] = useState(3);
  const [calcStyle, setCalcStyle] = useState<'budget' | 'midRange' | 'luxury'>('midRange');

  const popularDestinations = destinations.filter((d) => d.popular).slice(0, 5);
  const popularHotels = hotels.slice(0, 3);
  const latestBlogs = blogs.slice(0, 2);

  const formatCost = (bdt: number) => {
    if (currency === 'USD') {
      return `$${Math.round(bdt / 115)}`;
    }
    return `৳${bdt.toLocaleString()} BDT`;
  };

  const estimatedTotalCostBDT =
    calcStyle === 'budget' ? calcDays * 1800 : calcStyle === 'midRange' ? calcDays * 4200 : calcDays * 9500;

  return (
    <div className="space-y-12 pb-12">
      
      {/* 1. Modern Hero Section matching Page 4 Wireframe */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white p-6 sm:p-12 shadow-2xl border border-emerald-900/50">
        
        {/* Background Decorative Element */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('home.badge')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {t('home.heroTitle')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">{t('home.heroAccent')}</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-2xl">
            {t('home.heroDesc')}
          </p>

          {/* Smart Destination Search Input */}
          <div className="pt-2">
            <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 flex flex-col sm:flex-row gap-2 max-w-xl">
              <div className="keep-solid flex-1 flex items-center gap-2 px-3 py-2 bg-white rounded-xl text-slate-900">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder={t('home.searchPlaceholder')}
                  value={homeSearch}
                  onChange={(e) => setHomeSearch(e.target.value)}
                  className="w-full bg-transparent text-xs text-slate-900 outline-none font-medium placeholder:text-slate-400"
                />
              </div>
              <button
                onClick={() => {
                  if (homeSearch) onPlanTripToHere(homeSearch);
                  else setActiveTab('explore');
                }}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
              >
                <span>{t('home.explore')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Persona Tag */}
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>{t('home.tailored')}</span>
            <span className="px-3 py-1 bg-slate-800 text-emerald-300 font-semibold rounded-full border border-slate-700">
              {selectedPersona}
            </span>
          </div>
        </div>

        {/* Picture of Places Carousel / Grid (Matching Page 4 wireframe cards) */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-5 gap-3">
          {popularDestinations.map((d) => (
            <div
              key={d.id}
              onClick={() => onSelectDestination(d)}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-slate-900/80 border border-white/10 hover:border-emerald-500/50 transition-all hover:-translate-y-1"
            >
              <div className="h-24 relative overflow-hidden">
                <img
                  src={d.image}
                  alt={d.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <span className="absolute bottom-1.5 left-2 text-[10px] font-bold text-white line-clamp-1">
                  {d.name}
                </span>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* 1b. 3D Chattogram Attraction Showcase */}
      <Showcase3D destinations={destinations} onSelectDestination={onSelectDestination} onPlanTripToHere={onPlanTripToHere} />

      {/* 2. Popular Destinations Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span>{t('home.popular')}</span>
            </h2>
            <p className="text-xs text-slate-500">{t('home.popularDesc')}</p>
          </div>

          <button
            onClick={() => setActiveTab('explore')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
          >
            <span>{t('home.viewAll')}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {popularDestinations.slice(0, 4).map((d) => (
            <div
              key={d.id}
              onClick={() => onSelectDestination(d)}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={d.image}
                  alt={d.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-slate-900/75 backdrop-blur-md text-white text-[10px] font-bold rounded-lg">
                  {d.district}
                </div>
                <div className="absolute top-3 right-3 px-2 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-bold rounded-md flex items-center gap-1">
                  <Star className="w-3 h-3 fill-slate-950" />
                  <span>{d.rating}</span>
                </div>
              </div>

              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {d.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{d.shortDesc}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">{t('home.estBudget')}</span>
                  <span className="font-extrabold text-emerald-800">{formatCost(d.estimatedBudgetBDT.midRange)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. AI Trip Planner Banner & Teaser */}
      <section className="bg-gradient-to-r from-emerald-900 to-teal-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>{t('home.aiBadge')}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">{t('home.aiTitle')}</h2>
          <p className="text-xs text-emerald-100 leading-relaxed">
            {t('home.aiDesc')}
          </p>
        </div>

        <button
          onClick={() => setActiveTab('ai-planner')}
          className="px-6 py-3.5 bg-white hover:bg-emerald-50 text-emerald-950 font-bold text-xs rounded-2xl shadow-lg transition-all shrink-0 flex items-center gap-2 hover:scale-105"
        >
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>{t('home.launchAi')}</span>
        </button>
      </section>

      {/* 4. Budget Planner Overview Widget */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{t('home.estimator')}</h2>
            <p className="text-xs text-slate-500">{t('home.estimatorDesc')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Days slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>{t('home.duration')}</span>
              <span className="text-emerald-700 font-bold">{calcDays} {t('home.daysLabel')}</span>
            </div>
            <input
              type="range"
              min="1"
              max="7"
              value={calcDays}
              onChange={(e) => setCalcDays(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          {/* Style Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">{t('home.style')}</label>
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-xs">
              <button
                onClick={() => setCalcStyle('budget')}
                className={`py-1.5 font-bold rounded-lg transition-colors ${
                  calcStyle === 'budget' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600'
                }`}
              >
                {t('home.backpacker')}
              </button>
              <button
                onClick={() => setCalcStyle('midRange')}
                className={`py-1.5 font-bold rounded-lg transition-colors ${
                  calcStyle === 'midRange' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600'
                }`}
              >
                {t('home.standard')}
              </button>
              <button
                onClick={() => setCalcStyle('luxury')}
                className={`py-1.5 font-bold rounded-lg transition-colors ${
                  calcStyle === 'luxury' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600'
                }`}
              >
                {t('home.resort')}
              </button>
            </div>
          </div>

          {/* Calculated Output */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-[10px] text-emerald-800 font-bold uppercase">{t('home.estTotal')}</p>
              <p className="text-xl font-extrabold text-emerald-950 mt-0.5">{formatCost(estimatedTotalCostBDT)}</p>
            </div>
            <button
              onClick={() => setActiveTab('ai-planner')}
              className="px-3 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-emerald-500 transition-colors"
            >
              {t('home.planDetails')}
            </button>
          </div>
        </div>
      </section>

      {/* 5. Popular Hotels Preview */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <HotelIcon className="w-5 h-5 text-emerald-600" />
              <span>{t('home.hotels')}</span>
            </h2>
            <p className="text-xs text-slate-500">{t('home.hotelsDesc')}</p>
          </div>
          <button
            onClick={() => setActiveTab('hotels')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>{t('home.browseHotels')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {popularHotels.map((h) => (
            <div
              key={h.id}
              onClick={() => onSelectHotel(h)}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="relative h-44 overflow-hidden">
                <img src={h.image} alt={h.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-slate-900/80 text-white text-[10px] font-bold rounded-lg">
                  {h.destinationName}
                </div>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700">{h.name}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-600" /> {h.address}
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-emerald-800">{formatCost(h.pricePerNightBDT)} {t('home.night')}</span>
                  <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {h.rating}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Latest Travel Blogs */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span>{t('home.blogs')}</span>
            </h2>
            <p className="text-xs text-slate-500">{t('home.blogsDesc')}</p>
          </div>
          <button onClick={() => setActiveTab('blogs')} className="text-xs font-semibold text-emerald-700">
            {t('home.viewBlogs')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {latestBlogs.map((b) => (
            <div
              key={b.id}
              onClick={() => onSelectBlog(b)}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row gap-4"
            >
              <img src={b.image} className="w-full sm:w-40 h-32 rounded-xl object-cover shrink-0" alt={b.title} />
              <div className="space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">{b.category}</span>
                  <h3 className="font-bold text-sm text-slate-900 line-clamp-2 hover:text-emerald-700">{b.title}</h3>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  <img src={b.author.avatar} className="w-5 h-5 rounded-full object-cover" alt={b.author.name} />
                  <span>{b.author.name}</span>
                  <span>•</span>
                  <span>{b.readTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
