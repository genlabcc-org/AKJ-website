import React from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import './Services.css';
import './Home.css';

export default function Services() {
  return (
    <div className="page-container services-page">
      <PageHero
        title={
          <>
            Admissions Consulting<br />
            &amp; Placement.
          </>
        }
        subtitle="Tailored roadmaps crafted by senior educational consultants with proven global access"
      />

      {/* Main Services Showcase */}
      <section className="section">
        <div className="container">
          <div className="services-list">
            {/* University Placement */}
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

                <Link to="/contact" className="btn-primary">
                  Inquire About University Placement
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

            {/* Elite School Access */}
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

                <Link to="/contact" className="btn-primary">
                  Inquire About Boarding Schools
                </Link>
              </div>
            </div>
          </div>

          {/* Specialized Modules */}
          <div style={{ marginTop: '80px', textAlign: 'center' }}>
            <span className="badge-tag">Specialized Programs</span>
            <h2 className="section-title">Additional Bespoke Offerings</h2>
          </div>

          <div className="services-grid-page">
            <div className="service-box-mini">
              <h3>Oxbridge & Ivy League Intensive</h3>
              <p>
                Targeted preparation for Oxford, Cambridge, and Ivy League applications including admissions test drills (TSA, UCAT, LNAT), academic portfolio compilation, and collegiate interview simulations.
              </p>
              <Link to="/contact" className="blog-link">Learn More →</Link>
            </div>

            <div className="service-box-mini">
              <h3>Standardized Test Strategy</h3>
              <p>
                One-on-one diagnostic tutoring for SAT, ACT, IELTS, TOEFL, ISEB Common Pre-Test, and UKiset exams led by experienced subject tutors with score-improvement guarantees.
              </p>
              <Link to="/contact" className="blog-link">Learn More →</Link>
            </div>

            <div className="service-box-mini">
              <h3>Scholarship & Financial Aid Consultation</h3>
              <p>
                Strategic targeting of merit scholarships, fee bursaries, and institutional endowments to significantly lower private tuition costs for outstanding candidates.
              </p>
              <Link to="/contact" className="blog-link">Learn More →</Link>
            </div>

            <div className="service-box-mini">
              <h3>Relocation & Educational Guardianship</h3>
              <p>
                Complete logistical peace of mind for international families: visa handling, accredited guardianship matching, and campus host accommodation arrangement.
              </p>
              <Link to="/contact" className="blog-link">Learn More →</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
