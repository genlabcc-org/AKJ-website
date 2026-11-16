import React, { useState } from 'react';
import './Contact.css';
import '../Home/Home.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    agreed: false
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        agreed: false
      });
    }, 4000);
  };

  return (
    <div className="page-container contact-page">
      <section className="page-hero">
        <div className="container">
          <span className="badge-tag">Get in Touch</span>
          <h1 className="page-hero-title">Start Your Admissions Journey</h1>
          <p className="page-hero-subtitle">
            Schedule a diagnostic consultation with an Acadly senior advisor to discuss boarding school or university placement options.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-grid-page">
            {/* Form */}
            <div className="contact-form-card">
              <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '20px' }}>Send us a message</h2>
              
              {submitted ? (
                <div style={{ background: '#e6f4ea', color: '#137333', padding: '24px', borderRadius: '8px', fontSize: '15px' }}>
                  ✓ Thank you! Your message has been received. An educational advisor will reach out to you within 24 hours.
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. John Doe"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label>Email Address *</label>
                      <input
                        type="email"
                        className="form-input"
                        placeholder="myemail@email.com"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        className="form-input"
                        placeholder="+40 777 666 555"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Subject</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. University Placement Consultation"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Message *</label>
                    <textarea
                      className="form-textarea"
                      placeholder="Tell us about the student's current grade, target schools, and aspirations..."
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <div className="form-check">
                    <input
                      type="checkbox"
                      id="agreement"
                      required
                      checked={formData.agreed}
                      onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                    />
                    <label htmlFor="agreement">
                      I agree to the processing of my contact information in accordance with Acadly's Privacy Policy.
                    </label>
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="contact-info-card">
              <div className="office-item">
                <h4>London Headquarters (UK)</h4>
                <p>Hemingway Bvd. 22, London City, UK</p>
                <p style={{ marginTop: '4px' }}><strong>Email:</strong> <a href="mailto:myemail@email.com">myemail@email.com</a></p>
                <p><strong>Phone:</strong> <a href="tel:+40777666555">+40 777 666 555</a></p>
              </div>

              <div className="office-item">
                <h4>Germany Regional Office</h4>
                <p>Maximilianstraße 35, 80539 Munich, Germany</p>
                <p style={{ marginTop: '4px' }}>Hours: Monday – Friday, 9:00 AM – 6:00 PM CET</p>
              </div>

              <div className="office-item">
                <h4>Virtual Consultations Worldwide</h4>
                <p>
                  We conduct high-definition virtual advisory calls over Zoom and Google Meet for families residing anywhere in Europe, Asia, and the Americas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
