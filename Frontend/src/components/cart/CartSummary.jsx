import React from 'react';
import { Link } from 'react-router-dom';

const CartSummary = ({ totalAmount, itemCount }) => {
  // Ensure totalAmount is a number and has a default value
  const formattedTotal = typeof totalAmount === 'number' ? totalAmount.toFixed(2) : '0.00';
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-24 border border-gray-200">
      <h2 className="text-xl font-semibold mb-6 text-gray-900">Order Summary</h2>
      
      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900 font-medium">${formattedTotal}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="text-gray-900 font-medium">Free</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Tax</span>
          <span className="text-gray-900 font-medium">$0.00</span>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between text-lg font-bold">
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900">${formattedTotal}</span>
          </div>
        </div>
      </div>
      
      <Link
        to="/checkout"
        className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md text-center transition-colors btn-hover"
      >
        Proceed to Checkout
      </Link>
      
      <div className="mt-4 text-center">
        <Link 
          to="/products" 
          className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default CartSummary;