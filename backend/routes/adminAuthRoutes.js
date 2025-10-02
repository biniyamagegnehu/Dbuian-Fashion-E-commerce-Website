// backend/routes/adminAuthRoutes.js
const express = require('express');
const {
  adminLogin,
  getAdminMe
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', adminLogin);
router.get('/me', protect, authorize('admin'), getAdminMe);

module.exports = router; 