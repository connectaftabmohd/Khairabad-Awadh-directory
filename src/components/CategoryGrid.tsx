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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {filteredCategories.map((cat) => {
          const IconComp = ICON_MAP[cat.icon] || Building2;
          const isSelected = selectedCategory === cat.id;
          const count = getCategoryCount(cat.id);

          return (
            <div
              key={cat.id}
              className={`rounded-xl border transition-all flex flex-col justify-between p-3 relative group ${
                isSelected
                  ? 'bg-slate-950 text-white border-slate-950 shadow-md ring-2 ring-amber-400'
                  : 'bg-white hover:bg-amber-50/40 border-slate-200 text-slate-900 hover:border-amber-400'
              }`}
            >
              <button
                onClick={() => onSelectCategory(isSelected ? 'all' : cat.id)}
                className="text-left w-full flex-1"
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 transition-colors ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-amber-50 text-amber-800 group-hover:bg-amber-100'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                </div>
                <div
                  className={`text-xs font-bold leading-tight line-clamp-1 ${
                    isSelected ? 'text-white' : 'text-slate-900 group-hover:text-amber-800'
                  }`}
                >
                  {cat.label}
                </div>
                <div
                  className={`text-[10px] mt-0.5 ${
                    isSelected ? 'text-amber-300 font-medium' : 'text-slate-500'
                  }`}
                >
                  {count} {count === 1 ? 'listing' : 'listings'}
                </div>
              </button>

              {/* Quick Add Shortcut for this category */}
              {onOpenAddModalWithCategory && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenAddModalWithCategory(cat.id);
                  }}
                  title={`Add a business to ${cat.label}`}
                  className={`mt-2 pt-1 border-t text-[10px] font-semibold flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'border-white/20 text-amber-200 hover:text-white'
                      : 'border-slate-100 text-slate-500 hover:text-amber-800'
                  }`}
                >
                  <span>+ Add</span>
                  <Plus className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
