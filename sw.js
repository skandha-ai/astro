/* Skandha's Astro: offline support. The page itself is always fetched fresh when online
   (so new versions appear at once) and served from the cache when offline. */
const CACHE='skastro-2026-11-06b';
const CORE=['/','/index.html','/manifest.webmanifest','/icon-192.png','/icon-512.png','/apple-touch-icon.png','/fonts/arima-latin-400-normal.woff2','/fonts/arima-latin-700-normal.woff2','/fonts/arima-tamil-400-normal.woff2','/fonts/arima-tamil-700-normal.woff2','/fonts/catamaran-latin-400-normal.woff2','/fonts/catamaran-latin-600-normal.woff2','/fonts/catamaran-latin-700-normal.woff2','/fonts/catamaran-tamil-400-normal.woff2','/fonts/catamaran-tamil-600-normal.woff2','/fonts/catamaran-tamil-700-normal.woff2'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  const u=new URL(r.url); if(u.origin!==location.origin) return;          // visitor counter and other sites: not cached
  if(r.mode==='navigate'){
    e.respondWith(fetch(r).then(res=>{ const cp=res.clone(); caches.open(CACHE).then(c=>c.put(r,cp)); return res; })
      .catch(()=>caches.match(r).then(x=>x||caches.match('/'))));
    return;
  }
  e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{ if(res.ok){ const cp=res.clone(); caches.open(CACHE).then(c=>c.put(r,cp)); } return res; })));
});
