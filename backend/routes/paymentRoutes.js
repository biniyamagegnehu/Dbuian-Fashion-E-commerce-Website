const express = require('express');
const {
  initializeChapaPayment,
  verifyChapaPayment,
  handleChapaWebhook
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/chapa/initialize', protect, initializeChapaPayment);
router.get('/chapa/verify/:txRef', protect, verifyChapaPayment);
router.post('/chapa/webhook', handleChapaWebhook);

module.exports = router;
