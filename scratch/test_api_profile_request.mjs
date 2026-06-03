import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  signature: { type: String, default: "" },
  signaturePosition: {
    x: { type: Number, default: 28 },
    y: { type: Number, default: 72 },
    width: { type: Number, default: 44 },
    height: { type: Number, default: 9 }
  }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB!");
  
  const user = await User.findOne({ username: 'stycanine1' });
  if (!user) {
    console.log("User not found!");
    process.exit(1);
  }
  
  const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: "90d" });
  console.log("Generated token:", token);
  
  // Make the API request to the running local server
  const dummySignature = "data:image/png;base64,iVBORw0KGgoAAAANSzkJQg=";
  const payload = {
    firstName: user.firstName || "SAM",
    lastName: user.lastName || "PANGILINAN",
    dateOfBirth: user.dateOfBirth || "1994-08-16",
    signature: dummySignature,
    signaturePosition: { x: 28, y: 72, width: 44, height: 9 }
  };
  
  console.log("Sending payload...");
  try {
    const res = await fetch("http://localhost:5000/api/auth/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    
    console.log("Response status:", res.status);
    const data = await res.json();
    console.log("Response body:", data);
  } catch (err) {
    console.error("Fetch failed:", err);
  }
  
  process.exit(0);
}

run().catch(console.error);
