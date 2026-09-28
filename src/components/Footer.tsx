import React from 'react';
import { Compass, ShieldCheck, Heart, AlertCircle, ArrowUp } from 'lucide-react';
import { useTravel } from '../context/TravelContext';

export const Footer: React.FC = () => {
  const { destinations, selectDestination, setActiveTab } = useTravel();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-12 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Important Disclaimer Notice (Requirement 13) */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-bold text-amber-300 uppercase tracking-wider block">
              Official Price & Information Disclaimer
            </span>
            <p className="text-slate-300 leading-relaxed">
              <strong>“Prices shown are estimated and may change. Verify the final price with the airline/hotel before booking.”</strong>{' '}
              All calculations for flight tickets, hotel rooms, meal expenses, and attraction entry tickets are benchmarks calculated from seasonal historic averages for budgeting and scheduling purposes.
            </p>
          </div>
        </div>

        {/* Main Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-heading font-extrabold text-xl text-white">
                Travel<span className="text-sky-400">Mate</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The modern, budget-smart travel planning platform for discovering India’s top destinations, pairing accommodations by proximity to attractions, and generating day-by-day itineraries.
            </p>
          </div>

          {/* Popular Destinations */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Explore Destinations
            </h4>
            <ul className="space-y-1.5 text-xs">
              {destinations.map((d) => (
                <li key={d.id}>
                  <button
                    onClick={() => {
                      selectDestination(d.id);
                      setActiveTab('explore');
                      scrollToTop();
                    }}
                    className="hover:text-white transition-colors"
                  >
                    {d.name} ({d.state})
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Trip Tools
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('plan');
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors"
                >
                  Plan My Trip
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('hotels');
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors"
                >
                  Proximity Hotel Finder
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('flights');
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors"
                >
                  Flight Price Estimator
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('budget');
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors"
                >
                  Budget Breakdown Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('itinerary');
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors"
                >
                  Smart Itinerary Generator
                </button>
              </li>
            </ul>
          </div>

          {/* Security & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Planner Confidence
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Zero Hidden Calculations</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Empowering independent travelers with transparent, flexible, and realistic budgets across Indian tourist destinations.
              </p>
              <button
                onClick={scrollToTop}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Back to Top</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <p>© {new Date().getFullYear()} TravelMate. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-rose-500 fill-current" /> for passionate travelers
          </p>
        </div>
      </div>
    </footer>
  );
};
