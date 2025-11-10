const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./server/config/database');

// Load environment variables
dotenv.config({ path: './.env' });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Log routes for debugging
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes - ORDER MATTERS! More specific routes first
app.use('/api/cart', require('./server/routes/cartRoutes'));
app.use('/api/products/external', require('./server/routes/externalProductRoutes'));
app.use('/api/products', require('./server/routes/productRoutes'));
app.use('/api/checkout', require('./server/routes/checkoutRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  console.error('Error stack:', err.stack);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message
  });
});

// 404 handler - should be the last middleware
app.use((req, res) => {
  console.log(`404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Vercel serverless function export
module.exports = app;