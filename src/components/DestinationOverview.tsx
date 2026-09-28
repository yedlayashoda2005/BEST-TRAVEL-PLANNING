import React from 'react';
import {
  Calendar,
  Clock,
  Car,
  Utensils,
  MapPin,
  CheckCircle2,
  Compass,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';

export const DestinationOverview: React.FC = () => {
  const {
    destinations,
    selectedDestination,
    selectDestination,
    searchParams,
    setActiveTab,
  } = useTravel();

  const pref = searchParams.preference;
  const foodCost = selectedDestination.approxDailyFoodCostPerPerson[pref];
  const transitCost = selectedDestination.approxDailyTransitCost[pref];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
      {/* Top Destination Selector Carousel */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
            <Compass className="w-4 h-4" />
            <span>Explore Destinations</span>
          </h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Switch between tourist hot spots to inspect costs, climate, and highlights
          </p>
        </div>

        {/* Destination Quick Selector Chips */}
        <div className="flex flex-wrap gap-2">
          {destinations.map((dest) => (
            <button
              key={dest.id}
              onClick={() => selectDestination(dest.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                dest.id === selectedDestination.id
                  ? 'bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>{dest.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Destination Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        {/* Left: Destination Photo Card */}
        <div className="lg:col-span-5 relative group rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 aspect-4/3 lg:aspect-auto lg:h-[380px]">
          <img
            src={selectedDestination.heroImage}
            alt={selectedDestination.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-amber-500 text-slate-950 mb-1.5">
              {selectedDestination.state}
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight">
              {selectedDestination.name}
            </h3>
            <p className="text-xs text-slate-200 line-clamp-1">{selectedDestination.tagline}</p>
          </div>
        </div>

        {/* Right: Key Details & Cost Estimation */}
        <div className="lg:col-span-7 space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                Destination Profile
              </span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="text-xs text-slate-500 font-medium">Verified Tourist Guide</span>
            </div>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
              {selectedDestination.description}
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Ideal Days */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Ideal Duration</span>
              </div>
              <p className="text-base font-extrabold text-slate-900 dark:text-white">
                {selectedDestination.idealDays} Days
              </p>
              <p className="text-[11px] text-slate-500">Recommended for full tour</p>
            </div>

            {/* Food Cost */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-amber-500 mb-1">
                <Utensils className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Food Estimate</span>
              </div>
              <p className="text-base font-extrabold text-slate-900 dark:text-white">
                ₹{foodCost.toLocaleString('en-IN')}{' '}
                <span className="text-xs font-normal text-slate-500">/day/person</span>
              </p>
              <p className="text-[11px] text-slate-500 capitalize">{pref} dining</p>
            </div>

            {/* Transit Cost */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
                <Car className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Local Transit</span>
              </div>
              <p className="text-base font-extrabold text-slate-900 dark:text-white">
                ₹{transitCost.toLocaleString('en-IN')}{' '}
                <span className="text-xs font-normal text-slate-500">/day</span>
              </p>
              <p className="text-[11px] text-slate-500 capitalize">{pref} tier</p>
            </div>
          </div>

          {/* Best Time to Visit */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/40 dark:to-indigo-950/30 border border-sky-100 dark:border-sky-900/50 flex items-start gap-3">
            <Calendar className="w-5 h-5 text-sky-600 dark:text-sky-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300">
                Best Season to Visit
              </p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {selectedDestination.bestTimeToVisit}
              </p>
            </div>
          </div>

          {/* Popular Attractions Preview Chips */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>Featured Attractions ({selectedDestination.popularAttractions.length})</span>
              </span>
              <button
                onClick={() => setActiveTab('attractions')}
                className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
              >
                <span>View All & Select</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {selectedDestination.popularAttractions.map((att) => (
                <span
                  key={att.id}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span>{att.name}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Famous Foods Pill tags */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400 mr-2 font-medium">
              Must-Taste Local Foods:
            </span>
            <div className="inline-flex flex-wrap gap-1.5 mt-1">
              {selectedDestination.famousFoods.map((food) => (
                <span
                  key={food}
                  className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60"
                >
                  {food}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
