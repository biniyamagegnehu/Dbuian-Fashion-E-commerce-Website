// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [function() { return this.authProvider === 'local'; }, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  phone: {
    type: String,
    trim: true
  },
  university: {
    type: String,
    default: 'Debre Berhan University'
  },
  studentId: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  address: {
    blockNumber: String,
    roomDormNumber: String
  },
  deliveryInfo: {
    phoneNumber: String,
    blockNumber: String,
    roomDormNumber: String
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  avatar: {
    type: String
  },
  // Legacy field — preserved for backward compatibility
  isVerified: {
    type: Boolean,
    default: false
  },
  // --- Email verification ---
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerifiedAt: {
    type: Date
  },
  emailVerificationToken: {
    type: String,
    select: false
  },
  emailVerificationExpire: {
    type: Date,
    select: false
  },
  // --- Password reset ---
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpire: {
    type: Date,
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role }, 
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Match user entered password with hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Generate a raw email verification token, store the hashed version,
 * set 24-hour expiry, and return the raw token to be sent via email.
 */
userSchema.methods.getEmailVerificationToken = function() {
  // Generate raw token
  const rawToken = crypto.randomBytes(32).toString('hex');

  // Hash and store — never store raw token
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(rawToken)
    .digest('hex');

  // Expire in 24 hours
  this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000;

  return rawToken;
};

/**
 * Generate a raw password reset token, store the hashed version,
 * set 15-minute expiry, and return the raw token to be sent via email.
 */
userSchema.methods.getPasswordResetToken = function() {
  // Generate raw token
  const rawToken = crypto.randomBytes(32).toString('hex');

  // Hash and store — never store raw token
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(rawToken)
    .digest('hex');

  // Expire in 15 minutes
  this.passwordResetExpire = Date.now() + 15 * 60 * 1000;

  return rawToken;
};

module.exports = mongoose.model('User', userSchema);