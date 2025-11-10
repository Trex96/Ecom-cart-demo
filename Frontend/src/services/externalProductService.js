import api from './api';

/**
 * External Product Service - Handles all external product-related API calls
 * @namespace ExternalProductService
 */

/**
 * Fetch all external products from Fake Store API
 * @returns {Promise<Array>} Promise that resolves to an array of products
 * @throws {Error} Throws an error if the request fails
 */
export const getAllExternalProducts = async () => {
  try {
    const response = await api.get('/products/external');
    
    // Handle different response formats
    if (response.data && response.data.data) {
      // If response has a data wrapper
      return Array.isArray(response.data.data) ? response.data.data : [];
    } else if (response.data && Array.isArray(response.data)) {
      // If response is directly an array
      return response.data;
    } else if (response.data && response.data.products) {
      // If response has a products property
      return Array.isArray(response.data.products) ? response.data.products : [];
    } else {
      // Fallback to empty array
      return [];
    }
  } catch (error) {
    console.error('Error fetching external products:', error);
    // Return empty array instead of throwing error to prevent app crash
    return [];
  }
};

/**
 * Fetch a single external product by ID
 * @param {string|number} id - The product ID
 * @returns {Promise<Object>} Promise that resolves to a product object
 * @throws {Error} Throws an error if the request fails
 */
export const getExternalProductById = async (id) => {
  try {
    const response = await api.get(`/products/external/${id}`);
    
    // Handle different response formats
    if (response.data && response.data.data) {
      return response.data.data;
    } else {
      return response.data;
    }
  } catch (error) {
    console.error('Error fetching external product:', error);
    throw new Error(error.message || 'Failed to fetch external product');
  }
};

export default {
  getAllExternalProducts,
  getExternalProductById
};