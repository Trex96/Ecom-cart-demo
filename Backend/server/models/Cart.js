const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.Mixed, 
    required: true
  },
  quantity: {
    type: Number,
    min: 1
  },
  price: {
    type: Number
  }
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: 'guest-user'
  },
  items: [cartItemSchema],
  totalAmount: {
    type: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Cart', cartSchema);