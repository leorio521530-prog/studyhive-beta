// StudyHive service worker
//
// WHAT THIS DOES:
// - Caches the app's own static files (HTML/CSS/JS/icons) so the app can
//   load even with a flaky or missing connection (the PWA requirement).
// - Deliberately does NOT touch Supabase requests (auth, database reads/
//   writes) or any other cross-origin request — those always go straight
//   to the network. Study post data is live data; caching it would mean
//   showing stale/wrong posts, and caching auth requests could break login
//   entirely. A service worker intercepts EVERY request on the page by
//   default, so this filtering has to be explicit — see shouldHandle().
//
// CACHE VERSIONING:
// Bump CACHE_NAME (e.g. 'studyhive-v2') any time you change this file's
// PRECACHE_URLS list or want to force everyone's cached files to refresh.
// Old caches are deleted automatically in the 'activate' step below.

const CACHE_NAME = 'studyhive-v1';

// Same-origin files to cache immediately on install, so the shell of the
// app works offline right away. Paths are relative to this file's
// location (the project root), matching the rest of the site.
const PRECACHE_URLS = [
  './',
  './index.html',
  './css/styles.css',
  './js/nav.js',
  './js/auth.js',
  './js/constants.js',
  './js/feed.js',
  './js/filter.js',
  './js/post-detail.js',
  './js/supabaseClient.js',
  './pages/login.html',
  './pages/signup.html',
  './pages/create-post.html',
  './pages/edit-post.html',
  './pages/post-detail.html',
  './assets/logo/logo-mark.svg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './manifest.webmanifest',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  // Activate this new service worker as soon as it finishes installing,
  // rather than waiting for every open tab to be closed first.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  // Take control of any already-open tabs immediately, instead of only
  // controlling tabs opened after this activation.
  self.clients.claim();
});

// Only cache same-origin GET requests. Everything else (Supabase's API,
// the jsdelivr CDN import, POST/PATCH/DELETE requests) is explicitly left
// alone and goes straight to the network.
function shouldHandle(request) {
  if (request.method !== 'GET') return false;
  const url = new URL(request.url);
  return url.origin === self.location.origin;
}

self.addEventListener('fetch', (event) => {
  if (!shouldHandle(event.request)) {
    return; // let the browser handle it normally — no interception at all
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Stale-while-revalidate: serve the cached version instantly if we
      // have one (fast, works offline), but always fetch a fresh copy in
      // the background and update the cache for next time. This avoids
      // the classic "I fixed the bug but the service worker keeps serving
      // the old file" problem for anything short of a hard cache-name bump.
      const networkFetch = fetch(event.request)
        .then((networkResponse) => {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });
          return networkResponse;
        })
        .catch(() => cachedResponse); // offline and not cached yet → give up gracefully

      return cachedResponse || networkFetch;
    })
  );
});
