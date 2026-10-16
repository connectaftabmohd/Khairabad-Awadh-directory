import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  ShieldAlert,
  X,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Camera,
} from 'lucide-react';
import { CategoryId } from '../types/directory';
import { WeatherWidget } from './WeatherWidget';

export interface FamousPlaceSlide {
  id: string;
  name: string;
  tagline: string;
  landmark: string;
  image: string;
  category?: CategoryId;
}

export const KHAIRABAD_FAMOUS_PLACES: FamousPlaceSlide[] = [
  {
    id: 'badi-sangat',
    name: 'Historic Badi Sangat Mandir',
    tagline: '17th-Century Akbar Era Temple Complex & Sacred Kund',
    landmark: 'Badi Sangat Road',
    image: '/images/khairabad_badi_sangat_1791046924123.jpg',
    category: 'religious',
  },
  {
    id: 'qadam-rasul-dargah',
    name: 'Dargah Hazrat Makhdoom Shah & Qadam Rasul',
    tagline: '15th-Century Chishti Sufi Beacon & Mughal Monument',
    landmark: 'Qadam Rasul Road',
    image: '/images/khairabad_hero_banner_1791046903675.jpg',
    category: 'religious',
  },
  {
    id: 'main-bazaar',
    name: 'Khairabad Main Bazaar & Historic Chowk',
    tagline: 'Centuries-Old Merchant Quarters & Awadhi Retail Market',
    landmark: 'Nai Bazar / Main Market',
    image: '/images/khairabad_market_street_1791046938937.jpg',
    category: 'markets',
  },
  {
    id: 'babbu-hotel',
    name: 'Babbu Hotel & Chilla Sarain Chauraha',
    tagline: 'Famous Kulhad Chai & Historic Neighborhood Junction',
    landmark: 'Chilla Sarain Chauraha',
    image: '/images/babbu_hotel_khairabad_1791570399551.jpg',
    category: 'restaurants',
  },
  {
    id: 'marriage-lawn',
    name: 'Royal Awadh Marriage Lawns & Banquets',
    tagline: 'Grand Celebration Lawns & Awadhi Architecture',
    landmark: 'Sitapur Bypass Road',
    image: '/images/khairabad_marriage_lawn_1791567699343.jpg',
    category: 'marriage-lawns',
  },
  {
    id: 'chc-hospital',
    name: 'Community Health Centre (CHC) Khairabad',
    tagline: 'Public Healthcare Landmark & 24x7 Emergency Services',
    landmark: 'Civil Lines, Khairabad',
    image: '/images/khairabad_hospital_chc_1791567719143.jpg',
    category: 'hospitals',
  },
];

