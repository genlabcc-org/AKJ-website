import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import './Blog.css';
import './Home.css';

function getExcerpt(content) {
  if (!content) return '';
  return content.length > 150 ? `${content.slice(0, 150)}...` : content;
}

export default function Blog() {
  const [search, setSearch] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(Boolean(supabase));
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
          setArticles(data);
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

  const filtered = articles.filter((a) => {
    const q = search.toLowerCase();
    return (
      (a.title || '').toLowerCase().includes(q) ||
      (a.category || '').toLowerCase().includes(q) ||
      (a.content || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="page-container blog-page">
      <section className="page-hero">
        <div className="container">
          <span className="badge-tag">Knowledge Hub</span>
          <h1 className="page-hero-title">Useful Educational Articles</h1>
          <p className="page-hero-subtitle">
            Essential guides, strategic insights, and admissions advice from senior university consultants.
          </p>

          <div className="blog-header-search">
            <input
              type="text"
              placeholder="Search articles by title or topic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="blog-search-input"
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {loading ? (
            <p className="blog-empty-state">Loading articles...</p>
          ) : filtered.length === 0 ? (
            <p className="blog-empty-state">
              {search.trim()
                ? 'No articles match your search.'
                : 'No articles published yet.'}
            </p>
          ) : (
            <div className="blog-grid">
              {filtered.map((art) => (
                <article key={art.id} className="blog-card">
                  {art.thumb && (
                    <div className="blog-img-wrapper">
                      <img src={art.thumb} alt={art.title} className="blog-img" />
                    </div>
                  )}
                  <div className="blog-body">
                    <div className="blog-meta">
                      {art.category && <span className="blog-tag">{art.category}</span>}
                      <span>{art.publish_date}</span>
                    </div>
                    <h3 className="blog-title">{art.title}</h3>
                    {art.content && (
                      <p className="blog-excerpt">{getExcerpt(art.content)}</p>
                    )}
                    <button
                      type="button"
                      className="blog-link blog-read-btn"
                      onClick={() => setSelectedArticle(art)}
                    >
                      Read article →
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedArticle && (
        <div className="blog-modal-backdrop" onClick={() => setSelectedArticle(null)}>
          <article className="blog-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="blog-modal-close"
              onClick={() => setSelectedArticle(null)}
              aria-label="Close article"
            >
              &times;
            </button>
            {selectedArticle.thumb && (
              <img
                src={selectedArticle.thumb}
                alt={selectedArticle.title}
                className="blog-modal-img"
              />
            )}
            <div className="blog-meta">
              {selectedArticle.category && (
                <span className="blog-tag">{selectedArticle.category}</span>
              )}
              <span>{selectedArticle.publish_date}</span>
              {selectedArticle.read_time && <span>{selectedArticle.read_time}</span>}
            </div>
            <h2 className="blog-modal-title">{selectedArticle.title}</h2>
            <p className="blog-modal-author">By {selectedArticle.author}</p>
            <div className="blog-modal-content">
              {selectedArticle.content || 'No article content available.'}
            </div>
          </article>
        </div>
      )}
    </div>
  );
}
