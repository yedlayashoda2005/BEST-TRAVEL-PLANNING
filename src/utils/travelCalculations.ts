import { Attraction, Hotel, Flight, SearchParams, Destination, ItineraryDay, ItineraryActivity } from '../types/travel';

// Calculate Haversine distance in km between two lat/lng coordinates
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Calculate the average distance from a hotel to a set of selected attractions
export function calculateHotelProximityScore(
  hotel: Hotel,
  selectedAttractions: Attraction[]
): { averageDistanceKm: number; closestAttractionName: string; closestDistanceKm: number } {
  if (selectedAttractions.length === 0) {
    return {
      averageDistanceKm: hotel.cityCenterDistanceKm,
      closestAttractionName: 'City Center',
      closestDistanceKm: hotel.cityCenterDistanceKm,
    };
  }

  let totalDist = 0;
  let minDistance = Infinity;
  let closestName = '';

  for (const att of selectedAttractions) {
    const d = calculateDistanceKm(
      hotel.coordinates.lat,
      hotel.coordinates.lng,
      att.coordinates.lat,
      att.coordinates.lng
    );
    totalDist += d;
    if (d < minDistance) {
      minDistance = d;
      closestName = att.name;
    }
  }

  const avg = Math.round((totalDist / selectedAttractions.length) * 10) / 10;
  return {
    averageDistanceKm: avg,
    closestAttractionName: closestName,
    closestDistanceKm: Math.round(minDistance * 10) / 10,
  };
}

