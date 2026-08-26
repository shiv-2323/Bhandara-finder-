// Notification & FCM Push Alert Helper
import { calculateDistance } from '../utils/geo';
import { BhandaraEvent } from '../types';

export interface NotificationSettings {
  enabled: boolean;
  radiusKm: number; // Notification alert distance radius (default 10km)
}

const SETTINGS_KEY = 'bh_notif_settings';

export function getStoredNotificationSettings(): NotificationSettings {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? JSON.parse(saved) : { enabled: false, radiusKm: 10 };
  } catch {
    return { enabled: false, radiusKm: 10 };
  }
}

export function saveNotificationSettings(settings: NotificationSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// Request Notification Permission from Browser
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    alert('आपका ब्राउज़र Push Notifications सपोर्ट नहीं करता।');
    return false;
  }

  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    // Show test notification
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready;
      reg.showNotification('🔔 भंडारा नोटिफिकेशन सक्रिय!', {
        body: 'अब आपके चुने हुए क्षेत्र में नया भंडारा जुड़ते ही अलर्ट मिलेगा। जय श्री राम! 🙏',
        icon: '/icon-192.svg',
        badge: '/icon-192.svg',
        vibrate: [200, 100, 200],
        tag: 'welcome-alert',
      } as NotificationOptions);
    }
    return true;
  }
  return false;
}

// Trigger alert if a new Bhandara is within user's alert radius
export async function notifyNewBhandaraIfNearby(
  event: BhandaraEvent,
  userLat: number | null,
  userLng: number | null,
  settings: NotificationSettings
) {
  if (!settings.enabled || !userLat || !userLng || !event.lat || !event.lng) {
    return;
  }

  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  const distance = calculateDistance(userLat, userLng, event.lat, event.lng);

  if (distance <= settings.radiusKm) {
    const distText = distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)} km`;
    const title = `🚨 नया भंडारा! (${distText} दूर)`;
    const body = `📍 ${event.name}\nस्थान: ${event.location}\nभोजन: ${event.food || 'प्रसाद distribution'}`;

    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready;
      reg.showNotification(title, {
        body,
        icon: '/icon-192.svg',
        badge: '/icon-192.svg',
        tag: `new-event-${event.id}`,
        vibrate: [300, 100, 300],
        data: { url: `/#event-${event.id}` },
      } as NotificationOptions);
    } else {
      new Notification(title, { body, icon: '/icon-192.svg' });
    }
  }
}
