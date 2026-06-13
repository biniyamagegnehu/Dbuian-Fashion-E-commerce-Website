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

// @desc    Get dashboard statistics and growth metrics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    // Define time periods
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    // 1. Get Totals
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });

    // Calculate total revenue
    const allOrders = await Order.find({ orderStatus: { $ne: 'cancelled' } }, 'totalPrice');
    const totalRevenue = allOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

    // 2. Calculate Growth Metrics
    // Helper to calculate percentage growth
    const calculateGrowth = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      const growth = ((current - previous) / previous) * 100;
      return Number(growth.toFixed(1));
    };

    // Orders Growth
    const currentOrders = await Order.find({
      createdAt: { $gte: thirtyDaysAgo },
      orderStatus: { $ne: 'cancelled' }
    });
    const previousOrders = await Order.find({
      createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo },
      orderStatus: { $ne: 'cancelled' }
    });
    const orderGrowth = calculateGrowth(currentOrders.length, previousOrders.length);

    // Revenue Growth
    const currentRevenue = currentOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const previousRevenue = previousOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const revenueGrowth = calculateGrowth(currentRevenue, previousRevenue);

    // Users Growth
    const currentUsersCount = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    const previousUsersCount = await User.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } });
    const userGrowth = calculateGrowth(currentUsersCount, previousUsersCount);

    // 3. Recent Activity (last 5 orders)
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('_id orderId items totalPrice createdAt');
      
    const recentActivity = recentOrders.map(order => ({
      id: order._id,
      type: 'order',
      title: `New Order #${order.orderId}`,
      description: `${order.items.length} items • ETB ${order.totalPrice}`,
      time: order.createdAt,
      icon: '📦',
      color: 'green'
    }));

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalOrders,
        totalProducts,
        totalRevenue,
        pendingOrders,
        revenueGrowth,
        userGrowth,
        orderGrowth
      },
      recentActivity
    });

  } catch (error) {
    console.error('Error computing dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while computing dashboard stats'
    });
  }
};
