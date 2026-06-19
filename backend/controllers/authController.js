// backend/controllers/authController.js
const crypto = require('crypto');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const generateToken = require('../utils/generateToken');
const { OAuth2Client } = require('google-auth-library');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/emailHelpers');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, studentId } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorResponse('User already exists with this email', 400));
    }

    // Create user (unverified)
    const user = await User.create({
      name,
      email,
      password,
      phone,
      studentId,
      isEmailVerified: false,
    });

    // Generate verification token
    const rawToken = user.getEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Send verification email — delete user if email fails
    try {
      await sendVerificationEmail(user, rawToken);
    } catch (emailError) {
      // Clean up: remove the newly created user so they can try again
      await User.findByIdAndDelete(user._id);
      console.error('Verification email failed:', emailError.message);
      return next(new ErrorResponse('Could not send verification email. Please try again later.', 500));
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return next(new ErrorResponse('Please provide email and password', 400));
    }

    // Check for user (include password for comparison)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Block unverified local users
    // NOTE: isEmailVerified === undefined (legacy users) is NOT === false, so they pass
    if (user.authProvider === 'local' && user.isEmailVerified === false) {
      return res.status(403).json({
        success: false,
        error: 'Please verify your email before logging in.',
        needsVerification: true,
        email: user.email,
      });
    }

    // Generate token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        studentId: user.studentId,
        university: user.university,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify email address
// @route   GET /api/auth/verify-email/:token
// @access  Public
exports.verifyEmail = async (req, res, next) => {
  try {
    // Hash the raw token from the URL
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    // Find user with matching hashed token and non-expired expiry
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpire: { $gt: Date.now() },
    }).select('+emailVerificationToken +emailVerificationExpire');

    if (!user) {
      return next(new ErrorResponse('Invalid or expired verification link', 400));
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerifiedAt = Date.now();
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Email verified successfully. You can now log in.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resend email verification
// @route   POST /api/auth/resend-verification
// @access  Public
exports.resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new ErrorResponse('Please provide an email address', 400));
    }

    const user = await User.findOne({ email });

    // Generic response regardless of whether user exists (avoid account enumeration)
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, a verification link has been sent.',
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        error: 'This email address is already verified.',
      });
    }

    // Generate new verification token
    const rawToken = user.getEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    try {
      await sendVerificationEmail(user, rawToken);
    } catch (emailError) {
      user.emailVerificationToken = undefined;
      user.emailVerificationExpire = undefined;
      await user.save({ validateBeforeSave: false });
      console.error('Resend verification email failed:', emailError.message);
      return next(new ErrorResponse('Could not send verification email. Please try again later.', 500));
    }

    res.status(200).json({
      success: true,
      message: 'Verification email sent. Please check your inbox.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile (new endpoint for account settings)
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    // Only allow updating specific fields
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone,
    };

    if (req.body.avatar) {
      fieldsToUpdate.avatar = req.body.avatar;
    }

    // Role and email are NOT updatable through this endpoint for security

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      studentId: req.body.studentId,
      address: req.body.address,
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update delivery info
// @route   PUT /api/auth/delivery-info
// @access  Private
exports.updateDeliveryInfo = async (req, res, next) => {
  try {
    const { phoneNumber, blockNumber, roomDormNumber } = req.body;

    const user = await User.findById(req.user.id);

    user.deliveryInfo = {
      phoneNumber,
      blockNumber,
      roomDormNumber,
    };

    await user.save();

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    // Handle Google-only accounts that might not have a password
    if (!user.password && user.authProvider === 'google') {
      return next(new ErrorResponse('This is a Google-linked account without a password. Please sign in with Google.', 400));
    }

    // Check current password
    const isMatch = await user.matchPassword(req.body.currentPassword);

    if (!isMatch) {
      return next(new ErrorResponse('Current password is incorrect', 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    // Generate new token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Google login/register
// @route   POST /api/auth/google
// @access  Public
exports.googleAuth = async (req, res, next) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return next(new ErrorResponse('Please provide a google credential', 400));
    }

    // Verify token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId, picture: avatar } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // Link Google ID if missing; ensure verified
      if (!user.googleId) {
        user.googleId = googleId;
        user.avatar = user.avatar || avatar;
      }
      // Google users are always verified
      if (!user.isEmailVerified) {
        user.isEmailVerified = true;
        user.emailVerifiedAt = Date.now();
      }
      await user.save({ validateBeforeSave: false });
    } else {
      // Create new Google user — always verified
      user = await User.create({
        name,
        email,
        googleId,
        authProvider: 'google',
        avatar,
        isVerified: true,
        isEmailVerified: true,
        emailVerifiedAt: Date.now(),
        role: 'user',
      });
    }

    // Generate token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      message: 'Google authentication successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        studentId: user.studentId,
        university: user.university,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Google auth error:', error);
    next(new ErrorResponse('Invalid Google credential', 401));
  }
};

// @desc    Forgot password — send reset email
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new ErrorResponse('Please provide an email address', 400));
    }

    const user = await User.findOne({ email });

    // Always return a generic response — do not reveal account existence
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.',
      });
    }

    // Google-only users have no local password — return same generic message
    if (user.authProvider === 'google' && !user.password) {
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.',
      });
    }

    // Generate reset token
    const rawToken = user.getPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    try {
      await sendPasswordResetEmail(user, rawToken);
    } catch (emailError) {
      // Clear reset fields on email failure
      user.passwordResetToken = undefined;
      user.passwordResetExpire = undefined;
      await user.save({ validateBeforeSave: false });
      console.error('Password reset email failed:', emailError.message);
      return next(new ErrorResponse('Could not send password reset email. Please try again later.', 500));
    }

    res.status(200).json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password using token
// @route   PUT /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { password, confirmPassword } = req.body;

    // Validate password
    if (!password) {
      return next(new ErrorResponse('Please provide a new password', 400));
    }

    if (password.length < 6) {
      return next(new ErrorResponse('Password must be at least 6 characters', 400));
    }

    if (confirmPassword && password !== confirmPassword) {
      return next(new ErrorResponse('Passwords do not match', 400));
    }

    // Hash the raw token from the URL
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    // Find user with matching hashed token and non-expired expiry
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpire: { $gt: Date.now() },
    }).select('+passwordResetToken +passwordResetExpire');

    if (!user) {
      return next(new ErrorResponse('Invalid or expired password reset link', 400));
    }

    // Set new password and clear reset fields
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;

    // If user was unverified (edge case), resetting proves email ownership
    if (!user.isEmailVerified) {
      user.isEmailVerified = true;
      user.emailVerifiedAt = Date.now();
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now log in with your new password.',
    });
  } catch (error) {
    next(error);
  }
};