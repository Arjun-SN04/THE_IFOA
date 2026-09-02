// Migrates the hard-coded ServicesPage catalog into the database so every
// course card on the site has a real detail page. Upserts by slug — safe to
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
    format: "Hybrid Online + In-Person Simulator Sessions",
    careerPath: "Commercial Airline Dispatcher, Cargo Flight Follower, Corporate OCC Specialist",
    intakeLabel: "",
    title: 'Flight Dispatcher Initial Certification',
    refCode: 'FD-INITIAL',
    category: 'dispatch',
    featured: true,
    order: 10,
    summary: 'Complete licensing curriculum for aspiring airline flight dispatchers.',
    heroImage: { url: '/course-images/Flight-Dispatch-Webpage-Small.jpg', key: '', alt: 'Flight dispatch training' },
    schedule: { mode: 'Hybrid', startDate: new Date('2026-04-14T09:00:00Z'), timeText: 'Intensive Theory + Live OCC Sim' },
    duration: '12 Weeks',
    location: 'Hybrid Online + In-Person Simulator Sessions',
    price: { amount: null, currency: 'EUR', note: 'Contact admissions for current intake pricing.' },
    whatYouWillLearn: {
      intro:
        'The premier worldwide certification curriculum covering Meteorology, Flight Planning, Air Law, Mass & Balance, Aircraft Systems, and real-time live OCC flight monitoring.',
      points: [
        'To contribute to the safety and efficiency of flight operations',
        'To enhance situational awareness and collaborative decision-making',
        'To assess and anticipate operational situation risks',
        'To plan, file and monitor flights to ICAO, EASA and FAA standards'
      ]
    },
    delivery: {
      intro: 'Hybrid delivery: online theory modules combined with in-person live OCC simulator sessions.',
      items: [
        { label: 'School', title: 'IFOA', description: 'Delivered by the International Flight Operations Academy' },
        { label: 'Format', title: 'Hybrid', description: '12 weeks online theory plus in-person simulator practicum' }
      ]
    },
    trainingStandards: { intro: `${ICAO_INTRO} It meets EASA Part ORO GEN 110(c) and FAA Part 65 requirements.`, logos: [] },
    whoShouldAttend: {
      intro: 'This programme is designed for individuals beginning a career in airline operational control. Ideal for:',
      points: ['Aspiring flight dispatchers', 'CPL Pilot students', 'Airline operations personnel', 'Air Traffic Controllers', 'Aviation enthusiasts'],
      outro:
        'Target roles on completion: Commercial Airline Dispatcher, Cargo Flight Follower, Corporate OCC Specialist.'
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
      note: 'IFOA is the only training company offering a DOUBLE CERTIFICATION - FAA / EASA.'
    },
    certification: {
      text:
        'Upon successfully completing the exam you will be awarded an IFOA Flight Dispatch Completion Certificate, valid for an unlimited period.',
      points: ['Practical and multiple-choice questions', '80% required to pass.']
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
    heroImage: { url: '/course-images/occ-control-center-dispatcher.jpg', key: '', alt: 'OCC control centre' },
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
    slug: 'train-the-trainer-icao-cbta-instructor',
    authority: "ICAO Training Instructor Certified",
    format: "Interactive Masterclasses + Video Micro-Teaching",
    careerPath: "Aviation Instructor, OCC Training Captain, Airline CBTA Assessor",
    intakeLabel: "",
    title: 'Train the Trainer (ICAO CBTA Instructor TIC 1 & 2)',
    refCode: 'TTT-CBTA',
    category: 'train-the-trainer',
    featured: true,
    order: 40,
    summary: 'Pedagogical mastery and assessment rubrics for senior aviation trainers.',
    heroImage: { url: '/course-images/Train-the-trainer.jpg', key: '', alt: 'Train the trainer session' },
    schedule: { mode: 'Hybrid', startDate: new Date('2026-05-18T09:00:00Z'), timeText: 'Pedagogy & Assessment' },
    duration: '5 Weeks',
    location: 'Interactive Masterclasses + Video Micro-Teaching',
    price: { amount: null, currency: 'EUR', note: '' },
    whatYouWillLearn: {
      intro:
        'Engineered for senior dispatchers and airline managers preparing to deliver high-impact adult learning, design CBTA assessments, and mentor operational cadets.',
      points: [
        'To convey subject expertise convincingly to adult learners',
        'To design competency units and evidence-based scoring rubrics',
        'To brief and debrief simulator sessions without punitive feedback',
        'To apply human factors principles inside instruction'
      ]
    },
    delivery: {
      intro: 'This is the IFOA signature training solution — being a subject-matter expert is not enough.',
      items: [
        { label: 'School', title: 'IFOA', description: 'Delivered by the International Flight Operations Academy' },
        { label: 'Format', title: 'Masterclass + Micro-Teaching', description: '5 weeks of interactive masterclasses with recorded practice' }
      ]
    },
    trainingStandards: { intro: `${ICAO_INTRO} Instructors are certified against ICAO TIC 1 & 2 requirements.`, logos: [] },
    whoShouldAttend: {
      intro: 'For experienced professionals moving into a training role. Ideal for:',
      points: ['Senior flight dispatchers', 'Airline training managers', 'OCC supervisors and mentors', 'Prospective CBTA assessors'],
      outro: 'Target roles: Aviation Instructor, OCC Training Captain, Airline CBTA Assessor.'
    },
    courseContent: {
      intro: 'Training adults requires specific competencies and theoretical preparation:',
      modules: [
        'Principles of Adult Education & Cognitive Learning Frameworks',
        'CBTA Competency Unit Design & Evidence-Based Rubric Scoring',
        'Simulator Briefing & Debriefing Techniques (Non-Punitive Feedback)',
        'Aviation Human Factors & Crew Resource Management in Instruction'
      ],
      note: ''
    },
    certification: {
      text: 'Successful candidates are awarded the IFOA Train the Trainer (TIC 1 & 2) Certificate.',
      points: ['Assessed micro-teaching delivery', 'Written rubric design exercise', '80% required to pass.']
    }
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
    heroImage: { url: '/course-images/aviation-consulting-support.jpg', key: '', alt: 'Aviation consulting' },
    schedule: { mode: 'Onsite', timeText: 'Immediate consultation available' },
    duration: 'Project-Based / Turnkey Integration',
    location: 'On-site Assessment + Workflow Redesign',
    price: { amount: null, currency: 'EUR', note: 'Scoped per engagement — request a proposal.' },
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
