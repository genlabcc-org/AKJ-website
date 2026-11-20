import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const footerRef = useRef(null);

  useEffect(() => {
    if (!footerRef.current) return;

    const updateHeight = () => {
      if (footerRef.current) {
        const height = footerRef.current.offsetHeight;
        document.documentElement.style.setProperty('--footer-height', `${height}px`);
      }
    };

    updateHeight();

    let ro = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(updateHeight);
      ro.observe(footerRef.current);
    }
    window.addEventListener('resize', updateHeight);

    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  return (
    <>
      {/* FLOATING ACTION MAIL BUTTON (Fixed on right edge) */}
      <a
        href="mailto:akjinternationalschool@gmail.com"
        className="akj-floating-mail-btn"
        aria-label="Send email to akjinternationalschool@gmail.com"
      >
        <svg
          width="18"
          height="18"
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
      </a>

      {/* FOOTER SECTION (Curtain reveal under main content on desktop) */}
      <footer ref={footerRef} className="akj-footer-section" aria-label="Site Footer">
        {/* BACKGROUND IMAGE: WHITE EDUCATIONAL DOODLE BANNER (INSTEAD OF RED) */}
        <div className="akj-footer-bg">
          <img
            src="/images/Footer_white_banner.jpg"
            alt="Cambridge educational doodle banner"
            className="akj-footer-bg-img"
          />
        </div>

        {/* OVERLAPPING SOLID WHITE CARD (WHITE TEMPLATE - NOT BLUE) */}
        <div className="akj-footer-card">
          <div className="akj-footer-card-inner">
            {/* 4-COLUMN MAIN GRID */}
            <div className="akj-footer-grid">
              {/* COLUMN 1: BRAND IDENTITY */}
              <div className="akj-footer-col akj-footer-brand-col">
                <div className="akj-footer-logo-box">
                  <Link to="/" aria-label="AKJ International School Home">
                    <img
                      src="/images/akj-logo.svg"
                      alt="AKJ International School Logo"
                      className="akj-footer-logo-img"
                    />
                  </Link>
                </div>
                <h3 className="akj-footer-brand-title">AKJ International School</h3>
                <p className="akj-footer-brand-desc">
                  One seamless Cambridge journey from EY1 to Grade 10—building confident, reflective, and innovative learners.
                </p>
              </div>

              {/* COLUMN 2: QUICK LINKS / SITEMAP */}
              <div className="akj-footer-col">
                <h4 className="akj-footer-heading">SITEMAP</h4>
                <ul className="akj-footer-list">
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/about">About</Link></li>
                  <li><Link to="/acedemics">Academics</Link></li>
                  <li><Link to="/team">Team</Link></li>
                  <li><Link to="/learners">Learners' Corner</Link></li>
                  <li><Link to="/services">Competences</Link></li>
                  <li><Link to="/services">References</Link></li>
                  <li><Link to="/blog">Blog</Link></li>
                  <li><Link to="/admission">Admission</Link></li>
                  <li><Link to="/contact">Contact</Link></li>
                </ul>
              </div>

              {/* COLUMN 3: CONTACT INFO WITH MINIMALIST ICONS */}
              <div className="akj-footer-col">
                <h4 className="akj-footer-heading">CONTACT INFO</h4>

                <div className="akj-footer-contact-list">
                  <div className="akj-footer-contact-item">
                    <svg
                      className="akj-footer-contact-icon"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <a
                      href="https://www.google.com/maps/place/AKJ+International+School/@8.2332383,77.3384014,871m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3b04f9e24bc806ed:0x20591399153dd220!8m2!3d8.2332383!4d77.3409817!16s%2Fg%2F11zcjfkhv1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="akj-footer-contact-link"
                    >
                      Tirunelveli Highway, opposite Iyangar Bakery,<br />
                      Thiruvananthapuram,<br />
                      Kumaracoil, Tamil Nadu 629175
                    </a>
                  </div>

                  <div className="akj-footer-contact-item">
                    <svg
                      className="akj-footer-contact-icon"
                      width="16"
                      height="16"
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
                    <a href="tel:+918072590214" className="akj-footer-contact-link">
                      +91 8072590214
                    </a>
                  </div>

                  <div className="akj-footer-contact-item">
                    <svg
                      className="akj-footer-contact-icon"
                      width="16"
                      height="16"
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
                    <a href="mailto:akjinternationalschool@gmail.com" className="akj-footer-contact-link">
                      akjinternationalschool@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* COLUMN 4: ADMISSIONS / LET'S TALK */}
              <div className="akj-footer-col akj-footer-admissions-col">
                <h4 className="akj-footer-heading">ADMISSIONS</h4>
                <p className="akj-footer-lead-text">
                  Have questions about our Cambridge pathway or admissions? We'd love to welcome your family to our campus.
                </p>

                <Link to="/contact" className="akj-footer-cta-btn">
                  Schedule a Visit
                </Link>

                <h5 className="akj-footer-subheading">SOCIAL NETWORKS</h5>
                <div className="akj-footer-social-icons">
                  <a
                    href="https://fr.linkedin.com/company/bb&b"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="akj-social-btn"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.instagram.com/weloveindustry/?hl=fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="akj-social-btn"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>
                  <a
                    href="https://www.youtube.com/c/Bb-bNet/videos"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="akj-social-btn"
                  >
                    <svg width="22" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* FULL-WIDTH BOTTOM SUB-FOOTER BAR */}
            <div className="akj-footer-bottom-bar">
              <div className="akj-footer-copyright">
                © 2026 AKJ International School. All rights reserved.
              </div>
              <div className="akj-footer-legal-links">
                <Link to="/about" className="akj-footer-legal-link">Privacy Policy</Link>
                <span className="akj-footer-legal-divider">•</span>
                <Link to="/about" className="akj-footer-legal-link">Terms &amp; Conditions</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
