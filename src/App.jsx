import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useNavigate, 
  useSearchParams, 
  useParams 
} from 'react-router-dom';
import { 
  Search, 
  User, 
  MessageSquare, 
  Heart, 
  ShoppingCart, 
  ChevronDown, 
  Star, 
  ArrowLeft, 
  Check, 
  ShieldCheck, 
  Truck, 
  Mail, 
  Grid, 
  List, 
  Trash2, 
  Plus, 
  Minus,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Shield,
  LogOut
} from 'lucide-react';
import { getAllProducts, getProductById } from './api/products';
import { getCart, saveCart } from './api/cart';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminPanel from './pages/AdminPanel';

// Main App wrapper with AuthProvider and Router
export default function App() {
  return (
    <AuthProvider>
      <Router>
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
      <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--border)' }}>
        {/* Top utilities bar */}
        <div style={{ borderBottom: '1px solid #f1f2f4', padding: '8px 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '20px' }}>
              <Link to="/">Home</Link>
              <Link to="/products">Catalog</Link>
              {user?.role === 'admin' && <Link to="/admin" style={{ color: 'var(--primary)', fontWeight: '600' }}>Admin Dashboard</Link>}
              <span>Hot offers</span>
              <span>Help Center</span>
            </div>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <span>English, USD</span>
              <span>Ship to Germany 🇩🇪</span>
            </div>
          </div>
        </div>

        {/* Main Header bar */}
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px', gap: '20px' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)' }}>
            <div style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={24} />
            </div>
            <span style={{ fontSize: '1.6rem', fontWeight: '800', fontFamily: 'var(--font-title)', letterSpacing: '-0.5px', color: '#1c1c1c' }}>Brand</span>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flex: 1, maxWidth: '640px', border: '2px solid var(--primary)', borderRadius: '6px', overflow: 'hidden' }}>
            <input 
              type="text" 
              placeholder="Search products, brands..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, padding: '12px 16px', fontSize: '0.95rem', color: 'var(--text-main)', backgroundColor: 'white' }}
            />
            <div style={{ position: 'relative', borderLeft: '1px solid var(--border)', display: 'flex', alignItems: 'center', backgroundColor: 'white' }}>
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ padding: '0 30px 0 16px', height: '100%', cursor: 'pointer', appearance: 'none', color: 'var(--text-muted)' }}
              >
                <option value="All category">All categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Home interiors">Home interiors</option>
                <option value="Clothing">Clothing</option>
                <option value="Accessories">Accessories</option>
              </select>
              <ChevronDown size={16} style={{ position: 'absolute', right: '10px', pointerEvents: 'none', color: 'var(--text-light)' }} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ borderRadius: '0', padding: '0 24px', fontWeight: '600' }}>
              Search
            </button>
          </form>

          {/* Action Icons */}
          <div style={{ display: 'flex', gap: '20px', color: 'var(--text-muted)' }}>
            {isAuthenticated ? (
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <User size={20} />
                  <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>{user?.name.split(' ')[0]}</span>
                </div>
                <div onClick={handleLogout} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', gap: '4px', color: 'var(--red)' }}>
                  <LogOut size={20} />
                  <span style={{ fontSize: '0.75rem' }}>Logout</span>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <Link to="/login" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <User size={20} />
                  <span style={{ fontSize: '0.75rem' }}>Sign In</span>
                </Link>
                <Link to="/signup" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--primary)' }}>
                  <Plus size={20} />
                  <span style={{ fontSize: '0.75rem' }}>Sign Up</span>
                </Link>
              </div>
            )}
            
            <Link 
              to="/cart"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', gap: '4px', position: 'relative' }} 
            >
              <ShoppingCart size={20} />
              <span style={{ fontSize: '0.75rem' }}>My cart</span>
              {cart.length > 0 && (
                <span style={{ position: 'absolute', top: '-6px', right: '6px', backgroundColor: 'var(--primary)', color: 'white', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '10px', fontWeight: '700' }}>
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Lower navigation bar */}
        <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', height: '48px', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', fontWeight: '500', fontSize: '0.95rem' }}>
              <Link to="/products" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                ☰ All categories
              </Link>
              <Link to="/products?category=Electronics">Electronics</Link>
              <Link to="/products?category=Clothing">Clothes</Link>
              <Link to="/products?category=Home interiors">Home interiors</Link>
              <Link to="/products?category=Accessories">Accessories</Link>
              <span>Hot offers</span>
              <span>Help</span>
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <span>English, USD</span>
            </div>
          </div>
        </div>
      </header>

      {/* ================= ROUTING VIEWS ================= */}
      <main style={{ flex: 1, padding: '20px 0' }}>
        <Routes>
          <Route path="/" element={<HomePage addToCart={addToCart} />} />
          <Route path="/products" element={<CatalogPage addToCart={addToCart} handleSaveForLater={handleSaveForLater} />} />
          <Route path="/product/:id" element={<ProductDetailPage addToCart={addToCart} handleSaveForLater={handleSaveForLater} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
          <Route path="/cart" element={
            <CartPage 
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
      <section style={{ backgroundColor: '#eaecef', padding: '36px 0', borderTop: '1px solid var(--border)' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '4px' }}>Subscribe on our newsletter</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Get daily news on upcoming offers from many suppliers all over the world</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed!'); }} style={{ display: 'flex', gap: '8px', maxWidth: '380px', width: '100%' }}>
            <input 
              type="email" 
              placeholder="Email address" 
              className="form-input" 
              style={{ padding: '10px 14px', flex: 1 }}
              required
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px' }}>
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--border)', padding: '40px 0 20px' }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', justifyContent: 'space-between', marginBottom: '40px' }}>
            
            <div style={{ maxWidth: '260px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', marginBottom: '16px' }}>
                <div style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShoppingBag size={18} />
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: '800', fontFamily: 'var(--font-title)', color: '#1c1c1c' }}>Brand</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '16px' }}>
                Best information about the company gies here but now lorem ipsum is dummy text.
              </p>
              <div style={{ display: 'flex', gap: '12px', color: '#8b96a5' }}>
                <span style={{ cursor: 'pointer' }}>
                  <svg fill="currentColor" viewBox="0 0 24 24" width="16" height="16">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                  </svg>
                </span>
                <span style={{ cursor: 'pointer' }}>
                  <svg fill="currentColor" viewBox="0 0 24 24" width="16" height="16">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </span>
              </div>
            </div>

            {[
              { title: "About", links: ["About Us", "Find store", "Categories", "Blogs"] },
              { title: "Partnership", links: ["About Us", "Find store", "Categories", "Blogs"] },
              { title: "Information", links: ["Help Center", "Money Refund", "Shipping", "Contact us"] }
            ].map((col, idx) => (
              <div key={idx}>
                <h5 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '16px', color: 'var(--text-main)' }}>{col.title}</h5>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {col.links.map((link, i) => (
                    <li key={i} style={{ cursor: 'pointer' }}>
                      {link}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h5 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '16px', color: 'var(--text-main)' }}>Get app</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '600', padding: '6px 12px', border: '1px solid var(--border)', borderRadius: '6px', backgroundColor: '#fafbfd' }}>App Store</span>
                <span style={{ fontSize: '0.8rem', fontWeight: '600', padding: '6px 12px', border: '1px solid var(--border)', borderRadius: '6px', backgroundColor: '#fafbfd' }}>Google Play</span>
              </div>
            </div>

          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-light)' }}>
            <span>© 2026 Ecommerce. All rights reserved.</span>
            <span>English (US) 🇺🇸</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

