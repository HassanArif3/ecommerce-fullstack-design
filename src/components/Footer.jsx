import React from 'react';
import { ShoppingBag } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--border)', padding: '40px 0 20px' }}>
      <div className="container">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', justifyContent: 'space-between', marginBottom: '40px' }}>
          
          <div style={{ maxWidth: '260px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', marginBottom: '16px' }}>
              <div style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingBag size={18} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', fontFamily: 'var(--font-title)', color: '#1c1c1c' }}>ApexMarket</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '16px' }}>
              Best information about the company goes here but now lorem ipsum is dummy text.
            </p>
            <div style={{ display: 'flex', gap: '12px', color: '#8b96a5' }}>
              <span style={{ cursor: 'pointer' }}>
                <svg fill="currentColor" viewBox="0 0 24 24" width="16" height="16">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                </svg>
              </span>
              <span style={{ cursor: 'pointer' }}>
                <svg fill="currentColor" viewBox="0 0 24 24" width="16" height="16">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </span>
            </div>
          </div>

          {[
            { title: "About", links: ["About Us", "Find store", "Categories", "Blogs"] },
            { title: "Partnership", links: ["About Us", "Find store", "Categories", "Blogs"] },
            { title: "Information", links: ["Help Center", "Money Refund", "Shipping", "Contact us"] }
          ].map((col, idx) => (
            <div key={idx}>
              <h5 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '16px', color: 'var(--text-main)' }}>{col.title}</h5>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {col.links.map((link, i) => (
                  <li key={i} style={{ cursor: 'pointer' }}>
                    {link}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h5 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '16px', color: 'var(--text-main)' }}>Get app</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '600', padding: '6px 12px', border: '1px solid var(--border)', borderRadius: '6px', backgroundColor: '#fafbfd', cursor: 'pointer' }}>App Store</span>
              <span style={{ fontSize: '0.8rem', fontWeight: '600', padding: '6px 12px', border: '1px solid var(--border)', borderRadius: '6px', backgroundColor: '#fafbfd', cursor: 'pointer' }}>Google Play</span>
            </div>
          </div>

        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-light)' }}>
          <span>© 2026 ApexMarket. All rights reserved.</span>
          <span>English (US) 🇺🇸</span>
        </div>
      </div>
    </footer>
  );
}
