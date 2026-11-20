import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const CAMBRIDGE_STAGES = [
  {
    id: 'early-years',
    markTop: 'EY1, EY2, EY3 · AGES',
    markMain: '3–6',
    title: 'EARLY YEARS',
    desc: 'Learning through play, curiosity and talk. Children build independence, confidence, early language and number sense at their own pace, and are gently prepared for Primary.',
  },
  {
    id: 'primary',
    markTop: 'GRADES 1–5 · AGES',
    markMain: '5–11',
    title: 'PRIMARY',
    desc: 'Strong foundations in English, Maths and Science, with plenty of room for creativity, questions and hands-on work.',
  },
  {
    id: 'lower-secondary',
    markTop: 'GRADES 6–8 · AGES',
    markMain: '11–14',
    title: 'LOWER SECONDARY',
    desc: 'Deeper thinking, more independence, and the skills to handle bigger ideas across every subject. Prepares learners for IGCSE.',
  },
  {
    id: 'igcse',
    markTop: 'GRADES 9–10 · AGES',
    markMain: '14–16',
    title: 'IGCSE',
    desc: 'Internationally recognised qualifications that open doors to higher studies anywhere in the world.',
  },
];

export default function About() {
  const [startIndex, setStartIndex] = useState(0);

  const handlePrev = () => {
    setStartIndex((prev) =>
      prev === 0 ? CAMBRIDGE_STAGES.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % CAMBRIDGE_STAGES.length);
  };

  const visibleStages = Array.from({ length: 4 }, (_, idx) => {
    return CAMBRIDGE_STAGES[(startIndex + idx) % CAMBRIDGE_STAGES.length];
  });

  return (
    <div className="bbb-about-page">
      <div className="bbb-about-container">
        {/* SECTION 1: ONE JOURNEY, FROM EY1 TO GRADE 10 */}
        <section className="bbb-about-split-section">
          <div className="bbb-about-left">
            <span className="bbb-about-kicker">THE CAMBRIDGE WAY</span>
          </div>

          <div className="bbb-about-right">
            <h1 className="bbb-about-heading">
              ONE JOURNEY, FROM EY1 TO GRADE 10
            </h1>
            <p className="bbb-about-text">
              At AKJ, your child follows a single Cambridge learning path from
              EY1 all the way to Grade 10 and IGCSE. Each stage builds on the
              one before it, so the jump to a new class never feels like
              starting over.
            </p>
            <p className="bbb-about-text">
              A child should feel one philosophy of learning from the age of 3
              to 16, not a different style every time they change rooms.
            </p>

            <Link to="/contact" className="bbb-about-pill-btn">
              <svg
                width="13"
                height="13"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M2 2L12 12M12 12V4M12 12H4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="square"
                />
              </svg>
              <span>Contact us</span>
            </Link>
          </div>
        </section>

        {/* SECTION 2: A REGISTERED CAMBRIDGE SCHOOL */}
        <section className="bbb-about-split-section">
          <div className="bbb-about-left">
            <span className="bbb-about-kicker">CENTRE NO. IA998</span>
          </div>

          <div className="bbb-about-right">
            <h2 className="bbb-about-heading">
              A REGISTERED CAMBRIDGE SCHOOL
            </h2>
            <p className="bbb-about-text">
              AKJ International School is officially registered with Cambridge
              International Education as a Cambridge school (Centre No. IA998)
              for Early Years and Primary.
            </p>
            <p className="bbb-about-text">
              That means our facilitators teach from Cambridge&apos;s own
              curriculum frameworks, use Cambridge resources and training, and
              are held to the same standards as Cambridge schools around the
              world.
            </p>
            <p className="bbb-about-text">
              Here in Thuckalay, your child gets an education that&apos;s
              recognised far beyond it.
            </p>
          </div>
        </section>

        {/* SECTION 3: 4-COLUMN STAGES SHOWCASE (Early Years, Primary, Lower Secondary, IGCSE) */}
        <section className="bbb-about-stages-section">
          <div className="bbb-about-stages-header">
            <div className="bbb-about-left">
              <span className="bbb-about-kicker">STAGE, GRADES &amp; AGES</span>
            </div>
            <div className="bbb-about-right">
              <h2 className="bbb-about-heading">THE CAMBRIDGE PATHWAY</h2>
            </div>
          </div>

          <div className="bbb-about-columns-grid">
            {visibleStages.map((stage) => (
              <article key={stage.id} className="bbb-about-col-item">
                <div className="bbb-about-logo-lockup" aria-hidden="true">
                  <span className="bbb-lockup-eyebrow">{stage.markTop}</span>
                  <span className="bbb-lockup-number">{stage.markMain}</span>
                </div>
                <h3 className="bbb-about-col-title">{stage.title}</h3>
                <p className="bbb-about-col-desc">{stage.desc}</p>
              </article>
            ))}
          </div>

          <div className="bbb-about-slider-nav">
            <button
              type="button"
              className="bbb-about-arrow-btn"
              onClick={handlePrev}
              aria-label="Previous stage"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="11 18 5 12 11 6" />
              </svg>
            </button>
            <button
              type="button"
              className="bbb-about-arrow-btn"
              onClick={handleNext}
              aria-label="Next stage"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="13 6 19 12 13 18" />
              </svg>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
