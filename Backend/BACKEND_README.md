# Vibe Commerce Backend API

This is the backend API for the Vibe Commerce shopping cart application.

## Features Implemented

- RESTful API for product and cart management
- MongoDB integration for data storage
- Support for both local products and external API products
- Cart functionality with add, update, remove, and clear operations
- Checkout process with order creation
- Health check endpoint
- Proper error handling and validation

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- dotenv for environment variables

## Project Structure

```
Backend/
├── .env
├── BACKEND_README.md
├── package.json
├── server.js
└── server/
    ├── config/
    │   ├── database.js
    │   └── seedProducts.js
    ├── controllers/
    │   ├── cartController.js
    │   ├── checkoutController.js
    │   ├── externalProductController.js
    │   └── productController.js
    ├── middleware/
    │   ├── asyncHandler.js
    │   ├── errorHandler.js
    │   └── validators.js
    ├── models/
    │   ├── Cart.js
    │   ├── Order.js
    │   └── Product.js
    ├── routes/
    │   ├── cartRoutes.js
    │   ├── checkoutRoutes.js
    │   ├── externalProductRoutes.js
    │   └── productRoutes.js
    ├── services/
    │   └── fakeStoreService.js
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```
   cd Backend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file based on `.env.example` and configure your environment variables
5. Start the server:
   ```
   npm run dev
   ```

### Seeding Products

To seed the database with sample products:
```
npm run seed
```

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Cart Routes
- `GET /api/cart` - Get cart for user
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update item quantity
- `DELETE /api/cart/:itemId` - Remove item from cart
- `DELETE /api/cart` - Clear entire cart

### Product Routes
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/external` - Get products from external API

### Checkout Routes
- `POST /api/checkout` - Process checkout
- `GET /api/orders/:orderId` - Get order by ID

## Environment Variables

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string

## Database Schema

### Product
- `name` (String, required)
- `description` (String, required)
- `price` (Number, required)
- `category` (String, required)
- `image` (String)
- `stock` (Number, required)

### Cart
- `userId` (String, default: 'guest-user')
- `items` (Array)
  - `productId` (Mixed)
  - `quantity` (Number)
  - `price` (Number)
- `totalAmount` (Number)

### Order
- `orderId` (String, unique)
- `customerName` (String, required)
- `customerEmail` (String, required)
- `items` (Array)
- `totalAmount` (Number)
- `orderDate` (Date, default: now)
- `status` (String, default: 'pending')

## Error Handling

The API includes comprehensive error handling:
- 400 Bad Request for validation errors
- 404 Not Found for missing resources
- 500 Internal Server Error for unexpected issues

## Validation

Input validation is implemented using express-validator:
- Product ID validation
- Cart item validation
- Checkout data validation

## License

This project is licensed under the MIT License.