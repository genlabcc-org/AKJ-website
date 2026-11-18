import React from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import './About.css';

export default function About() {
  return (
    <div className="page-container about-page">
      <PageHero
        title={
          <>
            Shaping Global<br />
            Educational Journeys.
          </>
        }
        subtitle="From premier European academies to Ivy League universities, tailored advisory for exceptional admissions"
      />

      {/* Main Story */}
      <section className="section">
        <div className="container">
          <div className="about-detailed-grid">
            <div>
              <span className="badge-tag">Our Story & Mission</span>
              <h2 className="section-title">Personalized Consulting with Global Reach</h2>
              <p style={{ marginTop: '20px', fontSize: '16px', lineHeight: 1.7, color: '#444' }}>
                Founded with a mission to demystify complex international admissions, Acadly connects ambitious students with prestigious institutions across the UK, Europe, and North America. Based in Germany with offices in London, we blend localized knowledge with global placement expertise.
              </p>
              <p style={{ marginTop: '16px', fontSize: '16px', lineHeight: 1.7, color: '#444' }}>
                We believe that every candidate possesses a distinctive narrative. Rather than relying on generic application templates, we craft bespoke roadmaps tailored to individual academic profiles, extracurricular achievements, and career aspirations.
              </p>
              <div style={{ marginTop: '32px' }}>
                <Link to="/contact" className="btn-primary">
                  Book an Advisory Session
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
              </div>
            </div>

            <div className="about-images-wrapper">
              <img
                src="/images/about-campus.jpg"
                alt="Students graduating"
                className="about-main-img"
              />
              <div className="about-secondary-img-wrapper">
                <img
                  src="/images/about-interview.png"
                  alt="Student advisory session"
                  className="about-secondary-img"
                />
              </div>
            </div>
          </div>

          {/* Core Pillars */}
          <div style={{ margin: '60px 0 20px', textAlign: 'center' }}>
            <span className="badge-tag">Our Methodology</span>
            <h2 className="section-title">The Three Pillars of Our Placement Success</h2>
          </div>

          <div className="pillar-grid">
            <div className="pillar-card">
              <div className="pillar-icon">🎯</div>
              <h3>Strategic Profiling</h3>
              <p>
                In-depth assessment of transcripts, standardized test potential, and unique personal interests to pinpoint institutions where the candidate will flourish academically and personally.
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon">✍️</div>
              <h3>Narrative & Essay Mastery</h3>
              <p>
                Bespoke coaching for personal statements, supplemental essays, and portfolios that capture admissions committees with authentic voice and intellectual curiosity.
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon">🤝</div>
              <h3>White-Glove Mentorship</h3>
              <p>
                From initial diagnostic consultations to mock interviews and post-acceptance visa logistics, our dedicated consultants stand by your family every step of the journey.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
