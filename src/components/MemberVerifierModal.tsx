import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Search, QrCode, X, User, ChevronRight } from "lucide-react";
import { getApiUrl } from "@/lib/utils";

interface Member {
  accountId: string;
  firstName: string;
  lastName: string;
  username: string;
  profileImage?: string;
  chapter?: string;
}

interface MemberVerifierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MemberVerifierModal = ({ isOpen, onClose }: MemberVerifierModalProps) => {
  const [mode, setMode] = useState<"idle" | "search" | "qr">("idle");
  const [searchVal, setSearchVal] = useState("");
  const [searchResult, setSearchResult] = useState<Member | null>(null);
  const [searching, setSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const qrRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<any>(null);

  // Auto-close search bar after 5s of inactivity
  useEffect(() => {
    if (mode === "search" && !searchVal) {
      idleTimerRef.current = setTimeout(() => setMode("idle"), 5000);
    }
    return () => { if (idleTimerRef.current) clearTimeout(idleTimerRef.current); };
  }, [mode, searchVal]);

  useEffect(() => {
    if (mode === "search") setTimeout(() => searchRef.current?.focus(), 300);
  }, [mode]);

  // QR Scanner
  useEffect(() => {
    if (mode === "qr" && qrRef.current) {
      import("html5-qrcode").then(({ Html5Qrcode }) => {
        const qr = new Html5Qrcode("qr-reader");
        scannerRef.current = qr;
        qr.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          (decoded) => {
            qr.stop();
            let val = decoded.trim();
            if (val.startsWith("http://") || val.startsWith("https://")) {
              try {
                const urlObj = new URL(val);
                const qParam = urlObj.searchParams.get("q");
                if (qParam) val = qParam;
              } catch (e) {}
            }
            handleSearch(val);
          },
          () => {}
        ).catch(console.error);
      });
    }
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, [mode]);

  const handleSearch = async (id: string) => {
    if (!id) return;
    setSearching(true);
    setNotFound(false);
    setSearchResult(null);
    try {
      const res = await fetch(getApiUrl(`/api/members/verify?q=${encodeURIComponent(id)}`));
      if (res.ok) {
        const data = await res.json();
        setSearchResult(data.member);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    }
    setSearching(false);
  };

  const handleClose = () => {
    setMode("idle");
    setSearchVal("");
    setSearchResult(null);
    setNotFound(false);
    onClose();
  };

  const resetMode = () => {
    setMode("idle");
    setSearchVal("");
    setSearchResult(null);
    setNotFound(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {/* Backdrop */}
          <motion.div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-full max-w-md scroll-panel rounded-xl ornate-border overflow-hidden"
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="p-5 border-b border-primary/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                  <Shield size={20} className="text-primary" />
                </div>
                <div>
                  <h2 className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-primary">Member Verifier</h2>
                  <p className="text-[11px] text-muted-foreground">Verify AKRho SWS membership</p>
                </div>
              </div>
              <button onClick={handleClose} className="w-8 h-8 rounded-full hover:bg-primary/10 flex items-center justify-center transition-colors">
                <X size={16} className="text-muted-foreground" />
              </button>
            </div>

            <div className="p-5 space-y-3">

              {/* Result display */}
              <AnimatePresence>
                {searchResult && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="rounded-lg border border-primary/40 bg-primary/5 p-4 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/40 flex-shrink-0">
                      {searchResult.profileImage
                        ? <img src={searchResult.profileImage} className="w-full h-full object-cover" />
                        : <div className="w-full h-full bg-primary/20 flex items-center justify-center"><User size={24} className="text-primary" /></div>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading text-sm font-bold text-foreground">{searchResult.firstName} {searchResult.lastName}</p>
                      <p className="text-[11px] text-muted-foreground">@{searchResult.username}</p>
                      <p className="text-[11px] font-mono text-primary mt-0.5">ID: {searchResult.accountId}</p>
                      <div className="mt-1 flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] text-green-400 font-heading font-bold uppercase tracking-wider">Verified Member</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                {notFound && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-center">
                    <p className="text-sm text-red-400 font-heading font-bold">Member Not Found</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">No member matches this ID or QR code.</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Search bar — slides in */}
              <AnimatePresence>
                {mode === "search" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input ref={searchRef} type="text" value={searchVal}
                          onChange={(e) => { setSearchVal(e.target.value); if (idleTimerRef.current) clearTimeout(idleTimerRef.current); }}
                          onKeyDown={(e) => e.key === "Enter" && handleSearch(searchVal)}
                          placeholder="Enter Member ID..."
                          className="w-full pl-8 pr-3 py-2.5 text-xs bg-background/80 border border-border rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
                        />
                      </div>
                      <button onClick={() => handleSearch(searchVal)} disabled={searching || !searchVal}
                        className="px-4 py-2 text-xs font-heading font-bold bg-gradient-to-b from-primary to-[hsl(35,70%,40%)] text-primary-foreground rounded-lg border border-primary/60 disabled:opacity-50 hover:brightness-110 transition-all">
                        {searching ? "..." : "Search"}
                      </button>
                    </div>
                    <p className="text-[10px] text-muted-foreground/60 mt-1.5 text-center font-mono">
                      Search bar closes after 5s of inactivity
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* QR Camera */}
              <AnimatePresence>
                {mode === "qr" && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35 }} className="overflow-hidden">
                    <div className="relative rounded-xl overflow-hidden border border-primary/30 bg-black">
                      <div id="qr-reader" ref={qrRef} className="w-full" />
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div className="w-52 h-52 border-2 border-primary rounded-xl" style={{
                          boxShadow: "0 0 0 9999px rgba(0,0,0,0.5)"
                        }} />
                      </div>
                      <button onClick={resetMode}
                        className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/70 border border-primary/40 flex items-center justify-center hover:bg-primary/20 transition-all">
                        <X size={14} className="text-primary" />
                      </button>
                    </div>
                    <p className="text-[11px] text-muted-foreground text-center mt-2">
                      Point camera at member QR code
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <AnimatePresence>
                {mode !== "qr" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className={`grid ${mode === "search" ? "grid-cols-1" : "grid-cols-2"} gap-3 pt-1`}>
                    {/* Member ID button */}
                    <motion.button
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => setMode(mode === "search" ? "idle" : "search")}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 ${
                        mode === "search"
                          ? "border-primary bg-primary/15 glow-gold"
                          : "border-primary/30 bg-primary/5 hover:border-primary/60 hover:bg-primary/10"
                      }`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${mode === "search" ? "bg-primary/30" : "bg-primary/10"}`}>
                        <Search size={18} className="text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="text-[11px] font-heading font-bold uppercase tracking-wider text-primary">Member ID #</p>
                        <p className="text-[10px] text-muted-foreground">Search by ID</p>
                      </div>
                      <ChevronRight size={12} className={`text-primary transition-transform ${mode === "search" ? "rotate-90" : ""}`} />
                    </motion.button>

                    {/* Scan QR button */}
                    <AnimatePresence>
                      {mode !== "search" && (
                        <motion.button
                          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                          onClick={() => setMode("qr")}
                          className="flex flex-col items-center gap-2 p-4 rounded-xl border border-primary/30 bg-primary/5 hover:border-primary/60 hover:bg-primary/10 transition-all duration-200">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <QrCode size={18} className="text-primary" />
                          </div>
                          <div className="text-center">
                            <p className="text-[11px] font-heading font-bold uppercase tracking-wider text-primary">Scan QR</p>
                            <p className="text-[10px] text-muted-foreground">Use camera</p>
                          </div>
                          <ChevronRight size={12} className="text-primary" />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              {(searchResult || notFound) && (
                <button onClick={resetMode} className="w-full py-2 text-[11px] font-heading text-muted-foreground hover:text-primary transition-colors">
                  ← Search Again
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MemberVerifierModal;
