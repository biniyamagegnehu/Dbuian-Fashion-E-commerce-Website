// backend/scripts/createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@dbuian.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@dbuian.com',
      password: 'admin123', // This will be hashed by the pre-save hook
      role: 'admin',
      university: 'Debre Berhan University',
      isVerified: true
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully');
    console.log('Email: admin@dbuian.com');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    mongoose.connection.close();
  }
};

createAdminUser();