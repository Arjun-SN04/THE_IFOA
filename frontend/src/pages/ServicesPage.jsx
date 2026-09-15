import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import {
  Plane,
  Shield,
  ShieldCheck,
  Award,
  CheckCircle2,
  Calendar,
  Clock,
  BookOpen,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Users,
  Search,
  ExternalLink,
  GraduationCap,
  Briefcase,
  Layers,
  FileCheck,
  Compass,
  MessageSquare,
  PhoneCall,
  Mail
} from 'lucide-react'

import { CosmicParallaxBg } from '@/components/common/CosmicParallaxBg'
import { CourseCard } from '@/components/course/CourseCard'
import { AviationIcon } from '@/components/common/AviationIcon'
import { usePageContent } from '@/hooks/usePageContent'

// Standards Logos
import logoFaa from '@/assets/course/standards-logos/logo-faa.png'
import logoEasa from '@/assets/course/standards-logos/logo-easa.png'
import logoIcao from '@/assets/course/standards-logos/logo-icao.png'

// Official Discipline Media
import imgFlightDispatch from '@/assets/profile_media/portfolio-flight-dispatch.jpg'
import imgGroundOps from '@/assets/profile_media/portfolio-ground-ops.jpg'
import imgDgr from '@/assets/profile_media/portfolio-dangerous-goods.jpg'
import imgTrainTrainer from '@/assets/profile_media/portfolio-train-trainer.jpg'
import imgHumanFactors from '@/assets/profile_media/portfolio-human-factors.jpg'
import imgCrewControl from '@/assets/profile_media/crew-scheduling-operations.jpg'
import imgSustainability from '@/assets/services/Bsuiness-Jet-Flying-Small.jpg'
import imgConsulting from '@/assets/common/aviation-consulting-support.jpg'
import imgOccLarge from '@/assets/profile_media/occ-flight-dispatch-large.jpg'

// Discipline card images stay bundled; matched to a discipline by its number.
const DISCIPLINE_IMG_BY_ID = {
  '01': imgFlightDispatch,
  '02': imgDgr,
  '03': imgTrainTrainer,
  '04': imgHumanFactors,
  '05': imgCrewControl,
  '06': imgConsulting
}

