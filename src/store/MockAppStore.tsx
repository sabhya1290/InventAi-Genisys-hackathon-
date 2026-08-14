import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { productService } from '../services/productService';
import type { Product } from '../services/productService';
import { customerService } from '../services/customerService';
import type { Customer } from '../services/customerService';
import { orderService } from '../services/orderService';
import type { Order, CreateOrderDto } from '../services/orderService';
import { invoiceService } from '../services/invoiceService';
import type { Invoice } from '../services/invoiceService';
import { notificationService } from '../services/notificationService';
import type { Notification } from '../services/notificationService';
import { settingsService } from '../services/settingsService';
import { authService } from '../services/authService';
import type { AuthUser } from '../services/authService';

// ─── Re-export types for backward compatibility ──────────────────────────────
export type { Product, Customer, Order, Invoice, Notification };

export type AdminProfile = {
  name: string;
  email: string;
  phone: string;
  role: string;
};

export type StoreDetails = {
  name: string;
  currency: string;
  address: string;
  gst: string;
};

// ─── Toast ───────────────────────────────────────────────────────────────────
export type ToastType = 'success' | 'error' | 'info';
export type Toast = { id: number; message: string; type: ToastType };

// ─── Context Interface ───────────────────────────────────────────────────────
interface AppContextType {
  // Data
  products: Product[];
  customers: Customer[];
  orders: Order[];
  invoices: Invoice[];
  notifications: Notification[];
  adminProfile: AdminProfile;
  storeDetails: StoreDetails;

  // Status
  loading: boolean;
  toasts: Toast[];
  dismissToast: (id: number) => void;

