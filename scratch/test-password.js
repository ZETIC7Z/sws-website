import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const user = await User.findOne({ username: "stycanine1" });
  
  const passwordsToTest = [
    "SamXerz1973!",
    "SamXerz1973",
    "samxerz1973!",
    "samxerz1973",
    "test123",
    "test1234",
    "stycanine1",
  ];
  
  console.log(`Testing passwords for ${user.username}...`);
  for (const pw of passwordsToTest) {
    const match = await bcrypt.compare(pw, user.password);
    console.log(`- "${pw}": ${match ? "MATCH!" : "No"}`);
  }
  
  await mongoose.disconnect();
}

run().catch(console.error);
