import { EmergencyContact } from '../types/directory';
import { EMERGENCY_CONTACTS, KHAIRABAD_CITY_INFO } from '../data/khairabadData';
import { KHAIRABAD_BLOGS, KhairabadBlog } from '../data/khairabadBlogs';
import {
  TraditionalMohalla,
  ChaurahaHub,
  RoadConnectivityItem,
  TRADITIONAL_MOHALLAS,
  CHAURAHA_HUBS,
  MAIN_ROADS_CONNECTIVITY,
} from '../data/roadsConnectivityData';

export interface TownMarketItem {
  id: string;
  name: string;
  hindiName: string;
  type: string;
  road: string;
  mohalla: string;
  chaurahaHub: string;
  openingHours: string;
  description: string;
  specialties: string[];
  approxShops?: string;
  googleMapsUrl?: string;
}

export const DEFAULT_TOWN_MARKETS: TownMarketItem[] = [
  {
    id: 'mkt-nai-bazar',
    name: 'Nai Bazar Central Market',
    hindiName: 'नई बाज़ार',
    type: 'Retail Shopping & Consumer Hub',
    road: 'Nai Bazar Road',
    mohalla: 'Joshitola',
    chaurahaHub: 'Nai Bazar Chauraha',
    openingHours: '9:00 AM – 9:30 PM (Daily)',
    description: 'Premier central retail shopping market of Khairabad, bustling daily with apparel, jewelry, footwear, stationery, cosmetics, and groceries.',
    specialties: ['Sarees & Ready-Made Garments', 'Alam Kirana Store Provisions', 'Footwear & Bags', 'Cosmetics & Bangles', 'Kitchen Utensils'],
    approxShops: '120+ Shops & Kiosks',
    googleMapsUrl: 'https://www.google.com/maps/search/Nai+Bazar+Khairabad+Sitapur',
  },
  {
    id: 'mkt-lateef-market',
    name: 'Lateef Market Commercial Complex',
    hindiName: 'लतीफ़ मार्केट',
    type: 'Multi-Store Commercial Complex',
    road: 'Nai Bazar Road / Bahraich Link',
    mohalla: 'Joshitola / Sujawalpur',
    chaurahaHub: 'Batto Khan Chauraha',
    openingHours: '9:30 AM – 9:00 PM (Daily)',
    description: 'Prominent commercial complex near Batto Khan Chauraha with multi-specialty stores including mobile repairs, electronics, readymade clothes, tailoring, and footwear.',
    specialties: ['Electronics & Mobile Repair', 'Ready-Made Clothes', 'Master Tailoring', 'Accessories & Footwear'],
    approxShops: '35+ Commercial Units',
    googleMapsUrl: 'https://www.google.com/maps/search/Lateef+Market+Khairabad+Sitapur',
  },
  {
    id: 'mkt-purani-bazar',
    name: 'Purani Bazar Heritage Market',
    hindiName: 'पुरानी बाज़ार',
    type: 'Historic Heritage Bazaar',
    road: 'Post Office Road',
    mohalla: 'Purani Bazar',
    chaurahaHub: 'Purani Bazar Teen-Rasta Chauraha',
    openingHours: '8:30 AM – 9:00 PM (Daily)',
    description: 'Centuries-old historic marketplace famous for Awadhi sweetmakers, traditional brass and copper ware, spices, dry fruits, and handloom durries.',
    specialties: ['Traditional Halwai Sweets', 'Brassware & Copper Vessels', 'Dry Fruits & Pure Spices', 'Heritage Durries & Handlooms'],
    approxShops: '85+ Heritage Shops',
    googleMapsUrl: 'https://www.google.com/maps/search/Purani+Bazar+Khairabad+Sitapur',
  },
  {
    id: 'mkt-galla-mandi',
    name: 'Khairabad Galla Mandi (Grain Market)',
    hindiName: 'गल्ला मंडी (अनाज मंडी)',
    type: 'Agricultural Grain Wholesale Mandi',
    road: 'National Highway 24 (NH-24)',
    mohalla: 'Katra / Kisani Tola',
    chaurahaHub: 'Khairabad Chauraha (NH-24 Junction)',
    openingHours: '6:00 AM – 7:00 PM (Sun Closed)',
    description: 'Major agricultural wholesale grain exchange facilitating daily auctions of wheat, paddy, mustard, pulses, and digital weighbridge operations.',
    specialties: ['Wheat (Gehun) Auctions', 'Paddy (Dhaan) & Rice Trade', 'Mustard (Sarson) Seeds', 'Certified Digital Weighbridge'],
    approxShops: '60+ Wholesale Arhats & Godowns',
    googleMapsUrl: 'https://www.google.com/maps/search/Galla+Mandi+Khairabad+Sitapur',
  },
  {
    id: 'mkt-hira-market',
    name: 'Hira Market Wholesale Cloth Bazaar',
    hindiName: 'हीरा मार्केट',
    type: 'Wholesale Textile & Garment Market',
    road: 'Bahraich–Sitapur Road',
    mohalla: 'Sujawalpur',
    chaurahaHub: 'Allama Fazl-e-Haq Khairabadi Smarak Chauraha',
    openingHours: '10:00 AM – 9:00 PM (Daily)',
    description: 'Renowned wholesale cloth market in Sujawalpur catering to merchants from Sitapur, Biswan, and Laharpur for sarees, sherwanis, and textiles.',
    specialties: ['Wholesale Cloth Rolls', 'Bridal Lehengas & Sarees', 'Men Suiting & Sherwanis', 'Handloom Durries & Weaves'],
    approxShops: '50+ Textile Wholesale Showrooms',
    googleMapsUrl: 'https://www.google.com/maps/search/Hira+Market+Khairabad+Sitapur',
  },
  {
    id: 'mkt-sabzi-mandi-purani',
    name: 'Purani Bazar Sabzi Mandi',
    hindiName: 'सब्ज़ी मंडी (पुरानी बाज़ार)',
    type: 'Daily Fresh Vegetable & Produce Mandi',
    road: 'Post Office Road',
    mohalla: 'Purani Bazar',
    chaurahaHub: 'Purani Bazar Teen-Rasta Chauraha',
    openingHours: '6:30 AM – 1:00 PM, 4:00 PM – 9:00 PM',
    description: 'Morning and evening vegetable market where local agrarian farmers bring fresh harvested greens, potatoes, onions, tomatoes, and herbs at mandi rates.',
    specialties: ['Farm-Fresh Greens', 'Potatoes & Onions Wholesale', 'Seasonal Vegetables', 'Direct Farmer Stalls'],
    approxShops: '40+ Vegetable Stalls & Vendors',
    googleMapsUrl: 'https://www.google.com/maps/search/Sabzi+Mandi+Purani+Bazar+Khairabad+Sitapur',
  },
  {
    id: 'mkt-sabzi-mandi-nai',
    name: 'Nai Bazar Sabzi Mandi',
    hindiName: 'सब्ज़ी मंडी (नई बाज़ार)',
    type: 'Central Vegetable & Fruit Bazaar',
    road: 'Nai Bazar Road',
    mohalla: 'Joshitola',
    chaurahaHub: 'Nai Bazar Chauraha',
    openingHours: '7:00 AM – 10:00 PM (Daily)',
    description: 'Daily fresh retail vegetable and fruit market convenient for central town residents, featuring clean graded vegetables, citrus, and coconut water.',
    specialties: ['Graded Vegetables', 'Fresh Seasonal Fruits', 'Salad Items & Greens', 'Coconut Water Stalls'],
    approxShops: '45+ Stalls & Pushcarts',
    googleMapsUrl: 'https://www.google.com/maps/search/Sabzi+Mandi+Nai+Bazar+Khairabad+Sitapur',
  },
  {
    id: 'mkt-sarafa-bazaar',
    name: 'Sarafa Market (Jewellery Hub)',
    hindiName: 'सर्राफा बाज़ार',
    type: 'Gold, Silver & Jewellery Bazaar',
    road: 'Post Office Road / Purani Bazar Link',
    mohalla: 'Purani Bazar',
    chaurahaHub: 'Purani Bazar Teen-Rasta Chauraha',
    openingHours: '10:30 AM – 8:30 PM (Sun Closed)',
    description: 'Traditional jewelry street hosting certified goldsmiths, silver artisans, hallmarked ornaments, and bridal jewellery makers.',
    specialties: ['Hallmarked Gold Ornaments', 'Silver Utensils & Payals', 'Bridal Jewellery Crafting', 'Gemstones & Coins'],
    approxShops: '30+ Jewellers & Goldsmiths',
    googleMapsUrl: 'https://www.google.com/maps/search/Sarafa+Market+Khairabad+Sitapur',
  },
  {
    id: 'mkt-suhaima-market',
    name: 'Suhaima Market (Biswan Highway)',
    hindiName: 'सुहैमा मार्केट',
    type: 'Agricultural & Rural Trade Market',
    road: 'State Highway 30 (SH-30)',
    mohalla: 'Suhaima / Thana Area',
    chaurahaHub: 'Thana Khairabad Chauraha (SH-30)',
    openingHours: '7:00 AM – 8:30 PM (Daily)',
    description: 'Bustling trade market along SH-30 known for agricultural fertilizers, seeds, hardware tools, blacksmiths, and rural produce.',
    specialties: ['Agri Seeds & Fertilizers', 'Hardware & Hand Tools', 'Cattle Feed & Grains', 'Blacksmith Workshops'],
    approxShops: '35+ Rural Trade Shops',
    googleMapsUrl: 'https://www.google.com/maps/search/Suhaima+Market+Khairabad+Biswan+Road',
  },
];

