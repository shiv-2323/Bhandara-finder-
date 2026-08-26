import React, { useState } from 'react';
import { InKindNeed, BhandaraEvent, Language } from '../types';

interface NeedsBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  needs: InKindNeed[];
  bhandaras: BhandaraEvent[];
  onAddNeed: (need: Omit<InKindNeed, 'id' | 'createdAt'>) => void;
  onFulfillNeed: (needId: string) => void;
  lang: Language;
}

export const NeedsBoardModal: React.FC<NeedsBoardModalProps> = ({
  isOpen,
  onClose,
  needs,
  bhandaras,
  onAddNeed,
  onFulfillNeed,
  lang,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedBhandaraId, setSelectedBhandaraId] = useState('');
  const [item, setItem] = useState('');
  const [quantityNeeded, setQuantityNeeded] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  if (!isOpen) return null;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBhandaraId || !item || !quantityNeeded) return;

    const b = bhandaras.find((x) => x.id === selectedBhandaraId);
    if (!b) return;

    onAddNeed({
      bhandaraId: b.id,
      bhandaraName: b.name,
      item,
      quantityNeeded,
      quantityFulfilled: '0',
      status: 'Open',
      contactPhone: contactPhone || b.phone || '+91 9876543210',
    });

    setItem('');
    setQuantityNeeded('');
    setContactPhone('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[700] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[var(--bg-card)] border-2 border-[var(--border)] rounded-3xl w-full max-w-xl my-auto overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-[#F4811F] text-white p-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold font-['Baloo_2']">
              🌾 {lang === 'hi' ? 'सामग्री आवश्यकता बोर्ड (In-Kind Needs)' : 'Donation-in-Kind Needs Board'}
            </h3>
            <p className="text-[11px] opacity-90">
              {lang === 'hi' ? 'आयोजकों द्वारा मांगी गई सामग्री — सहयोग करें' : 'Items required by bhandara organizers'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border-2 border-white/40 flex items-center justify-center text-white hover:bg-white/20 transition-all font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Post New Requirement Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-head)]">
              📋 {needs.length} {lang === 'hi' ? 'सामग्री आवश्यकताएं' : 'Current Requirements'}
            </span>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-[#F4811F] text-white px-3 py-1 rounded-full text-xs font-bold hover:bg-[#C96000] transition-all"
            >
              {showAddForm ? '✕ Cancel' : `+ ${lang === 'hi' ? 'ज़रूरत दर्ज करें' : 'Post Requirement'}`}
            </button>
          </div>

          {/* Add Form */}
          {showAddForm && (
            <form onSubmit={handleAddSubmit} className="bg-[var(--bg-input)] border border-[var(--border)] p-4 rounded-2xl space-y-3">
              <h4 className="text-xs font-extrabold text-[var(--text-head)]">
                ✍️ {lang === 'hi' ? 'नई सामग्री आवश्यकता पोस्ट करें' : 'Post New Item Need'}
              </h4>

              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">
                  {lang === 'hi' ? 'भंडारा चुनें' : 'Select Bhandara Event'}
                </label>
                <select
                  required
                  value={selectedBhandaraId}
                  onChange={(e) => setSelectedBhandaraId(e.target.value)}
                  className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-[#F4811F]"
                >
                  <option value="">-- Choose Bhandara --</option>
                  {bhandaras.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.location.slice(0, 25)}...)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">
                    {lang === 'hi' ? 'सामग्री का नाम' : 'Item Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={item}
                    onChange={(e) => setItem(e.target.value)}
                    placeholder={lang === 'hi' ? 'जैसे: 20kg आटा, 50L दूध' : 'e.g. 20kg Aata, 50L Milk'}
                    className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#F4811F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">
                    {lang === 'hi' ? 'आवश्यक मात्रा' : 'Quantity Needed'}
                  </label>
                  <input
                    type="text"
                    required
                    value={quantityNeeded}
                    onChange={(e) => setQuantityNeeded(e.target.value)}
                    placeholder="e.g. 50 kg"
                    className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#F4811F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">
                  {lang === 'hi' ? 'संपर्क फोन' : 'Organizer Contact Phone'}
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#F4811F]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#F4811F] text-white py-2 rounded-xl text-xs font-bold shadow hover:bg-[#C96000] transition-all"
              >
                {lang === 'hi' ? 'आवश्यकता पोस्ट करें' : 'Post Need'}
              </button>
            </form>
          )}

          {/* Needs List */}
          <div className="space-y-3">
            {needs.length === 0 ? (
              <p className="text-xs text-[var(--text-faint)] italic text-center py-6">
                {lang === 'hi' ? 'अभी कोई सामग्री आवश्यकता दर्ज नहीं है।' : 'No material needs posted currently.'}
              </p>
            ) : (
              needs.map((need) => (
                <div
                  key={need.id}
                  className="bg-[var(--bg-input)] border-2 border-[var(--border)] p-3.5 rounded-2xl flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="text-xs font-bold text-[#F4811F]">{need.bhandaraName}</div>
                    <div className="text-sm font-extrabold text-[var(--text-head)]">
                      🌾 {need.item} ({need.quantityNeeded})
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                      📞 {need.contactPhone}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        need.status === 'Fulfilled'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {need.status}
                    </span>

                    {need.status !== 'Fulfilled' ? (
                      <button
                        onClick={() => onFulfillNeed(need.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-full text-xs font-bold transition-all shadow"
                      >
                        🤝 {lang === 'hi' ? 'सहयोग करें' : 'I Will Contribute'}
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-600 font-bold">✓ Complete</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
