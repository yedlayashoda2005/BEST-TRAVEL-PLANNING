import React, { useState, useMemo } from 'react';
import {
  Plane,
  Clock,
  ArrowRight,
  Luggage,
  Check,
  AlertCircle,
  Filter,
  ArrowUpDown,
  Layers,
  Sparkles,
  Calendar,
  Users,
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';
import { Flight } from '../types/travel';

export const FlightSection: React.FC = () => {
  const {
    selectedDestination,
    searchParams,
    selectedFlightId,
    setSelectedFlightId,
    comparedFlightIds,
    toggleCompareFlight,
    openCompareModal,
    showToast,
  } = useTravel();

  // Sort & Filter state
  const [sortBy, setSortBy] = useState<'price' | 'duration'>('price');
  const [stopFilter, setStopFilter] = useState<'all' | 'nonstop'>('all');
  const [timeFilter, setTimeFilter] = useState<'all' | 'Morning' | 'Afternoon' | 'Evening'>('all');

  const travelers = searchParams.travelers || 1;

  // Filter & sort flights
  const filteredFlights = useMemo(() => {
    let list = [...selectedDestination.flights];

    if (stopFilter === 'nonstop') {
      list = list.filter((f) => f.stops === 0);
    }

    if (timeFilter !== 'all') {
      list = list.filter((f) => f.timeOfDay === timeFilter);
    }

    if (sortBy === 'price') {
      list.sort((a, b) => a.pricePerPerson - b.pricePerPerson);
    } else if (sortBy === 'duration') {
      list.sort((a, b) => a.duration.localeCompare(b.duration));
    }

    return list;
  }, [selectedDestination.flights, stopFilter, timeFilter, sortBy]);

  return (
    <section id="flights-section" className="space-y-6">
      {/* Header and Route Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              <Plane className="w-4 h-4" />
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Flights to {selectedDestination.name}
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {searchParams.startingCity}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-sky-600 dark:text-sky-400">
              {selectedDestination.name}
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {searchParams.startDate}
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              {travelers} Traveler{travelers > 1 ? 's' : ''}
            </span>
          </p>
        </div>

        {/* Compare Flights Button */}
        {comparedFlightIds.length > 0 && (
          <button
            onClick={() => openCompareModal('flight')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2 shadow-md transition self-start md:self-auto"
          >
            <Layers className="w-4 h-4" />
            <span>Compare ({comparedFlightIds.length}/3)</span>
          </button>
        )}
      </div>

      {/* Prominent Estimated Price Disclaimer Banner */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-2xl p-3.5 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Important Price Notice:</span> Flight fares shown are{' '}
          <strong>estimated baseline prices</strong> based on seasonal averages for {travelers} passenger(s).
          Verify final live airline ticket availability and seat baggage fares before booking.
        </div>
      </div>

      {/* Sorting & Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Sort Options */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sort:</span>
          </span>
          <button
            onClick={() => setSortBy('price')}
            className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition ${
              sortBy === 'price'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Lowest Price
          </button>
          <button
            onClick={() => setSortBy('duration')}
            className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition ${
              sortBy === 'duration'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Shortest Duration
          </button>
        </div>

        {/* Stops & Time of Day Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Stops */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Stops:</span>
            <select
              value={stopFilter}
              onChange={(e) => setStopFilter(e.target.value as any)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none"
            >
              <option value="all">All Stops</option>
              <option value="nonstop">Non-Stop Only</option>
            </select>
          </div>

          {/* Time of Day */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Departure:</span>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as any)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none"
            >
              <option value="all">Any Time</option>
              <option value="Morning">Morning (06:00 - 12:00)</option>
              <option value="Afternoon">Afternoon (12:00 - 18:00)</option>
              <option value="Evening">Evening (18:00+)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Flight Cards List */}
      <div className="space-y-4">
        {filteredFlights.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <Plane className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-50" />
            <h4 className="font-heading font-bold text-slate-800 dark:text-white">
              No flights match your filter criteria
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting the stops or departure time filters to view more options.
            </p>
          </div>
        ) : (
          filteredFlights.map((flight) => {
            const isSelected = selectedFlightId === flight.id;
            const isCompared = comparedFlightIds.includes(flight.id);
            const totalFlightPrice = flight.pricePerPerson * travelers;

            return (
              <div
                key={flight.id}
                className={`rounded-2xl bg-white dark:bg-slate-900 p-5 sm:p-6 border transition-all duration-200 ${
                  isSelected
                    ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  {/* Airline Branding & Flight Info */}
                  <div className="flex items-center gap-3.5 sm:min-w-[200px]">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-extrabold text-sm border border-indigo-200 dark:border-indigo-800/80">
                      {flight.airline.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-heading font-extrabold text-slate-900 dark:text-white text-base">
                        {flight.airline}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {flight.flightNumber} • {flight.cabinClass}
                      </p>
                      <span className="inline-block text-[10px] font-bold uppercase text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded-md mt-1">
                        {flight.timeOfDay} Flight
                      </span>
                    </div>
                  </div>

                  {/* Flight Times & Duration Timeline */}
                  <div className="flex-1 max-w-md">
                    <div className="flex items-center justify-between text-center gap-4">
                      {/* Departure */}
                      <div className="text-left">
                        <p className="font-heading font-extrabold text-xl text-slate-900 dark:text-white">
                          {flight.departureTime}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">{searchParams.startingCity.split(' ')[0]}</p>
                      </div>

                      {/* Timeline Duration */}
                      <div className="flex-1 px-3">
                        <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center justify-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{flight.duration}</span>
                        </p>
                        <div className="relative flex items-center">
                          <div className="w-full h-0.5 bg-slate-200 dark:bg-slate-700" />
                          <div className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-slate-900" />
                          <Plane className="w-3.5 h-3.5 text-indigo-500 absolute right-0 -top-1.5" />
                        </div>
                        <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                          {flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop`}
                        </p>
                      </div>

                      {/* Arrival */}
                      <div className="text-right">
                        <p className="font-heading font-extrabold text-xl text-slate-900 dark:text-white">
                          {flight.arrivalTime}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">{selectedDestination.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 mt-2 text-[11px] text-slate-500">
                      <Luggage className="w-3.5 h-3.5 text-slate-400" />
                      <span>{flight.baggage}</span>
                    </div>
                  </div>

                  {/* Pricing & Selection Actions */}
                  <div className="flex items-center sm:items-end justify-between lg:flex-col lg:justify-center border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100 dark:border-slate-800 lg:min-w-[210px] text-right">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 dark:text-amber-400 block">
                        Estimated Fare
                      </span>
                      <div className="flex items-baseline gap-1 lg:justify-end">
                        <span className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white">
                          ₹{flight.pricePerPerson.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-slate-500">/ person</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Total: <span className="font-bold text-slate-700 dark:text-slate-300">₹{totalFlightPrice.toLocaleString('en-IN')}</span> ({travelers} travelers)
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      {/* Compare Checkbox */}
                      <button
                        type="button"
                        onClick={() => toggleCompareFlight(flight.id)}
                        className={`text-xs px-2.5 py-2 rounded-xl border font-medium transition ${
                          isCompared
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-950 dark:border-indigo-700 dark:text-indigo-300'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                        }`}
                        title="Add to side-by-side comparison"
                      >
                        {isCompared ? 'Compared' : '+ Compare'}
                      </button>

                      {/* Select Flight Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFlightId(flight.id);
                          showToast(`Selected ${flight.airline} (${flight.flightNumber})`);
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Selected</span>
                          </>
                        ) : (
                          <span>Select Flight</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
