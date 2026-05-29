import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const foundingFathers = [
  { name: 'FF Jose "Boy" F. Chua', role: "Founder & Grand High Skeptron", description: "The principal founder and first Grand High Skeptron of Alpha Kappa Rho. His vision and leadership gave birth to the fraternity on August 8, 1973.", highlight: true },
  { name: "FF Teddy Aves", role: "Founder", description: "One of the sixteen founding fathers who helped establish AKRho at UST." },
  { name: "FF Philip Balanque", role: "Founder", description: "A founding brother who helped shape the early culture and traditions of the fraternity." },
  { name: "FF Tanny Bernabe", role: "Founder", description: "A founding member who contributed to the establishment of AKRho's foundational principles." },
  { name: "FF James Bracewell", role: "Founder", description: "One of the original sixteen brothers who founded AKRho at the University of Santo Tomas." },
  { name: "FF Philip Diman", role: "Founder", description: "A founding father who helped write the early chapters of AKRho's storied history." },
  { name: "FF Renato Go +", role: "Founder", description: "A founding brother of Alpha Kappa Rho. May his memory be honored by all brothers." },
  { name: "FF Teddy De Lara", role: "Founder", description: "One of the sixteen original founders of Alpha Kappa Rho at UST." },
  { name: "FF Arnel (Lim) Lorenzo", role: "Founder", description: "A founding father who helped establish the brotherhood and values that AKRho upholds." },
  { name: "FF Obet Posadas", role: "Founder", description: "A founding brother whose contributions helped shape the early identity of Alpha Kappa Rho." },
  { name: "FF Roger Sarmiento", role: "Founder", description: "One of the sixteen original founding fathers of Alpha Kappa Rho." },
  { name: "FF Edwin Solano", role: "Founder", description: "A founding member who helped bring the fraternity to life on August 8, 1973." },
  { name: "FF Bismark Queyquep +", role: "Founder", description: "A founding brother of AKRho. His memory is honored in the annals of the fraternity." },
  { name: "FF Gil Villegas", role: "Founder", description: "One of the sixteen founding fathers who helped establish Alpha Kappa Rho." },
  { name: "FF Noli Manalo +", role: "Founder", description: "A founding father of Alpha Kappa Rho. Remembered fondly by all brothers." },
  { name: "FF Monchet Cabrera", role: "Founder", description: "One of the original sixteen brothers who established Alpha Kappa Rho at UST in 1973." },
];

