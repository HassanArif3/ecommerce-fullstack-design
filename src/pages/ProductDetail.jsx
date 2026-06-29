import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, Star, ArrowLeft, ShoppingCart } from 'lucide-react';
import { getProductById } from '../api/products';

export default function ProductDetail({ addToCart, handleSaveForLater }) {
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
              <div style={{ display: 'color: var(--orange)' }}>
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
                    {Object.entries(product.details).map(([key, val], idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f2f4' }}>
                        <td style={{ padding: '10px 0', width: '200px', color: 'var(--text-light)', fontWeight: '500' }}>{key}</td>
                        <td style={{ padding: '10px 0', color: 'var(--text-main)' }}>{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
          {activeTab === 'shipping' && (
            <p>Standard global logistics delivery options are supported for this item. Shipping time takes approximately 10-15 business days depending on customs processing in your destination region. Trade assurance protection is covered.</p>
          )}
          {activeTab === 'seller' && (
            <p>Verified Global Manufacturer. Gold supplier standard with positive client evaluations and standard trade protection agreements.</p>
          )}
        </div>
      </div>
    </div>
  );
}
