// backend/models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  items: [{
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String,
    image: String,
    price: Number,
    size: String,
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity cannot be less than 1']
    }
  }],
  shippingInfo: {
    firstName: {
      type: String,
      required: [true, 'Please provide first name']
    },
    lastName: {
      type: String,
      required: [true, 'Please provide last name']
    },
    phoneNumber: {
      type: String,
      required: [true, 'Please provide phone number']
    },
    blockNumber: {
      type: String,
      required: [true, 'Please provide block number']
    },
    roomDormNumber: {
      type: String,
      required: [true, 'Please provide room/dorm number']
    }
  },
  paymentInfo: {
    id: String,
    status: {
      type: String,
      default: 'pending'
    },
    method: {
      type: String,
      default: 'cash_on_delivery'
    }
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  orderStatus: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate order ID before saving
orderSchema.pre('save', function(next) {
  if (!this.orderId) {
    this.orderId = `DBU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);