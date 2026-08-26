import React, { useState } from 'react';
import { BhandaraEvent, Language } from '../types';
import { getTranslation } from '../utils/translations';
import { calculateDistance, formatDistance } from '../utils/geo';

interface BhandaraCardProps {
  bhandara: BhandaraEvent;
  lang: Language;
  userLat: number | null;
  userLng: number | null;
  isSaved: boolean;
  isAdmin: boolean;
  onToggleSave: (id: string) => void;
  onOpenReviews: (bhandara: BhandaraEvent) => void;
  onOpenReport: (bhandara: BhandaraEvent) => void;
  onOpenVolunteer: (bhandara: BhandaraEvent) => void;
  onOpenQr?: (bhandara: BhandaraEvent) => void;
  onEdit: (bhandara: BhandaraEvent) => void;
  onDelete: (id: string) => void;
  onSelectOnMap?: (id: string) => void;
}

export const BhandaraCard: React.FC<BhandaraCardProps> = ({
  bhandara,
  lang,
  userLat,
  userLng,
  isSaved,
  isAdmin,
  onToggleSave,
  onOpenReviews,
  onOpenReport,
  onOpenVolunteer,
  onOpenQr,
  onEdit,
  onDelete,
  onSelectOnMap,
}) => {
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  // Compute status badge
  const getStatus = () => {
    if (bhandara.statusOverride && bhandara.statusOverride !== 'auto') {
      if (bhandara.statusOverride === 'open')
        return { label: getTranslation(lang, 'openNow'), style: 'bg-emerald-600 text-white', isOpen: true };
      if (bhandara.statusOverride === 'soon')
        return { label: getTranslation(lang, 'startingSoon'), style: 'bg-amber-500 text-white', isOpen: false };
      return { label: getTranslation(lang, 'ended'), style: 'bg-neutral-500 text-white', isOpen: false };
    }

    if (!bhandara.date) return { label: '—', style: 'bg-neutral-400 text-white', isOpen: false };
    const now = new Date();
    const evDay = new Date(bhandara.date);
    const isToday = evDay.toDateString() === now.toDateString();

    if (!isToday) {
      return evDay > now
        ? { label: `📅 ${getTranslation(lang, 'upcoming')}`, style: 'bg-blue-600 text-white', isOpen: false }
        : { label: getTranslation(lang, 'ended'), style: 'bg-neutral-500 text-white', isOpen: false };
    }

    const minutes = (timeStr?: string) => {
      if (!timeStr) return null;
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const startM = minutes(bhandara.startTime);
    const endM = minutes(bhandara.endTime);

    if (startM != null && currentMinutes < startM - 30) {
      return { label: `⏰ ${getTranslation(lang, 'upcoming')}`, style: 'bg-blue-600 text-white', isOpen: false };
    }
    if (startM != null && currentMinutes < startM) {
      return { label: getTranslation(lang, 'startingSoon'), style: 'bg-amber-500 text-white', isOpen: false };
    }
    if (endM != null && currentMinutes > endM) {
      return { label: getTranslation(lang, 'ended'), style: 'bg-neutral-500 text-white', isOpen: false };
    }

    return { label: getTranslation(lang, 'openNow'), style: 'bg-emerald-600 text-white', isOpen: true };
  };

  const status = getStatus();

  // Distance calculation
  let distanceText = '';
  if (userLat && userLng && bhandara.lat && bhandara.lng) {
    const d = calculateDistance(userLat, userLng, bhandara.lat, bhandara.lng);
    distanceText = formatDistance(d, lang);
  }

  // Food chips
  const foods = (bhandara.food || '').split(',').map((f) => f.trim()).filter(Boolean);

  // WhatsApp share generator
  const handleWhatsAppShare = () => {
    const mapUrl =
      bhandara.mapLink ||
      (bhandara.lat && bhandara.lng
        ? `https://www.google.com/maps?q=${bhandara.lat},${bhandara.lng}`
        : `https://www.google.com/maps?q=${encodeURIComponent(`${bhandara.name} ${bhandara.location}`)}`);
    const eventUrl = `${window.location.protocol}//${window.location.host}/#event-${bhandara.id}`;

    const text = `🚩 *${bhandara.name}*
📍 *स्थान*: ${bhandara.location}
📅 *तारीख*: ${bhandara.date}
⏰ *समय*: ${bhandara.startTime || '11:00 AM'} ${bhandara.endTime ? `- ${bhandara.endTime}` : ''}
🍽️ *प्रसाद / भोजन*: ${bhandara.food || 'विशेष प्रसाद'}
👤 *आयोजक*: ${bhandara.organizer || 'सेवा समिति'} ${bhandara.phone ? `(${bhandara.phone})` : ''}

🗺️ *गूगल मैप्स नेविगेशन (Google Maps)*:
${mapUrl}

📱 *लाइव स्थिति एवं विवरण देखें*:
${eventUrl}

🙏 *जय श्री राम! शेयर करें और सेवा में सहभागी बनें।*
— *भंडारा खोजक (Bhandara Finder)*`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  // Google Maps direction link
  const handleOpenMaps = () => {
    const link =
      bhandara.mapLink ||
      (bhandara.lat && bhandara.lng
        ? `https://www.google.com/maps?q=${bhandara.lat},${bhandara.lng}`
        : `https://www.google.com/maps?q=${encodeURIComponent(`${bhandara.name} ${bhandara.location}`)}`);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      id={`card-${bhandara.id}`}
      className={`bg-[var(--bg-card)] border-2 ${
        bhandara.featured ? 'border-[#E8A000] shadow-md' : 'border-[var(--border)]'
      } rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col relative group`}
    >
      {/* Featured Badge */}
      {bhandara.featured && (
        <div className="absolute top-0 left-0 bg-gradient-to-r from-[#E8A000] to-[#F4811F] text-white text-[11px] font-extrabold px-3 py-1 rounded-br-xl z-20 shadow-sm tracking-wide">
          ⭐ FEATURED
        </div>
      )}

      {/* Image Container */}
      <div className="relative h-48 bg-[var(--bg-chip)] overflow-hidden">
        {bhandara.imageURLs && bhandara.imageURLs.length > 0 ? (
          <>
            <img
              src={bhandara.imageURLs[activeImgIdx]}
              alt={bhandara.name}
              className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            {bhandara.imageURLs.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full">
                {bhandara.imageURLs.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIdx(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === activeImgIdx ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-[var(--text-faint)] bg-[var(--bg-chip)]">
            <span className="text-5xl mb-1">🍛</span>
            <span className="text-xs">{lang === 'hi' ? 'कोई फ़ोटो उपलब्ध नहीं' : 'No photo uploaded'}</span>
          </div>
        )}

        {/* Live Status Tag */}
        <div
          className={`absolute top-3 right-3 z-20 px-3 py-1 rounded-full text-xs font-extrabold shadow-md flex items-center gap-1.5 ${status.style}`}
        >
          {status.isOpen && <span className="pulsing-dot" />}
          <span>{status.label}</span>
        </div>

        {/* Distance Badge */}
        {distanceText && (
          <div className="absolute bottom-3 left-3 z-20 bg-neutral-900/80 text-amber-300 backdrop-blur-md px-2.5 py-0.5 rounded-full text-xs font-bold">
            📍 {distanceText}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Title & Rating Header */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="text-lg font-extrabold text-[var(--text-head)] leading-snug">{bhandara.name}</h3>
          <button
            onClick={() => onOpenReviews(bhandara)}
            className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-lg border border-amber-200 dark:border-amber-900 text-xs font-extrabold shrink-0 hover:scale-105 transition-transform"
          >
            <span>★</span>
            <span>{bhandara.ratingAvg ? bhandara.ratingAvg.toFixed(1) : '4.8'}</span>
            <span className="text-[10px] text-neutral-500">({bhandara.ratingCount || 12})</span>
          </button>
        </div>

        {/* Organizer & Verification */}
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-2 font-medium">
          <span>👤 {bhandara.organizer}</span>
          {bhandara.organizerType === 'verified_ngo' && (
            <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
              {getTranslation(lang, 'verifiedNgo')}
            </span>
          )}
          {bhandara.organizerType === 'temple' && (
            <span className="bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
              {getTranslation(lang, 'verifiedTemple')}
            </span>
          )}
          {bhandara.organizerType === 'verified_ind' && (
            <span className="bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
              {getTranslation(lang, 'verifiedInd')}
            </span>
          )}
        </div>

        {/* Info Rows */}
        <div className="space-y-1 text-xs text-[var(--text-body)] mb-3">
          <div className="flex items-start gap-1.5">
            <span className="shrink-0">📍</span>
            <span className="line-clamp-2">{bhandara.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>📅</span>
            <span>
              {bhandara.date} • {bhandara.startTime} {bhandara.endTime ? `- ${bhandara.endTime}` : ''}
            </span>
            {bhandara.isRecurring && (
              <span className="ml-auto bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
                {bhandara.recurrenceFrequency === 'monthly'
                  ? getTranslation(lang, 'recurringMonthly')
                  : getTranslation(lang, 'recurringWeekly')}
              </span>
            )}
          </div>
          {bhandara.description && (
            <div className="flex items-start gap-1.5 text-[var(--text-muted)] italic">
              <span className="shrink-0">📝</span>
              <span className="line-clamp-2">{bhandara.description}</span>
            </div>
          )}
        </div>

        {/* Food Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {foods.map((food, i) => (
            <span
              key={i}
              className="bg-[var(--bg-chip)] border border-[#F4811F]/20 text-[#F4811F] text-[11px] font-bold px-2.5 py-0.5 rounded-full"
            >
              {food}
            </span>
          ))}
        </div>

        {/* Action Buttons Row */}
        <div className="mt-auto pt-3 border-t border-[var(--divider)] flex items-center justify-between gap-1.5 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={handleOpenMaps}
              className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
            >
              {getTranslation(lang, 'mapsBtn')}
            </button>

            {onSelectOnMap && (
              <button
                onClick={() => onSelectOnMap(bhandara.id)}
                className="bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
              >
                🗺️ {lang === 'hi' ? 'मैप पर देखें' : 'Map Pin'}
              </button>
            )}

            <button
              onClick={handleWhatsAppShare}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-full text-xs font-extrabold transition-all flex items-center gap-1 shadow-sm active:scale-95"
              title={lang === 'hi' ? 'व्हाट्सएप पर शेयर करें' : 'Share on WhatsApp'}
            >
              <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.285-.143-1.689-.834-1.951-.929-.262-.095-.453-.143-.645.143-.19.285-.738.929-.905 1.12-.166.19-.333.214-.618.071-.285-.143-1.207-.445-2.299-1.419-.85-.758-1.424-1.694-1.591-1.98-.166-.285-.018-.439.125-.581.128-.128.285-.333.428-.499.143-.166.19-.285.285-.476.095-.19.048-.357-.024-.499-.071-.143-.645-1.554-.882-2.126-.231-.558-.466-.483-.645-.492-.167-.008-.357-.011-.547-.011-.19 0-.499.071-.761.357-.262.285-1.001.977-1.001 2.385 0 1.407 1.024 2.764 1.167 2.955.143.19 2.015 3.078 4.882 4.316.682.294 1.215.469 1.63.601.685.218 1.309.187 1.802.113.55-.083 1.689-.69 1.927-1.356.238-.666.238-1.237.167-1.356-.07-.119-.261-.19-.546-.333z" />
              </svg>
              <span>WhatsApp</span>
            </button>

            {onOpenQr && (
              <button
                onClick={() => onOpenQr(bhandara)}
                className="bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 px-3 py-1.5 rounded-full text-xs font-bold transition-all border border-amber-300 dark:border-amber-900"
                title={lang === 'hi' ? 'क्यूआर कोड एवं स्थिति' : 'QR Code & Status'}
              >
                📱 QR
              </button>
            )}

            <button
              onClick={() => onOpenVolunteer(bhandara)}
              className="bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
            >
              {getTranslation(lang, 'volunteerBtn')}
            </button>
          </div>

          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={() => onToggleSave(bhandara.id)}
              className={`p-1.5 rounded-full text-xs font-bold transition-all ${
                isSaved
                  ? 'bg-red-100 text-red-600 dark:bg-red-950'
                  : 'bg-[var(--bg-chip)] text-[var(--text-faint)] hover:text-red-500'
              }`}
              title={isSaved ? getTranslation(lang, 'savedBtn') : getTranslation(lang, 'saveBtn')}
            >
              {isSaved ? '❤️' : '🤍'}
            </button>

            <button
              onClick={() => onOpenReport(bhandara)}
              className="p-1.5 rounded-full text-xs font-bold text-[var(--text-faint)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-all"
              title={getTranslation(lang, 'flagBtn')}
            >
              🚩
            </button>

            {isAdmin && (
              <div className="flex items-center gap-1 ml-1 border-l border-[var(--border)] pl-1.5">
                <button
                  onClick={() => onEdit(bhandara)}
                  className="p-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold hover:bg-amber-200 transition-all"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  onClick={() => onDelete(bhandara.id)}
                  className="p-1.5 rounded-full bg-red-100 text-red-800 text-xs font-bold hover:bg-red-200 transition-all"
                  title="Move to Trash"
                >
                  🗑️
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
