import React, { useState } from 'react';
import { X, Star, MapPin, CheckCircle, Wifi, Coffee, Shield, Phone, Calendar } from 'lucide-react';
import { Hotel } from '../types/travel';

interface HotelDetailModalProps {
  hotel: Hotel | null;
  onClose: () => void;
  currency: 'BDT' | 'USD';
}

export const HotelDetailModal: React.FC<HotelDetailModalProps> = ({ hotel, onClose, currency }) => {
  if (!hotel) return null;

  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(hotel.roomTypes[0] || 'Standard Room');
  const [activeImage, setActiveImage] = useState(hotel.image);

  const formatCost = (bdt: number) => {
    if (currency === 'USD') {
      return `$${Math.round(bdt / 115)}`;
    }
    return `৳${bdt.toLocaleString()} BDT`;
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-emerald-100 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
        
        {/* Gallery Header */}
        <div className="relative h-60 sm:h-64 shrink-0 bg-slate-900">
          <img
            src={activeImage}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-slate-900/60 hover:bg-slate-900 text-white rounded-full backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Thumbnails */}
          {hotel.images && hotel.images.length > 1 && (
            <div className="absolute bottom-3 left-4 flex gap-2">
              {hotel.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-transform ${
                    activeImage === img ? 'border-emerald-400 scale-105' : 'border-white/50 opacity-80'
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="thumbnail" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 font-bold text-[10px] rounded-full">
                {hotel.destinationName} • {hotel.district}
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">{hotel.name}</h2>
              <p className="text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{hotel.address}</span>
              </p>
            </div>

            <div className="text-left sm:text-right">
              <div className="flex items-center sm:justify-end gap-1 text-amber-500 font-bold text-sm">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{hotel.rating}</span>
                <span className="text-slate-400 text-xs font-normal">({hotel.reviewsCount} reviews)</span>
              </div>
              <p className="text-lg font-extrabold text-emerald-700 mt-1">
                {formatCost(hotel.pricePerNightBDT)} <span className="text-xs text-slate-500 font-normal">/ night</span>
              </p>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Included Amenities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {hotel.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200/80 rounded-lg">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-medium text-slate-800">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Room Types */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Available Room Types</h3>
            <div className="space-y-2">
              {hotel.roomTypes.map((room, idx) => (
                <label
                  key={idx}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                    selectedRoom === room ? 'bg-emerald-50/70 border-emerald-300 font-semibold text-emerald-900' : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="roomType"
                      checked={selectedRoom === room}
                      onChange={() => setSelectedRoom(room)}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>{room}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-800">{formatCost(hotel.pricePerNightBDT)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Instant Booking Form */}
          {!bookingSubmitted ? (
            <form onSubmit={handleBooking} className="p-4 bg-emerald-950 text-white rounded-xl space-y-3">
              <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>Instant Room Reservation Request</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-300 mb-1">Check-in Date</label>
                  <input
                    type="date"
                    required
                    defaultValue="2026-08-15"
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-300 mb-1">Check-out Date</label>
                  <input
                    type="date"
                    required
                    defaultValue="2026-08-17"
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-colors"
              >
                Confirm Booking Request ({formatCost(hotel.pricePerNightBDT * 2)})
              </button>
            </form>
          ) : (
            <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-center space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-sm">Booking Request Sent Successfully!</h4>
              <p className="text-xs text-emerald-800">
                The management of <strong>{hotel.name}</strong> will contact you via SMS / Email shortly to confirm check-in details.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
