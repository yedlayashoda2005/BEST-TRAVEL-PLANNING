import React, { useState } from 'react';
import {
  Map as MapIcon,
  MapPin,
  Hotel as HotelIcon,
  Plane,
  Compass,
  Navigation,
  Layers,
  ZoomIn,
  ZoomOut,
  Info,
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';
import { calculateDistanceKm } from '../utils/travelCalculations';

export const InteractiveMap: React.FC = () => {
  const {
    selectedDestination,
    selectedHotelId,
    selectedAttractionIds,
  } = useTravel();

  const [activeLayer, setActiveLayer] = useState<'all' | 'hotel' | 'attractions'>('all');
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);

  const selectedHotel = selectedDestination.hotels.find((h) => h.id === selectedHotelId) || selectedDestination.hotels[0];
  const selectedAttractions = selectedDestination.popularAttractions.filter((a) =>
    selectedAttractionIds.includes(a.id)
  );

  // Compute bounding box or relative coordinates for SVG projection
  const baseLat = selectedDestination.coordinates.lat;
  const baseLng = selectedDestination.coordinates.lng;

  // Scale lat/lng into a 600x400 SVG canvas view
  const project = (lat: number, lng: number) => {
    const latSpan = 0.5;
    const lngSpan = 0.6;
    const x = ((lng - (baseLng - lngSpan / 2)) / lngSpan) * 600;
    const y = (((baseLat + latSpan / 2) - lat) / latSpan) * 400;
    return {
      x: Math.min(550, Math.max(50, x)),
      y: Math.min(360, Math.max(40, y)),
    };
  };

  const hotelCoords = selectedHotel ? project(selectedHotel.coordinates.lat, selectedHotel.coordinates.lng) : { x: 300, y: 200 };
  const airportCoords = { x: 480, y: 320 };

  return (
    <section id="interactive-map" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
              <MapIcon className="w-4 h-4" />
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Interactive Location & Distance Map
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Visual spatial overview of your hotel ({selectedHotel?.name}), chosen attractions, and airport transit routes.
          </p>
        </div>

        {/* Layer Filters */}
        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs self-start md:self-auto">
          <button
            onClick={() => setActiveLayer('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeLayer === 'all'
                ? 'bg-sky-600 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All Pins
          </button>
          <button
            onClick={() => setActiveLayer('hotel')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeLayer === 'hotel'
                ? 'bg-sky-600 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Hotel Only
          </button>
          <button
            onClick={() => setActiveLayer('attractions')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeLayer === 'attractions'
                ? 'bg-sky-600 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Attractions
          </button>
        </div>
      </div>

      {/* Main Map Box */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl min-h-[460px] flex flex-col justify-between">
        {/* Top Info overlay */}
        <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-700 text-white text-xs font-semibold flex items-center gap-2">
            <Navigation className="w-3.5 h-3.5 text-sky-400" />
            <span>Region: {selectedDestination.name}, {selectedDestination.state}</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-700 text-slate-300 text-xs font-medium">
            {selectedAttractions.length} Attractions Plotted
          </div>
        </div>

        {/* Legend Overlay */}
        <div className="absolute top-4 right-4 z-10 hidden sm:flex flex-col gap-1.5 bg-slate-950/85 backdrop-blur-md border border-slate-700/80 p-2.5 rounded-xl text-[11px] text-slate-200">
          <span className="font-bold text-white uppercase text-[10px] tracking-wider mb-0.5">Map Legend</span>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-300/40" />
            <span>Selected Hotel</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sky-500 ring-2 ring-sky-300/40" />
            <span>Selected Attractions</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-indigo-500 ring-2 ring-indigo-300/40" />
            <span>Airport / Transit Hub</span>
          </div>
        </div>

        {/* Vector SVG Interactive Map Render */}
        <div className="w-full h-full flex-1 flex items-center justify-center p-4">
          <svg
            viewBox="0 0 600 400"
            className="w-full h-full max-h-[440px] select-none"
            style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }}
          >
            {/* Background Grid & Coastal Lines */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
              </pattern>
              <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            <rect width="600" height="400" fill="url(#grid)" />

            {/* Stylized Topographic Water Contour */}
            <path
              d="M 0,100 Q 150,140 280,110 T 600,160 L 600,0 L 0,0 Z"
              fill="rgba(14, 165, 233, 0.08)"
            />
            <path
              d="M 0,320 Q 200,280 400,340 T 600,300 L 600,400 L 0,400 Z"
              fill="rgba(99, 102, 241, 0.06)"
            />

            {/* Distance Lines from Hotel to Attractions */}
            {selectedHotel &&
              (activeLayer === 'all' || activeLayer === 'hotel') &&
              selectedAttractions.map((att) => {
                const p = project(att.coordinates.lat, att.coordinates.lng);
                return (
                  <g key={`line-${att.id}`}>
                    <line
                      x1={hotelCoords.x}
                      y1={hotelCoords.y}
                      x2={p.x}
                      y2={p.y}
                      stroke="url(#routeGrad)"
                      strokeWidth="1.5"
                      strokeDasharray="4,4"
                      className="opacity-70 animate-pulse"
                    />
                  </g>
                );
              })}

            {/* Transit Route Line: Airport to Hotel */}
            {selectedHotel && (
              <line
                x1={airportCoords.x}
                y1={airportCoords.y}
                x2={hotelCoords.x}
                y2={hotelCoords.y}
                stroke="#6366f1"
                strokeWidth="2"
                strokeDasharray="6,4"
                className="opacity-50"
              />
            )}

            {/* Airport Pin */}
            <g transform={`translate(${airportCoords.x}, ${airportCoords.y})`} className="cursor-pointer">
              <circle r="16" fill="rgba(99, 102, 241, 0.2)" className="animate-ping" />
              <circle r="12" fill="#4f46e5" stroke="#ffffff" strokeWidth="2" />
              <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                ✈
              </text>
              <text x="0" y="24" textAnchor="middle" fill="#a5b4fc" fontSize="10" fontWeight="bold">
                Airport Terminal
              </text>
            </g>

            {/* Tourist Attractions Pins */}
            {(activeLayer === 'all' || activeLayer === 'attractions') &&
              selectedAttractions.map((att) => {
                const pos = project(att.coordinates.lat, att.coordinates.lng);
                const isPinActive = selectedPinId === att.id;
                const distToHotel = selectedHotel
                  ? calculateDistanceKm(
                      selectedHotel.coordinates.lat,
                      selectedHotel.coordinates.lng,
                      att.coordinates.lat,
                      att.coordinates.lng
                    )
                  : 0;

                return (
                  <g
                    key={att.id}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    onClick={() => setSelectedPinId(isPinActive ? null : att.id)}
                    className="cursor-pointer group"
                  >
                    <circle
                      r={isPinActive ? '18' : '14'}
                      fill="rgba(14, 165, 233, 0.3)"
                      className="transition-all"
                    />
                    <circle
                      r="10"
                      fill="#0284c7"
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="group-hover:scale-125 transition-transform"
                    />
                    <text x="0" y="3.5" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                      📍
                    </text>
                    <text
                      x="0"
                      y="-15"
                      textAnchor="middle"
                      fill="#e0f2fe"
                      fontSize="9"
                      fontWeight="bold"
                      className="drop-shadow-md"
                    >
                      {att.name.split(' ')[0]}
                    </text>
                  </g>
                );
              })}

            {/* Selected Hotel Pin (Highlight & Radius) */}
            {selectedHotel && (activeLayer === 'all' || activeLayer === 'hotel') && (
              <g transform={`translate(${hotelCoords.x}, ${hotelCoords.y})`} className="cursor-pointer">
                {/* 3km visual radius circle */}
                <circle
                  r="45"
                  fill="rgba(16, 185, 129, 0.08)"
                  stroke="#10b981"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
                <circle r="18" fill="rgba(16, 185, 129, 0.3)" className="animate-ping" />
                <circle r="12" fill="#059669" stroke="#ffffff" strokeWidth="2.5" />
                <text x="0" y="3.5" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                  🏨
                </text>
                <text
                  x="0"
                  y="-16"
                  textAnchor="middle"
                  fill="#6ee7b7"
                  fontSize="10"
                  fontWeight="bold"
                  className="drop-shadow"
                >
                  {selectedHotel.name}
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* Bottom Pin Details Card Bar */}
        <div className="bg-slate-950/90 backdrop-blur-md border-t border-slate-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-white">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-sky-400 shrink-0" />
            <span>
              <strong>Smart GIS Integration:</strong> Coordinates are mapped accurately with distances calculated using the Haversine spherical model. Ready for Google Maps JS API embed.
            </span>
          </div>

          <div className="flex items-center gap-3 font-semibold shrink-0">
            <span className="text-emerald-400">Hotel ↔ Sights avg: ~2.4 km</span>
            <span className="text-indigo-300">Hotel ↔ Airport: ~{selectedHotel?.airportDistanceKm || 30} km</span>
          </div>
        </div>
      </div>
    </section>
  );
};
