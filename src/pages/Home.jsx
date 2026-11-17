import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import HeroVideo from '../components/HeroVideo';
import AgencyIntro from '../components/AgencyIntro';
import { supabase } from '../supabase';
import './Home.css';

export default function Home() {
  const [recentBlogs, setRecentBlogs] = useState([]);

  useEffect(() => {
    if (!supabase) return;
    let active = true;

    const loadRecentBlogs = async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'Published')
        .order('id', { ascending: false })
        .limit(3);

      if (active && !error && data) {
        setRecentBlogs(data);
      }
    };

    loadRecentBlogs();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <PageHero
        title={
          <>
            Global Education.<br />
            Tailored Admissions.
          </>
        }
        subtitle="From the first call to your destination — university & boarding school consultancy"
      />

      {/* HERO VIDEO */}
      <HeroVideo src="/service-1.mp4" />

      {/* AGENCY INTRO */}
      <AgencyIntro />

      {/* BLOG / EDUCATION ARTICLES */}
      <section id="blog" className="section blog-section">
        <div className="container">
          <div className="section-heading-wrapper" style={{ textAlign: 'center' }}>
            <span className="badge-tag">Education Articles</span>
            <h2 className="section-title">Real World Reviews</h2>
          </div>

          {recentBlogs.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--color-muted)', marginBottom: '32px' }}>
              No articles published yet.
            </p>
          ) : (
            <div className="blog-grid">
              {recentBlogs.map((art) => (
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
                      <p className="blog-excerpt">
                        {art.content.length > 160
                          ? `${art.content.slice(0, 160)}...`
                          : art.content}
                      </p>
                    )}
                    <Link to="/blog" className="blog-link">
                      Read article →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center' }}>
            <Link to="/blog" className="btn-secondary">
              Read all articles
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
