import React, { useState } from 'react';
import {
  Hotel as HotelIcon,
  Search,
  Filter,
  Star,
  MapPin,
  CheckCircle,
  SlidersHorizontal,
  DollarSign,
  Layers,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Hotel, DistrictType } from '../../types/travel';

interface HotelsViewProps {
  hotels: Hotel[];
  onSelectHotel: (h: Hotel) => void;
  currency: 'BDT' | 'USD';
  selectedHotelsForCompare: Hotel[];
  setSelectedHotelsForCompare: React.Dispatch<React.SetStateAction<Hotel[]>>;
  openCompareModal: () => void;
}

export const HotelsView: React.FC<HotelsViewProps> = ({
  hotels,
  onSelectHotel,
  currency,
  selectedHotelsForCompare,
  setSelectedHotelsForCompare,
  openCompareModal,
}) => {
  const [hotelSearch, setHotelSearch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [maxPriceBDT, setMaxPriceBDT] = useState<number>(20000);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const districts: string[] = ['All', 'Cox\'s Bazar', 'Bandarban', 'Rangamati', 'Chattogram City', 'Sitakunda'];
  const amenityOptions = ['Infinity Pool', 'Free High-Speed Wi-Fi', 'Rooftop Lounge & Bar', 'Spa & Fitness Center', 'Complimentary Breakfast', 'Oceanfront Infinity Pool'];

  const filteredHotels = hotels.filter((h) => {
    const matchesDistrict = selectedDistrict === 'All' || h.district === selectedDistrict;
    const matchesSearch =
      h.name.toLowerCase().includes(hotelSearch.toLowerCase()) ||
      h.destinationName.toLowerCase().includes(hotelSearch.toLowerCase()) ||
      h.address.toLowerCase().includes(hotelSearch.toLowerCase());
    const matchesPrice = h.pricePerNightBDT <= maxPriceBDT;
    const matchesRating = h.rating >= minRating;
    const matchesAmenities = selectedAmenities.every((a) => h.amenities.includes(a));
    return matchesDistrict && matchesSearch && matchesPrice && matchesRating && matchesAmenities;
  });

  const toggleCompareHotel = (h: Hotel) => {
    if (selectedHotelsForCompare.some((x) => x.id === h.id)) {
      setSelectedHotelsForCompare(selectedHotelsForCompare.filter((x) => x.id !== h.id));
    } else {
      if (selectedHotelsForCompare.length >= 3) {
        alert('You can compare up to 3 hotels side by side.');
        return;
      }
      setSelectedHotelsForCompare([...selectedHotelsForCompare, h]);
    }
  };

  const formatCost = (bdt: number) => {
    if (currency === 'USD') {
      return `$${Math.round(bdt / 115)}`;
    }
    return `৳${bdt.toLocaleString()} BDT`;
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* 1. HERO BANNER matching Wireframe Page 10 ("Book Now!" Hero banner with Hotel pictures scrolling below) */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white p-8 sm:p-12 border border-emerald-900 shadow-xl flex flex-col items-center text-center">
        <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-xs rounded-full uppercase tracking-widest mb-3">
          CHATTOGRAM ACCOMMODATION DISCOVERY
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Book Now!
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mt-2">
          Discover luxury beach resorts in Cox's Bazar, high altitude army hill cottages in Nilgiri, and wooden cloud villas in Sajek.
        </p>

        {/* Hero Search Bar */}
        <div className="mt-6 w-full max-w-xl bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 flex gap-2">
          <input
            type="text"
            placeholder="Search hotels by destination or name..."
            value={hotelSearch}
            onChange={(e) => setHotelSearch(e.target.value)}
            className="flex-1 bg-white text-slate-900 px-4 py-2.5 rounded-xl text-xs outline-none font-medium placeholder:text-slate-400"
          />
          <button className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-colors">
            Search
          </button>
        </div>
      </div>

      {/* Floating Compare Drawer Trigger if items selected */}
      {selectedHotelsForCompare.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl border border-emerald-500 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-3">
          <span className="text-xs font-bold text-emerald-400">
            {selectedHotelsForCompare.length} Hotel{selectedHotelsForCompare.length > 1 ? 's' : ''} Selected for Comparison
          </span>
          <button
            onClick={openCompareModal}
            className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-xs"
          >
            Compare Side-by-Side
          </button>
          <button
            onClick={() => setSelectedHotelsForCompare([])}
            className="text-xs text-slate-400 hover:text-white"
          >
            Clear
          </button>
        </div>
      )}

      {/* Main Grid: Left Filters, Right Hotel Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Advanced Filters Drawer matching Spec */}
        <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-5 h-fit">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-xs flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
              <span>Advanced Filters</span>
            </h3>
            <button
              onClick={() => {
                setSelectedDistrict('All');
                setMaxPriceBDT(20000);
                setMinRating(0);
                setSelectedAmenities([]);
              }}
              className="text-[10px] text-emerald-700 font-bold"
            >
              Reset All
            </button>
          </div>

          {/* District Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">District / Region</label>
            <div className="space-y-1">
              {districts.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDistrict(d)}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-lg transition-colors ${
                    selectedDistrict === d ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>Max Nightly Rate:</span>
              <span className="text-emerald-700 font-bold">{formatCost(maxPriceBDT)}</span>
            </div>
            <input
              type="range"
              min="2000"
              max="20000"
              step="1000"
              value={maxPriceBDT}
              onChange={(e) => setMaxPriceBDT(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          {/* Minimum Rating */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700">Minimum Rating</label>
            <div className="flex gap-1">
              {[0, 4.0, 4.5, 4.8].map((r) => (
                <button
                  key={r}
                  onClick={() => setMinRating(r)}
                  className={`flex-1 py-1 rounded-lg text-xs font-bold ${
                    minRating === r ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {r === 0 ? 'Any' : `${r}+★`}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities Checkboxes */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700">Amenities</label>
            <div className="space-y-1.5 text-xs">
              {amenityOptions.map((a) => (
                <label key={a} className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(a)}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedAmenities([...selectedAmenities, a]);
                      else setSelectedAmenities(selectedAmenities.filter((x) => x !== a));
                    }}
                    className="text-emerald-600 rounded border-slate-300"
                  />
                  <span>{a}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Hotel Cards Grid matching Wireframe Page 10 (Pictures scrolling below tree structure) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs font-bold text-slate-500">Showing {filteredHotels.length} Accommodations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredHotels.map((h) => {
              const isComparing = selectedHotelsForCompare.some((x) => x.id === h.id);
              return (
                <div
                  key={h.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="relative h-48 cursor-pointer overflow-hidden" onClick={() => onSelectHotel(h)}>
                    <img src={h.image} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt={h.name} />
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-slate-950/80 text-white text-[10px] font-bold rounded-lg">
                      {h.destinationName}
                    </div>
                    <div className="absolute top-3 right-3 px-2 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-bold rounded-md flex items-center gap-1">
                      <Star className="w-3 h-3 fill-slate-950" />
                      <span>{h.rating}</span>
                    </div>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3
                        onClick={() => onSelectHotel(h)}
                        className="font-bold text-base text-slate-900 hover:text-emerald-700 cursor-pointer"
                      >
                        {h.name}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="line-clamp-1">{h.address}</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {h.amenities.slice(0, 3).map((a, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-medium rounded-md">
                          {a}
                        </span>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Nightly Rate</span>
                        <span className="font-extrabold text-emerald-900">{formatCost(h.pricePerNightBDT)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleCompareHotel(h)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                            isComparing ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {isComparing ? 'Comparing ✓' : '+ Compare'}
                        </button>

                        <button
                          onClick={() => onSelectHotel(h)}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredHotels.length === 0 && (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <HotelIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-700">No accommodations match your filter criteria</h3>
              <p className="text-xs text-slate-500">Try resetting price or rating limits.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
