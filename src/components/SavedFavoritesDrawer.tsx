import React from 'react';
import { X, Heart, Trash2, Phone, MessageCircle, Navigation, ArrowRight, ExternalLink, Sparkles } from 'lucide-react';
import { CityListing } from '../types/directory';
import { StarRatingDisplay } from './StarRatingDisplay';

interface SavedFavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedListings: CityListing[];
  onSelectListing: (listing: CityListing) => void;
  onRemoveFavorite: (id: string) => void;
  onClearAll: () => void;
  getListingRating?: (id: string) => { averageRating: number; totalReviews: number };
}

export const SavedFavoritesDrawer: React.FC<SavedFavoritesDrawerProps> = ({
  isOpen,
  onClose,
  savedListings,
  onSelectListing,
  onRemoveFavorite,
  onClearAll,
  getListingRating,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-xs">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h2 className="text-base font-bold font-display text-slate-900 leading-tight">
                Saved Favorites
              </h2>
              <p className="text-xs text-slate-500">
                {savedListings.length} {savedListings.length === 1 ? 'place' : 'places'} saved on this device
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {savedListings.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Clear all saved places from your favorites?')) {
                    onClearAll();
                  }
                }}
                className="p-2 text-slate-400 hover:text-rose-600 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1"
                title="Clear all favorites"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
              aria-label="Close saved places drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedListings.length === 0 ? (
            <div className="py-16 text-center space-y-4 px-6">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 mx-auto flex items-center justify-center border border-rose-200">
                <Heart className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 font-display">
                  No Saved Places Yet
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Browse the Khairabad directory and tap the heart icon on any hospital, clinic, marriage lawn, or business to keep it readily available here.
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold shadow-xs border border-amber-500 transition-colors"
              >
                Browse Directory Places &rarr;
              </button>
            </div>
          ) : (
            savedListings.map((listing) => {
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
                  className="p-3.5 bg-white border border-slate-200 hover:border-amber-400 rounded-2xl shadow-2xs hover:shadow-xs transition-all space-y-2 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        {listing.subcategory || listing.category}
                      </span>
                      <h4
                        onClick={() => {
                          onSelectListing(listing);
                          onClose();
                        }}
                        className="font-bold text-slate-900 text-sm mt-1 hover:text-amber-800 cursor-pointer line-clamp-1"
                      >
                        {listing.name}
                      </h4>
                    </div>

                    <button
                      onClick={() => onRemoveFavorite(listing.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove from favorites"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="truncate max-w-[180px]">📍 {listing.locality}</span>
                    <StarRatingDisplay
                      rating={avgRating}
                      size="sm"
                      showNumber
                      totalReviews={ratingSummary?.totalReviews ?? listing.reviews ?? 0}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      {listing.phone && (
                        <a
                          href={`tel:${listing.phone}`}
                          className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Call</span>
                        </a>
                      )}
                      {listing.whatsapp && (
                        <a
                          href={`https://wa.me/${listing.whatsapp}?text=${encodeURIComponent(
                            `Hello, I saw your listing "${listing.name}" on Khairabad City Directory.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        onSelectListing(listing);
                        onClose();
                      }}
                      className="text-xs font-bold text-amber-800 hover:text-amber-950 hover:underline flex items-center gap-1"
                    >
                      <span>View &rarr;</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        {savedListings.length > 0 && (
          <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500">
            Favorites are saved locally in your browser storage.
          </div>
        )}
      </div>
    </div>
  );
};
