# Vibe Commerce Backend API

This is the backend API for the Vibe Commerce application, providing RESTful services for product and cart management.

## 🌟 Features

- RESTful API for product and cart management
- MongoDB integration for data storage
- Support for both local products and external API products
- Complete cart functionality with add, update, remove, and clear operations
- Order processing and management
- Comprehensive error handling and validation

## 🛠️ Technologies Used

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB with Mongoose** - NoSQL database and ODM
- **dotenv** - Environment variable management
- **cors** - Cross-origin resource sharing
- **express-validator** - Request validation

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file based on `.env.example` and configure your environment variables
5. Seed the database with sample products:
   ```bash
   npm run seed
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```

## 📡 API Endpoints

### Health Check
- `GET /api/health` - Server status check

### Cart Routes
- `GET /api/cart` - Get cart for user
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update item quantity
- `DELETE /api/cart/:itemId` - Remove item from cart
- `DELETE /api/cart` - Clear entire cart

### Product Routes
- `GET /api/products` - Get all local products
- `GET /api/products/:id` - Get specific local product
- `GET /api/products/external` - Get all external products from Fake Store API

### Checkout Routes
- `POST /api/checkout` - Process order
- `GET /api/checkout/:orderId` - Get order details

## 📁 Project Structure

```
server/
├── config/          # Configuration files and database connection
├── controllers/     # Request handlers and business logic
├── middleware/      # Custom middleware (validation, error handling)
├── models/          # Database models (Product, Cart, Order)
├── routes/          # API route definitions
├── services/        # External service integrations (Fake Store API)
└── utils/           # Utility functions
```

## 🔧 Environment Variables

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string

Example `.env` file:
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/vibe-commerce
```

## 🧪 Testing

Run the API test suite to verify all endpoints:
```bash
node tests/test-api.js
```

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, open an issue in the repository.