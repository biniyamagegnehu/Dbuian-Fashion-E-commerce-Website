// backend/routes/testRoutes.js
const express = require('express');
const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend is working!',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;