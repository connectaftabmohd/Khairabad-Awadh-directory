import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode, Database, HelpCircle, CheckCircle, ExternalLink } from 'lucide-react';

interface BloggerExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BloggerExportModal: React.FC<BloggerExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'theme' | 'database' | 'instructions' | 'seo'>('theme');
  const [copiedTheme, setCopiedTheme] = useState(false);
  const [copiedDb, setCopiedDb] = useState(false);

  if (!isOpen) return null;

  const handleCopyTheme = async () => {
    try {
      const res = await fetch('/blogger-theme.xml');
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setCopiedTheme(true);
      setTimeout(() => setCopiedTheme(false), 2500);
    } catch (e) {
      alert('Could not copy automatically. You can download the file directly!');
    }
  };

  const handleDownloadTheme = () => {
    const a = document.createElement('a');
    a.href = '/blogger-theme.xml';
    a.download = 'khairabad-blogger-theme.xml';
    a.click();
  };

  const handleCopyDatabase = async () => {
    try {
      const res = await fetch('/khairabad-database.js');
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setCopiedDb(true);
      setTimeout(() => setCopiedDb(false), 2500);
    } catch (e) {
      alert('Could not copy automatically. You can download the file directly!');
    }
  };

  const handleDownloadDb = () => {
    const a = document.createElement('a');
    a.href = '/khairabad-database.js';
    a.download = 'khairabad-database.js';
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-950 border border-amber-300 text-[10px] font-bold uppercase tracking-wider">
                Blogger.com Ready
              </span>
              <h3 className="text-xl font-bold font-display text-slate-900">
                Blogger Deployment &amp; Export Kit
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              100% compatible theme, standalone JSON database, and zero-server Blogger installation guide.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200 mt-4 text-xs font-semibold overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab('theme')}
            className={`py-2.5 px-4 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'theme'
                ? 'border-amber-500 text-slate-950 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>1. Blogger Theme XML</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`py-2.5 px-4 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'database'
                ? 'border-amber-500 text-slate-950 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>2. Database JS (JSON)</span>
          </button>

          <button
            onClick={() => setActiveTab('instructions')}
            className={`py-2.5 px-4 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'instructions'
                ? 'border-amber-500 text-slate-950 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>3. Step-by-Step Setup Guide</span>
          </button>

          <button
            onClick={() => setActiveTab('seo')}
            className={`py-2.5 px-4 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'seo'
                ? 'border-amber-500 text-slate-950 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>4. SEO &amp; Discovery</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="py-5 flex-1 space-y-4 text-xs">
          {activeTab === 'theme' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl text-amber-950">
                <div className="space-y-0.5">
                  <div className="font-bold">File: blogger-theme.xml</div>
                  <div className="text-[11px] text-amber-900">
                    Self-contained Blogger XML template with Tailwind CSS CDN, mobile responsive layout, search filter engine, and modal popups.
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyTheme}
                    className="px-3.5 py-2 bg-slate-950 hover:bg-black text-amber-400 font-bold border border-slate-900 rounded-lg flex items-center gap-1.5 shadow-sm"
                  >
                    {copiedTheme ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedTheme ? 'Copied XML!' : 'Copy Theme XML'}</span>
                  </button>
                  <button
                    onClick={handleDownloadTheme}
                    className="px-3.5 py-2 border border-amber-300 hover:bg-white text-slate-900 rounded-lg font-bold flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .xml</span>
                  </button>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl bg-slate-900 text-slate-300 p-4 font-mono text-[11px] max-h-72 overflow-y-auto">
                <div className="text-slate-500 mb-2">// Preview of blogger-theme.xml:</div>
                <pre className="whitespace-pre-wrap">{`<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE html>
<html b:css='false' b:defaultwidgetversion='2' b:layoutsversion='3' xmlns='http://www.w3.org/1999/xhtml' ...>
<head>
  <meta charset='UTF-8'/>
  <meta content='width=device-width, initial-scale=1.0' name='viewport'/>
  <title><data:blog.pageTitle/></title>
  ...
  <!-- Tailwind CSS via CDN for 100% Zero-Dependency Blogger Rendering -->
  <script src='https://cdn.tailwindcss.com'></script>
  ...
  <!-- Embedded Khairabad Database & Search Engine -->
  <script>
    var KHAIRABAD_DATA = { ... };
  </script>
</head>
<body class='bg-slate-50 text-slate-900 font-sans'>
  ...
</body>
</html>`}</pre>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-slate-600">
                <span className="font-semibold text-slate-800">Quick Blogger Install:</span>
                <p>1. Open your blog at Blogger.com &rarr; Click <strong>Theme</strong>.</p>
                <p>2. Click dropdown arrow next to Customize &rarr; <strong>Edit HTML</strong>.</p>
                <p>3. Select all &rarr; Delete &rarr; Paste this XML &rarr; Click <strong>Save</strong>.</p>
              </div>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950">
                <div className="space-y-0.5">
                  <div className="font-bold">File: khairabad-database.js</div>
                  <div className="text-[11px] text-emerald-800">
                    Standalone JavaScript dataset with structured listings, localities, and emergency contacts.
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyDatabase}
                    className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-sm"
                  >
                    {copiedDb ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedDb ? 'Copied JS!' : 'Copy Database JS'}</span>
                  </button>
                  <button
                    onClick={handleDownloadDb}
                    className="px-3.5 py-2 border border-emerald-300 hover:bg-white text-emerald-900 rounded-lg font-semibold flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .js</span>
                  </button>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl bg-slate-900 text-slate-300 p-4 font-mono text-[11px] max-h-72 overflow-y-auto">
                <pre className="whitespace-pre-wrap">{`window.KHAIRABAD_CITY_DB = {
  city: "Khairabad",
  district: "Sitapur",
  state: "Uttar Pradesh",
  pincode: "261131",
  listings: [
    {
      id: "kh-hosp-001",
      name: "Community Health Centre (CHC) Khairabad",
      category: "hospitals",
      locality: "Civil Lines / Block Colony",
      phone: "05862-252100",
      hours: "24 Hours Emergency",
      ...
    }
  ]
};`}</pre>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 space-y-1">
                <span className="font-semibold text-slate-800">How to add a new business:</span>
                <p>Simply copy any listing object in the array, change the name, category, locality, phone, and address, and save your theme.</p>
              </div>
            </div>
          )}

          {activeTab === 'instructions' && (
            <div className="space-y-4 leading-relaxed text-slate-700">
              <h4 className="font-bold text-slate-900 text-sm">Step-by-Step Blogger Setup</h4>
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <div className="font-bold text-amber-900 mb-1">Step 1: Backup Current Theme</div>
                  <p>In Blogger.com, navigate to <strong>Theme</strong> &rarr; Click the arrow next to <strong>CUSTOMIZE</strong> &rarr; <strong>Backup</strong> &rarr; <strong>Download</strong>.</p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <div className="font-bold text-amber-900 mb-1">Step 2: Install Khairabad City Theme</div>
                  <p>Click arrow next to <strong>CUSTOMIZE</strong> &rarr; <strong>Edit HTML</strong> &rarr; Select all code and replace with <code>blogger-theme.xml</code> &rarr; Click the <strong>Save</strong> floppy icon.</p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <div className="font-bold text-amber-900 mb-1">Step 3: Connect Google Forms for Submissions</div>
                  <p>Create a Google Form with fields: Business Name, Category, Locality, Phone, Address. Replace the submission URL in the theme with your Google Form action URL.</p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <div className="font-bold text-amber-900 mb-1">Step 4: Enable HTTPS</div>
                  <p>In Blogger <strong>Settings</strong> &rarr; Ensure <strong>HTTPS Availability</strong> and <strong>HTTPS Redirect</strong> are turned ON.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-4 text-slate-700">
              <h4 className="font-bold text-slate-900 text-sm">SEO &amp; Search Engine Discovery Checklist</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Target Local Keywords</span>
                  </div>
                  <p className="text-slate-600">
                    Already included in HTML meta tags: &quot;Khairabad Uttar Pradesh&quot;, &quot;Khairabad city directory&quot;, &quot;Khairabad marriage lawns&quot;, &quot;CHC Khairabad&quot;.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Schema.org Structured Data</span>
                  </div>
                  <p className="text-slate-600">
                    JSON-LD WebSite and LocalBusiness schema included to help Google display rich search result snippets and sitelinks.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Fast Mobile Responsive Layout</span>
                  </div>
                  <p className="text-slate-600">
                    Fully optimized for Indian mobile web browsers with bottom navigation bar, quick call buttons, and fast loading speed.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Google Search Console</span>
                  </div>
                  <p className="text-slate-600">
                    Submit your blog&#39;s auto-generated sitemap at <code>/sitemap.xml</code> to Google Search Console to index all pages within 48 hours.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800"
          >
            Close Export Kit
          </button>
        </div>
      </div>
    </div>
  );
};
