import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppStore } from './store/MockAppStore';
import { AppLayout } from './components/layout/AppLayout';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/Inventory';
import { Orders } from './pages/Orders';
import { Invoices } from './pages/Invoices';
import { Customers } from './pages/Customers';
import { Analytics } from './pages/Analytics';
import { AIAssistant } from './pages/AIAssistant';
import { Notifications } from './pages/Notifications';
import { Settings } from './pages/Settings';
import { authService } from './services/authService';

// ─── Toast Renderer ───────────────────────────────────────────────────────────
const ToastRenderer: React.FC = () => {
  const { toasts, dismissToast } = useAppStore();

  return (
    <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          onClick={() => dismissToast(toast.id)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.875rem 1.25rem',
            borderRadius: '10px',
            cursor: 'pointer',
            minWidth: '280px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            animation: 'slideUp 0.3s ease-out',
            background: toast.type === 'error' ? '#ef4444' : toast.type === 'info' ? '#3b82f6' : '#10b981',
            color: '#fff',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          <span>{toast.type === 'error' ? '✗' : '✓'}</span>
          <span style={{ flex: 1 }}>{toast.message}</span>
          <span style={{ opacity: 0.7, fontSize: '1rem' }}>×</span>
        </div>
      ))}
    </div>
  );
};

// ─── Protected Route ─────────────────────────────────────────────────────────
const ProtectedRoute = ({ children, isAuthenticated }: { children: React.ReactNode; isAuthenticated: boolean }) => {
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

// ─── App Shell ───────────────────────────────────────────────────────────────
function AppShell() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => authService.isAuthenticated());

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  // Listen for token removal (e.g., from 401 interceptor)
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(authService.isAuthenticated());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Auth onLogin={login} />}
        />

        <Route
          path="/"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AppLayout onLogout={logout} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="orders" element={<Orders />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="customers" element={<Customers />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="ai-assistant" element={<AIAssistant />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <ToastRenderer />
    </BrowserRouter>
  );
}

// ─── Root App ────────────────────────────────────────────────────────────────
function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

export default App;
