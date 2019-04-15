// This is the "Offline page" service worker

const CACHE = "cacheSW-page";
const offlineFallbackPage = "shame.html";

self.addEventListener('install', e => {
    e.waitUntil(
        // after the service worker is installed,
        // open a new cache
        caches.open(CACHE).then(cache => {
            // add all URLs of resources we want to cache
            return cache.addAll([
                '/',
                '/index.html',
                '/favicon.ico',
                '/shame.css',
                '/shame.html',
                '/apple-touch-icon.png',
            ]);
        })
    );
});


// If any fetch fails, it will show the offline page.
self.addEventListener("fetch", function(event) {
    if (event.request.method !== "GET") return;

    event.respondWith(
        fetch(event.request).catch(function(error) {
            // The following validates that the request was for a navigation to a new document
            if (
                event.request.destination !== "document" ||
                event.request.mode !== "navigate"
            ) {
                return;
            }
            console.error("Network request Failed. Serving offline page " + error);
            return caches.open(CACHE).then(function(cache) {
                return cache.match(offlineFallbackPage);
            });
        })
    );
});

// This is an event that can be fired from your page to tell the SW to update the offline page
self.addEventListener("refreshOffline", function() {
    const offlinePageRequest = new Request(offlineFallbackPage);

    return fetch(offlineFallbackPage).then(function(response) {
        return caches.open(CACHE).then(function(cache) {
            console.log("Offline page updated from refreshOffline event: " + response.url);
            return cache.put(offlinePageRequest, response);
        });
    });
});