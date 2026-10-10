import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { CategoryId } from '../types/directory';
import { KhairabadLogo } from './KhairabadLogo';

interface FooterProps {
  onSelectCategory: (cat: CategoryId) => void;
  onOpenAddModal: () => void;
  onOpenBloggerModal?: () => void;
  onOpenEmergency: () => void;
  setActiveView: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenAddModal,
  onOpenBloggerModal,
  onOpenEmergency,
  setActiveView,
}) => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 border-t-4 border-amber-500 text-xs mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        {/* Brand Column */}
        <div className="space-y-3">
          <div className="flex items-center gap-3.5">
            <KhairabadLogo className="!w-40 !h-[90px]" />
            <div className="border-l border-slate-700 pl-3">
              <span className="text-white font-bold font-display text-sm block">
                Khairabad Directory
              </span>
              <span className="text-[10px] text-slate-400 block">
                Sitapur · PIN 261131
              </span>
            </div>
          </div>
          <p className="text-slate-400 leading-relaxed text-xs">
            The comprehensive digital directory and citizen portal for Khairabad, Sitapur district, Uttar Pradesh 261131.
          </p>
          <div className="p-2.5 bg-slate-800/80 rounded-lg text-[11px] text-slate-400 border border-slate-700/50">
            <strong>Disclaimer:</strong> This is a public community information resource. Listings, phone numbers, and timings should be verified directly with providers. Not an official agency of the Government of Uttar Pradesh.
          </div>
        </div>

        {/* Directory Categories */}
        <div className="space-y-2.5">
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider">
            Popular Categories
          </h4>
          <ul className="space-y-1.5 text-slate-400">
            <li>
              <button
                onClick={() => {
                  setActiveView('directory');
                  onSelectCategory('hospitals');
                }}
                className="hover:text-white transition-colors"
              >
                Hospitals &amp; Healthcare
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveView('directory');
                  onSelectCategory('marriage-lawns');
                }}
                className="hover:text-white transition-colors"
              >
                Marriage Lawns &amp; Banquets
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveView('directory');
                  onSelectCategory('restaurants');
                }}
                className="hover:text-white transition-colors"
              >
                Restaurants &amp; Sweets
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveView('directory');
                  onSelectCategory('schools');
                }}
                className="hover:text-white transition-colors"
              >
                Schools &amp; Inter Colleges
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveView('directory');
                  onSelectCategory('religious');
                }}
                className="hover:text-white transition-colors"
              >
                Badi Sangat &amp; Heritage Sites
              </button>
            </li>
          </ul>
        </div>

        {/* Useful Pages & Tools */}
        <div className="space-y-2.5">
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider">
            Explore &amp; Deploy
          </h4>
          <ul className="space-y-1.5 text-slate-400">
            <li>
              <button
                onClick={() => setActiveView('blog')}
                className="hover:text-white transition-colors text-amber-300 font-medium"
              >
                Place Information Blogs (20)
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveView('roads');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-white transition-colors text-amber-300 font-medium"
              >
                🛣️ Main Roads &amp; Connectivity Guide
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveView('about')}
                className="hover:text-white transition-colors"
              >
                History &amp; Geography of Khairabad
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveView('weather')}
                className="hover:text-white transition-colors text-sky-400 font-medium"
              >
                Live Weather &amp; 7-Day Forecast
              </button>
            </li>
            <li>
              <button
                onClick={onOpenEmergency}
                className="hover:text-white transition-colors text-amber-400"
              >
                24/7 Emergency Helplines
              </button>
            </li>
            <li>
              <button
                onClick={onOpenAddModal}
                className="hover:text-white transition-colors"
              >
                Add Your Business Listing (Free)
              </button>
            </li>
          </ul>
        </div>

        {/* Local Area Information */}
        <div className="space-y-2.5">
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider">
            Key Town Localities
          </h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            NH-24 Sitapur Road · BCM Road · Bahraich Road · Nai Bazar · Post Office Road · Joshitola · Sujawalpur · Arjunpur · Mevati Tola · Miyan Sarai · Purani Bazar
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenAddModal}
              className="w-full py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-center transition-colors shadow-sm border border-amber-500"
            >
              + List Your Place
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Legal Links */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
        <div>
          &copy; 2026 Khairabad City Directory. All rights reserved.
        </div>
        <div className="flex items-center gap-3 text-slate-400 flex-wrap justify-center sm:justify-end">
          <button
            onClick={() => setActiveView('privacy')}
            className="hover:text-amber-400 transition-colors underline"
          >
            Privacy Policy
          </button>
          <span>·</span>
          <button
            onClick={() => setActiveView('terms')}
            className="hover:text-amber-400 transition-colors underline"
          >
            Terms of Service
          </button>
          <span>·</span>
          <a
            href="/ads.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-amber-400 transition-colors underline"
          >
            ads.txt
          </a>
          <span>·</span>
          <a
            href="/robots.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-amber-400 transition-colors underline"
          >
            robots.txt
          </a>
          <span>·</span>
          <span className="text-slate-500">
            PIN: 261131
          </span>
        </div>
      </div>
    </footer>
  );
};
