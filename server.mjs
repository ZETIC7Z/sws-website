import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import QRCode from "qrcode";
import multer from "multer";
import { nanoid } from "nanoid";
import { put } from "@vercel/blob";
import { createRequire } from "module";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─── MongoDB Connection ───────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected to sws-member"))
  .catch(err => console.error("❌ MongoDB error:", err.message));

// ─── Schemas ──────────────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  accountId: { type: String, unique: true },
  // Profile (step 2)
  firstName: { type: String, default: "" },
  lastName: { type: String, default: "" },
  dateOfBirth: { type: String, default: "" },
  address: {
    street: { type: String, default: "" },
    city: { type: String, default: "" },
    province: { type: String, default: "" },
    country: { type: String, default: "" },
    countryCode: { type: String, default: "" },
    flag: { type: String, default: "" },
  },
  profileImage: { type: String, default: "" },
  qrCode: { type: String, default: "" },
  signature: { type: String, default: "" },
  signaturePosition: {
    x: { type: Number, default: 28 },
    y: { type: Number, default: 72 },
    width: { type: Number, default: 44 },
    height: { type: Number, default: 9 }
  },
  chapter: { type: String, default: "SWS Skeptrons – Region VII" },
  role: { type: String, default: "member" },
  isProfileComplete: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

// ─── Helpers ──────────────────────────────────────────────────────────────────
const generateAccountId = () => {
  const year = new Date().getFullYear();
  const num = Math.floor(100000 + Math.random() * 900000);
  return `${year}${num}`;
};

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "90d" });

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    // Asynchronously update last active status without delaying response
    User.findByIdAndUpdate(decoded.id, { lastActive: new Date() }).catch(() => {});
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// multer memory storage for blob upload
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// ─── Auth Routes ──────────────────────────────────────────────────────────────

// POST /api/auth/signup
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ error: "Username, email, and password are required" });
    if (password.length < 6)
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    
    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    if (!hasUppercase || !hasSpecial) {
      return res.status(400).json({ error: "Password must contain at least 1 uppercase letter and 1 special character (e.g., SamXerz1973!)" });
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      if (existing.email === email.toLowerCase()) return res.status(409).json({ error: "Email already registered" });
      return res.status(409).json({ error: "Username already taken" });
    }

    const accountId = generateAccountId();
    const hashed = await bcrypt.hash(password, 12);
    // Generate QR code as data URL linking to the deploy verification page
    const verifyUrl = `${process.env.FRONTEND_URL || "https://sws-skeptrons.vercel.app"}/member-verifier?q=${accountId}`;
    const qrCode = await QRCode.toDataURL(verifyUrl, { errorCorrectionLevel: "H", width: 250 });

    const user = new User({ username, email, password: hashed, accountId, qrCode });
    await user.save();

    const token = signToken(user._id);
    res.status(201).json({
      message: "Account created successfully",
      token,
      user: {
        id: user._id, username, email, accountId, qrCode, signature: "", isProfileComplete: false,
        signaturePosition: { x: 28, y: 72, width: 44, height: 9 }
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error during signup" });
  }
});

// POST /api/auth/signin
app.post("/api/auth/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const user = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: email }
      ]
    });
    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid email or password" });

    const token = signToken(user._id);
    user.lastActive = new Date();
    await user.save();
    res.json({
      token,
      user: {
        id: user._id, username: user.username, email: user.email,
        accountId: user.accountId, firstName: user.firstName, lastName: user.lastName,
        profileImage: user.profileImage, qrCode: user.qrCode, signature: user.signature || "",
        isProfileComplete: user.isProfileComplete, role: user.role,
        signaturePosition: user.signaturePosition || { x: 28, y: 72, width: 44, height: 9 },
      },
    });
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// GET /api/auth/me
app.get("/api/auth/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/auth/profile — complete profile (step 2)
app.put("/api/auth/profile", authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, dateOfBirth, address, signature, signaturePosition } = req.body;
    const updateFields = { firstName, lastName, dateOfBirth, address, isProfileComplete: true };
    
    if (signaturePosition !== undefined) {
      updateFields.signaturePosition = signaturePosition;
    }

    if (signature !== undefined) {
      if (signature && signature.startsWith("data:image/")) {
        try {
          const matches = signature.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
          if (matches && matches.length === 3) {
            const contentType = matches[1];
            const base64Data = matches[2];
            const buffer = Buffer.from(base64Data, "base64");
            
            // Get user to use accountId in the filename
            const userObj = await User.findById(req.userId);
            const ext = contentType.split("/")[1] || "png";
            const filename = `signatures/${userObj.accountId || req.userId}-${Date.now()}.${ext}`;
            
            const blob = await put(filename, buffer, {
              access: "public",
              token: process.env.BLOB_READ_WRITE_TOKEN,
              contentType: contentType,
            });
            
            updateFields.signature = blob.url;
            console.log("Successfully uploaded signature to Vercel Blob:", blob.url);
          } else {
            updateFields.signature = signature;
          }
        } catch (blobErr) {
          console.error("Failed to upload signature to Vercel Blob, falling back to base64:", blobErr);
          updateFields.signature = signature;
        }
      } else {
        updateFields.signature = signature;
      }
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      updateFields,
      { new: true, select: "-password" }
    );
    res.json({ message: "Profile updated", user });
  } catch (err) {
    console.error("Failed to update profile:", err);
    res.status(500).json({ error: "Failed to update profile", details: err.message });
  }
});

