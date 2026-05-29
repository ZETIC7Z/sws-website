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
      <section className="relative pt-24 overflow-hidden">
        <div className="absolute inset-0 god-rays pointer-events-none opacity-30 z-0" />

        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="banner-overlay absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
        </div>

        <div className="relative container mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center min-h-[60vh]">
            {/* Left: Logo + Title + CTA */}
            <div className="lg:col-span-6 text-center lg:text-left z-10">
              <div className="relative group inline-block mt-6 mb-2">
                <motion.img
                  src="/stampede-logo.png"
                  alt="SWS Skeptrons"
                  className="w-56 h-auto md:w-80 lg:w-[400px] mx-auto lg:mx-0 mb-2 drop-shadow-[0_0_30px_rgba(255,215,0,0.65)] relative z-10 transition-transform duration-300 cursor-pointer"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  whileHover={{ scale: 1.05 }}
                />
                <div className="absolute -inset-4 bg-primary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 z-0" />
              </div>
              <motion.p
                className="text-base md:text-lg text-foreground/70 font-body mb-2 italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Social Welfare Skeptrons — Region VII
              </motion.p>
              <motion.p
                className="text-sm md:text-base text-accent font-heading font-bold tracking-widest mb-2 uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
              >
                Alpha Kappa Rho
              </motion.p>
              <motion.p
                className="text-sm text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                A proud chapter of Alpha Kappa Rho International Humanitarian Service Fraternity & Sorority.
                Brotherhood forged in truth, united in service. Established 2021. <em>"Truth Conquers All."</em>
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Link
                  to="/register"
                  className="group flex items-center gap-2 px-8 py-3 bg-gradient-to-b from-primary to-[hsl(35,70%,40%)] text-primary-foreground font-heading text-sm font-bold tracking-wider rounded-sm glow-gold hover:scale-105 transition-transform duration-200 border border-primary/60"
                >
                  <UserPlus size={18} />
                  JOIN THE CHAPTER
                </Link>
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-8 py-3 scroll-panel text-foreground font-heading text-sm font-bold tracking-wider rounded-sm hover:bg-primary/10 transition-all duration-200"
                >
                  <Facebook size={18} className="text-primary" />
                  FACEBOOK PAGE
                </a>
              </motion.div>
            </div>

            {/* Right: SWS Badge Logo */}
            <motion.div
              className="lg:col-span-6 relative flex justify-center lg:justify-end"
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="relative group flex flex-col items-center justify-center">
                {/* Outer glow rings */}
                <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl scale-110 animate-pulse-glow pointer-events-none" />
                <div className="absolute inset-0 rounded-full bg-accent/5 blur-2xl scale-125 pointer-events-none" />
                <motion.img
                  src="/sws-logo-badge.png"
                  alt="Social Welfare Skeptrons Badge"
                  className="relative z-10 w-[320px] h-[320px] md:w-[420px] md:h-[420px] lg:w-[480px] lg:h-[480px] object-contain drop-shadow-[0_0_60px_rgba(255,215,0,0.45)] transition-all duration-500"
                  animate={{ rotate: [0, 1, -1, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  whileHover={{ scale: 1.05, filter: "drop-shadow(0 0 80px rgba(255,215,0,0.7))" }}
                />
                <p className="relative z-10 text-xs font-heading font-bold uppercase tracking-[0.25em] text-primary text-glow-gold mt-4 text-center">
                  ⚔ Social Welfare Skeptrons — Region VII ⚔
                </p>
                <p className="relative z-10 text-[10px] text-muted-foreground font-mono tracking-wider mt-1">Established 2021</p>
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="mt-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <ChevronDown className="mx-auto text-primary/50 animate-bounce" size={24} />
          </motion.div>
        </div>
      </section>

      {/* ═══════ MAIN CONTENT AREA ═══════ */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ─── LEFT SIDEBAR ─── */}
          <div className="lg:col-span-3 space-y-5">
            {/* Login Panel */}
            <motion.div
              className="scroll-panel rounded-lg p-5 ornate-border"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-primary text-glow-gold mb-4 text-center">
                ⚔ Member Login ⚔
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-heading text-muted-foreground uppercase tracking-wider">Username</label>
                  <input
                    type="text"
                    placeholder="Enter username"
                    className="w-full h-9 px-3 text-xs bg-background/60 border border-border rounded-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-heading text-muted-foreground uppercase tracking-wider">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full h-9 px-3 text-xs bg-background/60 border border-border rounded-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 mt-1"
                  />
                </div>
                <button className="w-full h-9 text-xs font-heading font-bold uppercase tracking-wider bg-gradient-to-b from-primary to-[hsl(35,70%,40%)] text-primary-foreground rounded-sm hover:brightness-110 transition-all border border-primary/60">
                  Log In
                </button>
                <div className="flex items-center justify-between text-[10px]">
                  <Link to="/register" className="text-primary hover:underline font-heading">Create Account</Link>
                  <span className="text-muted-foreground hover:text-primary cursor-pointer font-heading">Forgot Password?</span>
                </div>
              </div>
            </motion.div>

            {/* Chapter Stats */}
            <motion.div
              className="scroll-panel rounded-lg p-4 ornate-border"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="space-y-2.5">
                {[
                  { icon: Users, label: "Active Members", value: "SWS Chapter", color: "text-success" },
                  { icon: Star, label: "Founded", value: "Aug 8, 1973", color: "text-primary" },
                  { icon: Shield, label: "Chapter Est.", value: "2021", color: "text-primary" },
                  { icon: Users, label: "Organization Type", value: "Humanitarian", color: "text-primary" },
                  { icon: UserPlus, label: "Region", value: "Region VII", color: "text-primary" },
                  { icon: Star, label: "Motto", value: "Truth Conquers All", color: "text-primary" },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-3 py-1.5 border-b border-border/30 last:border-b-0">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <stat.icon size={14} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`font-mono text-xs font-bold ${stat.color} truncate block`}>{stat.value}</span>
                      <p className="text-[10px] text-muted-foreground truncate">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Chapter Officers */}
            <TopPlayersSlider />
          </div>

          {/* ─── CENTER CONTENT ─── */}
          <div className="lg:col-span-6 space-y-6">
            {/* SWS Brotherhood Photo Banner */}
            <motion.div
              className="scroll-panel rounded-lg overflow-hidden ornate-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative w-full overflow-hidden" style={{ height: "320px" }}>
                <img
                  src="/sws-group-photo.jpg"
                  alt="SWS Skeptrons Brotherhood"
                  className="w-full h-full object-cover object-center block"
                />
              </div>
            </motion.div>

            {/* Anniversary Countdown */}
            <DeadfrontTimer />

            {/* Latest News */}
            <motion.div
              className="scroll-panel rounded-lg p-5 ornate-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="font-heading text-sm font-bold tracking-[0.2em] uppercase mb-4">
                <span className="text-primary text-glow-gold">Latest</span>{" "}
                <span className="text-foreground">News & Updates</span>
              </h2>

              <div className="space-y-0">
                {[
                  {
                    title: "AKRho Celebrates 52 Years of Brotherhood",
                    date: "Aug 8, 2025",
                    tag: "ANNIVERSARY",
                    excerpt: "Alpha Kappa Rho marks another milestone as the fraternity celebrates 52 years since its founding on August 8, 1973 at the University of Santo Tomas, Manila. Chapters across the Philippines commemorate this historic occasion with unity and brotherhood.",
                  },
                  {
                    title: "SWS Skeptrons Chapter Gathering – Region VII",
                    date: "May 2026",
                    tag: "CHAPTER NEWS",
                    excerpt: "The Social Welfare Skeptrons chapter held a successful brotherhood gathering, strengthening bonds among members. The event showcased the chapter's commitment to fellowship, service, and the core values of Alpha Kappa Rho.",
                  },
                  {
                    title: "AKRho: Registered Humanitarian Fraternity",
                    date: "Ongoing",
                    tag: "INFO",
                    excerpt: "Alpha Kappa Rho is duly registered with the Philippine Securities and Exchange Commission (SEC) as a non-profit, non-dividend International Humanitarian Service Fraternity and Sorority — promoting brotherhood and community service across the Philippines.",
                  },
                ].map((news, i) => (
                  <div
                    key={i}
                    className="py-4 border-b border-border/30 last:border-b-0 hover:bg-primary/5 transition-colors duration-200 cursor-pointer px-2 -mx-2 rounded"
                  >
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <h3 className="font-heading text-sm font-bold text-foreground hover:text-primary transition-colors">
                        {news.title}
                      </h3>
                      <span className={`text-[9px] font-heading font-bold px-2 py-0.5 rounded-sm flex-shrink-0 ${
                        news.tag === "ANNIVERSARY" ? "bg-primary/20 text-primary" :
                        news.tag === "CHAPTER NEWS" ? "bg-blue-500/20 text-blue-400" :
                        "bg-accent/20 text-accent"
                      }`}>
                        {news.tag}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-2">{news.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-mono text-primary/60">{news.date}</p>
                      <span className="text-[10px] font-heading text-primary hover:underline">Read More →</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-4 pt-3 border-t border-border/20">
                <Link to="/news" className="text-xs font-heading text-primary hover:underline tracking-wider uppercase">
                  View All News →
                </Link>
              </div>
            </motion.div>
          </div>

          {/* ─── RIGHT SIDEBAR ─── */}
          <div className="lg:col-span-3 space-y-4">
            {/* Action Buttons */}
            {[
              { icon: "📘", label: "FACEBOOK", desc: "Visit Our Page", href: "https://www.facebook.com", color: "from-[hsl(235,60%,50%)] to-[hsl(235,60%,35%)]" },
              { icon: "🤝", label: "BROTHERHOOD", desc: "Our Pledge & Values", href: "/about", color: "from-[hsl(43,60%,40%)] to-[hsl(35,50%,25%)]" },
              { icon: "📋", label: "CHAPTER HISTORY", desc: "SWS Est. 2021", href: "/about", color: "from-accent to-[hsl(0,50%,30%)]" },
            ].map((btn, i) => (
              <motion.a
                key={btn.label}
                href={btn.href}
                target={btn.href.startsWith("http") ? "_blank" : undefined}
                rel={btn.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="block scroll-panel rounded-lg p-4 ornate-border hover:scale-[1.02] transition-transform duration-200 group cursor-pointer"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${btn.color} flex items-center justify-center text-xl flex-shrink-0`}>
                    {btn.icon}
                  </div>
                  <div>
                    <p className="font-heading text-xs font-bold tracking-wider text-foreground group-hover:text-primary transition-colors">{btn.label}</p>
                    <p className="text-[10px] text-muted-foreground">{btn.desc}</p>
                  </div>
                </div>
              </motion.a>
            ))}

            {/* Member Verifier */}
            <motion.div
              className="scroll-panel rounded-lg p-5 ornate-border text-center"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Shield size={24} className="text-primary mx-auto mb-3" />
              <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-primary mb-2">Member Verifier</h3>
              <p className="text-[10px] text-muted-foreground mb-3">Verify AKRho SWS membership</p>
              <Link
                to="/member-verifier"
                className="block w-full py-2.5 text-xs font-heading font-bold uppercase tracking-wider bg-gradient-to-b from-primary to-[hsl(35,70%,40%)] text-primary-foreground rounded-sm hover:brightness-110 transition-all border border-primary/60"
              >
                Verify Now
              </Link>
            </motion.div>

            {/* Upcoming Events */}
            <motion.div
              className="scroll-panel rounded-lg p-4 ornate-border"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-primary text-glow-gold mb-3 flex items-center gap-2">
                <Calendar size={12} />
                Upcoming Events
              </h3>
              <div className="space-y-2">
                {[
                  { name: "53rd AKRho Anniversary", time: "Aug 8", status: "upcoming" },
                  { name: "SWS Chapter Meeting", time: "TBA", status: "upcoming" },
                  { name: "Brotherhood Bonding", time: "TBA", status: "upcoming" },
                ].map((event, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 border-b border-border/20 last:border-b-0">
                    <span className="text-xs text-foreground/80">{event.name}</span>
                    <span className="text-[10px] font-mono text-primary">{event.time}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ SWS ACTIVITIES GALLERY ═══════ */}
      <section className="container mx-auto px-4 py-8">
        <CharacterGallery />
      </section>

      <Footer />
    </div>
  );
};

export default Index;
