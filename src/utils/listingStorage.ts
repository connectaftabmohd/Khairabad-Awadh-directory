import { CityListing } from '../types/directory';
import { INITIAL_LISTINGS } from '../data/khairabadData';
import { syncListingToSupabase, fetchListingsFromSupabase } from './supabaseClient';

export const USER_LISTINGS_STORAGE_KEY = 'khairabad_user_listings_v1';
const DB_NAME = 'KhairabadDirectoryDB';
const DB_VERSION = 1;
const STORE_NAME = 'user_listings';

// In-memory cache for ultra-fast synchronous reads
let inMemoryListingsCache: CityListing[] | null = null;

/**
 * Open or initialize IndexedDB connection safely.
 */
function openDatabase(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !('indexedDB' in window)) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = (err) => {
        console.warn('IndexedDB open error, falling back to localStorage:', err);
        resolve(null);
      };
    } catch (err) {
      console.warn('IndexedDB not supported or restricted:', err);
      resolve(null);
    }
  });
}

/**
 * Read all listings from IndexedDB.
 */
export async function getAllListingsFromIndexedDB(): Promise<CityListing[]> {
  const db = await openDatabase();
  if (!db) return [];

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const result = request.result;
        if (Array.isArray(result)) {
          resolve(result);
        } else {
          resolve([]);
        }
      };

      request.onerror = () => resolve([]);
    } catch (err) {
      console.warn('Error reading from IndexedDB:', err);
      resolve([]);
    }
  });
}

/**
 * Persist a listing into IndexedDB (virtually unlimited quota for user photos).
 */
export async function saveListingToIndexedDB(listing: CityListing): Promise<void> {
  const db = await openDatabase();
  if (!db) return;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(listing);
      tx.oncomplete = () => resolve();
      tx.onerror = (err) => {
        console.warn('Error saving to IndexedDB:', err);
        resolve();
      };
    } catch (err) {
      console.warn('IndexedDB transaction error:', err);
      resolve();
    }
  });
}

/**
 * Delete a listing from IndexedDB.
 */
export async function deleteListingFromIndexedDB(id: string): Promise<void> {
  const db = await openDatabase();
  if (!db) return;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

/**
 * Safely retrieve all user-added listings from synchronous storage (localStorage + memory).
 */
export function getUserListings(): CityListing[] {
  if (inMemoryListingsCache !== null) {
    return inMemoryListingsCache;
  }

  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(USER_LISTINGS_STORAGE_KEY);
    if (!raw) {
      inMemoryListingsCache = [];
      return [];
    }

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const valid = parsed.filter(
        (item): item is CityListing =>
          item &&
          typeof item === 'object' &&
          typeof item.id === 'string' &&
          typeof item.name === 'string' &&
          typeof item.category === 'string'
      );
      inMemoryListingsCache = valid;
      return valid;
    }
    inMemoryListingsCache = [];
    return [];
  } catch (err) {
    console.error('Error reading user listings from localStorage:', err);
    inMemoryListingsCache = [];
    return [];
  }
}

/**
 * Safe write to localStorage with multi-tiered image compression and quota recovery.
 */
function writeToLocalStorageSafely(listings: CityListing[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(USER_LISTINGS_STORAGE_KEY, JSON.stringify(listings));
  } catch (quotaError) {
    console.warn('LocalStorage quota limit reached, optimizing image payloads for fallback cache...', quotaError);

    // Tier 1: Keep only the first photo for each listing
    const singlePhotoListings = listings.map((item) => {
      if (item.images && item.images.length > 1) {
        return { ...item, images: [item.images[0]] };
      }
      return item;
    });

    try {
      localStorage.setItem(USER_LISTINGS_STORAGE_KEY, JSON.stringify(singlePhotoListings));
    } catch (tier2Error) {
      // Tier 2: Strip large base64 data URLs from localStorage (full images remain safely in IndexedDB!)
      const metadataOnlyListings = listings.map((item) => {
        const nonBase64Images = (item.images || []).filter((img) => !img.startsWith('data:image'));
        return { ...item, images: nonBase64Images };
      });

      try {
        localStorage.setItem(USER_LISTINGS_STORAGE_KEY, JSON.stringify(metadataOnlyListings));
      } catch (tier3Error) {
        console.error('Could not save to localStorage, IndexedDB remains source of truth:', tier3Error);
      }
    }
  }
}

