import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, ShieldAlert } from 'lucide-react';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signup(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '60px 20px' }}>
      <div className="card" style={{ maxWidth: '420px', width: '100%', padding: '36px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)', borderRadius: '12px', backgroundColor: '#ffffff' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', fontFamily: 'var(--font-title)', color: 'var(--text-main)', marginBottom: '8px' }}>Create Account</h2>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Join now to start sourcing products</p>
        </div>

        {error && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', backgroundColor: 'var(--red-light)', border: '1px solid var(--red)', color: 'var(--red)', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px', fontSize: '0.85rem' }}>
            <ShieldAlert size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Name */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="John Doe" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '10px 16px 10px 40px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.9rem' }}
                required
              />
              <User size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-light)' }} />
            </div>
          </div>

          {/* Email */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="email" 
                placeholder="john@example.com" 
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
                placeholder="Minimum 6 characters" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '10px 16px 10px 40px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.9rem' }}
                minLength="6"
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
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-light)' }}>
          <span>Already have an account? </span>
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Sign In</Link>
        </div>

      </div>
    </div>
  );
}
