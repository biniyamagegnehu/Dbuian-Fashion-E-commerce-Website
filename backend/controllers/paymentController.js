const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const { initializePayment, verifyPayment } = require('../utils/chapa');

const getFrontendUrl = () => process.env.FRONTEND_URL || 'http://localhost:5173';
const getBackendUrl = () => process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;

const makeTxRef = () => `DBU-CHAPA-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`.toUpperCase();

const buildPendingOrder = async ({ items, shippingInfo }, userId) => {
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new ErrorResponse('No items in order', 400);
  }

  if (
    !shippingInfo?.firstName ||
    !shippingInfo?.lastName ||
    !shippingInfo?.phoneNumber ||
    !shippingInfo?.blockNumber ||
    !shippingInfo?.roomDormNumber
  ) {
    throw new ErrorResponse('Complete shipping information is required', 400);
  }

  let itemsPrice = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);

    if (!product) {
      throw new ErrorResponse(`Product not found: ${item.product}`, 404);
    }

    if (!item.quantity || item.quantity < 1) {
      throw new ErrorResponse('Invalid quantity for order item', 400);
    }

    let selectedVariant = null;
    if (product.variants && product.variants.length > 0) {
      if (item.variantId) {
        selectedVariant = product.variants.id(item.variantId) || product.variants.find(v => v._id.toString() === item.variantId);
      }
      if (!selectedVariant && item.size) {
        selectedVariant = product.variants.find(v => v.size === item.size && (!item.color || v.color === item.color));
      }

      if (!selectedVariant) {
        throw new ErrorResponse(`Selected product variant is not available for ${product.name}`, 400);
      }

      if (!selectedVariant.isActive) {
        throw new ErrorResponse(`Selected product variant is not active for ${product.name}`, 400);
      }

      if (selectedVariant.stock < item.quantity) {
        throw new ErrorResponse(`Insufficient stock for ${product.name} variant. Only ${selectedVariant.stock} available`, 400);
      }
    } else if (product.stock < item.quantity) {
      throw new ErrorResponse(`Insufficient stock for ${product.name}. Only ${product.stock} available`, 400);
    }

    const itemPrice = selectedVariant?.price || product.price;
    itemsPrice += itemPrice * item.quantity;

    orderItems.push({
      product: product._id,
      variantId: selectedVariant ? selectedVariant._id.toString() : undefined,
      name: product.name,
      image: selectedVariant?.image?.url || product.images[0]?.url || '/images/default-product.jpg',
      price: itemPrice,
      size: selectedVariant?.size || item.size,
      color: selectedVariant?.color || item.color,
      sku: selectedVariant?.sku,
      quantity: item.quantity
    });
  }

  const taxPrice = itemsPrice * 0.15;
  const shippingPrice = 50;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  return {
    user: userId,
    items: orderItems,
    shippingInfo,
    paymentInfo: {
      method: 'chapa',
      status: 'pending'
    },
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    orderStatus: 'pending',
    statusHistory: [{
      status: 'pending',
      note: 'Payment initialized with Chapa',
      changedBy: userId
    }]
  };
};

