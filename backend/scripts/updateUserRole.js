// backend/scripts/updateUserRole.js
const mongoose = require('mongoose');
require('dotenv').config();

const updateUserRole = async () => {
  try {
    // Connect to MongoDB - use your actual database name
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dbuian_fashion';
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB...');

    // Update the user role
    const result = await mongoose.connection.collection('users').updateOne(
      { _id: new mongoose.Types.ObjectId("68dd75cb3546031506a0918e") },
      { $set: { role: "admin" } }
    );

    if (result.modifiedCount === 1) {
      console.log('✅ User role updated to "admin" successfully!');
    } else {
      console.log('❌ User not found or role already set to admin');
    }

    await mongoose.connection.close();
    process.exit(0);
    
  } catch (error) {
    console.error('Error updating user role:', error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

updateUserRole();