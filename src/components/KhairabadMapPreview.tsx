import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Navigation,
  ExternalLink,
  Compass,
  Layers,
  Info,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react';
import { CityListing } from '../types/directory';

interface KhairabadMapPreviewProps {
  listing: CityListing;
}

interface LocalityZone {
  id: string;
  name: string;
  label: string;
  color: string;
  borderColor: string;
  bgFill: string;
  polygon: string;
  labelPos: { x: number; y: number };
  landmark: string;
  description: string;
  centerCoords: { lat: number; lng: number };
}

// All 9 Municipal Localities of Khairabad with geographic polygon boundaries (ViewBox: 800 x 500)
const KHAIRABAD_LOCALITIES: LocalityZone[] = [
  {
    id: 'sitapur-road',
    name: 'Sitapur Road',
    label: 'Sitapur Road Corridor',
    color: '#0284c7', // Sky
    borderColor: '#0369a1',
    bgFill: 'rgba(2, 132, 199, 0.16)',
    polygon: '140,50 260,50 270,120 190,140 130,110',
    labelPos: { x: 195, y: 90 },
    landmark: 'NH-30 Highway Link & Chungi North',
    description: 'Northern arterial road connecting Sitapur HQ to Khairabad entrance.',
    centerCoords: { lat: 27.545, lng: 80.748 },
  },
  {
    id: 'chungi-naka',
    name: 'Chungi Naka',
    label: 'Chungi Naka Entry',
    color: '#d97706', // Amber
    borderColor: '#b45309',
    bgFill: 'rgba(217, 119, 6, 0.18)',
    polygon: '190,140 280,120 310,175 240,195 180,165',
    labelPos: { x: 240, y: 160 },
    landmark: 'Toll Chowki, Auto Stand & Gateway',
    description: 'Historic town gate and primary passenger transit convergence.',
    centerCoords: { lat: 27.541, lng: 80.752 },
  },
  {
    id: 'civil-lines',
    name: 'Civil Lines / Block Colony',
    label: 'Civil Lines & Health Zone',
    color: '#059669', // Emerald
    borderColor: '#047857',
    bgFill: 'rgba(5, 150, 105, 0.16)',
    polygon: '270,120 410,100 430,170 330,180 310,140',
    labelPos: { x: 345, y: 145 },
    landmark: 'CHC Hospital, Block Office & Govt Campus',
    description: 'Administrative and central public healthcare zone of Khairabad.',
    centerCoords: { lat: 27.539, lng: 80.757 },
  },
  {
    id: 'main-bazaar',
    name: 'Main Bazaar / Sabzi Mandi',
    label: 'Main Bazaar & Sabzi Mandi',
    color: '#dc2626', // Red
    borderColor: '#b91c1c',
    bgFill: 'rgba(220, 38, 38, 0.18)',
    polygon: '310,180 430,170 420,240 330,250 290,210',
    labelPos: { x: 365, y: 210 },
    landmark: 'Ghanta Ghar (Clock Tower) & Mandi',
    description: 'Vibrant municipal heart with trade shops, vegetables & general stores.',
    centerCoords: { lat: 27.534, lng: 80.758 },
  },
  {
    id: 'sarafa-market',
    name: 'Sarafa Market',
    label: 'Sarafa Market Lane',
    color: '#9333ea', // Purple
    borderColor: '#7e22ce',
    bgFill: 'rgba(147, 51, 234, 0.18)',
    polygon: '380,165 470,160 460,215 395,215',
    labelPos: { x: 425, y: 190 },
    landmark: 'Traditional Goldsmiths & Textile Chowk',
    description: 'Centuries-old gold, silver jewellery and bridal cloth market.',
    centerCoords: { lat: 27.535, lng: 80.76 },
  },
  {
    id: 'railway-station-road',
    name: 'Railway Station Road',
    label: 'Railway Station Road',
    color: '#475569', // Slate
    borderColor: '#334155',
    bgFill: 'rgba(71, 85, 105, 0.18)',
    polygon: '150,200 250,190 280,270 190,290 140,250',
    labelPos: { x: 210, y: 245 },
    landmark: 'Khairabad Station (KB) & Station Ganj',
    description: 'NER rail transit line corridor and warehouse transport strip.',
    centerCoords: { lat: 27.528, lng: 80.755 },
  },
  {
    id: 'sangat-road',
    name: 'Badi Sangat Road',
    label: 'Badi Sangat Heritage Enclave',
    color: '#ea580c', // Orange
    borderColor: '#c2410c',
    bgFill: 'rgba(234, 88, 12, 0.18)',
    polygon: '470,140 620,130 630,230 460,230',
    labelPos: { x: 540, y: 180 },
    landmark: 'Badi Sangat Temple Complex & Mela Grounds',
    description: 'Expansive historic spiritual complex, ponds and festival grounds.',
    centerCoords: { lat: 27.536, lng: 80.771 },
  },
  {
    id: 'qadam-rasul',
    name: 'Qadam Rasul Area',
    label: 'Qadam Rasul & Dargah Precinct',
    color: '#0891b2', // Cyan
    borderColor: '#0e7490',
    bgFill: 'rgba(8, 145, 178, 0.18)',
    polygon: '330,250 450,240 430,340 310,330',
    labelPos: { x: 375, y: 290 },
    landmark: 'Qadam Rasul Shrine, Imambaras & Dargah Chahlum',
    description: 'Revered Awadhi architectural monuments and Sufi heritage precinct.',
    centerCoords: { lat: 27.526, lng: 80.765 },
  },
  {
    id: 'mahmoodabad-road',
    name: 'Mahmoodabad Road',
    label: 'Mahmoodabad Road & Lawns',
    color: '#16a34a', // Green
    borderColor: '#15803d',
    bgFill: 'rgba(22, 163, 74, 0.18)',
    polygon: '460,230 630,230 650,340 450,330',
    labelPos: { x: 545, y: 285 },
    landmark: 'Biswan Bypass, T M Lawn & Marriage Lawns',
    description: 'Eastern development stretch with marriage banquets & intercity highway.',
    centerCoords: { lat: 27.525, lng: 80.778 },
  },
];

