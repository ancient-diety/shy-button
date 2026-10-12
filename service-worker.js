const CACHE_NAME = "sunset-arcade-v1";
const APP_SHELL = [
    "./",
    "./index.html",
    "./manifest.webmanifest",
    "./arcade.css",
    "./arcade-shell.css",
    "./arcade-shell.js",
    "./game-shell.css",
    "./game-shell.js",
    "./pwa.js",
    "./Pixel%20Star%20Gamer%20Icon.png",
    "./icons/icon-192.png",
    "./icons/icon-512.png",
    "./games/alien-attack.html",
    "./games/homework-blaze.html",
    "./games/moon-mart.html",
    "./games/potion-panic.html",
    "./games/shy-button.html",
    "./games/sunset-speedway.html",
    "./games/tiny-garden.html"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys
                .filter(key => key.startsWith("sunset-arcade-") && key !== CACHE_NAME)
                .map(key => caches.delete(key))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", event => {
    const request = event.request;
    if (request.method !== "GET") return;

    const requestUrl = new URL(request.url);
    if (requestUrl.origin !== self.location.origin) return;

    if (request.mode === "navigate") {
        event.respondWith(
            fetch(request).catch(async () => {
                const cachedPage = await caches.match(request, { ignoreSearch: true });
                if (cachedPage) return cachedPage;
                return caches.match(new URL("./index.html", self.registration.scope).href);
            })
        );
        return;
    }

    event.respondWith(
        caches.match(request, { ignoreSearch: true }).then(cached => {
            if (cached) return cached;
            return fetch(request).then(response => {
                if (!response || !response.ok) return response;
                const copy = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
                return response;
            });
        })
    );
});