const WhatIsAkrho = () => (
  <div className="min-h-screen flex flex-col bg-background">
    <Navbar />
    <div className="flex-1 pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-5xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-2xl md:text-5xl font-black tracking-wider mb-3">
            <span className="text-primary text-glow-gold">WHAT IS</span>{" "}
            <span className="text-foreground">AKRho?</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            The story of Alpha Kappa Rho — a brotherhood born in truth, built through service, and sustained by brotherhood.
          </p>
        </motion.div>

        {/* Story Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass cyber-border rounded-lg p-6 md:p-10 mb-10"
        >
          <h2 className="font-heading text-lg md:text-2xl font-bold text-primary text-glow-gold mb-6 tracking-wider text-center uppercase">
            The Story of Alpha Kappa Rho
          </h2>

          <div className="space-y-5 text-sm md:text-base text-muted-foreground leading-relaxed">
            <p>
              <span className="text-foreground font-semibold">Alpha Kappa Rho (AKRho)</span> is one of the Philippines' most distinguished fraternities, founded on{" "}
              <span className="text-primary font-bold">August 8, 1973</span> at the{" "}
              <span className="text-foreground font-semibold">University of Santo Tomas (UST) College of Commerce</span> in Manila, Philippines.
            </p>
            <p>
              The fraternity was established by <span className="text-primary font-bold">sixteen college students</span> during the turbulent early years of Martial Law under Ferdinand Marcos. Amidst political uncertainty, a group of UST students sought to forge a bond of brotherhood that transcended political strife — a fraternal identity built on <span className="text-foreground font-semibold">truth, unity, and service</span>.
            </p>
            <p>
              The founding date of <span className="text-primary font-bold">August 8</span> was deliberately chosen to coincide with the <span className="text-foreground font-semibold">Feast Day of Saint Dominic</span>, a revered university holiday at UST, symbolizing wisdom and devotion. The founding was led by{" "}
              <span className="text-primary font-bold">Jose "Boy" F. Chua</span>, who served as the fraternity's first Grand High Skeptron.
            </p>
            <p>
              In <span className="text-foreground font-semibold">September 1976</span>, Alpha Kappa Rho underwent a significant expansion when it merged with the{" "}
              <span className="text-foreground font-semibold">Omega Fraternity & Sorority International (OFSI)</span> of San Sebastian College and the{" "}
              <span className="text-foreground font-semibold">Zeta Upsilon Fraternity</span> of the University of the East (UE). This merger enriched the fraternity's traditions, adopting new initiation rites and symbols that remain part of AKRho culture to this day.
            </p>
            <p>
              As early as <span className="text-foreground font-semibold">1975</span>, AKRho expanded its reach by founding a <span className="text-primary font-bold">Junior AKRho</span> division — accepting high school students from UE, nurturing future brothers from their formative years and deepening the fraternity's roots across generations.
            </p>
            <p>
              Today, Alpha Kappa Rho is duly registered with the{" "}
              <span className="text-foreground font-semibold">Philippine Securities and Exchange Commission (SEC)</span> as a{" "}
              <span className="text-primary font-bold">non-profit, non-dividend corporation</span> — operating as an{" "}
              <span className="text-foreground font-semibold">International Humanitarian Service Fraternity and Sorority</span>. The organization has grown to include chapters across the Philippines and abroad, all united by the motto:{" "}
              <span className="text-primary font-bold italic">"Truth Conquers All."</span>
            </p>
          </div>

          {/* Key Facts */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-border/30">
            {[
              { label: "Founded", value: "Aug 8, 1973" },
              { label: "Founded At", value: "UST, Manila" },
              { label: "Founders", value: "16 Brothers" },
              { label: "Type", value: "Humanitarian" },
            ].map((fact) => (
              <div key={fact.label} className="text-center p-3 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-primary font-bold font-mono text-sm md:text-base">{fact.value}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 font-heading">{fact.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Founding Fathers Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="font-heading text-lg md:text-2xl font-bold text-center mb-2 tracking-wider">
            <span className="text-primary text-glow-gold">THE 16 FOUNDING FATHERS</span>
          </h2>
          <p className="text-center text-muted-foreground text-sm mb-8">
            The visionary brothers who established Alpha Kappa Rho on August 8, 1973
          </p>

          {/* Grand High Skeptron - Special Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-sm mx-auto mb-8"
          >
            <div className="glass rounded-xl p-6 text-center border-2 border-primary/60 shadow-[0_0_40px_rgba(255,215,0,0.2)] relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="bg-primary text-primary-foreground text-[9px] font-heading font-bold px-3 py-1 rounded-full tracking-widest uppercase">Grand High Skeptron</span>
              </div>
              <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center mx-auto mt-2 mb-3">
                <span className="text-3xl font-bold text-primary font-heading">JC</span>
              </div>
              <h3 className="font-heading text-base font-bold text-primary text-glow-gold mb-1">
                FF Jose "Boy" F. Chua
              </h3>
              <p className="text-[11px] text-muted-foreground font-mono uppercase tracking-wider mb-2">Founder & 1st Grand High Skeptron</p>
              <p className="text-xs text-foreground/70 leading-relaxed">
                The principal founder of Alpha Kappa Rho. His vision and leadership gave birth to the fraternity on August 8, 1973 at UST, Manila.
              </p>
            </div>
          </motion.div>

          {/* Other Founding Fathers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {foundingFathers.slice(1).map((ff, i) => (
              <motion.div
                key={ff.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="glass cyber-border rounded-lg p-4 hover:bg-primary/5 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0 text-xs font-bold font-heading text-primary group-hover:bg-primary/20 transition-colors">
                    FF
                  </div>
                  <div>
                    <h3 className="font-heading text-xs font-bold text-foreground group-hover:text-primary transition-colors mb-0.5">
                      {ff.name}
                    </h3>
                    <p className="text-[10px] text-primary/70 font-mono uppercase tracking-wider mb-1">{ff.role}</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{ff.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center text-[11px] text-muted-foreground/60 mt-6 font-mono"
          >
            † Denotes departed brothers. Their memory lives on in the brotherhood they helped create. — AKRho Forever
          </motion.p>
        </motion.div>

        {/* Motto & Values */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="glass cyber-border rounded-lg p-6 md:p-8 text-center"
        >
          <h2 className="font-heading text-base font-bold text-primary text-glow-gold mb-6 uppercase tracking-widest">
            Our Values & Motto
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "⚖️", title: "Truth", desc: "Veritas — Truth conquers all. AKRho brothers uphold honesty and integrity above all else." },
              { icon: "🤝", title: "Brotherhood", desc: "A bond forged for life. Brothers stand by each other through all of life's trials and triumphs." },
              { icon: "🌏", title: "Service", desc: "As a humanitarian organization, AKRho is committed to giving back to the community and nation." },
            ].map((val) => (
              <div key={val.title} className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <div className="text-3xl mb-2">{val.icon}</div>
                <h3 className="font-heading text-sm font-bold text-primary mb-1">{val.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-border/30">
            <p className="text-lg md:text-2xl font-display font-black text-primary text-glow-gold tracking-widest italic">
              "Truth Conquers All"
            </p>
            <p className="text-xs text-muted-foreground mt-2 font-mono tracking-wider">— AKRho Motto • Est. August 8, 1973</p>
          </div>
        </motion.div>

      </div>
    </div>
    <Footer />
  </div>
);

export default WhatIsAkrho;
