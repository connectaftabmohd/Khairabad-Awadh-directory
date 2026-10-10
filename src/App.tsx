/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  ShieldCheck,
  RotateCcw,
  Plus,
  AlertTriangle,
  MapPin,
  HeartPulse,
  PartyPopper,
  Utensils,
  Building2,
  Code2,
  Heart,
  Signpost,
} from 'lucide-react';
import { INITIAL_LISTINGS, LOCALITIES, EMERGENCY_CONTACTS } from './data/khairabadData';
import { getAllCombinedListings, saveUserListing, deleteUserListing } from './utils/listingStorage';
import { CategoryId, CityListing } from './types/directory';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CategoryGrid } from './components/CategoryGrid';
import { DirectoryListingCard } from './components/DirectoryListingCard';
import { BusinessDetailModal } from './components/BusinessDetailModal';
import { AddBusinessModal } from './components/AddBusinessModal';
import { ClaimModal } from './components/ClaimModal';
import { BloggerExportModal } from './components/BloggerExportModal';
import { EmergencyModal } from './components/EmergencyModal';
import { AboutKhairabad } from './components/AboutKhairabad';
import { BlogPage } from './components/BlogPage';
import { ListingDetailPage } from './components/ListingDetailPage';
import { RecentlyAddedSection } from './components/RecentlyAddedSection';
import { MAIN_ROADS_CONNECTIVITY, CHAURAHA_HUBS, TRADITIONAL_MOHALLAS } from './data/roadsConnectivityData';
import { Footer } from './components/Footer';
import { useReviewSystem } from './hooks/useReviewSystem';
import { ReviewFormModal } from './components/ReviewFormModal';
import { useFavorites } from './hooks/useFavorites';
import { SavedFavoritesSection } from './components/SavedFavoritesSection';
import { SavedFavoritesDrawer } from './components/SavedFavoritesDrawer';
import { WeatherWidget } from './components/WeatherWidget';
import { WeatherPage } from './components/WeatherPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { TermsOfServicePage } from './components/TermsOfServicePage';
import { RoadsTransitPage } from './components/RoadsTransitPage';
import { FAQSection } from './components/FAQSection';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { MobileBottomNav } from './components/MobileBottomNav';