const createPaidOrderFromPayment = async (payment, chapaData) => {
  if (payment.order) {
    const existingOrder = await Order.findById(payment.order);
    if (existingOrder) return existingOrder;
  }

  const pendingOrder = payment.pendingOrder;
  if (!pendingOrder) {
    throw new Error('Payment has no pending order payload');
  }

  for (const item of pendingOrder.items) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new Error(`Product not found while finalizing order: ${item.product}`);
    }

    if (item.variantId && product.variants && product.variants.length > 0) {
      const variant = product.variants.id(item.variantId) || product.variants.find(v => v._id.toString() === item.variantId);
      if (!variant) {
        throw new Error(`Variant not found while finalizing order for ${product.name}`);
      }
      if (variant.stock < item.quantity) {
        throw new Error(`Insufficient stock while finalizing order for ${product.name}`);
      }
      variant.stock -= item.quantity;
    } else {
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock while finalizing order for ${product.name}`);
      }
      product.stock -= item.quantity;
    }

    await product.save();
  }

  const paidAt = new Date();
  const order = await Order.create({
    ...pendingOrder,
    paymentInfo: {
      id: payment.txRef,
      status: 'paid',
      method: 'chapa',
      txRef: payment.txRef,
      chapaReference: chapaData.reference || chapaData.ref_id,
      paidAt
    },
    orderStatus: 'processing',
    statusHistory: [
      ...(pendingOrder.statusHistory || []),
      {
        status: 'processing',
        note: 'Payment confirmed by Chapa',
        changedAt: paidAt
      }
    ]
  });

  payment.order = order._id;
  payment.status = 'paid';
  payment.chapaReference = chapaData.reference || chapaData.ref_id || payment.chapaReference;
  payment.paidAt = paidAt;
  payment.verifiedAt = new Date();
  payment.rawResponse = chapaData;
  await payment.save();

  return order;
};

exports.initializeChapaPayment = async (req, res, next) => {
  try {
    const pendingOrder = await buildPendingOrder(req.body, req.user.id);
    const txRef = makeTxRef();

    const [firstName, ...lastNameParts] = (req.user.name || `${pendingOrder.shippingInfo.firstName} ${pendingOrder.shippingInfo.lastName}`).split(' ');
    const lastName = lastNameParts.join(' ') || pendingOrder.shippingInfo.lastName || 'Customer';

    const chapaPayload = {
      amount: Number(pendingOrder.totalPrice).toFixed(2),
      currency: 'ETB',
      email: req.user.email,
      first_name: firstName || pendingOrder.shippingInfo.firstName,
      last_name: lastName,
      phone_number: pendingOrder.shippingInfo.phoneNumber,
      tx_ref: txRef,
      callback_url: process.env.CHAPA_CALLBACK_URL || `${getBackendUrl()}/api/payments/chapa/webhook`,
      return_url: `${process.env.CHAPA_RETURN_URL || `${getFrontendUrl()}/payment/success`}?tx_ref=${encodeURIComponent(txRef)}`,
      customization: {
        title: 'Dbuian Fashion',
        description: 'Payment for Dbuian Fashion order'
      }
    };

    const chapaResponse = await initializePayment(chapaPayload);
    const checkoutUrl = chapaResponse.data?.checkout_url || chapaResponse.checkout_url;

    if (!checkoutUrl) {
      return next(new ErrorResponse(chapaResponse.message || 'Chapa did not return a checkout URL', 502));
    }

    const payment = await Payment.create({
      user: req.user.id,
      txRef,
      amount: pendingOrder.totalPrice,
      checkoutUrl,
      pendingOrder,
      rawResponse: chapaResponse
    });

    res.status(200).json({
      success: true,
      checkoutUrl,
      txRef,
      amount: payment.amount
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyChapaPayment = async (req, res, next) => {
  try {
    const { txRef } = req.params;
    const payment = await Payment.findOne({ txRef });

    if (!payment) {
      return next(new ErrorResponse('Payment not found', 404));
    }

    if (payment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to verify this payment', 403));
    }

    const chapaResponse = await verifyPayment(txRef);
    const chapaData = chapaResponse.data || chapaResponse;
    const status = String(chapaData.status || '').toLowerCase();

    let order = null;
    if (status === 'success' || status === 'successful' || status === 'paid') {
      order = await createPaidOrderFromPayment(payment, chapaData);
    } else if (status === 'failed' || status === 'cancelled') {
      payment.status = status === 'cancelled' ? 'cancelled' : 'failed';
      payment.verifiedAt = new Date();
      payment.rawResponse = chapaResponse;
      await payment.save();
    }

    if (payment.order && !order) {
      order = await Order.findById(payment.order);
    }

    if (order) {
      await order.populate('user', 'name email');
      await order.populate('items.product', 'name images');
    }

    res.status(200).json({
      success: true,
      status: payment.status,
      payment,
      order
    });
  } catch (error) {
    next(error);
  }
};

exports.handleChapaWebhook = async (req, res, next) => {
  try {
    const txRef = req.body.tx_ref || req.body.trx_ref || req.body?.data?.tx_ref;

    if (!txRef) {
      return res.status(200).json({ success: true, message: 'No tx_ref provided' });
    }

    const payment = await Payment.findOne({ txRef });
    if (!payment) {
      return res.status(200).json({ success: true, message: 'Payment not found locally' });
    }

    const chapaResponse = await verifyPayment(txRef);
    const chapaData = chapaResponse.data || chapaResponse;
    const status = String(chapaData.status || '').toLowerCase();

    if (status === 'success' || status === 'successful' || status === 'paid') {
      await createPaidOrderFromPayment(payment, chapaData);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
