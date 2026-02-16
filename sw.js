
const CACHE_NAME = 'registro-v4';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(key => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Estrategia: Red primero, si falla, caché.
  // Esto asegura que siempre veas los cambios si tienes internet.
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
