import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const NAV_ITEMS = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <header className="site-header">
        <div className="site-header-inner">
          <Link to="/" className="site-brand" aria-label="Acadly Home">
            Acadly
          </Link>

          <nav className="site-nav" aria-label="Primary navigation">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `site-nav-link ${isActive ? 'active' : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="site-header-actions">
            <Link
              to={isAuthenticated ? '/admin' : '/admin/login'}
              className="site-admin-link"
            >
              {isAuthenticated ? 'Admin' : 'Login'}
            </Link>

            <button
              type="button"
              className={`site-mobile-burger ${mobileMenuOpen ? 'open' : ''}`}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation"
              aria-expanded={mobileMenuOpen}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>

        <div className={`site-mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `site-mobile-link ${isActive ? 'active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <Link
            to={isAuthenticated ? '/admin' : '/admin/login'}
            className="site-mobile-admin-link"
          >
            {isAuthenticated ? 'Admin Panel' : 'Login'}
          </Link>
        </div>
      </header>

      <Link
        to="/contact"
        className="floating-contact-btn"
        aria-label="Contact us"
        title="Contact us"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="4" width="20" height="16" rx="1" />
          <path d="m22 7-10 7L2 7" />
        </svg>
      </Link>
    </>
  );
}
