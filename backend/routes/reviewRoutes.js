const express = require('express');
const {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  getMyReviews,
  getAllReviews // Add this import
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/authMiddleware'); // Add authorize import

const router = express.Router();

// Public route
router.get('/product/:productId', getProductReviews);

// Protected routes
router.get('/my-reviews', protect, getMyReviews);
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

// Admin route - get all reviews
router.get('/', protect, authorize('admin'), getAllReviews); // Add this route

module.exports = router;