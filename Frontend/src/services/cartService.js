import api from './api';

/**
 * Cart Service - Handles all cart-related API calls
 * @namespace CartService
 */

/**
 * Get the current user's cart
 * @returns {Promise<Object>} Promise that resolves to the cart object
 * @throws {Error} Throws an error if the request fails
 */
export const getCart = async (userId = 'guest-user') => {
  try {
    const response = await api.get(`/cart?userId=${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch cart');
  }
};

/**
 * Add an item to the cart
 * @param {string|number} productId - The ID of the product to add
 * @param {number} quantity - The quantity to add
 * @param {string} userId - The user ID (defaults to 'guest-user')
 * @returns {Promise<Object>} Promise that resolves to the updated cart
 * @throws {Error} Throws an error if the request fails
 */
export const addToCart = async (productId, quantity, userId = 'guest-user') => {
  try {
    // For external products, we need to handle the ID differently
    // The backend will need to know if this is an external product
    const isExternalProduct = typeof productId === 'number' || 
                             (typeof productId === 'string' && !productId.match(/^[0-9a-fA-F]{24}$/));
    
    const payload = {
      productId,
      quantity,
      isExternal: isExternalProduct,
      userId // In a real app, this would come from auth context
    };
    
    const response = await api.post('/cart', payload);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Failed to add item to cart');
  }
};

/**
 * Update an item in the cart
 * @param {string} itemId - The ID of the cart item to update
 * @param {number} quantity - The new quantity
 * @param {string} userId - The user ID (defaults to 'guest-user')
 * @returns {Promise<Object>} Promise that resolves to the updated cart
 * @throws {Error} Throws an error if the request fails
 */
export const updateCartItem = async (itemId, quantity, userId = 'guest-user') => {
  try {
    const response = await api.put(`/cart/${itemId}`, { quantity, userId });
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Failed to update cart item');
  }
};

/**
 * Remove an item from the cart
 * @param {string} itemId - The ID of the cart item to remove
 * @param {string} userId - The user ID (defaults to 'guest-user')
 * @returns {Promise<Object>} Promise that resolves to the updated cart
 * @throws {Error} Throws an error if the request fails
 */
export const removeFromCart = async (itemId, userId = 'guest-user') => {
  try {
    const response = await api.delete(`/cart/${itemId}`, {
      data: { userId }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Failed to remove item from cart');
  }
};

/**
 * Clear all items from the cart
 * @param {string} userId - The user ID (defaults to 'guest-user')
 * @returns {Promise<Object>} Promise that resolves to the cleared cart
 * @throws {Error} Throws an error if the request fails
 */
export const clearCart = async (userId = 'guest-user') => {
  try {
    const response = await api.delete('/cart', {
      data: { userId }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Failed to clear cart');
  }
};