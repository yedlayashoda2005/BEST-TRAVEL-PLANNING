import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Destination,
  SearchParams,
  Attraction,
  Hotel,
  Flight,
  SavedTrip,
  User,
  ItineraryDay,
} from '../types/travel';
import { DESTINATIONS_DATA } from '../data/destinations';
import {
  calculateTripBudget,
  generateBudgetSuggestions,
  generateItinerary,
  BudgetBreakdown,
  BudgetSavingSuggestion,
} from '../utils/travelCalculations';

export type NavigationTab =
  | 'home'
  | 'explore'
  | 'plan'
  | 'attractions'
  | 'flights'
  | 'hotels'
  | 'itinerary'
  | 'budget'
  | 'map'
  | 'my-trips';

interface TravelContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  destinations: Destination[];
  selectedDestination: Destination;
  searchParams: SearchParams;
  setSearchParams: React.Dispatch<React.SetStateAction<SearchParams>>;
  updateSearchParam: <K extends keyof SearchParams>(key: K, value: SearchParams[K]) => void;
  selectDestination: (destId: string) => void;
  selectedAttractionIds: string[];
  toggleAttraction: (attractionId: string) => void;
  selectAllAttractions: () => void;
  clearAttractions: () => void;
  favoriteAttractionIds: string[];
  toggleFavoriteAttraction: (attractionId: string) => void;
  selectedFlightId: string | null;
  setSelectedFlightId: (id: string | null) => void;
  selectedHotelId: string | null;
  setSelectedHotelId: (id: string | null) => void;
  comparedHotelIds: string[];
  toggleCompareHotel: (hotelId: string) => void;
  comparedFlightIds: string[];
  toggleCompareFlight: (flightId: string) => void;
  compareModalType: 'hotel' | 'flight' | null;
  openCompareModal: (type: 'hotel' | 'flight') => void;
  closeCompareModal: () => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  savedTrips: SavedTrip[];
  saveCurrentTrip: (customTitle?: string) => string;
  deleteSavedTrip: (tripId: string) => void;
  loadSavedTrip: (tripId: string) => void;
  itinerary: ItineraryDay[];
  regenerateCustomItinerary: () => void;
  budgetBreakdown: BudgetBreakdown;
  budgetSuggestions: BudgetSavingSuggestion[];
  applyBudgetSuggestion: (suggestion: BudgetSavingSuggestion) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const TravelContext = createContext<TravelContextType | undefined>(undefined);

// Helper for default dates (2 weeks from now for 4 days)
function getDefaultDates() {
  const start = new Date();
  start.setDate(start.getDate() + 14);
  const end = new Date(start);
  end.setDate(end.getDate() + 4);

  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0],
  };
}

const DEFAULT_DATES = getDefaultDates();

