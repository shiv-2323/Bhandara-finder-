const CACHE_NAME = 'bhandara-finder-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.svg',
  '/icon-512.svg',
];

// Firebase Compat Libraries for Service Worker FCM
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

const firebaseConfig = {
  projectId: "encoded-core-q9v0l",
  appId: "1:942655703429:web:88dc617153f29e306b9cec",
  apiKey: "AIzaSyAy2NviwVF_bGI0jw0cmDeBjtApIRwIrEk",
  authDomain: "encoded-core-q9v0l.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-bhandarafinder-b181d8e7-1b27-4114-8b65-bb12a55a63dd",
  storageBucket: "encoded-core-q9v0l.firebasestorage.app",
  messagingSenderId: "942655703429",
};

try {
  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
  }

  const messaging = firebase.messaging();

  // FCM Background Notification Handler
  messaging.onBackgroundMessage((payload) => {
    console.log('[sw.js] FCM Background message received:', payload);
    const title = payload.notification?.title || payload.data?.title || '🚨 नया भंडारा अलर्ट!';
    const options = {
      body: payload.notification?.body || payload.data?.body || 'आपके नज़दीक नया भंडारा एवं प्रसाद वितरण जोड़ा गया है।',
      icon: payload.notification?.icon || '/icon-192.svg',
      badge: '/icon-192.svg',
      image: payload.notification?.image || payload.data?.image,
      vibrate: [200, 100, 200],
      tag: 'fcm-bhandara-alert',
      data: payload.data || { url: '/' },
    };

    self.registration.showNotification(title, options);
  });
} catch (err) {
  console.warn('[sw.js] Firebase Messaging initialization warning:', err);
}

// Install event - Cache core static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
          console.warn('Pre-caching warning:', err);
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - Cleanup stale caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              return caches.delete(cache);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - Stale-while-revalidate strategy
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return cachedResponse || new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
        });

      return cachedResponse || fetchPromise;
    })
  );
});

// Web Push Event Handler
self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: '🚨 नया भंडारा अलर्ट!', body: event.data.text() };
    }
  }

  const title = data.title || data.notification?.title || '📍 आपके पास नया भंडारा उपलब्ध है!';
  const options = {
    body: data.body || data.notification?.body || 'आपके चयनित रेडियस में नया प्रसाद वितरण जोड़ा गया है।',
    icon: data.icon || '/icon-192.svg',
    badge: '/icon-192.svg',
    image: data.image || data.notification?.image,
    data: data.data || { url: '/' },
    vibrate: [300, 100, 300],
    tag: 'bhandara-push-alert',
    actions: [
      { action: 'open', title: '🔍 खोलें' },
      { action: 'close', title: 'बंद करें' }
    ]
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification Click Handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') return;

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let client of windowClients) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
