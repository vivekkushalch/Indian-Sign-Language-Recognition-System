assets = [
    '.',
    'index.html',
    './assets/img/arrow-back.png',
    './assets/img/bottom-sheet.png',
    './assets/img/camera-icon.png',
    './assets/img/controls-bg.png',
    '/Indian-Sign-Language-Recognition-System/assets/img/favicon.png',
    './assets/img/google-translate-icon.png',
    './assets/img/speaker-icon.png',
    './assets/img/transcript-expand-icon.png',
    './assets/img/transcript-heading.png',
    './assets/img/transcript-settings-icon.png',
    './assets/img/upload-icon.png',
    './assets/img/webcam_banner.png',
    './assets/js/translate.js',
    './assets/styles/translate.css',
    'manifest.json'

]

//install and cache assets
self.addEventListener('install', e => {
    console.log('SW installed!');
    e.waitUntil(
        caches.open("static").then(cache => {
            return cache.addAll(assets)
        })
    );
});



//fetch interseption for cache reuse
self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(response => {
            return response || fetch(e.request);
        })
    );
    // console.log(`Intersepting fetch req for: ${e.request.url}`);
});
