import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, Plus, Minus, Check, ShoppingCart, ArrowLeft, ArrowRight, ShieldCheck, CreditCard } from 'lucide-react';

export default function Cart({ 
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
  const [step, setStep] = useState(1); // 1: Sourcing Details, 2: Pricing & Coupon, 3: Confirmation Summary
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [sourcingDetails, setSourcingDetails] = useState({
    fullName: '',
    companyName: '',
    requirements: '',
    shippingAddress: ''
  });

  // Calculate bulk pricing discount: > 10 items of a single product gets a 10% discount
  const getProductPrice = (item) => {
    return item.quantity >= 10 ? item.product.price * 0.9 : item.product.price;
  };

  const subtotal = cart.reduce((sum, item) => sum + (getProductPrice(item) * item.quantity), 0);
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

      {/* Checkout Steps Indicator Bar */}
      {cart.length > 0 && !checkoutSuccess && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px', position: 'relative' }}>
          <div style={{ display: 'flex', justifycontent: 'space-between', maxWidth: '500px', width: '100%', position: 'relative', zIndex: 1 }}>
            {[
              { num: 1, label: 'Sourcing Details' },
              { num: 2, label: 'Bulk & Coupon' },
              { num: 3, label: 'Verification' }
            ].map((s) => (
              <div key={s.num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <div 
                  style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    backgroundColor: step >= s.num ? 'var(--primary)' : '#e2e8f0', 
                    color: step >= s.num ? 'white' : 'var(--text-light)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s'
                  }}
                >
                  {step > s.num ? '✓' : s.num}
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: step === s.num ? '700' : '500', color: step >= s.num ? 'var(--text-main)' : 'var(--text-light)', marginTop: '6px' }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
          {/* Background line */}
          <div style={{ position: 'absolute', top: '16px', left: '25%', right: '25%', height: '2px', backgroundColor: '#e2e8f0', zIndex: 0 }} />
          <div style={{ position: 'absolute', top: '16px', left: '25%', width: step === 1 ? '0%' : step === 2 ? '50%' : '50%', height: '2px', backgroundColor: 'var(--primary)', zIndex: 0, transition: 'all 0.3s' }} />
        </div>
      )}

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
          
          {/* ================= STEP 1: SOURCING INFO ================= */}
          {step === 1 && (
            <div style={{ flex: 1, backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: '6px', padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>Enter Sourcing & Specifications Details</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Contact Person Name *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Hassan Arif"
                      value={sourcingDetails.fullName}
                      onChange={(e) => setSourcingDetails(prev => ({ ...prev, fullName: e.target.value }))}
                      required
                    />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Company Name *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Sourcing Corp LLC"
                      value={sourcingDetails.companyName}
                      onChange={(e) => setSourcingDetails(prev => ({ ...prev, companyName: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Delivery/Shipping Address *</label>
                  <textarea 
                    className="form-input" 
                    rows="3" 
                    placeholder="Provide full shipping address..."
                    value={sourcingDetails.shippingAddress}
                    onChange={(e) => setSourcingDetails(prev => ({ ...prev, shippingAddress: e.target.value }))}
                    style={{ height: 'auto', resize: 'none', padding: '12px' }}
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Custom Manufacturing Requirements (Optional)</label>
                  <textarea 
                    className="form-input" 
                    rows="4" 
                    placeholder="Specify sizing, materials, customization logo options..."
                    value={sourcingDetails.requirements}
                    onChange={(e) => setSourcingDetails(prev => ({ ...prev, requirements: e.target.value }))}
                    style={{ height: 'auto', resize: 'none', padding: '12px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button 
                  className="btn btn-primary" 
                  disabled={!sourcingDetails.fullName || !sourcingDetails.companyName || !sourcingDetails.shippingAddress}
                  onClick={() => setStep(2)}
                  style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                >
                  Continue to Pricing <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 2: BULK DISCOUNT & COUPON ================= */}
          {step === 2 && (
            <div style={{ flex: 1, backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: '6px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '12px', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Review Sourcing Tiers</h3>
                <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: '600', backgroundColor: '#e6fcf5', padding: '4px 8px', borderRadius: '4px' }}>
                  💡 Tip: Buy 10+ of any item to trigger 10% Bulk Discount!
                </span>
              </div>

              {cart.map((item) => {
                const bulkApplied = item.quantity >= 10;
                return (
                  <div key={item.product._id} className="cart-item-block" style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '20px' }}>
                    <div style={{ width: '80px', height: '80px', border: '1px solid var(--border)', borderRadius: '6px', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <img src={item.product.image} alt={item.product.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                    </div>
                    
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                        <div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-main)' }}>{item.product.name}</h4>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                            Base Price: ${item.product.price.toFixed(2)}
                            {bulkApplied && <strong style={{ color: '#10b981', marginLeft: '8px' }}>(10% Bulk pricing active: ${(item.product.price * 0.9).toFixed(2)}/ea)</strong>}
                          </span>
                        </div>
                        <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>${(getProductPrice(item) * item.quantity).toFixed(2)}</span>
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
                          <button style={{ padding: '6px 10px', backgroundColor: '#f7f8fa', border: 'none', cursor: 'pointer' }} onClick={() => updateQuantity(item.product._id, item.quantity - 1)}>
                            <Minus size={12} />
                          </button>
                          <span style={{ padding: '0 12px', fontSize: '0.9rem', fontWeight: '600' }}>{item.quantity}</span>
                          <button style={{ padding: '6px 10px', backgroundColor: '#f7f8fa', border: 'none', cursor: 'pointer' }} onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                <button className="btn btn-outline" onClick={() => setStep(1)} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <ArrowLeft size={16} /> Back to Details
                </button>
                <button className="btn btn-primary" onClick={() => setStep(3)} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  Continue to Summary <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 3: ORDER SUMMARY & CONFIRM ================= */}
          {step === 3 && (
            <div style={{ flex: 1, backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: '6px', padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>Verify Order Specifications</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', backgroundColor: '#fafbfd', padding: '20px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', borderBottom: '1px solid #f1f2f4', paddingBottom: '8px' }}>
                  <span style={{ width: '150px', color: 'var(--text-light)', fontWeight: '600' }}>Contact Name:</span>
                  <span style={{ fontWeight: '500', color: 'var(--text-main)' }}>{sourcingDetails.fullName}</span>
                </div>
                <div style={{ display: 'flex', borderBottom: '1px solid #f1f2f4', paddingBottom: '8px' }}>
                  <span style={{ width: '150px', color: 'var(--text-light)', fontWeight: '600' }}>Company Name:</span>
                  <span style={{ fontWeight: '500', color: 'var(--text-main)' }}>{sourcingDetails.companyName}</span>
                </div>
                <div style={{ display: 'flex', borderBottom: '1px solid #f1f2f4', paddingBottom: '8px' }}>
                  <span style={{ width: '150px', color: 'var(--text-light)', fontWeight: '600' }}>Shipping Address:</span>
                  <span style={{ fontWeight: '500', color: 'var(--text-main)' }}>{sourcingDetails.shippingAddress}</span>
                </div>
                {sourcingDetails.requirements && (
                  <div style={{ display: 'flex' }}>
                    <span style={{ width: '150px', color: 'var(--text-light)', fontWeight: '600' }}>Custom Specs:</span>
                    <span style={{ fontWeight: '500', color: 'var(--text-main)', fontStyle: 'italic' }}>{sourcingDetails.requirements}</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '700' }}>Selected Sourced Items</h4>
                <div style={{ border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
                  {cart.map(item => (
                    <div key={item.product._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
                      <span>{item.product.name} (x{item.quantity})</span>
                      <span style={{ fontWeight: '600' }}>${(getProductPrice(item) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                <button className="btn btn-outline" onClick={() => setStep(2)} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <ArrowLeft size={16} /> Edit Sourcing Tiers
                </button>
                <button className="btn btn-primary" onClick={handleCheckout} style={{ display: 'flex', gap: '8px', alignItems: 'center', backgroundColor: 'var(--green)' }}>
                  <ShieldCheck size={16} /> Submit Order Request
                </button>
              </div>
            </div>
          )}

          {/* Right Panel Summary (Dynamic calculations based on step) */}
          <div className="cart-summary-panel" style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {step === 2 && (
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
            )}

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
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontWeight: '600', fontSize: '1rem' }}>Total:</span>
                <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)' }}>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Saved for later */}
      {savedForLater.length > 0 && !checkoutSuccess && (
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
