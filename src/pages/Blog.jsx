import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabase';
import './Blog.css';

const SEEDED_DUMMY_TITLES = new Set([
  'Building a Personal Brand',
  'Introduction to AI Ethics',
  'Intro to Data Analysis',
  'Designing for Accessibility',
  'Modern UI Design Tips',
]);

const REFERENCE_ARTICLES = [
  {
    id: 'bbb-1',
    title:
      'INDUSTRIAL AND TECHNOLOGY COMPANIES: HOW TO CHOOSE A B2B MARKETING AND COMMUNICATIONS AGENCY?',
    excerpt:
      'For an industrial or technology company, choosing a B2B marketing and communications agency means assessing six key capabilities: understanding techni...',
    content:
      'For an industrial or technology company, choosing a B2B marketing and communications agency means assessing six key capabilities: understanding technical ecosystems, positioning complex solutions clearly, aligning sales and marketing teams, and building long-term international brand equity.',
    category: 'MARKETING & B2B COMMUNICATION',
    filterTag: 'IDEARS',
    shortBannerTitle: 'FINDING THE\nRIGHT AGENCY',
    bannerTheme: 'cube',
    thumb: '/images/blog-1.jpg',
    author: 'bb&b Editorial',
    publish_date: '16 May, 2023',
    read_time: '5 min read',
  },
  {
    id: 'bbb-2',
    title: 'WELCOME TO THE NEW BB&B WEBSITE',
    excerpt:
      'Same address, new look. Fresher, lighter, more vibrant: our new website is now live. We wanted it to reflect what bb&b stands for: clear, precise and ...',
    content:
      'Same address, new look. Fresher, lighter, more vibrant: our new website is now live. We wanted it to reflect what bb&b stands for: clear, precise and forward-looking communication for ambitious industrial and technology companies.',
    category: 'CONTEMPORARY\nWEB DESIGN',
    filterTag: 'NEWS',
    shortBannerTitle: 'WELCOME\nTO THE NEW\nBB&B WEBSITE',
    bannerTheme: 'phone',
    thumb: '/images/blog-2.jpg',
    author: 'bb&b Editorial',
    publish_date: '16 May, 2023',
    read_time: '4 min read',
  },
  {
    id: 'bbb-3',
    title: 'BE CONSISTENT — OR BE NOTHING.',
    excerpt:
      'Consistency is one of the toughest and most important things to achieve in communication. Why? Because anyone can claim anything, at any time, across ...',
    content:
      'Consistency is one of the toughest and most important things to achieve in communication. Why? Because anyone can claim anything, at any time, across any channel. True brand trust is built when every touchpoint reinforces the same core message.',
    category: 'B2B\nCOMMUNICATION',
    filterTag: 'IDEARS',
    shortBannerTitle: 'WHAT REALLY\nMATTERS',
    bannerTheme: 'lattice',
    thumb: '/images/blog-3.jpg',
    author: 'bb&b Editorial',
    publish_date: '14 May, 2023',
    read_time: '6 min read',
  },
];

const FILTER_TABS = ['SEE ALL', 'NEWS', 'IDEARS', 'WHITE PAPERS', 'PRODUCTIONS'];

function getExcerpt(art) {
  if (art.excerpt) return art.excerpt;
  if (!art.content) return '';
  return art.content.length > 152 ? `${art.content.slice(0, 152)} ...` : art.content;
}

function getShortBannerTitle(title) {
  if (!title) return '';
  const words = title.split(/\s+/);
  return words.slice(0, 4).join(' ');
}

