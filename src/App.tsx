import React from 'react';
import { TravelProvider, useTravel } from './context/TravelContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PlanningWorkspace } from './components/PlanningWorkspace';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { CompareModal } from './components/CompareModal';
import { N8nChatWidget } from './components/N8nChatWidget';
import { CheckCircle2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, toastMessage } = useTravel();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      {/* Hero section is shown on home, explore, and plan tabs */}
      {(activeTab === 'home' || activeTab === 'plan' || activeTab === 'explore') && (
        <HeroSection />
      )}

      {/* Main Workspace */}
      <main className="flex-1 pb-24">
        <PlanningWorkspace />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & AI Chatbot */}
      <AuthModal />
      <CompareModal />
      <N8nChatWidget />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="px-4 py-3 rounded-2xl bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 shadow-2xl border border-slate-700 dark:border-slate-200 flex items-center gap-2.5 text-xs font-semibold backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <TravelProvider>
      <AppContent />
    </TravelProvider>
  );
}
