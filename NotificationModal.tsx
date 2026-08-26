import React, { useState } from 'react';
import { Language } from '../types';
import {
  NotificationSettings,
  saveNotificationSettings,
  requestNotificationPermission,
} from '../services/notificationService';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: NotificationSettings;
  onSettingsChange: (s: NotificationSettings) => void;
  userLat: number | null;
  onRequestLocation: () => void;
  lang: Language;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
  userLat,
  onRequestLocation,
  lang,
}) => {
  const [radius, setRadius] = useState<number>(settings.radiusKm || 10);
  const [isEnabled, setIsEnabled] = useState<boolean>(settings.enabled);
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleToggle = async () => {
    if (!isEnabled) {
      setLoading(true);
      const granted = await requestNotificationPermission();
      setLoading(false);
      if (granted) {
        setIsEnabled(true);
        const updated = { enabled: true, radiusKm: radius };
        saveNotificationSettings(updated);
        onSettingsChange(updated);
      } else {
        alert(
          lang === 'hi'
            ? 'सूचना अनुमति (Notification Permission) अस्वीकृत की गई है। कृपया ब्राउज़र से अनुमति दें।'
            : 'Notification permission was denied in browser settings.'
        );
      }
    } else {
      setIsEnabled(false);
      const updated = { enabled: false, radiusKm: radius };
      saveNotificationSettings(updated);
      onSettingsChange(updated);
    }
  };

  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);
    const updated = { enabled: isEnabled, radiusKm: newRadius };
    saveNotificationSettings(updated);
    onSettingsChange(updated);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[700] flex items-center justify-center p-4">
      <div className="bg-[var(--bg-card)] border-2 border-[var(--border)] rounded-3xl w-full max-w-md my-auto overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-r from-[#F4811F] to-amber-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🔔</span>
            <h3 className="text-lg font-extrabold font-['Baloo_2']">
              {lang === 'hi' ? 'पुश नोटिफिकेशन एवं अलर्ट' : 'Push Alerts Settings'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border-2 border-white/40 flex items-center justify-center text-white hover:bg-white/20 transition-all font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-5">
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            {lang === 'hi'
              ? 'जब भी आपके चुने गए रेडियस (दूरी) के अंदर कोई नया भंडारा या प्रसाद वितरण जुड़ेगा, आपके फोन पर तुरंत अलर्ट आएगा!'
              : 'Get real-time push alerts on your phone whenever a new event is added within your chosen radius!'}
          </p>

          {/* Location Warning */}
          {!userLat && (
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-900 rounded-2xl p-3.5 flex items-center justify-between text-xs text-amber-800 dark:text-amber-300">
              <span>📍 सटीक दूरी के लिए लोकेशन ऑन करें:</span>
              <button
                onClick={onRequestLocation}
                className="bg-[#F4811F] text-white px-3 py-1 rounded-full text-[11px] font-bold hover:bg-[#C96000]"
              >
                लोकेशन दें
              </button>
            </div>
          )}

          {/* Toggle Permission Button */}
          <div className="bg-[var(--bg-input)] border border-[var(--border)] rounded-2xl p-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-extrabold text-[var(--text-head)]">
                {lang === 'hi' ? 'पुश अलर्ट चालू करें' : 'Enable Push Alerts'}
              </div>
              <div className="text-[11px] text-[var(--text-faint)]">
                {isEnabled
                  ? lang === 'hi'
                    ? '✅ अलर्ट चालू हैं'
                    : '✅ Alerts enabled'
                  : lang === 'hi'
                  ? '❌ अलर्ट बंद हैं'
                  : '❌ Alerts disabled'}
              </div>
            </div>

            <button
              onClick={handleToggle}
              disabled={loading}
              className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all ${
                isEnabled
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-[#F4811F] text-white hover:bg-[#C96000]'
              }`}
            >
              {loading ? '...' : isEnabled ? 'बंद करें (Disable)' : 'चालू करें (Enable)'}
            </button>
          </div>

          {/* Radius Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--text-head)] flex justify-between">
              <span>{lang === 'hi' ? 'अलर्ट रेडियस (दूरी सीमा):' : 'Alert Radius:'}</span>
              <span className="text-[#F4811F] font-extrabold">{radius} km</span>
            </label>

            <div className="grid grid-cols-4 gap-2">
              {[2, 5, 10, 25].map((r) => (
                <button
                  key={r}
                  onClick={() => handleRadiusChange(r)}
                  className={`py-2 rounded-xl border text-xs font-extrabold transition-all ${
                    radius === r
                      ? 'bg-[#F4811F] border-[#F4811F] text-white shadow'
                      : 'bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-body)] hover:border-[#F4811F]'
                  }`}
                >
                  {r} km
                </button>
              ))}
            </div>
          </div>

          {/* Test Notification Button */}
          {isEnabled && (
            <button
              onClick={() => {
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.ready.then((reg) => {
                    reg.showNotification('🍛 परीक्षण अलर्ट (Test Alert)!', {
                      body: 'यह एक टेस्ट नोटिफिकेशन है। आपका सर्विस वर्कर एवं अलर्ट प्रणाली सही कार्य कर रही है!',
                      icon: '/icon-192.svg',
                      badge: '/icon-192.svg',
                      vibrate: [200, 100, 200],
                    } as NotificationOptions);
                  });
                }
              }}
              className="w-full py-2.5 rounded-xl border border-[#F4811F] text-[#F4811F] font-extrabold text-xs hover:bg-[#F4811F]/10 transition-all"
            >
              🔔 टेस्ट नोटिफिकेशन भेजें (Send Test Alert)
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-head)] py-2.5 rounded-xl font-extrabold text-xs hover:border-[#F4811F]"
          >
            सहेजें एवं बंद करें
          </button>
        </div>
      </div>
    </div>
  );
};
