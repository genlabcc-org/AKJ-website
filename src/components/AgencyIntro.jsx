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
            About / The Cambridge Way
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
            <strong>Student-Led Active Learning: </strong>
            At AKJ, children take the lead by doing the thinking, the talking, and the doing in every classroom.
          </p>

          <p className="agency-intro-point">
            <strong>Facilitator-Guided Discovery: </strong>
            Our facilitators design every lesson around the learner, guiding students rather than lecturing.
          </p>

          <p className="agency-intro-point">
            <strong>Deep Understanding Over Rote: </strong>
            We focus on building genuine comprehension and critical thinking, moving away from memorizing and repeating.
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

      {/* DUAL / FULL-WIDTH BANNER IMAGE */}
      <div className="agency-intro-dual-banners single-banner">
        <div className="agency-intro-dual-banner">
          <img
            src="/images/akj-cairo-reading-lounge.jpg"
            alt="Cairo Stories Reading Lounge with learners and creative spaces - AKJ International School"
            className="agency-intro-dual-img"
          />
        </div>
      </div>

      {/* WHAT SETS US APART SECTION */}
      <div className="agency-apart-divider"></div>

      <div className="agency-apart-grid">
        <div className="agency-apart-left">
          <h2 className="agency-apart-eyebrow">CENTRE NO. IA998</h2>
        </div>

        <div className="agency-apart-right">
          <h3 className="agency-apart-title">Learner qualities</h3>
          <p className="agency-apart-lead">
            AKJ International School is officially registered with Cambridge
            International Education as a Cambridge school (Centre No. IA998) for
            Early Years and Primary. That means our facilitators teach from
            Cambridge&apos;s own curriculum frameworks, use Cambridge resources
            and training, and are held to the same standards as Cambridge
            schools around the world. Here in Thuckalay, your child gets an
            education that&apos;s recognised far beyond it.
          </p>

          <Link to="/about" className="agency-apart-btn" aria-label="Learn more about The Cambridge Pathway">
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

      {/* 3 PILLARS / LEARNER QUALITIES */}
      <div className="agency-pillars-grid">
        {/* Card 1: CONFIDENT */}
        <div className="agency-pillar-card">
          <div className="agency-pillar-img-wrap">
            <img
              src="/images/AKJ P1.png"
              alt="Confident"
              className="agency-pillar-img"
              loading="lazy"
            />
          </div>
          <h3 className="agency-pillar-title">CONFIDENT</h3>
          <p className="agency-pillar-desc">
            Students develop the self-assurance to speak up, share ideas, and tackle new challenges without fear of making mistakes.
          </p>
        </div>

        {/* Card 2: REFLECTIVE */}
        <div className="agency-pillar-card">
          <div className="agency-pillar-img-wrap">
            <img
              src="/images/s6.jpeg"
              alt="Reflective"
              className="agency-pillar-img"
              loading="lazy"
            />
          </div>
          <h3 className="agency-pillar-title">REFLECTIVE</h3>
          <p className="agency-pillar-desc">
            Learners actively evaluate their own thinking, understand how they learn best, and turn everyday feedback into continuous growth.
          </p>
        </div>

        {/* Card 3: INNOVATIVE */}
        <div className="agency-pillar-card">
          <div className="agency-pillar-img-wrap">
            <img
              src="/images/s7.jpeg"
              alt="Innovative"
              className="agency-pillar-img"
              loading="lazy"
            />
          </div>
          <h3 className="agency-pillar-title">INNOVATIVE</h3>
          <p className="agency-pillar-desc">
            Children are encouraged to ask questions, think outside the box, and apply what they know to solve real-world problems creatively.
          </p>
        </div>
      </div>
    </section>
  );
}
