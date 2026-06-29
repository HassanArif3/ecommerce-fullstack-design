import React from 'react';

export default function StockChart({ products }) {
  if (!products || products.length === 0) return null;

  // Group stock count by categories
  const categoriesMap = {};
  products.forEach(p => {
    const cat = p.category || 'Other';
    if (!categoriesMap[cat]) {
      categoriesMap[cat] = { count: 0, stockSum: 0 };
    }
    categoriesMap[cat].count += 1;
    categoriesMap[cat].stockSum += p.stock || 0;
  });

  const categoryData = Object.entries(categoriesMap).map(([name, data]) => ({
    name,
    stock: data.stockSum,
    count: data.count
  }));

  const maxStock = Math.max(...categoryData.map(d => d.stock), 1);
  const chartHeight = 140;
  const barWidth = 40;
  const gap = 30;

  return (
    <div style={{ backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: '6px', padding: '20px', marginTop: '20px' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '15px', color: 'var(--text-main)' }}>Inventory Levels by Category</h3>
      
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', height: `${chartHeight + 40}px`, gap: `${gap}px`, borderBottom: '2px solid #cbd5e1', paddingBottom: '10px' }}>
        {categoryData.map((data, index) => {
          const barHeight = (data.stock / maxStock) * chartHeight;
          return (
            <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              {/* Tooltip on top */}
              <div 
                style={{ 
                  position: 'absolute', 
                  bottom: `${barHeight + 45}px`, 
                  backgroundColor: '#1e293b', 
                  color: 'white', 
                  fontSize: '0.75rem', 
                  padding: '4px 8px', 
                  borderRadius: '4px',
                  whiteSpace: 'nowrap',
                  fontWeight: '600'
                }}
              >
                {data.stock} units ({data.count} items)
              </div>

              {/* SVG Animated Bar */}
              <svg width={barWidth} height={chartHeight} style={{ overflow: 'visible' }}>
                <rect 
                  x="0" 
                  y={chartHeight - barHeight} 
                  width={barWidth} 
                  height={barHeight} 
                  rx="4" 
                  fill="url(#barGradient)" 
                  style={{ transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
                />
                
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" />
                    <stop offset="100%" stopColor="#60a5fa" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Label */}
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px', fontWeight: '500', textTransform: 'capitalize' }}>
                {data.name.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