export interface SiteAnnouncement {
  enabled: boolean;
  type: 'notice' | 'alert' | 'event' | 'info';
  hindiText: string;
  englishText: string;
  badgeText: string;
  link?: string;
  updatedAt: string;
}

export interface TownCivicInfo {
  chairperson: string;
  chairpersonParty: string;
  mpName: string;
  mpParty: string;
  population: string;
  totalArea: string;
  pinCode: string;
  stdCode: string;
  railwayCode: string;
  website: string;
  emergencyHelpline: string;
  officialEmail: string;
}

const ANNOUNCEMENT_STORAGE_KEY = 'khairabad_site_announcement_v1';
const EMERGENCY_STORAGE_KEY = 'khairabad_site_emergency_contacts_v1';
const BLOGS_STORAGE_KEY = 'khairabad_site_blogs_v1';
const TOWN_INFO_STORAGE_KEY = 'khairabad_town_civic_info_v1';

export const DEFAULT_ANNOUNCEMENT: SiteAnnouncement = {
  enabled: true,
  type: 'notice',
  badgeText: 'Official Notice',
  hindiText: 'नागरिक सूचना: खैराबाद नगर पालिका व आपातकालीन सेवाओं के संपर्क सूत्र 24/7 उपलब्ध हैं। नई दुकान या प्रतिष्ठान नि:शुल्क जोड़ें।',
  englishText: 'Community Notice: Khairabad emergency & civic contacts are active 24/7. Verified local listings updated daily.',
  link: '',
  updatedAt: new Date().toISOString(),
};

