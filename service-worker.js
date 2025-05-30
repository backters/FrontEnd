self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("static-v1").then(cache =>
      cache.addAll([
        "./",
        "./index.html",
        "./css/style.css",
        "./js/script.js",
        "./assets/envelope-fechado.png",
        "./assets/envelope-aberto.png",
        "./assets/background.jpg",
        "./assets/foto.jpeg",
        "./assets/foto2.jpg",
        "./assets/coracao.png",
        "./assets/butterfly.png",
        "./assets/musica.mp3",
        "./manifest.json"
      ])
    )
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
