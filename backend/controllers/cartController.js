const Cart = require('../models/Cart');
const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product', 'name price images stock category gender');

    if (!cart) {
      // Create empty cart if doesn't exist
      cart = await Cart.create({ 
        user: req.user.id, 
        items: [],
        totalAmount: 0
      });
    }

    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, size, quantity = 1 } = req.body;

    console.log('🛒 Adding to cart:', { productId, size, quantity, user: req.user.id });

    // Validate input
    if (!productId) {
      return next(new ErrorResponse('Product ID is required', 400));
    }

    if (!size) {
      return next(new ErrorResponse('Size is required', 400));
    }

    if (quantity < 1) {
      return next(new ErrorResponse('Quantity must be at least 1', 400));
    }

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    console.log('📦 Product found:', product.name);

    // Check if size is available
    if (!product.size.includes(size)) {
      return next(new ErrorResponse(`Size ${size} is not available for this product. Available sizes: ${product.size.join(', ')}`, 400));
    }

    // Check stock
    if (product.stock < quantity) {
      return next(new ErrorResponse(`Insufficient stock. Only ${product.stock} items available`, 400));
    }

    let cart = await Cart.findOne({ user: req.user.id });

    // Create cart if doesn't exist
    if (!cart) {
      console.log('🆕 Creating new cart for user');
      cart = await Cart.create({ 
        user: req.user.id, 
        items: [],
        totalAmount: 0
      });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId && item.size === size
    );

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      if (product.stock < newQuantity) {
        return next(new ErrorResponse(`Insufficient stock for the requested quantity. Only ${product.stock} items available`, 400));
      }

      cart.items[existingItemIndex].quantity = newQuantity;
      cart.items[existingItemIndex].price = product.price; // Update price in case it changed
      console.log('📝 Updated existing item quantity:', newQuantity);
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        size,
        quantity,
        price: product.price
      });
      console.log('🆕 Added new item to cart');
    }

    // Save cart (this will trigger the pre-save middleware to calculate totalAmount)
    await cart.save();

    // Populate product details for response
    await cart.populate('items.product', 'name price images stock category gender');

    console.log('✅ Cart saved successfully. Total items:', cart.items.length);

    res.status(200).json({
      success: true,
      message: 'Item added to cart successfully',
      cart
    });
  } catch (error) {
    console.error('❌ Error in addToCart:', error);
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:itemId
// @access  Private
exports.updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    console.log('📝 Updating cart item:', { itemId, quantity });

    if (!quantity || quantity < 1) {
      return next(new ErrorResponse('Quantity must be at least 1', 400));
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return next(new ErrorResponse('Cart not found', 404));
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return next(new ErrorResponse('Item not found in cart', 404));
    }

    // Check product stock
    const product = await Product.findById(item.product);
    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    if (product.stock < quantity) {
      return next(new ErrorResponse(`Insufficient stock. Only ${product.stock} items available`, 400));
    }

    // Update quantity and price
    item.quantity = quantity;
    item.price = product.price; // Update price in case it changed

    // Save cart (totalAmount will be calculated automatically by pre-save middleware)
    await cart.save();

    await cart.populate('items.product', 'name price images stock category gender');

    console.log('✅ Cart item updated successfully');

    res.status(200).json({
      success: true,
      message: 'Cart item updated successfully',
      cart
    });
  } catch (error) {
    console.error('❌ Error in updateCartItem:', error);
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:itemId
// @access  Private
exports.removeFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    console.log('🗑️ Removing cart item:', itemId);

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return next(new ErrorResponse('Cart not found', 404));
    }

    // Remove item by ID
    const item = cart.items.id(itemId);
    if (!item) {
      return next(new ErrorResponse('Item not found in cart', 404));
    }

    cart.items.pull(itemId);

    // Save cart (totalAmount will be calculated automatically by pre-save middleware)
    await cart.save();

    await cart.populate('items.product', 'name price images stock category gender');

    console.log('✅ Item removed from cart');

    res.status(200).json({
      success: true,
      message: 'Item removed from cart successfully',
      cart
    });
  } catch (error) {
    console.error('❌ Error in removeFromCart:', error);
    next(error);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res, next) => {
  try {
    console.log('🧹 Clearing cart for user:', req.user.id);

    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return next(new ErrorResponse('Cart not found', 404));
    }

    // Clear all items
    cart.items = [];
    
    await cart.save();

    console.log('✅ Cart cleared successfully');

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      cart
    });
  } catch (error) {
    console.error('❌ Error in clearCart:', error);
    next(error);
  }
};

// @desc    Get cart count
// @route   GET /api/cart/count
// @access  Private
exports.getCartCount = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(200).json({
        success: true,
        count: 0,
        totalQuantity: 0
      });
    }

    const totalQuantity = cart.items.reduce((total, item) => total + item.quantity, 0);

    res.status(200).json({
      success: true,
      count: cart.items.length,
      totalQuantity
    });
  } catch (error) {
    next(error);
  }
};