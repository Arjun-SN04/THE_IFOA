import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiArrowDownSLine,
  RiShareForwardLine,
  RiWhatsappFill,
  RiShieldCheckFill,
  RiCalendarEventLine,
  RiMapPin2Line,
  RiStackLine,
  RiCheckboxCircleFill,
  RiAddLine,
  RiSubtractLine,
  RiUserLine,
  RiCheckLine,
  RiFlightTakeoffLine,
  RiGlobalLine,
  RiCompass3Line,
  RiAwardLine,
  RiInformationLine
} from 'react-icons/ri'
import { TbClockHour4, TbCertificate, TbBook2 } from 'react-icons/tb'
import { HiArrowUpRight } from 'react-icons/hi2'
import { MdOutlineMail } from 'react-icons/md'

import { mergeContent } from '@/hooks/usePageContent'

// Assets
import { resolveCard } from '@/components/course/CourseCard'
import logoEasa from '@/assets/shared/standards-logos/logo-easa.webp'
import logoIcao from '@/assets/shared/standards-logos/logo-icao.webp'
import logoDgca from '@/assets/shared/standards-logos/logo-dgca.webp'
import logoFaa from '@/assets/shared/standards-logos/logo-faa.webp'
import imgDgr from '@/assets/services/02_dangerous_goods.webp'

const FALLBACK = {
  labels: {
    backLabel: 'All Intakes & Events',
    previewLabel: 'Preview Mode',
    refFallback: 'IFOA Training',
    easaBadge: 'EASA Compliant',
    dgcaBadge: 'DGCA & ICAO Aligned',
    shareLabel: 'Share',
    copiedLabel: 'Link Copied',
    eyebrowPrimary: 'Professional Aviation Training',
    eyebrowSecondary: 'Flight Dispatch Curriculum',
    easaComplianceBadge: 'EASA ORO.GEN.110 Aligned',
    dgcaComplianceBadge: 'DGCA & ICAO Aligned Training',
    faaComplianceBadge: 'FAA Part 65 Aligned',
    cbtaBadge: 'Competency-Based Training (CBTA)',
    applyOnlineLabel: 'Enroll in Programme',
    viewModulesLabel: 'Explore Curriculum',
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
    entryReqEyebrow: 'Admissions & Prerequisites',
    entryReqTitle: 'Entry Requirements',
    assessmentEyebrow: 'Evaluation',
    assessmentTitle: 'Assessment & Verification',
    certEyebrow: 'On Completion',
    certTitle: 'Official Certification',
    datesEyebrow: 'Schedule & Intakes',
    datesTitle: 'Upcoming Courses',
    faqEyebrow: 'Got Questions?',
    faqTitle: 'Frequently Asked Questions',
    admissionsEyebrow: 'Admissions Portal',
    admissionsTitle: 'Ready to Start Your Dispatch Career?',
    admissionsDesc: 'Reserve your seat for the upcoming training intake or connect directly with our admissions team.',
    admissionsApplyLabel: 'Apply Online ↗',
    admissionsWhatsappLabel: 'WhatsApp Admissions',
    sidebarAdmissionsOpenBadge: 'Admissions Open',
    sidebarOverviewLabel: 'Programme Overview',
    sidebarTuitionLabel: 'Training Fee',
    sidebarTuitionNote: 'Inclusive of official study materials & examination fee',
    sidebarEnrollLabel: 'Enroll Now - Apply Online ↗',
    sidebarWhatsappLabel: 'Inquire on WhatsApp',
    sidebarDurationLabel: 'Duration',
    sidebarIntakeLabel: 'Next Course',
    sidebarLocationLabel: 'Training Location',
    sidebarDeliveryLabel: 'Format',
    sidebarStandardLabel: 'Regulatory Standard',
    sidebarStandardValueEasa: 'EASA-Compliant',
    sidebarStandardValueDgca: 'DGCA / EASA Aligned',
    sidebarStandardValueFaa: 'FAA Part 65',
    sidebarCertificateLabel: 'Certificate Awarded',
    sidebarCertificateValue: 'IFOA Certificate',
    sidebarSupportTitle: 'Admissions Support',
    sidebarSupportDesc: 'Questions about eligibility, visa letters, or group bookings?'
  },
  curriculum: {
    eyebrow: 'Curriculum Framework',
    title: 'What the Flight Dispatch Programme Covers',
    subtitle: 'Structured around the core operational competencies required for airline dispatch worldwide.',
    phases: [
      {
        num: '01',
        label: 'PHASE 01',
        title: 'The Operating Environment',
        description: 'Establish foundational regulatory frameworks, airspace structure, and air traffic communication systems.',
        topics: [
          'Air Law & Civil Regulations',
          'ICAO / EASA Regulatory Alignment',
          'Air Traffic Management (ATM) & Airspace',
          'Aeronautical Communications & Radiotelephony'
        ]
      },
      {
        num: '02',
        label: 'PHASE 02',
        title: 'Know the Aircraft',
        description: 'Understand modern commercial aircraft systems, performance envelopes, limitations, and flight mechanics.',
        topics: [
          'Aircraft Systems & Avionics Architecture',
          'Flight Instrumentation & Navigation Suites',
          'Principles of Flight & Aerodynamics',
          'Aircraft Performance, Takeoff & Landing Limits'
        ]
      },
      {
        num: '03',
        label: 'PHASE 03',
        title: 'Plan the Flight',
        description: 'Master meteorological analysis, route construction, fuel calculations, and operational flight dispatch releases.',
        topics: [
          'Aviation Navigation, Airways & Enroute Charts',
          'Synoptic Aeronautical Meteorology & SIGMETs',
          'Mass & Balance Calculations and Trim Sheets',
          'Operational Flight Planning (OFP) & Dispatch Releases'
        ]
      },
      {
        num: '04',
        label: 'PHASE 04',
        title: 'Control the Operation',
        description: 'Execute live flight following, manage real-time deviations, and coordinate airline operational control.',
        topics: [
          'Live OCC Flight Monitoring & Tracking Systems',
          'Standard Operating Procedures & MEL/CDL Application',
          'Crew & Dispatch Human Factors & Crew Resource Management',
          'OCC Operational Coordination & Station Handling'
        ]
      },
      {
        num: '05',
        label: 'PHASE 05',
        title: 'Make the Decision',
        description: 'Apply tactical problem-solving during in-flight emergencies, weather diversions, and high-tempo simulator scenarios.',
        topics: [
          'Tactical Situational Awareness & Threat Management',
          'Risk Assessment & Operational Contingency Planning',
          'Collaborative Decision Making (CDM) in High Workload',
          'Complex Scenario Simulator Drills & Practical Briefings'
        ]
      }
    ]
  }
}

