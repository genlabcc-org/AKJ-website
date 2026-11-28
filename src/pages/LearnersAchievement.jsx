import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabase';
import {
  normalizeAchievementCategoryId,
  getAchievementGradeStage,
} from '../utils/achievementConfig';
import './LearnersAchievement.css';

const LEARNER_CATEGORIES = [
  {
    id: 'academics',
    title: 'ACADEMICS',
    scope: 'EY1 – GRADE 10',
    desc: 'Celebrating intellectual curiosity, scientific enquiry and independent project work from foundational years to IGCSE.',
    stages: [
      {
        id: 'acad-ey',
        stage: 'Early Years',
        grades: 'EY1, EY2, EY3',
        focus: 'Early Enquiry & Number Sense',
        highlight: 'Curiosity-led exploration, tactile counting, talk and guided observation.',
      },
      {
        id: 'acad-primary',
        stage: 'Primary',
        grades: 'Grade 1 – Grade 5',
        focus: 'Foundational Mastery',
        highlight: 'Strong foundations in English, Mathematics and Cambridge Science with hands-on investigation.',
        image: '/images/s14.JPG',
      },
      {
        id: 'acad-lower-sec',
        stage: 'Lower Secondary',
        grades: 'Grade 6 – Grade 8',
        focus: 'Analytical & Experimental Enquiry',
        highlight: 'Deeper analytical thinking, laboratory experiments, and cross-disciplinary projects.',
      },
      {
        id: 'acad-igcse',
        stage: 'Upper Secondary',
        grades: 'Grade 9 – Grade 10',
        focus: 'IGCSE Research & Projects',
        highlight: 'Rigorous coursework, extended investigations, and internationally recognised academic excellence.',
      },
    ],
  },
  {
    id: 'arts-creativity',
    title: 'ARTS & CREATIVITY',
    scope: 'EY1 – GRADE 10',
    desc: 'From a first painting in EY1 to mature visual arts, design and performance projects in Grade 10.',
    stages: [
      {
        id: 'arts-ey',
        stage: 'Early Years',
        grades: 'EY1, EY2, EY3',
        focus: 'First Paintings & Mark-Making',
        highlight: 'Free sensory painting, colour mixing, fine motor exploration and joyful creative play.',
      },
      {
        id: 'arts-primary',
        stage: 'Primary',
        grades: 'Grade 1 – Grade 5',
        focus: 'Visual Arts & Craftsmanship',
        highlight: 'Technique building in sketching, clay, mixed-media composition and choral music.',
      },
      {
        id: 'arts-lower-sec',
        stage: 'Lower Secondary',
        grades: 'Grade 6 – Grade 8',
        focus: 'Creative Interpretation',
        highlight: 'Thematic installations, theatrical performance, and digital design portfolio pieces.',
      },
      {
        id: 'arts-igcse',
        stage: 'Upper Secondary',
        grades: 'Grade 9 – Grade 10',
        focus: 'IGCSE Art & Design Portfolios',
        highlight: 'Independent studio practice, conceptual art studies, and exhibition curation.',
      },
    ],
  },
  {
    id: 'sports',
    title: 'SPORTS',
    scope: 'EY1 – GRADE 10',
    desc: 'Nurturing physical fitness, gross motor coordination, teamwork and athletic perseverance across all grades.',
    stages: [
      {
        id: 'sport-ey',
        stage: 'Early Years',
        grades: 'EY1, EY2, EY3',
        focus: 'Motor Skills & Playful Movement',
        highlight: 'Balance, spatial awareness, obstacle play and joyful physical activity.',
      },
      {
        id: 'sport-primary',
        stage: 'Primary',
        grades: 'Grade 1 – Grade 5',
        focus: 'Athletics & Team Fundamentals',
        highlight: 'Track and field, gymnastics, ball games, and learning sportsmanship and team cooperation.',
      },
      {
        id: 'sport-lower-sec',
        stage: 'Lower Secondary',
        grades: 'Grade 6 – Grade 8',
        focus: 'Discipline & Competitive Games',
        highlight: 'Inter-house tournaments, endurance building, tactical play, and individual athletics.',
      },
      {
        id: 'sport-igcse',
        stage: 'Upper Secondary',
        grades: 'Grade 9 – Grade 10',
        focus: 'Athletic Leadership & Representation',
        highlight: 'School squad representation, advanced fitness conditioning, and tournament leadership.',
      },
    ],
  },
  {
    id: 'competitions',
    title: 'COMPETITIONS',
    scope: 'EY1 – GRADE 10',
    desc: 'Opportunities for learners to challenge themselves, build confidence and represent the school with pride.',
    stages: [
      {
        id: 'comp-ey',
        stage: 'Early Years',
        grades: 'EY1, EY2, EY3',
        focus: 'Early Expression & Rhyme',
        highlight: 'Classroom recitation, storytelling, and joyful early stage participation.',
      },
      {
        id: 'comp-primary',
        stage: 'Primary',
        grades: 'Grade 1 – Grade 5',
        focus: 'Spelling Bees, Elocution & Quizzes',
        highlight: 'District spelling bees, public speaking contests, mental math challenges and science quizzes.',
      },
      {
        id: 'comp-lower-sec',
        stage: 'Lower Secondary',
        grades: 'Grade 6 – Grade 8',
        focus: 'Olympiads, Debates & MUN',
        highlight: 'Subject Olympiads, inter-school debates, Model United Nations and creative writing cups.',
      },
      {
        id: 'comp-igcse',
        stage: 'Upper Secondary',
        grades: 'Grade 9 – Grade 10',
        focus: 'Regional & National Contests',
        highlight: 'National hackathons, Cambridge challenge competitions, and external scholarly events.',
      },
    ],
  },
  {
    id: 'clubs',
    title: 'CLUBS',
    scope: 'EY1 – GRADE 10',
    desc: 'Co-curricular passion spaces where learners explore robotics, coding, astronomy, reading and specialised interests.',
    stages: [
      {
        id: 'club-ey',
        stage: 'Early Years',
        grades: 'EY1, EY2, EY3',
        focus: 'Early Coding & Nature Club',
        highlight: 'Bee-Bot navigation, campus nature walks, gardening and hands-on discovery.',
      },
      {
        id: 'club-primary',
        stage: 'Primary',
        grades: 'Grade 1 – Grade 5',
        focus: 'Robotics, Chess & Book Club',
        highlight: 'Introductory block coding, strategic chess puzzles, and reader discussion circles.',
      },
      {
        id: 'club-lower-sec',
        stage: 'Lower Secondary',
        grades: 'Grade 6 – Grade 8',
        focus: 'STEM, Astronomy & Media',
        highlight: 'Telescope stargazing sessions, sensor prototyping, and campus newsletter reporting.',
      },
      {
        id: 'club-igcse',
        stage: 'Upper Secondary',
        grades: 'Grade 9 – Grade 10',
        focus: 'Student-Led Societies',
        highlight: 'Peer tutoring societies, debate clubs, coding symposiums, and community outreach circles.',
      },
    ],
  },
  {
    id: 'leadership-service',
    title: 'LEADERSHIP & SERVICE',
    scope: 'EY1 – GRADE 10',
    desc: 'Developing empathy, social responsibility and active global citizenship from early peer support to campus leadership.',
    stages: [
      {
        id: 'lead-ey',
        stage: 'Early Years',
        grades: 'EY1, EY2, EY3',
        focus: 'Classroom Care & Sharing',
        highlight: 'Tidying together, empathy exercises, taking turns, and helping classmates.',
      },
      {
        id: 'lead-primary',
        stage: 'Primary',
        grades: 'Grade 1 – Grade 5',
        focus: 'Class Monitors & Peer Buddies',
        highlight: 'Welcoming younger learners, library stewardship, and environmental clean-up drives.',
      },
      {
        id: 'lead-lower-sec',
        stage: 'Lower Secondary',
        grades: 'Grade 6 – Grade 8',
        focus: 'Student Council & Initiatives',
        highlight: 'Organising house events, campus sustainability drives, and peer conflict resolution.',
      },
      {
        id: 'lead-igcse',
        stage: 'Upper Secondary',
        grades: 'Grade 9 – Grade 10',
        focus: 'Prefectorial Board & Community Action',
        highlight: 'Head learners, house captains, mentoring younger grades, and local community service projects.',
      },
    ],
  },
];

