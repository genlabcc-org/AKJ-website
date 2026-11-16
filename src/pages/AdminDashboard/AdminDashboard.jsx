import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { adminUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="admin-dashboard-page">
      <div className="container">
        <div className="admin-topbar">
          <div>
            <span className="badge-tag">Authenticated Session</span>
            <h1 className="admin-dashboard-title">Acadly Admin Panel</h1>
            <p className="admin-dashboard-subtitle">
              Welcome back, <strong>{adminUser?.name || 'Administrator'}</strong> ({adminUser?.email})
            </p>
          </div>

          <div className="admin-topbar-actions">
            <Link to="/" className="btn-secondary">
              View Website
            </Link>
            <button type="button" onClick={handleLogout} className="btn-primary admin-logout-btn">
              Logout
            </button>
          </div>
        </div>

        <div className="admin-starter-card">
          <div className="admin-starter-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2>Admin Login Setup Complete</h2>
          <p>
            You are securely signed in to the protected <code>/admin</code> route. Tell us what sections or
            features you want inside the Admin Panel next (e.g., Content Management, Blog Posts, Pricing,
            Testimonials, or Contact Inquiries) and we will build them right here.
          </p>
        </div>
      </div>
    </div>
  );
}

