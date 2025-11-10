import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';

const ProductCard = ({ product, onAddToCart, loading, isExternal = false }) => {
  const [isAdding, setIsAdding] = useState(false);
  
  const handleAddToCart = async () => {
    if (loading || isAdding) return;
    
    setIsAdding(true);
    try {
      await onAddToCart(product);
    } finally {
      setIsAdding(false);
    }
  };

  const productId = isExternal ? product.id : product._id;
  
  const imageUrl = product.image || 
                   (isExternal ? 'https://fakestoreapi.com/icons/logo.png' : null) || 
                   'https://via.placeholder.com/300x300?text=Product+Image';
  

  const productName = product.title || product.name;
  

  const productPrice = product.price;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 card-hover">
      <div className="relative pb-[100%]"> 
        <img
          src={imageUrl}
          alt={productName}
          className="absolute h-full w-full object-cover"
          onError={(e) => {
            // Use appropriate fallback image based on product type
            if (isExternal) {
              e.target.src = 'https://fakestoreapi.com/icons/logo.png';
            } else {
              e.target.src = 'https://via.placeholder.com/300x300?text=Product+Image';
            }
          }}
        />
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 h-12">
          {productName}
        </h3>
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-lg font-bold text-indigo-600">
            ${productPrice?.toFixed(2)}
          </span>
          
          <button
            onClick={handleAddToCart}
            disabled={loading || isAdding}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-3 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            <ShoppingCart size={16} />
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;