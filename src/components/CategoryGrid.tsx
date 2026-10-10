import React, { useState } from 'react';
import {
  HeartPulse,
  Stethoscope,
  UserCheck,
  Pill,
  Utensils,
  Hotel,
  PartyPopper,
  Sparkles,
  GraduationCap,
  BookOpen,
  Award,
  Landmark,
  CreditCard,
  Building2,
  Shield,
  Mail,
  Fuel,
  Wrench,
  Bus,
  ShoppingBag,
  Smartphone,
  Monitor,
  Scissors,
  Dumbbell,
  Camera,
  Scale,
  Home,
  Compass,
  Search,
  Plus,
  LucideIcon,
} from 'lucide-react';
import { CATEGORIES } from '../data/khairabadData';
import { CategoryId, CityListing } from '../types/directory';

interface CategoryGridProps {
  selectedCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
  listings: CityListing[];
  onOpenAddModalWithCategory?: (cat: CategoryId) => void;
}

const ICON_MAP: Record<string, LucideIcon> = {
  HeartPulse,
  Stethoscope,
  UserCheck,
  Pill,
  Utensils,
  Hotel,
  PartyPopper,
  Sparkles,
  GraduationCap,
  BookOpen,
  Award,
  Landmark,
  CreditCard,
  Building2,
  Shield,
  Mail,
  Fuel,
  Wrench,
  Bus,
  ShoppingBag,
  Smartphone,
  Monitor,
  Scissors,
  Dumbbell,
  Camera,
  Scale,
  Home,
  Compass,
};

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  selectedCategory,
  onSelectCategory,
  listings,
  onOpenAddModalWithCategory,
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  const getCategoryCount = (id: CategoryId) => {
    return listings.filter((item) => item.category === id).length;
  };

  const filteredCategories = CATEGORIES.filter((c) =>
    c.label.toLowerCase().includes(filterQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <section className="py-8 px-4 sm:px-6 max-w-7xl mx-auto" id="all-categories">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-display text-slate-900">
              All Khairabad Directory Categories
            </h2>
            <span className="text-xs bg-amber-100 text-amber-950 border border-amber-300 font-bold px-2 py-0.5 rounded-full">
              {CATEGORIES.length} Categories
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Select a category to filter listings, or add a new place in Khairabad
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick search input within categories */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search category (e.g. Hotel, Lawyer, Gym)..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {selectedCategory !== 'all' && (
            <button
              onClick={() => onSelectCategory('all')}
              className="text-xs font-bold text-amber-800 hover:text-amber-950 underline whitespace-nowrap"
            >
              Show All
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {filteredCategories.map((cat) => {
          const IconComp = ICON_MAP[cat.icon] || Building2;
          const isSelected = selectedCategory === cat.id;
          const count = getCategoryCount(cat.id);

          return (
            <div
              key={cat.id}
              className={`rounded-2xl lg:rounded-3xl border transition-all duration-200 flex flex-col justify-between p-3.5 sm:p-4 lg:p-6 lg:min-h-[195px] relative group shadow-2xs hover:shadow-lg ${
                isSelected
                  ? 'bg-slate-950 text-white border-slate-950 shadow-md ring-2 ring-amber-400'
                  : 'bg-white hover:bg-amber-50/50 border-slate-200 text-slate-900 hover:border-amber-400 hover:-translate-y-1'
              }`}
            >
              <button
                onClick={() => onSelectCategory(isSelected ? 'all' : cat.id)}
                className="text-left w-full flex-1"
              >
                <div className="flex items-start justify-between gap-2 mb-3 lg:mb-4">
                  <div
                    className={`w-10 h-10 sm:w-11 sm:h-11 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 shadow-xs'
                        : 'bg-amber-50 text-amber-800 group-hover:bg-amber-100 group-hover:scale-105'
                    }`}
                  >
                    <IconComp className="w-5 h-5 sm:w-5 sm:h-5 lg:w-7 lg:h-7" />
                  </div>
                  <span
                    className={`text-[10px] sm:text-[11px] lg:text-xs font-bold px-2 py-0.5 lg:px-2.5 lg:py-1 rounded-full ${
                      isSelected
                        ? 'bg-white/10 text-amber-300 border border-white/20'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-amber-100 group-hover:text-amber-900'
                    }`}
                  >
                    {count} {count === 1 ? 'place' : 'places'}
                  </span>
                </div>

                <div
                  className={`text-sm sm:text-base lg:text-xl font-black leading-snug line-clamp-1 tracking-tight ${
                    isSelected ? 'text-white' : 'text-slate-900 group-hover:text-amber-800'
                  }`}
                >
                  {cat.label}
                </div>

                <p
                  className={`text-xs lg:text-sm mt-1.5 lg:mt-2 line-clamp-2 leading-relaxed hidden lg:block ${
                    isSelected ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {cat.description}
                </p>
              </button>

              {/* Quick Add Shortcut for this category */}
              {onOpenAddModalWithCategory && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenAddModalWithCategory(cat.id);
                  }}
                  title={`Add a business to ${cat.label}`}
                  className={`mt-3 lg:mt-4 pt-2.5 lg:pt-3.5 border-t text-xs lg:text-sm font-bold flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'border-white/20 text-amber-200 hover:text-white'
                      : 'border-slate-100 text-slate-500 hover:text-amber-800'
                  }`}
                >
                  <span>+ Add Business</span>
                  <Plus className="w-3.5 h-3.5 lg:w-4 lg:h-4 stroke-[2.5]" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
