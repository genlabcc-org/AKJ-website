import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Pathway.css';

const CAMBRIDGE_SUBJECTS = [
  {
    id: 'english',
    name: 'English',
    description: 'Students develop their English skills through reading stories, writing, speaking and listening activities. They learn new words, build sentences and express their thoughts with confidence. Storytelling, reading exercises and creative writing make learning enjoyable and help improve communication skills.',
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    description: 'Mathematics develops logical reasoning, analytical thinking and problem-solving abilities. Students build a strong understanding of numbers, arithmetic, geometry, measurements, statistics and probability. As they progress, they are introduced to algebra and more advanced mathematical concepts. Through calculations, practical exercises and real-life applications, students learn to identify patterns, interpret data, analyse information and make informed decisions. It also strengthens concentration, accuracy and the ability to approach challenges systematically.',
  },
  {
    id: 'science',
    name: 'Science',
    description: 'Science encourages curiosity and develops an understanding of the natural world through biology, chemistry, physics, Earth and space studies. Students explore scientific concepts through practical experiments, hands-on investigations, observation and questioning. They learn how living organisms function, how materials interact, how energy works and how the universe develops. Science also promotes critical thinking, creativity, investigation and evidence-based reasoning. It helps students connect classroom knowledge with everyday experiences and understand the importance of scientific discoveries in modern life.',
  },
  {
    id: 'computing',
    name: 'Computing',
    description: 'Computing prepares students to understand and participate in an increasingly digital world. It develops digital literacy, computational thinking, programming and technical problem-solving skills. Students begin with block-based coding during Primary education and gradually progress towards text-based programming in Lower Secondary. They learn to understand algorithms, recognize patterns, organize information and develop logical solutions to problems. Computing also encourages creativity, independent thinking, responsible technology usage and an understanding of how digital tools and systems influence everyday life.',
  },
  {
    id: 'global-perspectives',
    name: 'Global Perspectives',
    description: 'Global Perspectives helps students understand the world through personal, local and international topics. It develops research, analysis, collaboration and communication skills while encouraging learners to explore different viewpoints and understand global challenges. Students learn to collect information, evaluate sources, participate in discussions and present their ideas effectively. Through collaborative projects and investigations, they develop cultural awareness, empathy, independent thinking and respect for different opinions. This subject prepares students to become informed, responsible and active global citizens.',
  },
  {
    id: 'humanities',
    name: 'Humanities',
    description: 'Humanities develops curiosity and understanding about people, history, geography, cultures and societies. Students explore historical events, civilizations, geographical environments and cultural traditions from different parts of the world. They learn how societies have changed over time and how people interact with their surroundings. Through research, discussions, interpretation and exploration, students develop critical thinking, observation and analytical skills. The subject also encourages cultural awareness, respect for diversity and a deeper understanding of the world and its people.',
  },
  {
    id: 'art-design',
    name: 'Art & Design',
    description: 'Art & Design provides students with opportunities to explore their creativity, imagination and personal expression. Through drawing, painting, designing and experimenting with different materials and techniques, students develop practical artistic abilities and visual communication skills. They learn to transform creative ideas into meaningful artwork while exploring colours, shapes, patterns and design concepts. The subject encourages innovation, experimentation, creative problem-solving and independent thinking. It also helps students recognize their artistic interests, build confidence and appreciate different forms of visual expression.',
  },
  {
    id: 'music',
    name: 'Music',
    description: 'Music develops creativity, confidence and an appreciation for different musical styles and traditions. Students explore music through listening, singing, performing and responding to different sounds and rhythms. They gradually develop an understanding of melody, harmony, rhythm and musical patterns. Participating in musical activities helps improve coordination, concentration, memory and self-expression. Music also encourages teamwork, collaboration and confidence through group performances and individual practice. It provides opportunities for students to discover their musical interests and appreciate the cultural importance of music.',
  },
  {
    id: 'physical-education',
    name: 'Physical Education',
    description: 'Physical Education promotes physical fitness, healthy habits and overall well-being through a wide range of age-appropriate activities and sports. Students develop essential physical abilities such as strength, flexibility, balance, coordination and endurance. Through individual exercises and team sports, they learn discipline, teamwork, leadership, cooperation and sportsmanship. Physical activities also help improve concentration, confidence and emotional well-being. The subject encourages students to understand the importance of regular exercise, personal health and maintaining an active lifestyle.',
  },
  {
    id: 'digital-literacy',
    name: 'Digital Literacy',
    description: 'Using technology well, and staying safe and kind online',
  },
  {
    id: 'wellbeing',
    name: 'Wellbeing',
    description: 'Understanding myself, my relationships and navigating my world',
  },
];

