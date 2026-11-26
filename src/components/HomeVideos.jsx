import React, { useState, useEffect } from 'react';
import { supabase, getVideoEmbedInfo } from '../supabase';
import './HomeVideos.css';

export default function HomeVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(Boolean(supabase));

  useEffect(() => {
    if (!supabase) return;
    let active = true;

    const loadVideos = async () => {
      try {
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .eq('status', 'Published')
          .order('id', { ascending: false });

        if (active && !error && data) {
          setVideos(data);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadVideos();
    return () => {
      active = false;
    };
  }, []);

  if (!loading && videos.length === 0) {
    return null;
  }

  const isMarquee = videos.length >= 4;
  const displayVideos = isMarquee ? [...videos, ...videos] : videos;
  const durationSeconds = Math.max(16, videos.length * 5.5);

  const renderVideoCard = (item, index) => {
    const rawUrl = (item.video_url || '').trim();
    const embedInfo = getVideoEmbedInfo(rawUrl);
    const sessionDate = item.session_date || item.date || '';
    const thumbSrc = item.thumb || embedInfo?.thumb || '';
    const isExternalLink = Boolean(rawUrl && /^https?:\/\//i.test(rawUrl));

    return (
      <article key={`${item.id}-${index}`} className="home-video-card">
        <div className="home-video-media">
          {embedInfo?.type === 'iframe' ? (
            <iframe
              src={embedInfo.src}
              title={item.title}
              className="home-video-iframe"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          ) : embedInfo?.type === 'video' ? (
            <video
              src={embedInfo.src}
              controls
              playsInline
              preload="metadata"
              className="home-video-player"
            />
          ) : thumbSrc ? (
            <img
              src={thumbSrc}
              alt={item.title}
              className="home-video-poster"
              loading="lazy"
            />
          ) : null}

          {isExternalLink && (
            <a
              href={rawUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="home-video-redirect-overlay"
              aria-label={`Watch ${item.title} on YouTube`}
            />
          )}
        </div>

        {isExternalLink ? (
          <a
            href={rawUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="home-video-meta home-video-meta-link"
          >
            {sessionDate && (
              <span className="home-video-date">{sessionDate}</span>
            )}
            <h3 className="home-video-title">{item.title}</h3>
          </a>
        ) : (
          <div className="home-video-meta">
            {sessionDate && (
              <span className="home-video-date">{sessionDate}</span>
            )}
            <h3 className="home-video-title">{item.title}</h3>
          </div>
        )}
      </article>
    );
  };

  return (
    <section className="home-videos-section" aria-label="Our Videos">
      <div className="home-videos-divider"></div>

      <div className="home-videos-header-row">
        <div className="home-videos-header">
          <p className="home-videos-eyebrow">OUR VIDEOS</p>
          <h2 className="home-videos-heading">VIDEOS</h2>
          <p className="home-videos-lead">
            Campus stories, classroom moments, and Cambridge learning highlights from AKJ.
          </p>
        </div>
      </div>

      {loading ? (
        <p className="home-videos-loading">Loading videos...</p>
      ) : isMarquee ? (
        <div className="home-videos-marquee-viewport">
          <div
            className="home-videos-marquee-track"
            style={{ '--marquee-duration': `${durationSeconds}s` }}
          >
            {displayVideos.map(renderVideoCard)}
          </div>
        </div>
      ) : (
        <div className="home-videos-static-grid">
          {displayVideos.map(renderVideoCard)}
        </div>
      )}
    </section>
  );
}
