import React, { useState } from 'react';
import { useAppStore } from '../store/MockAppStore';
import { Mail, Phone, MapPin, Edit2, Trash2, Plus } from 'lucide-react';
import type { Customer } from '../store/MockAppStore';

export const Customers: React.FC = () => {
  const { customers, orders, addCustomer, updateCustomer, deleteCustomer } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCust, setNewCust] = useState<Partial<Customer>>({ name: '', phone: '', email: '', address: '' });

  const getCustomerStats = (customerId: string) => {
    const custOrders = orders.filter(o => {
      const cid = typeof o.customerId === 'object' ? (o.customerId as any)._id : o.customerId;
      return cid === customerId;
    });
    const totalSpent = custOrders.reduce((acc, o) => acc + o.total_amount, 0);
    return { ordersCount: custOrders.length, totalSpent };
  };

  const formatINR = (amt: number) => `₹${amt.toLocaleString('en-IN')}`;

  const openEdit = (c: Customer) => {
    setNewCust(c);
    setEditingId(c._id);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this customer? This will not delete their historical orders.')) {
      deleteCustomer(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateCustomer(editingId, newCust);
    } else {
      addCustomer(newCust as Omit<Customer, '_id' | 'createdAt'>);
    }
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setNewCust({ name: '', phone: '', email: '', address: '' });
  };

  return (
    <div className="page-container" style={{ padding: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: 'var(--color-primary-dark)' }}>Customers</h1>
          <p style={{ color: 'var(--color-text-light)' }}>Manage your customer database and view history.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Add Customer
        </button>
      </div>

      <div className="grid grid-cols-3">
        {customers.map(customer => {
          const stats = getCustomerStats(customer._id);
          return (
            <div key={customer._id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: 'var(--color-primary-light)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ margin: 0 }}>{customer.name}</h3>
                    <small style={{ color: 'var(--color-text-light)' }}>ID: #{customer._id.slice(-6)}</small>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <button className="btn btn-ghost" style={{ padding: '0.25rem' }} onClick={() => openEdit(customer)}><Edit2 size={16} /></button>
                  <button className="btn btn-ghost" style={{ padding: '0.25rem', color: 'var(--color-danger)' }} onClick={() => handleDelete(customer._id)}><Trash2 size={16} /></button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--color-text)' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.875rem' }}>
                  <Phone size={14} color="var(--color-text-light)" /> {customer.phone}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.875rem' }}>
                  <Mail size={14} color="var(--color-text-light)" /> {customer.email || 'N/A'}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.875rem' }}>
                  <MapPin size={14} color="var(--color-text-light)" /> {customer.address || 'N/A'}
                </div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dotted var(--color-border)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', textTransform: 'uppercase' }}>Orders</div>
                  <div style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>{stats.ordersCount}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', textTransform: 'uppercase' }}>Total Spent</div>
                  <div style={{ fontWeight: 'bold', color: 'var(--color-success)' }}>{formatINR(stats.totalSpent)}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {customers.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          No customers recorded yet. Click 'Add Customer' to start.
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', margin: '1rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>{editingId ? 'Edit Customer' : 'Add New Customer'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <input required className="input-field" value={newCust.name} onChange={e => setNewCust({ ...newCust, name: e.target.value })} />
              </div>
              <div className="input-group">
                <label className="input-label">Phone Number</label>
                <input required className="input-field" value={newCust.phone} onChange={e => setNewCust({ ...newCust, phone: e.target.value })} />
              </div>
              <div className="input-group">
                <label className="input-label">Email (Optional)</label>
                <input type="email" className="input-field" value={newCust.email} onChange={e => setNewCust({ ...newCust, email: e.target.value })} />
              </div>
              <div className="input-group">
                <label className="input-label">Address (Optional)</label>
                <textarea className="input-field" value={newCust.address} onChange={e => setNewCust({ ...newCust, address: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Save Changes' : 'Save Customer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
