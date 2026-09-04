/**
 * Service Worker: Yalla Arabi PWA (یەڵڵا عەرەبی)
 * Provides 100% complete offline access for Samsung Galaxy S23 Ultra and mobile devices
 */

const CACHE_NAME = 'yalla-arabi-v1';

const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './js/audio-engine.js',
  './js/data/curriculum-a1-a2.js',
  './js/data/curriculum-b1-b2.js',
  './js/data/curriculum-c1-c2.js',
  './js/data/vocabulary-database.js',
  './js/data/dialogues-data.js',
  './js/data/grammar-patterns.js',
  './js/data/unit-guidebooks.js',
  './js/data/medical-guidebooks.js',
  './js/data/medical-glossary.js',
  './js/data/medical-curriculum.js',
  './js/data/medical-curriculum-b1-c2.js',
  './js/components/learning-path.js',
  './js/components/exercise-engine.js',
  './js/components/medical-course.js',
  './js/components/srs-vocab.js',
  './js/components/dialogue-player.js',
  './js/components/grammar-guide.js',
  './js/components/leaderboard-quests.js',
  './js/app.js'
];

// Install: Cache all static assets immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('Pre-cache error (non-fatal):', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up any old caches and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Cache-First for app assets, Stale-While-Revalidate for CDNs
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // For app origin requests: Cache-First
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Return cache, optionally update in background
          fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
            }
          }).catch(() => {});
          return cachedResponse;
        }

        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        }).catch(() => {
          // If offline and request is a page navigation, return index.html
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
    );
    return;
  }

  // For external assets (CDN scripts, fonts, tailwind): Cache with Network Fallback
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      }).catch(() => cached);
    })
  );
});
