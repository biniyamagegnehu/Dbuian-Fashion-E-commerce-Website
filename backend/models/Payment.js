const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    order: {
      type: mongoose.Schema.ObjectId,
      ref: 'Order'
    },
    provider: {
      type: String,
      enum: ['chapa'],
      default: 'chapa'
    },
    txRef: {
      type: String,
      required: true,
      unique: true
    },
    chapaReference: String,
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'ETB'
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'cancelled'],
      default: 'pending'
    },
    checkoutUrl: String,
    pendingOrder: mongoose.Schema.Types.Mixed,
    paidAt: Date,
    verifiedAt: Date,
    rawResponse: mongoose.Schema.Types.Mixed
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
