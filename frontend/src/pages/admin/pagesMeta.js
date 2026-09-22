// Shared between AdminPagesPage (full CMS directory) and AdminOverviewPage
// (the landing-screen shortcut grid), so both stay in sync automatically.
export const PATH_BY_PAGE = {
  home: '/',
  services: '/services',
  about: '/about',
  contact: '/contact',
  events: '/events',
  foxtrotDelta: '/foxtrot-delta',
  courseEnrollment: null,
  courseDetail: null
}

export const PAGE_DESCRIPTIONS = {
  home: 'Main landing page featuring hero animations, partner logos, highlights, and featured programs.',
  services: 'Aviation consultancy, flight dispatch training, airline setup, and regulatory compliance services.',
  events: 'Upcoming academic cohorts, workshops, webinars, and international aviation training calendar.',
  foxtrotDelta: 'IFOA official aviation magazine editions, industry insights, articles, and downloadable publications.',
  about: 'IFOA history, mission, accreditation credentials, team, and global regulatory standards.',
  contact: 'Global offices, direct inquiry channels, WhatsApp quick support, and contact form.',
  courseDetail: 'Shared header, sidebar layout, and default copy template for individual course detail pages.',
  courseEnrollment: 'Shared multi-step application form chrome and default candidate instructions.'
}
