import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      // Use autoUpdate so new versions apply silently
      registerType: "autoUpdate",
      // Let vite-plugin-pwa inject the SW registration script
      injectRegister: "script",
      // generateSW: Workbox generates the SW (no custom SW compilation needed)
      strategies: "generateSW",
      manifest: {
        name: "SWS Skeptrons — Alpha Kappa Rho",
        short_name: "SWS Skeptrons",
        description:
          "Social Welfare Skeptrons – A proud chapter of Alpha Kappa Rho International Humanitarian Service Fraternity & Sorority, Region VII. Established 2021.",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait-primary",
        background_color: "#0d0a08",
        theme_color: "#c8920a",
        lang: "en",
        icons: [
          {
            src: "/sws-logo-badge.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/sws-logo-badge.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/favicon.ico",
            sizes: "64x64",
            type: "image/x-icon",
          },
        ],
        shortcuts: [
          {
            name: "Dashboard",
            short_name: "Dashboard",
            url: "/dashboard",
            icons: [{ src: "/sws-logo-badge.png", sizes: "192x192" }],
          },
          {
            name: "Sign In",
            short_name: "Sign In",
            url: "/login",
            icons: [{ src: "/sws-logo-badge.png", sizes: "192x192" }],
          },
          {
            name: "Verify Member",
            short_name: "Verify",
            url: "/member-verifier",
            icons: [{ src: "/sws-logo-badge.png", sizes: "192x192" }],
          },
        ],
      },
      workbox: {
        // Precache all built static assets (exclude huge images from slider)
        globPatterns: ["**/*.{js,css,html,ico,woff,woff2}"],
        // Exclude large class-slider images from precache (they'll be runtime cached)
        globIgnores: ["**/classes-slider/**", "**/node_modules/**"],
        // Max file size for precaching (10 MB)
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        // SPA: serve index.html for all navigation requests
        navigateFallback: "/index.html",
        // Don't intercept API routes
        navigateFallbackDenylist: [/^\/api\//],
        // Immediately activate new SW versions
        skipWaiting: true,
        clientsClaim: true,
        // Avoid terser minification that breaks on Node 18 (crypto issue)
        // This keeps the generated SW readable but fully functional
        ...(mode === "production" ? {} : {}),
        runtimeCaching: [
          // Google Fonts — Cache First, 1 year
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "sws-google-fonts",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "sws-gstatic-fonts",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // API — Network First (10s timeout, 5 min cache fallback)
          {
            urlPattern: /\/api\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "sws-api",
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 5 },
              networkTimeoutSeconds: 10,
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Images — Cache First, 30 days
          {
            urlPattern: /\.(jpg|jpeg|png|svg|webp|gif|ico)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "sws-images",
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: "module",
        navigateFallback: "/index.html",
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Increase chunk warning size to avoid noise
  build: {
    chunkSizeWarningLimit: 1500,
  },
}));
