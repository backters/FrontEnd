const CACHE_NAME = 'pwa-dia-dos-namorados';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/background.jpg',
  '/assets/background2.jpg',
  '/assets/foto.jpeg',
  '/assets/foto1.jpeg',
  '/assets/foto2.jpg',
  '/assets/foto3.jpeg',
  '/assets/foto25.jpeg',
  '/assets/envelope-fechado.png',
  '/assets/envelope-aberto.png',
  '/assets/coracao.png',
  '/assets/butterfly.png',
  '/assets/audio.mp3',
];

// Instala e pré-carrega os recursos essenciais
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Ativa e limpa caches antigos se necessário
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

// Intercepta requisições e responde do cache ou da rede
self.addEventListener('fetch', event => {
  const requestURL = new URL(event.request.url);

  // Cache First para arquivos do app
  if (requestURL.origin === location.origin) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          return cachedResponse || fetch(event.request)
            .then(networkResponse => {
              return caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
              });
            });
        }).catch(() => {
          // Opcional: retornar fallback offline se necessário
        })
    );
  }
});
