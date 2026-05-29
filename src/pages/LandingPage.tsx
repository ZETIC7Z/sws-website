import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage = ({ onEnter }: LandingPageProps) => {
  const handleExit = () => {
    window.location.href = "https://www.google.com";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Background FX */}
      <div className="absolute inset-0 god-rays pointer-events-none opacity-20 z-0" />
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-background z-0" />

      {/* Animated orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-accent/5 blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-2xl mx-auto">

        {/* SWS Badge Logo — big, centered, same size as main page */}
        <motion.div
          className="relative mb-8"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <div className="absolute inset-0 rounded-full bg-primary/15 blur-3xl scale-125 animate-pulse pointer-events-none" />
          <div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl scale-150 pointer-events-none" />
          <motion.img
            src="/sws-logo-badge.png"
            alt="Social Welfare Skeptrons Badge"
            className="relative z-10 w-72 h-72 md:w-96 md:h-96 lg:w-[460px] lg:h-[460px] object-contain drop-shadow-[0_0_60px_rgba(255,215,0,0.6)]"
            animate={{ rotate: [0, 0.8, -0.8, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Divider */}
        <motion.div
          className="w-32 h-px bg-gradient-to-r from-transparent via-primary to-transparent mb-6"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.4 }}
        />

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass ornate-border rounded-lg p-6 mb-8 max-w-lg"
        >
          <p className="text-[11px] font-heading font-bold uppercase tracking-[0.2em] text-primary text-glow-gold mb-3">
            ⚔ DISCLAIMER ⚔
          </p>
          <p className="text-sm text-foreground/80 leading-relaxed font-body">
            This website is exclusively for{" "}
            <span className="text-primary font-bold">Alpha Kappa Rho — Social Welfare Skeptrons (SWS)</span>{" "}
            members and authorized individuals only.
          </p>
          <p className="text-sm text-foreground/70 leading-relaxed mt-2 font-body">
            By entering, you acknowledge that you are a member or guest of the{" "}
            <span className="text-accent font-semibold">SWS Chapter</span>.
          </p>
          <p className="text-xs text-muted-foreground mt-3 font-mono">
            If you are not a member, please select <span className="text-accent">EXIT</span>.
          </p>
        </motion.div>

        {/* CTA Question */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xs font-heading text-muted-foreground uppercase tracking-[0.2em] mb-6"
        >
          Do you wish to continue?
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          {/* ENTER — gold gradient, matches JOIN THE CHAPTER */}
          <motion.button
            onClick={onEnter}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-10 py-3 bg-gradient-to-b from-primary to-[hsl(35,70%,40%)] text-primary-foreground font-heading text-sm font-bold tracking-wider rounded-sm glow-gold border border-primary/60 uppercase cursor-pointer"
          >
            <UserPlus size={18} />
            ENTER SITE
          </motion.button>

          {/* EXIT — dark border style, no icon */}
          <motion.button
            onClick={handleExit}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-10 py-3 scroll-panel text-foreground font-heading text-sm font-bold tracking-wider rounded-sm border border-primary/30 hover:bg-primary/10 transition-all duration-200 uppercase cursor-pointer"
          >
            EXIT
          </motion.button>
        </motion.div>

        {/* Bottom tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-widest mt-10"
        >
          "Truth Conquers All" — Alpha Kappa Rho • Est. August 8, 1973
        </motion.p>
      </div>
    </div>
  );
};

export default LandingPage;
