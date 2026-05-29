import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// AKRho founding year
const FOUNDING_YEAR = 1973;
const FOUNDING_MONTH = 7; // August = index 7 (0-based)
const FOUNDING_DAY = 8;

/** Returns the next Aug 8 anniversary date (always in the future or today) */
function getNextAnniversary(): Date {
  const now = new Date();
  const thisYear = now.getFullYear();
  const thisAug8 = new Date(thisYear, FOUNDING_MONTH, FOUNDING_DAY, 0, 0, 0, 0);
  // If today is past Aug 8, target next year
  if (now >= thisAug8) {
    return new Date(thisYear + 1, FOUNDING_MONTH, FOUNDING_DAY, 0, 0, 0, 0);
  }
  return thisAug8;
}

/** Returns anniversary ordinal number based on next target year */
function getAnniversaryNumber(): number {
  const target = getNextAnniversary();
  return target.getFullYear() - FOUNDING_YEAR;
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function getTimeLeft() {
  const now = new Date();
  const target = getNextAnniversary();
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-PH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-PH", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

const AnniversaryCountdown = () => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const [anniversaryNum, setAnniversaryNum] = useState(getAnniversaryNumber());
  const [now, setNow] = useState(new Date());
  const [location, setLocation] = useState("Philippines");
  const [locationLoading, setLocationLoading] = useState(true);

  // Update countdown every second
  useEffect(() => {
    const interval = setInterval(() => {
      const currentNow = new Date();
      setNow(currentNow);
      setTimeLeft(getTimeLeft());
      setAnniversaryNum(getAnniversaryNumber());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Geolocation → reverse geocode
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation("Philippines");
      setLocationLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const addr = data.address || {};
          const parts: string[] = [];
          // Try to build: Municipality/City, Province, Country
          const city =
            addr.city ||
            addr.municipality ||
            addr.town ||
            addr.village ||
            addr.suburb ||
            addr.county ||
            "";
          const province =
            addr.province ||
            addr.state ||
            addr.region ||
            "";
          const country = addr.country || "Philippines";
          if (city) parts.push(city);
          if (province && province !== city) parts.push(province);
          parts.push(country);
          setLocation(parts.join(", "));
        } catch {
          setLocation("Philippines");
        }
        setLocationLoading(false);
      },
      () => {
        setLocation("Philippines");
        setLocationLoading(false);
      },
      { timeout: 8000 }
    );
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");
  const nextAug8 = getNextAnniversary();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass ornate-border rounded-lg overflow-hidden"
    >
      {/* Top label */}
      <div className="px-6 pt-6 pb-4 text-center border-b border-primary/10">
        <h3 className="font-heading text-sm md:text-base font-bold uppercase tracking-[0.25em] text-foreground/90 mb-0.5">
          Countdown to AKRho's {ordinal(anniversaryNum)} Founding Anniversary
        </h3>
        <p className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">
          August 8, 1973 — August 8, {nextAug8.getFullYear()}
        </p>
      </div>

      {/* Countdown blocks */}
      <div className="px-4 py-6 flex items-center justify-center gap-1 md:gap-3">
        {[
          { value: pad(timeLeft.days), label: "DAYS" },
          { value: pad(timeLeft.hours), label: "HRS" },
          { value: pad(timeLeft.minutes), label: "MIN" },
          { value: pad(timeLeft.seconds), label: "SEC" },
        ].map((unit, i) => (
          <div key={unit.label} className="flex items-center gap-1 md:gap-3">
            <div className="flex flex-col items-center">
              <div className="bg-background/80 border border-primary/20 rounded-md px-3 py-2 md:px-5 md:py-3 min-w-[56px] md:min-w-[76px]">
                <span className="font-mono text-3xl md:text-5xl font-bold text-accent tabular-nums block text-center leading-none" style={{ textShadow: "0 0 20px rgba(220,38,38,0.6)" }}>
                  {unit.value}
                </span>
              </div>
              <span className="text-[9px] md:text-[11px] font-mono text-muted-foreground tracking-[0.2em] mt-2 uppercase">
                {unit.label}
              </span>
            </div>
            {i < 3 && (
              <span className="text-2xl md:text-3xl font-bold text-accent/40 animate-pulse-glow mb-5">:</span>
            )}
          </div>
        ))}
      </div>

      {/* Bottom: Live date + location */}
      <div className="px-6 pb-5 text-center border-t border-primary/10 pt-4 space-y-1">
        <p className="text-xs font-mono text-foreground/70 tracking-wide">
          {formatDate(now)} &nbsp;·&nbsp; {formatTime(now)}
        </p>
        <p className="text-[10px] font-mono text-primary/70 tracking-widest">
          {locationLoading ? "Detecting location..." : location}
        </p>
      </div>
    </motion.div>
  );
};

export default AnniversaryCountdown;
