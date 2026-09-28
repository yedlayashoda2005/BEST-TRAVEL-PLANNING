import React, { useState, useMemo } from 'react';
import {
  Hotel as HotelIcon,
  Star,
  MapPin,
  Coffee,
  ShieldCheck,
  Check,
  Compass,
  ArrowUpDown,
  Filter,
  Eye,
  Layers,
  Sparkles,
  Users,
  X,
  Wifi,
  Waves,
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';
import { Hotel } from '../types/travel';
import { calculateHotelProximityScore, getTripDuration } from '../utils/travelCalculations';

export const HotelSection: React.FC = () => {
  const {
    selectedDestination,
    selectedAttractionIds,
    searchParams,
    selectedHotelId,
    setSelectedHotelId,
    comparedHotelIds,
    toggleCompareHotel,
    openCompareModal,
    showToast,
  } = useTravel();

  // Filters & sorting state
  const [sortBy, setSortBy] = useState<'proximity' | 'price' | 'rating'>('proximity');
  const [minRating, setMinRating] = useState<number>(0);
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [breakfastOnly, setBreakfastOnly] = useState(false);
  const [freeCancelOnly, setFreeCancelOnly] = useState(false);

  // Quick modal for "View Hotel"
  const [viewingHotel, setViewingHotel] = useState<Hotel | null>(null);

  const duration = getTripDuration(searchParams.startDate, searchParams.endDate);
  const nights = duration.nights;

  // Selected attractions objects
  const selectedAttractions = useMemo(() => {
    return selectedDestination.popularAttractions.filter((a) =>
      selectedAttractionIds.includes(a.id)
    );
  }, [selectedDestination, selectedAttractionIds]);

  // Compute proximity score for each hotel
  const hotelsWithScores = useMemo(() => {
    return selectedDestination.hotels.map((h) => {
      const proximity = calculateHotelProximityScore(h, selectedAttractions);
      return {
        ...h,
        averageDistanceToAttractionsKm: proximity.averageDistanceKm,
        closestAttractionName: proximity.closestAttractionName,
        closestDistanceKm: proximity.closestDistanceKm,
      };
    });
  }, [selectedDestination.hotels, selectedAttractions]);

  // Filter & sort
  const filteredHotels = useMemo(() => {
    let list = [...hotelsWithScores];

    if (minRating > 0) {
      list = list.filter((h) => h.rating >= minRating);
    }

    if (typeFilter !== 'All') {
      list = list.filter((h) => h.type === typeFilter);
    }

    if (breakfastOnly) {
      list = list.filter((h) => h.breakfastIncluded);
    }

    if (freeCancelOnly) {
      list = list.filter((h) => h.freeCancellation);
    }

    if (sortBy === 'proximity') {
      // Prioritize hotels that are closest to user's selected attractions!
      list.sort((a, b) => a.averageDistanceToAttractionsKm - b.averageDistanceToAttractionsKm);
    } else if (sortBy === 'price') {
      list.sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [hotelsWithScores, minRating, typeFilter, breakfastOnly, freeCancelOnly, sortBy]);

  const hotelTypes = ['All', ...Array.from(new Set(selectedDestination.hotels.map((h) => h.type)))];

  return (
    <section id="hotels-section" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
              <HotelIcon className="w-4 h-4" />
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Hotels & Accommodation
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1.5 flex-wrap">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Attraction Proximity Matching Active:</span>
            </span>
            <span>Hotels are ordered based on closeness to your {selectedAttractions.length} selected tourist spots.</span>
          </p>
        </div>

        {/* Compare Hotels Button */}
        {comparedHotelIds.length > 0 && (
          <button
            onClick={() => openCompareModal('hotel')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 text-white hover:bg-sky-700 flex items-center gap-2 shadow-md transition self-start md:self-auto"
          >
            <Layers className="w-4 h-4" />
            <span>Compare ({comparedHotelIds.length}/3)</span>
          </button>
        )}
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        {/* Top Controls: Sort selection */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort By:</span>
            </span>

            <button
              onClick={() => setSortBy('proximity')}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                sortBy === 'proximity'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Closest to Selected Attractions</span>
            </button>

            <button
              onClick={() => setSortBy('price')}
              className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition ${
                sortBy === 'price'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Price: Low to High
            </button>

            <button
              onClick={() => setSortBy('rating')}
              className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition ${
                sortBy === 'rating'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Guest Rating
            </button>
          </div>

          <span className="text-xs text-slate-500 font-medium">
            {filteredHotels.length} accommodations available
          </span>
        </div>

        {/* Bottom Controls: Hotel Type & Amenities */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Type Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-500 font-medium">Type:</span>
            {hotelTypes.map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-2.5 py-1 rounded-lg transition font-medium ${
                  typeFilter === type
                    ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Quick Checkbox Amenities */}
          <div className="flex items-center gap-4 flex-wrap">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300 select-none">
              <input
                type="checkbox"
                checked={breakfastOnly}
                onChange={(e) => setBreakfastOnly(e.target.checked)}
                className="rounded text-sky-600 focus:ring-sky-500"
              />
              <span className="font-medium">Breakfast Included</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300 select-none">
              <input
                type="checkbox"
                checked={freeCancelOnly}
                onChange={(e) => setFreeCancelOnly(e.target.checked)}
                className="rounded text-sky-600 focus:ring-sky-500"
              />
              <span className="font-medium">Free Cancellation</span>
            </label>
          </div>
        </div>
      </div>

      {/* Hotels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHotels.map((hotel) => {
          const isSelected = selectedHotelId === hotel.id;
          const isCompared = comparedHotelIds.includes(hotel.id);
          const totalStayCost = hotel.pricePerNight * nights;

          return (
            <div
              key={hotel.id}
              className={`group flex flex-col justify-between rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border transition-all duration-300 ${
                isSelected
                  ? 'border-emerald-500 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
              }`}
            >
              {/* Image & Badges */}
              <div className="relative h-52 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                {/* Top Type & Rating */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/95 text-slate-800 backdrop-blur-xs shadow-xs">
                    {hotel.type}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-600 text-white shadow-xs flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{hotel.rating}</span>
                  </span>
                </div>

                {/* Free Cancellation Badge */}
                {hotel.freeCancellation && (
                  <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/90 text-white backdrop-blur-xs shadow-xs">
                    Free Cancellation
                  </span>
                )}

                {/* Proximity Highlight Pill directly on image */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs border border-white/20 text-[11px] font-bold text-amber-300 mb-1">
                    <Compass className="w-3 h-3" />
                    <span>{hotel.averageDistanceToAttractionsKm} km avg to your sights</span>
                  </div>
                  <h3 className="font-heading font-extrabold text-lg leading-snug drop-shadow-sm truncate">
                    {hotel.name}
                  </h3>
                </div>
              </div>

              {/* Card Details Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{hotel.address}</span>
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {hotel.description}
                  </p>
                </div>

                {/* Key Proximity Metrics Highlight (Requirement 5) */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-[11px] space-y-1.5">
                  <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-300">
                    <span className="text-slate-500">Closest Selected Spot:</span>
                    <span className="text-sky-600 dark:text-sky-400 truncate max-w-[150px]">
                      {hotel.closestAttractionName} ({hotel.closestDistanceKm} km)
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>From City Center:</span>
                    <span>{hotel.cityCenterDistanceKm} km</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Guest Capacity:</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> Up to {hotel.maxGuests} guests
                    </span>
                  </div>
                </div>

                {/* Facilities & Breakfast */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    {hotel.breakfastIncluded ? (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <Coffee className="w-3.5 h-3.5" /> Breakfast Included
                      </span>
                    ) : (
                      <span className="text-slate-400 flex items-center gap-1">
                        <Coffee className="w-3.5 h-3.5" /> Breakfast not included
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {hotel.facilities.slice(0, 3).map((f) => (
                      <span
                        key={f}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      >
                        {f}
                      </span>
                    ))}
                    {hotel.facilities.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 text-slate-400 font-medium">
                        +{hotel.facilities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Pricing Box */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Estimated Rate
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white">
                        ₹{hotel.pricePerNight.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-500">/ night</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      ₹{totalStayCost.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      for {nights} night{nights > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Actions: View Hotel & Select Hotel */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setViewingHotel(hotel)}
                    className="py-2.5 px-3 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Hotel</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedHotelId(hotel.id);
                      showToast(`Selected hotel: ${hotel.name}`);
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                        : 'bg-sky-600 hover:bg-sky-700 text-white'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Selected</span>
                      </>
                    ) : (
                      <span>Select Hotel</span>
                    )}
                  </button>
                </div>

                {/* Compare Checkbox */}
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => toggleCompareHotel(hotel.id)}
                    className={`text-[11px] font-medium transition ${
                      isCompared
                        ? 'text-sky-600 dark:text-sky-400 font-bold'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {isCompared ? '✓ Added to Compare' : '+ Add to Compare'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: View Hotel Details */}
      {viewingHotel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 p-6 relative">
            <button
              onClick={() => setViewingHotel(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="rounded-2xl overflow-hidden h-64 mb-5 relative">
              <img
                src={viewingHotel.image}
                alt={viewingHotel.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-white text-slate-900 shadow">
                  ★ {viewingHotel.rating} ({viewingHotel.reviewCount} Reviews)
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-sky-600 text-white shadow">
                  {viewingHotel.type}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white">
                  {viewingHotel.name}
                </h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{viewingHotel.address}</span>
                </p>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {viewingHotel.description}
              </p>

              {/* All Facilities */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Amenities & Facilities
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {viewingHotel.facilities.map((fac) => (
                    <div
                      key={fac}
                      className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{fac}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-sky-800 dark:text-sky-300 font-medium">
                    Estimated Total for {nights} Nights:
                  </span>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    ₹{(viewingHotel.pricePerNight * nights).toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] text-slate-500">
                    ₹{viewingHotel.pricePerNight.toLocaleString('en-IN')} / night
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedHotelId(viewingHotel.id);
                    setViewingHotel(null);
                    showToast(`Selected hotel: ${viewingHotel.name}`);
                  }}
                  className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md"
                >
                  Select This Hotel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
