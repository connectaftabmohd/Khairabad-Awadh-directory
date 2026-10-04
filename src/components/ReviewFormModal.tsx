import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, MessageSquare, AlertCircle } from 'lucide-react';
import { CityListing, ReviewFormData } from '../types/directory';
import { StarRatingInput } from './StarRatingInput';

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: CityListing;
  onSubmitReview: (formData: ReviewFormData) => void;
}

const COMMON_LOCALITIES = [
  'Khairabad Local Resident',
  'Regular Customer',
  'Civil Lines Resident',
  'Main Bazaar Shopper',
  'Sitapur Road Resident',
  'Visitor from Sitapur',
  'Badi Sangat Devotee',
  'First-time Visitor',
];

export const ReviewFormModal: React.FC<ReviewFormModalProps> = ({
  isOpen,
  onClose,
  listing,
  onSubmitReview,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [authorName, setAuthorName] = useState<string>('');
  const [locality, setLocality] = useState<string>('Khairabad Local Resident');
  const [customLocality, setCustomLocality] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rating < 1 || rating > 5) {
      setError('Please select a star rating (1 to 5 stars).');
      return;
    }

    if (!authorName.trim()) {
      setError('Please enter your full name or display nickname.');
      return;
    }

    if (comment.trim().length < 10) {
      setError('Please write at least 10 characters describing your experience.');
      return;
    }

    setError('');
    const resolvedLocality =
      locality === 'Other' && customLocality.trim()
        ? customLocality.trim()
        : locality;

    onSubmitReview({
      authorName: authorName.trim(),
      rating,
      comment: comment.trim(),
      locality: resolvedLocality,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      // Reset form
      setRating(5);
      setAuthorName('');
      setComment('');
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative my-8">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-950 bg-amber-100 px-2.5 py-0.5 rounded border border-amber-300 mb-1.5 uppercase tracking-wider">
              <MessageSquare className="w-3 h-3 text-amber-700" />
              <span>Verified Community Review</span>
            </div>
            <h3 className="text-xl font-bold font-display text-slate-900 leading-tight">
              Review {listing.name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {listing.subcategory || listing.category} · {listing.locality}, Khairabad
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            aria-label="Close review modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">
              Thank you for your review!
            </h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Your feedback has been published and will help fellow citizens discover trusted services in Khairabad.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 pt-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* 1. Star Rating Input */}
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Overall Experience Rating <span className="text-red-500">*</span>
              </label>
              <StarRatingInput value={rating} onChange={(r) => setRating(r)} />
            </div>

            {/* 2. Author Name */}
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                Your Full Name or Nickname <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Mohd. Rizvi / Anita Verma"
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                required
              />
            </div>

            {/* 3. Community Locality Tag */}
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                Your Locality / Connection to Khairabad
              </label>
              <select
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:border-amber-500 bg-white"
              >
                {COMMON_LOCALITIES.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
                <option value="Other">Other / Custom Location</option>
              </select>

              {locality === 'Other' && (
                <input
                  type="text"
                  value={customLocality}
                  onChange={(e) => setCustomLocality(e.target.value)}
                  placeholder="Specify your area or town (e.g. Biswan, Laharpur)"
                  className="w-full mt-2 p-2 rounded-lg border border-slate-300 text-xs text-slate-900 outline-none focus:border-amber-500"
                />
              )}
            </div>

            {/* 4. Review Comment Text */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Your Brief Review / Experience <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  {comment.length} / 1000 characters
                </span>
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                maxLength={1000}
                placeholder="Share specific details about service quality, staff behavior, pricing, cleanliness, promptness, or facilities..."
                className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 leading-relaxed"
                required
              />
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Helpful, constructive reviews keep the Khairabad directory reliable.</span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold border border-amber-500 rounded-xl text-xs sm:text-sm shadow-xs transition-colors"
              >
                Post Review
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
