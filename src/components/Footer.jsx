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
      {/* FLOATING BLACK MAIL BUTTON (Fixed on right edge across entire site) */}
      <a
        href="mailto:contact@bb-b.fr"
        className="bbb-floating-mail-btn"
        aria-label="Send email to contact@bb-b.fr"
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
      <footer ref={footerRef} className="bbb-footer-section" aria-label="Site Footer">
        {/* FULL BACKGROUND IMAGE: PERFORATED INDUSTRIAL VENTILATION GRILLE */}
        <div className="bbb-footer-bg">
          <img
            src="/images/FOOTER_2.avif"
            alt="Perforated industrial grille pattern"
            className="bbb-footer-bg-img"
          />
        </div>

        {/* SOLID BLACK INNER CARD OVERLAPPING */}
        <div className="bbb-footer-card">
          <div className="bbb-footer-card-inner">
            {/* LEFT BRAND SIDE */}
            <div className="bbb-footer-brand-side">
              <div className="bbb-footer-logo-box">
                <Link to="/" aria-label="AKJ Homepage">
                  <img
                    src="/images/akj-logo.svg"
                    alt="AKJ Logo"
                    className="bbb-footer-logo-img"
                  />
                </Link>
              </div>
              <div className="bbb-footer-copy">© 2026 AKJ</div>
            </div>

            {/* RIGHT NAVIGATION COLUMNS */}
            <div className="bbb-footer-links-grid">
              {/* COLUMN 1: SITEMAP */}
              <div className="bbb-footer-col">
                <h4 className="bbb-footer-title">SITEMAP</h4>
                <ul className="bbb-footer-list">
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/about">Agency</Link></li>
                  <li><Link to="/team">Team</Link></li>
                  <li><Link to="/services">Competences</Link></li>
                  <li><Link to="/services">References</Link></li>
                  <li><Link to="/blog">Blog</Link></li>
                  <li><Link to="/about">bb&amp;b glossary</Link></li>
                  <li><Link to="/about">Legal Notice</Link></li>
                </ul>
              </div>

              {/* COLUMN 2: ADDRESS */}
              <div className="bbb-footer-col">
                <h4 className="bbb-footer-title">ADDRESS</h4>
                <p className="bbb-footer-desc">
                  <a
                    href="https://maps.google.com/?q=22+rue+Soleillet+75020+Paris+France"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bbb-footer-text-link"
                  >
                    22, rue Soleillet<br />
                    75020 Paris<br />
                    France
                  </a>
                </p>

                <h4 className="bbb-footer-title bbb-footer-sub">PHONE</h4>
                <p className="bbb-footer-desc">
                  <a href="tel:+33140337941" className="bbb-footer-text-link">
                    +33 1 40 33 79 41
                  </a>
                </p>

                <h4 className="bbb-footer-title bbb-footer-sub">EMAIL</h4>
                <p className="bbb-footer-desc">
                  <a href="mailto:contact@bb-b.fr" className="bbb-footer-text-link">
                    contact@bb-b.fr
                  </a>
                </p>
              </div>

              {/* COLUMN 3: LET'S TALK */}
              <div className="bbb-footer-col bbb-footer-col-wide">
                <h4 className="bbb-footer-title">LET'S TALK</h4>
                <p className="bbb-footer-desc bbb-footer-talk-lead">
                  <Link to="/contact" className="bbb-footer-text-link">
                    Do you have a project, a question, or would you like to find out more about us? We’d be happy to answer any questions you may have!
                  </Link>
                </p>

                <h4 className="bbb-footer-title bbb-footer-sub">SOCIAL NETWORKS</h4>
                <div className="bbb-footer-social-icons">
                  <a
                    href="https://fr.linkedin.com/company/bb&b"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="bbb-social-btn"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                    </svg>
                  </a>
                  <a
                    href="https://www.instagram.com/weloveindustry/?hl=fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="bbb-social-btn"
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
                    className="bbb-social-btn"
                  >
                    <svg width="22" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
