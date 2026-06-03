import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { User, Shield, QrCode, BarChart3, Camera, LogOut, Copy, Check, Download } from "lucide-react";
import { getApiUrl } from "@/lib/utils";
import QRCodeComponent from "react-qr-code";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [showBarcode, setShowBarcode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const barcodeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("sws_token");
    if (!token) { navigate("/login"); return; }
    fetch(getApiUrl("/api/auth/me"), { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(data => { if (data.user) setUser(data.user); else navigate("/login"); })
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (showBarcode && user?.accountId && barcodeRef.current) {
      import("jsbarcode").then(({ default: JsBarcode }) => {
        JsBarcode(barcodeRef.current, user.accountId, {
          format: "CODE128", width: 2, height: 60, displayValue: true,
          fontOptions: "bold", fontSize: 14, margin: 10,
          background: "transparent", lineColor: "#f5c542",
        });
      });
    }
  }, [showBarcode, user]);

  const handleLogout = () => { localStorage.removeItem("sws_token"); localStorage.removeItem("sws_user"); navigate("/"); };

  const copyId = () => { navigator.clipboard.writeText(user.accountId); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploadingAvatar(true);
    const fd = new FormData(); fd.append("avatar", file);
    const token = localStorage.getItem("sws_token");
    try {
      const res = await fetch(getApiUrl("/api/auth/upload-avatar"), { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
      const data = await res.json();
      if (data.profileImage) setUser((u: any) => ({ ...u, profileImage: data.profileImage }));
    } catch { } finally { setUploadingAvatar(false); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-24 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

          {/* Profile Card */}
          <div className="scroll-panel rounded-xl ornate-border p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-primary/40 bg-primary/10">
                  {user.profileImage
                    ? <img src={user.profileImage} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"><User size={40} className="text-primary/50" /></div>
                  }
                </div>
                <button onClick={() => fileRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center border-2 border-background hover:brightness-110 transition-all"
                  disabled={uploadingAvatar}>
                  {uploadingAvatar ? <div className="w-4 h-4 border border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    : <Camera size={14} className="text-primary-foreground" />}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="font-heading text-2xl font-bold text-foreground">
                  {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username}
                </h1>
                <p className="text-sm text-muted-foreground">@{user.username}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
                {user.chapter && <p className="text-xs text-accent mt-1 font-heading">{user.chapter}</p>}

                {/* Account ID */}
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30">
                  <Shield size={12} className="text-primary" />
                  <span className="font-mono text-xs font-bold text-primary">{user.accountId}</span>
                  <button onClick={copyId} className="ml-1 text-muted-foreground hover:text-primary transition-colors">
                    {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                  </button>
                </div>

                {/* Address */}
                {user.address?.country && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {user.address.flag} {user.address.city && `${user.address.city}, `}
                    {user.address.province && `${user.address.province}, `}{user.address.country}
                  </p>
                )}
              </div>

              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">
                <LogOut size={14} /> Logout
              </button>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* QR Code */}
            <div className="scroll-panel rounded-xl ornate-border p-5 text-center">
              <QrCode size={24} className="text-primary mx-auto mb-2" />
              <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-primary mb-1">My QR Code</h3>
              <p className="text-[11px] text-muted-foreground mb-3">Your unique member QR</p>
              <button onClick={() => setShowQR(!showQR)}
                className="w-full py-2 text-xs font-heading font-bold uppercase bg-gradient-to-b from-primary to-[hsl(35,70%,40%)] text-primary-foreground rounded-lg border border-primary/60 hover:brightness-110 transition-all">
                {showQR ? "Hide" : "Show QR"}
              </button>
              {showQR && (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="mt-4 flex justify-center">
                  <div className="bg-white p-3 rounded-lg">
                    <QRCodeComponent value={user.accountId} size={140} level="H" />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Barcode */}
            <div className="scroll-panel rounded-xl ornate-border p-5 text-center">
              <BarChart3 size={24} className="text-primary mx-auto mb-2" />
              <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-primary mb-1">My Barcode</h3>
              <p className="text-[11px] text-muted-foreground mb-3">Generate your barcode</p>
              <button onClick={() => setShowBarcode(!showBarcode)}
                className="w-full py-2 text-xs font-heading font-bold uppercase bg-gradient-to-b from-primary to-[hsl(35,70%,40%)] text-primary-foreground rounded-lg border border-primary/60 hover:brightness-110 transition-all">
                {showBarcode ? "Hide" : "Generate Barcode"}
              </button>
              {showBarcode && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 overflow-x-auto">
                  <svg ref={barcodeRef} className="mx-auto" />
                </motion.div>
              )}
            </div>

            {/* Profile completion */}
            <div className="scroll-panel rounded-xl ornate-border p-5 text-center">
              <User size={24} className="text-primary mx-auto mb-2" />
              <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-primary mb-1">Profile</h3>
              <p className="text-[11px] text-muted-foreground mb-3">
                {user.isProfileComplete ? "Profile complete!" : "Complete your profile"}
              </p>
              {!user.isProfileComplete
                ? <Link to="/register" className="block w-full py-2 text-xs font-heading font-bold uppercase bg-gradient-to-b from-primary to-[hsl(35,70%,40%)] text-primary-foreground rounded-lg border border-primary/60 hover:brightness-110 transition-all">
                    Complete Profile
                  </Link>
                : <div className="flex items-center justify-center gap-1 text-green-400"><Check size={14} /><span className="text-xs font-heading">Complete</span></div>
              }
            </div>
          </div>

          {/* Profile Details */}
          {user.isProfileComplete && (
            <div className="scroll-panel rounded-xl ornate-border p-5">
              <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-primary mb-4">Profile Details</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: "First Name", value: user.firstName },
                  { label: "Last Name", value: user.lastName },
                  { label: "Date of Birth", value: user.dateOfBirth },
                  { label: "City", value: user.address?.city },
                  { label: "Province", value: user.address?.province },
                  { label: "Country", value: user.address?.flag ? `${user.address.flag} ${user.address.country}` : user.address?.country },
                ].map(f => f.value ? (
                  <div key={f.label}>
                    <p className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">{f.label}</p>
                    <p className="text-sm text-foreground mt-0.5">{f.value}</p>
                  </div>
                ) : null)}
              </div>
            </div>
          )}

        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
