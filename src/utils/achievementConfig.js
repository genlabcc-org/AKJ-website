export const ACHIEVEMENT_CATEGORIES = [
  'Academics',
  'Arts & Creativity',
  'Sports',
  'Competitions',
  'Clubs',
  'Leadership & Service',
];

export const ACHIEVEMENT_GRADE_GROUPS = [
  {
    group: 'Early Years (Ages 3–6)',
    options: ['EY1 (Pre-KG)', 'EY2 (LKG)', 'EY3 (UKG)', 'Early Years (All)'],
  },
  {
    group: 'Cambridge Primary (Ages 5–11)',
    options: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Primary (All)'],
  },
  {
    group: 'Cambridge Lower Secondary (Ages 11–14)',
    options: ['Grade 6', 'Grade 7', 'Grade 8', 'Lower Secondary (All)'],
  },
  {
    group: 'Cambridge Upper Secondary / IGCSE (Ages 14–16)',
    options: ['Grade 9', 'Grade 10', 'Upper Secondary (All)'],
  },
];

export function normalizeAchievementCategoryId(category) {
  const val = String(category || '').trim().toLowerCase();
  if (val.includes('academic')) return 'academics';
  if (val.includes('art') || val.includes('creativ')) return 'arts-creativity';
  if (val.includes('sport')) return 'sports';
  if (val.includes('compet')) return 'competitions';
  if (val.includes('club')) return 'clubs';
  if (val.includes('lead') || val.includes('service')) return 'leadership-service';
  return 'academics';
}

export function getAchievementGradeStage(grade) {
  const val = String(grade || '').trim().toLowerCase();
  if (
    val.includes('ey') ||
    val.includes('pre-kg') ||
    val.includes('lkg') ||
    val.includes('ukg') ||
    val.includes('early')
  ) {
    return 'ey';
  }
  if (/grade\s*[1-5]\b/.test(val) || val.includes('primary')) {
    return 'primary';
  }
  if (/grade\s*[6-8]\b/.test(val) || val.includes('lower')) {
    return 'lower-sec';
  }
  if (/grade\s*(9|10)\b/.test(val) || val.includes('upper') || val.includes('igcse')) {
    return 'igcse';
  }
  return 'primary';
}
