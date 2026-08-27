import React, { useState, useRef, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Copy, Check, Download, QrCode, Smartphone, Edit2, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const DonateModal: React.FC<DonateModalProps> = ({ isOpen, onClose, lang }) => {
  const [copied, setCopied] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(101);
  const [customAmount, setCustomAmount] = useState<string>('');
  
  // Stored UPI ID (defaults to user's UPI: shiv7565k@okaxis)
  const [upiId, setUpiId] = useState<string>(() => {
    const saved = localStorage.getItem('bhandara_donation_upi');
    if (saved && saved !== 'bhandaraseva@upi') {
      return saved;
    }
    return 'shiv7565k@okaxis';
  });
  const [isEditingUpi, setIsEditingUpi] = useState(false);
  const [tempUpiInput, setTempUpiInput] = useState(upiId);

  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTempUpiInput(upiId);
  }, [upiId]);

  if (!isOpen) return null;

  const currentAmount = customAmount ? parseFloat(customAmount) : selectedAmount;

  // Generate UPI Payment URI for direct app launch or QR scanning
  const upiPayload = currentAmount && currentAmount > 0
    ? `upi://pay?pa=${encodeURIComponent(upiId)}&pn=Bhandara%20Seva&am=${currentAmount}&cu=INR&tn=Bhandara%20Seva%20Sahayog`
    : `upi://pay?pa=${encodeURIComponent(upiId)}&pn=Bhandara%20Seva&cu=INR&tn=Bhandara%20Seva%20Sahayog`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveCustomUpi = () => {
    const trimmed = tempUpiInput.trim();
    if (trimmed) {
      setUpiId(trimmed);
      localStorage.setItem('bhandara_donation_upi', trimmed);
      setIsEditingUpi(false);
    }
  };

  const handleDownloadQr = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;

    // Create a high-res printable poster on an off-screen canvas
    const poster = document.createElement('canvas');
    poster.width = 600;
    poster.height = 750;
    const ctx = poster.getContext('2d');
    if (!ctx) return;

    // Gradient background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 750);
    bgGrad.addColorStop(0, '#FFFBF5');
    bgGrad.addColorStop(1, '#FFF3E0');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 600, 750);

    // Decorative header
    ctx.fillStyle = '#F4811F';
    ctx.fillRect(0, 0, 600, 110);

    // Header text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 30px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🚩 भंडारा सेवा सहयोग QR 🚩', 300, 50);

    ctx.font = '16px sans-serif';
    ctx.fillStyle = '#FFE0B2';
    ctx.fillText('Bhandara & Food Distribution Seva', 300, 85);

    // QR Card container
    ctx.fillStyle = '#FFFFFF';
    ctx.roundRect ? ctx.roundRect(50, 135, 500, 480, 24) : ctx.fillRect(50, 135, 500, 480);
    ctx.fill();
    ctx.strokeStyle = '#FDBA74';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw QR code
    ctx.drawImage(canvas, 150, 170, 300, 300);

    // UPI text details
    ctx.fillStyle = '#1F2937';
    ctx.font = 'bold 20px monospace';
    ctx.fillText(upiId, 300, 510);

    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#6B7280';
    ctx.fillText('Scan & Pay with Google Pay, PhonePe, Paytm, BHIM', 300, 545);

    if (currentAmount && currentAmount > 0) {
      ctx.fillStyle = '#F4811F';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(`सहयोग राशि: ₹${currentAmount}`, 300, 580);
    }

    // Footer
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '13px sans-serif';
    ctx.fillText('Bhandara Finder Community — अन्नदान ही महादान है 🙏', 300, 680);

    const link = document.createElement('a');
    link.download = `Bhandara-Donation-QR.png`;
    link.href = poster.toDataURL('image/png');
    link.click();
  };

  const presetAmounts = [21, 51, 101, 251, 501, 1100];

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[700] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[var(--bg-card)] border-2 border-[var(--border)] rounded-3xl w-full max-w-md my-auto overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-[#F4811F] to-[#E8A000] text-white p-4.5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl shadow-inner">
              💝
            </div>
            <div>
              <h3 className="text-lg font-black font-['Baloo_2'] leading-tight">
                {getTranslation(lang, 'donateTitle')}
              </h3>
              <p className="text-[11px] text-amber-100 font-medium">
                {lang === 'hi' ? 'भंडारा व अन्नदान सेवा में सहयोग' : 'Support Community Food Distribution'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white text-sm transition-all font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-4.5 max-h-[82vh] overflow-y-auto">
          
          {/* Tagline */}
          <div className="text-center">
            <p className="text-xs text-[var(--text-muted)] font-medium leading-relaxed">
              {getTranslation(lang, 'donateSub')}
            </p>
          </div>

          {/* Amount Selection */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-[var(--text-head)] flex items-center justify-between">
              <span>{lang === 'hi' ? 'सहयोग राशि चुनें (Amount):' : 'Select Contribution Amount:'}</span>
              {currentAmount ? (
                <span className="text-[#F4811F] font-extrabold text-sm">₹{currentAmount}</span>
              ) : null}
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {presetAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setSelectedAmount(amt);
                    setCustomAmount('');
                  }}
                  className={`py-1.5 px-2 rounded-xl text-xs font-extrabold transition-all border ${
                    selectedAmount === amt && !customAmount
                      ? 'bg-[#F4811F] text-white border-[#F4811F] shadow-sm scale-105'
                      : 'bg-[var(--bg-input)] text-[var(--text-head)] border-[var(--border)] hover:border-amber-400'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            <div className="mt-2">
              <input
                type="number"
                placeholder={lang === 'hi' ? 'अन्य कोई राशि दर्ज करें (₹ Other Amount)' : 'Enter custom amount (₹)'}
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(null);
                }}
                className="w-full text-xs px-3.5 py-2 rounded-xl bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-head)] focus:outline-none focus:border-[#F4811F]"
              />
            </div>
          </div>

          {/* QR Code Card */}
          <div className="bg-gradient-to-b from-amber-50/50 to-orange-50/30 dark:from-neutral-900/50 dark:to-neutral-900/30 border-2 border-dashed border-amber-300 dark:border-amber-700/50 rounded-2xl p-4 text-center space-y-3">
            
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{lang === 'hi' ? 'स्कैन करके भुगतान करें (Scan to Pay)' : 'Scan with Any UPI App'}</span>
            </div>

            {/* QR Renderer */}
            <div
              ref={qrRef}
              className="bg-white p-3.5 rounded-2xl shadow-md inline-block border border-neutral-200 mx-auto"
            >
              <QRCodeCanvas
                value={upiPayload}
                size={185}
                level="H"
                includeMargin={false}
                imageSettings={{
                  src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23F4811F"><circle cx="12" cy="12" r="10" fill="white"/><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="%23F4811F"/></svg>',
                  x: undefined,
                  y: undefined,
                  height: 32,
                  width: 32,
                  excavate: true,
                }}
              />
            </div>

            {/* Supported Payment Logos / Apps */}
            <div className="text-[11px] text-[var(--text-faint)] flex items-center justify-center gap-2 font-medium flex-wrap">
              <span className="px-2 py-0.5 rounded-md bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-2xs font-bold text-blue-600">GPay</span>
              <span className="px-2 py-0.5 rounded-md bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-2xs font-bold text-purple-600">PhonePe</span>
              <span className="px-2 py-0.5 rounded-md bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-2xs font-bold text-cyan-600">Paytm</span>
              <span className="px-2 py-0.5 rounded-md bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-2xs font-bold text-green-600">BHIM UPI</span>
            </div>

            {/* Direct Pay Link for Mobile */}
            <div className="pt-1">
              <a
                href={upiPayload}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition"
              >
                <Smartphone className="w-4 h-4" />
                {lang === 'hi' ? '📱 सीधे UPI ऐप से भुगतान करें' : '📱 Pay directly via UPI App'}
              </a>
            </div>
          </div>

          {/* UPI ID Info Box & Customization */}
          <div className="bg-[var(--bg-input)] border border-[var(--border)] rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)] font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                UPI ID:
              </span>
              <button
                type="button"
                onClick={() => setIsEditingUpi(!isEditingUpi)}
                className="text-[11px] text-[#F4811F] hover:underline flex items-center gap-1 font-semibold"
              >
                <Edit2 className="w-3 h-3" />
                {isEditingUpi ? (lang === 'hi' ? 'रद्द करें' : 'Cancel') : (lang === 'hi' ? 'UPI बदलें' : 'Change UPI')}
              </button>
            </div>

            {isEditingUpi ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={tempUpiInput}
                  onChange={(e) => setTempUpiInput(e.target.value)}
                  placeholder="e.g. yourname@upi or 9876543210@paytm"
                  className="w-full text-xs font-mono px-3 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-[var(--border)] text-[var(--text-head)] focus:outline-none focus:border-[#F4811F]"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveCustomUpi}
                    className="flex-1 py-1.5 bg-[#F4811F] text-white text-xs font-bold rounded-lg shadow hover:bg-[#D96B0E]"
                  >
                    {lang === 'hi' ? 'सुरक्षित करें' : 'Save UPI'}
                  </button>
                  <button
                    onClick={() => {
                      setTempUpiInput('shiv7565k@okaxis');
                      setUpiId('shiv7565k@okaxis');
                      localStorage.setItem('bhandara_donation_upi', 'shiv7565k@okaxis');
                      setIsEditingUpi(false);
                    }}
                    className="px-3 py-1.5 bg-gray-200 dark:bg-neutral-700 text-[var(--text-head)] text-xs font-semibold rounded-lg"
                  >
                    Reset
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2 bg-white dark:bg-neutral-800/80 px-3 py-2 rounded-xl border border-[var(--border)]">
                <div className="text-xs font-bold text-[#F4811F] font-mono select-all truncate">
                  {upiId}
                </div>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="shrink-0 bg-[#F4811F] text-white px-2.5 py-1 rounded-lg text-[11px] font-bold shadow-xs hover:bg-[#D96B0E] transition-all flex items-center gap-1"
                >
                  {copied ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
                  {copied ? (lang === 'hi' ? 'कॉपी हुआ!' : 'Copied!') : (lang === 'hi' ? 'कॉपी' : 'Copy')}
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleDownloadQr}
              className="flex-1 py-2.5 bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 dark:hover:bg-amber-900/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              {lang === 'hi' ? 'QR पोस्टर डाउनलोड करें' : 'Download QR Poster'}
            </button>
            <button
              onClick={onClose}
              className="px-5 bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-head)] py-2.5 rounded-xl font-bold text-xs hover:bg-neutral-200 dark:hover:bg-neutral-700"
            >
              {lang === 'hi' ? 'बंद करें' : 'Close'}
            </button>
          </div>

          {/* Blessings message */}
          <div className="bg-amber-50/80 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200/80 dark:border-amber-900/60 text-center text-[11px] text-amber-800 dark:text-amber-300 flex items-center justify-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 shrink-0" />
            <span>🙏 जय श्री कृष्ण! आपका एक छोटा सहयोग भी कई भूखों को भोजन कराने में मददगार है।</span>
          </div>

        </div>
      </div>
    </div>
  );
};
