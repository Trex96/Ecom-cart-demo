const asyncHandler = require('../middleware/asyncHandler');
const { getFakeStoreProducts, getFakeStoreProductById } = require('../services/fakeStoreService');

// @desc    Get products from Fake Store API
// @route   GET /api/products/external
// @access  Public
const getExternalProducts = asyncHandler(async (req, res) => {
  try {
    console.log('Fetching external products from Fake Store API');
    const products = await getFakeStoreProducts();
    console.log('External products fetched successfully, count:', products.length);
    res.json(products);
  } catch (error) {
    console.error('Error in getExternalProducts:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @desc    Get single product from Fake Store API by ID
// @route   GET /api/products/external/:id
// @access  Public
const getExternalProductById = asyncHandler(async (req, res) => {
  try {
    console.log('Fetching external product by ID:', req.params.id);
    // Validate that the ID is a number
    if (isNaN(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID format'
      });
    }
    
    const productId = parseInt(req.params.id);
    const product = await getFakeStoreProductById(productId);
    
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({
        success: false,
        error: 'External product not found'
      });
    }
  } catch (error) {
    console.error('Error in getExternalProductById:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = {
  getExternalProducts,
  getExternalProductById
};