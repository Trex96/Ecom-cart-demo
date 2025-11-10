import React, { useState, useEffect } from 'react';
import { productService, cartService, checkoutService, handleApiError } from './services';


const TestServices = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await cartService.getCart();
      setCart(data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCart = await cartService.addToCart(productId, 1);
      setCart(updatedCart);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">API Services Test</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}
      
      {loading && (
        <div className="text-center py-4">Loading...</div>
      )}
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Products</h2>
        <button 
          onClick={fetchProducts}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          Refresh Products
        </button>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product._id} className="border p-4 rounded">
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-gray-600">${product.price}</p>
              <button 
                onClick={() => handleAddToCart(product._id)}
                className="mt-2 bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded text-sm"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">Cart</h2>
        <button 
          onClick={fetchCart}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          Refresh Cart
        </button>
        
        {cart && (
          <div className="border p-4 rounded">
            <p>Total Items: {cart.items?.length || 0}</p>
            <p>Total Amount: ${cart.totalAmount || 0}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestServices;