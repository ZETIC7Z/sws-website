import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const userSchema = new mongoose.Schema({
  username: String,
  position: { type: String, default: "Chapter Member" },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");

    // Update stycanine2 position to Recording Secretary
    const result = await User.updateOne(
      { username: "stycanine2" },
      { $set: { position: "Recording Secretary" } }
    );
    console.log("Update result:", result);

    // Fetch the updated user
    const user = await User.findOne({ username: "stycanine2" });
    console.log("Updated user:", user);

    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

run();
