// /*
// Copyright 2015, 2019 Google Inc. All Rights Reserved.
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//  http://www.apache.org/licenses/LICENSE-2.0
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
// */

// // Incrementing OFFLINE_VERSION will kick off the install event and force
// // previously cached resources to be updated from the network.
// const OFFLINE_VERSION = 1;
// const CACHE_NAME = 'offline';
// // Customize this with a different URL if needed.
// const OFFLINE_URL = 'index.html';

// const assets = [
//     '/manifest.webmanifest',
//     '/index.html',
//     '/style.css',
//     '/generate-sw.js',
//     '/assets/fonts/IndianSignLangage.ttf',
//     '/assets/fonts/Aclonica-Regular.ttf',
//     '/assets/fonts/Poppins-Regular.ttf',
//     '/assets/images/contact-us-option-btn-img.png',
//     '/assets/images/contribute-option-btn-img.png',
//     '/assets/images/learn-option-btn-img.png',
//     '/assets/images/translate-option-btn-img.png',
//     '/assets/images/sanket-logo.png',
//     '/assets/images/demo-pfp.png',
// ]

// self.addEventListener('install', (event) => {
//     event.waitUntil((async() => {
//         const cache = await caches.open(CACHE_NAME);
//         // Setting {cache: 'reload'} in the new request will ensure that the response
//         // isn't fulfilled from the HTTP cache; i.e., it will be from the network.
//         for await (let i of assets) {
//             await cache.add(new Request(i, { cache: 'reload' }));
//         }
//         // await cache.add(new Request(OFFLINE_URL, { cache: 'reload' }));

//     })());
// });

// self.addEventListener('activate', (event) => {
//     event.waitUntil((async() => {
//         // Enable navigation preload if it's supported.
//         // See https://developers.google.com/web/updates/2017/02/navigation-preload
//         if ('navigationPreload' in self.registration) {
//             await self.registration.navigationPreload.enable();
//         }
//     })());

//     // Tell the active service worker to take control of the page immediately.
//     self.clients.claim();
// });

// self.addEventListener('fetch', (event) => {
//     // We only want to call event.respondWith() if this is a navigation request
//     // for an HTML page.
//     if (event.request.mode === 'navigate') {
//         event.respondWith((async() => {
//             try {
//                 // First, try to use the navigation preload response if it's supported.
//                 const preloadResponse = await event.preloadResponse;
//                 if (preloadResponse) {
//                     return preloadResponse;
//                 }

//                 const networkResponse = await fetch(event.request);
//                 return networkResponse;
//             } catch (error) {
//                 // catch is only triggered if an exception is thrown, which is likely
//                 // due to a network error.
//                 // If fetch() returns a valid HTTP response with a response code in
//                 // the 4xx or 5xx range, the catch() will NOT be called.
//                 console.log('Fetch failed; returning offline page instead.', error);

//                 const cache = await caches.open(CACHE_NAME);
//                 const cachedResponse = await cache.match(OFFLINE_URL);
//                 return cachedResponse;
//             }
//         })());
//     }

//     // If our if() condition is false, then this fetch handler won't intercept the
//     // request. If there are any other fetch handlers registered, they will get a
//     // chance to call event.respondWith(). If no fetch handlers call
//     // event.respondWith(), the request will be handled by the browser as if there
//     // were no service worker involvement.
// });
const staticCacheName = 'site-static-v4';
const dynamicCacheName = 'site-dynamic-v4';
const assets = [
    '/index.html',
    '/style.css',
    '/assets/fonts/IndianSignLangage.ttf',
    '/assets/fonts/Aclonica-Regular.ttf',
    '/assets/fonts/Poppins-Regular.ttf',
    '/assets/images/contact-us-option-btn-img.png',
    '/assets/images/contribute-option-btn-img.png',
    '/assets/images/learn-option-btn-img.png',
    '/assets/images/translate-option-btn-img.png',
    '/assets/images/sanket-logo.png',
    '/assets/images/demo-pfp.png',
];

// // cache size limit function
// const limitCacheSize = (name, size) => {
//     caches.open(name).then(cache => {
//         cache.keys().then(keys => {
//             if (keys.length > size) {
//                 cache.delete(keys[0]).then(limitCacheSize(name, size));
//             }
//         });
//     });
// };

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