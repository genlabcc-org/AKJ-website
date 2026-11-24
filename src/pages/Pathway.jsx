import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Pathway.css';

const CAMBRIDGE_SUBJECTS = [
  {
    id: 'english',
    name: 'English',
    description: 'Reading, writing, speaking and listening, with early critical reading and confident written work',
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    description: 'Number, geometry and measure, statistics and probability, with algebra from Lower Secondary, and mathematical thinking throughout',
  },
  {
    id: 'science',
    name: 'Science',
    description: 'Biology, chemistry, physics, earth and space, through hands-on investigations',
  },
  {
    id: 'computing',
    name: 'Computing',
    description: 'Computational thinking and programming, from block-based coding in Primary to text-based coding in Lower Secondary',
  },
  {
    id: 'global-perspectives',
    name: 'Global Perspectives',
    description: 'Research, analysis, collaboration and communication through personal, local and global topics',
  },
  {
    id: 'humanities',
    name: 'Humanities',
    description: 'Curiosity about people, the past and places, locally and around the world',
  },
  {
    id: 'art-design',
    name: 'Art & Design',
    description: 'Creative ideas, skills and ways of working that grow with the child',
  },
  {
    id: 'music',
    name: 'Music',
    description: 'Exploring, performing and responding to music',
  },
  {
    id: 'physical-education',
    name: 'Physical Education',
    description: 'A wide range of age-appropriate physical activities',
  },
  {
    id: 'digital-literacy',
    name: 'Digital Literacy',
    description: 'Using technology well, and staying safe and kind online',
  },
  {
    id: 'wellbeing',
    name: 'Wellbeing',
    description: 'Understanding myself, my relationships and navigating my world',
  },
];

export default function Pathway() {
  const [activeSubjectId, setActiveSubjectId] = useState('english');

  const activeSubject =
    CAMBRIDGE_SUBJECTS.find((s) => s.id === activeSubjectId) || CAMBRIDGE_SUBJECTS[0];

  return (
    <div className="bbb-pathway-page">
      {/* 1. FIRST ONE FULL IMAGE (HERO BANNER) */}
      <section className="bbb-pathway-full-hero" aria-label="Academics Pathway Showcase">
        <div className="bbb-full-hero-img-wrap">
          <img
            src="/images/akj-pathway-earlyyears.jpg"
            alt="AKJ Early Years and Primary learners in the reading and activity discovery room"
            className="bbb-full-hero-img"
          />
        </div>
      </section>

      <div className="bbb-pathway-container">
        {/* 2. EDITORIAL HERO SPLIT SECTION */}
        <section className="bbb-pathway-split-section">
          <div className="bbb-pathway-left">
            <span className="bbb-pathway-kicker">EY1–GRADE 10 PATHWAY</span>
          </div>

          <div className="bbb-pathway-right">
            <h1 className="bbb-pathway-heading">
              WHAT CHILDREN LEARN
            </h1>
            <p className="bbb-pathway-lead">
              From Grade 1 to Grade 8, children follow Cambridge&apos;s subject frameworks, which describe what learners should know and be able to do at each stage. Subjects are revisited every year with growing depth, so skills keep building.
            </p>

            <div className="bbb-pathway-centre-tag">
              <span className="bbb-centre-badge">CAMBRIDGE INTERNATIONAL SCHOOL</span>
              <span className="bbb-centre-code">CENTRE NO. IA998</span>
            </div>
          </div>
        </section>

        {/* 3. CAMBRIDGE SUBJECTS VERTICAL TABS COMPONENT */}
        <section className="bbb-subjects-section" aria-label="Cambridge Subject Frameworks">
          <div className="bbb-subjects-layout">
            {/* LEFT SIDEBAR: SUBJECT LIST */}
            <aside className="bbb-subjects-sidebar" aria-label="Subjects menu">
              <nav className="bbb-subjects-nav">
                {CAMBRIDGE_SUBJECTS.map((subj) => {
                  const isActive = activeSubjectId === subj.id;
                  return (
                    <button
                      key={subj.id}
                      type="button"
                      className={`bbb-subject-nav-btn ${isActive ? 'active' : ''}`}
                      onClick={() => setActiveSubjectId(subj.id)}
                    >
                      <span className="bbb-subject-btn-text">{subj.name}</span>
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* RIGHT PANE: ACTIVE SUBJECT DETAILS */}
            <main className="bbb-subject-content-pane">
              <div key={activeSubject.id}>
                <h2 className="bbb-subject-title">{activeSubject.name}</h2>

                <p className="bbb-subject-lead-desc">
                  {activeSubject.description}
                </p>
              </div>

              {/* INQUIRY BUTTON MATCHING SCREENSHOT */}
              <div className="bbb-subject-action-row">
                <Link to="/contact" className="bbb-subject-inquiry-btn">
                  <span className="bbb-inquiry-icon" aria-hidden="true">🔗</span>
                  <span>Make an Inquiry</span>
                </Link>
              </div>
            </main>
          </div>
        </section>

        {/* 4. CURRICULUM HANDBOOK E-BOOK SECTION (MATCHING REFERENCE CARD) */}
        <section className="bbb-handbook-section" aria-label="Curriculum Handbook">
          <div className="bbb-handbook-grid">
            <div className="bbb-handbook-card">
              <div className="bbb-handbook-card-img-wrap">
                <img
                  src="/images/akj-handbook-resources.jpg"
                  alt="Cambridge Learning Resources and Phonics Library - AKJ International School"
                  className="bbb-handbook-card-img"
                />
              </div>
              <div className="bbb-handbook-card-body">
                <h3 className="bbb-handbook-card-title">The Cambridge Approach</h3>
                <div className="bbb-handbook-card-actions">
                  <a
                    href="/documents/The-Cambridge-Approach-Handbook.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bbb-handbook-btn"
                  >
                    <span className="bbb-handbook-btn-icon" aria-hidden="true">🔗</span>
                    <span>Open E-Book</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
