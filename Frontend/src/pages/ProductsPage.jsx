import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import useProducts from '../hooks/useProducts';
import useExternalProducts from '../hooks/useExternalProducts';
import ProductGrid from '../components/common/ProductGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const ProductsPage = () => {
  const [activeTab, setActiveTab] = useState('local'); 
  const { addItemToCart, loading: cartLoading } = useCart();
  
  const { 
    products: localProducts, 
    loading: localLoading, 
    error: localError, 
    refetch: refetchLocal 
  } = useProducts();
  

  const { 
    products: externalProducts, 
    loading: externalLoading, 
    error: externalError, 
    refetch: refetchExternal 
  } = useExternalProducts();
  
  const handleAddToCart = async (product, isExternal = false) => {
    try {
      const productId = isExternal ? product.id : product._id;
      await addItemToCart(productId, 1);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };
  
  const handleFetchExternalProducts = () => {
    refetchExternal();
  };

  const renderTabContent = () => {
    if (activeTab === 'local') {
      if (localLoading) return <LoadingSpinner />;
      if (localError) return <ErrorMessage message={localError} onRetry={refetchLocal} />;
      
      return (
        <ProductGrid 
          products={localProducts} 
          onAddToCart={(product) => handleAddToCart(product, false)}
          loading={cartLoading}
        />
      );
    } else {
      return (
        <div>
          <div className="mb-6">
            <button
              onClick={handleFetchExternalProducts}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
              disabled={externalLoading}
            >
              {externalLoading ? 'Loading...' : 'Load External Products'}
            </button>
          </div>
          
          {externalLoading && <LoadingSpinner />}
          {externalError && <ErrorMessage message={externalError} onRetry={refetchExternal} />}
          
          {!externalLoading && !externalError && (
            <ProductGrid 
              products={externalProducts} 
              onAddToCart={(product) => handleAddToCart(product, true)}
              loading={cartLoading}
              isExternal={true}
            />
          )}
        </div>
      );
    }
  };

  return (
    <div className="px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Products</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Browse our collection of high-quality products
        </p>
      </div>

      <div className="flex border-b border-gray-200 mb-8">
        <button
          className={`py-2 px-4 font-medium text-sm md:text-base ${
            activeTab === 'local'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('local')}
        >
          Local Products
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm md:text-base ${
            activeTab === 'external'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('external')}
        >
          External Products
        </button>
      </div>

      {renderTabContent()}
    </div>
  );
};

export default ProductsPage;