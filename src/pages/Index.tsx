import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, Users, UserPlus, Shield, Star, Calendar, Facebook, Eye, EyeOff, Lock, User, LayoutDashboard } from "lucide-react";
import { getApiUrl } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DeadfrontTimer from "@/components/DeadfrontTimer";
import CharacterGallery from "@/components/CharacterGallery";
import TopPlayersSlider from "@/components/TopPlayersSlider";
import BackgroundFX from "@/components/BackgroundFX";
import MemberVerifierModal from "@/components/MemberVerifierModal";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [verifierOpen, setVerifierOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [stats, setStats] = useState({ total: 0, online: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(getApiUrl("/api/members/stats"));
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
    const statsInterval = setInterval(fetchStats, 10000);
    return () => clearInterval(statsInterval);
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("sws_token");
      const userStr = localStorage.getItem("sws_user");
      if (token && userStr) {
        try { setLoggedInUser(JSON.parse(userStr)); } catch { setLoggedInUser(null); }
      } else {
        setLoggedInUser(null);
      }
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    const interval = setInterval(checkAuth, 2000);
    return () => { window.removeEventListener("storage", checkAuth); clearInterval(interval); };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(getApiUrl("/api/auth/signin"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Login failed");
      localStorage.setItem("sws_token", data.token);
      localStorage.setItem("sws_user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch {
      setError("Connection error. Make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };

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

              {/* ── Member Verifier (Always Visible in Hero) ── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 sm:p-8 rounded-xl border border-primary/30 bg-black/40 backdrop-blur-sm max-w-md lg:max-w-xl w-full"
                style={{ boxShadow: "0 0 30px rgba(200,146,10,0.15), inset 0 1px 0 rgba(200,146,10,0.15)" }}
              >
                <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
                  <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                    <Shield size={26} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-heading text-base font-bold text-primary uppercase tracking-widest">
                      Member Verifier
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Verify Alpha Kappa Rho SWS membership status</p>
                  </div>
                </div>
                <button onClick={() => setVerifierOpen(true)}
                  className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-b from-primary to-[hsl(35,70%,40%)] text-primary-foreground font-heading font-bold text-xs uppercase tracking-widest rounded-lg border border-primary/60 hover:scale-105 transition-all duration-200 cursor-pointer shadow-lg shadow-primary/10">
                  Verify Now
                </button>
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

            {/* Login / Profile Box */}
            {loggedInUser ? (
              /* ── Logged-in profile card ── */
              <motion.div className="scroll-panel rounded-lg p-4 ornate-border"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <h3 className="font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-primary text-glow-gold mb-3 text-center">
                  ⚔ Member ⚔
                </h3>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/40 bg-primary/10 flex items-center justify-center">
                    {loggedInUser.profileImage
                      ? <img src={loggedInUser.profileImage} alt="" className="w-full h-full object-cover" />
                      : <User size={28} className="text-primary/50" />
                    }
                  </div>
                  <div className="text-center">
                    <p className="font-heading text-sm font-bold text-foreground">
                      {loggedInUser.firstName && loggedInUser.lastName
                        ? `${loggedInUser.firstName} ${loggedInUser.lastName}`
                        : loggedInUser.username}
                    </p>
                    <p className="text-[10px] text-muted-foreground">@{loggedInUser.username}</p>
                    {loggedInUser.accountId && (
                      <p className="text-[10px] font-mono text-primary/70 mt-0.5">{loggedInUser.accountId}</p>
                    )}
                  </div>
                  <Link to="/dashboard"
                    className="w-full flex items-center justify-center gap-2 h-8 text-xs font-heading font-bold uppercase tracking-wider bg-gradient-to-b from-primary to-[hsl(35,70%,40%)] text-primary-foreground rounded-sm hover:brightness-110 transition-all border border-primary/60">
                    <LayoutDashboard size={13} />
                    Account Dashboard
                  </Link>
                </div>
              </motion.div>
            ) : (
              /* ── Logged-out login form ── */
              <motion.div className="scroll-panel rounded-lg p-4 ornate-border"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <h3 className="font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-primary text-glow-gold mb-3 text-center">
                  ⚔ Member Login ⚔
                </h3>
                {error && (
                  <div className="p-2 rounded bg-red-500/10 border border-red-500/30 text-[10px] text-red-400 text-center mb-2.5">
                    {error}
                  </div>
                )}
                <form onSubmit={handleLogin} className="space-y-2.5">
                  <div>
                    <label className="text-[10px] font-heading text-muted-foreground uppercase tracking-wider">Username / Email</label>
                    <input type="text" placeholder="Enter username or email"
                      value={email} onChange={e => setEmail(e.target.value)} required
                      className="w-full h-8 px-3 text-xs bg-background/60 border border-border rounded-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 mt-1" />
                  </div>
                  <div>
                    <label className="text-[10px] font-heading text-muted-foreground uppercase tracking-wider">Password</label>
                    <div className="relative mt-1">
                      <input type={showPassword ? "text" : "password"} placeholder="••••••••"
                        value={password} onChange={e => setPassword(e.target.value)} required
                        className="w-full h-8 pl-3 pr-10 text-xs bg-background/60 border border-border rounded-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-primary transition-colors flex items-center justify-center z-10 cursor-pointer w-8 h-8">
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full h-8 text-xs font-heading font-bold uppercase tracking-wider bg-gradient-to-b from-primary to-[hsl(35,70%,40%)] text-primary-foreground rounded-sm hover:brightness-110 transition-all border border-primary/60 disabled:opacity-60">
                    {loading ? "Logging in..." : "Log In"}
                  </button>
                  <div className="flex items-center justify-between text-[10px]">
                    <Link to="/register" className="text-primary hover:underline font-heading">Create Account</Link>
                    <span className="text-muted-foreground hover:text-primary cursor-pointer font-heading">Forgot?</span>
                  </div>
                </form>
              </motion.div>
            )}

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
              { icon: "📘", label: "FACEBOOK", desc: "Visit Our Page", href: "https://www.facebook.com/share/1E3rvGNzGp/" },
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



            {/* Membership Stats */}
            <motion.div className="scroll-panel rounded-lg p-4 ornate-border"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
              <h3 className="font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-3 flex items-center gap-1.5">
                <Users size={11} className="text-primary" /> Chapter Statistics
              </h3>
              <div className="space-y-3">
                {/* Total Registered */}
                <div className="flex items-center justify-between p-2.5 rounded bg-primary/5 border border-primary/10">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-primary" />
                    <span className="text-[11px] text-foreground/80 font-bold uppercase tracking-wider">Total Registered</span>
                  </div>
                  <span className="text-sm font-mono font-bold text-foreground text-glow-gold">
                    {stats.total}
                  </span>
                </div>
                
                {/* Active Online */}
                <div className="flex items-center justify-between p-2.5 rounded bg-primary/5 border border-primary/10">
                  <div className="flex items-center gap-2">
                    <div className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                    </div>
                    <span className="text-[11px] text-foreground/80 font-bold uppercase tracking-wider">Active Online</span>
                  </div>
                  <span className="text-sm font-mono font-bold text-success text-glow-success">
                    {stats.online}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ GALLERY ═══════ */}
      <section className="container mx-auto px-3 sm:px-4 py-6">
        <CharacterGallery />
      </section>

      <Footer />
      <MemberVerifierModal isOpen={verifierOpen} onClose={() => setVerifierOpen(false)} />
    </div>
  );
};

export default Index;
