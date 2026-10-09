import React, { useEffect } from 'react';
import { ArrowLeft, Shield, Lock, Eye, Cookie, FileText, Mail, MapPin } from 'lucide-react';

interface PrivacyPolicyPageProps {
  onBack: () => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onBack }) => {
  useEffect(() => {
    document.title = 'Privacy Policy | Khairabad City Directory';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => {
      document.title = 'Khairabad Directory & Heritage – Notable People & City Guide';
    };
  }, []);

  return (
    <div className="py-10 px-4 sm:px-6 max-w-4xl mx-auto space-y-8 text-slate-800">
      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-amber-800 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>&larr; Back to Directory</span>
        </button>
      </div>

      <header className="space-y-3 border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full">
          <Shield className="w-3.5 h-3.5 text-amber-700" />
          <span>Privacy Policy &amp; DPDP Compliance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Last Updated: October 2026 · Effective Date: October 7, 2026
        </p>
      </header>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-8 shadow-sm text-xs sm:text-sm leading-relaxed">
        {/* Introduction */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold font-display text-slate-900 flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-600" />
            <span>1. Introduction &amp; Scope</span>
          </h2>
          <p>
            Welcome to <strong>Khairabad City Directory</strong> (accessible via this portal). We respect your privacy and are committed to protecting the personal data of our visitors, business owners, and citizens. This Privacy Policy outlines how information is collected, used, and safeguarded in accordance with applicable laws, including the <strong>Digital Personal Data Protection Act (DPDP Act, India)</strong> and the <strong>General Data Protection Regulation (GDPR)</strong>.
          </p>
        </section>

        {/* Cookies & Local Storage Disclosure */}
        <section className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <h2 className="text-lg font-bold font-display text-slate-900 flex items-center gap-2 text-slate-900">
            <Cookie className="w-4 h-4 text-amber-700" />
            <span>2. Cookies &amp; Local Storage</span>
          </h2>
          <p className="text-slate-800">
            This website utilizes minimal standard cookies and browser local storage to provide a seamless directory experience for visitors.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-700">
            <li>
              <strong>Third-Party Vendor Ad Serving:</strong> Google, as a third-party vendor, uses cookies to serve ads on this website.
            </li>
            <li>
              <strong>DoubleClick DART Cookie:</strong> Google&#39;s use of the DART cookie enables it and its partner ad networks to serve advertisements to our users based on their visits to this site and other websites on the Internet.
            </li>
            <li>
              <strong>Personalized Advertising Opt-Out:</strong> Users may opt out of personalized advertising by visiting{' '}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-800 font-bold underline hover:text-amber-950"
              >
                Google Ads Settings (https://adssettings.google.com)
              </a>.
            </li>
            <li>
              Alternatively, users can opt out of a third-party vendor&#39;s use of cookies for personalized advertising by visiting the Network Advertising Initiative opt-out page at{' '}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-800 font-bold underline hover:text-amber-950"
              >
                www.aboutads.info
              </a>.
            </li>
          </ul>
        </section>

        {/* Information We Collect */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold font-display text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-600" />
            <span>3. Information We Collect</span>
          </h2>
          <p>
            When you interact with the Khairabad City Directory, we may collect the following types of information:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <strong className="text-slate-900 block font-semibold">User-Submitted Business Information</strong>
              <p className="text-slate-600 text-xs">
                Business name, phone number, WhatsApp contact, category, locality, address, and timings submitted when suggesting or claiming a listing.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <strong className="text-slate-900 block font-semibold">Public User Reviews &amp; Ratings</strong>
              <p className="text-slate-600 text-xs">
                Reviewer name, star rating, feedback comment, and date submitted for community businesses.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <strong className="text-slate-900 block font-semibold">Local Browser Storage (LocalStorage)</strong>
              <p className="text-slate-600 text-xs">
                Saved favorites bookmarks and cookie consent preferences stored solely on your local device.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <strong className="text-slate-900 block font-semibold">Log Files &amp; Technical Telemetry</strong>
              <p className="text-slate-600 text-xs">
                Standard web server log files including IP address, browser type, referring pages, date/time stamps, and ISP data.
              </p>
            </div>
          </div>
        </section>

        {/* How We Use Your Information */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold font-display text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600" />
            <span>4. How We Use Information</span>
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
            <li>To operate and maintain the Khairabad public community directory.</li>
            <li>To verify local business listings, hospital details, and emergency contacts.</li>
            <li>To deliver relevant civic news, weather forecasts, and historical place guides.</li>
            <li>To prevent fraud, spam reviews, and unauthorized listing tampering.</li>
          </ul>
        </section>

        {/* Third-Party Links & Services */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold font-display text-slate-900">
            5. Third-Party Services &amp; External Links
          </h2>
          <p>
            Our website contains links to external sites, including Google Maps, Open-Meteo, WhatsApp Web, and government portals (such as the Khairabad Nagar Palika Parishad website). We do not control and are not responsible for the privacy practices or content of third-party platforms. We encourage you to review their respective privacy policies.
          </p>
        </section>

        {/* Children's Privacy */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold font-display text-slate-900">
            6. Children&#39;s Online Privacy (COPPA &amp; POCSO Compliance)
          </h2>
          <p>
            Khairabad City Directory is a general public community information guide. We do not knowingly collect personal identifiable information from children under the age of 13. If you believe your child has submitted personal details on our portal, please contact us immediately to have it purged.
          </p>
        </section>

        {/* Contact Us & Grievance Redressal */}
        <section className="space-y-3 border-t border-slate-200 pt-6">
          <h2 className="text-lg font-bold font-display text-slate-900 flex items-center gap-2">
            <Mail className="w-4 h-4 text-amber-600" />
            <span>7. Contact Information &amp; Grievance Officer</span>
          </h2>
          <p>
            If you have questions regarding this Privacy Policy or wish to request correction or removal of your listing, please contact our community desk:
          </p>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs text-slate-700">
            <div className="font-bold text-slate-900">Khairabad City Directory &amp; Heritage Portal</div>
            <div className="flex items-center gap-2 text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>Khairabad, Sitapur District, Uttar Pradesh – PIN 261131, India</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Mail className="w-3.5 h-3.5 text-amber-600" />
              <span>Publisher Email: <a href="mailto:connect.aftabmohd@gmail.com" className="text-amber-800 underline font-semibold">connect.aftabmohd@gmail.com</a></span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
