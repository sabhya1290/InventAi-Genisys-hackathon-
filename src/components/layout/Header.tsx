import React, { useState, useRef, useEffect } from 'react';
import { Bell, UserCircle, Search, FileText, Package, Users, Menu, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/MockAppStore';
import './Header.css';

export const Header: React.FC<{ toggleSidebar?: () => void; onLogout?: () => void }> = ({ toggleSidebar, onLogout }) => {
  const navigate = useNavigate();
  const { notifications, products, customers, invoices, adminProfile } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.status === 'unread').length;

  // Search logic — use _id (MongoDB) instead of id
  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 3);
  const filteredCustomers = customers
    .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 3);
  const filteredInvoices = invoices
    .filter((i) => (i._id || '').toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 3);

  const hasResults = filteredProducts.length > 0 || filteredCustomers.length > 0 || filteredInvoices.length > 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="app-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {toggleSidebar && (
          <button className="btn btn-ghost sidebar-toggle" onClick={toggleSidebar} style={{ padding: '0.5rem', color: 'var(--color-primary)' }}>
            <Menu size={20} />
          </button>
        )}
        <div className="header-search" ref={searchRef}>
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search products, customers, or invoices..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setIsSearchOpen(true); }}
              onFocus={() => setIsSearchOpen(true)}
            />
          </div>

          {isSearchOpen && searchQuery.trim() !== '' && (
            <div className="search-dropdown card">
              {!hasResults ? (
                <div className="search-no-results">No results found for "{searchQuery}"</div>
              ) : (
                <>
                  {filteredProducts.length > 0 && (
                    <div className="search-section">
                      <h4><Package size={14} /> Products</h4>
                      {filteredProducts.map((p) => (
                        <div key={p._id} className="search-item" onClick={() => { setIsSearchOpen(false); navigate('/inventory'); }}>
                          <span>{p.name}</span>
                          <small>{p.sku}</small>
                        </div>
                      ))}
                    </div>
                  )}
                  {filteredCustomers.length > 0 && (
                    <div className="search-section">
                      <h4><Users size={14} /> Customers</h4>
                      {filteredCustomers.map((c) => (
                        <div key={c._id} className="search-item" onClick={() => { setIsSearchOpen(false); navigate('/customers'); }}>
                          <span>{c.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {filteredInvoices.length > 0 && (
                    <div className="search-section">
                      <h4><FileText size={14} /> Invoices</h4>
                      {filteredInvoices.map((i) => (
                        <div key={i._id} className="search-item" onClick={() => { setIsSearchOpen(false); navigate('/invoices'); }}>
                          <span>Invoice #{i._id?.slice(-6).toUpperCase()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="header-actions">
        <div className="notification-bell" onClick={() => navigate('/notifications')}>
          <Bell size={22} className="bell-icon" />
          {unreadCount > 0 && <span className="badge-count">{unreadCount}</span>}
        </div>
        <div className="user-profile" onClick={() => navigate('/settings')} style={{ cursor: 'pointer' }}>
          <UserCircle size={28} className="profile-icon" />
          <span className="user-name">{adminProfile.name ? adminProfile.name.split(' ')[0] : 'User'}</span>
        </div>
        {onLogout && (
          <button
            onClick={onLogout}
            className="btn btn-ghost"
            title="Logout"
            style={{ padding: '0.5rem', color: 'var(--color-danger, #ef4444)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}
          >
            <LogOut size={18} />
          </button>
        )}
      </div>
    </header>
  );
};
