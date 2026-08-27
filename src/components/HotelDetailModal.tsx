import React, { useState, useMemo } from 'react';
import { X, Star, MapPin, CheckCircle, Calendar, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { Hotel } from '../types/travel';

interface HotelDetailModalProps {
  hotel: Hotel | null;
  onClose: () => void;
  currency: 'BDT' | 'USD';
}

export const HotelDetailModal: React.FC<HotelDetailModalProps> = ({ hotel, onClose, currency }) => {
  if (!hotel) return null;

  const galleryImages = useMemo(() => {
    if (hotel.images && hotel.images.length > 0) return hotel.images;
    return [hotel.image];
  }, [hotel]);

  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(hotel.roomTypes?.[0] || 'Standard Room');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Dynamic Date States
  const [checkIn, setCheckIn] = useState('2026-08-15');
  const [checkOut, setCheckOut] = useState('2026-08-17');

  // Calculate Nights Dynamically
  const nights = useMemo(() => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }, [checkIn, checkOut]);

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

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 text-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-800 max-h-[90vh] flex flex-col relative">
        
        {/* Sticky Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 p-2.5 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full backdrop-blur-md transition-all shadow-md hover:scale-105 active:scale-95 border border-slate-700/50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero & Interactive Gallery */}
        <div className="relative h-64 sm:h-72 shrink-0 bg-slate-950 group">
          <img
            src={galleryImages[activeImageIndex]}
            alt={`${hotel.name} visual ${activeImageIndex + 1}`}
            className="w-full h-full object-cover transition-all duration-300"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30" />

          {/* Carousel Navigation Arrows */}
          {galleryImages.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-slate-900/60 hover:bg-slate-900/90 text-white rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextImage}
                aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-slate-900/60 hover:bg-slate-900/90 text-white rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Thumbnails Overlay */}
          {galleryImages.length > 1 && (
            <div className="absolute bottom-3 left-4 right-4 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIndex === idx 
                      ? 'border-emerald-400 ring-2 ring-emerald-400/50 scale-105' 
                      : 'border-white/40 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`Thumbnail ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 text-xs text-slate-300">
          
          {/* Header & Pricing */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950 text-emerald-300 font-semibold text-[11px] rounded-full border border-emerald-800/60">
                <span>{hotel.destinationName}</span>
                <span>•</span>
                <span>{hotel.district}</span>
              </span>
              <h2 className="text-2xl font-black text-white tracking-tight leading-snug">{hotel.name}</h2>
              <p className="text-slate-400 flex items-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{hotel.address}</span>
              </p>
            </div>

            <div className="bg-slate-800/50 p-3 sm:p-0 rounded-2xl sm:bg-transparent sm:text-right shrink-0 border border-slate-800 sm:border-none">
              <div className="flex items-center sm:justify-end gap-1.5 text-amber-400 font-bold text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-white font-extrabold">{hotel.rating}</span>
                <span className="text-slate-400 font-normal text-xs">({hotel.reviewsCount} reviews)</span>
              </div>
              <div className="mt-1">
                <span className="text-xl font-black text-emerald-400">{formatCost(hotel.pricePerNightBDT)}</span>
                <span className="text-slate-400 text-xs font-normal"> / night</span>
              </div>
            </div>
          </div>

          {/* Amenities Grid */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">Included Amenities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {(hotel.amenities || []).map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl hover:border-slate-600 transition-colors">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-medium text-slate-200">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Room Selection */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">Select Room Type</h3>
            <div className="grid gap-2.5">
              {(hotel.roomTypes || []).map((room, idx) => {
                const isSelected = selectedRoom === room;
                return (
                  <label
                    key={idx}
                    onClick={() => setSelectedRoom(room)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500/50 shadow-sm' 
                        : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-emerald-400 bg-emerald-500' : 'border-slate-600'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 bg-slate-950 rounded-full" />}
                      </div>
                      <span className={`font-medium text-sm ${isSelected ? 'text-emerald-300 font-semibold' : 'text-slate-200'}`}>{room}</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">{formatCost(hotel.pricePerNightBDT)}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Instant Booking Form */}
          {!bookingSubmitted ? (
            <form onSubmit={handleBooking} className="p-5 bg-slate-950 text-white rounded-2xl space-y-4 shadow-xl border border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>Instant Reservation</span>
                </h3>
                <span className="text-[11px] text-slate-400 font-medium">{nights} {nights === 1 ? 'Night' : 'Nights'} stay</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Check-in</label>
                  <input
                    type="date"
                    required
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Check-out</label>
                  <input
                    type="date"
                    required
                    value={checkOut}
                    min={checkIn}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirm Booking Request ({formatCost(hotel.pricePerNightBDT * nights)})</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6 bg-emerald-950/60 border border-emerald-800/80 text-emerald-200 rounded-2xl text-center space-y-2 animate-in fade-in zoom-in-95">
              <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="font-extrabold text-base text-white">Booking Request Submitted!</h4>
              <p className="text-xs text-emerald-300 leading-relaxed max-w-md mx-auto">
                The management at <strong>{hotel.name}</strong> will reach out via SMS/Email shortly to confirm details for your reserved <strong>{selectedRoom}</strong>.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
