import React from 'react';
import { X, MapPin, Navigation, DollarSign, Star, Info, CheckCircle, Clock, Calendar, Sparkles } from 'lucide-react';
import { Destination, Hotel } from '../types/travel';

interface DestinationDetailModalProps {
  destination: Destination | null;
  onClose: () => void;
  currency: 'BDT' | 'USD';
  nearbyHotels: Hotel[];
  onPlanTripToHere: (destName: string) => void;
}

export const DestinationDetailModal: React.FC<DestinationDetailModalProps> = ({
  destination,
  onClose,
  currency,
  nearbyHotels,
  onPlanTripToHere,
}) => {
  if (!destination) return null;

  const formatCost = (bdt: number) => {
    if (currency === 'USD') {
      return `$${Math.round(bdt / 115)}`;
    }
    return `৳${bdt.toLocaleString()} BDT`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border border-emerald-100 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
        
        {/* Banner Image & Header */}
        <div className="relative h-64 sm:h-72 shrink-0">
          <img
            src={destination.image}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-slate-900/60 hover:bg-slate-900 text-white rounded-full backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-emerald-500 text-slate-950 font-bold text-[10px] rounded-full uppercase tracking-wider">
                {destination.category}
              </span>
              <span className="px-2.5 py-0.5 bg-white/20 backdrop-blur-md text-white font-medium text-[10px] rounded-full flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                {destination.district}, Chattogram Division
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {destination.name}
            </h2>

            <div className="flex items-center gap-4 text-xs text-slate-200 pt-1">
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{destination.rating}</span>
                <span className="text-slate-300 font-normal">({destination.reviewsCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>Best: {destination.bestTimeToVisit}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700">
          
          {/* Overview */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Info className="w-4 h-4 text-emerald-600" />
              <span>About Destination</span>
            </h3>
            <p className="leading-relaxed text-slate-600 font-normal">{destination.fullDesc}</p>
          </div>

          {/* Key Attractions Grid */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Popular Attractions & Highlights</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {destination.attractions.map((attraction, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-medium text-slate-800">{attraction}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Travel Routes & Fares */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-teal-600" />
              <span>Travel Routes & Fares</span>
            </h3>
            <div className="space-y-2">
              {destination.travelRoutes.map((route, idx) => (
                <div key={idx} className="p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {route.from} → {route.to}
                    </p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span className="font-medium text-emerald-700">{route.mode}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {route.duration}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs">
                      {formatCost(route.costBDT)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Estimated Travel Expenses */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Estimated Trip Expenses</span>
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Backpacker</p>
                <p className="text-sm font-extrabold text-slate-900 mt-1">{formatCost(destination.estimatedBudgetBDT.budget)}</p>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <p className="text-[10px] text-emerald-700 font-bold uppercase">Mid-Range</p>
                <p className="text-sm font-extrabold text-emerald-900 mt-1">{formatCost(destination.estimatedBudgetBDT.midRange)}</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Resort Luxury</p>
                <p className="text-sm font-extrabold text-slate-900 mt-1">{formatCost(destination.estimatedBudgetBDT.luxury)}</p>
              </div>
            </div>
          </div>

          {/* Visitor Tips */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Traveler Tips & Guidelines</h3>
            <ul className="space-y-1.5 list-disc list-inside text-slate-600">
              {destination.visitorTips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>

          {/* Nearby Accommodations Preview */}
          {nearbyHotels.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">Nearby Recommended Accommodations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {nearbyHotels.map((h) => (
                  <div key={h.id} className="flex gap-3 p-2 bg-slate-50 border border-slate-200 rounded-xl items-center">
                    <img src={h.image} className="w-14 h-14 rounded-lg object-cover" alt={h.name} />
                    <div>
                      <h4 className="font-bold text-slate-900 line-clamp-1">{h.name}</h4>
                      <p className="text-[10px] text-slate-500">{h.district}</p>
                      <p className="text-xs font-bold text-emerald-700 mt-0.5">{formatCost(h.pricePerNightBDT)} / night</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Action Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-xl text-xs hover:bg-slate-100 transition-colors"
          >
            Close Details
          </button>
          
          <button
            onClick={() => {
              onClose();
              onPlanTripToHere(destination.name);
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>Generate AI Itinerary for {destination.name}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
