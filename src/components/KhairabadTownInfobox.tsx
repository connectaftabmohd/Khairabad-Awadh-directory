import React, { useState } from 'react';
import {
  MapPin,
  Building2,
  Users,
  Compass,
  Landmark,
  Globe,
  Maximize2,
  ExternalLink,
  Car,
  Layers,
  Clock,
  Navigation,
  ShieldCheck,
  CheckCircle2,
  Layers as LayersIcon,
  Sparkles,
  Info,
} from 'lucide-react';
import { KHAIRABAD_CITY_INFO } from '../data/khairabadData';

interface StaticMapLocality {
  id: string;
  name: string;
  nameHi: string;
  color: string;
  stroke: string;
  bgFill: string;
  polygon: string;
  labelPos: { x: number; y: number };
  landmark: string;
  wardNumber: string;
  description: string;
}

// All 11 Municipal Localities & Wards of Khairabad Awadh with vibrant color fills and boundary coordinates
const KHAIRABAD_MAP_LOCALITIES: StaticMapLocality[] = [
  {
    id: 'sitapur-road',
    name: 'Sitapur Road Corridor',
    nameHi: 'सीतापुर रोड कॉरिडोर',
    color: '#0284c7', // Sky blue
    stroke: '#0369a1',
    bgFill: 'rgba(2, 132, 199, 0.28)',
    polygon: '120,70 290,50 310,130 200,160 110,130',
    labelPos: { x: 200, y: 105 },
    landmark: 'NH-30 Highway Link & North Toll Checkpost',
    wardNumber: 'Ward 01 · Northern Gateway',
    description: 'Northern gateway artery connecting Sitapur District HQ directly with Khairabad entrance.',
  },
  {
    id: 'chungi-naka',
    name: 'Chungi Naka / Entry Chowki',
    nameHi: 'चुंगी नाका',
    color: '#d97706', // Amber gold
    stroke: '#b45309',
    bgFill: 'rgba(217, 119, 6, 0.32)',
    polygon: '110,130 200,160 280,140 310,210 210,230 110,180',
    labelPos: { x: 195, y: 185 },
    landmark: 'Historic Toll Chowki, Auto Stand & Town Gateway',
    wardNumber: 'Ward 03 · Gateway Chowki',
    description: 'Bustling transit threshold, passenger auto stand and gateway into central Khairabad.',
  },
  {
    id: 'civil-lines',
    name: 'Civil Lines & Health Zone',
    nameHi: 'सिविल लाइन्स / स्वास्थ्य क्षेत्र',
    color: '#059669', // Emerald green
    stroke: '#047857',
    bgFill: 'rgba(5, 150, 105, 0.28)',
    polygon: '290,50 460,70 480,150 350,170 310,130',
    labelPos: { x: 380, y: 110 },
    landmark: 'CHC Khairabad Hospital, Block Campus & Govt Quarters',
    wardNumber: 'Ward 05 · Civic Health',
    description: 'Administrative and public health precinct housing the 24/7 Community Health Centre (CHC).',
  },
  {
    id: 'miyan-sarai',
    name: 'Miyan Sarai & ITI Precinct',
    nameHi: 'मियां सराय एवं आईटीआई',
    color: '#4f46e5', // Indigo
    stroke: '#3730a3',
    bgFill: 'rgba(79, 70, 229, 0.28)',
    polygon: '460,70 650,90 670,160 510,160 480,150',
    labelPos: { x: 560, y: 120 },
    landmark: 'Govt ITI, Degree College & Northern Link',
    wardNumber: 'Ward 07 · Education Zone',
    description: 'Educational sector with technical institutes, inter colleges and open agricultural peripheries.',
  },
  {
    id: 'main-bazaar',
    name: 'Main Bazaar & Ghanta Ghar',
    nameHi: 'मेन बाज़ार (घंटा घर)',
    color: '#dc2626', // Crimson red
    stroke: '#b91c1c',
    bgFill: 'rgba(220, 38, 38, 0.32)',
    polygon: '310,130 350,170 440,165 420,250 300,260 270,200',
    labelPos: { x: 360, y: 205 },
    landmark: 'Ghanta Ghar (Clock Tower), Sabzi Mandi & Kirana Market',
    wardNumber: 'Ward 09 · Commercial Heart',
    description: 'Vibrant civic and retail core of the municipality, hosting daily sabzi mandi and historic trade lanes.',
  },
  {
    id: 'sarafa-market',
    name: 'Sarafa Market Lane',
    nameHi: 'सराफा बाज़ार',
    color: '#9333ea', // Royal purple
    stroke: '#7e22ce',
    bgFill: 'rgba(147, 51, 234, 0.32)',
    polygon: '440,165 520,160 500,230 420,230',
    labelPos: { x: 465, y: 195 },
    landmark: 'Traditional Goldsmiths & Bridal Zari Textile Chowk',
    wardNumber: 'Ward 11 · Gold & Silk Bazaar',
    description: 'Renowned centuries-old jewellery and handloom hub of Awadh goldsmiths and textile merchants.',
  },
  {
    id: 'badi-sangat',
    name: 'Badi Sangat Heritage Enclave',
    nameHi: 'बड़ी संगत हेरिटेज एन्क्लेव',
    color: '#ea580c', // Saffron orange
    stroke: '#c2410c',
    bgFill: 'rgba(234, 88, 12, 0.35)',
    polygon: '520,160 670,160 760,180 770,280 610,270 500,230',
    labelPos: { x: 640, y: 220 },
    landmark: '17th-Century Badi Sangat Mandir, Sarovar & Mela Grounds',
    wardNumber: 'Ward 14 · Spiritual Heritage',
    description: 'Vast pilgrimage destination founded in Mughal era with ornate courtyards, sacred tanks and annual mela.',
  },
  {
    id: 'station-road',
    name: 'Station Road & KB Junction',
    nameHi: 'रेलवे स्टेशन मार्ग (केबी)',
    color: '#475569', // Steel slate
    stroke: '#334155',
    bgFill: 'rgba(71, 85, 105, 0.30)',
    polygon: '110,180 210,230 240,320 140,340 90,260',
    labelPos: { x: 165, y: 275 },
    landmark: 'Khairabad Avadh Station (KB), NER Line & Warehouses',
    wardNumber: 'Ward 16 · Rail Transport',
    description: 'North Eastern Railway corridor with passenger train connections to Sitapur, Lucknow, and Lakhimpur.',
  },
  {
    id: 'maswasi-tola',
    name: 'Maswasi Tola & Nai Basti',
    nameHi: 'मसवासी टोला / नई बस्ती',
    color: '#e11d48', // Rose pink
    stroke: '#be123c',
    bgFill: 'rgba(225, 29, 72, 0.30)',
    polygon: '210,230 300,260 290,360 190,370 240,320',
    labelPos: { x: 245, y: 315 },
    landmark: 'Traditional Weaving Settlements & Community Centers',
    wardNumber: 'Ward 18 · Artisanal Quarter',
    description: 'Heritage residential tola historically famed for Awadhi handloom, cotton processing and civic life.',
  },
  {
    id: 'qadam-rasul',
    name: 'Qadam Rasul & Dargah Precinct',
    nameHi: 'क़दम रसूल एवं दरगाह क्षेत्र',
    color: '#0891b2', // Teal cyan
    stroke: '#0e7490',
    bgFill: 'rgba(8, 145, 178, 0.32)',
    polygon: '300,260 420,250 440,370 310,380 290,360',
    labelPos: { x: 365, y: 315 },
    landmark: 'Qadam Rasul Shrine, Imambaras & Dargah Makhdoom Pur',
    wardNumber: 'Ward 21 · Sufi Monuments',
    description: 'Sacred architectural monuments of Awadh, including the footstep relic shrine and historic imambaras.',
  },
  {
    id: 'mahmoodabad-road',
    name: 'Mahmoodabad Road & Lawns',
    nameHi: 'महमूदाबाद रोड / मैरिज लॉन',
    color: '#16a34a', // Lush green
    stroke: '#15803d',
    bgFill: 'rgba(22, 163, 74, 0.30)',
    polygon: '420,250 500,230 610,270 770,280 780,320 730,420 520,450 440,370',
    labelPos: { x: 590, y: 350 },
    landmark: 'Biswan Bypass, Chandra Lawn, JP Lawn & Mango Orchards',
    wardNumber: 'Ward 24 · Eastern Expansion',
    description: 'Eastern arterial highway linking Biswan and Mahmoodabad with premier banquet lawns and gardens.',
  },
];

