import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import HeroVideo from '../components/HeroVideo';
import AgencyIntro from '../components/AgencyIntro';
import CaseStudies from '../components/CaseStudies';
import NewsFlash from '../components/NewsFlash';
import TalkFeedback from '../components/TalkFeedback';
import { supabase, normalizeBlogRow } from '../supabase';
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
        setRecentBlogs(data.map(normalizeBlogRow));
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
            Cambridge Journey.<br />
            <span className="site-hero-subline">Building Minds Beyond Borders.</span>
          </>
        }
        subtitle="A Cambridge School in Thuckalay . EY1 to Grade 10"
      />

      {/* HERO VIDEO */}
      <HeroVideo src="/Akj_intro.mp4" />

      {/* AGENCY INTRO */}
      <AgencyIntro />

      {/* CASE STUDIES (TANGIBLE CASE STUDIES) */}
      <CaseStudies />

      {/* BLOG (LATEST 3 FROM ADMIN BLOGS) */}
      <NewsFlash blogs={recentBlogs} />

      {/* LET'S TALK / CUSTOMER FEEDBACK */}
      <TalkFeedback />
    </div>
  );
}
