/**
 * Editable marketing-page content.
 *
 * Each page has:
 *   - a SCHEMA that drives the admin editor UI (groups -> fields / lists)
 *   - a DEFAULT content object, matching what the React pages ship with
 *
 * The public API merges stored overrides on top of DEFAULTS, so a page always
 * has a complete content object even before an admin has touched it.
 *
 * Field types: 'text' | 'textarea' | 'image' | 'stringList'
 *   image values are { url, key, alt } objects (same shape as ImageUploader).
 */

const PAGE_KEYS = ['services', 'about', 'contact', 'events']

const PAGE_LABELS = {
  services: 'Services',
  about: 'About',
  contact: 'Contact',
  events: 'Events'
}

// --------------------------------------------------------------------------
// SCHEMAS
// --------------------------------------------------------------------------

const f = (k, label, type = 'text') => ({ k, label, type })

const SCHEMAS = {
  contact: {
    groups: [
      {
        k: 'hero',
        label: 'Hero',
        fields: [f('title', 'Title'), f('subtitle', 'Subtitle', 'textarea'), f('image', 'Background image', 'image')],
        lists: [
          {
            k: 'cards',
            label: 'Fork cards',
            itemLabel: 'Card',
            fields: [f('eyebrow', 'Eyebrow'), f('title', 'Title'), f('desc', 'Description', 'textarea')]
          }
        ]
      },
      {
        k: 'form',
        label: 'Contact form',
        fields: [
          f('eyebrow', 'Eyebrow'),
          f('title', 'Title'),
          f('submitLabel', 'Submit button label'),
          f('topics', 'Topic options', 'stringList')
        ]
      },
      {
        k: 'offices',
        label: 'Regional offices',
        fields: [f('eyebrow', 'Eyebrow'), f('title', 'Title')],
        lists: [
          {
            k: 'items',
            label: 'Offices',
            itemLabel: 'Office',
            fields: [
              f('region', 'Region'),
              f('country', 'Country'),
              f('address', 'Address', 'textarea'),
              f('phone', 'Phone'),
              f('email', 'Email')
            ]
          }
        ]
      },
      {
        k: 'newsletter',
        label: 'Newsletter strip',
        fields: [f('title', 'Title'), f('desc', 'Description', 'textarea')]
      }
    ]
  },

  about: {
    groups: [
      {
        k: 'hero',
        label: 'Hero',
        fields: [
          f('title', 'Title', 'textarea'),
          f('subtitle', 'Subtitle', 'textarea'),
          f('primaryLabel', 'Primary button label'),
          f('secondaryLabel', 'Secondary button label'),
          f('image', 'Background image', 'image')
        ]
      },
      {
        k: 'executive',
        label: 'Executive claim',
        fields: [f('heading', 'Heading', 'textarea'), f('sub', 'Sub-line', 'textarea')]
      },
      {
        k: 'mission',
        label: 'Mission & values',
        fields: [f('eyebrow', 'Eyebrow'), f('title', 'Title'), f('intro', 'Intro', 'textarea')],
        lists: [
          {
            k: 'values',
            label: 'Core values',
            itemLabel: 'Value',
            fields: [f('idx', 'Number'), f('title', 'Title'), f('desc', 'Description', 'textarea')]
          }
        ]
      },
      {
        k: 'regulatory',
        label: 'Regulatory alignment',
        fields: [f('eyebrow', 'Eyebrow'), f('title', 'Title', 'textarea'), f('intro', 'Intro', 'textarea')],
        lists: [
          {
            k: 'standards',
            label: 'Standards cards',
            itemLabel: 'Standard',
            fields: [f('title', 'Title'), f('sub', 'Sub-line')]
          }
        ]
      },
      {
        k: 'footprint',
        label: 'Global footprint',
        fields: [f('eyebrow', 'Eyebrow'), f('title', 'Title'), f('intro', 'Intro', 'textarea')],
        lists: [
          {
            k: 'regions',
            label: 'Regions',
            itemLabel: 'Region',
            fields: [
              f('name', 'Name'),
              f('location', 'Location'),
              f('facility', 'Facility'),
              f('desc', 'Description', 'textarea')
            ]
          }
        ]
      },
      {
        k: 'finalCta',
        label: 'Final CTA',
        fields: [
          f('title', 'Title'),
          f('desc', 'Description', 'textarea'),
          f('primaryLabel', 'Primary button label'),
          f('secondaryLabel', 'Secondary button label')
        ]
      }
    ]
  },

  services: {
    groups: [
      {
        k: 'hero',
        label: 'Hero',
        fields: [
          f('title', 'Title'),
          f('subtitle', 'Subtitle', 'textarea'),
          f('primaryLabel', 'Primary button label'),
          f('image', 'Background image', 'image')
        ]
      },
      {
        k: 'pathways',
        label: 'Certification paths',
        fields: [f('eyebrow', 'Eyebrow'), f('title', 'Title'), f('intro', 'Intro', 'textarea')],
        lists: [
          {
            k: 'cards',
            label: 'Path cards',
            itemLabel: 'Card',
            fields: [
              f('region', 'Region'),
              f('title', 'Title'),
              f('desc', 'Description', 'textarea'),
              f('badge1', 'Badge (left)'),
              f('badge2', 'Badge (right)'),
              f('action', 'Action label')
            ]
          }
        ]
      },
      {
        k: 'cbta',
        label: 'CBTA approach',
        fields: [
          f('eyebrow', 'Eyebrow'),
          f('title', 'Title'),
          f('intro', 'Intro', 'textarea'),
          f('complianceTitle', 'Compliance bar title'),
          f('complianceDesc', 'Compliance bar description', 'textarea')
        ],
        lists: [
          {
            k: 'pillars',
            label: 'Pillars',
            itemLabel: 'Pillar',
            fields: [
              f('idx', 'Number'),
              f('title', 'Title'),
              f('subtitle', 'Subtitle'),
              f('desc', 'Description', 'textarea'),
              f('iconName', 'Icon name')
            ]
          }
        ]
      },
      {
        k: 'specialist',
        label: 'Specialist services',
        fields: [
          f('eyebrow', 'Eyebrow'),
          f('title', 'Title'),
          f('intro', 'Intro', 'textarea'),
          f('note', 'Note line'),
          f('moreTitle', 'More-info title'),
          f('moreDesc', 'More-info description', 'textarea')
        ],
        lists: [
          {
            k: 'categories',
            label: 'Filter categories',
            itemLabel: 'Category',
            fields: [f('id', 'ID'), f('label', 'Label')]
          },
          {
            k: 'disciplines',
            label: 'Disciplines',
            itemLabel: 'Discipline',
            fields: [
              f('id', 'Number'),
              f('title', 'Title'),
              f('desc', 'Description', 'textarea'),
              f('audience', 'Audience'),
              f('category', 'Category ID'),
              f('tag', 'Tag'),
              f('iconName', 'Icon name'),
              f('image', 'Image', 'image')
            ]
          }
        ]
      }
    ]
  },

  events: {
    groups: [
      {
        k: 'hero',
        label: 'Hero',
        fields: [
          f('title', 'Title'),
          f('subtitle', 'Subtitle', 'textarea'),
          f('primaryLabel', 'Primary button label'),
          f('image', 'Background image', 'image')
        ]
      },
      {
        k: 'programs',
        label: 'Open-enrollment programs',
        fields: [
          f('eyebrow', 'Eyebrow'),
          f('title', 'Title'),
          f('intro', 'Intro', 'textarea'),
          f('badge', 'Side badge'),
          f('emptyTitle', 'Empty-state title'),
          f('emptyDesc', 'Empty-state description', 'textarea')
        ]
      },
      {
        k: 'alerts',
        label: 'Intake alerts strip',
        fields: [
          f('eyebrow', 'Eyebrow'),
          f('title', 'Title'),
          f('desc', 'Description', 'textarea'),
          f('buttonLabel', 'Button label')
        ]
      },
      {
        k: 'curriculum',
        label: 'Curriculum overview',
        fields: [
          f('eyebrow', 'Eyebrow'),
          f('title', 'Title'),
          f('intro', 'Intro', 'textarea'),
          f('footnote', 'Footnote')
        ],
        lists: [
          {
            k: 'modules',
            label: 'Modules',
            itemLabel: 'Module',
            fields: [f('num', 'Number'), f('title', 'Title'), f('iconName', 'Icon name')],
            stringLists: [{ k: 'items', label: 'Topics' }]
          }
        ]
      },
      {
        k: 'recent',
        label: 'Recent cohorts',
        fields: [f('eyebrow', 'Eyebrow'), f('title', 'Title'), f('intro', 'Intro', 'textarea')],
        lists: [
          {
            k: 'cohorts',
            label: 'Cohorts',
            itemLabel: 'Cohort',
            fields: [
              f('code', 'Code'),
              f('title', 'Title'),
              f('dates', 'Dates'),
              f('location', 'Location'),
              f('pricing', 'Pricing'),
              f('description', 'Description', 'textarea')
            ]
          }
        ]
      },
      {
        k: 'finalCta',
        label: 'Final CTA',
        fields: [
          f('title', 'Title'),
          f('desc', 'Description', 'textarea'),
          f('primaryLabel', 'Primary button label'),
          f('secondaryLabel', 'Secondary button label')
        ]
      }
    ]
  }
}