const GRADE_FILTER_OPTIONS = [
  { id: 'all', label: 'All Grades (EY1 – Grade 10)' },
  { id: 'ey', label: 'Early Years (EY1, EY2, EY3)' },
  { id: 'primary', label: 'Primary (Grades 1–5)' },
  { id: 'lower-sec', label: 'Lower Secondary (Grades 6–8)' },
  { id: 'igcse', label: 'Upper Secondary (Grades 9–10)' },
];

export default function LearnersAchievement() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeGradeFilter, setActiveGradeFilter] = useState('all');
  const [liveAchievements, setLiveAchievements] = useState([]);
  const [loadingAchievements, setLoadingAchievements] = useState(Boolean(supabase));
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  useEffect(() => {
    if (!supabase) return;
    let active = true;

    const loadAchievements = async () => {
      try {
        const { data, error } = await supabase
          .from('achievements')
          .select('*')
          .eq('status', 'Published')
          .order('id', { ascending: false });

        if (active && !error && data) {
          setLiveAchievements(data);
        }
      } finally {
        if (active) setLoadingAchievements(false);
      }
    };

    loadAchievements();
    return () => {
      active = false;
    };
  }, []);

  const achievementsByCategory = useMemo(() => {
    const grouped = {};
    liveAchievements.forEach((item) => {
      const catId = normalizeAchievementCategoryId(item.category);
      const stageId = getAchievementGradeStage(item.grade);
      if (activeGradeFilter !== 'all' && stageId !== activeGradeFilter) {
        return;
      }
      if (!grouped[catId]) grouped[catId] = [];
      grouped[catId].push(item);
    });
    return grouped;
  }, [liveAchievements, activeGradeFilter]);

  const filteredCategories = LEARNER_CATEGORIES.map((cat) => {
    const matchingStages = cat.stages.filter((stg) => {
      if (activeGradeFilter === 'all') return true;
      if (activeGradeFilter === 'ey') return stg.id.includes('-ey');
      if (activeGradeFilter === 'primary') return stg.id.includes('-primary');
      if (activeGradeFilter === 'lower-sec') return stg.id.includes('-lower-sec');
      if (activeGradeFilter === 'igcse') return stg.id.includes('-igcse');
      return true;
    });

    return {
      ...cat,
      stages: matchingStages,
      uploadedAchievements: achievementsByCategory[cat.id] || [],
    };
  }).filter((cat) => {
    const matchCategory =
      activeCategory === 'all' || cat.id === activeCategory;
    return matchCategory && (cat.stages.length > 0 || cat.uploadedAchievements.length > 0);
  });

  return (
    <div className="bbb-learners-page">
      <div className="bbb-learners-container">
        {/* EDITORIAL HERO SPLIT SECTION (MATCHING ABOUT & TEAM) */}
        <section className="bbb-learners-split-section">
          <div className="bbb-learners-left">
            <span className="bbb-learners-kicker">
              LEARNERS' ACHIEVEMENT CORNER
            </span>
          </div>

          <div className="bbb-learners-right">
            <h1 className="bbb-learners-heading">
              EVERY CHILD HAS SOMETHING TO BE PROUD OF
            </h1>
            <p className="bbb-learners-lead">
              Every child has something to be proud of. This is where we
              celebrate it, from a first painting in EY1 to an IGCSE project in
              Grade 10.
            </p>

            <div className="bbb-learners-framework-card">
              <span className="bbb-framework-tag">CAMBRIDGE JOURNEY</span>
              <p className="bbb-framework-text">
                Celebrating learner milestones across Academics, Arts &amp; Creativity,
                Sports, Competitions, Clubs, and Leadership &amp; Service.
              </p>
            </div>
          </div>
        </section>

        {/* BROWSE FILTERS (BY CATEGORY & BY GRADE — MATCHING TEAM PAGE) */}
        <section className="bbb-learners-filter-section">
          <div className="bbb-learners-filter-header">
            <span className="bbb-learners-filter-label">BROWSE BY CATEGORY:</span>
            <span className="bbb-learners-total-count">
              {loadingAchievements
                ? 'LOADING ACHIEVEMENTS...'
                : liveAchievements.length > 0
                  ? `6 CAMBRIDGE CATEGORIES · ${liveAchievements.length} UPLOADED`
                  : '6 CAMBRIDGE CATEGORIES'}
            </span>
          </div>

          <div className="bbb-learners-filter-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeCategory === 'all'}
              className={`bbb-learners-filter-btn ${
                activeCategory === 'all' ? 'active' : ''
              }`}
              onClick={() => setActiveCategory('all')}
            >
              All (6)
            </button>
            {LEARNER_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={activeCategory === cat.id}
                className={`bbb-learners-filter-btn ${
                  activeCategory === cat.id ? 'active' : ''
                }`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.title}
              </button>
            ))}
          </div>

          <div className="bbb-learners-grade-row">
            <span className="bbb-learners-grade-label">BROWSE BY GRADE:</span>
            <div className="bbb-learners-grade-tabs">
              {GRADE_FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={`bbb-learners-grade-btn ${
                    activeGradeFilter === opt.id ? 'active' : ''
                  }`}
                  onClick={() => setActiveGradeFilter(opt.id)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 2-COLUMN GROUPED SECTIONS (IDENTICAL LAYOUT TO TEAM PAGE) */}
        <div className="bbb-learners-roster">
          {filteredCategories.map((cat) => (
            <section
              key={cat.id}
              className="bbb-learners-group-section"
              id={cat.id}
            >
              <div className="bbb-learners-group-row">
                {/* LEFT: TITLE & GRADE SCOPE AT SAME LEVEL */}
                <div className="bbb-learners-group-left">
                  <div className="bbb-learners-group-header">
                    <span className="bbb-learners-group-title">
                      {cat.title}
                    </span>
                    <span className="bbb-learners-group-count">
                      ({cat.scope})
                    </span>
                  </div>
                  <p className="bbb-learners-group-desc">{cat.desc}</p>
                </div>

                {/* RIGHT: UPLOADED ACHIEVEMENTS + PATHWAY CARDS GRID */}
                <div className="bbb-learners-group-right">
                  {cat.uploadedAchievements.length > 0 && (
                    <div className="bbb-achievement-photos-grid">
                      {cat.uploadedAchievements.map((ach) => (
                        <article
                          key={ach.id}
                          className="bbb-achievement-photo-card"
                          onClick={() => setSelectedAchievement(ach)}
                        >
                          {ach.photo && (
                            <div className="bbb-achievement-photo-wrap">
                              <img
                                src={ach.photo}
                                alt={`${ach.category} - ${ach.grade}`}
                                className="bbb-achievement-photo-img"
                                loading="lazy"
                              />
                            </div>
                          )}
                          <div className="bbb-achievement-photo-body">
                            <div className="bbb-learner-card-header">
                              <span className="bbb-learner-stage-pill">
                                {ach.category}
                              </span>
                              <span className="bbb-learner-grades-tag">
                                {ach.grade}
                              </span>
                            </div>
                            <p className="bbb-learner-card-desc bbb-achievement-photo-desc">
                              {ach.description}
                            </p>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}

                  <div className="bbb-learners-cards-grid">
                    {cat.stages.map((stg) => (
                      <article key={stg.id} className={`bbb-learner-card ${stg.image ? 'has-image' : ''}`}>
                        {stg.image && (
                          <div className="bbb-learner-photo-wrap">
                            <img
                              src={stg.image}
                              alt={`${stg.stage} - ${stg.focus}`}
                              className="bbb-learner-photo"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <div className="bbb-learner-card-content">
                          <div className="bbb-learner-card-header">
                            <span className="bbb-learner-stage-pill">
                              {stg.stage}
                            </span>
                            <span className="bbb-learner-grades-tag">
                              {stg.grades}
                            </span>
                          </div>

                          <div className="bbb-learner-card-body">
                            <h2 className="bbb-learner-card-title">
                              {stg.focus}
                            </h2>
                            <p className="bbb-learner-card-desc">
                              {stg.highlight}
                            </p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* LIGHTBOX MODAL FOR ACHIEVEMENT PHOTO */}
      {selectedAchievement && (
        <div
          className="bbb-achievement-modal-backdrop"
          onClick={() => setSelectedAchievement(null)}
        >
          <div
            className="bbb-achievement-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="bbb-achievement-modal-close"
              onClick={() => setSelectedAchievement(null)}
              aria-label="Close achievement detail"
            >
              &times;
            </button>
            {selectedAchievement.photo && (
              <div className="bbb-achievement-modal-media">
                <img
                  src={selectedAchievement.photo}
                  alt={`${selectedAchievement.category} - ${selectedAchievement.grade}`}
                />
              </div>
            )}
            <div className="bbb-achievement-modal-body">
              <div className="bbb-learner-card-header">
                <span className="bbb-learner-stage-pill">
                  {selectedAchievement.category}
                </span>
                <span className="bbb-learner-grades-tag">
                  {selectedAchievement.grade}
                </span>
              </div>
              <p className="bbb-achievement-modal-desc">
                {selectedAchievement.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
