import React from 'react';
import { Phone, MessageCircle, MapPin, ExternalLink, Clock, ShieldCheck, AlertCircle, MessageSquare } from 'lucide-react';
import { CityListing } from '../types/directory';
import { StarRatingDisplay } from './StarRatingDisplay';

interface DirectoryListingCardProps {
  listing: CityListing;
  onSelect: (listing: CityListing) => void;
  ratingSummary?: { averageRating: number; totalReviews: number };
  onWriteReview?: (listing: CityListing) => void;
}

export const DirectoryListingCard: React.FC<DirectoryListingCardProps> = ({
  listing,
  onSelect,
  ratingSummary,
  onWriteReview,
}) => {
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

  return (
    <article
      onClick={() => onSelect(listing)}
      className="bg-white rounded-2xl border border-slate-200 hover:border-amber-500 transition-all p-5 flex flex-col justify-between hover:shadow-md cursor-pointer group"
    >
      <div>
        {/* Top Info Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-amber-800 transition-colors">
              {listing.name}
            </h3>
            {/* Zero-Pill Static Metadata */}
            <div className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500 mt-1">
              <span className="font-medium text-slate-700">{listing.subcategory}</span>
              <span aria-hidden="true">·</span>
              <span>{listing.locality}</span>
              {listing.foodType && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className={listing.foodType === 'Pure Veg' ? 'text-emerald-700 font-medium' : 'text-amber-800'}>
                    {listing.foodType}
                  </span>
                </>
              )}
            </div>

            {/* Rating & Review Counter Line */}
            <div className="flex items-center gap-2 mt-2">
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
                  className="text-[11px] font-semibold text-amber-800 hover:text-amber-950 hover:underline flex items-center gap-0.5 ml-1"
                >
                  <MessageSquare className="w-2.5 h-2.5" />
                  <span>Rate</span>
                </button>
              )}
            </div>
          </div>

          {/* Verification Badge */}
          <div className="shrink-0">
            {listing.verified ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Community Verified</span>
              </span>
            )}
          </div>
        </div>

        {/* Short description */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
          {listing.description}
        </p>

        {/* Address and Timings with quiet typography */}
        <div className="space-y-1 text-xs text-slate-500 mb-4">
          <div className="flex items-start gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
            <span className="truncate">{listing.address}</span>
          </div>
          {listing.openingHours && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{listing.openingHours}</span>
            </div>
          )}
        </div>

        {/* Services summary */}
        {listing.services && listing.services.length > 0 && (
          <div className="text-[11px] text-slate-500 mb-4">
            <span className="font-medium text-slate-700">Services: </span>
            <span>{listing.services.slice(0, 3).join(' · ')}</span>
            {listing.services.length > 3 && (
              <span className="text-amber-700 font-semibold cursor-pointer ml-1" onClick={() => onSelect(listing)}>
                +{listing.services.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons Row */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          {listing.phone && (
            <a
              href={`tel:${listing.phone}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-bold transition-colors min-h-[36px] border border-amber-500"
              aria-label={`Call ${listing.name}`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call</span>
            </a>
          )}
          {listing.whatsapp && (
            <a
              href={`https://wa.me/${listing.whatsapp}?text=${encodeURIComponent(`Hello, I found your listing for "${listing.name}" on Khairabad City Directory.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors min-h-[36px]"
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
            <span>Google Maps</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(listing);
            }}
            className="text-xs font-bold text-slate-800 group-hover:text-slate-950 group-hover:bg-amber-100 px-2 py-1 rounded bg-slate-50 border border-slate-200 group-hover:border-amber-400 transition-colors"
          >
            View Page &rarr;
          </button>
        </div>
      </div>
    </article>
  );
};
