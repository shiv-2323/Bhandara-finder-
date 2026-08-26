import React, { useState } from 'react';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const DonateModal: React.FC<DonateModalProps> = ({ isOpen, onClose, lang }) => {
  const [copied, setCopied] = useState(false);
  const upiId = 'bhandara2026@upi';

  if (!isOpen) return null;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[700] flex items-center justify-center p-4">
      <div className="bg-[var(--bg-card)] border-2 border-[var(--border)] rounded-3xl w-full max-w-sm my-auto overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-center">
        <div className="bg-gradient-to-r from-amber-500 to-[#F4811F] text-white p-4 flex items-center justify-between">
          <h3 className="text-base font-extrabold font-['Baloo_2']">
            {getTranslation(lang, 'donateTitle')}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border-2 border-white/40 flex items-center justify-center text-white hover:bg-white/20 transition-all font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-[var(--text-muted)] font-medium">
            {getTranslation(lang, 'donateSub')}
          </p>

          <div className="bg-[var(--bg-input)] border-2 border-dashed border-[#F4811F] rounded-2xl p-4 space-y-2">
            <div className="text-xs text-[var(--text-faint)] font-bold">UPI ID:</div>
            <div className="text-lg font-extrabold text-[#F4811F] font-mono select-all">
              {upiId}
            </div>
            <button
              onClick={handleCopyUpi}
              className="bg-[#F4811F] text-white px-4 py-1.5 rounded-full text-xs font-bold shadow hover:bg-[#C96000] transition-all"
            >
              {copied ? '✓ Copied!' : getTranslation(lang, 'copyUpi')}
            </button>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-2xl border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-300">
            🙏 जय श्री कृष्ण! आपका सहयोग सेवा में समर्पित है।
          </div>

          <button
            onClick={onClose}
            className="w-full bg-[var(--bg-input)] border-2 border-[var(--border)] text-[var(--text-head)] py-2.5 rounded-xl font-extrabold text-xs hover:border-[#F4811F]"
          >
            बंद करें
          </button>
        </div>
      </div>
    </div>
  );
};
