// Clínica Inove - Service Worker
// Versão: 1.0.0

const CACHE_NAME = 'clinica-inove-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js', // ← CORRIGIDO
  '/image/Logo-clinica-inove.png',
  '/image/Pilates-hero.jpg',
  '/image/Emlyn.webp',
  '/image/clinica-inove-estudio.jpeg',
  '/image/background.jpg',
  '/image/Estudio.jpeg',
  '/image/Logotipo-Inove-Adendo.jpg',
  '/fonts/Marginal.woff2',
  'https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;500;600;700&display=swap'
];

// Instalação do Service Worker
self.addEventListener('install', event => {
  console.log('[SW] Instalando Service Worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Cache aberto');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('[SW] Erro ao cachear:', err);
      })
  );
  
  self.skipWaiting();
});

// Ativação do Service Worker
self.addEventListener('activate', event => {
  console.log('[SW] Ativando Service Worker...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  return self.clients.claim();
});

// Interceptação de requisições (Fetch)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        
        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(err => {
            console.error('[SW] Erro ao buscar:', err);
            
            if (event.request.destination === 'document') {
              return caches.match('/');
            }
          });
      })
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});