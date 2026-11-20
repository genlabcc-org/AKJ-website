import React, { useState } from 'react';
import { Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminLogin.css';

// Change this path anytime to use a different image on the right side
const RIGHT_SIDE_IMAGE = '/images/about-campus.jpg';

export default function AdminLogin() {
  const { isAuthenticated, loading, login, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  const fromPath = location.state?.from || '/admin';

  if (!loading && isAuthenticated) {
    return <Navigate to={fromPath} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');

    if (!identifier.trim() || !password) {
      setError('Please enter both your email and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(identifier, password, rememberDevice);
    setIsSubmitting(false);

    if (result.success) {
      navigate(fromPath, { replace: true });
    } else {
      setError(result.error);
    }
  };

  const handleForgotPassword = async () => {
    setError('');
    setInfoMessage('');
    const result = await resetPassword(identifier);
    if (result.success) {
      setInfoMessage(result.message);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-shell">
        {/* LEFT SIDE: Sign In Form (matches reference design) */}
        <div className="admin-login-left">
          <div className="admin-login-left-inner">
            {/* Brand Logo Icon */}
            <Link to="/" className="admin-brand-mark" aria-label="Back to Home">
              <img
                src="/images/akj-logo.svg"
                alt="AKJ Logo"
                className="admin-brand-logo"
              />
            </Link>

            {/* Heading */}
            <div className="admin-login-header">
              <h1 className="admin-login-title">Sign in</h1>
              <p className="admin-login-subtitle">
                Use your Acadly staff account to continue.
              </p>
            </div>

            {error && (
              <div className="admin-login-error" role="alert">
                <span>{error}</span>
              </div>
            )}

            {infoMessage && (
              <div className="admin-login-success" role="status">
                <span>{infoMessage}</span>
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="admin-login-form" noValidate>
              <div className="admin-form-group">
                <label htmlFor="admin-identifier">Email</label>
                <input
                  id="admin-identifier"
                  type="email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="admin-password">Password</label>
                <div className="admin-password-input-wrapper">
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="admin-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot Password Row */}
              <div className="admin-options-row">
                <button
                  type="button"
                  className="admin-remember-btn"
                  onClick={() => setRememberDevice(!rememberDevice)}
                >
                  <span className={`admin-check-circle ${rememberDevice ? 'checked' : ''}`}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span>Remember this device</span>
                </button>

                <button
                  type="button"
                  className="admin-forgot-link"
                  onClick={handleForgotPassword}
                >
                  Forget password?
                </button>
              </div>

              <button type="submit" className="admin-signin-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            {/* Bottom Footer */}
            <div className="admin-left-footer">
              <p className="admin-request-text">
                Don’t have an account?{' '}
                <Link to="/contact" className="admin-request-link">
                  Request admin access
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Image Panel */}
        <div className="admin-login-right">
          <div className="admin-right-image-frame">
            <img
              src={RIGHT_SIDE_IMAGE}
              alt="Acadly Admin Showcase"
              className="admin-right-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
