import React from 'react';
import { Plus, Code2, AlertTriangle } from 'lucide-react';
import { KhairabadLogo } from './KhairabadLogo';

interface HeaderProps {
  onOpenAddModal: () => void;
  onOpenBloggerModal: () => void;
  onOpenEmergency: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddModal,
  onOpenBloggerModal,
  onOpenEmergency,
  activeView,
  setActiveView,
}) => {
  return (
    <>
      {/* Top 24/7 Helpline Ribbon */}
      <aside aria-label="Emergency helpline ticker" className="bg-slate-900 text-white text-xs py-2 px-4 border-b border-slate-800">
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
            <div className="hidden xl:block border-l-2 border-slate-200 pl-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900 block leading-tight">
                Town Directory
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
              onClick={() => setActiveView('blog')}
              className={`hover:text-amber-700 transition-colors ${activeView === 'blog' ? 'text-slate-950 font-bold border-b-2 border-amber-500 pb-0.5' : ''}`}
            >
              Place Blogs
            </button>
            <button
              onClick={() => setActiveView('about')}
              className={`hover:text-amber-700 transition-colors ${activeView === 'about' ? 'text-slate-950 font-bold border-b-2 border-amber-500 pb-0.5' : ''}`}
            >
              About Khairabad
            </button>
            <button
              onClick={onOpenBloggerModal}
              className="flex items-center gap-1.5 text-slate-800 hover:text-slate-950 bg-amber-50 hover:bg-amber-100/80 border border-amber-300 px-2.5 py-1 rounded-lg font-semibold text-xs transition-colors"
            >
              <Code2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Blogger Export Kit</span>
            </button>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenBloggerModal}
              className="md:hidden p-2 text-slate-900 bg-amber-50 hover:bg-amber-100 rounded-lg text-xs font-semibold flex items-center gap-1 border border-amber-300"
              title="Blogger XML Theme & Code"
            >
              <Code2 className="w-4 h-4 text-amber-600" />
              <span className="hidden xs:inline">Blogger Kit</span>
            </button>
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
