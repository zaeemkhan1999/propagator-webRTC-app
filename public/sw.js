self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(cacheNames.map((cache) => caches.delete(cache)))
        )
    );
});

self.addEventListener('message', (event) => {
    if (event.data.action === 'clearCache') {
        caches.keys().then((cacheNames) =>
            Promise.all(cacheNames.map((cache) => caches.delete(cache)))
        );
    }
});
