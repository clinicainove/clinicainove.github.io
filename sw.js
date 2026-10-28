// Clínica Inove - Service Worker
// Versão: 9
// HTML, CSS e JS: rede primeiro. Cache só se estiver offline.
// Imagens e fonte: cache primeiro.

const CACHE_NAME = 'clinica-inove-v9-bf';

const urlsToCache = [
  '/image/clinica-inove-logotipo-hero.webp',
  '/image/Pilates-hero.webp',
  '/image/dra-emlyn-fisioterapeuta-e-instrutora-de-pilates.webp',
  '/image/clinica-inove-estudio-tablet.webp',
  '/image/clinica-inove-estudio.webp',
  '/image/background.webp',
  '/image/logotipo-footer.webp',
  '/fonts/Marginal.woff2'
];

function isAppCode(request, url) {
  if (url.origin !== self.location.origin) return false;
  return (
    request.mode === 'navigate' ||
    request.destination === 'document' ||
    request.destination === 'script' ||
    request.destination === 'style' ||
    url.pathname === '/' ||
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js')
  );
}

function networkFirst(request) {
  return fetch(request)
    .then(response => {
      if (response && response.status === 200 && (response.type === 'basic' || response.type === 'cors')) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
      }
      return response;
    })
    .catch(() =>
      caches.match(request, { ignoreSearch: true }).then(cached => cached || caches.match('/'))
    );
}

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.allSettled(
        urlsToCache.map(url =>
          cache.add(url).catch(err => console.warn(`[SW] Falha ao cachear ${url}:`, err))
        )
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(names =>
        Promise.all(names.map(name => (name !== CACHE_NAME ? caches.delete(name) : null)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') return;

  if (isAppCode(event.request, url)) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200) return response;
        if (response.type === 'basic' || response.type === 'cors') {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      });
    })
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
