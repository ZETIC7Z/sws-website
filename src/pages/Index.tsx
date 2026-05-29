import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronDown, Users, UserPlus, Shield, Star, Calendar, Facebook } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DeadfrontTimer from "@/components/DeadfrontTimer";
import CharacterGallery from "@/components/CharacterGallery";
import TopPlayersSlider from "@/components/TopPlayersSlider";
import BackgroundFX from "@/components/BackgroundFX";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      <BackgroundFX />
      <Navbar />

      {/* ═══════ HERO BANNER ═══════ */}
      <section className="relative pt-20 md:pt-24 overflow-hidden">
        <div className="absolute inset-0 god-rays pointer-events-none opacity-30 z-0" />
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="banner-overlay absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
        </div>

        <div className="relative container mx-auto px-4 py-6 md:py-10">
          <div className="flex flex-col lg:flex-row gap-6 items-center">

            {/* Left: Logo + Text + Buttons */}
            <div className="flex-1 text-center lg:text-left z-10 order-1">
              <div className="relative group inline-block mb-1">
                <motion.img
                  src="/stampede-logo.png"
                  alt="SWS Skeptrons"
                  className="w-44 h-auto sm:w-56 md:w-72 lg:w-80 xl:w-[360px] mx-auto lg:mx-0 drop-shadow-[0_0_30px_rgba(255,215,0,0.65)] relative z-10 transition-transform duration-300"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  whileHover={{ scale: 1.04 }}
                />
              </div>

              <motion.p className="text-sm md:text-base text-foreground/70 font-body mb-1 italic"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                Social Welfare Skeptrons — Region VII
              </motion.p>
              <motion.p className="text-xs sm:text-sm md:text-base text-accent font-heading font-bold tracking-widest mb-2 uppercase"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
                Alpha Kappa Rho
              </motion.p>
              <motion.p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto lg:mx-0 mb-6 leading-relaxed"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                A proud chapter of Alpha Kappa Rho International Humanitarian Service Fraternity &amp; Sorority.
                Brotherhood forged in truth, united in service. Est. 2021. <em>"Truth Conquers All."</em>
              </motion.p>

              <motion.div
                className="flex flex-col xs:flex-row items-center justify-center lg:justify-start gap-3"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <Link to="/register"
                  className="w-full xs:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-b from-primary to-[hsl(35,70%,40%)] text-primary-foreground font-heading text-xs sm:text-sm font-bold tracking-wider rounded-sm glow-gold hover:scale-105 transition-transform duration-200 border border-primary/60">
                  <UserPlus size={16} />
                  JOIN THE CHAPTER
                </Link>
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"
                  className="w-full xs:w-auto flex items-center justify-center gap-2 px-6 py-2.5 scroll-panel text-foreground font-heading text-xs sm:text-sm font-bold tracking-wider rounded-sm hover:bg-primary/10 transition-all duration-200">
                  <Facebook size={16} className="text-primary" />
                  FACEBOOK PAGE
                </a>
              </motion.div>
            </div>

            {/* Right: SWS Badge */}
            <motion.div
              className="flex-1 flex justify-center lg:justify-end order-2"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}>
              <div className="relative flex flex-col items-center">
                <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl scale-110 pointer-events-none" />
                <motion.img
                  src="/sws-logo-badge.png"
                  alt="Social Welfare Skeptrons Badge"
                  className="relative z-10 w-52 h-52 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 xl:w-[420px] xl:h-[420px] object-contain drop-shadow-[0_0_60px_rgba(255,215,0,0.45)]"
                  animate={{ rotate: [0, 1, -1, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  whileHover={{ scale: 1.04, filter: "drop-shadow(0 0 80px rgba(255,215,0,0.7))" }}
                />
                <p className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-primary mt-2 text-center">
                  ⚔ Social Welfare Skeptrons — Region VII ⚔
                </p>
                <p className="text-[9px] text-muted-foreground font-mono mt-0.5">Established 2021</p>
              </div>
            </motion.div>
          </div>

          <motion.div className="mt-4 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
            <ChevronDown className="mx-auto text-primary/50 animate-bounce" size={22} />
          </motion.div>
        </div>
      </section>

      {/* ═══════ MAIN CONTENT ═══════ */}
      <section className="container mx-auto px-3 sm:px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* ─── CENTER (shows first on mobile) ─── */}
          <div className="lg:col-span-6 space-y-4 order-1 lg:order-2">

            {/* Group Photo */}
            <motion.div className="scroll-panel rounded-lg overflow-hidden ornate-border"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="relative w-full overflow-hidden" style={{ height: "260px" }}>
                <img src="/sws-group-photo.jpg" alt="SWS Skeptrons Brotherhood"
                  className="w-full h-full object-cover object-center" />
              </div>
            </motion.div>

            {/* Countdown */}
            <DeadfrontTimer />

            {/* News */}
            <motion.div className="scroll-panel rounded-lg p-4 ornate-border"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <h2 className="font-heading text-sm font-bold tracking-[0.2em] uppercase mb-3">
                <span className="text-primary text-glow-gold">Latest</span>{" "}
                <span className="text-foreground">News &amp; Updates</span>
              </h2>
              {[
                { title: "AKRho Celebrates 52 Years of Brotherhood", date: "Aug 8, 2025", tag: "ANNIVERSARY",
                  excerpt: "Alpha Kappa Rho marks another milestone as the fraternity celebrates 52 years since its founding on August 8, 1973 at UST, Manila." },
                { title: "SWS Skeptrons Chapter Gathering – Region VII", date: "May 2026", tag: "CHAPTER NEWS",
                  excerpt: "The Social Welfare Skeptrons chapter held a successful brotherhood gathering, strengthening bonds among members." },
                { title: "AKRho: Registered Humanitarian Fraternity", date: "Ongoing", tag: "INFO",
                  excerpt: "Alpha Kappa Rho is registered with the Philippine SEC as a non-profit International Humanitarian Service Fraternity and Sorority." },
              ].map((news, i) => (
                <div key={i} className="py-3 border-b border-border/30 last:border-b-0 hover:bg-primary/5 transition-colors px-2 -mx-2 rounded">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-heading text-xs sm:text-sm font-bold text-foreground hover:text-primary transition-colors leading-snug">
                      {news.title}
                    </h3>
                    <span className={`text-[9px] font-heading font-bold px-1.5 py-0.5 rounded-sm flex-shrink-0 ${
                      news.tag === "ANNIVERSARY" ? "bg-primary/20 text-primary" :
                      news.tag === "CHAPTER NEWS" ? "bg-blue-500/20 text-blue-400" : "bg-accent/20 text-accent"}`}>
                      {news.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed mb-1">{news.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-mono text-primary/60">{news.date}</p>
                    <span className="text-[10px] font-heading text-primary">Read More →</span>
                  </div>
                </div>
              ))}
              <div className="text-center mt-3 pt-2 border-t border-border/20">
                <Link to="/news" className="text-xs font-heading text-primary hover:underline tracking-wider uppercase">
                  View All News →
                </Link>
              </div>
            </motion.div>
          </div>

          {/* ─── LEFT SIDEBAR ─── */}
          <div className="lg:col-span-3 space-y-4 order-2 lg:order-1">

            {/* Login */}
            <motion.div className="scroll-panel rounded-lg p-4 ornate-border"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <h3 className="font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-primary text-glow-gold mb-3 text-center">
                ⚔ Member Login ⚔
              </h3>
              <div className="space-y-2.5">
                <div>
                  <label className="text-[10px] font-heading text-muted-foreground uppercase tracking-wider">Username</label>
                  <input type="text" placeholder="Enter username"
                    className="w-full h-8 px-3 text-xs bg-background/60 border border-border rounded-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 mt-1" />
                </div>
                <div>
                  <label className="text-[10px] font-heading text-muted-foreground uppercase tracking-wider">Password</label>
                  <input type="password" placeholder="••••••••"
                    className="w-full h-8 px-3 text-xs bg-background/60 border border-border rounded-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 mt-1" />
                </div>
                <button className="w-full h-8 text-xs font-heading font-bold uppercase tracking-wider bg-gradient-to-b from-primary to-[hsl(35,70%,40%)] text-primary-foreground rounded-sm hover:brightness-110 transition-all border border-primary/60">
                  Log In
                </button>
                <div className="flex items-center justify-between text-[10px]">
                  <Link to="/register" className="text-primary hover:underline font-heading">Create Account</Link>
                  <span className="text-muted-foreground hover:text-primary cursor-pointer font-heading">Forgot?</span>
                </div>
              </div>
            </motion.div>

            {/* Chapter Stats */}
            <motion.div className="scroll-panel rounded-lg p-3 ornate-border"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <div className="space-y-2">
                {[
                  { icon: Users, label: "Active Members", value: "SWS Chapter" },
                  { icon: Star, label: "Founded", value: "Aug 8, 1973" },
                  { icon: Shield, label: "Chapter Est.", value: "2021" },
                  { icon: Users, label: "Organization", value: "Humanitarian" },
                  { icon: UserPlus, label: "Region", value: "Region VII" },
                  { icon: Star, label: "Motto", value: "Truth Conquers All" },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-2.5 py-1 border-b border-border/30 last:border-b-0">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <stat.icon size={12} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-mono text-xs font-bold text-primary truncate block">{stat.value}</span>
                      <p className="text-[10px] text-muted-foreground truncate">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <TopPlayersSlider />
          </div>

          {/* ─── RIGHT SIDEBAR ─── */}
          <div className="lg:col-span-3 space-y-3 order-3">
            {[
              { icon: "📘", label: "FACEBOOK", desc: "Visit Our Page", href: "https://www.facebook.com" },
              { icon: "🤝", label: "BROTHERHOOD", desc: "Our Pledge & Values", href: "/about" },
              { icon: "📋", label: "CHAPTER HISTORY", desc: "SWS Est. 2021", href: "/about" },
            ].map((btn, i) => (
              <motion.a key={btn.label} href={btn.href}
                target={btn.href.startsWith("http") ? "_blank" : undefined}
                rel={btn.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex scroll-panel rounded-lg p-3 ornate-border hover:scale-[1.02] transition-transform duration-200 group cursor-pointer items-center gap-3"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-lg flex-shrink-0">{btn.icon}</div>
                <div>
                  <p className="font-heading text-[11px] font-bold tracking-wider text-foreground group-hover:text-primary transition-colors">{btn.label}</p>
                  <p className="text-[10px] text-muted-foreground">{btn.desc}</p>
                </div>
              </motion.a>
            ))}

            {/* Member Verifier */}
            <motion.div className="scroll-panel rounded-lg p-4 ornate-border text-center"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <Shield size={20} className="text-primary mx-auto mb-2" />
              <h3 className="font-heading text-[10px] font-bold uppercase tracking-wider text-primary mb-1">Member Verifier</h3>
              <p className="text-[10px] text-muted-foreground mb-2">Verify AKRho SWS membership</p>
              <Link to="/member-verifier"
                className="block w-full py-2 text-[11px] font-heading font-bold uppercase tracking-wider bg-gradient-to-b from-primary to-[hsl(35,70%,40%)] text-primary-foreground rounded-sm hover:brightness-110 transition-all border border-primary/60">
                Verify Now
              </Link>
            </motion.div>

            {/* Upcoming Events */}
            <motion.div className="scroll-panel rounded-lg p-3 ornate-border"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
              <h3 className="font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2 flex items-center gap-1.5">
                <Calendar size={11} /> Upcoming Events
              </h3>
              {[
                { name: "53rd AKRho Anniversary", time: "Aug 8" },
                { name: "SWS Chapter Meeting", time: "TBA" },
                { name: "Brotherhood Bonding", time: "TBA" },
              ].map((e, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-border/20 last:border-b-0">
                  <span className="text-[11px] text-foreground/80 leading-tight">{e.name}</span>
                  <span className="text-[10px] font-mono text-primary ml-2 flex-shrink-0">{e.time}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ GALLERY ═══════ */}
      <section className="container mx-auto px-3 sm:px-4 py-6">
        <CharacterGallery />
      </section>

      <Footer />
    </div>
  );
};

export default Index;
