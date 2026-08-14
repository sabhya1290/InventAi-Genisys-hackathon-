import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { useAppStore } from '../store/MockAppStore';
import type { Product } from '../store/MockAppStore';

export const Inventory: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '', sku: '', category: '', description: '', purchase_price: 0, selling_price: 0, stock_quantity: 0, reorder_threshold: 5
  });

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenEdit = (product: Product) => {
    setNewProduct(product);
    setEditingProductId(product._id);
    setIsAddModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      deleteProduct(id);
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProductId) {
      updateProduct(editingProductId, newProduct);
    } else {
      addProduct(newProduct as Omit<Product, '_id' | 'status' | 'createdAt'>);
    }
    closeModal();
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setEditingProductId(null);
    setNewProduct({ name: '', sku: '', category: '', description: '', purchase_price: 0, selling_price: 0, stock_quantity: 0, reorder_threshold: 5 });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'In Stock': return 'badge-success';
      case 'Low Stock': return 'badge-warning';
      case 'Out of Stock': return 'badge-danger';
      default: return 'badge-info';
    }
  };

  return (
    <div className="page-container" style={{ padding: 0 }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: 'var(--color-primary-dark)' }}>Inventory Management</h1>
          <p style={{ color: 'var(--color-text-light)' }}>Manage your products, pricing, and stock levels.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem', display: 'flex', gap: '1rem' }}>
        <div className="search-bar" style={{ flex: 1, maxWidth: '400px' }}>
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Product Info</th>
                <th>Category</th>
                <th>Pricing (₹)</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product._id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{product.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>{product.sku}</div>
                  </td>
                  <td>{product.category}</td>
                  <td>
                    <div>Buy: ₹{product.purchase_price}</div>
                    <div style={{ fontWeight: 500 }}>Sell: ₹{product.selling_price}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{product.stock_quantity}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>Min: {product.reorder_threshold}</div>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadge(product.status)}`}>{product.status}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-ghost" style={{ padding: '0.25rem' }} onClick={() => handleOpenEdit(product)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="btn btn-ghost" style={{ padding: '0.25rem', color: 'var(--color-danger)' }} onClick={() => handleDelete(product._id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem' }}>No products found. Add a new product to get started.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isAddModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', margin: '1rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>{editingProductId ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleAdd}>
              <div className="input-group">
                <label className="input-label">Product Name</label>
                <input required className="input-field" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2">
                <div className="input-group">
                  <label className="input-label">SKU</label>
                  <input required className="input-field" value={newProduct.sku} onChange={e => setNewProduct({ ...newProduct, sku: e.target.value })} />
                </div>
                <div className="input-group">
                  <label className="input-label">Category</label>
                  <input required className="input-field" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} />
                </div>
                <div className="input-group">
                  <label className="input-label">Purchase Price (₹)</label>
                  <input required type="number" className="input-field" value={newProduct.purchase_price} onChange={e => setNewProduct({ ...newProduct, purchase_price: Number(e.target.value) })} />
                </div>
                <div className="input-group">
                  <label className="input-label">Selling Price (₹)</label>
                  <input required type="number" className="input-field" value={newProduct.selling_price} onChange={e => setNewProduct({ ...newProduct, selling_price: Number(e.target.value) })} />
                </div>
                <div className="input-group">
                  <label className="input-label">Initial Stock</label>
                  <input required type="number" className="input-field" value={newProduct.stock_quantity} onChange={e => setNewProduct({ ...newProduct, stock_quantity: Number(e.target.value) })} />
                </div>
                <div className="input-group">
                  <label className="input-label">Reorder Alert At</label>
                  <input required type="number" className="input-field" value={newProduct.reorder_threshold} onChange={e => setNewProduct({ ...newProduct, reorder_threshold: Number(e.target.value) })} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingProductId ? 'Save Changes' : 'Save Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
