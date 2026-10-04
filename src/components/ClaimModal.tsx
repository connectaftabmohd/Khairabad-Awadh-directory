import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle } from 'lucide-react';
import { CityListing } from '../types/directory';

interface ClaimModalProps {
  isOpen: boolean;
  listing: CityListing | null;
  mode: 'claim' | 'report';
  onClose: () => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({
  isOpen,
  listing,
  mode,
  onClose,
}) => {
  const [ownerName, setOwnerName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !listing) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
          <h3 className="text-base font-bold font-display text-slate-900">
            {mode === 'claim' ? 'Claim Business Ownership' : 'Report Incorrect Information'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-6 space-y-3 text-xs text-slate-600">
            <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="text-base font-bold text-slate-900">
              {mode === 'claim' ? 'Claim Request Submitted' : 'Report Received'}
            </h4>
            <p>
              Thank you. Our directory editorial desk will review the details for <strong>{listing.name}</strong> and contact you at {contactPhone}.
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-5 py-2 bg-slate-950 text-amber-400 font-bold border border-slate-900 rounded-xl"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs text-slate-700">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-[11px] text-slate-500 uppercase font-semibold">Selected Listing:</div>
              <div className="font-bold text-slate-900 text-sm">{listing.name}</div>
              <div className="text-slate-500">{listing.locality}</div>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-800">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Business Owner / Citizen Name"
                className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-800">
                Contact Phone / WhatsApp *
              </label>
              <input
                type="tel"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="Phone number for verification call"
                className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-800">
                {mode === 'claim' ? 'Proof / Verification Details' : 'What needs to be corrected?'} *
              </label>
              <textarea
                required
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  mode === 'claim'
                    ? 'State your role with this business and preferred verification time.'
                    : 'Provide the corrected phone number, address, or timings.'
                }
                className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="text-[11px] text-slate-500 flex items-start gap-1.5 pt-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Business ownership claims require telephone verification before verified status is granted.
              </span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 border border-amber-500 rounded-xl font-bold shadow-xs"
              >
                {mode === 'claim' ? 'Submit Claim' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
