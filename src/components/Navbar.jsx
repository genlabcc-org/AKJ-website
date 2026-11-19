import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const NAV_ITEMS_ROW_1 = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About / The Cambridge Way' },
  { to: '/acedemics', label: 'Academics' },
  { to: '/team', label: 'Team' },
  { to: '/faq', label: 'Why Cambridge (FAQ)' },
  { to: '/services', label: 'Services' },
  { to: '/learners', label: 'Learners Achievement Corner' },
];

const NAV_ITEMS_ROW_2 = [
  { to: '/blog', label: 'Blog' },
  { to: '/admission', label: 'Admission' },
  { to: '/contact', label: 'Contact' },
];

const PORTAL_OPTIONS = [
  { label: 'Parent/Student', to: '/portal/parent-student' },
  { label: 'Teacher', to: '/portal/teacher' },
  { label: 'Admin', to: '/admin', requiresAuth: true },
  { label: 'Web Admin', to: '/admin', requiresAuth: true },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);
  const [mobilePortalOpen, setMobilePortalOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const isPortalActive =
    location.pathname.startsWith('/portal') ||
    location.pathname.startsWith('/admin');

  useEffect(() => {
    setMobileMenuOpen(false);
    setPortalDropdownOpen(false);
    setMobilePortalOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setPortalDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="site-header">
        <div className="site-header-inner">
          <Link to="/" className="site-brand" aria-label="AKJ Home">
            <img
              src="/images/akj-logo.svg"
              alt="AKJ Logo"
              className="site-logo-img"
            />
          </Link>

          <nav className="site-nav" aria-label="Primary navigation">
            <div className="site-nav-row site-nav-row-1">
              {NAV_ITEMS_ROW_1.map((item) => (
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
            </div>
            <div className="site-nav-row site-nav-row-2">
              {NAV_ITEMS_ROW_2.map((item) => (
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

              {/* Portal Login Dropdown */}
              <div
                className={`site-portal-dropdown ${portalDropdownOpen ? 'open' : ''}`}
                ref={dropdownRef}
                onMouseEnter={() => setPortalDropdownOpen(true)}
                onMouseLeave={() => setPortalDropdownOpen(false)}
              >
                <button
                  type="button"
                  className={`site-nav-link site-portal-trigger ${isPortalActive ? 'active' : ''}`}
                  onClick={() => setPortalDropdownOpen((prev) => !prev)}
                  aria-expanded={portalDropdownOpen}
                  aria-haspopup="true"
                >
                  <span>Portal Login</span>
                  <svg
                    className={`site-portal-chevron ${portalDropdownOpen ? 'open' : ''}`}
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M1 1L5 5L9 1"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <div className="site-portal-menu" role="menu">
                  {PORTAL_OPTIONS.map((item) => {
                    const targetTo = item.requiresAuth
                      ? (isAuthenticated ? '/admin' : '/admin/login')
                      : item.to;
                    return (
                      <Link
                        key={item.label}
                        to={targetTo}
                        className="site-portal-item"
                        role="menuitem"
                        onClick={() => setPortalDropdownOpen(false)}
                      >
                        <span>{item.label}</span>
                        {item.requiresAuth && isAuthenticated && (
                          <span className="site-portal-badge">Active</span>
                        )}
                      </Link>
                    );
                  })}

                  {isAuthenticated && (
                    <button
                      type="button"
                      className="site-portal-item site-portal-logout-btn"
                      role="menuitem"
                      onClick={async () => {
                        setPortalDropdownOpen(false);
                        await logout();
                      }}
                    >
                      <span>Sign Out</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </nav>

          <div className="site-header-actions">
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
          {NAV_ITEMS_ROW_1.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `site-mobile-link ${isActive ? 'active' : ''}`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}

          {NAV_ITEMS_ROW_2.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `site-mobile-link ${isActive ? 'active' : ''}`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}

          <div className="site-mobile-portal-section">
            <button
              type="button"
              className={`site-mobile-link site-mobile-portal-toggle ${mobilePortalOpen ? 'open' : ''}`}
              onClick={() => setMobilePortalOpen((prev) => !prev)}
              aria-expanded={mobilePortalOpen}
            >
              <span>Portal Login</span>
              <svg
                className={`site-portal-chevron ${mobilePortalOpen ? 'open' : ''}`}
                width="12"
                height="8"
                viewBox="0 0 10 6"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M1 1L5 5L9 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {mobilePortalOpen && (
              <div className="site-mobile-portal-sublinks">
                {PORTAL_OPTIONS.map((item) => {
                  const targetTo = item.requiresAuth
                    ? (isAuthenticated ? '/admin' : '/admin/login')
                    : item.to;
                  return (
                    <Link
                      key={item.label}
                      to={targetTo}
                      className="site-mobile-portal-sublink"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span>{item.label}</span>
                      {item.requiresAuth && isAuthenticated && (
                        <span className="site-portal-badge">Active</span>
                      )}
                    </Link>
                  );
                })}

                {isAuthenticated && (
                  <button
                    type="button"
                    className="site-mobile-portal-sublink site-mobile-portal-logout"
                    onClick={async () => {
                      setMobileMenuOpen(false);
                      await logout();
                    }}
                  >
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}