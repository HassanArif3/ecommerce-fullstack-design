import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, ShoppingBag, History, Calendar, ArrowLeft, ShoppingCart, CheckCircle2 } from 'lucide-react';

export default function Profile({ cart = [] }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const mockOrders = [
    {
      id: "ORD-9821-4820",
      date: "June 24, 2026",
      total: 689.00,
      status: "Delivered",
      items: [
        { name: "Canon Professional DSLR Camera Body Only", quantity: 1 }
      ]
    },
    {
      id: "ORD-3741-9021",
      date: "May 12, 2026",
      total: 120.10,
      status: "Delivered",
      items: [
        { name: "Pro Sound Active Noise Cancelling Headphones", quantity: 1 },
        { name: "Mens Long Sleeve T-shirt Cotton Base Layer", quantity: 2 }
      ]
    }
  ];

  return (
    <div className="container" style={{ padding: '40px 20px', minHeight: '80vh' }}>
      {/* Back button */}
      <button 
        onClick={() => navigate(-1)}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: 'var(--text-light)', marginBottom: '24px', fontWeight: '500' }}
      >
        <ArrowLeft size={16} />
        Back to shopping
      </button>

      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', fontFamily: 'var(--font-title)', color: 'var(--text-main)', marginBottom: '8px' }}>User Profile</h1>
        <p style={{ color: 'var(--text-light)' }}>Manage your account, view your active cart, and check your order history.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', alignItems: 'start' }}>
        {/* Left Column: Account Details */}
        <div className="card" style={{ padding: '30px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)', borderRadius: '12px', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '24px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <User size={40} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>{user?.name}</h3>
            <span style={{ fontSize: '0.85rem', color: 'white', backgroundColor: user?.role === 'admin' ? 'var(--red)' : 'var(--primary)', padding: '2px 8px', borderRadius: '20px', fontWeight: '600', textTransform: 'capitalize' }}>
              {user?.role}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Mail size={18} style={{ color: 'var(--text-light)' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</div>
                <div style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: '500' }}>{user?.email}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Shield size={18} style={{ color: 'var(--text-light)' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Account Status</div>
                <div style={{ fontSize: '0.95rem', color: 'green', fontWeight: '600' }}>Active / Verified</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Calendar size={18} style={{ color: 'var(--text-light)' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Member Since</div>
                <div style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: '500' }}>June 2026</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Cart & Orders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* Active Cart Section */}
          <div className="card" style={{ padding: '30px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)', borderRadius: '12px', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingCart size={20} style={{ color: 'var(--primary)' }} />
                Active Shopping Cart
              </h3>
              <Link to="/cart" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600' }}>View Full Cart</Link>
            </div>

            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-light)' }}>
                <p>Your shopping cart is currently empty.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {cart.slice(0, 3).map((item, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: index < 2 && index < cart.length - 1 ? '1px dashed var(--border)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border)' }} />
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)' }}>{item.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Qty: {item.quantity} &times; ${item.price}</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.95rem' }}>
                      ${(item.quantity * item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
                {cart.length > 3 && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', textAlign: 'center', marginTop: '8px' }}>
                    And {cart.length - 3} more items in your cart.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Order History Section */}
          <div className="card" style={{ padding: '30px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)', borderRadius: '12px', backgroundColor: '#ffffff' }}>
            <div style={{ marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <History size={20} style={{ color: 'var(--primary)' }} />
                Order History
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {mockOrders.map((order, index) => (
                <div key={index} style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '16px', backgroundColor: '#fdfdfd' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)' }}>{order.id}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginLeft: '12px' }}>{order.date}</span>
                    </div>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'green', backgroundColor: '#eefcf5', padding: '2px 8px', borderRadius: '12px', fontWeight: '600' }}>
                      <CheckCircle2 size={12} />
                      {order.status}
                    </span>
                  </div>

                  <div style={{ borderTop: '1px solid #f1f2f4', paddingTop: '10px' }}>
                    {order.items.map((item, i) => (
                      <div key={i} style={{ fontSize: '0.85rem', color: 'var(--text-light)', display: 'flex', justifyContent: 'space-between' }}>
                        <span>{item.name} &times; {item.quantity}</span>
                        <span style={{ fontWeight: '500' }}>${(order.total).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
