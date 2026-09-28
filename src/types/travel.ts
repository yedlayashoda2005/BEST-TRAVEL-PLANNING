export type TravelPreference = 'Budget' | 'Standard' | 'Premium';

export interface Attraction {
  id: string;
  name: string;
  category: 'Beach' | 'Heritage' | 'Nature' | 'Culture' | 'Adventure' | 'Market';
  image: string;
  description: string;
  location: string;
  openingHours: string;
  approxDurationHours: number;
  entryFee: number; // in INR
  coordinates: { lat: number; lng: number };
  rating: number;
  bestTimeToVisitDay: 'Morning' | 'Afternoon' | 'Evening';
  tags: string[];
}

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  airlineLogo: string;
  fromCity: string;
  toCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number; // 0 for non-stop, 1 for 1-stop
  pricePerPerson: number; // in INR
  baggage: string;
  cabinClass: 'Economy' | 'Premium Economy' | 'Business';
  timeOfDay: 'Morning' | 'Afternoon' | 'Evening';
}

export interface Hotel {
  id: string;
  name: string;
  image: string;
  gallery?: string[];
  type: 'Resort' | 'Boutique Hotel' | 'Luxury Hotel' | 'Cozy Inn' | 'Heritage Haveli' | 'Villa';
  rating: number;
  reviewCount: number;
  pricePerNight: number; // in INR
  maxGuests: number;
  cityCenterDistanceKm: number;
  airportDistanceKm: number;
  facilities: string[];
  breakfastIncluded: boolean;
  freeCancellation: boolean;
  coordinates: { lat: number; lng: number };
  description: string;
  address: string;
  tier: 'Budget' | 'Standard' | 'Premium';
}

export interface Destination {
  id: string;
  name: string;
  state: string;
  tagline: string;
  heroImage: string;
  description: string;
  bestTimeToVisit: string;
  idealDays: number;
  approxDailyFoodCostPerPerson: {
    Budget: number;
    Standard: number;
    Premium: number;
  };
  approxDailyTransitCost: {
    Budget: number;
    Standard: number;
    Premium: number;
  };
  popularAttractions: Attraction[];
  hotels: Hotel[];
  flights: Flight[];
  coordinates: { lat: number; lng: number };
  famousFoods: string[];
  transportOptions: string[];
}

export interface SearchParams {
  destinationId: string;
  startingCity: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  preference: TravelPreference;
}

export interface ItineraryActivity {
  id: string;
  timeSlot: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  time: string;
  title: string;
  description: string;
  type: 'sightseeing' | 'meal' | 'transit' | 'leisure' | 'checkin' | 'checkout';
  location?: string;
  estimatedCost?: number;
  attractionId?: string;
}

export interface ItineraryDay {
  dayNumber: number;
  date: string;
  theme: string;
  activities: ItineraryActivity[];
}

export interface SavedTrip {
  id: string;
  createdAt: string;
  searchParams: SearchParams;
  destination: Destination;
  selectedFlightId?: string;
  selectedHotelId?: string;
  selectedAttractionIds: string[];
  totalEstimatedCost: number;
  itinerary: ItineraryDay[];
  notes?: string;
  status: 'Planning' | 'Upcoming' | 'Completed';
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  savedTripsCount: number;
}
