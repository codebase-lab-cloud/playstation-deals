// PS Deals PWA - Service Worker - Cache v15 - Good Favicon + Gradient Big PS Deals
const CACHE_NAME = 'ps-deals-v15';
const PRECACHE_URLS = [
  './',
  'index.html',
  'manifest.json?v=15',
  'icon-512.png?v=15',
  'icon-192.png?v=15',
  'apple-touch-icon-180.png?v=15',
  'favicon-32.png?v=15',
  'icon-32.png?v=15'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Network first for API, cache first for assets
  if (event.request.url.includes('store.playstation.com')) {
    return; // let browser handle live API
  }
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(resp => {
        // cache new assets
        if (event.request.url.match(/\.(png|json|html)$/)) {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        }
        return resp;
      });
    })
  );
});
