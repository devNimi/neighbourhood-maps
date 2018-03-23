importScripts('/cache-polyfill.js');

self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('developmwnt-Neighbourhood-map-app').then(function(cache) {
     return cache.addAll([
       // '/',
       // '/index.html',
       // 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css',
       // 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css',
       // 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
       // 'https://cdnjs.cloudflare.com/ajax/libs/open-iconic/1.1.1/font/css/open-iconic-bootstrap.min.css',
       // '/css/styles.css',
       // '/css/search-bar.css',
       // '/css/styles.css',
       // '/css/responsive.css',
       // '/js/app.js',
       // '/js/sidebar.js',
       // '/js/screenfull.min.js'
     ]);
   })
 );
});

self.addEventListener('fetch', function(event) {

  // console.log(event.request.url);

  event.respondWith(

    caches.match(event.request).then(function(response) {

      return response || fetch(event.request);

    })

  );

});
