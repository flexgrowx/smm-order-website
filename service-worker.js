const CACHE_NAME = "growx-order-v1";

const APP_FILES = [
  "./",
  "./index.html",
  "./manifest.json"
];


/* =========================
INSTALL
========================= */

self.addEventListener("install", function(event){

event.waitUntil(

caches.open(CACHE_NAME)
.then(function(cache){

return cache.addAll(APP_FILES);

})

);

self.skipWaiting();

});


/* =========================
ACTIVATE
========================= */

self.addEventListener("activate", function(event){

event.waitUntil(

caches.keys()
.then(function(cacheNames){

return Promise.all(

cacheNames
.filter(function(name){

return name !== CACHE_NAME;

})
.map(function(name){

return caches.delete(name);

})

);

})
.then(function(){

return self.clients.claim();

})

);

});


/* =========================
FETCH
========================= */

self.addEventListener("fetch", function(event){

if(event.request.method !== "GET"){
return;
}

const requestURL =
new URL(event.request.url);


/* Only handle GROWX/GitHub Pages files */

if(requestURL.origin !== self.location.origin){
return;
}


event.respondWith(

caches.match(event.request)
.then(function(cachedResponse){

if(cachedResponse){

return cachedResponse;

}


return fetch(event.request)
.then(function(networkResponse){

if(
!networkResponse ||
networkResponse.status !== 200 ||
networkResponse.type === "opaque"
){

return networkResponse;

}


const responseClone =
networkResponse.clone();


caches.open(CACHE_NAME)
.then(function(cache){

cache.put(
event.request,
responseClone
);

});


return networkResponse;

})
.catch(function(){

return caches.match("./index.html");

});

})

);

});
