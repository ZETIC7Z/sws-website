import mongoose from 'mongoose';
import dotenv from 'dotenv';

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
  
  console.log("Current user:", user);
  
  // Simulate profile update logic
  const updateFields = {
    signaturePosition: { x: 30, y: 75, width: 40, height: 10 }
  };
  
  try {
    const updated = await User.findByIdAndUpdate(
      user._id,
      updateFields,
      { new: true }
    );
    console.log("Updated user:", updated);
  } catch (err) {
    console.error("Update failed:", err);
  }
  
  process.exit(0);
}

run().catch(console.error);
