import React, { useState, useMemo } from 'react';
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
  Phone,
  Bus,
  Search,
  Filter,
  ArrowLeft,
  Share2,
  Train,
  Clock,
  Gauge,
  Store,
  ChevronDown,
  RotateCcw,
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
import { DirectoryListingCard } from './DirectoryListingCard';

interface RoadsTransitPageProps {
  onBackToDirectory: () => void;
  onSelectRoadFilter: (roadName: string) => void;
  onSelectMohallaFilter: (mohalla: string) => void;
  onSelectChaurahaFilter: (chauraha: string) => void;
  onOpenListingDetail?: (listing: CityListing) => void;
  onOpenAddModal?: () => void;
  allListings?: CityListing[];
}

export const RoadsTransitPage: React.FC<RoadsTransitPageProps> = ({
  onBackToDirectory,
  onSelectRoadFilter,
  onSelectMohallaFilter,
  onSelectChaurahaFilter,
  onOpenListingDetail,
  onOpenAddModal,
  allListings = [],
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'highways' | 'local-roads' | 'chaurahas' | 'mohallas' | 'transit'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoadForListings, setSelectedRoadForListings] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Filter roads based on search and tab
  const filteredRoads = useMemo(() => {
    return MAIN_ROADS_CONNECTIVITY.filter((road) => {
      if (activeTab === 'highways' && road.category !== 'highways') return false;
      if (activeTab === 'local-roads' && road.category !== 'local-roads') return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        road.name.toLowerCase().includes(q) ||
        (road.hindiName && road.hindiName.toLowerCase().includes(q)) ||
        road.alternateNames.toLowerCase().includes(q) ||
        road.significance.toLowerCase().includes(q) ||
        road.keyLandmarks.some((lm) => lm.toLowerCase().includes(q)) ||
        road.connectedMohallas.some((m) => m.toLowerCase().includes(q))
      );
    });
  }, [activeTab, searchQuery]);

  // Filter chaurahas
  const filteredChaurahas = useMemo(() => {
    if (!searchQuery.trim()) return CHAURAHA_HUBS;
    const q = searchQuery.toLowerCase();
    return CHAURAHA_HUBS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.hindiName.toLowerCase().includes(q) ||
        c.road.toLowerCase().includes(q) ||
        c.mohalla.toLowerCase().includes(q) ||
        c.landmarks.some((lm) => lm.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // Filter mohallas
  const filteredMohallas = useMemo(() => {
    if (!searchQuery.trim()) return TRADITIONAL_MOHALLAS;
    const q = searchQuery.toLowerCase();
    return TRADITIONAL_MOHALLAS.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.hindiName.toLowerCase().includes(q) ||
        m.primaryRoad.toLowerCase().includes(q) ||
        m.character.toLowerCase().includes(q) ||
        m.highlights.some((h) => h.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // Calculate matching listings count for a road
  const getListingsForRoad = (roadItem: RoadConnectivityItem) => {
    return allListings.filter((l) => {
      const q = roadItem.name.toLowerCase();
      const alt = roadItem.alternateNames.toLowerCase();
      const addr = l.address.toLowerCase();
      const loc = l.locality.toLowerCase();
      const rName = (l.roadName || '').toLowerCase();

      if (rName && (q.includes(rName) || rName.includes('nh-24') || rName.includes('bcm'))) {
        return true;
      }

      if (roadItem.id === 'nh-24') {
        return (
          addr.includes('nh-24') ||
          addr.includes('nh 24') ||
          addr.includes('national highway') ||
          addr.includes('sitapur road') ||
          addr.includes('lucknow road') ||
          addr.includes('barabhari') ||
          loc.includes('sitapur-road') ||
          l.id.includes('barabhari')
        );
      }
      if (roadItem.id === 'sh-30') {
        return (
          addr.includes('sh-30') ||
          addr.includes('biswan') ||
          addr.includes('thana') ||
          addr.includes('kotwali') ||
          addr.includes('suhaima')
        );
      }
      if (roadItem.id === 'bcm-road') {
        return (
          addr.includes('bcm') ||
          addr.includes('mission') ||
          l.name.toLowerCase().includes('bcm') ||
          l.id.includes('bcm') ||
          l.id.includes('iron') ||
          l.id.includes('optical')
        );
      }
      if (roadItem.id === 'bahraich-sitapur-road') {
        return (
          addr.includes('bahraich') ||
          addr.includes('arjunpur') ||
          addr.includes('rto') ||
          addr.includes('sujawalpur') ||
          addr.includes('hira market') ||
          l.id.includes('rto') ||
          l.id.includes('fazl')
        );
      }
      if (roadItem.id === 'post-office-road') {
        return (
          addr.includes('post office') ||
          addr.includes('purani bazar') ||
          addr.includes('dakghar') ||
          l.id.includes('post') ||
          loc.includes('main-bazaar')
        );
      }
      if (roadItem.id === 'nai-bazar-road') {
        return (
          addr.includes('nai bazar') ||
          addr.includes('joshitola') ||
          l.id.includes('alam') ||
          loc.includes('main-bazaar')
        );
      }

      return addr.includes(q) || alt.includes(addr);
    });
  };

  const handleCopyLink = () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('view', 'roads');
      navigator.clipboard.writeText(url.toString());
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // ignore
    }
  };

  const activeSelectedRoadData = selectedRoadForListings
    ? MAIN_ROADS_CONNECTIVITY.find((r) => r.id === selectedRoadForListings)
    : null;

  const activeRoadListings = activeSelectedRoadData
    ? getListingsForRoad(activeSelectedRoadData)
    : [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Breadcrumb & Quick Actions Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
            <button
              onClick={onBackToDirectory}
              className="hover:text-amber-800 transition-colors flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Khairabad Directory</span>
            </button>
            <span>/</span>
            <span className="text-slate-900 font-bold flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5 text-amber-600" />
              <span>Main Roads &amp; Transit</span>
            </span>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
              title="Share Road Guide Link"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              <span>{copiedLink ? 'Link Copied!' : 'Share Guide'}</span>
            </button>

            {onOpenAddModal && (
              <button
                onClick={onOpenAddModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 border border-amber-500 text-xs font-bold shadow-2xs transition-colors"
              >
                <span>+ Add Place on Road</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hero Header Section */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white overflow-hidden py-10 sm:py-14 px-4 sm:px-6">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-semibold">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Awadh Regional Urban Connectivity &amp; Transit Directory</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight text-white leading-tight">
              Khairabad Main Roads, Highways &amp; Transit Guide
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Master the road network of Khairabad (PIN 261131, Sitapur District). From high-speed regional corridors (<strong>NH-24 Sitapur-Lucknow Highway</strong> and <strong>SH-30 Biswan Road</strong>) to vibrant historic market corridors (<strong>BCM Road</strong>, <strong>Bahraich Road</strong>, <strong>Nai Bazar</strong>, and <strong>Purani Bazar Link</strong>), discover landmarks, chaurahas, and connected mohallas.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/80 rounded-2xl p-3.5 space-y-1">
              <div className="text-xs text-amber-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5" />
                <span>Regional Corridors</span>
              </div>
              <div className="text-xl font-black text-white">2 Highways</div>
              <div className="text-[11px] text-slate-400">NH-24 (Lucknow-Sitapur) &amp; SH-30 (Biswan)</div>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/80 rounded-2xl p-3.5 space-y-1">
              <div className="text-xs text-blue-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5" />
                <span>Commercial Arteries</span>
              </div>
              <div className="text-xl font-black text-white">4 Main Roads</div>
              <div className="text-[11px] text-slate-400">BCM, Bahraich, Nai Bazar &amp; Purani Bazar</div>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/80 rounded-2xl p-3.5 space-y-1">
              <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Signpost className="w-3.5 h-3.5" />
                <span>Awadh Hubs</span>
              </div>
              <div className="text-xl font-black text-white">6 Chaurahas</div>
              <div className="text-[11px] text-slate-400">Khairabad, Fazl-e-Haq Smarak, Chungi &amp; More</div>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/80 rounded-2xl p-3.5 space-y-1">
              <div className="text-xs text-purple-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Traditional Wards</span>
              </div>
              <div className="text-xl font-black text-white">8 Mohallas</div>
              <div className="text-[11px] text-slate-400">Joshitola, Sujawalpur, Arjunpur, Mevati Tola</div>
            </div>
          </div>

          {/* In-page Search Bar */}
          <div className="pt-2">
            <div className="relative max-w-2xl">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search highways, local roads, landmarks (e.g. BCM Hospital, NH-24, Hira Market, Joshitola)..."
                className="w-full pl-10 pr-10 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tab Strip */}
      <section className="sticky top-16 sm:top-[72px] z-30 bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Corridors &amp; Hubs ({MAIN_ROADS_CONNECTIVITY.length})
          </button>
          <button
            onClick={() => setActiveTab('highways')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'highways'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Highways &amp; Regional Arteries (2)</span>
          </button>
          <button
            onClick={() => setActiveTab('local-roads')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'local-roads'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Central Local &amp; Commercial Roads (4)</span>
          </button>
          <button
            onClick={() => setActiveTab('chaurahas')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'chaurahas'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Signpost className="w-3.5 h-3.5" />
            <span>Chauraha Hubs (6)</span>
          </button>
          <button
            onClick={() => setActiveTab('mohallas')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'mohallas'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Traditional Mohallas (8)</span>
          </button>
          <button
            onClick={() => setActiveTab('transit')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'transit'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
            <span>Commute &amp; Transport Hubs</span>
          </button>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
        {/* Awadh Navigation Tip Card */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-orange-500/10 border border-amber-300 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-bold">
              <Signpost className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-amber-950">
                Directory Tip: Awadh Region Navigation &amp; Mohalla Filtering
              </h3>
              <p className="text-xs text-amber-900 leading-relaxed max-w-3xl">
                In Khairabad and the Awadh region, locals, delivery riders, and visitors rely primarily on <strong>Chauraha (Intersection) Hubs</strong> and <strong>Traditional Mohallas</strong> rather than house numbers. You can filter the live directory by both Road Name and Mohalla simultaneously.
              </p>
            </div>
          </div>
          <button
            onClick={onBackToDirectory}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-xs shrink-0 flex items-center gap-1.5"
          >
            <span>Explore City Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Selected Road Business Showcase Drawer */}
        {activeSelectedRoadData && (
          <div className="bg-white rounded-3xl border-2 border-amber-400 p-6 shadow-md space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-800">
                  <span>🛣️ Directory Listings Along:</span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    {activeSelectedRoadData.name}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Showing businesses, government centers, and healthcare units located on this corridor.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectRoadFilter(activeSelectedRoadData.name)}
                  className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-2xs"
                >
                  <span>Filter Directory by this Road</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setSelectedRoadForListings(null)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 text-xs font-bold"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {activeRoadListings.length === 0 ? (
              <div className="text-center py-8 space-y-2 text-slate-500">
                <Store className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs">No businesses mapped to this specific road yet in the database.</p>
                {onOpenAddModal && (
                  <button
                    onClick={onOpenAddModal}
                    className="text-xs font-bold text-amber-800 underline hover:text-amber-950"
                  >
                    + Add the first business on {activeSelectedRoadData.name}
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeRoadListings.map((listing) => (
                  <DirectoryListingCard
                    key={listing.id}
                    listing={listing}
                    onSelect={(item) => {
                      if (onOpenListingDetail) {
                        onOpenListingDetail(item);
                      } else {
                        onBackToDirectory();
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Section 1: Category 1 - Highways & Regional Arteries */}
        {(activeTab === 'all' || activeTab === 'highways') && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
                  <Car className="w-4 h-4" />
                  <span>Category 1</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                  🛣️ Highways &amp; Regional Arteries
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  The primary regional entry and exit corridors of Khairabad handling the highest daily transit, passenger, and commercial freight traffic.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full shrink-0">
                2 Corridors
              </span>
            </div>

            {/* Comparison Table View (As requested in brief) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Regional Arteries Overview Matrix
                </span>
                <span className="text-[11px] text-amber-400 font-semibold">
                  Sitapur · Lucknow · Biswan Transit
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">Road Name</th>
                      <th className="py-3 px-4">Local Extension / Alternate Name</th>
                      <th className="py-3 px-4">Key Landmarks &amp; Features</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-4 px-4 font-extrabold text-slate-900 whitespace-nowrap align-top">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
                          <span>National Highway 24 (NH-24)</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block ml-4.5 font-normal">
                          Sitapur-Lucknow Expressway link
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-700 align-top">
                        <span className="font-semibold text-slate-900">Sitapur Road</span> / Lucknow-Sitapur Road
                      </td>
                      <td className="py-4 px-4 text-slate-600 space-y-1 align-top leading-relaxed">
                        <p>• Connects Khairabad to <strong>Lucknow (~80km)</strong> and <strong>Sitapur City (~8km)</strong>.</p>
                        <p>• High-density commercial hub featuring <strong>Khairabad Chauraha (Crossroad)</strong> and the <strong>Barabhari Toll Plaza</strong>.</p>
                      </td>
                      <td className="py-4 px-4 text-right align-top whitespace-nowrap space-y-1.5">
                        <a
                          href="https://www.google.com/maps/search/National+Highway+24+Khairabad+Sitapur+Uttar+Pradesh"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:text-blue-900 underline block"
                        >
                          <span>Google Maps</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <button
                          onClick={() => {
                            setSelectedRoadForListings('nh-24');
                            window.scrollTo({ top: 380, behavior: 'smooth' });
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-bold bg-blue-50 hover:bg-blue-100 text-blue-800 px-2.5 py-1 rounded-md"
                        >
                          <span>View Businesses</span>
                        </button>
                      </td>
                    </tr>

                    <tr className="hover:bg-emerald-50/40 transition-colors">
                      <td className="py-4 px-4 font-extrabold text-slate-900 whitespace-nowrap align-top">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
                          <span>State Highway 30 (SH-30)</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block ml-4.5 font-normal">
                          Biswan-Sitapur Link Corridor
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-700 align-top">
                        <span className="font-semibold text-slate-900">Biswan–Sitapur Road</span>
                      </td>
                      <td className="py-4 px-4 text-slate-600 space-y-1 align-top leading-relaxed">
                        <p>• Runs along the northern and eastern fringes.</p>
                        <p>• Connects local traffic moving toward <strong>Biswan</strong> and includes local landmarks like the <strong>Thana Khairabad (Police Station)</strong> and <strong>Suhaima Market</strong>.</p>
                      </td>
                      <td className="py-4 px-4 text-right align-top whitespace-nowrap space-y-1.5">
                        <a
                          href="https://www.google.com/maps/search/State+Highway+30+Biswan+Sitapur+Road+Khairabad+Uttar+Pradesh"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline block"
                        >
                          <span>Google Maps</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <button
                          onClick={() => {
                            setSelectedRoadForListings('sh-30');
                            window.scrollTo({ top: 380, behavior: 'smooth' });
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md"
                        >
                          <span>View Businesses</span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cards for NH-24 and SH-30 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRoads
                .filter((r) => r.category === 'highways')
                .map((road) => (
                  <div
                    key={road.id}
                    className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all space-y-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${road.badgeColor}`}>
                          Regional Artery
                        </span>
                        <h3 className="text-lg font-black text-slate-950 font-display">
                          {road.name}
                        </h3>
                        {road.hindiName && (
                          <div className="text-xs text-slate-500 font-medium">
                            {road.hindiName}
                          </div>
                        )}
                      </div>
                      <a
                        href={road.routeGoogleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50 text-slate-600 hover:text-amber-800 border border-slate-200 transition-colors"
                        title="Open in Google Maps"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-3.5 space-y-1.5 text-xs border border-slate-100">
                      <span className="font-bold text-slate-500 text-[10px] uppercase tracking-wider block">
                        Significance &amp; Traffic Role:
                      </span>
                      <p className="text-slate-700 leading-relaxed">
                        {road.significance}
                      </p>
                    </div>

                    <div className="space-y-2 text-xs">
                      <span className="font-bold text-slate-900 text-xs block">
                        Key Landmarks &amp; Directory Highlights:
                      </span>
                      <ul className="space-y-1 text-slate-600">
                        {road.directoryHighlights.map((hl, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-amber-500 font-bold">•</span>
                            <span>{hl}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
                      <span className="text-[11px] font-bold text-slate-400">Connected Hubs:</span>
                      {road.chaurahaHubs.map((hub, idx) => (
                        <button
                          key={idx}
                          onClick={() => onSelectChaurahaFilter(hub)}
                          className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] rounded-md font-semibold transition-colors"
                        >
                          🚦 {hub}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setSelectedRoadForListings(road.id);
                          window.scrollTo({ top: 380, behavior: 'smooth' });
                        }}
                        className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                      >
                        <span>Show Businesses Here</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onSelectRoadFilter(road.name)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <span>Filter Directory</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Section 2: Category 2 - Central Local & Commercial Roads */}
        {(activeTab === 'all' || activeTab === 'local-roads') && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                  <Building className="w-4 h-4" />
                  <span>Category 2</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                  🏙️ Central Local &amp; Commercial Roads
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  These inner-city roads form the backbone of local trade, medical facilities, administrative hubs, and historical neighborhoods.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full shrink-0">
                4 Essential Routes
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRoads
                .filter((r) => r.category === 'local-roads')
                .map((road) => (
                  <div
                    key={road.id}
                    className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all space-y-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${road.badgeColor}`}>
                          Commercial Route
                        </span>
                        <h3 className="text-lg font-black text-slate-950 font-display">
                          {road.name}
                        </h3>
                        {road.hindiName && (
                          <div className="text-xs text-slate-500 font-medium">
                            {road.hindiName}
                          </div>
                        )}
                      </div>
                      <a
                        href={road.routeGoogleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50 text-slate-600 hover:text-amber-800 border border-slate-200 transition-colors"
                        title="Open in Google Maps"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-3.5 space-y-1.5 text-xs border border-slate-100">
                      <span className="font-bold text-slate-500 text-[10px] uppercase tracking-wider block">
                        Significance:
                      </span>
                      <p className="text-slate-800 leading-relaxed font-medium">
                        {road.significance}
                      </p>
                    </div>

                    <div className="space-y-2 text-xs">
                      <span className="font-bold text-slate-900 text-xs block">
                        Top Directory Points &amp; Landmarks:
                      </span>
                      <ul className="space-y-1 text-slate-600">
                        {road.directoryHighlights.map((hl, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-rose-500 font-bold">•</span>
                            <span className="leading-relaxed">{hl}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-amber-50/60 rounded-xl p-3 text-xs border border-amber-200/60 space-y-1">
                      <span className="font-bold text-amber-900 text-[10px] uppercase tracking-wider block">
                        Key Points of Interest:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {road.keyLandmarks.map((lm, idx) => (
                          <span
                            key={idx}
                            className="bg-white/90 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md text-[11px] font-semibold"
                          >
                            {lm}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
                      <span className="text-[11px] font-bold text-slate-400">Borders Mohallas:</span>
                      {road.connectedMohallas.map((m, idx) => (
                        <button
                          key={idx}
                          onClick={() => onSelectMohallaFilter(m)}
                          className="px-2 py-0.5 bg-purple-50 hover:bg-purple-100 text-purple-900 text-[11px] rounded-md font-semibold transition-colors border border-purple-200"
                        >
                          🏘️ {m}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setSelectedRoadForListings(road.id);
                          window.scrollTo({ top: 380, behavior: 'smooth' });
                        }}
                        className="text-xs font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1"
                      >
                        <span>Show Businesses Here</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onSelectRoadFilter(road.name)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <span>Filter Directory</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Section 3: Chauraha (Intersection) Hubs */}
        {(activeTab === 'all' || activeTab === 'chaurahas') && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                  <Signpost className="w-4 h-4" />
                  <span>Tip 1: Awadh Chaurahas</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                  🚦 Chauraha (Intersection) Hubs
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  In Awadh directories, users look up businesses and meeting points based on crossroads. Tagging and navigating by major intersection hubs ensures instant accuracy.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full shrink-0">
                6 Major Hubs
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredChaurahas.map((chauraha) => (
                <div
                  key={chauraha.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-sm transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Crossroad Hub
                        </span>
                        <h3 className="text-base font-bold text-slate-950 mt-1 font-display">
                          {chauraha.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          {chauraha.hindiName}
                        </p>
                      </div>
                      <a
                        href={chauraha.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-emerald-700"
                        title="Directions in Google Maps"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {chauraha.description}
                    </p>

                    <div className="space-y-1.5 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="text-[11px] font-bold text-slate-700">
                        🛣️ Road: <span className="font-normal text-slate-600">{chauraha.road}</span>
                      </div>
                      <div className="text-[11px] font-bold text-slate-700">
                        🏘️ Mohalla: <span className="font-normal text-slate-600">{chauraha.mohalla}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Key Landmarks Here:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {chauraha.landmarks.map((lm, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                          >
                            {lm}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onSelectChaurahaFilter(chauraha.name)}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline"
                    >
                      Filter Directory by Hub
                    </button>
                    <a
                      href={chauraha.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                    >
                      Directions
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 4: Traditional Mohallas */}
        {(activeTab === 'all' || activeTab === 'mohallas') && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
                  <Layers className="w-4 h-4" />
                  <span>Tip 2: Neighborhood Directory</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                  🏘️ Traditional Mohalla Filters &amp; Connectivity
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Khairabad is densely packed with heritage mohallas. Residents and shoppers can explore each neighborhood, its primary connecting road, and trade specialties.
                </p>
              </div>
              <span className="text-xs font-bold text-purple-800 bg-purple-100 px-3 py-1 rounded-full shrink-0">
                8 Mohallas
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredMohallas.map((mohalla) => (
                <div
                  key={mohalla.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:border-purple-300 transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200">
                        Awadh Ward
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-extrabold text-slate-900">
                        {mohalla.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {mohalla.hindiName}
                      </p>
                    </div>

                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <strong>Primary Road:</strong> {mohalla.primaryRoad}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {mohalla.character}
                    </p>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Highlights:</span>
                      <ul className="text-[11px] text-slate-600 space-y-0.5">
                        {mohalla.highlights.map((h, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-purple-500 font-bold">•</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onSelectMohallaFilter(mohalla.name)}
                      className="w-full py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"
                    >
                      <span>Filter Listings in {mohalla.name}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 5: Transit & Commuter Information Hub */}
        {(activeTab === 'all' || activeTab === 'transit') && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                  <Bus className="w-4 h-4" />
                  <span>Commute &amp; Transport</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                  🚌 Khairabad Local Transit, Tempo Stands &amp; Rail Connectivity
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  How residents and visitors get around town, reach Sitapur City, or commute to the state capital Lucknow.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* E-Rickshaw & Tempo Stand */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Car className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 font-display">
                    Local E-Rickshaw &amp; Shared Tempos
                  </h3>
                  <p className="text-xs text-slate-500">
                    Continuous green transit between Khairabad Chauraha and inner town mohallas.
                  </p>
                </div>
                <ul className="text-xs text-slate-600 space-y-2 border-t border-slate-100 pt-3">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-amber-600">•</span>
                    <span><strong>Khairabad Chauraha to Sitapur Eye Hospital:</strong> Shared tempos run every 3 mins (~₹15-20).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-amber-600">•</span>
                    <span><strong>Nai Bazar to BCM Hospital:</strong> E-rickshaws available along BCM road corridor (~₹10).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-amber-600">•</span>
                    <span><strong>Purani Bazar to RTO Office:</strong> Quick connectivity via Bahraich link (~₹15).</span>
                  </li>
                </ul>
              </div>

              {/* Intercity Bus Connectivity */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  <Bus className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 font-display">
                    UPSRTC &amp; Highway Bus Corridor
                  </h3>
                  <p className="text-xs text-slate-500">
                    Frequent long-distance state roadway buses on NH-24.
                  </p>
                </div>
                <ul className="text-xs text-slate-600 space-y-2 border-t border-slate-100 pt-3">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-blue-600">•</span>
                    <span><strong>Lucknow (Kaiserbagh / Charbagh):</strong> Express and Janrath AC buses run every 15-20 mins on NH-24 (80 km, ~1 hr 30 mins).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-blue-600">•</span>
                    <span><strong>Sitapur Bus Station (8 km):</strong> Regular city transit shuttles at Khairabad Chauraha.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-blue-600">•</span>
                    <span><strong>Biswan Route:</strong> Rural buses &amp; private shuttles departing via SH-30 near Thana Khairabad.</span>
                  </li>
                </ul>
              </div>

              {/* Railway Station & Toll Plaza */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Train className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 font-display">
                    Khairabad Oudh Railway &amp; Barabhari Toll
                  </h3>
                  <p className="text-xs text-slate-500">
                    Station Code: KB · North Eastern Railway (NER) Lucknow division.
                  </p>
                </div>
                <ul className="text-xs text-slate-600 space-y-2 border-t border-slate-100 pt-3">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-emerald-600">•</span>
                    <span><strong>Khairabad Oudh Railway Station:</strong> Connects Sitapur Jn and Sitapur Cantt to Lucknow Junction (NER).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-emerald-600">•</span>
                    <span><strong>Barabhari Toll Plaza:</strong> 24/7 FASTag toll barrier located directly on NH-24 Sitapur Road.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-emerald-600">•</span>
                    <span><strong>Emergency Highway Breakdown:</strong> NH-24 Emergency Helpline: 1033.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* Bottom CTA to Explore Directory */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white rounded-3xl p-8 sm:p-10 shadow-lg text-center space-y-4">
          <div className="max-w-2xl mx-auto space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold font-display">
              Ready to Discover Places Along These Roads?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Browse hospitals on BCM Road, RTO services on Bahraich Road, or shops in Purani Bazar in the interactive Khairabad directory.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onBackToDirectory}
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs shadow-sm transition-colors flex items-center gap-2"
            >
              <span>Explore Complete Directory</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            {onOpenAddModal && (
              <button
                onClick={onOpenAddModal}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold rounded-xl text-xs transition-colors"
              >
                + Register a Business on Road
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
