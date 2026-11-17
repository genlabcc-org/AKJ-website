import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <>
      <footer id="contact-footer" className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="footer-logo">Acadly</div>
              <div className="footer-address">
                <p>Hemingway Bvd. 22, London City, UK</p>
                <p style={{ marginTop: '8px' }}>
                  <a href="mailto:myemail@email.com">myemail@email.com</a>
                </p>
                <p style={{ marginTop: '4px' }}>
                  <a href="tel:+40777666555">+40 777 666 555</a>
                </p>
              </div>
            </div>

            <div className="footer-col">
              <h5>Navigation</h5>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/services">Services</Link></li>
                <li><Link to="/pricing">Pricing</Link></li>
                <li><Link to="/testimonials">Testimonials</Link></li>
                <li><Link to="/blog">Blog</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h5>Social Media</h5>
              <ul>
                <li><a href="https://x.com" target="_blank" rel="noopener noreferrer">X (Twitter)</a></li>
                <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h5>Legal</h5>
              <ul>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Cookie Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div>© 2026 All Rights reserved</div>
            <div style={{ display: 'flex', gap: '24px' }}>
              <a href="#">Privacy Policy</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
