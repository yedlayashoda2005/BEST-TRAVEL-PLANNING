import React from 'react';
import { X, Check, Star, Coffee, Luggage, Clock, Plane, Building } from 'lucide-react';
import { useTravel } from '../context/TravelContext';
import { getTripDuration, calculateHotelProximityScore } from '../utils/travelCalculations';

export const CompareModal: React.FC = () => {
  const {
    compareModalType,
    closeCompareModal,
    comparedHotelIds,
    comparedFlightIds,
    selectedDestination,
    selectedAttractionIds,
    searchParams,
    setSelectedHotelId,
    setSelectedFlightId,
    showToast,
  } = useTravel();

  if (!compareModalType) return null;

  const duration = getTripDuration(searchParams.startDate, searchParams.endDate);
  const travelers = searchParams.travelers || 1;

  // Selected attractions
  const selectedAttractions = selectedDestination.popularAttractions.filter((a) =>
    selectedAttractionIds.includes(a.id)
  );

  const comparedHotels = selectedDestination.hotels.filter((h) =>
    comparedHotelIds.includes(h.id)
  );

  const comparedFlights = selectedDestination.flights.filter((f) =>
    comparedFlightIds.includes(f.id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[88vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 p-6 relative">
        <button
          onClick={closeCompareModal}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h3 className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white flex items-center gap-2">
            {compareModalType === 'hotel' ? (
              <>
                <Building className="w-6 h-6 text-sky-500" />
                <span>Side-by-Side Hotel Comparison</span>
              </>
            ) : (
              <>
                <Plane className="w-6 h-6 text-indigo-500" />
                <span>Side-by-Side Flight Comparison</span>
              </>
            )}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Compare features, pricing, and convenience to make the best travel choice.
          </p>
        </div>

        {compareModalType === 'hotel' ? (
          comparedHotels.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              No hotels selected for comparison yet. Click "+ Add to Compare" on hotel cards.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {comparedHotels.map((h) => {
                const prox = calculateHotelProximityScore(h, selectedAttractions);
                const totalCost = h.pricePerNight * duration.nights;

                return (
                  <div
                    key={h.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <img
                        src={h.image}
                        alt={h.name}
                        className="w-full h-32 object-cover rounded-xl mb-3"
                      />
                      <h4 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                        {h.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">{h.type}</p>

                      <div className="mt-3 space-y-2 text-xs">
                        <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                          <span className="text-slate-500">Rating:</span>
                          <span className="font-bold flex items-center gap-0.5 text-emerald-600">
                            <Star className="w-3 h-3 fill-current" /> {h.rating} ({h.reviewCount})
                          </span>
                        </div>

                        <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                          <span className="text-slate-500">Avg to Sights:</span>
                          <span className="font-bold text-sky-600">{prox.averageDistanceKm} km</span>
                        </div>

                        <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                          <span className="text-slate-500">Breakfast:</span>
                          <span className="font-medium">
                            {h.breakfastIncluded ? '✓ Included' : 'Not included'}
                          </span>
                        </div>

                        <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                          <span className="text-slate-500">Cancellation:</span>
                          <span className="font-medium">
                            {h.freeCancellation ? '✓ Free' : 'Non-refundable'}
                          </span>
                        </div>

                        <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                          <span className="text-slate-500">Per Night:</span>
                          <span className="font-extrabold text-slate-900 dark:text-white">
                            ₹{h.pricePerNight.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <div className="flex justify-between py-1 font-bold text-sky-600 dark:text-sky-400">
                          <span>{duration.nights} Nights Total:</span>
                          <span>₹{totalCost.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedHotelId(h.id);
                        closeCompareModal();
                        showToast(`Selected ${h.name}`);
                      }}
                      className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs"
                    >
                      Select This Hotel
                    </button>
                  </div>
                );
              })}
            </div>
          )
        ) : comparedFlights.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs">
            No flights selected for comparison yet. Click "+ Compare" on flight cards.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {comparedFlights.map((f) => {
              const totalCost = f.pricePerPerson * travelers;

              return (
                <div
                  key={f.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center font-bold text-indigo-600 mb-2">
                      {f.airline.slice(0, 2)}
                    </div>
                    <h4 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                      {f.airline}
                    </h4>
                    <p className="text-[11px] text-slate-500">{f.flightNumber}</p>

                    <div className="mt-3 space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                        <span className="text-slate-500">Departure:</span>
                        <span className="font-bold">{f.departureTime}</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                        <span className="text-slate-500">Arrival:</span>
                        <span className="font-bold">{f.arrivalTime}</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                        <span className="text-slate-500">Duration:</span>
                        <span className="font-medium">{f.duration}</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                        <span className="text-slate-500">Stops:</span>
                        <span className="font-semibold text-emerald-600">
                          {f.stops === 0 ? 'Non-Stop' : `${f.stops} Stop`}
                        </span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                        <span className="text-slate-500">Per Person:</span>
                        <span className="font-extrabold text-slate-900 dark:text-white">
                          ₹{f.pricePerPerson.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="flex justify-between py-1 font-bold text-indigo-600 dark:text-indigo-400">
                        <span>{travelers} Travelers:</span>
                        <span>₹{totalCost.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFlightId(f.id);
                      closeCompareModal();
                      showToast(`Selected ${f.airline}`);
                    }}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                  >
                    Select This Flight
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
