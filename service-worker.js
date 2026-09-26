const CACHE = 'painel-estudos-pwa-v1';
const CORE = ['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
const EXTERNAL = [
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@600;700;800&display=swap'
];
self.addEventListener('install', e => {
  e.waitUntil((async()=>{
    const c=await caches.open(CACHE);
    await c.addAll(CORE);
    await Promise.all(EXTERNAL.map(async u=>{try{const r=await fetch(u,{mode:'no-cors'}); await c.put(u,r);}catch(_){}}));
  })());
});
self.addEventListener('activate', e => {
  e.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('message', e => { if(e.data && e.data.type==='SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('fetch', e => {
  if(e.request.method!=='GET') return;
  e.respondWith((async()=>{
    const cached=await caches.match(e.request);
    if(cached) return cached;
    try {
      const fresh=await fetch(e.request);
      const c=await caches.open(CACHE);
      c.put(e.request,fresh.clone());
      return fresh;
    } catch(err) {
      if(e.request.mode==='navigate') return (await caches.match('./index.html'));
      throw err;
    }
  })());
});
