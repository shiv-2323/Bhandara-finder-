import React, { useState, useEffect } from 'react';
import { BhandaraEvent, BhandaraCategory, OrganizerType, Language } from '../types';

interface AddBhandaraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Partial<BhandaraEvent>) => Promise<void>;
  editEvent: BhandaraEvent | null;
  isAdmin: boolean;
  lang: Language;
  onOpenQr?: (event: BhandaraEvent) => void;
}

export const AddBhandaraModal: React.FC<AddBhandaraModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editEvent,
  isAdmin,
  lang,
  onOpenQr,
}) => {
  const [name, setName] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [organizerType, setOrganizerType] = useState<OrganizerType>('unverified');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [mapLink, setMapLink] = useState('');
  const [lat, setLat] = useState<number>(26.85);
  const [lng, setLng] = useState<number>(80.95);
  const [category, setCategory] = useState<BhandaraCategory>('Navratri');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState<'weekly' | 'monthly'>('weekly');
  const [startTime, setStartTime] = useState('11:00');
  const [endTime, setEndTime] = useState('16:00');
  const [food, setFood] = useState('पूड़ी-सब्जी, हलवा, प्रसाद');
  const [description, setDescription] = useState('');
  const [featured, setFeatured] = useState(false);
  const [statusOverride, setStatusOverride] = useState<'auto' | 'open' | 'soon' | 'closed'>('auto');
  const [estimatedMeals, setEstimatedMeals] = useState<number>(1000);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [imageURLs, setImageURLs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editEvent) {
      setName(editEvent.name || '');
      setOrganizer(editEvent.organizer || '');
      setOrganizerType(editEvent.organizerType || 'unverified');
      setPhone(editEvent.phone || '');
      setLocation(editEvent.location || '');
      setMapLink(editEvent.mapLink || '');
      setLat(editEvent.lat || 26.85);
      setLng(editEvent.lng || 80.95);
      setCategory(editEvent.category || 'Navratri');
      setDate(editEvent.date || new Date().toISOString().split('T')[0]);
      setIsRecurring(editEvent.isRecurring || false);
      setRecurrenceFrequency(editEvent.recurrenceFrequency || 'weekly');
      setStartTime(editEvent.startTime || '11:00');
      setEndTime(editEvent.endTime || '16:00');
      setFood(editEvent.food || '');
      setDescription(editEvent.description || '');
      setFeatured(editEvent.featured || false);
      setStatusOverride(editEvent.statusOverride || 'auto');
      setEstimatedMeals(editEvent.estimatedMeals || 1000);
      setImageURLs(editEvent.imageURLs || []);
    } else {
      setName('');
      setOrganizer('');
      setOrganizerType('unverified');
      setPhone('');
      setLocation('');
      setMapLink('');
      setLat(26.85);
      setLng(80.95);
      setCategory('Navratri');
      setDate(new Date().toISOString().split('T')[0]);
      setIsRecurring(false);
      setRecurrenceFrequency('weekly');
      setStartTime('11:00');
      setEndTime('16:00');
      setFood('पूड़ी-सब्जी, हलवा, प्रसाद');
      setDescription('');
      setFeatured(false);
      setStatusOverride('auto');
      setEstimatedMeals(1000);
      setImageURLs([
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
      ]);
    }
  }, [editEvent, isOpen]);

  if (!isOpen) return null;

  const handleAddImage = () => {
    if (!imageUrlInput.trim()) return;
    setImageURLs([...imageURLs, imageUrlInput.trim()]);
    setImageUrlInput('');
  };

  const handleRemoveImage = (idx: number) => {
    setImageURLs(imageURLs.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !organizer || !location || !date || !food) {
      alert(lang === 'hi' ? 'कृपया सभी आवश्यक फ़ील्ड्स भरें!' : 'Please fill all required fields!');
      return;
    }

    setLoading(true);
    await onSave({
      id: editEvent ? editEvent.id : undefined,
      name,
      organizer,
      organizerType,
      phone,
      location,
      mapLink: mapLink || `https://www.google.com/maps?q=${encodeURIComponent(location)}`,
      lat: Number(lat) || 26.85,
      lng: Number(lng) || 80.95,
      category,
      date,
      isRecurring,
      recurrenceFrequency,
      startTime,
      endTime,
      food,
      description,
      featured,
      statusOverride,
      estimatedMeals: Number(estimatedMeals) || 500,
      imageURLs,
    });
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[700] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[var(--bg-card)] border-2 border-[var(--border)] rounded-3xl w-full max-w-2xl my-auto overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#F4811F] to-[#C96000] text-white p-5 flex items-center justify-between">
          <h3 className="text-xl font-extrabold font-['Baloo_2']">
            {editEvent
              ? lang === 'hi'
                ? '✏️ भंडारा विवरण अपडेट करें'
                : '✏️ Edit Bhandara Event'
              : lang === 'hi'
              ? '📝 नया भंडारा जोड़ें'
              : '📝 Add New Bhandara'}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border-2 border-white/40 flex items-center justify-center text-white hover:bg-white/20 transition-all font-bold"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">
                {lang === 'hi' ? 'भंडारे का नाम' : 'Bhandara Name'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={lang === 'hi' ? 'जैसे: श्री राम मंदिर विशाल भंडारा' : 'e.g., Shri Ram Temple Bhandara'}
                className="w-full bg-[var(--bg-input)] border-2 border-[var(--border)] rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#F4811F]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">
                {lang === 'hi' ? 'आयोजक का नाम' : 'Organizer Name'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
                placeholder={lang === 'hi' ? 'जैसे: श्री राम सेवा समिति' : 'e.g., Local Youth Club'}
                className="w-full bg-[var(--bg-input)] border-2 border-[var(--border)] rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#F4811F]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">
                {lang === 'hi' ? 'आयोजक का प्रकार' : 'Organizer Type'}
              </label>
              <select
                value={organizerType}
                onChange={(e) => setOrganizerType(e.target.value as OrganizerType)}
                className="w-full bg-[var(--bg-input)] border-2 border-[var(--border)] rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#F4811F]"
              >
                <option value="unverified">{lang === 'hi' ? 'सामान्य आयोजक' : 'Standard Organizer'}</option>
                <option value="verified_ngo">✓ Verified NGO</option>
                <option value="temple">🏛 Temple Trust</option>
                <option value="verified_ind">👤 Verified Individual</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">
                {lang === 'hi' ? 'संपर्क नंबर' : 'Contact Phone'}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full bg-[var(--bg-input)] border-2 border-[var(--border)] rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#F4811F]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">
                {lang === 'hi' ? 'श्रेणी' : 'Category'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as BhandaraCategory)}
                className="w-full bg-[var(--bg-input)] border-2 border-[var(--border)] rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#F4811F]"
              >
                <option value="Navratri">Navratri</option>
                <option value="Guru Purnima">Guru Purnima</option>
                <option value="Langar">Langar</option>
                <option value="Wedding Donation">Wedding Donation</option>
                <option value="Prasad">Prasad</option>
                <option value="Hanuman Jayanti">Hanuman Jayanti</option>
                <option value="Shivratri">Shivratri</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">
                {lang === 'hi' ? 'पूरा पता / स्थान' : 'Full Location Address'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={lang === 'hi' ? 'गाँव, मोहल्ला, चौक, जिला, राज्य...' : 'Street address, landmark, city'}
                className="w-full bg-[var(--bg-input)] border-2 border-[var(--border)] rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#F4811F]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">Latitude (Lat)</label>
              <input
                type="number"
                step="any"
                value={lat}
                onChange={(e) => setLat(parseFloat(e.target.value))}
                className="w-full bg-[var(--bg-input)] border-2 border-[var(--border)] rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#F4811F]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">Longitude (Lng)</label>
              <input
                type="number"
                step="any"
                value={lng}
                onChange={(e) => setLng(parseFloat(e.target.value))}
                className="w-full bg-[var(--bg-input)] border-2 border-[var(--border)] rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#F4811F]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">
                {lang === 'hi' ? 'तारीख' : 'Event Date'} <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[var(--bg-input)] border-2 border-[var(--border)] rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#F4811F]"
              />
            </div>

            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="isRecurringCheck"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="w-4 h-4 accent-[#F4811F]"
              />
              <label htmlFor="isRecurringCheck" className="text-xs font-bold text-[var(--text-body)]">
                {lang === 'hi' ? '🔁 यह आवर्ती (Recurring) लंगर है' : '🔁 Recurring Langar Event'}
              </label>
            </div>

            {isRecurring && (
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">
                  {lang === 'hi' ? 'आवृति' : 'Recurrence Frequency'}
                </label>
                <select
                  value={recurrenceFrequency}
                  onChange={(e) => setRecurrenceFrequency(e.target.value as 'weekly' | 'monthly')}
                  className="w-full bg-[var(--bg-input)] border-2 border-[var(--border)] rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#F4811F]"
                >
                  <option value="weekly">{lang === 'hi' ? 'साप्ताहिक (हर सप्ताह)' : 'Weekly'}</option>
                  <option value="monthly">{lang === 'hi' ? 'मासिक (हर महीने)' : 'Monthly'}</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">
                {lang === 'hi' ? 'शुरू समय' : 'Start Time'} <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-[var(--bg-input)] border-2 border-[var(--border)] rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#F4811F]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">
                {lang === 'hi' ? 'समाप्त समय' : 'End Time'}
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-[var(--bg-input)] border-2 border-[var(--border)] rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#F4811F]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">
                {lang === 'hi' ? 'भोजन सामग्री' : 'Food Menu'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={food}
                onChange={(e) => setFood(e.target.value)}
                placeholder={lang === 'hi' ? 'पूड़ी-सब्जी, हलवा, कढ़ी-चावल, खीर...' : 'Poori Sabzi, Halwa, Kheer'}
                className="w-full bg-[var(--bg-input)] border-2 border-[var(--border)] rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#F4811F]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">
                {lang === 'hi' ? 'विवरण / विशेष नोट्स' : 'Description / Notes'}
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  lang === 'hi'
                    ? 'कोई विशेष जानकारी, पार्किंग या दिशानिर्देश...'
                    : 'Any special instructions or guidelines...'
                }
                className="w-full bg-[var(--bg-input)] border-2 border-[var(--border)] rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#F4811F]"
              />
            </div>

            {isAdmin && (
              <>
                <div>
                  <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">
                    {lang === 'hi' ? 'Status Override (Admin)' : 'Status Override'}
                  </label>
                  <select
                    value={statusOverride}
                    onChange={(e) => setStatusOverride(e.target.value as any)}
                    className="w-full bg-[var(--bg-input)] border-2 border-[var(--border)] rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#F4811F]"
                  >
                    <option value="auto">Auto (Calculated from Time)</option>
                    <option value="open">Force Open (🟢 चालू है)</option>
                    <option value="soon">Force Soon (🟡 जल्द शुरू)</option>
                    <option value="closed">Force Closed (🔴 खत्म)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="featuredCheck"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 accent-[#F4811F]"
                  />
                  <label htmlFor="featuredCheck" className="text-xs font-bold text-[var(--text-body)]">
                    ⭐ Mark as Featured (Top Banner Placement)
                  </label>
                </div>
              </>
            )}

            {/* Photo URLs Section */}
            <div className="sm:col-span-2 border-t border-[var(--divider)] pt-3">
              <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">
                📸 {lang === 'hi' ? 'फोटो URL जोड़ें' : 'Add Photo Image URLs'}
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 bg-[var(--bg-input)] border-2 border-[var(--border)] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#F4811F]"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="bg-[#F4811F] text-white px-4 py-2 rounded-xl text-xs font-bold"
                >
                  + Add
                </button>
              </div>

              {imageURLs.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto py-2">
                  {imageURLs.map((url, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-[var(--border)] shrink-0">
                      <img src={url} alt="preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {editEvent && onOpenQr && (
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-900 rounded-2xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-xs text-amber-900 dark:text-amber-200">
                <span className="text-xl">📱</span>
                <div>
                  <div className="font-extrabold">{lang === 'hi' ? 'आयोजक QR कोड पोस्टर' : 'Organizer Event QR'}</div>
                  <div className="text-[11px] opacity-80">{lang === 'hi' ? 'स्कैन एवं प्रिंट पोस्टर प्राप्त करें' : 'Printable poster for scanning'}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onOpenQr(editEvent)}
                className="bg-[#F4811F] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold hover:bg-[#C96000] transition-all shadow-sm"
              >
                📱 QR देखें
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#F4811F] to-[#C96000] text-white py-3.5 rounded-2xl font-extrabold text-base hover:opacity-95 transition-all shadow-md disabled:opacity-50"
          >
            {loading
              ? '⏳ Saving...'
              : editEvent
              ? lang === 'hi'
                ? '✏️ अपडेट सहेजें'
                : 'Save Changes'
              : lang === 'hi'
              ? '🍛 भंडारा जोड़ें — जय श्री कृष्ण!'
              : 'Add Bhandara — Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};
