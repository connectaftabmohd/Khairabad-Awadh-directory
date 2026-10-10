import React, { useState } from 'react';
import {
  Phone,
  MessageCircle,
  MapPin,
  ExternalLink,
  Clock,
  ShieldCheck,
  AlertCircle,
  MessageSquare,
  Heart,
  Sparkles,
} from 'lucide-react';
import { CityListing } from '../types/directory';
import { StarRatingDisplay } from './StarRatingDisplay';

interface DirectoryListingCardProps {
  listing: CityListing;
  onSelect: (listing: CityListing) => void;
  ratingSummary?: { averageRating: number; totalReviews: number };
  onWriteReview?: (listing: CityListing) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export const getPlaceImage = (listing: CityListing): string => {
  if (listing.images && listing.images.length > 0 && listing.images[0]) {
    return listing.images[0];
  }
  if (listing.category === 'marriage-lawns') {
    return '/src/assets/images/khairabad_marriage_lawn_1791567699343.jpg';
  }
  if (['hospitals', 'clinics', 'doctors', 'pharmacies'].includes(listing.category)) {
    return '/src/assets/images/khairabad_hospital_chc_1791567719143.jpg';
  }
  if (listing.category === 'gyms') {
    return '/src/assets/images/fitness_feed_gym_1791097586687.jpg';
  }
  if (['restaurants', 'markets', 'mobile-shops', 'salons', 'banks', 'cyber-cafes', 'auto-services'].includes(listing.category)) {
    return '/src/assets/images/khairabad_market_street_1791046938937.jpg';
  }
  if (['religious', 'schools', 'colleges'].includes(listing.category)) {
    return '/src/assets/images/khairabad_badi_sangat_1791046924123.jpg';
  }
  return '/src/assets/images/khairabad_hero_banner_1791046903675.jpg';
};

export const DirectoryListingCard: React.FC<DirectoryListingCardProps> = ({
  listing,
  onSelect,
  ratingSummary,
  onWriteReview,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const [imageError, setImageError] = useState(false);

  const displayRating =
    ratingSummary && ratingSummary.totalReviews > 0
      ? ratingSummary.averageRating
      : listing.rating
      ? parseFloat(listing.rating)
      : 5.0;

  const displayReviewCount =
    ratingSummary && ratingSummary.totalReviews !== undefined
      ? ratingSummary.totalReviews
      : listing.reviews || 0;

  const resolvedImage = imageError
    ? '/src/assets/images/khairabad_hero_banner_1791046903675.jpg'
    : getPlaceImage(listing);

  return (
    <article
      onClick={() => onSelect(listing)}
      className="bg-white rounded-2xl border border-slate-200/90 hover:border-amber-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer group"
    >
      {/* Visual Image Header */}
      <div className="relative h-48 sm:h-52 w-full bg-slate-100 overflow-hidden shrink-0">
        <img
          src={resolvedImage}
          alt={listing.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          onError={() => setImageError(true)}
        />

        {/* Cinematic Gradient Overlays for High-Contrast Text/Badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-slate-950/40 pointer-events-none" />

        {/* Top Floating Controls */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
          <div className="flex items-center gap-1.5 flex-wrap">
            {listing.verified ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-emerald-600/95 backdrop-blur-md px-2.5 py-1 rounded-lg shadow-sm border border-emerald-400/30">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
                <span>Verified</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-900 bg-amber-400/95 backdrop-blur-md px-2.5 py-1 rounded-lg shadow-sm border border-amber-300/40">
                <AlertCircle className="w-3.5 h-3.5 text-slate-950" />
                <span>Community Verified</span>
              </span>
            )}
            {listing.category === 'marriage-lawns' && listing.capacity && (
              <span className="hidden sm:inline-flex items-center text-[10px] font-semibold text-white bg-slate-950/70 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/20">
                Cap: {listing.capacity}
              </span>
            )}
            {listing.featured && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-950/70 backdrop-blur-md px-2 py-0.5 rounded-lg border border-amber-400/30">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Featured
              </span>
            )}
          </div>

          {/* Quick Favorite Toggle */}
          {onToggleFavorite && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(listing.id);
              }}
              className={`p-2 rounded-xl backdrop-blur-md border transition-all active:scale-90 shadow-sm ${
                isFavorite
                  ? 'bg-rose-500 text-white border-rose-400 shadow-rose-500/20'
                  : 'bg-white/85 hover:bg-white text-slate-700 hover:text-rose-600 border-white/50'
              }`}
              title={isFavorite ? 'Remove from Saved' : 'Save to Favorites'}
              aria-label={
                isFavorite
                  ? `Remove ${listing.name} from saved favorites`
                  : `Save ${listing.name} to favorites`
              }
            >
              <Heart
                className={`w-4 h-4 ${isFavorite ? 'fill-white text-white' : ''}`}
              />
            </button>
          )}
        </div>

