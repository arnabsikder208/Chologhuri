import React, { useState, useMemo } from 'react';
import {
  Search,
  Dices,
  MapPin,
  Map,
  ArrowRight,
  Filter,
  Star,
  Compass,
  Sparkles,
  Heart,
  X,
  Layers,
  Calendar,
  Bus,
  ShieldAlert,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { Destination, DistrictType } from '../../types/travel';

interface ExploreViewProps {
  destinations: Destination[];
  onSelectDestination: (d: Destination) => void;
  currency: 'BDT' | 'USD';
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onPlanTripToHere: (destName: string) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  destinations,
  onSelectDestination,
  currency,
  searchQuery,
  setSearchQuery,
  onPlanTripToHere,
}) => {
  // Navigation & Filtering States
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [maxBudgetFilter, setMaxBudgetFilter] = useState<number>(50000);
  const [popularOnly, setPopularOnly] = useState<boolean>(false);

  // Modal States
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapFocus, setMapFocus] = useState<Destination | null>(null);
  const [showKnowledgeModal, setShowKnowledgeModal] = useState(false);
  const [quickViewDest, setQuickViewDest] = useState<Destination | null>(null);
  const [quickViewTab, setQuickViewTab] = useState<'overview' | 'routes' | 'budget'>('overview');

  // Interactive Wishlist & Comparison States
  const [favorites, setFavorites] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<Destination[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const categories = [
    'All',
    'Beach & Coastal',
    'Hill Tracts & Valleys',
    'Waterfalls & Springs',
    'Lakes & Waterways',
    'Heritage & Eco Parks',
  ];

  const districts: (string | DistrictType)[] = [
    'All',
    'Chattogram City',
    "Cox's Bazar",
    'Bandarban',
    'Rangamati',
    'Sitakunda',
    'Mirsarai',
  ];

  // Calculated Max Budget Cap for Slider
  const absoluteMaxBudget = useMemo(() => {
    if (destinations.length === 0) return 30000;
    return Math.max(...destinations.map((d) => d.estimatedBudgetBDT.midRange));
  }, [destinations]);

  // Filter Logic
  const filteredDestinations = destinations.filter((d) => {
    const matchesCategory = selectedCategory === 'All' || d.category === selectedCategory;
    const matchesDistrict = selectedDistrict === 'All' || d.district === selectedDistrict;
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBudget = d.estimatedBudgetBDT.midRange <= maxBudgetFilter;
    const matchesPopular = !popularOnly || d.popular;

    return matchesCategory && matchesDistrict && matchesSearch && matchesBudget && matchesPopular;
  });

  // Random Dice Selection
  const handleRollDice = () => {
    if (destinations.length === 0) return;
    const randomIndex = Math.floor(Math.random() * destinations.length);
    const surprise = destinations[randomIndex];
    setQuickViewDest(surprise);
  };

  // Toggle Favorite
  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  // Toggle Compare Selection (Limit up to 3)
  const toggleCompare = (e: React.MouseEvent, dest: Destination) => {
    e.stopPropagation();
    setCompareList((prev) => {
      const exists = prev.some((d) => d.id === dest.id);
      if (exists) {
        return prev.filter((d) => d.id !== dest.id);
      }
      if (prev.length >= 3) {
        alert('You can compare up to 3 destinations at a time.');
        return prev;
      }
      return [...prev, dest];
    });
  };

  // Cost Formatter
  const formatCost = (bdt: number) => {
    if (currency === 'USD') {
      return `$${Math.round(bdt / 115)}`;
    }
    return `৳${bdt.toLocaleString()} BDT`;
  };

  return (
    <div className="space-y-8 pb-16 font-sans text-slate-800 dark:text-slate-100">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            Chattogram Division Travel Guide
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Compass className="w-7 h-7 text-emerald-600 dark:text-emerald-500 shrink-0" />
            <span>Explore Destinations</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse hill tracts, coastal spots, waterfalls, and local travel routes across Chattogram
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            onClick={() => setShowKnowledgeModal(true)}
            className="px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Travel Knowledge</span>
          </button>

          <button
            onClick={handleRollDice}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Dices className="w-4 h-4 text-emerald-100 animate-spin-slow" />
            <span>Surprise Dice</span>
          </button>
        </div>
      </div>

      {/* QUICK TRAVEL INSIGHTS BANNER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-900/60 p-4 rounded-2xl flex items-center gap-3 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/40">
            <Bus className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-200">Convoy & Transport Rules</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Check Dighinala convoy timings for Sajek routes</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/60 p-4 rounded-2xl flex items-center gap-3 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="p-2.5 bg-amber-50 dark:bg-slate-800 rounded-xl text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-slate-700/60">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-200">Peak Travel Season</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Winter (Nov–Feb) for Trekking & Valleys</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/60 p-4 rounded-2xl flex items-center gap-3 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/40">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-200">Emergency & Tourist Police</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Dial National Emergency 999 or Local Helpline</p>
          </div>
        </div>
      </div>

      {/* FEATURED HIGHLIGHT SLIDER */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Featured Highlights</span>
          </h2>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Top Rated Spots</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {destinations.filter((d) => d.popular).slice(0, 3).map((d) => (
            <div
              key={d.id}
              onClick={() => {
                setQuickViewDest(d);
                setQuickViewTab('overview');
              }}
              className="relative rounded-2xl overflow-hidden h-44 group cursor-pointer border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <img
                src={d.image}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                alt={d.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              <div className="absolute top-3 right-3 bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                <Star className="w-3 h-3 fill-slate-950" />
                <span>{d.rating}</span>
              </div>

              <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-end justify-between text-white">
                <div>
                  <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider block">
                    {d.district}
                  </span>
                  <h3 className="text-base font-black text-white leading-tight">{d.name}</h3>
                  <p className="text-[11px] text-slate-300 font-medium line-clamp-1 mt-0.5">
                    {d.shortDesc}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-emerald-500 transition-colors shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SEARCH & INTERACTIVE TOOLBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Interactive Sidebar Filter */}
        <div className="lg:col-span-1 space-y-5 bg-white dark:bg-slate-900/50 backdrop-blur-md p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs h-fit">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <Filter className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
              <span>Smart Filters</span>
            </h3>
            {(selectedCategory !== 'All' || selectedDistrict !== 'All' || popularOnly || searchQuery !== '') && (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedDistrict('All');
                  setPopularOnly(false);
                  setSearchQuery('');
                  setMaxBudgetFilter(absoluteMaxBudget);
                }}
                className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold hover:underline cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={() => setShowMapModal(true)}
              className="w-full p-3 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 font-extrabold rounded-xl border border-emerald-200 dark:border-emerald-800/50 text-xs flex items-center gap-3 transition-colors cursor-pointer"
            >
              <div className="p-2 bg-emerald-600 text-white rounded-lg">
                <Map className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-extrabold">GPS Map View</p>
                <p className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 font-normal">Interactive Pin Coordinates</p>
              </div>
            </button>

            {compareList.length > 0 && (
              <button
                onClick={() => setShowCompareModal(true)}
                className="w-full p-3 bg-slate-900 dark:bg-slate-800 text-white font-extrabold rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer border border-slate-800 dark:border-slate-700"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Compare ({compareList.length}/3)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>

          {/* District Filter */}
          <div className="space-y-2">
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Filter by District
            </label>
            <div className="flex flex-wrap gap-1.5">
              {districts.map((dist) => (
                <button
                  key={dist}
                  onClick={() => setSelectedDistrict(dist)}
                  className={`px-2.5 py-1.5 text-[11px] rounded-xl font-bold transition-all cursor-pointer ${
                    selectedDistrict === dist
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/50'
                  }`}
                >
                  {dist}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Filter Range */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <label className="font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 text-[11px]">
                Max Mid-Range Budget
              </label>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                {formatCost(maxBudgetFilter)}
              </span>
            </div>
            <input
              type="range"
              min="2000"
              max={absoluteMaxBudget || 40000}
              step="1000"
              value={maxBudgetFilter}
              onChange={(e) => setMaxBudgetFilter(Number(e.target.value))}
              className="w-full accent-emerald-600 dark:accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Checkbox Toggles */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={popularOnly}
                onChange={(e) => setPopularOnly(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-500 focus:ring-emerald-500/40"
              />
              <span>Top Popular Spots Only</span>
            </label>
          </div>
        </div>

        {/* Right Main Grid */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Main Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search spots by name or keyword (e.g., Sajek Valley, Kaptai Lake, Waterfall)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 shadow-xs"
            />
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results Info Bar */}
          <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 px-1">
            <span>
              Showing <strong className="text-slate-900 dark:text-slate-100">{filteredDestinations.length}</strong> spots
            </span>
            {favorites.length > 0 && (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
                {favorites.length} Saved in Wishlist
              </span>
            )}
          </div>

          {/* Destinations Grid List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredDestinations.map((d) => {
              const isFav = favorites.includes(d.id);
              const isComparing = compareList.some((c) => c.id === d.id);

              return (
                <div
                  key={d.id}
                  className="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between group"
                >
                  {/* Image Container */}
                  <div
                    className="relative h-48 cursor-pointer overflow-hidden"
                    onClick={() => {
                      setQuickViewDest(d);
                      setQuickViewTab('overview');
                    }}
                  >
                    <img
                      src={d.image}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt={d.name}
                    />
                    
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-extrabold rounded-lg">
                      {d.district}
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <button
                        onClick={(e) => toggleFavorite(e, d.id)}
                        className={`w-7 h-7 rounded-full backdrop-blur-md flex items-center justify-center transition-colors cursor-pointer ${
                          isFav ? 'bg-white text-red-500' : 'bg-slate-950/50 text-white hover:bg-white hover:text-slate-900'
                        }`}
                        title="Save to Wishlist"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-red-500' : ''}`} />
                      </button>

                      <div className="px-2 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black rounded-md flex items-center gap-1 shadow-sm">
                        <Star className="w-3 h-3 fill-slate-950" />
                        <span>{d.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3
                        onClick={() => {
                          setQuickViewDest(d);
                          setQuickViewTab('overview');
                        }}
                        className="font-extrabold text-base text-slate-900 dark:text-slate-100 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors leading-snug"
                      >
                        {d.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                        {d.shortDesc}
                      </p>
                    </div>

                    {/* Quick Route Snippet */}
                    {d.travelRoutes && d.travelRoutes.length > 0 && (
                      <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/50 rounded-xl text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
                        <span className="font-extrabold text-emerald-700 dark:text-emerald-400">Primary Route:</span>{' '}
                        {d.travelRoutes[0].from} → {d.travelRoutes[0].to} ({d.travelRoutes[0].mode})
                      </div>
                    )}

                    {/* Bottom Action Section */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 dark:text-slate-400 block font-bold uppercase tracking-wider">
                            Est. Mid Budget
                          </span>
                          <span className="font-black text-slate-900 dark:text-slate-100">
                            {formatCost(d.estimatedBudgetBDT.midRange)}
                          </span>
                        </div>

                        <button
                          onClick={(e) => toggleCompare(e, d)}
                          className={`text-[10px] font-extrabold px-2 py-1 rounded-lg border transition-colors cursor-pointer ${
                            isComparing
                              ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100'
                              : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                          }`}
                        >
                          {isComparing ? '✓ Comparing' : '+ Compare'}
                        </button>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => {
                            setQuickViewDest(d);
                            setQuickViewTab('overview');
                          }}
                          className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer border border-slate-200 dark:border-slate-700/60"
                        >
                          <span>Quick View</span>
                        </button>

                        <button
                          onClick={() => onPlanTripToHere(d.name)}
                          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                          <span>Plan Trip</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredDestinations.length === 0 && (
            <div className="p-12 text-center bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <Compass className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No destinations match your filters</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">Try adjusting your budget range, district, or search terms.</p>
            </div>
          )}
        </div>
      </div>

      {/* QUICK VIEW DESTINATION MODAL */}
      {quickViewDest && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setQuickViewDest(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col text-slate-900 dark:text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Banner */}
            <div className="relative h-52 shrink-0">
              <img src={quickViewDest.image} className="w-full h-full object-cover" alt={quickViewDest.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              <button
                onClick={() => setQuickViewDest(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-950/60 text-white flex items-center justify-center hover:bg-slate-950 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-4 left-5 right-5 text-white">
                <span className="px-2.5 py-0.5 bg-emerald-600 text-[10px] font-extrabold rounded-md uppercase tracking-wider">
                  {quickViewDest.district}
                </span>
                <h2 className="text-2xl font-black mt-1 text-white">{quickViewDest.name}</h2>
              </div>
            </div>

            {/* Modal Sub-tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 px-5 text-xs font-bold text-slate-500 dark:text-slate-400">
              <button
                onClick={() => setQuickViewTab('overview')}
                className={`py-3 px-4 border-b-2 transition-colors cursor-pointer ${
                  quickViewTab === 'overview' ? 'border-emerald-600 dark:border-emerald-500 text-emerald-600 dark:text-emerald-400 font-extrabold bg-white dark:bg-slate-900' : ''
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setQuickViewTab('routes')}
                className={`py-3 px-4 border-b-2 transition-colors cursor-pointer ${
                  quickViewTab === 'routes' ? 'border-emerald-600 dark:border-emerald-500 text-emerald-600 dark:text-emerald-400 font-extrabold bg-white dark:bg-slate-900' : ''
                }`}
              >
                Travel Routes ({quickViewDest.travelRoutes?.length || 0})
              </button>
              <button
                onClick={() => setQuickViewTab('budget')}
                className={`py-3 px-4 border-b-2 transition-colors cursor-pointer ${
                  quickViewTab === 'budget' ? 'border-emerald-600 dark:border-emerald-500 text-emerald-600 dark:text-emerald-400 font-extrabold bg-white dark:bg-slate-900' : ''
                }`}
              >
                Estimated Budget
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {quickViewTab === 'overview' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-sm mb-1">About this spot</h4>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-normal">{quickViewDest.shortDesc}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase block">Category</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-200">{quickViewDest.category}</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase block">Best Season</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-200">{quickViewDest.bestSeason || 'November – March'}</span>
                    </div>
                  </div>
                </div>
              )}

              {quickViewTab === 'routes' && (
                <div className="space-y-3">
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Recommended Routes</h4>
                  {quickViewDest.travelRoutes && quickViewDest.travelRoutes.length > 0 ? (
                    quickViewDest.travelRoutes.map((r, i) => (
                      <div key={i} className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/40 rounded-xl space-y-1">
                        <div className="flex justify-between font-extrabold text-emerald-800 dark:text-emerald-300">
                          <span>{r.from} → {r.to}</span>
                          <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 text-[10px] rounded-md border border-emerald-200 dark:border-emerald-700/50">{r.mode}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Est. Duration: {r.duration || '2-4 hours'}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 dark:text-slate-500">No specific routes added yet.</p>
                  )}
                </div>
              )}

              {quickViewTab === 'budget' && (
                <div className="space-y-3">
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Cost Breakdown</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase block">Budget Traveler</span>
                      <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                        {formatCost(quickViewDest.estimatedBudgetBDT.budget)}
                      </span>
                    </div>
                    <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold uppercase block">Mid-Range Comfort</span>
                      <span className="font-extrabold text-emerald-900 dark:text-emerald-200 text-sm">
                        {formatCost(quickViewDest.estimatedBudgetBDT.midRange)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer CTA */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex justify-between items-center">
              <button
                onClick={() => {
                  setQuickViewDest(null);
                  onSelectDestination(quickViewDest);
                }}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors cursor-pointer border border-slate-200 dark:border-slate-700/60"
              >
                View Full Details Page
              </button>

              <button
                onClick={() => {
                  const name = quickViewDest.name;
                  setQuickViewDest(null);
                  onPlanTripToHere(name);
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                <span>Plan Trip Here</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DESTINATION COMPARISON MODAL */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl p-6 space-y-5 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-black text-slate-900 dark:text-white text-lg">Spot Comparison Matrix</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Side-by-side comparison for selected destinations</p>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 overflow-x-auto text-xs">
              {compareList.map((dest) => (
                <div key={dest.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-3">
                  <img src={dest.image} className="w-full h-28 object-cover rounded-xl" alt={dest.name} />
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">{dest.name}</h4>
                  
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700/60 text-[11px]">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 font-bold block">District:</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-200">{dest.district}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 font-bold block">Rating:</span>
                      <span className="font-extrabold text-amber-600 dark:text-amber-400">★ {dest.rating}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 font-bold block">Mid Budget:</span>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{formatCost(dest.estimatedBudgetBDT.midRange)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TRAVEL KNOWLEDGE HELPLINE MODAL */}
      {showKnowledgeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl p-6 space-y-4 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-black text-slate-900 dark:text-white text-base flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
                <span>Chattogram Travel Essentials</span>
              </h3>
              <button
                onClick={() => setShowKnowledgeModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-100 dark:border-emerald-800/40">
                <h4 className="font-extrabold text-emerald-800 dark:text-emerald-300 mb-1">1. Hill Tracts Permits & Clearance</h4>
                <p>Foreign travelers require prior permission from the Deputy Commissioner office for Sajek Valley, Bandarban, and Rangamati remote trails.</p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60">
                <h4 className="font-extrabold text-slate-800 dark:text-slate-200 mb-1">2. Local Transport (Chander Gari)</h4>
                <p>Jeep sharing is standard in Sajek & Bandarban. Group up with community travelers to split vehicle costs.</p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60">
                <h4 className="font-extrabold text-slate-800 dark:text-slate-200 mb-1">3. Emergency Contact Numbers</h4>
                <p className="font-bold text-slate-900 dark:text-slate-100">National Emergency Services: 999 | Tourist Police HQ: +880 1320-000000</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE GPS MAP MODAL */}
      {showMapModal && (() => {
        const focus = mapFocus || destinations[0];
        const { lat, lng } = focus.coordinates;
        const span = 0.12;
        const bbox = `${lng - span},${lat - span},${lng + span},${lat + span}`;
        const osmSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
        const gmaps = `https://www.google.com/maps?q=${lat},${lng}`;

        return (
          <div
            className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
            onMouseDown={(e) => e.target === e.currentTarget && setShowMapModal(false)}
          >
            <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl p-6 space-y-4 max-h-[92vh] overflow-y-auto border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="font-black text-slate-900 dark:text-white flex items-center gap-2 text-base">
                  <Map className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
                  <span>Interactive Map Coordinates</span>
                </h3>
                <button
                  onClick={() => setShowMapModal(false)}
                  className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-lg transition-colors cursor-pointer border border-slate-200 dark:border-slate-700/60"
                >
                  Close Map
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-2">
                  <div className="h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 relative">
                    <iframe
                      key={focus.id}
                      title={`Map of ${focus.name}`}
                      src={osmSrc}
                      className="w-full h-full border-0"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
                    <div>
                      <span className="font-black text-slate-900 dark:text-white">{focus.name}</span>
                      <span className="text-slate-500 dark:text-slate-400"> • {focus.district} (Lat: {lat}, Lng: {lng})</span>
                    </div>
                    <a
                      href={gmaps}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {destinations.length} Pin Locations
                  </p>
                  {destinations.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setMapFocus(d)}
                      className={`w-full text-left p-3 rounded-xl border transition-all text-xs cursor-pointer ${
                        d.id === focus.id
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                        <MapPin className={`w-3.5 h-3.5 ${d.id === focus.id ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`} />
                        {d.name}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 text-[10px] block pl-[18px]">
                        {d.district} • {d.coordinates.lat}, {d.coordinates.lng}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
};
