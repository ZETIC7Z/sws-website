import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Shield, Eye, EyeOff } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Login failed");
      localStorage.setItem("sws_token", data.token);
      localStorage.setItem("sws_user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch { setError("Connection error. Make sure the server is running."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-24">
        <motion.div className="w-full max-w-sm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="scroll-panel rounded-xl ornate-border overflow-hidden">
            <div className="p-6">
              <div className="text-center mb-6">
                <img src="/sws-logo-badge.png" alt="SWS" className="w-16 h-16 mx-auto mb-3 drop-shadow-[0_0_20px_rgba(255,215,0,0.5)]" />
                <h1 className="font-heading text-xl font-bold text-primary text-glow-gold uppercase tracking-widest">Member Sign In</h1>
                <p className="text-xs text-muted-foreground mt-1">SWS Skeptrons — Alpha Kappa Rho</p>
              </div>

              {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400 text-center">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">Email or Username</label>
                  <div className="relative mt-1">
                    <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input type="text" value={email} onChange={e => setEmail(e.target.value)} required
                      placeholder="you@email.com or username"
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-background/60 border border-border rounded-lg focus:outline-none focus:border-primary/50 text-foreground" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">Password</label>
                  <div className="relative mt-1">
                    <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 text-sm bg-background/60 border border-border rounded-lg focus:outline-none focus:border-primary/50 text-foreground" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors flex items-center justify-center">
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-b from-primary to-[hsl(35,70%,40%)] text-primary-foreground font-heading font-bold text-sm uppercase tracking-wider rounded-lg border border-primary/60 hover:brightness-110 transition-all disabled:opacity-60">
                  <Shield size={15} />
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <div className="mt-4 text-center space-y-2">
                <p className="text-xs text-muted-foreground">
                  No account yet?{" "}
                  <Link to="/register" className="text-primary hover:underline font-heading font-bold">Create Account</Link>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
