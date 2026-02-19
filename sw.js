// Clínica Inove - Service Worker
// Versão: 1.0.0

const CACHE_NAME = 'clinica-inove-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/java script.js',
  '/image/Logo-clinica-inove.png',
  '/image/Pilates-hero.jpg',
  '/image/Emlyn.webp',
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
  
  // Força o novo SW a assumir imediatamente
  self.skipWaiting();
});

// Ativação do Service Worker
self.addEventListener('activate', event => {
  console.log('[SW] Ativando Service Worker...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Remove caches antigos
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Assume controle imediatamente
  return self.clients.claim();
});

// Interceptação de requisições (Fetch)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retorna do cache se existir
        if (response) {
          console.log('[SW] Servindo do cache:', event.request.url);
          return response;
        }
        
        // Se não, busca da rede
        return fetch(event.request)
          .then(response => {
            // Verifica se é uma resposta válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clona a resposta
            const responseToCache = response.clone();
            
            // Adiciona ao cache
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(err => {
            console.error('[SW] Erro ao buscar:', err);
            
            // Página offline de fallback (opcional)
            if (event.request.destination === 'document') {
              return caches.match('/');
            }
          });
      })
  );
});

// Listener para mensagens
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});