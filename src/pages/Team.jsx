import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Team.css';

const TEAM_GROUPS = [
  {
    id: 'leadership',
    title: 'LEADERSHIP',
    subtitle: 'Strategic Vision & Educational Governance',
    members: [
      {
        name: 'Adv. J Jin Jefrin Jose',
        role: 'Chairman',
        group: 'Leadership',
        initials: 'JJ',
        photo: '/AKJ_team/jin.jpg',
      },
      {
        name: 'Ms. Geetha Viswanathan',
        role: 'Director / Principal',
        group: 'Leadership',
        initials: 'GV',
        photo: '/AKJ_team/geetha.jpg',
      },
    ],
  },
  {
    id: 'administration',
    title: 'ADMINISTRATION',
    subtitle: 'Academic Leadership & Operations',
    members: [
      {
        name: 'Ms. Shunmugha Priya R',
        role: 'Academic Head',
        group: 'Administration',
        initials: 'SP',
        photo: '/AKJ_team/priya.jpg',
      },
      {
        name: 'Mr. Avinash R G',
        role: 'Executive Director',
        group: 'Administration',
        initials: 'AR',
        photo: '/AKJ_team/avinash.jpg',
      },
      {
        name: 'Mr. Satheendiran S',
        role: 'Operations Manager',
        group: 'Administration',
        initials: 'SS',
        photo: '/AKJ_team/satheendran.jpg',
      },
      {
        name: 'Ms. Nima S',
        role: 'Inventory & Resources Manager',
        group: 'Administration',
        initials: 'NS',
        photo: '/AKJ_team/nima.jpg',
      },
    ],
  },
  {
    id: 'coordinators',
    title: 'COORDINATORS',
    subtitle: 'Curriculum, Examinations & Co-Curricular',
    members: [
      {
        name: 'Ms. Ananthi V',
        role: 'Exams Officer',
        group: 'Coordinators',
        initials: 'AV',
        photo: '/AKJ_team/ananthi.jpg',
      },
      {
        name: 'Ms. Adansia Mary B',
        role: 'Primary & Lower Secondary Coordinator',
        group: 'Coordinators',
        initials: 'AM',
        photo: '/AKJ_team/adansia.jpg',
      },
      {
        name: 'Ms. Divya M',
        role: 'Early Years Coordinator',
        group: 'Coordinators',
        initials: 'DM',
        photo: '/AKJ_team/divya.jpg',
      },
      {
        name: 'Ms. Jeba Jincy R',
        role: 'Co-curricular Coordinator',
        group: 'Coordinators',
        initials: 'JJ',
        photo: '/AKJ_team/jeba.jpg',
      },
    ],
  },
  {
    id: 'facilitators',
    title: 'FACILITATORS',
    subtitle: 'Primary, Secondary & Specialist Educators',
    members: [
      {
        name: 'Shanolija F',
        role: 'Facilitator',
        group: 'Facilitators',
        initials: 'SF',
        photo: '/AKJ_team/shano.jpg',
      },
      {
        name: 'Abisha A',
        role: 'Facilitator',
        group: 'Facilitators',
        initials: 'AA',
        photo: '/AKJ_team/abisha.jpg',
      },
      {
        name: 'Nisha L',
        role: 'Facilitator',
        group: 'Facilitators',
        initials: 'NL',
        photo: '/AKJ_team/nisha.jpg',
      },
      {
        name: 'Saranya G R',
        role: 'Facilitator',
        group: 'Facilitators',
        initials: 'SG',
      },
      {
        name: 'Akilsha A',
        role: 'Facilitator',
        group: 'Facilitators',
        initials: 'AK',
      },
      {
        name: 'Sheeba G',
        role: 'Facilitator',
        group: 'Facilitators',
        initials: 'SG',
      },
      {
        name: 'Mr. Abinesh T',
        role: 'PE Facilitator',
        group: 'Facilitators',
        initials: 'AT',
      },
    ],
  },
  {
    id: 'early-years',
    title: 'EARLY YEARS FACILITATORS',
    subtitle: 'Foundational Learning, Play & Discovery',
    members: [
      {
        name: 'Joyel Jebakani J',
        role: 'Early Years Facilitator',
        group: 'Early Years Facilitators',
        initials: 'JJ',
        photo: '/AKJ_team/joyel jeba.jpg',
      },
      {
        name: 'Anesha Ragavi R V',
        role: 'Early Years Facilitator',
        group: 'Early Years Facilitators',
        initials: 'AR',
        photo: '/AKJ_team/aneesha.jpg',
      },
      {
        name: 'Pathalis Anusha D',
        role: 'Early Years Facilitator',
        group: 'Early Years Facilitators',
        initials: 'PA',
        photo: '/AKJ_team/anusha.jpg',
      },
      {
        name: 'Shyla F',
        role: 'Early Years Facilitator',
        group: 'Early Years Facilitators',
        initials: 'SF',
        photo: '/AKJ_team/shyla.jpg',
      },
      {
        name: 'Jeba Shiny',
        role: 'Early Years Facilitator',
        group: 'Early Years Facilitators',
        initials: 'JS',
        photo: '/AKJ_team/jeba shiny.jpg',
      },
    ],
  },
  {
    id: 'front-office',
    title: 'FRONT OFFICE',
    subtitle: 'Student Admissions & Parent Relations',
    members: [
      {
        name: 'Ms. Kanmani P',
        role: 'Front Office Administrator',
        group: 'Front Office',
        initials: 'KP',
        photo: '/AKJ_team/kanmani.jpg',
      },
    ],
  },
];

