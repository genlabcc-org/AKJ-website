import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Pricing.css';
import '../Home/Home.css';

export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  return (
    <div className="page-container pricing-page">
      <section className="page-hero">
        <div className="container">
          <span className="badge-tag">Investment in Future</span>
          <h1 className="page-hero-title">Transparent Educational Pricing</h1>
          <p className="page-hero-subtitle">
            Choose the level of consulting guidance that matches your family’s application timeline and admission goals.
          </p>

          <div className="billing-toggle-wrapper" style={{ marginTop: '28px' }}>
            <div className="billing-toggle">
              <button
                type="button"
                className={billingPeriod === 'monthly' ? 'active' : ''}
                onClick={() => setBillingPeriod('monthly')}
              >
                Monthly
              </button>
              <button
                type="button"
                className={billingPeriod === 'yearly' ? 'active' : ''}
                onClick={() => setBillingPeriod('yearly')}
              >
                Yearly <span className="discount-pill">- Save 20%</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="section">
        <div className="container">
          <div className="pricing-grid">
            {/* Classic */}
            <div className="pricing-card">
              <img
                src="/images/pricing-classic.png"
                alt="Classic Package"
                className="pricing-icon"
              />
              <h3 className="plan-name">Classic Package</h3>
              <p className="plan-tagline">Structured guidance for confident families</p>
              
              <div className="plan-price-wrapper">
                <div className="plan-price">
                  {billingPeriod === 'monthly' ? '199 lei' : '159 lei'}
                  <span className="plan-period">/{billingPeriod === 'monthly' ? 'month' : 'month (billed yearly)'}</span>
                </div>
                <div className="plan-target">Ideal for Families who prefer partial support</div>
              </div>

              <ul className="plan-features-list">
                <li className="plan-feature-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Profile Evaluation
                </li>
                <li className="plan-feature-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  8-10 School Matches
                </li>
                <li className="plan-feature-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Interview Prep (1 session)
                </li>
                <li className="plan-feature-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Visa & Relocation Tips
                </li>
              </ul>

              <Link to="/contact" className="pricing-btn outline">
                Purchase this Plan
              </Link>
            </div>

            {/* Premium */}
            <div className="pricing-card featured">
              <div className="featured-badge">Most Popular</div>
              <img
                src="/images/pricing-premium.png"
                alt="Premium Package"
                className="pricing-icon"
              />
              <h3 className="plan-name">Premium Package</h3>
              <p className="plan-tagline">End-to-end support for top-tier schools</p>
              
              <div className="plan-price-wrapper">
                <div className="plan-price">
                  {billingPeriod === 'monthly' ? '350 lei' : '280 lei'}
                  <span className="plan-period">/{billingPeriod === 'monthly' ? 'month' : 'month (billed yearly)'}</span>
                </div>
                <div className="plan-target">Ideal for Competitive applicants</div>
              </div>

              <ul className="plan-features-list">
                <li className="plan-feature-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Insider School Access
                </li>
                <li className="plan-feature-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  2 Mock Interviews
                </li>
                <li className="plan-feature-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Exam Strategy (ISEB/UKiset)
                </li>
                <li className="plan-feature-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Priority Consultant Access
                </li>
              </ul>

              <Link to="/contact" className="pricing-btn primary">
                Purchase this Plan
              </Link>
            </div>

            {/* Elite */}
            <div className="pricing-card">
              <img
                src="/images/pricing-elite.png"
                alt="Elite Package"
                className="pricing-icon"
              />
              <h3 className="plan-name">Elite Package</h3>
              <p className="plan-tagline">White-glove, VIP admissions experience</p>
              
              <div className="plan-price-wrapper">
                <div className="plan-price">
                  Consultation
                  <span className="plan-period"></span>
                </div>
                <div className="plan-target">Ideal for Exceptional candidates</div>
              </div>

              <ul className="plan-features-list">
                <li className="plan-feature-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Multi-School Roadmap (UK/US)
                </li>
                <li className="plan-feature-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Headmaster Meetings
                </li>
                <li className="plan-feature-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Full Essay & Portfolio Editing
                </li>
                <li className="plan-feature-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Post-Acceptance Mentorship
                </li>
              </ul>

              <Link to="/contact" className="pricing-btn outline">
                Book a Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
