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
    </section>
  );
}
