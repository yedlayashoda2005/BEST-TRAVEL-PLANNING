import React, { useState } from 'react';
import { X, User, Mail, Lock, LogIn, UserPlus, LogOut, CheckCircle2 } from 'lucide-react';
import { useTravel } from '../context/TravelContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    currentUser,
    setCurrentUser,
    showToast,
  } = useTravel();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authModalMode === 'register' && !name) {
      showToast('Please enter your name');
      return;
    }
    if (!email || !password) {
      showToast('Please enter email and password');
      return;
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: authModalMode === 'register' ? name : (email.split('@')[0] || 'Traveler'),
      email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      savedTripsCount: 0,
    };

    setCurrentUser(newUser);
    setIsAuthModalOpen(false);
    showToast(`Welcome back, ${newUser.name}!`);
  };

  const handleDemoSignIn = () => {
    const demoUser = {
      id: 'usr_demo_101',
      name: 'Yashoda Reddy',
      email: 'yedlayashoda2005@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      savedTripsCount: 1,
    };
    setCurrentUser(demoUser);
    setIsAuthModalOpen(false);
    showToast('Signed in as Yashoda Reddy (Demo Traveler)');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthModalOpen(false);
    showToast('Signed out successfully');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 p-6 relative">
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {currentUser ? (
          /* Profile & Logout View */
          <div className="text-center space-y-4 pt-2">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-20 h-20 rounded-full mx-auto object-cover ring-4 ring-sky-500/30"
            />
            <div>
              <h3 className="font-heading font-extrabold text-xl text-slate-900 dark:text-white">
                {currentUser.name}
              </h3>
              <p className="text-xs text-slate-500">{currentUser.email}</p>
            </div>

            <div className="p-3 bg-sky-50 dark:bg-sky-950/40 rounded-2xl border border-sky-100 dark:border-sky-900 text-xs text-sky-800 dark:text-sky-300">
              <span className="font-bold">TravelMate Account:</span> Trips and customized itineraries are safely preserved in your browser session.
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-2.5 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950 text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          /* Login / Register Form */
          <div className="space-y-5">
            <div className="text-center">
              <h3 className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white">
                {authModalMode === 'login' ? 'Welcome to TravelMate' : 'Create Free Account'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Save trips, sync itineraries, and keep tabs on budgets
              </p>
            </div>

            {/* Mode switch */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => setAuthModalMode('login')}
                className={`py-1.5 text-xs font-bold rounded-lg transition ${
                  authModalMode === 'login'
                    ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthModalMode('register')}
                className={`py-1.5 text-xs font-bold rounded-lg transition ${
                  authModalMode === 'register'
                    ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {authModalMode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. Yashoda Reddy"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
              >
                {authModalMode === 'login' ? (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Create Free Account</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Traveler Button */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleDemoSignIn}
                className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>One-Click Demo Sign In</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