// ================= PAGE: HOME =================
function HomePage({ addToCart }) {
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [timeLeft, setTimeLeft] = useState({ days: 4, hours: 13, minutes: 34, seconds: 56 });

  // Countdown timer ticks
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        clearInterval(interval);
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch all products for sections
  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const data = await getAllProducts();
        setProductsList(data);
      } catch (err) {
        setError("Database is currently offline. Please seed the database first.");
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  const featuredProducts = productsList.slice(0, 6);
  const electronics = productsList.filter(p => p.category === 'Electronics');
  const homeInteriors = productsList.filter(p => p.category === 'Home interiors');

  const goproId = productsList.find(p => p.brand === 'GoPro')?._id || '';

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '80px 0' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: '500', color: 'var(--text-light)' }}>Loading Sourcing Storefront...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '60px 0' }}>
        <div style={{ backgroundColor: 'var(--red-light)', border: '1px solid var(--red)', color: 'var(--red)', padding: '20px', borderRadius: '6px', maxWidth: '500px', margin: '0 auto' }}>
          <h4 style={{ fontWeight: '700', marginBottom: '8px' }}>Sourcing Offline</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* 1. Hero Block */}
      <div style={{ display: 'flex', gap: '20px', backgroundColor: '#ffffff', border: '1px solid var(--border)', borderRadius: '6px', padding: '16px', height: '400px' }}>
        {/* Left categories list */}
        <div style={{ width: '240px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.95rem', fontWeight: '500', color: 'var(--text-muted)' }}>
          <Link to="/products?category=Electronics" className="btn-text" style={{ padding: '8px 12px', borderRadius: '6px' }}>Electronics</Link>
          <Link to="/products?category=Clothing" className="btn-text" style={{ padding: '8px 12px', borderRadius: '6px' }}>Clothing</Link>
          <Link to="/products?category=Home interiors" className="btn-text" style={{ padding: '8px 12px', borderRadius: '6px' }}>Home interiors</Link>
          <Link to="/products?category=Accessories" className="btn-text" style={{ padding: '8px 12px', borderRadius: '6px' }}>Accessories</Link>
        </div>
        
        {/* Central banner */}
        <div style={{ 
          flex: 1, 
          backgroundImage: 'linear-gradient(to right, rgba(227, 240, 255, 0.95), rgba(227, 240, 255, 0.3)), url(https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '6px',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '8px' }}>Latest trending</h3>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', fontFamily: 'var(--font-title)', color: 'var(--text-main)', marginBottom: '24px', lineHeight: '1.2' }}>
            Electronic items<br/>& Gadgets
          </h2>
          <Link to={goproId ? `/product/${goproId}` : '/products'} className="btn btn-primary">
            Source now <Sparkles size={16} />
          </Link>
        </div>

        {/* Right promo cards */}
        <div style={{ width: '220px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ backgroundColor: 'var(--primary-light)', padding: '16px', borderRadius: '6px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', flex: 1 }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <User size={24} />
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>Sourcing Center Global</span>
            <button className="btn btn-primary" style={{ width: '100%', padding: '6px 12px', fontSize: '0.85rem' }} onClick={() => navigate('/products')}>Sourcing Catalog</button>
          </div>
          <div style={{ backgroundColor: 'var(--orange-light)', padding: '14px', borderRadius: '6px', color: '#663c00' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '700', display: 'block' }}>Get US $10 off</span>
            <span style={{ fontSize: '0.8rem' }}>with a new supplier check</span>
          </div>
        </div>
      </div>

      {/* 2. Deals and Offers Block */}
      <div style={{ display: 'flex', backgroundColor: '#ffffff', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
        <div style={{ width: '280px', padding: '24px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h4 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '4px' }}>Deals and offers</h4>
            <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>Hygiene & electronics equipments</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', margin: '20px 0' }}>
            <div style={{ backgroundColor: '#2d3748', color: 'white', padding: '8px 10px', borderRadius: '4px', textAlign: 'center', minWidth: '46px' }}>
              <span style={{ display: 'block', fontSize: '1.1rem', fontWeight: '700' }}>{String(timeLeft.days).padStart(2, '0')}</span>
              <span style={{ fontSize: '0.65rem', color: '#a0aec0' }}>Days</span>
            </div>
            <div style={{ backgroundColor: '#2d3748', color: 'white', padding: '8px 10px', borderRadius: '4px', textAlign: 'center', minWidth: '46px' }}>
              <span style={{ display: 'block', fontSize: '1.1rem', fontWeight: '700' }}>{String(timeLeft.hours).padStart(2, '0')}</span>
              <span style={{ fontSize: '0.65rem', color: '#a0aec0' }}>Hour</span>
            </div>
            <div style={{ backgroundColor: '#2d3748', color: 'white', padding: '8px 10px', borderRadius: '4px', textAlign: 'center', minWidth: '46px' }}>
              <span style={{ display: 'block', fontSize: '1.1rem', fontWeight: '700' }}>{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span style={{ fontSize: '0.65rem', color: '#a0aec0' }}>Min</span>
            </div>
            <div style={{ backgroundColor: '#ff9017', color: 'white', padding: '8px 10px', borderRadius: '4px', textAlign: 'center', minWidth: '46px' }}>
              <span style={{ display: 'block', fontSize: '1.1rem', fontWeight: '700' }}>{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span style={{ fontSize: '0.65rem', color: '#ffe5cc' }}>Sec</span>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)' }}>
          {electronics.slice(0, 5).map((product) => (
            <Link 
              key={product._id} 
              to={`/product/${product._id}`}
              style={{ padding: '20px 14px', borderRight: '1px solid var(--border)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
            >
              <div style={{ height: '100px', display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <img src={product.image} alt={product.name} style={{ maxHeight: '100px', objectFit: 'contain' }} />
              </div>
              <h5 style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                {product.name}
              </h5>
              <span className="badge badge-red">
                -25%
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* 3. Section: Home and Outdoor */}
      <div style={{ display: 'flex', backgroundColor: '#ffffff', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden', height: '280px' }}>
        <div style={{ 
          width: '280px', 
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.25)), url(https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format&fit=crop&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          color: 'white'
        }}>
          <div style={{ color: '#1c1c1c' }}>
            <h4 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '6px' }}>Home and<br/>outdoor</h4>
            <Link to="/products?category=Home interiors" className="btn" style={{ padding: '8px 16px', fontSize: '0.85rem', backgroundColor: 'white', color: '#1c1c1c', fontWeight: '600' }}>
              Source now
            </Link>
          </div>
        </div>
        
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {homeInteriors.slice(0, 4).map((product) => (
            <Link 
              key={product._id}
              to={`/product/${product._id}`}
              style={{ padding: '16px', borderRight: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, marginRight: '10px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', lineHeight: '1.3', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>From <strong style={{ color: 'var(--text-muted)' }}>USD {product.price}</strong></span>
              </div>
              <div style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={product.image} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover', borderRadius: '4px' }} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 4. Section: Featured/Recommended Items */}
      <div>
        <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '20px' }}>Featured Sourcing Products</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px' }}>
          {featuredProducts.map((product) => (
            <div 
              key={product._id}
              className="card"
              style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <Link to={`/product/${product._id}`}>
                <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', overflow: 'hidden' }}>
                  <img src={product.image} alt={product.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>
                  ${product.price.toFixed(2)}
                </div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '10px', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '38px' }}>
                  {product.name}
                </h4>
              </Link>
              <button 
                id={`btn-cart-${product._id}`}
                className="btn btn-secondary"
                style={{ width: '100%', padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                onClick={() => addToCart(product)}
              >
                <ShoppingCart size={14} /> Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Services Card Grid */}
      <div>
        <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '20px' }}>Our extra services</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {[
            { title: "Source from Industry Hubs", icon: <Search size={22} />, bg: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&auto=format&fit=crop&q=80" },
            { title: "Customize Your Products", icon: <Sparkles size={22} />, bg: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&auto=format&fit=crop&q=80" },
            { title: "Fast, reliable shipping by ocean or air", icon: <Truck size={22} />, bg: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&auto=format&fit=crop&q=80" },
            { title: "Product monitoring and inspection", icon: <ShieldCheck size={22} />, bg: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&auto=format&fit=crop&q=80" }
          ].map((service, index) => (
            <div key={index} className="card" style={{ display: 'flex', flexDirection: 'column', height: '200px', position: 'relative' }}>
              <div style={{ height: '120px', backgroundImage: `url(${service.bg})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', bottom: '-20px', right: '20px', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'white', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  {service.icon}
                </div>
              </div>
              <div style={{ padding: '24px 16px 16px', flex: 1, display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)' }}>{service.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ================= PAGE: CATALOG (PRODUCT LISTINGS) =================
function CatalogPage({ addToCart, handleSaveForLater }) {
  const [searchParams] = useSearchParams();
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Local Sidebar filter settings
  const [activeBrands, setActiveBrands] = useState([]);
  const [activeFeatures, setActiveFeatures] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [isListView, setIsListView] = useState(false);

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';

  // API Call: Fetch products based on category and search query
  useEffect(() => {
    const fetchApiData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = {};
        if (category && category !== 'All category') params.category = category;
        if (search) params.search = search;
        
        const data = await getAllProducts(params);
        setProductsList(data);
      } catch (err) {
        setError("Unable to connect to the backend server. Make sure the API is online.");
      } finally {
        setLoading(false);
      }
    };
    fetchApiData();
  }, [category, search]);

  const filteredProducts = productsList.filter(product => {
    if (activeBrands.length > 0 && !activeBrands.includes(product.brand)) return false;
    if (activeFeatures.length > 0) {
      const match = activeFeatures.every(f => product.features?.includes(f));
      if (!match) return false;
    }
    if (minPrice !== '' && product.price < parseFloat(minPrice)) return false;
    if (maxPrice !== '' && product.price > parseFloat(maxPrice)) return false;
    return true;
  });

  const clearAllFilters = () => {
    setActiveBrands([]);
    setActiveFeatures([]);
    setMinPrice('');
    setMaxPrice('');
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '80px 0' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: '500', color: 'var(--text-light)' }}>Loading Catalog Listings...</div>
      </div>
    );
  }

  const catalogResponsiveStyles = `
    @media (max-width: 768px) {
      .catalog-layout {
        flex-direction: column !important;
      }
      .filters-sidebar {
        width: 100% !important;
        border-bottom: 1px solid var(--border);
        padding-bottom: 20px;
      }
      .products-grid {
        grid-template-columns: repeat(2, 1fr) !important;
      }
    }
    @media (max-width: 480px) {
      .products-grid {
        grid-template-columns: 1fr !important;
      }
    }
  `;

  return (
    <div className="container">
      <style>{catalogResponsiveStyles}</style>

      {/* Breadcrumbs */}
      <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '16px', display: 'flex', gap: '6px' }}>
        <Link to="/">Home</Link>
        <span>&gt;</span>
        <span style={{ fontWeight: '500' }}>All products</span>
      </div>

      <div className="catalog-layout" style={{ display: 'flex', gap: '24px' }}>
        {/* Left Sidebar Filters */}
        <div className="filters-sidebar" style={{ width: '240px', display: 'flex', flexDirection: 'column', gap: '20px', flexShrink: 0 }}>
          {/* Categories links */}
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '12px' }}>Category</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <Link to="/products" style={{ fontWeight: !category ? '600' : '400', color: !category ? 'var(--primary)' : 'inherit' }}>All categories</Link>
              <Link to="/products?category=Electronics" style={{ fontWeight: category === 'Electronics' ? '600' : '400', color: category === 'Electronics' ? 'var(--primary)' : 'inherit' }}>Electronics</Link>
              <Link to="/products?category=Clothing" style={{ fontWeight: category === 'Clothing' ? '600' : '400', color: category === 'Clothing' ? 'var(--primary)' : 'inherit' }}>Clothing</Link>
              <Link to="/products?category=Home interiors" style={{ fontWeight: category === 'Home interiors' ? '600' : '400', color: category === 'Home interiors' ? 'var(--primary)' : 'inherit' }}>Home interiors</Link>
              <Link to="/products?category=Accessories" style={{ fontWeight: category === 'Accessories' ? '600' : '400', color: category === 'Accessories' ? 'var(--primary)' : 'inherit' }}>Accessories</Link>
            </div>
          </div>

          {/* Brands */}
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '12px' }}>Brands</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
              {['Samsung', 'Apple', 'Pocco', 'Huawei', 'Lenovo', 'GoPro'].map((brand, i) => {
                const isChecked = activeBrands.includes(brand);
                return (
                  <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={isChecked}
                      onChange={() => {
                        if (isChecked) {
                          setActiveBrands(prev => prev.filter(b => b !== brand));
                        } else {
                          setActiveBrands(prev => [...prev, brand]);
                        }
                      }}
                      style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                    />
                    <span>{brand}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '12px' }}>Price range</h4>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="number" 
                placeholder="Min" 
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                style={{ width: '100%', border: '1px solid var(--border)', borderRadius: '4px', padding: '6px 10px', fontSize: '0.85rem' }}
              />
              <input 
                type="number" 
                placeholder="Max" 
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                style={{ width: '100%', border: '1px solid var(--border)', borderRadius: '4px', padding: '6px 10px', fontSize: '0.85rem' }}
              />
            </div>
          </div>
        </div>

        {/* Right Main Grid */}
        <div style={{ flex: 1 }}>
          {error ? (
            <div style={{ backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: '6px', padding: '40px', textAlign: 'center', color: 'var(--red)' }}>
              {error}
            </div>
          ) : (
            <>
              {/* Header result bar */}
              <div style={{ backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: '6px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <span style={{ fontWeight: '600' }}>{filteredProducts.length} items found</span>
                  {category && <span> in <strong style={{ color: 'var(--primary)' }}>{category}</strong></span>}
                </div>
                
                {/* View toggler */}
                <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                  <button onClick={() => setIsListView(false)} style={{ padding: '8px 12px', backgroundColor: !isListView ? '#f1f2f4' : 'white', borderRight: '1px solid var(--border)' }}>
                    <Grid size={16} />
                  </button>
                  <button onClick={() => setIsListView(true)} style={{ padding: '8px 12px', backgroundColor: isListView ? '#f1f2f4' : 'white' }}>
                    <List size={16} />
                  </button>
                </div>
              </div>

              {/* Grid cards listing */}
              {filteredProducts.length === 0 ? (
                <div style={{ backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: '6px', padding: '60px 20px', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '8px' }}>No products found</h3>
                  <p style={{ color: 'var(--text-light)', marginBottom: '16px', fontSize: '0.9rem' }}>Try clearing filters or search query parameters.</p>
                  <button className="btn btn-primary" onClick={clearAllFilters}>Reset Filters</button>
                </div>
              ) : !isListView ? (
                <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                  {filteredProducts.map((product) => (
                    <div key={product._id} className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Link to={`/product/${product._id}`}>
                        <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                          <img src={product.image} alt={product.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                          <span style={{ fontSize: '1.2rem', fontWeight: '700' }}>${product.price.toFixed(2)}</span>
                        </div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '40px' }}>
                          {product.name}
                        </h4>
                      </Link>
                      <button 
                        id={`btn-cart-${product._id}`}
                        className="btn btn-primary" 
                        style={{ width: '100%', padding: '8px' }}
                        onClick={() => addToCart(product)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {filteredProducts.map((product) => (
                    <div key={product._id} className="card" style={{ padding: '16px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                      <div style={{ width: '180px', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <img src={product.image} alt={product.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: '240px' }}>
                        <div>
                          <Link to={`/product/${product._id}`}>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '6px' }}>{product.name}</h4>
                          </Link>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'block', marginBottom: '8px' }}>
                            Brand: {product.brand} | Rating: {product.rating} ★
                          </span>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{product.description}</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                          <span style={{ fontSize: '1.25rem', fontWeight: '700' }}>${product.price.toFixed(2)}</span>
                          <button 
                            id={`btn-cart-${product._id}`}
                            className="btn btn-primary" 
                            onClick={() => addToCart(product)}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ================= PAGE: PRODUCT DETAIL =================
function ProductDetailPage({ addToCart, handleSaveForLater }) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [activeThumbnail, setActiveThumbnail] = useState(0);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err.message || "Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '80px 0' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: '500', color: 'var(--text-light)' }}>Loading Product Details...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '60px 0' }}>
        <div style={{ backgroundColor: 'var(--red-light)', border: '1px solid var(--red)', color: 'var(--red)', padding: '20px', borderRadius: '6px', maxWidth: '500px', margin: '0 auto' }}>
          <h4 style={{ fontWeight: '700', marginBottom: '8px' }}>Product Not Found</h4>
          <p>{error || "The requested product does not exist in the database."}</p>
          <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => navigate('/products')}>Back to Catalog</button>
        </div>
      </div>
    );
  }

  const detailResponsiveStyles = `
    @media (max-width: 768px) {
      .detail-layout {
        flex-direction: column !important;
      }
      .gallery-block {
        width: 100% !important;
      }
    }
  `;

  return (
    <div className="container">
      <style>{detailResponsiveStyles}</style>

      {/* Back button */}
      <button className="btn btn-text" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', padding: '0' }} onClick={() => navigate('/products')}>
        <ArrowLeft size={16} /> Back to Catalog
      </button>

      {/* Main product card */}
      <div className="detail-layout" style={{ display: 'flex', gap: '24px', backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: '6px', padding: '24px', marginBottom: '24px' }}>
        {/* Left Gallery */}
        <div className="gallery-block" style={{ width: '380px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ height: '340px', border: '1px solid var(--border)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
            <img src={product.image} alt={product.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {[0, 1, 2].map((i) => (
              <div 
                key={i} 
                style={{ 
                  width: '60px', 
                  height: '60px', 
                  border: activeThumbnail === i ? '2px solid var(--primary)' : '1px solid var(--border)', 
                  borderRadius: '4px', 
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#ffffff'
                }}
                onClick={() => setActiveThumbnail(i)}
              >
                <img src={product.image} alt="thumb" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Center Details */}
        <div style={{ flex: 1, padding: '0 10px' }}>
          <span style={{ color: product.stock > 0 ? 'var(--green)' : 'var(--red)', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
            {product.stock > 0 ? (
              <>
                <Check size={14} /> In stock ({product.stock} units available)
              </>
            ) : "Out of stock"}
          </span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '12px', lineHeight: '1.3' }}>
            {product.name}
          </h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ display: 'flex', color: 'var(--orange)' }}>
                <Star size={14} fill="currentColor" />
                <span style={{ fontWeight: '600', color: 'var(--orange)', marginLeft: '4px' }}>{product.rating || 'N/A'}</span>
              </div>
            </div>
            <span>• {product.reviews || 0} reviews</span>
            <span>• {product.sold || 0} sold</span>
          </div>

          <div style={{ backgroundColor: 'var(--orange-light)', padding: '16px', borderRadius: '6px', display: 'flex', gap: '30px', marginBottom: '20px', borderLeft: '4px solid var(--orange)' }}>
            <div>
              <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)' }}>${product.price.toFixed(2)}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>MSRP Sourced</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', paddingBottom: '6px' }}>
              <span style={{ width: '140px', color: 'var(--text-light)' }}>Brand:</span>
              <span style={{ fontWeight: '500' }}>{product.brand || 'Generic'}</span>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', paddingBottom: '6px' }}>
              <span style={{ width: '140px', color: 'var(--text-light)' }}>Category:</span>
              <span style={{ fontWeight: '500' }}>{product.category}</span>
            </div>
            {product.features && product.features.length > 0 && (
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', paddingBottom: '6px' }}>
                <span style={{ width: '140px', color: 'var(--text-light)' }}>Features:</span>
                <span style={{ fontWeight: '500' }}>{product.features.join(', ')}</span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button 
              id={`btn-cart-${product._id}`}
              className="btn btn-primary" 
              style={{ padding: '12px 24px', flex: 1, minWidth: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              onClick={() => addToCart(product)}
              disabled={product.stock <= 0}
            >
              <ShoppingCart size={18} /> Add to Cart
            </button>
            <button 
              className="btn btn-secondary" 
              style={{ padding: '12px 24px', flex: 1, minWidth: '150px' }}
              onClick={() => {
                handleSaveForLater(product);
                alert(`${product.name} saved for later!`);
              }}
            >
              Save for Later
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden', marginBottom: '40px' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', backgroundColor: '#fafbfd' }}>
          {['Description', 'Shipping', 'Seller'].map((tab) => {
            const key = tab.toLowerCase();
            const isActive = activeTab === key;
            return (
              <button 
                key={key} 
                style={{ 
                  padding: '14px 24px', 
                  fontWeight: isActive ? '600' : '400', 
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  borderBottom: isActive ? '3px solid var(--primary)' : '3px solid transparent'
                }}
                onClick={() => setActiveTab(key)}
              >
                {tab}
              </button>
            );
          })}
        </div>
        <div style={{ padding: '24px', fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-muted)' }}>
          {activeTab === 'description' && (
            <div>
              <p style={{ marginBottom: '16px' }}>{product.description}</p>
              {product.details && Object.keys(product.details).length > 0 && (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <tbody>
                    {Object.entries(product.details).map(([key, val]) => (
                      <tr key={key} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '8px 12px', fontWeight: '600', color: 'var(--text-light)', width: '200px', backgroundColor: '#fafbfd' }}>{key}</td>
                        <td style={{ padding: '8px 12px', color: 'var(--text-main)' }}>{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
          {activeTab === 'shipping' && (
            <p>📦 <strong>Worldwide Express Delivery:</strong> Dispatches within 24-48 hours. Delivered using local shipping networks or international cargo partners.</p>
          )}
          {activeTab === 'seller' && (
            <p>🛡️ <strong>Verified Sourcing Supplier:</strong> Guaranteed matching product quality specs, direct OEM factory customizations supported.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ================= PAGE: CART =================
function CartPage({ 
  cart, 
  setCart,
  updateQuantity, 
  removeFromCart, 
  handleSaveForLater,
  savedForLater,
  setSavedForLater,
  handleMoveToCart 
}) {
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0.1;
  const total = subtotal - discount + tax;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'SAVE10') {
      setDiscount(10);
      alert('SAVE10 coupon applied! $10 off.');
    } else if (couponCode.toUpperCase() === 'WELCOME') {
      setDiscount(15);
      alert('WELCOME coupon applied! $15 off.');
    } else {
      alert('Invalid coupon code.');
    }
  };

  const handleCheckout = () => {
    setCheckoutSuccess(true);
  };

  const cartResponsiveStyles = `
    @media (max-width: 768px) {
      .cart-layout {
        flex-direction: column !important;
      }
      .cart-summary-panel {
        width: 100% !important;
      }
      .cart-item-block {
        flex-direction: column !important;
      }
    }
  `;

  return (
    <div className="container">
      <style>{cartResponsiveStyles}</style>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '20px' }}>
        My cart <span style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--text-light)' }}>({cart.length} items)</span>
      </h2>

      {checkoutSuccess ? (
        <div style={{ backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: '6px', padding: '60px 20px', textAlign: 'center', color: 'var(--green)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--green-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Check size={36} />
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '8px' }}>Order Sourced Successfully!</h3>
          <p style={{ color: 'var(--text-light)', marginBottom: '24px' }}>The manufacturer has received your request and will fulfill the order.</p>
          <button className="btn btn-primary" onClick={() => { setCart([]); setCheckoutSuccess(false); navigate('/'); }}>Go to Home</button>
        </div>
      ) : cart.length === 0 ? (
        <div style={{ backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: '6px', padding: '60px 20px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '8px' }}>Your cart is empty</h3>
          <button className="btn btn-primary" onClick={() => navigate('/products')}>Sourcing Catalog</button>
        </div>
      ) : (
        <div className="cart-layout" style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
          {/* Left List */}
          <div style={{ flex: 1, backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: '6px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {cart.map((item) => (
              <div key={item.product._id} className="cart-item-block" style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '20px' }}>
                <div style={{ width: '80px', height: '80px', border: '1px solid var(--border)', borderRadius: '6px', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <img src={item.product.image} alt={item.product.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                </div>
                
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-main)' }}>{item.product.name}</h4>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Category: {item.product.category}</span>
                    </div>
                    <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button className="btn btn-red" style={{ padding: '6px 12px', fontSize: '0.8rem', gap: '4px' }} onClick={() => removeFromCart(item.product._id)}>
                        <Trash2 size={14} /> Remove
                      </button>
                      <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => handleSaveForLater(item.product)}>
                        Save for later
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
                      <button style={{ padding: '6px 10px', backgroundColor: '#f7f8fa' }} onClick={() => updateQuantity(item.product._id, item.quantity - 1)}>
                        <Minus size={12} />
                      </button>
                      <span style={{ padding: '0 12px', fontSize: '0.9rem', fontWeight: '600' }}>{item.quantity}</span>
                      <button style={{ padding: '6px 10px', backgroundColor: '#f7f8fa' }} onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Panel Summary */}
          <div className="cart-summary-panel" style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: '6px', padding: '16px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', display: 'block', marginBottom: '8px' }}>Have a coupon?</span>
              <form onSubmit={handleApplyCoupon} style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
                <input 
                  type="text" 
                  placeholder="Code (SAVE10)" 
                  className="form-input" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  style={{ border: 'none', padding: '8px 12px' }}
                />
                <button type="submit" className="btn btn-secondary" style={{ borderRadius: '0', border: 'none', padding: '0 16px' }}>Apply</button>
              </form>
            </div>

            <div style={{ backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: '6px', padding: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Discount:</span>
                    <span style={{ color: 'var(--red)' }}>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Tax (10%):</span>
                  <span>+${tax.toFixed(2)}</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
                <span style={{ fontWeight: '600', fontSize: '1rem' }}>Total:</span>
                <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)' }}>${total.toFixed(2)}</span>
              </div>

              <button className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '1rem', backgroundColor: 'var(--green)' }} onClick={handleCheckout}>
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saved for later */}
      {savedForLater.length > 0 && (
        <div style={{ marginTop: '40px', borderTop: '1px solid var(--border)', paddingTop: '30px', marginBottom: '40px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '20px' }}>Saved for later</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {savedForLater.map((product) => (
              <div key={product._id} className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', cursor: 'pointer' }} onClick={() => navigate(`/product/${product._id}`)}>
                    <img src={product.image} alt={product.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                  </div>
                  <span style={{ fontSize: '1.05rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>${product.price.toFixed(2)}</span>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '36px' }}>
                    {product.name}
                  </h4>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-outline" style={{ padding: '6px 10px', flex: 1, fontSize: '0.8rem' }} onClick={() => setSavedForLater(prev => prev.filter(x => x._id !== product._id))}>
                    Remove
                  </button>
                  <button className="btn btn-secondary" style={{ padding: '6px 10px', flex: 2, fontSize: '0.8rem', display: 'flex', gap: '4px', alignItems: 'center', justifyContent: 'center' }} onClick={() => handleMoveToCart(product)}>
                    <ShoppingCart size={12} /> Move to cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
