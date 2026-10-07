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
} from 'lucide-react';
import { KHAIRABAD_CITY_INFO } from '../data/khairabadData';

export const KhairabadTownInfobox: React.FC = () => {
  const [mapMode, setMapMode] = useState<'up' | 'india' | 'satellite'>('up');

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

          {/* Map Mode Radio Controls (as seen in image.png) */}
          <div className="flex items-center justify-center gap-4 text-xs font-medium text-slate-600 flex-wrap pt-1">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="mapMode"
                value="up"
                checked={mapMode === 'up'}
                onChange={() => setMapMode('up')}
                className="text-amber-600 focus:ring-amber-500"
              />
              <span>Show map of Uttar Pradesh</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="mapMode"
                value="india"
                checked={mapMode === 'india'}
                onChange={() => setMapMode('india')}
                className="text-amber-600 focus:ring-amber-500"
              />
              <span>Show map of India</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="mapMode"
                value="satellite"
                checked={mapMode === 'satellite'}
                onChange={() => setMapMode('satellite')}
                className="text-amber-600 focus:ring-amber-500"
              />
              <span>Town Area View</span>
            </label>
          </div>

          {/* Interactive Geographic Representation */}
          <div className="relative h-44 sm:h-52 bg-gradient-to-b from-sky-50 to-amber-50/50 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center">
            {mapMode === 'up' ? (
              <div className="text-center p-4 space-y-2">
                <div className="inline-block relative">
                  {/* Stylized UP State Locator Silhouette */}
                  <div className="w-48 sm:w-56 h-28 sm:h-32 bg-amber-100/90 border-2 border-amber-300 rounded-2xl flex items-center justify-center relative shadow-xs">
                    <span className="text-[11px] font-bold text-amber-900 uppercase tracking-widest opacity-60">
                      Uttar Pradesh
                    </span>
                    {/* Khairabad Pinpoint Dot */}
                    <div className="absolute top-[42%] left-[52%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 bg-white/95 px-2 py-0.5 rounded-full border border-rose-300 shadow-sm animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                      <span className="text-[10px] font-black text-slate-900">Khairabad</span>
                    </div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-500">
                  📍 Located 8 km south of Sitapur &amp; 80 km north of state capital Lucknow (NH-30)
                </div>
              </div>
            ) : mapMode === 'india' ? (
              <div className="text-center p-4 space-y-2">
                <div className="w-48 sm:w-56 h-28 sm:h-32 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-center justify-center relative shadow-xs">
                  <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-widest opacity-60">
                    Northern India
                  </span>
                  <div className="absolute top-[35%] left-[53%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 bg-white/95 px-2 py-0.5 rounded-full border border-rose-300 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                    <span className="text-[10px] font-black text-slate-900">Khairabad, UP</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-500">
                  🇮🇳 Northern Plains · Upper Gangetic Plain · Awadh Heartland
                </div>
              </div>
            ) : (
              <div className="text-center p-4 space-y-2">
                <div className="w-full h-full flex flex-col items-center justify-center space-y-1">
                  <div className="text-xs font-bold text-slate-900">
                    Khairabad Town Municipality (9 km²)
                  </div>
                  <div className="text-[11px] text-slate-600 max-w-sm">
                    Bounded by Sarayan River, Sitapur Bypass (NH-30), Station Road, and Purani Bazar.
                  </div>
                  <a
                    href="https://www.google.com/maps/place/Khairabad,+Uttar+Pradesh+261131/@27.53,80.75,13z"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg border border-amber-500 transition-colors inline-flex items-center gap-1"
                  >
                    <span>Open Satellite Map</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
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
