import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  role: String,
  accountId: String,
  isProfileComplete: Boolean,
});

const User = mongoose.model('User', userSchema);

async function run() {
  console.log("Connecting to MongoDB:", process.env.MONGODB_URI.replace(/:([^@]+)@/, ':****@'));
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected!");
  
  const users = await User.find({});
  console.log(`Found ${users.length} users:`);
  users.forEach(u => {
    console.log(`- Username: ${u.username}, Email: ${u.email}, Role: ${u.role}, AccountID: ${u.accountId}, ProfileComplete: ${u.isProfileComplete}`);
  });
  
  await mongoose.disconnect();
}

run().catch(console.error);
