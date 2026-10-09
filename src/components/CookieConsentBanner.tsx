import React, { useState, useEffect } from 'react';
import { Cookie, X, ShieldCheck, Check } from 'lucide-react';

interface CookieConsentBannerProps {
  onOpenPrivacyPolicy?: () => void;
}

const CONSENT_KEY = 'khairabad_cookie_consent_v1';

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({ onOpenPrivacyPolicy }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(CONSENT_KEY);
      if (!consent) {
        // Small delay so it appears smoothly
        const timer = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem(CONSENT_KEY, 'accepted_all');
    } catch {
      // ignore
    }
    setVisible(false);
  };

  const handleEssentialOnly = () => {
    try {
      localStorage.setItem(CONSENT_KEY, 'essential_only');
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Cookie and Privacy Consent"
      className="hidden sm:block fixed sm:right-6 sm:bottom-6 sm:max-w-md z-50 bg-slate-950 text-white p-5 rounded-2xl border border-slate-800 shadow-2xl space-y-3 animate-fade-in"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center shrink-0">
            <Cookie className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">
              Cookie &amp; Privacy Notice
            </h4>
            <span className="text-[10px] text-slate-400">Google AdSense &amp; Analytics Consent</span>
          </div>
        </div>
        <button
          onClick={handleEssentialOnly}
          className="text-slate-400 hover:text-white p-1"
          aria-label="Dismiss cookie notice"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed">
        We use cookies and third-party services (such as Google AdSense) to deliver personalized ads, analyze local traffic, and remember your saved favorites.
      </p>

      <div className="flex items-center justify-between gap-2 pt-1 text-xs">
        {onOpenPrivacyPolicy ? (
          <button
            onClick={onOpenPrivacyPolicy}
            className="text-[11px] text-amber-400 hover:text-amber-300 underline font-medium"
          >
            Privacy Policy
          </button>
        ) : (
          <span className="text-[11px] text-slate-400">Ad Choices</span>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={handleEssentialOnly}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            Essential Only
          </button>
          <button
            onClick={handleAcceptAll}
            className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold border border-amber-500 transition-colors shadow-xs"
          >
            Accept All
          </button>
        </div>
      </div>
    </aside>
  );
};
