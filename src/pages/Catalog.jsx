import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Grid, List } from 'lucide-react';
import { getAllProducts } from '../api/products';

export default function Catalog({ addToCart, handleSaveForLater }) {
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
