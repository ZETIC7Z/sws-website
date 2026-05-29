import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn, Database, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; error: string | null; database: string | null } | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetch("/api/db-status")
      .then((res) => res.json())
      .then((data) => setDbStatus(data))
      .catch((err) => setDbStatus({ connected: false, error: err.message, database: null }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to log in");
      }
      toast({ title: "Login Successful!", description: `Welcome back, ${data.user.username}!` });
    } catch (err: any) {
      toast({ title: "Login Failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 flex items-center justify-center pt-24 pb-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md glass cyber-border rounded-lg p-6 md:p-8"
        >
          <div className="text-center mb-6">
            <LogIn className="mx-auto text-primary mb-3" size={32} />
            <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan tracking-wider">
              ACCESS TERMINAL
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Enter your credentials</p>

            {dbStatus && (
              <div className="mt-3 flex flex-col items-center">
                <div className={`flex items-center gap-2 text-xs font-mono py-1.5 px-3 rounded-full border ${dbStatus.connected ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-rose-500/10 border-rose-500/30 text-rose-400"}`}>
                  <Database size={12} />
                  <span>MongoDB: {dbStatus.connected ? `Connected (${dbStatus.database})` : "Disconnected"}</span>
                  {dbStatus.connected ? <CheckCircle size={10} /> : <XCircle size={10} />}
                </div>
                {!dbStatus.connected && dbStatus.error && (
                  <p className="text-[10px] text-rose-400 mt-1 max-w-[280px] text-center font-mono truncate" title={dbStatus.error}>
                    Error: {dbStatus.error}
                  </p>
                )}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1 block">Username / Email</label>
              <input
                className="w-full bg-muted/50 border border-border rounded-sm px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="Enter username or email"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                disabled={loading}
              />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1 block">Password</label>
              <div className="relative">
                <input
                  className="w-full bg-muted/50 border border-border rounded-sm px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  type={showPass ? "text" : "password"}
                  placeholder="Enter password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  disabled={loading}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors" disabled={loading}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full mt-2 py-3 bg-primary text-primary-foreground font-display text-sm font-bold tracking-wider rounded-sm glow-cyan hover:scale-[1.02] transition-transform duration-200 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  AUTHENTICATING...
                </>
              ) : (
                "AUTHENTICATE"
              )}
            </button>
          </form>

          <div className="text-center text-sm text-muted-foreground mt-4 space-y-1">
            <p>
              <Link to="#" className="text-primary hover:underline">Forgot Password?</Link>
            </p>
            <p>
              No account?{" "}
              <Link to="/register" className="text-primary hover:underline">Register here</Link>
            </p>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
