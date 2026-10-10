export type CategoryId =
  | 'all'
  | 'hospitals'
  | 'clinics'
  | 'doctors'
  | 'pharmacies'
  | 'restaurants'
  | 'marriage-lawns'
  | 'hotels'
  | 'schools'
  | 'colleges'
  | 'coaching'
  | 'banks'
  | 'atms'
  | 'government'
  | 'police'
  | 'post-office'
  | 'petrol-pumps'
  | 'auto-services'
  | 'mobile-shops'
  | 'cyber-cafes'
  | 'salons'
  | 'gyms'
  | 'photographers'
  | 'lawyers'
  | 'real-estate'
  | 'religious'
  | 'transport'
  | 'markets'
  | 'event-services';

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  icon: string;
  description: string;
  badgeColor?: string;
}

export interface CityListing {
  id: string;
  name: string;
  category: CategoryId;
  subcategory: string;
  address: string;
  locality: string;
  phone: string;
  whatsapp: string;
  website?: string;
  openingHours: string;
  description: string;
  services: string[];
  priceRange?: string;
  rating?: string;
  reviews?: number;
  images: string[];
  googleMapsUrl: string;
  verified: boolean;
  isDemo: boolean;
  featured?: boolean;
  establishedYear?: string;
  // Specific category extensions
  emergencyAvailable?: boolean;
  capacity?: string; // for marriage lawn
  facilities?: string[];
  foodType?: 'Pure Veg' | 'Veg / Non-Veg' | 'Veg' | 'Non-Veg';
  // Roads, Connectivity & Mohalla tagging
  roadName?: string;
  mohalla?: string;
  chaurahaHub?: string;
}

export interface EmergencyContact {
  id: string;
  title: string;
  hindiTitle?: string;
  number: string;
  description: string;
  type: 'national' | 'state' | 'local';
  timing: string;
  category: 'police' | 'health' | 'fire' | 'women' | 'child' | 'civic';
}

export interface LocalityArea {
  id: string;
  name: string;
  landmark: string;
}

export interface Review {
  id: string;
  listingId: string;
  authorName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  locality?: string;
  helpfulCount: number;
  verifiedVisit?: boolean;
}

export interface ReviewFormData {
  authorName: string;
  rating: number;
  comment: string;
  locality?: string;
}