export const DEFAULT_TOWN_CIVIC_INFO: TownCivicInfo = {
  chairperson: KHAIRABAD_CITY_INFO.government.chairperson,
  chairpersonParty: KHAIRABAD_CITY_INFO.government.chairpersonParty,
  mpName: KHAIRABAD_CITY_INFO.government.lokSabhaMP,
  mpParty: KHAIRABAD_CITY_INFO.government.lokSabhaParty,
  population: KHAIRABAD_CITY_INFO.population.total,
  totalArea: KHAIRABAD_CITY_INFO.area.totalKm2,
  pinCode: KHAIRABAD_CITY_INFO.pinCode,
  stdCode: KHAIRABAD_CITY_INFO.stdCode,
  railwayCode: KHAIRABAD_CITY_INFO.railwayCode,
  website: KHAIRABAD_CITY_INFO.website,
  emergencyHelpline: '112 / 108 / 05862-252100',
  officialEmail: 'info@khairabadnpp.in',
};

// ==========================================
// 1. ANNOUNCEMENT BANNER
// ==========================================

export function getSiteAnnouncement(): SiteAnnouncement {
  if (typeof window === 'undefined') return DEFAULT_ANNOUNCEMENT;

  try {
    const raw = localStorage.getItem(ANNOUNCEMENT_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ANNOUNCEMENT_STORAGE_KEY, JSON.stringify(DEFAULT_ANNOUNCEMENT));
      return DEFAULT_ANNOUNCEMENT;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_ANNOUNCEMENT;
  }
}

