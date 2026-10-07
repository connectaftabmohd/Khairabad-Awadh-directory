import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

interface AdSenseSlotProps {
  adSlot?: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  adLayoutKey?: string;
  className?: string;
  style?: React.CSSProperties;
  label?: string;
}

export const getAdSenseClientId = (): string => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('khairabad_adsense_pub_id');
    if (stored && stored.trim()) {
      let clean = stored.trim();
      if (!clean.startsWith('ca-pub-')) {
        clean = clean.startsWith('pub-') ? `ca-${clean}` : `ca-pub-${clean}`;
      }
      return clean;
    }
  }
  return (
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ADSENSE_CLIENT_ID) ||
    'ca-pub-XXXXXXXXXXXXXXXX'
  );
};

export const AdSenseSlot: React.FC<AdSenseSlotProps> = ({
  adSlot = '1234567890',
  adFormat = 'auto',
  adLayoutKey,
  className = '',
  style,
  label = 'Advertisement',
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const [clientId, setClientId] = useState<string>(getAdSenseClientId());
  const [adLoaded, setAdLoaded] = useState(false);
  const [isLiveClient, setIsLiveClient] = useState(false);

  useEffect(() => {
    const updateClient = () => {
      const cid = getAdSenseClientId();
      setClientId(cid);
      const isReal =
        Boolean(cid) &&
        cid.startsWith('ca-pub-') &&
        cid !== 'ca-pub-XXXXXXXXXXXXXXXX' &&
        !cid.includes('XXXX');
      setIsLiveClient(isReal);

      if (isReal && typeof window !== 'undefined') {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setAdLoaded(true);
        } catch (err) {
          // Expected in ad-blocker or dev sandbox
        }
      }
    };

    updateClient();

    window.addEventListener('storage', updateClient);
    window.addEventListener('adsense-config-changed', updateClient);
    return () => {
      window.removeEventListener('storage', updateClient);
      window.removeEventListener('adsense-config-changed', updateClient);
    };
  }, []);

  // If live publisher ID is set, render standard AdSense <ins> tag
  if (isLiveClient) {
    return (
      <div className={`my-4 text-center overflow-hidden ${className}`} ref={adRef}>
        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 select-none">
          {label}
        </div>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', minHeight: '90px', ...style }}
          data-ad-client={clientId}
          data-ad-slot={adSlot}
          data-ad-format={adFormat}
          data-full-width-responsive="true"
          data-ad-layout-key={adLayoutKey}
        />
      </div>
    );
  }

  // Showcase / pre-approval unit showing exact AdSense placement to webmaster
  return (
    <div
      className={`my-4 p-4 rounded-2xl border border-dashed border-amber-300/80 bg-amber-50/50 text-slate-600 text-center relative overflow-hidden transition-all ${className}`}
      style={style}
    >
      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-amber-900 border-b border-amber-200/70 pb-2 mb-2">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Google AdSense Slot ({adFormat})</span>
        </span>
        <span className="text-amber-800 font-semibold">{label}</span>
      </div>

      <div className="py-2 space-y-1">
        <div className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5">
          <span>Ad Unit Space · Slot #{adSlot}</span>
        </div>
        <p className="text-[11px] text-slate-600 max-w-md mx-auto leading-relaxed">
          Compliant responsive placement ready for Google AdSense crawlers &amp; automated ad serving.
        </p>
      </div>

      <div className="text-[10px] text-slate-500 pt-1 flex items-center justify-center gap-2 flex-wrap">
        <span>Target Client:</span>
        <code className="bg-white px-2 py-0.5 rounded border border-amber-200 text-amber-900 font-mono font-bold">
          {clientId}
        </code>
      </div>
    </div>
  );
};

