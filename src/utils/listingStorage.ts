import { CityListing } from '../types/directory';
import { INITIAL_LISTINGS } from '../data/khairabadData';

export const USER_LISTINGS_STORAGE_KEY = 'khairabad_user_listings_v1';

/**
 * Safely retrieve all user-added listings from localStorage.
 */
export function getUserListings(): CityListing[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(USER_LISTINGS_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Validate that each item has minimum required fields
      return parsed.filter(
        (item): item is CityListing =>
          item &&
          typeof item === 'object' &&
          typeof item.id === 'string' &&
          typeof item.name === 'string' &&
          typeof item.category === 'string'
      );
    }
    return [];
  } catch (err) {
    console.error('Error reading user listings from localStorage:', err);
    return [];
  }
}

/**
 * Save a new user listing to localStorage.
 * Handles storage quota gracefully by downscaling or trimming image data if needed.
 */
export function saveUserListing(newListing: CityListing): CityListing[] {
  if (typeof window === 'undefined') return [];

  try {
    const currentListings = getUserListings();
    // Check if listing already exists to update it, otherwise prepend
    const existingIndex = currentListings.findIndex((item) => item.id === newListing.id);
    let updatedListings: CityListing[];

    if (existingIndex >= 0) {
      updatedListings = [...currentListings];
      updatedListings[existingIndex] = newListing;
    } else {
      updatedListings = [newListing, ...currentListings];
    }

    try {
      localStorage.setItem(USER_LISTINGS_STORAGE_KEY, JSON.stringify(updatedListings));
    } catch (quotaError) {
      console.warn('Storage quota exceeded, attempting to optimize image payloads...', quotaError);
      // Fallback: If images are too large, strip high-res base64 or keep only 1 image
      const optimizedListings = updatedListings.map((item) => {
        if (item.images && item.images.length > 2) {
          return { ...item, images: item.images.slice(0, 1) };
        }
        return item;
      });

      try {
        localStorage.setItem(USER_LISTINGS_STORAGE_KEY, JSON.stringify(optimizedListings));
        updatedListings = optimizedListings;
      } catch (secondError) {
        // Ultimate fallback: keep listing metadata, omit raw base64 images
        const metadataOnlyListings = updatedListings.map((item) => {
          const filteredImages = item.images.filter((img) => !img.startsWith('data:image'));
          return { ...item, images: filteredImages };
        });
        localStorage.setItem(USER_LISTINGS_STORAGE_KEY, JSON.stringify(metadataOnlyListings));
        updatedListings = metadataOnlyListings;
      }
    }

    // Dispatch event to synchronize any other listening components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('khairabad_listings_updated', { detail: newListing }));
    }

    return updatedListings;
  } catch (err) {
    console.error('Failed to save listing to localStorage:', err);
    return [];
  }
}

/**
 * Delete a user-added listing by ID.
 */
export function deleteUserListing(id: string): CityListing[] {
  if (typeof window === 'undefined') return [];

  try {
    const currentListings = getUserListings();
    const filtered = currentListings.filter((item) => item.id !== id);
    localStorage.setItem(USER_LISTINGS_STORAGE_KEY, JSON.stringify(filtered));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('khairabad_listings_updated'));
    }

    return filtered;
  } catch (err) {
    console.error('Failed to delete listing from localStorage:', err);
    return [];
  }
}

/**
 * Combines all user-submitted custom listings with the standard initial dataset.
 * User listings appear at the top so they are immediately discoverable.
 */
export function getAllCombinedListings(): CityListing[] {
  const userListings = getUserListings();
  if (userListings.length === 0) {
    return INITIAL_LISTINGS;
  }

  // De-duplicate: If a user edited an existing listing or added a new one
  const userIds = new Set(userListings.map((l) => l.id));
  const remainingInitial = INITIAL_LISTINGS.filter((l) => !userIds.has(l.id));

  return [...userListings, ...remainingInitial];
}
