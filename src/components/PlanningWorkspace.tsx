import React from 'react';
import {
  Compass,
  MapPin,
  Plane,
  Building,
  Wallet,
  Sparkles,
  Map,
  Bookmark,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { useTravel, NavigationTab } from '../context/TravelContext';
import { DestinationOverview } from './DestinationOverview';
import { AttractionsSection } from './AttractionsSection';
import { FlightSection } from './FlightSection';
import { HotelSection } from './HotelSection';
import { BudgetDashboard } from './BudgetDashboard';
import { ItineraryBuilder } from './ItineraryBuilder';
import { InteractiveMap } from './InteractiveMap';
import { MyTripsSection } from './MyTripsSection';

export const PlanningWorkspace: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    selectedDestination,
    selectedAttractionIds,
    selectedFlightId,
    selectedHotelId,
    budgetBreakdown,
    searchParams,
    saveCurrentTrip,
  } = useTravel();

  const selectedFlight = selectedDestination.flights.find((f) => f.id === selectedFlightId);
  const selectedHotel = selectedDestination.hotels.find((h) => h.id === selectedHotelId);

  // Tab navigation steps
  const steps: { id: NavigationTab; title: string; subtitle: string; icon: React.ReactNode }[] = [
    {
      id: 'explore',
      title: 'Destination',
      subtitle: selectedDestination.name,
      icon: <Compass className="w-4 h-4" />,
    },
    {
      id: 'attractions',
      title: 'Attractions',
      subtitle: `${selectedAttractionIds.length} Selected`,
      icon: <MapPin className="w-4 h-4" />,
    },
    {
      id: 'flights',
      title: 'Flights',
      subtitle: selectedFlight ? selectedFlight.airline : 'Choose flight',
      icon: <Plane className="w-4 h-4" />,
    },
    {
      id: 'hotels',
      title: 'Hotels',
      subtitle: selectedHotel ? selectedHotel.name.split(' ')[0] : 'Choose hotel',
      icon: <Building className="w-4 h-4" />,
    },
    {
      id: 'budget',
      title: 'Budget',
      subtitle: `₹${budgetBreakdown.totalEstimatedCost.toLocaleString('en-IN')}`,
      icon: <Wallet className="w-4 h-4" />,
    },
    {
      id: 'itinerary',
      title: 'Itinerary',
      subtitle: 'Smart Schedule',
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: 'map',
      title: 'Map',
      subtitle: 'Spatial View',
      icon: <Map className="w-4 h-4" />,
    },
  ];

  return (
    <div id="planning-workspace" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Workflow Step Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-3 border border-slate-200 dark:border-slate-800 shadow-xs overflow-x-auto scrollbar-none">
        <div className="flex items-center min-w-[700px] justify-between">
          {steps.map((step, idx) => {
            const isActive = activeTab === step.id;
            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => setActiveTab(step.id)}
                  className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl transition-all text-left ${
                    isActive
                      ? 'bg-sky-50 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 shadow-xs'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                      isActive
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {step.icon}
                  </div>
                  <div>
                    <span className="text-xs font-bold block text-slate-800 dark:text-white leading-tight">
                      {step.title}
                    </span>
                    <span className="text-[10px] text-slate-500 truncate max-w-[90px] block">
                      {step.subtitle}
                    </span>
                  </div>
                </button>

                {idx < steps.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-700 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Tab Content Render */}
      <div>
        {(activeTab === 'home' || activeTab === 'plan' || activeTab === 'explore') && (
          <div className="space-y-12">
            <DestinationOverview />
            <AttractionsSection />
            <FlightSection />
            <HotelSection />
            <BudgetDashboard />
            <ItineraryBuilder />
            <InteractiveMap />
          </div>
        )}

        {activeTab === 'attractions' && <AttractionsSection />}
        {activeTab === 'flights' && <FlightSection />}
        {activeTab === 'hotels' && <HotelSection />}
        {activeTab === 'budget' && <BudgetDashboard />}
        {activeTab === 'itinerary' && <ItineraryBuilder />}
        {activeTab === 'map' && <InteractiveMap />}
        {activeTab === 'my-trips' && <MyTripsSection />}
      </div>

      {/* Floating Bottom Quick Action Bar for Easy Booking & Itinerary Generation */}
      <div className="fixed bottom-4 left-4 right-4 z-30 max-w-4xl mx-auto">
        <div className="bg-slate-900/95 text-white backdrop-blur-xl rounded-2xl p-3 sm:p-4 shadow-2xl border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center font-bold text-white shadow-md">
              ₹
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-base sm:text-lg">
                  ₹{budgetBreakdown.totalEstimatedCost.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-400">
                  / ₹{searchParams.budget.toLocaleString('en-IN')} Budget
                </span>
                {budgetBreakdown.isOverBudget && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500 text-white">
                    +₹{budgetBreakdown.overBudgetAmount.toLocaleString('en-IN')} Exceeded
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-300">
                {selectedDestination.name} • {selectedAttractionIds.length} Sights • {selectedHotel?.name.split(' ')[0] || 'Hotel'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setActiveTab('itinerary')}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>View Itinerary</span>
            </button>

            <button
              onClick={() => saveCurrentTrip()}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 transition cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Save Trip</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
