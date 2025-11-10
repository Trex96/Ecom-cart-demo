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
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch external products');
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
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch external product');
  }
};

export default {
  getAllExternalProducts,
  getExternalProductById
};