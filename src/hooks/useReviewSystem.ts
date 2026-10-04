import { useState, useEffect, useCallback } from 'react';
import { Review, ReviewFormData } from '../types/directory';
import {
  getStoredReviews,
  saveReviews,
  getReviewsForListing,
  calculateRatingSummary,
  createNewReview,
  RatingSummary,
} from '../utils/reviewStorage';

export function useReviewSystem() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const loaded = getStoredReviews();
    setReviews(loaded);
    setIsLoaded(true);
  }, []);

  const getListingReviews = useCallback(
    (listingId: string): Review[] => {
      return getReviewsForListing(reviews, listingId);
    },
    [reviews]
  );

  const getListingRating = useCallback(
    (listingId: string): RatingSummary => {
      const listingRevs = getReviewsForListing(reviews, listingId);
      return calculateRatingSummary(listingRevs);
    },
    [reviews]
  );

  const submitReview = useCallback(
    (listingId: string, formData: ReviewFormData): Review => {
      const newReview = createNewReview(listingId, formData);
      setReviews((prev) => {
        const next = [newReview, ...prev];
        saveReviews(next);
        return next;
      });
      return newReview;
    },
    []
  );

  const voteHelpful = useCallback((reviewId: string) => {
    setReviews((prev) => {
      const next = prev.map((r) =>
        r.id === reviewId ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r
      );
      saveReviews(next);
      return next;
    });
  }, []);

  return {
    reviews,
    isLoaded,
    getListingReviews,
    getListingRating,
    submitReview,
    voteHelpful,
  };
}
