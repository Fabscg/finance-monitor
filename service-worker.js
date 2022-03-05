const APP_PREFIX = 'FinanceMonitor-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

const FILES_TO_CACHE = [
    "./index.html",
    "./routes.api.js",
    "./js/index.js",
    "./js/idb.js",
    "./public/css/style.css"
];

//Respond with cached resources

self.addEventListener('fetch', function (e) {
    e.respondingWith(
        caches.match(e.request).then(function (request) {
            if (request) {
                console.log('responding with cache : ' + e.request.url)
                return request
            } else {
                console.log('file is not cached, fetching :' + e.request.url)
                return fetch(e.request)
            }
        })
    )
})

//cache resources

self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('installing cache : ' + CACHE_NAME)
            return cache.addAll(FILES_TO_CACHE)
        })
    )
})


//delete outdated caches
self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(function (keyList) {
            let cacheKeeplist = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX);
            })
            cacheKeeplist.push(CACHE_NAME)

            return Promise.all(keyList).map(function (key, i) {
                if (cacheKeeplist.indexOf(key) === -1) {
                    console.log('deleting cache : ' + keyList[i])
                    return caches.delete(keyList[i])
                }
            })
        })
    )
})