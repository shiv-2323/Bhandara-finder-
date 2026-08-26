import React, { useState } from 'react';
import { BhandaraEvent, FlagReport, Language } from '../types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  bhandara: BhandaraEvent | null;
  onSubmitReport: (report: Omit<FlagReport, 'id' | 'createdAt' | 'status'>) => void;
  lang: Language;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  bhandara,
  onSubmitReport,
  lang,
}) => {
  const [reason, setReason] = useState<FlagReport['reason']>('Fake Entry');
  const [details, setDetails] = useState('');

  if (!isOpen || !bhandara) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReport({
      bhandaraId: bhandara.id,
      bhandaraName: bhandara.name,
      reason,
      details,
    });
    setDetails('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[700] flex items-center justify-center p-4">
      <div className="bg-[var(--bg-card)] border-2 border-[var(--border)] rounded-3xl w-full max-w-md my-auto overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-red-600 text-white p-4 flex items-center justify-between">
          <h3 className="text-base font-extrabold font-['Baloo_2']">
            🚩 {lang === 'hi' ? 'रिपोर्ट करें / गलत प्रविष्टि' : 'Report / Flag Event'}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border-2 border-white/40 flex items-center justify-center text-white hover:bg-white/20 transition-all font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-xs text-[var(--text-muted)] font-medium">
            {lang === 'hi'
              ? `"${bhandara.name}" की रिपोर्ट एडमिन मॉडरेटर को जाएगी। गलत जानकारी हटाने में मदद करें।`
              : `Your report for "${bhandara.name}" will be sent to admin moderators.`}
          </p>

          <div>
            <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">
              {lang === 'hi' ? 'रिपोर्ट का कारण' : 'Reason for Reporting'}
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as FlagReport['reason'])}
              className="w-full bg-[var(--bg-input)] border-2 border-[var(--border)] rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-red-500"
            >
              <option value="Fake Entry">Fake Entry (झूठी प्रविष्टि)</option>
              <option value="Event Ended / Cancelled">Event Ended / Cancelled (समाप्त या रद्द)</option>
              <option value="Wrong Location">Wrong Location (गलत पता/मैप)</option>
              <option value="Inappropriate Content">Inappropriate Content (अप्रिय सामग्री)</option>
              <option value="Other">Other (अन्य)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">
              {lang === 'hi' ? 'अतिरिक्त विवरण' : 'Additional Details'}
            </label>
            <textarea
              rows={3}
              required
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder={lang === 'hi' ? 'कृपया कारण विस्तार से बताएं...' : 'Please explain why this event is inaccurate...'}
              className="w-full bg-[var(--bg-input)] border-2 border-[var(--border)] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-bold text-xs shadow transition-all"
          >
            {lang === 'hi' ? 'रिपोर्ट भेजें' : 'Submit Flag Report'}
          </button>
        </form>
      </div>
    </div>
  );
};