export function saveSiteAnnouncement(announcement: SiteAnnouncement): void {
  if (typeof window === 'undefined') return;

  try {
    const data = { ...announcement, updatedAt: new Date().toISOString() };
    localStorage.setItem(ANNOUNCEMENT_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('khairabad_announcement_updated', { detail: data }));
  } catch (err) {
    console.error('Failed to save announcement:', err);
  }
}

// ==========================================
// 2. EMERGENCY CONTACTS
// ==========================================

export function getStoredEmergencyContacts(): EmergencyContact[] {
  if (typeof window === 'undefined') return EMERGENCY_CONTACTS;

  try {
    const raw = localStorage.getItem(EMERGENCY_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(EMERGENCY_STORAGE_KEY, JSON.stringify(EMERGENCY_CONTACTS));
      return EMERGENCY_CONTACTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return EMERGENCY_CONTACTS;
  } catch {
    return EMERGENCY_CONTACTS;
  }
}

export function saveEmergencyContact(contact: EmergencyContact): EmergencyContact[] {
  if (typeof window === 'undefined') return EMERGENCY_CONTACTS;

  try {
    const current = getStoredEmergencyContacts();
    const idx = current.findIndex((c) => c.id === contact.id);
    let updated: EmergencyContact[];
    if (idx >= 0) {
      updated = [...current];
      updated[idx] = contact;
    } else {
      updated = [contact, ...current];
    }
    localStorage.setItem(EMERGENCY_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('khairabad_emergency_contacts_updated'));
    return updated;
  } catch (err) {
    console.error('Failed to save emergency contact:', err);
    return EMERGENCY_CONTACTS;
  }
}

export function deleteEmergencyContact(id: string): EmergencyContact[] {
  if (typeof window === 'undefined') return EMERGENCY_CONTACTS;

  try {
    const current = getStoredEmergencyContacts();
    const updated = current.filter((c) => c.id !== id);
    localStorage.setItem(EMERGENCY_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('khairabad_emergency_contacts_updated'));
    return updated;
  } catch (err) {
    console.error('Failed to delete emergency contact:', err);
    return EMERGENCY_CONTACTS;
  }
}

export function resetEmergencyContactsToDefault(): EmergencyContact[] {
  if (typeof window === 'undefined') return EMERGENCY_CONTACTS;

  try {
    localStorage.setItem(EMERGENCY_STORAGE_KEY, JSON.stringify(EMERGENCY_CONTACTS));
    window.dispatchEvent(new CustomEvent('khairabad_emergency_contacts_updated'));
    return EMERGENCY_CONTACTS;
  } catch {
    return EMERGENCY_CONTACTS;
  }
}

// ==========================================
// 3. BLOGS & NEWS ARTICLES
// ==========================================

export function getStoredBlogs(): KhairabadBlog[] {
  if (typeof window === 'undefined') return KHAIRABAD_BLOGS;

  try {
    const raw = localStorage.getItem(BLOGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(BLOGS_STORAGE_KEY, JSON.stringify(KHAIRABAD_BLOGS));
      return KHAIRABAD_BLOGS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return KHAIRABAD_BLOGS;
  } catch {
    return KHAIRABAD_BLOGS;
  }
}

export function saveBlogArticle(blog: KhairabadBlog): KhairabadBlog[] {
  if (typeof window === 'undefined') return KHAIRABAD_BLOGS;

  try {
    const current = getStoredBlogs();
    const idx = current.findIndex((b) => b.id === blog.id);
    let updated: KhairabadBlog[];
    if (idx >= 0) {
      updated = [...current];
      updated[idx] = blog;
    } else {
      updated = [blog, ...current];
    }
    localStorage.setItem(BLOGS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('khairabad_blogs_updated'));
    return updated;
  } catch (err) {
    console.error('Failed to save blog:', err);
    return KHAIRABAD_BLOGS;
  }
}

export function deleteBlogArticle(id: string): KhairabadBlog[] {
  if (typeof window === 'undefined') return KHAIRABAD_BLOGS;

  try {
    const current = getStoredBlogs();
    const updated = current.filter((b) => b.id !== id);
    localStorage.setItem(BLOGS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('khairabad_blogs_updated'));
    return updated;
  } catch (err) {
    console.error('Failed to delete blog:', err);
    return KHAIRABAD_BLOGS;
  }
}

// ==========================================
// 4. TOWN CIVIC INFORMATION
// ==========================================

export function getStoredTownCivicInfo(): TownCivicInfo {
  if (typeof window === 'undefined') return DEFAULT_TOWN_CIVIC_INFO;

  try {
    const raw = localStorage.getItem(TOWN_INFO_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(TOWN_INFO_STORAGE_KEY, JSON.stringify(DEFAULT_TOWN_CIVIC_INFO));
      return DEFAULT_TOWN_CIVIC_INFO;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_TOWN_CIVIC_INFO;
  }
}

export function saveTownCivicInfo(info: TownCivicInfo): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(TOWN_INFO_STORAGE_KEY, JSON.stringify(info));
    window.dispatchEvent(new CustomEvent('khairabad_town_info_updated', { detail: info }));
  } catch (err) {
    console.error('Failed to save town info:', err);
  }
}

// ==========================================
// 5. MOHALLAS & MUNICIPAL WARDS STORAGE
// ==========================================

const MOHALLAS_STORAGE_KEY = 'khairabad_town_mohallas_v1';

export function getStoredMohallas(): TraditionalMohalla[] {
  if (typeof window === 'undefined') return TRADITIONAL_MOHALLAS;

  try {
    const raw = localStorage.getItem(MOHALLAS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(MOHALLAS_STORAGE_KEY, JSON.stringify(TRADITIONAL_MOHALLAS));
      return TRADITIONAL_MOHALLAS;
    }
    return JSON.parse(raw);
  } catch {
    return TRADITIONAL_MOHALLAS;
  }
}

export function saveStoredMohallas(mohallas: TraditionalMohalla[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(MOHALLAS_STORAGE_KEY, JSON.stringify(mohallas));
    window.dispatchEvent(new CustomEvent('khairabad_locations_updated', { detail: { type: 'mohallas' } }));
  } catch (err) {
    console.error('Failed to save mohallas:', err);
  }
}

export function saveOrUpdateMohalla(item: TraditionalMohalla): TraditionalMohalla[] {
  const current = getStoredMohallas();
  const idx = current.findIndex((m) => m.id === item.id);
  let updated: TraditionalMohalla[];
  if (idx >= 0) {
    updated = [...current];
    updated[idx] = item;
  } else {
    updated = [...current, item];
  }
  saveStoredMohallas(updated);
  return updated;
}

export function deleteMohalla(id: string): TraditionalMohalla[] {
  const current = getStoredMohallas();
  const updated = current.filter((m) => m.id !== id);
  saveStoredMohallas(updated);
  return updated;
}

export function resetMohallasToDefault(): TraditionalMohalla[] {
  saveStoredMohallas(TRADITIONAL_MOHALLAS);
  return TRADITIONAL_MOHALLAS;
}

// ==========================================
// 6. MARKETS & BAZAARS STORAGE
// ==========================================

const MARKETS_STORAGE_KEY = 'khairabad_town_markets_v1';

export function getStoredMarkets(): TownMarketItem[] {
  if (typeof window === 'undefined') return DEFAULT_TOWN_MARKETS;

  try {
    const raw = localStorage.getItem(MARKETS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(MARKETS_STORAGE_KEY, JSON.stringify(DEFAULT_TOWN_MARKETS));
      return DEFAULT_TOWN_MARKETS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_TOWN_MARKETS;
  }
}

export function saveStoredMarkets(markets: TownMarketItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(MARKETS_STORAGE_KEY, JSON.stringify(markets));
    window.dispatchEvent(new CustomEvent('khairabad_locations_updated', { detail: { type: 'markets' } }));
  } catch (err) {
    console.error('Failed to save markets:', err);
  }
}

export function saveOrUpdateMarket(item: TownMarketItem): TownMarketItem[] {
  const current = getStoredMarkets();
  const idx = current.findIndex((m) => m.id === item.id);
  let updated: TownMarketItem[];
  if (idx >= 0) {
    updated = [...current];
    updated[idx] = item;
  } else {
    updated = [item, ...current];
  }
  saveStoredMarkets(updated);
  return updated;
}

export function deleteMarket(id: string): TownMarketItem[] {
  const current = getStoredMarkets();
  const updated = current.filter((m) => m.id !== id);
  saveStoredMarkets(updated);
  return updated;
}

export function resetMarketsToDefault(): TownMarketItem[] {
  saveStoredMarkets(DEFAULT_TOWN_MARKETS);
  return DEFAULT_TOWN_MARKETS;
}

// ==========================================
// 7. LANDMARK CHAURAHAS STORAGE
// ==========================================

const CHAURAHAS_STORAGE_KEY = 'khairabad_town_chaurahas_v1';

export function getStoredChaurahas(): ChaurahaHub[] {
  if (typeof window === 'undefined') return CHAURAHA_HUBS;

  try {
    const raw = localStorage.getItem(CHAURAHAS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CHAURAHAS_STORAGE_KEY, JSON.stringify(CHAURAHA_HUBS));
      return CHAURAHA_HUBS;
    }
    return JSON.parse(raw);
  } catch {
    return CHAURAHA_HUBS;
  }
}

