// Clínica Inove - Service Worker
// Versão: 3

const CACHE_NAME = 'clinica-inove-v3'; // ← Incrementa versão
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  
  // ✅ IMAGENS CORRIGIDAS (remove /image/ duplicado)
  '/image/clinica-inove-logotipo-hero.webp',
  '/image/Pilates-hero.webp',
  '/image/dra-emlyn-fisioterapeuta-e-instrutora-de-pilates.webp',
  '/image/clinica-inove-estudio-tablet.webp',
  '/image/clinica-inove-estudio.webp',
  '/image/background.webp',
  '/image/logotipo-footer.webp',
  
  // ✅ FONTE LOCAL
  '/fonts/Marginal.woff2'
  
  // ❌ REMOVI GOOGLE FONTS (cache dinâmico vai pegar)
];

// Instalação do Service Worker
self.addEventListener('install', event => {
  console.log('[SW] Instalando Service Worker v2...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Cache aberto');
        
        // ✅ Cache individual com fallback
        const cachePromises = urlsToCache.map(url => {
          return cache.add(url).catch(err => {
            console.warn(`[SW] Falha ao cachear ${url}:`, err);
          });
        });
        
        return Promise.allSettled(cachePromises);
      })
      .catch(err => {
        console.error('[SW] Erro ao abrir cache:', err);
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
            // ✅ Não cacheia se não for sucesso
            if (!response || response.status !== 200) {
              return response;
            }
            
            // ✅ Só cacheia recursos locais ou CORS-enabled
            if (response.type === 'basic' || response.type === 'cors') {
              const responseToCache = response.clone();
              
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }
            
            return response;
          })
          .catch(err => {
            console.error('[SW] Erro ao buscar:', err);
            
            // ✅ Fallback offline
            if (event.request.destination === 'document') {
              return caches.match('/');
            }
          });
      })
  );
});

// ✅ Skip waiting message
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});