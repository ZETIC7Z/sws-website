import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log("URI:", process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("Connected successfully!");
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
    
    // Check users
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    console.log("Users count:", users.length);
    console.log("Users:", users);
    
    process.exit(0);
  })
  .catch(err => {
    console.error("Connection error:", err);
    process.exit(1);
  });
