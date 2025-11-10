const Order = require('../models/Order');
const Cart = require('../models/Cart');
const asyncHandler = require('../middleware/asyncHandler');
const { validateCheckout, handleValidationErrors } = require('../middleware/validators');

// Generate a unique order ID
const generateOrderId = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD-${timestamp}-${random}`;
};

// @desc    Process checkout
// @route   POST /api/checkout
// @access  Public
const processCheckout = [
  validateCheckout,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { customerName, customerEmail } = req.body;
    const userId = req.body.userId || 'guest-user';
    
    // Find cart for user
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(400).json({
        success: false,
        error: 'Cart not found'
      });
    }
    
    if (!cart.items || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Cart is empty'
      });
    }
    
    // Generate order ID
    const orderId = generateOrderId();
    
    // Transform cart items to order items
    const orderItems = cart.items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price || 0,
      name: typeof item.productId === 'object' && item.productId.name ? 
            item.productId.name : `Product ${item.productId}`
    }));
    
    // Create order
    const order = await Order.create({
      orderId,
      customerName,
      customerEmail,
      items: orderItems,
      totalAmount: cart.totalAmount || 0
    });
    
    // Clear the cart
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();
    
    // Return order confirmation
    res.status(201).json({
      success: true,
      message: 'Order processed successfully',
      order: {
        orderId: order.orderId,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        items: order.items,
        totalAmount: order.totalAmount,
        orderDate: order.orderDate,
        confirmationMessage: 'Thank you for your order! A confirmation email has been sent to your email address.'
      }
    });
  })
];

// @desc    Get order by ID
// @route   GET /api/checkout/:orderId (fixed the route comment)
// @access  Public
const getOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  
  const order = await Order.findOne({ orderId });
  
  if (!order) {
    return res.status(404).json({
      success: false,
      error: 'Order not found'
    });
  }
  
  res.json({
    success: true,
    order
  });
});

module.exports = {
  processCheckout,
  getOrderById
};