import React from 'react';
import { Heart, Trash2, Phone, MessageCircle, Navigation, ExternalLink, ArrowRight, BookmarkCheck } from 'lucide-react';
import { CityListing } from '../types/directory';
import { StarRatingDisplay } from './StarRatingDisplay';

interface SavedFavoritesSectionProps {
  savedListings: CityListing[];
  onSelectListing: (listing: CityListing) => void;
  onRemoveFavorite: (id: string) => void;
  onClearAll: () => void;
  getListingRating?: (id: string) => { averageRating: number; totalReviews: number };
}

export const SavedFavoritesSection: React.FC<SavedFavoritesSectionProps> = ({
  savedListings,
  onSelectListing,
  onRemoveFavorite,
  onClearAll,
  getListingRating,
}) => {
  if (savedListings.length === 0) {
    return null;
  }

  return (
    <section className="py-8 px-4 sm:px-6 max-w-7xl mx-auto" id="saved-favorites-section">
      <div className="bg-gradient-to-br from-rose-50/60 via-amber-50/40 to-slate-50 border-2 border-rose-200 rounded-3xl p-5 sm:p-8 shadow-xs">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-200/70 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-xs shrink-0">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold font-display text-slate-900 tracking-tight">
                  My Saved Places
                </h2>
                <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-rose-300">
                  {savedListings.length} {savedListings.length === 1 ? 'place' : 'places'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Quick access to your bookmarked clinics, emergency contacts, shops, and favorite spots in Khairabad.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to remove all saved places from your favorites?')) {
                  onClearAll();
                }
              }}
              className="text-xs font-bold text-slate-500 hover:text-rose-700 px-3 py-1.5 rounded-xl border border-slate-300 hover:border-rose-300 hover:bg-rose-50 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Saved</span>
            </button>
          </div>
        </div>

        {/* Grid of Saved Places */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedListings.map((listing) => {
            const ratingSummary = getListingRating ? getListingRating(listing.id) : null;
            const avgRating =
              ratingSummary && ratingSummary.totalReviews > 0
                ? ratingSummary.averageRating
                : listing.rating
                ? parseFloat(listing.rating)
                : 5.0;

            return (
              <div
                key={listing.id}
                className="bg-white rounded-2xl border border-rose-200/90 hover:border-rose-400 p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group relative"
              >
                {/* Top Info */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-800 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                      {listing.subcategory || listing.category}
                    </span>

                    {/* Unsave button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFavorite(listing.id);
                      }}
                      className="p-1.5 text-rose-500 hover:text-white hover:bg-rose-500 rounded-lg transition-colors border border-rose-200 hover:border-rose-500"
                      title="Remove from Saved"
                      aria-label={`Remove ${listing.name} from saved favorites`}
                    >
                      <Heart className="w-4 h-4 fill-rose-500 group-hover:fill-rose-500 hover:fill-white" />
                    </button>
                  </div>

                  <h3
                    onClick={() => onSelectListing(listing)}
                    className="font-bold text-slate-900 text-base font-display hover:text-amber-800 cursor-pointer line-clamp-1 group-hover:text-amber-700 transition-colors"
                  >
                    {listing.name}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {listing.description}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span className="font-medium text-slate-700 truncate max-w-[160px]">
                      📍 {listing.locality}
                    </span>
                    <StarRatingDisplay
                      rating={avgRating}
                      size="sm"
                      showNumber
                      totalReviews={ratingSummary?.totalReviews ?? listing.reviews ?? 0}
                    />
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {listing.phone && (
                      <a
                        href={`tel:${listing.phone}`}
                        className="px-2.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1 transition-colors border border-amber-500"
                        title={`Call ${listing.phone}`}
                      >
                        <Phone className="w-3 h-3" />
                        <span className="hidden sm:inline">Call</span>
                      </a>
                    )}
                    {listing.whatsapp && (
                      <a
                        href={`https://wa.me/${listing.whatsapp}?text=${encodeURIComponent(
                          `Hello, I found your listing "${listing.name}" on the Khairabad City Directory.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1 transition-colors"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => onSelectListing(listing)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-black text-amber-300 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ml-auto"
                  >
                    <span>View Place</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