export const TravelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('tm_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    localStorage.setItem('tm_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');

  // Search parameters
  const [searchParams, setSearchParams] = useState<SearchParams>({
    destinationId: 'goa',
    startingCity: 'New Delhi (DEL)',
    startDate: DEFAULT_DATES.startDate,
    endDate: DEFAULT_DATES.endDate,
    travelers: 2,
    budget: 30000,
    preference: 'Standard',
  });

  const updateSearchParam = <K extends keyof SearchParams>(key: K, value: SearchParams[K]) => {
    setSearchParams((prev) => ({ ...prev, [key]: value }));
  };

  // Selected Destination
  const selectedDestination = useMemo(() => {
    const found = DESTINATIONS_DATA.find((d) => d.id === searchParams.destinationId);
    return found || DESTINATIONS_DATA[0];
  }, [searchParams.destinationId]);

  // Selections
  const [selectedAttractionIds, setSelectedAttractionIds] = useState<string[]>([
    'goa-baga',
    'goa-fort-aguada',
    'goa-calangute',
  ]);
  const [favoriteAttractionIds, setFavoriteAttractionIds] = useState<string[]>(['goa-baga']);
  const [selectedFlightId, setSelectedFlightId] = useState<string | null>('fl-goa-1');
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>('hotel-goa-2');

  // Comparison states
  const [comparedHotelIds, setComparedHotelIds] = useState<string[]>([]);
  const [comparedFlightIds, setComparedFlightIds] = useState<string[]>([]);
  const [compareModalType, setCompareModalType] = useState<'hotel' | 'flight' | null>(null);

  const openCompareModal = (type: 'hotel' | 'flight') => setCompareModalType(type);
  const closeCompareModal = () => setCompareModalType(null);

  const toggleCompareHotel = (hotelId: string) => {
    setComparedHotelIds((prev) => {
      if (prev.includes(hotelId)) {
        return prev.filter((id) => id !== hotelId);
      }
      if (prev.length >= 3) {
        showToast('You can compare up to 3 hotels at once');
        return prev;
      }
      return [...prev, hotelId];
    });
  };

  const toggleCompareFlight = (flightId: string) => {
    setComparedFlightIds((prev) => {
      if (prev.includes(flightId)) {
        return prev.filter((id) => id !== flightId);
      }
      if (prev.length >= 3) {
        showToast('You can compare up to 3 flights at once');
        return prev;
      }
      return [...prev, flightId];
    });
  };

  // User & Auth Modal
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('tm_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return {
      id: 'usr_demo_101',
      name: 'Yashoda Reddy',
      email: 'yedlayashoda2005@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      savedTripsCount: 1,
    };
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('tm_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('tm_user');
    }
  }, [currentUser]);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3800);
  };

  // Change destination helper
  const selectDestination = (destId: string) => {
    const dest = DESTINATIONS_DATA.find((d) => d.id === destId);
    if (!dest) return;

    setSearchParams((prev) => ({
      ...prev,
      destinationId: destId,
      budget: dest.id === 'manali' ? 35000 : prev.budget,
    }));

    // Pick top 3 attractions by default
    const topAttractions = dest.popularAttractions.slice(0, 3).map((a) => a.id);
    setSelectedAttractionIds(topAttractions);

    // Pick first flight and hotel
    setSelectedFlightId(dest.flights[0]?.id || null);
    setSelectedHotelId(dest.hotels[0]?.id || null);
    setComparedHotelIds([]);
    setComparedFlightIds([]);
    showToast(`Switched destination to ${dest.name}`);
  };

  // Toggle Attraction
  const toggleAttraction = (attractionId: string) => {
    setSelectedAttractionIds((prev) => {
      if (prev.includes(attractionId)) {
        if (prev.length === 1) {
          showToast('Please keep at least 1 tourist attraction selected');
          return prev;
        }
        return prev.filter((id) => id !== attractionId);
      } else {
        return [...prev, attractionId];
      }
    });
  };

  const selectAllAttractions = () => {
    setSelectedAttractionIds(selectedDestination.popularAttractions.map((a) => a.id));
    showToast('Selected all popular tourist attractions');
  };

  const clearAttractions = () => {
    if (selectedDestination.popularAttractions.length > 0) {
      setSelectedAttractionIds([selectedDestination.popularAttractions[0].id]);
      showToast('Reset to 1 primary attraction');
    }
  };

  // Toggle Favorite
  const toggleFavoriteAttraction = (attractionId: string) => {
    setFavoriteAttractionIds((prev) => {
      const exists = prev.includes(attractionId);
      const updated = exists ? prev.filter((id) => id !== attractionId) : [...prev, attractionId];
      showToast(exists ? 'Removed from favorites' : 'Saved to favorites ❤️');
      return updated;
    });
  };

  // Derived selected entities
  const selectedFlight = useMemo(() => {
    return selectedDestination.flights.find((f) => f.id === selectedFlightId);
  }, [selectedDestination, selectedFlightId]);

  const selectedHotel = useMemo(() => {
    return selectedDestination.hotels.find((h) => h.id === selectedHotelId);
  }, [selectedDestination, selectedHotelId]);

  const selectedAttractions = useMemo(() => {
    return selectedDestination.popularAttractions.filter((a) =>
      selectedAttractionIds.includes(a.id)
    );
  }, [selectedDestination, selectedAttractionIds]);

  // Budget calculations
  const budgetBreakdown = useMemo(() => {
    return calculateTripBudget(
      searchParams,
      selectedDestination,
      selectedFlight,
      selectedHotel,
      selectedAttractions
    );
  }, [searchParams, selectedDestination, selectedFlight, selectedHotel, selectedAttractions]);

  const budgetSuggestions = useMemo(() => {
    return generateBudgetSuggestions(
      searchParams,
      selectedDestination,
      selectedFlight,
      selectedHotel,
      selectedAttractions
    );
  }, [searchParams, selectedDestination, selectedFlight, selectedHotel, selectedAttractions]);

  // Apply budget suggestion
  const applyBudgetSuggestion = (suggestion: BudgetSavingSuggestion) => {
    if (suggestion.category === 'hotel' && suggestion.targetId) {
      setSelectedHotelId(suggestion.targetId);
      showToast(`Applied hotel switch: Saved ₹${suggestion.potentialSavings.toLocaleString('en-IN')}!`);
    } else if (suggestion.category === 'flight' && suggestion.targetId) {
      setSelectedFlightId(suggestion.targetId);
      showToast(`Applied flight switch: Saved ₹${suggestion.potentialSavings.toLocaleString('en-IN')}!`);
    } else if (suggestion.category === 'transit') {
      updateSearchParam('preference', 'Standard');
      showToast(`Switched preference to Standard: Saved transit costs!`);
    }
  };

  // Itinerary state
  const [itinerary, setItinerary] = useState<ItineraryDay[]>(() => {
    return generateItinerary(
      searchParams,
      selectedDestination,
      selectedHotel,
      selectedAttractions
    );
  });

  // Re-generate itinerary when destination, hotel, or attractions change
  useEffect(() => {
    const newItinerary = generateItinerary(
      searchParams,
      selectedDestination,
      selectedHotel,
      selectedAttractions
    );
    setItinerary(newItinerary);
  }, [
    searchParams.startDate,
    searchParams.endDate,
    selectedDestination,
    selectedHotel,
    selectedAttractionIds,
  ]);

  const regenerateCustomItinerary = () => {
    const updated = generateItinerary(
      searchParams,
      selectedDestination,
      selectedHotel,
      selectedAttractions
    );
    setItinerary(updated);
    showToast('Refreshed smart day-by-day itinerary');
  };

  // Saved Trips state
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>(() => {
    const saved = localStorage.getItem('tm_saved_trips');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    // Initial rich preloaded trip
    const defaultGoa = DESTINATIONS_DATA[0];
    const initialItinerary = generateItinerary(
      {
        destinationId: 'goa',
        startingCity: 'New Delhi (DEL)',
        startDate: DEFAULT_DATES.startDate,
        endDate: DEFAULT_DATES.endDate,
        travelers: 2,
        budget: 30000,
        preference: 'Standard',
      },
      defaultGoa,
      defaultGoa.hotels[1],
      defaultGoa.popularAttractions.slice(0, 4)
    );

    return [
      {
        id: 'trip_demo_goa_01',
        createdAt: new Date().toISOString(),
        searchParams: {
          destinationId: 'goa',
          startingCity: 'New Delhi (DEL)',
          startDate: DEFAULT_DATES.startDate,
          endDate: DEFAULT_DATES.endDate,
          travelers: 2,
          budget: 30000,
          preference: 'Standard',
        },
        destination: defaultGoa,
        selectedFlightId: 'fl-goa-1',
        selectedHotelId: 'hotel-goa-2',
        selectedAttractionIds: ['goa-baga', 'goa-fort-aguada', 'goa-calangute', 'goa-anjuna'],
        totalEstimatedCost: 28450,
        itinerary: initialItinerary,
        status: 'Upcoming',
        notes: 'Sunset at Fort Aguada, evening dinner at Tito’s lane shacks.',
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('tm_saved_trips', JSON.stringify(savedTrips));
    if (currentUser) {
      setCurrentUser((prev) => (prev ? { ...prev, savedTripsCount: savedTrips.length } : null));
    }
  }, [savedTrips]);

  const saveCurrentTrip = (customTitle?: string): string => {
    const tripId = `trip_${Date.now()}`;
    const newTrip: SavedTrip = {
      id: tripId,
      createdAt: new Date().toISOString(),
      searchParams: { ...searchParams },
      destination: selectedDestination,
      selectedFlightId: selectedFlightId || undefined,
      selectedHotelId: selectedHotelId || undefined,
      selectedAttractionIds: [...selectedAttractionIds],
      totalEstimatedCost: budgetBreakdown.totalEstimatedCost,
      itinerary: [...itinerary],
      status: 'Upcoming',
      notes: customTitle || `Trip to ${selectedDestination.name} with ${searchParams.travelers} traveler(s)`,
    };

    setSavedTrips((prev) => [newTrip, ...prev]);
    showToast(`Trip to ${selectedDestination.name} saved successfully! 🎉`);
    return tripId;
  };

  const deleteSavedTrip = (tripId: string) => {
    setSavedTrips((prev) => prev.filter((t) => t.id !== tripId));
    showToast('Trip removed from My Trips');
  };

  const loadSavedTrip = (tripId: string) => {
    const trip = savedTrips.find((t) => t.id === tripId);
    if (!trip) return;

    setSearchParams(trip.searchParams);
    setSelectedFlightId(trip.selectedFlightId || null);
    setSelectedHotelId(trip.selectedHotelId || null);
    setSelectedAttractionIds(trip.selectedAttractionIds);
    setItinerary(trip.itinerary);
    setActiveTab('plan');
    showToast(`Loaded "${trip.destination.name}" trip into planner!`);
  };

  return (
    <TravelContext.Provider
      value={{
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        destinations: DESTINATIONS_DATA,
        selectedDestination,
        searchParams,
        setSearchParams,
        updateSearchParam,
        selectDestination,
        selectedAttractionIds,
        toggleAttraction,
        selectAllAttractions,
        clearAttractions,
        favoriteAttractionIds,
        toggleFavoriteAttraction,
        selectedFlightId,
        setSelectedFlightId,
        selectedHotelId,
        setSelectedHotelId,
        comparedHotelIds,
        toggleCompareHotel,
        comparedFlightIds,
        toggleCompareFlight,
        compareModalType,
        openCompareModal,
        closeCompareModal,
        currentUser,
        setCurrentUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        savedTrips,
        saveCurrentTrip,
        deleteSavedTrip,
        loadSavedTrip,
        itinerary,
        regenerateCustomItinerary,
        budgetBreakdown,
        budgetSuggestions,
        applyBudgetSuggestion,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </TravelContext.Provider>
  );
};

export const useTravel = () => {
  const context = useContext(TravelContext);
  if (!context) {
    throw new Error('useTravel must be used within a TravelProvider');
  }
  return context;
};
