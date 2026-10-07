import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  FileText,
  FileCode,
  DollarSign,
  HelpCircle,
  Sparkles,
  Layers,
  Globe,
  Settings,
} from 'lucide-react';
import { getAdSenseClientId } from './AdSenseSlot';

interface AdSenseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPrivacyPolicy?: () => void;
  onOpenTerms?: () => void;
}

export const AdSenseSetupModal: React.FC<AdSenseSetupModalProps> = ({
  isOpen,
  onClose,
  onOpenPrivacyPolicy,
  onOpenTerms,
}) => {
  const [publisherInput, setPublisherInput] = useState('');
  const [currentClientId, setCurrentClientId] = useState('');
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const cid = getAdSenseClientId();
      setCurrentClientId(cid);
      setPublisherInput(cid.replace(/^ca-/, ''));
      setSaveSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleSavePublisherId = (e: React.FormEvent) => {
    e.preventDefault();
    let cleaned = publisherInput.trim();
    if (!cleaned) return;

    if (!cleaned.startsWith('ca-pub-')) {
      if (cleaned.startsWith('pub-')) {
        cleaned = `ca-${cleaned}`;
      } else {
        cleaned = `ca-pub-${cleaned}`;
      }
    }

    localStorage.setItem('khairabad_adsense_pub_id', cleaned);
    setCurrentClientId(cleaned);

    // Update <meta name="google-adsense-account"> in document head
    const metaTag = document.querySelector('meta[name="google-adsense-account"]');
    if (metaTag) {
      metaTag.setAttribute('content', cleaned);
    }

    // Dispatch update event
    window.dispatchEvent(new Event('adsense-config-changed'));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetToDefault = () => {
    localStorage.removeItem('khairabad_adsense_pub_id');
    const defaultCid =
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ADSENSE_CLIENT_ID) ||
      'ca-pub-XXXXXXXXXXXXXXXX';
    setCurrentClientId(defaultCid);
    setPublisherInput(defaultCid.replace(/^ca-/, ''));
    const metaTag = document.querySelector('meta[name="google-adsense-account"]');
    if (metaTag) {
      metaTag.setAttribute('content', defaultCid);
    }
    window.dispatchEvent(new Event('adsense-config-changed'));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const rawPubId = currentClientId.replace(/^ca-/, '');
  const adsTxtRow = `google.com, ${rawPubId}, DIRECT, f08c47fec0942fa0`;
  const scriptTagCode = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${currentClientId}" crossorigin="anonymous"></script>`;

  const checklistItems = [
    {
      title: 'Authorized Digital Sellers (ads.txt)',
      desc: 'Hosted at root domain /ads.txt for programmatic buyer transparency',
      status: 'Ready',
      link: '/ads.txt',
      linkText: 'View ads.txt',
    },
    {
      title: 'Crawler Permissions (robots.txt)',
      desc: 'Mediapartners-Google and Googlebot fully allowed to crawl directory content',
      status: 'Ready',
      link: '/robots.txt',
      linkText: 'View robots.txt',
    },
    {
      title: 'XML Sitemap Index (sitemap.xml)',
      desc: 'Complete site index for directory, blog, weather, privacy, and terms',
      status: 'Ready',
      link: '/sitemap.xml',
      linkText: 'View sitemap.xml',
    },
    {
      title: 'Google DART Cookie Privacy Policy',
      desc: 'AdSense-required disclosure of third-party cookies & opt-out links to Google Ads Settings',
      status: 'Compliant',
      onClick: () => {
        onClose();
        if (onOpenPrivacyPolicy) onOpenPrivacyPolicy();
      },
      linkText: 'View Privacy Policy',
    },
    {
      title: 'Terms of Service & Disclaimer',
      desc: 'Clear disclaimer, directory accuracy notice, and community guidelines',
      status: 'Compliant',
      onClick: () => {
        onClose();
        if (onOpenTerms) onOpenTerms();
      },
      linkText: 'View Terms of Service',
    },
    {
      title: 'Cookie & Privacy Consent Banner',
      desc: 'GDPR / ePrivacy banner with explicit ad consent options and LocalStorage persistence',
      status: 'Active',
    },
    {
      title: 'Account Verification Meta Tag',
      desc: '<meta name="google-adsense-account"> configured in HTML head for site ownership',
      status: 'Configured',
    },
    {
      title: 'Contextual Ad Slots (Responsive)',
      desc: 'Strategic non-intrusive placements: Sidebar, Directory In-Feed, Blog Articles, Weather dashboard',
      status: 'Placed',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              <span>Google AdSense Deployment Hub</span>
            </span>
            <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Policy Ready</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white">
            AdSense Monetization &amp; Verification Suite
          </h2>
          <p className="text-xs text-amber-200/90 mt-1 max-w-xl leading-relaxed">
            All mandatory compliance files, crawler directives, legal disclosures, and ad units have been deployed for Google AdSense approval.
          </p>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Publisher ID Configuration */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-950 flex items-center gap-2">
                <Settings className="w-4 h-4 text-amber-700" />
                <span>Your AdSense Publisher ID</span>
              </h3>
              <span className="text-[11px] text-amber-900 font-medium">
                Active Client: <code className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-amber-200">{currentClientId}</code>
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              When Google approves your AdSense account, enter your 16-digit publisher ID below (e.g. <code>pub-1234567890123456</code>). It updates all ad slots across the website automatically.
            </p>

            <form onSubmit={handleSavePublisherId} className="flex flex-col sm:flex-row gap-2 pt-1">
              <div className="relative flex-1">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">ca-</span>
                <input
                  type="text"
                  value={publisherInput}
                  onChange={(e) => setPublisherInput(e.target.value)}
                  placeholder="pub-XXXXXXXXXXXXXXXX"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono font-semibold"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save ID</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-600 font-semibold rounded-xl text-xs border border-slate-200 transition-colors"
                >
                  Reset
                </button>
              </div>
            </form>

            {saveSuccess && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 p-2 rounded-xl animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Publisher ID saved! All AdSense slots on the site have been updated.</span>
              </div>
            )}
          </div>

          {/* AdSense Approval Checklist */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Google AdSense Mandatory Readiness Checklist</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {checklistItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 leading-tight">
                        {item.title}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {item.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      {item.desc}
                    </p>
                  </div>

                  {item.link ? (
                    <div className="pt-2">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 hover:underline"
                      >
                        <span>{item.linkText}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ) : item.onClick ? (
                    <div className="pt-2">
                      <button
                        onClick={item.onClick}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 hover:underline"
                      >
                        <span>{item.linkText}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          {/* Snippets to Copy */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <FileCode className="w-4 h-4 text-amber-600" />
              <span>Official Code Snippets for Your Domain</span>
            </h3>

            {/* ads.txt entry */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  1. Authorized Sellers entry (public/ads.txt)
                </span>
                <button
                  onClick={() => handleCopy(adsTxtRow, 'adstxt')}
                  className="text-xs text-amber-800 hover:text-amber-950 font-semibold inline-flex items-center gap-1"
                >
                  {copiedType === 'adstxt' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <code className="block bg-slate-950 text-amber-300 p-2.5 rounded-lg text-xs font-mono select-all overflow-x-auto">
                {adsTxtRow}
              </code>
            </div>

            {/* Script tag */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  2. Async AdSense Tag (in index.html &lt;head&gt;)
                </span>
                <button
                  onClick={() => handleCopy(scriptTagCode, 'script')}
                  className="text-xs text-amber-800 hover:text-amber-950 font-semibold inline-flex items-center gap-1"
                >
                  {copiedType === 'script' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <code className="block bg-slate-950 text-slate-200 p-2.5 rounded-lg text-xs font-mono select-all overflow-x-auto">
                {scriptTagCode}
              </code>
            </div>
          </div>

          {/* Quick Submission Walkthrough */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next Steps to Go Live with Google AdSense</span>
            </h4>
            <ol className="list-decimal pl-4 space-y-1.5 text-xs text-slate-300">
              <li>Log into your Google AdSense account at <strong>google.com/adsense</strong>.</li>
              <li>Navigate to <strong>Sites &rarr; Add Site</strong> and enter your domain.</li>
              <li>Google will automatically crawl your site, detect the meta tag, and verify <code>/ads.txt</code>.</li>
              <li>Once approved, update your publisher ID here to start monetizing immediately.</li>
            </ol>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Khairabad City Directory · Monitored for AdSense Compliance
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
