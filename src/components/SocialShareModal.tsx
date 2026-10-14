import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  QrCode,
  Download,
  ExternalLink,
  MessageCircle,
  Mail,
  Smartphone,
  Eye,
  Sparkles,
  MapPin,
  Phone,
  Clock,
  Star,
  ShieldCheck,
  Image as ImageIcon,
} from 'lucide-react';
import QRCode from 'qrcode';
import { CityListing } from '../types/directory';
import { KhairabadBlog } from '../data/khairabadBlogs';
import {
  getListingShareData,
  getBlogShareData,
  updateDocumentSocialMeta,
  updateDocumentBlogSocialMeta,
  restoreDefaultSocialMeta,
} from '../utils/socialShare';
import {
  WhatsAppIcon,
  TelegramIcon,
  FacebookIcon,
  TwitterXIcon,
  LinkedInIcon,
  PinterestIcon,
  RedditIcon,
} from './icons/SocialIcons';

interface SocialShareModalProps {
  listing?: CityListing;
  blog?: KhairabadBlog;
  isOpen: boolean;
  onClose: () => void;
  onToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  listing,
  blog,
  isOpen,
  onClose,
  onToast,
}) => {
  const [activeView, setActiveView] = useState<'apps' | 'preview' | 'qr'>('apps');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const cardCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const shareData = blog ? getBlogShareData(blog) : listing ? getListingShareData(listing) : null;

  // Update dynamic meta tags when modal is open
  useEffect(() => {
    if (isOpen) {
      if (blog) {
        updateDocumentBlogSocialMeta(blog);
      } else if (listing) {
        updateDocumentSocialMeta(listing);
      }
    }
    return () => {
      if (isOpen) {
        restoreDefaultSocialMeta();
      }
    };
  }, [isOpen, listing, blog]);

  // Generate QR Code
  useEffect(() => {
    if (!isOpen || !shareData) return;

    QRCode.toDataURL(shareData.shareUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate QR code', err));
  }, [isOpen, shareData?.shareUrl]);

  if (!isOpen || !shareData) return null;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareData.shareUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = shareData.shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedLink(true);
      if (onToast) onToast('Listing link copied to clipboard!', 'success');
      setTimeout(() => setCopiedLink(false), 2400);
    } catch {
      if (onToast) onToast('Could not copy link to clipboard', 'error');
    }
  };

  const handleCopyFormattedText = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareData.whatsappText);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = shareData.whatsappText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedText(true);
      if (onToast) onToast('Formatted WhatsApp summary copied!', 'success');
      setTimeout(() => setCopiedText(false), 2400);
    } catch {
      if (onToast) onToast('Could not copy summary', 'error');
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: shareData.title,
          text: shareData.whatsappText,
          url: shareData.shareUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyLink();
    }
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = `khairabad-${shareData.listingId}-qr.png`;
    link.href = qrDataUrl;
    link.click();
    if (onToast) onToast('QR code downloaded!', 'success');
  };

  // Generate and download a branded 1080x1080 visual social post card for Instagram / WhatsApp Status
  const handleDownloadSocialCard = async () => {
    setIsGeneratingCard(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1080;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Dark background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1080);
      bgGrad.addColorStop(0, '#090d16');
      bgGrad.addColorStop(0.5, '#0f172a');
      bgGrad.addColorStop(1, '#1e293b');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1080, 1080);

      // Gold top accent bar
      const goldGrad = ctx.createLinearGradient(0, 0, 1080, 0);
      goldGrad.addColorStop(0, '#f59e0b');
      goldGrad.addColorStop(0.5, '#fde047');
      goldGrad.addColorStop(1, '#d97706');
      ctx.fillStyle = goldGrad;
      ctx.fillRect(0, 0, 1080, 16);

      // Header: Khairabad City Directory Branding
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('KHAIRABAD CITY DIRECTORY', 70, 90);

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('📍 OFFICIAL LOCAL BUSINESS GUIDE · SITAPUR (PIN 261131)', 70, 130);

      // Draw Main Listing Photo
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = shareData.absoluteImageUrl;
      });

      // Photo Card Box
      const boxX = 70;
      const boxY = 170;
      const boxW = 940;
      const boxH = 460;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxW, boxH, 24);
      ctx.clip();

      if (img.width > 0) {
        // Cover fit
        const scale = Math.max(boxW / img.width, boxH / img.height);
        const nw = img.width * scale;
        const nh = img.height * scale;
        const nx = boxX + (boxW - nw) / 2;
        const ny = boxY + (boxH - nh) / 2;
        ctx.drawImage(img, nx, ny, nw, nh);
      } else {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(boxX, boxY, boxW, boxH);
      }

      // Dark gradient overlay over photo bottom
      const photoOverlay = ctx.createLinearGradient(0, boxY + 200, 0, boxY + boxH);
      photoOverlay.addColorStop(0, 'rgba(15, 23, 42, 0)');
      photoOverlay.addColorStop(1, 'rgba(15, 23, 42, 0.95)');
      ctx.fillStyle = photoOverlay;
      ctx.fillRect(boxX, boxY, boxW, boxH);
      ctx.restore();

      // Category Pill on Photo
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.roundRect(100, boxY + 30, 240, 44, 22);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(shareData.category.toUpperCase().substring(0, 18), 125, boxY + 58);

      // Item Name on Photo Overlay
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 44px sans-serif';
      const displayName = shareData.name.length > 32 ? `${shareData.name.substring(0, 30)}...` : shareData.name;
      ctx.fillText(displayName, 100, boxY + boxH - 45);

      // Information Section
      const infoY = 670;
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('LOCALITY', 70, infoY);
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText(shareData.locality, 70, infoY + 36);

      if (listing?.phone) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText('CONTACT / PHONE', 70, infoY + 100);
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 30px sans-serif';
        ctx.fillText(`📞 ${listing.phone}`, 70, infoY + 138);
      } else if (blog) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText('READ TIME · PUBLISHED', 70, infoY + 100);
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText(`⏱️ ${blog.readTime} · ${blog.publishDate}`, 70, infoY + 138);
      }

      if (listing?.openingHours) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText('HOURS', 70, infoY + 200);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '24px sans-serif';
        ctx.fillText(`⏰ ${listing.openingHours.substring(0, 36)}`, 70, infoY + 234);
      } else if (blog?.visitorInfo?.timings) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText('VISITING HOURS', 70, infoY + 200);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '24px sans-serif';
        ctx.fillText(`⏰ ${blog.visitorInfo.timings.substring(0, 36)}`, 70, infoY + 234);
      }

      // Draw QR Code on bottom right
      if (qrDataUrl) {
        const qrImg = new Image();
        await new Promise<void>((resolve) => {
          qrImg.onload = () => resolve();
          qrImg.onerror = () => resolve();
          qrImg.src = qrDataUrl;
        });

        const qrX = 740;
        const qrY = 670;
        const qrSize = 250;

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(qrX - 16, qrY - 16, qrSize + 32, qrSize + 32, 24);
        ctx.fill();

        ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('SCAN TO EXPLORE', qrX + qrSize / 2, qrY + qrSize + 32);
        ctx.textAlign = 'left';
      }

      // Bottom Footer Bar
      ctx.fillStyle = '#334155';
      ctx.fillRect(70, 990, 940, 2);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '20px sans-serif';
      ctx.fillText('Explore verified local businesses on khairabadcity.in', 70, 1030);

      // Download Canvas as PNG
      const a = document.createElement('a');
      a.download = `khairabad-${shareData.listingId}-social-card.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();

      if (onToast) onToast('High-res social post card downloaded!', 'success');
    } catch (err) {
      console.error('Error generating social card', err);
      if (onToast) onToast('Failed to create social card', 'error');
    } finally {
      setIsGeneratingCard(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 px-5 py-4 text-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-950/15 flex items-center justify-center text-slate-950">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg leading-tight font-display">
                Share Local Business
              </h3>
              <p className="text-xs text-slate-900/80 font-medium">
                Optimized for WhatsApp, Instagram, Telegram, Facebook &amp; X
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-950/10 hover:bg-slate-950/20 text-slate-950 transition-colors"
            aria-label="Close share modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Listing or Blog Mini Hero Preview */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3 sm:gap-4">
            <img
              src={shareData.imageUrl}
              alt={shareData.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=400&q=80';
              }}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                  {shareData.category}
                </span>
                {listing?.verified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Verified
                  </span>
                )}
                {listing?.rating && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {listing.rating}
                  </span>
                )}
                {blog && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                    Heritage Guide
                  </span>
                )}
              </div>
              <h4 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                {shareData.name}
              </h4>
              <p className="text-xs text-slate-500 flex items-center gap-1 truncate mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{shareData.locality}</span>
                {listing?.phone && (
                  <>
                    <span className="text-slate-300">·</span>
                    <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{listing.phone}</span>
                  </>
                )}
                {blog && (
                  <>
                    <span className="text-slate-300">·</span>
                    <span>⏱️ {blog.readTime}</span>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center border-b border-slate-100 px-4 sm:px-5 bg-white text-xs font-bold gap-1 sm:gap-2">
          <button
            onClick={() => setActiveView('apps')}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 ${
              activeView === 'apps'
                ? 'border-amber-500 text-amber-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Social Apps (9+)</span>
          </button>
          <button
            onClick={() => setActiveView('preview')}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 ${
              activeView === 'preview'
                ? 'border-amber-500 text-amber-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Social Card</span>
          </button>
          <button
            onClick={() => setActiveView('qr')}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 ${
              activeView === 'qr'
                ? 'border-amber-500 text-amber-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>QR Code</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: SOCIAL APPS GRID */}
          {activeView === 'apps' && (
            <div className="space-y-4">
              {/* Primary 1-Click Apps Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {/* 1. WhatsApp */}
                <a
                  href={shareData.links.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-800 border border-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] group"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:bg-emerald-700">
                    <WhatsAppIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <span className="block font-bold text-xs text-slate-900 leading-tight">
                      WhatsApp
                    </span>
                    <span className="text-[10px] text-emerald-700 font-medium">
                      Chat &amp; Status
                    </span>
                  </div>
                </a>

                {/* 2. Telegram */}
                <a
                  href={shareData.links.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-800 border border-sky-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] group"
                >
                  <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:bg-sky-600">
                    <TelegramIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <span className="block font-bold text-xs text-slate-900 leading-tight">
                      Telegram
                    </span>
                    <span className="text-[10px] text-sky-700 font-medium">
                      Direct &amp; Groups
                    </span>
                  </div>
                </a>

                {/* 3. Facebook */}
                <a
                  href={shareData.links.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-800 border border-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] group"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:bg-blue-700">
                    <FacebookIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <span className="block font-bold text-xs text-slate-900 leading-tight">
                      Facebook
                    </span>
                    <span className="text-[10px] text-blue-700 font-medium">
                      Feed &amp; Story
                    </span>
                  </div>
                </a>

                {/* 4. Twitter / X */}
                <a
                  href={shareData.links.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/5 hover:bg-slate-900/10 text-slate-800 border border-slate-300 transition-all hover:scale-[1.02] active:scale-[0.98] group"
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-950 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:bg-black">
                    <TwitterXIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <span className="block font-bold text-xs text-slate-900 leading-tight">
                      X / Twitter
                    </span>
                    <span className="text-[10px] text-slate-600 font-medium">
                      Post &amp; Tag
                    </span>
                  </div>
                </a>

                {/* 5. LinkedIn */}
                <a
                  href={shareData.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-blue-700/10 hover:bg-blue-700/20 text-blue-900 border border-blue-700/20 transition-all hover:scale-[1.02] active:scale-[0.98] group"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#0077b5] text-white flex items-center justify-center shrink-0 shadow-sm group-hover:bg-blue-800">
                    <LinkedInIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <span className="block font-bold text-xs text-slate-900 leading-tight">
                      LinkedIn
                    </span>
                    <span className="text-[10px] text-blue-700 font-medium">
                      Professional
                    </span>
                  </div>
                </a>

                {/* 6. Pinterest */}
                <a
                  href={shareData.links.pinterest}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-900 border border-rose-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] group"
                >
                  <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:bg-rose-700">
                    <PinterestIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <span className="block font-bold text-xs text-slate-900 leading-tight">
                      Pinterest
                    </span>
                    <span className="text-[10px] text-rose-700 font-medium">
                      Save Photo Pin
                    </span>
                  </div>
                </a>

                {/* 7. Reddit */}
                <a
                  href={shareData.links.reddit}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-900 border border-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] group"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#ff4500] text-white flex items-center justify-center shrink-0 shadow-sm group-hover:bg-orange-700">
                    <RedditIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <span className="block font-bold text-xs text-slate-900 leading-tight">
                      Reddit
                    </span>
                    <span className="text-[10px] text-orange-700 font-medium">
                      Discussion
                    </span>
                  </div>
                </a>

                {/* 8. Email */}
                <a
                  href={shareData.links.email}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-900 border border-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] group"
                >
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:bg-indigo-700">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <span className="block font-bold text-xs text-slate-900 leading-tight">
                      Email
                    </span>
                    <span className="text-[10px] text-indigo-700 font-medium">
                      Formal Report
                    </span>
                  </div>
                </a>

                {/* 9. SMS */}
                <a
                  href={shareData.links.sms}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-900 border border-teal-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] group"
                >
                  <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:bg-teal-700">
                    <Smartphone className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <span className="block font-bold text-xs text-slate-900 leading-tight">
                      SMS Text
                    </span>
                    <span className="text-[10px] text-teal-700 font-medium">
                      Direct Phone
                    </span>
                  </div>
                </a>
              </div>

              {/* Native System Share Button for Mobile */}
              {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all shadow-sm active:scale-[0.99]"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Open Device Share Menu (Instagram, Snapchat, Discord, etc.)</span>
                </button>
              )}

              {/* Action Buttons: Copy Direct Link & Copy Formatted Message */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    copiedLink
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {copiedLink ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-500" />
                    )}
                    <span>{copiedLink ? 'Link Copied!' : 'Copy Direct Link'}</span>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                    URL
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyFormattedText}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    copiedText
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {copiedText ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <MessageCircle className="w-4 h-4 text-slate-500" />
                    )}
                    <span>{copiedText ? 'Text Copied!' : 'Copy Formatted Text'}</span>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                    WA Format
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE SOCIAL CARD PREVIEW */}
          {activeView === 'preview' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-600 bg-amber-50/80 p-3 rounded-xl border border-amber-200/80 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  This is the exact rich visual social card displayed when your link is posted on
                  WhatsApp, Facebook, Twitter / X, Telegram, or LinkedIn:
                </p>
              </div>

              {/* Realistic Social Card Mockup */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-lg bg-white">
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                  <img
                    src={shareData.absoluteImageUrl}
                    alt={shareData.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                    <span className="text-white text-xs font-black uppercase tracking-wider bg-amber-500 px-2.5 py-0.5 rounded-md shadow-xs">
                      {shareData.category}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                    khairabadcity.in · Official Town Guide
                  </span>
                  <h4 className="text-base font-extrabold text-slate-900 mt-1 leading-snug">
                    {shareData.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {shareData.description}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {shareData.locality}
                    </span>
                    {listing?.phone && (
                      <span className="font-semibold text-emerald-700">
                        📞 {listing.phone}
                      </span>
                    )}
                    {blog && (
                      <span className="font-semibold text-amber-800">
                        ⏱️ {blog.readTime}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Download Branded Graphic Banner Button */}
              <button
                type="button"
                onClick={handleDownloadSocialCard}
                disabled={isGeneratingCard}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-slate-950 font-extrabold text-xs transition-all shadow-md cursor-pointer disabled:opacity-60"
              >
                <Download className="w-4 h-4" />
                <span>
                  {isGeneratingCard
                    ? 'Generating High-Res Social Card...'
                    : 'Download Ready-to-Post Graphic Card (PNG)'}
                </span>
              </button>
            </div>
          )}

          {/* TAB 3: QR CODE GENERATOR & SCAN */}
          {activeView === 'qr' && (
            <div className="space-y-4 text-center">
              <p className="text-xs text-slate-600">
                Customers and visitors can scan this QR code directly with any phone camera or Google
                Lens to open {shareData.name} instantly on Khairabad City Directory:
              </p>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block shadow-inner mx-auto">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`QR Code for ${shareData.name}`}
                    className="w-48 h-48 sm:w-56 sm:h-56 mx-auto rounded-lg shadow-sm"
                  />
                ) : (
                  <div className="w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center text-slate-400">
                    Generating QR Code...
                  </div>
                )}
                <div className="mt-2 text-[11px] font-mono text-slate-500 truncate max-w-xs mx-auto">
                  {shareData.shareUrl}
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleDownloadQr}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download QR Code</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-300 transition-all shadow-sm"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedLink ? 'Link Copied' : 'Copy Link'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with URL Preview & Instant Actions */}
        <div className="p-3.5 sm:p-4 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 truncate max-w-full">
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-mono text-[11px] truncate">{shareData.shareUrl}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs shadow-2xs transition-colors flex items-center gap-1"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
