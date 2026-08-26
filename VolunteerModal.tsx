import React, { useState } from 'react';
import { BhandaraEvent, VolunteerRegistration, Language } from '../types';

interface VolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
  bhandara: BhandaraEvent | null;
  onRegisterVolunteer: (vol: Omit<VolunteerRegistration, 'id' | 'createdAt'>) => void;
  lang: Language;
}

export const VolunteerModal: React.FC<VolunteerModalProps> = ({
  isOpen,
  onClose,
  bhandara,
  onRegisterVolunteer,
  lang,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceArea, setServiceArea] = useState<VolunteerRegistration['serviceArea']>('Serving');
  const [availability, setAvailability] = useState<VolunteerRegistration['availability']>('Today');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    onRegisterVolunteer({
      bhandaraId: bhandara?.id,
      bhandaraName: bhandara?.name,
      name,
      phone,
      serviceArea,
      availability,
    });

    setName('');
    setPhone('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[700] flex items-center justify-center p-4">
      <div className="bg-[var(--bg-card)] border-2 border-[var(--border)] rounded-3xl w-full max-w-md my-auto overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-4 flex items-center justify-between">
          <h3 className="text-base font-extrabold font-['Baloo_2']">
            🤝 {lang === 'hi' ? 'सेवा के लिए पंजीकरण करें' : 'Volunteer Registration'}
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
            {bhandara
              ? `${lang === 'hi' ? 'भंडारे में सेवा देने हेतु अपना विवरण दर्ज करें:' : 'Register to serve for'} "${bhandara.name}"`
              : lang === 'hi'
              ? 'किसी भी पास के भंडारे/लंगर में सेवा देने हेतु अपना नाम और संपर्क दर्ज करें।'
              : 'Register your availability for community seva.'}
          </p>

          <div>
            <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">
              {lang === 'hi' ? 'आपका नाम' : 'Your Name'} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={lang === 'hi' ? 'जैसे: अमित पटेल' : 'e.g. Amit Patel'}
              className="w-full bg-[var(--bg-input)] border-2 border-[var(--border)] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-purple-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">
              {lang === 'hi' ? 'मोबाइल नंबर' : 'Phone Number'} <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 9876543210"
              className="w-full bg-[var(--bg-input)] border-2 border-[var(--border)] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-purple-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">
              {lang === 'hi' ? 'सेवा का क्षेत्र' : 'Service Area'}
            </label>
            <select
              value={serviceArea}
              onChange={(e) => setServiceArea(e.target.value as any)}
              className="w-full bg-[var(--bg-input)] border-2 border-[var(--border)] rounded-xl px-3.5 py-2 text-xs font-bold focus:outline-none focus:border-purple-600"
            >
              <option value="Serving">Serving Food (भोजन परोसना)</option>
              <option value="Cooking">Cooking / Food Prep (रसोई सेवा)</option>
              <option value="Cleaning">Cleaning & Wash (सफाई एवं स्वच्छता)</option>
              <option value="Logistics">Crowd & Queue Management (भीड़ नियंत्रण)</option>
              <option value="Any">Any Service Needed (कोई भी सेवा)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">
              {lang === 'hi' ? 'उपलब्धता' : 'Availability'}
            </label>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value as any)}
              className="w-full bg-[var(--bg-input)] border-2 border-[var(--border)] rounded-xl px-3.5 py-2 text-xs font-bold focus:outline-none focus:border-purple-600"
            >
              <option value="Today">{lang === 'hi' ? 'आज ही' : 'Today'}</option>
              <option value="Weekends">{lang === 'hi' ? 'शनिवार/रविवार' : 'Weekends Only'}</option>
              <option value="Whenever Needed">{lang === 'hi' ? 'जब भी आवश्यकता हो' : 'Whenever Needed'}</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 hover:opacity-95 text-white py-3 rounded-xl font-extrabold text-xs shadow transition-all"
          >
            {lang === 'hi' ? 'सेवा हेतु रजिस्टर करें — जय श्री राम!' : 'Submit Volunteer Request'}
          </button>
        </form>
      </div>
    </div>
  );
};
