// Migrates the hard-coded ServicesPage catalog into the database so every
// course card on the site has a real detail page. Upserts by slug - safe to
// re-run, and it will not clobber edits made in the admin to other fields.
//
// Hero images point at files in frontend/public/course-images so the pages
// look right before Cloudflare R2 is configured. Uploading a hero image in
// the admin replaces them.
//
// Run: npm run seed:catalog
require('dotenv').config()

const mongoose = require('mongoose')
const { connectDB } = require('../config/db')
const Course = require('../models/Course')

const ICAO_INTRO =
  'This programme is delivered under the IFOA Competency-Based Training and Assessment (CBTA) framework, aligned with ICAO Annex 1 & 6 and ICAO Doc 10106.'

const courses = [
  {
    slug: 'flight-dispatcher-initial-certification',
    authority: "EASA / FAA Part 65 Standards",
    format: "Hybrid: 2 Weeks Online + 3 Weeks Onsite Sønderborg (Denmark)",
    careerPath: "Commercial Airline Dispatcher, Cargo Flight Follower, Corporate OCC Specialist",
    intakeLabel: "Next Intake: 4th Jan 2027",
    title: 'Flight Dispatcher Initial Training',
    refCode: 'FD-INITIAL',
    category: 'dispatch',
    featured: true,
    order: 10,
    summary:
      'A comprehensive 5-week programme developing the technical knowledge, operational skills and decision-making competencies required for professional Flight Dispatch.',
    // No heroImage: falls back to the same photo as the "Flight Dispatch"
    // Services card (frontend/src/components/course/CourseCard.jsx CATEGORY_IMG).
    heroImage: null,
    schedule: {
      mode: 'Hybrid',
      startDate: new Date('2027-01-04T09:00:00Z'),
      endDate: new Date('2027-02-05T17:00:00Z'),
      timeText: '2 Weeks Online + 3 Weeks On-site Sønderborg (Denmark)'
    },
    duration: '5 Weeks',
    location: '2 Weeks Online + 3 Weeks On-site Sønderborg (Denmark)',
    price: { amount: 3500, currency: 'EUR', note: 'Includes training materials, examinations & certification' },
    whatYouWillLearn: {
      intro:
        'Built for Operational Control: Develop core competency across flight planning, dispatch, operational risk assessment, and collaborative decision-making.',
      points: [
        'Plan and prepare flights',
        'Assess operational risks and constraints',
        'Apply weather, fuel, routing and alternate requirements',
        'Monitor flights and anticipate disruptions',
        'Make operational decisions under changing conditions',
        'Apply EASA, ICAO and operator procedures'
      ]
    },
    delivery: {
      intro: 'Hybrid delivery: 2 weeks online theory modules combined with 3 weeks in-person simulator and flight operations practicum in Sønderborg (Denmark).',
      items: [
        { label: 'School', title: 'IFOA', description: 'Delivered by the International Flight Operations Academy' },
        { label: 'Format', title: 'Hybrid (Online + Onsite)', description: '2 Weeks Online Theory + 3 Weeks Onsite Sønderborg (Denmark)' }
      ]
    },
    trainingStandards: {
      intro:
        'Programme structured around applicable EASA Air Operations requirements and ICAO Flight Operations Officer / Flight Dispatcher training principles, delivered under the IFOA Competency-Based Training and Assessment (CBTA) framework.',
      logos: []
    },
    whoShouldAttend: {
      intro: 'No previous Flight Dispatch experience required.',
      points: [
        'Aspiring Flight Dispatchers: for candidates seeking to enter professional Flight Dispatch.',
        'OCC & Operations Personnel: for personnel working in airline operations and operational control environments.',
        'Aviation Professionals: for aviation professionals seeking structured Flight Dispatch training.'
      ],
      outro:
        'Target roles on completion: Commercial Airline Dispatcher, Cargo Flight Follower, Corporate OCC Specialist.'
    },
    entryRequirements: {
      intro: 'Confirmed admission prerequisites for this programme:',
      points: [
        'English language proficiency for professional aviation training',
        'No previous Flight Dispatch experience required'
      ]
    },
    courseContent: {
      intro: 'The curriculum covers the full prerequisite learning objectives for international flight dispatch:',
      modules: [
        'Civil Aviation Air Law & Airspace Regulations (ICAO / EASA / FAA)',
        'Advanced Aeronautical Meteorology & Severe Weather Mitigation',
        'Aircraft Navigation, Jeppesen / Lido Route Optimization & NOTAMs',
        'Aircraft Systems, Powerplants, MEL / CDL & Performance Limitations',
        'Mass & Balance Calculation, Fuel Policies & ETOPS / EDTO Requirements',
        'Real-Time OCC Simulator Practicum: High-Stress In-Flight Emergency Scenarios'
      ],
      note: 'Curriculum draws on both FAA Part 65 and EASA-aligned flight dispatch training content.'
    },
    certification: {
      text:
        'Upon successfully completing the exam you will be awarded an IFOA Flight Dispatch Completion Certificate, valid for an unlimited period.',
      points: ['Practical and multiple-choice examination', '80% required to pass']
    }
  },
  {
    // US pathway counterpart to flight-dispatcher-initial-certification (EASA).
    // Content matches the FAA 14 CFR Part 65 Appendix A knowledge-area
    // structure (8 areas, not the EASA course's 5-phase framing) - see
    // pageContent.courseDetail.curriculum.phases below.
    slug: 'aircraft-dispatcher-training-faa-part-65',
    authority: 'FAA Part 65 Standards',
    format: 'Classroom + Online ADX Support (Daytona Beach, FL)',
    careerPath: 'Commercial Airline Dispatcher, Cargo Flight Follower, Corporate OCC Specialist',
    intakeLabel: 'Rolling Admissions',
    title: 'Aircraft Dispatcher Initial Certification',
    refCode: 'AD-FAA65',
    category: 'dispatch',
    featured: true,
    order: 15,
    summary:
      'A 200-hour FAA-approved programme built to develop the technical knowledge, operational judgment, and decision-making competencies required to work as a professional Aircraft Dispatcher.',
    trustStat: '500+ dispatchers trained across 70+ operators',
    // No heroImage: falls back to the same "Flight Dispatch" Services image
    // as the EASA course (frontend/src/components/course/CourseCard.jsx).
    heroImage: null,
    schedule: {
      mode: 'Hybrid',
      timeText: 'Classroom + Online ADX Support, Daytona Beach (FL)'
    },
    duration: '200 Hours',
    location: 'Daytona Beach, FL',
    price: {
      amount: 4500,
      currency: 'USD',
      note: 'Includes 200-hour training, course materials, LMS access and weekly ADX masterclasses.'
    },
    whatYouWillLearn: {
      intro: 'Built for Operational Control:',
      points: [
        'Plan and prepare operational flights',
        'Evaluate weather, NOTAMs and operational constraints',
        'Apply fuel, performance and alternate requirements',
        'Prepare and amend dispatch releases',
        'Monitor flights and changing operational conditions',
        'Exercise operational control with the PIC'
      ]
    },
    delivery: {
      intro: 'Classroom instruction combined with online ADX preparation support at IFOA USA, Daytona Beach (FL).',
      items: [
        { label: 'School', title: 'IFOA USA', description: 'Delivered by the International Flight Operations Academy' },
        { label: 'Format', title: 'Classroom + Online ADX Support', description: 'Daytona Beach (FL)' }
      ]
    },
    trainingStandards: {
      intro:
        'A 200-hour FAA-approved Aircraft Dispatcher certification course covering every knowledge area and topic required by Appendix A to 14 CFR Part 65.',
      logos: []
    },
    whoShouldAttend: {
      // Plain pills (no " - " description), matching the eligibility list
      // shown for this course rather than the 3-card profile layout.
      points: [
        'No previous dispatch experience required',
        'Aspiring Aircraft Dispatchers',
        'Airline & OCC Personnel',
        'Aviation Professionals'
      ],
      outro:
        'Target roles on completion: Commercial Airline Dispatcher, Cargo Flight Follower, Corporate OCC Specialist.'
    },
    entryRequirements: {
      intro: 'Confirmed admission prerequisites for this programme:',
      points: [
        'English language proficiency for professional aviation training',
        'No previous dispatch experience required'
      ]
    },
    // Per-course reference list only - the actual curriculum shown on the page
    // comes from pageContent.courseDetail.curriculum.phases below (8 FAA
    // Appendix A knowledge areas), not this generic module list.
    courseContent: {
      intro: 'All eight FAA-required knowledge areas, presented in the same order as Appendix A to 14 CFR Part 65:',
      modules: [
        'I. Regulations: Part 65 Subpart C, Parts 1, 25, 61, 71, 91, 121, 139 & 175, 49 CFR Part 830, General Operating Manual',
        'II. Meteorology: Weather theory, hazardous weather phenomena, NOTAMs, weather charts',
        'III. Navigation: Enroute and terminal navigation, charts and publications, alternate airport planning',
        'IV. Aircraft: Aircraft systems, performance, weight and balance, airworthiness requirements',
        'V. Communications: Dispatch communications procedures, radio phraseology, ATC coordination',
        'VI. ATC: Air traffic control procedures, airspace classifications, operational coordination',
        'VII. Emergency: Emergency and abnormal procedures, in-flight contingencies, irregular operations',
        'VIII. Practical Dispatch: Applied flight planning, dispatch release preparation, scenario-based decision-making'
      ],
      note: 'We train Aircraft Dispatchers, not test takers: the ADX knowledge test is one step in the certification process.'
    },
    certification: {
      text:
        'Upon successfully completing the exam you will be awarded an IFOA Aircraft Dispatcher Training Completion Certificate, preparing you to sit the FAA ADX knowledge test and practical test with an FAA examiner.',
      points: ['ADX Knowledge Test', 'Practical Test with FAA Examiner']
    },
    additionalCosts: {
      intro: 'Additional certification costs',
      items: [
        { label: 'ADX Knowledge Test', amount: '$175' },
        { label: 'Practical Test / Examiner', amount: '$600' }
      ],
      note: 'Third-party fees, paid directly to the examiner. Not included in tuition.'
    },
    trainingPhilosophy: {
      eyebrow: 'Our Training Philosophy',
      title: 'We train Aircraft Dispatchers, not test takers',
      intro:
        'The ADX knowledge test is one step in the certification process. The programme focuses on applying knowledge in realistic operational situations and developing the judgment and competencies required of a professional dispatcher.',
      cards: [
        {
          title: 'ADX LMS Portal',
          desc: 'Structured online preparation and practice resources for the ADX knowledge test.'
        },
        {
          title: 'Weekly ADX Masterclass',
          desc: 'Live online sessions with an instructor covering ADX subjects, questions and difficult concepts.'
        },
        {
          title: 'Instructor Support',
          desc: 'ADX preparation runs alongside professional dispatcher training rather than replacing it.'
        }
      ]
    },
    // Curriculum shown on the page: the 8 FAA Appendix A knowledge areas, in
    // the exact order 14 CFR Part 65 Appendix A lists them. Arrays merge
    // wholesale (see mergeContent in utils/pageContent.js) so all 8 items must
    // be listed here even though this replaces the shared 5-phase default.
    pageContent: {
      courseDetail: {
        // Objects merge key-by-key onto the shared labels (unlike arrays,
        // which replace wholesale) - only these keys actually differ for FAA.
        labels: {
          eyebrowSecondary: 'Aircraft Dispatcher Training',
          applyOnlineLabel: 'Apply Online',
          admissionsTitle: 'Ready to start your dispatcher certification?',
          admissionsDesc: '200 hours · FAA Part 65 approved · $4,500',
          admissionsApplyLabel: 'Apply Online'
        },
        curriculum: {
          eyebrow: 'Curriculum Framework',
          title: 'What the Aircraft Dispatcher Programme Covers',
          subtitle: 'All eight FAA-required knowledge areas from 14 CFR Part 65 Appendix A, presented in the same order.',
          phases: [
            {
              num: 'I',
              label: 'AREA I',
              title: 'Regulations',
              topics: [
                'Part 65 Subpart C',
                'Applicable Parts 1, 25, 61, 71, 91, 121, 139 & 175',
                '49 CFR Part 830',
                'General Operating Manual'
              ]
            },
            {
              num: 'II',
              label: 'AREA II',
              title: 'Meteorology',
              topics: [
                'Weather theory, hazardous weather phenomena, NOTAMs, weather charts, and the meteorological judgment required for flight planning and dispatch release decisions.'
              ]
            },
            {
              num: 'III',
              label: 'AREA III',
              title: 'Navigation',
              topics: [
                'Enroute and terminal navigation, charts and publications, area navigation concepts, and alternate airport planning.'
              ]
            },
            {
              num: 'IV',
              label: 'AREA IV',
              title: 'Aircraft',
              topics: [
                'Aircraft systems, performance, weight and balance, and airworthiness requirements relevant to dispatch.'
              ]
            },
            {
              num: 'V',
              label: 'AREA V',
              title: 'Communications',
              topics: [
                'Dispatch communications procedures, radio phraseology, and coordination with flight crews and air traffic control.'
              ]
            },
            {
              num: 'VI',
              label: 'AREA VI',
              title: 'ATC',
              topics: [
                'Air traffic control procedures, airspace classifications, and operational coordination.'
              ]
            },
            {
              num: 'VII',
              label: 'AREA VII',
              title: 'Emergency',
              topics: [
                'Emergency and abnormal procedures, in-flight contingencies, and operational control during irregular operations.'
              ]
            },
            {
              num: 'VIII',
              label: 'AREA VIII',
              title: 'Practical Dispatch',
              topics: [
                'Applied flight planning, dispatch release preparation, and scenario-based decision-making exercises.'
              ]
            }
          ]
        }
      }
    }
  },
  {
    slug: 'flight-dispatch-recurrent-refresher-course',
    authority: "ICAO CBTA Framework Compliant",
    format: "Interactive Digital Workshops + Scenario Simulations",
    careerPath: "Annual Operator Mandate Compliance & Recertification",
    intakeLabel: "Rolling Monthly Admissions",
    title: 'Flight Dispatch Recurrent & Refresher Course',
    refCode: 'FD-RECURRENT',
    category: 'dispatch',
    order: 20,
    summary: 'Mandatory annual competency maintenance for active airline dispatchers.',
    heroImage: null, // falls back to the "Flight Dispatch" Services image (same category)
    schedule: { mode: 'Online', timeText: 'Rolling monthly admissions' },
    duration: '3 Weeks',
    location: 'Interactive Digital Workshops + Scenario Simulations',
    price: { amount: null, currency: 'EUR', note: '' },
    whatYouWillLearn: {
      intro:
        'Focused regulatory and tactical refresher on irregular operations (IROPS), emergency communications, evolving winter hazards, and next-gen airspace mandates.',
      points: [
        'To maintain licence currency against annual operator mandates',
        'To manage irregular operations and diversions under pressure',
        'To apply updated fuel and contingency policies correctly',
        'To operate within the latest EASA / FAA airspace regulations'
      ]
    },
    delivery: {
      intro: 'Modular flexible format delivered as interactive digital workshops.',
      items: [
        { label: 'School', title: 'IFOA', description: 'Delivered by the International Flight Operations Academy' },
        { label: 'Format', title: 'Virtual Online', description: '3 weeks modular workshops and scenario simulations' }
      ]
    },
    trainingStandards: { intro: `${ICAO_INTRO} Compliant with the ICAO CBTA framework for recurrent training.`, logos: [] },
    curriculum: {
      eyebrow: 'Curriculum Framework',
      title: 'What the Recurrent Refresher Programme Covers',
      subtitle: 'The regulatory and tactical areas that change most between annual cycles, refreshed against this year\'s standards.',
      phases: [
        {
          num: '01',
          label: '01',
          title: 'Adverse Weather, Volcanic Ash & Space Weather Hazard Mitigation',
          focus: 'Evolving winter and high-altitude hazards',
          description:
            'A refresher on adverse weather decision-making, volcanic ash advisory response, and the growing operational relevance of space weather on HF communications and GPS-based navigation.'
        },
        {
          num: '02',
          label: '02',
          title: 'Advanced Fuel Management Policies & Contingency Fuel Reductions',
          focus: 'What changed since last year\'s policy',
          description:
            'Updated contingency fuel reduction methods and advanced fuel management policy, reviewed against the current operator fuel policy rather than last year\'s.'
        },
        {
          num: '03',
          label: '03',
          title: 'Live OCC Crisis Management & Diversion Decision-Making Simulations',
          focus: 'Decision drills under time pressure',
          description:
            'Live simulation of irregular operations and diversion scenarios, run under realistic time pressure to keep crisis decision-making current rather than theoretical.'
        },
        {
          num: '04',
          label: '04',
          title: 'Updated EASA / FAA Airspace & Operational Dispatch Regulations',
          focus: 'This cycle\'s regulatory changes',
          description:
            'A focused review of the airspace and operational dispatch regulation changes issued since the previous recertification cycle, under both EASA and FAA frameworks.'
        }
      ]
    },
    whoShouldAttend: {
      intro: 'Designed for licensed personnel maintaining operational currency. Ideal for:',
      points: ['Active airline flight dispatchers', 'Flight followers and OCC officers', 'Operations control supervisors'],
      outro: 'Target outcome: annual operator mandate compliance and recertification.'
    },
    courseContent: {
      intro: 'The refresher covers the regulatory and tactical areas that change most between cycles:',
      modules: [
        'Adverse Weather, Volcanic Ash & Space Weather Hazard Mitigation',
        'Advanced Fuel Management Policies & Contingency Fuel Reductions',
        'Live OCC Crisis Management & Diversion Decision-Making Simulations',
        'Updated EASA / FAA Airspace & Operational Dispatch Regulations'
      ],
      note: ''
    },
    certification: {
      text: 'A dated IFOA Recurrent Training Certificate is issued on completion, satisfying annual operator records.',
      points: ['Scenario-based assessment', '80% required to pass.']
    }
  },
  {
    slug: 'dangerous-goods-regulations-cbta-initial',
    authority: "IATA CBTA / ICAO Annex 18 Standards",
    format: "Interactive Digital Modules + Practical Acceptance Exercises",
    careerPath: "DGR Acceptance Specialist, Cargo Operations Officer, Airside Logistics Coordinator",
    intakeLabel: "Rolling Monthly Admissions",
    title: 'Dangerous Goods Regulations (IATA CBTA Initial & Recurrent)',
    refCode: 'DGR-CBTA',
    category: 'dangerous-goods',
    order: 25,
    summary:
      'Role-specific, competency-based training for the safe classification, acceptance, loading and transport of dangerous goods by air - built around what pilots, dispatchers and cabin crew each actually encounter, and adapted for no-carry, carry, airline and cargo operations.',
    heroImage: { url: '/course-images/02_dangerous_goods.webp', key: '', alt: 'Dangerous Goods Regulations Training' },
    heroNote:
      "No-carry isn't a shorter version of carry. Every module adapts to your role and your operation, not a generic DG deck read aloud.",
    badges: ['Role-Specific Training', 'Carry & No-Carry', 'IATA DGR Aligned'],
    schedule: { mode: 'Hybrid', timeText: 'Modular CBTA Certification' },
    duration: '2 Weeks',
    location: 'Interactive Digital Modules + Practical Acceptance Exercises',
    price: { amount: 1450, currency: 'EUR', note: 'Includes official IATA DGR study material and CBTA certification' },
    whatYouWillLearn: {
      intro:
        'Develop practical expertise to identify, classify, pack, mark, label, document, and accept dangerous goods in strict compliance with IATA and ICAO standards - scaled to your role and your operation.',
      points: [
        'Apply the 9 Hazard Classes and proper shipping names accurately',
        'Verify packaging specifications, UN markings, and quantity limitations',
        'Review and validate Shipper\'s Declarations and dangerous goods transport documents',
        'Implement NOTOC (Notification to Captain) and emergency response procedures',
        'Prevent undeclared dangerous goods from entering air cargo, baggage and the cabin',
        'Apply the correct acceptance, loading and segregation procedures for a carry or no-carry operation'
      ]
    },
    delivery: {
      intro: 'Delivered in a flexible modular format with live interactive acceptance workshops.',
      items: [
        { label: 'School', title: 'IFOA', description: 'Delivered by the International Flight Operations Academy' },
        { label: 'Format', title: 'Virtual / Modular', description: '2 weeks interactive CBTA workshops and case scenarios' }
      ]
    },
    trainingStandards: { intro: `${ICAO_INTRO} Aligned with IATA Dangerous Goods Regulations (DGR) and ICAO Annex 18 (Safe Transport of Dangerous Goods by Air).`, logos: [] },
    curriculum: {
      eyebrow: 'Curriculum Framework',
      title: 'What the Dangerous Goods Programme Covers',
      subtitle:
        '7 modules, adapted to your role and your operation. Acceptance and loading modules shift with your operation, not padded with procedures you will never use.',
      layout: 'accordion',
      phases: [
        {
          num: '01',
          label: '01',
          title: 'DG Philosophy - Why It Matters',
          focus: 'The real cost of getting it wrong',
          description:
            'The consequences of getting dangerous goods wrong, beyond the regulation itself. Builds the judgment that carries a decision when the checklist runs out, whether you are flying the aircraft, dispatching it, or working the cabin.'
        },
        {
          num: '02',
          label: '02',
          title: 'Classification & Identification',
          focus: 'The 9 hazard classes, in practice',
          description:
            "Recognizing dangerous goods in real cargo, baggage and carry-on, including the items people miss because they don't look dangerous. Covers proper shipping names, UN numbers and the classification logic behind them."
        },
        {
          num: '03',
          label: '03',
          title: 'Marking, Labelling & Documentation',
          focus: "Spotting what's wrong before it flies",
          description:
            "Practical inspection drills for incorrect, missing or damaged marks, labels, packaging and shipping documents, including the Shipper's Declaration, before a bad load reaches the aircraft."
        },
        {
          num: '04',
          label: '04',
          title: 'Acceptance & Handling Procedures',
          focus: 'Adapted to your operation',
          adaptive: 'acceptance',
          description:
            "How to recognize dangerous goods that reach you anyway, and the refusal and reporting steps that replace acceptance procedures you'll never use."
        },
        {
          num: '05',
          label: '05',
          title: 'Loading, Storage & Segregation',
          focus: "Where it applies, and where it doesn't",
          adaptive: 'loading',
          description:
            "Why segregation and loading procedures don't apply to a no-carry operation, and exactly what to do if dangerous goods turn up regardless."
        },
        {
          num: '06',
          label: '06',
          title: 'Incident & Emergency Response',
          focus: 'Decision drills under time pressure',
          description:
            'How to respond to a spill, leak or fire involving dangerous goods, including NOTOC procedures and communication to cabin crew, ATC and ground support, built around your specific role in the response.'
        },
        {
          num: '07',
          label: '07',
          title: 'Practical Assessment',
          focus: 'Scenario-based, not multiple-choice',
          description:
            'A scenario-based CBTA assessment built around real decisions for your role and your operation, not a generic checkbox quiz. 80% required to pass.'
        }
      ]
    },
    dgrExplorer: {
      roles: [
        {
          code: '7.7',
          title: 'Pilots',
          scenarios: [
            'Assessing DG risk before accepting cargo aboard your aircraft',
            'Reading a NOTOC and knowing what it actually means for your flight',
            'Deciding when to refuse a load, and backing that call',
            'Communicating DG status to cabin crew and ATC in an emergency'
          ]
        },
        {
          code: '7.8',
          title: 'Flight Dispatchers',
          scenarios: [
            'Reviewing DG documentation and NOTOC before release',
            'Cross-checking DG loads against aircraft and route limitations',
            "Coordinating with ground handling when DG paperwork doesn't match the load",
            'Briefing the crew on DG status as part of the dispatch release'
          ]
        },
        {
          code: '7.9',
          title: 'Cabin Crew',
          scenarios: [
            'Spotting undeclared or concealed dangerous goods in the cabin',
            'Responding to a DG-related spill, fire or leak in flight',
            'Briefing passengers on carry-on DG restrictions without a fight',
            'Knowing exactly when to involve the flight deck'
          ]
        }
      ],
      segments: [
        {
          id: 'nocarry-ba',
          title: 'No-Carry Business Aviation',
          descriptor:
            "Built for operators who don't carry DG at all - recognition, refusal and reporting, not acceptance procedures you'll never use.",
          acceptance:
            "How to recognize dangerous goods that reach you anyway, and the refusal and reporting steps that replace acceptance procedures you'll never use.",
          loading:
            "Why segregation and loading procedures don't apply to a no-carry operation, and exactly what to do if dangerous goods turn up regardless."
        },
        {
          id: 'carry-ba',
          title: 'Carry Business Aviation',
          descriptor: 'Full acceptance-to-loading competency, scaled for smaller operations and irregular DG volumes.',
          acceptance:
            'Acceptance scenarios scaled to smaller, less frequent DG shipments - what to check, what to question, and when to refuse.',
          loading: 'Loading and segregation scenarios sized for smaller aircraft and lower DG volumes.'
        },
        {
          id: 'airlines',
          title: 'Airlines',
          descriptor: 'High-volume acceptance and load-planning scenarios drawn from scheduled passenger operations.',
          acceptance:
            'High-volume acceptance scenarios drawn from scheduled passenger operations, including irregular and last-minute shipments.',
          loading: 'Load-planning and segregation scenarios built around scheduled passenger operations.'
        },
        {
          id: 'cargo',
          title: 'Cargo',
          descriptor: 'Freighter-specific scenarios - bulk DG acceptance, ULD build-up, and segregation at scale.',
          acceptance: 'Freighter-specific acceptance scenarios, including bulk shipments and ULD build-up documentation checks.',
          loading: 'Bulk loading, ULD build-up and segregation scenarios at freighter scale.'
        }
      ]
    },
    whoShouldAttend: {
      intro: 'Built by role and by operation, not one generic dangerous goods deck for everyone. Ideal for:',
      points: [
        'Pilots (Category 7.7) - dangerous goods risk assessment and NOTOC awareness',
        'Flight dispatchers and load planning officers (Category 7.8) - documentation and acceptance review',
        'Cabin crew (Category 7.9) - recognition, in-flight response and passenger briefing',
        'Cargo acceptance, ramp and freight forwarding personnel across carry and no-carry operations'
      ],
      outro:
        'Covers Business Aviation (Carry & No-Carry), Airlines and Cargo operations. Target roles: DGR Acceptance Specialist, Cargo Operations Officer, Airside Logistics Coordinator.'
    },
    courseContent: {
      intro: 'The programme covers the full spectrum of the IATA Dangerous Goods Regulations:',
      modules: [
        'General Philosophy, Legal Responsibilities & Regulatory Hierarchy (ICAO/IATA)',
        'Classification & Identification of the 9 Classes of Dangerous Goods',
        'Packaging Requirements, UN Specification Markings & Overpacks',
        'Labeling, Documentation & Shipper\'s Declaration for Dangerous Goods (DGD)',
        'Storage, Loading, Segregation & NOTOC Notification to Captain Procedures',
        'Emergency Response & Handling Undeclared or Damaged Dangerous Goods'
      ],
      note: 'Aligned with current 66th Edition IATA DGR and ICAO CBTA guidelines.'
    },
    certification: {
      text: 'An official IFOA / IATA-aligned CBTA Dangerous Goods Certificate is issued upon successful exam completion.',
      points: ['Practical acceptance checklist assessment', '80% required to pass.']
    }
  },
  {
    slug: 'ground-operations-ramp-safety-specialist',
    authority: "IATA ISAGO & EASA Ground Standards",
    format: "Classroom / Airline Station On-site",
    careerPath: "Ramp Operations Supervisor, Station Operations Manager, Ground Handler",
    intakeLabel: "",
    title: 'Ground Operations & Ramp Safety Specialist',
    refCode: 'GND-RAMP',
    category: 'ground',
    order: 30,
    summary: 'Comprehensive airside operations, turnaround supervision and safety.',
    heroImage: { url: '/course-images/aviation-ground-operations.jpg', key: '', alt: 'Aircraft ground operations' },
    schedule: { mode: 'Onsite', startDate: new Date('2026-05-04T09:00:00Z'), timeText: 'Intensive Ground Handling Track' },
    duration: '4 Weeks',
    location: 'Classroom / Airline Station On-site',
    price: { amount: null, currency: 'EUR', note: '' },
    whatYouWillLearn: {
      intro:
        'Master ramp coordination, aircraft turnaround safety, marshalling, hazardous cargo initial handling, and ground service equipment (GSE) collision prevention.',
      points: [
        'To supervise safe, on-time aircraft turnarounds',
        'To identify airside hazards before they become incidents',
        'To apply dangerous goods awareness on the ramp',
        'To cross-check loading, weight and balance documentation'
      ]
    },
    delivery: {
      intro: 'Delivered in the classroom or on-site at your airline station.',
      items: [
        { label: 'School', title: 'IFOA', description: 'Delivered by the International Flight Operations Academy' },
        { label: 'Format', title: 'Onsite Classroom', description: '4 weeks intensive ground handling track' }
      ]
    },
    trainingStandards: { intro: `${ICAO_INTRO} Aligned with IATA ISAGO and EASA ground handling standards.`, logos: [] },
    curriculum: {
      eyebrow: 'Curriculum Framework',
      title: 'What the Ground Operations Programme Covers',
      subtitle: 'Structured around aircraft turnaround supervision, airside safety and ramp-level hazard awareness.',
      phases: [
        {
          num: '01',
          label: '01',
          title: 'Aircraft Turnaround Supervision & Critical Path Monitoring',
          focus: 'On-time, safe turnarounds',
          description:
            'Coordinating the ramp during a live turnaround, monitoring the critical path, and recognizing the point where a delay risks becoming a safety issue rather than just a schedule issue.'
        },
        {
          num: '02',
          label: '02',
          title: 'Airside Safety Management Systems & Hazard Identification',
          focus: 'Spotting hazards before they become incidents',
          description:
            'Applying SMS principles at ramp level: identifying airside hazards, GSE collision risks and foreign object debris before they escalate into an incident.'
        },
        {
          num: '03',
          label: '03',
          title: 'Dangerous Goods Regulations (DGR Cat 10 Awareness)',
          focus: 'Ramp-level DG awareness',
          description:
            'Category 10 dangerous goods awareness for ramp and ground handling staff: recognizing DG in cargo and baggage, and knowing when to escalate to a DG specialist.'
        },
        {
          num: '04',
          label: '04',
          title: 'Baggage & Cargo Loading Supervision, Weight & Balance Crosscheck',
          focus: 'Catching load errors before departure',
          description:
            'Supervising baggage and cargo loading against the load plan, and cross-checking weight and balance documentation before the aircraft is released.'
        }
      ]
    },
    whoShouldAttend: {
      intro: 'Built for airside and station personnel. Ideal for:',
      points: ['Ramp agents and load controllers', 'Station operations staff', 'Ground handling supervisors', 'FBO and GSE personnel'],
      outro: 'Target roles: Ramp Operations Supervisor, Station Operations Manager, Ground Handler.'
    },
    courseContent: {
      intro: 'The programme covers the full airside safety and turnaround supervision scope:',
      modules: [
        'Aircraft Turnaround Supervision & Critical Path Monitoring',
        'Airside Safety Management Systems & Hazard Identification',
        'Dangerous Goods Regulations (DGR Cat 10 Awareness)',
        'Baggage & Cargo Loading Supervision, Weight & Balance Crosscheck'
      ],
      note: ''
    },
    certification: {
      text: 'An IFOA Ground Operations Completion Certificate is awarded on successful assessment.',
      points: ['Practical and multiple-choice questions', '80% required to pass.']
    }
  },
  {
    slug: 'airline-crew-control-flight-rostering',
    authority: "EASA FTL & Fatigue Risk Management",
    format: "Online or On-site",
    careerPath: "Crew Controller, Crew Planner, Crew Control Supervisor, OCC Operations Specialist",
    intakeLabel: "Corporate Group Intakes",
    title: 'Crew Control Training',
    refCode: 'CC-FTL',
    category: 'crew',
    isCorporate: true,
    eyebrow: 'IFOA CORPORATE TRAINING',
    order: 45,
    summary:
      'A focused 2-day programme for Crew Control personnel covering EASA Flight Time Limitations, Air Taxi FTL and Fatigue Risk Management.',
    heroImage: { url: '/course-images/05_crew_control.webp', key: '', alt: 'Crew Control Training' },
    badges: ['EASA FTL', 'AIR TAXI FTL', 'FATIGUE RISK MANAGEMENT', '2 DAYS', 'ONLINE OR ON-SITE'],
    schedule: { mode: 'Hybrid', timeText: '2 Days · Online or On-site' },
    duration: '2 Days',
    location: 'Operator Premises or Online Virtual Classroom',
    price: {
      amount: null,
      currency: 'EUR',
      label: 'Training Fee',
      note: "Custom quote, based on group size and delivery format, tailored to the operator's operational environment."
    },
    rateCard: {
      eyebrow: 'Training Fee',
      value: 'Training Fee',
      note: "Custom quote, based on group size and delivery format, tailored to the operator's operational environment.",
      secondaryCtaLabel: 'Contact Training Team',
      trustBadge: 'Delivered by IFOA: trusted by 70+ operators worldwide'
    },
    sidebarSpecs: [
      { label: 'Duration', value: '2 Days' },
      { label: 'Delivery', value: 'Online or On-site' },
      { label: 'On-site Location', value: 'Operator Premises' },
      { label: 'Focus', value: 'CAT + Air Taxi FTL + FRM' },
      { label: 'Format', value: 'Instructor-led' },
      { label: 'Certificate', value: 'IFOA Certificate' }
    ],
    curriculum: {
      eyebrow: 'Curriculum Framework',
      title: 'What the Crew Control Programme Covers',
      subtitle: 'A focused regulatory and fatigue-management programme for personnel working with crew legality and rostering.',
      phases: [
        {
          num: '01',
          label: '01',
          title: 'EASA FTL',
          description: 'Flight Time Limitation regulations under EASA: duty and rest requirements, flight duty periods, and the legal framework governing crew scheduling.',
          topics: []
        },
        {
          num: '02',
          label: '02',
          title: 'Crew Legality',
          description: 'Assessing crew legality in day-to-day rostering: qualifications, currency and duty history checks before a flight is confirmed.',
          topics: []
        },
        {
          num: '03',
          label: '03',
          title: 'Air Taxi FTL',
          description: 'FTL provisions specific to air taxi and non-complex commercial air transport operations, and where they diverge from mainstream CAT rules.',
          topics: []
        },
        {
          num: '04',
          label: '04',
          title: 'Fatigue Risk',
          description: 'Fatigue hazard identification, reporting and risk assessment: the operational side of Fatigue Risk Management.',
          topics: []
        },
        {
          num: '05',
          label: '05',
          title: 'FTL Application',
          description: '',
          topics: [
            'Standby & Reserve',
            'Positioning',
            'Cumulative Limits',
            'FTL & Fatigue Case Studies'
          ]
        }
      ]
    },
    whatYouWillLearn: {
      eyebrow: 'OPERATIONAL COMPETENCIES',
      title: 'Built around FTL & fatigue',
      intro: 'Built around FTL & fatigue',
      points: [
        'Interpret EASA FTL requirements',
        'Calculate FDP, duty and rest limitations',
        'Recognise fatigue hazards beyond legal compliance',
        'Understand Air Taxi FTL differences',
        'Assess crew legality against duty and rest history',
        'Apply FRM principles to crew planning decisions'
      ]
    },
    processSteps: [
      'Identify the operation',
      'Apply the correct FTL rule',
      'Check limits',
      'Consider fatigue risk'
    ],
    trainingStandards: {
      eyebrow: 'REGULATORY FRAMEWORK',
      title: 'EASA FTL & Fatigue Risk Management',
      intro: 'From compliance to operational application. The programme distinguishes between the FTL framework used for mainstream CAT operations and the current rules applicable to air taxi operations, with fatigue risk management integrated throughout.',
      cards: [
        { code: 'ORO.FTL', title: 'Flight and duty time limitations and rest requirements' },
        { code: 'CS FTL.1', title: 'Commercial air transport by aeroplane' },
        { code: 'Air Taxi', title: 'EU-OPS Subpart Q / applicable national provisions' },
        { code: 'FRM Principles', title: 'Fatigue hazards, reporting, assessment and mitigation' }
      ],
      logos: []
    },
    whoShouldAttend: {
      eyebrow: 'AUDIENCE',
      title: 'Who should attend?',
      intro: 'Built for airline and business aviation operations personnel:',
      points: [
        'Crew Controllers',
        'Crew Planners & Rostering Personnel',
        'Crew Control Supervisors',
        'OCC & Operations Personnel'
      ],
      outro: ''
    },
    bottomBanner: {
      eyebrow: 'Admissions Portal',
      title: 'Ready to bring Crew Control training to your operation?',
      desc: '2 days · Online or on-site · Custom corporate rate',
      ctaLabel: 'Request a Corporate Quote'
    },
    // Explicitly cleared: this course previously had entryRequirements and
    // certification set, and the seed script's upsert only overwrites fields
    // it mentions (see `existing.set(data)` below) - leaving them out here
    // would NOT have cleared the stale DB values. Neither section is part of
    // this corporate course's page.
    entryRequirements: { intro: '', points: [] },
    certification: { text: '', points: [] }
  },
  {
    slug: 'train-the-trainer-icao-cbta-instructor',
    authority: 'Instructor Development Programme',
    format: 'Instructor-led',
    careerPath: 'Aviation Instructor, OCC Training Captain, Airline CBTA Assessor',
    intakeLabel: '',
    title: 'Train the Trainer',
    refCode: 'TTT-CBTA',
    category: 'train-the-trainer',
    isCorporate: true,
    eyebrow: 'IFOA Professional Development',
    ctaLabel: 'Request Pricing & Dates',
    featured: true,
    order: 40,
    summary:
      'An instructor-development programme covering adult learning theory, cross-cultural awareness, presentation skills and effective feedback, built for anyone who delivers training to aviation professionals.',
    // No heroImage: falls back to the "Train the Trainer" Services image
    // (same category - frontend/src/components/course/CourseCard.jsx).
    heroImage: null,
    badges: ['Adult Learning', 'Presentation Skills', 'Feedback Techniques', '4 Days', 'Instructor-Led'],
    schedule: { mode: 'Hybrid', timeText: 'Instructor-led' },
    duration: '4 Days',
    location: '4 Days',
    price: { amount: null, currency: 'EUR', note: 'Contact us for current pricing and available dates.' },
    rateCard: {
      eyebrow: 'Training Fee',
      value: 'On Request',
      note: 'Contact us for current pricing and available dates.',
      secondaryCtaLabel: 'Contact Training Team',
      trustBadge: 'Delivered by IFOA: trusted by 70+ operators worldwide'
    },
    sidebarSpecs: [
      { label: 'Duration', value: '4 Days' },
      { label: 'Delivery', value: '4 Days' },
      { label: 'Format', value: 'Instructor-led' },
      { label: 'Certificate', value: 'IFOA Certificate of Completion' }
    ],
    curriculum: {
      eyebrow: 'Curriculum Framework',
      title: 'What the Train the Trainer Programme Covers',
      subtitle: 'Eight modules, from adult-learning theory through to a practical delivery assessment.',
      layout: 'accordion',
      phases: [
        {
          num: '01',
          label: '01',
          title: 'Introduction',
          focus: 'Adult Teaching & Learning',
          topics: [
            'Articulate the importance of adult teaching & learning strategies',
            'Explain the key differences between adult and child learning',
            "Use Knowles' Six Principles for adult learning to devise an effective learner-centric strategy",
            'Articulate the main dimensions of individual learning styles',
            'Develop a teaching strategy using Perceptual Preference, Information Processing, and Learning Styles'
          ]
        },
        {
          num: '02',
          label: '02',
          title: 'Cross-Cultural Awareness',
          topics: [
            'Discuss the definitions of cultural diversity and cultural sensitivity',
            "Identify the benefits of understanding Hofstede's cultural dimensions within the business environment"
          ]
        },
        {
          num: '03',
          label: '03',
          title: 'Learning Styles & Strategies',
          topics: [
            'Recognize different personality types',
            'Discover how to adapt to learning style differences',
            'Identify how to deal with difficult situations using personality types'
          ]
        },
        {
          num: '04',
          label: '04',
          title: 'Designing a Course',
          topics: [
            'Describe and explain all the necessary steps in the designing and evaluation process of effective training'
          ]
        },
        {
          num: '05',
          label: '05',
          title: 'Planning & Presentation',
          topics: ['Effectively prepare for a training event']
        },
        {
          num: '06',
          label: '06',
          title: 'Advanced Presentation Skills',
          topics: [
            'Develop advanced presentation skills',
            'Handle objections and difficult situations',
            'Discover how to use listening skills to set the stage for an atmosphere conducive to learning'
          ]
        },
        {
          num: '07',
          label: '07',
          title: 'Feedback',
          topics: [
            'Assess the confidence in delivering feedback',
            'Apply the techniques of effective feedback'
          ]
        },
        {
          num: '08',
          label: '08',
          title: 'Participant Presentations',
          focus: 'Practical Assessment',
          topics: [
            'Plan and deliver a short training session applying the course techniques',
            'Receive structured instructor and peer feedback on delivery'
          ]
        }
      ]
    },
    whatYouWillLearn: {
      eyebrow: 'Learning Outcomes',
      title: 'Built for confident, effective delivery',
      intro: '',
      points: [
        'Devise a learner-centric strategy using adult learning principles',
        'Adapt delivery to individual learning styles and preferences',
        'Apply cross-cultural awareness to training delivery',
        'Recognize personality types and adjust accordingly',
        'Design and evaluate an effective training course',
        'Prepare thoroughly for a training event',
        'Handle objections and difficult classroom situations',
        'Deliver effective, well-structured feedback'
      ]
    },
    delivery: {
      intro: 'Instructor-led, applying the course techniques through practical delivery and structured feedback.',
      items: [
        { label: 'School', title: 'IFOA', description: 'Delivered by the International Flight Operations Academy' },
        { label: 'Format', title: 'Instructor-led', description: '8 modules, from adult-learning theory through to a practical delivery assessment' }
      ]
    },
    trainingStandards: {
      eyebrow: 'Programme Frameworks',
      title: 'Built on established instructional models',
      intro:
        'Course design draws on recognised frameworks for adult learning, cross-cultural communication and learning-style differentiation, applied throughout the eight modules.',
      cards: [
        { code: "Knowles' Six Principles", title: 'Core adult-learning principles applied to course design' },
        { code: "Hofstede's Dimensions", title: 'Cross-cultural awareness in training delivery' },
        { code: 'Learning Styles', title: 'Perceptual preference & information processing' },
        { code: 'Structured Feedback', title: 'Techniques for effective, confident feedback' }
      ],
      logos: []
    },
    whoShouldAttend: {
      eyebrow: 'Audience',
      title: 'Who should attend?',
      intro: '',
      points: [
        'Aspiring & Current Instructors',
        'Subject Matter Experts',
        'Training & OCC Personnel',
        'Aviation Professionals moving into a training role'
      ],
      outro: ''
    },
    bottomBanner: {
      eyebrow: 'IFOA Professional Development',
      title: 'Develop your next generation of instructors',
      desc: '8 modules · Instructor-led · Certificate of completion',
      ctaLabel: 'Request Pricing & Dates'
    },
    // Explicitly cleared - see the crew-control course above for why this
    // matters: the seed upsert only overwrites fields it mentions, so any
    // stale value from an earlier version of this course would otherwise
    // persist. Neither section is part of this course's page.
    courseContent: { intro: '', modules: [], note: '' },
    entryRequirements: { intro: '', points: [] },
    certification: { text: '', points: [] }
  },
  {
    slug: 'human-factors-in-the-occ',
    authority: 'TEM-Based Human Factors Programme',
    format: 'Classroom / Blended',
    careerPath: 'Flight Dispatcher, Operations Controller, Crew Control / Scheduling, MCC',
    intakeLabel: '[Next cohort start date]',
    title: 'Human Factors, built for the OCC',
    refCode: 'HF-OCC',
    category: 'human-factors',
    isCorporate: true,
    eyebrow: 'IFOA OCC Training',
    ctaLabel: 'Request Pricing & Dates',
    featured: true,
    order: 55,
    summary:
      "Generic Human Factors training was written for the ramp and the cabin. We took the same discipline and rebuilt it around what actually happens on an operations control floor - shift fatigue, disruption-day stress, multi-stakeholder coordination, and decisions now shared with AI-CDM tools.",
    heroNote:
      "This is not CRM built for flying crew. It's Human Factors purpose-built for the people who run the operation from the ground.",
    // No heroImage: falls back to the "Human Factors" Services image (same
    // category - frontend/src/components/course/CourseCard.jsx).
    heroImage: null,
    badges: ['OCC-Specific', '11 Modules', 'TEM-Based', 'AI-CDM Ready'],
    schedule: { mode: 'Hybrid', timeText: 'Instructor-led' },
    duration: '2 Days',
    location: '[Classroom / Blended]',
    price: { amount: null, currency: 'EUR', note: 'Contact us for current pricing and available dates.' },
    rateCard: {
      eyebrow: 'Training Fee',
      value: 'On Request',
      note: 'Contact us for current pricing and available dates.',
      secondaryCtaLabel: 'Contact Training Team',
      trustBadge: 'Delivered by IFOA: trusted by 70+ operators worldwide'
    },
    sidebarSpecs: [
      { label: 'Modules', value: '11' },
      { label: 'Duration', value: '2 Days' },
      { label: 'Format', value: '[Classroom / Blended]' },
      { label: 'Certificate', value: 'IFOA Certificate' },
      { label: 'Delivery', value: 'On-site or IFOA facility' },
      { label: 'Next Cohort', value: '[Next cohort start date]' }
    ],
    curriculum: {
      eyebrow: 'Curriculum Framework',
      title: 'What the Human Factors Programme Covers',
      subtitle:
        '11 modules, every one of them OCC-specific. Every classic Human Factors topic, rebuilt around what it actually looks like on your floor - not a generic aviation module with "OCC" pasted on the title slide.',
      layout: 'accordion',
      phases: [
        {
          num: '01',
          label: '01',
          title: 'Hard Skills vs. Soft Skills',
          focus: 'Human Factors?',
          description:
            "Why technical competency alone doesn't make a strong OCC operator. This module draws the line between hard skills (procedures, systems, regulation) and soft skills (judgement, communication, self-management), and makes the case for why the second set is usually what separates a good shift from a bad one."
        },
        {
          num: '02',
          label: '02',
          title: 'OCC Environment',
          focus: 'Where HF is vital',
          description:
            'A 24/7, multi-stakeholder, time-critical environment where one decision affects dozens of flights at once. This module maps what makes the OCC floor different from other aviation workplaces, and why Human Factors risk shows up faster and spreads further here than almost anywhere else in the operation.'
        },
        {
          num: '03',
          label: '03',
          title: 'Stress & Performance',
          focus: 'Identify the relationship',
          description:
            'The stress-performance curve as it actually plays out during an irregular-operations day: the point where pressure sharpens decision-making, and the point past it where performance starts to break down. Includes recognizing your own position on that curve in real time.'
        },
        {
          num: '04',
          label: '04',
          title: 'Fatigue',
          focus: 'Fatigue or being tired... this is the question',
          description:
            'Fatigue in a shift-working, desk-based role is not the same as simply being tired. This module separates acute tiredness from cumulative fatigue, covers the roster patterns that create the most risk, and gives practical self- and team-recognition techniques for an OCC shift.'
        },
        {
          num: '05',
          label: '05',
          title: 'Resilience',
          focus: 'The ability to cope with and recover from setbacks',
          description:
            'The OCC runs on a cycle of disruption and recovery - weather days, system outages, network meltdowns. This module builds individual and team resilience for that cycle specifically, and distinguishes real resilience from simply absorbing pressure without recovering from it.'
        },
        {
          num: '06',
          label: '06',
          title: 'Decision Making',
          focus: "Let's deal with uncertainty",
          description:
            "Structured decision-making for the incomplete-information, conflicting-priority situations that define OCC work. This module includes where an AI-CDM tool should inform a decision and where it shouldn't make it for you - a direct link into Module 11."
        },
        {
          num: '07',
          label: '07',
          title: 'Communication',
          focus: "Closing the 'Gap'",
          description:
            'The gap between what is said and what is understood - across dispatch, crew control, ground handling, maintenance and management. This module covers structured communication techniques built to close that gap under time pressure, not in a calm meeting room.'
        },
        {
          num: '08',
          label: '08',
          title: 'Error Management Techniques',
          focus: 'Mitigating safety risk',
          description:
            "Errors made in the OCC don't stay contained to one desk - they ripple through every flight the operation touches. This module covers practical techniques for catching, containing and recovering from error before it cascades."
        },
        {
          num: '09',
          label: '09',
          title: 'Situational Awareness',
          focus: 'Identify threats before they occur and have time to react',
          description:
            'Maintaining the big picture across a multi-screen, multi-system OCC desk, including the specific risk of tunnel vision - heads-down in one system while the wider operational picture shifts around you.'
        },
        {
          num: '10',
          label: '10',
          title: 'Emotional Intelligence',
          focus: 'The cornerstone of soft skills',
          description:
            'The foundation every other soft skill in this course is built on: managing your own state under pressure, reading colleagues and crew accurately over a phone line or radio, and de-escalating a tense coordination call before it becomes a bigger problem.'
        },
        {
          num: '11',
          label: '11',
          title: 'AI-CDM in the OCC',
          focus: 'Working with the machine, without switching off',
          description:
            "How AI-assisted collaborative decision-making tools are changing the OCC role in real time. This module covers the specific risk of Automation Over-Reliance - the anchoring factor in our Sinful Sixteen framework - and how to stay the decision-maker in the loop rather than a rubber stamp on the tool's output."
        }
      ]
    },
    whatYouWillLearn: {
      eyebrow: 'Learning Outcomes',
      title: 'Built for the realities of the OCC floor',
      intro: '',
      points: [
        'Recognize why soft skills, not just technical competency, define a strong OCC operator',
        'Read your own position on the stress-performance curve during a high-pressure irregular-operations day',
        'Distinguish acute tiredness from cumulative fatigue and recognize high-risk roster patterns',
        "Build individual and team resilience for the OCC's disruption-and-recovery cycle",
        "Apply structured decision-making under uncertainty, including where an AI-CDM tool should and shouldn't decide",
        'Close the communication gap across dispatch, crew control, ground handling and management',
        'Catch, contain and recover from error before it cascades across the operation',
        'Stay the decision-maker in the loop when working with AI-CDM tools, rather than a rubber stamp on their output'
      ]
    },
    delivery: {
      intro: 'Instructor-led, delivered on-site or at an IFOA facility.',
      items: [
        { label: 'School', title: 'IFOA', description: 'Delivered by the International Flight Operations Academy' },
        { label: 'Format', title: 'Classroom / Blended', description: '11 modules across 2 days, framed around Threat and Error Management' }
      ]
    },
    trainingPhilosophy: {
      eyebrow: 'Our Approach',
      title: 'Threat and Error Management, plus the Sinful Sixteen',
      intro:
        "Every module ties back to one working model of risk - Threat and Error Management. Alongside it, we use the Sinful Sixteen: the classic aviation \"Dirty Dozen\" human-factors traps, extended with four factors specific to a 24/7 operations control environment, anchored by Automation Over-Reliance - the risk of letting an AI-CDM tool decide instead of advise.",
      cards: [
        {
          title: 'TEM-Based Delivery',
          desc: 'Every module is framed around threats, errors and undesired states as they occur on the OCC floor - not in the abstract.'
        },
        {
          title: 'The Sinful Sixteen',
          desc: 'Twelve classic factors plus four built for the OCC, anchored by Automation Over-Reliance.'
        }
      ]
    },
    whoShouldAttend: {
      eyebrow: 'Who Should Attend',
      title: 'Built for the OCC - not the flight deck',
      intro: 'This is Human Factors for the people who run the operation from the ground, not CRM for flying crew.',
      points: [
        'Flight Dispatcher',
        'Operations Controllers',
        'Crew Control / Scheduling',
        'MCC',
        'Any other OCC personnel'
      ],
      outro: ''
    },
    bottomBanner: {
      eyebrow: 'IFOA OCC Training',
      title: 'Give your whole OCC the Human Factors edge',
      desc: '11 Modules · TEM-Based · Built for every OCC role',
      ctaLabel: 'Request Pricing & Dates'
    },
    // Explicitly cleared - see the crew-control course above for why this
    // matters: the seed upsert only overwrites fields it mentions, so any
    // stale value from an earlier version of this course would otherwise
    // persist. Neither section is part of this course's page.
    courseContent: { intro: '', modules: [], note: '' },
    entryRequirements: { intro: '', points: [] },
    certification: { text: '', points: [] }
  },
  {
    slug: 'aviation-sms-operational-risk-engineering',
    authority: "ICAO Annex 19 & FAA SMS Rule",
    format: "Virtual Executive Seminar & Applied Case Studies",
    careerPath: "Safety Manager, Quality Assurance Auditor, OCC Risk Analyst",
    intakeLabel: "",
    title: 'Aviation SMS & Operational Risk Engineering',
    refCode: 'SMS-RISK',
    category: 'security',
    order: 50,
    summary: 'Strategic safety management, bow-tie analysis and FRMS implementation.',
    heroImage: { url: '/course-images/aviation-executive-briefing.jpg', key: '', alt: 'Executive safety briefing' },
    schedule: { mode: 'Online', startDate: new Date('2026-06-01T09:00:00Z'), timeText: 'Corporate Executive / OCC Level' },
    duration: '2 Weeks',
    location: 'Virtual Executive Seminar & Applied Case Studies',
    price: { amount: null, currency: 'EUR', note: '' },
    whatYouWillLearn: {
      intro:
        'Establish resilient Safety Management Systems, hazard reporting pipelines, flight data monitoring feedback, and fatigue risk management in 24/7 operational control centres.',
      points: [
        'To model operational hazards using bow-tie analysis',
        'To build fatigue risk management into 24/7 rostering',
        'To implement a working Just Culture reporting pipeline',
        'To coordinate emergency response and post-incident review'
      ]
    },
    delivery: {
      intro: 'Delivered as a virtual executive seminar built around applied airline case studies.',
      items: [
        { label: 'School', title: 'IFOA', description: 'Delivered by the International Flight Operations Academy' },
        { label: 'Format', title: 'Virtual Seminar', description: '2 weeks executive-level virtual delivery' }
      ]
    },
    trainingStandards: { intro: `${ICAO_INTRO} Built against ICAO Annex 19 and the FAA SMS Rule.`, logos: [] },
    curriculum: {
      eyebrow: 'Curriculum Framework',
      title: 'What the Aviation SMS Programme Covers',
      subtitle: 'The operational safety management lifecycle, from hazard modeling through post-incident review.',
      phases: [
        {
          num: '01',
          label: '01',
          title: 'Safety Risk Assessment & Bow-Tie Hazard Modeling',
          focus: 'Modeling risk, not just listing it',
          description:
            'Building bow-tie hazard models that connect a threat through to its consequences, with the barriers and controls that sit between them made explicit rather than implied.'
        },
        {
          num: '02',
          label: '02',
          title: 'Fatigue Risk Management Systems (FRMS) for 24/7 OCC Shift Rostering',
          focus: 'FRMS built for a 24/7 floor',
          description:
            'Designing a working fatigue risk management system for continuous shift-based operations, not a policy document that never touches the actual roster.'
        },
        {
          num: '03',
          label: '03',
          title: 'Just Culture Implementation & Internal Audit Management',
          focus: 'A reporting pipeline people actually use',
          description:
            'Implementing a Just Culture reporting pipeline that staff trust enough to use, paired with the internal audit management that keeps it credible.'
        },
        {
          num: '04',
          label: '04',
          title: 'Emergency Response Planning (ERP) Coordination & Post-Incident Review',
          focus: 'From response to real learning',
          description:
            'Coordinating emergency response planning across the operation, and running a post-incident review process that produces genuine corrective action, not just a filed report.'
        }
      ]
    },
    whoShouldAttend: {
      intro: 'Aimed at those accountable for operational safety. Ideal for:',
      points: ['Safety and compliance managers', 'Quality assurance auditors', 'OCC managers and risk analysts', 'Accountable managers'],
      outro: 'Target roles: Safety Manager, Quality Assurance Auditor, OCC Risk Analyst.'
    },
    courseContent: {
      intro: 'The seminar covers the operational safety management lifecycle:',
      modules: [
        'Safety Risk Assessment & Bow-Tie Hazard Modeling',
        'Fatigue Risk Management Systems (FRMS) for 24/7 OCC Shift Rostering',
        'Just Culture Implementation & Internal Audit Management',
        'Emergency Response Planning (ERP) Coordination & Post-Incident Review'
      ],
      note: ''
    },
    certification: {
      text: 'An IFOA Aviation SMS & Operational Risk Certificate is issued on completion.',
      points: ['Applied case study assessment', '80% required to pass.']
    }
  },
  {
    slug: 'airline-occ-setup-operational-consulting',
    authority: "Custom Tailored Airline Advisory",
    format: "On-site Assessment + Workflow Redesign",
    careerPath: "Enterprise Airline Advisory & Turnkey Operational Launch",
    intakeLabel: "Immediate Consultation Available",
    title: 'Airline OCC Setup & Operational Consulting',
    refCode: 'OCC-CONSULT',
    category: 'consulting',
    featured: true,
    order: 60,
    summary: 'Turnkey advisory, software integration and Flight Ops Manual drafting.',
    heroImage: null, // falls back to the "Consulting Services" Services image (same category)
    schedule: { mode: 'Onsite', timeText: 'Immediate consultation available' },
    duration: 'Project-Based / Turnkey Integration',
    location: 'On-site Assessment + Workflow Redesign',
    price: { amount: null, currency: 'EUR', note: 'Scoped per engagement: request a proposal.' },
    whatYouWillLearn: {
      intro:
        'We assist startup airlines, expanding charter operators, and cargo carriers in architecting or modernizing their OCC software workflows, ergonomics, and Operations Manuals.',
      points: [
        'To design an OCC floor that supports real flight following',
        'To draft regulator-ready Flight Operations Manuals',
        'To select and integrate dispatch and flight planning software',
        'To size staffing models against real operational demand'
      ]
    },
    delivery: {
      intro: 'Engagements begin with an on-site assessment followed by workflow redesign.',
      items: [
        { label: 'School', title: 'IFOA', description: 'Delivered by the International Flight Operations Academy' },
        { label: 'Format', title: 'Consulting Engagement', description: 'Project-based turnkey integration with on-site assessment' }
      ]
    },
    trainingStandards: { intro: 'Advisory work is scoped against ICAO, EASA and the operator’s national authority requirements.', logos: [] },
    curriculum: {
      eyebrow: 'Curriculum Framework',
      title: 'What the Engagement Covers',
      subtitle: 'A typical engagement runs from on-site assessment through to a fully redesigned operational workflow.',
      phases: [
        {
          num: '01',
          label: '01',
          title: 'OCC Ergonomics, Multi-Screen Flight Following & Console Setup',
          focus: 'A floor built for real flight following',
          description:
            'Assessing and redesigning the physical and digital OCC floor: console layout, multi-screen flight-following ergonomics, and the information architecture that supports it.'
        },
        {
          num: '02',
          label: '02',
          title: 'Flight Operations Manual (FOM/OM-A) Drafting & Regulator Compliance',
          focus: 'Regulator-ready documentation',
          description:
            'Drafting or updating the Flight Operations Manual (FOM/OM-A) to reflect how the operation actually runs, structured to satisfy the national authority reviewing it.'
        },
        {
          num: '03',
          label: '03',
          title: 'Dispatch & Flight Planning Software Evaluation, Selection & Integration',
          focus: 'Choosing and integrating the right tools',
          description:
            'Evaluating dispatch and flight-planning software against the operation\'s actual requirements, then managing selection and integration into the live workflow.'
        },
        {
          num: '04',
          label: '04',
          title: 'OCC Staffing Models, Competency Audits & Efficiency Benchmarking',
          focus: 'Sizing the team against real demand',
          description:
            'Building a staffing model sized against real operational demand, backed by competency audits and efficiency benchmarking against comparable operations.'
        }
      ]
    },
    whoShouldAttend: {
      intro: 'For operators building or rebuilding an operational control centre. Ideal for:',
      points: ['Startup airlines preparing for AOC award', 'Expanding charter and business aviation operators', 'Cargo carriers modernising an existing OCC', 'Post-holders in flight operations'],
      outro: 'Target outcome: enterprise airline advisory and turnkey operational launch.'
    },
    courseContent: {
      intro: 'A typical engagement covers:',
      modules: [
        'OCC Ergonomics, Multi-Screen Flight Following & Console Setup',
        'Flight Operations Manual (FOM/OM-A) Drafting & Regulator Compliance',
        'Dispatch & Flight Planning Software Evaluation, Selection & Integration',
        'OCC Staffing Models, Competency Audits & Efficiency Benchmarking'
      ],
      note: ''
    },
    certification: {
      text: 'Deliverables are documented reports and manuals rather than a candidate certificate.',
      points: []
    },
    registrationOpen: true
  }
]

async function run() {
  await connectDB()

  for (const data of courses) {
    const existing = await Course.findOne({ slug: data.slug })
    if (existing) {
      existing.set({ ...data, status: 'published' })
      await existing.save()
      console.log(`Updated: ${existing.slug}`)
    } else {
      const created = await Course.create({ ...data, status: 'published' })
      console.log(`Created: ${created.slug}`)
    }
  }

  await mongoose.disconnect()
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
