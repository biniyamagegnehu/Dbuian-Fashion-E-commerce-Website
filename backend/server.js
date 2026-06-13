// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express(); 

// ✅ Allow your frontend domain
const allowedOrigins = [
  'https://dbuianfashion.vercel.app',   // your deployed frontend
  'https://dbuianfashion-admin.vercel.app',  // admin panel
  'http://localhost:5173',               // local frontend
  'http://localhost:5174',               // local admin panel
  'http://localhost:5175'
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve mock images with proper CORS and caching headers
app.use('/api/mock-images', (req, res, next) => {
  // Set CORS headers for static files
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  // Set caching headers for images
  res.header('Cache-Control', 'public, max-age=31536000, immutable'); // Cache for 1 year
  res.header('Expires', new Date(Date.now() + 31536000000).toUTCString()); // 1 year from now
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
}, express.static(path.join(__dirname, 'temp_uploads')));

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
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/cart', require('./routes/cartRoutes')); 
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));

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

// Seed default categories if none exist
const seedDefaultCategories = async () => {
  const Category = require('./models/Category');
  const count = await Category.countDocuments();
  if (count === 0) {
    const defaultCategories = [
      { name: 'T-Shirts', description: 'Classic and graphic tees for all occasions' },
      { name: 'Hoodies & Sweatshirts', description: 'Comfortable hoodies and sweatshirts' },
      { name: 'Jackets & Coats', description: 'Outerwear for all seasons' },
      { name: 'Pants & Trousers', description: 'Formal and casual pants' },
      { name: 'Jeans', description: 'Denim jeans in various styles' },
      { name: 'Dresses', description: 'Casual and formal dresses' },
      { name: 'Skirts', description: 'Mini, midi and maxi skirts' },
      { name: 'Footwear', description: 'Shoes, sneakers, boots and more' },
    ];
    await Category.insertMany(defaultCategories);
    console.log('✅ Default categories seeded');
  }
};

// Start server
connectDB().then(async () => {
  await seedDefaultCategories();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Health: http://localhost:${PORT}/api/health`);
  });
});