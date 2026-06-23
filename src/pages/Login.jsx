import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ShieldAlert } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '60px 20px' }}>
      <div className="card" style={{ maxWidth: '420px', width: '100%', padding: '36px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)', borderRadius: '12px', backgroundColor: '#ffffff' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', fontFamily: 'var(--font-title)', color: 'var(--text-main)', marginBottom: '8px' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Sign in to continue sourcing products</p>
        </div>

        {error && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', backgroundColor: 'var(--red-light)', border: '1px solid var(--red)', color: 'var(--red)', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px', fontSize: '0.85rem' }}>
            <ShieldAlert size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Email */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="email" 
                placeholder="customer@brand.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '10px 16px 10px 40px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.9rem' }}
                required
              />
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-light)' }} />
            </div>
          </div>

          {/* Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '10px 16px 10px 40px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.9rem' }}
                required
              />
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-light)' }} />
            </div>
          </div>

          {/* Submit */}
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '12px', fontWeight: '600', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-light)' }}>
          <span>Don't have an account? </span>
          <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: '600' }}>Register now</Link>
        </div>

      </div>
    </div>
  );
}