// Municipal boundary path coordinates enclosing all wards of Khairabad town
const MUNICIPAL_BORDER_POLYGON =
  '120,40 280,35 440,80 640,110 670,240 660,360 480,365 310,355 180,310 125,230 110,110';

export const KhairabadMapPreview: React.FC<KhairabadMapPreviewProps> = ({ listing }) => {
  const [selectedLocalityId, setSelectedLocalityId] = useState<string | null>(null);
  const [showBoundaries, setShowBoundaries] = useState(true);
  const [showAllLocalities, setShowAllLocalities] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Pin details mapped to the listing's locality
  const pinDetails = useMemo(() => {
    const matchedZone =
      KHAIRABAD_LOCALITIES.find(
        (z) => z.name.toLowerCase() === listing.locality.toLowerCase()
      ) || KHAIRABAD_LOCALITIES[3]; // default to main bazaar

    let offsetX = 0;
    let offsetY = 0;
    const addr = (listing.address + ' ' + listing.name).toLowerCase();

    // Specific landmark micro-adjustments
    if (addr.includes('ghanta ghar') || addr.includes('clock tower')) {
      offsetX = -8;
      offsetY = -12;
    } else if (addr.includes('chc') || addr.includes('hospital')) {
      offsetX = 10;
      offsetY = -10;
    } else if (addr.includes('station') || addr.includes('railway')) {
      offsetX = -12;
      offsetY = 8;
    } else if (addr.includes('badi sangat') || addr.includes('chandra')) {
      offsetX = 15;
      offsetY = -5;
    } else if (addr.includes('qadam rasul') || addr.includes('dargah')) {
      offsetX = 5;
      offsetY = 12;
    } else if (addr.includes('jp lawns') || addr.includes('t m lawn')) {
      offsetX = 20;
      offsetY = 18;
    } else {
      let hash = 0;
      for (let i = 0; i < listing.id.length; i++) {
        hash = (hash << 5) - hash + listing.id.charCodeAt(i);
        hash |= 0;
      }
      offsetX = ((Math.abs(hash) % 25) - 12);
      offsetY = ((Math.abs(hash >> 3) % 25) - 12);
    }

    const finalX = matchedZone.labelPos.x + offsetX;
    const finalY = matchedZone.labelPos.y + offsetY;

    const approxLat = (matchedZone.centerCoords.lat + (220 - finalY) * 0.0001).toFixed(4);
    const approxLng = (matchedZone.centerCoords.lng + (finalX - 380) * 0.00012).toFixed(4);

    return {
      x: finalX,
      y: finalY,
      zone: matchedZone,
      approxLat,
      approxLng,
    };
  }, [listing]);

  // Current active locality highlighting (either hovered/selected or matching the listing)
  const activeZone =
    KHAIRABAD_LOCALITIES.find((z) => z.id === selectedLocalityId) || pinDetails.zone;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm space-y-0">
      {/* Top Map Action Bar */}
      <div className="px-4 py-3 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-slate-100 flex items-center gap-1.5 font-display text-sm">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Khairabad Municipal Town Map &amp; Boundaries</span>
          </span>
          <span className="text-[10px] bg-slate-800 text-amber-300 px-2 py-0.5 rounded border border-slate-700 font-mono">
            Nagar Palika Parishad (PIN: 261131)
          </span>
        </div>

        {/* Layer Toggles & Google Maps link */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowBoundaries(!showBoundaries)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
              showBoundaries
                ? 'bg-amber-400 text-slate-950 border-amber-300'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Municipal Border</span>
          </button>

          <button
            onClick={() => setShowAllLocalities(!showAllLocalities)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
              showAllLocalities
                ? 'bg-sky-500 text-white border-sky-400'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <span>All Localities</span>
          </button>

          <a
            href={listing.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 flex items-center gap-1 transition-colors"
          >
            <span>Live Satellite</span>
            <ExternalLink className="w-3 h-3 text-slate-600" />
          </a>
        </div>
      </div>

      {/* Main High-Fidelity Static SVG Map Canvas (800x440) */}
      <div className="relative w-full h-80 sm:h-96 md:h-[440px] bg-[#f1f5f9] overflow-hidden select-none">
        <svg
          viewBox="0 0 800 440"
          className="w-full h-full object-cover transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})` }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Background Map Grid */}
            <pattern id="static-map-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
            </pattern>

            {/* Municipal Border Dash Gradient */}
            <linearGradient id="muni-border-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>

            {/* Pin Glow Shadow */}
            <filter id="m-pin-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#991b1b" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* 1. Base Grid Layer */}
          <rect width="800" height="440" fill="url(#static-map-grid)" />

          {/* 2. Outer Geographic Boundary Surrounds (Rural Sitapur District Landscape) */}
          <rect width="800" height="440" fill="#f8fafc" opacity="0.6" />

          {/* 3. Southern Boundary: Sarayan River Basin */}
          <path
            d="M 10 395 C 160 360, 280 430, 450 395 C 570 370, 680 420, 790 405"
            fill="none"
            stroke="#93c5fd"
            strokeWidth="16"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M 10 395 C 160 360, 280 430, 450 395 C 570 370, 680 420, 790 405"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeDasharray="10,6"
            opacity="0.6"
          />
          <text x="60" y="420" fill="#1d4ed8" fontSize="10" fontWeight="bold" fontStyle="italic">
            ≈ Sarayan River Basin (South Boundary)
          </text>

          {/* 4. Western Boundary: NH-30 Sitapur-Lucknow Highway Corridor */}
          <path
            d="M 70 20 Q 120 160 135 240 T 170 430"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d="M 70 20 Q 120 160 135 240 T 170 430"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeDasharray="8,6"
          />
          <text
            x="35"
            y="70"
            fill="#b45309"
            fontSize="10"
            fontWeight="bold"
            transform="rotate(62, 50, 70)"
          >
            NH-30 Lucknow-Sitapur Bypass
          </text>

          {/* 5. Railway Line Boundary (NER Sitapur-Lucknow) */}
          <path
            d="M 50 40 L 170 230 L 250 420"
            fill="none"
            stroke="#64748b"
            strokeWidth="4"
            strokeDasharray="8,5"
          />
          <text
            x="65"
            y="130"
            fill="#475569"
            fontSize="8.5"
            fontWeight="600"
            transform="rotate(58, 65, 130)"
          >
            NER Railway (KB Station Track)
          </text>

          {/* 6. Eastern Bypass Boundary (Khairabad-Biswan Bypass Road) */}
          <path
            d="M 440 70 L 640 160 L 750 320"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <text x="640" y="270" fill="#64748b" fontSize="8.5" fontWeight="600">
            Khairabad-Biswan Bypass
          </text>

          {/* ========================================================= */}
          {/* 7. ALL 9 DEMARCATED LOCALITY BOUNDARY POLYGONS */}
          {/* ========================================================= */}
          {showAllLocalities && (
            <g id="locality-zones">
              {KHAIRABAD_LOCALITIES.map((loc) => {
                const isSelected = loc.id === activeZone.id;
                return (
                  <g
                    key={loc.id}
                    onClick={() => setSelectedLocalityId(loc.id)}
                    className="cursor-pointer transition-all duration-200"
                  >
                    {/* Zone Boundary Polygon */}
                    <polygon
                      points={loc.polygon}
                      fill={isSelected ? loc.bgFill.replace('0.16', '0.35').replace('0.18', '0.38') : loc.bgFill}
                      stroke={loc.borderColor}
                      strokeWidth={isSelected ? '2.8' : '1.5'}
                      strokeDasharray={isSelected ? 'none' : '4,2'}
                      className="hover:opacity-90"
                    />

                    {/* Zone Locality Center Label Banner */}
                    <g transform={`translate(${loc.labelPos.x}, ${loc.labelPos.y})`}>
                      <rect
                        x={-(loc.label.length * 3.2)}
                        y="-10"
                        width={loc.label.length * 6.4}
                        height="20"
                        rx="5"
                        fill="#ffffff"
                        opacity={isSelected ? '0.98' : '0.88'}
                        stroke={loc.borderColor}
                        strokeWidth={isSelected ? '1.8' : '0.8'}
                      />
                      <circle
                        cx={-(loc.label.length * 3.2) + 7}
                        cy="0"
                        r="3.5"
                        fill={loc.color}
                      />
                      <text
                        x={-(loc.label.length * 3.2) + 14}
                        y="3.5"
                        fill="#0f172a"
                        fontSize="8.5"
                        fontWeight={isSelected ? 'bold' : '600'}
                      >
                        {loc.name}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>
          )}

          {/* ========================================================= */}
          {/* 8. KHAIRABAD NAGAR PALIKA PARISHAD MUNICIPAL BOUNDARY */}
          {/* ========================================================= */}
          {showBoundaries && (
            <g id="municipal-boundary" pointerEvents="none">
              {/* Outer boundary buffer shadow */}
              <polygon
                points={MUNICIPAL_BORDER_POLYGON}
                fill="none"
                stroke="#d97706"
                strokeWidth="7"
                opacity="0.25"
              />
              {/* Primary Boundary Line */}
              <polygon
                points={MUNICIPAL_BORDER_POLYGON}
                fill="none"
                stroke="url(#muni-border-grad)"
                strokeWidth="3.2"
                strokeDasharray="9,5"
              />

              {/* Boundary Corner Beacons */}
              <g fill="#d97706" stroke="#ffffff" strokeWidth="1.5">
                <circle cx="120" cy="40" r="4.5" />
                <circle cx="280" cy="35" r="4.5" />
                <circle cx="640" cy="110" r="4.5" />
                <circle cx="660" cy="360" r="4.5" />
                <circle cx="310" cy="355" r="4.5" />
                <circle cx="125" cy="230" r="4.5" />
              </g>

              {/* Municipal Boundary Title Tag */}
              <g transform="translate(450, 48)">
                <rect
                  x="0"
                  y="0"
                  width="200"
                  height="22"
                  rx="6"
                  fill="#78350f"
                  opacity="0.95"
                />
                <text x="10" y="14" fill="#fef3c7" fontSize="8.5" fontWeight="bold">
                  ★ Khairabad Municipal Boundary Limit
                </text>
              </g>
            </g>
          )}

          {/* 9. Key Connecting Municipal Streets */}
          <path d="M 210 140 L 330 180 L 450 190 L 590 200" fill="none" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
          <path d="M 240 195 L 340 180 L 380 280" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 330 180 L 410 100" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 430 170 L 530 250 L 640 280" fill="none" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />

          {/* 10. Core Landmarks (Icons) */}
          <g opacity="0.9">
            {/* KB Station */}
            <circle cx="170" cy="245" r="4" fill="#334155" />
            <text x="178" y="248" fill="#334155" fontSize="8" fontWeight="bold">KB Station</text>

            {/* CHC Hospital */}
            <circle cx="350" cy="130" r="4" fill="#047857" />
            <text x="357" y="133" fill="#065f46" fontSize="8" fontWeight="bold">CHC Hospital</text>

            {/* Ghanta Ghar */}
            <rect x="340" y="205" width="8" height="8" rx="2" fill="#b91c1c" />
            <text x="352" y="212" fill="#991b1b" fontSize="8" fontWeight="bold">Ghanta Ghar</text>

            {/* Badi Sangat */}
            <circle cx="560" cy="165" r="4.5" fill="#c2410c" />
            <text x="568" y="168" fill="#9a3412" fontSize="8" fontWeight="bold">Badi Sangat</text>

            {/* Qadam Rasul */}
            <circle cx="400" cy="290" r="4.5" fill="#0e7490" />
            <text x="408" y="293" fill="#155e75" fontSize="8" fontWeight="bold">Qadam Rasul</text>

            {/* Chungi Toll */}
            <circle cx="210" cy="150" r="4" fill="#b45309" />
            <text x="150" y="153" fill="#92400e" fontSize="8" fontWeight="bold">Chungi Naka</text>
          </g>

          {/* ========================================================= */}
          {/* 11. CURRENT PLACE PINPOINT MARKER */}
          {/* ========================================================= */}
          <g transform={`translate(${pinDetails.x}, ${pinDetails.y})`}>
            {/* Ground Shadow */}
            <ellipse cx="0" cy="0" rx="10" ry="4" fill="#0f172a" opacity="0.4" />

            {/* Concentric Pulse Rings */}
            <circle cx="0" cy="0" r="26" fill="#ef4444" opacity="0.2">
              <animate attributeName="r" values="8;30;8" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.45;0.05;0.45" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="0" cy="0" r="14" fill="#ef4444" opacity="0.35" />

            {/* Teardrop Pin */}
            <g filter="url(#m-pin-glow)">
              <path
                d="M 0 0 C -5 -5 -15 -18 -15 -27 A 15 15 0 1 1 15 -27 C 15 -18 5 -5 0 0 Z"
                fill="#dc2626"
                stroke="#ffffff"
                strokeWidth="2.5"
              />
              <circle cx="0" cy="-27" r="6.5" fill="#ffffff" />
              <circle cx="0" cy="-27" r="3.2" fill="#991b1b" />
            </g>

            {/* Pinpoint Anchor Dot */}
            <circle cx="0" cy="0" r="3.5" fill="#ffffff" stroke="#b91c1c" strokeWidth="2" />
          </g>

          {/* 12. Floating Selected Place Info Badge Overlay */}
          <g
            transform={`translate(${Math.min(Math.max(pinDetails.x - 90, 15), 590)}, ${
              pinDetails.y > 110 ? pinDetails.y - 75 : pinDetails.y + 22
            })`}
          >
            <rect
              width="195"
              height="48"
              rx="9"
              fill="#0f172a"
              opacity="0.97"
              stroke="#ef4444"
              strokeWidth="2"
            />
            {/* Place Name */}
            <text x="12" y="16" fill="#ffffff" fontSize="9.5" fontWeight="bold">
              {listing.name.length > 25 ? listing.name.substring(0, 23) + '...' : listing.name}
            </text>
            {/* Address */}
            <text x="12" y="30" fill="#fca5a5" fontSize="8" fontWeight="600">
              📍 {listing.address.length > 30 ? listing.address.substring(0, 28) + '...' : listing.address}
            </text>
            {/* Locality & PIN */}
            <text x="12" y="42" fill="#cbd5e1" fontSize="7.5">
              Locality: <tspan fill="#fde047" fontWeight="bold">{pinDetails.zone.name}</tspan> · PIN 261131
            </text>
          </g>
        </svg>

        {/* Floating Compass Card */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2 py-1.5 rounded-xl border border-slate-200 shadow-md flex items-center gap-1.5 text-xs text-slate-800">
          <Compass className="w-4 h-4 text-amber-600 animate-spin-slow" />
          <div className="text-right leading-none">
            <span className="font-extrabold text-[11px] block text-slate-900">N</span>
            <span className="text-[9px] text-slate-500 font-mono">27.53° N</span>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 shadow-md flex flex-col p-1 gap-1 text-slate-700">
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
            className="p-1 hover:bg-slate-100 rounded text-slate-800"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.9, z - 0.1))}
            className="p-1 hover:bg-slate-100 rounded text-slate-800"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          {zoomLevel !== 1 && (
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 hover:bg-slate-100 rounded text-[9px] font-bold text-amber-800"
              title="Reset Zoom"
            >
              1x
            </button>
          )}
        </div>

        {/* Map Scale & Boundary Indicator */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700 font-mono flex items-center gap-2 shadow-xs">
          <span className="inline-block w-8 h-1.5 bg-amber-500 rounded"></span>
          <span className="text-[11px] font-bold text-slate-900">~1.5 km Town Span</span>
          <span className="text-[10px] text-slate-500 hidden sm:inline">| Nagar Palika Parishad</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 13. ALL LOCALITIES & BOUNDARIES INTERACTIVE DIRECTORY LEGEND */}
      {/* ========================================================= */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 font-display">
            <Layers className="w-3.5 h-3.5 text-amber-600" />
            <span>Khairabad Localities &amp; Boundary Zones ({KHAIRABAD_LOCALITIES.length})</span>
          </h4>
          <span className="text-[11px] text-slate-500">
            Click any locality to highlight on map
          </span>
        </div>

        {/* Interactive Locality Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {KHAIRABAD_LOCALITIES.map((loc) => {
            const isTarget = loc.name.toLowerCase() === listing.locality.toLowerCase();
            const isSelected = loc.id === activeZone.id;

            return (
              <button
                key={loc.id}
                onClick={() => setSelectedLocalityId(loc.id)}
                className={`text-left p-2.5 rounded-xl text-xs transition-all border flex items-start gap-2.5 ${
                  isSelected
                    ? 'bg-white border-amber-500 shadow-sm ring-1 ring-amber-400'
                    : isTarget
                    ? 'bg-amber-50/70 border-amber-300 text-slate-900'
                    : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                {/* Color swatch indicator */}
                <span
                  className="w-3 h-3 rounded-md shrink-0 mt-0.5 shadow-2xs"
                  style={{ backgroundColor: loc.color }}
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-slate-900 truncate">
                      {loc.name}
                    </span>
                    {isTarget && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 shrink-0">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">
                    {loc.landmark}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Map Footer Bar with Direct Address & Navigation */}
      <div className="p-3.5 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="text-slate-600 flex items-start gap-2 max-w-lg">
          <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-slate-900">
              {listing.name} · {listing.address}
            </div>
            <div className="text-[11px] text-slate-500">
              Locality: <strong className="text-slate-800">{listing.locality}</strong> · Khairabad, Sitapur (UP) – 261131
            </div>
          </div>
        </div>

        <a
          href={listing.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 border border-amber-500 rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-xs"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Get Directions to {listing.name} &rarr;</span>
        </a>
      </div>
    </div>
  );
};
