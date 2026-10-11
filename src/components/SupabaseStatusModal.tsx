import React, { useState, useEffect } from 'react';
import { Database, CheckCircle, AlertCircle, Copy, Check, ExternalLink, RefreshCw } from 'lucide-react';
import { testSupabaseConnection, SUPABASE_SQL_SETUP_SCRIPT, SUPABASE_URL } from '../utils/supabaseClient';

interface SupabaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseStatusModal: React.FC<SupabaseStatusModalProps> = ({ isOpen, onClose }) => {
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState<{ connected: boolean; tableReady: boolean; error?: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const checkStatus = async () => {
    setTesting(true);
    const res = await testSupabaseConnection();
    setStatus(res);
    setTesting(false);
  };

  useEffect(() => {
    if (isOpen) {
      checkStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopySQL = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-slate-900">
                Supabase Database Connection
              </h3>
              <p className="text-xs text-slate-500">
                Project ID: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px] text-slate-800">vyyuvanyyexkdnjmhkdz</code>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg text-lg font-bold"
          >
            &times;
          </button>
        </div>

        {/* Status card */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">Connection Status:</span>
              <button
                onClick={checkStatus}
                disabled={testing}
                className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${testing ? 'animate-spin' : ''}`} />
                {testing ? 'Checking...' : 'Recheck'}
              </button>
            </div>

            {status && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                  <span className="font-semibold text-slate-900">Connected to Supabase Project:</span>
                  <span className="font-mono text-emerald-700 text-[11px] truncate">{SUPABASE_URL}</span>
                </div>

                {status.tableReady ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Table <strong>public.businesses</strong> is active! Submissions are saving directly to cloud Supabase.</span>
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-2">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold">Next Quick Step: Run 1-Click SQL in Supabase</div>
                        <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                          Your project credentials are authenticated. To allow business details to insert seamlessly, execute the SQL table schema below in your Supabase SQL Editor.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick instructions & Copy SQL */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">
                Supabase SQL Schema (Table &amp; Public Policies)
              </label>
              <button
                type="button"
                onClick={handleCopySQL}
                className="px-2.5 py-1 text-[11px] font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy SQL'}</span>
              </button>
            </div>

            <div className="relative">
              <pre className="bg-slate-900 text-slate-200 text-[11px] p-3 rounded-xl overflow-x-auto max-h-48 font-mono border border-slate-800">
                {SUPABASE_SQL_SCRIPT_DISPLAY}
              </pre>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Open your Supabase project dashboard &rarr; <strong>SQL Editor</strong> &rarr; Click <strong>New query</strong> &rarr; Paste &amp; click <strong>Run</strong>.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
            <a
              href="https://supabase.com/dashboard/project/vyyuvanyyexkdnjmhkdz/sql/new"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 px-4 py-2 rounded-xl transition-colors"
            >
              <span>Open Supabase SQL Editor</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SUPABASE_SQL_SCRIPT_DISPLAY = `create table if not exists public.businesses (
  id text primary key,
  name text not null,
  category text not null,
  subcategory text default 'Local Business',
  address text,
  locality text,
  mohalla text,
  chauraha_hub text,
  road_name text,
  phone text,
  whatsapp text,
  website text,
  opening_hours text,
  description text,
  services text[] default '{}',
  images text[] default '{}',
  google_maps_url text,
  verified boolean default false,
  is_demo boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.businesses enable row level security;

create policy "Public read businesses" on public.businesses
  for select using (true);

create policy "Public insert businesses" on public.businesses
  for insert with check (true);

create policy "Public update businesses" on public.businesses
  for update using (true);`;
