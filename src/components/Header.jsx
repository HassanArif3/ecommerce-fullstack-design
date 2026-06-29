import React from 'react';
import { Link } from 'react-router-dom';
import { Search, User, ShoppingCart, ChevronDown, ShoppingBag, LogOut, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

import AutocompleteBox from './search/AutocompleteBox';

export default function Header({ 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory, 
  cart, 
  handleLogout, 
  handleSearchSubmit 
}) {
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="site-header" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--border)' }}>
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
          <span style={{ fontSize: '1.6rem', fontWeight: '800', fontFamily: 'var(--font-title)', letterSpacing: '-0.5px', color: '#1c1c1c' }}>ApexMarket</span>
        </Link>

        {/* Search bar */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flex: 1, maxWidth: '640px', border: '2px solid var(--primary)', borderRadius: '6px', overflow: 'visible', position: 'relative' }}>
          <div style={{ flex: 1, position: 'relative', display: 'flex' }}>
            <input 
              type="text" 
              placeholder="Search products, brands..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, padding: '12px 16px', fontSize: '0.95rem', color: 'var(--text-main)', backgroundColor: 'white', border: 'none', width: '100%' }}
            />
            <AutocompleteBox query={searchQuery} setQuery={setSearchQuery} category={selectedCategory} />
          </div>
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
              <Link to="/profile" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                <User size={20} />
                <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>{user?.name.split(' ')[0]}</span>
              </Link>
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
  );
}
