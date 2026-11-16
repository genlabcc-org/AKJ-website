import React, { useState } from 'react';
import { Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLogin.css';

// Change this path anytime to use a different image on the right side
const RIGHT_SIDE_IMAGE = '/images/about-campus.jpg';

export default function AdminLogin() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [error, setError] = useState('');

  const fromPath = location.state?.from || '/admin';

  if (isAuthenticated) {
    return <Navigate to={fromPath} replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim() || !password) {
      setError('Please enter both your email and password.');
      return;
    }

    const result = login(identifier, password);
    if (result.success) {
      navigate(fromPath, { replace: true });
    } else {
      setError(result.error);
    }
  };

  const handlePreviewConsole = () => {
    setIdentifier('admin@acadly.com');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-shell">
        {/* LEFT SIDE: Sign In Form (matches reference design) */}
        <div className="admin-login-left">
          <div className="admin-login-left-inner">
            {/* Brand Logo Icon */}
            <Link to="/" className="admin-brand-mark" aria-label="Back to Home">
              <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="brandGrad1" x1="4" y1="6" x2="34" y2="34" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#f472b6" />
                    <stop offset="50%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                  <linearGradient id="brandGrad2" x1="18" y1="10" x2="36" y2="30" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#c084fc" />
                    <stop offset="100%" stopColor="#60a5fa" />
                  </linearGradient>
                </defs>
                <circle cx="20" cy="13" r="7.5" fill="url(#brandGrad1)" />
                <circle cx="13" cy="22" r="7.5" fill="url(#brandGrad1)" opacity="0.9" />
                <circle cx="27" cy="22" r="7.5" fill="url(#brandGrad2)" opacity="0.95" />
                {/* Center 4-point sparkle */}
                <path
                  d="M20 15.5C20.4 18.6 21.4 19.6 24.5 20C21.4 20.4 20.4 21.4 20 24.5C19.6 21.4 18.6 20.4 15.5 20C18.6 19.6 19.6 18.6 20 15.5Z"
                  fill="#ffffff"
                />
                {/* Bottom stem */}
                <path d="M20 25.5L17 32H23L20 25.5Z" fill="#818cf8" />
              </svg>
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

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="admin-login-form" noValidate>
              <div className="admin-form-group">
                <label htmlFor="admin-identifier">Email</label>
                <input
                  id="admin-identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter your email"
                  autoComplete="username"
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
                  onClick={handlePreviewConsole}
                >
                  Forget password?
                </button>
              </div>

              <button type="submit" className="admin-signin-btn">
                Sign in
              </button>

              <button
                type="button"
                className="admin-preview-console-btn"
                onClick={handlePreviewConsole}
              >
                Need access? preview the console
              </button>
            </form>

            {/* Bottom Footer */}
            <div className="admin-left-footer">
              <p className="admin-request-text">
                Don’t have an account?{' '}
                <button type="button" onClick={handlePreviewConsole} className="admin-request-link">
                  Request admin access
                </button>
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
