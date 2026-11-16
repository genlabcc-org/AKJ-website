import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isHomePage = location.pathname === '/';

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''} ${!isHomePage ? 'light-theme' : ''}`}>
      <Link to="/" className="logo">
        Acadly
      </Link>

      <nav>
        <ul className="nav-links">
          <li>
            <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              About Us
            </NavLink>
          </li>
          <li>
            <NavLink to="/services" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Services
            </NavLink>
          </li>
          <li>
            <NavLink to="/pricing" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Pricing
            </NavLink>
          </li>
          <li>
            <NavLink to="/testimonials" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Testimonials
            </NavLink>
          </li>
          <li>
            <NavLink to="/blog" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Blog
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Contact
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="nav-actions">
        <Link
          to={isAuthenticated ? '/admin' : '/admin/login'}
          className="nav-admin-btn"
        >
          {isAuthenticated ? 'Admin Panel' : 'Admin Login'}
        </Link>
      </div>

      {/* Mobile menu toggle */}
      <button
        className="mobile-toggle"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle navigation menu"
      >
        <span style={{ transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}></span>
        <span style={{ opacity: mobileMenuOpen ? 0 : 1 }}></span>
        <span style={{ transform: mobileMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }}></span>
      </button>

      {/* Mobile Drawer */}
      <div className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
        <Link to="/">Home</Link>
        <Link to="/about">About Us</Link>
        <Link to="/services">Services</Link>
        <Link to="/pricing">Pricing</Link>
        <Link to="/testimonials">Testimonials</Link>
        <Link to="/blog">Blog</Link>
        <Link to="/contact">Contact</Link>
        <Link
          to={isAuthenticated ? '/admin' : '/admin/login'}
          className="mobile-admin-btn"
        >
          {isAuthenticated ? 'Admin Panel' : 'Admin Login'}
        </Link>
      </div>
    </header>
  );
}
