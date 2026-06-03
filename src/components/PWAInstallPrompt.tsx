import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt(): Promise<void>;
}

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user already dismissed
    const wasDismissed = localStorage.getItem("sws_pwa_dismissed");
    if (wasDismissed) return;

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show banner after 3s delay
      setTimeout(() => setShowBanner(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setDismissed(true);
    localStorage.setItem("sws_pwa_dismissed", "true");
  };

  if (!showBanner || dismissed) return null;

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="fixed left-4 right-4 z-[9999] max-w-sm mx-auto"
          style={{ 
            filter: "drop-shadow(0 0 20px rgba(200, 146, 10, 0.4))",
            bottom: "calc(1rem + env(safe-area-inset-bottom, 0px))"
          }}
        >
          <div
            className="rounded-xl border border-primary/40 p-4 flex items-center gap-3"
            style={{
              background: "linear-gradient(135deg, hsl(30 30% 12%) 0%, hsl(15 14% 9%) 60%, hsl(20 20% 8%) 100%)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.8), inset 0 1px 0 rgba(200,146,10,0.15)",
            }}
          >
            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
              <img src="/sws-logo-badge.png" alt="SWS" className="w-8 h-8 object-contain" />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="font-heading text-xs font-bold text-primary uppercase tracking-wider">
                Install SWS App
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                Add to your home screen for quick access — works offline!
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-1.5 flex-shrink-0">
              <button
                onClick={handleInstall}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-b from-primary to-[hsl(35,70%,40%)] text-primary-foreground font-heading font-bold text-[10px] uppercase tracking-wider rounded-lg border border-primary/60 hover:brightness-110 transition-all"
              >
                <Download size={11} />
                Install
              </button>
              <button
                onClick={handleDismiss}
                className="flex items-center justify-center gap-1 px-3 py-1 text-[10px] font-heading text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={10} />
                Not now
              </button>
            </div>
          </div>

          {/* Shine accent line */}
          <div className="absolute top-0 left-[15%] right-[15%] h-[1.5px] rounded-full bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;
