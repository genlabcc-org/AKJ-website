import React, { useState } from 'react';
import PageHero from '../components/PageHero';
import './Admission.css';

const CLASS_OPTIONS = [
  { group: 'Early Years (Ages 3–6)', options: ['EY1 (Pre-KG)', 'EY2 (LKG)', 'EY3 (UKG)'] },
  { group: 'Cambridge Primary (Ages 5–11)', options: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'] },
  { group: 'Cambridge Lower Secondary (Ages 11–14)', options: ['Grade 6', 'Grade 7', 'Grade 8'] },
  { group: 'Cambridge Upper Secondary / IGCSE (Ages 14–16)', options: ['Grade 9', 'Grade 10'] },
];

const TODAY_ISO = new Date().toISOString().split('T')[0];

export default function Admission() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    appliedClass: '',
    address: '',
    agreed: false,
  });

  const [dobFocused, setDobFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [applicationRef, setApplicationRef] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const now = new Date();
    const refId = `AKJ-ADM-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const existing = JSON.parse(localStorage.getItem('akj_admission_applications') || '[]');
      existing.unshift({
        id: refId,
        ...formData,
        submittedAt: now.toISOString(),
      });
      localStorage.setItem('akj_admission_applications', JSON.stringify(existing));
    } catch {
      // LocalStorage fallback handling
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setApplicationRef(refId);
      setSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      appliedClass: '',
      address: '',
      agreed: false,
    });
    setDobFocused(false);
    setSubmitted(false);
    setApplicationRef('');
  };

  return (
    <div className="admission-page">
      {/* HERO SECTION (Same placement & style as Home page) */}
      <PageHero
        title={
          <>
            <span className="site-hero-mainline">Start Your Journey.</span>
            <span className="site-hero-subline">Student Application Form.</span>
          </>
        }
        subtitle="Admissions 2026–2027 . EY1 to Grade 10"
      />

      <section className="admission-form-section">
        <div className="admission-form-container">
          {submitted ? (
            <div className="admission-form-success">
              <span className="admission-success-badge">
                ✓ APPLICATION SUBMITTED · REF: {applicationRef}
              </span>
              <h2 className="admission-success-heading">Thank You for Applying</h2>
              <p className="admission-success-text">
                We have received the admission application for{' '}
                <strong>
                  {formData.firstName} {formData.lastName}
                </strong>
                {formData.appliedClass ? ` (${formData.appliedClass})` : ''}. Our admissions team at
                AKJ International School will review your details and get in touch with you shortly.
              </p>

              <div className="admission-summary-grid">
                <div className="admission-summary-item">
                  <span className="admission-summary-label">APPLICANT NAME</span>
                  <span className="admission-summary-val">
                    {formData.firstName} {formData.lastName}
                  </span>
                </div>
                <div className="admission-summary-item">
                  <span className="admission-summary-label">APPLYING CLASS / GRADE</span>
                  <span className="admission-summary-val">
                    {formData.appliedClass || 'Not Specified'}
                  </span>
                </div>
                <div className="admission-summary-item">
                  <span className="admission-summary-label">DATE OF BIRTH</span>
                  <span className="admission-summary-val">{formData.dateOfBirth}</span>
                </div>
                <div className="admission-summary-item">
                  <span className="admission-summary-label">CONTACT</span>
                  <span className="admission-summary-val">
                    {formData.phone} · {formData.email}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="admission-submit-btn"
                style={{ marginTop: '24px', width: 'auto', padding: '12px 28px' }}
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="admission-form" noValidate={false}>
              <div className="admission-form-grid">
                {/* ROW 1: FIRST NAME & LAST NAME */}
                <div className="admission-field-col">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Student First Name"
                    className="admission-input"
                    autoComplete="given-name"
                  />
                </div>

                <div className="admission-field-col">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Student Last Name"
                    className="admission-input"
                    autoComplete="family-name"
                  />
                </div>

                {/* ROW 2: EMAIL & PHONE */}
                <div className="admission-field-col">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Parent / Guardian Mail"
                    className="admission-input"
                    autoComplete="email"
                  />
                </div>

                <div className="admission-field-col">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                    className="admission-input"
                    autoComplete="tel"
                  />
                </div>

                {/* ROW 3: DATE OF BIRTH & APPLYING CLASS */}
                <div className="admission-field-col">
                  <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type={dobFocused || formData.dateOfBirth ? 'date' : 'text'}
                    required
                    placeholder="Date of Birth"
                    value={formData.dateOfBirth}
                    onFocus={() => setDobFocused(true)}
                    onBlur={() => setDobFocused(false)}
                    onChange={handleChange}
                    max={TODAY_ISO}
                    className="admission-input admission-date-input"
                  />
                </div>

                <div className="admission-field-col">
                  <select
                    id="appliedClass"
                    name="appliedClass"
                    required
                    value={formData.appliedClass}
                    onChange={handleChange}
                    className="admission-input admission-select"
                  >
                    <option value="" disabled>
                      Select Applying Class / Grade
                    </option>
                    {CLASS_OPTIONS.map((grp) => (
                      <optgroup key={grp.group} label={grp.group}>
                        {grp.options.map((cls) => (
                          <option key={cls} value={cls}>
                            {cls}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                {/* ROW 4: RESIDENTIAL ADDRESS (Left column, matching Contact form layout) */}
                <div className="admission-field-col admission-address-col">
                  <textarea
                    id="address"
                    name="address"
                    required
                    rows="5"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Residential Address (Door / Street, Area, City, Pincode)"
                    className="admission-input admission-textarea"
                    autoComplete="street-address"
                  />
                </div>

                <div className="admission-field-col admission-empty-col" aria-hidden="true" />
              </div>

              {/* PRIVACY CONSENT CHECKBOX */}
              <div className="admission-consent-row">
                <input
                  type="checkbox"
                  id="admission-agree"
                  name="agreed"
                  required
                  checked={formData.agreed}
                  onChange={handleChange}
                  className="admission-checkbox"
                />
                <label htmlFor="admission-agree" className="admission-consent-label">
                  I agree that the student and guardian information provided may be collected and
                  processed by AKJ International School for Cambridge admission evaluation and
                  enrollment communication.
                </label>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="admission-submit-row">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="admission-submit-btn"
                >
                  <span>{isSubmitting ? 'SUBMITTING...' : 'SUBMIT APPLICATION'}</span>
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
    </div>
  );
}
