import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Camera, ChevronDown, Check, ArrowRight, ArrowLeft, Eye, EyeOff, Smartphone, X, PenTool, Upload } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getApiUrl } from "@/lib/utils";
import SignaturePad from "@/components/SignaturePad";

// Country list with flag emoji
export const COUNTRIES = [
  { name: "Afghanistan", code: "AF", flag: "🇦🇫" }, { name: "Albania", code: "AL", flag: "🇦🇱" },
  { name: "Algeria", code: "DZ", flag: "🇩🇿" }, { name: "Argentina", code: "AR", flag: "🇦🇷" },
  { name: "Australia", code: "AU", flag: "🇦🇺" }, { name: "Austria", code: "AT", flag: "🇦🇹" },
  { name: "Bangladesh", code: "BD", flag: "🇧🇩" }, { name: "Belgium", code: "BE", flag: "🇧🇪" },
  { name: "Brazil", code: "BR", flag: "🇧🇷" }, { name: "Cambodia", code: "KH", flag: "🇰🇭" },
  { name: "Canada", code: "CA", flag: "🇨🇦" }, { name: "Chile", code: "CL", flag: "🇨🇱" },
  { name: "China", code: "CN", flag: "🇨🇳" }, { name: "Colombia", code: "CO", flag: "🇨🇴" },
  { name: "Egypt", code: "EG", flag: "🇪🇬" }, { name: "France", code: "FR", flag: "🇫🇷" },
  { name: "Germany", code: "DE", flag: "🇩🇪" }, { name: "Ghana", code: "GH", flag: "🇬🇭" },
  { name: "Greece", code: "GR", flag: "🇬🇷" }, { name: "India", code: "IN", flag: "🇮🇳" },
  { name: "Indonesia", code: "ID", flag: "🇮🇩" }, { name: "Iraq", code: "IQ", flag: "🇮🇶" },
  { name: "Ireland", code: "IE", flag: "🇮🇪" }, { name: "Israel", code: "IL", flag: "🇮🇱" },
  { name: "Italy", code: "IT", flag: "🇮🇹" }, { name: "Japan", code: "JP", flag: "🇯🇵" },
  { name: "Jordan", code: "JO", flag: "🇯🇴" }, { name: "Kenya", code: "KE", flag: "🇰🇪" },
  { name: "Malaysia", code: "MY", flag: "🇲🇾" }, { name: "Mexico", code: "MX", flag: "🇲🇽" },
  { name: "Morocco", code: "MA", flag: "🇲🇦" }, { name: "Myanmar", code: "MM", flag: "🇲🇲" },
  { name: "Nepal", code: "NP", flag: "🇳🇵" }, { name: "Netherlands", code: "NL", flag: "🇳🇱" },
  { name: "New Zealand", code: "NZ", flag: "🇳🇿" }, { name: "Nigeria", code: "NG", flag: "🇳🇬" },
  { name: "Norway", code: "NO", flag: "🇳🇴" }, { name: "Pakistan", code: "PK", flag: "🇵🇰" },
  { name: "Palestine", code: "PS", flag: "🇵🇸" }, { name: "Panama", code: "PA", flag: "🇵🇦" },
  { name: "Papua New Guinea", code: "PG", flag: "🇵🇬" }, { name: "Paraguay", code: "PY", flag: "🇵🇾" },
  { name: "Peru", code: "PE", flag: "🇵🇪" }, { name: "Philippines", code: "PH", flag: "🇵🇭" },
  { name: "Poland", code: "PL", flag: "🇵🇱" }, { name: "Portugal", code: "PT", flag: "🇵🇹" },
  { name: "Qatar", code: "QA", flag: "🇶🇦" }, { name: "Romania", code: "RO", flag: "🇷🇴" },
  { name: "Russia", code: "RU", flag: "🇷🇺" }, { name: "Saudi Arabia", code: "SA", flag: "🇸🇦" },
  { name: "Singapore", code: "SG", flag: "🇸🇬" }, { name: "South Africa", code: "ZA", flag: "🇿🇦" },
  { name: "South Korea", code: "KR", flag: "🇰🇷" }, { name: "Spain", code: "ES", flag: "🇪🇸" },
  { name: "Sri Lanka", code: "LK", flag: "🇱🇰" }, { name: "Sweden", code: "SE", flag: "🇸🇪" },
  { name: "Switzerland", code: "CH", flag: "🇨🇭" }, { name: "Thailand", code: "TH", flag: "🇹🇭" },
  { name: "Turkey", code: "TR", flag: "🇹🇷" }, { name: "Ukraine", code: "UA", flag: "🇺🇦" },
  { name: "United Arab Emirates", code: "AE", flag: "🇦🇪" },
  { name: "United Kingdom", code: "GB", flag: "🇬🇧" },
  { name: "United States", code: "US", flag: "🇺🇸" },
  { name: "Uruguay", code: "UY", flag: "🇺🇾" }, { name: "Venezuela", code: "VE", flag: "🇻🇪" },
  { name: "Vietnam", code: "VN", flag: "🇻🇳" }, { name: "Yemen", code: "YE", flag: "🇾🇪" },
];

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=account, 2=profile
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [accountData, setAccountData] = useState<any>(null);

  // Step 1
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Step 2
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<typeof COUNTRIES[0] | null>(null);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Signature States
  const [signature, setSignature] = useState("");
  const [sigType, setSigType] = useState<"draw" | "upload">("draw");
  const [sigUploading, setSigUploading] = useState(false);
  const sigFileRef = useRef<HTMLInputElement>(null);
  const [isDrawingModalOpen, setIsDrawingModalOpen] = useState(false);
  const [tempSignature, setTempSignature] = useState<string | null>(null);

  const filteredCountries = COUNTRIES.filter(c =>
    countrySearch === "" || c.name.toLowerCase().startsWith(countrySearch.toLowerCase())
  );

  const handleSignatureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSigUploading(true);
    try {
      const { removeSignatureBackground } = await import("@/lib/signatureUtils");
      const cleanSig = await removeSignatureBackground(file);
      setSignature(cleanSig);
    } catch (err: any) {
      setError("Failed to process signature background. Try another image.");
    } finally {
      setSigUploading(false);
    }
  };

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) return setError("Passwords do not match");
    if (password.length < 6) return setError("Password must be at least 6 characters");
    
    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    if (!hasUppercase || !hasSpecial) {
      return setError("Password must contain at least 1 uppercase letter and 1 special character (e.g., SamXerz1973!)");
    }

    setLoading(true);
    try {
      const res = await fetch(getApiUrl("/api/auth/signup"), {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Signup failed");
      setToken(data.token);
      setAccountData(data.user);
      localStorage.setItem("sws_token", data.token);
      localStorage.setItem("sws_user", JSON.stringify(data.user));
      setStep(2);
    } catch { setError("Connection error. Is the server running?"); }
    finally { setLoading(false); }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const tkn = token || localStorage.getItem("sws_token");
    try {
      // Upload avatar first if selected
      if (avatar) {
        const fd = new FormData();
        fd.append("avatar", avatar);
        await fetch(getApiUrl("/api/auth/upload-avatar"), {
          method: "POST", headers: { Authorization: `Bearer ${tkn}` }, body: fd,
        });
      }
      // Update profile
      const res = await fetch(getApiUrl("/api/auth/profile"), {
        method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${tkn}` },
        body: JSON.stringify({
          firstName, lastName, dateOfBirth: dob,
          address: { street, city, province, country: selectedCountry?.name || "", countryCode: selectedCountry?.code || "", flag: selectedCountry?.flag || "" },
          signature,
        }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Profile update failed");
      localStorage.setItem("sws_user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch { setError("Connection error. Is the server running?"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-24">
        <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {[1, 2].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-heading text-sm font-bold transition-all ${
                  s < step ? "bg-primary text-primary-foreground" : s === step ? "bg-primary/30 border-2 border-primary text-primary" : "bg-background border border-border text-muted-foreground"
                }`}>
                  {s < step ? <Check size={14} /> : s}
                </div>
                <span className={`text-xs font-heading uppercase tracking-wider ${s === step ? "text-primary" : "text-muted-foreground"}`}>
                  {s === 1 ? "Account" : "Profile"}
                </span>
                {s < 2 && <div className={`w-8 h-px ${step > 1 ? "bg-primary" : "bg-border"}`} />}
              </div>
            ))}
          </div>

          <div className="scroll-panel rounded-xl ornate-border overflow-hidden">
            <div className="p-6">
              <div className="text-center mb-6">
                <img src="/sws-logo-badge.png" alt="SWS" className="w-16 h-16 mx-auto mb-3 drop-shadow-[0_0_20px_rgba(255,215,0,0.5)]" />
                <h1 className="font-heading text-xl font-bold text-primary text-glow-gold uppercase tracking-widest">
                  {step === 1 ? "Create Account" : "Complete Profile"}
                </h1>
                <p className="text-xs text-muted-foreground mt-1">
                  {step === 1 ? "Join the SWS Skeptrons community" : "Tell us more about yourself"}
                </p>
              </div>

              <AnimatePresence mode="wait">
                {/* ── STEP 1 ── */}
                {step === 1 && (
                  <motion.form key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleStep1} className="space-y-4">
                    {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400 text-center">{error}</div>}
                    <div>
                      <label className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">Username</label>
                      <div className="relative mt-1">
                        <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input value={username} onChange={e => setUsername(e.target.value)} required
                          placeholder="yourname" className="w-full pl-9 pr-3 py-2.5 text-sm bg-background/60 border border-border rounded-lg focus:outline-none focus:border-primary/50" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">Email</label>
                      <div className="relative mt-1">
                        <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                          placeholder="you@email.com" className="w-full pl-9 pr-3 py-2.5 text-sm bg-background/60 border border-border rounded-lg focus:outline-none focus:border-primary/50" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">Password</label>
                      <div className="relative mt-1">
                        <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required
                          placeholder="Min. 6 characters" className="w-full pl-9 pr-10 py-2.5 text-sm bg-background/60 border border-border rounded-lg focus:outline-none focus:border-primary/50 text-foreground" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-primary transition-colors flex items-center justify-center z-10 cursor-pointer w-8 h-8">
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <p className="text-[8px] text-muted-foreground/60 mt-1 uppercase tracking-wider font-heading leading-normal">
                        Must contain at least 1 uppercase letter & 1 special character (e.g. SamXerz1973!)
                      </p>
                    </div>
                    <div>
                      <label className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">Confirm Password</label>
                      <div className="relative mt-1">
                        <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input type={showConfirm ? "text" : "password"} value={confirm} onChange={e => setConfirm(e.target.value)} required
                          placeholder="Repeat password" className="w-full pl-9 pr-10 py-2.5 text-sm bg-background/60 border border-border rounded-lg focus:outline-none focus:border-primary/50 text-foreground" />
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-primary transition-colors flex items-center justify-center z-10 cursor-pointer w-8 h-8">
                          {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {confirm && (
                        <div className="mt-1.5 flex items-center gap-1 text-[10px] uppercase tracking-wider font-heading">
                          {password === confirm ? (
                            <span className="text-primary flex items-center gap-1">
                              <Check size={11} className="text-primary" /> Passwords Match
                            </span>
                          ) : (
                            <span className="text-red-400">
                              Passwords Do Not Match
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <button type="submit" disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-b from-primary to-[hsl(35,70%,40%)] text-primary-foreground font-heading font-bold text-sm uppercase tracking-wider rounded-lg border border-primary/60 hover:brightness-110 transition-all disabled:opacity-60">
                      {loading ? "Creating..." : <><span>Create Account</span><ArrowRight size={16} /></>}
                    </button>
                    <p className="text-center text-xs text-muted-foreground">
                      Already have an account? <Link to="/login" className="text-primary hover:underline">Sign In</Link>
                    </p>
                  </motion.form>
                )}

                {/* ── STEP 2 ── */}
                {step === 2 && (
                  <motion.form key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleStep2} className="space-y-4">
                    {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400 text-center">{error}</div>}

                    {accountData && (
                      <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 text-center">
                        <p className="text-[10px] font-heading text-muted-foreground uppercase tracking-wider">Your Account ID</p>
                        <p className="font-mono text-sm font-bold text-primary">{accountData.accountId}</p>
                      </div>
                    )}

                    {/* Avatar upload */}
                    <div className="flex flex-col items-center gap-3">
                      <div onClick={() => fileRef.current?.click()}
                        className="w-24 h-24 rounded-full border-2 border-dashed border-primary/40 bg-primary/5 flex items-center justify-center cursor-pointer hover:border-primary/70 hover:bg-primary/10 transition-all overflow-hidden relative group">
                        {avatarPreview
                          ? <img src={avatarPreview} className="w-full h-full object-cover" />
                          : <Camera size={28} className="text-primary/50 group-hover:text-primary transition-colors" />
                        }
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Camera size={20} className="text-white" />
                        </div>
                      </div>
                      <button type="button" onClick={() => fileRef.current?.click()}
                        className="text-[11px] font-heading text-primary hover:underline uppercase tracking-wider">
                        {avatarPreview ? "Change Photo" : "Upload Profile Photo"}
                      </button>
                      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">First Name</label>
                        <input value={firstName} onChange={e => setFirstName(e.target.value)} required
                          placeholder="Juan" className="w-full mt-1 px-3 py-2.5 text-sm bg-background/60 border border-border rounded-lg focus:outline-none focus:border-primary/50" />
                      </div>
                      <div>
                        <label className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">Last Name</label>
                        <input value={lastName} onChange={e => setLastName(e.target.value)} required
                          placeholder="Dela Cruz" className="w-full mt-1 px-3 py-2.5 text-sm bg-background/60 border border-border rounded-lg focus:outline-none focus:border-primary/50" />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">Date of Birth</label>
                      <input type="date" value={dob} onChange={e => setDob(e.target.value)} required
                        className="w-full mt-1 px-3 py-2.5 text-sm bg-background/60 border border-border rounded-lg focus:outline-none focus:border-primary/50 text-foreground" />
                    </div>

                    <div>
                      <label className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">Street Address</label>
                      <input value={street} onChange={e => setStreet(e.target.value)}
                        placeholder="123 Rizal St." className="w-full mt-1 px-3 py-2.5 text-sm bg-background/60 border border-border rounded-lg focus:outline-none focus:border-primary/50" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">City</label>
                        <input value={city} onChange={e => setCity(e.target.value)}
                          placeholder="Cebu City" className="w-full mt-1 px-3 py-2.5 text-sm bg-background/60 border border-border rounded-lg focus:outline-none focus:border-primary/50" />
                      </div>
                      <div>
                        <label className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">Province</label>
                        <input value={province} onChange={e => setProvince(e.target.value)}
                          placeholder="Cebu" className="w-full mt-1 px-3 py-2.5 text-sm bg-background/60 border border-border rounded-lg focus:outline-none focus:border-primary/50" />
                      </div>
                    </div>

                    {/* Country with flag search */}
                    <div className="relative">
                      <label className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">Country</label>
                      <div className="relative mt-1">
                        <input
                          value={selectedCountry ? `${selectedCountry.flag} ${selectedCountry.name}` : countrySearch}
                          onChange={e => { setCountrySearch(e.target.value); setSelectedCountry(null); setShowCountryDropdown(true); }}
                          onFocus={() => setShowCountryDropdown(true)}
                          placeholder="Type to search country..."
                          className="w-full px-3 py-2.5 text-sm bg-background/60 border border-border rounded-lg focus:outline-none focus:border-primary/50 pr-8"
                        />
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      </div>
                      {showCountryDropdown && filteredCountries.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-xl max-h-48 overflow-y-auto">
                          {filteredCountries.slice(0, 20).map(c => (
                            <button key={c.code} type="button"
                              onClick={() => { setSelectedCountry(c); setCountrySearch(""); setShowCountryDropdown(false); }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-primary/10 flex items-center gap-2 transition-colors">
                              <span className="text-lg">{c.flag}</span>
                              <span className="text-foreground">{c.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Signature Section */}
                    <div className="border-t border-primary/10 pt-4 space-y-3">
                      <label className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground block">Signature</label>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Draw Box */}
                        <div 
                          onClick={() => {
                            setTempSignature(signature || null);
                            setIsDrawingModalOpen(true);
                          }}
                          className="group relative h-28 rounded-xl border border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all flex flex-col items-center justify-center cursor-pointer gap-2 overflow-hidden"
                        >
                          {signature ? (
                            <div 
                              className="absolute inset-0 flex items-center justify-center p-4"
                              style={{
                                background: "radial-gradient(circle at center, #3a0d0d 0%, #1c0606 100%)"
                              }}
                            >
                              <img 
                                src={signature} 
                                alt="Signature Preview" 
                                className="h-14 object-contain z-10 transition-transform group-hover:scale-105" 
                                style={{ filter: "brightness(0) invert(1)" }}
                              />
                              <div className="absolute bottom-2 text-[8px] text-white/40 uppercase tracking-widest font-mono group-hover:text-primary transition-colors">
                                Click to Redraw Signature
                              </div>
                            </div>
                          ) : (
                            <>
                              <PenTool className="text-primary/50 group-hover:text-primary transition-colors w-6 h-6 animate-pulse-glow" />
                              <span className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">Draw Signature</span>
                              <span className="text-[9px] text-muted-foreground/60 text-center px-4">Click to open drawing pad modal</span>
                            </>
                          )}
                        </div>

                        {/* Upload Box */}
                        <div 
                          onClick={() => sigFileRef.current?.click()}
                          className="group relative h-28 rounded-xl border border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all flex flex-col items-center justify-center cursor-pointer gap-2 overflow-hidden"
                        >
                          {sigUploading ? (
                            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <Upload className="text-primary/50 group-hover:text-primary transition-colors w-6 h-6" />
                              <span className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">Upload Image</span>
                              <span className="text-[9px] text-muted-foreground/60 text-center px-4">PNG/JPG. Background will be removed.</span>
                            </>
                          )}
                        </div>
                      </div>

                      <input 
                        ref={sigFileRef} 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleSignatureUpload} 
                      />

                      {signature && (
                        <button
                          type="button"
                          onClick={() => setSignature("")}
                          className="w-full py-2 border border-border rounded-lg text-xs font-heading font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all"
                        >
                          Remove Signature
                        </button>
                      )}
                    </div>

                    <button type="submit" disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-b from-primary to-[hsl(35,70%,40%)] text-primary-foreground font-heading font-bold text-sm uppercase tracking-wider rounded-lg border border-primary/60 hover:brightness-110 transition-all disabled:opacity-60 mt-2">
                      {loading ? "Saving..." : <><span>Complete Registration</span><Check size={16} /></>}
                    </button>

                    <button type="button" onClick={() => navigate("/dashboard")}
                      className="w-full text-center text-xs text-muted-foreground hover:text-primary transition-colors">
                      Skip for now → Go to Dashboard
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
      {/* ── Signature Drawing Modal ── */}
      <AnimatePresence>
        {isDrawingModalOpen && (
          <motion.div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setTempSignature(null);
              setIsDrawingModalOpen(false);
            }}
          >
            <motion.div
              className="relative flex flex-col gap-4 max-w-lg w-full bg-zinc-950 border border-primary/20 rounded-2xl p-6 shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.0, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => {
                  setTempSignature(null);
                  setIsDrawingModalOpen(false);
                }}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-all"
              >
                <X size={16} />
              </button>

              <div className="space-y-1.5 pb-2">
                <h3 className="font-heading text-lg font-bold text-primary uppercase tracking-widest text-glow-gold">Draw Signature</h3>
                <p className="text-xs text-muted-foreground">Draw using your mouse, trackpad, or touch screen. Click Save Signature once finished.</p>
              </div>

              <div className="w-full">
                <SignaturePad
                  onSave={(base64) => {
                    setSignature(base64);
                    setTempSignature(null);
                    setIsDrawingModalOpen(false);
                  }}
                  onChange={(base64) => {
                    setTempSignature(base64);
                  }}
                  onCancel={() => {
                    setTempSignature(null);
                    setIsDrawingModalOpen(false);
                  }}
                  height={200}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Register;