export function saveStoredChaurahas(chaurahas: ChaurahaHub[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CHAURAHAS_STORAGE_KEY, JSON.stringify(chaurahas));
    window.dispatchEvent(new CustomEvent('khairabad_locations_updated', { detail: { type: 'chaurahas' } }));
  } catch (err) {
    console.error('Failed to save chaurahas:', err);
  }
}

export function saveOrUpdateChauraha(item: ChaurahaHub): ChaurahaHub[] {
  const current = getStoredChaurahas();
  const idx = current.findIndex((c) => c.id === item.id);
  let updated: ChaurahaHub[];
  if (idx >= 0) {
    updated = [...current];
    updated[idx] = item;
  } else {
    updated = [...current, item];
  }
  saveStoredChaurahas(updated);
  return updated;
}

export function deleteChauraha(id: string): ChaurahaHub[] {
  const current = getStoredChaurahas();
  const updated = current.filter((c) => c.id !== id);
  saveStoredChaurahas(updated);
  return updated;
}

export function resetChaurahasToDefault(): ChaurahaHub[] {
  saveStoredChaurahas(CHAURAHA_HUBS);
  return CHAURAHA_HUBS;
}

// ==========================================
// 8. ROADS & ARTERIES STORAGE
// ==========================================

const ROADS_STORAGE_KEY = 'khairabad_town_roads_v1';

