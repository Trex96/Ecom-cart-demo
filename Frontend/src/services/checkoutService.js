import api from './api';

/**
 * Checkout Service - Handles all checkout-related API calls
 * @namespace CheckoutService
 */

/**
 * Process a checkout
 * @param {Object} checkoutData - The checkout data including user info and payment details
 * @returns {Promise<Object>} Promise that resolves to the order confirmation
 * @throws {Error} Throws an error if the request fails
 */
export const processCheckout = async (checkoutData) => {
  try {
    const response = await api.post('/checkout', checkoutData);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Failed to process checkout');
  }
};

/**
 * Get order details by ID
 * @param {string} orderId - The order ID
 * @returns {Promise<Object>} Promise that resolves to the order details
 * @throws {Error} Throws an error if the request fails
 */
export const getOrder = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch order');
  }
};