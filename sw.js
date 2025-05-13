const CACHE_NAME = 'nirvana-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/main.js',
  '/js/quotes.js',
  '/js/animations.js',
  '/manifest.json',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://unpkg.com/aos@2.3.1/dist/aos.css',
  '/assets/sounds/rain.mp3',
  '/assets/sounds/forest.mp3',
  '/assets/sounds/waves.mp3',
  '/assets/sounds/fireplace.mp3',
  '/assets/sounds/meditation.mp3'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // If the request is for an audio file, try the network first
      if (event.request.url.endsWith('.mp3')) {
        return fetch(event.request)
          .then((networkResponse) => {
            // Clone the response before caching it
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
            return networkResponse;
          })
          .catch(() => {
            // If network fails, try to return cached version
            return response;
          });
      }
      return response || fetch(event.request);
    })
  );
});
