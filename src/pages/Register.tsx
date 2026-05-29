import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, UserPlus, Database, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; error: string | null; database: string | null } | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/db-status")
      .then((res) => res.json())
      .then((data) => setDbStatus(data))
      .catch((err) => setDbStatus({ connected: false, error: err.message, database: null }));
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.username.length < 4) e.username = "Username must be at least 4 characters";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email address";
    if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to register");
      }
      toast({ title: "Account Created!", description: "Welcome back, warrior! Redirecting to login..." });
      setForm({ username: "", email: "", password: "", confirm: "" });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      toast({ title: "Registration Failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full bg-muted/50 border ${errors[field] ? "border-accent" : "border-border"} rounded-sm px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`;

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
            <UserPlus className="mx-auto text-primary mb-3" size={32} />
            <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan tracking-wider">
              INITIALIZE ACCOUNT
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Create your warrior profile</p>

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
              <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1 block">Username</label>
              <input className={inputClass("username")} placeholder="Enter username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} disabled={loading} />
              {errors.username && <p className="text-xs text-accent mt-1">{errors.username}</p>}
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1 block">Email</label>
              <input className={inputClass("email")} type="email" placeholder="Enter email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} disabled={loading} />
              {errors.email && <p className="text-xs text-accent mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1 block">Password</label>
              <div className="relative">
                <input className={inputClass("password")} type={showPass ? "text" : "password"} placeholder="Enter password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} disabled={loading} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors" disabled={loading}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-accent mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1 block">Confirm Password</label>
              <div className="relative">
                <input className={inputClass("confirm")} type={showConfirm ? "text" : "password"} placeholder="Confirm password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} disabled={loading} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors" disabled={loading}>
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirm && <p className="text-xs text-accent mt-1">{errors.confirm}</p>}
            </div>

            <button type="submit" disabled={loading} className="w-full mt-2 py-3 bg-primary text-primary-foreground font-display text-sm font-bold tracking-wider rounded-sm glow-cyan hover:scale-[1.02] transition-transform duration-200 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  INITIALIZING...
                </>
              ) : (
                "INITIALIZE ACCOUNT"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">Login here</Link>
          </p>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
