import React, { useMemo } from 'react';
import { MapPin, Navigation, ExternalLink, Compass, ShieldCheck } from 'lucide-react';
import { CityListing } from '../types/directory';

interface KhairabadMapPreviewProps {
  listing: CityListing;
}

// Locality baseline centroids on the stylized 600x360 SVG canvas
const LOCALITY_BASE_COORDINATES: Record<string, { x: number; y: number; label: string; lat: number; lng: number }> = {
  'Sitapur Road': { x: 165, y: 95, label: 'Sitapur Road Corridor (NH-30)', lat: 27.545, lng: 80.748 },
  'Chungi Naka': { x: 185, y: 138, label: 'Chungi Naka Junction Entry', lat: 27.541, lng: 80.752 },
  'Main Bazaar / Sabzi Mandi': { x: 310, y: 175, label: 'Central Main Bazaar & Mandi', lat: 27.534, lng: 80.758 },
  'Sarafa Market': { x: 330, y: 160, label: 'Sarafa Market Lane', lat: 27.535, lng: 80.76 },
  'Railway Station Road': { x: 225, y: 215, label: 'Station Ganj & KB Station', lat: 27.528, lng: 80.755 },
  'Civil Lines / Block Colony': { x: 265, y: 125, label: 'Civil Lines & Health Zone', lat: 27.539, lng: 80.757 },
  'Badi Sangat Road': { x: 440, y: 165, label: 'Badi Sangat Heritage Enclave', lat: 27.536, lng: 80.771 },
  'Qadam Rasul Area': { x: 385, y: 248, label: 'Qadam Rasul & Dargah Precinct', lat: 27.526, lng: 80.765 },
  'Mahmoodabad Road': { x: 470, y: 235, label: 'Mahmoodabad Road Stretch', lat: 27.525, lng: 80.778 },
};

