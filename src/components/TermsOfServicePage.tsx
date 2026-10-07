import React, { useEffect } from 'react';
import { ArrowLeft, FileCheck, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

interface TermsOfServicePageProps {
  onBack: () => void;
}

export const TermsOfServicePage: React.FC<TermsOfServicePageProps> = ({ onBack }) => {
  useEffect(() => {
    document.title = 'Terms of Service | Khairabad City Directory';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => {
      document.title = 'Khairabad Directory & Heritage – Notable People & City Guide';
    };
  }, []);

  return (
    <div className="py-10 px-4 sm:px-6 max-w-4xl mx-auto space-y-8 text-slate-800">
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
          <FileCheck className="w-3.5 h-3.5 text-amber-700" />
          <span>Public Community Portal Agreement</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Last Updated: October 2026
        </p>
      </header>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-8 shadow-sm text-xs sm:text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold font-display text-slate-900">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using the <strong>Khairabad City Directory</strong> website, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please discontinue using this portal.
          </p>
        </section>

        <section className="space-y-3 bg-amber-50/60 p-5 rounded-2xl border border-amber-200">
          <h2 className="text-lg font-bold font-display text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            <span>2. Directory Disclaimer &amp; Verification Notice</span>
          </h2>
          <p className="text-slate-800">
            The Khairabad City Directory is a community information resource. While we endeavor to keep all information current and accurate:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
            <li>Hospital timings, doctor availability, ambulance contact numbers, and shop hours are subject to change without prior notice.</li>
            <li>Users are strongly advised to verify critical emergency and medical details by phone prior to dispatch or travel.</li>
            <li>This directory is an independent civic portal and is not an official branch of the Government of Uttar Pradesh or the Khairabad Nagar Palika Parishad.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold font-display text-slate-900">
            3. Business Submissions &amp; User Reviews
          </h2>
          <p>
            When submitting a business, suggesting an edit, or leaving a community review:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
            <li>You agree to submit authentic, non-deceptive, and lawful information.</li>
            <li>Defamatory, hateful, abusive, or fraudulent reviews are strictly prohibited and subject to immediate removal.</li>
            <li>Business owners may claim their listing to verify or update their telephone, WhatsApp, or address information at any time.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold font-display text-slate-900">
            4. Advertisements &amp; Sponsored Links (Google AdSense)
          </h2>
          <p>
            This website displays advertisements provided by Google AdSense and third-party advertising partners to cover hosting and maintenance costs. Inclusion of an ad or sponsored link does not imply endorsement of the advertised product or service by Khairabad City Directory.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold font-display text-slate-900">
            5. Intellectual Property
          </h2>
          <p>
            The website design, custom software code, compiled historical biographies (including articles on Allama Fazl-e-Haq Khairabadi, Muztar Khairabadi, and Jan Nisar Akhtar), and logo marks are protected under applicable Indian copyright and intellectual property laws.
          </p>
        </section>

        <section className="space-y-3 border-t border-slate-200 pt-6">
          <h2 className="text-lg font-bold font-display text-slate-900">
            6. Contact &amp; Grievances
          </h2>
          <p>
            For legal inquiries, listing removals, or corrections, please contact: <a href="mailto:connect.aftabmohd@gmail.com" className="text-amber-800 font-bold underline">connect.aftabmohd@gmail.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
};
