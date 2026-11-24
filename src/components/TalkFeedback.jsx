import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import './TalkFeedback.css';

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function TalkFeedback() {
  const testimonials = [
    {
      id: 1,
      quote: 'Their work is of a very high standard.',
      author: 'P. B. Manager Agronomy'
    },
    {
      id: 2,
      quote: 'Real advisory value – that’s very important. They have a big-picture view.',
      author: 'A. B. Commercial Director'
    },
    {
      id: 3,
      quote: 'Very useful – we learnt a lot from them.',
      author: 'C.G. Communication Manager'
    },
    {
      id: 4,
      quote: 'They’re spot on in every respect.',
      author: 'N.M. Market Manager'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const quoteWrapRef = useRef(null);
  const quoteRef = useRef(null);
  const authorRef = useRef(null);
  const hasPlayedInitialRef = useRef(false);

  // Auto-cycle through the real quotes smoothly every 5.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !quoteRef.current || !authorRef.current) {
      return undefined;
    }

    let split = null;
    const ctx = gsap.context(() => {
      split = SplitText.create(quoteRef.current, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'akj-split-line',
        deepSlice: true,
        smartWrap: true,
      });

      split.masks?.forEach((maskEl) => {
        maskEl.style.paddingBottom = '0.12em';
        maskEl.style.marginBottom = '-0.12em';
      });

      const isInitialSlide = !hasPlayedInitialRef.current;
      hasPlayedInitialRef.current = true;
      const scrollTrigger = isInitialSlide
        ? {
            trigger: quoteWrapRef.current,
            start: 'top 91%',
            once: true,
          }
        : undefined;

      gsap.from(split.lines, {
        yPercent: 95,
        opacity: 0,
        duration: 0.9,
        stagger: 0.06,
        ease: 'power3.out',
        force3D: true,
        clearProps: 'transform,opacity',
        ...(scrollTrigger ? { scrollTrigger } : {}),
      });

      gsap.fromTo(
        authorRef.current,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.16,
          ease: 'power3.out',
          force3D: true,
          clearProps: 'transform,opacity',
          ...(scrollTrigger ? { scrollTrigger } : {}),
        }
      );
    }, quoteWrapRef);

    return () => {
      split?.revert();
      ctx.revert();
    };
  }, [currentIndex]);

  const current = testimonials[currentIndex];

  return (
    <section className="talk-feedback-section" aria-label="Let's Talk and Customer Feedback">
      {/* SECTION TOP DIVIDER */}
      <div className="talk-feedback-divider"></div>

      <div className="talk-feedback-grid">
        {/* LEFT COLUMN: LET'S TALK */}
        <div className="talk-col">
          <h2 className="talk-feedback-heading">Apply / Book a Visit</h2>
          <p className="talk-feedback-lead">
            Do you have a project, a question, or would you like to find out more about us? We’d be happy to answer any questions you may have!
          </p>
          <Link to="/contact" className="talk-feedback-btn" aria-label="Get in touch with us">
            <svg
              className="talk-feedback-arrow"
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
            <span>Get in touch</span>
          </Link>
        </div>

        {/* RIGHT COLUMN: CUSTOMER FEEDBACK */}
        <div className="feedback-col">
          <h2 className="talk-feedback-heading">Latest achievements </h2>
          <div ref={quoteWrapRef} className="feedback-quote-container" data-no-gsap-text="true">
            <blockquote ref={quoteRef} key={current.id} className="feedback-quote">
              {current.quote}
            </blockquote>
            <p ref={authorRef} key={`author-${current.id}`} className="feedback-author">
              {current.author}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
