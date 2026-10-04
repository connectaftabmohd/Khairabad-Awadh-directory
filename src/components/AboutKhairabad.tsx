import React from 'react';
import { MapPin, Landmark, BookOpen, Compass, Train, ShieldCheck } from 'lucide-react';
import { KHAIRABAD_CITY_INFO } from '../data/khairabadData';

export const AboutKhairabad: React.FC = () => {
  return (
    <div className="py-10 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
      {/* Title & Key Metrics */}
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

        {/* Fact Sheet Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 text-left">
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Postal PIN</span>
            <span className="text-base font-bold text-slate-900">261131</span>
          </div>
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">District</span>
            <span className="text-base font-bold text-slate-900">Sitapur, UP</span>
          </div>
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">STD Code</span>
            <span className="text-base font-bold text-slate-900">05862</span>
          </div>
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Railway Code</span>
            <span className="text-base font-bold text-slate-900">KB (Khairabad)</span>
          </div>
        </div>
      </div>

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
        <h2 className="text-2xl font-bold font-display text-white">
          Connectivity to Lucknow, Sitapur & Delhi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300 pt-2 leading-relaxed">
          <div className="space-y-1">
            <h4 className="font-bold text-white text-sm">Road & Highway (NH-30)</h4>
            <p>
              Situated directly alongside National Highway 30 (old NH-24), Khairabad enjoys seamless 24/7 bus connectivity to Lucknow (80 km south) and Bareilly / New Delhi to the north.
            </p>
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-white text-sm">Railway Station (KB)</h4>
            <p>
              Khairabad Avadh Railway Station provides direct passenger train connections on the Sitapur–Lucknow and Sitapur–Mailani lines under Northern and North Eastern Railway.
            </p>
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-white text-sm">Local Transit</h4>
            <p>
              Frequent shared battery e-rickshaws and auto-rickshaws commute continuously between Khairabad Chungi Naka and Sitapur city centre within 15 minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
