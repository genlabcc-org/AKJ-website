import React, { useState } from 'react';
import PageHero from '../components/PageHero';
import './Admission.css';

const CLASS_OPTIONS = [
  { group: 'Early Years (Ages 3–6)', options: ['EY1 (Pre-KG)', 'EY2 (LKG)', 'EY3 (UKG)'] },
  { group: 'Cambridge Primary (Ages 5–11)', options: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'] },
  { group: 'Cambridge Lower Secondary (Ages 11–14)', options: ['Grade 6', 'Grade 7', 'Grade 8'] },
  { group: 'Cambridge Upper Secondary / IGCSE (Ages 14–16)', options: ['Grade 9', 'Grade 10'] },
];

export default function Admission() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    appliedClass: '',
    address: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [applicationRef, setApplicationRef] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Generate unique reference number (e.g. AKJ-ADM-2026-7842)
    const refId = `AKJ-ADM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Store in localStorage for persistence / inquiries review
    try {
      const existing = JSON.parse(localStorage.getItem('akj_admission_applications') || '[]');
      existing.unshift({
        id: refId,
        ...formData,
        submittedAt: new Date().toISOString(),
      });
      localStorage.setItem('akj_admission_applications', JSON.stringify(existing));
    } catch {
      // LocalStorage fallback handling
    }

    // Simulate network submission
    setTimeout(() => {
      setIsSubmitting(false);
      setApplicationRef(refId);
      setSubmitted(true);
      window.scrollTo({ top: 320, behavior: 'smooth' });
    }, 700);
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
    });
    setSubmitted(false);
    setApplicationRef('');
  };

  return (
    <div className="page-container admission-page">
      {/* PAGE HERO */}
      <PageHero
        title={
          <>
            START YOUR JOURNEY.<br />
            Begin Your Admission.
          </>
        }
        subtitle="AKJ International School · EY1 to Grade 10 Cambridge Pathway"
      />

      <section className="admission-content-section">
        <div className="admission-container">
          <div className="admission-layout-grid">
            {/* MAIN FORM CARD */}
            <div className="admission-card">
              {submitted ? (
                /* SUCCESS CONFIRMATION STATE */
                <div className="admission-success-card">
                  <div className="admission-success-icon-box">
                    <svg
                      width="36"
                      height="36"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#1E459F"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>

                  <span className="admission-badge-success">APPLICATION SUBMITTED</span>
                  <h2 className="admission-success-title">Thank You for Applying!</h2>
                  <p className="admission-success-lead">
                    We have received your application for <strong>AKJ International School</strong>. Our admissions team will review the details and reach out within 24 to 48 business hours.
                  </p>

                  <div className="admission-ref-box">
                    <span className="admission-ref-label">Application Reference ID</span>
                    <span className="admission-ref-number">{applicationRef}</span>
                  </div>

                  <div className="admission-summary-grid">
                    <div className="admission-summary-item">
                      <span className="admission-summary-label">Applicant Name</span>
                      <span className="admission-summary-val">{formData.firstName} {formData.lastName}</span>
                    </div>
                    <div className="admission-summary-item">
                      <span className="admission-summary-label">Grade / Class</span>
                      <span className="admission-summary-val">{formData.appliedClass || 'Not Specified'}</span>
                    </div>
                    <div className="admission-summary-item">
                      <span className="admission-summary-label">Date of Birth</span>
                      <span className="admission-summary-val">{formData.dateOfBirth}</span>
                    </div>
                    <div className="admission-summary-item">
                      <span className="admission-summary-label">Contact Details</span>
                      <span className="admission-summary-val">{formData.phone} | {formData.email}</span>
                    </div>
                  </div>

                  <div className="admission-success-steps">
                    <h4 className="admission-steps-heading">Next Steps in the Process:</h4>
                    <ol className="admission-steps-list">
                      <li>
                        <strong>Document Verification:</strong> Our admissions counsellor will verify date of birth eligibility and contact you for prior school records (if applicable).
                      </li>
                      <li>
                        <strong>Campus Tour &amp; Learner Interaction:</strong> We invite the learner and parents for a personal interaction with our academic leads.
                      </li>
                      <li>
                        <strong>Enrollment &amp; Welcome:</strong> Finalizing admission registration and orientation schedule.
                      </li>
                    </ol>
                  </div>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="admission-reset-btn"
                  >
                    Submit Another Application
                  </button>
                </div>
              ) : (
                /* ADMISSION APPLICATION FORM */
                <>
                  <div className="admission-header-box">
                    <div className="admission-kicker-row">
                      <span className="admission-kicker">ADMISSIONS 2026–2027</span>
                      {/* <span className="admission-status-pill">Now Accepting Applications</span> */}
                    </div>
                    <h2 className="admission-form-title">Student Application Form</h2>
                    {/* <p className="admission-form-desc">
                      Take the first step toward a globally recognized Cambridge education. Please provide the student and parent details accurately below.
                    </p> */}
                  </div>

                  <form onSubmit={handleSubmit} className="admission-form" noValidate={false}>
                    {/* SECTION 1: STUDENT & GUARDIAN DETAILS */}
                    <div className="admission-form-group-title">
                      <span>1. Applicant Information</span>
                    </div>

                    <div className="admission-form-row">
                      {/* FIRST NAME */}
                      <div className="admission-form-field">
                        <label htmlFor="firstName">
                          First Name <span className="field-required">*</span>
                        </label>
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="e.g. Aadhya"
                          className="admission-input"
                          autoComplete="given-name"
                        />
                      </div>

                      {/* LAST NAME */}
                      <div className="admission-form-field">
                        <label htmlFor="lastName">
                          Last Name <span className="field-required">*</span>
                        </label>
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="e.g. Kumar"
                          className="admission-input"
                          autoComplete="family-name"
                        />
                      </div>
                    </div>

                    <div className="admission-form-row">
                      {/* EMAIL ADDRESS */}
                      <div className="admission-form-field">
                        <label htmlFor="email">
                          Email Address <span className="field-required">*</span>
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="parent@example.com"
                          className="admission-input"
                          autoComplete="email"
                        />
                      </div>

                      {/* PHONE NUMBER */}
                      <div className="admission-form-field">
                        <label htmlFor="phone">
                          Phone Number <span className="field-required">*</span>
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 98765 43210"
                          className="admission-input"
                          autoComplete="tel"
                        />
                      </div>
                    </div>

                    {/* SECTION 2: ACADEMIC PLACEMENT */}
                    <div className="admission-form-group-title" style={{ marginTop: '24px' }}>
                      <span>2. Academic Enrollment</span>
                    </div>

                    <div className="admission-form-row">
                      {/* DATE OF BIRTH */}
                      <div className="admission-form-field">
                        <label htmlFor="dateOfBirth">
                          Date Of Birth <span className="field-required">*</span>
                        </label>
                        <input
                          id="dateOfBirth"
                          name="dateOfBirth"
                          type="date"
                          required
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          className="admission-input admission-date-input"
                          max={new Date().toISOString().split('T')[0]}
                        />
                      </div>

                      {/* CLASS */}
                      <div className="admission-form-field">
                        <label htmlFor="appliedClass">
                          Class / Grade <span className="field-required">*</span>
                        </label>
                        <select
                          id="appliedClass"
                          name="appliedClass"
                          required
                          value={formData.appliedClass}
                          onChange={handleChange}
                          className="admission-input admission-select"
                        >
                          <option value="">Select Applying Class...</option>
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
                    </div>

                    {/* ADDRESS */}
                    <div className="admission-form-field admission-full-width">
                      <label htmlFor="address">
                        Address <span className="field-required">*</span>
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        required
                        rows="3"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Residential address (Door / Street, Area, City, Pincode)"
                        className="admission-input admission-textarea"
                        autoComplete="street-address"
                      />
                    </div>

                    {/* CONSENT / PRIVACY NOTICE */}
                    <div className="admission-privacy-note">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#1E459F"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="privacy-icon"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      </svg>
                      <span>
                        Your information is kept strictly confidential and used solely for the Cambridge admission evaluation at AKJ International School.
                      </span>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <div className="admission-submit-container">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="admission-submit-btn"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="admission-spinner"></span>
                            Submitting Application...
                          </>
                        ) : (
                          <>
                            Submit Application
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="admission-btn-arrow"
                            >
                              <line x1="5" y1="12" x2="19" y2="12"></line>
                              <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>

              {/* CAMBRIDGE PATHWAY OVERVIEW */}
              {/* <div className="admission-pathway-card">
                <h4 className="admission-pathway-title">The Cambridge Pathway</h4>
                <div className="admission-pathway-steps">
                  <div className="admission-pathway-item">
                    <span className="pathway-stage">EY1 – EY3</span>
                    <div className="pathway-desc">
                      <strong>Early Years</strong>
                      <p>Inquiry-based play, curiosity, and early confidence building.</p>
                    </div>
                  </div>
                  <div className="admission-pathway-item">
                    <span className="pathway-stage">Grades 1–5</span>
                    <div className="pathway-desc">
                      <strong>Cambridge Primary</strong>
                      <p>Foundations in English, Mathematics, and hands-on Sciences.</p>
                    </div>
                  </div>
                  <div className="admission-pathway-item">
                    <span className="pathway-stage">Grades 6–8</span>
                    <div className="pathway-desc">
                      <strong>Lower Secondary</strong>
                      <p>Independent analysis and preparation for global standards.</p>
                    </div>
                  </div>
                  <div className="admission-pathway-item">
                    <span className="pathway-stage">Grades 9–10</span>
                    <div className="pathway-desc">
                      <strong>Cambridge IGCSE</strong>
                      <p>Worldwide recognized certification opening future academic avenues.</p>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </section>
      </div>
    );
  }
