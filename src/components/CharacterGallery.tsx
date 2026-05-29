import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const activities = [
  {
    name: "SWS Brotherhood Gathering",
    desc: "Social Welfare Skeptrons members coming together in true brotherhood — embodying the spirit of unity, loyalty, and service that defines Alpha Kappa Rho.",
    image: "/sws-activity-1.jpg",
  },
  {
    name: "SWS Chapter Meetup – Region VII",
    desc: "The Social Welfare Skeptrons chapter proudly displaying the SWS banner during a chapter assembly. Brotherhood over everything — Skeptron till we die.",
    image: "/sws-activity-2.jpg",
  },
  {
    name: "Brothers at the Beach",
    desc: "AKRho brothers of SWS making memories and strengthening bonds during a fraternity outing — because brotherhood goes beyond the chapter room.",
    image: "/sws-activity-3.jpg",
  },
  {
    name: "SWS Skeptron Brotherhood Bonding",
    desc: "Members of SWS Skeptrons gathered under the SWS banner, reaffirming their commitment to brotherhood, service, and the Alpha Kappa Rho tradition.",
    image: "/sws-activity-4.jpg",
  },
  {
    name: "Brotherhood Bonding by the Sea",
    desc: "Brothers of the Social Welfare Skeptrons sharing moments of fellowship and camaraderie — a testament to the lasting bonds forged within Alpha Kappa Rho.",
    image: "/sws-activity-5.jpg",
  },
];

const ActivitiesGallery = () => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const transitionDuration = 1.5;
  const displayTime = 6000;

  const [itemWidth, setItemWidth] = useState(260);

  useEffect(() => {
    const handleResize = () => {
      setItemWidth(window.innerWidth < 768 ? 180 : 260);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isPaused) {
      const timer = setTimeout(() => setIsPaused(false), 20000);
      return () => clearTimeout(timer);
    }

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % activities.length);
    }, displayTime);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleManualSelection = (index: number) => {
    setCurrent(index);
    setIsPaused(true);
  };

  return (
    <div className="relative pt-10" id="activities">
      <h2 className="font-heading text-lg md:text-2xl font-bold text-center mb-12 px-4 tracking-[0.2em] leading-tight">
        <span className="text-primary text-glow-gold">SWS SKEPTRONS:</span>{" "}
        <span className="text-foreground inline-block">MOMENTS OF BROTHERHOOD</span>
      </h2>

      <div className="flex flex-col gap-10">
        {/* Main photo showcase */}
        <div className="w-full">
          <div className="relative scroll-panel rounded-lg overflow-hidden h-[500px] md:h-[650px] lg:h-[750px] w-full border-2 border-primary/20 bg-black/60 shadow-[0_0_60px_rgba(0,0,0,0.6)]">
            <div className="absolute inset-0 scanline pointer-events-none z-10 opacity-20" />

            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, scale: 1.02, filter: "blur(25px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.98, filter: "blur(25px)" }}
                transition={{ duration: transitionDuration, ease: "easeInOut" }}
                className="relative w-full h-full flex flex-col items-center justify-end"
              >
                <div className="absolute inset-0">
                  <img
                    src={activities[current].image}
                    alt={activities[current].name}
                    className="w-full h-full object-cover object-center pointer-events-none"
                    onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                  />
                  <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-background via-black/80 to-transparent z-10" />
                </div>

                <div className="relative z-20 bg-background/60 backdrop-blur-2xl rounded-lg p-3 md:p-5 text-center max-w-2xl gold-border mx-6 mb-8 border border-primary/40 shadow-2xl scale-95 md:scale-100 transition-all duration-700">
                  <h3 className="font-heading text-xl md:text-3xl font-bold text-primary text-glow-gold mb-1 md:mb-2 uppercase tracking-[0.1em] drop-shadow-lg">
                    {activities[current].name}
                  </h3>
                  <p className="text-[12px] md:text-sm text-foreground/90 leading-relaxed font-body font-medium drop-shadow-md px-2 opacity-95">
                    {activities[current].desc}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Thumbnail Spinner */}
        <div className="relative w-full overflow-hidden py-14 min-h-[300px] flex items-center justify-center">
          <div className="absolute left-0 top-0 bottom-0 w-32 md:w-96 bg-gradient-to-r from-background via-background/60 to-transparent z-30 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 md:w-96 bg-gradient-to-l from-background via-background/60 to-transparent z-30 pointer-events-none" />

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] md:w-[280px] h-[160px] md:h-[180px] z-10 pointer-events-none">
            <div className="absolute inset-0 bg-primary/10 blur-[80px]" />
            <div className="absolute inset-0 border-2 border-primary/20 rounded-xl glow-gold opacity-30 shadow-[0_0_40px_rgba(255,215,0,0.2)]" />
          </div>

          <motion.div
            className="flex gap-4 md:gap-10 items-center absolute"
            animate={{ x: -(current * itemWidth) }}
            transition={{ duration: transitionDuration, ease: "easeInOut" }}
            style={{ left: "50%", marginLeft: -(itemWidth / 2) }}
          >
            {activities.map((a, i) => {
              const isActive = i === current;
              return (
                <button
                  key={`${a.name}-${i}`}
                  onClick={() => handleManualSelection(i)}
                  className={`flex-shrink-0 w-[140px] md:w-[220px] relative rounded-lg overflow-hidden transition-all duration-1000 ${
                    isActive
                      ? "ring-2 ring-primary glow-gold scale-125 md:scale-125 z-40 grayscale-0 brightness-110 shadow-[0_0_50px_rgba(255,215,0,0.5)] border-primary/50"
                      : "opacity-15 scale-90 border border-white/5 grayscale blur-[1px] hover:opacity-50 hover:grayscale-0 hover:blur-0 z-20"
                  }`}
                >
                  <div className="aspect-[16/10] relative">
                    <img
                      src={a.image}
                      alt={a.name}
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-2 text-center bg-black/80 backdrop-blur-md border-t border-white/10">
                    <p className={`text-[9px] md:text-[11px] font-heading font-bold uppercase tracking-[0.12em] truncate ${
                      isActive ? "text-primary text-glow-gold" : "text-foreground/70"
                    }`}>
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
