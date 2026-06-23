const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getCart = async (token) => {
  const response = await fetch(`${API_URL}/cart`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch cart from server');
  }
  return response.json();
};

export const saveCart = async (items, token) => {
  const response = await fetch(`${API_URL}/cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ items })
  });
  if (!response.ok) {
    throw new Error('Failed to save cart to server');
  }
  return response.json();
};
