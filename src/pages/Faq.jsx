import React from 'react';
import { Link } from 'react-router-dom';
import './Faq.css';

const DIFFERENT_BOARD_POINTS = [
  'Classes are active, not lecture-only',
  'Children discuss, explore and work things out, with facilitators guiding them',
  'Progress is checked all through the year, not only at exam time',
  'Feedback tells each child exactly how to improve, so nobody gets left behind',
];

const NO_PRESSURE_POINTS = [
  "No — Cambridge goes at the child's pace, especially in Early Years and Primary",
  'The focus is on understanding and confidence, not rote learning or rank lists',
  'Learners ask questions, explain their ideas and apply what they know to new problems',
  'Skills last long after the exams are over, for university, work or anything else',
];

const LANGUAGES_POINTS = [
  'English is the primary medium of learning across all stages',
  'Children also learn Tamil and Hindi as part of the curriculum',
  'Malayalam is available for students who want it',
  'Dedicated support for children who speak a different language at home as they grow confident in English',
];

function OrangeDiagonalArrow() {
  return (
    <svg
      className="bbb-faq-bullet-arrow"
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
  );
}

export default function Faq() {
  return (
    <div className="bbb-faq-page">
      <div className="bbb-faq-container">
        {/* SECTION 1: WHY DID AKJ CHOOSE CAMBRIDGE? + HOW IS IT DIFFERENT + PRESSURE */}
        <section className="bbb-faq-split-section">
          <div className="bbb-faq-left">
            <span className="bbb-faq-kicker">WHY CAMBRIDGE? (FAQ)</span>

            <p className="bbb-faq-left-lead">
              Because it teaches children how to think, not just what to
              memorise. Cambridge learners ask questions, explain their ideas
              and apply what they know to new problems. Those skills last long
              after the exams are over, whether a child goes on to university,
              work or anything else.
            </p>
          </div>

          <div className="bbb-faq-right">
            <h1 className="bbb-faq-heading">
              WHY DID AKJ CHOOSE CAMBRIDGE?
            </h1>

            <h2 className="bbb-faq-subheading">
              HOW IS IT DIFFERENT FROM A REGULAR BOARD?
            </h2>
            <ul className="bbb-faq-arrow-list">
              {DIFFERENT_BOARD_POINTS.map((point) => (
                <li key={point} className="bbb-faq-arrow-item">
                  <OrangeDiagonalArrow />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <h2 className="bbb-faq-subheading bbb-faq-subheading-spaced">
              WILL MY CHILD BE UNDER MORE PRESSURE?
            </h2>
            <ul className="bbb-faq-arrow-list">
              {NO_PRESSURE_POINTS.map((point) => (
                <li key={point} className="bbb-faq-arrow-item">
                  <OrangeDiagonalArrow />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* SECTION 2: WHAT LANGUAGES DO CHILDREN LEARN? */}
        <section className="bbb-faq-split-section">
          <div className="bbb-faq-left">
            <span className="bbb-faq-kicker">LANGUAGES AT AKJ</span>

            <p className="bbb-faq-left-lead">
              English is the medium of learning. Children also learn Tamil and
              Hindi, and Malayalam is available for students who want it. We
              support children who speak a different language at home as they
              grow confident in English.
            </p>
          </div>

          <div className="bbb-faq-right">
            <h2 className="bbb-faq-heading">
              WHAT LANGUAGES DO CHILDREN LEARN?
            </h2>

            <h3 className="bbb-faq-subheading">
              MULTILINGUAL LEARNING &amp; SUPPORT
            </h3>
            <ul className="bbb-faq-arrow-list">
              {LANGUAGES_POINTS.map((point) => (
                <li key={point} className="bbb-faq-arrow-item">
                  <OrangeDiagonalArrow />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* SECTION 3: IS CAMBRIDGE RECOGNISED IN INDIA? + CAN MY CHILD MOVE LATER? */}
        <section className="bbb-faq-split-section">
          <div className="bbb-faq-left">
            <span className="bbb-faq-kicker">RECOGNITION &amp; MOBILITY</span>

            <div className="bbb-faq-emblem-lockup" aria-hidden="true">
              <div className="bbb-faq-emblem-badge">
                <span>160+</span>
              </div>
              <div className="bbb-faq-emblem-text">
                <span>COUNTRIES &amp;</span>
                <span>INDIAN BOARD</span>
                <span>RECOGNITION</span>
              </div>
            </div>
          </div>

          <div className="bbb-faq-right">
            <h2 className="bbb-faq-heading">
              IS CAMBRIDGE RECOGNISED IN INDIA?
            </h2>

            <p className="bbb-faq-body-text">
              Yes. Cambridge qualifications are accepted by Indian universities,
              and IGCSE is recognised as equivalent to Class 10. They&apos;re
              also recognised by universities and employers around the world.
            </p>

            <h3 className="bbb-faq-subheading">
              CAN MY CHILD MOVE TO ANOTHER SCHOOL OR BOARD LATER?
            </h3>

            <p className="bbb-faq-body-text">
              Yes. Cambridge is followed in over 160 countries, and the skills
              children build here carry over easily wherever they go next.
            </p>

            <Link to="/contact" className="bbb-faq-pill-btn">
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
      </div>
    </div>
  );
}
