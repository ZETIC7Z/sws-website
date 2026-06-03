import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    // Find stycanine1 user
    const user = await mongoose.connection.db.collection('users').findOne({ username: 'stycanine1' });
    if (!user) {
      console.error("User stycanine1 not found!");
      process.exit(1);
    }
    console.log("User found ID:", user._id);
    
    // Sign a token
    const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET);
    console.log("Signed Token:", token);

    // Call the profile PUT endpoint using native fetch (built-in in node 18+)
    const response = await fetch('http://localhost:5000/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        firstName: user.firstName || 'sam',
        lastName: user.lastName || 'pangilinan',
        dateOfBirth: user.dateOfBirth || '',
        address: user.address || {},
        signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAAD...MOCK_IMAGE...',
        signaturePosition: { x: 28, y: 72, width: 44, height: 9 }
      })
    });

    console.log("Response Status:", response.status);
    const data = await response.json();
    console.log("Response Body:", data);

    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
