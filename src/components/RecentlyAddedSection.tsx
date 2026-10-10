import React, { useState, useRef } from 'react';
import { Sparkles, MapPin, Phone, ChevronLeft, ChevronRight, Plus, CheckCircle2, ArrowRight, Heart } from 'lucide-react';
import { CityListing } from '../types/directory';

interface RecentlyAddedSectionProps {
  listings: CityListing[];
  onSelectListing: (listing: CityListing) => void;
  onOpenAddModal: () => void;
  onOpenListingDetail: (listing: CityListing) => void;
  getListingRating?: (id: string) => { averageRating: number; totalReviews: number };
  isFavorite?: (id: string) => boolean;
  onToggleFavorite?: (id: string) => void;
}

export const RecentlyAddedSection: React.FC<RecentlyAddedSectionProps> = ({
  listings,
  onSelectListing,
  onOpenAddModal,
  onOpenListingDetail,
  getListingRating,
  isFavorite,
  onToggleFavorite,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Newest items: prioritize recently added or user added
  // In our dataset, the newest gyms and csc businesses are positioned at the top of recent additions
  // Or reverse of initial array + any user added items at index 0..N
  const recentItems = React.useMemo(() => {
    // Prioritize user-submitted listings first, followed by new gyms and CSCs
    const userAdded = listings.filter((l) => l.id.startsWith('kh-user-'));
    const gyms = listings.filter((l) => l.category === 'gyms' && !userAdded.includes(l));
    const cscs = listings.filter((l) => l.id.startsWith('csc-') && l.id.includes('261131') && !userAdded.includes(l)).slice(0, 8);
    const others = listings.filter((l) => !userAdded.includes(l) && !gyms.includes(l) && !cscs.includes(l)).slice(0, 4);

    // Combine user added first, then gyms, then cscs, then others
    const combined = [...userAdded, ...gyms, ...cscs, ...others];
    // De-duplicate by ID
    const seen = new Set<string>();
    return combined.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }, [listings]);

  // Filter based on selected quick pill
  const filteredItems = React.useMemo(() => {
    if (activeFilter === 'all') return recentItems;
    if (activeFilter === 'gyms') return recentItems.filter((i) => i.category === 'gyms');
    if (activeFilter === 'csc') return recentItems.filter((i) => i.category === 'cyber-cafes');
    if (activeFilter === 'health') return recentItems.filter((i) => ['hospitals', 'clinics', 'doctors', 'pharmacies'].includes(i.category));
    return recentItems;
  }, [recentItems, activeFilter]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (recentItems.length === 0) return null;

  return (
    <section className="py-8 px-4 sm:px-6 max-w-7xl mx-auto" aria-labelledby="recently-added-heading">
      <div className="bg-gradient-to-b from-amber-500/5 via-amber-50/20 to-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs relative overflow-hidden">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-amber-200/20 via-amber-100/10 to-transparent pointer-events-none rounded-bl-full" />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Fresh Directory Additions · Khairabad 261131</span>
            </div>
            <h2 id="recently-added-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
              Recently Added in Khairabad
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl">
              Explore the newest verified gymnasiums, common service centres (CSC), health providers, and local enterprises indexed in the town directory.
            </p>
          </div>

          {/* Navigation Controls & Add CTA */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 border border-amber-500 rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>List Your Business</span>
            </button>
            <div className="hidden sm:flex items-center gap-1 border border-slate-200 bg-white rounded-xl p-0.5 shadow-2xs">
              <button
                onClick={() => handleScroll('left')}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="Scroll previous"
                aria-label="Scroll previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleScroll('right')}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="Scroll next"
                aria-label="Scroll next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none relative z-10 text-xs font-medium">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-full transition-all shrink-0 ${
              activeFilter === 'all'
                ? 'bg-slate-950 text-white font-bold ring-1 ring-amber-400 shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-amber-50/50'
            }`}
          >
            All New ({recentItems.length})
          </button>
          <button
            onClick={() => setActiveFilter('gyms')}
            className={`px-3 py-1.5 rounded-full transition-all shrink-0 ${
              activeFilter === 'gyms'
                ? 'bg-slate-950 text-white font-bold ring-1 ring-amber-400 shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-amber-50/50'
            }`}
          >
            💪 Gyms &amp; Fitness
          </button>
          <button
            onClick={() => setActiveFilter('csc')}
            className={`px-3 py-1.5 rounded-full transition-all shrink-0 ${
              activeFilter === 'csc'
                ? 'bg-slate-950 text-white font-bold ring-1 ring-amber-400 shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-amber-50/50'
            }`}
          >
            🖥️ CSC &amp; Jan Seva
          </button>
          <button
            onClick={() => setActiveFilter('health')}
            className={`px-3 py-1.5 rounded-full transition-all shrink-0 ${
              activeFilter === 'health'
                ? 'bg-slate-950 text-white font-bold ring-1 ring-amber-400 shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-amber-50/50'
            }`}
          >
            🏥 Healthcare &amp; Meds
          </button>
        </div>

        {/* Scrollable Horizontal Reel / Grid */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth scrollbar-none"
        >
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="w-72 sm:w-80 shrink-0 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between overflow-hidden group snap-start"
            >
              {/* Card Image Banner */}
              <div className="relative h-40 bg-slate-100 overflow-hidden cursor-pointer" onClick={() => onSelectListing(item)}>
                {item.images && item.images.length > 0 ? (
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-amber-50 text-amber-900 font-bold text-lg">
                    {item.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                {/* Overlay Badges */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-xs flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    New
                  </span>
                  {item.verified && (
                    <span className="px-2 py-0.5 rounded-md bg-slate-950 text-amber-400 border border-slate-900 text-[10px] font-bold shadow-xs flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5 text-amber-400" />
                      Verified
                    </span>
                  )}
                </div>

                {/* Save Heart Button */}
                {onToggleFavorite && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(item.id);
                    }}
                    className={`absolute top-2.5 right-2.5 p-1.5 rounded-lg backdrop-blur-xs transition-colors shadow-xs z-10 ${
                      isFavorite && isFavorite(item.id)
                        ? 'bg-rose-600/90 text-white'
                        : 'bg-black/40 hover:bg-black/60 text-white'
                    }`}
                    title={isFavorite && isFavorite(item.id) ? 'Remove from Saved' : 'Save to Favorites'}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFavorite && isFavorite(item.id) ? 'fill-white text-white' : ''}`} />
                  </button>
                )}

                {/* Rating badge if available */}
                {(() => {
                  const summary = getListingRating ? getListingRating(item.id) : null;
                  const score =
                    summary && summary.totalReviews > 0
                      ? summary.averageRating
                      : item.rating
                      ? parseFloat(item.rating)
                      : null;
                  const count =
                    summary && summary.totalReviews > 0 ? summary.totalReviews : item.reviews;

                  if (!score) return null;
                  return (
                    <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-slate-900/85 backdrop-blur-xs text-amber-400 text-xs font-bold shadow-xs">
                      ★ {score.toFixed(1)} {count ? `(${count})` : ''}
                    </div>
                  );
                })()}
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wide truncate mb-1">
                    {item.subcategory || item.category}
                  </div>
                  <h3
                    onClick={() => onSelectListing(item)}
                    className="text-base font-bold text-slate-900 group-hover:text-amber-800 transition-colors line-clamp-1 cursor-pointer"
                  >
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Meta & Location */}
                <div className="pt-3 mt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 truncate">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="truncate">{item.locality} · PIN 261131</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    {item.phone ? (
                      <a
                        href={`tel:${item.phone.replace(/[^0-9]/g, '')}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-slate-950 font-bold border border-amber-300 rounded-lg text-xs flex items-center justify-center gap-1 transition-colors"
                      >
                        <Phone className="w-3 h-3 text-amber-700" />
                        <span>Call</span>
                      </a>
                    ) : null}

                    <button
                      onClick={() => onOpenListingDetail(item)}
                      className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <span>Full Page</span>
                      <ArrowRight className="w-3 h-3 text-slate-500" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}

          {/* Call to action card at the end of the carousel */}
          <div className="w-72 sm:w-80 shrink-0 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 rounded-2xl p-6 text-white flex flex-col justify-between snap-start shadow-md border border-slate-800">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4 text-amber-400">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                Free Local Listing
              </span>
              <h3 className="text-lg font-bold font-display mt-1 leading-snug">
                Own a shop or clinic in Khairabad?
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Add your business to the official digital town guide and connect with thousands of local residents and visitors daily.
              </p>
            </div>

            <button
              onClick={onOpenAddModal}
              className="w-full mt-6 py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
            >
              <span>Submit Free Listing</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
