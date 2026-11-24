import React, { useState } from 'react';
import PageHero from '../components/PageHero';
import './Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    society: '',
    message: '',
    agreed: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        society: '',
        message: '',
        agreed: false,
      });
    }, 600);
  };

  return (
    <div className="bbb-contact-page">
      {/* HERO SECTION (Same placement & style as Home page) */}
      <PageHero
        title={
          <>
            <span className="site-hero-mainline">Cambridge Journey.</span>
            <span className="site-hero-subline">Building Minds Beyond Borders.</span>
          </>
        }
        subtitle="A Cambridge School in Thuckalay . EY1 to Grade 10"
      />

      {/* 1. OUR FORM / WRITE US SECTION */}
      <section className="bbb-form-section">
        <div className="bbb-form-container">
          {submitted ? (
            <div className="bbb-form-success">
              <span className="bbb-success-badge">✓ MESSAGE SENT</span>
              <h2 className="bbb-success-heading">Thank You for Writing to Us</h2>
              <p className="bbb-success-text">
                Your message has been received. Our admissions team at AKJ International School will get in touch with you shortly.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="bbb-submit-btn"
                style={{ marginTop: '20px', width: 'auto', padding: '12px 28px' }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bbb-form" noValidate={false}>
              <div className="bbb-form-grid">
                {/* ROW 1 */}
                <div className="bbb-field-col">
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="First name / Last names"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bbb-input"
                  />
                </div>

                <div className="bbb-field-col">
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Mail"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bbb-input"
                  />
                </div>

                {/* ROW 2 */}
                <div className="bbb-field-col">
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bbb-input"
                  />
                </div>

                <div className="bbb-field-col">
                  <select
                    name="society"
                    required
                    value={formData.society}
                    onChange={(e) => setFormData({ ...formData, society: e.target.value })}
                    className="bbb-input bbb-select"
                  >
                    <option value="" disabled>
                      Select Purpose / Inquiry
                    </option>
                    <option value="Direct Admission Portal">Direct Admission Portal</option>
                    <option value="Curriculum Overview Requests">Curriculum Overview Requests</option>
                    <option value="Campus Tour Booking">Campus Tour Booking</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                {/* ROW 3: MESSAGE (Takes left column, matching reference layout) */}
                <div className="bbb-field-col bbb-message-col">
                  <textarea
                    name="message"
                    required
                    placeholder="Message"
                    rows="5"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="bbb-input bbb-textarea"
                  />
                </div>

                <div className="bbb-field-col bbb-empty-col" aria-hidden="true">
                  {/* Empty right column on desktop as shown in reference design */}
                </div>
              </div>

              {/* PRIVACY CONSENT CHECKBOX */}
              <div className="bbb-consent-row">
                <input
                  type="checkbox"
                  id="bbb-agree"
                  required
                  checked={formData.agreed}
                  onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                  className="bbb-checkbox"
                />
                <label htmlFor="bbb-agree" className="bbb-consent-label">
                  I agree that my personal data may be collected and processed by AKJ International School in order to process my request. To find out more about our privacy policy, please consult our legal notice.
                </label>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="bbb-submit-row">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bbb-submit-btn"
                >
                  <span>{isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* 2. CAMPUS LOCATION & GOOGLE MAP SECTION */}
      <section className="bbb-campus-section">
        <div className="bbb-form-container">
          <div className="bbb-form-header">
            <span className="bbb-form-kicker">OUR CAMPUS</span>
            <h2 className="bbb-form-title">VISIT US</h2>
          </div>

          <div className="bbb-campus-grid">
            {/* Campus Contact Details */}
            <div className="bbb-campus-details">
              <div className="bbb-campus-item">
                <span className="bbb-campus-label">ADDRESS</span>
                <a
                  href="https://www.google.com/maps/place/AKJ+International+School/@8.2332383,77.3384014,871m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3b04f9e24bc806ed:0x20591399153dd220!8m2!3d8.2332383!4d77.3409817!16s%2Fg%2F11zcjfkhv1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bbb-campus-link"
                >
                  Tirunelveli Highway, opposite Iyangar Bakery,<br />
                  Kumaracoil, Tamil Nadu 629175
                </a>
              </div>

              <div className="bbb-campus-item">
                <span className="bbb-campus-label">PHONE</span>
                <a href="tel:+918072590214" className="bbb-campus-link">
                  +91 8072590214
                </a>
              </div>

              <div className="bbb-campus-item">
                <span className="bbb-campus-label">EMAIL</span>
                <a href="mailto:info@akjinternationalschool.org" className="bbb-campus-link">
                  info@akjinternationalschool.org
                </a>
              </div>

              <div className="bbb-campus-item">
                <span className="bbb-campus-label">VISITING HOURS</span>
                <span className="bbb-campus-text">Monday – Saturday: 8:30 AM – 4:00 PM</span>
              </div>

              <a
                href="https://www.google.com/maps/place/AKJ+International+School/@8.2332383,77.3384014,871m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3b04f9e24bc806ed:0x20591399153dd220!8m2!3d8.2332383!4d77.3409817!16s%2Fg%2F11zcjfkhv1"
                target="_blank"
                rel="noopener noreferrer"
                className="bbb-directions-btn"
              >
                <span>Get Directions on Google Maps</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polygon points="3 11 22 2 13 21 11 13 3 11" />
                </svg>
              </a>
            </div>

            {/* Embedded Google Map */}
            <div className="bbb-campus-map-box">
              <iframe
                title="AKJ International School Campus Location"
                src="https://maps.google.com/maps?q=AKJ+International+School&ll=8.2332383,77.3409817&z=16&t=m&hl=en&output=embed"
                width="100%"
                height="320"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="bbb-map-iframe"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
