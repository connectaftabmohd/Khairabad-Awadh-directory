import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'khairabad_favorite_ids_v1';
const EVENT_NAME = 'khairabad_favorites_changed';

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to parse favorites from localStorage:', err);
    }
    return [];
  });

  const saveToStorage = useCallback((newIds: string[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newIds));
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: newIds }));
    } catch (err) {
      console.warn('Failed to write favorites to localStorage:', err);
    }
  }, []);

  const toggleFavorite = useCallback(
    (id: string): boolean => {
      let isNowSaved = false;
      setFavoriteIds((prev) => {
        const exists = prev.includes(id);
        const next = exists ? prev.filter((item) => item !== id) : [...prev, id];
        isNowSaved = !exists;
        saveToStorage(next);
        return next;
      });
      return isNowSaved;
    },
    [saveToStorage]
  );

  const removeFavorite = useCallback(
    (id: string) => {
      setFavoriteIds((prev) => {
        const next = prev.filter((item) => item !== id);
        saveToStorage(next);
        return next;
      });
    },
    [saveToStorage]
  );

  const clearFavorites = useCallback(() => {
    setFavoriteIds([]);
    saveToStorage([]);
  }, [saveToStorage]);

  const isFavorite = useCallback(
    (id: string): boolean => {
      return favoriteIds.includes(id);
    },
    [favoriteIds]
  );

  // Sync with cross-window/cross-component events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setFavoriteIds(parsed);
          }
        } catch {
          // ignore
        }
      }
    };

    const handleCustomChange = (e: Event) => {
      const detail = (e as CustomEvent<string[]>).detail;
      if (Array.isArray(detail)) {
        setFavoriteIds(detail);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(EVENT_NAME, handleCustomChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(EVENT_NAME, handleCustomChange);
    };
  }, []);

  return {
    favoriteIds,
    favoritesCount: favoriteIds.length,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    clearFavorites,
  };
}