export default function Team() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredGroups =
    activeFilter === 'all'
      ? TEAM_GROUPS
      : TEAM_GROUPS.filter((g) => g.id === activeFilter);

  const totalMembers = TEAM_GROUPS.reduce(
    (sum, g) => sum + g.members.length,
    0
  );

  return (
    <div className="bbb-team-page">
      <div className="bbb-team-container">
        {/* HERO / INTRO SPLIT SECTION */}
        <section className="bbb-team-split-section">
          <div className="bbb-team-left">
            <span className="bbb-team-kicker">OUR TEAM</span>
          </div>

          <div className="bbb-team-right">
            <h1 className="bbb-team-heading">
              FACILITATORS WHO KEEP LEARNING TOO
            </h1>
            <p className="bbb-team-lead">
              At AKJ, we call our teachers facilitators, because their job
              isn&apos;t just to deliver a lesson. It&apos;s to guide each child
              to think, question and grow. Our facilitators are trained in the
              Cambridge approach and keep developing their practice through
              regular Cambridge training, peer mentoring and in-school sessions
              where they reflect on their teaching, learn from each other and try
              new ideas in the classroom.
            </p>

            <div className="bbb-team-handbook-card">
              <span className="bbb-handbook-tag">PEDAGOGICAL FRAMEWORK</span>
              <p className="bbb-handbook-citation">
                Handbook ref: p. 21 — <em>Teacher professional development</em>;
                p. 12 — <em>The teacher as activator</em>.
              </p>
            </div>
          </div>
        </section>

        {/* TEAM FILTER PILLS */}
        <section className="bbb-team-filter-section">
          <div className="bbb-team-filter-header">
            <span className="bbb-team-filter-label">BROWSE DEPARTMENTS:</span>
            <span className="bbb-team-total-count">{totalMembers} TEAM MEMBERS</span>
          </div>
          <div className="bbb-team-filter-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeFilter === 'all'}
              className={`bbb-team-filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All ({totalMembers})
            </button>
            {TEAM_GROUPS.map((group) => (
              <button
                key={group.id}
                type="button"
                role="tab"
                aria-selected={activeFilter === group.id}
                className={`bbb-team-filter-btn ${activeFilter === group.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(group.id)}
              >
                {group.title.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())} ({group.members.length})
              </button>
            ))}
          </div>
        </section>

        {/* TEAM ROSTER (LISTED IN EXACT USER ORDER) */}
        <div className="bbb-team-roster">
          {filteredGroups.map((group) => (
            <section key={group.id} className="bbb-team-group-section" id={group.id}>
              <div className="bbb-team-group-row">
                {/* LEFT: GROUP IDENTIFIER */}
                <div className="bbb-team-group-left">
                  <div className="bbb-team-group-header">
                    <span className="bbb-team-kicker">{group.title}</span>
                    <span className="bbb-team-group-count">
                      ({group.members.length} {group.members.length === 1 ? 'MEMBER' : 'MEMBERS'})
                    </span>
                  </div>
                  <p className="bbb-team-group-desc">{group.subtitle}</p>
                </div>

                {/* RIGHT: MEMBER CARDS */}
                <div className="bbb-team-group-right">
                  <div className="bbb-team-cards-grid">
                    {group.members.map((member, index) => (
                      <article key={`${member.name}-${index}`} className="bbb-team-card">
                        <div className="bbb-team-photo-wrap">
                          {member.photo ? (
                            <img
                              src={member.photo}
                              alt={member.name}
                              className="bbb-team-photo"
                              loading="lazy"
                            />
                          ) : (
                            <div className="bbb-team-photo-placeholder" aria-hidden="true">
                              <div className="bbb-team-avatar">
                                <span>{member.initials}</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="bbb-team-card-body">
                          <span className="bbb-team-card-dept">{member.group}</span>
                          <h2 className="bbb-team-card-name">{member.name}</h2>
                          <p className="bbb-team-card-role">{member.role}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* BOTTOM CALLOUT / CONTACT */}
        <section className="bbb-team-footer-callout">
          <div className="bbb-team-callout-inner">
            <span className="bbb-team-kicker">CONNECT WITH OUR FACILITATORS</span>
            <h2 className="bbb-team-callout-heading">
              EXPERIENCE THE CAMBRIDGE LEARNING ENVIRONMENT AT AKJ
            </h2>
            <p className="bbb-team-callout-lead">
              Our leadership and academic team are always pleased to discuss curriculum, admissions, and how we guide your child to question, think and grow.
            </p>
            <Link to="/contact" className="bbb-team-pill-btn">
              <svg
                width="13"
                height="13"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M2 2L12 12M12 12V4M12 12H4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="square"
                />
              </svg>
              <span>Get in touch with our team</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
