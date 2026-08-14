import React, { useState } from 'react';
import { UserCircle, Store, Shield, CheckCircle } from 'lucide-react';
import { useAppStore } from '../store/MockAppStore';
import { authService } from '../services/authService';

type Tab = 'profile' | 'store' | 'security';

export const Settings: React.FC = () => {
  const { adminProfile, storeDetails, updateAdminProfile, updateStoreDetails } = useAppStore();

  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [toast, setToast] = useState('');

  // Local state for forms
  const [profileForm, setProfileForm] = useState(adminProfile);
  const [storeForm, setStoreForm] = useState(storeDetails);

  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [passwordError, setPasswordError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // Keep form in sync when context updates
  React.useEffect(() => { setProfileForm(adminProfile); }, [adminProfile]);
  React.useEffect(() => { setStoreForm(storeDetails); }, [storeDetails]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateAdminProfile(profileForm);
      showToast('Profile updated successfully!');
    } catch {
      // Error toast handled in store
    } finally {
      setIsSaving(false);
    }
  };

  const handleStoreSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateStoreDetails(storeForm);
      showToast('Store details updated successfully!');
    } catch {
      // Error toast handled in store
    } finally {
      setIsSaving(false);
    }
  };

  const handleSecuritySave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    if (passwords.newPass !== passwords.confirm) {
      setPasswordError('Passwords do not match!');
      return;
    }
    if (passwords.newPass.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    setIsSaving(true);
    try {
      await authService.changePassword(passwords.current, passwords.newPass);
      setPasswords({ current: '', newPass: '', confirm: '' });
      showToast('Password changed successfully!');
    } catch (err: any) {
      setPasswordError(err?.response?.data?.message || 'Failed to change password.');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs: { key: Tab; label: string; icon: (color: string) => React.ReactNode }[] = [
    { key: 'profile', label: 'Profile Information', icon: (color) => <UserCircle size={22} color={color} /> },
    { key: 'store', label: 'Store Details', icon: (color) => <Store size={22} color={color} /> },
    { key: 'security', label: 'Security', icon: (color) => <Shield size={22} color={color} /> },
  ];

  return (
    <div className="page-container" style={{ padding: 0 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: 'var(--color-primary-dark)' }}>Admin Settings</h1>
          <p style={{ color: 'var(--color-text-light)' }}>Manage your profile, business information, and secure access.</p>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 3fr', gap: '2rem' }}>
        {/* Sidebar Menu */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {tabs.map(tab => (
            <div
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="card card-hover"
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', padding: '1.25rem',
                borderLeft: activeTab === tab.key ? '4px solid var(--color-primary)' : '4px solid transparent',
                backgroundColor: activeTab === tab.key ? 'var(--color-surface-hover)' : 'var(--color-surface)'
              }}
            >
              {tab.icon(activeTab === tab.key ? 'var(--color-primary)' : 'var(--color-text-light)')}
              <div style={{ fontWeight: activeTab === tab.key ? 600 : 400, color: activeTab === tab.key ? 'var(--color-primary-dark)' : 'var(--color-text)' }}>
                {tab.label}
              </div>
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div>
          {activeTab === 'profile' && (
            <form className="card" onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'slideUp 0.3s ease-out' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>Profile Information</h3>
              <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
                <div className="input-group">
                  <label className="input-label">Full Name</label>
                  <input type="text" className="input-field" value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} required />
                </div>
                <div className="input-group">
                  <label className="input-label">Email Address</label>
                  <input type="email" className="input-field" value={profileForm.email} disabled style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-light)' }} />
                </div>
                <div className="input-group">
                  <label className="input-label">Phone Number</label>
                  <input type="tel" className="input-field" value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} />
                </div>
                <div className="input-group">
                  <label className="input-label">Role</label>
                  <input type="text" className="input-field" value={profileForm.role} disabled style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-light)' }} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
                <button type="submit" className="btn btn-primary" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Profile'}</button>
              </div>
            </form>
          )}

          {activeTab === 'store' && (
            <form className="card" onSubmit={handleStoreSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'slideUp 0.3s ease-out' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>Business & Store Details</h3>
              <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
                <div className="input-group">
                  <label className="input-label">Business Name</label>
                  <input type="text" className="input-field" value={storeForm.name} onChange={e => setStoreForm({ ...storeForm, name: e.target.value })} required />
                </div>
                <div className="input-group">
                  <label className="input-label">Default Currency</label>
                  <select className="input-field" value={storeForm.currency} onChange={e => setStoreForm({ ...storeForm, currency: e.target.value })}>
                    <option value="INR">Indian Rupee (₹)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                    <option value="GBP">British Pound (£)</option>
                  </select>
                </div>
                <div className="input-group" style={{ gridColumn: 'span 2' }}>
                  <label className="input-label">Registered Address (Optional)</label>
                  <input type="text" className="input-field" placeholder="123 Corporate Park, Mumbai..." value={storeForm.address} onChange={e => setStoreForm({ ...storeForm, address: e.target.value })} />
                </div>
                <div className="input-group">
                  <label className="input-label">GSTIN / Tax ID (Optional)</label>
                  <input type="text" className="input-field" placeholder="27XXXXX1234X1Z5" value={storeForm.gst} onChange={e => setStoreForm({ ...storeForm, gst: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
                <button type="submit" className="btn btn-primary" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Details'}</button>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <form className="card" onSubmit={handleSecuritySave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'slideUp 0.3s ease-out' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>Security Settings</h3>
              {passwordError && (
                <div className="badge badge-danger" style={{ display: 'block', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>{passwordError}</div>
              )}
              <div className="grid" style={{ gap: '1.5rem', maxWidth: '400px' }}>
                <div className="input-group">
                  <label className="input-label">Current Password</label>
                  <input type="password" placeholder="••••••••" className="input-field" value={passwords.current} onChange={e => setPasswords({ ...passwords, current: e.target.value })} required />
                </div>
                <div className="input-group">
                  <label className="input-label">New Password</label>
                  <input type="password" placeholder="••••••••" className="input-field" value={passwords.newPass} onChange={e => setPasswords({ ...passwords, newPass: e.target.value })} required />
                </div>
                <div className="input-group">
                  <label className="input-label">Confirm New Password</label>
                  <input type="password" placeholder="••••••••" className="input-field" value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} required />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
                <button type="submit" className="btn btn-primary" disabled={isSaving}>{isSaving ? 'Updating...' : 'Change Password'}</button>
              </div>
            </form>
          )}
        </div>
      </div>

      {toast && (
        <div className="toast-container">
          <CheckCircle size={20} />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
};
