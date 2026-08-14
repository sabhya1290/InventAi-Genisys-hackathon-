import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PackageOpen, Loader2 } from 'lucide-react';
import { authService } from '../services/authService';
import './Auth.css';

interface AuthProps {
  onLogin: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Signup State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regStoreName, setRegStoreName] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (isLogin) {
        // ─── Login ──────────────────────────────────────────────
        const { token, user } = await authService.login(email, password);
        authService.storeSession(token, user);
        onLogin();
        navigate('/dashboard');
      } else {
        // ─── Signup ─────────────────────────────────────────────
        if (regPassword !== regConfirmPassword) {
          setError('Passwords do not match.');
          setIsLoading(false);
          return;
        }
        if (regPassword.length < 6) {
          setError('Password must be at least 6 characters.');
          setIsLoading(false);
          return;
        }

        const { token, user } = await authService.signup({
          name: regName,
          email: regEmail,
          password: regPassword,
          phone: regPhone,
          storeName: regStoreName,
        });

        authService.storeSession(token, user);
        setSuccess('Account created! Logging you in...');

        setTimeout(() => {
          onLogin();
          navigate('/dashboard');
        }, 1000);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: isLogin ? '400px' : '550px', transition: 'max-width 0.3s' }}>
        <div className="auth-header">
          <div className="auth-logo">
            <PackageOpen size={32} />
          </div>
          <h2>{isLogin ? 'Welcome to InventAI' : 'Create an Account'}</h2>
          <p>{isLogin ? 'Sign in to manage your operations.' : 'Register your business for premium tools.'}</p>
        </div>

        {error && (
          <div className="badge badge-danger" style={{ display: 'block', marginBottom: '1rem', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
            {error}
          </div>
        )}
        {success && (
          <div className="badge badge-success" style={{ display: 'block', marginBottom: '1rem', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
            {success}
          </div>
        )}

        <form onSubmit={handleAuth} className="auth-form">
          {isLogin ? (
            <>
              <div className="input-group">
                <label className="input-label">Email Address</label>
                <input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
              </div>
              <div className="input-group">
                <label className="input-label">Password</label>
                <input type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
                {isLoading ? <><Loader2 size={16} style={{ display: 'inline', animation: 'spin 1s linear infinite', marginRight: 8 }} /> Signing In...</> : 'Sign In'}
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
              <div className="input-group" style={{ gridColumn: 'span 2' }}>
                <label className="input-label">Business / Store Name</label>
                <input type="text" className="input-field" value={regStoreName} onChange={(e) => setRegStoreName(e.target.value)} required />
              </div>
              <div className="input-group">
                <label className="input-label">Owner Full Name</label>
                <input type="text" className="input-field" value={regName} onChange={(e) => setRegName(e.target.value)} required />
              </div>
              <div className="input-group">
                <label className="input-label">Phone Number</label>
                <input type="tel" className="input-field" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} required />
              </div>
              <div className="input-group" style={{ gridColumn: 'span 2' }}>
                <label className="input-label">Email Address</label>
                <input type="email" className="input-field" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required autoComplete="email" />
              </div>
              <div className="input-group">
                <label className="input-label">Password</label>
                <input type="password" className="input-field" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required autoComplete="new-password" />
              </div>
              <div className="input-group">
                <label className="input-label">Confirm Password</label>
                <input type="password" className="input-field" value={regConfirmPassword} onChange={(e) => setRegConfirmPassword(e.target.value)} required autoComplete="new-password" />
              </div>

              <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary btn-block" style={{ width: '100%' }} disabled={isLoading}>
                  {isLoading ? <><Loader2 size={16} style={{ display: 'inline', animation: 'spin 1s linear infinite', marginRight: 8 }} /> Creating Account...</> : 'Create Account'}
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="auth-footer" style={{ marginTop: '2rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
          <p>
            {isLogin ? "Don't have an account? " : 'Already have a business account? '}
            <a onClick={() => { setIsLogin(!isLogin); setError(''); }} style={{ cursor: 'pointer', fontWeight: 'bold' }}>
              {isLogin ? 'Sign Up' : 'Log In'}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
