import { createClient } from '@supabase/supabase-js';
import { CityListing } from '../types/directory';

// Supabase Project Credentials provided by user
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://vyyuvanyyexkdnjmhkdz.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_mSi_9KBgBGYASalNI18bnQ_cUqHj9Lc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Standard SQL to create the businesses table in Supabase SQL Editor:
 * 
 * create table if not exists public.businesses (
 *   id text primary key,
 *   name text not null,
 *   category text not null,
 *   subcategory text default 'Local Business',
 *   address text,
 *   locality text,
 *   mohalla text,
 *   chauraha_hub text,
 *   road_name text,
 *   phone text,
 *   whatsapp text,
 *   website text,
 *   opening_hours text,
 *   description text,
 *   services text[] default '{}',
 *   images text[] default '{}',
 *   google_maps_url text,
 *   verified boolean default false,
 *   is_demo boolean default false,
 *   created_at timestamp with time zone default timezone('utc'::text, now()) not null
 * );
 * 
 * -- Enable RLS
 * alter table public.businesses enable row level security;
 * 
 * -- Allow public select (anyone can view listings)
 * create policy "Public read access" on public.businesses
 *   for select using (true);
 * 
 * -- Allow public insert (anyone can add a business)
 * create policy "Public insert access" on public.businesses
 *   for insert with check (true);
 */

export interface SupabaseBusinessRow {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  address?: string;
  locality?: string;
  mohalla?: string;
  chauraha_hub?: string;
  road_name?: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  opening_hours?: string;
  description?: string;
  services?: string[];
  images?: string[];
  google_maps_url?: string;
  verified?: boolean;
  is_demo?: boolean;
  created_at?: string;
}

/**
 * Maps a CityListing domain object into the Supabase row structure.
 */
export function listingToSupabaseRow(listing: CityListing): SupabaseBusinessRow {
  return {
    id: listing.id,
    name: listing.name,
    category: listing.category,
    subcategory: listing.subcategory || 'Local Business',
    address: listing.address || '',
    locality: listing.locality || 'Sitapur Road',
    mohalla: listing.mohalla || '',
    chauraha_hub: listing.chaurahaHub || '',
    road_name: listing.roadName || '',
    phone: listing.phone || '',
    whatsapp: listing.whatsapp || '',
    website: listing.website || '',
    opening_hours: listing.openingHours || '',
    description: listing.description || '',
    services: listing.services || [],
    images: listing.images || [],
    google_maps_url: listing.googleMapsUrl || '',
    verified: listing.verified || false,
    is_demo: listing.isDemo || false,
  };
}

/**
 * Maps a Supabase row back into a CityListing domain object.
 */
export function supabaseRowToListing(row: SupabaseBusinessRow): CityListing {
  return {
    id: row.id,
    name: row.name,
    category: row.category as CityListing['category'],
    subcategory: row.subcategory || 'Local Business',
    address: row.address || 'Khairabad, UP',
    locality: row.locality || 'Sitapur Road',
    mohalla: row.mohalla || undefined,
    chaurahaHub: row.chauraha_hub || undefined,
    roadName: row.road_name || undefined,
    phone: row.phone || '',
    whatsapp: row.whatsapp || '',
    website: row.website || undefined,
    openingHours: row.opening_hours || '9:00 AM – 8:00 PM',
    description: row.description || '',
    services: Array.isArray(row.services) && row.services.length > 0 ? row.services : ['Local Service'],
    images: Array.isArray(row.images) ? row.images : [],
    googleMapsUrl: row.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${row.name} Khairabad`)}`,
    verified: Boolean(row.verified),
    isDemo: Boolean(row.is_demo),
  };
}

/**
 * Insert or update a business in Supabase.
 */
export async function syncListingToSupabase(listing: CityListing): Promise<{ success: boolean; error?: string }> {
  try {
    const row = listingToSupabaseRow(listing);
    const { error } = await supabase
      .from('businesses')
      .upsert(row, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase insert note:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn('Supabase sync error:', msg);
    return { success: false, error: msg };
  }
}

/**
 * Fetch all businesses stored in Supabase.
 */
export async function fetchListingsFromSupabase(): Promise<CityListing[]> {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      // Table may not exist yet or connection issue
      console.info('Supabase fetch note:', error.message);
      return [];
    }

    if (!Array.isArray(data)) return [];

    return data.map((item) => supabaseRowToListing(item as SupabaseBusinessRow));
  } catch (err) {
    console.warn('Supabase fetch error:', err);
    return [];
  }
}

/**
 * Checks connection status to Supabase.
 */
export async function testSupabaseConnection(): Promise<{ connected: boolean; tableReady: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.from('businesses').select('id').limit(1);
    if (!error) {
      return { connected: true, tableReady: true };
    }
    // If error is PGRST205 (table doesn't exist yet in public schema), the project connection is valid
    if (error.code === 'PGRST205' || error.message.includes('schema cache') || error.message.includes('businesses')) {
      return {
        connected: true,
        tableReady: false,
        error: "Table 'businesses' not found in your Supabase database. Please create it or click 'Copy SQL Schema' to run in Supabase SQL Editor."
      };
    }
    return { connected: false, tableReady: false, error: error.message };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { connected: false, tableReady: false, error: msg };
  }
}

export const SUPABASE_SQL_SETUP_SCRIPT = `-- ====================================================
-- Khairabad Directory - Supabase Database Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/vyyuvanyyexkdnjmhkdz/sql)
-- ====================================================

create table if not exists public.businesses (
  id text primary key,
  name text not null,
  category text not null,
  subcategory text default 'Local Business',
  address text,
  locality text,
  mohalla text,
  chauraha_hub text,
  road_name text,
  phone text,
  whatsapp text,
  website text,
  opening_hours text,
  description text,
  services text[] default '{}',
  images text[] default '{}',
  google_maps_url text,
  verified boolean default false,
  is_demo boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.businesses enable row level security;

-- Allow public read access (everyone can view listings)
drop policy if exists "Public read businesses" on public.businesses;
create policy "Public read businesses" on public.businesses
  for select using (true);

-- Allow public insert access (anyone can add business details)
drop policy if exists "Public insert businesses" on public.businesses;
create policy "Public insert businesses" on public.businesses
  for insert with check (true);

-- Allow updates if needed
drop policy if exists "Public update businesses" on public.businesses;
create policy "Public update businesses" on public.businesses
  for update using (true);
`;
