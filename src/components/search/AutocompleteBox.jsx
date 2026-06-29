import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { getAllProducts } from '../../api/products';

export default function AutocompleteBox({ query, setQuery, category }) {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const params = { search: query };
        if (category && category !== 'All category') {
          params.category = category;
        }
        const data = await getAllProducts(params);
        setSuggestions(data.slice(0, 5)); // show top 5 matching items
      } catch (err) {
        console.error("Autocomplete fetch failed:", err);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchSuggestions();
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [query, category]);

  // Handle click outside to close
  useEffect(() => {
    const handleClose = () => setShow(false);
    document.addEventListener('click', handleClose);
    return () => document.removeEventListener('click', handleClose);
  }, []);

  if (query.trim().length < 2 || suggestions.length === 0) return null;

  return (
    <div 
      style={{ 
        position: 'absolute', 
        top: '100%', 
        left: 0, 
        right: 0, 
        backgroundColor: 'white', 
        border: '1px solid var(--border)', 
        borderRadius: '0 0 6px 6px', 
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)', 
        zIndex: 50, 
        marginTop: '2px',
        overflow: 'hidden'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {suggestions.map((item) => (
          <li 
            key={item._id} 
            style={{ 
              padding: '10px 16px', 
              borderBottom: '1px solid #f1f2f4', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f7f8fa'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            onClick={() => {
              setQuery(item.name);
              setShow(false);
              navigate(`/product/${item._id}`);
            }}
          >
            <img src={item.image} alt={item.name} style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>USD {item.price.toFixed(2)}</div>
            </div>
            <Search size={14} style={{ color: 'var(--text-light)' }} />
          </li>
        ))}
      </ul>
    </div>
  );
}
