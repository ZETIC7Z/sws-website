import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// ── Validate stored JWT on startup (90-day expiry check) ─────────────────────
const validateStoredSession = () => {
  const token = localStorage.getItem("sws_token");
  if (!token) return;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    const padded = pad ? base64 + "=".repeat(4 - pad) : base64;
    const payload = JSON.parse(atob(padded));
    const nowSec = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < nowSec) {
      localStorage.removeItem("sws_token");
      localStorage.removeItem("sws_user");
    }
  } catch (err) {
    console.error("JWT validation error on startup:", err);
  }
};

validateStoredSession();

// ── Service Worker — simple registration, NO auto-reload ─────────────────────
// We intentionally do NOT auto-reload on SW update to prevent infinite loops.
// New SW versions activate silently; users get fresh content on next visit.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .catch(() => {/* silent fail */});
  });
}

// ── Mount React ──────────────────────────────────────────────────────────────
createRoot(document.getElementById("root")!).render(<App />);
