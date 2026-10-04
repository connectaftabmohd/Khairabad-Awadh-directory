import React from 'react';
import { X, Phone, ShieldAlert, HeartPulse, Building2, Flame, Users, Shield } from 'lucide-react';
import { EMERGENCY_CONTACTS } from '../data/khairabadData';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display text-slate-900">
                Khairabad Emergency & Helplines
              </h3>
              <p className="text-xs text-slate-500">
                Official 24/7 emergency response and local civic numbers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 mb-5 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
          <span>
            <strong>Immediate Emergency:</strong> For urgent life-threatening police, medical, or fire emergencies, dial <strong>112</strong> or <strong>108</strong> immediately from any mobile or landline phone.
          </span>
        </div>

        <div className="space-y-3">
          {EMERGENCY_CONTACTS.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-slate-50 flex items-center justify-between gap-4 transition-all"
            >
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                  <span className="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 uppercase font-semibold">
                    {item.type}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-1">{item.description}</p>
                <div className="text-[10px] text-slate-500">{item.timing}</div>
              </div>

              <a
                href={`tel:${item.number.replace(/[^0-9]/g, '')}`}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-sm transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call {item.number}</span>
              </a>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
          >
            Close Helplines
          </button>
        </div>
      </div>
    </div>
  );
};
