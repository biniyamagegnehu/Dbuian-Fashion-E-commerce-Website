// backend/controllers/userController.js
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create user (Admin)
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, studentId } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorResponse('A user with that email already exists', 400));
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
      phone,
      studentId,
      authProvider: 'local'
    });

    // Don't return password
    user.password = undefined;

    res.status(201).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, role } = req.query;

    const query = {};

    // Role filter
    if (role && role !== 'all') {
      query.role = role;
    }

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    // Global Stats Calculation
    const totalUsers = await User.countDocuments();
    const customers = await User.countDocuments({ role: 'customer' });
    const admins = await User.countDocuments({ role: 'admin' });
    // Assuming active users are all users for now since there's no explicit inactive field
    const active = totalUsers; 

    const stats = {
      total: totalUsers,
      customers,
      admins,
      active
    };

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(query);
    const pages = Math.ceil(total / limitNum);

    const users = await User.find(query)
      .select('-password')
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: users.length,
      users, // keep for backward compatibility
      data: users,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages,
        hasNextPage: pageNum < pages,
        hasPrevPage: pageNum > 1
      },
      stats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user (Admin)
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user (Admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user statistics (Admin)
// @route   GET /api/users/stats
// @access  Private/Admin
exports.getUserStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const customers = await User.countDocuments({ role: 'customer' });
    const admins = await User.countDocuments({ role: 'admin' });
    
    // Get users created in last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const newUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        customers,
        admins,
        newUsers
      }
    });
  } catch (error) {
    next(error);
  }
};