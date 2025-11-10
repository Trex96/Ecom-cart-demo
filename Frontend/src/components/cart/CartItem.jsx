import React, { useState } from 'react';
import { X } from 'lucide-react';

const CartItem = ({ item, onRemove, onUpdateQuantity }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);

  // Function to safely get product details with better fallback handling
  const getProductDetails = (item) => {
    try {
      // Check if productId is an object (enhanced product from backend)
      if (typeof item.productId === 'object' && item.productId !== null) {
        const product = item.productId;
        // Determine if this is an external product based on ID type
        const isExternal = typeof product.id === 'number' || 
                          (typeof product.id === 'string' && !product.id.match(/^[0-9a-fA-F]{24}$/));
        
        return {
          name: product.name || product.title || `Product ${product._id || product.id || 'N/A'}`,
          image: product.image || 
                 (isExternal ? 'https://fakestoreapi.com/icons/logo.png' : 
                               'https://via.placeholder.com/150x150?text=Product+Image'),
          price: product.price || 0
        };
      }
      
      // Fallback: check if item itself has product details
      return {
        name: item.name || item.title || `Product ${item.productId || 'N/A'}`,
        image: item.image || 'https://fakestoreapi.com/icons/logo.png',
        price: item.price || 0
      };
    } catch (error) {
      // Final fallback
      return {
        name: `Product ${item.productId || 'N/A'}`,
        image: 'https://fakestoreapi.com/icons/logo.png',
        price: item.price || 0
      };
    }
  };

  const productDetails = getProductDetails(item);
  const productName = productDetails.name;
  const productImage = productDetails.image;
  const productPrice = productDetails.price;

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) newQuantity = 1;
    if (newQuantity > 99) newQuantity = 99;
    
    setQuantity(newQuantity);
    
    if (onUpdateQuantity) {
      setIsUpdating(true);
      onUpdateQuantity(item._id, newQuantity)
        .finally(() => setIsUpdating(false));
    }
  };

  return (
    <div className="p-6 flex flex-col sm:flex-row items-center gap-4 slide-in-right bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Product Image */}
      <div className="flex-shrink-0">
        <img
          src={productImage}
          alt={productName}
          className="w-24 h-24 object-contain rounded-md border border-gray-200 bg-white p-2"
          onError={(e) => {
            // Try different fallback images based on product type
            const isExternal = typeof item.productId === 'number' || 
                              (typeof item.productId === 'string' && !item.productId.match(/^[0-9a-fA-F]{24}$/)) ||
                              (typeof item.productId === 'object' && item.productId && 
                               (typeof item.productId.id === 'number' || 
                                (typeof item.productId.id === 'string' && !item.productId.id.match(/^[0-9a-fA-F]{24}$/))));
            
            if (isExternal) {
              e.target.src = 'https://fakestoreapi.com/icons/logo.png';
            } else {
              e.target.src = 'https://via.placeholder.com/150x150?text=Product+Image';
            }
          }}
        />
      </div>
      
      <div className="flex-grow w-full">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          {/* Product Info */}
          <div className="flex-grow">
            <h3 className="font-medium text-gray-900">{productName}</h3>
            <p className="text-lg font-semibold text-indigo-600 mt-1">${productPrice.toFixed(2)}</p>
          </div>
          
          {/* Quantity Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                disabled={isUpdating || quantity <= 1}
              >
                -
              </button>
              <span className="px-3 py-1 w-12 text-center">
                {isUpdating ? '...' : quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                disabled={isUpdating || quantity >= 99}
              >
                +
              </button>
            </div>
            
            <button
              onClick={() => onRemove(item._id)}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              aria-label="Remove item"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        {/* Total for this item */}
        <div className="mt-2 text-right">
          <p className="text-sm text-gray-500">
            Total: <span className="font-semibold">${(productPrice * quantity).toFixed(2)}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartItem;