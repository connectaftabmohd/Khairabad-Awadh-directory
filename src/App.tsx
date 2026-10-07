/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';
import { INITIAL_LISTINGS, LOCALITIES, EMERGENCY_CONTACTS } from './data/khairabadData';
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
import { Footer } from './components/Footer';
import { useReviewSystem } from './hooks/useReviewSystem';
import { ReviewFormModal } from './components/ReviewFormModal';
import { useFavorites } from './hooks/useFavorites';
import { SavedFavoritesSection } from './components/SavedFavoritesSection';
import { SavedFavoritesDrawer } from './components/SavedFavoritesDrawer';
import { WeatherWidget } from './components/WeatherWidget';
import { WeatherPage } from './components/WeatherPage';

export default function App() {
  const [listings, setListings] = useState<CityListing[]>(INITIAL_LISTINGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [selectedLocality, setSelectedLocality] = useState('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [activeView, setActiveView] = useState<'directory' | 'about' | 'blog' | 'weather' | 'listing-detail'>('directory');

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

  // Saved listings list
  const savedListings = useMemo(() => {
    return listings.filter((item) => favoriteIds.includes(item.id));
  }, [listings, favoriteIds]);

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
        const inServices = item.services?.some((s) => s.toLowerCase().includes(q));

        if (!inName && !inDesc && !inSub && !inLoc && !inAddr && !inServices) {
          return false;
        }
      }

      return true;
    });
  }, [listings, selectedCategory, selectedLocality, verifiedOnly, searchQuery, favoritesOnly, favoriteIds]);

  const handleAddListing = (newListing: CityListing) => {
    setListings((prev) => [newListing, ...prev]);
  };

  const handleOpenListingDetail = (item: CityListing) => {
    setSelectedListingDetail(item);
    setActiveView('listing-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLocality('all');
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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Header */}
      <Header
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenBloggerModal={() => setIsBloggerModalOpen(true)}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        activeView={activeView}
        setActiveView={(v) => {
          setSelectedListingDetail(null);
          setActiveView(v as 'directory' | 'about' | 'blog' | 'weather');
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
            />

            {/* Verification / Accuracy Notice Banner */}
            <aside aria-label="Community notice" className="bg-amber-50 border-y border-amber-200 py-2.5 px-4 text-xs text-amber-900">
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
                {/* Left Filter Sidebar */}
                <aside className="w-full lg:w-64 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm shrink-0 space-y-5">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Filter className="w-3.5 h-3.5 text-amber-600" />
                        <span>Filter Locality</span>
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

                    <div className="space-y-1.5">
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
                  {/* Results Count & Active Category Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 text-xs">
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

                    {(selectedCategory !== 'all' || selectedLocality !== 'all' || searchQuery || verifiedOnly) && (
                      <button
                        onClick={handleResetFilters}
                        className="text-amber-800 font-bold hover:underline"
                      >
                        Clear Active Filters
                      </button>
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
                      {filteredListings.map((listing) => (
                        <DirectoryListingCard
                          key={listing.id}
                          listing={listing}
                          onSelect={handleOpenListingDetail}
                          ratingSummary={getListingRating(listing.id)}
                          onWriteReview={(item) => setCardReviewModalListing(item)}
                          isFavorite={isFavorite(listing.id)}
                          onToggleFavorite={toggleFavorite}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </>
        ) : activeView === 'blog' ? (
          /* Verified Khairabad Place & Notable Figures Blogs View */
          <BlogPage />
        ) : activeView === 'weather' ? (
          /* Dedicated Live Weather & 7-Day Forecast Page */
          <WeatherPage
            onBackToDirectory={() => {
              setActiveView('directory');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : (
          /* About Khairabad View */
          <AboutKhairabad onViewBlog={() => { setActiveView('blog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
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
        setActiveView={(v) => setActiveView(v as 'directory' | 'about' | 'blog' | 'weather')}
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
    </div>
  );
}
