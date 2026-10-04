import React from 'react';
import { Search, MapPin, ShieldAlert, X } from 'lucide-react';
import { CategoryId } from '../types/directory';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectCategory: (cat: CategoryId) => void;
  onOpenEmergency: () => void;
  onScrollToDirectory: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  onSelectCategory,
  onOpenEmergency,
  onScrollToDirectory,
}) => {
  return (
    <section className="relative bg-slate-950 text-white min-h-[460px] flex items-center justify-center px-4 sm:px-6 py-16 overflow-hidden">
      {/* Background Image with Fallback and Measured Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/khairabad_hero_banner_1791046903675.jpg"
          alt="Historic Awadh architecture in Khairabad, Uttar Pradesh"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-slate-950/40" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center w-full">
        {/* Anti-slop clean kicker */}
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/25 px-3 py-1 rounded-full mb-4">
          <MapPin className="w-3.5 h-3.5" />
          <span>Khairabad · Sitapur District · PIN 261131</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-display mb-4 leading-tight text-white [text-wrap:balance]">
          Explore Khairabad, Uttar Pradesh
        </h1>

        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed [text-wrap:balance]">
          Find local businesses, emergency services, hospitals, marriage lawns, schools, and historic heritage places — all in one community guide.
        </p>

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
