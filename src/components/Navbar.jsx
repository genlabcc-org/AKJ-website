import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const ABOUT_ITEMS = [
  { to: '/about', label: 'The Cambridge Way' },
  { to: '/team', label: 'Team' },
  { to: '/faq', label: 'Why Cambridge / FAQ' },
];

const ACADEMIC_ITEMS = [
  { to: '/acedemics', label: 'EY1–Grade 10 Pathway' },
];

const PORTAL_OPTIONS = [
  { label: 'Parent/Student', to: '/portal/parent-student' },
  { label: 'Teacher', to: '/portal/teacher' },
  { label: 'Admin', to: '/admin', requiresAuth: true },
  { label: 'Web Admin', to: '/admin', requiresAuth: true },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [academicsDropdownOpen, setAcademicsDropdownOpen] = useState(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);

  // Mobile accordion states
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [mobileAcademicsOpen, setMobileAcademicsOpen] = useState(false);
  const [mobilePortalOpen, setMobilePortalOpen] = useState(false);

  const headerRef = useRef(null);
  const aboutRef = useRef(null);
  const academicsRef = useRef(null);
  const portalRef = useRef(null);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const isAboutActive = ['/about', '/team', '/faq'].includes(location.pathname);
  const isAcademicsActive = location.pathname === '/acedemics';
  const isPortalActive =
    location.pathname.startsWith('/portal') ||
    location.pathname.startsWith('/admin');

  useEffect(() => {
    setMobileMenuOpen(false);
    setAboutDropdownOpen(false);
    setAcademicsDropdownOpen(false);
    setPortalDropdownOpen(false);
    setMobileAboutOpen(false);
    setMobileAcademicsOpen(false);
    setMobilePortalOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (aboutRef.current && !aboutRef.current.contains(event.target)) {
        setAboutDropdownOpen(false);
      }
      if (academicsRef.current && !academicsRef.current.contains(event.target)) {
        setAcademicsDropdownOpen(false);
      }
      if (portalRef.current && !portalRef.current.contains(event.target)) {
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
      <header className="site-header" ref={headerRef}>
        {/* 1. TOP UTILITY BAR (Slim Cambridge Navy Strip #1E459F) */}
        <div className="site-utility-bar">
          <div className="site-utility-inner">
            <div className="site-utility-left">
              <a href="tel:+91 8072590214" className="site-utility-link" aria-label="Call AKJ School">
                <svg
                  className="site-utility-icon"
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>+91 8072590214</span>
              </a>
              <span className="site-utility-divider">•</span>
              <a href="mailto:akjinternationalschool@gmail.com" className="site-utility-link" aria-label="Email AKJ School">
                <svg
                  className="site-utility-icon"
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span>akjinternationalschool@gmail.com</span>
              </a>
            </div>

            <div className="site-utility-right">
              <NavLink to="/blog" className="site-utility-link site-utility-blog-link">
                <span>Blog</span>
              </NavLink>

              <span className="site-utility-divider">|</span>

              {/* Portal Login Dropdown (Top Utility Bar) */}
              <div
                className={`site-utility-portal ${portalDropdownOpen ? 'open' : ''}`}
                ref={portalRef}
                onMouseEnter={() => setPortalDropdownOpen(true)}
                onMouseLeave={() => setPortalDropdownOpen(false)}
              >
                <button
                  type="button"
                  className={`site-utility-portal-btn ${isPortalActive ? 'active' : ''}`}
                  onClick={() => setPortalDropdownOpen((prev) => !prev)}
                  aria-expanded={portalDropdownOpen}
                  aria-haspopup="true"
                >
                  <svg
                    className="site-utility-icon"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                  <span>Portal Login</span>
                  <svg
                    className={`site-portal-chevron ${portalDropdownOpen ? 'open' : ''}`}
                    width="9"
                    height="5"
                    viewBox="0 0 10 6"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M1 1L5 5L9 1"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <div className="site-portal-menu site-utility-portal-menu" role="menu">
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
          </div>
        </div>

        {/* 2. MAIN NAVBAR (White Background, Single Row) */}
        <div className="site-header-inner">
          <Link to="/" className="site-brand" aria-label="AKJ Home">
            <img
              src="/images/akj-logo.svg"
              alt="AKJ Logo"
              className="site-logo-img"
            />
          </Link>

          <nav className="site-nav" aria-label="Primary navigation">
            {/* Home */}
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `site-nav-link ${isActive ? 'active' : ''}`
              }
            >
              Home
            </NavLink>

            {/* About Dropdown (The Cambridge Way, Team, Why Cambridge / FAQ) */}
            <div
              className={`site-nav-dropdown ${aboutDropdownOpen ? 'open' : ''}`}
              ref={aboutRef}
              onMouseEnter={() => setAboutDropdownOpen(true)}
              onMouseLeave={() => setAboutDropdownOpen(false)}
            >
              <button
                type="button"
                className={`site-nav-link site-dropdown-trigger ${isAboutActive ? 'active' : ''}`}
                onClick={() => setAboutDropdownOpen((prev) => !prev)}
                aria-expanded={aboutDropdownOpen}
                aria-haspopup="true"
              >
                <span>About</span>
                <svg
                  className={`site-nav-chevron ${aboutDropdownOpen ? 'open' : ''}`}
                  width="9"
                  height="5"
                  viewBox="0 0 10 6"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M1 1L5 5L9 1"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div className="site-dropdown-menu" role="menu">
                {ABOUT_ITEMS.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className="site-dropdown-item"
                    role="menuitem"
                    onClick={() => setAboutDropdownOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Academics Dropdown (EY1–Grade 10 Pathway, Services) */}
            <div
              className={`site-nav-dropdown ${academicsDropdownOpen ? 'open' : ''}`}
              ref={academicsRef}
              onMouseEnter={() => setAcademicsDropdownOpen(true)}
              onMouseLeave={() => setAcademicsDropdownOpen(false)}
            >
              <button
                type="button"
                className={`site-nav-link site-dropdown-trigger ${isAcademicsActive ? 'active' : ''}`}
                onClick={() => setAcademicsDropdownOpen((prev) => !prev)}
                aria-expanded={academicsDropdownOpen}
                aria-haspopup="true"
              >
                <span>Academics</span>
                <svg
                  className={`site-nav-chevron ${academicsDropdownOpen ? 'open' : ''}`}
                  width="9"
                  height="5"
                  viewBox="0 0 10 6"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M1 1L5 5L9 1"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div className="site-dropdown-menu" role="menu">
                {ACADEMIC_ITEMS.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className="site-dropdown-item"
                    role="menuitem"
                    onClick={() => setAcademicsDropdownOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Achievements (Replaces "Learners Achievement Corner") */}
            <NavLink
              to="/learners"
              className={({ isActive }) =>
                `site-nav-link ${isActive ? 'active' : ''}`
              }
            >
              Learners Achievements Corner
            </NavLink>

            {/* Contact */}
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `site-nav-link ${isActive ? 'active' : ''}`
              }
            >
              Contact
            </NavLink>
          </nav>

          {/* MAIN NAVBAR CTA (Admissions Primary Solid Button) */}
          <div className="site-header-actions">
            <Link to="/admission" className="site-cta-admission-btn">
              Admissions
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

        {/* 3. MOBILE DRAWER */}
        <div className={`site-mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
          {/* Home */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `site-mobile-link ${isActive ? 'active' : ''}`
            }
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </NavLink>

          {/* About Accordion */}
          <div className="site-mobile-accordion">
            <button
              type="button"
              className={`site-mobile-link site-mobile-accordion-toggle ${mobileAboutOpen ? 'open' : ''}`}
              onClick={() => setMobileAboutOpen((prev) => !prev)}
              aria-expanded={mobileAboutOpen}
            >
              <span>About</span>
              <svg
                className={`site-portal-chevron ${mobileAboutOpen ? 'open' : ''}`}
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
            {mobileAboutOpen && (
              <div className="site-mobile-sublinks">
                {ABOUT_ITEMS.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className="site-mobile-sublink"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* Academics Accordion */}
          <div className="site-mobile-accordion">
            <button
              type="button"
              className={`site-mobile-link site-mobile-accordion-toggle ${mobileAcademicsOpen ? 'open' : ''}`}
              onClick={() => setMobileAcademicsOpen((prev) => !prev)}
              aria-expanded={mobileAcademicsOpen}
            >
              <span>Academics</span>
              <svg
                className={`site-portal-chevron ${mobileAcademicsOpen ? 'open' : ''}`}
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
            {mobileAcademicsOpen && (
              <div className="site-mobile-sublinks">
                {ACADEMIC_ITEMS.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className="site-mobile-sublink"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* Achievements */}
          <NavLink
            to="/learners"
            className={({ isActive }) =>
              `site-mobile-link ${isActive ? 'active' : ''}`
            }
            onClick={() => setMobileMenuOpen(false)}
          >
            Achievements
          </NavLink>

          {/* Blog */}
          <NavLink
            to="/blog"
            className={({ isActive }) =>
              `site-mobile-link ${isActive ? 'active' : ''}`
            }
            onClick={() => setMobileMenuOpen(false)}
          >
            Blog
          </NavLink>

          {/* Contact */}
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `site-mobile-link ${isActive ? 'active' : ''}`
            }
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </NavLink>

          {/* Portal Login Accordion */}
          <div className="site-mobile-accordion">
            <button
              type="button"
              className={`site-mobile-link site-mobile-accordion-toggle ${mobilePortalOpen ? 'open' : ''}`}
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
              <div className="site-mobile-sublinks">
                {PORTAL_OPTIONS.map((item) => {
                  const targetTo = item.requiresAuth
                    ? (isAuthenticated ? '/admin' : '/admin/login')
                    : item.to;
                  return (
                    <Link
                      key={item.label}
                      to={targetTo}
                      className="site-mobile-sublink"
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
                    className="site-mobile-sublink site-mobile-portal-logout"
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

          {/* Mobile Admissions Solid Button */}
          <Link
            to="/admission"
            className="site-mobile-admission-cta"
            onClick={() => setMobileMenuOpen(false)}
          >
            Admissions
          </Link>

          {/* Mobile Quick Contact Links */}
          <div className="site-mobile-contact-bar">
            <a href="tel:+919442200000" className="site-mobile-contact-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>+91 94422 00000</span>
            </a>
            <a href="mailto:info@akj.school" className="site-mobile-contact-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span>info@akj.school</span>
            </a>
          </div>
        </div>
      </header>
    </>
  );
}