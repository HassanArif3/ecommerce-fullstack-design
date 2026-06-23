import React, { useState, useEffect } from 'react';
import { getAllProducts, addProduct, updateProduct, deleteProduct } from '../api/products';
import { Plus, Edit2, Trash2, X, RefreshCw, AlertTriangle, ShieldCheck, DollarSign, Layers, Package } from 'lucide-react';

export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form Modal States
  const [showFormModal, setShowFormModal] = useState(false);
  const [editProductItem, setEditProductItem] = useState(null); // null means Add, otherwise Edit
  const [formError, setFormError] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Deletion Modal States
  const [deleteProductItem, setDeleteProductItem] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  // Form Data
  const initialFormState = {
    name: '',
    price: '',
    image: '',
    description: '',
    category: 'Electronics',
    stock: '10',
    brand: '',
    rating: '7.5',
    reviews: '0',
    sold: '0',
    features: '',
    detailsKey1: '', detailsVal1: '',
    detailsKey2: '', detailsVal2: '',
    detailsKey3: '', detailsVal3: ''
  };
  const [formData, setFormData] = useState(initialFormState);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to fetch products. Check if the backend server is online.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditProductItem(null);
    setFormData(initialFormState);
    setFormError(null);
    setShowFormModal(true);
  };

  const openEditModal = (product) => {
    setEditProductItem(product);
    
    // Parse features and details map
    const featuresStr = product.features ? product.features.join(', ') : '';
    const detailsEntries = product.details ? Object.entries(product.details) : [];
    
    setFormData({
      name: product.name,
      price: product.price.toString(),
      image: product.image,
      description: product.description || '',
      category: product.category,
      stock: product.stock.toString(),
      brand: product.brand || '',
      rating: (product.rating || 0).toString(),
      reviews: (product.reviews || 0).toString(),
      sold: (product.sold || 0).toString(),
      features: featuresStr,
      detailsKey1: detailsEntries[0] ? detailsEntries[0][0] : '',
      detailsVal1: detailsEntries[0] ? detailsEntries[0][1] : '',
      detailsKey2: detailsEntries[1] ? detailsEntries[1][0] : '',
      detailsVal2: detailsEntries[1] ? detailsEntries[1][1] : '',
      detailsKey3: detailsEntries[2] ? detailsEntries[2][0] : '',
      detailsVal3: detailsEntries[2] ? detailsEntries[2][1] : ''
    });
    setFormError(null);
    setShowFormModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSubmitting(true);

    // Format data
    const featuresArray = formData.features
      ? formData.features.split(',').map(f => f.trim()).filter(Boolean)
      : [];
      
    const detailsMap = {};
    if (formData.detailsKey1 && formData.detailsVal1) detailsMap[formData.detailsKey1] = formData.detailsVal1;
    if (formData.detailsKey2 && formData.detailsVal2) detailsMap[formData.detailsKey2] = formData.detailsVal2;
    if (formData.detailsKey3 && formData.detailsVal3) detailsMap[formData.detailsKey3] = formData.detailsVal3;

    const finalProductData = {
      name: formData.name,
      price: parseFloat(formData.price),
      image: formData.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80',
      description: formData.description,
      category: formData.category,
      stock: parseInt(formData.stock) || 0,
      brand: formData.brand,
      rating: parseFloat(formData.rating) || 0,
      reviews: parseInt(formData.reviews) || 0,
      sold: parseInt(formData.sold) || 0,
      features: featuresArray,
      details: detailsMap
    };

    try {
      if (editProductItem) {
        await updateProduct(editProductItem._id, finalProductData);
      } else {
        await addProduct(finalProductData);
      }
      setShowFormModal(false);
      fetchProducts();
    } catch (err) {
      setFormError(err.message || 'Operation failed.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteProductItem) return;
    setDeleteSubmitting(true);
    try {
      await deleteProduct(deleteProductItem._id);
      setDeleteProductItem(null);
      fetchProducts();
    } catch (err) {
      alert(err.message || 'Failed to delete product.');
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const responsiveStyles = `
    @media (max-width: 768px) {
      .admin-table-container {
        display: none !important;
      }
      .admin-cards-container {
        display: grid !important;
        grid-template-columns: 1fr !important;
        gap: 16px !important;
      }
      .admin-header-actions {
        flex-direction: column !important;
        align-items: stretch !important;
        gap: 12px !important;
      }
    }
    @media (min-width: 769px) {
      .admin-cards-container {
        display: none !important;
      }
    }
  `;

  return (
    <div className="container" style={{ padding: '20px 0' }}>
      <style>{responsiveStyles}</style>

      {/* Header bar */}
      <div className="admin-header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', fontFamily: 'var(--font-title)' }}>Admin Dashboard</h2>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Manage catalog inventory products</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-outline" onClick={fetchProducts} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <RefreshCw size={16} /> Refresh
          </button>
          <button className="btn btn-primary" onClick={openAddModal} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-light)' }}>Loading Inventory...</div>
      ) : error ? (
        <div style={{ backgroundColor: 'var(--red-light)', border: '1px solid var(--red)', color: 'var(--red)', padding: '20px', borderRadius: '6px', textAlign: 'center' }}>
          {error}
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE VIEW */}
          <div className="admin-table-container" style={{ backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#fafbfd', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: '600' }}>Product Name</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: '600' }}>Category</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: '600' }}>Price</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: '600' }}>Stock</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id} style={{ borderBottom: '1px solid var(--border)', transition: 'var(--transition)' }}>
                    <td style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={product.image} alt={product.name} style={{ width: '40px', height: '40px', objectFit: 'contain', border: '1px solid var(--border)', borderRadius: '4px', padding: '2px' }} />
                      <div>
                        <span style={{ fontWeight: '600', display: 'block', color: 'var(--text-main)' }}>{product.name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Brand: {product.brand || 'Generic'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', color: 'var(--text-muted)' }}>{product.category}</td>
                    <td style={{ padding: '16px 20px', fontWeight: '700' }}>${product.price.toFixed(2)}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ color: product.stock > 0 ? 'var(--green)' : 'var(--red)', fontWeight: '600' }}>
                        {product.stock} units
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button className="btn btn-outline" onClick={() => openEditModal(product)} style={{ padding: '6px 10px', fontSize: '0.8rem', display: 'flex', gap: '4px' }}>
                          <Edit2 size={12} /> Edit
                        </button>
                        <button className="btn btn-red" onClick={() => setDeleteProductItem(product)} style={{ padding: '6px 10px', fontSize: '0.8rem', display: 'flex', gap: '4px' }}>
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS VIEW */}
          <div className="admin-cards-container" style={{ display: 'none' }}>
            {products.map(product => (
              <div key={product._id} className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <img src={product.image} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'contain', border: '1px solid var(--border)', borderRadius: '4px' }} />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>{product.name}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{product.category} | {product.brand || 'Generic'}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
                  <span>Price: <strong>${product.price.toFixed(2)}</strong></span>
                  <span>Stock: <strong style={{ color: product.stock > 0 ? 'var(--green)' : 'var(--red)' }}>{product.stock}</strong></span>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                  <button className="btn btn-outline" onClick={() => openEditModal(product)} style={{ flex: 1, padding: '8px', fontSize: '0.8rem' }}>
                    <Edit2 size={12} /> Edit
                  </button>
                  <button className="btn btn-red" onClick={() => setDeleteProductItem(product)} style={{ flex: 1, padding: '8px', fontSize: '0.8rem' }}>
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ADD/EDIT FORM MODAL */}
      {showFormModal && (
        <div style={{ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: '9999', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', overflowY: 'auto' }}>
          <div className="card" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '28px', backgroundColor: 'white', borderRadius: '12px', position: 'relative' }}>
            <button style={{ position: 'absolute', top: '20px', right: '20px', color: 'var(--text-light)' }} onClick={() => setShowFormModal(false)}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', fontFamily: 'var(--font-title)', marginBottom: '20px' }}>
              {editProductItem ? 'Edit Product Details' : 'Add New Product'}
            </h3>

            {formError && (
              <div style={{ backgroundColor: 'var(--red-light)', border: '1px solid var(--red)', color: 'var(--red)', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '0.85rem' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Product Title *</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({ ...formData, name: e.target.value })} 
                  style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: '6px' }}
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {/* Price */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Price (USD) *</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={formData.price} 
                    onChange={e => setFormData({ ...formData, price: e.target.value })} 
                    style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: '6px' }}
                    required 
                  />
                </div>
                {/* Stock */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Stock Units *</label>
                  <input 
                    type="number" 
                    value={formData.stock} 
                    onChange={e => setFormData({ ...formData, stock: e.target.value })} 
                    style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: '6px' }}
                    required 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {/* Category */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Category *</label>
                  <select 
                    value={formData.category} 
                    onChange={e => setFormData({ ...formData, category: e.target.value })} 
                    style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: '6px', backgroundColor: 'white' }}
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Home interiors">Home interiors</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                {/* Brand */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Brand Name</label>
                  <input 
                    type="text" 
                    value={formData.brand} 
                    onChange={e => setFormData({ ...formData, brand: e.target.value })} 
                    style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: '6px' }}
                  />
                </div>
              </div>

              {/* Image URL */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Image URL</label>
                <input 
                  type="text" 
                  value={formData.image} 
                  onChange={e => setFormData({ ...formData, image: e.target.value })} 
                  style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: '6px' }}
                  placeholder="https://unsplash.com/..."
                />
              </div>

              {/* Description */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Product Description</label>
                <textarea 
                  value={formData.description} 
                  onChange={e => setFormData({ ...formData, description: e.target.value })} 
                  style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: '6px', minHeight: '60px', fontFamily: 'inherit' }}
                />
              </div>

              {/* Features */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Key Features (comma-separated)</label>
                <input 
                  type="text" 
                  value={formData.features} 
                  onChange={e => setFormData({ ...formData, features: e.target.value })} 
                  style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: '6px' }}
                  placeholder="Metallic, Super power, 8GB Ram"
                />
              </div>

              {/* Specifications details key-values */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '8px' }}>Specifications (Details Key-Val)</label>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                  <input type="text" placeholder="Model" value={formData.detailsKey1} onChange={e => setFormData({ ...formData, detailsKey1: e.target.value })} style={{ flex: 1, padding: '6px 10px', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '0.85rem' }} />
                  <input type="text" placeholder="SW-400" value={formData.detailsVal1} onChange={e => setFormData({ ...formData, detailsVal1: e.target.value })} style={{ flex: 1, padding: '6px 10px', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '0.85rem' }} />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                  <input type="text" placeholder="Size" value={formData.detailsKey2} onChange={e => setFormData({ ...formData, detailsKey2: e.target.value })} style={{ flex: 1, padding: '6px 10px', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '0.85rem' }} />
                  <input type="text" placeholder="42mm" value={formData.detailsVal2} onChange={e => setFormData({ ...formData, detailsVal2: e.target.value })} style={{ flex: 1, padding: '6px 10px', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '0.85rem' }} />
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowFormModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={formSubmitting}>
                  {formSubmitting ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deleteProductItem && (
        <div style={{ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: '9999', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '24px', backgroundColor: 'white', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--red-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red)', margin: '0 auto 16px' }}>
              <AlertTriangle size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '8px' }}>Confirm Delete</h3>
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Are you sure you want to permanently delete <strong>{deleteProductItem.name}</strong> from catalog database? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setDeleteProductItem(null)} disabled={deleteSubmitting}>Cancel</button>
              <button className="btn btn-red" style={{ flex: 1 }} onClick={handleDeleteProduct} disabled={deleteSubmitting}>
                {deleteSubmitting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
