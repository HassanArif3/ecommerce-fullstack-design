import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0', fontSize: '1.25rem', color: 'var(--text-light)' }}>
        Loading Auth State...
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
