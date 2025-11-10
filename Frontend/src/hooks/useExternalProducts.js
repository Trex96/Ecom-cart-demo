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
      const data = await externalProductService.getAllExternalProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch external products';
      setError(errorMessage);
      toast.error(`Failed to load external products: ${errorMessage}`);
      setProducts([]);
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