const express = require('express');
const { getNotifications } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes here should be protected and restricted to admins
router.use(protect);
router.use(authorize('admin'));

router.get('/notifications', getNotifications);

module.exports = router;
