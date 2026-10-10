import React from 'react';
import { Plus, AlertTriangle, Heart } from 'lucide-react';
import { KhairabadLogo } from './KhairabadLogo';

interface HeaderProps {
  onOpenAddModal: () => void;
  onOpenBloggerModal?: () => void;
  onOpenEmergency: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
  favoritesCount?: number;
  onOpenFavorites?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddModal,
  onOpenBloggerModal,
  onOpenEmergency,
  activeView,
  setActiveView,
  favoritesCount = 0,
  onOpenFavorites,
}) => {
  return (
    <>
      {/* Top 24/7 Helpline Ribbon */}
      <aside aria-label="Emergency helpline ticker" className="hidden md:block bg-slate-900 text-white text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-semibold text-red-400 uppercase tracking-wider text-[11px]">Emergency:</span>
            <a href="tel:112" className="text-slate-200 hover:text-amber-400 font-bold underline">Police 112</a>
            <span className="text-slate-600">·</span>
            <a href="tel:108" className="text-slate-200 hover:text-amber-400 font-bold underline">Ambulance 108</a>
            <span className="text-slate-600">·</span>
            <a href="tel:1090" className="text-slate-200 hover:text-amber-400 font-bold underline">Women 1090</a>
            <span className="text-slate-600">·</span>
            <a href="tel:05862252100" className="text-slate-200 hover:text-amber-400 font-bold underline">CHC Khairabad (05862-252100)</a>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-slate-400 text-[11px]">
            <span>PIN: 261131</span>
            <span>·</span>
            <span>Sitapur District, UP</span>
            <button
              onClick={onOpenEmergency}
              className="text-amber-400 hover:text-amber-300 font-medium underline ml-2"
            >
              All Helplines &rarr;
            </button>
          </div>
        </div>
      </aside>

      {/* Top Bar Contract: Zone 1 Wordmark, Zone 2 Clean Nav Links, Zone 3 Actions */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-[72px] flex items-center justify-between gap-3 sm:gap-4">
          {/* Zone 1: Station Board Brand Identity */}
          <button
            onClick={() => setActiveView('directory')}
            className="flex items-center gap-2.5 sm:gap-3 text-left group hover:opacity-95 transition-opacity shrink-0 py-1"
            title="ख़ैराबाद (अवध) / KHAIRABAD (AVADH) / خیر آباد (اودھ)"
          >
            <KhairabadLogo size="md" />
            <div className="hidden sm:block border-l-2 border-amber-400 pl-3">
              <span className="text-[23px] leading-tight font-black tracking-tight font-display bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 bg-clip-text text-transparent block drop-shadow-2xs">
                Khairabad Directory
              </span>
              <span className="text-[10px] text-slate-500 font-medium block leading-tight">
                Sitapur · PIN 261131
              </span>
            </div>
          </button>

          {/* Zone 2: Clean Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveView('directory')}
              className={`hover:text-amber-700 transition-colors ${activeView === 'directory' ? 'text-slate-950 font-bold border-b-2 border-amber-500 pb-0.5' : ''}`}
            >
              Directory
            </button>
            <button
              onClick={() => {
                setActiveView('directory');
                setTimeout(() => {
                  const el = document.getElementById('roads-connectivity-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }}
              className="hover:text-amber-700 transition-colors"
            >
              Roads & Transit
            </button>
            <button
              onClick={() => setActiveView('blog')}
              className={`hover:text-amber-700 transition-colors ${activeView === 'blog' ? 'text-slate-950 font-bold border-b-2 border-amber-500 pb-0.5' : ''}`}
            >
              Blog and News
            </button>
            <button
              onClick={() => setActiveView('weather')}
              className={`hover:text-amber-700 transition-colors ${activeView === 'weather' ? 'text-slate-950 font-bold border-b-2 border-amber-500 pb-0.5' : ''}`}
            >
              Weather
            </button>
            <button
              onClick={() => setActiveView('about')}
              className={`hover:text-amber-700 transition-colors ${activeView === 'about' ? 'text-slate-950 font-bold border-b-2 border-amber-500 pb-0.5' : ''}`}
            >
              About Khairabad
            </button>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2">
            {onOpenFavorites && (
              <button
                onClick={onOpenFavorites}
                className="relative flex items-center gap-1.5 text-slate-700 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-300 hover:border-rose-300 px-3 py-2 rounded-lg font-bold text-xs transition-colors shadow-2xs"
                title="View Saved Favorites"
              >
                <Heart className={`w-3.5 h-3.5 ${favoritesCount > 0 ? 'fill-rose-500 text-rose-500' : 'text-slate-500'}`} />
                <span className="hidden sm:inline">Saved</span>
                {favoritesCount > 0 && (
                  <span className="bg-rose-600 text-white text-[10px] font-black px-1.5 rounded-full min-w-[17px] text-center leading-tight flex items-center justify-center h-4">
                    {favoritesCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={onOpenAddModal}
              className="px-3.5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 border border-amber-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add Business</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
