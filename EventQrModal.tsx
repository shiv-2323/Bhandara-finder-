import React, { useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { BhandaraEvent, Language } from '../types';
import { saveBhandaraToFirestore } from '../services/firestoreService';

interface EventQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: BhandaraEvent | null;
  lang: Language;
  onStatusUpdated?: (eventId: string, newStatus: 'auto' | 'open' | 'soon' | 'closed') => void;
}

export const EventQrModal: React.FC<EventQrModalProps> = ({
  isOpen,
  onClose,
  event,
  lang,
  onStatusUpdated,
}) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState<'qr' | 'status'>('qr');

  if (!isOpen || !event) return null;

  // Unique event link
  const eventUrl = `${window.location.origin}${window.location.pathname}#event-${event.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(eventUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.name,
          text: `🚩 ${event.name} | स्थान: ${event.location} | भोजन: ${event.food}`,
          url: eventUrl,
        });
      } catch (e) {
        console.log('Share error or cancelled', e);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleDownloadQr = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;

    // Create printable canvas with branding
    const pCanvas = document.createElement('canvas');
    const ctx = pCanvas.getContext('2d');
    if (!ctx) return;

    pCanvas.width = 600;
    pCanvas.height = 700;

    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, pCanvas.width, pCanvas.height);

    // Header gradient
    const gradient = ctx.createLinearGradient(0, 0, 600, 0);
    gradient.addColorStop(0, '#F4811F');
    gradient.addColorStop(1, '#C96000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 600, 100);

    // Header text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🚩 भंडारा खोजक (Bhandara Finder)', 300, 60);

    // Event title
    ctx.fillStyle = '#1A202C';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText(event.name, 300, 150);

    ctx.fillStyle = '#4A5568';
    ctx.font = '18px sans-serif';
    ctx.fillText(`📍 ${event.location}`, 300, 185);

    // Draw QR code centered
    ctx.drawImage(canvas, 150, 210, 300, 300);

    // Footer instruction
    ctx.fillStyle = '#F4811F';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('📱 क्यूआर स्कैन करें और लोकेशन / स्टेटस देखें', 300, 560);

    ctx.fillStyle = '#718096';
    ctx.font = '16px sans-serif';
    ctx.fillText(`तारीख: ${event.date} | भोजन: ${event.food}`, 300, 600);
    ctx.fillText('www.bhandarafinder.org', 300, 630);

    // Download image
    const image = pCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `QR-${event.name.replace(/\s+/g, '_')}.png`;
    link.click();
  };

  const handleStatusChange = async (newStatus: 'auto' | 'open' | 'soon' | 'closed') => {
    setUpdating(true);
    try {
      const updated = { ...event, statusOverride: newStatus };
      await saveBhandaraToFirestore(updated);
      if (onStatusUpdated) {
        onStatusUpdated(event.id, newStatus);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[850] flex items-center justify-center p-4">
      <div className="bg-[var(--bg-card)] border-2 border-[var(--border)] rounded-3xl w-full max-w-md my-auto overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#F4811F] to-amber-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📱</span>
            <div>
              <h3 className="text-lg font-extrabold font-['Baloo_2']">
                {lang === 'hi' ? 'आयोजक QR एवं स्टेटस प्रबंधन' : 'Event QR & Quick Status'}
              </h3>
              <p className="text-xs text-amber-100 line-clamp-1">{event.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border-2 border-white/40 flex items-center justify-center text-white hover:bg-white/20 transition-all font-bold"
          >
            ✕
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-[var(--border)] bg-[var(--bg-input)]">
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-3 text-xs font-extrabold transition-all border-b-2 ${
              activeTab === 'qr'
                ? 'border-[#F4811F] text-[#F4811F] bg-[var(--bg-card)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-head)]'
            }`}
          >
            📷 QR कोड एवं शेयर
          </button>
          <button
            onClick={() => setActiveTab('status')}
            className={`flex-1 py-3 text-xs font-extrabold transition-all border-b-2 ${
              activeTab === 'status'
                ? 'border-[#F4811F] text-[#F4811F] bg-[var(--bg-card)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-head)]'
            }`}
          >
            ⚡ त्वरित स्थिति (Update Status)
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {activeTab === 'qr' ? (
            <div className="flex flex-col items-center space-y-4">
              {/* QR Render Container */}
              <div
                ref={qrRef}
                className="bg-white p-4 rounded-2xl border-2 border-[#F4811F]/30 shadow-md flex items-center justify-center relative group"
              >
                <QRCodeCanvas
                  value={eventUrl}
                  size={200}
                  level="H"
                  includeMargin={true}
                  imageSettings={{
                    src: '/icon-192.svg',
                    x: undefined,
                    y: undefined,
                    height: 36,
                    width: 36,
                    excavate: true,
                  }}
                />
              </div>

              <div className="text-center space-y-1">
                <p className="text-xs font-bold text-[var(--text-head)]">
                  {lang === 'hi'
                    ? 'स्कैन करके तुरंत इस भंडारे का विवरण देखें या दोस्तों के साथ शेयर करें।'
                    : 'Scan to quickly view event details or share with devotees.'}
                </p>
                <p className="text-[11px] text-[var(--text-faint)] font-mono truncate max-w-xs mx-auto">
                  {eventUrl}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 w-full">
                <button
                  onClick={handleShare}
                  className="bg-[#F4811F] text-white py-2.5 rounded-xl font-extrabold text-xs hover:bg-[#C96000] transition-all flex items-center justify-center gap-1.5 shadow-md"
                >
                  <span>📲</span> {lang === 'hi' ? 'शेयर करें (Share)' : 'Share Link'}
                </button>

                <button
                  onClick={handleCopyLink}
                  className="bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-head)] py-2.5 rounded-xl font-extrabold text-xs hover:border-[#F4811F] transition-all flex items-center justify-center gap-1.5"
                >
                  <span>{copied ? '✅' : '📋'}</span>
                  {copied
                    ? lang === 'hi'
                      ? 'कॉपी हुआ!'
                      : 'Copied!'
                    : lang === 'hi'
                    ? 'लिंक कॉपी करें'
                    : 'Copy Link'}
                </button>
              </div>

              <button
                onClick={handleDownloadQr}
                className="w-full bg-amber-500/10 border-2 border-amber-500/30 text-amber-700 dark:text-amber-400 py-2.5 rounded-xl font-extrabold text-xs hover:bg-amber-500/20 transition-all flex items-center justify-center gap-2"
              >
                <span>📥</span> {lang === 'hi' ? 'QR पोस्टर डाउनलोड करें (Download PNG)' : 'Download Printable QR'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-900 rounded-2xl p-3.5 text-xs text-amber-800 dark:text-amber-300">
                💡 <b>आयोजक सुझाव:</b> क्यूआर कोड स्कैन करने के बाद आप यहाँ से भंडारे की वर्तमान स्थिति तुरंत अपडेट कर सकते हैं।
              </div>

              <div className="space-y-2.5">
                <label className="text-xs font-extrabold text-[var(--text-head)] block">
                  {lang === 'hi' ? 'भंडारे की वर्तमान स्थिति चुनें:' : 'Select Current Status:'}
                </label>

                <button
                  disabled={updating}
                  onClick={() => handleStatusChange('open')}
                  className={`w-full p-3.5 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                    event.statusOverride === 'open'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 shadow'
                      : 'border-[var(--border)] bg-[var(--bg-input)] hover:border-emerald-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🟢</span>
                    <div>
                      <div className="font-extrabold text-xs">
                        {lang === 'hi' ? 'प्रसाद जारी है (OPEN)' : 'Food Distribution OPEN'}
                      </div>
                      <div className="text-[11px] opacity-80">श्रद्धालुओं के लिए भोजन वितरण चालू है</div>
                    </div>
                  </div>
                  {event.statusOverride === 'open' && <span className="font-bold text-xs">✓ Active</span>}
                </button>

                <button
                  disabled={updating}
                  onClick={() => handleStatusChange('soon')}
                  className={`w-full p-3.5 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                    event.statusOverride === 'soon'
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 shadow'
                      : 'border-[var(--border)] bg-[var(--bg-input)] hover:border-amber-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🟡</span>
                    <div>
                      <div className="font-extrabold text-xs">
                        {lang === 'hi' ? 'जल्द शुरू होगा (SOON)' : 'Starting Soon'}
                      </div>
                      <div className="text-[11px] opacity-80">तैयारियां जारी हैं, शीघ्र प्रारंभ होगा</div>
                    </div>
                  </div>
                  {event.statusOverride === 'soon' && <span className="font-bold text-xs">✓ Active</span>}
                </button>

                <button
                  disabled={updating}
                  onClick={() => handleStatusChange('closed')}
                  className={`w-full p-3.5 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                    event.statusOverride === 'closed'
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 shadow'
                      : 'border-[var(--border)] bg-[var(--bg-input)] hover:border-rose-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🔴</span>
                    <div>
                      <div className="font-extrabold text-xs">
                        {lang === 'hi' ? 'समाप्त / पूर्ण (CLOSED)' : 'Event Completed'}
                      </div>
                      <div className="text-[11px] opacity-80">आज का प्रसाद वितरण संपन्न हो चुका है</div>
                    </div>
                  </div>
                  {event.statusOverride === 'closed' && <span className="font-bold text-xs">✓ Active</span>}
                </button>

                <button
                  disabled={updating}
                  onClick={() => handleStatusChange('auto')}
                  className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    event.statusOverride === 'auto'
                      ? 'border-[#F4811F] bg-[#F4811F]/10 text-[var(--text-head)]'
                      : 'border-[var(--border)] bg-[var(--bg-input)] hover:border-[#F4811F]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">🕒</span>
                    <span className="font-extrabold text-xs">
                      {lang === 'hi' ? 'स्वचालित समय अनुसार (Auto Timing)' : 'Auto Schedule'}
                    </span>
                  </div>
                  {event.statusOverride === 'auto' && <span className="font-bold text-xs text-[#F4811F]">✓ Auto</span>}
                </button>
              </div>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-head)] py-2.5 rounded-xl font-extrabold text-xs hover:border-[#F4811F]"
          >
            बंद करें
          </button>
        </div>
      </div>
    </div>
  );
};
