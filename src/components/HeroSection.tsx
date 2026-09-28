import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Users,
  Wallet,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  Compass,
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';
import { POPULAR_CITIES } from '../data/destinations';
import { TravelPreference } from '../types/travel';
import { getTripDuration } from '../utils/travelCalculations';

export const HeroSection: React.FC = () => {
  const {
    destinations,
    selectedDestination,
    selectDestination,
    searchParams,
    updateSearchParam,
    setActiveTab,
  } = useTravel();

  const [destinationSearch, setDestinationSearch] = useState('');
  const duration = getTripDuration(searchParams.startDate, searchParams.endDate);

  const filteredDestinations = destinations.filter(
    (d) =>
      d.name.toLowerCase().includes(destinationSearch.toLowerCase()) ||
      d.state.toLowerCase().includes(destinationSearch.toLowerCase())
  );

  const handlePlanMyTrip = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveTab('plan');
    const targetElement = document.getElementById('planning-workspace');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const budgetPresets = [15000, 30000, 50000, 75000, 100000];

  return (
    <section className="relative overflow-hidden bg-slate-900 text-white min-h-[640px] flex items-center justify-center py-16 lg:py-24">
      {/* Background Imagery with cinematic overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={selectedDestination.heroImage}
          alt={selectedDestination.name}
          className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000 ease-out filter brightness-[0.45] contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-900/40" />
        <div className="absolute inset-0 bg-radial from-transparent via-slate-950/40 to-slate-950/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header Titles */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sky-300 text-xs font-semibold mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI-Optimized Multi-City Travel Planner</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-4">
            Plan Your Perfect Trip <br />
            <span className="bg-gradient-to-r from-sky-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent">
              Within Your Budget
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Discover curated tourist spots, compare estimated flights & nearby hotels, balance expenses in real-time, and get a tailored day-by-day itinerary in seconds.
          </p>

          {/* Quick Destination Pill Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
            <span className="text-xs text-slate-400 font-medium mr-1">Trending:</span>
            {destinations.map((dest) => (
              <button
                key={dest.id}
                onClick={() => selectDestination(dest.id)}
                className={`text-xs px-3 py-1 rounded-full transition-all font-medium border ${
                  dest.id === selectedDestination.id
                    ? 'bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-500/30'
                    : 'bg-white/10 hover:bg-white/20 text-slate-200 border-white/10'
                }`}
              >
                {dest.name}
              </button>
            ))}
          </div>
        </div>

        {/* Unified Search / Planning Form Card */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-800 p-5 sm:p-7 text-slate-900 dark:text-slate-100 max-w-5xl mx-auto transition-all">
          <form onSubmit={handlePlanMyTrip} className="space-y-5">
            {/* Grid 1: Destination & Starting City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Destination Input / Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <span>Tourist Destination</span>
                </label>
                <div className="relative">
                  <select
                    value={searchParams.destinationId}
                    onChange={(e) => selectDestination(e.target.value)}
                    className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all cursor-pointer shadow-xs"
                  >
                    {filteredDestinations.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}, {d.state} ({d.idealDays} Days suggested)
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Selected: <span className="font-semibold text-sky-600 dark:text-sky-400">{selectedDestination.name}</span> — {selectedDestination.tagline}
                </p>
              </div>

              {/* Starting City */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Starting City (Origin)</span>
                </label>
                <select
                  value={searchParams.startingCity}
                  onChange={(e) => updateSearchParam('startingCity', e.target.value)}
                  className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all cursor-pointer shadow-xs"
                >
                  {POPULAR_CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Connecting directly with major Indian airport hubs
                </p>
              </div>
            </div>

            {/* Grid 2: Travel Dates, Travelers, Preference */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Start Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  <span>Departure Date</span>
                </label>
                <input
                  type="date"
                  value={searchParams.startDate}
                  onChange={(e) => updateSearchParam('startDate', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  <span>Return Date</span>
                </label>
                <input
                  type="date"
                  value={searchParams.endDate}
                  min={searchParams.startDate}
                  onChange={(e) => updateSearchParam('endDate', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                  {duration.days} Days / {duration.nights} Nights
                </span>
              </div>

              {/* Number of Travelers */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Travelers</span>
                </label>
                <select
                  value={searchParams.travelers}
                  onChange={(e) => updateSearchParam('travelers', parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value={1}>1 Solo Explorer</option>
                  <option value={2}>2 Adults (Couple/Pair)</option>
                  <option value={3}>3 People (Friends/Family)</option>
                  <option value={4}>4 People (Family Group)</option>
                  <option value={5}>5+ People (Group)</option>
                </select>
              </div>

              {/* Travel Preference: Budget / Standard / Premium */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                  <span>Travel Style</span>
                </label>
                <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  {(['Budget', 'Standard', 'Premium'] as TravelPreference[]).map((pref) => (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => updateSearchParam('preference', pref)}
                      className={`text-xs py-1.5 rounded-lg font-medium transition-all ${
                        searchParams.preference === pref
                          ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 font-bold shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Grid 3: Total Trip Budget & Presets */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Total Trip Budget (INR)</span>
                  </label>
                  <p className="text-[11px] text-slate-500">
                    We will automatically split this across flights, stay, food, sights, & transit
                  </p>
                </div>

                {/* Quick Budget Chips */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Presets:</span>
                  {budgetPresets.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => updateSearchParam('budget', val)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition font-medium ${
                        searchParams.budget === val
                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      ₹{val.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5 text-slate-500 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    min={5000}
                    step={1000}
                    value={searchParams.budget}
                    onChange={(e) => updateSearchParam('budget', Math.max(1000, Number(e.target.value) || 0))}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter total budget e.g. 30000"
                  />
                </div>

                {/* Main Plan My Trip CTA Button */}
                <button
                  type="submit"
                  className="px-6 sm:px-8 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-sky-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Plan My Trip</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Feature Highlights / Confidence badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto mt-8 text-center text-xs text-slate-300">
          <div className="flex items-center justify-center gap-2 bg-white/5 backdrop-blur-xs py-2 px-3 rounded-xl border border-white/10">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Smart Proximity: Hotels close to your attractions</span>
          </div>
          <div className="flex items-center justify-center gap-2 bg-white/5 backdrop-blur-xs py-2 px-3 rounded-xl border border-white/10">
            <Wallet className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Automatic Budget Protection & Cost Optimizer</span>
          </div>
          <div className="flex items-center justify-center gap-2 bg-white/5 backdrop-blur-xs py-2 px-3 rounded-xl border border-white/10">
            <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Day-by-Day Geo-Clustered Itinerary</span>
          </div>
        </div>
      </div>
    </section>
  );
};
