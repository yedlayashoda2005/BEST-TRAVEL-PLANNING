import React, { useState } from 'react';
import {
  Bookmark,
  Calendar,
  Users,
  MapPin,
  Building,
  Plane,
  Trash2,
  ExternalLink,
  Edit3,
  Sparkles,
  ArrowRight,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';
import { SavedTrip } from '../types/travel';
import { getTripDuration } from '../utils/travelCalculations';

export const MyTripsSection: React.FC = () => {
  const { savedTrips, deleteSavedTrip, loadSavedTrip, setActiveTab, currentUser, setIsAuthModalOpen } =
    useTravel();

  const [activeViewingTrip, setActiveViewingTrip] = useState<SavedTrip | null>(null);

  return (
    <section id="my-trips-section" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
              <Bookmark className="w-4 h-4" />
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              My Saved Trips
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Manage your customized vacation plans, track estimated expenses, and view day-by-day schedules.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('plan')}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white flex items-center gap-2 shadow-xs transition self-start sm:self-auto cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Plan a New Trip</span>
        </button>
      </div>

      {/* Trips List or Empty State */}
      {savedTrips.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 mx-auto flex items-center justify-center mb-4 border border-amber-200 dark:border-amber-800">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-extrabold text-xl text-slate-900 dark:text-white mb-2">
            No Saved Trips Yet
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
            Ready to explore? Choose your destination, configure your budget and travel dates, and click "Save to My Trips" to keep your itinerary ready.
          </p>
          <button
            onClick={() => setActiveTab('plan')}
            className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition"
          >
            Start Planning Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {savedTrips.map((trip) => {
            const duration = getTripDuration(trip.searchParams.startDate, trip.searchParams.endDate);
            const hotel = trip.destination.hotels.find((h) => h.id === trip.selectedHotelId);
            const flight = trip.destination.flights.find((f) => f.id === trip.selectedFlightId);

            return (
              <div
                key={trip.id}
                className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition"
              >
                {/* Trip Card Header Banner */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={trip.destination.heroImage}
                    alt={trip.destination.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

                  {/* Status Badge */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-emerald-600 text-white shadow-xs">
                      {trip.status}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-white/90 text-slate-900 backdrop-blur-xs shadow-xs">
                      {trip.searchParams.preference} Style
                    </span>
                  </div>

                  {/* Title & Dates */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="font-heading font-extrabold text-xl text-white drop-shadow">
                      {trip.destination.name}, {trip.destination.state}
                    </h3>
                    <p className="text-xs text-slate-200 flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-300" />
                      <span>
                        {trip.searchParams.startDate} → {trip.searchParams.endDate} ({duration.days} Days / {duration.nights} Nights)
                      </span>
                    </p>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5 flex-1 space-y-4">
                  {/* Key summary details */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-500 font-semibold uppercase block">
                        Travelers & Budget
                      </span>
                      <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                        {trip.searchParams.travelers} People • ₹{trip.searchParams.budget.toLocaleString('en-IN')} Target
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-500 font-semibold uppercase block">
                        Total Estimated Cost
                      </span>
                      <p className="font-extrabold text-sky-600 dark:text-sky-400 mt-0.5">
                        ₹{trip.totalEstimatedCost.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  {/* Selections Overview */}
                  <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                    {hotel && (
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-sky-500 shrink-0" />
                        <span className="truncate">Hotel: <strong className="text-slate-800 dark:text-slate-200">{hotel.name}</strong></span>
                      </div>
                    )}

                    {flight && (
                      <div className="flex items-center gap-2">
                        <Plane className="w-4 h-4 text-indigo-500 shrink-0" />
                        <span className="truncate">Flight: <strong className="text-slate-800 dark:text-slate-200">{flight.airline} ({flight.flightNumber})</strong></span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>{trip.selectedAttractionIds.length} attractions planned</span>
                    </div>
                  </div>

                  {/* Note if any */}
                  {trip.notes && (
                    <p className="text-[11px] italic text-slate-500 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg">
                      "{trip.notes}"
                    </p>
                  )}
                </div>

                {/* Action Buttons: View, Edit, Delete */}
                <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveViewingTrip(trip)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 flex items-center gap-1.5 transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => loadSavedTrip(trip.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 hover:bg-sky-100 flex items-center gap-1.5 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit in Planner</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteSavedTrip(trip.id)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                    title="Delete Trip"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: View Saved Trip Full Itinerary */}
      {activeViewingTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white">
                  {activeViewingTrip.destination.name} Travel Plan
                </h3>
                <p className="text-xs text-slate-500">
                  {activeViewingTrip.searchParams.startDate} to {activeViewingTrip.searchParams.endDate} • Total: ₹{activeViewingTrip.totalEstimatedCost.toLocaleString('en-IN')}
                </p>
              </div>
              <button
                onClick={() => setActiveViewingTrip(null)}
                className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              >
                Close
              </button>
            </div>

            {/* Day Schedule Summary */}
            <div className="space-y-4">
              {activeViewingTrip.itinerary.map((day) => (
                <div key={day.dayNumber} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
                    Day {day.dayNumber}: {day.theme} ({day.date})
                  </h4>
                  <div className="space-y-1.5 pl-3 border-l-2 border-sky-400">
                    {day.activities.map((act) => (
                      <div key={act.id} className="text-xs">
                        <span className="font-bold text-slate-700 dark:text-slate-300">{act.time}:</span>{' '}
                        <span className="text-slate-600 dark:text-slate-400">{act.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  loadSavedTrip(activeViewingTrip.id);
                  setActiveViewingTrip(null);
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-sky-600 text-white hover:bg-sky-700"
              >
                Load Trip into Active Workspace
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
