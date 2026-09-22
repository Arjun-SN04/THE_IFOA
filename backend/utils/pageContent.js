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

const PAGE_KEYS = ['home', 'services', 'about', 'contact', 'events', 'foxtrotDelta', 'courseEnrollment', 'courseDetail']

const PAGE_LABELS = {
  home: 'Home',
  services: 'Services',
  about: 'About',
  contact: 'Contact',
  events: 'Events',
  foxtrotDelta: 'Foxtrot Delta',
  courseEnrollment: 'Course Enrollment',
  courseDetail: 'Course Detail'
}

// --------------------------------------------------------------------------
// SCHEMAS
// --------------------------------------------------------------------------

const f = (k, label, type = 'text') => ({ k, label, type })

const SCHEMAS = {
  home: {
    groups: [
      {
        k: 'hero',
        label: 'Hero',
        fields: [
          f('eyebrow', 'Eyebrow'),
          f('title', 'Title (line 1)'),
          f('titleHighlight', 'Title (highlighted line 2)'),
          f('subtitle', 'Subtitle', 'textarea'),
          f('primaryLabel', 'Primary button label'),
          f('secondaryLabel', 'Secondary button label')
        ],
        lists: [
          {
            k: 'stats',
            label: 'Metric strip',
            itemLabel: 'Stat',
            fields: [f('value', 'Value'), f('label', 'Label')]
          }
        ]
      },
      {
        k: 'featuredCourses',
        label: 'Featured courses',
        fields: [
          f('eyebrow', 'Eyebrow'),
          f('title', 'Title'),
          f('intro', 'Intro', 'textarea'),
          f('viewAllLabel', 'View-all link label')
        ],
        lists: [
          {
            k: 'cards',
            label: 'Course cards',
            itemLabel: 'Course card',
            fields: [
              f('tag', 'Tag'),
              f('duration', 'Duration badge'),
              f('title', 'Title'),
              f('desc', 'Description', 'textarea'),
              f('ctaLabel', 'CTA button label')
            ]
          }
        ]
      },
      {
        k: 'trustRating',
        label: 'Trust & rating banner',
        fields: [
          f('eyebrow', 'Eyebrow'),
          f('title', 'Title'),
          f('desc', 'Description', 'textarea'),
          f('learnMoreLabel', 'Learn-more link label'),
          f('ratingValue', 'Rating value'),
          f('ratingSuffix', 'Rating suffix'),
          f('reviewCountLabel', 'Review-count label'),
          f('badgeLabel', 'Badge label')
        ]
      },
      {
        k: 'pathways',
        label: 'Training pathways carousel',
        fields: [f('eyebrow', 'Eyebrow'), f('title', 'Title'), f('seeMoreLabel', 'See-more button label')],
        lists: [
          {
            k: 'cards',
            label: 'Pathway cards',
            itemLabel: 'Pathway card',
            fields: [
              f('category', 'Category'),
              f('title', 'Title'),
              f('desc', 'Description', 'textarea'),
              f('hours', 'Hours / format'),
              f('linkText', 'Link label'),
              f('courseSlug', 'Links to course (slug)')
            ]
          }
        ]
      },
      {
        k: 'network',
        label: 'Global airline network',
        fields: [f('eyebrow', 'Eyebrow'), f('title', 'Title'), f('intro', 'Intro', 'textarea')]
      },
      {
        k: 'audience',
        label: 'Audience pathways',
        fields: [f('eyebrow', 'Eyebrow'), f('title', 'Title'), f('intro', 'Intro', 'textarea')],
        lists: [
          {
            k: 'cards',
            label: 'Audience cards',
            itemLabel: 'Audience card',
            fields: [
              f('eyebrow', 'Eyebrow'),
              f('trackBadge', 'Track badge'),
              f('title', 'Title'),
              f('desc', 'Description', 'textarea'),
              f('bullet1', 'Feature bullet 1'),
              f('bullet2', 'Feature bullet 2'),
              f('ctaLabel', 'CTA button label')
            ]
          }
        ]
      },
      {
        k: 'testimonialsSection',
        label: 'Testimonials section',
        fields: [
          f('eyebrow', 'Eyebrow'),
          f('title', 'Title'),
          f('intro', 'Intro', 'textarea'),
          f('visualTabLabel', 'Tab label: visual showcase'),
          f('executiveTabLabel', 'Tab label: executive statements'),
          f('allTabLabel', 'Tab label: all feedback')
        ]
      },
      {
        k: 'framework',
        label: 'Training framework',
        fields: [f('eyebrow', 'Eyebrow'), f('title', 'Title'), f('desc', 'Description', 'textarea')]
      },
      {
        k: 'finalCta',
        label: 'Final CTA',
        fields: [
          f('eyebrow', 'Eyebrow'),
          f('title', 'Title'),
          f('desc', 'Description', 'textarea'),
          f('ctaLabel', 'CTA button label')
        ]
      }
    ]
  },

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
            fields: [
              f('eyebrow', 'Eyebrow'),
              f('badge', 'Badge label'),
              f('title', 'Title'),
              f('desc', 'Description', 'textarea'),
              f('ctaLabel', 'CTA button label')
            ],
            stringLists: [{ k: 'bullets', label: 'Feature bullets' }]
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
        fields: [
          f('title', 'Title'),
          f('desc', 'Description', 'textarea'),
          f('successMessage', 'Subscribe success message')
        ]
      },
      {
        k: 'faq',
        label: 'FAQ',
        fields: [f('eyebrow', 'Eyebrow'), f('title', 'Title'), f('intro', 'Intro', 'textarea')],
        lists: [
          {
            k: 'items',
            label: 'Questions',
            itemLabel: 'Question',
            fields: [f('question', 'Question'), f('answer', 'Answer', 'textarea')]
          }
        ]
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
          f('whatsappLabel', 'WhatsApp button label'),
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
          f('searchPlaceholder', 'Search placeholder'),
          f('disciplineCtaLabel', 'Discipline card CTA label'),
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
              f('subtitle', 'Subtitle'),
              f('desc', 'Description', 'textarea'),
              f('audience', 'Audience'),
              f('category', 'Category ID'),
              f('tag', 'Tag'),
              f('iconName', 'Icon name'),
              f('image', 'Image', 'image'),
              f('courseSlug', 'Inquire button course slug', 'text'),
              f('courseChoices', 'Course choices (e.g. EASA / FAA dual link)', 'choiceList')
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
          f('secondaryLabel', 'Secondary button label'),
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
        k: 'develop',
        label: 'What You Develop',
        fields: [f('eyebrow', 'Eyebrow'), f('title', 'Title'), f('intro', 'Intro', 'textarea')]
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
        k: 'theoryToAircraft',
        label: 'From Theory to the Aircraft',
        fields: [
          f('eyebrow', 'Eyebrow'),
          f('title', 'Title'),
          f('intro', 'Intro', 'textarea'),
          f('tags', 'Module tags', 'stringList')
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
  },

  foxtrotDelta: {
    groups: [
      {
        k: 'hero',
        label: 'Hero',
        fields: [
          f('eyebrow', 'Eyebrow'),
          f('title', 'Title'),
          f('subtitle', 'Subtitle', 'textarea'),
          f('description', 'Description', 'textarea'),
          f('exploreLabel', 'Explore bookshelf button label'),
          f('servicesLabel', 'Explore services button label')
        ]
      },
      {
        k: 'collection',
        label: 'Featured collection',
        fields: [
          f('eyebrow', 'Eyebrow'),
          f('title', 'Title'),
          f('intro', 'Intro', 'textarea'),
          f('viewAllLabel', 'View-all button label')
        ],
        lists: [
          {
            k: 'editions',
            label: 'Featured editions',
            itemLabel: 'Edition',
            fields: [
              f('id', 'Edition ID'),
              f('number', 'Issue number'),
              f('date', 'Date'),
              f('title', 'Title'),
              f('subtitle', 'Subtitle', 'textarea'),
              f('theme', 'Theme'),
              f('readLabel', 'Read button label')
            ],
            stringLists: [{ k: 'highlights', label: 'Highlights' }]
          }
        ]
      },
      {
        k: 'finalCta',
        label: 'Final CTA',
        fields: [
          f('title', 'Title'),
          f('desc', 'Description', 'textarea'),
          f('exploreLabel', 'Explore programs button label'),
          f('contactLabel', 'Contact button label')
        ]
      }
    ]
  },

  courseEnrollment: {
    groups: [
      {
        k: 'breadcrumb',
        label: 'Breadcrumb',
        fields: [f('eventsLabel', 'Events link label'), f('enrollLabel', 'Enrollment step label')]
      },
      {
        k: 'header',
        label: 'Header',
        fields: [
          f('eyebrow', 'Eyebrow'),
          f('intro', 'Intro copy', 'textarea'),
          f('backLabel', 'Back-to-course button label')
        ]
      },
      {
        k: 'sidebar',
        label: 'Course summary sidebar',
        fields: [
          f('badgeLabel', 'Official intake badge'),
          f('tuitionLabel', 'Tuition label'),
          f('durationLabel', 'Duration row label'),
          f('intakeLabel', 'Next intake row label'),
          f('locationLabel', 'Location row label'),
          f('credentialLabel', 'Credential row label'),
          f('credentialValue', 'Credential value'),
          f('accreditationLabel', 'Accreditation strip label')
        ]
      },
      {
        k: 'support',
        label: 'Admissions support box',
        fields: [
          f('title', 'Title'),
          f('desc', 'Description', 'textarea'),
          f('ctaLabel', 'WhatsApp CTA label')
        ]
      },
      {
        k: 'states',
        label: 'Loading & error states',
        fields: [
          f('loadingText', 'Loading text'),
          f('notFoundTitle', 'Not-found title'),
          f('notFoundCtaLabel', 'Not-found CTA label')
        ]
      }
    ]
  },

  courseDetail: {
    groups: [
      {
        k: 'labels',
        label: 'Static labels & buttons',
        fields: [
          f('backLabel', 'Utility bar back link label'),
          f('previewLabel', 'Preview-mode badge'),
          f('refFallback', 'Ref code fallback text'),
          f('easaBadge', 'Utility bar EASA badge'),
          f('dgcaBadge', 'Utility bar DGCA badge'),
          f('shareLabel', 'Share button label'),
          f('copiedLabel', 'Share-copied label'),
          f('eyebrowPrimary', 'Hero eyebrow (part 1)'),
          f('eyebrowSecondary', 'Hero eyebrow (part 2)'),
          f('easaComplianceBadge', 'Hero EASA compliance badge'),
          f('dgcaComplianceBadge', 'Hero DGCA compliance badge'),
          f('faaComplianceBadge', 'Hero FAA compliance badge'),
          f('cbtaBadge', 'Hero CBTA badge'),
          f('applyOnlineLabel', 'Apply Online button label'),
          f('viewModulesLabel', 'View Course Modules button label'),
          f('outcomesEyebrow', 'Outcomes card eyebrow'),
          f('outcomesTitle', 'Outcomes card title'),
          f('complianceEyebrow', 'Compliance card eyebrow'),
          f('complianceTitleEasa', 'Compliance card title (EASA)'),
          f('complianceTitleDgca', 'Compliance card title (DGCA)'),
          f('complianceTitleFaa', 'Compliance card title (FAA)'),
          f('complianceTag1Easa', 'Compliance tag 1 (EASA)'),
          f('complianceTag1Dgca', 'Compliance tag 1 (DGCA)'),
          f('complianceTag1Faa', 'Compliance tag 1 (FAA)'),
          f('complianceTag2', 'Compliance tag 2'),
          f('complianceTag3', 'Compliance tag 3'),
          f('glanceLabel', 'Programme-at-a-glance eyebrow'),
          f('eligibilityEyebrow', 'Eligibility card eyebrow'),
          f('eligibilityTitle', 'Eligibility card title'),
          f('entryReqEyebrow', 'Entry requirements eyebrow'),
          f('entryReqTitle', 'Entry requirements title'),
          f('assessmentEyebrow', 'Assessment eyebrow'),
          f('assessmentTitle', 'Assessment title'),
          f('certEyebrow', 'Certification eyebrow'),
          f('certTitle', 'Certification title'),
          f('datesEyebrow', 'Upcoming courses eyebrow'),
          f('datesTitle', 'Upcoming courses title'),
          f('faqEyebrow', 'FAQ eyebrow'),
          f('faqTitle', 'FAQ title'),
          f('admissionsEyebrow', 'Admissions banner eyebrow'),
          f('admissionsTitle', 'Admissions banner title'),
          f('admissionsDesc', 'Admissions banner description', 'textarea'),
          f('admissionsApplyLabel', 'Admissions banner apply label'),
          f('admissionsWhatsappLabel', 'Admissions banner WhatsApp label'),
          f('sidebarAdmissionsOpenBadge', 'Sidebar admissions-open badge'),
          f('sidebarOverviewLabel', 'Sidebar overview label'),
          f('sidebarTuitionLabel', 'Sidebar tuition label'),
          f('sidebarTuitionNote', 'Sidebar tuition note'),
          f('sidebarEnrollLabel', 'Sidebar enroll button label'),
          f('sidebarWhatsappLabel', 'Sidebar WhatsApp button label'),
          f('sidebarDurationLabel', 'Sidebar duration row label'),
          f('sidebarIntakeLabel', 'Sidebar next-intake row label'),
          f('sidebarLocationLabel', 'Sidebar location row label'),
          f('sidebarDeliveryLabel', 'Sidebar delivery row label'),
          f('sidebarStandardLabel', 'Sidebar standard row label'),
          f('sidebarStandardValueEasa', 'Sidebar standard value (EASA)'),
          f('sidebarStandardValueDgca', 'Sidebar standard value (DGCA)'),
          f('sidebarStandardValueFaa', 'Sidebar standard value (FAA)'),
          f('sidebarCertificateLabel', 'Sidebar certificate row label'),
          f('sidebarCertificateValue', 'Sidebar certificate value'),
          f('sidebarSupportTitle', 'Sidebar support box title'),
          f('sidebarSupportDesc', 'Sidebar support box description', 'textarea')
        ]
      },
      {
        k: 'curriculum',
        label: 'Curriculum framework',
        fields: [
          f('eyebrow', 'Eyebrow'),
          f('title', 'Title'),
          f('subtitle', 'Subtitle')
        ],
        lists: [
          {
            k: 'phases',
            label: 'Curriculum phases',
            itemLabel: 'Phase',
            fields: [f('num', 'Number'), f('label', 'Phase label'), f('title', 'Title')],
            stringLists: [{ k: 'topics', label: 'Topics' }]
          }
        ]
      }
    ]
  }
}

