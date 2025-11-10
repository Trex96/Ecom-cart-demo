const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById
} = require('../controllers/productController');

// GET /api/products - Get all products
router.get('/', getProducts);

// GET /api/products/:id - Get product by ID
router.get('/:id', getProductById);

module.exports = router;