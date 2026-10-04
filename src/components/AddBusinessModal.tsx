import React, { useState } from 'react';
import { X, CheckCircle, Info, ExternalLink } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'form' | 'guide'>('form');
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
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

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
      images: [],
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
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
          <div>
            <h3 className="text-lg font-bold font-display text-slate-900">
              Add Your Business to Khairabad Directory
            </h3>
            <p className="text-xs text-slate-500">
              Free listing for businesses, healthcare, schools & services in Khairabad
            </p>
          </div>
          <button
            onClick={resetAndClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 mb-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`py-2 px-4 border-b-2 transition-colors ${
              activeTab === 'form'
                ? 'border-amber-500 text-slate-950 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Submit Listing Now
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`py-2 px-4 border-b-2 transition-colors ${
              activeTab === 'guide'
                ? 'border-amber-500 text-slate-950 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Blogger Form Configuration
          </button>
        </div>

        {activeTab === 'guide' ? (
          <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-950">
              <span className="font-bold">Blogger Integration Note:</span> Because Blogger.com is a static blog host without a custom backend database, business submission forms on Blogger are connected to a <strong>free Google Form</strong> or <strong>Google Apps Script</strong> that automatically saves submissions into a Google Sheet.
            </div>

            <h4 className="font-bold text-slate-900 text-sm">Recommended Google Form Setup:</h4>
            <ol className="list-decimal pl-4 space-y-1.5">
              <li>Open Google Forms (<a href="https://forms.google.com" target="_blank" rel="noreferrer" className="text-amber-900 font-bold underline">forms.google.com</a>).</li>
              <li>Create form fields: Business Name, Category, Area, Calling Phone, WhatsApp, Address, Timings.</li>
              <li>Get the form embed link or public URL.</li>
              <li>In your Blogger theme, replace the modal form action with your Google Form URL so every submission lands in your Google Sheet spreadsheet!</li>
            </ol>
            <button
              onClick={() => setActiveTab('form')}
              className="mt-3 px-4 py-2 bg-slate-950 text-amber-400 font-bold rounded-lg border border-slate-900 hover:bg-black"
            >
              Test Form Submission Live
            </button>
          </div>
        ) : isSuccess ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-lg font-bold text-slate-900">Listing Added Successfully!</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Your business &quot;{name}&quot; has been added to the local directory database and is now searchable and visible in the listings list.
            </p>
            <div className="pt-2">
              <button
                onClick={resetAndClose}
                className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 border border-amber-500 rounded-xl text-xs font-bold"
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
                placeholder="e.g. Awadh Diagnostics or Shahnai Marriage Lawn"
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
                  placeholder="e.g. Clinic, Pure Veg Dhaba, AC Lawn"
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
                placeholder="Shop No., Landmark, Khairabad, UP 261131"
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
                Business Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a clear description of your products, specialities or facilities in Khairabad..."
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
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 border border-amber-500 rounded-xl font-bold shadow-xs"
              >
                Submit Listing
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
