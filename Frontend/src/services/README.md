# API Services

This directory contains all the API service modules for communicating with the backend.

## Services

- [api.js](./api.js) - Main axios instance with interceptors
- [productService.js](./productService.js) - Product-related API calls
- [cartService.js](./cartService.js) - Cart-related API calls
- [checkoutService.js](./checkoutService.js) - Checkout-related API calls
- [errorHandler.js](./errorHandler.js) - Error handling utilities
- [index.js](./index.js) - Main export file

## Usage

### Importing Services

```javascript
// Import individual services
import { getAllProducts } from './services/productService';
import { getCart, addToCart } from './services/cartService';

// Or import everything
import { productService, cartService } from './services';
```

### Using Services

```javascript
// Example: Fetch all products
try {
  const products = await productService.getAllProducts();
  console.log(products);
} catch (error) {
  const errorMessage = handleApiError(error);
  console.error(errorMessage);
}

// Example: Add item to cart
try {
  const updatedCart = await cartService.addToCart('product-id', 2);
  console.log(updatedCart);
} catch (error) {
  const errorMessage = handleApiError(error);
  console.error(errorMessage);
}
```

## Error Handling

All services throw errors that can be handled with the `handleApiError` function:

```javascript
import { handleApiError } from './services/errorHandler';

try {
  const result = await someServiceFunction();
} catch (error) {
  const userFriendlyMessage = handleApiError(error);
  // Display message to user
}
```