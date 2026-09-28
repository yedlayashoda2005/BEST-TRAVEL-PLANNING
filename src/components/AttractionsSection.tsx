import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Ticket,
  Heart,
  Check,
  Plus,
  Compass,
  Building,
  Info,
  Sparkles,
  Search,
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';
import { calculateDistanceKm } from '../utils/travelCalculations';

export const AttractionsSection: React.FC = () => {
  const {
    selectedDestination,
    selectedAttractionIds,
    toggleAttraction,
    selectAllAttractions,
    clearAttractions,
    favoriteAttractionIds,
    toggleFavoriteAttraction,
    selectedHotelId,
  } = useTravel();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Find selected hotel for live distance calculations
  const selectedHotel = selectedDestination.hotels.find((h) => h.id === selectedHotelId);

  const categories = [
    'All',
    ...Array.from(new Set(selectedDestination.popularAttractions.map((a) => a.category))),
  ];

  const filteredAttractions = selectedDestination.popularAttractions.filter((att) => {
    const matchesCategory = activeCategory === 'All' || att.category === activeCategory;
    const matchesSearch =
      att.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      att.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      att.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="attractions-section" className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
              <MapPin className="w-4 h-4" />
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Tourist Places in {selectedDestination.name}
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Select the places you want to visit. Our smart planner clusters them into your daily itinerary and measures distance to your hotel.
          </p>
        </div>

        {/* Action Buttons: Select All / Clear */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={selectAllAttractions}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            Select All ({selectedDestination.popularAttractions.length})
          </button>
          <button
            onClick={clearAttractions}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            Reset
          </button>
          <span className="text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2.5 py-1.5 rounded-xl border border-sky-200 dark:border-sky-800">
            {selectedAttractionIds.length} Selected
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search attractions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Attractions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAttractions.map((att) => {
          const isSelected = selectedAttractionIds.includes(att.id);
          const isFavorite = favoriteAttractionIds.includes(att.id);

          // Calculate distance from currently selected hotel
          let distanceText = 'Select a hotel to see distance';
          if (selectedHotel) {
            const dist = calculateDistanceKm(
              selectedHotel.coordinates.lat,
              selectedHotel.coordinates.lng,
              att.coordinates.lat,
              att.coordinates.lng
            );
            distanceText = `${dist} km from ${selectedHotel.name}`;
          }

          return (
            <div
              key={att.id}
              className={`group flex flex-col justify-between rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border transition-all duration-300 ${
                isSelected
                  ? 'border-sky-500 shadow-md shadow-sky-500/10 ring-2 ring-sky-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
              }`}
            >
              {/* Card Image Header */}
              <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={att.image}
                  alt={att.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/90 text-slate-800 backdrop-blur-xs shadow-xs">
                    {att.category}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 shadow-xs">
                    ★ {att.rating}
                  </span>
                </div>

                {/* Favorite Heart Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavoriteAttraction(att.id);
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs text-slate-700 dark:text-slate-200 hover:text-rose-500 hover:scale-110 transition shadow-xs"
                  aria-label="Add to favorites"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-600'
                    }`}
                  />
                </button>

                {/* Bottom title on image */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-heading font-extrabold text-lg leading-snug drop-shadow-sm">
                    {att.name}
                  </h3>
                  <p className="text-xs text-slate-200 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-sky-400 shrink-0" />
                    <span className="truncate">{att.location}</span>
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                  {att.description}
                </p>

                {/* Key Visiting Info */}
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                    <span>~{att.approxDurationHours} hrs visit</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                    <Ticket className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>
                      {att.entryFee === 0 ? (
                        <span className="text-emerald-600 font-bold">Free Entry</span>
                      ) : (
                        `₹${att.entryFee.toLocaleString('en-IN')} entry`
                      )}
                    </span>
                  </div>
                </div>

                {/* Opening Hours Info */}
                <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{att.openingHours}</span>
                </div>

                {/* Distance from Selected Hotel */}
                <div className="text-[11px] font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span className="truncate">{distanceText}</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {att.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Select / Deselect Button */}
                <button
                  type="button"
                  onClick={() => toggleAttraction(att.id)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                    isSelected
                      ? 'bg-sky-600 text-white hover:bg-sky-700'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Added to Itinerary</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 text-sky-500" />
                      <span>Add to Trip Plan</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