// --------------------------------------------------------------------------
// DEFAULTS  (mirror of the content currently hard-coded in the React pages)
// --------------------------------------------------------------------------

const DEFAULTS = {
  home: {
    hero: {
      eyebrow: 'International Flight Operations Academy',
      title: 'Trained for the moment',
      titleHighlight: 'nothing goes to plan.',
      subtitle:
        'IFOA prepares flight dispatchers and OCC teams for the decisions that matter at 3am not just the ones covered on the exam.',
      primaryLabel: 'Explore Programs',
      secondaryLabel: 'Our Services',
      stats: [
        { value: '500+', label: 'PROFESSIONALS TRAINED ANNUALLY' },
        { value: '70+', label: 'AVIATION ORGANIZATIONS' },
        { value: 'FAA', label: 'PART 65 APPROVED TRAINING' },
        { value: 'Global', label: 'OPERATIONAL DELIVERY' }
      ]
    },
    featuredCourses: {
      eyebrow: 'OPEN-ENROLLMENT PROGRAMS',
      title: 'Your Next Step in Aviation Starts Here',
      intro:
        'Explore our range of open-enrollment programs, developed to build practical knowledge, professional skills, and operational capability across aviation. Find your program and join an upcoming intake.',
      badgeLabel: 'International Open Enrollment'
    },
    trustRating: {
      eyebrow: 'Verified Post-Training Feedback',
      title: 'Rated by the People We Trained',
      desc:
        "Every course closes with a post-training survey sent straight to our OCC teams and dispatchers. Across 458 completed surveys from 70+ aviation organizations, our training has been rated an average of 4.7 out of 5, with 98% saying they'd recommend IFOA.",
      learnMoreLabel: 'Learn more',
      ratingValue: '4.7',
      ratingSuffix: '/5',
      reviewCountLabel: '(458 verified post-training surveys)',
      badgeLabel: '98% Recommendation Rate'
    },
    pathways: {
      eyebrow: 'Global Training Pathways',
      title: 'Certification Pathways Built for Operations',
      seeMoreLabel: 'See More',
      cards: [
        {
          category: 'Flight Dispatcher Training',
          title: 'EASA-Compliant Flight Dispatcher Training',
          desc: 'Comprehensive 5-week programme developing the technical knowledge, operational skills and decision-making competencies required for professional Flight Dispatch.',
          hours: '5 Weeks · Hybrid',
          linkText: 'View Course Details',
          courseSlug: 'flight-dispatcher-initial-certification'
        },
        {
          category: 'FAA Part 65',
          title: 'Aircraft Dispatcher Training',
          desc: 'FAA-approved 200-hour programme developing the knowledge, procedures and practical skills required to become an Aircraft Dispatcher.',
          hours: '200 Hours',
          linkText: 'View Course Details',
          courseSlug: 'aircraft-dispatcher-training-faa-part-65'
        },
        {
          category: 'Multiple Certification',
          title: 'EASA + FAA',
          desc: 'Combined pathway integrating FAA Part 65 certification with European operational knowledge.',
          hours: '200 Hours · Hybrid',
          linkText: 'Explore Combined Training'
        },
        {
          category: 'Maintain Competency',
          title: 'Recurrent Training',
          desc: 'Customized recurrent programs based on the operator, regulatory framework, and fleet.',
          hours: 'Carrier-Customized',
          linkText: 'Recurrent Programs'
        },
        {
          category: 'Professional Development',
          title: 'Advanced Training',
          desc: 'Scenario-driven development for experienced dispatchers and OCC professionals.',
          hours: 'Scenario-Driven',
          linkText: 'Advanced Programs'
        },
        {
          category: 'Operational Teams',
          title: 'Specialist Training',
          desc: 'Crew Control, Ground Operations, Dangerous Goods and Train-the-Trainer programs.',
          hours: 'CBTA Modular Tracks',
          linkText: 'All Specialist Training'
        }
      ]
    },
    network: {
      eyebrow: 'Global Airline Network',
      title: 'Training Professionals for the Global Aviation Industry',
      intro:
        'Our training equips aviation professionals with the skills and expertise to pursue careers across commercial, cargo, and business aviation worldwide.'
    },
    audience: {
      eyebrow: 'Two Different Needs',
      title: 'Built for careers. Built for operations.',
      intro: 'Individuals and aviation organizations should not be forced through the same customer journey.',
      cards: [
        {
          eyebrow: 'For Individuals',
          trackBadge: 'Career Pathway',
          title: 'Become Ready for the Modern OCC',
          desc:
            'Gain the operational knowledge and practical competencies needed to perform confidently in a fast-paced airline Operations Control Centre.',
          bullet1: 'FAA Part 65 & EASA',
          bullet2: 'Scenario-Based Drills',
          ctaLabel: 'Explore Training'
        },
        {
          eyebrow: 'For Airlines',
          trackBadge: 'Airlines & OCCs',
          title: 'Training Built Around Your Operations',
          desc:
            'Customized initial, recurrent, and advanced training designed around your fleet, manuals, procedures, and operational environment.',
          bullet1: 'Customized Fleet Training',
          bullet2: 'OCC Consulting',
          ctaLabel: 'Corporate Training'
        }
      ]
    },
    testimonialsSection: {
      eyebrow: 'Verified Industry Feedback',
      title: 'Stories from Those Who Know Us Best',
      intro:
        'Operational expertise, not generic aviation education. Real-world feedback from flight dispatchers, OCC managers, and airline training leaders.',
      visualTabLabel: 'Airline Showcase',
      executiveTabLabel: 'Executive Statements',
      allTabLabel: 'All Feedback'
    },
    framework: {
      eyebrow: 'Training Framework',
      title: 'Built on global aviation standards. Designed for real operations.',
      desc:
        'Our training draws from ICAO, FAA, and EASA frameworks to deliver internationally relevant knowledge, practical operational skills, and scenario-based learning for today’s aviation professionals.'
    },
    finalCta: {
      eyebrow: 'OPERATIONAL EXCELLENCE',
      title: 'Train for the operation. Not only for the exam.',
      desc: 'Explore individual programs or discuss a customized solution for your organization.',
      ctaLabel: 'Contact IFOA'
    }
  },

  contact: {
    hero: {
      title: "Let's talk about your operation.",
      subtitle: "Tell us who you are and what you need, and we'll route it to the right person.",
      image: null,
      cards: [
        {
          eyebrow: 'Airlines & Operators',
          badge: 'For Airlines',
          title: 'Training my team',
          desc: 'Fleet-wide or role-specific training, built around your ops manual and your regulator.',
          bullets: ['Fleet-Customized', 'OCC Consulting'],
          ctaLabel: 'Corporate Training'
        },
        {
          eyebrow: 'Individuals',
          badge: 'For Individuals',
          title: 'Becoming a dispatcher',
          desc: 'Certification pathways and course dates for individual applicants.',
          bullets: ['FAA & EASA Path', 'Direct Guidance'],
          ctaLabel: 'Explore Training'
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
          email: 'info@theifoa.com'
        },
        {
          region: 'Asia',
          country: 'India',
          address: 'Innov8 Old Fort, 2nd Floor, Saket District Centre, New Delhi 110017, India',
          phone: '+91 98101 44034',
          email: 'info@theifoa.com'
        }
      ]
    },
    newsletter: {
      title: 'Prefer to just get the newsletter?',
      desc: 'One email a month: aviation insight worth reading, plus Foxtrot Delta, free.',
      successMessage: 'Subscribed! Check your inbox for confirmation.'
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Common questions',
      intro: "Can't find what you're looking for? Send us a message and we'll get back to you directly.",
      items: [
        {
          question: 'Do you train individuals, or only airlines and operators?',
          answer:
            "Both. Individuals can enroll directly in our open-enrollment certification pathways, while airlines and operators can book fleet-wide or role-specific training built around their own ops manual and regulator."
        },
        {
          question: 'Is training delivered online, in person, or both?',
          answer:
            'Most programs are hybrid: online modules plus onsite practical sessions at one of our hubs. Some courses run fully virtual. Delivery mode is listed on each course page.'
        },
        {
          question: 'Which regulatory standards do your certifications follow?',
          answer:
            'Our Flight Dispatcher programs are built to EASA ORO.GEN.110 and ICAO Doc 10106, and our US school is FAA Part 65 approved.'
        },
        {
          question: 'Where are your training locations?',
          answer:
            'We operate three regional hubs: Basel, Switzerland (Europe HQ); Daytona Beach, Florida (IFOA USA); and New Delhi, India (IFOA India), alongside virtual classroom delivery worldwide.'
        },
        {
          question: 'How do I enroll, and what happens after I apply?',
          answer:
            "Apply online for the intake you want. Our admissions team reviews your prerequisites and sends an official placement offer with payment and onboarding details."
        },
        {
          question: 'Can you build a custom program for our airline or operation?',
          answer:
            "Yes. Airlines and operators don't have to wait for a public intake date: talk to us and we'll schedule fleet-wide or role-specific training around your operation."
        }
      ]
    }
  },

  about: {
    hero: {
      title: 'The Global Flight Dispatch Standard',
      subtitle:
        'Five years in, we became the standard other schools get measured against.',
      primaryLabel: 'Book a Consultation',
      secondaryLabel: 'Explore Programs',
      image: null
    },
    executive: {
      heading:
        'In just five years, we became the leading aviation training company in Europe for the education and development of flight dispatchers.',
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
    footprint: {
      eyebrow: 'GLOBAL FOOTPRINT',
      title: 'Operational wherever airlines fly',
      intro:
        'Three regional operational hubs supporting carriers, students, and dispatch teams across 3 continents.',
      regions: [
        {
          name: 'Europe HQ',
          location: 'Basel, Switzerland',
          facility: 'IFOA',
          desc: 'European headquarters leading EASA Part-ORO GEN 110 compliant Flight Dispatcher certification and OCC scenario labs'
        },
        {
          name: 'North America',
          location: 'Daytona Beach, FL',
          facility: 'IFOA USA',
          desc: 'FAA Part 65 approved Aircraft Dispatcher school and Agent for Service.'
        },
        {
          name: 'India & Asia-Pacific',
          location: 'New Delhi, India',
          facility: 'IFOA INDIA',
          desc: 'South Asian School delivering FAA Part 65 certified and EASA Part ORO GEN 110 compliant Flight Dispatcher programs.'
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
        'Six disciplines, one standard: training that prepares people to make the right call under pressure.',
      primaryLabel: 'Book a Consultation',
      whatsappLabel: 'WhatsApp Us',
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
          badge1: '200 HOURS',
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
          title: 'Training That Reflects the Operation',
          subtitle: 'REAL-WORLD OCC CONTEXT',
          desc: 'Every program is built around realistic operational scenarios, helping learners apply knowledge, make decisions, and respond to the challenges of a modern OCC.',
          iconName: 'flight-route'
        },
        {
          idx: '02',
          title: 'Learn From Those Who Operate',
          subtitle: 'ACTIVE INDUSTRY PRACTITIONERS',
          desc: 'Train with experienced aviation professionals who bring current operational knowledge and real-world experience into every session.',
          iconName: 'instructor-board'
        },
        {
          idx: '03',
          title: 'Training That Fits Your Operation',
          subtitle: 'ONSITE, VIRTUAL & HYBRID',
          desc: 'Choose the delivery format that works for you (onsite, virtual, or hybrid) without compromising the quality or practical focus of the training.',
          iconName: 'occ-console'
        },
        {
          idx: '04',
          title: 'Demonstrate What You Can Do',
          subtitle: 'COMPETENCY-FOCUSED ASSESSMENT',
          desc: 'Go beyond completing a course. Build and demonstrate the knowledge, skills, and behaviours required to perform effectively in real operational environments.',
          iconName: 'official-certificate'
        }
      ]
    },
    specialist: {
      eyebrow: 'Aviation Expertise, Your Way',
      title: 'From Career Growth to Operational Excellence',
      intro:
        "Build your career with specialized aviation services or strengthen your organization's capabilities with tailored operational solutions. Training, consulting, and expertise designed around what you need.",
      note: '',
      searchPlaceholder: 'Search disciplines...',
      disciplineCtaLabel: 'Inquire',
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
          subtitle: 'Own the operation from the ground.',
          desc: 'Build the skills to plan, monitor, and coordinate flights while making informed operational decisions in a modern airline OCC.',
          audience: 'Individuals & Airline OCC Teams',
          category: 'flight-ops',
          tag: 'Flight Operations',
          iconName: 'dispatcher-headset',
          image: null,
          courseChoices: [
            { label: 'EASA', courseSlug: 'flight-dispatcher-initial-certification' },
            { label: 'FAA Part 65', courseSlug: 'aircraft-dispatcher-training-faa-part-65' }
          ]
        },
        {
          id: '02',
          title: 'Dangerous Goods',
          subtitle: 'Know the risks. Move with confidence.',
          desc: 'Develop the practical expertise to identify, handle, document, and manage dangerous goods throughout the air transport process.',
          audience: 'Airlines, Cargo & Ground Handlers',
          category: 'flight-ops',
          tag: 'DGR Compliance',
          iconName: 'dgr-flame',
          image: null,
          courseSlug: 'dangerous-goods-regulations-cbta-initial'
        },
        {
          id: '03',
          title: 'Train the Trainer',
          subtitle: 'Turn expertise into exceptional training.',
          desc: 'Develop the skills to engage aviation professionals, build competency, and deliver training that translates into real operational performance.',
          audience: 'Nominated Trainers & Instructors',
          category: 'train-trainer',
          tag: 'Instructional Pedagogy',
          iconName: 'instructor-board',
          image: null,
          courseSlug: 'train-the-trainer-icao-cbta-instructor'
        },
        {
          id: '04',
          title: 'Human Factors for OCC',
          subtitle: 'Performance under pressure starts with people.',
          desc: 'Strengthen decision-making, communication, teamwork, and resilience for demanding aviation environments.',
          audience: 'OCC & Flight Operations Personnel',
          category: 'flight-ops',
          tag: 'Human Factors for OCC',
          iconName: 'human-brain-crm',
          image: null,
          courseSlug: 'human-factors-in-the-occ'
        },
        {
          id: '05',
          title: 'Crew Control',
          subtitle: 'Keep the operation moving.',
          desc: 'Build the skills to manage crew planning, disruptions, pairings, rostering, and operational changes in a fast-paced airline environment.',
          audience: 'Crew Schedulers & Controllers',
          category: 'flight-ops',
          tag: 'Crew Scheduling',
          iconName: 'crew-roster',
          image: null,
          courseSlug: 'airline-crew-control-flight-rostering'
        },
        {
          id: '06',
          title: 'Consulting Services',
          subtitle: 'Turn operational challenges into better performance.',
          desc: 'Get tailored aviation expertise across OCC processes, operational systems, regulatory requirements, and organizational capability.',
          audience: 'Airlines & Aviation Organizations',
          category: 'consulting',
          tag: 'Aviation Advisory',
          iconName: 'airline-audit',
          image: null,
          courseSlug: 'airline-occ-setup-operational-consulting'
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
      secondaryLabel: 'Inquire on WhatsApp',
      image: null
    },
    programs: {
      eyebrow: 'Open-Enrollment Programs',
      title: 'Your Next Step in Aviation Starts Here',
      intro:
        'Explore our range of open-enrollment programs, developed to build practical knowledge, professional skills, and operational capability across aviation. Find your program and join an upcoming intake.',
      badge: 'Rolling Global Intakes',
      emptyTitle: 'No open intakes right now',
      emptyDesc:
        'New cohorts are published here as admissions open. Leave your email below to be notified.'
    },
    develop: {
      eyebrow: 'What You Develop',
      title: 'Knowledge is only useful when you can apply it operationally.',
      intro:
        'The program develops the technical knowledge, situational awareness and operational judgment required to support safe and efficient flight operations.'
    },
    curriculum: {
      eyebrow: 'Curriculum Overview',
      title: 'What the Flight Dispatch program covers',
      intro: 'Organized around operational capability, not a flat list of disconnected subjects.',
      footnote: '',
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
    theoryToAircraft: {
      eyebrow: 'FROM THEORY TO THE AIRCRAFT',
      title: 'Know the aircraft. Understand the operation.',
      intro:
        'Take aircraft knowledge beyond the classroom. Our training connects aircraft systems, performance, limitations, mass and balance, and flight planning to the operational decisions professionals make every day.',
      tags: ['AIRCRAFT SYSTEMS', 'PERFORMANCE', 'MASS & BALANCE', 'FLIGHT PLANNING', 'LIMITATIONS']
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
  },

  foxtrotDelta: {
    hero: {
      eyebrow: 'The Voice of Operational Control',
      title: 'Foxtrot Delta Magazine',
      subtitle: 'Meet the Operational Control Teams that make the Magic happen!',
      description:
        'The aviation industry’s first and only publication dedicated exclusively to flight dispatchers, crew controllers, and OCC personnel worldwide, spotlighting the essential roles, daily challenges, and forward-thinking innovations that shape modern aviation.',
      exploreLabel: 'Explore Digital Bookshelf',
      servicesLabel: 'Explore Our Services'
    },
    collection: {
      eyebrow: 'The Collection',
      title: 'Featured Foxtrot Delta Issues',
      intro:
        'Highlights from our landmark publications covering OCC leadership, technological breakthroughs, and flight safety science.',
      viewAllLabel: 'View All on Bookshelf',
      editions: [
        {
          id: 'special-edition',
          number: 'Special Edition',
          date: 'May 2023',
          title: 'Aviation Sustainability',
          subtitle: 'Can Aviation Kick Its Contrail Habit? & Net Zero for Business Aviation',
          theme: 'Sustainability & Ecology',
          readLabel: 'Read Issue',
          highlights: ['SATAVIA Contrail Science', 'AZZERA Net Zero Pathways', 'Eco-Climb Profiles']
        },
        {
          id: 'issue-02',
          number: 'Issue N°2',
          date: 'February 2023',
          title: 'Jetfly OCC & Fleet Pioneers',
          subtitle: 'Managing the World’s Largest Pilatus Fleet with High-Precision Dispatch',
          theme: 'Fleet Operations',
          readLabel: 'Read Issue',
          highlights: ['Jetfly 60+ PC-12/PC-24 OCC', 'SITA EWAS Predictive Analytics', 'SATAVIA Meteorology']
        },
        {
          id: 'issue-01',
          number: 'Issue N°1',
          date: 'November 2022',
          title: 'The Indian Ocean Pearl',
          subtitle: 'Air Mauritius OCC Operations & Threat-Informed Risk Planning',
          theme: 'Oceanic Operations',
          readLabel: 'Read Issue',
          highlights: ['Air Mauritius Isolated Hub', 'Osprey:Sentinel Threat Intel', 'Honeywell Forge Efficiency']
        }
      ]
    },
    finalCta: {
      title: 'Ready to enhance your operational competencies?',
      desc:
        'Book the most suitable training program to acquire essential decision-making skills, regulatory compliance, and peak operational performance.',
      exploreLabel: 'Explore Training Programs',
      contactLabel: 'Contact Us'
    }
  },

  courseEnrollment: {
    breadcrumb: {
      eventsLabel: 'Events & Programs',
      enrollLabel: 'Online Enrollment'
    },
    header: {
      eyebrow: 'Official Candidate Intake Portal',
      intro:
        'Complete your official admission form below. Once received, our admissions panel reviews prerequisites and issues your official placement offer.',
      backLabel: 'Back to Course Overview'
    },
    sidebar: {
      badgeLabel: 'Official Intake',
      tuitionLabel: 'Course Tuition',
      durationLabel: 'Duration',
      intakeLabel: 'Next Intake',
      locationLabel: 'Location',
      credentialLabel: 'Credential',
      credentialValue: 'IFOA Flight Dispatch Cert',
      accreditationLabel: 'Regulatory Framework'
    },
    support: {
      title: 'Need Admissions Assistance?',
      desc: 'Have questions regarding eligibility, visa letters, or payment schedules?',
      ctaLabel: 'Chat with Admissions on WhatsApp'
    },
    states: {
      loadingText: 'Loading Official Application Portal…',
      notFoundTitle: 'Application Portal Not Found',
      notFoundCtaLabel: 'View All Open Programs'
    }
  },

  courseDetail: {
    labels: {
      backLabel: 'All Intakes & Events',
      previewLabel: 'Preview Mode',
      refFallback: 'IFOA Training',
      easaBadge: 'EASA Compliant',
      dgcaBadge: 'DGCA & ICAO Aligned',
      shareLabel: 'Share',
      copiedLabel: 'Copied',
      eyebrowPrimary: 'Professional Aviation Training',
      eyebrowSecondary: 'Flight Dispatch Curriculum',
      easaComplianceBadge: 'EASA ORO.GEN.110 Aligned',
      dgcaComplianceBadge: 'DGCA & ICAO Aligned Training',
      faaComplianceBadge: 'FAA Part 65 Aligned',
      cbtaBadge: 'Competency-Based Training',
      applyOnlineLabel: 'View Programme',
      viewModulesLabel: 'View Course Modules',
      outcomesEyebrow: 'Competency Outcomes',
      outcomesTitle: 'Built for Operational Control',
      complianceEyebrow: 'Regulatory & Training Framework',
      complianceTitleEasa: 'EASA & ICAO Training Framework',
      complianceTitleDgca: 'DGCA & ICAO Training Framework',
      complianceTitleFaa: 'FAA & ICAO Training Framework',
      complianceTag1Easa: 'EASA ORO.GEN.110',
      complianceTag1Dgca: 'DGCA CAR',
      complianceTag1Faa: 'FAA 14 CFR Part 65',
      complianceTag2: 'ICAO Doc 10106',
      complianceTag3: 'CBTA Framework',
      glanceLabel: 'Programme at a Glance',
      eligibilityEyebrow: 'Eligibility Profile',
      eligibilityTitle: 'Who Should Attend?',
      entryReqEyebrow: 'Admissions',
      entryReqTitle: 'Entry Requirements',
      assessmentEyebrow: 'Evaluation',
      assessmentTitle: 'Assessment',
      certEyebrow: 'On Completion',
      certTitle: 'Certification',
      datesEyebrow: 'Schedule',
      datesTitle: 'Upcoming Courses',
      faqEyebrow: 'Questions',
      faqTitle: 'Frequently Asked Questions',
      admissionsEyebrow: 'Admissions Portal',
      admissionsTitle: 'Ready to Start Your Dispatch Career?',
      admissionsDesc: 'Reserve your seat for the upcoming training or connect directly with our team.',
      admissionsApplyLabel: 'Apply Online ↗',
      admissionsWhatsappLabel: 'WhatsApp Chat',
      sidebarAdmissionsOpenBadge: 'Admissions Open',
      sidebarOverviewLabel: 'Programme Overview',
      sidebarTuitionLabel: 'Training Fee',
      sidebarTuitionNote: '+ 18% GST / Track · Inclusive of official materials',
      sidebarEnrollLabel: 'Enroll Now - Apply Online ↗',
      sidebarWhatsappLabel: 'Inquire on WhatsApp',
      sidebarDurationLabel: 'Duration',
      sidebarIntakeLabel: 'Next Course',
      sidebarLocationLabel: 'Training Location',
      sidebarDeliveryLabel: 'Format',
      sidebarStandardLabel: 'Standard',
      sidebarStandardValueEasa: 'EASA-Compliant',
      sidebarStandardValueDgca: 'DGCA / EASA Aligned',
      sidebarStandardValueFaa: 'FAA Part 65',
      sidebarCertificateLabel: 'Certificate',
      sidebarCertificateValue: 'IFOA Certificate',
      sidebarSupportTitle: 'Admissions Support',
      sidebarSupportDesc: 'Questions about eligibility or group bookings?'
    },
    curriculum: {
      eyebrow: 'Curriculum Framework',
      title: 'What the Flight Dispatch Programme Covers',
      subtitle: 'Structured around the core competencies required for international airline dispatch.',
      phases: [
        {
          num: '01',
          label: 'PHASE 01',
          title: 'The Operating Environment',
          topics: [
            'Air Law & Civil Regulations',
            'ICAO / EASA Alignment',
            'Air Traffic Management (ATM)',
            'Aeronautical Communications'
          ]
        },
        {
          num: '02',
          label: 'PHASE 02',
          title: 'Know the Aircraft',
          topics: [
            'Aircraft Systems & Avionics',
            'Flight Instrumentation',
            'Principles of Flight & Aerodynamics',
            'Aircraft Performance & Limits'
          ]
        },
        {
          num: '03',
          label: 'PHASE 03',
          title: 'Plan the Flight',
          topics: [
            'Aviation Navigation & Routes',
            'Synoptic Aeronautical Meteorology',
            'Mass & Balance Calculations',
            'Operational Flight Planning (OFP)'
          ]
        },
        {
          num: '04',
          label: 'PHASE 04',
          title: 'Control the Operation',
          topics: [
            'Live OCC Flight Monitoring',
            'Standard Operational Procedures',
            'Crew & Dispatch Human Factors',
            'OCC Operational Coordination'
          ]
        },
        {
          num: '05',
          label: 'PHASE 05',
          title: 'Make the Decision',
          topics: [
            'Tactical Situational Awareness',
            'Risk Assessment & Mitigation',
            'Collaborative Decision Making (CDM)',
            'Complex Scenario Simulator Drills'
          ]
        }
      ]
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

// Strip an admin-submitted content blob down to exactly the shape SCHEMAS[page]
// declares (known groups -> known fields / lists / stringLists only). This is
// the server-side enforcement that the admin editor can change copy but not
// inject arbitrary keys the frontend might later read as layout/structure.
function sanitizeField(type, value) {
  if (type === 'stringList') {
    return Array.isArray(value) ? value.filter((s) => typeof s === 'string') : []
  }
  if (type === 'choiceList') {
    // Array of { label, courseSlug } - e.g. the Flight Dispatch discipline
    // card's EASA / FAA Part 65 dual links.
    if (!Array.isArray(value)) return []
    return value
      .filter((v) => isPlainObject(v) && typeof v.label === 'string' && typeof v.courseSlug === 'string')
      .map((v) => ({ label: v.label, courseSlug: v.courseSlug }))
  }
  if (type === 'image') {
    if (!value || typeof value !== 'object') return null
    const { url, key, alt } = value
    return {
      url: typeof url === 'string' ? url : null,
      key: typeof key === 'string' ? key : null,
      alt: typeof alt === 'string' ? alt : ''
    }
  }
  // text / textarea
  return typeof value === 'string' ? value : value == null ? value : String(value)
}

function sanitizeListItem(list, item) {
  if (!isPlainObject(item)) return null
  const out = {}
  for (const field of list.fields || []) {
    if (item[field.k] !== undefined) out[field.k] = sanitizeField(field.type, item[field.k])
  }
  for (const sl of list.stringLists || []) {
    if (item[sl.k] !== undefined) out[sl.k] = sanitizeField('stringList', item[sl.k])
  }
  return out
}

function sanitizeGroup(group, value) {
  if (!isPlainObject(value)) return {}
  const out = {}
  for (const field of group.fields || []) {
    if (value[field.k] !== undefined) out[field.k] = sanitizeField(field.type, value[field.k])
  }
  for (const list of group.lists || []) {
    if (Array.isArray(value[list.k])) {
      out[list.k] = value[list.k].map((item) => sanitizeListItem(list, item)).filter(Boolean)
    }
  }
  return out
}

function sanitizeContent(page, data) {
  const schema = SCHEMAS[page]
  if (!schema || !isPlainObject(data)) return {}
  const out = {}
  for (const group of schema.groups || []) {
    if (data[group.k] !== undefined) out[group.k] = sanitizeGroup(group, data[group.k])
  }
  return out
}

module.exports = {
  PAGE_KEYS,
  PAGE_LABELS,
  SCHEMAS,
  DEFAULTS,
  mergeContent,
  sanitizeContent,
  isValidPage
}
