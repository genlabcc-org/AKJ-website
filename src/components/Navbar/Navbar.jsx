import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <header className="nhehs-site-header">
      <div className="nhehs-header-wrap">
        {/* LEFT NAVIGATION (4 Symmetrical Columns) */}
        <div className="nhehs-side-nav nhehs-side-left">
          {/* Column 1: Junior */}
          <div className="nhehs-nav-col">
            <div className="nhehs-top-slot"></div>
            <div className="nhehs-mid-slot">
              <span className="nhehs-diamond" aria-hidden="true"></span>
            </div>
            <div className="nhehs-bot-slot">
              <NavLink
                to="/"
                end
                className={({ isActive }) => `nhehs-nav-link ${isActive ? 'active' : ''}`}
              >
                Junior
              </NavLink>
            </div>
          </div>

          {/* Column 2: Search + Senior */}
          <div className="nhehs-nav-col">
            <div className="nhehs-top-slot">
              <button
                type="button"
                className="nhehs-top-link"
                onClick={() => {}}
              >
                Search
              </button>
            </div>
            <div className="nhehs-mid-slot"></div>
            <div className="nhehs-bot-slot">
              <NavLink
                to="/services"
                className={({ isActive }) => `nhehs-nav-link ${isActive ? 'active' : ''}`}
              >
                Senior
              </NavLink>
            </div>
          </div>

          {/* Column 3: Parents + Sixth */}
          <div className="nhehs-nav-col">
            <div className="nhehs-top-slot">
              <Link to="/pricing" className="nhehs-top-link">
                Parents
              </Link>
            </div>
            <div className="nhehs-mid-slot"></div>
            <div className="nhehs-bot-slot">
              <NavLink
                to="/pricing"
                className={({ isActive }) => `nhehs-nav-link ${isActive ? 'active' : ''}`}
              >
                Sixth
              </NavLink>
            </div>
          </div>

          {/* Column 4: Contact Us + Admissions */}
          <div className="nhehs-nav-col">
            <div className="nhehs-top-slot">
              <Link to="/contact" className="nhehs-top-link">
                Contact Us
              </Link>
            </div>
            <div className="nhehs-mid-slot">
              <span className="nhehs-diamond" aria-hidden="true"></span>
            </div>
            <div className="nhehs-bot-slot">
              <NavLink
                to="/contact"
                className={({ isActive }) => `nhehs-nav-link ${isActive ? 'active' : ''}`}
              >
                Admissions
              </NavLink>
            </div>
          </div>
        </div>

        {/* CENTER LOGO */}
        <div className="nhehs-center-logo">
          <Link to="/" className="nhehs-logo-btn" title="Notting Hill & Ealing High School GDST">
            <img
              src="/images/notting-hill-primary.svg"
              alt="Notting Hill & Ealing High School GDST"
              className="nhehs-logo-vector"
            />
          </Link>
        </div>

        {/* RIGHT NAVIGATION (4 Symmetrical Columns) */}
        <div className="nhehs-side-nav nhehs-side-right">
          {/* Column 1: About */}
          <div className="nhehs-nav-col">
            <div className="nhehs-top-slot"></div>
            <div className="nhehs-mid-slot"></div>
            <div className="nhehs-bot-slot">
              <NavLink
                to="/about"
                className={({ isActive }) => `nhehs-nav-link ${isActive ? 'active' : ''}`}
              >
                About
              </NavLink>
            </div>
          </div>

          {/* Column 2: Support us + Community */}
          <div className="nhehs-nav-col">
            <div className="nhehs-top-slot">
              <Link to="/about" className="nhehs-top-link">
                Support us
              </Link>
            </div>
            <div className="nhehs-mid-slot"></div>
            <div className="nhehs-bot-slot">
              <NavLink
                to="/testimonials"
                className={({ isActive }) => `nhehs-nav-link ${isActive ? 'active' : ''}`}
              >
                Community
              </NavLink>
            </div>
          </div>

          {/* Column 3: Bursaries + News */}
          <div className="nhehs-nav-col">
            <div className="nhehs-top-slot">
              <Link to="/pricing" className="nhehs-top-link">
                Bursaries
              </Link>
            </div>
            <div className="nhehs-mid-slot"></div>
            <div className="nhehs-bot-slot">
              <NavLink
                to="/blog"
                className={({ isActive }) => `nhehs-nav-link ${isActive ? 'active' : ''}`}
              >
                News
              </NavLink>
            </div>
          </div>

          {/* Column 4: Login + Views & Voices */}
          <div className="nhehs-nav-col">
            <div className="nhehs-top-slot">
              <Link
                to={isAuthenticated ? '/admin' : '/admin/login'}
                className="nhehs-login-btn"
              >
                {isAuthenticated ? 'Admin Panel' : 'Login'}
              </Link>
            </div>
            <div className="nhehs-mid-slot"></div>
            <div className="nhehs-bot-slot">
              <NavLink
                to="/blog"
                className="nhehs-nav-link"
              >
                Views &amp; Voices
              </NavLink>
            </div>
          </div>
        </div>

        {/* MOBILE BURGER */}
        <button
          className="nhehs-mobile-burger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          <span style={{ transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}></span>
          <span style={{ opacity: mobileMenuOpen ? 0 : 1 }}></span>
          <span style={{ transform: mobileMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }}></span>
        </button>
      </div>

      {/* MOBILE DRAWER */}
      <div className={`nhehs-mobile-pane ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="nhehs-pane-group">Departments</div>
        <Link to="/">◆ Junior</Link>
        <Link to="/services">Senior</Link>
        <Link to="/pricing">Sixth</Link>
        <Link to="/contact">◆ Admissions</Link>

        <div className="nhehs-pane-group">Information &amp; Community</div>
        <Link to="/about">About</Link>
        <Link to="/testimonials">Community</Link>
        <Link to="/blog">News</Link>
        <Link to="/blog">Views &amp; Voices</Link>
        <Link to="/about">Support us</Link>
        <Link to="/pricing">Bursaries</Link>
        <Link to="/contact">Contact Us</Link>
        <Link
          to={isAuthenticated ? '/admin' : '/admin/login'}
          className="nhehs-mobile-login-btn"
        >
          {isAuthenticated ? 'Admin Panel' : 'Login'}
        </Link>
      </div>
    </header>
  );
}