export function getStoredRoads(): RoadConnectivityItem[] {
  if (typeof window === 'undefined') return MAIN_ROADS_CONNECTIVITY;

  try {
    const raw = localStorage.getItem(ROADS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ROADS_STORAGE_KEY, JSON.stringify(MAIN_ROADS_CONNECTIVITY));
      return MAIN_ROADS_CONNECTIVITY;
    }
    return JSON.parse(raw);
  } catch {
    return MAIN_ROADS_CONNECTIVITY;
  }
}

export function saveStoredRoads(roads: RoadConnectivityItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ROADS_STORAGE_KEY, JSON.stringify(roads));
    window.dispatchEvent(new CustomEvent('khairabad_locations_updated', { detail: { type: 'roads' } }));
  } catch (err) {
    console.error('Failed to save roads:', err);
  }
}

export function saveOrUpdateRoad(item: RoadConnectivityItem): RoadConnectivityItem[] {
  const current = getStoredRoads();
  const idx = current.findIndex((r) => r.id === item.id);
  let updated: RoadConnectivityItem[];
  if (idx >= 0) {
    updated = [...current];
    updated[idx] = item;
  } else {
    updated = [...current, item];
  }
  saveStoredRoads(updated);
  return updated;
}

export function deleteRoad(id: string): RoadConnectivityItem[] {
  const current = getStoredRoads();
  const updated = current.filter((r) => r.id !== id);
  saveStoredRoads(updated);
  return updated;
}

export function resetRoadsToDefault(): RoadConnectivityItem[] {
  saveStoredRoads(MAIN_ROADS_CONNECTIVITY);
  return MAIN_ROADS_CONNECTIVITY;
}

