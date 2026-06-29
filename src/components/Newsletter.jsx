import React from 'react';

export default function Newsletter() {
  return (
    <section style={{ backgroundColor: '#eaecef', padding: '36px 0', borderTop: '1px solid var(--border)' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '4px' }}>Subscribe on our newsletter</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Get daily news on upcoming offers from many suppliers all over the world</p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed!'); }} style={{ display: 'flex', gap: '8px', maxWidth: '380px', width: '100%' }}>
          <input 
            type="email" 
            placeholder="Email address" 
            className="form-input" 
            style={{ padding: '10px 14px', flex: 1 }}
            required
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px' }}>
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