export default function Pathway() {
  const [activeSubjectId, setActiveSubjectId] = useState('english');

  const activeSubject =
    CAMBRIDGE_SUBJECTS.find((s) => s.id === activeSubjectId) || CAMBRIDGE_SUBJECTS[0];

  return (
    <div className="bbb-pathway-page">
      {/* 1. FIRST ONE FULL IMAGE (HERO BANNER) */}
      <section className="bbb-pathway-full-hero" aria-label="Academics Pathway Showcase">
        <div className="bbb-full-hero-img-wrap">
          <img
            src="/images/akj-pathway-earlyyears.jpg"
            alt="AKJ Early Years and Primary learners in the reading and activity discovery room"
            className="bbb-full-hero-img"
          />
        </div>
      </section>

      <div className="bbb-pathway-container">
        {/* 2. EDITORIAL HERO SPLIT SECTION */}
        <section className="bbb-pathway-split-section">
          <div className="bbb-pathway-left">
            <span className="bbb-pathway-kicker">EY1–GRADE 10 PATHWAY</span>
          </div>

          <div className="bbb-pathway-right">
            <h1 className="bbb-pathway-heading">
              WHAT CHILDREN LEARN
            </h1>
            <p className="bbb-pathway-lead">
              From Grade 1 to Grade 8, children follow Cambridge&apos;s subject frameworks, which describe what learners should know and be able to do at each stage. Subjects are revisited every year with growing depth, so skills keep building.
            </p>

            <div className="bbb-pathway-centre-tag">
              <span className="bbb-centre-badge">CAMBRIDGE INTERNATIONAL SCHOOL</span>
              <span className="bbb-centre-code">CENTRE NO. IA998</span>
            </div>
          </div>
        </section>

        {/* 3. CAMBRIDGE SUBJECTS VERTICAL TABS COMPONENT */}
        <section className="bbb-subjects-section" aria-label="Cambridge Subject Frameworks">
          <div className="bbb-subjects-layout">
            {/* LEFT SIDEBAR: SUBJECT LIST */}
            <aside className="bbb-subjects-sidebar" aria-label="Subjects menu">
              <nav className="bbb-subjects-nav">
                {CAMBRIDGE_SUBJECTS.map((subj) => {
                  const isActive = activeSubjectId === subj.id;
                  return (
                    <button
                      key={subj.id}
                      type="button"
                      className={`bbb-subject-nav-btn ${isActive ? 'active' : ''}`}
                      onClick={() => setActiveSubjectId(subj.id)}
                    >
                      <span className="bbb-subject-btn-text">{subj.name}</span>
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* RIGHT PANE: ACTIVE SUBJECT DETAILS */}
            <main className="bbb-subject-content-pane">
              <div key={activeSubject.id}>
                <h2 className="bbb-subject-title">{activeSubject.name}</h2>

                <p className="bbb-subject-lead-desc">
                  {activeSubject.description}
                </p>
              </div>

              {/* INQUIRY BUTTON MATCHING SCREENSHOT */}
              <div className="bbb-subject-action-row">
                <Link to="/contact" className="bbb-subject-inquiry-btn">
                  <span className="bbb-inquiry-icon" aria-hidden="true">🔗</span>
                  <span>Make an Inquiry</span>
                </Link>
              </div>
            </main>
          </div>
        </section>

        {/* 4. CURRICULUM HANDBOOK E-BOOK SECTION (MATCHING REFERENCE CARD) */}
        <section className="bbb-handbook-section" aria-label="Curriculum Handbook">
          <div className="bbb-handbook-grid">
            <div className="bbb-handbook-card">
              <div className="bbb-handbook-card-img-wrap">
                <img
                  src="/images/akj-handbook-resources.jpg"
                  alt="Cambridge Learning Resources and Phonics Library - AKJ International School"
                   className="bbb-handbook-card-img"
                />
              </div>
              <div className="bbb-handbook-card-body">
                <h3 className="bbb-handbook-card-title">The Cambridge Approach</h3>
                <div className="bbb-handbook-card-actions">
                  <a
                    href="/documents/The-Cambridge-Approach-Handbook.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bbb-handbook-btn"
                  >
                    <span className="bbb-handbook-btn-icon" aria-hidden="true">🔗</span>
                    <span>Open E-Book</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. CAMPUS LEARNING SPACES GALLERY (3 PICS) */}
        <section className="bbb-campus-gallery-section" aria-label="Campus Learning Environments">
          <div className="bbb-campus-gallery-grid">
            <div className="bbb-gallery-item">
              <img
                src="/images/akj-campus-reading-lounge.jpg"
                alt="AKJ Early Years and Primary Reading Lounge with creative exploration corner"
                className="bbb-gallery-img"
                loading="lazy"
              />
            </div>
            <div className="bbb-gallery-item">
              <img
                src="/images/akj-campus-round-table.jpg"
                alt="Early Years learners engaged in collaborative reading at round table"
                className="bbb-gallery-img"
                loading="lazy"
              />
            </div>
            <div className="bbb-gallery-item">
              <img
                src="/images/akj-campus-library.jpg"
                alt="Primary and Lower Secondary learners studying in the Cambridge reference library"
                className="bbb-gallery-img"
                loading="lazy"
              />
            </div>
          </div>

          <div className="bbb-campus-gallery-text-wrap">
            <p className="bbb-campus-gallery-desc">
              By combining a structured Cambridge course with a carefully designed syllabus, AKJ International School ensures every child progresses with clarity and purpose. As concepts deepen each year, students move seamlessly from foundational skills to IGCSE readiness—developing the confidence, curiosity, and academic strength needed to thrive in a global future.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