// POST /api/auth/upload-avatar — upload profile photo to Vercel Blob
app.post("/api/auth/upload-avatar", authMiddleware, upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const user = await User.findById(req.userId);
    const ext = req.file.mimetype.split("/")[1] || "jpg";
    const filename = `avatars/${user.accountId}-${Date.now()}.${ext}`;

    const blob = await put(filename, req.file.buffer, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: req.file.mimetype,
    });

    user.profileImage = blob.url;
    await user.save();

    res.json({ profileImage: blob.url });
  } catch (err) {
    console.error("Avatar upload error:", err);
    // Fallback: store as base64 in DB for local dev
    try {
      const b64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      await User.findByIdAndUpdate(req.userId, { profileImage: b64 });
      res.json({ profileImage: b64 });
    } catch (e2) {
      res.status(500).json({ error: "Failed to upload avatar" });
    }
  }
});

// GET /api/members/stats
app.get("/api/members/stats", async (req, res) => {
  try {
    const total = await User.countDocuments();
    // Count online users whose lastActive is within the last 5 minutes
    const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
    const online = await User.countDocuments({ lastActive: { $gte: fiveMinsAgo } });
    res.json({ total, online });
  } catch (err) {
    console.error("Stats fetch error:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// ─── Member Verifier ──────────────────────────────────────────────────────────
// GET /api/members/verify?q=SWS-2024-XXXXX
app.get("/api/members/verify", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Query required" });

    const user = await User.findOne({
      $or: [{ accountId: q }, { username: q }]
    }).select("-password -qrCode");

    if (!user) return res.status(404).json({ error: "Member not found" });

    res.json({
      member: {
        accountId: user.accountId,
        firstName: user.firstName || user.username,
        lastName: user.lastName,
        username: user.username,
        profileImage: user.profileImage,
        chapter: user.chapter,
      }
    });
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// ─── Admin Routes ─────────────────────────────────────────────────────────────

// Admin middleware
const adminMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("role");
    if (!user || user.role !== "admin") return res.status(403).json({ error: "Admin access required" });
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// GET /api/admin/members — list all members
app.get("/api/admin/members", adminMiddleware, async (req, res) => {
  try {
    const members = await User.find({}).select("-password -qrCode").sort({ createdAt: -1 });
    res.json({ members });
  } catch (err) {
    console.error("Admin members error:", err);
    res.status(500).json({ error: "Failed to fetch members" });
  }
});

// DELETE /api/admin/members/:id — delete a member by MongoDB _id
app.delete("/api/admin/members/:id", adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const target = await User.findById(id);
    if (!target) return res.status(404).json({ error: "Member not found" });
    if (target.role === "admin") return res.status(403).json({ error: "Cannot delete admin accounts" });
    await User.findByIdAndDelete(id);
    res.json({ message: "Member deleted successfully" });
  } catch (err) {
    console.error("Admin delete error:", err);
    res.status(500).json({ error: "Failed to delete member" });
  }
});

// PUT /api/admin/members/:id — edit a member by MongoDB _id
app.put("/api/admin/members/:id", adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, firstName, lastName, role, chapter, isProfileComplete } = req.body;

    const target = await User.findById(id);
    if (!target) return res.status(404).json({ error: "Member not found" });

    // Validate unique username if changed
    if (username && username !== target.username) {
      const existing = await User.findOne({ username });
      if (existing) return res.status(409).json({ error: "Username already taken" });
      target.username = username;
    }

    // Validate unique email if changed
    if (email && email.toLowerCase() !== target.email) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) return res.status(409).json({ error: "Email already registered" });
      target.email = email.toLowerCase();
    }

    // Update other fields
    if (role !== undefined) target.role = role;
    if (firstName !== undefined) target.firstName = firstName;
    if (lastName !== undefined) target.lastName = lastName;
    if (chapter !== undefined) target.chapter = chapter;
    if (isProfileComplete !== undefined) target.isProfileComplete = isProfileComplete;

    await target.save();
    res.json({ message: "Member updated successfully", member: {
      _id: target._id,
      username: target.username,
      email: target.email,
      accountId: target.accountId,
      firstName: target.firstName,
      lastName: target.lastName,
      role: target.role,
      chapter: target.chapter,
      isProfileComplete: target.isProfileComplete,
      createdAt: target.createdAt,
      lastActive: target.lastActive
    }});
  } catch (err) {
    console.error("Admin edit error:", err);
    res.status(500).json({ error: "Failed to update member" });
  }
});

// ─── Dashboard: Generate Barcode ─────────────────────────────────────────────
app.get("/api/members/barcode/:accountId", authMiddleware, async (req, res) => {
  // Return the accountId — frontend will use JsBarcode to render it
  const user = await User.findById(req.userId).select("accountId firstName lastName");
  if (!user) return res.status(404).json({ error: "Not found" });
  res.json({ accountId: user.accountId, name: `${user.firstName} ${user.lastName}`.trim() });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`🚀 SWS API Server running on http://localhost:${PORT}`));
}

export default app;
