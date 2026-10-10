import React, { useState } from 'react';
import {
  Navigation,
  Compass,
  MapPin,
  ExternalLink,
  ChevronRight,
  Signpost,
  Building,
  Car,
  ShoppingBag,
  Hospital,
  Shield,
  Layers,
  ArrowRight,
  Info,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import {
  MAIN_ROADS_CONNECTIVITY,
  CHAURAHA_HUBS,
  TRADITIONAL_MOHALLAS,
  RoadConnectivityItem,
  ChaurahaHub,
  TraditionalMohalla,
} from '../data/roadsConnectivityData';
import { CityListing } from '../types/directory';

interface MainRoadsConnectivityProps {
  onSelectRoad?: (roadName: string) => void;
  onSelectMohalla?: (mohalla: string) => void;
  onSelectChauraha?: (chauraha: string) => void;
  onOpenListingDetail?: (listing: CityListing) => void;
  onOpenFullPage?: () => void;
  allListings?: CityListing[];
}

export const MainRoadsConnectivity: React.FC<MainRoadsConnectivityProps> = ({
  onSelectRoad,
  onSelectMohalla,
  onSelectChauraha,
  onOpenListingDetail,
  onOpenFullPage,
  allListings = [],
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'highways' | 'local-roads' | 'chaurahas' | 'mohallas'>('all');
  const [selectedRoadId, setSelectedRoadId] = useState<string | null>(null);

  const filteredRoads = MAIN_ROADS_CONNECTIVITY.filter((road) => {
    if (activeTab === 'highways') return road.category === 'highways';
    if (activeTab === 'local-roads') return road.category === 'local-roads';
    return true;
  });

  const getListingCountForRoad = (roadItem: RoadConnectivityItem) => {
    return allListings.filter((l) => {
      const q = roadItem.name.toLowerCase();
      const alt = roadItem.alternateNames.toLowerCase();
      const addr = l.address.toLowerCase();
      const loc = l.locality.toLowerCase();
      const rName = (l.roadName || '').toLowerCase();
      return (
        rName.includes(q) ||
        addr.includes(q) ||
        loc.includes(q) ||
        (roadItem.id === 'bcm-road' && (addr.includes('bcm') || loc.includes('bcm'))) ||
        (roadItem.id === 'nh-24' && (addr.includes('nh-24') || addr.includes('sitapur road') || loc.includes('sitapur road'))) ||
        (roadItem.id === 'sh-30' && (addr.includes('sh-30') || addr.includes('biswan') || loc.includes('biswan'))) ||
        (roadItem.id === 'bahraich-sitapur-road' && (addr.includes('bahraich') || addr.includes('arjunpur') || addr.includes('sujawalpur'))) ||
        (roadItem.id === 'post-office-road' && (addr.includes('post office') || addr.includes('purani bazar'))) ||
        (roadItem.id === 'nai-bazar-road' && (addr.includes('nai bazar') || addr.includes('joshitola')))
      );
    }).length;
  };

  return (
    <section className="py-8 px-4 sm:px-6 max-w-7xl mx-auto" id="roads-connectivity-section">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden border border-slate-700/60">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3 border border-amber-400/30">
            <Signpost className="w-3.5 h-3.5" />
            <span>Awadh Transit & Urban Navigation Guide</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display tracking-tight text-white mb-3">
            Main Roads & Connectivity of Khairabad
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-5">
            Khairabad sits at the strategic historic junction of central Uttar Pradesh. Whether commuting via National Highway 24, accessing healthcare on BCM Road, or shopping in Nai Bazar and Purani Bazar, explore town arteries categorized for travelers, commuters, residents, and shoppers.
          </p>

          {/* Quick Stats Pill */}
          <div className="flex flex-wrap gap-2.5 sm:gap-3 text-xs">
            <div className="bg-slate-800/90 backdrop-blur-xs border border-slate-700 px-3 py-1.5 rounded-xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-slate-300">2 Regional Arteries</span>
            </div>
            <div className="bg-slate-800/90 backdrop-blur-xs border border-slate-700 px-3 py-1.5 rounded-xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-slate-300">4 Commercial Corridors</span>
            </div>
            <div className="bg-slate-800/90 backdrop-blur-xs border border-slate-700 px-3 py-1.5 rounded-xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-slate-300">6 Landmark Chaurahas</span>
            </div>
            <div className="bg-slate-800/90 backdrop-blur-xs border border-slate-700 px-3 py-1.5 rounded-xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span className="text-slate-300">8 Historic Mohallas</span>
            </div>
            {onOpenFullPage && (
              <button
                onClick={onOpenFullPage}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
              >
                <span>Full Roads &amp; Transit Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none border-b border-slate-200">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>All Road Arteries ({MAIN_ROADS_CONNECTIVITY.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('highways')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'highways'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Car className="w-4 h-4 text-blue-500" />
          <span>🛣️ Category 1: Highways & Transit Arteries (2)</span>
        </button>

        <button
          onClick={() => setActiveTab('local-roads')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'local-roads'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-amber-500" />
          <span>🏙️ Category 2: Central Local & Commercial Roads (4)</span>
        </button>

        <button
          onClick={() => setActiveTab('chaurahas')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'chaurahas'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Signpost className="w-4 h-4 text-emerald-500" />
          <span>🚦 Landmark Chaurahas ({CHAURAHA_HUBS.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('mohallas')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'mohallas'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building className="w-4 h-4 text-purple-500" />
          <span>🏘️ Traditional Mohallas ({TRADITIONAL_MOHALLAS.length})</span>
        </button>
      </div>

      {/* Roads View (All, Highways, or Local Roads) */}
      {(activeTab === 'all' || activeTab === 'highways' || activeTab === 'local-roads') && (
        <div className="space-y-6">
          {/* Category 1 Header if showing all or highways */}
          {(activeTab === 'all' || activeTab === 'highways') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🛣️</span>
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 font-display">
                      Category 1: Highways & Regional Arteries
                    </h3>
                    <p className="text-xs text-slate-500">
                      Primary entry and exit corridors seeing the highest daily traffic. Built for travelers, intercity commuters, and regional logistics.
                    </p>
                  </div>
                </div>
                <span className="hidden sm:inline text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
                  High Daily Traffic
                </span>
              </div>

              {/* Highway Cards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {MAIN_ROADS_CONNECTIVITY.filter((r) => r.category === 'highways').map((road) => {
                  const placeCount = getListingCountForRoad(road);
                  return (
                    <div
                      key={road.id}
                      className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div>
                        {/* Top Badges */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase tracking-wide">
                              Highway / Transit Artery
                            </span>
                            <h4 className="text-lg font-black text-slate-900 font-display mt-1 group-hover:text-blue-700 transition-colors">
                              {road.name}
                            </h4>
                            {road.hindiName && (
                              <p className="text-xs font-medium text-slate-500 font-serif">
                                {road.hindiName}
                              </p>
                            )}
                          </div>

                          <a
                            href={road.routeGoogleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-colors shrink-0"
                            title="View Road Route on Google Maps"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>

                        {/* Alternate names */}
                        <div className="mb-3 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                          <span className="font-bold text-slate-800">Local Alternate Name:</span>{' '}
                          <span>{road.alternateNames}</span>
                        </div>

                        {/* Significance */}
                        <p className="text-xs text-slate-600 leading-relaxed mb-4">
                          {road.significance}
                        </p>

                        {/* Key Landmarks Box */}
                        <div className="mb-4 bg-blue-50/50 rounded-xl p-3 border border-blue-100/80">
                          <h5 className="text-[11px] font-bold text-blue-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-blue-600" />
                            <span>Key Landmarks & Features:</span>
                          </h5>
                          <ul className="space-y-1.5 text-xs text-slate-700">
                            {road.keyLandmarks.map((lm, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-blue-600 font-bold shrink-0 mt-0.5">•</span>
                                <span>{lm}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Connected Mohallas & Hubs */}
                        <div className="space-y-2 mb-4">
                          <div className="flex flex-wrap items-center gap-1.5 text-xs">
                            <span className="text-[11px] font-bold text-slate-500">Major Chaurahas:</span>
                            {road.chaurahaHubs.map((hub, idx) => (
                              <button
                                key={idx}
                                onClick={() => onSelectChauraha && onSelectChauraha(hub)}
                                className="px-2 py-0.5 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 rounded-md text-[11px] font-medium transition-colors border border-slate-200"
                              >
                                🚦 {hub}
                              </button>
                            ))}
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5 text-xs">
                            <span className="text-[11px] font-bold text-slate-500">Connected Mohallas:</span>
                            {road.connectedMohallas.map((moh, idx) => (
                              <button
                                key={idx}
                                onClick={() => onSelectMohalla && onSelectMohalla(moh)}
                                className="px-2 py-0.5 bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-900 rounded-md text-[11px] font-medium transition-colors border border-slate-200"
                              >
                                🏘️ {moh}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                        <span className="text-[11px] text-slate-500">
                          <strong>{placeCount}</strong> verified places on route
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              if (onSelectRoad) {
                                onSelectRoad(road.name);
                              }
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                          >
                            <span>Explore Road Listings</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Category 2 Header if showing all or local-roads */}
          {(activeTab === 'all' || activeTab === 'local-roads') && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🏙️</span>
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 font-display">
                      Category 2: Central Local & Commercial Roads
                    </h3>
                    <p className="text-xs text-slate-500">
                      These inner-city roads form the backbone of local trade, medical facilities, government offices, and historical quarters.
                    </p>
                  </div>
                </div>
                <span className="hidden sm:inline text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg border border-amber-200">
                  Town Trade & Healthcare
                </span>
              </div>

              {/* Local Roads Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {MAIN_ROADS_CONNECTIVITY.filter((r) => r.category === 'local-roads').map((road) => {
                  const placeCount = getListingCountForRoad(road);
                  return (
                    <div
                      key={road.id}
                      className="bg-white rounded-2xl border border-slate-200 hover:border-amber-400 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div>
                        {/* Top Badges */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase tracking-wide">
                              Central Local & Commercial Road
                            </span>
                            <h4 className="text-lg font-black text-slate-900 font-display mt-1 group-hover:text-amber-800 transition-colors">
                              {road.name}
                            </h4>
                            {road.hindiName && (
                              <p className="text-xs font-medium text-slate-500 font-serif">
                                {road.hindiName}
                              </p>
                            )}
                          </div>

                          <a
                            href={road.routeGoogleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-slate-50 hover:bg-amber-50 text-slate-500 hover:text-amber-700 transition-colors shrink-0"
                            title="View Road Route on Google Maps"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>

                        {/* Alternate names */}
                        <div className="mb-3 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                          <span className="font-bold text-slate-800">Route / Alternate Name:</span>{' '}
                          <span>{road.alternateNames}</span>
                        </div>

                        {/* Significance quote */}
                        <div className="mb-3 pl-3 border-l-2 border-amber-500 py-0.5">
                          <p className="text-xs font-medium text-slate-700 italic">
                            "{road.significance}"
                          </p>
                        </div>

                        {/* Top Directory Points Box */}
                        <div className="mb-4 bg-amber-50/50 rounded-xl p-3 border border-amber-100">
                          <h5 className="text-[11px] font-bold text-amber-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-amber-600" />
                            <span>Top Directory Points & Key Landmarks:</span>
                          </h5>
                          <ul className="space-y-1.5 text-xs text-slate-700">
                            {road.keyLandmarks.map((lm, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-amber-600 font-bold shrink-0 mt-0.5">•</span>
                                <span>{lm}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Connected Mohallas & Hubs */}
                        <div className="space-y-2 mb-4">
                          <div className="flex flex-wrap items-center gap-1.5 text-xs">
                            <span className="text-[11px] font-bold text-slate-500">Major Chaurahas:</span>
                            {road.chaurahaHubs.map((hub, idx) => (
                              <button
                                key={idx}
                                onClick={() => onSelectChauraha && onSelectChauraha(hub)}
                                className="px-2 py-0.5 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 rounded-md text-[11px] font-medium transition-colors border border-slate-200"
                              >
                                🚦 {hub}
                              </button>
                            ))}
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5 text-xs">
                            <span className="text-[11px] font-bold text-slate-500">Borders / Mohallas:</span>
                            {road.connectedMohallas.map((moh, idx) => (
                              <button
                                key={idx}
                                onClick={() => onSelectMohalla && onSelectMohalla(moh)}
                                className="px-2 py-0.5 bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-900 rounded-md text-[11px] font-medium transition-colors border border-slate-200"
                              >
                                🏘️ {moh}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                        <span className="text-[11px] text-slate-500">
                          <strong>{placeCount}</strong> verified places on route
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              if (onSelectRoad) {
                                onSelectRoad(road.name);
                              }
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-xs flex items-center gap-1"
                          >
                            <span>Explore Road Listings</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Chauraha (Intersection) Hubs View */}
      {activeTab === 'chaurahas' && (
        <div className="space-y-6">
          {/* Awadh Design Insight Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 mt-0.5 font-bold">
              💡
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-amber-950">
                Chauraha (Intersection) Navigation Hubs in Khairabad
              </h4>
              <p className="text-xs text-amber-900 leading-relaxed">
                In the Awadh region, directions and business lookups are traditionally anchored to major <strong>Chaurahas (Crossroads)</strong> rather than exact numerical addresses. Click any Chauraha below to filter businesses situated around that junction.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CHAURAHA_HUBS.map((hub) => (
              <div
                key={hub.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-emerald-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      Intersection Hub
                    </span>
                    <a
                      href={hub.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-emerald-600 transition-colors"
                      title="View on Google Maps"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 font-display mb-0.5">
                    {hub.name}
                  </h4>
                  <p className="text-xs text-slate-500 mb-2 font-serif">{hub.hindiName}</p>

                  <div className="space-y-1 text-xs text-slate-600 mb-3">
                    <p>
                      <span className="font-semibold text-slate-800">Arterial Road:</span> {hub.road}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-800">Locality:</span> {hub.mohalla}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {hub.description}
                  </p>

                  <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs mb-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">
                      Surrounding Landmarks:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {hub.landmarks.map((lm, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 bg-white text-slate-700 text-[11px] rounded border border-slate-200"
                        >
                          {lm}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectChauraha && onSelectChauraha(hub.name)}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  <span>Filter Listings at {hub.name}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Traditional Mohallas View */}
      {activeTab === 'mohallas' && (
        <div className="space-y-6">
          {/* Mohalla Filter Tip Notice */}
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-full bg-purple-200 text-purple-900 flex items-center justify-center shrink-0 mt-0.5 font-bold">
              🏘️
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-purple-950">
                Traditional Mohallas (Quarters) of Khairabad
              </h4>
              <p className="text-xs text-purple-900 leading-relaxed">
                Khairabad is densely packed with heritage mohallas like Joshitola, Sujawalpur, Arjunpur, Mevati Tola, and Miyan Sarai. Filter businesses by both road and neighborhood to discover hyperlocal craftsmen, markets, and essentials.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TRADITIONAL_MOHALLAS.map((moh) => (
              <div
                key={moh.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-purple-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">
                      Traditional Mohalla
                    </span>
                    <span className="text-[11px] text-slate-400">PIN 261131</span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 font-display mb-0.5">
                    {moh.name}
                  </h4>
                  <p className="text-xs text-slate-500 mb-2 font-serif">{moh.hindiName}</p>

                  <div className="space-y-1 text-xs text-slate-600 mb-3">
                    <p>
                      <span className="font-semibold text-slate-800">Primary Road:</span> {moh.primaryRoad}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-800">Hub Chauraha:</span> {moh.chaurahaHub}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {moh.character}
                  </p>

                  <div className="space-y-1 bg-purple-50/50 p-2.5 rounded-xl border border-purple-100 text-xs mb-4">
                    <span className="text-[10px] font-bold text-purple-950 uppercase tracking-wide block">
                      Prominent Features & Shops:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {moh.highlights.map((hl, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 bg-white text-purple-900 text-[11px] rounded border border-purple-200"
                        >
                          {hl}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectMohalla && onSelectMohalla(moh.name)}
                  className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  <span>Explore {moh.name} Directory</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
