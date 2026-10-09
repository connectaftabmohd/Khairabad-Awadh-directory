import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Share2,
  Check,
  Building,
  Navigation,
  Flag,
  Sparkles,
  ChevronRight,
  MessageSquarePlus,
  Star,
  Heart,
} from 'lucide-react';
import { CityListing, Review, ReviewFormData } from '../types/directory';
import { KhairabadMapPreview } from './KhairabadMapPreview';
import { ReviewListSection } from './ReviewListSection';
import { ReviewFormModal } from './ReviewFormModal';
import { StarRatingDisplay } from './StarRatingDisplay';
import { calculateRatingSummary } from '../utils/reviewStorage';

interface ListingDetailPageProps {
  listing: CityListing;
  onBack: () => void;
  onClaim: (listing: CityListing) => void;
  onReportEdit: (listing: CityListing) => void;
  onSelectListing: (listing: CityListing) => void;
  onViewBlog?: () => void;
  allListings: CityListing[];
  reviews: Review[];
  onSubmitReview: (formData: ReviewFormData) => void;
  onVoteHelpful: (reviewId: string) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export const ListingDetailPage: React.FC<ListingDetailPageProps> = ({
  listing,
  onBack,
  onClaim,
  onReportEdit,
  onSelectListing,
  onViewBlog,
  allListings,
  reviews,
  onSubmitReview,
  onVoteHelpful,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const [copied, setCopied] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const ratingSummary = useMemo(() => calculateRatingSummary(reviews), [reviews]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const scrollToReviews = () => {
    const el = document.getElementById('reviews-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Find related listings in the same category or locality
  const relatedListings = allListings
    .filter((l) => l.id !== listing.id && (l.category === listing.category || l.locality === listing.locality))
    .slice(0, 3);

  return (
    <div className="py-8 px-4 sm:px-6 max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Breadcrumbs & Back Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 font-bold text-slate-900 hover:text-amber-800 bg-amber-50 hover:bg-amber-100/80 px-3 py-1.5 rounded-lg border border-amber-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>&larr; Back to Directory</span>
          </button>
          <span className="text-slate-300">/</span>
          <span className="capitalize">{listing.category.replace('-', ' ')}</span>
          <span className="text-slate-300">/</span>
          <span>{listing.locality}</span>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-slate-800 truncate max-w-[200px]">{listing.name}</span>
        </div>

        <div className="flex items-center gap-2">
          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(listing.id)}
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border shadow-2xs transition-colors ${
                isFavorite
                  ? 'bg-rose-50 text-rose-700 border-rose-300'
                  : 'bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 border-slate-200'
              }`}
              title={isFavorite ? 'Remove from Saved' : 'Save to Favorites'}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
              <span>{isFavorite ? 'Saved' : 'Save'}</span>
            </button>
          )}
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied' : 'Share Place'}</span>
          </button>
          <button
            onClick={() => onClaim(listing)}
            className="text-xs font-bold text-slate-900 hover:text-amber-800 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-amber-50 transition-colors"
          >
            Claim Listing
          </button>
        </div>
      </div>

      {/* Main Full Page Content Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Dedicated Full Image Header */}
        <div className="relative h-64 sm:h-80 md:h-96 bg-slate-900 overflow-hidden">
          {listing.images && listing.images.length > 0 ? (
            <img
              src={listing.images[0]}
              alt={listing.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover filter brightness-75"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 flex items-center justify-center text-white/40">
              <Building className="w-24 h-24 stroke-[1]" />
            </div>
          )}

          {/* Top Gradient & Locality Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs">
            <span className="bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{listing.locality}, Khairabad</span>
            </span>

            {listing.verified ? (
              <span className="bg-emerald-600/90 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 shadow-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Listing</span>
              </span>
            ) : (
              <span className="bg-amber-600/90 text-white px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 shadow-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Community Verified</span>
              </span>
            )}
          </div>

          {/* Hero Bottom Overlay Title */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-amber-300">
              <span>{listing.subcategory}</span>
              <span>·</span>
              <span>PIN 261131</span>
              {listing.foodType && (
                <>
                  <span>·</span>
                  <span className={listing.foodType === 'Pure Veg' ? 'text-emerald-300' : 'text-amber-200'}>
                    {listing.foodType}
                  </span>
                </>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display tracking-tight text-white">
              {listing.name}
            </h1>

            {/* Live Rating & Review Count Anchor */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={scrollToReviews}
                className="inline-flex items-center gap-2 bg-black/40 hover:bg-black/60 px-3 py-1 rounded-lg backdrop-blur-xs transition-colors cursor-pointer"
              >
                <StarRatingDisplay
                  rating={ratingSummary.averageRating > 0 ? ratingSummary.averageRating : 5.0}
                  size="sm"
                  showNumber
                  totalReviews={ratingSummary.totalReviews}
                />
                <span className="text-xs text-amber-300 font-semibold underline underline-offset-2">
                  View {ratingSummary.totalReviews} {ratingSummary.totalReviews === 1 ? 'Review' : 'Reviews'} &darr;
                </span>
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 max-w-3xl line-clamp-2">
              {listing.description}
            </p>
          </div>
        </div>

        {/* Action Call & Navigation Bar */}
        <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 flex-wrap">
            {listing.phone && (
              <a
                href={`tel:${listing.phone}`}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-colors border border-amber-500"
              >
                <Phone className="w-4 h-4" />
                <span>Call {listing.phone}</span>
              </a>
            )}

            {listing.whatsapp && (
              <a
                href={`https://wa.me/${listing.whatsapp}?text=${encodeURIComponent(
                  `Hello, I saw your listing for "${listing.name}" on the Khairabad City Directory. I would like more information.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            )}

            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="px-4 py-2.5 bg-white hover:bg-amber-50 text-slate-900 border border-slate-300 hover:border-amber-400 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-2xs transition-colors"
            >
              <MessageSquarePlus className="w-4 h-4 text-amber-600" />
              <span>Write a Review</span>
            </button>

            {onToggleFavorite && (
              <button
                onClick={() => onToggleFavorite(listing.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 border shadow-2xs transition-colors ${
                  isFavorite
                    ? 'bg-rose-50 text-rose-700 border-rose-300'
                    : 'bg-white hover:bg-rose-50 text-slate-800 hover:text-rose-600 border-slate-300'
                }`}
                title={isFavorite ? 'Remove from Saved' : 'Save to Favorites'}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                <span>{isFavorite ? 'Saved in Favorites' : 'Save to Favorites'}</span>
              </button>
            )}

            <a
              href={listing.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors"
            >
              <Navigation className="w-4 h-4 text-amber-600" />
              <span>Get Directions</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>

          <div className="text-xs text-slate-500">
            Sector: <strong className="text-slate-800">{listing.subcategory}</strong>
          </div>
        </div>

        {/* Body Grid: Information Left, Map & Quick Facts Right */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Full Information (2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview / About */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold font-display text-slate-900 border-b border-slate-100 pb-2">
                About this Place / Business
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                {listing.description}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Located in the {listing.locality} area of Khairabad, this establishment serves residents of Khairabad town and adjacent localities across Sitapur district with verified local service.
              </p>

              {/* Featured Blog Highlight if available */}
              {listing.id.includes('babbu') && onViewBlog && (
                <div className="mt-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Featured in Khairabad Food &amp; Heritage Guide</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-snug">
                      Read our special story: <em>&ldquo;Babbu Hotel Khairabad: The Iconic Town Eatery, Kulhad Chai &amp; Culinary Landmark of Chilla Sarain Chauraha&rdquo;</em>
                    </p>
                  </div>
                  <button
                    onClick={onViewBlog}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-colors border border-amber-500 shadow-2xs shrink-0"
                  >
                    Read Blog Post &rarr;
                  </button>
                </div>
              )}
            </div>

            {/* Quick Details Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Physical Address</span>
                </div>
                <div className="text-slate-700">{listing.address}</div>
                <div className="text-slate-400 text-[11px]">Khairabad, Sitapur, Uttar Pradesh – 261131</div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Operating Schedule</span>
                </div>
                <div className="text-slate-700">{listing.openingHours || 'Regular business daytime hours'}</div>
                {listing.emergencyAvailable && (
                  <div className="text-emerald-700 font-semibold text-[11px]">
                    ✓ 24 Hours Emergency Service Available
                  </div>
                )}
              </div>
            </div>

            {/* Services & Facilities */}
            {listing.services && listing.services.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold font-display text-slate-900">
                  Key Services &amp; Facilities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {listing.services.map((srv, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 flex items-center gap-2"
                    >
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{srv}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Capacity or Special Feature */}
            {listing.capacity && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <span className="font-bold">Guest / Visitor Capacity: </span>
                  <span>{listing.capacity} guests</span>
                </div>
              </div>
            )}

            {/* Dedicated Location Map Visualization */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold font-display text-slate-900">
                Khairabad Town Map &amp; Spatial Orientation
              </h3>
              <KhairabadMapPreview listing={listing} />
            </div>

            {/* Customer Ratings & Reviews Section */}
            <ReviewListSection
              listing={listing}
              reviews={reviews}
              onOpenWriteReview={() => setIsReviewModalOpen(true)}
              onVoteHelpful={onVoteHelpful}
            />

            {/* Owner Actions */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <button
                onClick={() => onClaim(listing)}
                className="text-amber-800 hover:underline font-bold flex items-center gap-1"
              >
                <span>Are you the owner of this business? Claim this listing &rarr;</span>
              </button>
              <button
                onClick={() => onReportEdit(listing)}
                className="text-slate-500 hover:text-red-700 flex items-center gap-1"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Report incorrect information / Suggest edit</span>
              </button>
            </div>
          </div>

          {/* Right Column: Quick Info Box & Related Listings (1 col) */}
          <div className="space-y-6">
            {/* Quick Fact Box */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 text-xs">
              <h3 className="font-bold text-slate-900 font-display text-sm">
                Directory Facts
              </h3>

              <div className="space-y-2.5 text-slate-600">
                <div className="flex justify-between border-b border-slate-200/80 pb-2">
                  <span>Category</span>
                  <span className="font-semibold text-slate-800 capitalize">
                    {listing.category.replace('-', ' ')}
                  </span>
                </div>

                <div className="flex justify-between border-b border-slate-200/80 pb-2">
                  <span>Town Locality</span>
                  <span className="font-semibold text-slate-800">{listing.locality}</span>
                </div>

                <div className="flex justify-between border-b border-slate-200/80 pb-2">
                  <span>Postal Code</span>
                  <span className="font-semibold text-slate-800">261131 (Sitapur)</span>
                </div>

                <div className="flex justify-between border-b border-slate-200/80 pb-2">
                  <span>Rating &amp; Reviews</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 inline" />
                    <span>{ratingSummary.averageRating > 0 ? ratingSummary.averageRating.toFixed(1) : '5.0'}</span>
                    <span className="text-slate-400 font-normal">({ratingSummary.totalReviews})</span>
                  </span>
                </div>

                <div className="flex justify-between border-b border-slate-200/80 pb-2">
                  <span>State / District</span>
                  <span className="font-semibold text-slate-800">Uttar Pradesh, Sitapur</span>
                </div>

                <div className="flex justify-between border-b border-slate-200/80 pb-2">
                  <span>Listing Status</span>
                  <span className={listing.verified ? 'font-semibold text-emerald-700' : 'text-amber-700'}>
                    {listing.verified ? 'Verified Active' : 'Community Submitted'}
                  </span>
                </div>

                {listing.establishedYear && (
                  <div className="flex justify-between border-b border-slate-200/80 pb-2">
                    <span>Established</span>
                    <span className="font-semibold text-slate-800">Since {listing.establishedYear}</span>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <a
                  href={listing.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-slate-950 hover:bg-black text-amber-400 font-bold border border-slate-900 rounded-xl text-center block text-xs shadow-2xs transition-colors"
                >
                  Open in Google Maps App &rarr;
                </a>
              </div>
            </div>

            {/* Related Places in Khairabad */}
            {relatedListings.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 font-display text-sm">
                  More in {listing.locality}
                </h3>
                <div className="space-y-3">
                  {relatedListings.map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => onSelectListing(rel)}
                      className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-amber-500 cursor-pointer transition-all hover:shadow-2xs group"
                    >
                      <div className="flex items-center justify-between text-slate-900 font-bold text-xs group-hover:text-amber-800">
                        <span className="truncate">{rel.name}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-700 shrink-0" />
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                        <span>{rel.subcategory}</span>
                        <span>·</span>
                        <span className="truncate">{rel.locality}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Back Button */}
            <div>
              <button
                onClick={onBack}
                className="w-full py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to All Listings</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Write a Review Modal */}
      <ReviewFormModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        listing={listing}
        onSubmitReview={onSubmitReview}
      />
    </div>
  );
};
