import React from 'react';
import { X, Check, Minus, Star, DollarSign } from 'lucide-react';
import { Hotel } from '../types/travel';

interface PriceComparisonModalProps {
  hotels: Hotel[];
  onClose: () => void;
  currency: 'BDT' | 'USD';
  onSelectHotel: (h: Hotel) => void;
}

export const PriceComparisonModal: React.FC<PriceComparisonModalProps> = ({
  hotels,
  onClose,
  currency,
  onSelectHotel,
}) => {
  if (hotels.length === 0) return null;

  const formatCost = (bdt: number) => {
    if (currency === 'USD') {
      return `$${Math.round(bdt / 115)}`;
    }
    return `৳${bdt.toLocaleString()} BDT`;
  };

  const commonAmenities = [
    'Free Wi-Fi',
    'Infinity Pool',
    'Restaurant',
    'Ocean / Mountain View',
    'Breakfast',
    'Spa & Fitness',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-emerald-100 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Hotel Price & Facilities Comparison</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Table Container */}
        <div className="flex-1 overflow-x-auto p-6">
          <table className="w-full text-left border-collapse min-w-[600px] text-xs">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="p-3 w-40 text-slate-400 uppercase font-bold text-[10px]">Property Details</th>
                {hotels.map((h) => (
                  <th key={h.id} className="p-3 font-bold text-slate-900">
                    <div className="space-y-2">
                      <img src={h.image} className="w-full h-24 object-cover rounded-xl" alt={h.name} />
                      <p className="text-sm line-clamp-1">{h.name}</p>
                      <p className="text-[10px] text-slate-500 font-normal">{h.destinationName}</p>
                      <button
                        onClick={() => {
                          onClose();
                          onSelectHotel(h);
                        }}
                        className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors"
                      >
                        Book Now
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-3 font-semibold text-slate-700">Nightly Rate ({currency})</td>
                {hotels.map((h) => (
                  <td key={h.id} className="p-3 font-extrabold text-sm text-emerald-800">
                    {formatCost(h.pricePerNightBDT)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-700">Guest Rating</td>
                {hotels.map((h) => (
                  <td key={h.id} className="p-3">
                    <div className="flex items-center gap-1 font-bold text-amber-500">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span>{h.rating}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({h.reviewsCount})</span>
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-700">District Location</td>
                {hotels.map((h) => (
                  <td key={h.id} className="p-3 text-slate-600 font-medium">
                    {h.district}
                  </td>
                ))}
              </tr>
              {commonAmenities.map((amenity) => (
                <tr key={amenity}>
                  <td className="p-3 font-semibold text-slate-700">{amenity}</td>
                  {hotels.map((h) => {
                    const hasAmenity = h.amenities.some((a) => a.toLowerCase().includes(amenity.toLowerCase()));
                    return (
                      <td key={h.id} className="p-3">
                        {hasAmenity ? (
                          <Check className="w-4 h-4 text-emerald-600 font-bold" />
                        ) : (
                          <Minus className="w-4 h-4 text-slate-300" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
          <button onClick={onClose} className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl">
            Close Comparison
          </button>
        </div>

      </div>
    </div>
  );
};
