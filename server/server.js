const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const connectDB = require('./db');
const Product = require('./models/Product');
const User = require('./models/User');
const Cart = require('./models/Cart');
const authMiddleware = require('./authMiddleware');
const adminMiddleware = require('./adminMiddleware');
let mockProducts = require('./mockData');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_local_testing_only';

// Connect to Database
connectDB();

// Helper to check DB connection status
const isDbConnected = () => mongoose.connection.readyState === 1;

// --- DB-Offline Fallback Data Store ---
let mockUsers = [
  {
    _id: "60c72b2f9b1d8e1f8c8b4601",
    name: "Regular Customer",
    email: "customer@brand.com",
    password: "", // Hashed in initialization block below
    role: "customer"
  },
  {
    _id: "60c72b2f9b1d8e1f8c8b4602",
    name: "Admin Manager",
    email: "admin@brand.com",
    password: "", // Hashed in initialization block below
    role: "admin"
  }
];

let mockCarts = {}; // Maps userId -> array of { productId, quantity }

// Pre-hash mock passwords on server startup
(async () => {
  const salt = await bcrypt.genSalt(10);
  mockUsers[0].password = await bcrypt.hash("CustomerPass123", salt);
  mockUsers[1].password = await bcrypt.hash("AdminPass123", salt);
  console.log("Mock fallback user passwords successfully initialized.");
})();

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

// --- API AUTH ROUTES ---

// 1. POST /api/auth/signup - User registration
app.post('/api/auth/signup', async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (isDbConnected()) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Safe role assignment (default to customer unless specifically requested)
      const userRole = role === 'admin' ? 'admin' : 'customer';

      const newUser = new User({
        name,
        email: normalizedEmail,
        password,
        role: userRole
      });

      const savedUser = await newUser.save();
      
      const token = jwt.sign(
        { userId: savedUser._id, role: savedUser.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        user: {
          _id: savedUser._id,
          name: savedUser.name,
          email: savedUser.email,
          role: savedUser.role
        },
        token
      });
    } else {
      // Offline fallback
      const existingUser = mockUsers.find(u => u.email === normalizedEmail);
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const userRole = role === 'admin' ? 'admin' : 'customer';
      
      const newUser = {
        _id: new mongoose.Types.ObjectId().toString(),
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role: userRole
      };

      mockUsers.push(newUser);

      const token = jwt.sign(
        { userId: newUser._id, role: newUser.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        },
        token
      });
    }
  } catch (error) {
    next(error);
  }
});

// 2. POST /api/auth/login - User login
app.post('/api/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (isDbConnected()) {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(200).json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      });
    } else {
      // Offline fallback
      const user = mockUsers.find(u => u.email === normalizedEmail);
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(200).json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      });
    }
  } catch (error) {
    next(error);
  }
});

// --- API CART ROUTES ---

// 1. GET /api/cart - Get user's cart (Protected)
app.get('/api/cart', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.userId;

    if (isDbConnected()) {
      const cart = await Cart.findOne({ userId }).populate('items.productId');
      if (!cart) {
        return res.status(200).json({ userId, items: [] });
      }
      return res.status(200).json(cart);
    } else {
      // Offline fallback: populate using mockData list
      const items = mockCarts[userId] || [];
      const populatedItems = items.map(item => {
        const product = mockProducts.find(p => p._id === item.productId);
        return {
          productId: product ? product : { _id: item.productId, name: 'Unknown Product', price: 0 },
          quantity: item.quantity
        };
      });
      return res.status(200).json({ userId, items: populatedItems });
    }
  } catch (error) {
    next(error);
  }
});

// 2. POST /api/cart - Save user's cart (Protected)
app.post('/api/cart', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Items array is required' });
    }

    if (isDbConnected()) {
      const updatedCart = await Cart.findOneAndUpdate(
        { userId },
        { $set: { items } },
        { upsert: true, new: true }
      ).populate('items.productId');
      return res.status(200).json(updatedCart);
    } else {
      // Offline fallback
      mockCarts[userId] = items;
      
      const populatedItems = items.map(item => {
        const product = mockProducts.find(p => p._id === item.productId);
        return {
          productId: product ? product : { _id: item.productId, name: 'Unknown Product', price: 0 },
          quantity: item.quantity
        };
      });

      return res.status(200).json({ userId, items: populatedItems });
    }
  } catch (error) {
    next(error);
  }
});

// --- API CRUD Routes for Products ---

// 1. GET /api/products - list all products with optional search and category filters (Public)
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

// 2. GET /api/products/:id - get single product by id (Public)
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

// 3. POST /api/products - create a product (Protected: Auth + Admin)
app.post('/api/products', authMiddleware, adminMiddleware, async (req, res, next) => {
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

// 4. PUT /api/products/:id - update a product (Protected: Auth + Admin)
app.put('/api/products/:id', authMiddleware, adminMiddleware, async (req, res, next) => {
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

// 5. DELETE /api/products/:id - delete a product (Protected: Auth + Admin)
app.delete('/api/products/:id', authMiddleware, adminMiddleware, async (req, res, next) => {
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

module.exports = app;
