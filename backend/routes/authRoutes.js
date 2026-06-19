// backend/routes/authRoutes.js
const express = require('express');
const {
  register,
  login,
  getMe,
  updateDetails,
  updateProfile,
  updateDeliveryInfo,
  updatePassword,
  googleAuth,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// --- Existing routes (unchanged) ---
router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/profile', protect, updateProfile);
router.put('/delivery-info', protect, updateDeliveryInfo);
router.put('/password', protect, updatePassword);
router.put('/updatepassword', protect, updatePassword); // Legacy support

// --- Email verification ---
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerification);

// --- Password reset ---
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

module.exports = router;