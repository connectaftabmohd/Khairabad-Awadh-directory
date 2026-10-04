import React, { useState } from 'react';
import {
  X,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Share2,
  Flag,
  Check,
  Building,
} from 'lucide-react';
import { CityListing } from '../types/directory';
import { KhairabadMapPreview } from './KhairabadMapPreview';

interface BusinessDetailModalProps {
  listing: CityListing | null;
  onClose: () => void;
  onClaim: (listing: CityListing) => void;
  onReportEdit: (listing: CityListing) => void;
}

export const BusinessDetailModal: React.FC<BusinessDetailModalProps> = ({
  listing,
  onClose,
  onClaim,
  onReportEdit,
}) => {
  const [copied, setCopied] = useState(false);

  if (!listing) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Modal Top Visual Header */}
        <div className="relative h-48 bg-slate-900 overflow-hidden shrink-0">
          {listing.images && listing.images.length > 0 ? (
            <img
              src={listing.images[0]}
              alt={listing.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover filter brightness-75"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 flex items-center justify-center text-white/40">
              <Building className="w-16 h-16 stroke-[1]" />
            </div>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Tag & Verification Overlay */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
            <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md font-medium">
              {listing.subcategory} · {listing.locality}
            </span>
            {listing.verified ? (
              <span className="bg-emerald-600/90 text-white px-2.5 py-1 rounded-md font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified
              </span>
            ) : (
              <span className="bg-amber-600/90 text-white px-2.5 py-1 rounded-md font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Demo / Unverified
              </span>
            )}
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 flex-1 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-display mb-2">
              {listing.name}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {listing.description}
            </p>
          </div>

          {/* Contact Actions Bar */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              {listing.phone && (
                <a
                  href={`tel:${listing.phone}`}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 border border-amber-500 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {listing.phone}</span>
                </a>
              )}
              {listing.whatsapp && (
                <a
                  href={`https://wa.me/${listing.whatsapp}?text=${encodeURIComponent(`Hello, I saw your listing for "${listing.name}" on Khairabad City Directory.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              )}
            </div>

            <div className="flex items-center gap-2">
              <a
                href={listing.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white flex items-center gap-1.5"
              >
                <span>Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </a>
              <button
                onClick={handleShare}
                className="p-2 border border-slate-300 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white"
                title="Share Listing"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Location & Timings Detail Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
              <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>Full Address</span>
              </div>
              <div className="text-slate-600">{listing.address}</div>
              <div className="text-slate-400 text-[11px]">Khairabad, Sitapur, UP – 261131</div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
              <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Operating Timings</span>
              </div>
              <div className="text-slate-600">{listing.openingHours || 'Standard daytime hours'}</div>
              {listing.emergencyAvailable && (
                <div className="text-emerald-700 font-semibold text-[11px]">
                  Emergency care available 24 hours
                </div>
              )}
            </div>
          </div>

          {/* Services & Facilities */}
          {listing.services && listing.services.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Services & Highlights
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {listing.services.map((srv, idx) => (
                  <span
                    key={idx}
                    className="text-xs text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md"
                  >
                    ✓ {srv}
                  </span>
                ))}
              </div>
            </div>
          )}

          {listing.capacity && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
              <span className="font-bold">Guest Capacity: </span>
              <span>{listing.capacity}</span>
            </div>
          )}

          {/* Specific Location Pin Map Component */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <h4 className="font-bold uppercase tracking-wider text-slate-700 font-display flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-600" />
                <span>Khairabad Location &amp; Address Pin</span>
              </h4>
              <span className="text-[11px] font-bold text-amber-950 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                {listing.locality}
              </span>
            </div>
            <KhairabadMapPreview listing={listing} />
          </div>

          {/* Owner Claim & Report Edit Actions */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <button
              onClick={() => onClaim(listing)}
              className="text-amber-800 hover:underline font-bold flex items-center gap-1"
            >
              <span>Own this business? Claim this listing &rarr;</span>
            </button>
            <button
              onClick={() => onReportEdit(listing)}
              className="text-slate-500 hover:text-red-700 flex items-center gap-1"
            >
              <Flag className="w-3 h-3" />
              <span>Report incorrect info / Suggest edit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
