import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck } from 'lucide-react';

export default function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0', fontSize: '1.25rem', color: 'var(--text-light)' }}>
        Loading Auth State...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 20px', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--red-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red)', marginBottom: '24px' }}>
          <ShieldCheck size={44} />
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', fontFamily: 'var(--font-title)', color: 'var(--text-main)', marginBottom: '12px' }}>Access Denied (403)</h2>
        <p style={{ color: 'var(--text-light)', maxWidth: '460px', marginBottom: '30px', fontSize: '0.95rem', lineHeight: '1.6' }}>
          You do not have the necessary administrator permissions to view this dashboard page. Please log in with an admin account or return to the main catalog.
        </p>
        <Link to="/" className="btn btn-primary">Go back to Home</Link>
      </div>
    );
  }

  return children;
}