function DiagonalArrow({ className = '' }) {
  return (
    <svg
      className={className}
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
        strokeWidth="1.9"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

export default function Blog() {
  const [activeFilter, setActiveFilter] = useState('SEE ALL');
  const [customArticles, setCustomArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    if (!supabase) return;
    let active = true;

    const loadBlogs = async () => {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('status', 'Published')
          .order('id', { ascending: false });

        if (active && !error && data) {
          const userAdded = data.filter(
            (row) => !SEEDED_DUMMY_TITLES.has(row.title)
          );
          setCustomArticles(userAdded);
        }
      } catch {
        // Keep reference articles
      }
    };

    loadBlogs();
    return () => {
      active = false;
    };
  }, []);

  const allArticles = useMemo(() => {
    return [...customArticles, ...REFERENCE_ARTICLES];
  }, [customArticles]);

  const filteredArticles = useMemo(() => {
    if (activeFilter === 'SEE ALL') return allArticles;
    const target = activeFilter.toLowerCase();
    return allArticles.filter((art) => {
      const cat = (art.category || '').toLowerCase();
      const tag = (art.filterTag || '').toLowerCase();
      return cat.includes(target) || tag === target;
    });
  }, [allArticles, activeFilter]);

  return (
    <div className="bbb-blog-page">
      {/* Fixed right-edge contact icon matching reference */}
      <a href="/contact" className="bbb-floating-mail" aria-label="Contact us">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="3" y="5" width="18" height="14" rx="1" />
          <polyline points="3 6 12 13 21 6" />
        </svg>
      </a>

      <div className="bbb-blog-container">
        {/* TOP EDITORIAL HERO */}
        <section className="bbb-hero-section">
          <div className="bbb-hero-left">
            <span className="bbb-hero-kicker">DIFFERENT PERSPECTIVES, NEW HORIZONS</span>
          </div>

          <div className="bbb-hero-right">
            <h1 className="bbb-hero-title">WHAT&apos;S UP ?</h1>
            <p className="bbb-hero-desc">
              Our ambition is to look beyond conventional and standardised thinking.
              We aspire to contribute sustainably to society by thinking differently.
              Here you will find the sources and product of our mindset and
              observations, and our latest projects.
            </p>
          </div>
        </section>

        {/* CATEGORY FILTER TABS */}
        <nav className="bbb-filter-bar" aria-label="Blog categories">
          <ul className="bbb-filter-list">
            {FILTER_TABS.map((tab) => (
              <li key={tab}>
                <button
                  type="button"
                  className={`bbb-filter-btn ${activeFilter === tab ? 'active' : ''}`}
                  onClick={() => setActiveFilter(tab)}
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* ARTICLES HORIZONTAL LIST */}
        <section className="bbb-articles-section">
          {filteredArticles.length === 0 ? (
            <p className="bbb-empty-state">No articles found in this category.</p>
          ) : (
            <div className="bbb-articles-list">
              {filteredArticles.map((art) => {
                const bannerCategory = art.category || 'UNIVERSITY GUIDE';
                const bannerHeading =
                  art.shortBannerTitle || getShortBannerTitle(art.title);
                const excerpt = getExcerpt(art);

                return (
                  <article key={art.id} className="bbb-article-row">
                    <div className="bbb-article-left">
                      <h2
                        className="bbb-article-title"
                        onClick={() => setSelectedArticle(art)}
                      >
                        {art.title}
                      </h2>
                      <p className="bbb-article-excerpt">{excerpt}</p>
                      <button
                        type="button"
                        className="bbb-learn-more-btn"
                        onClick={() => setSelectedArticle(art)}
                      >
                        <DiagonalArrow className="bbb-learn-arrow" />
                        <span>Learn more</span>
                      </button>
                    </div>

                    <div
                      className="bbb-article-right"
                      onClick={() => setSelectedArticle(art)}
                    >
                      <div
                        className={`bbb-thumb-card ${
                          art.bannerTheme ? `theme-${art.bannerTheme}` : ''
                        }`}
                      >
                        {!art.bannerTheme && (
                          <img
                            src={art.thumb || '/images/blog-1.jpg'}
                            alt={art.title}
                            className="bbb-thumb-img"
                          />
                        )}

                        {/* Bespoke 3D artwork layers matching the 3 reference banners */}
                        {art.bannerTheme === 'cube' && (
                          <div className="bbb-art-cube" aria-hidden="true">
                            <div className="cube-grid-lines"></div>
                            <div className="cube-pit"></div>
                            <div className="cube-block">
                              <div className="cube-face-top"></div>
                              <div className="cube-face-left"></div>
                              <div className="cube-face-right"></div>
                            </div>
                          </div>
                        )}

                        {art.bannerTheme === 'phone' && (
                          <div className="bbb-art-phone" aria-hidden="true">
                            <div className="phone-device">
                              <div className="phone-notch"></div>
                              <div className="phone-brand">bb&amp;b</div>
                              <div className="phone-headline">
                                COMPLEX
                                <br />
                                BUSINESS. CLEAR
                                <br />
                                COMMUNICATIONS.
                              </div>
                              <div className="phone-wave"></div>
                            </div>
                          </div>
                        )}

                        {art.bannerTheme === 'lattice' && (
                          <div className="bbb-art-lattice" aria-hidden="true">
                            <div className="lattice-node-orange"></div>
                            <div className="lattice-bars"></div>
                          </div>
                        )}

                        <div
                          className={`bbb-thumb-overlay ${
                            art.bannerTheme === 'lattice' ? 'overlay-light' : ''
                          }`}
                        >
                          <DiagonalArrow className="bbb-thumb-arrow-svg" />
                          <span className="bbb-thumb-cat">{bannerCategory}</span>
                          <span className="bbb-thumb-heading">{bannerHeading}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* ARTICLE READER MODAL */}
      {selectedArticle && (
        <div
          className="bbb-modal-backdrop"
          onClick={() => setSelectedArticle(null)}
        >
          <article className="bbb-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="bbb-modal-close"
              onClick={() => setSelectedArticle(null)}
              aria-label="Close article"
            >
              &times;
            </button>
            {selectedArticle.thumb && !selectedArticle.bannerTheme && (
              <img
                src={selectedArticle.thumb}
                alt={selectedArticle.title}
                className="bbb-modal-img"
              />
            )}
            <div className="bbb-modal-meta">
              {selectedArticle.category && (
                <span className="bbb-modal-tag">
                  {selectedArticle.category.replace(/\n/g, ' ')}
                </span>
              )}
              {selectedArticle.publish_date && (
                <span>{selectedArticle.publish_date}</span>
              )}
              {selectedArticle.read_time && (
                <span>{selectedArticle.read_time}</span>
              )}
            </div>
            <h2 className="bbb-modal-title">{selectedArticle.title}</h2>
            {selectedArticle.author && (
              <p className="bbb-modal-author">By {selectedArticle.author}</p>
            )}
            <div className="bbb-modal-content">
              {selectedArticle.content || 'No article content available.'}
            </div>
          </article>
        </div>
      )}
    </div>
  );
}
