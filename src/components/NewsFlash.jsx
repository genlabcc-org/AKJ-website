import React from 'react';
import { Link } from 'react-router-dom';
import './NewsFlash.css';

export default function NewsFlash() {
  const newsItems = [
    {
      id: 'choix-agence',
      title: 'INDUSTRIAL AND TECHNOLOGY COMPANIES: HOW TO CHOOSE A B2B MARKETING AND COMMUNICATIONS AGENCY?',
      desc: 'For an industrial or technology company, choosing a B2B marketing and communications agency means assessing six key capabilities: understanding technical issues, mastering strategic methodology, crafting impactful storytelling, executing cross-channel campaigns, measuring ROI, and international reach.',
      image: '/images/12_CHOIX_AGENCE.jpg',
      alt: 'Finding the right agency - Marketing and B2B communication',
      link: '/blog'
    },
    {
      id: 'new-website',
      title: 'WELCOME TO THE NEW BB&B WEBSITE',
      desc: 'Same address, new look. Fresher, lighter, more vibrant: our new website is now live. We wanted it to reflect what bb&b stands for: clear, precise and forward-thinking B2B communication.',
      image: '/images/11_new-site-web-2026_POST_1-scaled.jpg',
      alt: 'Contemporary web design - Welcome to the new bb&b website',
      link: '/blog'
    },
    {
      id: 'be-consistent',
      title: 'BE CONSISTENT — OR BE NOTHING.',
      desc: 'Consistency is one of the toughest and most important things to achieve in communication. Why? Because anyone can claim anything, at any time, across all touchpoints. Building a coherent and trustworthy industrial brand requires rigorous alignment.',
      image: '/images/10_Be_consistent_POST-scaled.jpg',
      alt: 'B2B communication - What really matters',
      link: '/blog'
    }
  ];

  return (
    <section className="newsflash-section" aria-label="Our News and Newsflash">
      {/* TOP DIVIDER */}
      <div className="newsflash-divider"></div>

      {/* HEADER */}
      <div className="newsflash-header">
        <p className="newsflash-eyebrow">OUR NEWS</p>
        <h2 className="newsflash-heading">NEWSFLASH</h2>
        <p className="newsflash-lead">
          News from our customers, latest solutions deployed by the agency and jobs to be filled ... Find everything here in our latest news.
        </p>
      </div>

      {/* DIVIDER UNDER INTRO */}
      <div className="newsflash-sub-divider"></div>

      {/* NEWS LIST */}
      <div className="newsflash-list">
        {newsItems.map((item) => (
          <article key={item.id} className="newsflash-item">
            {/* LEFT: TEXT CONTENT */}
            <div className="newsflash-item-content">
              <h3 className="newsflash-item-title">{item.title}</h3>
              <p className="newsflash-item-desc">{item.desc}</p>
              <Link
                to={item.link}
                className="newsflash-item-link"
                aria-label={`Read more about: ${item.title}`}
              >
                <svg
                  className="newsflash-arrow"
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

            {/* RIGHT: IMAGE */}
            <div className="newsflash-item-media">
              <div className="newsflash-img-wrap">
                <img
                  src={item.image}
                  alt={item.alt}
                  className="newsflash-img"
                  loading="lazy"
                />
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* MORE NEWS CTA BUTTON */}
      <div className="newsflash-cta-wrap">
        <Link to="/blog" className="newsflash-more-btn" aria-label="Explore more news">
          <svg
            className="newsflash-more-arrow"
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
          <span>More news</span>
        </Link>
      </div>
    </section>
  );
}
