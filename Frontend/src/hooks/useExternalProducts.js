import { useState, useEffect } from 'react';
import { externalProductService } from '../services';
import { toast } from 'react-toastify';

const useExternalProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchExternalProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await externalProductService.getAllExternalProducts();
      
      // Handle both direct array response and object with data property
      let productsData = [];
      if (Array.isArray(response)) {
        productsData = response;
      } else if (response && response.data) {
        productsData = Array.isArray(response.data) ? response.data : [];
      } else if (response && Array.isArray(response.products)) {
        productsData = response.products;
      }
      
      setProducts(productsData);
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch external products';
      setError(errorMessage);
      toast.error(`Failed to load external products: ${errorMessage}`);
      setProducts([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchExternalProducts();
  };

  return {
    products,
    loading,
    error,
    refetch: fetchExternalProducts
  };
};

export default useExternalProducts;