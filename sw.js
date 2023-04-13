
const staticCacheName = 'site-static-v4';
const dynamicCacheName = 'site-dynamic-v4';
const assets = [
    './index.html',
    './style.css',
    './assets/fonts/IndianSignLangage.ttf',
    './assets/fonts/Aclonica-Regular.ttf',
    './assets/fonts/Poppins-Regular.ttf',
    './assets/images/contact-us-option-btn-img.png',
    './assets/images/contribute-option-btn-img.png',
    './assets/images/learn-option-btn-img.png',
    './assets/images/translate-option-btn-img.png',
    './assets/images/sanket-logo.png',
    './assets/images/demo-pfp.png',
];



// install event
self.addEventListener('install', evt => {
    //console.log('service worker installed');
    evt.waitUntil(
        caches.open(staticCacheName).then((cache) => {
            console.log('caching shell assets');
            cache.addAll(assets);
        })
    );
});

// activate event
self.addEventListener('activate', evt => {
    //console.log('service worker activated');
    evt.waitUntil(
        caches.keys().then(keys => {
            //console.log(keys);
            return Promise.all(keys
                .filter(key => key !== staticCacheName && key !== dynamicCacheName)
                .map(key => caches.delete(key))
            );
        })
    );
});

// fetch event
self.addEventListener('fetch', evt => {
    //console.log('fetch event', evt);
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            return cacheRes || fetch(evt.request).then(fetchRes => {
                return caches.open(dynamicCacheName).then(cache => {
                    cache.put(evt.request.url, fetchRes.clone());
                    // check cached items size
                    // limitCacheSize(dynamicCacheName, 15);
                    return fetchRes;
                })
            });
        }).catch(() => {
            if (evt.request.url.indexOf('.html') > -1) {
                return caches.match('index.html');
            }
        })
    );
});
