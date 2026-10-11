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
  Share2,
  Copy,
  Check,
  X,
} from 'lucide-react';
import { CityListing } from '../types/directory';
import { StarRatingDisplay } from './StarRatingDisplay';
import { getListingPrimaryImage } from '../utils/categoryImages';

// Clean SVG icon for WhatsApp branding
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.888 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// Clean SVG icon for Twitter / X branding
const TwitterXIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface DirectoryListingCardProps {
  listing: CityListing;
  onSelect: (listing: CityListing) => void;
  ratingSummary?: { averageRating: number; totalReviews: number };
  onWriteReview?: (listing: CityListing) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export const getPlaceImage = (listing: CityListing): string => {
  return getListingPrimaryImage(listing);
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
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Compute share link & formatted text
  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}?listing=${encodeURIComponent(listing.id)}`
      : `https://khairabad.city/?listing=${encodeURIComponent(listing.id)}`;

  const shareWhatsAppText = `📍 *${listing.name}*
${listing.subcategory || listing.category} · ${listing.locality}, Khairabad
${listing.address ? `📌 Address: ${listing.address}\n` : ''}${listing.phone ? `📞 Phone: ${listing.phone}\n` : ''}${listing.openingHours ? `⏰ Timings: ${listing.openingHours}\n` : ''}
🔗 View details on Khairabad City Directory:
${shareUrl}`;

  const shareTwitterText = `Discover "${listing.name}" (${listing.subcategory || listing.category}) in ${listing.locality}, Khairabad on Khairabad City Directory:`;

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleNativeShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: listing.name,
          text: `Check out ${listing.name} in Khairabad!`,
          url: shareUrl,
        });
      } catch {
        // user cancelled share
      }
    }
  };

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
    ? '/images/khairabad_market_street_1791046938937.jpg'
    : getListingPrimaryImage(listing);

  return (
    <article
      onClick={() => onSelect(listing)}
      className="relative bg-white rounded-2xl border border-slate-200/90 hover:border-amber-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer group"
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
            {listing.status === 'under-review' ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-950 bg-amber-400/95 backdrop-blur-md px-2.5 py-1 rounded-lg shadow-sm border border-amber-300">
                <Clock className="w-3.5 h-3.5 text-amber-900 animate-pulse" />
                <span>Under Review</span>
              </span>
            ) : listing.verified ? (
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

          {/* Top-Right Quick Action Buttons: Share & Favorite */}
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsShareOpen((prev) => !prev);
              }}
              className={`p-2 rounded-xl backdrop-blur-md border transition-all active:scale-90 shadow-sm ${
                isShareOpen
                  ? 'bg-amber-500 text-white border-amber-400 shadow-amber-500/20'
                  : 'bg-white/85 hover:bg-white text-slate-700 hover:text-amber-800 border-white/50'
              }`}
              title="Share listing on WhatsApp, Twitter, or copy link"
              aria-label={`Share ${listing.name}`}
            >
              <Share2 className="w-4 h-4" />
            </button>

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
            {/* Quick Share with Friends Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsShareOpen(true);
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-amber-100 hover:text-amber-900 active:scale-95 text-slate-700 rounded-xl text-xs font-semibold transition-all min-h-[36px] border border-slate-200 shadow-2xs"
              title="Share on WhatsApp, Twitter, or copy link"
              aria-label={`Share ${listing.name} with friends`}
            >
              <Share2 className="w-3.5 h-3.5 text-slate-600" />
              <span>Share</span>
            </button>
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

      {/* Social Media Sharing Card Overlay */}
      {isShareOpen && (
        <div
          className="absolute inset-0 bg-slate-950/92 backdrop-blur-md z-30 p-4 sm:p-5 flex flex-col justify-between text-white rounded-2xl animate-fadeIn cursor-default"
          onClick={(e) => {
            e.stopPropagation();
            setIsShareOpen(false);
          }}
        >
          {/* Header */}
          <div>
            <div className="flex items-start justify-between gap-3 border-b border-slate-800/90 pb-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
                  <Share2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-white leading-tight">
                    Share Local Business
                  </h4>
                  <p className="text-[11px] text-slate-300 truncate">
                    {listing.name} · {listing.locality}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsShareOpen(false);
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shrink-0"
                aria-label="Close share dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Social Sharing Options: WhatsApp, Twitter / X, Copy Link */}
            <div className="mt-3.5 space-y-2.5" onClick={(e) => e.stopPropagation()}>
              {/* WhatsApp Share Button */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareWhatsAppText)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-medium text-xs transition-all shadow-md group/wa"
              >
                <div className="flex items-center gap-2.5">
                  <WhatsAppIcon className="w-4 h-4 text-white" />
                  <span className="font-bold">Share on WhatsApp</span>
                </div>
                <span className="text-[10px] font-semibold bg-emerald-700/80 px-2 py-0.5 rounded-md text-emerald-100 group-hover/wa:bg-emerald-700">
                  Send Chat &rarr;
                </span>
              </a>

              {/* Twitter / X Share Button */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTwitterText)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-black active:scale-[0.98] text-white font-medium text-xs transition-all border border-slate-700/80 shadow-md group/tw"
              >
                <div className="flex items-center gap-2.5">
                  <TwitterXIcon className="w-4 h-4 text-white" />
                  <span className="font-bold">Share on Twitter / X</span>
                </div>
                <span className="text-[10px] font-semibold bg-slate-800 px-2 py-0.5 rounded-md text-slate-300 group-hover/tw:bg-slate-700">
                  Post &rarr;
                </span>
              </a>

              {/* Copy Direct Link Button */}
              <button
                type="button"
                onClick={handleCopyLink}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all border shadow-sm ${
                  copied
                    ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/60'
                    : 'bg-slate-800/90 hover:bg-slate-800 text-slate-200 border-slate-700 active:scale-[0.98]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-slate-300" />
                  )}
                  <span className="font-bold">
                    {copied ? 'Link Copied to Clipboard!' : 'Copy Direct Link'}
                  </span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-900/80 text-slate-300">
                  {copied ? '✓ Copied' : 'Copy URL'}
                </span>
              </button>

              {/* Mobile Native Share Button if supported */}
              {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="w-full flex items-center justify-center gap-1.5 py-1 text-[11px] text-amber-300 hover:text-amber-200 transition-colors font-semibold"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>More device apps &amp; sharing options &rarr;</span>
                </button>
              )}
            </div>
          </div>

          {/* Footer & Link Preview */}
          <div
            className="pt-2 border-t border-slate-800/90 flex items-center justify-between text-[11px] mt-2"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-slate-400 truncate max-w-[200px] text-[10px] font-mono">
              {shareUrl}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsShareOpen(false);
              }}
              className="text-xs font-semibold text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </article>
  );
};
