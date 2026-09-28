import React, { useState } from 'react';
import {
  Compass,
  Plane,
  Hotel as HotelIcon,
  MapPin,
  Calendar,
  Wallet,
  Bookmark,
  Sun,
  Moon,
  Menu,
  X,
  User,
  Sparkles,
  Map,
  ArrowRight,
} from 'lucide-react';
import { useTravel, NavigationTab } from '../context/TravelContext';

export const Navbar: React.FC = () => {
  const {
    theme,
    toggleTheme,
    activeTab,
    setActiveTab,
    budgetBreakdown,
    searchParams,
    savedTrips,
    currentUser,
    setIsAuthModalOpen,
    setAuthModalMode,
  } = useTravel();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Compass className="w-4 h-4" /> },
    { id: 'explore', label: 'Explore Destinations', icon: <Compass className="w-4 h-4" /> },
    { id: 'plan', label: 'Plan My Trip', icon: <Calendar className="w-4 h-4" /> },
    { id: 'attractions', label: 'Tourist Places', icon: <MapPin className="w-4 h-4" /> },
    { id: 'flights', label: 'Flights', icon: <Plane className="w-4 h-4" /> },
    { id: 'hotels', label: 'Hotels', icon: <HotelIcon className="w-4 h-4" /> },
    { id: 'budget', label: 'Budget', icon: <Wallet className="w-4 h-4" /> },
    { id: 'itinerary', label: 'Itinerary', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'map', label: 'Map', icon: <Map className="w-4 h-4" /> },
    {
      id: 'my-trips',
      label: 'My Trips',
      icon: (
        <span className="relative flex items-center">
          <Bookmark className="w-4 h-4" />
          {savedTrips.length > 0 && (
            <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold bg-amber-500 text-white rounded-full">
              {savedTrips.length}
            </span>
          )}
        </span>
      ),
    },
  ];

  const handleNavClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-heading font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                  Travel<span className="text-sky-600 dark:text-sky-400">Mate</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 font-bold uppercase rounded bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                  India
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 -mt-0.5 hidden sm:block font-medium">
                Plan Smart • Stay on Budget
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/70'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & User */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Budget Pill */}
            <div
              onClick={() => handleNavClick('budget')}
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs cursor-pointer transition-all ${
                budgetBreakdown.isOverBudget
                  ? 'border-rose-300 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300'
                  : 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300'
              }`}
              title="Click to view Budget Breakdown"
            >
              <Wallet className="w-3.5 h-3.5" />
              <div className="flex items-center gap-1 font-semibold">
                <span>₹{budgetBreakdown.totalEstimatedCost.toLocaleString('en-IN')}</span>
                <span className="text-slate-400 dark:text-slate-500 font-normal">/</span>
                <span className="text-slate-600 dark:text-slate-400">₹{searchParams.budget.toLocaleString('en-IN')}</span>
              </div>
              {budgetBreakdown.isOverBudget && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </div>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* User Account / Profile */}
            {currentUser ? (
              <div
                onClick={() => {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-sky-500"
                />
                <span className="hidden md:inline text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {currentUser.name.split(' ')[0]}
                </span>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-600 text-white hover:bg-sky-700 transition shadow-xs"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-1 shadow-xl">
          <div className="mb-3 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Trip Budget</span>
            <div className="flex items-center gap-1 text-xs font-bold text-slate-900 dark:text-white">
              <span>₹{budgetBreakdown.totalEstimatedCost.toLocaleString('en-IN')}</span>
              <span className="text-slate-400">/</span>
              <span>₹{searchParams.budget.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium flex items-center gap-2 ${
                    isActive
                      ? 'bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-400 font-bold'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center px-1">
            <span className="text-xs text-slate-500">Theme</span>
            <button
              onClick={toggleTheme}
              className="px-3 py-1 text-xs rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1"
            >
              {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
