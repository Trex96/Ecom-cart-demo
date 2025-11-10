const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');
const { validateCartItemMixed, handleValidationErrors } = require('../middleware/validators');
const { getFakeStoreProductById } = require('../services/fakeStoreService');

// Function to enhance cart items with product details
const enhanceCartItems = async (cartItems) => {
  const enhancedItems = [];
  let totalAmount = 0;
  
  for (const item of cartItems) {
    // Check if this is an external product (number or non-ObjectId string)
    const isExternalProduct = typeof item.productId === 'number' || 
                             (typeof item.productId === 'string' && !item.productId.match(/^[0-9a-fA-F]{24}$/));
    
    if (isExternalProduct) {
      try {
        // For external products, fetch actual product details from external API
        const externalProductId = typeof item.productId === 'string' ? parseInt(item.productId) : item.productId;
        const externalProduct = await getFakeStoreProductById(externalProductId);
        
        if (externalProduct) {
          enhancedItems.push({
            ...item.toObject ? item.toObject() : item,
            productId: {
              _id: externalProduct.id,
              id: externalProduct.id,
              name: externalProduct.name,
              price: externalProduct.price,
              image: externalProduct.image,
              description: externalProduct.description,
              category: externalProduct.category
            },
            price: externalProduct.price // Update the item price
          });
          totalAmount += externalProduct.price * item.quantity;
        } else {
          // If external product not found, use placeholder
          enhancedItems.push({
            ...item.toObject ? item.toObject() : item,
            productId: {
              _id: item.productId,
              id: item.productId,
              name: `External Product ${item.productId}`,
              price: item.price || 0,
              image: 'https://via.placeholder.com/150x150?text=External+Product'
            }
          });
          totalAmount += (item.price || 0) * item.quantity;
        }
      } catch (error) {
        console.error('Error fetching external product:', error);
        // If there's an error fetching external product, use placeholder
        enhancedItems.push({
          ...item.toObject ? item.toObject() : item,
          productId: {
            _id: item.productId,
            id: item.productId,
            name: `External Product ${item.productId}`,
            price: item.price || 0,
            image: 'https://via.placeholder.com/150x150?text=External+Product'
          }
        });
        totalAmount += (item.price || 0) * item.quantity;
      }
    } else {
      // For local products, populate from database
      const product = await Product.findById(item.productId);
      if (product) {
        enhancedItems.push({
          ...item.toObject ? item.toObject() : item,
          productId: {
            ...product.toObject(),
            image: product.image || 'https://via.placeholder.com/150x150?text=Product+Image' // Add default image for local products
          }
        });
        totalAmount += product.price * item.quantity;
      } else {
        // If product not found, keep the item but mark it
        enhancedItems.push({
          ...item.toObject ? item.toObject() : item,
          productId: {
            _id: item.productId,
            name: 'Product not found',
            price: 0,
            image: 'https://via.placeholder.com/150x150?text=Product+Not+Found'
          }
        });
      }
    }
  }
  
  return { enhancedItems, totalAmount };
};

// @desc    Get cart for userId (use 'guest-user' if not provided)
// @route   GET /api/cart
// @access  Public
const getCart = asyncHandler(async (req, res) => {
  const userId = req.query.userId || 'guest-user';
  
  // Find or create cart
  let cart = await Cart.findOne({ userId });
  
  if (!cart) {
    // Create new cart if doesn't exist
    cart = await Cart.create({ userId, items: [] });
  }
  
  // Enhance cart items with product details
  const { enhancedItems, totalAmount } = await enhanceCartItems(cart.items);
  
  // Add totalAmount and enhanced items to cart object
  const cartResponse = {
    ...cart.toObject(),
    items: enhancedItems,
    totalAmount: totalAmount
  };
  
  res.json(cartResponse);
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Public
const addToCart = [
  // Use the mixed validation that allows both ObjectId and external IDs
  validateCartItemMixed,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { productId, quantity, isExternal } = req.body;
    const userId = req.body.userId || 'guest-user';
    
    let product = null;
    
    if (isExternal) {
      // For external products, fetch actual product details
      try {
        const externalProductId = typeof productId === 'string' ? parseInt(productId) : productId;
        product = await getFakeStoreProductById(externalProductId);
        if (!product) {
          return res.status(404).json({ 
            success: false,
            error: 'External product not found' 
          });
        }
      } catch (error) {
        console.error('Error fetching external product:', error);
        return res.status(500).json({ 
          success: false,
          error: 'Failed to fetch external product details' 
        });
      }
    } else {
      // Check if product exists in our database
      product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ 
          success: false,
          error: 'Product not found' 
        });
      }
    }
    
    // Check if cart exists for user
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      // Create new cart
      cart = new Cart({ userId, items: [] });
    }
    
    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.productId && item.productId.toString() === productId.toString()
    );
    
    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        productId: productId,
        quantity: quantity,
        price: product.price || 0 // Use actual price for external products
      });
    }
    
    // Calculate total amount
    let totalAmount = 0;
    cart.items.forEach(item => {
      if (item.price) {
        totalAmount += item.price * item.quantity;
      }
    });
    
    cart.totalAmount = totalAmount;
    
    // Save cart
    const updatedCart = await cart.save();
    
    // Enhance cart items with product details
    const { enhancedItems, totalAmount: enhancedTotalAmount } = await enhanceCartItems(updatedCart.items);
    
    // Add totalAmount and enhanced items to cart object
    const cartResponse = {
      ...updatedCart.toObject(),
      items: enhancedItems,
      totalAmount: enhancedTotalAmount
    };
    
    res.status(201).json(cartResponse);
  })
];

