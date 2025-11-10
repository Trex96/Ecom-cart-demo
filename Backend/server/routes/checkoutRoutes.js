const express = require('express');
const router = express.Router();
const {
  processCheckout,
  getOrderById
} = require('../controllers/checkoutController');

// POST /api/checkout - Process checkout
router.post('/', processCheckout);

// GET /api/checkout/:orderId - Get order by ID (fixed the path to match convention)
router.get('/:orderId', getOrderById);

module.exports = router;