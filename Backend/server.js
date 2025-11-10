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
  console.log(`Origin:`, req.headers.origin);
  next();
});

// CORS configuration - Fixed
const corsOptions = {
  origin: function (origin, callback) {
    console.log('Request origin:', origin); // Debug log
    
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) {
      console.log('No origin - allowing request');
      return callback(null, true);
    }
    
    // Get allowed origins from environment variable
    const envOrigins = process.env.CORS_ORIGINS 
      ? process.env.CORS_ORIGINS.split(',').map(o => o.trim()) 
      : [];
    
    // All allowed origins
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      ...envOrigins
    ];
    
    console.log('Allowed origins:', allowedOrigins); // Debug log
    
    // Check if origin is in allowed list or is a Vercel domain
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      console.log('Origin allowed:', origin);
      callback(null, true);
    } else {
      console.log('Origin blocked:', origin);
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Add OPTIONS handler for preflight requests
app.options('*', cors(corsOptions));

app.use(express.json());

// Connect to MongoDB
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB:', err);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/cart', require('./server/routes/cartRoutes'));
app.use('/api/products/external', require('./server/routes/externalProductRoutes'));
app.use('/api/products', require('./server/routes/productRoutes'));
app.use('/api/checkout', require('./server/routes/checkoutRoutes'));

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Backend API is running' });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API test endpoint is working'
  });
});

// 404 handler
app.use((req, res, next) => {
  console.log(`404 Not Found - ${req.method} ${req.originalUrl}`);
  
  if (req.originalUrl.startsWith('/api')) {
    res.status(404).json({
      success: false,
      error: 'API route not found',
      path: req.originalUrl,
      method: req.method
    });
  } else {
    res.status(404).json({
      success: false,
      error: 'Route not found'
    });
  }
});

// Error handling middleware for CORS errors
app.use((err, req, res, next) => {
  if (err.message.includes('Not allowed by CORS')) {
    console.error('CORS Error:', err.message);
    return res.status(403).json({
      success: false,
      error: 'CORS policy: Origin not allowed',
      origin: req.headers.origin
    });
  }
  next(err);
});

// Vercel serverless function export
module.exports = app;