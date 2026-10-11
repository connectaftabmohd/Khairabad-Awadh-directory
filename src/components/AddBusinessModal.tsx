import React, { useState } from 'react';
import { X, CheckCircle, Upload, Trash2, Loader2, Clock, ShieldCheck, Share2, Copy, Check } from 'lucide-react';
import { CategoryId, CityListing } from '../types/directory';
import { CATEGORIES, LOCALITIES } from '../data/khairabadData';
import { TRADITIONAL_MOHALLAS } from '../data/roadsConnectivityData';
import { syncListingToSupabase } from '../utils/supabaseClient';

// Clean SVG icon for WhatsApp branding
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.888 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// Clean SVG icon for Twitter / X branding
const TwitterXIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface AddBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddListing: (newListing: CityListing) => void;
  initialCategory?: CategoryId;
}

export const AddBusinessModal: React.FC<AddBusinessModalProps> = ({
  isOpen,
  onClose,
  onAddListing,
  initialCategory = 'hospitals',
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CategoryId>(initialCategory);
  const [subcategory, setSubcategory] = useState('');

  // Sync category when initialCategory changes
  React.useEffect(() => {
    if (initialCategory && initialCategory !== 'all') {
      setCategory(initialCategory);
    }
  }, [initialCategory, isOpen]);

  const [locality, setLocality] = useState('Sitapur Road');
  const [roadName, setRoadName] = useState('National Highway 24 (NH-24)');
  const [mohalla, setMohalla] = useState('');
  const [chaurahaHub, setChaurahaHub] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [openingHours, setOpeningHours] = useState('9:00 AM – 8:00 PM');
  const [description, setDescription] = useState('');
  const [servicesInput, setServicesInput] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  const [lastAddedListingId, setLastAddedListingId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [supabaseSynced, setSupabaseSynced] = useState<boolean | null>(null);

  if (!isOpen) return null;

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Optimized for web & mobile display while keeping storage size under 40KB
          const MAX_DIM = 800;
          let width = img.width;
          let height = img.height;

          if (width > MAX_DIM || height > MAX_DIM) {
            if (width > height) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            } else {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.7));
          } else {
            resolve('');
          }
        };
        img.onerror = () => resolve('');
        img.src = event.target?.result as string;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;
      try {
        const compressed = await compressImage(file);
        if (compressed) {
          setUploadedImages((prev) => [...prev, compressed]);
        }
      } catch (err) {
        console.error('Failed to process image:', err);
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const services = servicesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const newListing: CityListing = {
      id: `kh-user-${Date.now()}`,
      name: name.trim(),
      category,
      subcategory: subcategory.trim() || 'Local Business',
      locality,
      roadName: roadName.trim() || undefined,
      mohalla: mohalla.trim() || undefined,
      chaurahaHub: chaurahaHub.trim() || undefined,
      address: address.trim() || `${locality}, Khairabad, UP 261131`,
      phone: phone.trim(),
      whatsapp: whatsapp.trim(),
      openingHours: openingHours.trim(),
      description: description.trim() || 'Community added listing on Khairabad City Directory.',
      services: services.length > 0 ? services : ['Local Service'],
      images: uploadedImages.length > 0 ? uploadedImages : [],
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${name.trim()} Khairabad Sitapur`
      )}`,
      verified: false,
      status: 'under-review',
      isDemo: false,
    };

    setLastAddedListingId(newListing.id);
    onAddListing(newListing);

    // Sync to Supabase project vyyuvanyyexkdnjmhkdz
    try {
      const res = await syncListingToSupabase(newListing);
      setSupabaseSynced(res.success);
    } catch {
      setSupabaseSynced(false);
    } finally {
      setIsSubmitting(false);
      setIsSuccess(true);
    }
  };

  const shareUrl =
    lastAddedListingId && typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}?listing=${encodeURIComponent(lastAddedListingId)}`
      : 'https://khairabad.city/';

  const handleCopyListingLink = async () => {
    if (typeof window !== 'undefined') {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(shareUrl);
        } else {
          const textArea = document.createElement('textarea');
          textArea.value = shareUrl;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
  };

  const resetAndClose = () => {
    setIsSuccess(false);
    setName('');
    setAddress('');
    setPhone('');
    setWhatsapp('');
    setDescription('');
    setServicesInput('');
    setUploadedImages([]);
    setLastAddedListingId(null);
    setCopiedLink(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
          <div>
            <h3 className="text-lg font-bold font-display text-slate-900">
              Add Your Business or Place
            </h3>
            <p className="text-xs text-slate-500">
              Free listing for places, marriage lawns, healthcare, shops &amp; services in Khairabad
            </p>
          </div>
          <button
            onClick={resetAndClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="text-center py-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            {/* Success icon & Status Header */}
            <div className="relative mx-auto w-16 h-16">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
                <CheckCircle className="w-9 h-9" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white rounded-full p-1 border-2 border-white shadow-xs">
                <Clock className="w-3.5 h-3.5 animate-pulse" />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Listing Submitted Successfully</span>
              </div>
              <h4 className="text-xl font-bold text-slate-900 font-display">
                Listing Under Review
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto mt-1 leading-relaxed">
                Thank you! <strong>&quot;{name}&quot;</strong> has been received and entered into our verification queue. It is now saved locally &amp; synced with the Khairabad directory.
              </p>
            </div>

            {/* Listing Under Review Status Card */}
            <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 text-left text-xs space-y-2.5 max-w-md mx-auto">
              <div className="flex items-center justify-between">
                <div className="font-bold flex items-center gap-2 text-amber-950">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                  <span>Current Status: Under Review (समीक्षाधीन)</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-amber-200/80 text-amber-900 border border-amber-300">
                  Pending Verification
                </span>
              </div>

              <p className="text-[11px] text-amber-900/90 leading-relaxed">
                Our local moderators review business phone numbers, street location ({locality}), and opening hours to prevent duplicate spam and keep Khairabad Portal trusted for all residents.
              </p>

              <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px] text-amber-950 font-medium">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Estimated verification:</span>
                </span>
                <span className="font-bold text-emerald-800">Within 12–24 Hours</span>
              </div>
            </div>

            {/* Quick Share Menu */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 max-w-md mx-auto text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Share Preview Link</span>
                </span>
                <span className="text-[10px] text-slate-500">ID: {lastAddedListingId?.slice(-8)}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyListingLink}
                  className="flex-1 py-2 px-3 bg-white hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-semibold border border-slate-200 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `📍 Reviewing new listing: *${name}* (${subcategory || category}) in ${locality}, Khairabad.\nCheck it out: ${shareUrl}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  title="Share on WhatsApp"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    `New place "${name}" added in ${locality}, Khairabad! Currently under review.`
                  )}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  title="Share on X"
                >
                  <TwitterXIcon className="w-3.5 h-3.5" />
                  <span>X / Post</span>
                </a>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={resetAndClose}
                className="w-full sm:w-auto px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 border border-amber-500 rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                Done &amp; View in Directory
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSuccess(false);
                  setName('');
                  setAddress('');
                  setPhone('');
                  setWhatsapp('');
                  setDescription('');
                  setServicesInput('');
                  setUploadedImages([]);
                  setLastAddedListingId(null);
                  setCopiedLink(false);
                }}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-300 transition-colors"
              >
                Add Another Place
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs text-slate-700">
            <div>
              <label className="block font-semibold mb-1 text-slate-800">
                Business / Place Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Awadh Diagnostics, Shahnai Marriage Lawn, CHC Ward"
                className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1 text-slate-800">
                  Primary Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryId)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-xs bg-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-800">
                  Subcategory / Type
                </label>
                <input
                  type="text"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  placeholder="e.g. AC Marriage Lawn, Clinic, Dhaba"
                  className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1 text-slate-800">
                  Locality / Area in Khairabad *
                </label>
                <select
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-xs bg-white"
                >
                  {LOCALITIES.map((loc) => (
                    <option key={loc.id} value={loc.name}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-800">
                  Operating Hours
                </label>
                <input
                  type="text"
                  value={openingHours}
                  onChange={(e) => setOpeningHours(e.target.value)}
                  placeholder="e.g. 9:00 AM – 8:30 PM"
                  className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-xs"
                />
              </div>
            </div>

            {/* Road & Mohalla Transit Mapping */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-amber-50/50 p-3 rounded-xl border border-amber-200/60">
              <div>
                <label className="block font-semibold mb-1 text-slate-800 text-[11px]">
                  🛣️ Road / Corridor
                </label>
                <select
                  value={roadName}
                  onChange={(e) => setRoadName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs bg-white"
                >
                  <option value="National Highway 24 (NH-24)">NH-24 (Sitapur Road)</option>
                  <option value="State Highway 30 (SH-30)">SH-30 (Biswan Road)</option>
                  <option value="BCM Road">BCM Hospital Road</option>
                  <option value="Bahraich–Sitapur Road">Bahraich–Sitapur Road</option>
                  <option value="Post Office Road">Post Office Road (Purani Bazar)</option>
                  <option value="Nai Bazar Road">Nai Bazar Road (Joshitola)</option>
                  <option value="Other Town Link Road">Other Town Link Road</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-800 text-[11px]">
                  🏘️ Municipal Ward / Mohalla
                </label>
                <input
                  type="text"
                  list="official-mohalla-list"
                  value={mohalla}
                  onChange={(e) => setMohalla(e.target.value)}
                  placeholder="e.g. Joshitola, Shujawalpur, Makhupur..."
                  className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs bg-white"
                />
                <datalist id="official-mohalla-list">
                  {TRADITIONAL_MOHALLAS.map((m) => (
                    <option key={m.id} value={m.name}>
                      Ward {m.wardNumber}: {m.name} ({m.hindiName})
                    </option>
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-800 text-[11px]">
                  🚦 Nearest Chauraha
                </label>
                <input
                  type="text"
                  value={chaurahaHub}
                  onChange={(e) => setChaurahaHub(e.target.value)}
                  placeholder="e.g. Khairabad Chauraha, BCM Chauraha"
                  className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-800">
                Full Physical Address *
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Shop / Plot No., Landmark, Khairabad, UP 261131"
                className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1 text-slate-800">
                  Calling Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="05862-XXXXXX or 98XXXXXXXX"
                  className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-800">
                  WhatsApp Contact Number
                </label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="91XXXXXXXXXX"
                  className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-xs"
                />
              </div>
            </div>

            {/* Upload Place Image Feature */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block font-semibold text-slate-800">
                Upload Place Image / Photos
                <span className="text-slate-400 font-normal ml-1">
                  (Recommended — displays as hero banner on directory cards)
                </span>
              </label>

              {/* Upload Dropzone */}
              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-amber-300 hover:border-amber-500 rounded-2xl bg-amber-50/50 hover:bg-amber-50/80 transition-all cursor-pointer group text-center">
                <Upload className="w-5 h-5 text-amber-600 group-hover:scale-110 transition-transform mb-1" />
                <span className="text-xs font-bold text-slate-800">
                  Click to Upload Photo
                </span>
                <span className="text-[10px] text-slate-500">
                  PNG, JPG, WebP from your device
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </label>

              {/* Uploaded Images Preview Strip */}
              {uploadedImages.length > 0 && (
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] text-slate-500 font-semibold">
                    Uploaded Photos ({uploadedImages.length}):
                  </span>
                  <div className="flex gap-2.5 overflow-x-auto pb-1">
                    {uploadedImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-300 shrink-0 group"
                      >
                        <img
                          src={img}
                          alt={`Uploaded place ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 p-1 bg-black/75 hover:bg-rose-600 text-white rounded-md transition-colors shadow-xs"
                          title="Remove Photo"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 right-1 text-center bg-amber-500 text-slate-950 text-[9px] font-bold rounded py-0.2">
                            Main Cover
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-800">
                Key Services (comma-separated)
              </label>
              <input
                type="text"
                value={servicesInput}
                onChange={(e) => setServicesInput(e.target.value)}
                placeholder="e.g. AC Banquet, Catering, Sound System, Parking"
                className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-800">
                Business / Place Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a clear description of your facilities, products or specialties in Khairabad..."
                className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-xs"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={resetAndClose}
                className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 border border-amber-500 rounded-xl font-bold shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving to Supabase...</span>
                  </>
                ) : (
                  <span>Submit Place Listing</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
