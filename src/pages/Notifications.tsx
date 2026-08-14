import React from 'react';
import { Bell, Check, Info, AlertTriangle, Trash2, CheckCheck } from 'lucide-react';
import { useAppStore } from '../store/MockAppStore';

export const Notifications: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead, deleteNotification } = useAppStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle size={20} className="text-warning" />;
      case 'info': return <Info size={20} className="text-info" />;
      default: return <Bell size={20} className="text-primary" />;
    }
  };

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  return (
    <div className="page-container" style={{ padding: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: 'var(--color-primary-dark)' }}>Notifications</h1>
          <p style={{ color: 'var(--color-text-light)' }}>Log of system alerts, low stock warnings, and order updates.</p>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-outline" onClick={markAllNotificationsRead} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCheck size={16} /> Mark All Read ({unreadCount})
          </button>
        )}
      </div>

      <div className="card" style={{ padding: 0 }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-light)' }}>
            <Bell size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
            <p>No notifications to display.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {notifications.map(n => (
              <div
                key={n._id}
                style={{
                  padding: '1.5rem',
                  borderBottom: '1px solid var(--color-border)',
                  backgroundColor: n.status === 'unread' ? 'var(--color-surface-hover)' : 'transparent',
                  display: 'flex',
                  gap: '1.5rem',
                  alignItems: 'flex-start',
                  transition: 'background-color 0.2s',
                }}
              >
                <div style={{
                  width: '40px', height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-surface)',
                  border: `1px solid var(--color-${n.type === 'alert' ? 'warning' : 'info'})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {getIcon(n.type)}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <h4 style={{ margin: 0, color: n.status === 'unread' ? 'var(--color-primary-dark)' : 'var(--color-text)', fontWeight: n.status === 'unread' ? 600 : 400 }}>
                      {n.type === 'alert' ? 'System Alert' : 'Information'}
                    </h4>
                    <small style={{ color: 'var(--color-text-light)' }}>
                      {new Date(n.createdAt).toLocaleString()}
                    </small>
                  </div>
                  <p style={{ margin: 0, color: 'var(--color-text)', fontSize: '0.95rem' }}>{n.message}</p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {n.status === 'unread' && (
                    <button className="btn btn-ghost" onClick={() => markNotificationRead(n._id)} title="Mark as read">
                      <Check size={18} />
                    </button>
                  )}
                  <button className="btn btn-ghost" onClick={() => deleteNotification(n._id)} title="Delete" style={{ color: 'var(--color-text-light)' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
