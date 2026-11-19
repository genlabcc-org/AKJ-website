import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './CaseStudies.css';

gsap.registerPlugin(ScrollTrigger);

export default function CaseStudies() {
  const sectionRef = useRef(null);

  // GSAP Smooth Parallax on Images and Floating Overlapping Cards
  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray('.case-study-item');

      items.forEach((item) => {
        const img = item.querySelector('.case-study-img');
        const card = item.querySelector('.case-study-card');

        // Faster, responsive image parallax scrub
        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -14 },
            {
              yPercent: 14,
              ease: 'none',
              scrollTrigger: {
                trigger: item,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.65,
              },
            }
          );
        }

        // Faster floating card parallax on desktop
        if (card && window.innerWidth >= 1024) {
          gsap.fromTo(
            card,
            { y: -45 },
            {
              y: 45,
              ease: 'none',
              scrollTrigger: {
                trigger: item,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.75,
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="case-studies-section" aria-label="Our Projects and Tangible Case Studies">
      {/* SECTION DIVIDER */}
      <div className="case-studies-divider"></div>

      {/* SECTION HEADER */}
      <div className="case-studies-header">
        <div className="case-studies-title-wrap">
          <h2 className="case-studies-eyebrow">OUR PROJECTS</h2>
          <h3 className="case-studies-heading">TANGIBLE CASE STUDIES</h3>
        </div>
        <p className="case-studies-lead">
          Our b2b know-how encompasses a variety of industries and applications. Discover our work through the following examples.
        </p>
      </div>

      {/* CASE STUDIES LIST */}
      <div className="case-studies-list">
        {/* CASE STUDY 1: ZONEGREEN */}
        <div className="case-study-item case-study-left">
          <div className="case-study-img-wrap">
            <div className="case-study-img-inner">
              <img
                src="/images/ZG_HEADER.jpg"
                alt="Zonegreen railway depot protection systems"
                className="case-study-img"
                loading="lazy"
              />
            </div>
          </div>

          <div className="case-study-card">
            <span className="case-study-tag">INTEGRATED MARKETING CAMPAIGN</span>
            <h4 className="case-study-title">ZONEGREEN</h4>
            <p className="case-study-desc">
              Zonegreen develops and produces protection systems for railway depots. bb&amp;b has conceived an integrated marketing campaign to launch the brand in France.
            </p>
            <Link
              to="/services"
              className="case-study-link"
              aria-label="Learn more about Zonegreen case study"
            >
              <svg
                className="case-study-arrow"
                width="13"
                height="13"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
              >
                <path
                  stroke="currentColor"
                  strokeWidth="1.5"
                  d="M9.514 9.45 2 2m7.514 7.45H3.252m6.262 0V3.242"
                />
              </svg>
              <span>Learn more</span>
            </Link>
          </div>
        </div>

        {/* CASE STUDY 2: BINDER MAGNETIC */}
        <div className="case-study-item case-study-right">
          <div className="case-study-img-wrap">
            <div className="case-study-img-inner">
              <img
                src="/images/bbb_Binder_magnetic.jpg"
                alt="Binder Magnetic polyurethane timing belts and mechanical components"
                className="case-study-img"
                loading="lazy"
              />
            </div>
          </div>

          <div className="case-study-card">
            <span className="case-study-tag">WEB DEVELOPMENT &amp; DIGITAL MARKETING</span>
            <h4 className="case-study-title">BINDER MAGNETIC</h4>
            <p className="case-study-desc">
              Binder Magnetic is a leading French supplier and manufacturer of polyurethane timing belts. The company also provides a wealth of mechanical components such as electromagnets, brakes and electrical actuators for the industry.
            </p>
            <Link
              to="/services"
              className="case-study-link"
              aria-label="Learn more about Binder Magnetic case study"
            >
              <svg
                className="case-study-arrow"
                width="13"
                height="13"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
              >
                <path
                  stroke="currentColor"
                  strokeWidth="1.5"
                  d="M9.514 9.45 2 2m7.514 7.45H3.252m6.262 0V3.242"
                />
              </svg>
              <span>Learn more</span>
            </Link>
          </div>
        </div>

        {/* CASE STUDY 3: FRÉNÉHARD PLIAGE */}
        <div className="case-study-item case-study-left">
          <div className="case-study-img-wrap">
            <div className="case-study-img-inner">
              <img
                src="/images/bbb_frenehard_pliage.jpg"
                alt="Frénéhard Pliage digital sheet metal folding offering"
                className="case-study-img"
                loading="lazy"
              />
            </div>
          </div>

          <div className="case-study-card">
            <span className="case-study-tag">WEB DEVELOPMENT &amp; DIGITAL MARKETING</span>
            <h4 className="case-study-title">FRÉNÉHARD PLIAGE</h4>
            <p className="case-study-desc">
              Frénéhard accelerates its digitalisation and launches a new activity: Frénéhard Pliage. It aims at meeting the needs of the building envelope and exterior fittings market with an entirely digital offering.
            </p>
            <Link
              to="/services"
              className="case-study-link"
              aria-label="Learn more about Frénéhard Pliage case study"
            >
              <svg
                className="case-study-arrow"
                width="13"
                height="13"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
              >
                <path
                  stroke="currentColor"
                  strokeWidth="1.5"
                  d="M9.514 9.45 2 2m7.514 7.45H3.252m6.262 0V3.242"
                />
              </svg>
              <span>Learn more</span>
            </Link>
          </div>
        </div>

        {/* CASE STUDY 4: BRIGHTLOOP BRAND */}
        <div className="case-study-item case-study-right">
          <div className="case-study-img-wrap">
            <div className="case-study-img-inner">
              <img
                src="/images/bbb_BrightLoop_5.jpg"
                alt="BrightLoop universal high-performance power converters"
                className="case-study-img"
                loading="lazy"
              />
            </div>
          </div>

          <div className="case-study-card">
            <span className="case-study-tag">BRANDING</span>
            <h4 className="case-study-title">BRIGHTLOOP BRAND</h4>
            <p className="case-study-desc">
              BrightLoop develops and produces universal high-performance power converters for the energy transition. bb&amp;b has completely overhauled the technologically leading brand.
            </p>
            <Link
              to="/services"
              className="case-study-link"
              aria-label="Learn more about BrightLoop Brand case study"
            >
              <svg
                className="case-study-arrow"
                width="13"
                height="13"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
              >
                <path
                  stroke="currentColor"
                  strokeWidth="1.5"
                  d="M9.514 9.45 2 2m7.514 7.45H3.252m6.262 0V3.242"
                />
              </svg>
              <span>Learn more</span>
            </Link>
          </div>
        </div>
      </div>

      {/* MORE REFERENCES CTA BUTTON */}
      <div className="case-studies-cta-wrap">
        <Link to="/services" className="case-studies-more-btn" aria-label="Explore more references">
          <svg
            className="case-studies-more-arrow"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
          >
            <path
              stroke="currentColor"
              strokeWidth="1.5"
              d="M9.514 9.45 2 2m7.514 7.45H3.252m6.262 0V3.242"
            />
          </svg>
          <span>More references</span>
        </Link>
      </div>
    </section>
  );
}
