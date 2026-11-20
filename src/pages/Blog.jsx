import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase, normalizeBlogRow } from '../supabase';
import './Blog.css';

const FILTER_TABS = ['SEE ALL', 'NEWS', 'IDEARS', 'WHITE PAPERS', 'PRODUCTIONS'];

function cleanMarkdownPreview(text) {
  if (!text) return '';
  return text
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .trim();
}

function getExcerpt(art) {
  if (art.excerpt) return art.excerpt;
  if (!art.content) return '';
  const cleaned = cleanMarkdownPreview(art.content);
  return cleaned.length > 152 ? `${cleaned.slice(0, 152)} ...` : cleaned;
}

function getShortBannerTitle(title) {
  if (!title) return '';
  const words = title.split(/\s+/);
  return words.slice(0, 4).join(' ');
}

function renderFormattedInline(text) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function renderArticleBlocks(content) {
  if (!content) {
    return <p className="bbb-full-paragraph">No article content available.</p>;
  }

  const lines = content.split('\n');
  const blocks = [];
  let keyCounter = 0;

  for (let i = 0; i < lines.length; i += 1) {
    const rawLine = lines[i].trim();
    if (!rawLine) continue;

    if (rawLine.startsWith('### ')) {
      blocks.push(
        <h3 key={`b-${keyCounter++}`} className="bbb-full-h3">
          {renderFormattedInline(rawLine.slice(4))}
        </h3>
      );
    } else if (rawLine.startsWith('## ')) {
      blocks.push(
        <h2 key={`b-${keyCounter++}`} className="bbb-full-h2">
          {renderFormattedInline(rawLine.slice(3))}
        </h2>
      );
    } else if (rawLine.startsWith('# ')) {
      blocks.push(
        <h2 key={`b-${keyCounter++}`} className="bbb-full-h2">
          {renderFormattedInline(rawLine.slice(2))}
        </h2>
      );
    } else if (rawLine.startsWith('• ') || rawLine.startsWith('- ')) {
      blocks.push(
        <li key={`b-${keyCounter++}`} className="bbb-full-list-item">
          {renderFormattedInline(rawLine.slice(2))}
        </li>
      );
    } else {
      blocks.push(
        <p key={`b-${keyCounter++}`} className="bbb-full-paragraph">
          {renderFormattedInline(rawLine)}
        </p>
      );
    }
  }

  return blocks;
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
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState('SEE ALL');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let active = true;

    const loadBlogs = async () => {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('status', 'Published')
          .order('id', { ascending: false });

        if (active && !error && data) {
          setArticles(data.map(normalizeBlogRow));
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadBlogs();
    return () => {
      active = false;
    };
  }, []);

  // Sync URL param `/blog/:id` with active article
  const activeArticle = useMemo(() => {
    if (selectedArticle && (!id || String(selectedArticle.id) === String(id))) {
      return selectedArticle;
    }
    if (id && articles.length > 0) {
      return articles.find((a) => String(a.id) === String(id)) || null;
    }
    return null;
  }, [id, articles, selectedArticle]);

  const handleOpenArticle = (art) => {
    setSelectedArticle(art);
    navigate(`/blog/${art.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedArticle(null);
    navigate('/blog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredArticles = useMemo(() => {
    if (activeFilter === 'SEE ALL') return articles;
    const target = activeFilter.toLowerCase();
    return articles.filter((art) => {
      const cat = (art.category || '').toLowerCase();
      return cat.includes(target);
    });
  }, [articles, activeFilter]);

  return (
    <div className="bbb-blog-page">
      {/* Fixed right-edge contact icon matching reference */}
     

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
          
        </nav>

        {/* ARTICLES HORIZONTAL LIST */}
        <section className="bbb-articles-section">
          {loading ? (
            <p className="bbb-empty-state">Loading articles...</p>
          ) : filteredArticles.length === 0 ? (
            <p className="bbb-empty-state">No articles published yet.</p>
          ) : (
            <div className="bbb-articles-list">
              {filteredArticles.map((art) => {
                const bannerCategory = art.category || 'UNIVERSITY GUIDE';
                const bannerHeading = getShortBannerTitle(art.title);
                const excerpt = getExcerpt(art);

                return (
                  <article key={art.id} className="bbb-article-row">
                    <div className="bbb-article-left">
                      <h2
                        className="bbb-article-title"
                        onClick={() => handleOpenArticle(art)}
                      >
                        {art.title}
                      </h2>
                      {excerpt && <p className="bbb-article-excerpt">{excerpt}</p>}
                      <button
                        type="button"
                        className="bbb-learn-more-btn"
                        onClick={() => handleOpenArticle(art)}
                      >
                        <DiagonalArrow className="bbb-learn-arrow" />
                        <span>Learn more</span>
                      </button>
                    </div>

                    <div
                      className="bbb-article-right"
                      onClick={() => handleOpenArticle(art)}
                    >
                      <div className="bbb-thumb-card">
                        {art.thumb && (
                          <img
                            src={art.thumb}
                            alt={art.title}
                            className="bbb-thumb-img"
                          />
                        )}
                        <div className="bbb-thumb-overlay">
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
            {selectedArticle.thumb && (
              <img
                src={selectedArticle.thumb}
                alt={selectedArticle.title}
                className="bbb-modal-img"
              />
            )}
            <div className="bbb-modal-meta">
              {selectedArticle.category && (
                <span className="bbb-modal-tag">{selectedArticle.category}</span>
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
