function registerServiceWorker() {
    // register sw script in supporting browsers
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js', { scope: '/' }).then(() => {
            console.log('Service Worker registered successfully.');
        }).catch(error => {
            console.log('Service Worker registration failed:', error);
        });
    }
}
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