// @desc    Update item quantity in cart
// @route   PUT /api/cart/:itemId
// @access  Public
const updateCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  const userId = req.body.userId || 'guest-user';
  
  // Find cart
  const cart = await Cart.findOne({ userId });
  
  if (!cart) {
    return res.status(404).json({ 
      success: false,
      error: 'Cart not found' 
    });
  }
  
  // Find item in cart - improved ID comparison
  const itemIndex = cart.items.findIndex(item => {
    // Handle different ID types (ObjectId, string, number)
    if (item._id) {
      return item._id.toString() === itemId;
    }
    return false;
  });
  
  if (itemIndex === -1) {
    return res.status(404).json({ 
      success: false,
      error: 'Item not found in cart' 
    });
  }
  
  if (quantity <= 0) {
    // Remove item if quantity is 0 or less
    cart.items.splice(itemIndex, 1);
  } else {
    // Update quantity
    cart.items[itemIndex].quantity = quantity;
  }
  
  // Calculate total amount
  let totalAmount = 0;
  cart.items.forEach(item => {
    if (item.price) {
      totalAmount += item.price * item.quantity;
    }
  });
  
  cart.totalAmount = totalAmount;
  
  // Save cart
  const updatedCart = await cart.save();
  
  // Enhance cart items with product details
  const { enhancedItems, totalAmount: enhancedTotalAmount } = await enhanceCartItems(updatedCart.items);
  
  // Add totalAmount and enhanced items to cart object
  const cartResponse = {
    ...updatedCart.toObject(),
    items: enhancedItems,
    totalAmount: enhancedTotalAmount
  };
  
  res.json(cartResponse);
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Public
const removeFromCart = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const userId = req.body.userId || 'guest-user';
  
  console.log(`Attempting to remove item ${itemId} from cart for user ${userId}`);
  
  // Find cart
  const cart = await Cart.findOne({ userId });
  
  if (!cart) {
    console.log(`Cart not found for user ${userId}`);
    return res.status(404).json({ 
      success: false,
      error: 'Cart not found' 
    });
  }
  
  console.log(`Found cart with ${cart.items.length} items`);
  
  // Find item in cart - improved ID comparison
  const itemIndex = cart.items.findIndex(item => {
    // Handle different ID types (ObjectId, string, number)
    if (item._id) {
      const match = item._id.toString() === itemId;
      console.log(`Comparing item._id (${item._id.toString()}) with itemId (${itemId}): ${match}`);
      return match;
    }
    console.log(`Item has no _id property`);
    return false;
  });
  
  console.log(`Item index found: ${itemIndex}`);
  
  if (itemIndex === -1) {
    return res.status(404).json({ 
      success: false,
      error: 'Item not found in cart' 
    });
  }
  
  // Remove item
  cart.items.splice(itemIndex, 1);
  
  // Calculate total amount
  let totalAmount = 0;
  cart.items.forEach(item => {
    if (item.price) {
      totalAmount += item.price * item.quantity;
    }
  });
  
  cart.totalAmount = totalAmount;
  
  // Save cart
  const updatedCart = await cart.save();
  
  // Enhance cart items with product details
  const { enhancedItems, totalAmount: enhancedTotalAmount } = await enhanceCartItems(updatedCart.items);
  
  // Add totalAmount and enhanced items to cart object
  const cartResponse = {
    ...updatedCart.toObject(),
    items: enhancedItems,
    totalAmount: enhancedTotalAmount
  };
  
  res.json(cartResponse);
});

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Public
const clearCart = asyncHandler(async (req, res) => {
  const userId = req.body.userId || 'guest-user';
  
  // Find cart
  const cart = await Cart.findOne({ userId });
  
  if (!cart) {
    return res.status(404).json({ 
      success: false,
      error: 'Cart not found' 
    });
  }
  
  // Clear items and reset total
  cart.items = [];
  cart.totalAmount = 0;
  
  // Save cart
  const updatedCart = await cart.save();
  
  // Enhance cart items with product details (will be empty array)
  const { enhancedItems, totalAmount: enhancedTotalAmount } = await enhanceCartItems(updatedCart.items);
  
  // Add totalAmount and enhanced items to cart object
  const cartResponse = {
    ...updatedCart.toObject(),
    items: enhancedItems,
    totalAmount: enhancedTotalAmount
  };
  
  res.json(cartResponse);
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};