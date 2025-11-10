# Vibe Commerce - Full Stack E-Commerce Application

A modern, full-stack e-commerce application built with React, Node.js, and MongoDB that seamlessly integrates local product management with external API products.

## 🌟 Features

### Frontend (React)
- Modern UI with Tailwind CSS styling
- Responsive design for all device sizes
- Product browsing from both local database and external APIs
- Shopping cart functionality with real-time updates
- Checkout process with order confirmation
- Context API for state management
- Axios for API integration

### Backend (Node.js/Express)
- RESTful API architecture
- MongoDB integration with Mongoose ODM
- Dual product system (local database & external API)
- Complete cart management (CRUD operations)
- Order processing and management
- Environment-based configuration
- Comprehensive error handling

## 🛠️ Technologies Used

### Frontend
- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Vite** - Build tool and development server
- **Lucide React** - Icon library
- **React Toastify** - Notification system

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Dotenv** - Environment variable management
- **Cors** - Cross-origin resource sharing

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd nexora
   ```

2. **Backend Setup:**
   ```bash
   cd Backend
   npm install
   cp .env.example .env
   # Update .env with your MongoDB connection string
   npm run seed  # Seed the database with sample products
   npm run dev   # Start the backend server
   ```

3. **Frontend Setup:**
   ```bash
   cd ../Frontend
   npm install
   npm run dev   # Start the frontend development server
   ```

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=your_mongodb_connection_string
```

## 📡 API Endpoints

### Cart Management
- `GET /api/cart` - Retrieve user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update item quantity
- `DELETE /api/cart/:itemId` - Remove item from cart
- `DELETE /api/cart` - Clear entire cart

### Product Management
- `GET /api/products` - Get all local products
- `GET /api/products/:id` - Get specific local product
- `GET /api/products/external` - Get all external products

### Checkout Process
- `POST /api/checkout` - Process order
- `GET /api/checkout/:orderId` - Get order details

## 📁 Project Structure

```
nexora/
├── Backend/
│   ├── server/
│   │   ├── config/     # Configuration files
│   │   ├── controllers/ # Request handlers
│   │   ├── middleware/  # Custom middleware
│   │   ├── models/      # Database models
│   │   ├── routes/      # API routes
│   │   └── services/    # Business logic
│   ├── server.js        # Entry point
│   └── .env             # Environment variables
│
└── Frontend/
    ├── src/
    │   ├── components/   # Reusable UI components
    │   ├── context/      # React context providers
    │   ├── hooks/        # Custom React hooks
    │   ├── pages/        # Page components
    │   ├── services/     # API service layer
    │   └── App.jsx       # Main application component
    └── public/           # Static assets
```

## 🧪 Testing

Run the comprehensive API test suite:
```bash
cd Backend
node tests/test-api.js
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, email [your-email] or open an issue in the repository.