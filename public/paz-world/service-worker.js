const CACHE_NAME = 'paz-world-v7';
const APP_URL = '/paz-world/';
const APP_SHELL = [
  APP_URL,
  '/paz-world/manifest.webmanifest',
  '/paz-world/paz-world-logo.png',
  '/paz-world/bible-kjv.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    const results = await Promise.allSettled(APP_SHELL.map(async (url) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Could not cache ${url} (${response.status}).`);
      await cache.put(url, response);
    }));
    results.forEach((result) => {
      if (result.status === 'rejected') console.warn('PAZ World offline shell cache failed:', result.reason);
    });
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.filter((name) => name.startsWith('paz-world-') && name !== CACHE_NAME).map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  if (event.data?.type !== 'CACHE_PAZ_WORLD_ASSETS' || !Array.isArray(event.data.urls)) return;
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    const assetUrls = event.data.urls.filter((value) => {
      try {
        const url = new URL(value);
        return url.origin === self.location.origin
          && (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/paz-world/'));
      } catch (error) {
        console.warn('Ignoring an invalid PAZ World offline asset URL:', error);
        return false;
      }
    });
    const results = await Promise.allSettled(assetUrls.map(async (value) => {
      const url = new URL(value);
      const response = await fetch(url.href);
      if (!response.ok) throw new Error(`Could not cache ${url.pathname} (${response.status}).`);
      await cache.put(url.href, response);
    }));
    results.forEach((result) => {
      if (result.status === 'rejected') console.warn('PAZ World offline asset cache failed:', result.reason);
    });
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const requestUrl = new URL(request.url);
  if (request.method !== 'GET' || requestUrl.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        const response = await fetch(request);
        if (response.ok) await cache.put(APP_URL, response.clone());
        return response;
      } catch (error) {
        const cachedPage = await cache.match(request) || await cache.match(APP_URL);
        if (cachedPage) return cachedPage;
        throw error;
      }
    })());
    return;
  }

  const isBundledBible = requestUrl.pathname === '/paz-world/bible-kjv.json';
  if (!isBundledBible && !['script', 'style', 'image', 'font'].includes(request.destination)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cachedAsset = await cache.match(request);
    if (cachedAsset) return cachedAsset;

    const response = await fetch(request);
    if (response.ok) await cache.put(request, response.clone());
    return response;
  })());
});