// Content the page ships with; editable at /admin/pages/services.
const FALLBACK = {
  hero: {
    title: 'Built on competency, not just compliance.',
    subtitle:
      'Six disciplines, one standard: training that prepares people to make the right call under pressure.',
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
}

export function ServicesPage() {
  const navigate = useNavigate()
  const { c } = usePageContent('services', FALLBACK)
  const [selectedDiscipline, setSelectedDiscipline] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [liveCourses, setLiveCourses] = useState([])

  useEffect(() => {
    api
      .listCourses()
      .then((data) => setLiveCourses(data.courses || []))
      .catch(() => setLiveCourses([]))
  }, [])

  const REG_LOGOS = [
    { logo: logoEasa },
    { logo: logoFaa },
    { logo: logoEasa, secondLogo: logoFaa },
    { logo: logoIcao }
  ]
  const certificationPathways = c.pathways.cards.map((card, i) => ({
    ...card,
    ...(REG_LOGOS[i] || {})
  }))

  const cbtaPillars = c.cbta?.pillars || FALLBACK.cbta.pillars

  const EXCLUDED_DISCIPLINES = new Set(['ground operations', 'aviation sustainability'])

  const disciplines = (c.specialist?.disciplines || FALLBACK.specialist.disciplines)
    .filter((d) => !EXCLUDED_DISCIPLINES.has((d.title || '').trim().toLowerCase()))
    .map((d, index) => {
      const formattedId = String(index + 1).padStart(2, '0')
      const lowerTitle = (d.title || '').toLowerCase()
      let category = d.category
      if (lowerTitle.includes('train')) category = 'train-trainer'
      else if (lowerTitle.includes('consulting')) category = 'consulting'
      else category = 'flight-ops'

      return {
        ...d,
        id: formattedId,
        category,
        image: d.image?.url || DISCIPLINE_IMG_BY_ID[formattedId] || DISCIPLINE_IMG_BY_ID[d.id] || imgConsulting
      }
    })

  const categories = [
    { id: 'all', label: 'All Services (6)' },
    { id: 'flight-ops', label: 'Flight Operations & OCC' },
    { id: 'train-trainer', label: 'Train the Trainer' },
    { id: 'consulting', label: 'Consulting' }
  ]

  const filteredDisciplines = disciplines.filter((d) => {
    if (selectedDiscipline !== 'all' && d.category !== selectedDiscipline) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return (
        d.title.toLowerCase().includes(q) ||
        d.desc.toLowerCase().includes(q) ||
        d.audience.toLowerCase().includes(q) ||
        d.tag.toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <div className="bg-white text-rocket-dark selection:bg-slate-900 selection:text-white" data-purpose="services-page">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[460px] md:min-h-[500px] flex flex-col items-center justify-center bg-[#020617] text-white pt-28 pb-16 overflow-hidden">
        {/* Ambient Aviation Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={c.hero.image?.url || imgOccLarge}
            alt="Aviation Flight Operations Training"
            className="w-full h-full object-cover object-center opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/90 via-[#020617]/75 to-[#020617]" />
        </div>

        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 text-center space-y-6 flex flex-col items-center justify-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            {c.hero.title}
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            {c.hero.subtitle}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate('/contact')}
              className="bg-[#34E06E] hover:bg-[#28c85e] text-slate-950 font-extrabold px-7 py-3 rounded-full text-xs uppercase tracking-widest transition-all duration-200 shadow-lg hover:shadow-[0_0_20px_rgba(52,224,110,0.4)] hover:scale-105 cursor-pointer"
            >
              {c.hero.primaryLabel}
            </button>
            <a
              href="https://wa.me/41782273103"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-6 py-3 rounded-full text-xs uppercase tracking-widest transition-all duration-200"
            >
              <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. SPECIALIST & OPERATIONAL SERVICES (TOP SHOWCASE) */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80" data-purpose="specialist-operational-training">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
            <div className="max-w-2xl space-y-2.5">
              <span className="text-xs sm:text-sm font-mono font-black uppercase tracking-widest text-slate-950 border-b-2 border-[#34E06E] pb-1 inline-block">
                {c.specialist.eyebrow}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                {c.specialist.title}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                {c.specialist.intro}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 font-medium italic">
                {c.specialist.note}
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80 shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search disciplines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 shadow-2xs transition-all"
              />
            </div>
          </div>

          {/* Interactive Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-b border-slate-200/80 pb-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedDiscipline(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  selectedDiscipline === cat.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Clean & Organized 3-Column Luxury Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredDisciplines.map((item) => (
              <div
                key={item.id}
                className="group rounded-3xl bg-white border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-slate-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Top Media Container */}
                <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-950 shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

                  {/* Floating Header Badges */}
                  <div className="absolute top-3.5 left-3.5 flex items-center pointer-events-none">
                    <span className="text-xs font-mono font-bold text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 shadow-xs">
                      {item.id}
                    </span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5 bg-white">
                  <div className="space-y-2.5">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug group-hover:text-slate-950 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  {/* Audience & Inquire Action Footer */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 truncate max-w-[170px] sm:max-w-[190px]">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{item.audience}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate('/contact')}
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-[#34E06E] transition-colors cursor-pointer shrink-0 group/btn"
                    >
                      <span>Inquire</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform text-slate-700 hover:text-[#34E06E]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CHOOSE YOUR CERTIFICATION PATH */}
      <section className="py-16 sm:py-20 bg-slate-50/60 border-b border-slate-200/80" data-purpose="certification-pathways">
        <div className="max-w-[1280px] mx-auto px-6 space-y-10">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs sm:text-sm font-mono font-black uppercase tracking-widest text-slate-950 border-b-2 border-[#34E06E] pb-1 inline-block">
              {c.pathways.eyebrow}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-rocket-dark leading-tight">
              {c.pathways.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
              {c.pathways.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {certificationPathways.map((card, idx) => (
              <div
                key={idx}
                className="group rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-slate-300 hover:-translate-y-1.5 p-7 flex flex-col justify-between space-y-6 transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      {card.region}
                    </span>
                    <span className="text-[11px] font-mono font-black uppercase tracking-wider text-slate-950 border-b-2 border-[#34E06E] pb-0.5 inline-block">
                      {card.badge2}
                    </span>
                  </div>

                  <div className="h-10 flex items-center gap-3">
                    {card.logo && (
                      <img
                        src={card.logo}
                        alt="Regulator Logo"
                        className="h-8 max-h-8 w-auto object-contain"
                      />
                    )}
                    {card.secondLogo && (
                      <img
                        src={card.secondLogo}
                        alt="Second Regulator Logo"
                        className="h-8 max-h-8 w-auto object-contain"
                      />
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-rocket-dark tracking-tight leading-snug group-hover:text-slate-900 transition-colors">
                    {card.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-mono font-black uppercase tracking-wider text-slate-950 border-b-2 border-[#34E06E] pb-0.5 inline-block">
                    {card.badge1}
                  </span>
                  <button
                    onClick={() => navigate('/contact')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rocket-dark group-hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    <span>{card.action}</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. THE CBTA OPERATIONAL APPROACH (MODERN EXECUTIVE METHODOLOGY) */}
      <section className="py-20 sm:py-24 bg-white border-b border-slate-200/80" data-purpose="cbta-approach">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header Row */}
          <div className="max-w-3xl space-y-3">
            <span className="text-xs sm:text-sm font-mono font-black uppercase tracking-widest text-slate-950 border-b-2 border-[#34E06E] pb-1 inline-block">
              {c.cbta.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {c.cbta.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
              {c.cbta.intro}
            </p>
          </div>

          {/* 4 CBTA Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cbtaPillars.map((p, idx) => (
              <div
                key={idx}
                className="group rounded-3xl bg-slate-50/70 border border-slate-200/90 hover:bg-white hover:border-slate-300 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  {/* Top Step & Icon */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 group-hover:bg-slate-900 group-hover:text-white transition-colors flex items-center justify-center shadow-2xs">
                      <AviationIcon name={p.iconName} className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-400 group-hover:text-slate-900 transition-colors">
                      // {p.idx}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider block">
                      {p.subtitle}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-snug">
                      {p.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed pt-1">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Integrated Standards & Compliance Bar */}
          <div className="rounded-3xl bg-slate-50 border border-slate-200/90 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  {c.cbta.complianceTitle}
                </h4>
                <p className="text-xs text-slate-500">
                  {c.cbta.complianceDesc}
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full w-fit">
                Verified Global Curricula
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all">
                <img src={logoFaa} alt="FAA" className="h-8 w-auto object-contain shrink-0" />
                <div className="min-w-0">
                  <strong className="text-xs sm:text-sm font-bold text-slate-900 block truncate">FAA Part 65</strong>
                  <span className="text-[11px] text-slate-500 font-mono">Approved School #IPIN</span>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all">
                <img src={logoEasa} alt="EASA" className="h-8 w-auto object-contain shrink-0" />
                <div className="min-w-0">
                  <strong className="text-xs sm:text-sm font-bold text-slate-900 block truncate">EASA Standards</strong>
                  <span className="text-[11px] text-slate-500 font-mono">ORO.GEN 110 Aligned</span>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all">
                <img src={logoIcao} alt="ICAO" className="h-8 w-auto object-contain shrink-0" />
                <div className="min-w-0">
                  <strong className="text-xs sm:text-sm font-bold text-slate-900 block truncate">ICAO Standards</strong>
                  <span className="text-[11px] text-slate-500 font-mono">Doc 10106 Framework</span>
                </div>
              </div>
            </div>

            {/* Integrated Contact & Advisory CTA Row */}
            <div className="pt-4 border-t border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center md:text-left">
                <h5 className="text-sm sm:text-base font-bold text-slate-900">
                  {c.specialist.moreTitle}
                </h5>
                <p className="text-xs text-slate-600">
                  {c.specialist.moreDesc}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={() => navigate('/contact')}
                  className="bg-[#34E06E] hover:bg-[#28c85e] text-slate-950 font-extrabold px-6 py-2.5 rounded-full text-xs uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow-[0_0_15px_rgba(52,224,110,0.4)] hover:scale-105 cursor-pointer"
                >
                  Contact Us Now
                </button>
                <a
                  href="mailto:info@theifoa.com"
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold px-5 py-2.5 rounded-full text-xs uppercase tracking-wider transition-all duration-200 shadow-2xs"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>info@theifoa.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
