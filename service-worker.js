self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('app-cache').then(cache => cache.addAll([
      './',
      './index.html',
      './dist/output.css',
      './styles.css',
      './links.json',
      './images/'
    ]))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
