const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./server/config/database');

// Load environment variables
dotenv.config({ path: './.env' });

const app = express();

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
  console.log(`Headers:`, req.headers);
  next();
});

// Simple CORS configuration
app.use(cors());

app.use(express.json());

// Connect to MongoDB
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  // Continue running even if DB connection fails
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes - fix the paths to the route files
app.use('/api/cart', require('./server/routes/cartRoutes'));
app.use('/api/products/external', require('./server/routes/externalProductRoutes'));
app.use('/api/products', require('./server/routes/productRoutes'));
app.use('/api/checkout', require('./server/routes/checkoutRoutes'));

// Simple root endpoint for testing
app.get('/', (req, res) => {
  res.json({ message: 'Backend API is running' });
});

// Add a more comprehensive 404 handler with logging
app.use((req, res, next) => {
  console.log(`404 Not Found - ${req.method} ${req.originalUrl}`);
  console.log(`Headers:`, req.headers);
  console.log(`Params:`, req.params);
  console.log(`Query:`, req.query);
  
  // For API routes, return JSON error
  if (req.originalUrl.startsWith('/api')) {
    res.status(404).json({
      success: false,
      error: 'API route not found',
      path: req.originalUrl,
      method: req.method
    });
  } else {
    // For other routes, return simple message
    res.status(404).json({
      success: false,
      error: 'Route not found'
    });
  }
});

// Vercel serverless function export
module.exports = app;