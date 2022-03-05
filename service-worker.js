const APP_PREFIX = 'FinanceMonitor-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

const FILES_TO_CACHE = [
    "./index.html",
    "./public/css/style.css",
    // "./dist/app.bundle.js",
    // "./dist/events.bundle.js",
    // "./dist/tickets.bundle.js",
    // "./dist/schedule.bundle.js"
];

self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('installing cache : ' + CACHE_NAME)
            return cache.addAll(FILES_TO_CACHE)
        })
    )


})