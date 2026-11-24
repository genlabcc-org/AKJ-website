import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

const SPLIT_HEADING_SELECTOR = [
  '.site-hero-mainline',
  '.site-hero-subline',
  '.site-hero-subtitle',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  '.agency-intro-eyebrow',
  '.agency-apart-eyebrow',
  '.home-videos-eyebrow',
  '.bbb-about-kicker',
  '.bbb-pathway-kicker',
  '.bbb-faq-kicker',
  '.bbb-team-kicker',
  '.bbb-form-kicker',
  '.case-study-tag',
  '.newsflash-item-date',
  '.home-video-date',
  '.bbb-learners-group-title',
  '.bbb-learners-group-count',
  '.bbb-team-group-count',
  '.bbb-team-card-dept',
  '.bbb-full-author',
].join(', ');

const SPLIT_BODY_SELECTOR = [
  'p',
  '.bbb-team-card-bio',
  '.bbb-hero-desc',
].join(', ');

const GLIDE_ITEM_SELECTOR = [
  '.bbb-faq-arrow-item',
  '.akj-footer-list li',
  '.akj-footer-contact-item',
  '.akj-footer-copyright',
  '.akj-footer-legal-links',
  '.bbb-centre-badge',
  '.bbb-centre-code',
  '.bbb-learner-stage-pill',
  '.bbb-learner-grades-tag',
  '.agency-intro-btn',
  '.case-study-link',
  '.newsflash-item-link',
  '.newsflash-more-btn',
  '.talk-feedback-btn',
  '.bbb-about-pill-btn',
  '.bbb-subject-inquiry-btn',
  '.bbb-team-pill-btn',
  '.bbb-full-back-btn',
  '.akj-footer-cta-btn',
  '.service-feature-item',
  '.approach-box li',
  '.admission-step-item',
  '.admission-field label',
].join(', ');

const SKIP_ANCESTOR_SELECTOR = [
  '.akj-preloader',
  '.akj-navbar-wrapper',
  'header',
  'nav',
  '.home-videos-marquee-track',
  '[data-no-gsap-text="true"]',
  '[aria-hidden="true"]',
  '.admin-route',
].join(', ');

function hasBlockChild(el) {
  return Array.from(el.children).some((child) => {
    const display = window.getComputedStyle(child).display;
    return display === 'block' || display === 'flex' || display === 'grid';
  });
}

function shouldSkipElement(el, initializedSet) {
  if (!el || initializedSet.has(el)) return true;
  if (el.closest(SKIP_ANCESTOR_SELECTOR)) return true;
  if (el.closest('.akj-split-line')) return true;
  if (!el.textContent || !el.textContent.trim()) return true;

  const rect = el.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return true;

  return false;
}