// Municipal boundary path coordinates enclosing all wards of Khairabad Awadh town
const MUNICIPAL_BOUNDARY_PATH =
  'M 120 70 L 290 50 L 460 70 L 650 90 L 760 180 L 780 320 L 730 420 L 520 450 L 330 440 L 190 390 L 110 300 L 90 180 Z';

export const KhairabadTownInfobox: React.FC = () => {
  const [mapMode, setMapMode] = useState<'khairabad' | 'up' | 'india'>('khairabad');
  const [selectedLocalityId, setSelectedLocalityId] = useState<string | null>(null);
  const [showBoundaries, setShowBoundaries] = useState(true);

  const activeLocality =
    KHAIRABAD_MAP_LOCALITIES.find((l) => l.id === selectedLocalityId) || null;

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm overflow-hidden text-slate-900">
      {/* Infobox Header */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 p-4 text-center border-b border-amber-600">
        <h2 className="text-xl sm:text-2xl font-black font-display text-slate-950 tracking-wide">
          {KHAIRABAD_CITY_INFO.name}
        </h2>
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 mt-1 rounded-full bg-slate-950 text-amber-300 text-xs font-bold uppercase tracking-wider">
          <span>{KHAIRABAD_CITY_INFO.status}</span>
          <span>·</span>
          <span>{KHAIRABAD_CITY_INFO.government.type}</span>
        </div>
      </div>

      <div className="p-5 sm:p-7 space-y-6">
        {/* Map & Coordinates Banner (matching image.png) */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-600" />
                <span>Location in Uttar Pradesh, India</span>
              </span>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Central Awadh region, Sitapur District (NH-30 corridor)
              </div>
            </div>

            {/* Coordinates Badge */}
            <a
              href="https://www.google.com/maps/place/Khairabad,+Uttar+Pradesh+261131/@27.53,80.75,13z"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-300 hover:border-amber-500 text-slate-800 hover:text-amber-800 text-xs font-bold transition-colors shadow-2xs"
              title="View on Google Maps"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>Coordinates: {KHAIRABAD_CITY_INFO.coordinates}</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>

          {/* Map Mode Radio Controls */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 text-xs font-semibold text-slate-700 flex-wrap pt-1 bg-white p-2 sm:p-2.5 rounded-xl border border-slate-200 shadow-2xs">
            <label className={`flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-lg border transition-all ${
              mapMode === 'khairabad'
                ? 'bg-amber-100/90 text-amber-950 border-amber-400 font-extrabold shadow-xs'
                : 'bg-transparent text-slate-600 border-transparent hover:bg-slate-50'
            }`}>
              <input
                type="radio"
                name="mapMode"
                value="khairabad"
                checked={mapMode === 'khairabad'}
                onChange={() => setMapMode('khairabad')}
                className="text-amber-600 focus:ring-amber-500"
              />
              <span className="flex items-center gap-1.5">
                <span>🗺️</span>
                <span>Khairabad Awadh Town Map (Localities &amp; Boundaries)</span>
              </span>
            </label>

            <label className={`flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-lg border transition-all ${
              mapMode === 'up'
                ? 'bg-amber-100/90 text-amber-950 border-amber-400 font-extrabold shadow-xs'
                : 'bg-transparent text-slate-600 border-transparent hover:bg-slate-50'
            }`}>
              <input
                type="radio"
                name="mapMode"
                value="up"
                checked={mapMode === 'up'}
                onChange={() => setMapMode('up')}
                className="text-amber-600 focus:ring-amber-500"
              />
              <span>Uttar Pradesh State Map</span>
            </label>

            <label className={`flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-lg border transition-all ${
              mapMode === 'india'
                ? 'bg-amber-100/90 text-amber-950 border-amber-400 font-extrabold shadow-xs'
                : 'bg-transparent text-slate-600 border-transparent hover:bg-slate-50'
            }`}>
              <input
                type="radio"
                name="mapMode"
                value="india"
                checked={mapMode === 'india'}
                onChange={() => setMapMode('india')}
                className="text-amber-600 focus:ring-amber-500"
              />
              <span>India Subcontinent Map</span>
            </label>
          </div>

          {/* Interactive Geographic Representation */}
          <div className="relative min-h-[460px] sm:min-h-[520px] md:min-h-[560px] bg-slate-900 rounded-2xl border-2 border-slate-300 overflow-hidden shadow-md flex flex-col justify-between">
            {mapMode === 'khairabad' ? (
              <div className="w-full flex flex-col h-full bg-[#f8fafc] text-slate-900">
                {/* Map Sub-Header Bar */}
                <div className="px-4 py-2.5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-2 text-xs border-b border-slate-800">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
                    <span className="font-extrabold text-white font-display text-xs sm:text-sm tracking-wide">
                      Khairabad Awadh (खैराबाद अवध) · Municipal Locality &amp; Boundary Map
                    </span>
                    <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/40 font-mono">
                      PIN: 261131 · 11 Historic Wards
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => setShowBoundaries(!showBoundaries)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors border ${
                        showBoundaries
                          ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-2xs'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                      }`}
                      title="Toggle Municipal Town Boundary line"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>{showBoundaries ? 'Hide Boundary' : 'Show Boundary'}</span>
                    </button>

                    {selectedLocalityId && (
                      <button
                        onClick={() => setSelectedLocalityId(null)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                      >
                        Reset Highlight
                      </button>
                    )}
                  </div>
                </div>

                {/* Main High-Resolution Colorful Vector Map Canvas */}
                <div className="relative w-full h-[360px] sm:h-[420px] md:h-[460px] bg-[#f1f5f9] overflow-hidden select-none">
                  <svg
                    viewBox="0 0 860 520"
                    className="w-full h-full object-cover"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      {/* Grid Pattern */}
                      <pattern id="kb-map-grid" width="36" height="36" patternUnits="userSpaceOnUse">
                        <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
                      </pattern>

                      {/* Municipal Boundary Gradient */}
                      <linearGradient id="kb-boundary-stroke" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="50%" stopColor="#d97706" />
                        <stop offset="100%" stopColor="#b45309" />
                      </linearGradient>

                      {/* Water Wave Pattern */}
                      <linearGradient id="sarayan-grad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#38bdf8" />
                        <stop offset="50%" stopColor="#0284c7" />
                        <stop offset="100%" stopColor="#0369a1" />
                      </linearGradient>

                      {/* Railway Ties Pattern */}
                      <pattern id="railway-ties" width="12" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                        <rect x="0" y="0" width="12" height="3" fill="#334155" />
                        <rect x="0" y="3" width="12" height="3" fill="#cbd5e1" />
                      </pattern>

                      {/* Soft Shadow Filter for Highlights */}
                      <filter id="kb-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0f172a" floodOpacity="0.25" />
                      </filter>
                    </defs>

                    {/* 1. Base Map Paper Texture Grid */}
                    <rect width="860" height="520" fill="url(#kb-map-grid)" />

                    {/* 2. Surrounding Agricultural Landscape (Sitapur District Plain) */}
                    <rect width="860" height="520" fill="#f8fafc" opacity="0.8" />

                    {/* 3. Sarayan River Basin (South-Western Natural Watercourse) */}
                    <path
                      d="M 20 460 C 140 430, 260 490, 420 470 C 580 450, 720 490, 840 475"
                      fill="none"
                      stroke="url(#sarayan-grad)"
                      strokeWidth="20"
                      strokeLinecap="round"
                      opacity="0.85"
                    />
                    <path
                      d="M 20 460 C 140 430, 260 490, 420 470 C 580 450, 720 490, 840 475"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      strokeDasharray="14,10"
                      opacity="0.8"
                    />
                    <g transform="translate(60, 492)">
                      <rect x="0" y="-14" width="220" height="20" rx="6" fill="#0369a1" fillOpacity="0.9" />
                      <text x="110" y="0" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                        ≈ Sarayan River (सरयान नदी) · South Border
                      </text>
                    </g>

                    {/* 4. Western Arterial Highway: NH-30 Sitapur–Lucknow Corridor */}
                    <path
                      d="M 60 20 Q 95 180 115 270 T 150 500"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="12"
                      strokeLinecap="round"
                      opacity="0.95"
                    />
                    <path
                      d="M 60 20 Q 95 180 115 270 T 150 500"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      strokeDasharray="10,8"
                    />
                    <g transform="translate(28, 65)">
                      <rect x="0" y="0" width="60" height="22" rx="4" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
                      <text x="30" y="15" fill="#f59e0b" fontSize="10" fontWeight="900" textAnchor="middle">
                        NH-30
                      </text>
                    </g>
                    <text x="18" y="105" fill="#92400e" fontSize="9" fontWeight="bold">
                      To Sitapur HQ (8 km) ↑
                    </text>
                    <text x="75" y="485" fill="#92400e" fontSize="9" fontWeight="bold">
                      ↓ To Lucknow (80 km)
                    </text>

                    {/* 5. Railway Corridor: NER Sitapur-Lucknow Railway Track */}
                    <path
                      d="M 80 180 L 260 380 L 390 490"
                      fill="none"
                      stroke="#334155"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 80 180 L 260 380 L 390 490"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      strokeDasharray="6,6"
                    />

                    {/* 6. Eastern Highway Link: Biswan / Mahmoodabad Bypass */}
                    <path
                      d="M 460 60 Q 640 180 720 310 T 780 470"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="8"
                      strokeLinecap="round"
                      opacity="0.8"
                    />
                    <path
                      d="M 460 60 Q 640 180 720 310 T 780 470"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="2"
                      strokeDasharray="8,6"
                    />
                    <text x="690" y="475" fill="#15803d" fontSize="9" fontWeight="bold">
                      → Biswan &amp; Mahmoodabad Link
                    </text>

                    {/* 7. Municipal Town Boundary Area (Outer Shading) */}
                    {showBoundaries && (
                      <path
                        d={MUNICIPAL_BOUNDARY_PATH}
                        fill="#fffbeb"
                        fillOpacity="0.45"
                        stroke="url(#kb-boundary-stroke)"
                        strokeWidth="4"
                        strokeDasharray="10,6"
                        strokeLinejoin="round"
                        filter="url(#kb-glow)"
                      />
                    )}

                    {/* 8. The 11 Colorful Locality Zones of Khairabad Awadh */}
                    {KHAIRABAD_MAP_LOCALITIES.map((loc) => {
                      const isSelected = selectedLocalityId === loc.id;
                      return (
                        <g
                          key={loc.id}
                          className="cursor-pointer transition-all duration-200"
                          onClick={() => setSelectedLocalityId(isSelected ? null : loc.id)}
                          onMouseEnter={() => setSelectedLocalityId(loc.id)}
                        >
                          {/* Locality Polygon Area */}
                          <polygon
                            points={loc.polygon}
                            fill={loc.color}
                            fillOpacity={isSelected ? 0.55 : 0.28}
                            stroke={loc.stroke}
                            strokeWidth={isSelected ? 3.5 : 2}
                            strokeDasharray={isSelected ? 'none' : '4,2'}
                            className="transition-all duration-200"
                          />

                          {/* Locality Label & Marker */}
                          <g transform={`translate(${loc.labelPos.x}, ${loc.labelPos.y})`}>
                            {/* Marker Pin Dot */}
                            <circle
                              cx="0"
                              cy="-14"
                              r={isSelected ? 6 : 4.5}
                              fill={loc.color}
                              stroke="#ffffff"
                              strokeWidth={isSelected ? 2 : 1.5}
                            />

                            {/* Label Plaque */}
                            <rect
                              x={-(loc.name.length * 3.4 + 10)}
                              y="-6"
                              width={loc.name.length * 6.8 + 20}
                              height={28}
                              rx="6"
                              fill={isSelected ? '#0f172a' : '#ffffff'}
                              fillOpacity={isSelected ? 0.95 : 0.92}
                              stroke={loc.stroke}
                              strokeWidth={isSelected ? 2 : 1.2}
                              filter="url(#kb-glow)"
                            />

                            {/* English Name */}
                            <text
                              x="0"
                              y="8"
                              fill={isSelected ? '#ffffff' : '#0f172a'}
                              fontSize={isSelected ? '10.5' : '9.5'}
                              fontWeight="800"
                              textAnchor="middle"
                            >
                              {loc.name}
                            </text>

                            {/* Hindi / Awadhi Name */}
                            <text
                              x="0"
                              y="18"
                              fill={isSelected ? '#facc15' : loc.stroke}
                              fontSize="8"
                              fontWeight="bold"
                              textAnchor="middle"
                            >
                              {loc.nameHi}
                            </text>
                          </g>
                        </g>
                      );
                    })}

                    {/* 9. Key Historic Landmarks & Civic Anchors */}
                    {/* Landmark: Ghanta Ghar Clock Tower (Center) */}
                    <g transform="translate(360, 235)" className="pointer-events-none">
                      <circle cx="0" cy="0" r="10" fill="#dc2626" stroke="#ffffff" strokeWidth="2" />
                      <text x="0" y="4" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                        🕰️
                      </text>
                      <text x="0" y="18" fill="#7f1d1d" fontSize="8" fontWeight="bold" textAnchor="middle">
                        Ghanta Ghar
                      </text>
                    </g>

                    {/* Landmark: Badi Sangat Mandir (East) */}
                    <g transform="translate(640, 185)" className="pointer-events-none">
                      <circle cx="0" cy="0" r="11" fill="#ea580c" stroke="#ffffff" strokeWidth="2" />
                      <text x="0" y="4" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                        🏛️
                      </text>
                      <text x="0" y="20" fill="#9a3412" fontSize="8" fontWeight="bold" textAnchor="middle">
                        Badi Sangat
                      </text>
                    </g>

                    {/* Landmark: Qadam Rasul & Dargah (South-Center) */}
                    <g transform="translate(365, 345)" className="pointer-events-none">
                      <circle cx="0" cy="0" r="11" fill="#0891b2" stroke="#ffffff" strokeWidth="2" />
                      <text x="0" y="4" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                        🕌
                      </text>
                      <text x="0" y="20" fill="#164e63" fontSize="8" fontWeight="bold" textAnchor="middle">
                        Qadam Rasul
                      </text>
                    </g>

                    {/* Landmark: CHC Community Hospital (North-Central) */}
                    <g transform="translate(380, 80)" className="pointer-events-none">
                      <circle cx="0" cy="0" r="10" fill="#059669" stroke="#ffffff" strokeWidth="2" />
                      <text x="0" y="4" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                        🏥
                      </text>
                      <text x="0" y="18" fill="#064e3b" fontSize="8" fontWeight="bold" textAnchor="middle">
                        CHC Hospital
                      </text>
                    </g>

                    {/* Landmark: Khairabad Avadh Railway Station (West) */}
                    <g transform="translate(160, 245)" className="pointer-events-none">
                      <circle cx="0" cy="0" r="10" fill="#475569" stroke="#ffffff" strokeWidth="2" />
                      <text x="0" y="4" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                        🚉
                      </text>
                      <text x="0" y="18" fill="#1e293b" fontSize="8" fontWeight="bold" textAnchor="middle">
                        Station (KB)
                      </text>
                    </g>

                    {/* 10. Authentic Cartographic Compass Rose (North Arrow) */}
                    <g transform="translate(810, 50)" className="pointer-events-none">
                      <circle cx="0" cy="0" r="22" fill="#ffffff" fillOpacity="0.9" stroke="#cbd5e1" strokeWidth="1.5" />
                      {/* North Needle */}
                      <polygon points="0,-18 5,-2 0,0" fill="#dc2626" />
                      <polygon points="0,-18 -5,-2 0,0" fill="#991b1b" />
                      {/* South Needle */}
                      <polygon points="0,18 5,2 0,0" fill="#64748b" />
                      <polygon points="0,18 -5,2 0,0" fill="#334155" />
                      {/* East Needle */}
                      <polygon points="18,0 2,5 0,0" fill="#64748b" />
                      {/* West Needle */}
                      <polygon points="-18,0 -2,5 0,0" fill="#64748b" />
                      <text x="0" y="-22" fill="#dc2626" fontSize="10" fontWeight="900" textAnchor="middle">
                        N
                      </text>
                      <text x="0" y="28" fill="#475569" fontSize="8" fontWeight="bold" textAnchor="middle">
                        S
                      </text>
                    </g>

                    {/* 11. Cartographic Scale Bar */}
                    <g transform="translate(680, 500)" className="pointer-events-none">
                      <rect x="-10" y="-14" width="170" height="22" rx="4" fill="#ffffff" fillOpacity="0.9" stroke="#cbd5e1" />
                      <line x1="0" y1="0" x2="150" y2="0" stroke="#0f172a" strokeWidth="2.5" />
                      <line x1="0" y1="-4" x2="0" y2="4" stroke="#0f172a" strokeWidth="2" />
                      <line x1="75" y1="-3" x2="75" y2="3" stroke="#0f172a" strokeWidth="1.5" />
                      <line x1="150" y1="-4" x2="150" y2="4" stroke="#0f172a" strokeWidth="2" />
                      <text x="0" y="-6" fill="#0f172a" fontSize="8" fontWeight="bold" textAnchor="middle">
                        0
                      </text>
                      <text x="75" y="-6" fill="#0f172a" fontSize="8" fontWeight="bold" textAnchor="middle">
                        500 m
                      </text>
                      <text x="150" y="-6" fill="#0f172a" fontSize="8" fontWeight="bold" textAnchor="middle">
                        1 km
                      </text>
                    </g>
                  </svg>
                </div>

                {/* Bottom Locality Information & Exploration Panel */}
                <div className="p-3.5 bg-slate-900 text-white border-t border-slate-800 space-y-2.5">
                  {activeLocality ? (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-800/90 p-3 rounded-xl border border-slate-700">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className="w-3.5 h-3.5 rounded-full shrink-0 border border-white"
                            style={{ backgroundColor: activeLocality.color }}
                          />
                          <span className="font-extrabold text-white text-sm">
                            {activeLocality.name}
                          </span>
                          <span className="text-amber-400 text-xs font-medium">
                            ({activeLocality.nameHi})
                          </span>
                          <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded font-mono">
                            {activeLocality.wardNumber}
                          </span>
                        </div>
                        <div className="text-xs text-slate-300">
                          <strong className="text-amber-300">Key Landmark:</strong> {activeLocality.landmark}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {activeLocality.description}
                        </p>
                      </div>

                      <button
                        onClick={() => setSelectedLocalityId(null)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white shrink-0 font-medium transition-colors"
                      >
                        Clear Selection
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-amber-300 font-semibold text-[11px]">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Tap or hover any locality on the map or select from below to inspect details:</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        Nagar Palika Parishad Khairabad · Sitapur District
                      </span>
                    </div>
                  )}

                  {/* Locality Quick Selector Pills */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {KHAIRABAD_MAP_LOCALITIES.map((loc) => {
                      const isSel = selectedLocalityId === loc.id;
                      return (
                        <button
                          key={loc.id}
                          onClick={() => setSelectedLocalityId(isSel ? null : loc.id)}
                          className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all border ${
                            isSel
                              ? 'bg-white text-slate-900 border-white shadow-xs scale-105'
                              : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'
                          }`}
                        >
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: loc.color }}
                          />
                          <span>{loc.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : mapMode === 'up' ? (
              <div className="w-full flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3 bg-gradient-to-b from-sky-50 to-amber-50/50">
                <div className="inline-block relative">
                  {/* Stylized UP State Locator Silhouette */}
                  <div className="w-56 sm:w-64 h-32 sm:h-40 bg-amber-100/90 border-2 border-amber-300 rounded-2xl flex items-center justify-center relative shadow-xs">
                    <span className="text-xs font-bold text-amber-900 uppercase tracking-widest opacity-60">
                      Uttar Pradesh State
                    </span>
                    {/* Khairabad Pinpoint Dot */}
                    <div className="absolute top-[42%] left-[52%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 bg-white/95 px-2.5 py-1 rounded-full border border-rose-300 shadow-md animate-pulse">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
                      <span className="text-xs font-black text-slate-900">Khairabad (Sitapur)</span>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-slate-600 max-w-md">
                  📍 Situated in Central Awadh, 8 km south of district headquarters Sitapur and 80 km north of state capital Lucknow along the NH-30 corridor.
                </div>
              </div>
            ) : (
              <div className="w-full flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3 bg-gradient-to-b from-emerald-50 to-sky-50/50">
                <div className="w-56 sm:w-64 h-32 sm:h-40 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-center justify-center relative shadow-xs">
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-widest opacity-60">
                    Northern India Subcontinent
                  </span>
                  <div className="absolute top-[35%] left-[53%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 bg-white/95 px-2.5 py-1 rounded-full border border-rose-300 shadow-md">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
                    <span className="text-xs font-black text-slate-900">Khairabad, UP</span>
                  </div>
                </div>
                <div className="text-xs text-slate-600 max-w-md">
                  🇮🇳 Upper Gangetic Plain · Awadh Heartland · Geographic Coordinates: 27.53° N, 80.75° E
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4 High-Priority Fact Hero Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-1">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
              Population (2011)
            </span>
            <span className="text-lg font-black text-slate-900 block leading-tight">
              {KHAIRABAD_CITY_INFO.population.total}
            </span>
            <span className="text-[10px] text-slate-500 block">
              Density: {KHAIRABAD_CITY_INFO.population.densityKm2}
            </span>
          </div>

          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-1">
            <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">
              Municipal Area
            </span>
            <span className="text-lg font-black text-slate-900 block leading-tight">
              {KHAIRABAD_CITY_INFO.area.totalKm2}
            </span>
            <span className="text-[10px] text-slate-500 block">
              {KHAIRABAD_CITY_INFO.area.totalSqMi}
            </span>
          </div>

          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-1">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
              Elevation
            </span>
            <span className="text-lg font-black text-slate-900 block leading-tight">
              {KHAIRABAD_CITY_INFO.elevation.meters}
            </span>
            <span className="text-[10px] text-slate-500 block">
              {KHAIRABAD_CITY_INFO.elevation.feet}
            </span>
          </div>

          <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-1">
            <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">
              Vehicle Registration
            </span>
            <span className="text-lg font-black text-slate-900 block leading-tight">
              {KHAIRABAD_CITY_INFO.vehicleRegistration}
            </span>
            <span className="text-[10px] text-slate-500 block">
              Sitapur RTO Zone
            </span>
          </div>
        </div>

        {/* Complete Wikipedia-Style Structured Facts Table */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-200 text-xs">
          {/* Section: Administrative Hierarchy */}
          <div className="bg-slate-100 px-4 py-2 font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-amber-700" />
            <span>Administrative Hierarchy</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
            <div className="p-3.5 flex justify-between items-center">
              <span className="text-slate-500 font-medium">Country</span>
              <span className="font-bold text-slate-900 flex items-center gap-1">
                <span>🇮🇳</span>
                <span>{KHAIRABAD_CITY_INFO.country}</span>
              </span>
            </div>
            <div className="p-3.5 flex justify-between items-center">
              <span className="text-slate-500 font-medium">State</span>
              <span className="font-bold text-slate-900">{KHAIRABAD_CITY_INFO.state}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
            <div className="p-3.5 flex justify-between items-center">
              <span className="text-slate-500 font-medium">Administrative Division</span>
              <span className="font-bold text-slate-900">{KHAIRABAD_CITY_INFO.division} Division</span>
            </div>
            <div className="p-3.5 flex justify-between items-center">
              <span className="text-slate-500 font-medium">District</span>
              <span className="font-bold text-slate-900">{KHAIRABAD_CITY_INFO.district}</span>
            </div>
          </div>

          {/* Section: Government & Civic Leadership */}
          <div className="bg-slate-100 px-4 py-2 font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Landmark className="w-3.5 h-3.5 text-amber-700" />
            <span>Government &amp; Civic Leadership</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
            <div className="p-3.5 flex justify-between items-center">
              <span className="text-slate-500 font-medium">Government Type</span>
              <span className="font-bold text-slate-900">{KHAIRABAD_CITY_INFO.government.type}</span>
            </div>
            <div className="p-3.5 flex justify-between items-center">
              <span className="text-slate-500 font-medium">Governing Civic Body</span>
              <span className="font-bold text-slate-900">{KHAIRABAD_CITY_INFO.government.body}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
            <div className="p-3.5 flex justify-between items-center bg-amber-50/40">
              <span className="text-slate-700 font-semibold">Municipal Chairperson</span>
              <span className="font-extrabold text-slate-950 flex items-center gap-1.5">
                <span>{KHAIRABAD_CITY_INFO.government.chairperson}</span>
                <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-1.5 py-0.2 rounded border border-orange-200">
                  {KHAIRABAD_CITY_INFO.government.chairpersonParty}
                </span>
              </span>
            </div>
            <div className="p-3.5 flex justify-between items-center bg-amber-50/40">
              <span className="text-slate-700 font-semibold">Lok Sabha MP (Sitapur)</span>
              <span className="font-extrabold text-slate-950 flex items-center gap-1.5">
                <span>{KHAIRABAD_CITY_INFO.government.lokSabhaMP}</span>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded border border-blue-200">
                  {KHAIRABAD_CITY_INFO.government.lokSabhaParty}
                </span>
              </span>
            </div>
          </div>

          {/* Section: Geography, Area & Demographics */}
          <div className="bg-slate-100 px-4 py-2 font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-amber-700" />
            <span>Geography, Area &amp; Demographics</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
            <div className="p-3.5 flex justify-between items-center">
              <span className="text-slate-500 font-medium">Total Area</span>
              <span className="font-bold text-slate-900">
                {KHAIRABAD_CITY_INFO.area.totalKm2} ({KHAIRABAD_CITY_INFO.area.totalSqMi})
              </span>
            </div>
            <div className="p-3.5 flex justify-between items-center">
              <span className="text-slate-500 font-medium">Elevation</span>
              <span className="font-bold text-slate-900">
                {KHAIRABAD_CITY_INFO.elevation.meters} ({KHAIRABAD_CITY_INFO.elevation.feet})
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
            <div className="p-3.5 flex justify-between items-center">
              <span className="text-slate-500 font-medium">Population (2011 Census)</span>
              <span className="font-bold text-slate-900">
                {KHAIRABAD_CITY_INFO.population.total}
              </span>
            </div>
            <div className="p-3.5 flex justify-between items-center">
              <span className="text-slate-500 font-medium">Population Density</span>
              <span className="font-bold text-slate-900">
                {KHAIRABAD_CITY_INFO.population.densityKm2} ({KHAIRABAD_CITY_INFO.population.densitySqMi})
              </span>
            </div>
          </div>

          {/* Section: Languages, Codes & Official Web Portal */}
          <div className="bg-slate-100 px-4 py-2 font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-amber-700" />
            <span>Languages, Regional Codes &amp; Web Portal</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
            <div className="p-3.5 flex justify-between items-center">
              <span className="text-slate-500 font-medium">Official Language</span>
              <span className="font-bold text-slate-900">{KHAIRABAD_CITY_INFO.languages.official}</span>
            </div>
            <div className="p-3.5 flex justify-between items-center">
              <span className="text-slate-500 font-medium">Time Zone</span>
              <span className="font-bold text-slate-900">{KHAIRABAD_CITY_INFO.timeZone}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
            <div className="p-3.5 flex justify-between items-center">
              <span className="text-slate-500 font-medium">Postal PIN Code</span>
              <span className="font-bold text-slate-900">{KHAIRABAD_CITY_INFO.pinCode}</span>
            </div>
            <div className="p-3.5 flex justify-between items-center">
              <span className="text-slate-500 font-medium">Telephone STD</span>
              <span className="font-bold text-slate-900">{KHAIRABAD_CITY_INFO.stdCode}</span>
            </div>
            <div className="p-3.5 flex justify-between items-center">
              <span className="text-slate-500 font-medium">Railway Station</span>
              <span className="font-bold text-slate-900">{KHAIRABAD_CITY_INFO.railwayCode}</span>
            </div>
          </div>

          {/* Official Website row */}
          <div className="p-3.5 bg-amber-50 flex items-center justify-between">
            <span className="text-slate-700 font-bold">Official Municipal Website</span>
            <a
              href={KHAIRABAD_CITY_INFO.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-amber-800 hover:text-amber-950 font-bold hover:underline"
            >
              <span>{KHAIRABAD_CITY_INFO.websiteDisplay}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
