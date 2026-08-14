import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/MockAppStore';
import { MetricCard } from '../components/MetricCard';
import { IndianRupee, AlertTriangle, CheckCircle, TrendingUp, Sparkles, Plus, FileText, BarChart3, Bell } from 'lucide-react';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { products, orders, notifications } = useAppStore();

  const lowStockCount = products.filter(p => p.stock_quantity <= p.reorder_threshold && p.stock_quantity > 0).length;
  const outOfStockCount = products.filter(p => p.stock_quantity === 0).length;
  const totalStockValue = products.reduce((acc, p) => acc + (p.stock_quantity * p.purchase_price), 0);
  
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const todaySales = orders.filter(o => o.status === 'Completed').reduce((acc, o) => acc + o.total_amount, 0);

  // Format currency
  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="dashboard-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Dashboard Overview</h1>
          <p>Welcome back, here is your business summary today.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-primary" onClick={() => navigate('/orders')}>
            <Plus size={18} /> Create Order
          </button>
          <button className="btn btn-outline" onClick={() => navigate('/inventory')}>
            <Plus size={18} /> Add Product
          </button>
        </div>
      </div>

      <div className="metrics-grid">
        <div onClick={() => navigate('/analytics')} style={{ cursor: 'pointer' }}>
          <MetricCard 
            title="Today's Sales" 
            value={formatINR(todaySales)} 
            icon={<IndianRupee size={24} />} 
            trend="View analytics" 
            trendUp={true} 
          />
        </div>
        <div onClick={() => navigate('/orders')} style={{ cursor: 'pointer' }}>
          <MetricCard 
            title="Pending Orders" 
            value={pendingOrders.toString()} 
            icon={<CheckCircle size={24} />} 
            trend="View pending orders"
          />
        </div>
        <div onClick={() => navigate('/inventory')} style={{ cursor: 'pointer' }}>
          <MetricCard 
            title="Stock Value" 
            value={formatINR(totalStockValue)} 
            icon={<TrendingUp size={24} />} 
            trend="View inventory"
          />
        </div>
        <div onClick={() => navigate('/inventory')} style={{ cursor: 'pointer' }}>
          <MetricCard 
            title="Low Stock Items" 
            value={(lowStockCount + outOfStockCount).toString()} 
            icon={<AlertTriangle size={24} color="#f59e0b" />} 
            trend={`${outOfStockCount} out of stock`}
            trendUp={false}
          />
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <h3 style={{ width: '100%', fontSize: '1rem', margin: '0 0 0.5rem 0.5rem' }}>Quick Actions</h3>
        <button className="btn btn-ghost" onClick={() => navigate('/inventory')} style={{ flex: 1, justifyContent: 'center' }}>
          <Plus size={16} /> Add Product
        </button>
        <button className="btn btn-ghost" onClick={() => navigate('/orders')} style={{ flex: 1, justifyContent: 'center' }}>
          <FileText size={16} /> New Order
        </button>
        <button className="btn btn-ghost" onClick={() => navigate('/invoices')} style={{ flex: 1, justifyContent: 'center' }}>
          <IndianRupee size={16} /> Bill & Invoice
        </button>
        <button className="btn btn-ghost" onClick={() => navigate('/analytics')} style={{ flex: 1, justifyContent: 'center' }}>
          <BarChart3 size={16} /> View Reports
        </button>
      </div>

      <div className="dashboard-content">
        <div className="content-left">
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Recent Orders</h3>
              <button className="btn btn-ghost" onClick={() => navigate('/orders')} style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem' }}>View All</button>
            </div>
            <div className="table-container" style={{ marginTop: '1rem' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map(order => (
                    <tr key={order._id} style={{ cursor: 'pointer' }} onClick={() => navigate('/orders')}>
                      <td style={{ fontSize: '0.8rem' }}>#{order._id.slice(-8).toUpperCase()}</td>
                      <td>{new Date(order.order_date).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge badge-${order.status === 'Completed' ? 'success' : order.status === 'Pending' ? 'warning' : 'info'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>{formatINR(order.total_amount)}</td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>No recent orders.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="content-right">
          <div className="card ai-insights-card">
            <div className="ai-header">
              <Sparkles className="ai-icon" size={20} />
              <h3>AI Business Insights</h3>
            </div>
            <div className="insight-list">
              {lowStockCount > 0 && (
                <div className="insight-item warning" onClick={() => navigate('/inventory')} style={{ cursor: 'pointer' }}>
                  <strong>Restock Alert:</strong> You have {lowStockCount} items running low. Consider reordering soon.
                </div>
              )}
              {pendingOrders > 0 && (
                <div className="insight-item info" onClick={() => navigate('/orders')} style={{ cursor: 'pointer' }}>
                  <strong>Pending Actions:</strong> There are {pendingOrders} orders waiting to be fulfilled.
                </div>
              )}
              {todaySales > 5000 && (
                <div className="insight-item success" onClick={() => navigate('/analytics')} style={{ cursor: 'pointer' }}>
                  <strong>Great Job!</strong> Sales are up today. Your top performing product is doing well.
                </div>
              )}
              {lowStockCount === 0 && pendingOrders === 0 && todaySales === 0 && (
                <div className="insight-item info">
                  Everything looks good! Add products and create orders to see insights.
                </div>
              )}
            </div>
            <button className="btn btn-outline" style={{width: '100%', marginTop: '1rem'}} onClick={() => navigate('/ai-assistant')}>
              <Sparkles size={16} /> Ask AI Assistant
            </button>
          </div>

          <div className="card recent-alerts" style={{marginTop: '1.5rem', cursor: 'pointer'}} onClick={() => navigate('/notifications')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Recent Notifications</h3>
              <Bell size={16} color="var(--color-text-light)" />
            </div>
            <div className="alerts-list" style={{ marginTop: '1rem' }}>
              {notifications.slice(0, 3).map(n => (
                <div key={n._id} className="alert-item">
                  <div className={`alert-indicator ${n.type}`}></div>
                  <div className="alert-content">
                    <p>{n.message}</p>
                    <small>{new Date(n.createdAt).toLocaleTimeString()}</small>
                  </div>
                </div>
              ))}
              {notifications.length === 0 && (
                <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-text-light)' }}>
                  No new notifications
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
