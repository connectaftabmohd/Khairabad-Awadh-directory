import React from 'react';
import { Store, Heart, CloudSun, BookOpen, AlertTriangle, Info } from 'lucide-react';

interface MobileBottomNavProps {
  activeView: 'directory' | 'about' | 'blog' | 'weather' | 'privacy' | 'terms' | 'listing-detail';
  setActiveView: (view: 'directory' | 'about' | 'blog' | 'weather' | 'privacy' | 'terms') => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  onOpenEmergency: () => void;
  onOpenAddModal: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeView,
  setActiveView,
  favoritesCount,
  onOpenFavorites,
  onOpenEmergency,
  onOpenAddModal,
}) => {
  const handleNav = (view: 'directory' | 'weather' | 'blog' | 'about') => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] px-2 py-1.5 safe-area-pb"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {/* Tab 1: Directory / Explore */}
        <button
          onClick={() => handleNav('directory')}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all relative ${
            activeView === 'directory' || activeView === 'listing-detail'
              ? 'text-amber-800 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Directory Explore"
        >
          <div className="relative">
            <Store
              className={`w-5 h-5 transition-transform ${
                activeView === 'directory' || activeView === 'listing-detail'
                  ? 'text-amber-600 scale-110'
                  : 'text-slate-500'
              }`}
            />
            {(activeView === 'directory' || activeView === 'listing-detail') && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-500" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">Directory</span>
        </button>

        {/* Tab 2: Saved Favorites */}
        <button
          onClick={onOpenFavorites}
          className="flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all relative text-slate-500 hover:text-rose-600"
          aria-label="Saved Places"
        >
          <div className="relative">
            <Heart
              className={`w-5 h-5 transition-transform ${
                favoritesCount > 0 ? 'text-rose-500 fill-rose-500' : 'text-slate-500'
              }`}
            />
            {favoritesCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-600 text-white text-[9px] font-black rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center shadow-xs">
                {favoritesCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">Saved</span>
        </button>

        {/* Tab 3: Weather */}
        <button
          onClick={() => handleNav('weather')}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all relative ${
            activeView === 'weather'
              ? 'text-sky-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Live Weather"
        >
          <div className="relative">
            <CloudSun
              className={`w-5 h-5 transition-transform ${
                activeView === 'weather' ? 'text-sky-600 scale-110' : 'text-slate-500'
              }`}
            />
            {activeView === 'weather' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-sky-500" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">Weather</span>
        </button>

        {/* Tab 4: Heritage & Guides */}
        <button
          onClick={() => handleNav('blog')}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all relative ${
            activeView === 'blog'
              ? 'text-amber-800 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Heritage & Guides"
        >
          <div className="relative">
            <BookOpen
              className={`w-5 h-5 transition-transform ${
                activeView === 'blog' ? 'text-amber-600 scale-110' : 'text-slate-500'
              }`}
            />
            {activeView === 'blog' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-500" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">Guides</span>
        </button>

        {/* Tab 5: 24/7 Emergency Helplines */}
        <button
          onClick={onOpenEmergency}
          className="flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all relative text-red-600 hover:text-red-700"
          aria-label="24/7 Emergency Helplines"
        >
          <div className="relative">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <span className="text-[10px] font-semibold text-red-600 tracking-tight mt-1">Helplines</span>
        </button>
      </div>
    </nav>
  );
};
