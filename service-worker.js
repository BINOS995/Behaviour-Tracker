const CACHE_NAME = 'behaviour-tracker-v4';
const STATIC_CACHE_NAME = 'behaviour-tracker-static-v4';
const DYNAMIC_CACHE_NAME = 'behaviour-tracker-dynamic-v4';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/dashboard.css',
  '/parent-styles.css',
  '/script.js',
  '/dashboard.html',
  '/parent-app.html',
  '/add-test-student.html',
  '/check-phone-numbers.html',
  '/homepage.js',
  '/firebaseauth.js',
  '/images/logo1.png',
  '/images/DT.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap'
];

// Firebase-related assets
const FIREBASE_ASSETS = [
  'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch(error => {
        console.error('[SW] Error caching static assets:', error);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE_NAME && 
              cacheName !== DYNAMIC_CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests (Firebase, CDNs)
  if (url.origin !== location.origin) {
    // Cache Firebase assets
    if (FIREBASE_ASSETS.includes(request.url)) {
      event.respondWith(
        caches.match(request)
          .then(response => {
            return response || fetch(request).then(fetchResponse => {
              return caches.open(STATIC_CACHE_NAME)
                .then(cache => {
                  cache.put(request, fetchResponse.clone());
                  return fetchResponse;
                });
            });
          })
      );
    }
    return;
  }

  // Cache first strategy for static assets
  if (STATIC_ASSETS.includes(request.url)) {
    event.respondWith(
      caches.match(request)
        .then(response => {
          return response || fetch(request).then(fetchResponse => {
            return caches.open(STATIC_CACHE_NAME)
              .then(cache => {
                cache.put(request, fetchResponse.clone());
                return fetchResponse;
              });
          });
        })
    );
    return;
  }

  // Network first with cache fallback for dynamic content
  event.respondWith(
    caches.match(request)
      .then(cacheResponse => {
        const networkFetch = fetch(request)
          .then(networkResponse => {
            // Only cache successful responses
            if (networkResponse.ok) {
              const responseClone = networkResponse.clone();
              caches.open(DYNAMIC_CACHE_NAME)
                .then(cache => {
                  cache.put(request, responseClone);
                });
            }
            return networkResponse;
          })
          .catch(() => {
            // Return cached version if network fails
            return cacheResponse || new Response('Offline - Content not available', {
              status: 404,
              headers: { 'Content-Type': 'text/plain' }
            });
          });

        return cacheResponse || networkFetch;
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(handleBackgroundSync());
  }
});

async function handleBackgroundSync() {
  // Handle queued offline actions when back online
  console.log('[SW] Handling background sync');
}

// Push notifications (if implemented)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/images/logo1.png',
      badge: '/images/logo1.png',
      vibrate: [200, 100, 200],
      data: {
        url: data.url || '/'
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Behaviour Tracker', options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.openWindow(url)
  );
});

// Message handling for skipWaiting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});