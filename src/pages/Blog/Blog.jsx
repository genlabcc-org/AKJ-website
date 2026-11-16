import React, { useState } from 'react';
import './Blog.css';
import '../Home/Home.css';

export default function Blog() {
  const [search, setSearch] = useState('');

  const articles = [
    {
      title: 'Finding the Right University: A Strategic Approach',
      category: 'University Guide',
      date: 'Oct 11, 2024',
      img: '/images/blog-1.jpg',
      excerpt: 'Choosing the perfect university is a life-changing decision that goes far beyond global rankings and prestige. Our expert advisors evaluate learning style, faculty mentorship, and career placement.'
    },
    {
      title: 'Precision University Matching: Find Your Perfect Academic Fit',
      category: 'Admissions Strategy',
      date: 'Oct 11, 2024',
      img: '/images/blog-2.jpg',
      excerpt: 'How strategic academic data, campus culture analysis, and early profiling transform overwhelming international choices into a clear, bespoke pathway for academic excellence.'
    },
    {
      title: 'The Boarding School Advantage: Why It Matters',
      category: 'Boarding Schools',
      date: 'Oct 10, 2024',
      img: '/images/blog-3.jpg',
      excerpt: 'Unlocking academic rigor, holistic leadership development, and lifelong global networks through premier UK and European boarding institutions.'
    },
    {
      title: 'Behind the Scenes: Our Placement Success Formula',
      category: 'Consulting Insights',
      date: 'Oct 08, 2024',
      img: '/images/blog-4.jpg',
      excerpt: 'An insider look into how admissions committees evaluate competitive applicant pools and how strategic story positioning creates an undeniable edge.'
    }
  ];

  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.category.toLowerCase().includes(search.toLowerCase())
  );

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
          <div className="blog-grid">
            {filtered.map((art, index) => (
              <article key={index} className="blog-card">
                <div className="blog-img-wrapper">
                  <img src={art.img} alt={art.title} className="blog-img" />
                </div>
                <div className="blog-body">
                  <div className="blog-meta">
                    <span className="blog-tag">{art.category}</span>
                    <span>{art.date}</span>
                  </div>
                  <h3 className="blog-title">{art.title}</h3>
                  <p className="blog-excerpt">{art.excerpt}</p>
                  <a href="#read" className="blog-link">
                    Read article →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
