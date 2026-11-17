import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LogosTicker from '../components/LogosTicker';
import { supabase } from '../supabase';
import './Home.css';

export default function Home() {
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [openFaq, setOpenFaq] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [recentBlogs, setRecentBlogs] = useState([]);

  useEffect(() => {
    if (!supabase) return;
    let active = true;

    const loadRecentBlogs = async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'Published')
        .order('id', { ascending: false })
        .limit(3);

      if (active && !error && data) {
        setRecentBlogs(data);
      }
    };

    loadRecentBlogs();
    return () => {
      active = false;
    };
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubmitted(true);
      setTimeout(() => {
        setNewsletterEmail('');
      }, 3000);
    }
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? -1 : index);
  };

  const faqItems = [
    {
      q: 'How early should students begin university application preparation?',
      a: 'For the best results, students should start planning at least 12–18 months before the application deadlines. This allows sufficient time for research, standardized test preparation (SAT/ACT, IELTS/TOEFL), drafting strong essays, securing recommendation letters, and ensuring all requirements are met without last-minute stress.'
    },
    {
      q: 'What is University Placement?',
      a: 'University Placement is our comprehensive advisory service that assists students in researching, applying to, and gaining acceptance at accredited universities worldwide that align with their academic and career aspirations.'
    },
    {
      q: 'How does your University Placement service work?',
      a: 'We begin with an in-depth profile evaluation to assess academic achievements, extracurriculars, and goals. We then craft a strategic school list, guide essay writing and portfolio development, coordinate applications, and prepare students for interviews.'
    },
    {
      q: 'Do you guarantee admission to top universities?',
      a: 'While admissions decisions rest solely with university committees, our track record exceeds 95% placement into students’ top-choice institutions due to our rigorous strategy and personalized approach.'
    },
    {
      q: 'What is Boarding School Placement?',
      a: 'Our Boarding School Placement guides students into premier preparatory boarding schools across the UK, Switzerland, and North America, handling entrance testing, school visits, and guardian coordination.'
    },
    {
      q: 'At what age should a student start preparing for boarding school admission?',
      a: 'Most families begin between ages 10 to 13 (years 7-9 entry). Starting 1 to 2 years ahead ensures optimal preparation for assessments like ISEB Common Pre-Tests and UKiset.'
    },
    {
      q: 'Can you help with scholarships for boarding schools or universities?',
      a: 'Yes, we identify merit-based and need-based scholarship opportunities and guide students in creating outstanding scholarship portfolios and preparing for scholarship exams.'
    },
    {
      q: 'What makes your placement services different from others?',
      a: 'Our personalized one-on-one mentorship, deep institutional relationships with admissions directors across the UK, US, and Europe, and end-to-end guidance from first call to campus arrival.'
    }
  ];

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section id="hero" className="hero-section">
        <div className="hero-bg-wrapper">
          <img
            src="/images/nhehs-hero.jpg"
            alt="Welcome to Notting Hill & Ealing Junior School"
            className="hero-bg-image"
          />
          <div className="hero-overlay"></div>
        </div>

        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to Notting<br />
            Hill &amp; Ealing Junior<br />
            School
          </h1>
        </div>
      </section>

      {/* LOGOS TICKER */}
      <LogosTicker />

      {/* ABOUT US SECTION */}
      <section id="about" className="section about-section">
        <div className="container">
          <div className="about-grid">
            <div className="about-images-wrapper">
              <img
                src="/images/about-campus.jpg"
                alt="Students in graduation ceremony"
                className="about-main-img"
              />
              <div className="about-secondary-img-wrapper">
                <img
                  src="/images/about-interview.png"
                  alt="Educational consultant meeting student"
                  className="about-secondary-img"
                />
              </div>
            </div>

            <div className="about-content">
              <div>
                <span className="badge-tag">Get to Know Us</span>
                <h2 className="section-title">From first spark to final stop</h2>
              </div>
              <p>
                We offer personalized admissions consulting for ambitious students applying to top universities in Spain and beyond. Based in Germany with a global reach, we work closely with families to develop strategic, individualized application plans that showcase each student’s strengths, goals, and unique story.
              </p>
              <p>
                Whether targeting prestigious Spanish institutions or other renowned universities across Europe, our services cover every step of the admissions process—from academic profile evaluation and interview preparation to personal statement guidance and university selection. Each application plan is fully customized, ensuring dedicated support and expert advice at every stage.
              </p>
              <p style={{ fontWeight: 600, color: '#1c1c1c' }}>
                We don’t just help students gain admission—we empower them to stand out and thrive.
              </p>
              <div style={{ marginTop: '8px' }}>
                <Link to="/about" className="btn-primary">
                  More about Us
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">95<span>+</span></div>
              <div className="stat-label">Brands Transformed</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">3.0<span>k</span></div>
              <div className="stat-label">Satisfied clients</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">98<span>%</span></div>
              <div className="stat-label">Client Retention Rate</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">15<span>+</span></div>
              <div className="stat-label">Awards & Recognitions</div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="section services-section">
        <div className="container">
          <div className="section-heading-wrapper" style={{ textAlign: 'center' }}>
            <span className="badge-tag">Services that We Offer</span>
            <h2 className="section-title">End-to-End Support</h2>
          </div>

          <div className="services-list">
            {/* Service 1: University Placement */}
            <div className="service-card">
              <div>
                <h3 className="service-title">University Placement</h3>
                
                <div className="service-features-grid">
                  <div className="service-feature-item">
                    <div className="feature-check-icon">✓</div>
                    <div className="feature-content">
                      <h4>Expert Guidance</h4>
                      <p>Tailored strategies for success</p>
                    </div>
                  </div>
                  <div className="service-feature-item">
                    <div className="feature-check-icon">✓</div>
                    <div className="feature-content">
                      <h4>Top Uni Links</h4>
                      <p>Strong ties to elite UK/US schools</p>
                    </div>
                  </div>
                  <div className="service-feature-item">
                    <div className="feature-check-icon">✓</div>
                    <div className="feature-content">
                      <h4>Personal Statements</h4>
                      <p>Compelling & authentic essays</p>
                    </div>
                  </div>
                  <div className="service-feature-item">
                    <div className="feature-check-icon">✓</div>
                    <div className="feature-content">
                      <h4>Course Selection</h4>
                      <p>Perfect fit for your goals</p>
                    </div>
                  </div>
                  <div className="service-feature-item">
                    <div className="feature-check-icon">✓</div>
                    <div className="feature-content">
                      <h4>UCAS Support</h4>
                      <p>Flawless application process</p>
                    </div>
                  </div>
                  <div className="service-feature-item">
                    <div className="feature-check-icon">✓</div>
                    <div className="feature-content">
                      <h4>School Shortlisting</h4>
                      <p>Smart, strategic choices</p>
                    </div>
                  </div>
                  <div className="service-feature-item">
                    <div className="feature-check-icon">✓</div>
                    <div className="feature-content">
                      <h4>Exam Tutoring</h4>
                      <p>Boost your grades confidently</p>
                    </div>
                  </div>
                  <div className="service-feature-item">
                    <div className="feature-check-icon">✓</div>
                    <div className="feature-content">
                      <h4>Admissions Insight</h4>
                      <p>Behind-the-scenes expertise</p>
                    </div>
                  </div>
                </div>

                <div className="approach-box">
                  <h5>Our Approach</h5>
                  <p>
                    We partner with leading UK/US universities to craft perfectly tailored applications—from course selection to exam prep. Let’s discuss your future!
                  </p>
                </div>

                <Link to="/services" className="btn-primary" style={{ padding: '12px 24px', fontSize: '14px' }}>
                  Read More
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
              </div>

              <div className="service-video-container">
                <video
                  className="service-video"
                  autoPlay
                  loop
                  muted
                  playsInline
                  src="/service-1.mp4"
                />
              </div>
            </div>

            {/* Service 2: Elite School Access */}
            <div className="service-card">
              <div className="service-video-container">
                <video
                  className="service-video"
                  autoPlay
                  loop
                  muted
                  playsInline
                  src="/service-2.mp4"
                />
              </div>

              <div>
                <h3 className="service-title">Elite School Access</h3>
                
                <div className="service-features-grid">
                  <div className="service-feature-item">
                    <div className="feature-check-icon">✓</div>
                    <div className="feature-content">
                      <h4>Elite School Access</h4>
                      <p>Top UK & global institutions</p>
                    </div>
                  </div>
                  <div className="service-feature-item">
                    <div className="feature-check-icon">✓</div>
                    <div className="feature-content">
                      <h4>Tailored Matching</h4>
                      <p>Find your perfect fit</p>
                    </div>
                  </div>
                  <div className="service-feature-item">
                    <div className="feature-check-icon">✓</div>
                    <div className="feature-content">
                      <h4>Application Mastery</h4>
                      <p>Essays that stand out</p>
                    </div>
                  </div>
                  <div className="service-feature-item">
                    <div className="feature-check-icon">✓</div>
                    <div className="feature-content">
                      <h4>Interview Prep</h4>
                      <p>Confidence & polish</p>
                    </div>
                  </div>
                  <div className="service-feature-item">
                    <div className="feature-check-icon">✓</div>
                    <div className="feature-content">
                      <h4>Academic Profiling</h4>
                      <p>Highlight strengths</p>
                    </div>
                  </div>
                  <div className="service-feature-item">
                    <div className="feature-check-icon">✓</div>
                    <div className="feature-content">
                      <h4>Admissions Strategy</h4>
                      <p>Step-by-step guidance</p>
                    </div>
                  </div>
                  <div className="service-feature-item">
                    <div className="feature-check-icon">✓</div>
                    <div className="feature-content">
                      <h4>Boarding Insight</h4>
                      <p>Life & culture prep</p>
                    </div>
                  </div>
                  <div className="service-feature-item">
                    <div className="feature-check-icon">✓</div>
                    <div className="feature-content">
                      <h4>Scholarship Aid</h4>
                      <p>Maximize opportunities</p>
                    </div>
                  </div>
                </div>

                <div className="approach-box">
                  <h5>Our Approach</h5>
                  <p>
                    We specialize in UK & international boarding schools, ensuring your child thrives academically and socially. Let’s start their journey!
                  </p>
                </div>

                <Link to="/services" className="btn-primary" style={{ padding: '12px 24px', fontSize: '14px' }}>
                  Read More
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          <div className="services-cta-wrapper">
            <Link to="/services" className="btn-secondary">
              View all services
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section id="testimonials" className="section testimonials-section">
        <div className="container">
          <div className="section-heading-wrapper" style={{ textAlign: 'center' }}>
            <span className="badge-tag">Words form our Clients</span>
            <h2 className="section-title">Don’t Just Take Our Word for It—See What Our Students Say!</h2>
            <p className="section-desc" style={{ margin: '12px auto 0' }}>Clients Reviews.</p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div>
                <div className="testimonial-stars">
                  {'★'.repeat(5)}
                </div>
                <p className="testimonial-quote">
                  “Thank you, I got into the university I wanted!”
                </p>
              </div>
              <div className="testimonial-author">
                <img
                  src="/images/testimonial-1.jpg"
                  alt="Haim Georgia"
                  className="testimonial-avatar"
                />
                <div>
                  <div className="author-name">Haim Georgia</div>
                  <div className="author-role">Student</div>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div>
                <div className="testimonial-stars">
                  {'★'.repeat(5)}
                </div>
                <p className="testimonial-quote">
                  “The support and information I received helped me pass the entrance exams.”
                </p>
              </div>
              <div className="testimonial-author">
                <img
                  src="/images/testimonial-2.jpg"
                  alt="David Esenbau"
                  className="testimonial-avatar"
                />
                <div>
                  <div className="author-name">David Esenbau</div>
                  <div className="author-role">Passionate about technology</div>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div>
                <div className="testimonial-stars">
                  {'★'.repeat(5)}
                </div>
                <p className="testimonial-quote">
                  “They simplified the school enrollment process!”
                </p>
              </div>
              <div className="testimonial-author">
                <img
                  src="/images/testimonial-3.jpg"
                  alt="Elena Smith"
                  className="testimonial-avatar"
                />
                <div>
                  <div className="author-name">Elena Smith</div>
                  <div className="author-role">Student Munich</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/testimonials" className="btn-secondary">
              Read full stories
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* PRICING PACKAGES */}
      <section id="pricing" className="section pricing-section">
        <div className="container">
          <div className="pricing-header-center">
            <span className="badge-tag">Pricing Packages</span>
            <h2 className="section-title">Explore Pricing for University</h2>
            
            <div className="billing-toggle-wrapper">
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

          <div className="pricing-grid">
            <div className="pricing-card">
              <img
                src="/images/pricing-classic.png"
                alt="Classic Package Icon"
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

              <Link to="/pricing" className="pricing-btn outline">
                Purchase this Plan
              </Link>
            </div>

            <div className="pricing-card featured">
              <div className="featured-badge">Most Popular</div>
              <img
                src="/images/pricing-premium.png"
                alt="Premium Package Icon"
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

              <Link to="/pricing" className="pricing-btn primary">
                Purchase this Plan
              </Link>
            </div>

            <div className="pricing-card">
              <img
                src="/images/pricing-elite.png"
                alt="Elite Package Icon"
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

              <Link to="/pricing" className="pricing-btn outline">
                Book a Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="section faq-section">
        <div className="container">
          <div className="faq-layout">
            <div className="faq-sidebar">
              <span className="badge-tag">Questions &amp; Answers</span>
              <h2 className="section-title">FAQ</h2>
              <p className="section-desc">
                Here’s everything you need to know about GoAcademy, from features to getting started.
              </p>
              <div style={{ marginTop: '20px' }}>
                <p style={{ fontSize: '14px', color: '#6e6e6e' }}>
                  Got any specific questions?{' '}
                  <Link to="/contact" style={{ color: '#0099ff', fontWeight: 600, textDecoration: 'underline' }}>
                    Contact Us
                  </Link>
                </p>
              </div>
            </div>

            <div className="faq-list">
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className={`faq-item ${openFaq === index ? 'open' : ''}`}
                >
                  <button
                    type="button"
                    className="faq-question-btn"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{item.q}</span>
                    <span className="faq-toggle-icon">+</span>
                  </button>
                  {openFaq === index && (
                    <div className="faq-answer">
                      <p>{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BLOG / EDUCATION ARTICLES */}
      <section id="blog" className="section blog-section">
        <div className="container">
          <div className="section-heading-wrapper" style={{ textAlign: 'center' }}>
            <span className="badge-tag">Education Articles</span>
            <h2 className="section-title">Real World Reviews</h2>
          </div>

          {recentBlogs.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--color-muted)', marginBottom: '32px' }}>
              No articles published yet.
            </p>
          ) : (
            <div className="blog-grid">
              {recentBlogs.map((art) => (
                <article key={art.id} className="blog-card">
                  {art.thumb && (
                    <div className="blog-img-wrapper">
                      <img src={art.thumb} alt={art.title} className="blog-img" />
                    </div>
                  )}
                  <div className="blog-body">
                    <div className="blog-meta">
                      {art.category && <span className="blog-tag">{art.category}</span>}
                      <span>{art.publish_date}</span>
                    </div>
                    <h3 className="blog-title">{art.title}</h3>
                    {art.content && (
                      <p className="blog-excerpt">
                        {art.content.length > 160
                          ? `${art.content.slice(0, 160)}...`
                          : art.content}
                      </p>
                    )}
                    <Link to="/blog" className="blog-link">
                      Read article →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center' }}>
            <Link to="/blog" className="btn-secondary">
              Read all articles
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* SUBSCRIBE TO NEWSLETTER */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-card">
            <div
              className="newsletter-bg-overlay"
              style={{ backgroundImage: 'url(/images/newsletter-bg.jpg)' }}
            ></div>

            <div className="newsletter-content">
              <h2 className="newsletter-title">Subscribe to Newsletter</h2>
              <p className="newsletter-desc">
                Subscribe today to receive personalized financial tips, news, and updates delivered directly to your email.
              </p>

              <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                <input
                  type="email"
                  className="newsletter-input"
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                />
                <button type="submit" className="newsletter-btn">
                  Subscribe
                </button>
              </form>

              {newsletterSubmitted && (
                <div className="newsletter-success">
                  ✓ Thank you for subscribing! We'll keep you updated.
                </div>
              )}
            </div>

            <div style={{ position: 'relative', zIndex: 2, flexShrink: 0 }}>
              <img
                src="/images/newsletter-person.png"
                alt="Student consultation"
                style={{ width: '220px', height: 'auto', borderRadius: '12px' }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
