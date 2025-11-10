const { body, param, validationResult } = require('express-validator');
const { isValidObjectId } = require('mongoose');


const validateObjectId = (value) => {
  if (!isValidObjectId(value)) {
    throw new Error('Invalid ID format');
  }
  return true;
};

const validateCartItemMixed = [
  body('productId')
    .notEmpty()
    .withMessage('Product ID is required'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer')
];


const validateProductId = [
  body('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .custom(validateObjectId)
    .withMessage('Invalid product ID format')
];


const validateCartItem = [
  body('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .custom(validateObjectId)
    .withMessage('Invalid product ID format'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer')
];


const validateCheckout = [
  body('customerName')
    .notEmpty()
    .withMessage('Customer name is required')
    .isLength({ min: 2 })
    .withMessage('Customer name must be at least 2 characters long'),
  body('customerEmail')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail()
];


const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({
      success: false,
      error: errorMessages.join(', ')
    });
  }
  next();
};

module.exports = {
  validateProductId,
  validateCartItem,
  validateCartItemMixed,
  validateCheckout,
  handleValidationErrors
};