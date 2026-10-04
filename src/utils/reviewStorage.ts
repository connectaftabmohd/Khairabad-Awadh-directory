import { Review, ReviewFormData } from '../types/directory';
import { INITIAL_REVIEWS } from '../data/initialReviews';

const REVIEWS_STORAGE_KEY = 'khairabad_directory_reviews_v1';
const VOTED_REVIEWS_STORAGE_KEY = 'khairabad_directory_voted_reviews_v1';

export interface RatingSummary {
  averageRating: number;
  totalReviews: number;
  breakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

/**
 * Load all reviews from localStorage, combined with initial seed reviews
 */
export function getStoredReviews(): Review[] {
  if (typeof window === 'undefined') return INITIAL_REVIEWS;

  try {
    const raw = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (!raw) {
      // Initialize with seed reviews
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(INITIAL_REVIEWS));
      return INITIAL_REVIEWS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_REVIEWS;
  } catch (err) {
    console.error('Error loading stored reviews:', err);
    return INITIAL_REVIEWS;
  }
}

/**
 * Save reviews to localStorage
 */
export function saveReviews(reviews: Review[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
  } catch (err) {
    console.error('Error saving reviews:', err);
  }
}

/**
 * Get all reviews for a specific listing
 */
export function getReviewsForListing(allReviews: Review[], listingId: string): Review[] {
  return allReviews.filter((r) => r.listingId === listingId);
}

/**
 * Calculate rating summary (average, total count, and 1-5 breakdown)
 */
export function calculateRatingSummary(reviews: Review[]): RatingSummary {
  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  if (reviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      breakdown,
    };
  }

  let totalScore = 0;
  reviews.forEach((r) => {
    const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
    breakdown[star] = (breakdown[star] || 0) + 1;
    totalScore += r.rating;
  });

  const averageRating = Number((totalScore / reviews.length).toFixed(1));

  return {
    averageRating,
    totalReviews: reviews.length,
    breakdown,
  };
}

/**
 * Create a new review with auto ID and current timestamp
 */
export function createNewReview(
  listingId: string,
  formData: ReviewFormData
): Review {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return {
    id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    listingId,
    authorName: formData.authorName.trim(),
    rating: Math.min(5, Math.max(1, formData.rating)),
    comment: formData.comment.trim(),
    date: dateStr,
    locality: formData.locality?.trim() || 'Khairabad Resident / Visitor',
    helpfulCount: 0,
    verifiedVisit: true,
  };
}

/**
 * Check if the user has already voted helpful on a specific review
 */
export function hasUserVotedHelpful(reviewId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(VOTED_REVIEWS_STORAGE_KEY);
    if (!raw) return false;
    const ids: string[] = JSON.parse(raw);
    return ids.includes(reviewId);
  } catch {
    return false;
  }
}

/**
 * Mark review as voted in localStorage
 */
export function markReviewVoted(reviewId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(VOTED_REVIEWS_STORAGE_KEY);
    const ids: string[] = raw ? JSON.parse(raw) : [];
    if (!ids.includes(reviewId)) {
      ids.push(reviewId);
      localStorage.setItem(VOTED_REVIEWS_STORAGE_KEY, JSON.stringify(ids));
    }
  } catch (err) {
    console.error('Error saving voted review:', err);
  }
}
