import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const footerRef = useRef(null);

  useEffect(() => {
    const updateFooterHeight = () => {
      if (footerRef.current) {
        const height = footerRef.current.offsetHeight;
        document.documentElement.style.setProperty('--footer-height', `${height}px`);
      }
    };

    updateFooterHeight();
    window.addEventListener('resize', updateFooterHeight);

    // Also observe size changes if images load later
    const observer = new ResizeObserver(() => updateFooterHeight());
    if (footerRef.current) observer.observe(footerRef.current);

    return () => {
      window.removeEventListener('resize', updateFooterHeight);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* FLOATING SIDE ENVELOPE BUTTON (Visible on desktop at right margin) */}
      <div className="bbb-floating-mail-btn" aria-label="Quick contact">
        <Link to="/contact" className="bbb-floating-mail-link" aria-label="Contact us">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </Link>
      </div>

      {/* CURTAIN REVEAL FOOTER WRAPPER */}
      <div ref={footerRef} className="bbb-footer-reveal-container">
        <footer className="bbb-footer" aria-label="Site Footer">
          {/* MOBILE / TABLET TOP BANNER (< 1024px) */}
          <div className="bbb-footer-mobile-banner">
            <img
              src="/images/FOOTER_2.avif"
              alt="Perforated industrial grille pattern"
              className="bbb-footer-mobile-img"
              loading="lazy"
            />
          </div>

          {/* DESKTOP FOOTER (>= 1024px) */}
          <div className="bbb-footer-desktop-box">
            {/* Background Grille positioned bottom-left behind the black box */}
            <img
              src="/images/FOOTER_2.avif"
              alt="Perforated industrial grille pattern"
              className="bbb-footer-grille-bg"
              loading="lazy"
            />

            {/* Solid Black Card Inset (ml-40: 160px) */}
            <div className="bbb-footer-black-inner">
              <div className="bbb-footer-content-grid">
                {/* LOGO */}
                <div className="bbb-footer-brand">
                  <Link to="/" aria-label="bb&b Homepage">
                    <img
                      src="/images/footer_white.svg"
                      alt="bb&b logo"
                      className="bbb-footer-svg-logo"
                      loading="lazy"
                    />
                  </Link>
                </div>

                {/* COLUMNS */}
                <div className="bbb-footer-links-group">
                  {/* SITEMAP */}
                  <div className="bbb-footer-nav-col">
                    <h4 className="bbb-footer-heading">Sitemap</h4>
                    <ul className="bbb-footer-nav-list">
                      <li><Link to="/">Home</Link></li>
                      <li><Link to="/about">Agency</Link></li>
                      <li><Link to="/services">Competences</Link></li>
                      <li><Link to="/services">References</Link></li>
                      <li><Link to="/blog">Blog</Link></li>
                      <li><Link to="/about">bb&amp;b glossary</Link></li>
                      <li><Link to="/about">Legal Notice</Link></li>
                    </ul>
                  </div>

                  {/* ADDRESS / CONTACT */}
                  <div className="bbb-footer-address-col">
                    <div className="bbb-address-item">
                      <h4 className="bbb-footer-heading">Address</h4>
                      <a
                        href="https://maps.google.com/?q=22+rue+Soleillet+75020+Paris+France"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bbb-address-text-link"
                      >
                        <span>22, rue Soleillet</span>
                        <span>75020 Paris</span>
                        <span>France</span>
                      </a>
                    </div>

                    <div className="bbb-address-item">
                      <h4 className="bbb-footer-heading">Phone</h4>
                      <a href="tel:+33140337941" className="bbb-contact-text-link">
                        +33 1 40 33 79 41
                      </a>
                    </div>

                    <div className="bbb-address-item">
                      <h4 className="bbb-footer-heading">Email</h4>
                      <a href="mailto:contact@bb-b.fr" className="bbb-contact-text-link">
                        contact@bb-b.fr
                      </a>
                    </div>
                  </div>

                  {/* LET'S TALK & SOCIALS */}
                  <div className="bbb-footer-talk-col">
                    <div className="bbb-talk-item">
                      <h4 className="bbb-footer-heading">Let’s talk</h4>
                      <Link to="/contact" className="bbb-talk-text-link">
                        Do you have a project, a question, or would you like to find out more about us? We’d be happy to answer any questions you may have!
                      </Link>
                    </div>

                    <div className="bbb-social-item">
                      <h4 className="bbb-footer-heading">Social Networks</h4>
                      <div className="bbb-social-row">
                        <a
                          href="https://fr.linkedin.com/company/bb&b"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bbb-social-btn"
                          aria-label="LinkedIn"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                          </svg>
                        </a>

                        <a
                          href="https://www.instagram.com/weloveindustry/?hl=fr"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bbb-social-btn"
                          aria-label="Instagram"
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
                          className="bbb-social-btn"
                          aria-label="YouTube"
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

              {/* COPYRIGHT */}
              <div className="bbb-footer-bottom-copy">
                <span>© 2026 bb&amp;b</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
