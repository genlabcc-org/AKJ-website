import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './AgencyIntro.css';

gsap.registerPlugin(ScrollTrigger);

export default function AgencyIntro() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Dual banner parallax scrub with GSAP
      const dualBanners = gsap.utils.toArray('.agency-intro-dual-banner');
      dualBanners.forEach((wrap) => {
        const img = wrap.querySelector('.agency-intro-dual-img');
        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -14 },
            {
              yPercent: 14,
              ease: 'none',
              scrollTrigger: {
                trigger: wrap,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.65,
                invalidateOnRefresh: true,
              },
            }
          );
        }
      });

      // 2. Responsive parallax on the 3 Pillars images
      const pillarCards = gsap.utils.toArray('.agency-pillar-card');
      pillarCards.forEach((card) => {
        const img = card.querySelector('.agency-pillar-img');
        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -12 },
            {
              yPercent: 12,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.65,
                invalidateOnRefresh: true,
              },
            }
          );
        }
      });

      ScrollTrigger.refresh();
    }, sectionRef);

    // Refresh after layout settles
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="agency-intro-section">
      <div className="agency-intro-divider"></div>

      <div className="agency-intro-grid">
        {/* LEFT COLUMN */}
        <div className="agency-intro-left">
          <p className="agency-intro-eyebrow">
            Universities, Boarding Schools &amp; Global Admissions
          </p>
          <h2 className="agency-intro-title">How we learn</h2>
          <p className="agency-intro-lead">
            At AKJ, children do the thinking, the talking and the doing. Our facilitators plan every lesson around them and guide them towards real understanding, not memorising and repeating.
          </p>
        </div>

        {/* RIGHT COLUMN */}
        <div className="agency-intro-right">
          <p className="agency-intro-body">
            <strong>One Seamless Cambridge Journey: </strong> 
            From Early Years (EY1) to Grade 10 (IGCSE), students follow one unified Cambridge pathway where every stage builds naturally on the last—so moving up never feels like starting over.
          </p>

          <p className="agency-intro-point">
            <strong>Student-Led Active Learning: </strong> At AKJ, children take the lead by doing the thinking, the talking, and the doing in every classroom.
          </p>

          <p className="agency-intro-point">
            <strong>Facilitator-Guided Discovery: </strong> Our facilitators design every lesson around the learner, guiding students rather than lecturing.
          </p>

          <p className="agency-intro-point">
            <strong>Deep Understanding Over Rote: </strong> We focus on building genuine comprehension and critical thinking, moving away from memorizing and repeating.
          </p>

          <Link to="/about" className="agency-intro-btn">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="7" y1="7" x2="17" y2="17" />
              <polyline points="17 7 17 17 7 17" />
            </svg>
            <span>Learn more</span>
          </Link>
        </div>
      </div>

      {/* DUAL BANNER IMAGES */}
      <div className="agency-intro-dual-banners">
        <div className="agency-intro-dual-banner">
          <img
            src="/images/akj-student-reading.jpg"
            alt="AKJ student reading"
            className="agency-intro-dual-img"
          />
        </div>
        <div className="agency-intro-dual-banner">
          <img
            src="/images/akj-bookshelf.jpg"
            alt="AKJ learning library"
            className="agency-intro-dual-img"
          />
        </div>
      </div>

      {/* WHAT SETS US APART SECTION */}
      <div className="agency-apart-divider"></div>

      <div className="agency-apart-grid">
        <div className="agency-apart-left">
          <h2 className="agency-apart-eyebrow">WHAT SETS US APART</h2>
        </div>

        <div className="agency-apart-right">
          <h3 className="agency-apart-title">Learner qualities</h3>
          <p className="agency-apart-lead">
            Stronger communication begins with deeper understanding. In
            industrial, technological and international environments, this relies
            on a rigorous analysis of the challenges, offerings and competitive
            landscape. It requires method, discernment and creativity. This is
            precisely what bb&amp;b delivers.
          </p>

          <Link to="/about" className="agency-apart-btn" aria-label="Learn more about what sets us apart">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              fill="none"
              viewBox="0 0 12 12"
              aria-hidden="true"
            >
              <path
                stroke="currentColor"
                strokeWidth="1.5"
                d="M9.514 9.45 2 2m7.514 7.45H3.252m6.262 0V3.242"
              />
            </svg>
            <span>Learn more</span>
          </Link>
        </div>
      </div>

      {/* 3 PILLARS / EDITORIAL CARDS */}
      <div className="agency-pillars-grid">
        {/* Card 1: STRUCTURING */}
        <div className="agency-pillar-card">
          <div className="agency-pillar-img-wrap">
            <img
              src="/images/s5.jpeg"
              alt="Structuring"
              className="agency-pillar-img"
              loading="lazy"
            />
          </div>
          <h3 className="agency-pillar-title">CONFIDENT</h3>
          <p className="agency-pillar-desc">
            Students develop the self-assurance to speak up, share ideas, and tackle new challenges without fear of making mistakes.
          </p>
          <Link to="/services" className="agency-pillar-link" aria-label="Learn more about Structuring">
            <svg
              className="agency-pillar-arrow"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
            >
              <path
                stroke="currentColor"
                strokeWidth="1.5"
                d="M9.514 9.45 2 2m7.514 7.45H3.252m6.262 0V3.242"
              />
            </svg>
            <span>Learn more</span>
          </Link>
        </div>

        {/* Card 2: CREATE */}
        <div className="agency-pillar-card">
          <div className="agency-pillar-img-wrap">
            <img
              src="/images/s6.jpeg"
              alt="Create"
              className="agency-pillar-img"
              loading="lazy"
            />
          </div>
          <h3 className="agency-pillar-title">REFLECTIVE</h3>
          <p className="agency-pillar-desc">
            Learners actively evaluate their own thinking, understand how they learn best, and turn everyday feedback into continuous growth.
          </p>
          <Link to="/services" className="agency-pillar-link" aria-label="Learn more about Create">
            <svg
              className="agency-pillar-arrow"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
            >
              <path
                stroke="currentColor"
                strokeWidth="1.5"
                d="M9.514 9.45 2 2m7.514 7.45H3.252m6.262 0V3.242"
              />
            </svg>
            <span>Learn more</span>
          </Link>
        </div>

        {/* Card 3: EXECUTE */}
        <div className="agency-pillar-card">
          <div className="agency-pillar-img-wrap">
            <img
              src="/images/s7.jpeg"
              alt="Execute"
              className="agency-pillar-img"
              loading="lazy"
            />
          </div>
          <h3 className="agency-pillar-title">INNOVATIVE</h3>
          <p className="agency-pillar-desc">
            Children are encouraged to ask questions, think outside the box, and apply what they know to solve real-world problems creatively.
          </p>
          <Link to="/services" className="agency-pillar-link" aria-label="Learn more about Execute">
            <svg
              className="agency-pillar-arrow"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
            >
              <path
                stroke="currentColor"
                strokeWidth="1.5"
                d="M9.514 9.45 2 2m7.514 7.45H3.252m6.262 0V3.242"
              />
            </svg>
            <span>Learn more</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
