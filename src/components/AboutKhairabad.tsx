import React from 'react';
import { MapPin, Landmark, BookOpen, Compass, Train, ShieldCheck, Award, Feather, Flame, ArrowRight } from 'lucide-react';
import { KHAIRABAD_CITY_INFO } from '../data/khairabadData';
import { KhairabadTownInfobox } from './KhairabadTownInfobox';

interface AboutKhairabadProps {
  onViewBlog?: () => void;
  onViewRoads?: () => void;
}

export const AboutKhairabad: React.FC<AboutKhairabadProps> = ({ onViewBlog, onViewRoads }) => {
  return (
    <div className="py-10 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
      {/* Title & Introduction */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-950 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full mb-3">
          <Landmark className="w-3.5 h-3.5 text-amber-800" />
          <span>Heritage City Profile</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 mb-3">
          About Khairabad, Uttar Pradesh
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          An ancient municipal town of intellectual distinction, spiritual harmony, and vibrant commercial heritage situated in the historic Awadh heartland of Sitapur district.
        </p>
      </div>

      {/* Official Municipal Infobox & Factsheet (based on official records / image.png) */}
      <KhairabadTownInfobox />

      {/* Visual Feature 1: Badi Sangat & History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-8 rounded-3xl border border-slate-200">
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700">
            <BookOpen className="w-4 h-4" />
            <span>Historical Legacy & Mughal Sarkar</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-slate-900">
            Centuries of Scholarly & Cultural Prominence
          </h2>
          <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
            <p>
              According to regional records, Khairabad was founded in the early 11th century by Raja Khaira Pasi. Under the reign of Mughal Emperor Akbar, Khairabad was designated as the headquarters of a prominent <em>Sarkar</em> within the Subah of Awadh, as chronicled in Abu&#39;l-Fazl&#39;s <em>Ain-i-Akbari</em>.
            </p>
            <p>
              In the 18th and 19th centuries, Khairabad developed into one of Northern India&#39;s foremost academies for traditional Islamic logic (<em>mantiq</em>), philosophy, jurisprudence, and poetry. It was the ancestral hometown of celebrated polymath and 1857 freedom revolutionary <strong>Allama Fazl-e-Haq Khairabadi</strong>.
            </p>
          </div>
        </div>

        <div className="lg:col-span-6 overflow-hidden rounded-2xl border border-slate-200 shadow-md">
          <img
            src="/src/assets/images/khairabad_badi_sangat_1791046924123.jpg"
            alt="Historic Badi Sangat architecture in Khairabad"
            referrerPolicy="no-referrer"
            className="w-full h-72 object-cover"
          />
          <div className="p-3 bg-slate-900 text-white text-[11px] flex justify-between items-center">
            <span>Historic Badi Sangat Mandir Pavilion, Khairabad</span>
            <span className="text-slate-400">17th-Century Heritage</span>
          </div>
        </div>
      </div>

      {/* Featured Notable People & Literary Dynasty Section */}
      <div className="bg-gradient-to-br from-amber-50 via-white to-amber-50/70 border-2 border-amber-300 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-200 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
              <Award className="w-4 h-4 text-amber-700" />
              <span>Notable People of Khairabad</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
              The Legendary Lineage of Freedom &amp; Urdu Poetry
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Khairabad is the ancestral home of a world-renowned intellectual and poetic dynasty spanning 1857 Indian independence, classical Urdu ghazals, and Indian cinema.
            </p>
          </div>

          {onViewBlog && (
            <button
              onClick={onViewBlog}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors border border-amber-500 shadow-2xs shrink-0 self-start sm:self-center"
            >
              <span>Read Full Blog Post</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Fazl-e-Haq Khairabadi */}
          <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                  1796–1861 · Freedom Fighter
                </span>
                <Flame className="w-4 h-4 text-red-600" />
              </div>
              <h3 className="font-bold text-base font-display text-slate-900 leading-tight">
                Fazl-e-Haq Khairabadi
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Indian scholar and 1857 freedom struggle revolutionary. Master of Islamic logic (<em>mantiq</em>), Chief Judge of Delhi, close confidant of poet Mirza Ghalib. Issued the historic rebellion fatwa uniting soldiers against British East India Company rule; exiled to Andaman Cellular Jail where he wrote <em>Al-Thawrat al-Hindiyya</em> before attaining martyrdom.
              </p>
            </div>
            <div className="text-[11px] text-amber-950 bg-amber-50 p-2.5 rounded-xl border border-amber-100 font-medium">
              ★ Issued 1857 rebellion fatwa &amp; Cellular Jail martyr
            </div>
          </div>

          {/* Muztar Khairabadi */}
          <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                  1865–1927 · Urdu Master Poet
                </span>
                <Feather className="w-4 h-4 text-amber-600" />
              </div>
              <h3 className="font-bold text-base font-display text-slate-900 leading-tight">
                Muztar Khairabadi
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Grandson of Fazl-e-Haq Khairabadi. Celebrated classical Urdu poet bestowed with the titles <em>E&#39;tibar-ul-Mulk</em> and <em>Iftekhar-ush-Shu&#39;ara</em>. Author of <em>Nazr-e-Khairabad</em> and <em>Bahar-e-Hind</em>, and composer of the immortal ghazal <em>&quot;Na Kisi Ki Aankh Ka Noor Hoon&quot;</em>.
              </p>
            </div>
            <div className="text-[11px] text-amber-950 bg-amber-50 p-2.5 rounded-xl border border-amber-100 font-medium">
              ★ Author of <em>&quot;Na Kisi Ki Aankh Ka Noor Hoon&quot;</em>
            </div>
          </div>

          {/* Jan Nisar Akhtar */}
          <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                  1914–1976 · Sahitya Akademi Laureate
                </span>
                <Award className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="font-bold text-base font-display text-slate-900 leading-tight">
                Jan Nisar Akhtar
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Son of Muztar Khairabadi and father of legendary screenwriter-lyricist <strong>Javed Akhtar</strong>. Progressive Urdu poet, Sahitya Akademi Award winner for <em>Khak-e-Dil</em> (1976), and legendary Bollywood lyricist who penned golden-age classics for <em>Prem Parbat</em>, <em>C.I.D.</em>, and <em>Bahu Begum</em>.
              </p>
            </div>
            <div className="text-[11px] text-amber-950 bg-amber-50 p-2.5 rounded-xl border border-amber-100 font-medium">
              ★ Father of Javed Akhtar · Sahitya Akademi Winner
            </div>
          </div>
        </div>

        <div className="p-3 bg-slate-900 text-white rounded-2xl text-xs flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <span>
            <strong>Living Cultural Legacy:</strong> Javed Akhtar (Padma Bhushan) &rarr; Farhan Akhtar &amp; Zoya Akhtar continue this illustrious Khairabadi artistic heritage.
          </span>
          {onViewBlog && (
            <button
              onClick={onViewBlog}
              className="text-amber-400 font-bold hover:underline shrink-0"
            >
              Explore Full Biography &rarr;
            </button>
          )}
        </div>
      </div>

      {/* Visual Feature 2: Spiritual Ganga-Jamuni Heritage & Market */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-8 rounded-3xl border border-slate-200">
        <div className="lg:col-span-6 order-2 lg:order-1 overflow-hidden rounded-2xl border border-slate-200 shadow-md">
          <img
            src="/src/assets/images/khairabad_market_street_1791046938937.jpg"
            alt="Traditional marketplace street in Khairabad"
            referrerPolicy="no-referrer"
            className="w-full h-72 object-cover"
          />
          <div className="p-3 bg-slate-900 text-white text-[11px] flex justify-between items-center">
            <span>Khairabad Bazaar & Traditional Handloom Market</span>
            <span className="text-slate-400">Cotton & Durrie Heritage</span>
          </div>
        </div>

        <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-800">
            <Compass className="w-4 h-4" />
            <span>Spiritual Harmony & Handloom Heritage</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-slate-900">
            A Living Tapestry of Faiths & Craftsmanship
          </h2>
          <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
            <p>
              Khairabad represents India&#39;s harmonious Ganga-Jamuni tehzeeb. The town is home to the peaceful 17th-century <strong>Badi Sangat Mandir complex</strong>, founded by saint Baba Sahajram, as well as renowned Sufi pilgrimage centres such as the 15th-century <strong>Dargah of Hazrat Makhdoom Sheikh Saaduddin</strong> and the historic <strong>Qadam Rasul shrine</strong>.
            </p>
            <p>
              The town has also historically been a renowned centre for fine handwoven cotton fabrics and traditional floor coverings (durries), which local artisans continue to weave in family workshops across Khairabad&#39;s traditional mohallas.
            </p>
          </div>
        </div>
      </div>

      {/* Geography & Connectivity */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
          <Train className="w-4 h-4" />
          <span>Geography & Strategic Transport</span>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 className="text-2xl font-bold font-display text-white">
            Connectivity to Lucknow, Sitapur &amp; Delhi
          </h2>
          {onViewRoads && (
            <button
              onClick={onViewRoads}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-colors shrink-0 shadow-sm flex items-center gap-1.5"
            >
              <span>Explore Main Roads Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300 pt-2 leading-relaxed">
          <div className="space-y-1">
            <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
              <span>🛣️ NH-24 / Sitapur Road</span>
            </h4>
            <p>
              National Highway 24 (NH-30) connects Khairabad directly to Lucknow (~80 km) and Sitapur (~8 km). Anchors Khairabad Chauraha and the Barabhari Toll Plaza with round-the-clock passenger buses.
            </p>
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
              <span>🏙️ Inner Commercial Corridors</span>
            </h4>
            <p>
              Inner-city lifelines include BCM Road (housing BCM Hospital and City Optical), Bahraich Road (near RTO Sitapur &amp; Hira Market), Post Office Road (Purani Bazar link), and Nai Bazar Road (Joshitola retail hub).
            </p>
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
              <span>🚆 Rail &amp; Local Transit</span>
            </h4>
            <p>
              Khairabad Avadh Railway Station (KB) connects to Lucknow Charbagh and Mailani. Fleets of battery e-rickshaws shuttle between Chungi Naka and all 9 municipal wards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
