import React, { useState } from 'react';
import { X, CheckCircle, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { CategoryId, CityListing } from '../types/directory';
import { CATEGORIES, LOCALITIES } from '../data/khairabadData';

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
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [openingHours, setOpeningHours] = useState('9:00 AM – 8:00 PM');
  const [description, setDescription] = useState('');
  const [servicesInput, setServicesInput] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      setUploadedImages((prev) => [...prev, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
      isDemo: false,
    };

    onAddListing(newListing);
    setIsSuccess(true);
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
    setImageUrlInput('');
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
          <div className="text-center py-8 space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-lg font-bold text-slate-900">Place Added Successfully!</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              &quot;{name}&quot; has been added to the Khairabad directory database with its photo and is now searchable and visible in the listings.
            </p>
            <div className="pt-2">
              <button
                onClick={resetAndClose}
                className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 border border-amber-500 rounded-xl text-xs font-bold shadow-xs"
              >
                View in Directory
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

              {/* Upload Dropzone + URL Option */}
              <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                <label className="flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-amber-300 hover:border-amber-500 rounded-2xl bg-amber-50/50 hover:bg-amber-50/80 transition-all cursor-pointer group text-center">
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

                {/* Paste Direct URL */}
                <div className="sm:w-52 flex flex-col justify-between p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                  <span className="text-[10px] font-semibold text-slate-600 flex items-center gap-1">
                    <ImageIcon className="w-3 h-3 text-slate-500" />
                    Or Paste Image URL
                  </span>
                  <div className="flex gap-1">
                    <input
                      type="url"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 p-1.5 text-[11px] border border-slate-300 rounded-lg outline-none bg-white focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-black"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

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
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 border border-amber-500 rounded-xl font-bold shadow-xs transition-all"
              >
                Submit Place Listing
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
