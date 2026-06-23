const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./db');
const Product = require('./models/Product');
let mockProducts = require('./mockData');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Helper to check DB connection status
const isDbConnected = () => mongoose.connection.readyState === 1;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Logger Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health-check route
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'UP', 
    message: 'E-commerce API is running.',
    databaseConnected: isDbConnected()
  });
});

app.get('/health-check', (req, res) => {
  res.status(200).json({ 
    status: 'UP', 
    timestamp: new Date(),
    databaseConnected: isDbConnected()
  });
});

// --- API CRUD Routes for Products ---

// 1. GET /api/products - list all products with optional search and category filters
app.get('/api/products', async (req, res, next) => {
  try {
    const { search, category } = req.query;

    if (isDbConnected()) {
      let query = {};
      if (category && category !== 'All category') {
        query.category = category;
      }
      if (search) {
        const searchRegex = new RegExp(search, 'i');
        query.$or = [
          { name: searchRegex },
          { category: searchRegex },
          { brand: searchRegex }
        ];
      }
      const products = await Product.find(query);
      return res.status(200).json(products);
    } else {
      // Offline fallback: filter local in-memory products
      let products = [...mockProducts];
      if (category && category !== 'All category') {
        products = products.filter(p => p.category === category);
      }
      if (search) {
        const searchRegex = new RegExp(search, 'i');
        products = products.filter(p => 
          searchRegex.test(p.name) || 
          searchRegex.test(p.category) || 
          searchRegex.test(p.brand)
        );
      }
      return res.status(200).json(products);
    }
  } catch (error) {
    next(error);
  }
});

// 2. GET /api/products/:id - get single product by id
app.get('/api/products/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      return res.status(200).json(product);
    } else {
      // Offline fallback: find in local mock products
      const product = mockProducts.find(p => p._id === id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      return res.status(200).json(product);
    }
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid product ID format' });
    }
    next(error);
  }
});

// 3. POST /api/products - create a product
app.post('/api/products', async (req, res, next) => {
  try {
    const { name, price, category } = req.body;
    
    // Input validation
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (price === undefined || price === null || isNaN(price) || price < 0) {
      return res.status(400).json({ error: 'Valid price is required' });
    }
    if (!category || category.trim() === '') {
      return res.status(400).json({ error: 'Category is required' });
    }

    if (isDbConnected()) {
      const newProduct = new Product(req.body);
      const savedProduct = await newProduct.save();
      return res.status(201).json(savedProduct);
    } else {
      // Offline fallback: insert into mockProducts array
      const newProduct = {
        _id: new mongoose.Types.ObjectId().toString(),
        ...req.body,
        price: parseFloat(price),
        stock: req.body.stock ? parseInt(req.body.stock) : 0,
        rating: req.body.rating ? parseFloat(req.body.rating) : 0,
        reviews: req.body.reviews ? parseInt(req.body.reviews) : 0,
        sold: req.body.sold ? parseInt(req.body.sold) : 0,
        features: req.body.features || [],
        details: req.body.details || {}
      };
      mockProducts.push(newProduct);
      return res.status(201).json(newProduct);
    }
  } catch (error) {
    next(error);
  }
});

// 4. PUT /api/products/:id - update a product
app.put('/api/products/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;
    
    // Input validation (only if provided in update)
    if (name !== undefined && (!name || name.trim() === '')) {
      return res.status(400).json({ error: 'Name cannot be empty' });
    }
    if (price !== undefined && (price === null || isNaN(price) || price < 0)) {
      return res.status(400).json({ error: 'Price must be a positive number' });
    }

    if (isDbConnected()) {
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true, runValidators: true }
      );
      if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
      return res.status(200).json(updatedProduct);
    } else {
      // Offline fallback: update in mockProducts array
      const index = mockProducts.findIndex(p => p._id === id);
      if (index === -1) {
        return res.status(404).json({ error: 'Product not found' });
      }
      mockProducts[index] = {
        ...mockProducts[index],
        ...req.body,
        price: price !== undefined ? parseFloat(price) : mockProducts[index].price
      };
      return res.status(200).json(mockProducts[index]);
    }
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid product ID format' });
    }
    next(error);
  }
});

// 5. DELETE /api/products/:id - delete a product
app.delete('/api/products/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const deletedProduct = await Product.findByIdAndDelete(id);
      if (!deletedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
      return res.status(200).json({ message: 'Product deleted successfully', id });
    } else {
      // Offline fallback: delete from mockProducts array
      const index = mockProducts.findIndex(p => p._id === id);
      if (index === -1) {
        return res.status(404).json({ error: 'Product not found' });
      }
      mockProducts.splice(index, 1);
      return res.status(200).json({ message: 'Product deleted successfully', id });
    }
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid product ID format' });
    }
    next(error);
  }
});

// Centralized error-handling middleware
app.use((err, req, res, next) => {
  console.error(`[SERVER ERROR] [${new Date().toISOString()}] ${err.stack || err.message}`);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    message: 'An unexpected error occurred on the server.'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