        {/* Bottom Floating Locality & Price Metadata */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2 z-10 text-white">
          <div className="space-y-0.5 min-w-0">
            <span className="text-[11px] font-medium text-amber-300 flex items-center gap-1 drop-shadow-xs">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{listing.locality}, Khairabad</span>
            </span>
          </div>

          {listing.priceRange && (
            <span className="shrink-0 text-[11px] font-bold text-amber-300 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
              {listing.priceRange}
            </span>
          )}
        </div>
      </div>

      {/* Card Body Information */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div>
          {/* Subcategory & Name */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-amber-800 uppercase tracking-wider text-[10px] bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80">
                {listing.subcategory}
              </span>
              {listing.foodType && (
                <span
                  className={`text-[11px] font-medium ${
                    listing.foodType === 'Pure Veg'
                      ? 'text-emerald-700'
                      : 'text-amber-800'
                  }`}
                >
                  · {listing.foodType}
                </span>
              )}
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-amber-800 transition-colors leading-tight line-clamp-1">
              {listing.name}
            </h3>
          </div>

          {/* Rating Row with Rate Action */}
          <div className="flex items-center gap-2 mt-2 pt-1 border-t border-slate-100">
            <StarRatingDisplay
              rating={displayRating}
              size="xs"
              showNumber
              totalReviews={displayReviewCount}
            />
            {onWriteReview && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onWriteReview(listing);
                }}
                className="text-[11px] font-semibold text-amber-800 hover:text-amber-950 hover:underline flex items-center gap-1 ml-auto"
              >
                <MessageSquare className="w-3 h-3" />
                <span>Rate &amp; Review</span>
              </button>
            )}
          </div>

          {/* Short Description */}
          <p className="text-xs text-slate-600 line-clamp-2 mt-2.5 leading-relaxed">
            {listing.description}
          </p>

          {/* Address & Timings with clean typography */}
          <div className="space-y-1 text-xs text-slate-500 mt-3">
            <div className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
              <span className="truncate">{listing.address}</span>
            </div>
            {listing.openingHours && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{listing.openingHours}</span>
              </div>
            )}
          </div>

          {/* Road, Mohalla & Chauraha Navigation Badges */}
          {(listing.roadName || listing.mohalla || listing.chaurahaHub) && (
            <div className="flex flex-wrap items-center gap-1 mt-2 text-[10px]">
              {listing.roadName && (
                <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-medium border border-blue-100">
                  🛣️ {listing.roadName}
                </span>
              )}
              {listing.mohalla && (
                <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 font-medium border border-purple-100">
                  🏘️ {listing.mohalla}
                </span>
              )}
              {listing.chaurahaHub && (
                <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium border border-emerald-100">
                  🚦 {listing.chaurahaHub}
                </span>
              )}
            </div>
          )}

          {/* Services summary */}
          {listing.services && listing.services.length > 0 && (
            <div className="text-[11px] text-slate-500 mt-2.5 flex items-center flex-wrap gap-1">
              <span className="font-semibold text-slate-700">Services:</span>
              <span className="text-slate-600">
                {listing.services.slice(0, 3).join(' · ')}
              </span>
              {listing.services.length > 3 && (
                <span
                  className="text-amber-800 font-semibold cursor-pointer"
                  onClick={() => onSelect(listing)}
                >
                  +{listing.services.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons Row */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
          <div
            className="flex items-center gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            {listing.phone && (
              <a
                href={`tel:${listing.phone.replace(/[^0-9+]/g, '')}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 rounded-xl text-xs font-bold transition-all min-h-[36px] border border-amber-500 shadow-2xs"
                aria-label={`Call ${listing.name}`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call</span>
              </a>
            )}
            {listing.whatsapp && (
              <a
                href={`https://wa.me/${listing.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hello, I found your listing for "${listing.name}" on Khairabad City Directory.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-semibold transition-all min-h-[36px] shadow-2xs"
                aria-label={`WhatsApp ${listing.name}`}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            )}
          </div>

          <div className="flex items-center gap-2">
            <a
              href={listing.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs font-medium text-slate-600 hover:text-amber-800 flex items-center gap-1"
            >
              <span>Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(listing);
              }}
              className="text-xs font-bold text-slate-800 group-hover:text-slate-950 group-hover:bg-amber-400 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 group-hover:border-amber-500 transition-all shadow-2xs"
            >
              View Place &rarr;
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
