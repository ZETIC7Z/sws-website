import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const activities = [
  { name: "SWS Brotherhood Gathering", image: "/sws-activity-1.jpg" },
  { name: "SWS Chapter Meetup – Region VII", image: "/sws-activity-2.jpg" },
  { name: "Brothers at the Beach", image: "/sws-activity-3.jpg" },
  { name: "SWS Skeptron Brotherhood Bonding", image: "/sws-activity-4.jpg" },
  { name: "Brotherhood Bonding by the Sea", image: "/sws-activity-5.jpg" },
  { name: "SWS Brothers at Work", image: "/sws-activity-6.jpg" },
  { name: "Brotherhood on the Waters", image: "/sws-activity-7.jpg" },
  { name: "SWS Chapter Assembly", image: "/sws-activity-8.jpg" },
  { name: "SWS Brotherhood Moment", image: "/sws-activity-9.jpg" },
  { name: "Chapter Bonding Activity", image: "/sws-activity-10.jpg" },
  { name: "Brothers United", image: "/sws-activity-11.jpg" },
  { name: "SWS Members Gathering", image: "/sws-activity-12.jpg" },
  { name: "Skeptron Brotherhood", image: "/sws-activity-13.jpg" },
  { name: "AKRho SWS Together", image: "/sws-activity-14.jpg" },
  { name: "SWS Chapter Event", image: "/sws-activity-15.jpg" },
  { name: "Brotherhood in Action", image: "/sws-activity-16.jpg" },
  { name: "SWS Family Moments", image: "/sws-activity-17.jpg" },
  { name: "Skeptrons at Work", image: "/sws-activity-18.jpg" },
  { name: "SWS Region VII Pride", image: "/sws-activity-19.jpg" },
  { name: "Chapter Activity Day", image: "/sws-activity-20.jpg" },
  { name: "AKRho Brotherhood Bond", image: "/sws-activity-21.jpg" },
  { name: "SWS Outing Activity", image: "/sws-activity-22.jpg" },
  { name: "Skeptrons Gather Strong", image: "/sws-activity-23.jpg" },
  { name: "SWS Chapter Meetup", image: "/sws-activity-24.jpg" },
  { name: "Brotherhood Lives On", image: "/sws-activity-25.jpg" },
  { name: "SWS Family Outing", image: "/sws-activity-26.jpg" },
  { name: "Skeptron Fellowship", image: "/sws-activity-27.jpg" },
  { name: "AKRho Moments Together", image: "/sws-activity-28.jpg" },
  { name: "SWS Unity and Pride", image: "/sws-activity-29.jpg" },
  { name: "Brothers Forever Strong", image: "/sws-activity-30.jpg" },
  { name: "SWS Closing Ceremony", image: "/sws-activity-31.jpg" },
];

const THUMB_W = 220;
const THUMB_GAP = 16;

const ActivitiesGallery = () => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) {
      const t = setTimeout(() => setIsPaused(false), 20000);
      return () => clearTimeout(t);
    }
    const iv = setInterval(() => setCurrent((p) => (p + 1) % activities.length), 6000);
    return () => clearInterval(iv);
  }, [isPaused]);

  const go = (idx: number) => {
    setCurrent((idx + activities.length) % activities.length);
    setIsPaused(true);
  };

  const offset = -(current * (THUMB_W + THUMB_GAP));

  return (
    <div className="relative pt-8" id="activities">
      <h2 className="font-heading text-lg md:text-2xl font-bold text-center mb-8 px-4 tracking-[0.2em]">
        <span className="text-primary text-glow-gold">SWS SKEPTRONS:</span>{" "}
        <span className="text-foreground">MOMENTS OF BROTHERHOOD</span>
      </h2>

      <div className="flex flex-col gap-3">
        {/* ── Main Showcase ── */}
        <div className="w-full">
          <div className="relative scroll-panel rounded-lg overflow-hidden w-full border-2 border-primary/20 bg-black/60 shadow-[0_0_60px_rgba(0,0,0,0.6)]"
            style={{ height: "clamp(280px,55vw,700px)" }}>
            <div className="absolute inset-0 scanline pointer-events-none z-10 opacity-10" />

            {/* Nav arrows */}
            <button onClick={() => go(current - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/60 border border-primary/30 flex items-center justify-center hover:bg-primary/20 transition-all">
              <ChevronLeft size={18} className="text-primary" />
            </button>
            <button onClick={() => go(current + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/60 border border-primary/30 flex items-center justify-center hover:bg-primary/20 transition-all">
              <ChevronRight size={18} className="text-primary" />
            </button>

            <AnimatePresence mode="wait">
              <motion.div key={current}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="w-full h-full">
                <img src={activities[current].image} alt={activities[current].name}
                  className="w-full h-full object-cover object-center"
                  onError={(e) => (e.currentTarget.src = "/placeholder.svg")} />
                <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-background via-black/70 to-transparent z-10" />
                <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center px-4">
                  <div className="bg-background/70 backdrop-blur-xl rounded-lg px-5 py-2.5 text-center border border-primary/40 max-w-lg w-full">
                    <h3 className="font-heading text-base md:text-xl font-bold text-primary text-glow-gold uppercase tracking-widest whitespace-nowrap overflow-hidden text-ellipsis">
                      {activities[current].name}
                    </h3>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Dot indicators */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 flex gap-1 flex-wrap justify-center max-w-xs">
              {activities.map((_, i) => (
                <button key={i} onClick={() => go(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === current ? "bg-primary scale-125" : "bg-white/30 hover:bg-white/60"}`} />
              ))}
            </div>
          </div>
        </div>

        {/* ── Thumbnail Strip — directly below main image ── */}
        <div className="relative w-full overflow-hidden pt-1 pb-3 flex items-center justify-center"
          style={{ minHeight: "140px" }}>
          {/* fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-r from-background to-transparent z-30 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-l from-background to-transparent z-30 pointer-events-none" />

          {/* Active frame highlight */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[236px] h-[136px] z-10 pointer-events-none rounded-xl border-2 border-primary/50 glow-gold opacity-60" />

          <motion.div className="flex items-center absolute"
            animate={{ x: offset }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{ left: "50%", marginLeft: -(THUMB_W / 2) }}
          >
            {activities.map((a, i) => {
              const isActive = i === current;
              return (
                <button key={i} onClick={() => go(i)}
                  style={{ width: `${THUMB_W}px`, marginRight: `${THUMB_GAP}px`, flexShrink: 0 }}
                  className={`relative rounded-lg overflow-hidden transition-all duration-700 ${
                    isActive
                      ? "ring-2 ring-primary scale-110 z-40 brightness-110 shadow-[0_0_30px_rgba(255,215,0,0.5)]"
                      : "opacity-25 scale-90 grayscale blur-[1px] hover:opacity-50 hover:grayscale-0 hover:blur-0 z-20"
                  }`}
                >
                  <div style={{ aspectRatio: "16/10" }} className="relative">
                    <img src={a.image} alt={a.name} className="w-full h-full object-cover object-center" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 px-2 py-1.5 text-center bg-black/80 backdrop-blur-sm border-t border-white/10">
                    <p className={`text-[10px] font-heading font-bold uppercase tracking-wide whitespace-nowrap overflow-hidden text-ellipsis ${isActive ? "text-primary" : "text-foreground/60"}`}>
                      {a.name}
                    </p>
                  </div>
                </button>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesGallery;
