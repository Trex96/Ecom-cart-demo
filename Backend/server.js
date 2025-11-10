const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./server/config/database');

// Load environment variables
dotenv.config({ path: './.env' });

const app = express();

// Custom CORS middleware to handle all Vercel domains
const corsMiddleware = (req, res, next) => {
  const origin = req.get('Origin');
  
  // List of allowed origins
  const allowedOrigins = [
    'http://localhost:5173', // Vite dev server
    'http://localhost:3000', // Alternative local dev
    'http://127.0.0.1:5173', // Alternative Vite dev server
    'http://127.0.0.1:3000', // Alternative local dev
    ...(process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim()) : []),
  ];
  
  // Check if origin is allowed or is a Vercel domain
  if (!origin || allowedOrigins.includes(origin) || (origin && origin.endsWith('.vercel.app'))) {
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  
  next();
};

app.use(corsMiddleware);
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

// API Routes
app.use('/api/cart', require('./server/routes/cartRoutes'));
app.use('/api/products/external', require('./server/routes/externalProductRoutes'));
app.use('/api/products', require('./server/routes/productRoutes'));
app.use('/api/checkout', require('./server/routes/checkoutRoutes'));

// Simple root endpoint for testing
app.get('/', (req, res) => {
  res.json({ message: 'Backend API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Vercel serverless function export
module.exports = app;