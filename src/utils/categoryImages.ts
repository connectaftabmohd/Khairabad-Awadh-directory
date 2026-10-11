import { CategoryId, CityListing } from '../types/directory';

/**
 * Curated, authentic image mapping for Khairabad town directory.
 * Each category and subcategory is paired with high-quality, fast-loading,
 * contextual imagery tailored for northern Indian towns and local businesses.
 */

// Category-specific primary photographic assets (Unsplash optimized CDN + local public images)
export const CATEGORY_IMAGE_MAP: Record<string, string[]> = {
  hospitals: [
    '/images/khairabad_hospital_chc_1791567719143.jpg',
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80',
  ],
  clinics: [
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
  ],
  doctors: [
    'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',
  ],
  pharmacies: [
    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=800&q=80',
  ],
  restaurants: [
    '/images/babbu_hotel_khairabad_1791570399551.jpg',
    'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80', // Biryani
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
  ],
  hotels: [
    '/images/babbu_hotel_khairabad_1791570399551.jpg',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
  ],
  'marriage-lawns': [
    '/images/khairabad_marriage_lawn_1791567699343.jpg',
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
  ],
  'event-services': [
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519225424976-13d6a3501659?auto=format&fit=crop&w=800&q=80',
  ],
  schools: [
    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
  ],
  colleges: [
    'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
  ],
  coaching: [
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
  ],
  banks: [
    'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&w=800&q=80',
  ],
  atms: [
    'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
  ],
  government: [
    'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1555848962-6e79363ec58f?auto=format&fit=crop&w=800&q=80',
  ],
  police: [
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
  ],
  'post-office': [
    'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80',
  ],
  'petrol-pumps': [
    'https://images.unsplash.com/photo-1545459720-aac8509eb02c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=800&q=80',
  ],
  'auto-services': [
    'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80',
  ],
  transport: [
    '/images/khairabad_station_logo_1791100397850.jpg',
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
  ],
  markets: [
    '/images/khairabad_market_street_1791046938937.jpg',
    'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80',
  ],
  'mobile-shops': [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80',
  ],
  'cyber-cafes': [
    'https://images.unsplash.com/photo-1588702547919-26089e690ecc?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
  ],
  salons: [
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
  ],
  gyms: [
    '/images/fitness_feed_gym_1791097586687.jpg',
    '/images/alpha_gym_centre_1791097615875.jpg',
    '/images/ultimate_fitness_gym_1791097629749.jpg',
    '/images/fauji_physical_academy_1791097601638.jpg',
  ],
  photographers: [
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=800&q=80',
  ],
  lawyers: [
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=800&q=80',
  ],
  'real-estate': [
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80',
  ],
  religious: [
    '/images/khairabad_badi_sangat_1791046924123.jpg',
    '/images/khairabad_hero_banner_1791046903675.jpg',
    'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
  ],
};

/**
 * Normalizes any legacy `/src/assets/images/...` path to `/images/...`
 * which is reliably served by Vite in both dev and live production.
 */
export function normalizeImagePath(path: string | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('/src/assets/images/')) {
    const filename = path.replace('/src/assets/images/', '');
    return `/images/${filename}`;
  }
  return path;
}

/**
 * Returns a high-quality, relevant image for any listing based on its specific identity,
 * category, and subcategory.
 */
export function getListingPrimaryImage(listing: CityListing): string {
  // 1. If listing has user or custom images:
  if (listing.images && listing.images.length > 0) {
    const first = listing.images[0];
    if (first && first.trim()) {
      const normalized = normalizeImagePath(first.trim());
      if (normalized) return normalized;
    }
  }

  // 2. Specific known landmarks / named businesses:
  const nameLower = listing.name.toLowerCase();
  const subLower = (listing.subcategory || '').toLowerCase();

  if (nameLower.includes('badi sangat')) {
    return '/images/khairabad_badi_sangat_1791046924123.jpg';
  }
  if (nameLower.includes('babbu') || nameLower.includes('hotel babbu')) {
    return '/images/babbu_hotel_khairabad_1791570399551.jpg';
  }
  if (nameLower.includes('fitness feed')) {
    return '/images/fitness_feed_gym_1791097586687.jpg';
  }
  if (nameLower.includes('alpha gym')) {
    return '/images/alpha_gym_centre_1791097615875.jpg';
  }
  if (nameLower.includes('ultimate fitness')) {
    return '/images/ultimate_fitness_gym_1791097629749.jpg';
  }
  if (nameLower.includes('fauji')) {
    return '/images/fauji_physical_academy_1791097601638.jpg';
  }
  if (nameLower.includes('chc') || nameLower.includes('community health')) {
    return '/images/khairabad_hospital_chc_1791567719143.jpg';
  }

  // Subcategory specific matches
  if (subLower.includes('optical') || subLower.includes('spectacle') || nameLower.includes('optical')) {
    return 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80';
  }
  if (subLower.includes('hardware') || nameLower.includes('iron store')) {
    return 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';
  }
  if (subLower.includes('sweet') || nameLower.includes('mithai') || nameLower.includes('sweets')) {
    return 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80';
  }
  if (subLower.includes('saree') || subLower.includes('apparel') || nameLower.includes('hira market')) {
    return 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';
  }
  if (subLower.includes('bike') || subLower.includes('motorcycle') || subLower.includes('two-wheeler')) {
    return 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80';
  }

  // 3. Category match
  const catImages = CATEGORY_IMAGE_MAP[listing.category];
  if (catImages && catImages.length > 0) {
    // Generate deterministic pick based on listing id hash so each place in category gets a consistent photo
    let hash = 0;
    for (let i = 0; i < listing.id.length; i++) {
      hash = (hash * 31 + listing.id.charCodeAt(i)) & 0xffffffff;
    }
    const idx = Math.abs(hash) % catImages.length;
    return catImages[idx];
  }

  // 4. Default fallback:
  return '/images/khairabad_market_street_1791046938937.jpg';
}

/**
 * Returns an array of relevant photos for a listing.
 */
export function getListingAllImages(listing: CityListing): string[] {
  const images: string[] = [];

  if (listing.images && listing.images.length > 0) {
    for (const img of listing.images) {
      if (img && img.trim()) {
        const norm = normalizeImagePath(img.trim());
        if (norm && !images.includes(norm)) images.push(norm);
      }
    }
  }

  if (images.length === 0) {
    const primary = getListingPrimaryImage(listing);
    images.push(primary);
    
    // Add additional secondary photo from category pool if available
    const catPool = CATEGORY_IMAGE_MAP[listing.category] || [];
    for (const alt of catPool) {
      if (!images.includes(alt)) {
        images.push(alt);
        break;
      }
    }
  }

  return images;
}