// null when no real date is set - callers fall back to the course's own
// intakeLabel (e.g. "[Next cohort start date]" or "Rolling Admissions")
// instead of a fake hardcoded date.
function formatDate(value, opts = { day: '2-digit', month: '2-digit', year: 'numeric' }) {
  if (!value) return null
  return new Date(value).toLocaleDateString('en-GB', opts)
}

// null when no real amount is set - callers show the course's own price.note
// (e.g. "Contact admissions for current tuition") instead of a fake number.
function formatPrice(price) {
  if (!price || price.amount == null) return null
  const symbol = price.currency === 'INR' ? '₹' : price.currency === 'EUR' ? '€' : '$'
  return `${symbol}${price.amount.toLocaleString('en-US')}`
}

export function CourseDetailView({ course, preview = false }) {
  const [copied, setCopied] = useState(false)
  const [activePhase, setActivePhase] = useState(0)
  const [activeRoleIdx, setActiveRoleIdx] = useState(0)
  const [activeSegmentIdx, setActiveSegmentIdx] = useState(0)

  const c = mergeContent(FALLBACK, course?.content?.courseDetail || {})

  if (!course) return null

  const { schedule = {} } = course
  const isIndiaProgram =
    course.slug?.includes('india') ||
    course.refCode?.includes('IPIN') ||
    course.title?.toLowerCase().includes('india')
  // Slug/refCode only - course.authority often *mentions* FAA on non-FAA
  // courses too (e.g. the EASA course's authority is "EASA / FAA Part 65
  // Standards" as a comparison), which caused false positives here.
  const isFaaProgram =
    !isIndiaProgram &&
    (course.slug?.includes('faa') ||
      course.slug?.includes('part-65') ||
      course.refCode?.toLowerCase().includes('faa'))

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

  // Role + operation segment explorer (Dangerous Goods only, for now) - the
  // same curriculum reads differently depending on who you are and whether
  // your operation carries DG at all, so this drives phase 04/05's copy below.
  const dgrExplorer =
    course.dgrExplorer?.roles?.length > 0 && course.dgrExplorer?.segments?.length > 0 ? course.dgrExplorer : null
  const activeExplorerRole = dgrExplorer?.roles[activeRoleIdx] || dgrExplorer?.roles[0]
  const activeExplorerSegment = dgrExplorer?.segments[activeSegmentIdx] || dgrExplorer?.segments[0]

  // 5 Phase curriculum structured for professional presentation
  const rawPhaseCurriculum = course.curriculum?.phases?.length
    ? course.curriculum.phases
    : c.curriculum?.phases?.length
      ? c.curriculum.phases
      : FALLBACK.curriculum.phases

  const phaseCurriculum = dgrExplorer
    ? rawPhaseCurriculum.map((phase) =>
      phase.adaptive === 'acceptance'
        ? { ...phase, description: activeExplorerSegment.acceptance || phase.description }
        : phase.adaptive === 'loading'
          ? { ...phase, description: activeExplorerSegment.loading || phase.description }
          : phase
    )
    : rawPhaseCurriculum

  const learningOutcomes = course.whatYouWillLearn?.points?.length
    ? course.whatYouWillLearn.points
    : [
      'Plan and prepare complex international flights according to ICAO / EASA standards',
      'Assess operational risks, NOTAMs, weather hazards, and aerodrome constraints',
      'Calculate precise fuel requirements, alternate selection, and payload limitations',
      'Monitor live flights in OCC environments and proactively anticipate disruptions',
      'Support safe operational decision-making in high-workload airline environments',
      'Apply EASA, ICAO, and operator Standard Operating Procedures (SOPs)'
    ]

  const audienceProfiles = (course.whoShouldAttend?.points || []).map((raw) => {
    const [title, ...rest] = raw.split(/ [ - –-] |: /)
    return rest.length ? { title, desc: rest.join(': ') } : { title: raw, desc: null }
  })

  const entryRequirements = course.entryRequirements?.points || []
  const assessmentPoints = course.certification?.points || []
  const certificationText = course.certification?.text || ''

  const activeIntakes = (course.intakes || []).filter((i) => i.isActive !== false)
  const upcomingDates = activeIntakes.length
    ? activeIntakes
    : schedule.startDate
      ? [{ label: course.intakeLabel || 'Upcoming Intake', startDate: schedule.startDate }]
      : []

  const isDgrCourse =
    course.category === 'dangerous-goods' ||
    course.category === 'dgr' ||
    course.slug?.includes('dangerous-goods') ||
    course.slug?.includes('dgr') ||
    course.title?.toLowerCase().includes('dangerous goods')

  const sidebarImgSrc =
    course.card?.image?.url ||
    (isDgrCourse && (!course.heroImage?.url || course.heroImage?.url?.includes('ground') || course.heroImage?.url?.includes('dispatcher'))
      ? imgDgr
      : course.heroImage?.url) ||
    resolveCard(course).image ||
    (isDgrCourse ? imgDgr : null)

  return (
    <div
      className={`w-full min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased selection:bg-[#34E06E] selection:text-slate-950 ${preview ? '' : 'pt-24 pb-16'
        }`}
      data-purpose="course-detail-view"
    >
      {/* Subtle top ambient glow */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-slate-100/60 via-[#eef4f9]/30 to-transparent pointer-events-none -z-10" />

      {/* ========================================================================= */}
      {/* MAIN TWO-COLUMN CONTAINER                                                 */}
      {/* ========================================================================= */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

          {/* ===================================================================== */}
          {/* LEFT CONTENT COLUMN (7.5 - 8 Cols)                                    */}
          {/* ===================================================================== */}
          <main className="lg:col-span-7 xl:col-span-8 min-w-0 space-y-12 sm:space-y-16 lg:space-y-20">

            {/* 1. HERO SECTION (Executive, Sleek & Clean) */}
            <section id="overview" className="space-y-7 sm:space-y-9">
              {/* Sleek Breadcrumb & Action Bar */}
              <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-slate-200/80">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 min-w-0">
                  <Link
                    to="/events"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-white transition-all text-xs font-semibold shadow-2xs group cursor-pointer shrink-0"
                  >
                    <RiArrowLeftLine className="w-3.5 h-3.5 text-slate-300 group-hover:text-white group-hover:-translate-x-0.5 transition-transform" />
                    <span>All Programmes</span>
                  </Link>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="hidden sm:inline-block text-xs font-mono font-bold uppercase tracking-wider text-slate-900 border-b-2 border-[#34E06E] pb-0.5">
                    Intake Open
                  </span>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950 bg-white hover:bg-slate-50 border border-slate-200/90 px-3 py-1.5 rounded-lg transition-all shadow-2xs cursor-pointer active:scale-95"
                  >
                    <RiShareForwardLine className="w-3.5 h-3.5 text-slate-500" />
                    <span>{copied ? c.labels.copiedLabel : c.labels.shareLabel}</span>
                  </button>
                </div>
              </div>

              {/* Title & Authoritative Headline */}
              <div className="space-y-3">
                {course.eyebrow && (
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#16a952] block">
                    {course.eyebrow}
                  </span>
                )}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-extrabold text-slate-950 tracking-tight leading-[1.14] [text-wrap:balance]">
                  {course.title || 'Flight Dispatcher Initial Certification'}
                </h1>

                {/* Summary Copy */}
                <p className="text-sm sm:text-base md:text-[16px] text-slate-600 font-normal leading-relaxed max-w-3xl">
                  {course.summary ||
                    `A complete ${course.duration || '5-week'} ${isIndiaProgram ? 'DGCA & ICAO' : 'EASA'}-aligned licensing curriculum designed to build technical mastery, situational awareness, and operational command for modern airline operations.`}
                </p>

                {/* Optional single-point clarifying callout */}
                {course.heroNote && (
                  <div className="flex items-start gap-2.5 bg-emerald-50/80 border border-emerald-200/80 rounded-xl px-4 py-3 max-w-2xl">
                    <RiInformationLine className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-emerald-900 leading-relaxed font-medium">
                      {course.heroNote}
                    </span>
                  </div>
                )}
              </div>

              {/* Badges & Regulatory Alignment Strip */}
              {course.badges?.length > 0 ? (
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-0.5">
                  {course.badges.map((badge, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-semibold shadow-2xs"
                    >
                      <RiShieldCheckFill className="w-3.5 h-3.5 text-[#34E06E] shrink-0" />
                      <span className="font-mono tracking-tight">{badge}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-0.5">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-semibold shadow-2xs">
                    <RiShieldCheckFill className="w-4 h-4 text-[#34E06E] shrink-0" />
                    <span className="font-mono tracking-tight font-bold">
                      {isIndiaProgram
                        ? c.labels.dgcaComplianceBadge
                        : isFaaProgram
                          ? c.labels.faaComplianceBadge
                          : c.labels.easaComplianceBadge}
                    </span>
                  </div>
                  {!isFaaProgram && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-semibold shadow-2xs">
                      <RiGlobalLine className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono tracking-tight">ICAO Standard Aligned</span>
                    </div>
                  )}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-semibold shadow-2xs">
                    <RiAwardLine className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono tracking-tight">{c.labels.cbtaBadge}</span>
                  </div>
                </div>
              )}

              {/* Trust Stat Row - shown when admin sets one */}
              {course.trustStat && (
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="text-xs sm:text-sm text-slate-600 font-medium">{course.trustStat}</span>
                </div>
              )}

              {/* Primary Action Area (Clean & Balanced on Mobile & Desktop) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1 w-full max-w-lg sm:max-w-none">
                {course.isCorporate ? (
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2.5 bg-[#34E06E] hover:bg-[#2fe069] active:bg-[#28c85e] text-slate-950 font-bold px-6 py-3.5 rounded-xl text-xs sm:text-sm tracking-wide transition-all duration-150 shadow-xs hover:shadow-md active:scale-[0.98] group cursor-pointer text-center w-full sm:w-auto"
                  >
                    <span>{course.ctaLabel || 'Request a Corporate Quote'}</span>
                    <HiArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                ) : (
                  <Link
                    to={`/courses/${course.slug}/enroll`}
                    className="inline-flex items-center justify-center gap-2.5 bg-[#34E06E] hover:bg-[#2fe069] active:bg-[#28c85e] text-slate-950 font-bold px-6 py-3.5 rounded-xl text-xs sm:text-sm tracking-wide transition-all duration-150 shadow-xs hover:shadow-md active:scale-[0.98] group cursor-pointer text-center w-full sm:w-auto"
                  >
                    <span>{c.labels.applyOnlineLabel}</span>
                    <HiArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                )}

                <a
                  href="#modules"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-900 hover:text-white border border-slate-300/90 hover:border-slate-900 text-slate-800 font-semibold px-5 py-3.5 rounded-xl text-xs sm:text-sm transition-all duration-150 shadow-2xs group cursor-pointer text-center w-full sm:w-auto"
                >
                  <TbBook2 className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                  <span>{c.labels.viewModulesLabel}</span>
                </a>
              </div>
            </section>

            {/* 2B. ROLE + OPERATION EXPLORER (Dangerous Goods only - dgrExplorer set) */}
            {dgrExplorer && (
              <section className="space-y-8">
                {/* Step 1 - Role */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#16a952] block">
                      Step 1 - Your Role
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
                      What do you actually deal with?
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {dgrExplorer.roles.map((role, idx) => {
                      const isSel = activeRoleIdx === idx
                      return (
                        <button
                          key={role.code || idx}
                          type="button"
                          onClick={() => setActiveRoleIdx(idx)}
                          className={`text-left rounded-2xl border-2 p-4 transition-colors cursor-pointer ${isSel ? 'bg-emerald-50/80 border-emerald-500' : 'bg-white border-slate-200/90 hover:border-slate-300'
                            }`}
                        >
                          {role.code && (
                            <div
                              className={`text-[11px] font-mono font-bold uppercase tracking-wider mb-1 ${isSel ? 'text-emerald-700' : 'text-slate-500'
                                }`}
                            >
                              Category {role.code}
                            </div>
                          )}
                          <div className="text-base font-bold text-slate-950">{role.title}</div>
                        </button>
                      )
                    })}
                  </div>

                  {activeExplorerRole?.scenarios?.length > 0 && (
                    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
                      <div className="text-xs font-bold text-[#0A5E39] uppercase tracking-wider mb-3">
                        What {activeExplorerRole.title} actually deal with
                      </div>
                      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
                        {activeExplorerRole.scenarios.map((s, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed">
                            <span className="text-[#0E7A4B] font-bold shrink-0">&rsaquo;</span>
                            <span>{s}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Step 2 - Operation segment */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#16a952] block">
                      Step 2 - Your Operation
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
                      No-carry isn't a shorter carry course
                    </h2>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {dgrExplorer.segments.map((segment, idx) => {
                      const isSel = activeSegmentIdx === idx
                      return (
                        <button
                          key={segment.id || idx}
                          type="button"
                          onClick={() => setActiveSegmentIdx(idx)}
                          className={`px-4 py-2.5 rounded-full border-2 text-sm font-bold transition-colors cursor-pointer ${isSel
                              ? 'bg-emerald-50/80 border-emerald-500 text-[#0A5E39]'
                              : 'bg-white border-slate-200/90 text-slate-600 hover:border-slate-300'
                            }`}
                        >
                          {segment.title}
                        </button>
                      )
                    })}
                  </div>

                  {activeExplorerSegment?.descriptor && (
                    <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl px-4 py-3.5 text-sm text-emerald-900 font-medium leading-relaxed">
                      {activeExplorerSegment.descriptor}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* 3. CURRICULUM FRAMEWORK & INTERACTIVE PHASE EXPLORER (EXPANDS ON HOVER & CLICK) */}
            <section id="modules" className="space-y-6 sm:space-y-7 scroll-mt-16">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3.5 border-b border-slate-200/80">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#16a952] block">
                    {course.curriculum?.eyebrow || c.curriculum.eyebrow}
                  </span>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-950 tracking-tight">
                    {course.curriculum?.title || c.curriculum.title}
                  </h2>
                  {dgrExplorer && (
                    <p className="text-xs sm:text-sm text-emerald-700 font-semibold">
                      Adapted to {activeExplorerSegment.title}
                    </p>
                  )}
                </div>
                {(course.curriculum?.subtitle || c.curriculum.subtitle) && (
                  <p className="text-xs sm:text-sm text-slate-500 max-w-sm sm:text-right font-normal">
                    {course.curriculum?.subtitle || c.curriculum.subtitle}
                  </p>
                )}
              </div>

              {phaseCurriculum.length <= 5 ? (
                <>
                  {/* Desktop / Tablet: Expanding Strips Accordion (GPU-Accelerated Layout, Zero Ghosting) */}
                  <div className="hidden md:flex flex-row items-stretch gap-3 w-full h-[510px]">
                    {phaseCurriculum.map((phase, idx) => {
                      const isActive = activePhase === idx
                      const phaseNum = phase.num || (idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`)
                      const totalPhases = phaseCurriculum.length < 10 ? `0${phaseCurriculum.length}` : `${phaseCurriculum.length}`

                      return (
                        <motion.div
                          key={phase.num || idx}
                          layout
                          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                          onMouseEnter={() => setActivePhase(idx)}
                          onClick={() => setActivePhase(idx)}
                          className={`relative h-full rounded-3xl border overflow-hidden cursor-pointer select-none ${isActive
                              ? 'flex-[4] min-w-[340px] bg-white border-slate-200/90 shadow-sm p-6 sm:p-7 flex flex-col justify-between'
                              : 'flex-[0.6] min-w-[56px] max-w-[80px] bg-white/70 hover:bg-white hover:border-slate-300 border-slate-200/90 shadow-2xs p-3 py-6 flex flex-col items-center justify-between'
                            }`}
                        >
                          {isActive ? (
                            <motion.div
                              key="active-pane"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.12 }}
                              className="flex flex-col justify-between h-full w-full"
                            >
                              <div className="space-y-4">
                                {/* Top Header Row */}
                                <div className="flex items-center justify-between gap-3">
                                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-950 text-white shadow-2xs shrink-0">
                                    <span className="w-5 h-5 rounded-md bg-white/20 text-white font-mono font-bold text-[10px] flex items-center justify-center">
                                      {phaseNum}
                                    </span>
                                    <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-200">
                                      PHASE
                                    </span>
                                  </div>

                                  <span className="text-[11px] font-mono font-bold tracking-wider text-slate-950 uppercase relative pb-1 border-b-2 border-[#34E06E] shrink-0 select-none">
                                    ACTIVE PHASE
                                  </span>
                                </div>

                                {/* Phase Title & Subtitle */}
                                <div className="space-y-1">
                                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                                    {phase.title}
                                  </h3>
                                  <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
                                    {phase.description || 'Key operational competencies and syllabus objectives:'}
                                  </p>
                                </div>

                                {/* Syllabus Topics */}
                                {phase.topics?.length > 0 ? (
                                  <div className="space-y-2.5 pt-1">
                                    {phase.topics.map((topic, topicIdx) => (
                                      <div
                                        key={topicIdx}
                                        className="p-3.5 px-4 rounded-xl bg-slate-50/70 border border-slate-200/70 hover:border-slate-300 hover:bg-slate-50/90 transition-all flex items-center gap-3 group shadow-2xs"
                                      >
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 group-hover:bg-[#34E06E] transition-colors shrink-0" />
                                        <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                                          {topic}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 text-sm text-slate-700">
                                    {phase.description}
                                  </div>
                                )}
                              </div>

                              {/* Footer Row */}
                              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono font-medium text-slate-400 select-none">
                                <span>
                                  Phase {phaseNum} of {totalPhases}
                                </span>
                                <span>IFOA Training Standard</span>
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="collapsed-pane"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.12 }}
                              className="flex flex-col items-center justify-between h-full w-full"
                            >
                              {/* Top Number Box */}
                              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-slate-200/90 bg-white flex items-center justify-center text-slate-700 font-mono text-xs font-bold shadow-2xs shrink-0">
                                {phaseNum}
                              </div>

                              {/* Vertical Rotated Title */}
                              <div className="flex-1 flex items-center justify-center my-4 overflow-hidden w-full">
                                <span className="text-xs sm:text-sm font-semibold text-slate-600 whitespace-nowrap [writing-mode:vertical-rl] rotate-180 tracking-wide text-center">
                                  {phase.title}
                                </span>
                              </div>

                              {/* Bottom Number */}
                              <div className="text-xs font-mono font-bold text-slate-400 shrink-0">
                                {phaseNum}
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                      )
                    })}
                  </div>

                  {/* Mobile Accordion Stack (< md viewports) */}
                  <div className="md:hidden space-y-3">
                    {phaseCurriculum.map((phase, idx) => {
                      const isActive = activePhase === idx
                      const phaseNum = phase.num || (idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`)
                      const totalPhases = phaseCurriculum.length < 10 ? `0${phaseCurriculum.length}` : `${phaseCurriculum.length}`

                      return (
                        <div
                          key={phase.num || idx}
                          onClick={() => setActivePhase(isActive ? -1 : idx)}
                          className={`rounded-2xl border transition-all duration-300 p-4 cursor-pointer overflow-hidden ${isActive
                              ? 'bg-white border-slate-300 shadow-sm'
                              : 'bg-white/80 border-slate-200/80 hover:bg-white'
                            }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="w-7 h-7 rounded-lg bg-slate-950 text-white font-mono font-bold text-xs grid place-items-center shadow-2xs">
                                {phaseNum}
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
                                <div className="mt-3 pt-3 border-t border-slate-100 space-y-3">
                                  {phase.description && (
                                    <p className="text-xs text-slate-600 font-normal leading-relaxed">
                                      {phase.description}
                                    </p>
                                  )}
                                  {phase.topics?.length > 0 && (
                                    <div className="space-y-2">
                                      {phase.topics.map((t, topicIdx) => (
                                        <div
                                          key={topicIdx}
                                          className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5"
                                        >
                                          <span className="w-1.5 h-1.5 rounded-full bg-[#34E06E] shrink-0" />
                                          <span>{t}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-400">
                                    <span>Phase {phaseNum} of {totalPhases}</span>
                                    <span>IFOA Standard</span>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )
                    })}
                  </div>
                </>
              ) : (
                /* Vertical Accordion Stack for Comprehensive Multi-Module Courses (>5 modules) */
                <div className="space-y-3 w-full">
                  {phaseCurriculum.map((phase, idx) => {
                    const isActive = activePhase === idx
                    const phaseNum = phase.num || (idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`)
                    const totalPhases = phaseCurriculum.length < 10 ? `0${phaseCurriculum.length}` : `${phaseCurriculum.length}`

                    return (
                      <div
                        key={phase.num || idx}
                        onClick={() => setActivePhase(isActive ? -1 : idx)}
                        onMouseEnter={() => setActivePhase(idx)}
                        className={`rounded-2xl border transition-all duration-300 p-4 sm:p-5 cursor-pointer overflow-hidden ${isActive
                            ? 'bg-white border-slate-300 shadow-sm'
                            : 'bg-white/80 border-slate-200/80 hover:bg-white hover:border-slate-300'
                          }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-slate-950 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                              {phaseNum}
                            </span>
                            <span className="font-bold text-sm sm:text-base text-slate-900">{phase.title}</span>
                            {phase.adaptive && dgrExplorer && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0">
                                Adapted
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            {isActive && (
                              <span className="hidden sm:inline-block text-[10px] font-mono font-bold tracking-wider text-slate-950 uppercase relative pb-0.5 border-b-2 border-[#34E06E]">
                                ACTIVE MODULE
                              </span>
                            )}
                            <motion.span
                              animate={{ rotate: isActive ? 180 : 0 }}
                              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                              className="text-slate-500 flex items-center justify-center"
                            >
                              <RiArrowDownSLine className="w-5 h-5" />
                            </motion.span>
                          </div>
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
                              <div className="mt-4 pt-4 border-t border-slate-100 space-y-3.5">
                                {phase.description && (
                                  <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                                    {phase.description}
                                  </p>
                                )}
                                {phase.topics?.length > 0 && (
                                  <div className="space-y-2">
                                    {phase.topics.map((t, topicIdx) => (
                                      <div
                                        key={topicIdx}
                                        className="text-xs sm:text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5"
                                      >
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#34E06E] shrink-0" />
                                        <span>{t}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-400">
                                  <span>Module {phaseNum} of {totalPhases}</span>
                                  <span>IFOA Training Standard</span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>

            {/* 4. OPERATIONAL COMPETENCIES */}
            <section className="rounded-3xl bg-white border border-slate-200/90 p-7 sm:p-8 lg:p-9 shadow-xs space-y-6 sm:space-y-7">
              <div className="space-y-1.5">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#16a952] block">
                  {course.whatYouWillLearn?.eyebrow || c.labels.outcomesEyebrow}
                </span>
                <h2 className="text-xl sm:text-2xl lg:text-[26px] font-bold text-slate-950 tracking-tight">
                  {course.whatYouWillLearn?.title || c.labels.outcomesTitle}
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {learningOutcomes.map((point, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/60 border border-slate-100/90 hover:bg-slate-50 hover:border-slate-200 transition-colors text-xs sm:text-sm text-slate-800 leading-snug"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                      <RiCheckLine className="w-3.5 h-3.5 stroke-[1.5]" />
                    </div>
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              {/* Process Steps Flow Banner (e.g. IDENTIFY THE OPERATION → APPLY THE CORRECT FTL RULE → CHECK LIMITS → CONSIDER FATIGUE RISK) */}
              {course.processSteps?.length > 0 && (
                <div className="pt-2">
                  <div className="rounded-xl sm:rounded-2xl bg-[#E8F8F0] py-3.5 px-4 sm:px-6 flex flex-wrap items-center justify-center gap-x-2.5 sm:gap-x-4 gap-y-2 text-center">
                    {course.processSteps.map((step, idx) => (
                      <React.Fragment key={idx}>
                        <span className="text-[11px] sm:text-xs font-bold sm:font-extrabold uppercase tracking-wider text-[#085A3C]">
                          {step}
                        </span>
                        {idx < course.processSteps.length - 1 && (
                          <span className="text-xs sm:text-sm text-[#085A3C]/70 font-semibold select-none">
                            →
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* 5. REGULATORY & TRAINING FRAMEWORK (Sleek Dark Aviation Panel) */}
            <section className="rounded-3xl bg-gradient-to-br from-slate-950 via-[#0a1120] to-[#040814] text-white p-8 sm:p-9 lg:p-10 shadow-md border border-slate-800 space-y-6 sm:space-y-7 relative overflow-hidden">
              <div className="space-y-1.5">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#34E06E] block">
                  {course.trainingStandards?.eyebrow || c.labels.complianceEyebrow}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {course.trainingStandards?.title ||
                    (isIndiaProgram
                      ? c.labels.complianceTitleDgca
                      : isFaaProgram
                        ? c.labels.complianceTitleFaa
                        : c.labels.complianceTitleEasa)}
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed max-w-2xl">
                {course.trainingStandards?.intro ||
                  'This curriculum meets rigorous international civil aviation standards, structured in full compliance with applicable EASA Air Operations requirements and ICAO Flight Operations Officer competencies.'}
              </p>

              {course.trainingStandards?.cards?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {course.trainingStandards.cards.map((card, idx) => (
                    <div
                      key={idx}
                      className="p-4.5 rounded-xl bg-white/[0.05] border border-white/10 hover:border-white/20 transition-colors space-y-1.5"
                    >
                      <div className="text-sm font-mono font-bold text-[#34E06E]">
                        {card.code}
                      </div>
                      <p className="text-xs text-slate-300 font-normal leading-relaxed">
                        {card.title}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                  <div className="flex items-center gap-3.5 p-4 rounded-xl bg-white/[0.05] border border-white/10 hover:border-white/20 transition-colors">
                    <div className="h-10 w-14 bg-white rounded-lg flex items-center justify-center p-1.5 shrink-0 shadow-xs">
                      <img
                        src={isIndiaProgram ? logoDgca : isFaaProgram ? logoFaa : logoEasa}
                        alt={isIndiaProgram ? 'DGCA' : isFaaProgram ? 'FAA' : 'EASA'}
                        className="max-h-7 max-w-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-white leading-tight">
                        {isIndiaProgram ? 'DGCA CAR Compliant' : isFaaProgram ? c.labels.complianceTag1Faa : 'EASA ORO.GEN.110'}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {isIndiaProgram
                          ? c.labels.complianceTag1Dgca
                          : isFaaProgram
                            ? 'Aircraft Dispatcher Certification'
                            : 'Air Operations Specification'}
                      </div>
                    </div>
                  </div>

                  {isFaaProgram ? (
                    <div className="flex items-center gap-3.5 p-4 rounded-xl bg-white/[0.05] border border-white/10 hover:border-white/20 transition-colors">
                      <div className="h-10 w-14 bg-white rounded-lg flex items-center justify-center p-1.5 shrink-0 shadow-xs">
                        <TbCertificate className="w-6 h-6 text-slate-700" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-white leading-tight">AC 65-34A</div>
                        <div className="text-[11px] text-slate-400 font-mono">Training Framework</div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3.5 p-4 rounded-xl bg-white/[0.05] border border-white/10 hover:border-white/20 transition-colors">
                      <div className="h-10 w-14 bg-white rounded-lg flex items-center justify-center p-1.5 shrink-0 shadow-xs">
                        <img src={logoIcao} alt="ICAO" className="max-h-7 max-w-full object-contain" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-white leading-tight">ICAO Doc 10106</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          FOO / Dispatch Competency
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* TRAINING PHILOSOPHY */}
            {course.trainingPhilosophy?.title && (
              <section className="rounded-3xl bg-white border border-slate-200/90 p-7 sm:p-8 lg:p-9 shadow-xs space-y-6 sm:space-y-7">
                <div className="space-y-1.5">
                  {course.trainingPhilosophy.eyebrow && (
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#16a952] block">
                      {course.trainingPhilosophy.eyebrow}
                    </span>
                  )}
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                    {course.trainingPhilosophy.title}
                  </h2>
                  {course.trainingPhilosophy.intro && (
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                      {course.trainingPhilosophy.intro}
                    </p>
                  )}
                </div>

                {course.trainingPhilosophy.cards?.length > 0 && (
                  <div className="grid sm:grid-cols-3 gap-3.5">
                    {course.trainingPhilosophy.cards.map((card, idx) => (
                      <div key={idx} className="p-4.5 rounded-xl bg-slate-50/70 border border-slate-100 space-y-1.5">
                        <div className="text-sm font-bold text-slate-900">{card.title}</div>
                        <p className="text-xs text-slate-600 leading-relaxed">{card.desc}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* 6. WHO SHOULD ATTEND (Audience Profile) */}
            <section className="rounded-3xl bg-white border border-slate-200/90 p-7 sm:p-8 lg:p-9 shadow-xs space-y-6 sm:space-y-7">
              <div className="border-b border-slate-100 pb-3.5 space-y-1">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#16a952] block">
                  {course.whoShouldAttend?.eyebrow || c.labels.eligibilityEyebrow}
                </span>
                <h2 className="text-xl font-bold text-slate-950 tracking-tight">
                  {course.whoShouldAttend?.title || c.labels.eligibilityTitle}
                </h2>
              </div>

              {course.whoShouldAttend?.intro && (
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200/80 text-xs sm:text-sm font-bold text-emerald-900">
                  <RiCheckboxCircleFill className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{course.whoShouldAttend.intro}</span>
                </div>
              )}

              {audienceProfiles.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {audienceProfiles.map((item, idx) => {
                    const isLastOdd = audienceProfiles.length % 2 === 1 && idx === audienceProfiles.length - 1
                    return item.desc ? (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 hover:border-slate-300 transition-colors space-y-1.5 ${
                          isLastOdd ? 'sm:col-span-2 sm:w-[calc(50%-0.375rem)] sm:mx-auto w-full' : ''
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                          <RiUserLine className="w-4 h-4" />
                        </div>
                        <div className="text-sm font-bold text-slate-900">{item.title}</div>
                        <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                      </div>
                    ) : (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70 flex items-center gap-2.5 text-xs sm:text-sm text-slate-800 leading-snug font-medium ${
                          isLastOdd ? 'sm:col-span-2 sm:w-[calc(50%-0.375rem)] sm:mx-auto w-full' : ''
                        }`}
                      >
                        <RiCheckboxCircleFill className="w-4 h-4 text-[#16a952] shrink-0" />
                        <span>{item.title}</span>
                      </div>
                    )
                  })}
                </div>
              )}

              {course.whoShouldAttend?.outro && (
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed pt-1 border-t border-slate-100">
                  {course.whoShouldAttend.outro}
                </p>
              )}
            </section>

            {/* 7. ENTRY REQUIREMENTS */}
            {entryRequirements.length > 0 && (
              <section className="rounded-3xl bg-white border border-slate-200/90 p-7 sm:p-8 lg:p-9 shadow-xs space-y-5 sm:space-y-6">
                <div className="space-y-1.5">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#16a952] block">
                    {c.labels.entryReqEyebrow}
                  </span>
                  <h2 className="text-xl font-bold text-slate-950 tracking-tight">{c.labels.entryReqTitle}</h2>
                  {course.entryRequirements?.intro && (
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed pt-1">
                      {course.entryRequirements.intro}
                    </p>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-3.5">
                  {entryRequirements.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700 leading-snug">
                      <RiCheckboxCircleFill className="w-4 h-4 text-[#16a952] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 8 & 9. ASSESSMENT & CERTIFICATION */}
            {(assessmentPoints.length > 0 || certificationText) && (
              <section className="grid sm:grid-cols-2 gap-6 sm:gap-7">
                {assessmentPoints.length > 0 && (
                  <div className="rounded-3xl bg-white border border-slate-200/90 p-7 sm:p-8 shadow-xs space-y-4">
                    <div className="space-y-1.5">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#16a952] block">
                        {c.labels.assessmentEyebrow}
                      </span>
                      <h2 className="text-lg font-bold text-slate-950 tracking-tight">{c.labels.assessmentTitle}</h2>
                    </div>
                    <div className="space-y-2.5">
                      {assessmentPoints.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-snug">
                          <RiCheckboxCircleFill className="w-4 h-4 text-[#16a952] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {certificationText && (
                  <div className="rounded-3xl bg-white border border-slate-200/90 p-7 sm:p-8 shadow-xs space-y-4">
                    <div className="space-y-1.5">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#16a952] block">
                        {c.labels.certEyebrow}
                      </span>
                      <h2 className="text-lg font-bold text-slate-950 tracking-tight">{c.labels.certTitle}</h2>
                    </div>
                    <div className="flex items-start gap-3.5 p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
                      <TbCertificate className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">{certificationText}</p>
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* 10. UPCOMING INTAKES / DATES (Only if not corporate) */}
            {!course.isCorporate && upcomingDates.length > 0 && (
              <section className="rounded-3xl bg-white border border-slate-200/90 p-7 sm:p-8 lg:p-9 shadow-xs space-y-5 sm:space-y-6">
                <div className="space-y-1.5">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#16a952] block">
                    {c.labels.datesEyebrow}
                  </span>
                  <h2 className="text-xl font-bold text-slate-950 tracking-tight">{c.labels.datesTitle}</h2>
                </div>
                <div className="space-y-3">
                  {upcomingDates.map((intake, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-3 p-4.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center justify-center shadow-2xs">
                          <RiCalendarEventLine className="w-4 h-4 text-slate-500" />
                        </div>
                        <div>
                          <span className="text-xs sm:text-sm font-bold text-slate-900 block">{intake.label}</span>
                          <span className="text-[11px] text-slate-500">Live Intake Confirmation</span>
                        </div>
                      </div>
                      {intake.startDate && (
                        <div className="text-right">
                          <span className="text-xs sm:text-sm font-extrabold text-slate-950 font-mono block">
                            {formatDate(intake.startDate)}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider">Seats Open</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 12. BOTTOM CALLOUT BANNER */}
            <section
              id="quote"
              className="rounded-3xl bg-gradient-to-br from-slate-950 via-[#0a1220] to-slate-950 text-white p-7 sm:p-9 border border-slate-800 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 max-w-md">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#34E06E] block">
                  {course.bottomBanner?.eyebrow || c.labels.admissionsEyebrow}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
                  {course.bottomBanner?.title || c.labels.admissionsTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                  {course.bottomBanner?.desc || c.labels.admissionsDesc}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                {course.isCorporate ? (
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 bg-[#34E06E] hover:bg-[#28c85e] text-slate-950 font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider transition-all duration-150 shadow-sm hover:shadow-md cursor-pointer"
                  >
                    <span>{course.bottomBanner?.ctaLabel || 'Request a Corporate Quote'}</span>
                  </Link>
                ) : (
                  <Link
                    to={`/courses/${course.slug}/enroll`}
                    className="inline-flex items-center justify-center gap-2 bg-[#34E06E] hover:bg-[#28c85e] text-slate-950 font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider transition-all duration-150 shadow-sm hover:shadow-md cursor-pointer"
                  >
                    <span>{c.labels.admissionsApplyLabel}</span>
                  </Link>
                )}

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
          {/* RIGHT STICKY SIDEBAR (Executive Overview Panel) (4.5 Cols)             */}
          {/* ===================================================================== */}
          <aside
            className="lg:col-span-5 xl:col-span-4 sticky top-24 bg-white text-slate-900 border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-6"
            aria-label="Programme overview"
          >
            {/* Top Course Card Thumbnail */}
            <div className="relative aspect-[16/10] -mx-6 -mt-6 rounded-t-3xl overflow-hidden bg-slate-950 select-none border-b border-slate-100">
              <img
                src={sidebarImgSrc}
                alt={course.title}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Header & Price / Rate Display */}
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#16a952] pb-1 border-b-2 border-[#34E06E] inline-block">
                {course.isCorporate ? (course.rateCard?.eyebrow || 'CORPORATE TRAINING') : c.labels.sidebarOverviewLabel}
              </span>

              <div className="pt-3.5 pb-1">
                {course.isCorporate ? (
                  <>
                    <strong className="block text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight leading-tight">
                      {course.rateCard?.value && course.rateCard.value !== 'Corporate Rate' ? course.rateCard.value : 'Training Fee'}
                    </strong>
                    <p className="text-xs text-slate-600 font-normal mt-2 leading-relaxed">
                      {course.rateCard?.note ||
                        "Custom quote, based on group size and delivery format, tailored to the operator's operational environment."}
                    </p>
                  </>
                ) : (
                  <>
                    <span className="block text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                      {c.labels.sidebarTuitionLabel}
                    </span>
                    <strong className="block text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight mt-0.5">
                      {formatPrice(course.price) || 'Contact for Pricing'}
                    </strong>
                    <small className="block text-xs text-slate-500 font-normal mt-1 leading-relaxed">
                      {course.price?.note ||
                        (formatPrice(course.price)
                          ? isIndiaProgram
                            ? '+ 18% GST / Track · Inclusive of official materials'
                            : 'Inclusive of official study materials & exam certification'
                          : 'Contact admissions for current tuition')}
                    </small>
                  </>
                )}
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-2.5">
              {course.isCorporate ? (
                <>
                  <Link
                    to="/contact"
                    className="w-full block text-center bg-[#34E06E] hover:bg-[#28c85e] text-slate-950 font-extrabold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all duration-150 shadow-xs hover:shadow-md cursor-pointer"
                  >
                    {course.ctaLabel || 'Request a Corporate Quote'}
                  </Link>

                  <Link
                    to="/contact"
                    className="w-full block text-center bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    {course.rateCard?.secondaryCtaLabel || 'Contact Training Team'}
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to={`/courses/${course.slug}/enroll`}
                    className="w-full block text-center bg-[#34E06E] hover:bg-[#28c85e] text-slate-950 font-extrabold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all duration-150 shadow-xs hover:shadow-md cursor-pointer"
                  >
                    {c.labels.sidebarEnrollLabel}
                  </Link>

                  <a
                    href="https://wa.me/41782273103"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 text-slate-800 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    <RiWhatsappFill className="w-4 h-4 text-[#25D366]" />
                    <span>{c.labels.sidebarWhatsappLabel}</span>
                  </a>
                </>
              )}
            </div>

            {/* Specifications Rows */}
            {course.sidebarSpecs?.length > 0 ? (
              <div className="border-t border-slate-100 pt-3 space-y-2.5 text-xs sm:text-[13px]">
                {course.sidebarSpecs.map((spec, idx) => (
                  <div key={idx} className="flex justify-between items-center gap-4 py-1.5 border-b border-slate-100/70">
                    <span className="text-slate-500 font-medium">{spec.label}</span>
                    <strong className="font-bold text-slate-950 text-right">{spec.value}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-t border-slate-100 pt-3 space-y-3 text-xs sm:text-[13px]">
                <div className="flex justify-between items-center gap-4 py-1.5 border-b border-slate-100/70">
                  <span className="text-slate-500 font-medium flex items-center gap-2 shrink-0">
                    <TbClockHour4 className="w-4 h-4 text-slate-400" />
                    <span>{c.labels.sidebarDurationLabel}</span>
                  </span>
                  <strong className="font-bold text-slate-950 text-right">{course.duration || '5 Weeks'}</strong>
                </div>

                <div className="flex justify-between items-center gap-4 py-1.5 border-b border-slate-100/70">
                  <span className="text-slate-500 font-medium flex items-center gap-2 shrink-0">
                    <RiCalendarEventLine className="w-4 h-4 text-slate-400" />
                    <span>{c.labels.sidebarIntakeLabel}</span>
                  </span>
                  <strong className="font-bold text-slate-950 font-mono text-right">
                    {formatDate(schedule.startDate) || course.intakeLabel || 'Contact for dates'}
                  </strong>
                </div>

                <div className="flex justify-between items-start gap-4 py-1.5 border-b border-slate-100/70">
                  <span className="text-slate-500 font-medium flex items-center gap-2 shrink-0 pt-0.5">
                    <RiMapPin2Line className="w-4 h-4 text-slate-400" />
                    <span>{c.labels.sidebarLocationLabel}</span>
                  </span>
                  <strong className="font-bold text-slate-950 text-right leading-snug">
                    {course.location || (isIndiaProgram ? 'New Delhi' : 'Online 2 Weeks + 3 Weeks Onsite Sønderborg (Denmark)')}
                  </strong>
                </div>

                <div className="flex justify-between items-center gap-4 py-1.5 border-b border-slate-100/70">
                  <span className="text-slate-500 font-medium flex items-center gap-2 shrink-0">
                    <RiStackLine className="w-4 h-4 text-slate-400" />
                    <span>{c.labels.sidebarDeliveryLabel}</span>
                  </span>
                  <strong className="font-bold text-slate-950 text-right">{schedule.mode || (isIndiaProgram ? 'Onsite' : 'Hybrid')}</strong>
                </div>

                <div className="flex justify-between items-center gap-4 py-1.5 border-b border-slate-100/70">
                  <span className="text-slate-500 font-medium flex items-center gap-2 shrink-0">
                    <RiShieldCheckFill className="w-4 h-4 text-slate-400" />
                    <span>{c.labels.sidebarStandardLabel}</span>
                  </span>
                  <strong className="font-bold text-slate-950 text-right">
                    {isIndiaProgram
                      ? c.labels.sidebarStandardValueDgca
                      : isFaaProgram
                        ? c.labels.sidebarStandardValueFaa
                        : c.labels.sidebarStandardValueEasa}
                  </strong>
                </div>

                <div className="flex justify-between items-center gap-4 py-1.5">
                  <span className="text-slate-500 font-medium flex items-center gap-2 shrink-0">
                    <TbCertificate className="w-4 h-4 text-slate-400" />
                    <span>{c.labels.sidebarCertificateLabel}</span>
                  </span>
                  <strong className="font-bold text-slate-950 text-right">{c.labels.sidebarCertificateValue}</strong>
                </div>
              </div>
            )}

            {/* Trust Badge at bottom of sidebar */}
            {course.isCorporate && (
              <div className="rounded-xl bg-emerald-50/90 text-emerald-900 border border-emerald-200/90 p-3 text-center text-xs font-bold">
                {course.rateCard?.trustBadge || 'Delivered to 70+ operators worldwide'}
              </div>
            )}

            {/* Additional Certification Costs */}
            {course.additionalCosts?.items?.length > 0 && (
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 space-y-2 text-xs">
                {course.additionalCosts.intro && (
                  <span className="font-bold text-slate-900 block">{course.additionalCosts.intro}</span>
                )}
                <div className="space-y-1.5">
                  {course.additionalCosts.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-3">
                      <span className="text-slate-600">{item.label}</span>
                      <span className="font-bold text-slate-900">{item.amount}</span>
                    </div>
                  ))}
                </div>
                {course.additionalCosts.note && (
                  <p className="text-slate-500 text-[11px] leading-relaxed pt-1 border-t border-slate-200/80">
                    {course.additionalCosts.note}
                  </p>
                )}
              </div>
            )}

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

