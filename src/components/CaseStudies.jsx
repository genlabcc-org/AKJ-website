import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './CaseStudies.css';

gsap.registerPlugin(ScrollTrigger);

export default function CaseStudies() {
  const sectionRef = useRef(null);

  // GSAP Smooth Parallax on Images and Floating Overlapping Cards
  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray('.case-study-item');

      items.forEach((item) => {
        const img = item.querySelector('.case-study-img');
        const card = item.querySelector('.case-study-card');

        // Faster, responsive image parallax scrub
        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -14 },
            {
              yPercent: 14,
              ease: 'none',
              scrollTrigger: {
                trigger: item,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.65,
              },
            }
          );
        }

        // Faster floating card parallax on desktop
        if (card && window.innerWidth >= 1024) {
          gsap.fromTo(
            card,
            { y: -45 },
            {
              y: 45,
              ease: 'none',
              scrollTrigger: {
                trigger: item,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.75,
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="case-studies-section" aria-label="Our Projects and Tangible Case Studies">
      {/* SECTION DIVIDER */}
      <div className="case-studies-divider"></div>

      {/* SECTION HEADER */}
      <div className="case-studies-header">
        <div className="case-studies-title-wrap">
          <h2 className="case-studies-heading">Life at AKJ</h2>
        </div>
        <p className="case-studies-lead">
          Clubs every Friday, events all year, and a school that feels like family, Children learn to lead, perform, create and work together beyond the classroom
        </p>
      </div>

      {/* CASE STUDIES LIST */}
      <div className="case-studies-list">
        {/* CASE STUDY 1: ZONEGREEN */}
        <div className="case-study-item case-study-left">
          <div className="case-study-img-wrap">
            <div className="case-study-img-inner">
              <img
                src="/images/s1.jpeg"
                alt="Zonegreen railway depot protection systems"
                className="case-study-img"
                loading="lazy"
              />
            </div>
          </div>

          <div className="case-study-card">
            <span className="case-study-tag">CLUB EVERY FRIDAY, EVENTS ALL YEAR</span>
            <h4 className="case-study-title">Learning Beyond the Classroom</h4>
            <p className="case-study-desc">
              Weekly Friday clubs and year-round events at AKJ International School inspire creativity, teamwork, and real-world confidence.
            </p>
            <Link
              to="/services"
              className="case-study-link"
              aria-label="Learn more about Zonegreen case study"
            >
              <svg
                className="case-study-arrow"
                width="13"
                height="13"
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

        {/* CASE STUDY 2: BINDER MAGNETIC */}
        <div className="case-study-item case-study-right">
          <div className="case-study-img-wrap">
            <div className="case-study-img-inner">
              <img
                src="/images/s2.jpeg"
                alt="Binder Magnetic polyurethane timing belts and mechanical components"
                className="case-study-img"
                loading="lazy"
              />
            </div>
          </div>

          <div className="case-study-card">
            <span className="case-study-tag">CHLIDREN LEARNS TO LEAD</span>
            <h4 className="case-study-title">Building Tomorrow’s Voices Today</h4>
            <p className="case-study-desc">
              At AKJ International School, students take initiative, make responsible choices, and grow into confident, compassionate leaders.
            </p>
            <Link
              to="/services"
              className="case-study-link"
              aria-label="Learn more about Binder Magnetic case study"
            >
              <svg
                className="case-study-arrow"
                width="13"
                height="13"
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

        {/* CASE STUDY 3: FRÉNÉHARD PLIAGE */}
        <div className="case-study-item case-study-left">
          <div className="case-study-img-wrap">
            <div className="case-study-img-inner">
              <img
                src="/images/s3.jpeg"
                alt="Frénéhard Pliage digital sheet metal folding offering"
                className="case-study-img"
                loading="lazy"
              />
            </div>
          </div>

          <div className="case-study-card">
            <span className="case-study-tag">Facilitators Who Inspire</span>
            <h4 className="case-study-title">Passionate Mentors, Personalized Guidance</h4>
            <p className="case-study-desc">
              At AKJ International School, our dedicated facilitators go beyond textbooks—guiding, mentoring, and empowering every child to think independently and reach their fullest potential.
            </p>
            <Link
              to="/services"
              className="case-study-link"
              aria-label="Learn more about Frénéhard Pliage case study"
            >
              <svg
                className="case-study-arrow"
                width="13"
                height="13"
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

        {/* CASE STUDY 4: BRIGHTLOOP BRAND */}
        <div className="case-study-item case-study-right">
          <div className="case-study-img-wrap">
            <div className="case-study-img-inner">
              <img
                src="/images/s4.jpeg"
                alt="BrightLoop universal high-performance power converters"
                className="case-study-img"
                loading="lazy"
              />
            </div>
          </div>

          <div className="case-study-card">
            <span className="case-study-tag">CREATIVITY</span>
            <h4 className="case-study-title">CREATE AND WORK TOGETHER</h4>
            <p className="case-study-desc">
              At AKJ International School, students collaborate on hands-on projects, share bold ideas, and discover the true value of teamwork and creative problem-solving.
            </p>
            <Link
              to="/services"
              className="case-study-link"
              aria-label="Learn more about BrightLoop Brand case study"
            >
              <svg
                className="case-study-arrow"
                width="13"
                height="13"
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
      </div>

      {/* MORE REFERENCES CTA BUTTON */}
      <div className="case-studies-cta-wrap">
        <Link to="/services" className="case-studies-more-btn" aria-label="Explore more references">
          <svg
            className="case-studies-more-arrow"
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
          <span>More references</span>
        </Link>
      </div>
    </section>
  );
}
