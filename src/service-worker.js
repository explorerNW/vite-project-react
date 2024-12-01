self.addEventListener('install', event => {
  // 在安装过程中，可以选择缓存一些静态资源
  event.waitUntil(
    caches.open('my-cache-v1').then(cache => {
      return cache.addAll(['/', '/index.html']);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // 如果请求的资源已经缓存，则直接返回缓存的资源
      return response || fetch(event.request);
    })
  );
});
