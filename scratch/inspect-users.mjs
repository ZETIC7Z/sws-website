import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    console.log("Total users:", users.length);
    for (const u of users) {
      console.log(`- Username: ${u.username}`);
      console.log(`  Name: ${u.firstName} ${u.lastName}`);
      console.log(`  Email: ${u.email}`);
      console.log(`  Has Signature: ${!!u.signature}`);
      console.log(`  Signature length: ${u.signature ? u.signature.length : 0}`);
      console.log(`  Position:`, u.signaturePosition);
      console.log("-----------------------------------------");
    }
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
