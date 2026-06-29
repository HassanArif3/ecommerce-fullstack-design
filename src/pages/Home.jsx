import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Sparkles, ShoppingCart, Search, Truck, ShieldCheck } from 'lucide-react';
import { getAllProducts } from '../api/products';

export default function Home({ addToCart }) {
  const navigate = useNavigate();
  const [inquiryText, setInquiryText] = useState('');
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
      <div style={{ display: 'flex', backgroundColor: '#ffffff', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden', height: '150px' }}>
        <div style={{ 
          width: '240px', 
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.25)), url(https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format&fit=crop&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          color: 'white',
          flexShrink: 0
        }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '12px', color: '#1c1c1c', lineHeight: '1.2' }}>Home and<br/>outdoor</h4>
          <Link to="/products?category=Home interiors" className="btn" style={{ padding: '6px 12px', fontSize: '0.75rem', backgroundColor: 'white', color: '#1c1c1c', fontWeight: '600', borderRadius: '4px' }}>
            Source now
          </Link>
        </div>
        
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {homeInteriors.slice(0, 4).map((product) => (
            <Link 
              key={product._id}
              to={`/product/${product._id}`}
              style={{ padding: '12px', borderRight: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%', backgroundColor: '#ffffff' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', flex: 1, marginRight: '8px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-main)', lineHeight: '1.3', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>From <strong style={{ color: 'var(--text-muted)' }}>USD {product.price}</strong></span>
              </div>
              <div style={{ width: '68px', height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <img src={product.image} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover', borderRadius: '4px' }} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 3.5. Section: Consumer Electronics */}
      <div style={{ display: 'flex', backgroundColor: '#ffffff', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden', height: '150px' }}>
        <div style={{ 
          width: '240px', 
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.25)), url(https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          color: 'white',
          flexShrink: 0
        }}>
          <div style={{ color: '#1c1c1c' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '12px', color: '#1c1c1c', lineHeight: '1.2' }}>Consumer<br/>electronics</h4>
            <Link to="/products?category=Electronics" className="btn" style={{ padding: '6px 12px', fontSize: '0.75rem', backgroundColor: 'white', color: '#1c1c1c', fontWeight: '600', borderRadius: '4px' }}>
              Source now
            </Link>
          </div>
        </div>
        
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {electronics.slice(0, 4).map((product) => (
            <Link 
              key={product._id}
              to={`/product/${product._id}`}
              style={{ padding: '12px', borderRight: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%', backgroundColor: '#ffffff' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', flex: 1, marginRight: '8px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-main)', lineHeight: '1.3', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>From <strong style={{ color: 'var(--text-muted)' }}>USD {product.price}</strong></span>
              </div>
              <div style={{ width: '68px', height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <img src={product.image} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover', borderRadius: '4px' }} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 3.7. Inquiry Banner */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        backgroundImage: 'linear-gradient(135deg, #3182ce 0%, #1a365d 100%)', 
        color: 'white', 
        borderRadius: '6px', 
        padding: '30px 40px',
        margin: '20px 0',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '10px' }}>An easy way to send requests to all suppliers</h3>
          <p style={{ fontSize: '0.9rem', color: '#ebf8ff' }}>Specify your requirements and get custom quotes directly from verified global manufacturers.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="What item do you need?" 
            value={inquiryText}
            onChange={(e) => setInquiryText(e.target.value)}
            style={{ padding: '12px 16px', borderRadius: '4px', border: 'none', minWidth: '240px', color: '#1c1c1c' }}
          />
          <button 
            className="btn" 
            style={{ padding: '12px 24px', backgroundColor: '#007aff', color: 'white', fontWeight: '700', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            onClick={() => {
              if (!inquiryText.trim()) {
                alert("Please enter what item you need first.");
                return;
              }
              alert(`Inquiry sent! Suppliers have been notified for: "${inquiryText}".`);
              setInquiryText('');
            }}
          >
            Send inquiry
          </button>
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
