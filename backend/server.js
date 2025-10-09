// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Basic CORS - keep it simple
app.use(cors());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/mock-images', express.static(path.join(__dirname, 'temp_uploads')));


// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Import and use routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin/auth', require('./routes/adminAuthRoutes')); 
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/cart', require('./routes/cartRoutes')); 

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true,
    message: 'Server is running', 
    timestamp: new Date().toISOString()
  });
});

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working!',
    data: {
      server: 'Express.js',
      status: 'Running'
    }
  });
});

const PORT = process.env.PORT || 5000;

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Health: http://localhost:${PORT}/api/health`);
  });
});