// Canonical host. Defaults to production so a normal build is still correct;
// set VITE_SITE_URL (and SITE_URL for scripts/prerender.mjs) to override for a
// staging build so canonical/OG/sitemap URLs point at that origin instead.
// Must stay in sync with the redirect rules in public/.htaccess and with
// scripts/generate-sitemap.mjs.
export const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://theifoa.com'
// Off by default (production stays indexable as before). Set VITE_NOINDEX=true
// on a staging build (and NOINDEX=true for scripts/prerender.mjs's robots.txt)
// so search engines aren't invited to index a pre-launch environment.
export const SITE_NOINDEX = import.meta.env.VITE_NOINDEX === 'true'
export const SITE_NAME = 'IFOA'
export const SITE_LEGAL_NAME = 'IFOA International Flight Operations Academy'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`

export function absoluteUrl(path = '/') {
  if (!path) return SITE_URL
  if (/^https?:\/\//i.test(path)) return path
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

// Trimmed to the ~155 chars Google renders before truncating.
export function clampDescription(text, limit = 155) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim()
  if (clean.length <= limit) return clean
  return `${clean.slice(0, clean.lastIndexOf(' ', limit - 1)).trim()}…`
}

export const OFFICES = [
  {
    id: 'ch',
    name: `${SITE_LEGAL_NAME} - Europe HQ`,
    street: 'Oberdorf 26',
    postalCode: '4314',
    city: 'Zeiningen',
    region: 'Aargau',
    country: 'CH',
    phone: '+41 78 227 3103'
  },
  {
    id: 'us',
    name: 'IFOA USA',
    street: '1616 Concierge Blvd, Suite 100',
    postalCode: '32117',
    city: 'Daytona Beach',
    region: 'FL',
    country: 'US',
    phone: '+1 508 838 5880'
  },
  {
    id: 'in',
    name: 'IFOA India',
    street: 'Innov8 Old Fort, 2nd Floor, Saket District Centre',
    postalCode: '110017',
    city: 'New Delhi',
    region: 'DL',
    country: 'IN',
    phone: '+91 98101 44034'
  }
]

// Site-wide publisher identity. Referenced by @id from the per-page graphs so
// Google resolves every Course/Article back to one organization entity.
export const ORGANIZATION_ID = `${SITE_URL}/#organization`

export function organizationSchema() {
  return {
    '@type': 'EducationalOrganization',
    '@id': ORGANIZATION_ID,
    name: SITE_NAME,
    legalName: SITE_LEGAL_NAME,
    alternateName: 'International Flight Operations Academy',
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.png`,
    email: 'info@theifoa.com',
    description:
      'Aviation training academy specialising in flight dispatcher certification and flight operations training to ICAO Doc 10106, EASA ORO.GEN.110 and FAA 14 CFR Part 65 standards.',
    address: OFFICES.map((o) => ({
      '@type': 'PostalAddress',
      streetAddress: o.street,
      postalCode: o.postalCode,
      addressLocality: o.city,
      addressRegion: o.region,
      addressCountry: o.country
    })),
    contactPoint: OFFICES.map((o) => ({
      '@type': 'ContactPoint',
      contactType: 'admissions',
      telephone: o.phone,
      email: 'info@theifoa.com',
      areaServed: o.country,
      availableLanguage: 'en'
    }))
  }
}

export function localBusinessSchemas() {
  return OFFICES.map((o) => ({
    '@type': 'EducationalOrganization',
    '@id': `${SITE_URL}/contact#${o.id}`,
    parentOrganization: { '@id': ORGANIZATION_ID },
    name: o.name,
    telephone: o.phone,
    email: 'info@theifoa.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: o.street,
      postalCode: o.postalCode,
      addressLocality: o.city,
      addressRegion: o.region,
      addressCountry: o.country
    }
  }))
}

export function breadcrumbSchema(trail = []) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  }
}

export function faqSchema(items = []) {
  if (!items.length) return null
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer }
    }))
  }
}

const COURSE_MODE = {
  online: 'Online',
  virtual: 'Online',
  hybrid: 'Blended',
  onsite: 'Onsite',
  classroom: 'Onsite'
}

function courseModeFor(course) {
  const raw = `${course.schedule?.mode || course.format || ''}`.toLowerCase()
  const hit = Object.keys(COURSE_MODE).find((k) => raw.includes(k))
  return hit ? COURSE_MODE[hit] : 'Blended'
}

// Course rich results need provider + at least one hasCourseInstance carrying
// courseMode and a real start date, otherwise Search Console rejects the item.
export function courseSchema(course) {
  if (!course) return null

  const instances = (course.intakes || [])
    .filter((i) => i.startDate)
    .map((i) => ({
      '@type': 'CourseInstance',
      name: i.label || course.title,
      courseMode: courseModeFor(course),
      startDate: new Date(i.startDate).toISOString().slice(0, 10),
      location: course.location
        ? { '@type': 'Place', name: course.location }
        : undefined
    }))

  if (instances.length === 0 && course.schedule?.startDate) {
    instances.push({
      '@type': 'CourseInstance',
      name: course.title,
      courseMode: courseModeFor(course),
      startDate: new Date(course.schedule.startDate).toISOString().slice(0, 10),
      endDate: course.schedule.endDate
        ? new Date(course.schedule.endDate).toISOString().slice(0, 10)
        : undefined,
      location: course.location
        ? { '@type': 'Place', name: course.location }
        : undefined
    })
  }

  return {
    '@type': 'Course',
    '@id': `${absoluteUrl(`/courses/${course.slug}`)}#course`,
    name: course.title,
    description: clampDescription(
      course.seo?.metaDescription || course.summary || course.whatYouWillLearn?.intro,
      300
    ),
    url: absoluteUrl(`/courses/${course.slug}`),
    courseCode: course.refCode || undefined,
    provider: { '@id': ORGANIZATION_ID },
    inLanguage: 'en',
    teaches: (course.whatYouWillLearn?.points || []).slice(0, 10),
    syllabusSections: (course.courseContent?.modules || []).slice(0, 25).map((m, i) => ({
      '@type': 'Syllabus',
      position: i + 1,
      name: typeof m === 'string' ? m : m?.title
    })),
    timeRequired: course.duration || undefined,
    hasCourseInstance: instances.length > 0 ? instances : undefined,
    offers:
      course.price?.amount != null
        ? {
            '@type': 'Offer',
            price: course.price.amount,
            priceCurrency: course.price.currency || 'USD',
            category: 'Tuition',
            availability:
              course.registrationOpen === false
                ? 'https://schema.org/PreOrder'
                : 'https://schema.org/InStock',
            url: absoluteUrl(`/courses/${course.slug}/enroll`)
          }
        : undefined
  }
}

// Wraps the per-page entities into a single @graph so one script tag carries
// everything and entities can cross-reference by @id.
export function graph(...entities) {
  const nodes = entities.flat().filter(Boolean)
  return {
    '@context': 'https://schema.org',
    '@graph': nodes
  }
}
