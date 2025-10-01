// backend/routes/reviewRoutes.js
const express = require('express');
const {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  getMyReviews
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/product/:productId', getProductReviews);
router.get('/my-reviews', protect, getMyReviews);
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;