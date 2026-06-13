const Order = require('../models/Order');
const Product = require('../models/Product');
const Review = require('../models/Review');
const User = require('../models/User');

// @desc    Get dashboard notifications
// @route   GET /api/admin/notifications
// @access  Private/Admin
exports.getNotifications = async (req, res) => {
  try {
    const notifications = [];
    let notifId = 1;

    // 1. Pending Orders
    const pendingOrders = await Order.find({ orderStatus: 'pending' })
      .sort({ createdAt: -1 })
      .limit(5);
    
    pendingOrders.forEach(order => {
      notifications.push({
        id: notifId++,
        type: 'order',
        title: 'New Pending Order',
        message: `Order #${order.orderId} is awaiting processing.`,
        time: order.createdAt,
        read: false,
        action: '/admin/orders'
      });
    });

    // 2. Unanswered Reviews
    const pendingReviews = await Review.find({ adminResponse: null })
      .populate('product', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    pendingReviews.forEach(review => {
      notifications.push({
        id: notifId++,
        type: 'review',
        title: 'New Review Needs Response',
        message: `${review.userName} left a ${review.rating}-star review for ${review.product?.name || 'a product'}.`,
        time: review.createdAt,
        read: false,
        action: '/admin/reviews'
      });
    });

    // 3. Low Stock Products
    const lowStockProducts = await Product.find({ stock: { $lt: 10 } })
      .sort({ stock: 1 })
      .limit(5);

    lowStockProducts.forEach(product => {
      notifications.push({
        id: notifId++,
        type: 'system', // 'system' or 'product' - frontend maps 'system' to purple cog
        title: 'Low Stock Alert',
        message: `${product.name} has only ${product.stock} items left in stock.`,
        time: new Date(), // Using current time for stock alerts since it's an ongoing state
        read: false,
        action: '/admin/products'
      });
    });

    // 4. New Users (Registered in last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const newUsers = await User.find({ createdAt: { $gte: oneDayAgo } })
      .sort({ createdAt: -1 })
      .limit(5);

    newUsers.forEach(user => {
      notifications.push({
        id: notifId++,
        type: 'user',
        title: 'New User Registration',
        message: `${user.name} signed up as a new customer.`,
        time: user.createdAt,
        read: false,
        action: '/admin/users'
      });
    });

    // Sort all notifications by time (newest first)
    notifications.sort((a, b) => new Date(b.time) - new Date(a.time));

    // Format times into relative strings (e.g., "5 min ago")
    const now = new Date();
    const formattedNotifications = notifications.map(notif => {
      const diffMs = now - new Date(notif.time);
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      let timeString = 'Just now';
      if (diffDays > 0) timeString = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      else if (diffHours > 0) timeString = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      else if (diffMins > 0) timeString = `${diffMins} min ago`;

      return {
        ...notif,
        time: timeString
      };
    });

    res.json({
      success: true,
      count: formattedNotifications.length,
      data: formattedNotifications
    });
  } catch (error) {
    console.error('Error computing notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while computing notifications'
    });
  }
};
