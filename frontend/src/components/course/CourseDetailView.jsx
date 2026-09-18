import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RiArrowLeftLine,
  RiArrowDownSLine,
  RiShareForwardLine,
  RiWhatsappFill,
  RiShieldCheckFill,
  RiCalendarEventLine,
  RiMapPin2Line,
  RiStackLine,
  RiCheckboxCircleFill
} from 'react-icons/ri'
import { TbClockHour4, TbCertificate } from 'react-icons/tb'
import { HiArrowUpRight } from 'react-icons/hi2'
import { MdOutlineMail } from 'react-icons/md'

import { mergeContent } from '@/hooks/usePageContent'

// Assets
import bannerCourseHero from '@/assets/courses/easa-hero.png'
import logoFaa from '@/assets/course/standards-logos/logo-faa.png'
import logoEasa from '@/assets/course/standards-logos/logo-easa.png'
import logoIcao from '@/assets/course/standards-logos/logo-icao.png'
import logoDgca from '@/assets/course/standards-logos/logo-dgca.png'

const FALLBACK = {
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
    easaComplianceBadge: 'EASA ORO.GEN.110 Compliant',
    dgcaComplianceBadge: 'DGCA & ICAO Aligned Training',
    cbtaBadge: 'Competency-Based Assessment (CBTA)',
    applyOnlineLabel: 'Apply Online',
    viewModulesLabel: 'View Course Modules',
    outcomesEyebrow: 'COMPETENCY OUTCOMES',
    outcomesTitle: 'Built for Operational Control',
    complianceEyebrow: 'REGULATORY FRAMEWORK',
    complianceTitleEasa: 'EASA-Compliant Training',
    complianceTitleDgca: 'DGCA & ICAO Aligned Training',
    complianceTag1Easa: 'EASA ORO.GEN.110',
    complianceTag1Dgca: 'DGCA CAR Compliant',
    complianceTag2: 'ICAO Doc 10106',
    complianceTag3: 'CBTA Framework',
    eligibilityEyebrow: 'Eligibility Profile',
    eligibilityTitle: 'Who Should Attend This Training?',
    admissionsEyebrow: 'Admissions Portal',
    admissionsTitle: 'Ready to Start Your Dispatch Career?',
    admissionsDesc: 'Reserve your seat for the upcoming training or connect directly with our team.',
    admissionsApplyLabel: 'Apply Online ↗',
    admissionsWhatsappLabel: 'WhatsApp Chat',
    sidebarAdmissionsOpenBadge: 'Admissions Open',
    sidebarOverviewLabel: 'Programme Overview',
    sidebarTuitionLabel: 'Tuition Fee',
    sidebarTuitionNote: '+ 18% GST / Track · Inclusive of official materials',
    sidebarEnrollLabel: 'Enroll Now — Apply Online ↗',
    sidebarWhatsappLabel: 'Inquire on WhatsApp',
    sidebarDurationLabel: 'Duration',
    sidebarIntakeLabel: 'Next Intake',
    sidebarLocationLabel: 'Location',
    sidebarDeliveryLabel: 'Delivery',
    sidebarStandardLabel: 'Standard',
    sidebarStandardValueEasa: 'EASA Compliant',
    sidebarStandardValueDgca: 'DGCA / EASA Aligned',
    sidebarCertificateLabel: 'Certificate',
    sidebarCertificateValue: 'IFOA Verified Certificate',
    sidebarSupportTitle: 'Admissions Support',
    sidebarSupportDesc: 'Direct questions regarding admission prerequisites or corporate group bookings.'
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

function formatDate(value, opts = { day: '2-digit', month: '2-digit', year: 'numeric' }) {
  if (!value) return '04/01/2027'
  return new Date(value).toLocaleDateString('en-GB', opts)
}

function formatPrice(price, isIndia = false) {
  if (price && price.amount != null) {
    const symbol = price.currency === 'INR' ? '₹' : price.currency === 'EUR' ? '€' : '$'
    return `${symbol}${price.amount.toLocaleString('en-US')}`
  }
  return isIndia ? '₹99,000' : '€3,500'
}

export function CourseDetailView({ course, preview = false }) {
  const [copied, setCopied] = useState(false)
  const [activePhase, setActivePhase] = useState(0)
  // Chrome text now comes from this course's own override (merged onto
  // DEFAULTS.courseDetail server-side), delivered on `course.content` in the
  // same request that fetched the course. FALLBACK is the ultimate safety
  // net if that field is still loading/missing.
  const c = mergeContent(FALLBACK, course?.content?.courseDetail || {})

  if (!course) return null

  const { schedule = {} } = course
  const isIndiaProgram =
    course.slug?.includes('india') ||
    course.refCode?.includes('IPIN') ||
    course.title?.toLowerCase().includes('india')

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: course.title,
          url: window.location.href
        })
        .catch(() => { })
    } else {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  // 5 Phase curriculum structured for professional presentation (admin-editable static chrome)
  const phaseCurriculum = c.curriculum?.phases?.length ? c.curriculum.phases : FALLBACK.curriculum.phases

  const learningOutcomes = course.whatYouWillLearn?.points?.length
    ? course.whatYouWillLearn.points
    : [
      'Plan and prepare flights',
      'Assess operational risks and constraints',
      'Apply weather, fuel, routing and alternate requirements',
      'Monitor flights and anticipate disruptions',
      'Support safe operational decision-making',
      'Apply EASA, ICAO and operator procedures'
    ]

  const whoCanApplyList = course.whoShouldAttend?.points?.length
    ? course.whoShouldAttend.points
    : [
      'Ab initio',
      'Aspiring flight dispatchers',
      'Air Traffic Controllers',
      'Airline, ground handling, and OCC personnel looking to advance'
    ]

  return (
    <div
      className={`w-full min-h-screen bg-[#fcfdfd] text-slate-900 font-sans antialiased selection:bg-[#34E06E] selection:text-slate-950 ${
        preview ? '' : 'pt-20'
      }`}
      data-purpose="course-detail-view"
    >
      {/* ========================================================================= */}
      {/* MAIN TWO-COLUMN CONTAINER                                                 */}
      {/* ========================================================================= */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* ===================================================================== */}
          {/* LEFT CONTENT COLUMN (7.5 Cols)                                        */}
          {/* ===================================================================== */}
          <main className="lg:col-span-7 xl:col-span-8 min-w-0 space-y-12 sm:space-y-14">

            {/* 1. HERO SECTION (Ultra Clean, Modern & Professional Aviation Standard) */}
            <section id="overview" className="space-y-6">
              {/* Sleek Breadcrumb & Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/70 pb-4">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <Link
                    to="/events"
                    className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-950 transition-colors group font-semibold"
                  >
                    <RiArrowLeftLine className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-950 group-hover:-translate-x-0.5 transition-transform" />
                    <span>All Programmes</span>
                  </Link>
                  <span className="text-slate-300">/</span>
                  <span className="text-slate-700 hidden sm:inline">{c.labels.eyebrowSecondary || 'Flight Operations'}</span>
                  {course.refCode && (
                    <>
                      <span className="text-slate-300 hidden sm:inline">•</span>
                      <span className="text-[11px] font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/80">
                        Ref: {course.refCode}
                      </span>
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-950 border border-slate-200 hover:border-slate-300 px-3.5 py-1.5 rounded-lg transition-all shadow-2xs hover:shadow-xs cursor-pointer"
                >
                  <RiShareForwardLine className="w-3.5 h-3.5 text-slate-400" />
                  <span>{copied ? c.labels.copiedLabel : c.labels.shareLabel}</span>
                </button>
              </div>

              {/* Title & Headline */}
              <div className="space-y-3">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-extrabold text-slate-950 tracking-tight leading-[1.18] [text-wrap:balance]">
                  {course.title || 'Flight Dispatch Training for Real-World Operations.'}
                </h1>

                {/* Summary Copy */}
                <p className="text-sm sm:text-base md:text-[16px] text-slate-600 font-normal leading-relaxed max-w-3xl">
                  {course.summary ||
                    `A comprehensive ${course.duration || '5-week'} ${isIndiaProgram ? 'DGCA & ICAO' : 'EASA'}-compliant curriculum designed to build technical knowledge, situational awareness, and operational judgment for professional flight operations.`}
                </p>
              </div>

              {/* Badges & Trust Metrics */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-200/80 text-xs font-semibold text-emerald-900 shadow-2xs">
                  <RiShieldCheckFill className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{isIndiaProgram ? c.labels.dgcaComplianceBadge : c.labels.easaComplianceBadge}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/90 border border-slate-200/80 text-xs font-semibold text-slate-700 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                  <span>{c.labels.cbtaBadge}</span>
                </div>
              </div>

              {/* Primary Action Row */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  to={`/courses/${course.slug}/enroll`}
                  className="inline-flex items-center justify-center gap-2 bg-[#34E06E] hover:bg-[#2bd463] text-slate-950 font-bold px-6 py-3 rounded-xl text-xs sm:text-sm tracking-wide transition-all duration-150 shadow-xs hover:shadow-md hover:-translate-y-0.5 group cursor-pointer"
                >
                  <span>{c.labels.applyOnlineLabel}</span>
                  <HiArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>

                <a
                  href="#modules"
                  className="inline-flex items-center justify-center border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold px-5 py-3 rounded-xl text-xs sm:text-sm transition-all duration-150 shadow-2xs cursor-pointer"
                >
                  <span>{c.labels.viewModulesLabel}</span>
                </a>
              </div>
            </section>

            {/* 2. CURRICULUM OVERVIEW / 5 PHASES */}
            <section id="modules" className="space-y-6 scroll-mt-12">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2 border-b border-slate-200/80">
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-700 block mb-1">
                    {c.curriculum.eyebrow}
                  </span>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {c.curriculum.title}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 max-w-xs sm:text-right font-normal">
                  {c.curriculum.subtitle}
                </p>
              </div>

              {/* Interactive Expanding Horizontal Vertical-Bar Accordion (Desktop) */}
              <div className="hidden md:flex gap-3 w-full h-[420px]">
                {phaseCurriculum.map((phase, idx) => {
                  const isActive = activePhase === idx
                  return (
                    <div
                      key={phase.num}
                      onMouseEnter={() => setActivePhase(idx)}
                      onClick={() => setActivePhase(idx)}
                      className={`group relative rounded-2xl border transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer overflow-hidden select-none will-change-[flex-grow] ${isActive
                        ? 'flex-[3.5] bg-white border-slate-300/90 shadow-lg shadow-slate-200/60'
                        : 'flex-1 bg-slate-50/60 hover:bg-slate-100/70 border-slate-200/70 hover:border-slate-300/80'
                        }`}
                    >
                      {/* EXPANDED CONTENT VIEW (Silky smooth fade & slide without text reflow) */}
                      <div
                        className={`w-full h-full min-w-[340px] p-6 sm:p-7 flex flex-col justify-between transition-opacity duration-300 ease-out ${isActive
                          ? 'opacity-100 delay-150 pointer-events-auto'
                          : 'opacity-0 pointer-events-none absolute inset-0'
                          }`}
                      >
                        <div className="space-y-4">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <span className="w-8 h-8 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs grid place-items-center shadow-xs">
                                {phase.num}
                              </span>
                              <span className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
                                {phase.label}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-950 border-b-2 border-[#34E06E] pb-0.5 inline-block">
                              Active Phase
                            </span>
                          </div>

                          <div>
                            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
                              {phase.title}
                            </h3>
                            <p className="text-xs text-slate-500 mt-1 font-normal">
                              Key operational competencies and syllabus objectives:
                            </p>
                          </div>

                          <div className="space-y-2 pt-1">
                            {phase.topics.map((t, topicIdx) => (
                              <div
                                key={topicIdx}
                                className="text-xs font-medium text-slate-800 bg-slate-50/80 border border-slate-200/70 rounded-xl px-3.5 py-2.5 hover:bg-slate-100/90 transition-colors flex items-center gap-2"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                                <span>{t}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-400">
                          <span>Phase {phase.num} of 05</span>
                          <span>IFOA Training Standard</span>
                        </div>
                      </div>

                      {/* COLLAPSED VERTICAL BAR VIEW (Clean & Centered) */}
                      <div
                        className={`absolute inset-0 py-6 px-2 flex flex-col items-center justify-between transition-opacity duration-200 ease-out ${isActive
                          ? 'opacity-0 pointer-events-none'
                          : 'opacity-100'
                          }`}
                      >
                        <span className="w-8 h-8 rounded-lg bg-white border border-slate-200/90 grid place-items-center text-xs font-mono font-bold text-slate-700 shadow-2xs group-hover:border-slate-300 group-hover:text-slate-950 transition-colors">
                          {phase.num}
                        </span>

                        <div className="flex-1 flex items-center justify-center my-4 overflow-hidden">
                          <span className="[writing-mode:vertical-lr] rotate-180 text-xs font-semibold tracking-tight text-slate-600 group-hover:text-slate-950 whitespace-nowrap transition-colors select-none">
                            {phase.title}
                          </span>
                        </div>

                        <span className="text-[10px] font-mono font-semibold text-slate-400 group-hover:text-slate-600 uppercase tracking-widest transition-colors">
                          {phase.num}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Mobile Accordion Stack (< md viewports) */}
              <div className="md:hidden space-y-2.5">
                {phaseCurriculum.map((phase, idx) => {
                  const isActive = activePhase === idx
                  return (
                    <div
                      key={phase.num}
                      onClick={() => setActivePhase(isActive ? -1 : idx)}
                      className={`rounded-2xl border transition-all duration-300 p-4 cursor-pointer overflow-hidden ${isActive ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100/60'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs grid place-items-center shadow-2xs">
                            {phase.num}
                          </span>
                          <span className="font-bold text-sm text-slate-900">{phase.title}</span>
                        </div>
                        <motion.span
                          animate={{ rotate: isActive ? 180 : 0 }}
                          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                          className="text-slate-500 flex items-center justify-center"
                        >
                          <RiArrowDownSLine className="w-5 h-5" />
                        </motion.span>
                      </div>

                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
                              {phase.topics.map((t, topicIdx) => (
                                <div
                                  key={topicIdx}
                                  className="text-xs font-medium text-slate-700 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1.5 flex items-center gap-2"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                                  <span>{t}</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>

            </section>

            {/* 3. TRAINING OUTCOMES & REGULATORY ALIGNMENT (EQUAL HEIGHT BALANCED CARDS) */}
            <section id="standards" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">

                {/* Left: Training Outcomes Card */}
                <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-2xs flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 block">
                        {c.labels.outcomesEyebrow}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                        {c.labels.outcomesTitle}
                      </h3>
                    </div>

                    <div className="space-y-3 pt-1">
                      {learningOutcomes.map((point, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-snug">
                          <RiCheckboxCircleFill className="w-4 h-4 text-[#34E06E] shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>{course.duration || '5 Weeks'}</span>
                    <span className="text-slate-300">•</span>
                    <span>Theory • Scenarios • Assessment</span>
                  </div>
                </div>

                {/* Right: Regulatory Compliance Card */}
                <div className="rounded-2xl bg-[#091120] text-white p-6 sm:p-7 shadow-2xs flex flex-col justify-between h-full border border-slate-800">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#34E06E] block">
                        {c.labels.complianceEyebrow}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                        {isIndiaProgram ? c.labels.complianceTitleDgca : c.labels.complianceTitleEasa}
                      </h3>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                      {course.trainingStandards?.intro ||
                        'A 5-week Flight Dispatcher programme aligned with EASA Air Operations requirements and ICAO Flight Operations Officer / Flight Dispatcher competency standards.'}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#34E06E] block">
                      Regulatory Frameworks
                    </span>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.06] border border-white/10 hover:border-white/20 transition-colors">
                        <div className="h-9 w-12 bg-white rounded-lg flex items-center justify-center p-1 shrink-0 shadow-2xs">
                          <img
                            src={isIndiaProgram ? logoDgca : logoEasa}
                            alt={isIndiaProgram ? 'DGCA' : 'EASA'}
                            className="max-h-6 max-w-full object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white leading-tight">
                            {isIndiaProgram ? 'DGCA' : 'EASA'}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                            {isIndiaProgram ? 'CAR Compliant' : 'ORO.GEN.110'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.06] border border-white/10 hover:border-white/20 transition-colors">
                        <div className="h-9 w-12 bg-white rounded-lg flex items-center justify-center p-1 shrink-0 shadow-2xs">
                          <img
                            src={logoIcao}
                            alt="ICAO"
                            className="max-h-6 max-w-full object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white leading-tight">
                            ICAO
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                            Doc 10106
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. WHO CAN APPLY */}
            <section className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 block">
                  {c.labels.eligibilityEyebrow}
                </span>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  {c.labels.eligibilityTitle}
                </h3>
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                {whoCanApplyList.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center gap-2.5 text-xs text-slate-700 leading-snug whitespace-nowrap"
                  >
                    <RiCheckboxCircleFill className="w-4 h-4 text-[#34E06E] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. ADMISSIONS BOTTOM CALLOUT BANNER */}
            <section
              id="apply"
              className="rounded-3xl bg-gradient-to-br from-[#070d18] via-[#0b1424] to-[#070d18] text-white p-7 sm:p-9 border border-white/10 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-1.5 max-w-md">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#34E06E] block">
                  {c.labels.admissionsEyebrow}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
                  {c.labels.admissionsTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-normal">
                  {c.labels.admissionsDesc}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Link
                  to={`/courses/${course.slug}/enroll`}
                  className="inline-flex items-center justify-center gap-2 bg-[#34E06E] hover:bg-[#28c85e] text-slate-950 font-bold py-3 px-5 rounded-xl text-xs uppercase tracking-wider transition-all duration-150 shadow-sm hover:shadow-md cursor-pointer"
                >
                  <span>{c.labels.admissionsApplyLabel}</span>
                </Link>

                <a
                  href="https://wa.me/41782273103"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-500 bg-white/5 hover:bg-white/10 text-white font-semibold py-3 px-4 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  <RiWhatsappFill className="w-4 h-4 text-[#25D366]" />
                  <span>{c.labels.admissionsWhatsappLabel}</span>
                </a>
              </div>
            </section>
          </main>

          {/* ===================================================================== */}
          {/* RIGHT STICKY SIDEBAR (Programme Overview Panel) (4.5 Cols)            */}
          {/* ===================================================================== */}
          <aside
            className="lg:col-span-5 xl:col-span-4 sticky top-20 bg-white text-slate-900 border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-6"
            aria-label="Programme overview"
          >
            {/* Top Course Card Thumbnail - Clean & Fully Visible */}
            <div className="relative aspect-[3/2] -mx-6 -mt-6 rounded-t-3xl overflow-hidden bg-white select-none border-b border-slate-100 flex items-center justify-center p-3">
              <img
                src={course.image || bannerCourseHero}
                alt={course.title}
                className="w-full h-full object-contain object-center"
              />
            </div>

            {/* Header & Price Display */}
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-700 pb-1.5 border-b-2 border-[#34E06E] inline-block">
                {c.labels.sidebarOverviewLabel}
              </span>

              <div className="pt-4 pb-1">
                <span className="block text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                  {c.labels.sidebarTuitionLabel}
                </span>
                <strong className="block text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mt-0.5">
                  {formatPrice(course.price, isIndiaProgram)}
                </strong>
                <small className="block text-xs text-slate-500 font-normal mt-1">
                  {course.price?.note || (isIndiaProgram ? '+ 18% GST / Track · Inclusive of official materials' : 'Inclusive of official materials')}
                </small>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-2.5">
              <Link
                to={`/courses/${course.slug}/enroll`}
                className="w-full block text-center bg-[#34E06E] hover:bg-[#28c85e] text-slate-950 font-extrabold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all duration-150 shadow-sm hover:shadow-[0_0_20px_rgba(52,224,110,0.35)] cursor-pointer"
              >
                {c.labels.sidebarEnrollLabel}
              </Link>

              <a
                href="https://wa.me/41782273103"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer"
              >
                <RiWhatsappFill className="w-4 h-4 text-[#25D366]" />
                <span>{c.labels.sidebarWhatsappLabel}</span>
              </a>
            </div>

            {/* Specifications Rows */}
            <div className="border-t border-slate-100 pt-2 space-y-2.5 text-xs">
              <div className="flex justify-between items-center gap-3 py-1.5 border-b border-slate-50">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <TbClockHour4 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{c.labels.sidebarDurationLabel}</span>
                </span>
                <strong className="font-bold text-slate-900">{course.duration || '5 Weeks'}</strong>
              </div>

              <div className="flex justify-between items-center gap-3 py-1.5 border-b border-slate-50">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <RiCalendarEventLine className="w-3.5 h-3.5 text-slate-400" />
                  <span>{c.labels.sidebarIntakeLabel}</span>
                </span>
                <strong className="font-bold text-slate-900">
                  {schedule.startDate ? formatDate(schedule.startDate) : (isIndiaProgram ? '31/03/2026' : '04/01/2027')}
                </strong>
              </div>

              <div className="flex justify-between items-start gap-3 py-1.5 border-b border-slate-50">
                <span className="text-slate-500 flex items-center gap-1.5 pt-0.5">
                  <RiMapPin2Line className="w-3.5 h-3.5 text-slate-400" />
                  <span>{c.labels.sidebarLocationLabel}</span>
                </span>
                <strong className="font-bold text-slate-900 text-right max-w-[170px] leading-snug">
                  {course.location || (isIndiaProgram ? 'New Delhi' : 'Online 2 Weeks + 3 Weeks Onsite Sønderborg (Denmark)')}
                </strong>
              </div>

              <div className="flex justify-between items-center gap-3 py-1.5 border-b border-slate-50">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <RiStackLine className="w-3.5 h-3.5 text-slate-400" />
                  <span>{c.labels.sidebarDeliveryLabel}</span>
                </span>
                <strong className="font-bold text-slate-900">{schedule.mode || (isIndiaProgram ? 'Onsite' : 'Hybrid')}</strong>
              </div>

              <div className="flex justify-between items-center gap-3 py-1.5 border-b border-slate-50">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <RiShieldCheckFill className="w-3.5 h-3.5 text-slate-400" />
                  <span>{c.labels.sidebarStandardLabel}</span>
                </span>
                <strong className="font-bold text-slate-900">
                  {isIndiaProgram ? c.labels.sidebarStandardValueDgca : c.labels.sidebarStandardValueEasa}
                </strong>
              </div>

              <div className="flex justify-between items-center gap-3 py-1.5">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <TbCertificate className="w-3.5 h-3.5 text-slate-400" />
                  <span>{c.labels.sidebarCertificateLabel}</span>
                </span>
                <strong className="font-bold text-slate-900">{c.labels.sidebarCertificateValue}</strong>
              </div>
            </div>

            {/* Assistance Sub-Box */}
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 space-y-1.5 text-xs">
              <span className="font-bold text-slate-900 block">{c.labels.sidebarSupportTitle}</span>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                {c.labels.sidebarSupportDesc}
              </p>
              <a
                href="mailto:info@theifoa.com"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-800 hover:text-[#16a952] transition-colors pt-1"
              >
                <MdOutlineMail className="w-3.5 h-3.5 text-slate-500" />
                <span>info@theifoa.com</span>
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default CourseDetailView
