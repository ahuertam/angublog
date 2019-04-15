// function registerServiceWorker() {
//     // register sw script in supporting browsers
//     if ('serviceWorker' in navigator) {
//         navigator.serviceWorker.register('sw.js', { scope: '/' }).then(() => {
//             console.log('Service Worker registered successfully.');
//         }).catch(error => {
//             console.log('Service Worker registration failed:', error);
//         });
//     }
// }
self.addEventListener('install', e => {
    e.waitUntil(
        // after the service worker is installed,
        // open a new cache
        caches.open('my-pwa-cache').then(cache => {
            // add all URLs of resources we want to cache
            return cache.addAll([
                '/',
                '/index.html',
                '/favicon.ico',
                '/styles/main.min.css',
                '/scripts/main.min.js',
            ]);
        })
    );
});

// This is the "Offline page" service worker

const CACHE = "cacheSW-page";
const offlineFallbackPage = "shame.html";

// Install stage sets up the offline page in the cache and opens a new cache
self.addEventListener("install", e => {
    event.waitUntil(
        // after the service worker is installed,
        // open a new cache
        caches.open(CACHE).then(cache => {
            console.log("Cached offline page during install");
            if (offlineFallbackPage === "shame.html") {
                return cache.add(new Response("TODO: Update the value of the offlineFallbackPage constant in the serviceworker."));
            }

            return cache.add(offlineFallbackPage);
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