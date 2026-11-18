import React from 'react';
import { Link } from 'react-router-dom';
import './AgencyIntro.css';

export default function AgencyIntro() {
  return (
    <section className="agency-intro-section">
      <div className="agency-intro-divider"></div>

      <div className="agency-intro-grid">
        {/* LEFT COLUMN */}
        <div className="agency-intro-left">
          <p className="agency-intro-eyebrow">
            Universities, Boarding Schools &amp; Global Admissions
          </p>
          <h2 className="agency-intro-title">A Unique Consultancy</h2>
          <p className="agency-intro-lead">
            Acadly is an international education and admissions consultancy
            specialising in leading universities and premier boarding schools.
          </p>
        </div>

        {/* RIGHT COLUMN */}
        <div className="agency-intro-right">
          <p className="agency-intro-body">
            We combine academic insight, strategic profiling, international
            perspective and mentorship to develop applications that make a
            difference. From evaluation to ideation, from shortlisting to
            interview prep, from essays to placement, we have the expertise to
            take every student’s future forward.
          </p>

          <p className="agency-intro-point">
            <strong>Our mission:</strong> to elevate each student’s academic
            profile for top institutions in the UK, Europe, and worldwide.
          </p>

          <p className="agency-intro-point">
            <strong>What sets us apart:</strong> an understanding of global
            admissions standards, trusted institutional links, an international
            outlook – and the dedication to turn potential into offers.
          </p>

          <p className="agency-intro-point">
            <strong>Our expertise:</strong> profiling, positioning, placement.
          </p>

          <Link to="/about" className="agency-intro-btn">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="7" y1="7" x2="17" y2="17" />
              <polyline points="17 7 17 17 7 17" />
            </svg>
            <span>Learn more</span>
          </Link>
        </div>
      </div>

      {/* FULL-WIDTH BANNER IMAGE (Acoustic Foam Architecture) */}
      <div className="agency-intro-banner">
        <img
          src="/images/agence-image-1.png"
          alt="Acoustic anechoic pyramid structure - Design & Architecture"
          className="agency-intro-banner-img"
          loading="lazy"
        />
      </div>

      {/* WHAT SETS US APART SECTION */}
      <div className="agency-apart-divider"></div>

      <div className="agency-apart-grid">
        <div className="agency-apart-left">
          <h2 className="agency-apart-eyebrow">WHAT SETS US APART</h2>
        </div>

        <div className="agency-apart-right">
          <h3 className="agency-apart-title">CLARITY, STRUCTURE, IMPACT</h3>
          <p className="agency-apart-lead">
            Stronger communication begins with deeper understanding. In
            industrial, technological and international environments, this relies
            on a rigorous analysis of the challenges, offerings and competitive
            landscape. It requires method, discernment and creativity. This is
            precisely what bb&amp;b delivers.
          </p>

          <Link to="/about" className="agency-apart-btn" aria-label="Learn more about what sets us apart">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              fill="none"
              viewBox="0 0 12 12"
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

      {/* 3 PILLARS / EDITORIAL CARDS */}
      <div className="agency-pillars-grid">
        {/* Card 1: STRUCTURING */}
        <div className="agency-pillar-card">
          <div className="agency-pillar-img-wrap">
            <img
              src="/images/CONSEILLER_1.jpg"
              alt="Structuring"
              className="agency-pillar-img"
              loading="lazy"
            />
          </div>
          <h3 className="agency-pillar-title">STRUCTURING</h3>
          <p className="agency-pillar-desc">
            We clarify the issues, identify value drivers, define relevant strategies and organise ideas to build a solid foundation on which to base your communication.
          </p>
          <Link to="/services" className="agency-pillar-link" aria-label="Learn more about Structuring">
            <svg
              className="agency-pillar-arrow"
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
            <span>Learn more</span>
          </Link>
        </div>

        {/* Card 2: CREATE */}
        <div className="agency-pillar-card">
          <div className="agency-pillar-img-wrap">
            <img
              src="/images/CREER_2.jpg"
              alt="Create"
              className="agency-pillar-img"
              loading="lazy"
            />
          </div>
          <h3 className="agency-pillar-title">CREATE</h3>
          <p className="agency-pillar-desc">
            We develop meaningful concepts, accurate messages and creative expressions that reinforce your brand’s credibility and uniqueness.
          </p>
          <Link to="/services" className="agency-pillar-link" aria-label="Learn more about Create">
            <svg
              className="agency-pillar-arrow"
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
            <span>Learn more</span>
          </Link>
        </div>

        {/* Card 3: EXECUTE */}
        <div className="agency-pillar-card">
          <div className="agency-pillar-img-wrap">
            <img
              src="/images/REALISER_1.jpg"
              alt="Execute"
              className="agency-pillar-img"
              loading="lazy"
            />
          </div>
          <h3 className="agency-pillar-title">EXECUTE</h3>
          <p className="agency-pillar-desc">
            We implement our initiatives with rigour and precision to ensure visibility, impact and measurable results – across all your markets.
          </p>
          <Link to="/services" className="agency-pillar-link" aria-label="Learn more about Execute">
            <svg
              className="agency-pillar-arrow"
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
            <span>Learn more</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
