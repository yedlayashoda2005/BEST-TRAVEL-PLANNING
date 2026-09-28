import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  RefreshCw,
  Bookmark,
  Share2,
  CheckCircle2,
  Building,
  Plane,
  Utensils,
  Camera,
  Coffee,
  ShoppingBag,
  Car,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';
import { ItineraryActivity } from '../types/travel';
import { getTripDuration } from '../utils/travelCalculations';

export const ItineraryBuilder: React.FC = () => {
  const {
    selectedDestination,
    selectedHotelId,
    selectedFlightId,
    searchParams,
    itinerary,
    regenerateCustomItinerary,
    saveCurrentTrip,
    selectedAttractionIds,
    setActiveTab,
    showToast,
  } = useTravel();

  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [isSaving, setIsSaving] = useState(false);
  const [customTitle, setCustomTitle] = useState('');

  const selectedHotel = selectedDestination.hotels.find((h) => h.id === selectedHotelId);
  const selectedFlight = selectedDestination.flights.find((f) => f.id === selectedFlightId);
  const duration = getTripDuration(searchParams.startDate, searchParams.endDate);

  const getActivityIcon = (type: ItineraryActivity['type']) => {
    switch (type) {
      case 'transit':
        return <Plane className="w-4 h-4 text-indigo-500" />;
      case 'checkin':
      case 'checkout':
        return <Building className="w-4 h-4 text-sky-500" />;
      case 'meal':
        return <Utensils className="w-4 h-4 text-amber-500" />;
      case 'sightseeing':
        return <Camera className="w-4 h-4 text-emerald-500" />;
      case 'leisure':
        return <Coffee className="w-4 h-4 text-purple-500" />;
      default:
        return <MapPin className="w-4 h-4 text-slate-500" />;
    }
  };

  const handleSaveTrip = () => {
    setIsSaving(true);
    const title = customTitle.trim() || `${selectedDestination.name} ${duration.days}-Day Getaway`;
    saveCurrentTrip(title);
    setTimeout(() => {
      setIsSaving(false);
      setActiveTab('my-trips');
    }, 400);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Trip itinerary share link copied to clipboard!');
    } else {
      showToast('Itinerary ready for sharing!');
    }
  };

  return (
    <section id="itinerary-builder" className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Day-by-Day Travel Itinerary
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Intelligently clustered by proximity to your selected hotel ({selectedHotel?.name || 'Selected stay'}) and opening hours.
          </p>
        </div>

        {/* Action Buttons: Regenerate & Save */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <button
            onClick={regenerateCustomItinerary}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-sky-500" />
            <span>Re-optimize Schedule</span>
          </button>

          <button
            onClick={handleShare}
            className="px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          <button
            onClick={handleSaveTrip}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save to My Trips'}</span>
          </button>
        </div>
      </div>

      {/* Summary Banner */}
      <div className="bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-emerald-500/10 border border-sky-200 dark:border-sky-900/60 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-sm">
            {duration.days}D
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white">
              {duration.days}-Day Personalized Itinerary for {selectedDestination.name}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Covers {selectedAttractionIds.length} attractions • Base Hotel: {selectedHotel?.name} • Flight: {selectedFlight?.airline || 'Flexible'}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-slate-500 block">Date Range</span>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            {searchParams.startDate} → {searchParams.endDate}
          </span>
        </div>
      </div>

      {/* Days Timeline Accordion / Cards */}
      <div className="space-y-4">
        {itinerary.map((day) => {
          const isExpanded = expandedDay === day.dayNumber;

          return (
            <div
              key={day.dayNumber}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-all"
            >
              {/* Day Header Accordion Toggle */}
              <div
                onClick={() => setExpandedDay(isExpanded ? null : day.dayNumber)}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition select-none"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white flex items-center justify-center font-extrabold text-sm border border-slate-200 dark:border-slate-700">
                    D{day.dayNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                        Day {day.dayNumber}: {day.theme}
                      </h3>
                      <span className="text-xs text-slate-400 font-medium hidden sm:inline">•</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
                        {day.date}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {day.activities.length} planned activities & meal breaks
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-sky-600 dark:text-sky-400">
                    {isExpanded ? 'Collapse' : 'Expand'}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Day Activities Timeline */}
              {isExpanded && (
                <div className="px-5 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2 sm:before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                    {day.activities.map((act, index) => {
                      return (
                        <div key={act.id || index} className="relative group">
                          {/* Dot / Icon on timeline */}
                          <div className="absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-2 border-sky-500 flex items-center justify-center shadow-xs">
                            <span className="w-2 h-2 rounded-full bg-sky-500" />
                          </div>

                          {/* Content Block */}
                          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1.5 hover:border-slate-300 dark:hover:border-slate-700 transition">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                              <div className="flex items-center gap-2">
                                <span className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xs">
                                  {getActivityIcon(act.type)}
                                </span>
                                <h4 className="font-heading font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                                  {act.title}
                                </h4>
                              </div>

                              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 self-start sm:self-auto">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span>{act.time}</span>
                              </span>
                            </div>

                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                              {act.description}
                            </p>

                            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-500">
                              {act.location && (
                                <span className="flex items-center gap-1 font-medium text-slate-600 dark:text-slate-400">
                                  <MapPin className="w-3 h-3 text-rose-500" />
                                  <span>{act.location}</span>
                                </span>
                              )}

                              {act.estimatedCost !== undefined && (
                                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                  {act.estimatedCost === 0 ? 'Free Entry' : `Est. Fee: ₹${act.estimatedCost}`}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