const EXPLORE_EFFECTS = [
  { id: '', name: 'Prismatic Diamond Glint' },
  { id: 'effect-aurora', name: 'Aurora Borealis' },
  { id: 'effect-fire', name: 'Solar Flame' },
  { id: 'effect-neon', name: 'Cyber Neon' },
  { id: 'effect-gold', name: 'Royal Gold' },
];

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectCategory: (cat: CategoryId) => void;
  onOpenEmergency: () => void;
  onScrollToDirectory: () => void;
  onOpenWeather?: () => void;
  onOpenRoads?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  onSelectCategory,
  onOpenEmergency,
  onScrollToDirectory,
  onOpenWeather,
  onOpenRoads,
}) => {
  const [effectIdx, setEffectIdx] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Background Slider Auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % KHAIRABAD_FAMOUS_PLACES.length);
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % KHAIRABAD_FAMOUS_PLACES.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + KHAIRABAD_FAMOUS_PLACES.length) % KHAIRABAD_FAMOUS_PLACES.length);
  };

  const cycleEffect = () => {
    setEffectIdx((prev) => (prev + 1) % EXPLORE_EFFECTS.length);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2400);
  };

  return (
    <section className="relative bg-slate-950 text-white min-h-[480px] flex items-center justify-center px-4 sm:px-6 py-16 overflow-hidden">
      {/* Background Image Slider with Ken Burns & Smooth Cross-Fade */}
      <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none">
        {KHAIRABAD_FAMOUS_PLACES.map((place, idx) => (
          <img
            key={place.id}
            src={place.image}
            alt={`${place.name} - ${place.landmark}`}
            referrerPolicy="no-referrer"
            className={`absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.38] contrast-105 transition-all duration-1000 ease-in-out ${
              idx === currentSlide
                ? 'opacity-100 scale-105 animate-hero-kenburns z-0'
                : 'opacity-0 scale-100 pointer-events-none -z-10'
            }`}
          />
        ))}
        {/* Measured Scrim Gradient Overlay for Superior Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/75 to-slate-950/45 z-0" />
      </div>

      {/* Slider Left Arrow Control */}
      <button
        type="button"
        onClick={handlePrevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full bg-slate-950/50 hover:bg-slate-900/90 text-white/70 hover:text-white border border-white/10 hover:border-amber-400/50 backdrop-blur-md transition-all shadow-lg hover:scale-110 cursor-pointer hidden sm:flex items-center justify-center"
        aria-label="Previous Khairabad place"
        title="Previous Khairabad landmark"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Slider Right Arrow Control */}
      <button
        type="button"
        onClick={handleNextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full bg-slate-950/50 hover:bg-slate-900/90 text-white/70 hover:text-white border border-white/10 hover:border-amber-400/50 backdrop-blur-md transition-all shadow-lg hover:scale-110 cursor-pointer hidden sm:flex items-center justify-center"
        aria-label="Next Khairabad place"
        title="Next Khairabad landmark"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      <div className="relative z-10 max-w-4xl mx-auto text-center w-full">
        {/* Anti-slop clean kicker with live Sitapur/Khairabad weather badge */}
        <div className="flex items-center justify-center gap-2.5 flex-wrap mb-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/25 px-3 py-1 rounded-full">
            <MapPin className="w-3.5 h-3.5" />
            <span>Khairabad · Sitapur District · PIN 261131</span>
          </div>
          {onOpenWeather ? (
            <button
              onClick={onOpenWeather}
              className="hover:scale-105 transition-transform cursor-pointer"
              title="Open full 7-day Khairabad weather forecast"
            >
              <WeatherWidget compact />
            </button>
          ) : (
            <WeatherWidget compact />
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-display mb-4 leading-tight text-white [text-wrap:balance] relative">
          <span
            onClick={cycleEffect}
            title={`Effect: ${EXPLORE_EFFECTS[effectIdx].name}. Click to switch effect!`}
            className={`animate-explore-word ${EXPLORE_EFFECTS[effectIdx].id} inline-block mr-2.5 transition-all duration-300`}
          >
            Explore
          </span>
          <span>Khairabad</span>
          {showToast && (
            <span className="block mt-2 text-xs font-normal text-amber-300/90 tracking-normal font-sans animate-fade-in">
              <span className="inline-flex items-center gap-1 bg-slate-900/90 border border-amber-400/40 px-2.5 py-0.5 rounded-full shadow-lg">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Effect: {EXPLORE_EFFECTS[effectIdx].name}
              </span>
            </span>
          )}
        </h1>

        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-5 leading-relaxed [text-wrap:balance]">
          Find local businesses, emergency services, hospitals, marriage lawns, schools, and historic heritage places — all in one community guide.
        </p>

        {/* Famous Place Background Slider Badge with Shortcut to Directory */}
        <div className="flex items-center justify-center mb-6">
          {/* Active Place Tag Button with Shortcut to Directory */}
          <button
            type="button"
            onClick={() => {
              if (KHAIRABAD_FAMOUS_PLACES[currentSlide].category) {
                onSelectCategory(KHAIRABAD_FAMOUS_PLACES[currentSlide].category!);
              }
              onSearchChange(KHAIRABAD_FAMOUS_PLACES[currentSlide].name);
              onScrollToDirectory();
            }}
            className="inline-flex items-center gap-2 bg-slate-900/85 hover:bg-slate-900 backdrop-blur-md border border-amber-400/40 hover:border-amber-400 px-3.5 py-1.5 rounded-full shadow-lg text-xs transition-all hover:scale-[1.02] cursor-pointer group"
            title={`Click to find ${KHAIRABAD_FAMOUS_PLACES[currentSlide].name} in directory`}
          >
            <Camera className="w-3.5 h-3.5 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-amber-300">
              {KHAIRABAD_FAMOUS_PLACES[currentSlide].name}
            </span>
            <span className="text-slate-500 hidden sm:inline">·</span>
            <span className="text-slate-300 text-[11px] hidden sm:inline">
              {KHAIRABAD_FAMOUS_PLACES[currentSlide].landmark}
            </span>
            <span className="bg-amber-400/20 text-amber-300 text-[10px] font-black px-1.5 py-0.5 rounded ml-1">
              {currentSlide + 1} / {KHAIRABAD_FAMOUS_PLACES.length}
            </span>
          </button>
        </div>

        {/* Primary Search Container */}
        <div className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto text-slate-900">
          <div className="flex-1 flex items-center px-3.5 min-h-[48px]">
            <Search className="w-5 h-5 text-slate-400 mr-2.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search hospitals, marriage lawns, doctors, shops in Khairabad..."
              className="w-full text-sm outline-none text-slate-900 placeholder-slate-400 bg-transparent font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="text-slate-400 hover:text-slate-600 p-1"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={onScrollToDirectory}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm px-7 py-3 rounded-xl transition-all shadow-md shrink-0 whitespace-nowrap active:scale-[0.98] border border-amber-500"
          >
            Find Places
          </button>
        </div>

        {/* Action Shortcuts */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <button
            onClick={onScrollToDirectory}
            className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors"
          >
            Explore All Listings
          </button>
          <button
            onClick={() => {
              onSelectCategory('hospitals');
              onScrollToDirectory();
            }}
            className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors"
          >
            🏥 Hospitals & CHC
          </button>
          <button
            onClick={() => {
              onSelectCategory('marriage-lawns');
              onScrollToDirectory();
            }}
            className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors"
          >
            💒 Marriage Lawns
          </button>
          <button
            onClick={onOpenRoads}
            className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 transition-colors flex items-center gap-1.5"
          >
            <span>🛣️ Roads & Connectivity</span>
          </button>
          <button
            onClick={onOpenEmergency}
            className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white border border-red-500/30 transition-colors flex items-center gap-1.5"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Emergency Helplines</span>
          </button>
        </div>
      </div>
    </section>
  );
};
