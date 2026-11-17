import React, { useRef, useState } from 'react';
import './HeroVideo.css';

export default function HeroVideo({ src = '/service-1.mp4', ariaLabel = 'Featured showcase video' }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <section className="hero-video-section" aria-label={ariaLabel}>
      <div className="hero-video-frame">
        <video
          ref={videoRef}
          className="hero-video-media"
          src={src}
          autoPlay
          loop
          muted
          playsInline
        />
        <button
          type="button"
          className="hero-video-toggle"
          onClick={togglePlayback}
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>
    </section>
  );
}
