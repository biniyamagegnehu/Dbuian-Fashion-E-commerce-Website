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
  googleAuth
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/profile', protect, updateProfile);
router.put('/delivery-info', protect, updateDeliveryInfo);
router.put('/password', protect, updatePassword); // Use same controller as updatepassword
router.put('/updatepassword', protect, updatePassword); // Legacy support

module.exports = router;