export const KhairabadMapPreview: React.FC<KhairabadMapPreviewProps> = ({ listing }) => {
  // Deterministic calculation of specific location pin based on locality and address keywords
  const pinDetails = useMemo(() => {
    const base = LOCALITY_BASE_COORDINATES[listing.locality] || {
      x: 310,
      y: 180,
      label: listing.locality || 'Khairabad Town',
      lat: 27.5342,
      lng: 80.7583,
    };

    let offsetX = 0;
    let offsetY = 0;

    const addr = (listing.address + ' ' + listing.name).toLowerCase();

    // Specific landmark micro-adjustments
    if (addr.includes('ghanta ghar') || addr.includes('clock tower')) {
      offsetX = -12;
      offsetY = -8;
    } else if (addr.includes('post office') || addr.includes('dak khana')) {
      offsetX = 6;
      offsetY = 10;
    } else if (addr.includes('station') || addr.includes('railway')) {
      offsetX = -10;
      offsetY = 5;
    } else if (addr.includes('chc') || addr.includes('hospital')) {
      offsetX = 4;
      offsetY = -6;
    } else if (addr.includes('badi sangat') || addr.includes('mandir')) {
      offsetX = 8;
      offsetY = -5;
    } else if (addr.includes('dargah') || addr.includes('makhdoom')) {
      offsetX = 5;
      offsetY = 8;
    } else if (addr.includes('chungi') || addr.includes('toll')) {
      offsetX = -8;
      offsetY = 4;
    } else if (addr.includes('bypass') || addr.includes('nh-30') || addr.includes('nh 30')) {
      offsetX = -15;
      offsetY = -12;
    } else {
      // Deterministic pseudo-random offset using listing ID hash so multiple businesses have distinct pins
      let hash = 0;
      for (let i = 0; i < listing.id.length; i++) {
        hash = (hash << 5) - hash + listing.id.charCodeAt(i);
        hash |= 0;
      }
      offsetX = ((Math.abs(hash) % 21) - 10) * 1.5;
      offsetY = ((Math.abs(hash >> 3) % 21) - 10) * 1.5;
    }

    const finalX = Math.max(50, Math.min(550, base.x + offsetX));
    const finalY = Math.max(40, Math.min(320, base.y + offsetY));

    // Approximate GPS coordinates formatted to 4 decimals
    const approxLat = (base.lat + (180 - finalY) * 0.00012).toFixed(4);
    const approxLng = (base.lng + (finalX - 300) * 0.00015).toFixed(4);

    return {
      x: finalX,
      y: finalY,
      label: base.label,
      approxLat,
      approxLng,
    };
  }, [listing]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm space-y-0">
      {/* Map Header Status Bar */}
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
          <span className="font-bold text-slate-900 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-red-600" />
            <span>Specific Address Pin Marker</span>
          </span>
          <span className="text-[11px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 font-mono">
            {pinDetails.approxLat}° N, {pinDetails.approxLng}° E
          </span>
        </div>

        <a
          href={listing.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-900 hover:text-amber-800 bg-amber-50 hover:bg-amber-100/80 px-2.5 py-1 rounded-md border border-amber-300 transition-colors"
        >
          <span>Open Full Satellite Map</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Stylized Vector Map Canvas */}
      <div className="relative w-full h-64 sm:h-72 bg-[#eaf0f6] overflow-hidden select-none">
        <svg
          viewBox="0 0 600 360"
          className="w-full h-full object-cover"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="grid-pattern" width="28" height="28" patternUnits="userSpaceOnUse">
              <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#dbeafe" strokeWidth="0.6" />
            </pattern>

            {/* Pin Drop Shadow */}
            <filter id="pin-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0f172a" floodOpacity="0.45" />
            </filter>

            {/* Gradient for Pin */}
            <linearGradient id="red-pin-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>
          </defs>

          {/* Background Cartographic Grid */}
          <rect width="600" height="360" fill="url(#grid-pattern)" />

          {/* Municipal Town Urban Core Shading */}
          <ellipse cx="320" cy="180" rx="195" ry="125" fill="#f8fafc" opacity="0.85" />
          <ellipse cx="310" cy="180" rx="145" ry="90" fill="#f1f5f9" opacity="0.95" />

          {/* Sarayan Basin Stream */}
          <path
            d="M 20 310 C 120 280, 220 340, 360 310 C 440 290, 520 330, 580 320"
            fill="none"
            stroke="#93c5fd"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.75"
          />
          <text x="50" y="325" fill="#3b82f6" fontSize="9" fontWeight="600" fontStyle="italic">
            Sarayan Basin Stream
          </text>

          {/* Northern Railway Track */}
          <path
            d="M 60 40 L 210 210 L 330 350"
            fill="none"
            stroke="#64748b"
            strokeWidth="3.5"
            strokeDasharray="6,4"
          />
          <text x="85" y="105" fill="#64748b" fontSize="8" fontWeight="600" transform="rotate(45, 85, 105)">
            Rail Track (KB Sitapur-Lucknow)
          </text>

          {/* NH-30 Highway (Lucknow - Sitapur Bypass) */}
          <path
            d="M 90 20 Q 150 120 180 200 T 250 360"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="6"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M 90 20 Q 150 120 180 200 T 250 360"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeDasharray="8,6"
          />
          <text x="135" y="70" fill="#b45309" fontSize="9" fontWeight="bold">
            NH-30 (Sitapur Bypass)
          </text>

          {/* Town Road Network */}
          <path d="M 175 140 L 330 175 L 490 190" fill="none" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
          <path d="M 180 110 L 260 130 L 310 180" fill="none" stroke="#cbd5e1" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 210 210 L 310 180 L 390 250" fill="none" stroke="#cbd5e1" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 330 175 L 450 230 L 580 270" fill="none" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />

          {/* Key Reference Landmarks (Grey/Subdued) */}
          <g opacity="0.75">
            {/* KB Station */}
            <circle cx="210" cy="210" r="4.5" fill="#475569" />
            <text x="217" y="213" fill="#334155" fontSize="8" fontWeight="600">KB Station</text>

            {/* CHC Hospital */}
            <circle cx="260" cy="130" r="4" fill="#64748b" />
            <text x="267" y="133" fill="#334155" fontSize="8" fontWeight="600">CHC Hospital</text>

            {/* Badi Sangat */}
            <circle cx="440" cy="170" r="4" fill="#64748b" />
            <text x="447" y="173" fill="#334155" fontSize="8" fontWeight="600">Badi Sangat</text>

            {/* Qadam Rasul */}
            <circle cx="390" cy="250" r="4" fill="#64748b" />
            <text x="397" y="253" fill="#334155" fontSize="8" fontWeight="600">Qadam Rasul</text>

            {/* Chungi Naka */}
            <circle cx="180" cy="140" r="4" fill="#64748b" />
            <text x="122" y="144" fill="#334155" fontSize="8" fontWeight="600">Chungi Naka</text>
          </g>

          {/* ========================================================= */}
          {/* SPECIFIC BUSINESS LOCATION PIN MARKER AT ADDRESS LOCATION */}
          {/* ========================================================= */}
          <g transform={`translate(${pinDetails.x}, ${pinDetails.y})`}>
            {/* 1. Ground Shadow Ellipse */}
            <ellipse cx="0" cy="0" rx="9" ry="3.5" fill="#0f172a" opacity="0.35" />

            {/* 2. Concentric Pulsing Ripples */}
            <circle cx="0" cy="0" r="24" fill="#ef4444" opacity="0.2">
              <animate attributeName="r" values="8;28;8" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.45;0.05;0.45" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="0" cy="0" r="12" fill="#ef4444" opacity="0.35" />

            {/* 3. Teardrop Location Marker Pointing Down to Address */}
            <g filter="url(#pin-shadow)">
              {/* Teardrop Pin Shape */}
              <path
                d="M 0 0 C -4 -4 -13 -15 -13 -23 A 13 13 0 1 1 13 -23 C 13 -15 4 -4 0 0 Z"
                fill="url(#red-pin-grad)"
                stroke="#ffffff"
                strokeWidth="2"
              />
              {/* White Inner Badge */}
              <circle cx="0" cy="-23" r="5.5" fill="#ffffff" />
              {/* Category Center Dot */}
              <circle cx="0" cy="-23" r="2.8" fill="#991b1b" />
            </g>

            {/* 4. Target Crosshair Ring at Pinpoint Base */}
            <circle cx="0" cy="0" r="3" fill="#ffffff" stroke="#b91c1c" strokeWidth="1.5" />
          </g>

          {/* 5. Floating Interactive Address Callout Badge */}
          <g
            transform={`translate(${Math.min(Math.max(pinDetails.x - 85, 12), 420)}, ${
              pinDetails.y > 90 ? pinDetails.y - 75 : pinDetails.y + 20
            })`}
          >
            {/* Tooltip Background Card */}
            <rect
              width="170"
              height="44"
              rx="8"
              fill="#0f172a"
              opacity="0.96"
              stroke="#ef4444"
              strokeWidth="1.5"
            />
            {/* Business Title */}
            <text x="10" y="16" fill="#ffffff" fontSize="9.5" fontWeight="bold">
              {listing.name.length > 22 ? listing.name.substring(0, 20) + '...' : listing.name}
            </text>
            {/* Address / Landmark Snippet */}
            <text x="10" y="29" fill="#fca5a5" fontSize="8" fontWeight="600">
              📍 {listing.address.length > 26 ? listing.address.substring(0, 24) + '...' : listing.address}
            </text>
            {/* Verified Pin Notice */}
            <text x="10" y="39" fill="#94a3b8" fontSize="7">
              {pinDetails.label} · PIN 261131
            </text>
          </g>
        </svg>

        {/* Floating Compass Rose */}
        <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-sm p-1.5 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-[10px] text-slate-700">
          <Compass className="w-3.5 h-3.5 text-amber-600" />
          <span className="font-bold text-[9px]">N</span>
        </div>

        {/* Real-time Distance Scale Indicator */}
        <div className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-200 text-[10px] text-slate-700 font-mono flex items-center gap-1.5 shadow-xs">
          <span className="inline-block w-6 h-1 bg-red-600 rounded"></span>
          <span className="font-semibold">~1 km scale</span>
        </div>
      </div>

      {/* Map Footer Bar with Direct Address & Navigation */}
      <div className="p-3 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="text-slate-600 flex items-start gap-1.5 max-w-md">
          <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-slate-800">
              {listing.address}
            </div>
            <div className="text-[11px] text-slate-500">
              Zone: {listing.locality} · Khairabad, Sitapur (UP) – 261131
            </div>
          </div>
        </div>

        <a
          href={listing.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 border border-amber-500 rounded-lg font-bold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Get Directions &rarr;</span>
        </a>
      </div>
    </div>
  );
};
