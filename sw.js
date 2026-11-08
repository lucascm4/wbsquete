/* WBSQUETE: deixa o app instalável e abre rápido.
   Página e scripts: sempre tenta a rede primeiro (pra pegar versão nova), cai pro cache sem internet.
   Imagens: cache primeiro. Dados da ESPN: nunca passam por aqui. */
const C="wbsquete-v3";
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(["./","./index.html","./fotos.js","./hist.js","./radar.js","./img/cinturao.webp"]).catch(()=>{})))});
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=="GET"||u.origin!==location.origin)return;
  if(u.pathname.includes("/img/")){
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(e.request,cp));return res})));return;
  }
  e.respondWith(fetch(e.request).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(e.request,cp));return res}).catch(()=>caches.match(e.request).then(r=>r||caches.match("./index.html"))));
});
