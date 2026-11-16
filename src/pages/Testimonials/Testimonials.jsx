import React from 'react';
import './Testimonials.css';
import '../Home/Home.css';

export default function Testimonials() {
  const reviews = [
    {
      name: 'Haim Georgia',
      role: 'Accepted to University of Warwick',
      quote: '“Thank you, I got into the university I wanted! The personal statement refinement and interview preparation gave me absolute confidence in facing the admissions board.”',
      img: '/images/testimonial-1.jpg',
      stars: 5
    },
    {
      name: 'David Esenbau',
      role: 'Passionate about technology, Imperial College London',
      quote: '“The support and information I received helped me pass the entrance exams. My consultant guided me through complex math admissions tests step-by-step.”',
      img: '/images/testimonial-2.jpg',
      stars: 5
    },
    {
      name: 'Elena Smith',
      role: 'Student, Munich International School to Oxford',
      quote: '“They simplified the school enrollment process completely! Acadly transformed what felt like an overwhelming mountain of paperwork into an organized checklist.”',
      img: '/images/testimonial-3.jpg',
      stars: 5
    },
    {
      name: 'Sophie Laurent',
      role: 'Parent, Geneva',
      quote: '“Finding the right boarding school for our daughter was stressful until we partnered with Acadly. Their relationships with headmasters in the UK are truly unmatched.”',
      img: '/images/testimonial-4.jpg',
      stars: 5
    },
    {
      name: 'Marcus Weber',
      role: 'Admitted to IE Business School, Madrid',
      quote: '“Acadly helped position my non-traditional academic background into my greatest strength. I received offers from three of my top-choice universities with partial scholarships!”',
      img: '/images/testimonial-5.jpg',
      stars: 5
    }
  ];

  return (
    <div className="page-container testimonials-page">
      <section className="page-hero">
        <div className="container">
          <span className="badge-tag">Student Success</span>
          <h1 className="page-hero-title">Words from Our Clients</h1>
          <p className="page-hero-subtitle">
            Discover real stories from ambitious students and families who achieved admission to their dream boarding schools and global universities.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="testimonials-full-grid">
            {reviews.map((rev, index) => (
              <div key={index} className="testimonial-large-card">
                <div>
                  <div className="acceptance-badge">✓ Verified Placement</div>
                  <div className="testimonial-stars" style={{ fontSize: '18px' }}>
                    {'★'.repeat(rev.stars)}
                  </div>
                  <p className="testimonial-quote" style={{ fontSize: '18px', marginTop: '12px' }}>
                    {rev.quote}
                  </p>
                </div>

                <div className="testimonial-author">
                  <img
                    src={rev.img}
                    alt={rev.name}
                    className="testimonial-avatar"
                    style={{ width: '56px', height: '56px' }}
                  />
                  <div>
                    <div className="author-name" style={{ fontSize: '16px' }}>{rev.name}</div>
                    <div className="author-role">{rev.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