export default function App() {
  const [listings, setListings] = useState<CityListing[]>(() => getAllCombinedListings());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [selectedLocality, setSelectedLocality] = useState('all');
  const [selectedRoad, setSelectedRoad] = useState('all');
  const [selectedMohalla, setSelectedMohalla] = useState('all');
  const [selectedChauraha, setSelectedChauraha] = useState('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [activeView, setActiveView] = useState<'directory' | 'roads' | 'about' | 'blog' | 'weather' | 'privacy' | 'terms' | 'listing-detail'>('directory');

  // Synchronize listing detail and views from URL query parameters (?listing=..., ?view=...)
  useEffect(() => {
    const syncFromUrl = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const listingId = params.get('listing');
        const blogSlug = params.get('blog');
        const view = params.get('view');

        if (listingId) {
          const all = getAllCombinedListings();
          const match = all.find((item) => item.id === listingId);
          if (match) {
            setSelectedListingDetail(match);
            setActiveView('listing-detail');
            return;
          }
        }

        if (blogSlug) {
          setActiveView('blog');
          return;
        }

        if (view && ['directory', 'roads', 'about', 'blog', 'weather', 'privacy', 'terms'].includes(view)) {
          setActiveView(view as 'directory' | 'roads' | 'about' | 'blog' | 'weather' | 'privacy' | 'terms');
          return;
        }
      } catch {
        // ignore
      }
    };

    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);

    const handleListingsUpdate = () => {
      setListings(getAllCombinedListings());
    };
    window.addEventListener('khairabad_listings_updated', handleListingsUpdate);

    return () => {
      window.removeEventListener('popstate', syncFromUrl);
      window.removeEventListener('khairabad_listings_updated', handleListingsUpdate);
    };
  }, []);

  // Favorites state
  const {
    favoriteIds,
    favoritesCount,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    clearFavorites,
  } = useFavorites();

  const [isFavoritesDrawerOpen, setIsFavoritesDrawerOpen] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  // Review system state
  const {
    reviews,
    getListingReviews,
    getListingRating,
    submitReview,
    voteHelpful,
  } = useReviewSystem();

  const [cardReviewModalListing, setCardReviewModalListing] = useState<CityListing | null>(null);

  // Modals state
  const [selectedListing, setSelectedListing] = useState<CityListing | null>(null);
  const [selectedListingDetail, setSelectedListingDetail] = useState<CityListing | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addCategoryPreselect, setAddCategoryPreselect] = useState<CategoryId>('hospitals');
  const [isBloggerModalOpen, setIsBloggerModalOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [claimState, setClaimState] = useState<{
    isOpen: boolean;
    listing: CityListing | null;
    mode: 'claim' | 'report';
  }>({
    isOpen: false,
    listing: null,
    mode: 'claim',
  });

  // Dynamic SEO Page Title & Meta Description Synchronization
  useEffect(() => {
    let title = 'Khairabad City Directory & Local Business Guide | Sitapur, UP (PIN 261131)';
    let desc = 'Official Khairabad digital guide & local business directory: find top hospitals, doctors, schools, marriage lawns, emergency helplines, shops & historic Awadh heritage in Sitapur (PIN 261131).';

    if (activeView === 'roads') {
      title = 'Khairabad Roads, Highways (NH-24, SH-30) & Transit Corridors | Khairabad Directory';
      desc = 'Complete guide to Khairabad highways (NH-24 Sitapur-Lucknow, SH-30 Biswan), major local roads, Chauraha hubs, e-rickshaw stands, and mohalla connectivity.';
    } else if (activeView === 'about') {
      title = 'About Khairabad – History, Awadh Heritage, Facts & Tourism Profile | PIN 261131';
      desc = "Discover Khairabad's rich history from Raja Khaira Pasi to Mughal Akbar Sarkar, Badi Sangat, Dargahs, culture, population, and connectivity in Sitapur district.";
    } else if (activeView === 'blog') {
      title = 'Notable Figures & Heritage of Khairabad – Fazl-e-Haq, Muztar Khairabadi | Articles';
      desc = "Read historical biographies of Khairabad's legendary intellectual figures: 1857 revolutionary Allama Fazl-e-Haq Khairabadi, poet Muztar Khairabadi, and Jan Nisar Akhtar.";
    } else if (activeView === 'weather') {
      title = 'Khairabad & Sitapur Live Weather, Air Quality & 7-Day Forecast';
      desc = 'Live local weather updates, temperature, AQI, humidity, sunrise/sunset, and 7-day forecast for Khairabad and Sitapur, Uttar Pradesh.';
    } else if (activeView === 'privacy') {
      title = 'Privacy Policy | Khairabad City Directory';
      desc = 'Privacy Policy and data protection terms for Khairabad City Directory and community search services.';
    } else if (activeView === 'terms') {
      title = 'Terms of Service | Khairabad City Directory';
      desc = 'Terms of Service, community listing guidelines, and usage terms for Khairabad City Directory.';
    } else if (activeView === 'listing-detail' && selectedListingDetail) {
      title = `${selectedListingDetail.name} – ${selectedListingDetail.category} in ${selectedListingDetail.locality || 'Khairabad'} | City Directory`;
      desc = `${selectedListingDetail.name} in Khairabad (${selectedListingDetail.locality || 'Sitapur'}). Phone: ${selectedListingDetail.phone || 'Available in directory'}. ${selectedListingDetail.address}. Verified local listing.`;
    }

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', desc);
    }
  }, [activeView, selectedListingDetail]);

  // Saved listings list
  const savedListings = useMemo(() => {
    return listings.filter((item) => favoriteIds.includes(item.id));
  }, [listings, favoriteIds]);

  // Filter computation
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      // Favorites filter
      if (favoritesOnly && !favoriteIds.includes(item.id)) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Locality filter
      if (selectedLocality !== 'all' && item.locality !== selectedLocality) {
        return false;
      }

      // Road Name filter (simultaneous)
      if (selectedRoad !== 'all') {
        const rLower = selectedRoad.toLowerCase();
        const roadMatch =
          (item.roadName && item.roadName.toLowerCase().includes(rLower)) ||
          item.address.toLowerCase().includes(rLower) ||
          item.locality.toLowerCase().includes(rLower) ||
          (selectedRoad.includes('NH-24') && (item.address.toLowerCase().includes('nh-24') || item.address.toLowerCase().includes('sitapur road') || item.locality.toLowerCase().includes('sitapur road'))) ||
          (selectedRoad.includes('SH-30') && (item.address.toLowerCase().includes('sh-30') || item.address.toLowerCase().includes('biswan') || item.locality.toLowerCase().includes('biswan'))) ||
          (selectedRoad.includes('BCM') && (item.address.toLowerCase().includes('bcm') || item.locality.toLowerCase().includes('bcm'))) ||
          (selectedRoad.includes('Bahraich') && (item.address.toLowerCase().includes('bahraich') || item.address.toLowerCase().includes('arjunpur') || item.address.toLowerCase().includes('sujawalpur'))) ||
          (selectedRoad.includes('Post Office') && (item.address.toLowerCase().includes('post office') || item.address.toLowerCase().includes('purani bazar'))) ||
          (selectedRoad.includes('Nai Bazar') && (item.address.toLowerCase().includes('nai bazar') || item.address.toLowerCase().includes('joshitola')));
        if (!roadMatch) {
          return false;
        }
      }

      // Traditional Mohalla filter (simultaneous)
      if (selectedMohalla !== 'all') {
        const mLower = selectedMohalla.toLowerCase();
        const mohallaMatch =
          (item.mohalla && item.mohalla.toLowerCase().includes(mLower)) ||
          item.locality.toLowerCase().includes(mLower) ||
          item.address.toLowerCase().includes(mLower) ||
          item.description.toLowerCase().includes(mLower);
        if (!mohallaMatch) {
          return false;
        }
      }

      // Major Chauraha Hub filter
      if (selectedChauraha !== 'all') {
        const cLower = selectedChauraha.toLowerCase();
        const chaurahaMatch =
          (item.chaurahaHub && item.chaurahaHub.toLowerCase().includes(cLower)) ||
          item.address.toLowerCase().includes(cLower) ||
          item.description.toLowerCase().includes(cLower);
        if (!chaurahaMatch) {
          return false;
        }
      }

      // Verified filter
      if (verifiedOnly && !item.verified) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inName = item.name.toLowerCase().includes(q);
        const inDesc = item.description.toLowerCase().includes(q);
        const inSub = item.subcategory.toLowerCase().includes(q);
        const inLoc = item.locality.toLowerCase().includes(q);
        const inAddr = item.address.toLowerCase().includes(q);
        const inRoad = (item.roadName || '').toLowerCase().includes(q);
        const inMoh = (item.mohalla || '').toLowerCase().includes(q);
        const inChauraha = (item.chaurahaHub || '').toLowerCase().includes(q);
        const inServices = item.services?.some((s) => s.toLowerCase().includes(q));

        if (!inName && !inDesc && !inSub && !inLoc && !inAddr && !inRoad && !inMoh && !inChauraha && !inServices) {
          return false;
        }
      }

      return true;
    });
  }, [listings, selectedCategory, selectedLocality, selectedRoad, selectedMohalla, selectedChauraha, verifiedOnly, searchQuery, favoritesOnly, favoriteIds]);

  const handleAddListing = (newListing: CityListing) => {
    saveUserListing(newListing);
    const updated = getAllCombinedListings();
    setListings(updated);
    setSelectedListingDetail(newListing);
    setActiveView('listing-detail');
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('listing', newListing.id);
      window.history.pushState({ listingId: newListing.id }, '', url.toString());
    } catch {
      // ignore
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenListingDetail = (item: CityListing) => {
    setSelectedListingDetail(item);
    setActiveView('listing-detail');
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('listing', item.id);
      window.history.pushState({ listingId: item.id }, '', url.toString());
    } catch {
      // ignore
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLocality('all');
    setSelectedRoad('all');
    setSelectedMohalla('all');
    setSelectedChauraha('all');
    setVerifiedOnly(false);
    setFavoritesOnly(false);
  };

  const scrollToDirectory = () => {
    setActiveView('directory');
    const el = document.getElementById('directory-content');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 pb-16 md:pb-0">
      {/* Header */}
      <Header
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenBloggerModal={() => setIsBloggerModalOpen(true)}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        activeView={activeView}
        setActiveView={(v) => {
          setSelectedListingDetail(null);
          setActiveView(v as 'directory' | 'roads' | 'about' | 'blog' | 'weather' | 'privacy' | 'terms');
          try {
            const url = new URL(window.location.href);
            url.searchParams.delete('listing');
            if (v === 'directory') {
              url.searchParams.delete('view');
            } else {
              url.searchParams.set('view', v);
            }
            window.history.pushState(null, '', url.pathname + (url.search ? url.search : ''));
          } catch {
            // ignore
          }
        }}
        favoritesCount={favoritesCount}
        onOpenFavorites={() => setIsFavoritesDrawerOpen(true)}
      />

      <main className="flex-1">
        {activeView === 'listing-detail' && selectedListingDetail ? (
          /* Dedicated Full Page for Business Listing */
          <ListingDetailPage
            listing={selectedListingDetail}
            onBack={() => {
              setActiveView('directory');
              setSelectedListingDetail(null);
              try {
                const url = new URL(window.location.href);
                url.searchParams.delete('listing');
                window.history.pushState(null, '', url.pathname + (url.search ? url.search : ''));
              } catch {
                // ignore
              }
            }}
            onClaim={(item) => {
              setClaimState({ isOpen: true, listing: item, mode: 'claim' });
            }}
            onReportEdit={(item) => {
              setClaimState({ isOpen: true, listing: item, mode: 'report' });
            }}
            onSelectListing={(item) => {
              setSelectedListingDetail(item);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onViewBlog={() => {
              setActiveView('blog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            allListings={listings}
            reviews={getListingReviews(selectedListingDetail.id)}
            onSubmitReview={(formData) => submitReview(selectedListingDetail.id, formData)}
            onVoteHelpful={voteHelpful}
            isFavorite={isFavorite(selectedListingDetail.id)}
            onToggleFavorite={toggleFavorite}
          />
        ) : activeView === 'directory' ? (
          <>
            {/* Hero Section */}
            <HeroSection
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                scrollToDirectory();
              }}
              onOpenEmergency={() => setIsEmergencyOpen(true)}
              onScrollToDirectory={scrollToDirectory}
              onOpenWeather={() => {
                setActiveView('weather');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenRoads={() => {
                setActiveView('roads');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                try {
                  const url = new URL(window.location.href);
                  url.searchParams.set('view', 'roads');
                  window.history.pushState(null, '', url.pathname + (url.search ? url.search : ''));
                } catch {
                  // ignore
                }
              }}
            />

            {/* Verification / Accuracy Notice Banner */}
            <aside aria-label="Community notice" className="hidden sm:block bg-amber-50 border-y border-amber-200 py-2.5 px-4 text-xs text-amber-900">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold uppercase text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded shrink-0">
                    Directory Notice
                  </span>
                  <span>
                    Community submitted information — unverified entries are marked as <strong>Demo / Verify</strong>. Please confirm hospital timings and phone numbers before traveling.
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="font-semibold text-amber-900 underline hover:text-amber-950"
                  >
                    + Suggest a Place
                  </button>
                </div>
              </div>
            </aside>

            {/* Category Grid Section */}
            <CategoryGrid
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                scrollToDirectory();
              }}
              listings={listings}
              onOpenAddModalWithCategory={(cat) => {
                setAddCategoryPreselect(cat);
                setIsAddModalOpen(true);
              }}
            />

            {/* Quick Emergency Ticker Section */}
            <section className="py-6 px-4 sm:px-6 max-w-7xl mx-auto">
              <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">
                      Direct Emergency Dispatch
                    </h3>
                    <p className="text-xs text-slate-400">
                      National, Uttar Pradesh &amp; Khairabad immediate responder hotlines
                    </p>
                  </div>
                  <button
                    onClick={() => setIsEmergencyOpen(true)}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold underline shrink-0"
                  >
                    View All Emergency Numbers &rarr;
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5">
                  {EMERGENCY_CONTACTS.slice(0, 5).map((contact) => (
                    <a
                      key={contact.id}
                      href={`tel:${contact.number.replace(/[^0-9]/g, '')}`}
                      className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-colors flex flex-col justify-between group"
                    >
                      <span className="text-[11px] text-slate-400 truncate">{contact.title}</span>
                      <span className="text-base font-extrabold text-amber-400 group-hover:text-amber-300">
                        {contact.number}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </section>

            {/* Recently Added Section */}
            <RecentlyAddedSection
              listings={listings}
              onSelectListing={(item) => setSelectedListing(item)}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onOpenListingDetail={(item) => handleOpenListingDetail(item)}
              getListingRating={getListingRating}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
            />

            {/* Dedicated Saved Favorites Section */}
            <SavedFavoritesSection
              savedListings={savedListings}
              onSelectListing={handleOpenListingDetail}
              onRemoveFavorite={removeFavorite}
              onClearAll={clearFavorites}
              getListingRating={getListingRating}
            />

            {/* Main Listings and Filters Section */}
            <section className="py-8 px-4 sm:px-6 max-w-7xl mx-auto" id="directory-content">
              <div className="flex flex-col lg:flex-row gap-6 items-start">
                {/* Left Filter Sidebar - Hidden on mobile, shown on desktop */}
                <aside className="hidden lg:block w-72 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm shrink-0 space-y-5">
                  {/* Simultaneous Road Name & Mohalla Filter Hub (Web Design Tips 1 & 2) */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 p-3.5 rounded-xl border border-amber-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                        <Signpost className="w-3.5 h-3.5 text-amber-700" />
                        <span>Road &amp; Mohalla Navigator</span>
                      </h3>
                      {(selectedRoad !== 'all' || selectedMohalla !== 'all' || selectedChauraha !== 'all') && (
                        <button
                          onClick={() => {
                            setSelectedRoad('all');
                            setSelectedMohalla('all');
                            setSelectedChauraha('all');
                          }}
                          className="text-[11px] text-amber-900 font-bold hover:underline"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-amber-900/80 leading-tight">
                      Filter businesses by both <strong>Road Name</strong> and <strong>Mohalla</strong> simultaneously.
                    </p>

                    {/* Road Dropdown */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        🛣️ Road / Artery
                      </label>
                      <select
                        value={selectedRoad}
                        onChange={(e) => setSelectedRoad(e.target.value)}
                        className="w-full text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:ring-1 focus:ring-amber-500 outline-none"
                      >
                        <option value="all">All Roads &amp; Arteries</option>
                        <optgroup label="Category 1: Highways &amp; Arteries">
                          <option value="National Highway 24 (NH-24)">NH-24 (Sitapur / Lucknow Rd)</option>
                          <option value="State Highway 30 (SH-30)">SH-30 (Biswan–Sitapur Rd)</option>
                        </optgroup>
                        <optgroup label="Category 2: Central Local Roads">
                          <option value="BCM Road">BCM Hospital Road</option>
                          <option value="Bahraich–Sitapur Road">Bahraich–Sitapur Road (RTO)</option>
                          <option value="Post Office Road">Post Office Road (Purani Bazar)</option>
                          <option value="Nai Bazar Road">Nai Bazar Road (Joshitola)</option>
                        </optgroup>
                      </select>
                    </div>

                    {/* Mohalla Dropdown */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        🏘️ Traditional Mohalla
                      </label>
                      <select
                        value={selectedMohalla}
                        onChange={(e) => setSelectedMohalla(e.target.value)}
                        className="w-full text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:ring-1 focus:ring-amber-500 outline-none"
                      >
                        <option value="all">All Traditional Mohallas</option>
                        {TRADITIONAL_MOHALLAS.map((moh) => (
                          <option key={moh.id} value={moh.name}>
                            {moh.name} ({moh.hindiName})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Chauraha Dropdown */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        🚦 Chauraha (Intersection) Hub
                      </label>
                      <select
                        value={selectedChauraha}
                        onChange={(e) => setSelectedChauraha(e.target.value)}
                        className="w-full text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:ring-1 focus:ring-amber-500 outline-none"
                      >
                        <option value="all">All Landmark Chaurahas</option>
                        {CHAURAHA_HUBS.map((hub) => (
                          <option key={hub.id} value={hub.name}>
                            {hub.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Standard Locality Filter */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Filter className="w-3.5 h-3.5 text-amber-600" />
                        <span>Filter Locality Area</span>
                      </h3>
                      {selectedLocality !== 'all' && (
                        <button
                          onClick={() => setSelectedLocality('all')}
                          className="text-[11px] text-amber-800 font-bold hover:underline"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                      <button
                        onClick={() => setSelectedLocality('all')}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                          selectedLocality === 'all'
                            ? 'bg-amber-100/70 text-slate-950 font-bold border-l-4 border-amber-500'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>All Areas</span>
                        <span className="text-[10px] text-slate-400">{listings.length}</span>
                      </button>

                      {LOCALITIES.map((loc) => {
                        const count = listings.filter((l) => l.locality === loc.name).length;
                        return (
                          <button
                            key={loc.id}
                            onClick={() => setSelectedLocality(loc.name)}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                              selectedLocality === loc.name
                                ? 'bg-amber-100/70 text-slate-950 font-bold border-l-4 border-amber-500'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <span className="truncate">{loc.name}</span>
                            <span className="text-[10px] text-slate-400">{count}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                      Verification Status
                    </h3>
                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={verifiedOnly}
                        onChange={(e) => setVerifiedOnly(e.target.checked)}
                        className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span>Official / Verified Only</span>
                    </label>
                  </div>

                  {/* Saved Favorites Filter */}
                  <div className="border-t border-slate-100 pt-4">
                    <button
                      onClick={() => setFavoritesOnly(!favoritesOnly)}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between border ${
                        favoritesOnly
                          ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-2xs'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Heart className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                        <span>My Saved Places</span>
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                        favoritesOnly ? 'bg-rose-200 text-rose-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {favoritesCount}
                      </span>
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-4">
                    <button
                      onClick={handleResetFilters}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset All Filters</span>
                    </button>
                  </div>
                </aside>

                {/* Right Listings Column */}
                <div className="flex-1 w-full space-y-4">
                  {/* Mobile Quick Filter Strip (App-Style) */}
                  <div className="lg:hidden space-y-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                          🛣️ Road Filter
                        </label>
                        <select
                          value={selectedRoad}
                          onChange={(e) => setSelectedRoad(e.target.value)}
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-medium text-slate-800"
                        >
                          <option value="all">All Roads</option>
                          <option value="National Highway 24 (NH-24)">NH-24 (Sitapur Rd)</option>
                          <option value="State Highway 30 (SH-30)">SH-30 (Biswan Rd)</option>
                          <option value="BCM Road">BCM Hospital Road</option>
                          <option value="Bahraich–Sitapur Road">Bahraich–Sitapur Road</option>
                          <option value="Post Office Road">Post Office Road</option>
                          <option value="Nai Bazar Road">Nai Bazar Road</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                          🏘️ Mohalla Filter
                        </label>
                        <select
                          value={selectedMohalla}
                          onChange={(e) => setSelectedMohalla(e.target.value)}
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-medium text-slate-800"
                        >
                          <option value="all">All Mohallas</option>
                          {TRADITIONAL_MOHALLAS.map((m) => (
                            <option key={m.id} value={m.name}>
                              {m.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none pt-1">
                      <button
                        onClick={() => setSelectedLocality('all')}
                        className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all text-xs border ${
                          selectedLocality === 'all'
                            ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        All Areas ({listings.length})
                      </button>
                      {LOCALITIES.map((loc) => {
                        const count = listings.filter((l) => l.locality === loc.name).length;
                        return (
                          <button
                            key={loc.id}
                            onClick={() => setSelectedLocality(loc.name)}
                            className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all text-xs border ${
                              selectedLocality === loc.name
                                ? 'bg-amber-400 text-slate-950 font-bold border-amber-500 shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {loc.name} ({count})
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-0.5 text-xs">
                      <button
                        onClick={() => setVerifiedOnly(!verifiedOnly)}
                        className={`px-3 py-1 rounded-full font-semibold whitespace-nowrap transition-all text-xs border flex items-center gap-1 ${
                          verifiedOnly
                            ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Official Only</span>
                      </button>
                      <button
                        onClick={() => setFavoritesOnly(!favoritesOnly)}
                        className={`px-3 py-1 rounded-full font-semibold whitespace-nowrap transition-all text-xs border flex items-center gap-1 ${
                          favoritesOnly
                            ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-white text-white' : 'text-slate-400'}`} />
                        <span>Saved ({favoritesCount})</span>
                      </button>
                    </div>
                  </div>

                  {/* Results Count & Active Category / Road / Mohalla Badges */}
                  <div className="space-y-2 bg-white p-3.5 rounded-2xl border border-slate-200 text-xs shadow-2xs">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="text-slate-600">
                        Showing <strong>{filteredListings.length}</strong>{' '}
                        {filteredListings.length === 1 ? 'place' : 'places'} in Khairabad
                        {selectedCategory !== 'all' && (
                          <span>
                            {' '}
                            in <span className="font-bold text-amber-800 capitalize">{selectedCategory.replace('-', ' ')}</span>
                          </span>
                        )}
                        {selectedLocality !== 'all' && (
                          <span>
                            {' '}
                            near <span className="font-bold text-amber-800">{selectedLocality}</span>
                          </span>
                        )}
                      </div>

                      {(selectedCategory !== 'all' ||
                        selectedLocality !== 'all' ||
                        selectedRoad !== 'all' ||
                        selectedMohalla !== 'all' ||
                        selectedChauraha !== 'all' ||
                        searchQuery ||
                        verifiedOnly ||
                        favoritesOnly) && (
                        <button
                          onClick={handleResetFilters}
                          className="text-amber-800 font-bold hover:underline flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Clear All Filters</span>
                        </button>
                      )}
                    </div>

                    {/* Active Filter Chips */}
                    {(selectedRoad !== 'all' ||
                      selectedMohalla !== 'all' ||
                      selectedChauraha !== 'all' ||
                      selectedLocality !== 'all' ||
                      selectedCategory !== 'all') && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100">
                        <span className="text-[11px] font-bold text-slate-400">Active filters:</span>

                        {selectedRoad !== 'all' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[11px] font-semibold border border-blue-200">
                            <span>🛣️ Road: {selectedRoad}</span>
                            <button
                              onClick={() => setSelectedRoad('all')}
                              className="hover:text-blue-600 font-bold ml-1"
                            >
                              ✕
                            </button>
                          </span>
                        )}

                        {selectedMohalla !== 'all' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[11px] font-semibold border border-purple-200">
                            <span>🏘️ Mohalla: {selectedMohalla}</span>
                            <button
                              onClick={() => setSelectedMohalla('all')}
                              className="hover:text-purple-600 font-bold ml-1"
                            >
                              ✕
                            </button>
                          </span>
                        )}

                        {selectedChauraha !== 'all' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-semibold border border-emerald-200">
                            <span>🚦 Chauraha: {selectedChauraha}</span>
                            <button
                              onClick={() => setSelectedChauraha('all')}
                              className="hover:text-emerald-600 font-bold ml-1"
                            >
                              ✕
                            </button>
                          </span>
                        )}

                        {selectedLocality !== 'all' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-semibold border border-amber-200">
                            <span>Area: {selectedLocality}</span>
                            <button
                              onClick={() => setSelectedLocality('all')}
                              className="hover:text-amber-700 font-bold ml-1"
                            >
                              ✕
                            </button>
                          </span>
                        )}

                        {selectedCategory !== 'all' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] font-semibold border border-slate-200">
                            <span>Category: {selectedCategory}</span>
                            <button
                              onClick={() => setSelectedCategory('all')}
                              className="hover:text-slate-600 font-bold ml-1"
                            >
                              ✕
                            </button>
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Listings Grid */}
                  {filteredListings.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                        <Search className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-base font-bold text-slate-900">
                          No places found matching your filters
                        </h4>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                          Try searching with broader terms or add this business to the Khairabad directory.
                        </p>
                      </div>
                      <div className="flex items-center justify-center gap-3 pt-2">
                        <button
                          onClick={handleResetFilters}
                          className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Reset Filters
                        </button>
                        <button
                          onClick={() => setIsAddModalOpen(true)}
                          className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 border border-amber-500 rounded-xl text-xs font-bold shadow-xs"
                        >
                          + Add This Place
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredListings.map((listing, index) => (
                        <React.Fragment key={listing.id}>
                          <DirectoryListingCard
                            listing={listing}
                            onSelect={handleOpenListingDetail}
                            ratingSummary={getListingRating(listing.id)}
                            onWriteReview={(item) => setCardReviewModalListing(item)}
                            isFavorite={isFavorite(listing.id)}
                            onToggleFavorite={toggleFavorite}
                          />
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Rich Google Search FAQ Accordion for Local SEO */}
            <FAQSection
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                scrollToDirectory();
              }}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onOpenRoads={() => {
                setActiveView('roads');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                try {
                  const url = new URL(window.location.href);
                  url.searchParams.set('view', 'roads');
                  window.history.pushState(null, '', url.pathname + (url.search ? url.search : ''));
                } catch {
                  // ignore
                }
              }}
              onOpenBlog={() => {
                setActiveView('blog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                try {
                  const url = new URL(window.location.href);
                  url.searchParams.set('tab', 'blog');
                  window.history.pushState(null, '', url.pathname + (url.search ? url.search : ''));
                } catch {
                  // ignore
                }
              }}
            />
          </>
        ) : activeView === 'roads' ? (
          /* Dedicated Separate Page for Khairabad Main Roads, Highways & Transit */
          <RoadsTransitPage
            onBackToDirectory={() => {
              setActiveView('directory');
              window.scrollTo({ top: 0, behavior: 'smooth' });
              try {
                const url = new URL(window.location.href);
                url.searchParams.delete('view');
                window.history.pushState(null, '', url.pathname + (url.search ? url.search : ''));
              } catch {
                // ignore
              }
            }}
            onSelectRoadFilter={(roadName) => {
              setSelectedRoad(roadName);
              setActiveView('directory');
              setTimeout(() => {
                const el = document.getElementById('directory-content');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 60);
              try {
                const url = new URL(window.location.href);
                url.searchParams.delete('view');
                window.history.pushState(null, '', url.pathname + (url.search ? url.search : ''));
              } catch {
                // ignore
              }
            }}
            onSelectMohallaFilter={(mohalla) => {
              setSelectedMohalla(mohalla);
              setActiveView('directory');
              setTimeout(() => {
                const el = document.getElementById('directory-content');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 60);
              try {
                const url = new URL(window.location.href);
                url.searchParams.delete('view');
                window.history.pushState(null, '', url.pathname + (url.search ? url.search : ''));
              } catch {
                // ignore
              }
            }}
            onSelectChaurahaFilter={(chauraha) => {
              setSelectedChauraha(chauraha);
              setActiveView('directory');
              setTimeout(() => {
                const el = document.getElementById('directory-content');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 60);
              try {
                const url = new URL(window.location.href);
                url.searchParams.delete('view');
                window.history.pushState(null, '', url.pathname + (url.search ? url.search : ''));
              } catch {
                // ignore
              }
            }}
            onOpenListingDetail={handleOpenListingDetail}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            allListings={listings}
          />
        ) : activeView === 'blog' ? (
          /* Verified Khairabad Place & Notable Figures Blogs View */
          <BlogPage
            onOpenListingDetail={handleOpenListingDetail}
            listings={listings}
          />
        ) : activeView === 'weather' ? (
          /* Dedicated Live Weather & 7-Day Forecast Page */
          <WeatherPage
            onBackToDirectory={() => {
              setActiveView('directory');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : activeView === 'privacy' ? (
          /* Google AdSense Compliant Privacy Policy */
          <PrivacyPolicyPage
            onBack={() => {
              setActiveView('directory');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : activeView === 'terms' ? (
          /* Terms of Service Policy */
          <TermsOfServicePage
            onBack={() => {
              setActiveView('directory');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : (
          /* About Khairabad View */
          <AboutKhairabad
            onViewBlog={() => { setActiveView('blog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            onViewRoads={() => {
              setActiveView('roads');
              window.scrollTo({ top: 0, behavior: 'smooth' });
              try {
                const url = new URL(window.location.href);
                url.searchParams.set('view', 'roads');
                window.history.pushState(null, '', url.pathname + (url.search ? url.search : ''));
              } catch {
                // ignore
              }
            }}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          scrollToDirectory();
        }}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenBloggerModal={() => setIsBloggerModalOpen(true)}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        setActiveView={(v) => {
          setSelectedListingDetail(null);
          setActiveView(v as 'directory' | 'roads' | 'about' | 'blog' | 'weather' | 'privacy' | 'terms');
          try {
            const url = new URL(window.location.href);
            url.searchParams.delete('listing');
            if (v === 'directory') {
              url.searchParams.delete('view');
            } else {
              url.searchParams.set('view', v);
            }
            window.history.pushState(null, '', url.pathname + (url.search ? url.search : ''));
          } catch {
            // ignore
          }
        }}
      />

      {/* Modals */}
      <BusinessDetailModal
        listing={selectedListing}
        onClose={() => setSelectedListing(null)}
        onClaim={(item) => {
          setSelectedListing(null);
          setClaimState({ isOpen: true, listing: item, mode: 'claim' });
        }}
        onReportEdit={(item) => {
          setSelectedListing(null);
          setClaimState({ isOpen: true, listing: item, mode: 'report' });
        }}
        reviews={selectedListing ? getListingReviews(selectedListing.id) : []}
        onSubmitReview={
          selectedListing
            ? (formData) => submitReview(selectedListing.id, formData)
            : undefined
        }
        onVoteHelpful={voteHelpful}
        isFavorite={selectedListing ? isFavorite(selectedListing.id) : false}
        onToggleFavorite={toggleFavorite}
      />

      {/* Direct Card Review Modal */}
      {cardReviewModalListing && (
        <ReviewFormModal
          isOpen={Boolean(cardReviewModalListing)}
          onClose={() => setCardReviewModalListing(null)}
          listing={cardReviewModalListing}
          onSubmitReview={(formData) => submitReview(cardReviewModalListing.id, formData)}
        />
      )}

      <AddBusinessModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddListing={handleAddListing}
        initialCategory={addCategoryPreselect}
      />

      <ClaimModal
        isOpen={claimState.isOpen}
        listing={claimState.listing}
        mode={claimState.mode}
        onClose={() => setClaimState({ isOpen: false, listing: null, mode: 'claim' })}
      />

      <BloggerExportModal
        isOpen={isBloggerModalOpen}
        onClose={() => setIsBloggerModalOpen(false)}
      />

      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
      />

      {/* Saved Favorites Slide Drawer */}
      <SavedFavoritesDrawer
        isOpen={isFavoritesDrawerOpen}
        onClose={() => setIsFavoritesDrawerOpen(false)}
        savedListings={savedListings}
        onSelectListing={handleOpenListingDetail}
        onRemoveFavorite={removeFavorite}
        onClearAll={clearFavorites}
        getListingRating={getListingRating}
      />

      {/* Cookie Consent Banner */}
      <CookieConsentBanner
        onOpenPrivacyPolicy={() => {
          setActiveView('privacy');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Mobile App-Style Bottom Navigation Menu Bar */}
      <MobileBottomNav
        activeView={activeView}
        setActiveView={(v) => {
          setSelectedListingDetail(null);
          setActiveView(v);
          try {
            const url = new URL(window.location.href);
            url.searchParams.delete('listing');
            window.history.pushState(null, '', url.pathname + (url.search ? url.search : ''));
          } catch {
            // ignore
          }
        }}
        favoritesCount={favoritesCount}
        onOpenFavorites={() => setIsFavoritesDrawerOpen(true)}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />
    </div>
  );
}
