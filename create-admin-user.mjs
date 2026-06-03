import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import QRCode from "qrcode";
import dotenv from "dotenv";

dotenv.config();

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  accountId: { type: String, unique: true },
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
  chapter: { type: String, default: "SWS Skeptrons – Region VII" },
  role: { type: String, default: "member" },
  isProfileComplete: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");

    // Remove existing admin if exists
    await User.deleteOne({ username: "admin" });
    await User.deleteOne({ email: "admin@sws.com" });

    const password = "42564126";
    const hashed = await bcrypt.hash(password, 12);
    const accountId = "2026000001";
    const verifyUrl = `${process.env.FRONTEND_URL || "https://sws-skeptrons.vercel.app"}/member-verifier?q=${accountId}`;
    const qrCode = await QRCode.toDataURL(verifyUrl, { errorCorrectionLevel: "H", width: 250 });

    const admin = new User({
      username: "admin",
      email: "admin@sws.com",
      password: hashed,
      accountId,
      qrCode,
      firstName: "System",
      lastName: "Administrator",
      role: "admin",
      isProfileComplete: true,
      chapter: "SWS Skeptrons – HQ"
    });

    await admin.save();
    console.log("Admin user created successfully!");
    console.log("Username: admin");
    console.log("Email: admin@sws.com");
    console.log("Password: 42564126");
    process.exit(0);
  } catch (err) {
    console.error("Error creating admin user:", err);
    process.exit(1);
  }
}

run();