  // Product Actions
  addProduct: (p: Omit<Product, '_id' | 'status' | 'createdAt'>) => Promise<void>;
  updateProduct: (id: string, p: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  // Customer Actions
  addCustomer: (c: Omit<Customer, '_id' | 'createdAt'>) => Promise<void>;
  updateCustomer: (id: string, c: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;

  // Order Actions
  addOrder: (o: CreateOrderDto) => Promise<void>;
  updateOrder: (id: string, status: Order['status']) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;

  // Invoice Actions
  generateInvoice: (orderId: string) => Promise<void>;
  markInvoicePaid: (id: string) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;

  // Notification Actions
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;

  // Settings
  updateAdminProfile: (p: Partial<AdminProfile>) => Promise<void>;
  updateStoreDetails: (s: Partial<StoreDetails>) => Promise<void>;

  // Refresh
  refreshAll: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

let toastCounter = 0;

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [storeDetails, setStoreDetails] = useState<StoreDetails>({ name: '', currency: 'INR', address: '', gst: '' });
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Build adminProfile from stored user
  const storedUser: AuthUser | null = authService.getStoredUser();
  const [adminProfile, setAdminProfile] = useState<AdminProfile>({
    name: storedUser?.name || '',
    email: storedUser?.email || '',
    phone: storedUser?.phone || '',
    role: storedUser?.role || 'Administrator',
  });

  // ─── Toast Helpers ───────────────────────────────────────────────────────
  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = ++toastCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ─── Load All Data ───────────────────────────────────────────────────────
  const refreshAll = useCallback(async () => {
    setLoading(true);
    try {
      const [prods, custs, ords, invs, notifs, settings] = await Promise.all([
        productService.getAll(),
        customerService.getAll(),
        orderService.getAll(),
        invoiceService.getAll(),
        notificationService.getAll(),
        settingsService.get(),
      ]);
      setProducts(prods);
      setCustomers(custs);
      setOrders(ords);
      setInvoices(invs);
      setNotifications(notifs);
      setStoreDetails({ name: settings.name, currency: settings.currency, address: settings.address, gst: settings.gst });
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to load data. Please refresh.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (authService.isAuthenticated()) {
      refreshAll();
    } else {
      setLoading(false);
    }
  }, [refreshAll]);

  // ─── Products ────────────────────────────────────────────────────────────
  const addProduct = async (p: Omit<Product, '_id' | 'status' | 'createdAt'>) => {
    try {
      const newProd = await productService.create(p);
      setProducts((prev) => [newProd, ...prev]);
      showToast(`"${newProd.name}" added to inventory.`);
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to add product.', 'error');
      throw err;
    }
  };

  const updateProduct = async (id: string, p: Partial<Product>) => {
    try {
      const updated = await productService.update(id, p);
      setProducts((prev) => prev.map((prod) => (prod._id === id ? updated : prod)));
      showToast('Product updated successfully.');
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to update product.', 'error');
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await productService.delete(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      showToast('Product deleted.', 'info');
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to delete product.', 'error');
      throw err;
    }
  };

  // ─── Customers ───────────────────────────────────────────────────────────
  const addCustomer = async (c: Omit<Customer, '_id' | 'createdAt'>) => {
    try {
      const newCust = await customerService.create(c);
      setCustomers((prev) => [newCust, ...prev]);
      showToast(`Customer "${newCust.name}" added.`);
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to add customer.', 'error');
      throw err;
    }
  };

  const updateCustomer = async (id: string, c: Partial<Customer>) => {
    try {
      const updated = await customerService.update(id, c);
      setCustomers((prev) => prev.map((cust) => (cust._id === id ? updated : cust)));
      showToast('Customer updated.');
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to update customer.', 'error');
      throw err;
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      await customerService.delete(id);
      setCustomers((prev) => prev.filter((c) => c._id !== id));
      showToast('Customer removed.', 'info');
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to delete customer.', 'error');
      throw err;
    }
  };

  // ─── Orders ──────────────────────────────────────────────────────────────
  const addOrder = async (o: CreateOrderDto) => {
    try {
      const newOrder = await orderService.create(o);
      setOrders((prev) => [newOrder, ...prev]);
      // Refresh products to reflect stock deduction
      const freshProducts = await productService.getAll();
      setProducts(freshProducts);
      // Refresh notifications
      const freshNotifs = await notificationService.getAll();
      setNotifications(freshNotifs);
      showToast('Order created successfully.');
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to create order.', 'error');
      throw err;
    }
  };

  const updateOrder = async (id: string, status: Order['status']) => {
    try {
      const updated = await orderService.updateStatus(id, status);
      setOrders((prev) => prev.map((o) => (o._id === id ? updated : o)));
      // Refresh products stock and notifications
      const [freshProducts, freshNotifs] = await Promise.all([
        productService.getAll(),
        notificationService.getAll(),
      ]);
      setProducts(freshProducts);
      setNotifications(freshNotifs);
      showToast(`Order status updated to "${status}".`);
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to update order.', 'error');
      throw err;
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      await orderService.delete(id);
      setOrders((prev) => prev.filter((o) => o._id !== id));
      showToast('Order deleted.', 'info');
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to delete order.', 'error');
      throw err;
    }
  };

  // ─── Invoices ────────────────────────────────────────────────────────────
  const generateInvoice = async (orderId: string) => {
    try {
      const invoice = await invoiceService.generate(orderId);
      setInvoices((prev) => [invoice, ...prev]);
      showToast('Invoice generated successfully.');
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to generate invoice.', 'error');
      throw err;
    }
  };

  const markInvoicePaid = async (id: string) => {
    try {
      const updated = await invoiceService.markPaid(id);
      setInvoices((prev) => prev.map((inv) => (inv._id === id ? updated : inv)));
      showToast('Invoice marked as Paid.');
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to update invoice.', 'error');
      throw err;
    }
  };

  const deleteInvoice = async (id: string) => {
    try {
      await invoiceService.delete(id);
      setInvoices((prev) => prev.filter((inv) => inv._id !== id));
      showToast('Invoice deleted.', 'info');
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to delete invoice.', 'error');
      throw err;
    }
  };

  // ─── Notifications ───────────────────────────────────────────────────────
  const markNotificationRead = async (id: string) => {
    try {
      const updated = await notificationService.markRead(id);
      setNotifications((prev) => prev.map((n) => (n._id === id ? updated : n)));
    } catch {
      // silent
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, status: 'read' as const })));
    } catch (err: any) {
      showToast('Failed to mark notifications as read.', 'error');
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await notificationService.delete(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch {
      // silent
    }
  };

  // ─── Settings ────────────────────────────────────────────────────────────
  const updateAdminProfile = async (p: Partial<AdminProfile>) => {
    try {
      const updated = await authService.updateMe({ name: p.name, phone: p.phone });
      const newProfile = { ...adminProfile, ...p, name: updated.name, phone: updated.phone };
      setAdminProfile(newProfile);
      // Update stored user
      const stored = authService.getStoredUser();
      if (stored) {
        authService.storeSession(localStorage.getItem('inventai_token')!, { ...stored, ...updated });
      }
      showToast('Profile updated successfully.');
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to update profile.', 'error');
      throw err;
    }
  };

  const updateStoreDetails = async (s: Partial<StoreDetails>) => {
    try {
      const updated = await settingsService.update(s);
      setStoreDetails({ name: updated.name, currency: updated.currency, address: updated.address, gst: updated.gst });
      showToast('Store details updated.');
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to update store details.', 'error');
      throw err;
    }
  };

  return (
    <AppContext.Provider
      value={{
        products, customers, orders, invoices, notifications, adminProfile, storeDetails,
        loading, toasts, dismissToast,
        addProduct, updateProduct, deleteProduct,
        addCustomer, updateCustomer, deleteCustomer,
        addOrder, updateOrder, deleteOrder,
        generateInvoice, markInvoicePaid, deleteInvoice,
        markNotificationRead, markAllNotificationsRead, deleteNotification,
        updateAdminProfile, updateStoreDetails,
        refreshAll,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppStore must be used within AppProvider');
  return context;
};
