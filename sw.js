var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
    '/index.html',
    '/style/*',
    '/img/*',
    '/script/*',
];

self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        }).then(function () {
            // updated sw.js take control over the old sw.js
            // without waiting for the client to close the website or for a period of time to pass
            return self.skipWaiting();
        }).catch(function (err) {
            console.log('Cache Failed', err);
        })
    );
});

// if not in cache fetch the url without caching
self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            // Cache hit - return response
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
});

// delete cache when new SW is activated
self.addEventListener('activate', function (event) {
    var cacheWhitelist = [CACHE_NAME]; // multiple values can be added
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // clients loaded in the same scope do not need to be reloaded before their fetches will go through this service worker
    return self.clients.claim();
});