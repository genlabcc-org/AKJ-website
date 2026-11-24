import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './Preloader.css';

export default function Preloader({ onComplete, onRevealStart }) {
  const rootRef = useRef(null);
  const primaryLayerRef = useRef(null);
  const accentLayerRef = useRef(null);
  const centerRef = useRef(null);
  const progressFillRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      onRevealStart?.();
      const timer = setTimeout(() => {
        onComplete?.();
      }, 200);
      return () => clearTimeout(timer);
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          onComplete?.();
        },
      });

      tl.fromTo(
        centerRef.current,
        { opacity: 0, scale: 0.96, y: 14 },
        { opacity: 1, scale: 1, y: 0, duration: 0.85, ease: 'power3.out', force3D: true }
      )
        .fromTo(
          progressFillRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 2.35,
            ease: 'sine.inOut',
            force3D: true,
          },
          '-=0.3'
        )
        .set(rootRef.current, { pointerEvents: 'none' }, '+=0.18')
        .addLabel('curtainUp')
        .to(
          primaryLayerRef.current,
          {
            yPercent: -100,
            duration: 1.25,
            ease: 'power3.inOut',
            force3D: true,
          },
          'curtainUp'
        )
        .to(
          centerRef.current,
          {
            opacity: 0,
            duration: 0.45,
            ease: 'power2.out',
            force3D: true,
          },
          'curtainUp'
        )
        .to(
          accentLayerRef.current,
          {
            yPercent: -100,
            duration: 1.25,
            ease: 'power3.inOut',
            force3D: true,
          },
          'curtainUp+=0.3'
        )
        .call(
          () => {
            onRevealStart?.();
          },
          null,
          'curtainUp+=0.85'
        );
    }, rootRef);

    return () => ctx.revert();
  }, [onComplete, onRevealStart]);

  return (
    <div
      ref={rootRef}
      className="akj-preloader"
      role="status"
      aria-label="Loading AKJ International School"
    >
      {/* Second trailing blue curtain */}
      <div ref={accentLayerRef} className="akj-preloader-layer akj-preloader-accent" aria-hidden="true" />

      {/* Primary white curtain with centered logo, title, and progress bar */}
      <div ref={primaryLayerRef} className="akj-preloader-layer akj-preloader-primary">
        <div className="akj-preloader-center-wrap">
          <div ref={centerRef} className="akj-preloader-center">
            <img
              src="/images/akj-logo.svg"
              alt="AKJ International School"
              className="akj-preloader-logo"
            />
            <span className="akj-preloader-title">AKJ International School</span>
            <div className="akj-preloader-progress-track" aria-hidden="true">
              <div ref={progressFillRef} className="akj-preloader-progress-fill" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
