const express = require('express');
const router = express.Router();
const {
  processCheckout,
  getOrderById
} = require('../controllers/checkoutController');

// POST /api/checkout - Process checkout
router.post('/', processCheckout);

// GET /api/orders/:orderId - Get order by ID
router.get('/:orderId', getOrderById);

module.exports = router;