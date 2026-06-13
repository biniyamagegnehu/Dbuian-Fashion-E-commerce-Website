const express = require('express');
const { getNotifications, getDashboardStats } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes here should be protected and restricted to admins
router.use(protect);
router.use(authorize('admin'));

router.get('/notifications', getNotifications);
router.get('/dashboard', getDashboardStats);

module.exports = router;
