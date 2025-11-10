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
        console.log(product)
        const isExternal = typeof product.id === 'number' || 
                          (typeof product.id === 'string' && !product.id.match(/^[0-9a-fA-F]{24}$/));
        
        return {
          name: product.name || product.title || `Product ${product._id || product.id || 'N/A'}`,
          image: product.image || 
                 (isExternal ? 'https://fakestoreapi.com/icons/logo.png' : 
                               'https://via.placeholder.com/150x150?text=Product+Image'),
          price: item.price || product.price || 0
        };
      }
      
      // Fallback: check if item itself has product details
      return {
        name: item.name || item.title || `Product ${item.productId || 'N/A'}`,
        image: item.image || 'https://via.placeholder.com/150x150?text=Product+Image',
        price: item.price || 0
      };
    } catch (error) {
      // Final fallback
      return {
        name: `Product ${item.productId || 'N/A'}`,
        image: 'https://via.placeholder.com/150x150?text=Product+Image',
        price: item.price || 0
      };
    }
  };

  // Get product details
  const productDetails = getProductDetails(item);
  const { name: productName, image: productImage, price: productPrice } = productDetails;

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    
    setQuantity(newQuantity);
    setIsUpdating(true);
    
    try {
      await onUpdateQuantity(item._id, newQuantity);
    } catch (error) {
      // Revert on error
      setQuantity(item.quantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    try {
      await onRemove(item._id);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  // Format prices to 2 decimal places
  const formattedPrice = typeof productPrice === 'number' ? productPrice.toFixed(2) : '0.00';
  const totalPrice = typeof productPrice === 'number' ? (productPrice * quantity).toFixed(2) : '0.00';

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
                              (typeof item.productId === 'string' && !item.productId.match(/^[0-9a-fA-F]{24}$/));
            
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
            <h3 className="font-semibold text-gray-900 text-lg">{productName}</h3>
            <p className="text-gray-600 mt-1">
              ${formattedPrice} × {quantity} = ${totalPrice}
            </p>
          </div>
          
          {/* Quantity Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-gray-300 rounded-md bg-white">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={isUpdating || quantity <= 1}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-md"
              >
                -
              </button>
              <span className="px-3 py-1 text-gray-900 min-w-[3rem] text-center">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={isUpdating}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-md"
              >
                +
              </button>
            </div>
            
            {/* Remove Button */}
            <button
              onClick={handleRemove}
              disabled={isUpdating}
              className="p-2 text-gray-500 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-full hover:bg-red-50"
              aria-label="Remove item"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;