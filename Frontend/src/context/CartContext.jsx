import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-toastify';
import { cartService, handleApiError } from '../services';

const initialState = {
  items: [],
  totalAmount: 0,
  itemCount: 0,
  loading: false,
  error: null
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_CART_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case 'FETCH_CART_SUCCESS':
      return {
        ...state,
        loading: false,
        items: action.payload.items || [],
        totalAmount: action.payload.totalAmount || 0,
        itemCount: action.payload.items?.reduce((count, item) => count + item.quantity, 0) || 0,
        error: null
      };
    
    case 'FETCH_CART_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    case 'ADD_ITEM_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case 'ADD_ITEM_SUCCESS':
      return {
        ...state,
        loading: false,
        items: action.payload.items || [],
        totalAmount: action.payload.totalAmount || 0,
        itemCount: action.payload.items?.reduce((count, item) => count + item.quantity, 0) || 0,
        error: null
      };
    
    case 'ADD_ITEM_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    case 'UPDATE_ITEM_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case 'UPDATE_ITEM_SUCCESS':
      return {
        ...state,
        loading: false,
        items: action.payload.items || [],
        totalAmount: action.payload.totalAmount || 0,
        itemCount: action.payload.items?.reduce((count, item) => count + item.quantity, 0) || 0,
        error: null
      };
    
    case 'UPDATE_ITEM_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    case 'REMOVE_ITEM_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case 'REMOVE_ITEM_SUCCESS':
      return {
        ...state,
        loading: false,
        items: action.payload.items || [],
        totalAmount: action.payload.totalAmount || 0,
        itemCount: action.payload.items?.reduce((count, item) => count + item.quantity, 0) || 0,
        error: null
      };
    
    case 'REMOVE_ITEM_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    case 'CLEAR_CART_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case 'CLEAR_CART_SUCCESS':
      return {
        ...state,
        loading: false,
        items: [],
        totalAmount: 0,
        itemCount: 0,
        error: null
      };
    
    case 'CLEAR_CART_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    default:
      return state;
  }
};


const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    refreshCart();
  }, []);

  const refreshCart = async () => {
    try {
      dispatch({ type: 'FETCH_CART_START' });
      const cart = await cartService.getCart();
      dispatch({ type: 'FETCH_CART_SUCCESS', payload: cart });
    } catch (error) {
      const errorMessage = handleApiError(error);
      dispatch({ type: 'FETCH_CART_ERROR', payload: errorMessage });
      toast.error(`Failed to load cart: ${errorMessage}`);
    }
  };

  const addItemToCart = async (productId, quantity) => {
    try {
      dispatch({ type: 'ADD_ITEM_START' });
      const updatedCart = await cartService.addToCart(productId, quantity);
      dispatch({ type: 'ADD_ITEM_SUCCESS', payload: updatedCart });
      toast.success('Item added to cart!');
    } catch (error) {
      const errorMessage = handleApiError(error);
      dispatch({ type: 'ADD_ITEM_ERROR', payload: errorMessage });
      toast.error(`Failed to add item: ${errorMessage}`);
    }
  };

  const updateItemQuantity = async (itemId, quantity) => {
    try {
      dispatch({ type: 'UPDATE_ITEM_START' });
      const updatedCart = await cartService.updateCartItem(itemId, quantity);
      dispatch({ type: 'UPDATE_ITEM_SUCCESS', payload: updatedCart });
      toast.success('Item quantity updated!');
    } catch (error) {
      const errorMessage = handleApiError(error);
      dispatch({ type: 'UPDATE_ITEM_ERROR', payload: errorMessage });
      toast.error(`Failed to update item: ${errorMessage}`);
    }
  };

  const removeItemFromCart = async (itemId) => {
    try {
      dispatch({ type: 'REMOVE_ITEM_START' });
      const updatedCart = await cartService.removeFromCart(itemId);
      dispatch({ type: 'REMOVE_ITEM_SUCCESS', payload: updatedCart });
      toast.success('Item removed from cart!');
    } catch (error) {
      const errorMessage = handleApiError(error);
      dispatch({ type: 'REMOVE_ITEM_ERROR', payload: errorMessage });
      toast.error(`Failed to remove item: ${errorMessage}`);
    }
  };

  const clearCartItems = async () => {
    try {
      dispatch({ type: 'CLEAR_CART_START' });
      const updatedCart = await cartService.clearCart();
      dispatch({ type: 'CLEAR_CART_SUCCESS', payload: updatedCart });
      toast.success('Cart cleared!');
    } catch (error) {
      const errorMessage = handleApiError(error);
      dispatch({ type: 'CLEAR_CART_ERROR', payload: errorMessage });
      toast.error(`Failed to clear cart: ${errorMessage}`);
    }
  };

  const value = {
    ...state,
    addItemToCart,
    removeItemFromCart,
    updateItemQuantity,
    clearCartItems,
    refreshCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;