// Compute number of days and nights from dates
export function getTripDuration(startDate: string, endDate: string): { days: number; nights: number } {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.max(0, end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const days = Math.max(1, diffDays);
  const nights = Math.max(1, days - 1);
  return { days, nights };
}

export interface BudgetBreakdown {
  flights: number;
  hotel: number;
  food: number;
  transportation: number;
  attractionFees: number;
  miscellaneous: number;
  totalEstimatedCost: number;
  remainingBudget: number;
  isOverBudget: boolean;
  overBudgetAmount: number;
  costPerPerson: number;
}

export function calculateTripBudget(
  searchParams: SearchParams,
  destination: Destination,
  selectedFlight?: Flight,
  selectedHotel?: Hotel,
  selectedAttractions: Attraction[] = []
): BudgetBreakdown {
  const { days, nights } = getTripDuration(searchParams.startDate, searchParams.endDate);
  const travelers = searchParams.travelers || 1;
  const preference = searchParams.preference || 'Standard';

  // 1. Flights
  const flightPrice = selectedFlight ? selectedFlight.pricePerPerson * travelers : 0;

  // 2. Hotel
  const hotelPrice = selectedHotel ? selectedHotel.pricePerNight * nights : 0;

  // 3. Food
  const dailyFoodRate = destination.approxDailyFoodCostPerPerson[preference] || 1000;
  const foodTotal = dailyFoodRate * days * travelers;

  // 4. Local transportation
  const dailyTransitRate = destination.approxDailyTransitCost[preference] || 800;
  const transitTotal = dailyTransitRate * days;

  // 5. Tourist attractions entry fees
  const attractionFeesTotal = selectedAttractions.reduce(
    (sum, a) => sum + (a.entryFee || 0) * travelers,
    0
  );

  // 6. Misc (Buffer 5%)
  const subtotal = flightPrice + hotelPrice + foodTotal + transitTotal + attractionFeesTotal;
  const miscellaneous = Math.round(subtotal * 0.05);

  const totalEstimatedCost = subtotal + miscellaneous;
  const remainingBudget = searchParams.budget - totalEstimatedCost;
  const isOverBudget = remainingBudget < 0;
  const overBudgetAmount = isOverBudget ? Math.abs(remainingBudget) : 0;
  const costPerPerson = Math.round(totalEstimatedCost / travelers);

  return {
    flights: flightPrice,
    hotel: hotelPrice,
    food: foodTotal,
    transportation: transitTotal,
    attractionFees: attractionFeesTotal,
    miscellaneous,
    totalEstimatedCost,
    remainingBudget,
    isOverBudget,
    overBudgetAmount,
    costPerPerson,
  };
}

export interface BudgetSavingSuggestion {
  id: string;
  category: 'flight' | 'hotel' | 'transit' | 'attractions';
  title: string;
  potentialSavings: number;
  actionText: string;
  targetId?: string;
  description: string;
}

export function generateBudgetSuggestions(
  searchParams: SearchParams,
  destination: Destination,
  selectedFlight?: Flight,
  selectedHotel?: Hotel,
  selectedAttractions: Attraction[] = []
): BudgetSavingSuggestion[] {
  const suggestions: BudgetSavingSuggestion[] = [];
  const { nights } = getTripDuration(searchParams.startDate, searchParams.endDate);
  const travelers = searchParams.travelers || 1;

  // Check cheaper hotel
  if (selectedHotel) {
    const cheaperHotels = destination.hotels
      .filter((h) => h.id !== selectedHotel.id && h.pricePerNight < selectedHotel.pricePerNight)
      .sort((a, b) => a.pricePerNight - b.pricePerNight);

    if (cheaperHotels.length > 0) {
      const bestAlternative = cheaperHotels[0];
      const savings = (selectedHotel.pricePerNight - bestAlternative.pricePerNight) * nights;
      if (savings > 500) {
        suggestions.push({
          id: 'suggest-hotel',
          category: 'hotel',
          title: `Switch hotel to ${bestAlternative.name}`,
          potentialSavings: savings,
          actionText: `Select ${bestAlternative.name}`,
          targetId: bestAlternative.id,
          description: `Save ₹${savings.toLocaleString('en-IN')} by choosing this comfortable ${bestAlternative.rating}★ ${bestAlternative.type} at ₹${bestAlternative.pricePerNight.toLocaleString('en-IN')}/night.`,
        });
      }
    }
  }

  // Check cheaper flight
  if (selectedFlight) {
    const cheaperFlights = destination.flights
      .filter((f) => f.id !== selectedFlight.id && f.pricePerPerson < selectedFlight.pricePerPerson)
      .sort((a, b) => a.pricePerPerson - b.pricePerPerson);

    if (cheaperFlights.length > 0) {
      const bestAltFlight = cheaperFlights[0];
      const savings = (selectedFlight.pricePerPerson - bestAltFlight.pricePerPerson) * travelers;
      if (savings > 400) {
        suggestions.push({
          id: 'suggest-flight',
          category: 'flight',
          title: `Switch flight to ${bestAltFlight.airline} (${bestAltFlight.flightNumber})`,
          potentialSavings: savings,
          actionText: `Select ${bestAltFlight.airline}`,
          targetId: bestAltFlight.id,
          description: `Save ₹${savings.toLocaleString('en-IN')} for ${travelers} traveler(s) with ${bestAltFlight.airline} departing at ${bestAltFlight.departureTime}.`,
        });
      }
    }
  }

  // Suggest transit optimization
  if (searchParams.preference === 'Premium') {
    const dailyDiff = (destination.approxDailyTransitCost.Premium - destination.approxDailyTransitCost.Standard) * getTripDuration(searchParams.startDate, searchParams.endDate).days;
    suggestions.push({
      id: 'suggest-transit',
      category: 'transit',
      title: 'Optimize Local Transportation',
      potentialSavings: dailyDiff,
      actionText: 'Switch to Standard Cab',
      description: `Opting for self-drive or app-based sedans instead of full-day luxury chauffeurs saves ₹${dailyDiff.toLocaleString('en-IN')}.`,
    });
  }

  // Free alternative attraction reminder
  const expensiveAttractions = selectedAttractions.filter((a) => a.entryFee > 200);
  if (expensiveAttractions.length > 0) {
    suggestions.push({
      id: 'suggest-attractions',
      category: 'attractions',
      title: 'Balance High-Fee Sightseeing with Free Scenic Spots',
      potentialSavings: 500 * travelers,
      actionText: 'Explore Free Attractions',
      description: `Include free beaches, heritage promenades, and public viewpoints like ${destination.popularAttractions.find((a) => a.entryFee === 0)?.name || 'local spots'} to trim admission costs.`,
    });
  }

  return suggestions;
}

// Generate smart day-by-day itinerary
export function generateItinerary(
  searchParams: SearchParams,
  destination: Destination,
  selectedHotel?: Hotel,
  selectedAttractions: Attraction[] = []
): ItineraryDay[] {
  const { days } = getTripDuration(searchParams.startDate, searchParams.endDate);
  const itinerary: ItineraryDay[] = [];
  const hotelName = selectedHotel?.name || 'Selected Hotel';

  // Sort attractions by distance from hotel so nearby ones get clustered
  const sortedAttractions = [...selectedAttractions];
  if (selectedHotel) {
    sortedAttractions.sort((a, b) => {
      const distA = calculateDistanceKm(selectedHotel.coordinates.lat, selectedHotel.coordinates.lng, a.coordinates.lat, a.coordinates.lng);
      const distB = calculateDistanceKm(selectedHotel.coordinates.lat, selectedHotel.coordinates.lng, b.coordinates.lat, b.coordinates.lng);
      return distA - distB;
    });
  }

  const pool = [...sortedAttractions];
  const startDateObj = new Date(searchParams.startDate);

  for (let d = 1; d <= days; d++) {
    const dayDate = new Date(startDateObj);
    dayDate.setDate(dayDate.getDate() + (d - 1));
    const dateFormatted = dayDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    const activities: ItineraryActivity[] = [];

    if (d === 1) {
      // Day 1: Arrival & Check-in
      activities.push({
        id: `act-${d}-1`,
        timeSlot: 'Morning',
        time: '09:00 AM - 11:30 AM',
        title: `Arrival in ${destination.name} & Airport Transfer`,
        description: `Land at the airport/station, meet your local transfer, and enjoy your first scenic views of ${destination.name}.`,
        type: 'transit',
        location: `${destination.name} Airport`,
      });

      activities.push({
        id: `act-${d}-2`,
        timeSlot: 'Afternoon',
        time: '12:30 PM - 02:30 PM',
        title: `Check-in at ${hotelName} & Welcome Lunch`,
        description: `Unpack and freshen up. Savor your first authentic lunch tasting ${destination.famousFoods[0] || 'local delicacies'}.`,
        type: 'checkin',
        location: hotelName,
      });

      // Assign nearest attraction or relaxation
      const day1Attraction = pool.shift();
      if (day1Attraction) {
        activities.push({
          id: `act-${d}-3`,
          timeSlot: 'Evening',
          time: '04:00 PM - 07:00 PM',
          title: `Explore ${day1Attraction.name}`,
          description: `${day1Attraction.description} Perfect for an easy first evening stroll and sunset views.`,
          type: 'sightseeing',
          location: day1Attraction.location,
          attractionId: day1Attraction.id,
          estimatedCost: day1Attraction.entryFee,
        });
      } else {
        activities.push({
          id: `act-${d}-3`,
          timeSlot: 'Evening',
          time: '04:30 PM - 07:30 PM',
          title: 'Sunset Stroll & Local Market Exploration',
          description: `Wander around the vibrant lanes near ${hotelName}, pick up handcrafted souvenirs, and catch the sunset.`,
          type: 'leisure',
          location: 'Town Promenade',
        });
      }

      activities.push({
        id: `act-${d}-4`,
        timeSlot: 'Night',
        time: '08:00 PM - 10:00 PM',
        title: 'Welcome Dinner & Night Atmosphere',
        description: `Enjoy a leisure dinner sampling ${destination.famousFoods[1] || 'signature specialties'}.`,
        type: 'meal',
        location: 'Recommended Local Bistro',
      });

      itinerary.push({
        dayNumber: d,
        date: dateFormatted,
        theme: 'Arrival & Scenic Welcome',
        activities,
      });
    } else if (d === days) {
      // Last Day: Checkout & Departure
      const finalAttraction = pool.shift();
      if (finalAttraction) {
        activities.push({
          id: `act-${d}-1`,
          timeSlot: 'Morning',
          time: '08:30 AM - 11:00 AM',
          title: `Morning Visit: ${finalAttraction.name}`,
          description: `${finalAttraction.description} Capture final memories and scenic photos before wrapping up.`,
          type: 'sightseeing',
          location: finalAttraction.location,
          attractionId: finalAttraction.id,
          estimatedCost: finalAttraction.entryFee,
        });
      } else {
        activities.push({
          id: `act-${d}-1`,
          timeSlot: 'Morning',
          time: '09:00 AM - 11:00 AM',
          title: 'Relaxed Breakfast & Souvenir Shopping',
          description: `Enjoy a leisurely breakfast at ${hotelName} and buy local spices, handicrafts, and gifts.`,
          type: 'leisure',
          location: hotelName,
        });
      }

      activities.push({
        id: `act-${d}-2`,
        timeSlot: 'Afternoon',
        time: '11:30 AM - 01:00 PM',
        title: `Hotel Checkout from ${hotelName}`,
        description: 'Complete hotel checkout formalities and store bags or head straight to lunch.',
        type: 'checkout',
        location: hotelName,
      });

      activities.push({
        id: `act-${d}-3`,
        timeSlot: 'Afternoon',
        time: '01:00 PM - 02:30 PM',
        title: 'Farewell Lunch',
        description: `Celebrate a memorable trip over ${destination.famousFoods[2] || 'a hearty regional feast'}.`,
        type: 'meal',
        location: 'Heritage Cafe',
      });

      activities.push({
        id: `act-${d}-4`,
        timeSlot: 'Evening',
        time: '03:30 PM onwards',
        title: `Airport Transfer & Return Flight`,
        description: 'Head to the terminal 2.5 hours prior to departure for check-in and boarding.',
        type: 'transit',
        location: `${destination.name} Airport`,
      });

      itinerary.push({
        dayNumber: d,
        date: dateFormatted,
        theme: 'Farewell & Homeward Journey',
        activities,
      });
    } else {
      // Middle exploration days
      const morningAttraction = pool.shift();
      const afternoonAttraction = pool.shift();

      if (morningAttraction) {
        activities.push({
          id: `act-${d}-1`,
          timeSlot: 'Morning',
          time: '08:30 AM - 12:00 PM',
          title: `Morning Exploration: ${morningAttraction.name}`,
          description: `${morningAttraction.description} Timing aligns with cooler morning weather and fewer crowds.`,
          type: 'sightseeing',
          location: morningAttraction.location,
          attractionId: morningAttraction.id,
          estimatedCost: morningAttraction.entryFee,
        });
      } else {
        activities.push({
          id: `act-${d}-1`,
          timeSlot: 'Morning',
          time: '09:00 AM - 11:30 AM',
          title: 'Morning Nature Walk & Photography',
          description: `Take in the natural panoramic beauty of ${destination.name} around the neighborhood.`,
          type: 'leisure',
          location: `${destination.name} Scenic Trail`,
        });
      }

      activities.push({
        id: `act-${d}-2`,
        timeSlot: 'Afternoon',
        time: '12:30 PM - 02:00 PM',
        title: 'Lunch Break & Refreshment',
        description: `Rest during midday heat and taste fresh local dishes like ${destination.famousFoods[(d - 1) % destination.famousFoods.length]}.`,
        type: 'meal',
        location: 'Local Artisan Eatery',
      });

      if (afternoonAttraction) {
        activities.push({
          id: `act-${d}-3`,
          timeSlot: 'Afternoon',
          time: '02:30 PM - 05:30 PM',
          title: `Afternoon Visit: ${afternoonAttraction.name}`,
          description: `${afternoonAttraction.description} Opening hours: ${afternoonAttraction.openingHours}.`,
          type: 'sightseeing',
          location: afternoonAttraction.location,
          attractionId: afternoonAttraction.id,
          estimatedCost: afternoonAttraction.entryFee,
        });
      } else {
        activities.push({
          id: `act-${d}-3`,
          timeSlot: 'Afternoon',
          time: '03:00 PM - 05:30 PM',
          title: 'Cultural Heritage Walk & Tea/Coffee Pause',
          description: 'Explore quiet alleys, local architecture, and enjoy traditional brews.',
          type: 'leisure',
          location: 'Old Town District',
        });
      }

      activities.push({
        id: `act-${d}-4`,
        timeSlot: 'Evening',
        time: '06:00 PM - 08:00 PM',
        title: 'Sunset Viewpoint & Night Market',
        description: 'Watch the golden sunset over the landscape and browse vibrant street stalls.',
        type: 'leisure',
        location: 'Sunset Point',
      });

      activities.push({
        id: `act-${d}-5`,
        timeSlot: 'Night',
        time: '08:30 PM - 10:00 PM',
        title: 'Dinner & Return to Hotel',
        description: `Delightful dinner experience followed by relaxed transit back to ${hotelName}.`,
        type: 'meal',
        location: hotelName,
      });

      itinerary.push({
        dayNumber: d,
        date: dateFormatted,
        theme: `Day ${d}: In-Depth Discovery of ${morningAttraction?.name || destination.name}`,
        activities,
      });
    }
  }

  return itinerary;
}
