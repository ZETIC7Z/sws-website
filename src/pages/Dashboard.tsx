import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { User, Shield, QrCode, BarChart3, Camera, LogOut, Copy, Check, Download, X, ZoomIn, Smartphone, Edit2, PenTool, Upload } from "lucide-react";
import { getApiUrl } from "@/lib/utils";
import QRCodeComponent from "react-qr-code";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SignaturePad from "@/components/SignaturePad";
import QRCode from "qrcode";
import { COUNTRIES } from "./Register";

// ── Modal overlay for QR / Barcode ───────────────────────────────────────────
const MediaModal = ({
  isOpen, onClose, title, children, onDownload,
}: {
  isOpen: boolean; onClose: () => void; title: string;
  children: React.ReactNode; onDownload: () => void;
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

        {/* Card */}
        <motion.div
          className="relative z-10 w-full max-w-sm"
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
          onClick={e => e.stopPropagation()}
        >
          <div
            className="rounded-2xl overflow-hidden border border-primary/40"
            style={{
              background: "linear-gradient(135deg, hsl(30 30% 12%) 0%, hsl(15 14% 9%) 60%, hsl(20 20% 8%) 100%)",
              boxShadow: "0 0 60px rgba(200,146,10,0.25), 0 20px 60px rgba(0,0,0,0.8)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-primary/20">
              <h2 className="font-heading text-sm font-bold text-primary uppercase tracking-widest">{title}</h2>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/20 transition-all"
              >
                <X size={14} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col items-center gap-5">
              {children}

              {/* Download button */}
              <button
                onClick={onDownload}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-b from-primary to-[hsl(35,70%,40%)] text-primary-foreground font-heading font-bold text-xs uppercase tracking-wider rounded-xl border border-primary/60 hover:brightness-110 transition-all"
              >
                <Download size={14} />
                Download as PNG
              </button>
            </div>
          </div>

          {/* Gold top accent */}
          <div className="absolute top-0 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const normalizeSignaturePosition = (pos: any) => {
  const defaultPos = { x: 28, y: 72, width: 44, height: 9 };
  if (!pos) return defaultPos;
  
  let x = typeof pos.x === 'number' ? pos.x : defaultPos.x;
  let y = typeof pos.y === 'number' ? pos.y : defaultPos.y;
  let width = typeof pos.width === 'number' ? pos.width : defaultPos.width;
  let height = typeof pos.height === 'number' ? pos.height : defaultPos.height;

  // Reset to default if value is out of bounds (such as absolute pixels from database default)
  if (x > 100 || y > 100 || width > 100 || height > 100 || x < 0 || y < 0 || width <= 0 || height <= 0) {
    return defaultPos;
  }
  
  return { x, y, width, height };
};

const CardPreview = ({ 
  user, 
  side, 
  onPositionChange,
  onPositionEnd
}: { 
  user: any; 
  side: "front" | "back"; 
  onPositionChange?: (pos: { x: number; y: number; width: number; height: number }) => void;
  onPositionEnd?: (pos: { x: number; y: number; width: number; height: number }) => void;
}) => {
  const displayName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username;
  const pos = normalizeSignaturePosition(user.signaturePosition);

  const cardRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ pointerId: number; startX: number; startY: number; startPosX: number; startPosY: number } | null>(null);
  const resizeStartRef = useRef<{ pointerId: number; startX: number; startY: number; startWidth: number; startHeight: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!onPositionChange) return;
    e.stopPropagation();
    
    const cardRect = cardRef.current?.getBoundingClientRect();
    if (!cardRect) return;

    dragStartRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      startPosX: pos.x,
      startPosY: pos.y,
    };
    
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragStartRef.current && dragStartRef.current.pointerId === e.pointerId && onPositionChange) {
      const cardRect = cardRef.current?.getBoundingClientRect();
      if (!cardRect) return;

      const deltaX = ((e.clientX - dragStartRef.current.startX) / cardRect.width) * 100;
      const deltaY = ((e.clientY - dragStartRef.current.startY) / cardRect.height) * 100;

      // Constrain position between 0 and 100%
      const newX = Math.max(0, Math.min(100 - pos.width, dragStartRef.current.startPosX + deltaX));
      const newY = Math.max(0, Math.min(100 - pos.height, dragStartRef.current.startPosY + deltaY));

      onPositionChange({
        ...pos,
        x: parseFloat(newX.toFixed(2)),
        y: parseFloat(newY.toFixed(2)),
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragStartRef.current && dragStartRef.current.pointerId === e.pointerId) {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      dragStartRef.current = null;
      if (onPositionEnd) {
        onPositionEnd(pos);
      }
    }
  };

  // Resize handler
  const handleResizeDown = (e: React.PointerEvent) => {
    if (!onPositionChange) return;
    e.stopPropagation();
    
    const cardRect = cardRef.current?.getBoundingClientRect();
    if (!cardRect) return;

    resizeStartRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: pos.width,
      startHeight: pos.height,
    };
    
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleResizeMove = (e: React.PointerEvent) => {
    if (resizeStartRef.current && resizeStartRef.current.pointerId === e.pointerId && onPositionChange) {
      const cardRect = cardRef.current?.getBoundingClientRect();
      if (!cardRect) return;

      const deltaX = ((e.clientX - resizeStartRef.current.startX) / cardRect.width) * 100;
      const deltaY = ((e.clientY - resizeStartRef.current.startY) / cardRect.height) * 100;

      // Constrain width and height between 5% and 80%
      const newWidth = Math.max(5, Math.min(100 - pos.x, resizeStartRef.current.startWidth + deltaX));
      const newHeight = Math.max(5, Math.min(100 - pos.y, resizeStartRef.current.startHeight + deltaY));

      onPositionChange({
        ...pos,
        width: parseFloat(newWidth.toFixed(2)),
        height: parseFloat(newHeight.toFixed(2)),
      });
    }
  };

  const handleResizeUp = (e: React.PointerEvent) => {
    if (resizeStartRef.current && resizeStartRef.current.pointerId === e.pointerId) {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      resizeStartRef.current = null;
      if (onPositionEnd) {
        onPositionEnd(pos);
      }
    }
  };

  if (side === "front") {
    return (
      <div 
        className="relative rounded-2xl overflow-hidden shadow-2xl border border-primary/20 select-none mx-auto"
        style={{
          width: "220px",
          height: "374px",
          backgroundImage: "url('/id-front-blank.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Profile Picture overlay */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 overflow-hidden rounded-full border-2 border-primary bg-primary/10"
          style={{
            top: "116px",
            width: "112px",
            height: "112px",
          }}
        >
          {user.profileImage ? (
            <img src={user.profileImage} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="text-primary/40 w-10 h-10" />
            </div>
          )}
        </div>

        {/* Name overlay */}
        <div 
          className="absolute left-0 right-0 text-center px-2 font-heading font-bold uppercase text-white truncate"
          style={{
            top: "242px",
            fontSize: "12px",
            letterSpacing: "0.05em",
          }}
        >
          {displayName}
        </div>

        {/* Role overlay */}
        <div 
          className="absolute left-0 right-0 text-center font-heading font-bold text-primary uppercase"
          style={{
            top: "258px",
            fontSize: "7.5px",
            letterSpacing: "0.1em",
          }}
        >
          {user.role || "MEMBER"}
        </div>

        {/* QR Code overlay */}
        <div 
          className="absolute bg-white p-0.5 rounded"
          style={{
            bottom: "37px",
            left: "12px",
            width: "56px",
            height: "56px",
          }}
        >
          <QRCodeComponent
            value={`https://sws-skeptrons.vercel.app/member-verifier?q=${user.accountId}`}
            size={52}
            level="H"
            style={{ width: "100%", height: "100%" }}
          />
        </div>

        {/* ID Number overlay */}
        <div 
          className="absolute text-right text-white"
          style={{
            bottom: "34px",
            right: "12px",
          }}
        >
          <div className="text-[6px] font-sans font-bold tracking-wider opacity-90">ID NUMBER:</div>
          <div className="text-[8.5px] font-mono font-bold tracking-wide mt-0.5">{user.accountId}</div>
        </div>
      </div>
    );
  } else {
    return (
      <div 
        ref={cardRef}
        className="relative rounded-2xl overflow-hidden shadow-2xl border border-primary/20 select-none mx-auto"
        style={{
          width: "220px",
          height: "374px",
          backgroundImage: "url('/id-back-blank.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Signature overlay */}
        {user.signature ? (
          <div 
            className={`absolute flex items-center justify-center ${
              onPositionChange 
                ? "cursor-move border border-dashed border-primary/50 bg-white/5 hover:bg-white/10" 
                : "pointer-events-none select-none"
            }`}
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              width: `${pos.width}%`,
              height: `${pos.height}%`,
              touchAction: onPositionChange ? "none" : "auto",
            }}
            onPointerDown={onPositionChange ? handlePointerDown : undefined}
            onPointerMove={onPositionChange ? handlePointerMove : undefined}
            onPointerUp={onPositionChange ? handlePointerUp : undefined}
            onClick={onPositionChange ? (e) => e.stopPropagation() : undefined}
          >
            <img 
              src={user.signature} 
              alt="Signature" 
              className="max-w-full max-h-full object-contain pointer-events-none select-none" 
              style={{ filter: "brightness(0) invert(1)" }}
            />
            
            {/* Resize handle in bottom-right corner */}
            {onPositionChange && (
              <div 
                className="absolute right-[-4px] bottom-[-4px] w-3.5 h-3.5 bg-primary border-2 border-white rounded-full cursor-se-resize z-20 shadow-md shadow-black/45"
                style={{ touchAction: "none" }}
                onPointerDown={handleResizeDown}
                onPointerMove={handleResizeMove}
                onPointerUp={handleResizeUp}
              />
            )}
          </div>
        ) : (
          <div 
            className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center border border-dashed border-white/20 rounded bg-black/45"
            style={{
              bottom: "71px",
              width: "97px",
              height: "34px",
            }}
          >
            <span className="text-[6px] text-white/40 uppercase tracking-widest text-center">No Signature</span>
          </div>
        )}
      </div>
    );
  }
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const qrRef = useRef<HTMLDivElement>(null);
  const barcodeRef = useRef<SVGSVGElement>(null);

  // Signature States & Refs
  const [dashboardSigType, setDashboardSigType] = useState<"draw" | "upload">("draw");
  const [dashboardSigUploading, setDashboardSigUploading] = useState(false);
  const dashboardSigFileRef = useRef<HTMLInputElement>(null);
  const [isSigModalOpen, setIsSigModalOpen] = useState(false);
  const [sigModalType, setSigModalType] = useState<"draw" | "upload">("draw");
  const [tempSignature, setTempSignature] = useState<string | null>(null);
  const [originalSignature, setOriginalSignature] = useState<string>("");
  const [originalPosition, setOriginalPosition] = useState<any>(null);

  // Profile Edit States
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editDateOfBirth, setEditDateOfBirth] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editProvince, setEditProvince] = useState("");
  const [editCountrySearch, setEditCountrySearch] = useState("");
  const [editSelectedCountry, setEditSelectedCountry] = useState<any>(null);
  const [showEditCountryDropdown, setShowEditCountryDropdown] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const startEditingProfile = () => {
    setEditFirstName(user.firstName || "");
    setEditLastName(user.lastName || "");
    setEditDateOfBirth(user.dateOfBirth || "");
    setEditCity(user.address?.city || "");
    setEditProvince(user.address?.province || "");
    const currentCountryName = user.address?.country || "";
    const countryObj = COUNTRIES.find(c => c.name.toLowerCase() === currentCountryName.toLowerCase());
    setEditSelectedCountry(countryObj || null);
    setEditCountrySearch(countryObj ? "" : currentCountryName);
    setIsEditingProfile(true);
  };

  const saveProfileDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFirstName.trim() || !editLastName.trim()) return;

    setIsSavingProfile(true);
    const token = localStorage.getItem("sws_token");
    try {
      const res = await fetch(getApiUrl("/api/auth/profile"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: editFirstName.trim(),
          lastName: editLastName.trim(),
          dateOfBirth: editDateOfBirth,
          address: {
            city: editCity.trim(),
            province: editProvince.trim(),
            country: editSelectedCountry?.name || editCountrySearch.trim(),
            countryCode: editSelectedCountry?.code || "",
            flag: editSelectedCountry?.flag || "",
          },
        }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        localStorage.setItem("sws_user", JSON.stringify(data.user));
        setIsEditingProfile(false);
      }
    } catch (err) {
      console.error("Failed to update profile details:", err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSignaturePositionChange = (newPos: { x: number; y: number; width: number; height: number }) => {
    setUser(prev => ({
      ...prev,
      signaturePosition: newPos
    }));
  };

  const saveSignaturePosition = async (newPos: { x: number; y: number; width: number; height: number }) => {
    const token = localStorage.getItem("sws_token");
    try {
      const res = await fetch(getApiUrl("/api/auth/profile"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: user.firstName,
          lastName: user.lastName,
          dateOfBirth: user.dateOfBirth,
          address: user.address,
          signaturePosition: normalizeSignaturePosition(newPos),
        }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        localStorage.setItem("sws_user", JSON.stringify(data.user));
      }
    } catch (err) {
      console.error("Failed to save signature position:", err);
    }
  };

  const updateDashboardSignature = async (sigBase64: string) => {
    const token = localStorage.getItem("sws_token");
    try {
      const res = await fetch(getApiUrl("/api/auth/profile"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: user.firstName,
          lastName: user.lastName,
          dateOfBirth: user.dateOfBirth,
          address: user.address,
          signature: sigBase64,
        }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        localStorage.setItem("sws_user", JSON.stringify(data.user));
      }
    } catch (err) {
      console.error("Failed to update signature", err);
    }
  };

  const handleDashboardSignatureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDashboardSigUploading(true);
    try {
      const { removeSignatureBackground } = await import("@/lib/signatureUtils");
      const cleanSig = await removeSignatureBackground(file);
      
      setOriginalSignature(user.signature || "");
      setOriginalPosition(normalizeSignaturePosition(user.signaturePosition));
      
      setTempSignature(cleanSig);
      setSigModalType("upload");
      setIsSigModalOpen(true);
    } catch (err) {
      console.error("Error processing uploaded signature:", err);
    } finally {
      setDashboardSigUploading(false);
      e.target.value = "";
    }
  };

  const cancelSignatureModal = () => {
    setUser(prev => ({
      ...prev,
      signature: originalSignature,
      signaturePosition: originalPosition
    }));
    setTempSignature(null);
    setIsSigModalOpen(false);
  };

  const saveSignatureAndPosition = async (finalSig: string | null, finalPos: { x: number; y: number; width: number; height: number }) => {
    const token = localStorage.getItem("sws_token");
    try {
      const res = await fetch(getApiUrl("/api/auth/profile"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: user.firstName,
          lastName: user.lastName,
          dateOfBirth: user.dateOfBirth,
          address: user.address,
          signature: finalSig !== null ? finalSig : user.signature,
          signaturePosition: normalizeSignaturePosition(finalPos),
        }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        localStorage.setItem("sws_user", JSON.stringify(data.user));
        setTempSignature(null);
        setIsSigModalOpen(false);
      }
    } catch (err) {
      console.error("Failed to save signature and position:", err);
    }
  };

  const downloadID = useCallback(async (side: "front" | "back") => {
    if (!user) return;
    const canvas = document.createElement("canvas");
    canvas.width = 591;
    canvas.height = 1004;
    const ctx = canvas.getContext("2d")!;

    // 1. Draw background image
    const bgImg = new Image();
    bgImg.crossOrigin = "anonymous";
    await new Promise((resolve, reject) => {
      bgImg.onload = resolve;
      bgImg.onerror = reject;
      bgImg.src = side === "front" ? "/id-front-blank.png" : "/id-back-blank.png";
    });
    ctx.drawImage(bgImg, 0, 0, 591, 1004);

    if (side === "front") {
      // 2. Draw user photo
      if (user.profileImage) {
        const profileImg = new Image();
        profileImg.crossOrigin = "anonymous";
        await new Promise((resolve) => {
          profileImg.onload = resolve;
          profileImg.onerror = resolve;
          profileImg.src = user.profileImage;
        });

        if (profileImg.complete && profileImg.naturalWidth > 0) {
          ctx.save();
          ctx.beginPath();
          // Center Y = 470px, Radius = 150px (diameter = 300px)
          ctx.arc(295.5, 470, 150, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(profileImg, 295.5 - 150, 470 - 150, 300, 300);
          ctx.restore();

          // Draw primary gold border
          ctx.strokeStyle = "#c8920a";
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.arc(295.5, 470, 150, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // 3. Draw Full Name
      const displayName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username;
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 34px Cinzel, serif";
      ctx.textAlign = "center";
      ctx.fillText(displayName.toUpperCase(), 295.5, 650);

      // 4. Draw Role
      ctx.fillStyle = "#c8920a";
      ctx.font = "bold 20px Cinzel, serif";
      ctx.textAlign = "center";
      ctx.fillText((user.role || "MEMBER").toUpperCase(), 295.5, 690);

      // 5. Draw QR Code
      try {
        const qrDataUrl = await QRCode.toDataURL(
          `https://sws-skeptrons.vercel.app/member-verifier?q=${user.accountId}`,
          { margin: 1, width: 150 }
        );
        const qrImg = new Image();
        await new Promise((resolve) => {
          qrImg.onload = resolve;
          qrImg.src = qrDataUrl;
        });
        
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(32, 754, 150, 150, 10);
        } else {
          ctx.rect(32, 754, 150, 150);
        }
        ctx.fill();
        ctx.drawImage(qrImg, 32 + 5, 754 + 5, 140, 140);
      } catch (e) {
        console.error("Failed to draw QR code:", e);
      }

      // 6. Draw ID Number
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "right";
      ctx.font = "bold 16px Inter, sans-serif";
      ctx.fillText("ID NUMBER:", 559, 900);
      ctx.font = "bold 22px 'JetBrains Mono', monospace";
      ctx.fillText(user.accountId, 559, 930);

    } else {
      // Back Side - Draw User Signature
      if (user.signature) {
        const sigImg = new Image();
        await new Promise((resolve) => {
          sigImg.onload = resolve;
          sigImg.onerror = resolve;
          sigImg.src = user.signature;
        });

        if (sigImg.complete && sigImg.naturalWidth > 0) {
          const pos = normalizeSignaturePosition(user.signaturePosition);
          const targetX = (pos.x / 100) * 591;
          const targetY = (pos.y / 100) * 1004;
          const targetW = (pos.width / 100) * 591;
          const targetH = (pos.height / 100) * 1004;
          ctx.filter = "brightness(0) invert(1)";
          ctx.drawImage(sigImg, targetX, targetY, targetW, targetH);
          ctx.filter = "none";
        }
      }
    }

    // Trigger download
    const link = document.createElement("a");
    link.download = `SWS-ID-${side === "front" ? "Front" : "Back"}-${user.accountId}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [user]);

  const printID = useCallback(() => {
    if (!user) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const pos = normalizeSignaturePosition(user.signaturePosition);
    const displayName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username;
    const qrUrl = `https://sws-skeptrons.vercel.app/member-verifier?q=${user.accountId}`;

    printWindow.document.write(`
      <html>
        <head>
          <title>Print SWS ID Card - ${user.accountId}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap');
            @page {
              size: auto;
              margin: 0;
            }
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              background-color: #f3f4f6;
              box-sizing: border-box;
            }
            .print-container {
              display: flex;
              gap: 20px;
              flex-wrap: wrap;
              justify-content: center;
              align-items: center;
            }
            /* Standard ID Card Size (CR80: 85.6mm x 54mm or 3.375in x 2.125in) */
            .id-card {
              width: 54mm;
              height: 85.6mm;
              border: 0.1mm solid rgba(0, 0, 0, 0.1);
              border-radius: 4mm;
              overflow: hidden;
              position: relative;
              box-shadow: 0 4px 8px rgba(0,0,0,0.15);
              page-break-inside: avoid;
              background-color: #000000;
            }
            .id-card-bg {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              z-index: 1;
              object-fit: cover;
              pointer-events: none;
            }
            
            /* Front overlays */
            .profile-photo {
              position: absolute;
              left: 50%;
              transform: translateX(-50%);
              top: 26.6mm;
              width: 25.6mm;
              height: 25.6mm;
              border-radius: 50%;
              border: 0.6mm solid #c8920a;
              overflow: hidden;
              z-index: 10;
            }
            .profile-photo img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            .member-name {
              position: absolute;
              left: 0;
              right: 0;
              text-align: center;
              top: 55.4mm;
              font-family: 'Cinzel', serif;
              font-weight: bold;
              font-size: 8pt;
              color: #ffffff;
              text-transform: uppercase;
              padding: 0 2mm;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              z-index: 10;
              letter-spacing: 0.03em;
            }
            .member-role {
              position: absolute;
              left: 0;
              right: 0;
              text-align: center;
              top: 59.2mm;
              font-family: 'Cinzel', serif;
              font-weight: bold;
              font-size: 5pt;
              color: #c8920a;
              text-transform: uppercase;
              z-index: 10;
              letter-spacing: 0.05em;
            }
            .qr-code-box {
              position: absolute;
              bottom: 8.5mm;
              left: 2.7mm;
              width: 12.8mm;
              height: 12.8mm;
              background-color: #ffffff;
              border-radius: 0.8mm;
              padding: 0.2mm;
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 10;
            }
            .qr-code-box img, .qr-code-box canvas {
              width: 100% !important;
              height: 100% !important;
              display: block;
            }
            .id-num-box {
              position: absolute;
              bottom: 7.7mm;
              right: 2.7mm;
              text-align: right;
              color: #ffffff;
              z-index: 10;
            }
            .id-num-label {
              font-size: 4pt;
              font-weight: bold;
              opacity: 0.9;
            }
            .id-num-value {
              font-size: 5.5pt;
              font-family: monospace;
              font-weight: bold;
              margin-top: 0.1mm;
            }

            /* Back overlays */
            .sig-box {
              position: absolute;
              left: ${pos.x}%;
              top: ${pos.y}%;
              width: ${pos.width}%;
              height: ${pos.height}%;
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 10;
            }
            .sig-box img {
              width: 100%;
              height: 100%;
              object-fit: contain;
              filter: brightness(0) invert(1);
            }

            @media print {
              body {
                background-color: #ffffff;
                padding: 0;
                margin: 0;
              }
              .no-print {
                display: none;
              }
              .id-card {
                box-shadow: none;
                border: 0.1mm solid #000000;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .print-container {
                gap: 10mm;
              }
            }
          </style>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
        </head>
        <body>
          <div class="print-container">
            <div class="id-card">
              <img class="id-card-bg" src="/id-front-blank.png" alt="Front BG" />
              <div class="profile-photo">
                <img src="${user.profileImage || ''}" alt="Photo" />
              </div>
              <div class="member-name">${displayName}</div>
              <div class="member-role">${user.role || 'MEMBER'}</div>
              <div class="qr-code-box" id="print-qr"></div>
              <div class="id-num-box">
                <div class="id-num-label">ID NUMBER:</div>
                <div class="id-num-value">${user.accountId}</div>
              </div>
            </div>

            <div class="id-card">
              <img class="id-card-bg" src="/id-back-blank.png" alt="Back BG" />
              <div class="sig-box">
                ${user.signature ? `<img src="${user.signature}" alt="Signature" />` : ''}
              </div>
            </div>
          </div>

          <script>
            window.addEventListener('load', () => {
              new QRCode(document.getElementById("print-qr"), {
                text: "${qrUrl}",
                width: 120,
                height: 120,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
              });
              
              // Direct auto-trigger for printer once loaded
              setTimeout(() => {
                window.print();
              }, 800);
            });
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }, [user]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsZoomModalOpen(false);
        setIsSigModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("sws_token");
    if (!token) { navigate("/login"); return; }
    fetch(getApiUrl("/api/auth/me"), { headers: { Authorization: `Bearer ${token}` } })
      .then(r => {
        if (!r.ok) {
          localStorage.removeItem("sws_token");
          localStorage.removeItem("sws_user");
          navigate("/login");
          return;
        }
        return r.json();
      })
      .then(data => {
        if (data && data.user) {
          setUser(data.user);
          localStorage.setItem("sws_user", JSON.stringify(data.user));
          // Redirect admin to admin panel
          if (data.user.role === "admin") {
            navigate("/admin");
          }
        }
      })
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, []);

  // Render barcode whenever modal opens
  useEffect(() => {
    if (showBarcodeModal && user?.accountId && barcodeRef.current) {
      import("jsbarcode").then(({ default: JsBarcode }) => {
        JsBarcode(barcodeRef.current, user.accountId, {
          format: "CODE128", width: 2.5, height: 80, displayValue: true,
          fontOptions: "bold", fontSize: 14, margin: 12,
          background: "transparent", lineColor: "#ffffff",
        });
      });
    }
  }, [showBarcodeModal, user]);

  const handleLogout = () => {
    localStorage.removeItem("sws_token");
    localStorage.removeItem("sws_user");
    navigate("/");
  };

  const copyId = () => {
    navigator.clipboard.writeText(user.accountId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploadingAvatar(true);
    const fd = new FormData(); fd.append("avatar", file);
    const token = localStorage.getItem("sws_token");
    try {
      const res = await fetch(getApiUrl("/api/auth/upload-avatar"), {
        method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd,
      });
      const data = await res.json();
      if (data.profileImage) {
        setUser((u: any) => ({ ...u, profileImage: data.profileImage }));
        // Update localStorage too so Navbar/Index see the new avatar
        const stored = localStorage.getItem("sws_user");
        if (stored) {
          const parsed = JSON.parse(stored);
          localStorage.setItem("sws_user", JSON.stringify({ ...parsed, profileImage: data.profileImage }));
        }
      }
    } catch { } finally { setUploadingAvatar(false); }
  };

  // ── Download helpers ────────────────────────────────────────────────────────
  const downloadQR = useCallback(() => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;
    const canvas = document.createElement("canvas");
    const size = 320;
    canvas.width = size; canvas.height = size + 60;
    const ctx = canvas.getContext("2d")!;

    // Background
    ctx.fillStyle = "#0d0a08";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // QR SVG → image
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.onload = () => {
      // White box behind QR
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(10, 10, size - 20, size - 20);
      ctx.drawImage(img, 10, 10, size - 20, size - 20);

      // Label
      ctx.fillStyle = "#c8920a";
      ctx.font = "bold 13px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`SWS Member ID: ${user.accountId}`, size / 2, size + 40);

      const link = document.createElement("a");
      link.download = `SWS-QR-${user.accountId}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  }, [user]);

  const downloadBarcode = useCallback(() => {
    if (!barcodeRef.current) return;
    const canvas = document.createElement("canvas");
    const svgEl = barcodeRef.current;
    const w = Number(svgEl.getAttribute("width")) || svgEl.getBBox?.()?.width || 320;
    const h = Number(svgEl.getAttribute("height")) || svgEl.getBBox?.()?.height || 120;
    canvas.width = w + 40; canvas.height = h + 60;
    const ctx = canvas.getContext("2d")!;

    ctx.fillStyle = "#0d0a08";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const svgData = new XMLSerializer().serializeToString(svgEl);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 20, 10, w, h);

      ctx.fillStyle = "#c8920a";
      ctx.font = "bold 12px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`SWS Skeptrons — ${user.accountId}`, canvas.width / 2, h + 42);

      const link = document.createElement("a");
      link.download = `SWS-Barcode-${user.accountId}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  }, [user]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
  if (!user) return null;

  const displayUser = {
    ...user,
    signature: tempSignature !== null ? tempSignature : (user.signature || "")
  };

  const displayName = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}` : user.username;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 w-full max-w-[96%] mx-auto px-4 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Profile Card, Actions, Info, Signature Management */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* ── Profile Card ── */}
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
                      {uploadingAvatar
                        ? <div className="w-4 h-4 border border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        : <Camera size={14} className="text-primary-foreground" />}
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-center sm:text-left">
                    <h1 className="font-heading text-2xl font-bold text-foreground">{displayName}</h1>
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

                  <button onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </div>

              {/* ── Action Cards ── */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* QR Code */}
                <div className="scroll-panel rounded-xl ornate-border p-5 text-center">
                  <QrCode size={24} className="text-primary mx-auto mb-2" />
                  <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-primary mb-1">My QR Code</h3>
                  <p className="text-[11px] text-muted-foreground mb-3">Your unique member QR</p>
                  <button
                    onClick={() => setShowQRModal(true)}
                    className="w-full py-2 text-xs font-heading font-bold uppercase bg-gradient-to-b from-primary to-[hsl(35,70%,40%)] text-primary-foreground rounded-lg border border-primary/60 hover:brightness-110 transition-all flex items-center justify-center gap-2"
                  >
                    <ZoomIn size={13} /> Show QR
                  </button>
                </div>

                {/* Barcode */}
                <div className="scroll-panel rounded-xl ornate-border p-5 text-center">
                  <BarChart3 size={24} className="text-primary mx-auto mb-2" />
                  <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-primary mb-1">My Barcode</h3>
                  <p className="text-[11px] text-muted-foreground mb-3">Generate your barcode</p>
                  <button
                    onClick={() => setShowBarcodeModal(true)}
                    className="w-full py-2 text-xs font-heading font-bold uppercase bg-gradient-to-b from-primary to-[hsl(35,70%,40%)] text-primary-foreground rounded-lg border border-primary/60 hover:brightness-110 transition-all flex items-center justify-center gap-2"
                  >
                    <ZoomIn size={13} /> Show Barcode
                  </button>
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

              {/* ── Profile Details ── */}
              {user.isProfileComplete && (
                <div className="scroll-panel rounded-xl ornate-border p-5 relative">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-primary/10">
                    <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-primary">Profile Details</h2>
                    {!isEditingProfile ? (
                      <button
                        onClick={startEditingProfile}
                        className="p-1.5 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all flex items-center gap-1.5 text-[10px] font-heading uppercase tracking-wider font-bold"
                        title="Edit Details"
                      >
                        <Edit2 size={11} /> Edit Details
                      </button>
                    ) : null}
                  </div>

                  {isEditingProfile ? (
                    <form onSubmit={saveProfileDetails} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">First Name</label>
                          <input
                            type="text"
                            value={editFirstName}
                            onChange={(e) => setEditFirstName(e.target.value)}
                            required
                            className="w-full px-3 py-2 rounded-lg bg-black/45 border border-primary/20 text-sm text-foreground focus:outline-none focus:border-primary/50"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">Last Name</label>
                          <input
                            type="text"
                            value={editLastName}
                            onChange={(e) => setEditLastName(e.target.value)}
                            required
                            className="w-full px-3 py-2 rounded-lg bg-black/45 border border-primary/20 text-sm text-foreground focus:outline-none focus:border-primary/50"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">Date of Birth</label>
                          <input
                            type="date"
                            value={editDateOfBirth}
                            onChange={(e) => setEditDateOfBirth(e.target.value)}
                            required
                            className="w-full px-3 py-2 rounded-lg bg-black/45 border border-primary/20 text-sm text-foreground focus:outline-none focus:border-primary/50 animate-input"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">City</label>
                          <input
                            type="text"
                            value={editCity}
                            onChange={(e) => setEditCity(e.target.value)}
                            required
                            className="w-full px-3 py-2 rounded-lg bg-black/45 border border-primary/20 text-sm text-foreground focus:outline-none focus:border-primary/50"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">Province</label>
                          <input
                            type="text"
                            value={editProvince}
                            onChange={(e) => setEditProvince(e.target.value)}
                            required
                            className="w-full px-3 py-2 rounded-lg bg-black/45 border border-primary/20 text-sm text-foreground focus:outline-none focus:border-primary/50"
                          />
                        </div>
                        <div className="space-y-1.5 relative">
                          <label className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">Country</label>
                          <input
                            type="text"
                            value={editSelectedCountry ? `${editSelectedCountry.flag} ${editSelectedCountry.name}` : editCountrySearch}
                            onChange={(e) => {
                              setEditCountrySearch(e.target.value);
                              setEditSelectedCountry(null);
                              setShowEditCountryDropdown(true);
                            }}
                            onFocus={() => setShowEditCountryDropdown(true)}
                            placeholder="Type to search country..."
                            className="w-full px-3 py-2 rounded-lg bg-black/45 border border-primary/20 text-sm text-foreground focus:outline-none focus:border-primary/50"
                          />
                          {showEditCountryDropdown && (
                            <div className="absolute left-0 right-0 z-50 mt-1 max-h-40 overflow-y-auto rounded-lg bg-zinc-950 border border-primary/20 shadow-xl scrollbar-thin">
                              {COUNTRIES.filter(c => editCountrySearch === "" || c.name.toLowerCase().startsWith(editCountrySearch.toLowerCase())).map(c => (
                                <button
                                  key={c.code}
                                  type="button"
                                  onClick={() => {
                                    setEditSelectedCountry(c);
                                    setEditCountrySearch("");
                                    setShowEditCountryDropdown(false);
                                  }}
                                  className="w-full px-3 py-2 text-left text-xs hover:bg-primary/20 hover:text-primary transition-colors flex items-center gap-2"
                                >
                                  <span>{c.flag}</span>
                                  <span>{c.name}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsEditingProfile(false)}
                          className="px-4 py-2 border border-border rounded-lg text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSavingProfile}
                          className="px-4 py-2 bg-gradient-to-b from-primary to-[hsl(35,70%,40%)] text-primary-foreground font-heading font-bold text-xs uppercase tracking-wider rounded-lg border border-primary/60 hover:brightness-110 disabled:opacity-50 transition-all"
                        >
                          {isSavingProfile ? "Saving..." : "Save Details"}
                        </button>
                      </div>
                    </form>
                  ) : (
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
                  )}
                </div>
              )}

              {/* ── Signature Management ── */}
              {user.isProfileComplete && (
                <div className="scroll-panel rounded-xl ornate-border p-6 space-y-4">
                  <h3 className="font-heading text-sm font-bold text-primary uppercase tracking-wider">Signature Management</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Draw Box */}
                    <div 
                      onClick={() => {
                        setOriginalSignature(user.signature || "");
                        setOriginalPosition(normalizeSignaturePosition(user.signaturePosition));
                        setTempSignature(user.signature || null);
                        setSigModalType("draw");
                        setIsSigModalOpen(true);
                      }}
                      className="group relative h-28 rounded-xl border border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all flex flex-col items-center justify-center cursor-pointer gap-2 overflow-hidden"
                    >
                      {user.signature ? (
                        <div 
                          className="absolute inset-0 flex items-center justify-center p-4"
                          style={{
                            background: "radial-gradient(circle at center, #3a0d0d 0%, #1c0606 100%)"
                          }}
                        >
                          <img src={user.signature} alt="User Signature" className="h-14 object-contain z-10 transition-transform group-hover:scale-105" />
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
                      onClick={() => dashboardSigFileRef.current?.click()}
                      className="group relative h-28 rounded-xl border border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all flex flex-col items-center justify-center cursor-pointer gap-2 overflow-hidden"
                    >
                      {dashboardSigUploading ? (
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
                    ref={dashboardSigFileRef} 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleDashboardSignatureUpload} 
                  />

                  {user.signature && (
                    <button
                      onClick={() => updateDashboardSignature("")}
                      className="w-full py-2 border border-border rounded-lg text-xs font-heading font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all"
                    >
                      Remove Signature
                    </button>
                  )}

                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 mt-4">
                    <h3 className="font-heading text-xs font-bold text-primary uppercase tracking-wider mb-2">Print & Display Guidelines</h3>
                    <ul className="text-[11px] text-muted-foreground space-y-2 list-disc list-inside font-sans">
                      <li>Use high-quality photo paper or PVC card sheets.</li>
                      <li>Standard physical size is <strong className="text-foreground">85.6mm x 54mm</strong> (CR80 standard).</li>
                      <li>Print at 100% scale (do not select "Fit to page" or "Shrink to fit").</li>
                      <li>Scan the QR code to test the live verifier page.</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: ID Cards Preview Box */}
            {user.isProfileComplete && (
              <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
                <div className="scroll-panel rounded-xl ornate-border p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-primary/20 pb-4 w-full">
                    <div>
                      <h2 className="font-heading text-lg font-bold text-primary uppercase tracking-widest text-glow-gold">Official ID Box</h2>
                      <p className="text-xs text-muted-foreground mt-1">Click cards to zoom fullscreen.</p>
                    </div>
                    <button
                      onClick={() => setIsZoomModalOpen(true)}
                      className="px-4 py-1.5 border border-[#38bdf8] text-[#38bdf8] bg-[#38bdf8]/10 hover:bg-[#38bdf8]/20 transition-all font-heading font-bold text-xs uppercase tracking-wider rounded-lg shadow-[0_0_10px_rgba(56,189,248,0.15)] hover:shadow-[0_0_15px_rgba(56,189,248,0.35)] self-end sm:self-center"
                    >
                      Preview
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center justify-center gap-6">
                    {/* Front Preview */}
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-primary/75">Front View</span>
                      <button 
                        onClick={() => setIsZoomModalOpen(true)} 
                        className="cursor-pointer hover:scale-[1.03] active:scale-95 transition-all duration-200"
                        title="Click to zoom Front ID"
                      >
                        <CardPreview user={displayUser} side="front" />
                      </button>
                    </div>

                    {/* Back Preview */}
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-primary/75">Back View</span>
                      <button 
                        onClick={() => setIsZoomModalOpen(true)} 
                        className="cursor-pointer hover:scale-[1.03] active:scale-95 transition-all duration-200"
                        title="Click to zoom Back ID"
                      >
                        <CardPreview 
                          user={displayUser} 
                          side="back" 
                        />
                      </button>
                    </div>
                  </div>

                  {/* Exporter and Print buttons */}
                  <div className="flex flex-col gap-2 pt-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => downloadID("front")}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-primary/10 border border-primary/40 rounded-lg text-xs font-heading font-bold uppercase tracking-wider text-primary hover:bg-primary/20 transition-all"
                      >
                        <Download size={13} /> Front ID
                      </button>
                      <button
                        onClick={() => downloadID("back")}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-primary/10 border border-primary/40 rounded-lg text-xs font-heading font-bold uppercase tracking-wider text-primary hover:bg-primary/20 transition-all"
                        disabled={!user.signature}
                      >
                        <Download size={13} /> Back ID
                      </button>
                    </div>
                    <button
                      onClick={printID}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-gradient-to-b from-primary to-[hsl(35,70%,40%)] text-primary-foreground font-heading font-bold text-xs uppercase tracking-wider rounded-lg border border-primary/60 hover:brightness-110 transition-all shadow-md shadow-primary/10"
                    >
                      Print ID Card
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

        </motion.div>
      </div>
      <Footer />

      {/* ── QR Modal ── */}
      <MediaModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        title="My QR Code"
        onDownload={downloadQR}
      >
        <div className="flex flex-col items-center gap-3 w-full">
          {/* Member mini-profile inside modal */}
          <div className="flex items-center gap-3 w-full px-1 pb-3 border-b border-primary/20">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-primary/40 bg-primary/10 flex-shrink-0">
              {user.profileImage
                ? <img src={user.profileImage} className="w-full h-full object-cover" />
                : <User size={18} className="text-primary/50 m-auto mt-2.5" />
              }
            </div>
            <div>
              <p className="font-heading text-xs font-bold text-foreground">{displayName}</p>
              <p className="font-mono text-[10px] text-primary">{user.accountId}</p>
              <p className="text-[9px] text-muted-foreground">{user.chapter || "SWS Skeptrons – Region VII"}</p>
            </div>
          </div>

          {/* QR */}
          <div ref={qrRef} className="bg-white p-4 rounded-xl shadow-lg">
            <QRCodeComponent
              value={`https://sws-skeptrons.vercel.app/member-verifier?q=${user.accountId}`}
              size={200}
              level="H"
            />
          </div>
          <p className="text-[10px] text-muted-foreground font-mono text-center">
            Scan to verify membership
          </p>
        </div>
      </MediaModal>

      {/* ── Barcode Modal ── */}
      <MediaModal
        isOpen={showBarcodeModal}
        onClose={() => setShowBarcodeModal(false)}
        title="My Barcode"
        onDownload={downloadBarcode}
      >
        <div className="flex flex-col items-center gap-3 w-full">
          {/* Member mini-profile inside modal */}
          <div className="flex items-center gap-3 w-full px-1 pb-3 border-b border-primary/20">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-primary/40 bg-primary/10 flex-shrink-0">
              {user.profileImage
                ? <img src={user.profileImage} className="w-full h-full object-cover" />
                : <User size={18} className="text-primary/50 m-auto mt-2.5" />
              }
            </div>
            <div>
              <p className="font-heading text-xs font-bold text-foreground">{displayName}</p>
              <p className="font-mono text-[10px] text-primary">{user.accountId}</p>
              <p className="text-[9px] text-muted-foreground">{user.chapter || "SWS Skeptrons – Region VII"}</p>
            </div>
          </div>

          {/* Barcode */}
          <div className="w-full overflow-x-auto flex justify-center py-2">
            <svg ref={barcodeRef} className="max-w-full" />
          </div>
        </div>
      </MediaModal>

      {/* ── Zoom Modal ── */}
      <AnimatePresence>
        {isZoomModalOpen && (
          <motion.div 
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm overflow-y-auto cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomModalOpen(false)}
          >
            {/* Close Button floating */}
            <button 
              onClick={() => setIsZoomModalOpen(false)}
              className="fixed top-4 right-4 md:top-6 md:right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all shadow-lg z-[100000] cursor-pointer"
              title="Close preview"
            >
              <X size={20} />
            </button>

            <motion.div
              className="relative flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 max-w-full my-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1.0, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Front ID View */}
              <div className="w-[264px] h-[448.8px] sm:w-[297px] sm:h-[504.9px] md:w-[330px] md:h-[561px] lg:w-[363px] lg:h-[617.1px] flex items-center justify-center relative">
                <div className="scale-120 sm:scale-135 md:scale-150 lg:scale-[1.65] transform transition-transform duration-200 origin-center absolute">
                  <CardPreview 
                    user={displayUser} 
                    side="front" 
                  />
                </div>
              </div>

              {/* Back ID View */}
              <div className="w-[264px] h-[448.8px] sm:w-[297px] sm:h-[504.9px] md:w-[330px] md:h-[561px] lg:w-[363px] lg:h-[617.1px] flex items-center justify-center relative">
                <div className="scale-120 sm:scale-135 md:scale-150 lg:scale-[1.65] transform transition-transform duration-200 origin-center absolute">
                  <CardPreview 
                    user={displayUser} 
                    side="back" 
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Signature Customization Modal ── */}
      <AnimatePresence>
        {isSigModalOpen && (
          <motion.div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cancelSignatureModal}
          >
            <motion.div
              className="relative flex flex-col gap-6 max-w-4xl w-full bg-zinc-950 border border-primary/20 rounded-2xl p-6 shadow-2xl my-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.0, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={cancelSignatureModal}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-all"
              >
                <X size={16} />
              </button>

              <div className="space-y-1">
                <h3 className="font-heading text-lg font-bold text-primary uppercase tracking-widest text-glow-gold">
                  {sigModalType === "draw" ? "Draw Official Signature" : "Position Uploaded Signature"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {sigModalType === "draw" 
                    ? "Draw your signature on the pad. Drag & resize it directly on the card preview to position it." 
                    : "Drag & resize the signature directly on the card preview below to position it perfectly."}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left/Top: Back ID Card Preview */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center gap-2 bg-primary/5 p-4 rounded-xl border border-primary/10">
                  <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-primary/75">Live ID Preview</span>
                  <div className="scale-105 transform my-2">
                    <CardPreview 
                      user={displayUser} 
                      side="back" 
                      onPositionChange={handleSignaturePositionChange}
                      onPositionEnd={undefined} // Don't auto-save to Mongo during preview adjustments
                    />
                  </div>
                  <span className="text-[9px] text-muted-foreground/60 text-center select-none">
                    ✨ Drag & resize signature directly on this card preview
                  </span>
                </div>

                {/* Right/Bottom: Controls/Drawing Pad */}
                <div className="lg:col-span-7 space-y-4">
                  {sigModalType === "draw" ? (
                    <div className="space-y-2">
                      <label className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">Drawing Canvas</label>
                      <SignaturePad
                        onChange={(base64) => {
                          setTempSignature(base64);
                        }}
                        showSaveButton={false}
                        height={200}
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">Uploaded Signature Preview</label>
                        <div 
                          className="w-full h-32 rounded-xl flex items-center justify-center border border-dashed border-primary/30 relative overflow-hidden"
                          style={{
                            background: "radial-gradient(circle at center, #3a0d0d 0%, #1c0606 100%)"
                          }}
                        >
                          {tempSignature ? (
                            <img src={tempSignature} alt="Uploaded processed signature" className="h-20 object-contain z-10" />
                          ) : (
                            <span className="text-xs text-muted-foreground">No image uploaded</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Unified Action Buttons Footer */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-primary/10 mt-4">
                    {sigModalType === "upload" && (
                      <button
                        type="button"
                        onClick={() => {
                          dashboardSigFileRef.current?.click();
                        }}
                        className="flex-grow py-2 px-4 border border-primary/30 rounded-lg text-xs font-heading font-bold uppercase tracking-wider text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-1.5"
                      >
                        <Upload size={13} /> Change Image
                      </button>
                    )}
                    
                    <button
                      type="button"
                      onClick={cancelSignatureModal}
                      className="flex-1 py-2 px-4 border border-border rounded-lg text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-all"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        const finalPos = user.signaturePosition || { x: 28, y: 72, width: 44, height: 9 };
                        await saveSignatureAndPosition(tempSignature, finalPos);
                      }}
                      disabled={!tempSignature}
                      className="flex-1 py-2 px-4 bg-gradient-to-b from-primary to-[hsl(35,70%,40%)] text-primary-foreground font-heading font-bold text-xs uppercase tracking-wider rounded-lg border border-primary/60 hover:brightness-110 disabled:opacity-40 disabled:hover:brightness-100 transition-all shadow-md shadow-primary/10"
                    >
                      Save Signature
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
