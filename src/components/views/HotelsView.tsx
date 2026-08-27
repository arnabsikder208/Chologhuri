import React, { useMemo, useState } from 'react';
import {
  Hotel as HotelIcon,
  Search,
  Star,
  MapPin,
  SlidersHorizontal,
  Sparkles,
  ArrowUpDown,
  X,
  Check,
  Heart,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { Hotel } from '../../types/travel';

interface HotelsViewProps {
  hotels: Hotel[];
  onSelectHotel: (h: Hotel) => void;
  currency: 'BDT' | 'USD';
  selectedHotelsForCompare: Hotel[];
  setSelectedHotelsForCompare: React.Dispatch<React.SetStateAction<Hotel[]>>;
  openCompareModal: () => void;
}

type SortOption =
  | 'recommended'
  | 'price-low'
  | 'price-high'
  | 'rating';

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
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const districts = [
    'All',
    "Cox's Bazar",
    'Bandarban',
    'Rangamati',
    'Chattogram City',
    'Sitakunda',
  ];

  const amenityOptions = [
    'Infinity Pool',
    'Free High-Speed Wi-Fi',
    'Rooftop Lounge & Bar',
    'Spa & Fitness Center',
    'Complimentary Breakfast',
    'Oceanfront Infinity Pool',
  ];

  const formatCost = (bdt: number) => {
    if (currency === 'USD') {
      return `$${Math.round(bdt / 115)}`;
    }
    return `৳${bdt.toLocaleString()} BDT`;
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((current) =>
      current.includes(amenity)
        ? current.filter((item) => item !== amenity)
        : [...current, amenity]
    );
  };

  const toggleFavorite = (hotelId: string) => {
    setFavorites((current) =>
      current.includes(hotelId)
        ? current.filter((id) => id !== hotelId)
        : [...current, hotelId]
    );
  };

  const toggleCompareHotel = (hotel: Hotel) => {
    const alreadySelected = selectedHotelsForCompare.some(
      (item) => item.id === hotel.id
    );

    if (alreadySelected) {
      setSelectedHotelsForCompare(
        selectedHotelsForCompare.filter((item) => item.id !== hotel.id)
      );
      return;
    }

    if (selectedHotelsForCompare.length >= 3) {
      alert('You can compare up to 3 hotels side by side.');
      return;
    }

    setSelectedHotelsForCompare([
      ...selectedHotelsForCompare,
      hotel,
    ]);
  };

  const resetFilters = () => {
    setSelectedDistrict('All');
    setMaxPriceBDT(20000);
    setMinRating(0);
    setSelectedAmenities([]);
    setHotelSearch('');
    setSortBy('recommended');
  };

  const filteredHotels = useMemo(() => {
    const filtered = hotels.filter((hotel) => {
      const search = hotelSearch.toLowerCase().trim();

      const matchesDistrict =
        selectedDistrict === 'All' ||
        hotel.district === selectedDistrict;

      const matchesSearch =
        !search ||
        hotel.name.toLowerCase().includes(search) ||
        hotel.destinationName.toLowerCase().includes(search) ||
        hotel.address.toLowerCase().includes(search);

      const matchesPrice = hotel.pricePerNightBDT <= maxPriceBDT;
      const matchesRating = hotel.rating >= minRating;
      const matchesAmenities = selectedAmenities.every((amenity) =>
        hotel.amenities.includes(amenity)
      );

      return (
        matchesDistrict &&
        matchesSearch &&
        matchesPrice &&
        matchesRating &&
        matchesAmenities
      );
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.pricePerNightBDT - b.pricePerNightBDT;
        case 'price-high':
          return b.pricePerNightBDT - a.pricePerNightBDT;
        case 'rating':
          return b.rating - a.rating;
        default:
          return b.rating - a.rating;
      }
    });
  }, [
    hotels,
    hotelSearch,
    selectedDistrict,
    maxPriceBDT,
    minRating,
    selectedAmenities,
    sortBy,
  ]);

  const popularDestinations = [
    "Cox's Bazar",
    'Bandarban',
    'Rangamati',
    'Chattogram City',
  ];

  const activeFilterCount =
    (selectedDistrict !== 'All' ? 1 : 0) +
    (maxPriceBDT < 20000 ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    selectedAmenities.length;

  return (
    <div className="min-h-full bg-slate-100 pb-24 font-sans text-slate-900">

      {/* =========================================================
          HERO SECTION
      ========================================================== */}
      <section className="relative overflow-hidden rounded-b-[2.5rem] bg-slate-950 text-white">
        <div className="absolute inset-0">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-teal-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300">
              <Sparkles className="h-3.5 w-3.5" />
              Stay somewhere unforgettable
            </div>

            <h1 className="max-w-2xl text-4xl font-black tracking-tight sm:text-6xl text-white">
              Find your perfect{' '}
              <span className="block text-emerald-400">
                place to stay.
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              From peaceful hill retreats in Bandarban to beachfront
              resorts in Cox's Bazar, discover stays that make your
              journey even better.
            </p>
          </div>

          {/* Main Search Box */}
          <div className="mt-8 max-w-4xl rounded-3xl bg-white p-2 shadow-2xl sm:p-3">
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={hotelSearch}
                  onChange={(e) => setHotelSearch(e.target.value)}
                  placeholder="Where do you want to stay?"
                  className="h-14 w-full rounded-2xl bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                onClick={() =>
                  document
                    .getElementById('hotel-results')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                className="h-14 rounded-2xl bg-emerald-600 px-7 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500 active:scale-[0.98]"
              >
                Search stays
              </button>
            </div>
          </div>

          {/* Popular destination chips */}
          <div className="mt-6">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Popular destinations
            </p>

            <div className="flex flex-wrap gap-2">
              {popularDestinations.map((destination) => (
                <button
                  key={destination}
                  onClick={() => {
                    setSelectedDistrict(destination);
                    document
                      .getElementById('hotel-results')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                    selectedDistrict === destination
                      ? 'border-emerald-400 bg-emerald-400 text-slate-950'
                      : 'border-white/10 bg-white/5 text-slate-200 hover:border-emerald-400/40 hover:bg-white/10'
                  }`}
                >
                  {destination}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          TRUST / BENEFITS
      ========================================================== */}
      <section className="mx-auto max-w-7xl px-5 pt-8 sm:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="rounded-xl bg-emerald-50 p-2.5">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Trusted stays</p>
              <p className="mt-0.5 text-[10px] text-slate-500">Carefully selected accommodations</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="rounded-xl bg-blue-50 p-2.5">
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Great locations</p>
              <p className="mt-0.5 text-[10px] text-slate-500">Close to popular attractions</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="rounded-xl bg-amber-50 p-2.5">
              <Star className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Highly rated</p>
              <p className="mt-0.5 text-[10px] text-slate-500">Loved by fellow travelers</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          RESULTS AREA
      ========================================================== */}
      <section id="hotel-results" className="mx-auto max-w-7xl px-5 pt-10 sm:px-8">
        {/* Results Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">
              Accommodation
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Places you'll love to stay
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {filteredHotels.length} stays available for your trip
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile Filters Trigger */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="relative flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm lg:hidden hover:bg-slate-50"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1 text-[9px] text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative flex items-center rounded-xl border border-slate-200 bg-white shadow-sm">
              <ArrowUpDown className="ml-3 h-3.5 w-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none bg-transparent py-2.5 pl-2 pr-8 text-xs font-semibold text-slate-700 outline-none cursor-pointer"
              >
                <option value="recommended">Recommended</option>
                <option value="rating">Top rated</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">

          {/* =====================================================
              DESKTOP FILTER SIDEBAR
          ====================================================== */}
          <aside className="hidden h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:block">
            <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-emerald-600" />
                <h3 className="text-xs font-bold text-slate-900">
                  Filter stays
                </h3>
              </div>

              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700"
                >
                  Reset
                </button>
              )}
            </div>

            {/* District */}
            <div className="border-b border-slate-100 pb-5">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Destination
              </p>
              <div className="space-y-1">
                {districts.map((district) => (
                  <button
                    key={district}
                    onClick={() => setSelectedDistrict(district)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition ${
                      selectedDistrict === district
                        ? 'bg-emerald-500 font-bold text-white'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{district}</span>
                    {selectedDistrict === district && (
                      <Check className="h-3.5 w-3.5 text-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="border-b border-slate-100 py-5">
              <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Price per night
              </p>
              <p className="mb-3 text-sm font-black text-slate-900">
                Up to {formatCost(maxPriceBDT)}
              </p>
              <input
                type="range"
                min="2000"
                max="20000"
                step="1000"
                value={maxPriceBDT}
                onChange={(e) => setMaxPriceBDT(Number(e.target.value))}
                className="w-full cursor-pointer accent-emerald-600"
              />
              <div className="mt-2 flex justify-between text-[9px] text-slate-400">
                <span>{formatCost(2000)}</span>
                <span>{formatCost(20000)}</span>
              </div>
            </div>

            {/* Guest Rating */}
            <div className="border-b border-slate-100 py-5">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Guest rating
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[0, 4, 4.5, 4.8].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(rating)}
                    className={`flex items-center justify-center gap-1 rounded-xl px-2 py-2 text-[10px] font-bold transition ${
                      minRating === rating
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {rating === 0 ? (
                      'Any rating'
                    ) : (
                      <>
                        {rating}+
                        <Star className="h-2.5 w-2.5 fill-current" />
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="pt-5">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Amenities
              </p>
              <div className="space-y-2.5">
                {amenityOptions.map((amenity) => (
                  <label
                    key={amenity}
                    className="flex cursor-pointer items-start gap-2 text-[11px] text-slate-600 hover:text-slate-900"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                      className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* =====================================================
              HOTEL GRID
          ====================================================== */}
          <div>
            {filteredHotels.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {filteredHotels.map((hotel, index) => {
                  const isComparing = selectedHotelsForCompare.some(
                    (item) => item.id === hotel.id
                  );
                  const isFavorite = favorites.includes(hotel.id);
                  const badge =
                    index === 0
                      ? 'Best choice'
                      : hotel.rating >= 4.8
                      ? 'Top rated'
                      : hotel.pricePerNightBDT <= 5000
                      ? 'Great value'
                      : null;

                  return (
                    <article
                      key={hotel.id}
                      className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      {/* Image Block */}
                      <div
                        className="relative h-56 cursor-pointer overflow-hidden"
                        onClick={() => onSelectHotel(hotel)}
                      >
                        <img
                          src={hotel.image}
                          alt={hotel.name}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                        {badge && (
                          <div className="absolute left-3 top-3 rounded-md bg-slate-900/90 backdrop-blur-md px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-white shadow">
                            {badge}
                          </div>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(hotel.id);
                          }}
                          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow backdrop-blur transition hover:bg-white"
                          aria-label="Save hotel"
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              isFavorite ? 'fill-red-500 text-red-500' : ''
                            }`}
                          />
                        </button>

                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white">
                          <div className="flex items-center gap-1 rounded-lg bg-slate-950/80 px-2 py-1 backdrop-blur">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span className="text-[11px] font-black">{hotel.rating}</span>
                          </div>
                          <span className="text-[10px] font-medium text-white/90">
                            Excellent stay
                          </span>
                        </div>
                      </div>

                      {/* Content Details */}
                      <div className="flex flex-1 flex-col justify-between p-5">
                        <div>
                          <h3
                            onClick={() => onSelectHotel(hotel)}
                            className="cursor-pointer text-lg font-bold leading-tight text-slate-900 transition hover:text-emerald-600"
                          >
                            {hotel.name}
                          </h3>

                          <p className="mt-1.5 flex items-center gap-1 text-xs text-slate-500">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                            <span className="line-clamp-1">{hotel.address}</span>
                          </p>

                          {/* Amenity Pills */}
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                              <span
                                key={idx}
                                className="rounded-md bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-600"
                              >
                                {amenity}
                              </span>
                            ))}

                            {hotel.amenities.length > 3 && (
                              <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-400">
                                +{hotel.amenities.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Card Footer: Pricing & Actions */}
                        <div className="mt-5 flex items-end justify-between border-t border-slate-100 pt-4">
                          <div>
                            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                              From
                            </p>
                            <div className="mt-0.5 flex items-baseline gap-1">
                              <span className="text-xl font-extrabold text-slate-900">
                                {formatCost(hotel.pricePerNightBDT)}
                              </span>
                              <span className="text-[10px] text-slate-500">/ night</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleCompareHotel(hotel)}
                              className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                                isComparing
                                  ? 'border-slate-800 bg-slate-800 text-white'
                                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              {isComparing ? '✓ Compared' : '+ Compare'}
                            </button>

                            <button
                              onClick={() => onSelectHotel(hotel)}
                              className="flex items-center gap-1 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-500"
                            >
                              View stay
                              <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              /* Empty State */
              <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
                  <HotelIcon className="h-8 w-8 text-emerald-500" />
                </div>
                <h3 className="text-lg font-black text-slate-900">No stays found</h3>
                <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-500">
                  We couldn't find accommodations matching your current search and filters. Try expanding your options.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================
          MOBILE FILTER DRAWER
      ========================================================== */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={() => setShowMobileFilters(false)}
          />

          <div className="absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl text-slate-900">
            <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900">Filter stays</h3>
                <p className="mt-1 text-[10px] text-slate-500">Refine your perfect accommodation</p>
              </div>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Mobile Destination */}
            <div className="mb-6">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Destination
              </p>
              <div className="flex flex-wrap gap-2">
                {districts.map((district) => (
                  <button
                    key={district}
                    onClick={() => setSelectedDistrict(district)}
                    className={`rounded-xl px-3 py-2 text-[10px] font-bold ${
                      selectedDistrict === district
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {district}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Price */}
            <div className="mb-6">
              <div className="mb-3 flex justify-between">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Maximum price
                </p>
                <span className="text-xs font-black text-emerald-700">
                  {formatCost(maxPriceBDT)}
                </span>
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

            {/* Mobile Rating */}
            <div className="mb-6">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Minimum rating
              </p>
              <div className="grid grid-cols-4 gap-2">
                {[0, 4, 4.5, 4.8].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(rating)}
                    className={`rounded-xl py-2 text-[10px] font-bold ${
                      minRating === rating
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {rating === 0 ? 'Any' : `${rating}+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Amenities */}
            <div className="mb-6">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Amenities
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {amenityOptions.map((amenity) => (
                  <label
                    key={amenity}
                    className="flex cursor-pointer items-center gap-2 text-xs text-slate-700"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Drawer Actions */}
            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={resetFilters}
                className="flex-1 rounded-xl border border-slate-300 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Reset filters
              </button>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="flex-1 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white hover:bg-emerald-500"
              >
                Show {filteredHotels.length} stays
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
