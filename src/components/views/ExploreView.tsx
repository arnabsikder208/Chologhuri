import React, { useState } from 'react';
import {
  Search,
  Dices,
  FileText,
  MapPin,
  Map,
  ArrowRight,
  Filter,
  Star,
  CheckCircle,
  Navigation,
  Compass,
  Layers,
  Sparkles
} from 'lucide-react';
import { Destination, CategoryType, DistrictType } from '../../types/travel';

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
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapFocus, setMapFocus] = useState<Destination | null>(null);
  const [randomSurprise, setRandomSurprise] = useState<Destination | null>(null);

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
    'Cox\'s Bazar',
    'Bandarban',
    'Rangamati',
    'Sitakunda',
    'Mirsarai',
  ];

  const filteredDestinations = destinations.filter((d) => {
    const matchesCategory = selectedCategory === 'All' || d.category === selectedCategory;
    const matchesDistrict = selectedDistrict === 'All' || d.district === selectedDistrict;
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesDistrict && matchesSearch;
  });

  const handleRollDice = () => {
    const randomIndex = Math.floor(Math.random() * destinations.length);
    const surprise = destinations[randomIndex];
    setRandomSurprise(surprise);
    onSelectDestination(surprise);
  };

  const formatCost = (bdt: number) => {
    if (currency === 'USD') {
      return `$${Math.round(bdt / 115)}`;
    }
    return `৳${bdt.toLocaleString()} BDT`;
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Compass className="w-6 h-6 text-emerald-600" />
            <span>EXPLORE CHATTOGRAM DIVISION</span>
          </h1>
          <p className="text-xs text-slate-500">
            Browse spots by district, category, travel routes, and estimated budget
          </p>
        </div>

        <button
          onClick={handleRollDice}
          className="px-4 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 self-start sm:self-auto hover:scale-105"
        >
          <Dices className="w-4 h-4 text-emerald-300 animate-spin-slow" />
          <span>Surprise Destination Dice</span>
        </button>
      </div>

      {/* 1. POPULAR DESTINATIONS top preview slider matching Page 6 wireframe */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          FEATURED POPULAR DESTINATIONS
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {destinations.filter(d => d.popular).slice(0, 3).map((d) => (
            <div
              key={d.id}
              onClick={() => onSelectDestination(d)}
              className="relative rounded-2xl overflow-hidden h-40 group cursor-pointer border border-slate-200 shadow-xs"
            >
              <img src={d.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={d.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                <div>
                  <p className="text-xs text-emerald-400 font-semibold">{d.district}</p>
                  <h3 className="text-sm font-bold text-white">{d.name}</h3>
                </div>
                <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-emerald-500 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Search a Place Bar (Page 6 Wireframe center element) */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search a place in Chattogram (e.g. Sajek Valley, Patenga, Kaptai, Bandarban)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 shadow-xs"
        />
      </div>

      {/* 3. Wireframe Toolbar & Category Filter Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Interactive Sidebar matching Page 6 Wireframe (Dice, Details, Maps) */}
        <div className="lg:col-span-1 space-y-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" />
            <span>Interactive Tools</span>
          </h3>

          <div className="space-y-2">
            <button
              onClick={handleRollDice}
              className="w-full p-3 bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 font-bold rounded-xl border border-slate-200 text-xs flex items-center gap-3 transition-colors"
            >
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                <Dices className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p>Roll Surprise Dice</p>
                <p className="text-[10px] text-slate-400 font-normal">Pick random spot</p>
              </div>
            </button>

            <button
              onClick={() => setShowMapModal(true)}
              className="w-full p-3 bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 font-bold rounded-xl border border-slate-200 text-xs flex items-center gap-3 transition-colors"
            >
              <div className="p-2 bg-teal-100 text-teal-700 rounded-lg">
                <Map className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p>Interactive Map View</p>
                <p className="text-[10px] text-slate-400 font-normal">View GPS coordinates</p>
              </div>
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <label className="block text-[11px] font-bold text-slate-700">Filter by District</label>
            <div className="flex flex-wrap gap-1">
              {districts.map((dist) => (
                <button
                  key={dist}
                  onClick={() => setSelectedDistrict(dist)}
                  className={`px-2.5 py-1 text-[11px] rounded-lg font-medium transition-colors ${
                    selectedDistrict === dist
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {dist}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Main Grid */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Destination Cards List matching Page 6 wireframe (Place -> Place -> Place) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredDestinations.map((d) => (
              <div
                key={d.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="relative h-44 cursor-pointer overflow-hidden" onClick={() => onSelectDestination(d)}>
                  <img src={d.image} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt={d.name} />
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-slate-950/80 text-white text-[10px] font-bold rounded-lg">
                    {d.district}
                  </div>
                  <div className="absolute top-3 right-3 px-2 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-bold rounded-md flex items-center gap-1">
                    <Star className="w-3 h-3 fill-slate-950" />
                    <span>{d.rating}</span>
                  </div>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      onClick={() => onSelectDestination(d)}
                      className="font-bold text-base text-slate-900 hover:text-emerald-700 cursor-pointer transition-colors"
                    >
                      {d.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{d.shortDesc}</p>
                  </div>

                  {/* Quick Route info snippet */}
                  {d.travelRoutes.length > 0 && (
                    <div className="p-2 bg-emerald-50/70 border border-emerald-100 rounded-xl text-[11px] text-emerald-900">
                      <span className="font-bold">Route:</span> {d.travelRoutes[0].from} → {d.travelRoutes[0].to} ({d.travelRoutes[0].mode})
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Est. Budget</span>
                      <span className="font-extrabold text-slate-900">{formatCost(d.estimatedBudgetBDT.midRange)}</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => onSelectDestination(d)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onPlanTripToHere(d.name)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Plan</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredDestinations.length === 0 && (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
              <Compass className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">No destinations match your filters</h3>
              <p className="text-xs text-slate-500">Try clearing search or switching categories.</p>
            </div>
          )}
        </div>

      </div>

      {/* Interactive GPS Map View Modal (OpenStreetMap embed, no extra dependencies) */}
      {showMapModal && (() => {
        const focus = mapFocus || destinations[0];
        const { lat, lng } = focus.coordinates;
        const span = 0.12;
        const bbox = `${lng - span},${lat - span},${lng + span},${lat + span}`;
        const osmSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
        const gmaps = `https://www.google.com/maps?q=${lat},${lng}`;
        return (
          <div
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
            onMouseDown={(e) => e.target === e.currentTarget && setShowMapModal(false)}
          >
            <div className="glass-card w-full max-w-4xl rounded-3xl p-6 space-y-4 animate-in zoom-in-95 max-h-[92vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-[var(--glass-border)] pb-3">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <Map className="w-5 h-5 text-emerald-600" />
                  <span>Chattogram Division Map Locations</span>
                </h3>
                <button onClick={() => setShowMapModal(false)} className="text-slate-400 hover:text-slate-900 font-bold">
                  Close
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Live map */}
                <div className="lg:col-span-2 space-y-2">
                  <div className="h-80 sm:h-96 rounded-2xl overflow-hidden border border-[var(--glass-border)] bg-slate-100 relative">
                    <iframe
                      key={focus.id}
                      title={`Map of ${focus.name}`}
                      src={osmSrc}
                      className="w-full h-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="font-bold text-slate-900">{focus.name}</span>
                      <span className="text-slate-500"> • {focus.district} • Lat {lat}, Lng {lng}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={gmaps}
                        target="_blank"
                        rel="noreferrer"
                        className="glass-btn px-3 py-1.5 rounded-lg font-semibold text-[var(--text-secondary)]"
                      >
                        Open in Google Maps
                      </a>
                      <button
                        onClick={() => {
                          setShowMapModal(false);
                          onSelectDestination(focus);
                        }}
                        className="btn-brand px-3 py-1.5 rounded-lg text-white font-bold"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>

                {/* Destination list — click to move the marker */}
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {destinations.length} GPS waypoints
                  </p>
                  {destinations.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setMapFocus(d)}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all text-[11px] ${
                        d.id === focus.id
                          ? 'border-emerald-500/60 bg-emerald-500/10 shadow-sm'
                          : 'border-[var(--glass-border-soft)] bg-slate-50 hover:bg-emerald-500/5'
                      }`}
                    >
                      <span className="font-bold text-slate-900 flex items-center gap-1.5">
                        <MapPin className={`w-3 h-3 ${d.id === focus.id ? 'text-emerald-500' : 'text-slate-400'}`} />
                        {d.name}
                      </span>
                      <span className="text-slate-400 text-[10px] block pl-[18px]">
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