export default function SiteTextAnimations({ pathname, revealReady }) {
  const revealReadyRef = useRef(revealReady);
  const pausedHeroTweensRef = useRef([]);

  useEffect(() => {
    revealReadyRef.current = revealReady;
    if (revealReady && pausedHeroTweensRef.current.length > 0) {
      const tweens = pausedHeroTweensRef.current;
      pausedHeroTweensRef.current = [];
      tweens.forEach((tween) => {
        if (tween && tween.isActive?.() === false) {
          tween.play();
        }
      });
    }
  }, [revealReady]);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      return undefined;
    }

    const container = document.getElementById('smooth-content');
    if (!container) return undefined;

    let cancelled = false;
    let rafId = null;
    let scanTimeoutId = null;
    let observer = null;
    const initialized = new WeakSet();
    const cleanups = [];
    const ctx = gsap.context(() => {}, container);

    const registerMaskPadding = (split) => {
      split.masks?.forEach((maskEl) => {
        maskEl.style.paddingBottom = '0.12em';
        maskEl.style.marginBottom = '-0.12em';
      });
    };

    const animateSplitElement = (el, variant, heroIndexRef) => {
      if (shouldSkipElement(el, initialized)) return;

      // Never split elements wrapping block children (like .site-hero-title) or SVG/media nodes
      if (hasBlockChild(el) || el.querySelector('svg, img, input, textarea, select')) {
        if (el.classList.contains('site-hero-title')) return;
        initialized.add(el);
        animateGlideElement(el, heroIndexRef);
        return;
      }

      initialized.add(el);
      const rect = el.getBoundingClientRect();
      const isAboveFold = rect.top < window.innerHeight * 0.92;
      const isHeading = variant === 'heading';
      const delay = isAboveFold ? Math.min(0.42, heroIndexRef.current * 0.08) : 0;
      if (isAboveFold) heroIndexRef.current += 1;

      ctx.add(() => {
        const split = SplitText.create(el, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'akj-split-line',
          deepSlice: true,
          smartWrap: true,
          autoSplit: true,
          onSplit(self) {
            registerMaskPadding(self);

            if (el.dataset.gsapTextRevealed === 'true' || !self.lines?.length) {
              return undefined;
            }

            const lineCount = self.lines.length;
            const baseStagger = isHeading ? 0.085 : 0.055;
            const stagger = Math.min(baseStagger, 0.48 / Math.max(1, lineCount));

            const tween = gsap.from(self.lines, {
              yPercent: isHeading ? 105 : 88,
              opacity: 0,
              duration: isHeading ? 1.05 : 0.95,
              stagger,
              delay,
              ease: 'power3.out',
              force3D: true,
              paused: isAboveFold && !revealReadyRef.current,
              clearProps: 'transform,opacity',
              onComplete: () => {
                el.dataset.gsapTextRevealed = 'true';
              },
              ...(isAboveFold
                ? {}
                : {
                    scrollTrigger: {
                      trigger: el,
                      start: 'top 91%',
                      once: true,
                    },
                  }),
            });

            if (isAboveFold && !revealReadyRef.current) {
              pausedHeroTweensRef.current.push(tween);
            }

            return tween;
          },
        });

        cleanups.push(() => {
          split?.revert();
        });
      });
    };

    const animateGlideElement = (el, heroIndexRef) => {
      if (shouldSkipElement(el, initialized)) return;
      initialized.add(el);

      const rect = el.getBoundingClientRect();
      const isAboveFold = rect.top < window.innerHeight * 0.92;
      const delay = isAboveFold ? Math.min(0.45, heroIndexRef.current * 0.07) : 0;
      if (isAboveFold) heroIndexRef.current += 1;

      ctx.add(() => {
        const tween = gsap.fromTo(
          el,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            delay,
            ease: 'power3.out',
            force3D: true,
            paused: isAboveFold && !revealReadyRef.current,
            clearProps: 'transform,opacity',
            onComplete: () => {
              el.dataset.gsapTextRevealed = 'true';
            },
            ...(isAboveFold
              ? {}
              : {
                  scrollTrigger: {
                    trigger: el,
                    start: 'top 93%',
                    once: true,
                  },
                }),
          }
        );

        if (isAboveFold && !revealReadyRef.current) {
          pausedHeroTweensRef.current.push(tween);
        }
      });
    };

    const scanAndAnimate = () => {
      if (cancelled) return;
      const heroIndexRef = { current: 0 };

      const headings = container.querySelectorAll(SPLIT_HEADING_SELECTOR);
      headings.forEach((el) => animateSplitElement(el, 'heading', heroIndexRef));

      const bodies = container.querySelectorAll(SPLIT_BODY_SELECTOR);
      bodies.forEach((el) => animateSplitElement(el, 'body', heroIndexRef));

      const glideItems = container.querySelectorAll(GLIDE_ITEM_SELECTOR);
      glideItems.forEach((el) => animateGlideElement(el, heroIndexRef));

      ScrollTrigger.refresh();
    };

    const fontsReady = document.fonts?.ready ?? Promise.resolve();

    fontsReady.then(() => {
      if (cancelled) return;
      rafId = requestAnimationFrame(() => {
        scanAndAnimate();

        observer = new MutationObserver((mutations) => {
          const hasRelevantNodes = mutations.some((m) => {
            if (initialized.has(m.target) || m.target.closest?.('.akj-split-line')) {
              return false;
            }
            return (
              m.addedNodes.length > 0 &&
              Array.from(m.addedNodes).some((n) => {
                if (n.nodeType !== Node.ELEMENT_NODE) return false;
                const cls = typeof n.className === 'string' ? n.className : '';
                return !cls.includes('akj-split-line');
              })
            );
          });
          if (!hasRelevantNodes) return;

          clearTimeout(scanTimeoutId);
          scanTimeoutId = setTimeout(() => {
            if (!cancelled) scanAndAnimate();
          }, 60);
        });

        observer.observe(container, { childList: true, subtree: true });
      });
    });

    return () => {
      cancelled = true;
      pausedHeroTweensRef.current = [];
      if (rafId !== null) cancelAnimationFrame(rafId);
      clearTimeout(scanTimeoutId);
      observer?.disconnect();
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, [pathname]);

  return null;
}
