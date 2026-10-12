import React, { useState, useEffect, useMemo } from 'react';
import {
  Signpost,
  MapPin,
  Store,
  Navigation,
  Compass,
  Plus,
  Edit,
  Trash2,
  Search,
  RotateCcw,
  ExternalLink,
  Save,
  X,
  AlertTriangle,
  Building2,
  Clock,
  CheckCircle,
  ShoppingBag,
} from 'lucide-react';
import {
  TraditionalMohalla,
  ChaurahaHub,
  RoadConnectivityItem,
} from '../data/roadsConnectivityData';
import {
  TownMarketItem,
  getStoredMohallas,
  saveOrUpdateMohalla,
  deleteMohalla,
  resetMohallasToDefault,
  getStoredMarkets,
  saveOrUpdateMarket,
  deleteMarket,
  resetMarketsToDefault,
  getStoredChaurahas,
  saveOrUpdateChauraha,
  deleteChauraha,
  resetChaurahasToDefault,
  getStoredRoads,
  saveOrUpdateRoad,
  deleteRoad,
  resetRoadsToDefault,
} from '../utils/siteContentStorage';

interface AdminLocationsManagerProps {
  onToast?: (text: string, type?: 'success' | 'info' | 'error') => void;
}

export const AdminLocationsManager: React.FC<AdminLocationsManagerProps> = ({ onToast }) => {
  const [activeSubTab, setActiveSubTab] = useState<'mohallas' | 'markets' | 'chaurahas' | 'roads'>('mohallas');
  const [searchQuery, setSearchQuery] = useState('');

  // Stored state
  const [mohallas, setMohallas] = useState<TraditionalMohalla[]>(() => getStoredMohallas());
  const [markets, setMarkets] = useState<TownMarketItem[]>(() => getStoredMarkets());
  const [chaurahas, setChaurahas] = useState<ChaurahaHub[]>(() => getStoredChaurahas());
  const [roads, setRoads] = useState<RoadConnectivityItem[]>(() => getStoredRoads());

  // Modals state
  const [editingMohalla, setEditingMohalla] = useState<TraditionalMohalla | null>(null);
  const [isAddMohallaOpen, setIsAddMohallaOpen] = useState(false);

  const [editingMarket, setEditingMarket] = useState<TownMarketItem | null>(null);
  const [isAddMarketOpen, setIsAddMarketOpen] = useState(false);

  const [editingChauraha, setEditingChauraha] = useState<ChaurahaHub | null>(null);
  const [isAddChaurahaOpen, setIsAddChaurahaOpen] = useState(false);

  const [editingRoad, setEditingRoad] = useState<RoadConnectivityItem | null>(null);
  const [isAddRoadOpen, setIsAddRoadOpen] = useState(false);

  // Sync with storage events
  useEffect(() => {
    const handleSync = () => {
      setMohallas(getStoredMohallas());
      setMarkets(getStoredMarkets());
      setChaurahas(getStoredChaurahas());
      setRoads(getStoredRoads());
    };
    window.addEventListener('khairabad_locations_updated', handleSync);
    return () => {
      window.removeEventListener('khairabad_locations_updated', handleSync);
    };
  }, []);

  // Filtered lists
  const filteredMohallas = useMemo(() => {
    if (!searchQuery.trim()) return mohallas;
    const q = searchQuery.toLowerCase();
    return mohallas.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.hindiName.toLowerCase().includes(q) ||
        m.primaryRoad.toLowerCase().includes(q) ||
        m.chaurahaHub.toLowerCase().includes(q) ||
        m.character.toLowerCase().includes(q) ||
        m.wardNumber.toString() === q.trim()
    );
  }, [mohallas, searchQuery]);

  const filteredMarkets = useMemo(() => {
    if (!searchQuery.trim()) return markets;
    const q = searchQuery.toLowerCase();
    return markets.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.hindiName.toLowerCase().includes(q) ||
        m.type.toLowerCase().includes(q) ||
        m.road.toLowerCase().includes(q) ||
        m.mohalla.toLowerCase().includes(q) ||
        m.chaurahaHub.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q)
    );
  }, [markets, searchQuery]);

  const filteredChaurahas = useMemo(() => {
    if (!searchQuery.trim()) return chaurahas;
    const q = searchQuery.toLowerCase();
    return chaurahas.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.hindiName.toLowerCase().includes(q) ||
        c.road.toLowerCase().includes(q) ||
        c.mohalla.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }, [chaurahas, searchQuery]);

  const filteredRoads = useMemo(() => {
    if (!searchQuery.trim()) return roads;
    const q = searchQuery.toLowerCase();
    return roads.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        (r.hindiName && r.hindiName.toLowerCase().includes(q)) ||
        r.categoryLabel.toLowerCase().includes(q) ||
        r.significance.toLowerCase().includes(q) ||
        r.alternateNames.toLowerCase().includes(q)
    );
  }, [roads, searchQuery]);

  // Handlers for Mohallas
  const handleSaveMohalla = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMohalla) return;
    if (!editingMohalla.name.trim() || !editingMohalla.hindiName.trim()) {
      onToast?.('Please provide both English and Hindi names for the Mohalla.', 'error');
      return;
    }
    const updated = saveOrUpdateMohalla(editingMohalla);
    setMohallas(updated);
    setEditingMohalla(null);
    setIsAddMohallaOpen(false);
    onToast?.(`Mohalla "${editingMohalla.name}" saved successfully!`, 'success');
  };

  const handleDeleteMohalla = (item: TraditionalMohalla) => {
    if (confirm(`Are you sure you want to delete Mohalla Ward ${item.wardNumber}: "${item.name}"?`)) {
      const updated = deleteMohalla(item.id);
      setMohallas(updated);
      onToast?.(`Deleted Mohalla "${item.name}".`, 'info');
    }
  };

  const handleResetMohallas = () => {
    if (confirm('Reset all Mohallas and Wards back to Khairabad official municipal 25 wards?')) {
      const updated = resetMohallasToDefault();
      setMohallas(updated);
      onToast?.('Reset Mohallas to default 25 wards.', 'info');
    }
  };

  // Handlers for Markets
  const handleSaveMarket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMarket) return;
    if (!editingMarket.name.trim()) {
      onToast?.('Market name is required.', 'error');
      return;
    }
    const updated = saveOrUpdateMarket(editingMarket);
    setMarkets(updated);
    setEditingMarket(null);
    setIsAddMarketOpen(false);
    onToast?.(`Market "${editingMarket.name}" saved successfully!`, 'success');
  };

  const handleDeleteMarket = (item: TownMarketItem) => {
    if (confirm(`Are you sure you want to delete Market "${item.name}"?`)) {
      const updated = deleteMarket(item.id);
      setMarkets(updated);
      onToast?.(`Deleted Market "${item.name}".`, 'info');
    }
  };

  const handleResetMarkets = () => {
    if (confirm('Reset all Markets back to town defaults (Nai Bazar, Lateef, Purani, Galla Mandi, Hira Market, etc.)?')) {
      const updated = resetMarketsToDefault();
      setMarkets(updated);
      onToast?.('Reset Markets to town defaults.', 'info');
    }
  };

  // Handlers for Chaurahas
  const handleSaveChauraha = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingChauraha) return;
    if (!editingChauraha.name.trim()) {
      onToast?.('Chauraha name is required.', 'error');
      return;
    }
    const updated = saveOrUpdateChauraha(editingChauraha);
    setChaurahas(updated);
    setEditingChauraha(null);
    setIsAddChaurahaOpen(false);
    onToast?.(`Chauraha "${editingChauraha.name}" saved successfully!`, 'success');
  };

  const handleDeleteChauraha = (item: ChaurahaHub) => {
    if (confirm(`Are you sure you want to delete Chauraha "${item.name}"?`)) {
      const updated = deleteChauraha(item.id);
      setChaurahas(updated);
      onToast?.(`Deleted Chauraha "${item.name}".`, 'info');
    }
  };

  const handleResetChaurahas = () => {
    if (confirm('Reset all Chaurahas back to town defaults (Batto Khan, Khairabad, BCM, Thana, etc.)?')) {
      const updated = resetChaurahasToDefault();
      setChaurahas(updated);
      onToast?.('Reset Chaurahas to town defaults.', 'info');
    }
  };

  // Handlers for Roads
  const handleSaveRoad = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoad) return;
    if (!editingRoad.name.trim()) {
      onToast?.('Road name is required.', 'error');
      return;
    }
    const updated = saveOrUpdateRoad(editingRoad);
    setRoads(updated);
    setEditingRoad(null);
    setIsAddRoadOpen(false);
    onToast?.(`Road "${editingRoad.name}" saved successfully!`, 'success');
  };

  const handleDeleteRoad = (item: RoadConnectivityItem) => {
    if (confirm(`Are you sure you want to delete Road "${item.name}"?`)) {
      const updated = deleteRoad(item.id);
      setRoads(updated);
      onToast?.(`Deleted Road "${item.name}".`, 'info');
    }
  };

  const handleResetRoads = () => {
    if (confirm('Reset all Roads & Arteries back to town defaults?')) {
      const updated = resetRoadsToDefault();
      setRoads(updated);
      onToast?.('Reset Roads to town defaults.', 'info');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-400 text-slate-950 font-bold shadow-md">
                <Signpost className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-black text-white font-display tracking-tight">
                Town Infrastructure &amp; Localities Manager
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Manage Khairabad Municipal Mohallas &amp; Wards, Famous Bazaars &amp; Markets, Landmark Chaurahas, and Major Roads &amp; Arteries.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {activeSubTab === 'mohallas' && (
              <button
                onClick={() => {
                  setEditingMohalla({
                    id: `moh-${Date.now()}`,
                    wardNumber: mohallas.length + 1,
                    name: '',
                    hindiName: '',
                    primaryRoad: 'BCM Road',
                    character: '',
                    highlights: [],
                    chaurahaHub: 'Nai Bazar Chauraha',
                  });
                  setIsAddMohallaOpen(true);
                }}
                className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-md flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>+ Add Mohalla / Ward</span>
              </button>
            )}

            {activeSubTab === 'markets' && (
              <button
                onClick={() => {
                  setEditingMarket({
                    id: `mkt-${Date.now()}`,
                    name: '',
                    hindiName: '',
                    type: 'Retail Shopping & Consumer Hub',
                    road: 'Nai Bazar Road',
                    mohalla: 'Joshitola',
                    chaurahaHub: 'Nai Bazar Chauraha',
                    openingHours: '9:00 AM – 9:00 PM (Daily)',
                    description: '',
                    specialties: [],
                    approxShops: '50+ Shops',
                    googleMapsUrl: '',
                  });
                  setIsAddMarketOpen(true);
                }}
                className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-md flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>+ Add Market / Bazaar</span>
              </button>
            )}

            {activeSubTab === 'chaurahas' && (
              <button
                onClick={() => {
                  setEditingChauraha({
                    id: `chauraha-${Date.now()}`,
                    name: '',
                    hindiName: '',
                    road: 'Nai Bazar Road / Bahraich Link',
                    mohalla: 'Joshitola',
                    description: '',
                    landmarks: [],
                    googleMapsUrl: '',
                  });
                  setIsAddChaurahaOpen(true);
                }}
                className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-md flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>+ Add Chauraha Hub</span>
              </button>
            )}

            {activeSubTab === 'roads' && (
              <button
                onClick={() => {
                  setEditingRoad({
                    id: `road-${Date.now()}`,
                    name: '',
                    hindiName: '',
                    category: 'local-roads',
                    categoryLabel: '🏙️ Central Local & Commercial Road',
                    alternateNames: '',
                    significance: '',
                    keyLandmarks: [],
                    directoryHighlights: [],
                    connectedMohallas: [],
                    chaurahaHubs: [],
                    targetAudience: 'Town Residents & Shoppers',
                    routeGoogleMapsUrl: '',
                    lengthOrSpan: '~1.5 km',
                    speedLimitOrTraffic: 'Commercial Traffic',
                    badgeColor: 'bg-emerald-600 text-white',
                    gradient: 'from-emerald-600 to-teal-700',
                  });
                  setIsAddRoadOpen(true);
                }}
                className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-md flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>+ Add Road / Artery</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats Metric Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div
            onClick={() => setActiveSubTab('mohallas')}
            className={`cursor-pointer p-3.5 rounded-2xl border transition-all text-left ${
              activeSubTab === 'mohallas'
                ? 'bg-amber-500/15 border-amber-500/50 shadow-md ring-1 ring-amber-500/30'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Municipal Mohallas</span>
            </div>
            <div className="text-2xl font-black text-white mt-1">{mohallas.length}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">25 Official Wards</div>
          </div>

          <div
            onClick={() => setActiveSubTab('markets')}
            className={`cursor-pointer p-3.5 rounded-2xl border transition-all text-left ${
              activeSubTab === 'markets'
                ? 'bg-amber-500/15 border-amber-500/50 shadow-md ring-1 ring-amber-500/30'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
              <span>Markets &amp; Bazaars</span>
            </div>
            <div className="text-2xl font-black text-white mt-1">{markets.length}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Commercial &amp; Mandis</div>
          </div>

          <div
            onClick={() => setActiveSubTab('chaurahas')}
            className={`cursor-pointer p-3.5 rounded-2xl border transition-all text-left ${
              activeSubTab === 'chaurahas'
                ? 'bg-amber-500/15 border-amber-500/50 shadow-md ring-1 ring-amber-500/30'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-amber-400" />
              <span>Landmark Chaurahas</span>
            </div>
            <div className="text-2xl font-black text-white mt-1">{chaurahas.length}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Major Crossroads</div>
          </div>

          <div
            onClick={() => setActiveSubTab('roads')}
            className={`cursor-pointer p-3.5 rounded-2xl border transition-all text-left ${
              activeSubTab === 'roads'
                ? 'bg-amber-500/15 border-amber-500/50 shadow-md ring-1 ring-amber-500/30'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Roads &amp; Arteries</span>
            </div>
            <div className="text-2xl font-black text-white mt-1">{roads.length}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Highways &amp; Streets</div>
          </div>
        </div>
      </div>

      {/* Sub Navigation Bar & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveSubTab('mohallas')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'mohallas'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Mohallas &amp; Wards ({mohallas.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('markets')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'markets'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Markets &amp; Bazaars ({markets.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('chaurahas')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'chaurahas'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Chaurahas ({chaurahas.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('roads')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'roads'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Roads &amp; Arteries ({roads.length})</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeSubTab}...`}
            className="w-full bg-slate-900 border border-slate-800 text-white text-xs rounded-xl pl-9 pr-8 py-2 outline-none focus:border-amber-400 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ================================================================= */}
      {/* SUB-TAB 1: MOHALLAS & MUNICIPAL WARDS */}
      {/* ================================================================= */}
      {activeSubTab === 'mohallas' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing <strong>{filteredMohallas.length}</strong> of <strong>{mohallas.length}</strong> Municipal Wards
            </span>
            <button
              onClick={handleResetMohallas}
              className="text-amber-400 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Mohallas to Official 25 Wards</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMohallas.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4.5 space-y-3 transition-all shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="inline-block text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md mb-1">
                        Ward No. {item.wardNumber}
                      </span>
                      <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <span>{item.name}</span>
                        <span className="text-amber-300 font-hindi text-xs">({item.hindiName})</span>
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingMohalla({ ...item });
                          setIsAddMohallaOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Edit Mohalla details"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteMohalla(item)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Delete Mohalla"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <span className="text-slate-500">🛣️ Primary Road:</span>
                      <span className="text-slate-200 font-medium">{item.primaryRoad}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <span className="text-slate-500">🚦 Nearest Chauraha:</span>
                      <span className="text-amber-200/90 font-medium">{item.chaurahaHub}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                    {item.character}
                  </p>

                  {item.highlights && item.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.highlights.map((h, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/60"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* SUB-TAB 2: MARKETS & BAZAARS */}
      {/* ================================================================= */}
      {activeSubTab === 'markets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing <strong>{filteredMarkets.length}</strong> of <strong>{markets.length}</strong> Markets &amp; Mandis
            </span>
            <button
              onClick={handleResetMarkets}
              className="text-amber-400 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Markets to Town Defaults</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMarkets.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4.5 space-y-3 transition-all shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md mb-1">
                        {item.type}
                      </span>
                      <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <span>{item.name}</span>
                        <span className="text-amber-300 font-hindi text-xs">({item.hindiName})</span>
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingMarket({ ...item });
                          setIsAddMarketOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Edit Market details"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteMarket(item)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Delete Market"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <span className="text-slate-500">📍 Road &amp; Ward:</span>
                      <span className="text-slate-200 font-medium">
                        {item.road} · {item.mohalla}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <span className="text-slate-500">🚦 Nearest Chauraha:</span>
                      <span className="text-amber-200/90 font-medium">{item.chaurahaHub}</span>
                    </div>
                    {item.openingHours && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{item.openingHours}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                    {item.description}
                  </p>

                  {item.specialties && item.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.specialties.map((s, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/20"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {item.googleMapsUrl && (
                    <a
                      href={item.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:underline pt-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>View on Google Maps</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* SUB-TAB 3: LANDMARK CHAURAHAS */}
      {/* ================================================================= */}
      {activeSubTab === 'chaurahas' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing <strong>{filteredChaurahas.length}</strong> of <strong>{chaurahas.length}</strong> Landmark Chaurahas
            </span>
            <button
              onClick={handleResetChaurahas}
              className="text-amber-400 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Chaurahas to Defaults</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredChaurahas.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4.5 space-y-3 transition-all shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-md mb-1">
                        🚦 Landmark Crossroads
                      </span>
                      <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <span>{item.name}</span>
                        <span className="text-amber-300 font-hindi text-xs">({item.hindiName})</span>
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingChauraha({ ...item });
                          setIsAddChaurahaOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Edit Chauraha details"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteChauraha(item)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Delete Chauraha"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <span className="text-slate-500">🛣️ Connecting Road:</span>
                      <span className="text-slate-200 font-medium">{item.road}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <span className="text-slate-500">🏘️ Mohalla Corridor:</span>
                      <span className="text-amber-200/90 font-medium">{item.mohalla}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                    {item.description}
                  </p>

                  {item.landmarks && item.landmarks.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">
                        Key Features &amp; Landmarks:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {item.landmarks.map((l, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/60"
                          >
                            {l}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {item.googleMapsUrl && (
                    <a
                      href={item.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:underline pt-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>View on Google Maps</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* SUB-TAB 4: ROADS & ARTERIES */}
      {/* ================================================================= */}
      {activeSubTab === 'roads' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing <strong>{filteredRoads.length}</strong> of <strong>{roads.length}</strong> Roads &amp; Arteries
            </span>
            <button
              onClick={handleResetRoads}
              className="text-amber-400 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Roads to Defaults</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRoads.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4.5 space-y-3 transition-all shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span
                        className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md mb-1 ${
                          item.category === 'highways'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {item.categoryLabel || (item.category === 'highways' ? 'Highway Artery' : 'Central Local Road')}
                      </span>
                      <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <span>{item.name}</span>
                        {item.hindiName && (
                          <span className="text-amber-300 font-hindi text-xs">({item.hindiName})</span>
                        )}
                      </h3>
                      {item.alternateNames && (
                        <span className="text-[11px] text-slate-400 block mt-0.5">{item.alternateNames}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingRoad({ ...item });
                          setIsAddRoadOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Edit Road details"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteRoad(item)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Delete Road"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Span / Length:</span>
                      <span className="text-slate-200 font-semibold">{item.lengthOrSpan || '~2.0 km'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Traffic / Speed:</span>
                      <span className="text-slate-200 font-semibold">{item.speedLimitOrTraffic || 'Normal Town Traffic'}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.significance}
                  </p>

                  {item.keyLandmarks && item.keyLandmarks.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">
                        Key Landmarks Along Corridor:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {item.keyLandmarks.map((lm, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/60"
                          >
                            {lm}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {item.routeGoogleMapsUrl && (
                    <a
                      href={item.routeGoogleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:underline pt-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>View Route Map</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL: ADD / EDIT MOHALLA */}
      {/* ================================================================= */}
      {isAddMohallaOpen && editingMohalla && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-xl w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>{editingMohalla.name ? `Edit Ward ${editingMohalla.wardNumber}: ${editingMohalla.name}` : 'Add Municipal Mohalla & Ward'}</span>
              </h3>
              <button
                onClick={() => {
                  setEditingMohalla(null);
                  setIsAddMohallaOpen(false);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMohalla} className="space-y-3.5">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Ward Number *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editingMohalla.wardNumber}
                    onChange={(e) => setEditingMohalla({ ...editingMohalla, wardNumber: parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Mohalla Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={editingMohalla.name}
                    onChange={(e) => setEditingMohalla({ ...editingMohalla, name: e.target.value })}
                    placeholder="e.g. Joshitola"
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hindi Name (हिंदी) *</label>
                  <input
                    type="text"
                    required
                    value={editingMohalla.hindiName}
                    onChange={(e) => setEditingMohalla({ ...editingMohalla, hindiName: e.target.value })}
                    placeholder="e.g. जोशीटोला"
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400 font-hindi"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Road Link</label>
                  <input
                    type="text"
                    value={editingMohalla.primaryRoad}
                    onChange={(e) => setEditingMohalla({ ...editingMohalla, primaryRoad: e.target.value })}
                    placeholder="e.g. Nai Bazar Road / BCM Road"
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nearest Chauraha Hub</label>
                  <input
                    type="text"
                    value={editingMohalla.chaurahaHub}
                    onChange={(e) => setEditingMohalla({ ...editingMohalla, chaurahaHub: e.target.value })}
                    placeholder="e.g. Nai Bazar Chauraha"
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Character &amp; Significance</label>
                <textarea
                  rows={2}
                  value={editingMohalla.character}
                  onChange={(e) => setEditingMohalla({ ...editingMohalla, character: e.target.value })}
                  placeholder="Civic character, historical legacy, or commercial significance of this ward..."
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Key Highlights (comma-separated)</label>
                <input
                  type="text"
                  value={editingMohalla.highlights ? editingMohalla.highlights.join(', ') : ''}
                  onChange={(e) =>
                    setEditingMohalla({
                      ...editingMohalla,
                      highlights: e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="e.g. Daily Retail Stores, Primary School, Historic Masjids"
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setEditingMohalla(null);
                    setIsAddMohallaOpen(false);
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Mohalla</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL: ADD / EDIT MARKET */}
      {/* ================================================================= */}
      {isAddMarketOpen && editingMarket && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-xl w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>{editingMarket.name ? `Edit Market: ${editingMarket.name}` : 'Add Town Market / Bazaar'}</span>
              </h3>
              <button
                onClick={() => {
                  setEditingMarket(null);
                  setIsAddMarketOpen(false);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMarket} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Market Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={editingMarket.name}
                    onChange={(e) => setEditingMarket({ ...editingMarket, name: e.target.value })}
                    placeholder="e.g. Nai Bazar Central Market"
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hindi Name (हिंदी) *</label>
                  <input
                    type="text"
                    required
                    value={editingMarket.hindiName}
                    onChange={(e) => setEditingMarket({ ...editingMarket, hindiName: e.target.value })}
                    placeholder="e.g. नई बाज़ार"
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400 font-hindi"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Market Type / Category</label>
                  <input
                    type="text"
                    value={editingMarket.type}
                    onChange={(e) => setEditingMarket({ ...editingMarket, type: e.target.value })}
                    placeholder="e.g. Retail Shopping / Wholesale Grain / Mandi"
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Approx Shops / Units</label>
                  <input
                    type="text"
                    value={editingMarket.approxShops || ''}
                    onChange={(e) => setEditingMarket({ ...editingMarket, approxShops: e.target.value })}
                    placeholder="e.g. 100+ Shops"
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Road Location</label>
                  <input
                    type="text"
                    value={editingMarket.road}
                    onChange={(e) => setEditingMarket({ ...editingMarket, road: e.target.value })}
                    placeholder="e.g. Nai Bazar Road"
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Mohalla / Ward</label>
                  <input
                    type="text"
                    value={editingMarket.mohalla}
                    onChange={(e) => setEditingMarket({ ...editingMarket, mohalla: e.target.value })}
                    placeholder="e.g. Joshitola"
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nearest Chauraha</label>
                  <input
                    type="text"
                    value={editingMarket.chaurahaHub}
                    onChange={(e) => setEditingMarket({ ...editingMarket, chaurahaHub: e.target.value })}
                    placeholder="e.g. Batto Khan Chauraha"
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Operating Hours</label>
                <input
                  type="text"
                  value={editingMarket.openingHours}
                  onChange={(e) => setEditingMarket({ ...editingMarket, openingHours: e.target.value })}
                  placeholder="e.g. 9:00 AM – 9:00 PM (Daily)"
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingMarket.description}
                  onChange={(e) => setEditingMarket({ ...editingMarket, description: e.target.value })}
                  placeholder="Comprehensive description of market offerings and footfall..."
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Specialties (comma-separated)</label>
                <input
                  type="text"
                  value={editingMarket.specialties ? editingMarket.specialties.join(', ') : ''}
                  onChange={(e) =>
                    setEditingMarket({
                      ...editingMarket,
                      specialties: e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="e.g. Clothing, Groceries, Footwear, Jewelry"
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Google Maps Search URL</label>
                <input
                  type="text"
                  value={editingMarket.googleMapsUrl || ''}
                  onChange={(e) => setEditingMarket({ ...editingMarket, googleMapsUrl: e.target.value })}
                  placeholder="https://www.google.com/maps/search/..."
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400 font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setEditingMarket(null);
                    setIsAddMarketOpen(false);
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Market</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL: ADD / EDIT CHAURAHA */}
      {/* ================================================================= */}
      {isAddChaurahaOpen && editingChauraha && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-xl w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Navigation className="w-4 h-4 text-amber-400" />
                <span>{editingChauraha.name ? `Edit Chauraha: ${editingChauraha.name}` : 'Add Landmark Chauraha Hub'}</span>
              </h3>
              <button
                onClick={() => {
                  setEditingChauraha(null);
                  setIsAddChaurahaOpen(false);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveChauraha} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Chauraha Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={editingChauraha.name}
                    onChange={(e) => setEditingChauraha({ ...editingChauraha, name: e.target.value })}
                    placeholder="e.g. Batto Khan Chauraha"
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hindi Name (हिंदी) *</label>
                  <input
                    type="text"
                    required
                    value={editingChauraha.hindiName}
                    onChange={(e) => setEditingChauraha({ ...editingChauraha, hindiName: e.target.value })}
                    placeholder="e.g. बट्टो ख़ान चौराहा"
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400 font-hindi"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Road / Intersecting Corridor</label>
                  <input
                    type="text"
                    value={editingChauraha.road}
                    onChange={(e) => setEditingChauraha({ ...editingChauraha, road: e.target.value })}
                    placeholder="e.g. Nai Bazar Road / Bahraich Link"
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Mohalla Corridor</label>
                  <input
                    type="text"
                    value={editingChauraha.mohalla}
                    onChange={(e) => setEditingChauraha({ ...editingChauraha, mohalla: e.target.value })}
                    placeholder="e.g. Joshitola / Sujawalpur Corridor"
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description &amp; Transit Significance</label>
                <textarea
                  rows={2}
                  value={editingChauraha.description}
                  onChange={(e) => setEditingChauraha({ ...editingChauraha, description: e.target.value })}
                  placeholder="Why this chauraha is important, e-rickshaw stands, landmarks..."
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Key Landmarks (comma-separated)</label>
                <input
                  type="text"
                  value={editingChauraha.landmarks ? editingChauraha.landmarks.join(', ') : ''}
                  onChange={(e) =>
                    setEditingChauraha({
                      ...editingChauraha,
                      landmarks: e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="e.g. Batto Khan Corner, Lateef Market Link, E-Rickshaw Stand"
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Google Maps URL</label>
                <input
                  type="text"
                  value={editingChauraha.googleMapsUrl || ''}
                  onChange={(e) => setEditingChauraha({ ...editingChauraha, googleMapsUrl: e.target.value })}
                  placeholder="https://www.google.com/maps/search/..."
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400 font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setEditingChauraha(null);
                    setIsAddChaurahaOpen(false);
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Chauraha</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL: ADD / EDIT ROAD */}
      {/* ================================================================= */}
      {isAddRoadOpen && editingRoad && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-xl w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-400" />
                <span>{editingRoad.name ? `Edit Road: ${editingRoad.name}` : 'Add Town Road / Artery'}</span>
              </h3>
              <button
                onClick={() => {
                  setEditingRoad(null);
                  setIsAddRoadOpen(false);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRoad} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Road Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={editingRoad.name}
                    onChange={(e) => setEditingRoad({ ...editingRoad, name: e.target.value })}
                    placeholder="e.g. BCM Road"
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hindi Name (हिंदी)</label>
                  <input
                    type="text"
                    value={editingRoad.hindiName || ''}
                    onChange={(e) => setEditingRoad({ ...editingRoad, hindiName: e.target.value })}
                    placeholder="e.g. बीसीएम रोड"
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400 font-hindi"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Road Classification</label>
                  <select
                    value={editingRoad.category}
                    onChange={(e) =>
                      setEditingRoad({
                        ...editingRoad,
                        category: e.target.value as 'highways' | 'local-roads',
                        categoryLabel:
                          e.target.value === 'highways'
                            ? '🛣️ Category 1: Highways & Regional Arteries'
                            : '🏙️ Category 2: Central Local & Commercial Roads',
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400 font-bold"
                  >
                    <option value="highways">Highway / Regional Artery</option>
                    <option value="local-roads">Central Local &amp; Commercial Road</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Approx Span / Length</label>
                  <input
                    type="text"
                    value={editingRoad.lengthOrSpan || ''}
                    onChange={(e) => setEditingRoad({ ...editingRoad, lengthOrSpan: e.target.value })}
                    placeholder="e.g. ~2.5 km"
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Significance / Description</label>
                <textarea
                  rows={2}
                  value={editingRoad.significance}
                  onChange={(e) => setEditingRoad({ ...editingRoad, significance: e.target.value })}
                  placeholder="Primary corridor purpose, hospitals, commercial shops along route..."
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Key Landmarks (comma-separated)</label>
                <input
                  type="text"
                  value={editingRoad.keyLandmarks ? editingRoad.keyLandmarks.join(', ') : ''}
                  onChange={(e) =>
                    setEditingRoad({
                      ...editingRoad,
                      keyLandmarks: e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="e.g. BCM Hospital, Optical Market, Mevati Tola"
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Route Google Maps Link</label>
                <input
                  type="text"
                  value={editingRoad.routeGoogleMapsUrl || ''}
                  onChange={(e) => setEditingRoad({ ...editingRoad, routeGoogleMapsUrl: e.target.value })}
                  placeholder="https://www.google.com/maps/search/..."
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-amber-400 font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setEditingRoad(null);
                    setIsAddRoadOpen(false);
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Road</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
