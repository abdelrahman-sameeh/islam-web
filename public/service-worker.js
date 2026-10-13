const CACHE_VERSION = "v2";
const SHELL_CACHE = `islamona-shell-${CACHE_VERSION}`;
const CONTENT_CACHE = `islamona-content-${CACHE_VERSION}`;
const FONT_CACHE = `islamona-fonts-${CACHE_VERSION}`;
const ACTIVE_CACHES = new Set([SHELL_CACHE, CONTENT_CACHE, FONT_CACHE]);

const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-maskable-512.png",
];

const CONTENT_HOSTS = new Set([
  "api.aladhan.com",
  "hadeethenc.com",
  "quranenc.com",
  "raw.githubusercontent.com",
  "www.mp3quran.net",
]);

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("islamona-") && !ACTIVE_CACHES.has(key))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

const trimCache = async (cache, limit) => {
  const keys = await cache.keys();
  const overflow = keys.length - limit;

  if (overflow <= 0) return;

  await Promise.all(keys.slice(0, overflow).map((key) => cache.delete(key)));
};

const cacheResponse = async (cacheName, request, response, limit) => {
  if (!response.ok && response.type !== "opaque") return response;

  const cache = await caches.open(cacheName);
  await cache.put(request, response.clone());
  await trimCache(cache, limit);
  return response;
};

const cacheFirst = async (request, cacheName, limit) => {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  return cacheResponse(cacheName, request, response, limit);
};

const networkFirst = async (request, cacheName, fallbackUrl) => {
  try {
    const response = await fetch(request);
    return cacheResponse(cacheName, request, response, 100);
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (fallbackUrl) return caches.match(fallbackUrl);
    throw new Error("offline");
  }
};

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET" || request.headers.has("range")) return;

  const url = new URL(request.url);

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, SHELL_CACHE, "/index.html"));
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(request, SHELL_CACHE, 80));
    return;
  }

  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    event.respondWith(cacheFirst(request, FONT_CACHE, 20));
    return;
  }

  if (CONTENT_HOSTS.has(url.hostname)) {
    event.respondWith(networkFirst(request, CONTENT_CACHE));
  }
});
