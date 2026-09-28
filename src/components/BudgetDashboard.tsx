import React from 'react';
import {
  Wallet,
  AlertTriangle,
  TrendingDown,
  CheckCircle2,
  Plane,
  Building,
  Utensils,
  Car,
  Ticket,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Printer,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';
import { getTripDuration } from '../utils/travelCalculations';

export const BudgetDashboard: React.FC = () => {
  const {
    searchParams,
    updateSearchParam,
    budgetBreakdown,
    budgetSuggestions,
    applyBudgetSuggestion,
    selectedDestination,
    selectedFlightId,
    selectedHotelId,
    showToast,
  } = useTravel();

  const duration = getTripDuration(searchParams.startDate, searchParams.endDate);
  const travelers = searchParams.travelers || 1;

  // Percentage calculations
  const totalBudget = searchParams.budget || 1;
  const totalCost = budgetBreakdown.totalEstimatedCost;
  const percentUsed = Math.min(100, Math.round((totalCost / totalBudget) * 100));

  const categories = [
    {
      name: 'Flights',
      cost: budgetBreakdown.flights,
      icon: <Plane className="w-4 h-4 text-indigo-500" />,
      color: 'bg-indigo-500',
      description: `${travelers} traveler(s) round-trip estimate`,
    },
    {
      name: 'Hotels / Accommodation',
      cost: budgetBreakdown.hotel,
      icon: <Building className="w-4 h-4 text-sky-500" />,
      color: 'bg-sky-500',
      description: `${duration.nights} night(s) stay`,
    },
    {
      name: 'Food & Dining',
      cost: budgetBreakdown.food,
      icon: <Utensils className="w-4 h-4 text-amber-500" />,
      color: 'bg-amber-500',
      description: `Daily meals for ${travelers} people`,
    },
    {
      name: 'Local Transportation',
      cost: budgetBreakdown.transportation,
      icon: <Car className="w-4 h-4 text-emerald-500" />,
      color: 'bg-emerald-500',
      description: `${duration.days} days local transit / scooter / cab`,
    },
    {
      name: 'Tourist Place Entry Fees',
      cost: budgetBreakdown.attractionFees,
      icon: <Ticket className="w-4 h-4 text-purple-500" />,
      color: 'bg-purple-500',
      description: `Admission tickets for selected sights`,
    },
    {
      name: 'Miscellaneous / Buffer',
      cost: budgetBreakdown.miscellaneous,
      icon: <HelpCircle className="w-4 h-4 text-slate-400" />,
      color: 'bg-slate-400',
      description: `Emergency, bottled water, & tips buffer (5%)`,
    },
  ];

  const handlePrintSummary = () => {
    window.print();
  };

  return (
    <section id="budget-dashboard" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <Wallet className="w-4 h-4" />
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Budget & Cost Dashboard
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Real-time financial breakdown for {travelers} traveler(s) over {duration.days} days in {selectedDestination.name}.
          </p>
        </div>

        <button
          onClick={handlePrintSummary}
          className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2 self-start sm:self-auto transition"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Export Summary</span>
        </button>
      </div>

      {/* Over-Budget Alert Banner (Requirement 6) */}
      {budgetBreakdown.isOverBudget && (
        <div className="rounded-2xl p-5 bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-800/80 text-rose-900 dark:text-rose-200 shadow-md">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5 animate-bounce" />
            <div className="space-y-1">
              <h3 className="font-heading font-extrabold text-base sm:text-lg">
                Your current plan exceeds your budget by ₹
                {budgetBreakdown.overBudgetAmount.toLocaleString('en-IN')}!
              </h3>
              <p className="text-xs sm:text-sm text-rose-700 dark:text-rose-300">
                Total estimated cost is ₹{totalCost.toLocaleString('en-IN')}, while your set budget is ₹
                {totalBudget.toLocaleString('en-IN')}. Check the smart optimization suggestions below to get back on track with one click.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Set Budget */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Budget
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              ₹{searchParams.budget.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <input
              type="range"
              min={10000}
              max={150000}
              step={2000}
              value={searchParams.budget}
              onChange={(e) => updateSearchParam('budget', Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">Slide to adjust budget target</span>
        </div>

        {/* Estimated Total Cost */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Estimated Total Cost
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span
              className={`font-heading text-2xl sm:text-3xl font-extrabold ${
                budgetBreakdown.isOverBudget
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-slate-900 dark:text-white'
              }`}
            >
              ₹{budgetBreakdown.totalEstimatedCost.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-3 font-medium">
            ₹{budgetBreakdown.costPerPerson.toLocaleString('en-IN')} per traveler
          </p>
        </div>

        {/* Remaining or Deficit Budget */}
        <div
          className={`p-5 rounded-2xl border shadow-xs ${
            budgetBreakdown.isOverBudget
              ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
              : 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
          }`}
        >
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {budgetBreakdown.isOverBudget ? 'Budget Deficit' : 'Remaining Savings'}
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span
              className={`font-heading text-2xl sm:text-3xl font-extrabold ${
                budgetBreakdown.isOverBudget
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {budgetBreakdown.isOverBudget ? '-' : '+'}₹
              {Math.abs(budgetBreakdown.remainingBudget).toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 font-medium">
            {budgetBreakdown.isOverBudget
              ? 'Action needed to balance budget'
              : 'Available for shopping & gifts!'}
          </p>
        </div>

        {/* Budget Utilization Progress Bar */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Budget Utilized
              </span>
              <span
                className={`text-xs font-extrabold ${
                  budgetBreakdown.isOverBudget ? 'text-rose-600' : 'text-emerald-600'
                }`}
              >
                {Math.round((totalCost / totalBudget) * 100)}%
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
              <div
                className={`h-full transition-all duration-500 ${
                  budgetBreakdown.isOverBudget ? 'bg-rose-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, (totalCost / totalBudget) * 100)}%` }}
              />
            </div>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Includes 5% unforeseen buffer</span>
          </div>
        </div>
      </div>

      {/* Detailed Categories Breakdown Table & Progress Bars */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <h3 className="font-heading font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
          <span>Itemized Trip Cost Distribution</span>
        </h3>

        <div className="space-y-4">
          {categories.map((cat) => {
            const catPercent = totalCost > 0 ? Math.round((cat.cost / totalCost) * 100) : 0;

            return (
              <div
                key={cat.name}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80 space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xs">
                      {cat.icon}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                        {cat.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">{cat.description}</p>
                    </div>
                  </div>

                  <div className="text-right sm:text-right flex sm:flex-col items-center sm:items-end justify-between">
                    <span className="font-heading font-extrabold text-base text-slate-900 dark:text-white">
                      ₹{cat.cost.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      {catPercent}% of total trip
                    </span>
                  </div>
                </div>

                {/* Individual Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className={`h-full ${cat.color}`}
                    style={{ width: `${Math.min(100, catPercent)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Smart Budget Recommendations & Savings Opportunities (Requirement 6) */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 rounded-3xl p-6 sm:p-7 border border-amber-200/80 dark:border-amber-900/40 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500 text-slate-950">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-heading font-extrabold text-lg text-slate-900 dark:text-white">
                Smart Cost Optimizer Recommendations
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Cheaper alternatives to reduce trip cost without sacrificing experience
              </p>
            </div>
          </div>
        </div>

        {budgetSuggestions.length === 0 ? (
          <div className="p-4 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-amber-100 dark:border-amber-900/50 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              Your selections are already highly cost-optimized! You have chosen the best value flight, stay, and transit options.
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {budgetSuggestions.map((sug) => (
              <div
                key={sug.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200/70 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                      {sug.category.toUpperCase()} SAVINGS
                    </span>
                    <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                      <TrendingDown className="w-3.5 h-3.5" />
                      <span>Save ₹{sug.potentialSavings.toLocaleString('en-IN')}</span>
                    </span>
                  </div>
                  <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                    {sug.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {sug.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => applyBudgetSuggestion(sug)}
                  className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                >
                  <span>{sug.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
