const CACHE_NAME = 'painel-estudos-v21-12';
const ASSETS = ['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install', event => { self.skipWaiting(); event.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS))); });
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', event => { if (event.request.method !== 'GET') return; event.respondWith(fetch(event.request).then(r => { const copy=r.clone(); caches.open(CACHE_NAME).then(c=>c.put(event.request,copy)); return r; }).catch(()=>caches.match(event.request).then(r=>r||caches.match('./index.html')))); });
