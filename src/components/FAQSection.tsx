import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  Building,
  HeartPulse,
  Landmark,
  PlusCircle,
  Navigation,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { CategoryId } from '../types/directory';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'health' | 'heritage' | 'transit' | 'business';
  keywords: string[];
}

const FAQS: FAQItem[] = [
  {
    id: 'pincode',
    question: 'What is the postal PIN code of Khairabad, Uttar Pradesh?',
    answer:
      'The official postal PIN code of Khairabad is 261131. Khairabad is a historic municipal board (Nagar Palika Parishad) in Sitapur district, Lucknow division, Uttar Pradesh, India.',
    category: 'general',
    keywords: ['pin code', 'pincode', 'postal code', 'district', 'sitapur', 'lucknow division'],
  },
  {
    id: 'hospitals',
    question: 'What are the major hospitals and medical emergency services in Khairabad?',
    answer:
      'Major healthcare institutions in Khairabad include BCM Hospital (Nawabpur Road / Biswan Road), Sitapur Eye Hospital Branch, the Community Health Centre (CHC Khairabad), and multiple 24/7 retail pharmacies and diagnostic clinics. For direct emergency ambulances, call 108 or 102.',
    category: 'health',
    keywords: ['hospital', 'bcm hospital', 'doctor', 'clinic', 'medical', 'emergency', 'ambulance'],
  },
  {
    id: 'heritage',
    question: 'What are the most famous historical and spiritual landmarks in Khairabad?',
    answer:
      'Khairabad is renowned for historic monuments dating back to the Mughal and Awadh periods, including the majestic Imambara Qadam Rasool, Chhota Imambara, the historic Badi Sangat, Dargah Hazrat Makhdoom Sheikh Saad, Dargah Hazrat Zahid, and the memorial sites of 1857 revolutionary polymath Allama Fazl-e-Haq Khairabadi.',
    category: 'heritage',
    keywords: ['history', 'heritage', 'qadam rasool', 'imambara', 'badi sangat', 'fazl-e-haq', 'monument'],
  },
  {
    id: 'connectivity',
    question: 'How is Khairabad connected by roads, highways, and railway?',
    answer:
      'Khairabad is situated directly on National Highway 24 (NH-24 Sitapur–Lucknow 4-lane corridor), just 8 km south of Sitapur district headquarters and approximately 80 km from Lucknow. State Highway 30 (SH-30) connects it eastward to Biswan and Bahraich. Khairabad Avadh railway station (KB) operates passenger trains along the Sitapur–Lucknow rail line.',
    category: 'transit',
    keywords: ['nh-24', 'sh-30', 'highway', 'distance', 'lucknow', 'railway station', 'transit', 'roads'],
  },
  {
    id: 'add-business',
    question: 'How can local business owners register their shop or service in Khairabad Directory?',
    answer:
      'Listing your business on Khairabad City Directory is 100% free. Click the "+ Suggest a Place" button in the top navigation or on any category block. Enter your business name, category, road/mohalla location, phone number, and timings. Verified entries receive a badge to help local customers discover you.',
    category: 'business',
    keywords: ['add business', 'free listing', 'register shop', 'promote', 'local directory'],
  },
  {
    id: 'markets',
    question: 'What are the main commercial markets and Chaurahas in Khairabad?',
    answer:
      'Primary shopping and commercial hubs include Nai Bazar Road, BCM Hospital Road, Purana Chauraha, Sabzi Mandi, Main Bazar, and the NH-24 Bypass Chauraha. These hubs feature grocery stores, electronics, apparel, sweet shops, and daily utilities.',
    category: 'general',
    keywords: ['market', 'bazar', 'chauraha', 'nai bazar', 'shopping', 'commercial'],
  },
];

interface FAQSectionProps {
  onSelectCategory?: (category: CategoryId) => void;
  onOpenAddModal?: () => void;
  onOpenRoads?: () => void;
  onOpenBlog?: () => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  onSelectCategory,
  onOpenAddModal,
  onOpenRoads,
  onOpenBlog,
}) => {
  const [openId, setOpenId] = useState<string>('pincode');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'general' | 'health' | 'heritage' | 'transit' | 'business'>('all');

  const filteredFaqs = FAQS.filter(
    (item) => selectedFilter === 'all' || item.category === selectedFilter
  );

  return (
    <section
      className="py-12 px-4 sm:px-6 max-w-7xl mx-auto"
      id="khairabad-faq"
      aria-label="Khairabad Frequently Asked Questions"
    >
      <div className="bg-gradient-to-b from-amber-50/60 to-white border border-amber-200/70 rounded-3xl p-6 sm:p-10 shadow-xs">
        {/* Header */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-950 border border-amber-300 text-xs font-bold mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-amber-800" />
            <span>Google Search FAQ &amp; Quick Facts</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
            Frequently Asked Questions about Khairabad, Sitapur
          </h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Quick, verified answers to top Google search queries regarding Khairabad&#39;s PIN code (261131), healthcare facilities, connectivity, heritage, and local business registration.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {[
            { id: 'all', label: 'All Questions' },
            { id: 'general', label: 'PIN & City Info' },
            { id: 'health', label: 'Hospitals & Medical' },
            { id: 'transit', label: 'Roads & Highways' },
            { id: 'heritage', label: 'Heritage & History' },
            { id: 'business', label: 'List Your Business' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id as any)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                selectedFilter === tab.id
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-amber-50 hover:border-amber-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isOpen
                    ? 'bg-white border-amber-400 shadow-sm'
                    : 'bg-white/80 border-slate-200 hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? '' : faq.id)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-slate-900"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-extrabold text-slate-900 pr-2">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'bg-amber-100 text-amber-900 rotate-180' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    <p>{faq.answer}</p>

                    {/* Contextual actions */}
                    <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-slate-100">
                      {faq.category === 'health' && onSelectCategory && (
                        <button
                          onClick={() => onSelectCategory('hospitals')}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-950 underline"
                        >
                          <HeartPulse className="w-3.5 h-3.5" />
                          <span>View Khairabad Hospitals &rarr;</span>
                        </button>
                      )}
                      {faq.category === 'transit' && onOpenRoads && (
                        <button
                          onClick={onOpenRoads}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-950 underline"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>Explore Roads &amp; Transit Page &rarr;</span>
                        </button>
                      )}
                      {faq.category === 'heritage' && onOpenBlog && (
                        <button
                          onClick={onOpenBlog}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-950 underline"
                        >
                          <Landmark className="w-3.5 h-3.5" />
                          <span>Read Khairabad Heritage Articles &rarr;</span>
                        </button>
                      )}
                      {faq.category === 'business' && onOpenAddModal && (
                        <button
                          onClick={onOpenAddModal}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-950 underline"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>+ Add Your Business Now &rarr;</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Local SEO summary footer badge */}
        <div className="mt-8 pt-6 border-t border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Official Community Data Portal for <strong>Khairabad, Sitapur (PIN 261131), Uttar Pradesh</strong>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-medium text-slate-600">Coordinates: 27.5319&deg; N, 80.7554&deg; E</span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="font-medium text-slate-600">Elevation: 138 m</span>
          </div>
        </div>
      </div>
    </section>
  );
};
