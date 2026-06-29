import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  useNavigate, 
  useSearchParams 
} from 'react-router-dom';
import { getCart, saveCart } from './api/cart';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile';

// Import split layout components
import Header from './components/Header';
import Footer from './components/Footer';
import Newsletter from './components/Newsletter';

// Import split page components
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';

import './index.css';

// Main App wrapper with AuthProvider and Router
export default function App() {
  return (
    <AuthProvider>
      <Router basename={import.meta.env.BASE_URL}>
        <MainAppContent />
      </Router>
    </AuthProvider>
  );
}

function MainAppContent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, token, user, logout } = useAuth();
  
  // Cart & Save for Later States (Client-Side persistent)
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });
  const [savedForLater, setSavedForLater] = useState([]);
  
  // Global search input states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All category');

  // Sync header inputs with URL search parameters
  useEffect(() => {
    const q = searchParams.get('search') || '';
    const cat = searchParams.get('category') || 'All category';
    setSearchQuery(q);
    setSelectedCategory(cat);
  }, [searchParams]);

  // Sync cart to local storage and backend (if logged in)
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    if (isAuthenticated && token) {
      const formattedItems = cart.map(item => ({
        productId: item.product._id,
        quantity: item.quantity
      }));
      saveCart(formattedItems, token).catch(err => console.error("Failed to sync cart to server:", err));
    }
  }, [cart, isAuthenticated, token]);

  // Merge local storage cart with backend cart upon login
  useEffect(() => {
    if (isAuthenticated && token) {
      const mergeCarts = async () => {
        try {
          const serverCartData = await getCart(token);
          const serverItems = serverCartData.items || [];
          
          const mergedCartMap = {};

          // Load server items first
          serverItems.forEach(item => {
            const prod = item.productId;
            if (prod && prod._id) {
              mergedCartMap[prod._id] = { product: prod, quantity: item.quantity };
            }
          });

          // Merge local items: combine quantities for matching products
          cart.forEach(item => {
            const id = item.product._id;
            if (mergedCartMap[id]) {
              mergedCartMap[id].quantity += item.quantity;
            } else {
              mergedCartMap[id] = { product: item.product, quantity: item.quantity };
            }
          });

          const mergedCart = Object.values(mergedCartMap);
          setCart(mergedCart);
          
          const formattedItems = mergedCart.map(item => ({
            productId: item.product._id,
            quantity: item.quantity
          }));
          await saveCart(formattedItems, token);
        } catch (error) {
          console.error("Error merging carts:", error);
        }
      };
      mergeCarts();
    }
  }, [isAuthenticated, token]);

  const handleLogout = () => {
    logout();
    setCart([]);
    localStorage.removeItem('cart');
    navigate('/');
  };

  // Cart Helper functions
  const addToCart = (product, qty = 1) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.product._id === product._id);
      if (existing) {
        return prevCart.map(item => 
          item.product._id === product._id 
            ? { ...item, quantity: item.quantity + qty } 
            : item
        );
      }
      return [...prevCart, { product, quantity: qty }];
    });
    
    // UI Feedback micro-animation
    const btn = document.getElementById(`btn-cart-${product._id}`);
    if (btn) {
      const originalText = btn.innerHTML;
      btn.innerHTML = '✓ Added!';
      btn.style.backgroundColor = '#00b517';
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.backgroundColor = '';
      }, 1000);
    }
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product._id !== productId));
  };

  const updateQuantity = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.product._id === productId 
        ? { ...item, quantity: qty } 
        : item
    ));
  };

  const handleSaveForLater = (product) => {
    removeFromCart(product._id);
    if (!savedForLater.some(item => item._id === product._id)) {
      setSavedForLater(prev => [...prev, product]);
    }
  };

  const handleMoveToCart = (product) => {
    setSavedForLater(prev => prev.filter(item => item._id !== product._id));
    addToCart(product);
  };

  // Header search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchQuery.trim() !== '') query.append('search', searchQuery);
    if (selectedCategory !== 'All category') query.append('category', selectedCategory);
    navigate(`/products?${query.toString()}`);
  };

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* ================= HEADER ================= */}
      <Header 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        cart={cart}
        handleLogout={handleLogout}
        handleSearchSubmit={handleSearchSubmit}
      />

      {/* ================= ROUTING VIEWS ================= */}
      <main style={{ flex: 1, padding: '20px 0' }}>
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} />} />
          <Route path="/products" element={<Catalog addToCart={addToCart} handleSaveForLater={handleSaveForLater} />} />
          <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} handleSaveForLater={handleSaveForLater} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile cart={cart} /></ProtectedRoute>} />
          <Route path="/cart" element={
            <Cart 
              cart={cart} 
              setCart={setCart}
              updateQuantity={updateQuantity} 
              removeFromCart={removeFromCart} 
              handleSaveForLater={handleSaveForLater}
              savedForLater={savedForLater}
              setSavedForLater={setSavedForLater}
              handleMoveToCart={handleMoveToCart}
            />
          } />
        </Routes>
      </main>

      {/* ================= NEWSLETTER BAR ================= */}
      <Newsletter />

      {/* ================= FOOTER ================= */}
      <Footer />

    </div>
  );
}
