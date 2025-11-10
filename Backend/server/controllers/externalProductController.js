const asyncHandler = require('../middleware/asyncHandler');
const { getFakeStoreProducts, getFakeStoreProductById } = require('../services/fakeStoreService');

// @desc    Get products from Fake Store API
// @route   GET /api/products/external
// @access  Public
const getExternalProducts = asyncHandler(async (req, res) => {
  try {
    console.log('Fetching external products from Fake Store API');
    const products = await getFakeStoreProducts();
    
    // Even if we get an empty array, we still return success
    console.log('External products fetched, count:', products.length);
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error in getExternalProducts:', error);
    console.error('Error stack:', error.stack);
    // Return empty array instead of error to prevent frontend breaking
    res.status(200).json({
      success: true,
      count: 0,
      data: [],
      message: 'External API temporarily unavailable'
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
    // Validate that the ID is in our expected range
    if (productId < 1001) {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID range'
      });
    }
    
    const product = await getFakeStoreProductById(productId);
    
    if (product) {
      res.status(200).json({
        success: true,
        data: product
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'External product not found'
      });
    }
  } catch (error) {
    console.error('Error in getExternalProductById:', error);
    console.error('Error stack:', error.stack);
    // Handle specific error cases
    if (error.message.includes('HTML')) {
      res.status(502).json({
        success: false,
        error: 'External API unavailable',
        message: 'The external product API is currently returning invalid data'
      });
    } else if (error.message.includes('403')) {
      res.status(503).json({
        success: false,
        error: 'External API access forbidden',
        message: 'Access to the external product API is currently blocked'
      });
    } else if (error.message.includes('Network')) {
      res.status(502).json({
        success: false,
        error: 'External API connection failed',
        message: 'Unable to connect to the external product API'
      });
    } else if (error.message.includes('404') || error.message.includes('not found') || error.message.includes('Invalid product ID')) {
      res.status(404).json({
        success: false,
        error: 'External product not found',
        message: 'The requested product could not be found'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch external product',
        message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
      });
    }
  }
});

module.exports = {
  getExternalProducts,
  getExternalProductById
};