/**
 * Save a new user listing to both IndexedDB (permanent quota-free storage)
 * and localStorage (instant synchronous cache).
 */
export function saveUserListing(newListing: CityListing): CityListing[] {
  if (typeof window === 'undefined') return [];

  try {
    const currentListings = getUserListings();
    const existingIndex = currentListings.findIndex((item) => item.id === newListing.id);
    let updatedListings: CityListing[];

    if (existingIndex >= 0) {
      updatedListings = [...currentListings];
      updatedListings[existingIndex] = newListing;
    } else {
      updatedListings = [newListing, ...currentListings];
    }

    // Update in-memory cache
    inMemoryListingsCache = updatedListings;

    // Write to localStorage cache
    writeToLocalStorageSafely(updatedListings);

    // Asynchronously write to permanent IndexedDB
    saveListingToIndexedDB(newListing).catch((err) =>
      console.warn('IndexedDB save background task failed:', err)
    );

    // Asynchronously push to Supabase Cloud Database
    syncListingToSupabase(newListing).then((res) => {
      if (!res.success) {
        console.info('Supabase sync info:', res.error);
      }
    }).catch((err) => {
      console.warn('Supabase sync caught:', err);
    });

    // Dispatch custom event for real-time app update
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('khairabad_listings_updated', { detail: newListing }));
    }

    return updatedListings;
  } catch (err) {
    console.error('Failed to save listing:', err);
    return [];
  }
}

/**
 * Delete a user-added listing by ID from both IndexedDB and localStorage.
 */
export function deleteUserListing(id: string): CityListing[] {
  if (typeof window === 'undefined') return [];

  try {
    const currentListings = getUserListings();
    const filtered = currentListings.filter((item) => item.id !== id);

    inMemoryListingsCache = filtered;
    writeToLocalStorageSafely(filtered);

    // Also remove from IndexedDB
    deleteListingFromIndexedDB(id).catch(() => {});

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('khairabad_listings_updated'));
    }

    return filtered;
  } catch (err) {
    console.error('Failed to delete listing:', err);
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

/**
 * Called on application startup: verifies and restores listings from permanent IndexedDB,
 * ensuring listings are never lost when reopening the browser or after browser cache resets.
 */
export async function syncListingsFromPersistentStorage(): Promise<CityListing[]> {
  if (typeof window === 'undefined') return getAllCombinedListings();

  try {
    const idbListings = await getAllListingsFromIndexedDB();
    const localListings = getUserListings();

    // Merge listings from both IndexedDB and localStorage
    const mergedMap = new Map<string, CityListing>();

    // 1. Put local listings first
    for (const item of localListings) {
      mergedMap.set(item.id, item);
    }

    // 2. Merge IndexedDB listings (IndexedDB often has the full high-res images)
    let hasNewFromIDB = false;
    for (const item of idbListings) {
      const existing = mergedMap.get(item.id);
      if (!existing) {
        mergedMap.set(item.id, item);
        hasNewFromIDB = true;
      } else {
        // If IDB has images and existing localStorage version has none, prefer IDB
        if ((item.images?.length || 0) > (existing.images?.length || 0)) {
          mergedMap.set(item.id, item);
          hasNewFromIDB = true;
        }
      }
    }

    // 3. If localStorage had listings missing in IDB, sync them to IDB
    for (const item of localListings) {
      if (!idbListings.some((idbItem) => idbItem.id === item.id)) {
        saveListingToIndexedDB(item).catch(() => {});
      }
    }

    // 4. Try fetching remote listings from Supabase to merge cross-device cloud listings
    try {
      const remoteListings = await fetchListingsFromSupabase();
      if (remoteListings.length > 0) {
        for (const item of remoteListings) {
          if (!mergedMap.has(item.id)) {
            mergedMap.set(item.id, item);
            hasNewFromIDB = true;
            // Also cache into IndexedDB locally
            saveListingToIndexedDB(item).catch(() => {});
          }
        }
      }
    } catch (remoteErr) {
      console.info('Supabase background fetch status:', remoteErr);
    }

    const mergedList = Array.from(mergedMap.values());
    inMemoryListingsCache = mergedList;
    writeToLocalStorageSafely(mergedList);

    if (hasNewFromIDB && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('khairabad_listings_updated'));
    }

    return getAllCombinedListings();
  } catch (err) {
    console.warn('Error during persistent storage sync:', err);
    return getAllCombinedListings();
  }
}