// --------------------------------------------------------------------------
// DEFAULTS  (mirror of the content currently hard-coded in the React pages)
// --------------------------------------------------------------------------

const DEFAULTS = {
  contact: {
    hero: {
      title: "Let's talk about your operation.",
      subtitle: "Tell us who you are and what you need, and we'll route it to the right person.",
      image: null,
      cards: [
        {
          eyebrow: 'Airlines & Operators',
          title: 'Training my team',
          desc: 'Fleet-wide or role-specific training, built around your ops manual and your regulator.'
        },
        {
          eyebrow: 'Individuals',
          title: 'Becoming a dispatcher',
          desc: 'Certification pathways and course dates for individual applicants.'
        }
      ]
    },
    form: {
      eyebrow: 'SEND A MESSAGE',
      title: 'Start the conversation',
      submitLabel: 'Send Message →',
      topics: [
        'Training my OCC / dispatch team',
        'Individual dispatcher certification',
        'Consulting services',
        'Foxtrot Delta / press',
        'Something else'
      ]
    },
    offices: {
      eyebrow: 'DIRECT LINES',
      title: 'Our regional offices',
      items: [
        {
          region: 'Europe · Headquarters',
          country: 'Switzerland',
          address: 'Oberdorf 26, 4314 Zeiningen, Aargau, Switzerland',
          phone: '+41 78 227 3103',
          email: 'info@theifoa.com'
        },
        {
          region: 'Americas',
          country: 'United States',
          address: '1616 Concierge Blvd, Suite 100, Daytona Beach, FL 32117, USA',
          phone: '+1 508 838 5880',
          email: 'info-usa@theifoa.com'
        },
        {
          region: 'Asia',
          country: 'India',
          address: 'Innov8 Old Fort, 2nd Floor, Saket District Centre, New Delhi 110017, India',
          phone: '+91 98101 44034',
          email: 'info-india@theifoa.com'
        }
      ]
    },
    newsletter: {
      title: 'Prefer to just get the newsletter?',
      desc: 'One email a month: aviation insight worth reading, plus Foxtrot Delta, free.'
    }
  },

  about: {
    hero: {
      title: 'Four years in, we became the standard other schools get measured against.',
      subtitle:
        "We stepped away from the traditional training approach in favor of Competency-Based Training and Assessment, because every dispatcher deserves training that's actually exceptional.",
      primaryLabel: 'Book a Consultation',
      secondaryLabel: 'Explore Programs',
      image: null
    },
    executive: {
      heading:
        'In just four years, we became the leading aviation training company in Europe for the education and development of flight dispatchers.',
      sub: 'A position earned through relentless commitment to quality, industry relevance, and real-world results.'
    },
    mission: {
      eyebrow: 'OUR MISSION',
      title: 'Prepared, not just certified',
      intro:
        'Our mission is simple: your team operates at the highest level of safety and efficiency, trained through programs that are effective and affordable, with never a trade-off between the two.',
      values: [
        {
          idx: '01',
          title: 'World-class, accessible',
          desc: 'We take pride in delivering world-class services at accessible prices: excellence and value for every customer we serve.'
        },
        {
          idx: '02',
          title: 'Built on trust',
          desc: "We hold the same uncompromising standard whether or not anyone's watching."
        },
        {
          idx: '03',
          title: 'Driving innovation',
          desc: 'We anchor our culture in continuous improvement, enhancing the training experience and the value we deliver, year over year.'
        }
      ]
    },
    regulatory: {
      eyebrow: 'REGULATORY ALIGNMENT',
      title: 'Designed by active professionals, aligned to the standards that matter',
      intro:
        'Our programs are trusted by top-tier airlines, designed by active aviation professionals, and aligned with the latest regulatory frameworks, including being the first aviation training organization to deliver Flight Operation and Flight Dispatch courses following the prerequisites recommended by the new ICAO Doc 10106 manual.',
      standards: [
        { title: 'EASA Standards', sub: 'ORO.GEN 110 Aligned' },
        { title: 'ICAO Standards', sub: 'Doc 10106 Framework' },
        { title: 'FAA Part 65', sub: 'Approved School' }
      ]
    },
    footprint: {
      eyebrow: 'GLOBAL FOOTPRINT',
      title: 'Operational wherever airlines fly',
      intro:
        'Three regional operational hubs supporting carriers, students, and dispatch teams across four continents.',
      regions: [
        {
          name: 'Europe HQ',
          location: 'Basel, Switzerland',
          facility: 'EuroAirport Hub',
          desc: 'European headquarters leading EASA Part-ORO aligned dispatcher certification and OCC scenario labs.'
        },
        {
          name: 'North America',
          location: 'Daytona Beach, FL',
          facility: 'IFOA USA Operations',
          desc: 'FAA-approved Flight Dispatcher certification school and 14 CFR Part 3 Agent for Service gateway.'
        },
        {
          name: 'India & Asia-Pacific',
          location: 'New Delhi, India',
          facility: 'Aerocity Training Hub',
          desc: 'South Asian operational base delivering DGCA and ICAO Doc 10106 compliant dispatcher programs.'
        }
      ]
    },
    finalCta: {
      title: 'Want to see how this plays out for your team?',
      desc: 'Talk to us about your fleet, your ops manual, and where your OCC needs to be stronger.',
      primaryLabel: 'Book a Consultation',
      secondaryLabel: 'Browse Training Programs'
    }
  },

  services: {
    hero: {
      title: 'Built on competency, not just compliance.',
      subtitle:
        'Eight disciplines, one standard: training that prepares people to make the right call under pressure.',
      primaryLabel: 'Book a Consultation',
      image: null
    },
    pathways: {
      eyebrow: 'START HERE',
      title: 'Choose your certification path',
      intro:
        "The first decision for any individual dispatcher candidate: which regulatory certification matches where you'll work.",
      cards: [
        {
          region: 'Europe / Worldwide',
          title: 'EASA Standards Initial',
          desc: 'Comprehensive initial flight dispatcher certification aligned with ICAO Doc 10106 and EASA ORO.GEN.110.',
          badge1: '175 HOURS',
          badge2: 'HYBRID',
          action: 'Explore EASA'
        },
        {
          region: 'United States & Worldwide',
          title: 'FAA Part 65 Certification',
          desc: 'Direct pathway to the FAA Aircraft Dispatcher license through IFOA USA with dedicated examiners.',
          badge1: '200 HOURS',
          badge2: 'USA ONSITE',
          action: 'Explore FAA'
        },
        {
          region: 'Worldwide Dual License',
          title: 'EASA + FAA Combined',
          desc: 'The only worldwide double-certification model: EASA-based knowledge plus a full FAA Part 65 license.',
          badge1: 'HYBRID',
          badge2: 'GLOBAL',
          action: 'Explore Combined'
        },
        {
          region: 'Working Dispatchers',
          title: 'Recurrent & Advanced',
          desc: 'Customized recurrent and advanced programs for dispatchers and OCC professionals already certified.',
          badge1: 'CUSTOM',
          badge2: 'ONGOING',
          action: 'Explore Recurrent'
        }
      ]
    },
    cbta: {
      eyebrow: 'Competency-Based Training & Assessment (CBTA)',
      title: 'The CBTA Operational Approach',
      intro:
        "Competency-Based Training and Assessment isn't just a regulatory buzzword, it is the engineering foundation of every curriculum we design, ensuring flight dispatchers are prepared for 3am critical decisions.",
      complianceTitle: 'Global Regulatory Standard Compliance',
      complianceDesc: 'Every program adheres directly to worldwide civil aviation authority frameworks.',
      pillars: [
        {
          idx: '01',
          title: 'Customized Scenario-Based',
          subtitle: 'Real OCC Context',
          desc: "Every training is precisely tailored for your operation's needs, leveraging hands-on, high-impact scenario drills.",
          iconName: 'flight-route'
        },
        {
          idx: '02',
          title: 'Certified Instructors Only',
          subtitle: 'Active Industry Practitioners',
          desc: 'We exclusively collaborate with ICAO and FAA certified instructors who possess active flight dispatch experience.',
          iconName: 'instructor-board'
        },
        {
          idx: '03',
          title: 'Delivery Flexibility',
          subtitle: 'Onsite, Virtual & Hybrid',
          desc: 'Choose the training delivery method and global hub that best aligns with your team logistics and shift rosters.',
          iconName: 'occ-console'
        },
        {
          idx: '04',
          title: 'Licenses, Properly Earned',
          subtitle: 'Verified Competency',
          desc: 'Flight Dispatch certificates with proper regulatory education and lifetime verification for civil aviation authorities.',
          iconName: 'official-certificate'
        }
      ]
    },
    specialist: {
      eyebrow: 'Specialized Operational Services',
      title: 'Premium Services Tailored to Your Needs',
      intro: 'We offer our customers a vast and unique customized services portfolio.',
      note: 'Select the Service you need and access to more details',
      moreTitle: 'More Information?',
      moreDesc:
        'Contact our operational training advisors to receive full syllabus brochures and corporate schedules.',
      categories: [
        { id: 'all', label: 'All Services (6)' },
        { id: 'flight-ops', label: 'Flight Operations & OCC' },
        { id: 'train-trainer', label: 'Train the Trainer' },
        { id: 'consulting', label: 'Consulting' }
      ],
      disciplines: [
        {
          id: '01',
          title: 'Flight Dispatch',
          desc: 'Join the selected club of aviation industry heroes working behind the scenes in Airline Operations Control.',
          audience: 'Individuals & Airline OCC Teams',
          category: 'flight-ops',
          tag: 'Flight Operations',
          iconName: 'dispatcher-headset',
          image: null
        },
        {
          id: '02',
          title: 'Dangerous Goods',
          desc: 'Ensure absolute compliance and safety for dangerous goods air transport beyond textbook theory.',
          audience: 'Airlines, Cargo & Handlers',
          category: 'flight-ops',
          tag: 'DGR Compliance',
          iconName: 'dgr-flame',
          image: null
        },
        {
          id: '03',
          title: 'Train The trainer',
          desc: 'Master ICAO CBTA adult learning pedagogy to become a certified best-in-class aviation instructor.',
          audience: 'Nominated Persons & Instructors',
          category: 'train-trainer',
          tag: 'Instructional Pedagogy',
          iconName: 'instructor-board',
          image: null
        },
        {
          id: '04',
          title: 'Human Factors',
          desc: 'Build vital operational resilience, stress inoculation, and CRM soft skills for high-stakes environments.',
          audience: 'OCC & Flight Ops Personnel',
          category: 'flight-ops',
          tag: 'Resilience & CRM',
          iconName: 'human-brain-crm',
          image: null
        },
        {
          id: '05',
          title: 'Crew Control',
          desc: 'Acquire robust operational skills to manage airline crew pairing, roster disruptions, and fatigue mitigation.',
          audience: 'Crew Schedulers & Controllers',
          category: 'flight-ops',
          tag: 'Crew Scheduling',
          iconName: 'crew-roster',
          image: null
        },
        {
          id: '06',
          title: 'Consulting Services',
          desc: 'Transform airline operations with world-class OCC audits, regulatory alignment, and organizational efficiency.',
          audience: 'Airlines & Authorities',
          category: 'consulting',
          tag: 'Aviation Advisory',
          iconName: 'airline-audit',
          image: null
        }
      ]
    }
  },

  events: {
    hero: {
      title: 'Open-enrollment cohorts, worldwide.',
      subtitle:
        'Fixed-date, classroom and virtual programs you can register for directly, alongside the custom fleet training we build for airlines and operators.',
      primaryLabel: 'View Open Programs',
      image: null
    },
    programs: {
      eyebrow: 'Open-Enrollment Programs',
      title: 'Open-Enrollment Programs',
      intro:
        'These curriculum tracks stay live year-round. Individual dates are scheduled as dedicated cohort intakes rather than one-off event posts.',
      badge: 'Rolling Global Intakes',
      emptyTitle: 'No open intakes right now',
      emptyDesc:
        'New cohorts are published here as admissions open. Leave your email below to be notified.'
    },
    alerts: {
      eyebrow: 'Intake Alerts',
      title: 'Want intake updates directly in your inbox?',
      desc: 'Prefer to receive automated schedules? Leave your email to get notified when admissions open.',
      buttonLabel: 'Notify Me'
    },
    curriculum: {
      eyebrow: 'Curriculum Overview',
      title: 'What the Flight Dispatch program covers',
      intro: 'Organized around operational capability, not a flat list of disconnected subjects.',
      footnote: '* India delivery includes manual practical flight planning on the Boeing B737-NG.',
      modules: [
        {
          num: '01',
          title: 'The Operating Environment',
          iconName: 'airspace',
          items: ['Air Law & Regulations', 'ICAO / EASA / DGCA', 'Air Traffic Management', 'Communications']
        },
        {
          num: '02',
          title: 'Know the Aircraft',
          iconName: 'altimeter',
          items: ['Aircraft Systems', 'Instrumentation', 'Principles of Flight', 'B737-NG Technical']
        },
        {
          num: '03',
          title: 'Plan the Flight',
          iconName: 'flight-route',
          items: ['Navigation', 'Meteorology', 'Mass & Balance', 'Performance & Flight Planning']
        },
        {
          num: '04',
          title: 'Control the Operation',
          iconName: 'dispatcher-headset',
          items: ['Flight Monitoring', 'Operational Procedures', 'Human Performance', 'Operational Coordination']
        },
        {
          num: '05',
          title: 'Make the Decision',
          iconName: 'situational-awareness',
          items: ['Situational Awareness', 'Risk Assessment', 'Collaborative Decision-Making', 'Scenario Exercises']
        }
      ]
    },
    recent: {
      eyebrow: 'Recent Cohorts',
      title: "What's Run Recently",
      intro:
        "A look at the open-enrollment programs we've successfully delivered across our global hubs.",
      cohorts: [
        {
          code: 'IPIN2501',
          title: '4-Week Flight Operations & Flight Dispatch Program',
          dates: '31 Mar - 25 Apr 2025',
          location: 'New Delhi (Onsite)',
          pricing: '₹99,000 + 18% GST',
          description:
            'Delivered onsite at Indian Aviation Academy. Comprehensive syllabus aligned with ICAO Doc 10106, EASA ORO.GEN 110, and DGCA standards.'
        },
        {
          code: 'IDIN2402',
          title: '3-Week Initial Flight Dispatch Course',
          dates: '21 Oct - 08 Nov 2024',
          location: 'Virtual Classroom',
          pricing: 'Online Live Cohort',
          description:
            'Part-time, interactive digital delivery designed for developing-country markets entering professional flight operations.'
        },
        {
          code: 'CPIN2401',
          title: '3-Week Commercial Pilot Introductory Course',
          dates: '12 - 30 Aug 2024',
          location: 'Virtual Classroom',
          pricing: 'Online Live Cohort',
          description:
            'Foundational ground theory and flight operational fundamentals for individuals preparing for commercial pilot certification.'
        }
      ]
    },
    finalCta: {
      title: 'Want fleet-wide training instead of an open cohort?',
      desc: "Airlines and operators don't wait for a public calendar date: we schedule custom training around your ops.",
      primaryLabel: 'Talk to Us About Your Team',
      secondaryLabel: 'Browse Training Programs'
    }
  }
}

// --------------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------------

function isPlainObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v)
}

// Deep-merge stored overrides on top of defaults. Arrays are replaced wholesale
// (the admin fully owns list contents once saved).
function mergeContent(base, override) {
  if (!isPlainObject(override)) return override === undefined ? base : override
  const out = Array.isArray(base) ? [...base] : { ...base }
  for (const key of Object.keys(override)) {
    const b = isPlainObject(out) ? out[key] : undefined
    const o = override[key]
    out[key] = isPlainObject(b) && isPlainObject(o) ? mergeContent(b, o) : o
  }
  return out
}

function isValidPage(page) {
  return PAGE_KEYS.includes(page)
}

module.exports = {
  PAGE_KEYS,
  PAGE_LABELS,
  SCHEMAS,
  DEFAULTS,
  mergeContent,
  isValidPage
}
