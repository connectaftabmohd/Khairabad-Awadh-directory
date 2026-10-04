import React, { useState, useMemo } from 'react';
import {
  Star,
  ThumbsUp,
  MessageSquarePlus,
  ShieldCheck,
  Filter,
  Check,
  User,
  SlidersHorizontal,
} from 'lucide-react';
import { Review, CityListing } from '../types/directory';
import { StarRatingDisplay } from './StarRatingDisplay';
import { calculateRatingSummary, hasUserVotedHelpful, markReviewVoted } from '../utils/reviewStorage';

interface ReviewListSectionProps {
  listing: CityListing;
  reviews: Review[];
  onOpenWriteReview: () => void;
  onVoteHelpful: (reviewId: string) => void;
}

export const ReviewListSection: React.FC<ReviewListSectionProps> = ({
  listing,
  reviews,
  onOpenWriteReview,
  onVoteHelpful,
}) => {
  const [selectedStarFilter, setSelectedStarFilter] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'helpful'>('newest');
  const [votedMap, setVotedMap] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    reviews.forEach((r) => {
      map[r.id] = hasUserVotedHelpful(r.id);
    });
    return map;
  });

  const summary = useMemo(() => calculateRatingSummary(reviews), [reviews]);

  const handleHelpfulClick = (reviewId: string) => {
    if (votedMap[reviewId]) return;
    onVoteHelpful(reviewId);
    markReviewVoted(reviewId);
    setVotedMap((prev) => ({ ...prev, [reviewId]: true }));
  };

  const filteredAndSortedReviews = useMemo(() => {
    let list = [...reviews];

    if (selectedStarFilter !== 'all') {
      list = list.filter((r) => Math.round(r.rating) === selectedStarFilter);
    }

    if (sortBy === 'newest') {
      // Keep order or sort by date/id
      list.sort((a, b) => (b.id > a.id ? 1 : -1));
    } else if (sortBy === 'highest') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'helpful') {
      list.sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0));
    }

    return list;
  }, [reviews, selectedStarFilter, sortBy]);

  return (
    <div className="space-y-6" id="reviews-section">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold font-display text-slate-900">
              Customer Ratings &amp; Reviews
            </h3>
            <span className="text-xs bg-amber-100 text-amber-950 font-bold px-2.5 py-0.5 rounded-full border border-amber-300">
              {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real experiences from residents and visitors across Khairabad, UP
          </p>
        </div>

        <button
          onClick={onOpenWriteReview}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs sm:text-sm border border-amber-500 shadow-xs transition-colors shrink-0"
        >
          <MessageSquarePlus className="w-4 h-4 stroke-[2.5]" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Ratings Breakdown Summary Box */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Overall Score */}
        <div className="md:col-span-4 text-center md:border-r md:border-slate-200 md:pr-6 space-y-2">
          <div className="text-4xl sm:text-5xl font-extrabold font-display text-slate-900 tracking-tight">
            {summary.averageRating > 0 ? summary.averageRating.toFixed(1) : '5.0'}
          </div>
          <div className="flex justify-center">
            <StarRatingDisplay
              rating={summary.averageRating > 0 ? summary.averageRating : 5.0}
              size="md"
            />
          </div>
          <p className="text-xs text-slate-500">
            Based on {summary.totalReviews} verified community ratings
          </p>
        </div>

        {/* 5-Star Breakdown Bars */}
        <div className="md:col-span-8 space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = summary.breakdown[star as 1 | 2 | 3 | 4 | 5] || 0;
            const percentage =
              summary.totalReviews > 0 ? (count / summary.totalReviews) * 100 : 0;

            return (
              <button
                key={star}
                type="button"
                onClick={() =>
                  setSelectedStarFilter((prev) => (prev === star ? 'all' : star))
                }
                className={`w-full flex items-center gap-3 text-xs p-1 rounded-lg transition-colors group text-left ${
                  selectedStarFilter === star ? 'bg-amber-100/70 font-bold' : 'hover:bg-slate-100'
                }`}
              >
                <span className="w-12 flex items-center gap-1 font-semibold text-slate-700 shrink-0">
                  <span>{star}</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-500 inline" />
                </span>

                <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <span className="w-8 text-right text-slate-400 text-[11px] shrink-0 font-medium">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Sorting Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-medium">
          <span className="text-slate-400 mr-1 flex items-center gap-1 text-[11px] uppercase tracking-wider font-bold">
            <Filter className="w-3 h-3 text-amber-600" />
            <span>Filter:</span>
          </span>
          <button
            onClick={() => setSelectedStarFilter('all')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              selectedStarFilter === 'all'
                ? 'bg-slate-950 text-white font-bold'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            All ({reviews.length})
          </button>
          {[5, 4, 3, 2, 1].map((s) => (
            <button
              key={s}
              onClick={() => setSelectedStarFilter(s)}
              className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                selectedStarFilter === s
                  ? 'bg-slate-950 text-white font-bold'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{s}★</span>
              <span className="text-[10px] text-slate-400">
                ({summary.breakdown[s as 1 | 2 | 3 | 4 | 5] || 0})
              </span>
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 text-xs">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'highest' | 'helpful')}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs outline-none focus:border-amber-500"
          >
            <option value="newest">Most Recent</option>
            <option value="highest">Highest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      {filteredAndSortedReviews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center mx-auto">
            <Star className="w-6 h-6 text-amber-500" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">
            {selectedStarFilter !== 'all'
              ? `No ${selectedStarFilter}-star reviews yet`
              : 'No reviews submitted yet'}
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Have you visited or used the services of {listing.name}? Be the first in Khairabad to leave a community rating!
          </p>
          <button
            onClick={onOpenWriteReview}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold border border-amber-500 rounded-xl text-xs shadow-xs"
          >
            Write the First Review
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredAndSortedReviews.map((rev) => {
            const hasVoted = votedMap[rev.id];

            return (
              <article
                key={rev.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 space-y-3 shadow-2xs hover:border-slate-300 transition-colors"
              >
                {/* Author row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-800">
                      {rev.authorName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900">
                          {rev.authorName}
                        </span>
                        {rev.verifiedVisit && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            <ShieldCheck className="w-2.5 h-2.5" />
                            <span>Verified Experience</span>
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <span>{rev.locality || 'Khairabad Local'}</span>
                        <span>·</span>
                        <span>{rev.date}</span>
                      </div>
                    </div>
                  </div>

                  <StarRatingDisplay rating={rev.rating} size="sm" showNumber />
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-12">
                  {rev.comment}
                </p>

                {/* Helpful Button Row */}
                <div className="pt-2 pl-12 flex items-center gap-4 text-xs">
                  <button
                    onClick={() => handleHelpfulClick(rev.id)}
                    disabled={hasVoted}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                      hasVoted
                        ? 'bg-amber-100 text-slate-900 font-bold border border-amber-300'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {hasVoted ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <ThumbsUp className="w-3 h-3 text-slate-400" />
                    )}
                    <span>
                      {hasVoted ? 'Marked Helpful' : 'Helpful'} ({rev.helpfulCount || 0})
                    </span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
