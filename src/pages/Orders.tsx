import React, { useState } from 'react';
import { Plus, Eye, Receipt, Trash2 } from 'lucide-react';
import { useAppStore } from '../store/MockAppStore';

export const Orders: React.FC = () => {
  const { orders, products, customers, addOrder, updateOrder, deleteOrder, generateInvoice } = useAppStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Order State
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [orderItems, setOrderItems] = useState<{ productId: string; quantity: number; price: number }[]>([
    { productId: '', quantity: 1, price: 0 }
  ]);

  const handleAddOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || orderItems.some(item => !item.productId || item.quantity <= 0)) return;

    const hasStockError = orderItems.some(item => {
      const prod = products.find(p => p._id === item.productId);
      return !prod || prod.stock_quantity === 0 || prod.stock_quantity < item.quantity;
    });

    if (hasStockError) {
      alert('Error: One or more selected products are Out of Stock or the requested quantity exceeds available stock.');
      return;
    }

    const fullItems = orderItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.quantity * item.price,
    }));

    const total = fullItems.reduce((acc, curr) => acc + curr.subtotal, 0);

    await addOrder({
      customerId: selectedCustomerId,
      status: 'Confirmed',
      total_amount: total,
      items: fullItems,
    });

    setIsAddModalOpen(false);
    setSelectedCustomerId('');
    setOrderItems([{ productId: '', quantity: 1, price: 0 }]);
  };

  const handleProductSelect = (index: number, productId: string) => {
    const prod = products.find(p => p._id === productId);
    const newItems = [...orderItems];
    newItems[index] = { productId, quantity: newItems[index].quantity, price: prod?.selling_price || 0 };
    setOrderItems(newItems);
  };

  const formatINR = (amt: number) => `₹${amt.toLocaleString('en-IN')}`;

  // Helper to get customer name from populated or flat customerId
  const getCustomerInfo = (order: typeof orders[0]) => {
    if (typeof order.customerId === 'object' && order.customerId !== null) {
      return order.customerId as { _id: string; name: string; phone: string; email: string };
    }
    return customers.find(c => c._id === order.customerId);
  };

  return (
    <div className="page-container" style={{ padding: 0 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: 'var(--color-primary-dark)' }}>Orders Management</h1>
          <p style={{ color: 'var(--color-text-light)' }}>Create sales orders, track status, and generate invoices.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={18} /> New Order
        </button>
      </div>

      {/* Orders Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => {
                const customer = getCustomerInfo(order);
                return (
                  <tr key={order._id}>
                    <td style={{ fontWeight: 600, fontSize: '0.8rem' }}>#{order._id.slice(-8).toUpperCase()}</td>
                    <td>{new Date(order.order_date).toLocaleDateString()}</td>
                    <td>
                      <div>{customer?.name || 'Unknown'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>{customer?.phone}</div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{formatINR(order.total_amount)}</td>
                    <td>
                      <span className={`badge badge-${order.status === 'Completed' ? 'success' : order.status === 'Pending' ? 'warning' : 'info'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {order.status === 'Confirmed' && (
                          <button className="btn btn-ghost" title="Complete Order" onClick={() => updateOrder(order._id, 'Completed')} style={{ padding: '0.25rem' }}>
                            <Eye size={16} />
                          </button>
                        )}
                        <button
                          className="btn btn-ghost"
                          title="Generate Invoice"
                          onClick={() => generateInvoice(order._id)}
                          style={{ padding: '0.25rem', color: 'var(--color-accent-dark)' }}
                        >
                          <Receipt size={16} />
                        </button>
                        <button
                          className="btn btn-ghost"
                          title="Delete Order"
                          onClick={() => { if (window.confirm('Delete this order?')) deleteOrder(order._id); }}
                          style={{ padding: '0.25rem', color: 'var(--color-danger)' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem' }}>No orders found. Create a new order to get started.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card" style={{ width: '100%', maxWidth: '600px', margin: '1rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Create New Order</h2>
            <form onSubmit={handleAddOrder}>
              <div className="input-group">
                <label className="input-label">Customer</label>
                <select className="input-field" required value={selectedCustomerId} onChange={e => setSelectedCustomerId(e.target.value)}>
                  <option value="">Select a customer...</option>
                  {customers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>

              <div style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
                <label className="input-label">Order Items</label>
                {orderItems.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ flex: 2 }}>
                      <select required className="input-field" value={item.productId} onChange={e => handleProductSelect(idx, e.target.value)}>
                        <option value="">Select product...</option>
                        {products.map(p => (
                          <option key={p._id} value={p._id} disabled={p.stock_quantity === 0}>
                            {p.name} - ₹{p.selling_price} ({p.stock_quantity === 0 ? 'Out of Stock' : `Stock: ${p.stock_quantity}`})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <input
                        type="number" min="1" required className="input-field" placeholder="Qty"
                        value={item.quantity}
                        onChange={e => {
                          const newItems = [...orderItems];
                          newItems[idx].quantity = Number(e.target.value);
                          setOrderItems(newItems);
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                      {formatINR(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
                <button type="button" className="btn btn-ghost" onClick={() => setOrderItems([...orderItems, { productId: '', quantity: 1, price: 0 }])}>
                  <Plus size={16} /> Add another item
                </button>
              </div>

              <div style={{ backgroundColor: 'var(--color-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold' }}>
                <span>Total Amount:</span>
                <span style={{ fontSize: '1.25rem', color: 'var(--color-primary)' }}>
                  {formatINR(orderItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0))}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Confirm Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
