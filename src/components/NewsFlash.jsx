import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { supabase, normalizeBlogRow } from '../supabase';
import './NewsFlash.css';

gsap.registerPlugin(ScrollTrigger);

function getExcerpt(item) {
  if (item.desc) return item.desc;
  if (!item.content) return '';
  return item.content.length > 220
    ? `${item.content.slice(0, 220)}...`
    : item.content;
}

export default function NewsFlash({ blogs }) {
  const [fetchedBlogs, setFetchedBlogs] = useState([]);
  const [loading, setLoading] = useState(Boolean(supabase && !blogs));
  const sectionRef = useRef(null);

  useEffect(() => {
    if (blogs || !supabase) {
      setLoading(false);
      return;
    }

    let active = true;

    const loadTopBlogs = async () => {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('status', 'Published')
          .order('id', { ascending: false })
          .limit(3);

        if (active && !error && data) {
          setFetchedBlogs(data.map(normalizeBlogRow));
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadTopBlogs();
    return () => {
      active = false;
    };
  }, [blogs]);

  const displayBlogs = (blogs || fetchedBlogs).slice(0, 3);

  // GSAP Smooth Parallax on Blog Images
  useEffect(() => {
    if (loading || displayBlogs.length === 0) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray('.newsflash-item');
      items.forEach((item) => {
        const img = item.querySelector('.newsflash-img');
        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -12 },
            {
              yPercent: 12,
              ease: 'none',
              scrollTrigger: {
                trigger: item,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.65,
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, displayBlogs.length]);

  return (
    <section ref={sectionRef} className="newsflash-section" aria-label="Our Blogs">
      {/* TOP DIVIDER */}
      <div className="newsflash-divider"></div>

      {/* HEADER */}
      <div className="newsflash-header">
        <h2 className="newsflash-heading">Latest blog posts </h2>
        <p className="newsflash-lead">
          Latest articles, insights and solutions published by our team ... Find everything here in our latest blogs.
        </p>
      </div>

      {/* DIVIDER UNDER INTRO */}
      <div className="newsflash-sub-divider"></div>

      {/* BLOG LIST (MAX 3 ITEMS FROM ADMIN BLOGS) */}
      <div className="newsflash-list">
        {loading ? (
          <p className="newsflash-item-desc" style={{ padding: '40px 0' }}>
            Loading blogs...
          </p>
        ) : displayBlogs.length === 0 ? (
          <p className="newsflash-item-desc" style={{ padding: '40px 0' }}>
            No blogs published yet.
          </p>
        ) : (
          displayBlogs.map((item) => {
            const imageSrc =
              item.thumb ||
              (Array.isArray(item.images) && item.images[0]) ||
              '';
            const excerpt = getExcerpt(item);

            return (
              <article key={item.id} className="newsflash-item">
                {/* LEFT: TEXT CONTENT */}
                <div className="newsflash-item-content">
                  <h3 className="newsflash-item-title">{item.title}</h3>
                  {excerpt && <p className="newsflash-item-desc">{excerpt}</p>}
                  <Link
                    to={`/blog/${item.id}`}
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
                    {imageSrc && (
                      <img
                        src={imageSrc}
                        alt={item.title}
                        className="newsflash-img"
                        loading="lazy"
                      />
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* MORE BLOG CTA BUTTON */}
      <div className="newsflash-cta-wrap">
        <Link to="/blog" className="newsflash-more-btn" aria-label="Explore more blogs">
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
          <span>More blog</span>
        </Link>
      </div>
    </section>
  );
}
