// SWS Skeptrons Service Worker — Full PWA
// This file is used with vite-plugin-pwa injectManifest strategy.
// Vite will inject the __WB_MANIFEST placeholder at build time.
// In dev, this file is served as-is.

import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { registerRoute, NavigationRoute } from "workbox-routing";
import {
  NetworkFirst,
  CacheFirst,
  StaleWhileRevalidate,
} from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { CacheableResponsePlugin } from "workbox-cacheable-response";

// ─── Precache build assets injected by Vite-Plugin-PWA ───────────────────────
precacheAndRoute(self.__WB_MANIFEST || []);
cleanupOutdatedCaches();

// ─── SPA Navigation: serve index.html for all routes ─────────────────────────
registerRoute(
  new NavigationRoute(
    new NetworkFirst({
      cacheName: "sws-navigation",
      plugins: [
        new CacheableResponsePlugin({ statuses: [0, 200] }),
        new ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 }),
      ],
      networkTimeoutSeconds: 8,
    })
  )
);

// ─── API: Network First ───────────────────────────────────────────────────────
registerRoute(
  ({ url }) => url.pathname.startsWith("/api/"),
  new NetworkFirst({
    cacheName: "sws-api",
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 60 * 5 }),
    ],
    networkTimeoutSeconds: 10,
  }),
  "GET"
);

// ─── Google Fonts: Cache First (1 year) ──────────────────────────────────────
registerRoute(
  ({ url }) =>
    url.origin === "https://fonts.googleapis.com" ||
    url.origin === "https://fonts.gstatic.com",
  new CacheFirst({
    cacheName: "sws-fonts",
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 60 * 60 * 24 * 365,
      }),
    ],
  })
);

// ─── Images: Cache First (30 days) ───────────────────────────────────────────
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "sws-images",
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 }),
    ],
  })
);

// ─── JS / CSS: Stale While Revalidate ────────────────────────────────────────
registerRoute(
  ({ request }) =>
    request.destination === "script" || request.destination === "style",
  new StaleWhileRevalidate({
    cacheName: "sws-assets",
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 7 }),
    ],
  })
);

// ─── Skip waiting & claim clients immediately ─────────────────────────────────
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// ─── Push Notifications (future use) ─────────────────────────────────────────
self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};
  const title = data.title || "SWS Skeptrons";
  const options = {
    body: data.body || "New update from SWS Skeptrons",
    icon: "/sws-logo-badge.png",
    badge: "/favicon.ico",
    vibrate: [200, 100, 200],
    data: { url: data.url || "/" },
    actions: [
      { action: "open", title: "Open App" },
      { action: "dismiss", title: "Dismiss" },
    ],
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (event.action === "open" || !event.action) {
    const url = event.notification.data?.url || "/";
    event.waitUntil(clients.openWindow(url));
  }
});
