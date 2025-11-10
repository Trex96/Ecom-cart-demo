const asyncHandler = require('../middleware/asyncHandler');
const { getFakeStoreProducts } = require('../services/fakeStoreService');

// @desc    Get products from Fake Store API
// @route   GET /api/products/external
// @access  Public
const getExternalProducts = asyncHandler(async (req, res) => {
  try {
    const products = await getFakeStoreProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = {
  getExternalProducts
};