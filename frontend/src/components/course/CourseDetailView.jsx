import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  RiArrowLeftLine,
  RiShareForwardLine,
  RiShieldCheckFill,
  RiCalendarEventLine,
  RiMapPin2Line,
  RiCheckboxCircleFill,
  RiWhatsappFill,
  RiQuestionLine,
  RiStackLine,
  RiCompass3Line,
  RiPulseLine,
  RiFileShieldLine
} from 'react-icons/ri'
import { TbClockHour4, TbCertificate } from 'react-icons/tb'
import { HiArrowUpRight } from 'react-icons/hi2'
import { MdOutlineMail } from 'react-icons/md'

// Standards Logos
import logoIcao from '@/assets/course/standards-logos/logo-icao.png'
import logoEasa from '@/assets/course/standards-logos/logo-easa.png'
import logoFaa from '@/assets/course/standards-logos/logo-faa.png'
import logoDgca from '@/assets/course/standards-logos/logo-dgca.png'
import logoIfoaWhite from '@/assets/brand/logo-ifoa-global-white.png'
import bannerCourseHero from '@/assets/courses/course_banner_dispatcher_3d.jpg'

function formatDate(value, opts = { day: '2-digit', month: '2-digit', year: 'numeric' }) {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('en-GB', opts)
}

function formatPrice(price) {
  if (!price || price.amount == null) return 'On request'
  return `${price.amount.toLocaleString('en-US')} ${price.currency}`
}

export function CourseDetailView({ course, preview = false }) {
  const [copied, setCopied] = useState(false)

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
        .catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const modulesList = course.courseContent?.modules || []
  const hasModules = modulesList.length > 0

  const competencyIcons = [RiCompass3Line, RiPulseLine, RiShieldCheckFill, RiFileShieldLine]

  // Default accreditation standards based on program region
  const defaultStandards = isIndiaProgram
    ? [
        {
          logo: logoEasa,
          name: 'EASA Framework',
          code: 'ORO.GEN.110 Compliant'
        },
        {
          logo: logoDgca,
          name: 'DGCA India Aligned',
          code: 'Civil Aviation Requirements'
        },
        {
          logo: logoIcao,
          name: 'ICAO Standards',
          code: 'Doc 10106 / Annex 1 & 6'
        }
      ]
    : [
        {
          logo: logoEasa,
          name: 'EASA Framework',
          code: 'ORO.GEN.110 Compliant'
        },
        {
          logo: logoFaa,
          name: 'FAA 14 CFR Part 65',
          code: 'Aircraft Dispatcher Standard'
        },
        {
          logo: logoIcao,
          name: 'ICAO Standards',
          code: 'Doc 10106 / Annex 1 & 6'
        }
      ]

  return (
    <div
      className="w-full min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-[#34E06E] selection:text-slate-950 font-sans antialiased"
      data-purpose="course-detail-view"
    >
      {/* ========================================================================= */}
      {/* 1. PROFESSIONAL EXECUTIVE HERO SECTION                                    */}
      {/* ========================================================================= */}
      <section className="relative bg-[#020617] text-white pt-24 sm:pt-28 pb-12 sm:pb-16 overflow-hidden border-b border-white/10">
        {/* Subtle Aviation Background Texture */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={course.image || bannerCourseHero}
            alt={course.title}
            className="w-full h-full object-cover object-center opacity-15 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/95 via-[#020617]/90 to-[#020617]" />
        </div>

        <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Navigation & Ref / Share Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {!preview ? (
              <Link
                to="/services"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
              >
                <RiArrowLeftLine className="w-4 h-4 text-slate-400" />
                <span>All Programs</span>
              </Link>
            ) : (
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-300 bg-amber-950/60 px-3 py-1 rounded-md border border-amber-500/30">
                Preview Mode
              </span>
            )}

            <div className="flex items-center gap-3">
              {course.refCode && (
                <span className="text-xs font-mono font-medium px-3 py-1 rounded-md bg-white/10 text-slate-200 border border-white/15">
                  Ref: {course.refCode}
                </span>
              )}
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 border border-white/15 transition-colors cursor-pointer"
                title="Share this course"
              >
                <RiShareForwardLine className="w-3.5 h-3.5" />
                <span>{copied ? 'Link Copied' : 'Share'}</span>
              </button>
            </div>
          </div>

          {/* Title & Eyebrow */}
          <div className="space-y-3.5 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 border border-white/20 text-white text-xs font-semibold tracking-wide">
              <RiShieldCheckFill className="w-4 h-4 text-[#34E06E] shrink-0" />
              <span>
                {isIndiaProgram
                  ? 'DGCA & ICAO Aligned Professional Dispatch Curriculum'
                  : 'FAA Part 65 & EASA Aligned Training'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {course.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-3xl">
              {course.summary ||
                'A comprehensive professional flight operations and flight dispatch program delivered under the IFOA Competency-Based Training and Assessment (CBTA) framework.'}
            </p>
          </div>

          {/* Clean Quick Metric Chips */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300">
              <TbClockHour4 className="w-3.5 h-3.5 text-slate-400" />
              <span>
                Duration: <strong className="text-white font-semibold">{course.duration || '4 Weeks'}</strong>
              </span>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300">
              <RiCalendarEventLine className="w-3.5 h-3.5 text-slate-400" />
              <span>
                Next Intake:{' '}
                <strong className="text-white font-semibold">
                  {schedule.startDate ? formatDate(schedule.startDate) : '31/03/2026'}
                </strong>
              </span>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300">
              <RiMapPin2Line className="w-3.5 h-3.5 text-slate-400" />
              <span>
                Location:{' '}
                <strong className="text-white font-semibold">
                  {course.location || (isIndiaProgram ? 'New Delhi' : 'Virtual OCC')}
                </strong>
              </span>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300">
              <TbCertificate className="w-3.5 h-3.5 text-slate-400" />
              <span>
                Tuition: <strong className="text-white font-semibold">{formatPrice(course.price)}</strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. TWO-COLUMN MAIN BODY: LEFT CONTENT + RIGHT STICKY SIDEBAR              */}
      {/* ========================================================================= */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* ----------------------------------------------------------------------- */}
          {/* LEFT COLUMN: SYLLABUS, MASTERY, AUDIENCE, STANDARDS, AND FORM           */}
          {/* ----------------------------------------------------------------------- */}
          <main className="lg:col-span-7 xl:col-span-8 space-y-8 sm:space-y-10">
            {/* 1. What You Will Master */}
            {(course.whatYouWillLearn?.intro || course.whatYouWillLearn?.points?.length > 0) && (
              <section className="bg-white rounded-3xl p-6 sm:p-8 lg:p-9 border border-slate-200/90 shadow-xs space-y-6">
                <div className="space-y-2">
                  <span className="text-xs sm:text-sm font-mono font-black uppercase tracking-widest text-slate-950 border-b-2 border-[#34E06E] pb-1 inline-block">
                    Competency Mastery
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                    What You Will Master
                  </h2>
                  {course.whatYouWillLearn.intro && (
                    <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed pt-1">
                      {course.whatYouWillLearn.intro}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {course.whatYouWillLearn.points.map((point, idx) => {
                    const IconComponent = competencyIcons[idx % competencyIcons.length]
                    return (
                      <div
                        key={idx}
                        className="rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all duration-200 p-5 flex items-start gap-4"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/90 text-slate-800 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                          <IconComponent className="w-5 h-5 text-slate-700" />
                        </div>
                        <p className="text-sm font-medium text-slate-800 leading-snug">
                          {point}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {/* 2. Structured Syllabus & Modules */}
            {(course.courseContent?.intro || hasModules) && (
              <section className="bg-white rounded-3xl p-6 sm:p-8 lg:p-9 border border-slate-200/90 shadow-xs space-y-7">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="space-y-2">
                    <span className="text-xs sm:text-sm font-mono font-black uppercase tracking-widest text-slate-950 border-b-2 border-[#34E06E] pb-1 inline-block">
                      Structured Syllabus
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                      Course Content &amp; Modules
                    </h2>
                    {course.courseContent?.intro && (
                      <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed pt-0.5 max-w-2xl">
                        {course.courseContent.intro}
                      </p>
                    )}
                  </div>

                  {hasModules && (
                    <span className="self-start sm:self-auto text-xs sm:text-sm font-bold text-slate-900 bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-full shrink-0">
                      <span className="text-slate-900 font-mono">{modulesList.length}</span> Core Modules
                    </span>
                  )}
                </div>

                {/* 2-Column Clean Module Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {modulesList.map((module, idx) => (
                    <div
                      key={idx}
                      className="group rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:border-slate-300 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 p-4.5 flex items-center gap-4"
                    >
                      <span className="w-9 h-9 rounded-xl bg-white border border-slate-200 group-hover:bg-slate-900 group-hover:border-slate-900 text-slate-800 group-hover:text-white font-mono font-bold text-xs sm:text-sm flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <h3 className="text-sm font-semibold text-slate-900 leading-snug group-hover:text-slate-950 transition-colors flex-1">
                        {module}
                      </h3>
                      <RiCheckboxCircleFill className="w-4 h-4 text-[#34E06E] transition-colors shrink-0 opacity-0 group-hover:opacity-100" />
                    </div>
                  ))}
                </div>

                {/* Practical Flight Planning Callout */}
                {course.courseContent?.note && (
                  <div className="rounded-2xl bg-[#020617] text-white p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center gap-5 border border-white/10 shadow-sm">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center p-2.5 shrink-0">
                      <img
                        src={logoIfoaWhite}
                        alt="IFOA"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2.5 flex-wrap">
                        <span>Practical Aircraft Flight Planning</span>
                        <span className="text-[11px] font-mono font-bold text-slate-900 bg-[#34E06E] px-2.5 py-0.5 rounded-md uppercase">
                          Applied Workshop
                        </span>
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                        {course.courseContent.note}
                      </p>
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* 3. Audience Profile & Standards (Cohesive 2-Col Split) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
              {/* Who Should Attend */}
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs sm:text-sm font-mono font-black uppercase tracking-widest text-slate-950 border-b-2 border-[#34E06E] pb-1 inline-block">
                      Candidate Profile
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 leading-snug">
                      Who Should Attend?
                    </h2>
                    {course.whoShouldAttend?.intro && (
                      <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                        {course.whoShouldAttend.intro}
                      </p>
                    )}
                  </div>

                  {course.whoShouldAttend?.points?.length > 0 && (
                    <div className="space-y-2.5 pt-1">
                      {course.whoShouldAttend.points.map((pt, i) => (
                        <div
                          key={i}
                          className="group/pt p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:border-slate-300 hover:shadow-2xs transition-all duration-200 flex items-center gap-3"
                        >
                          <RiCheckboxCircleFill className="w-4 h-4 text-[#34E06E] shrink-0" />
                          <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                            {pt}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {/* Training Standards */}
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs sm:text-sm font-mono font-black uppercase tracking-widest text-slate-950 border-b-2 border-[#34E06E] pb-1 inline-block">
                      Regulatory Compliance
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 leading-snug">
                      Training Standards
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                      {course.trainingStandards?.intro ||
                        'Structured under strict international civil aviation frameworks to guarantee worldwide license conversion and regulatory acceptance.'}
                    </p>
                  </div>

                  {/* Standards Clean Vertical Stack */}
                  <div className="space-y-2.5 pt-1">
                    {course.trainingStandards?.logos?.length > 0
                      ? course.trainingStandards.logos.map((l, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:border-slate-300 transition-all"
                          >
                            <div className="w-12 h-10 rounded-xl bg-white border border-slate-200/90 flex items-center justify-center p-1.5 shrink-0 shadow-2xs">
                              <img
                                src={l.url}
                                alt={l.alt || 'Standard Logo'}
                                className="h-full w-full object-contain"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <strong className="text-xs sm:text-sm font-bold text-slate-900 block leading-tight">
                                {l.alt || 'Accreditation Standard'}
                              </strong>
                              <span className="text-[11px] text-slate-500 font-mono">
                                Recognized Framework
                              </span>
                            </div>
                          </div>
                        ))
                      : defaultStandards.map((std, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:border-slate-300 transition-all"
                          >
                            <div className="w-12 h-10 rounded-xl bg-white border border-slate-200/90 flex items-center justify-center p-1.5 shrink-0 shadow-2xs">
                              <img
                                src={std.logo}
                                alt={std.name}
                                className="max-h-7 w-auto object-contain"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <strong className="text-xs sm:text-sm font-bold text-slate-900 block leading-tight">
                                {std.name}
                              </strong>
                              <span className="text-[11px] text-slate-500 font-mono">
                                {std.code}
                              </span>
                            </div>
                          </div>
                        ))}
                  </div>
                </div>
              </section>
            </div>

            {/* 4. Certification & Delivery Format Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-7 flex items-start gap-4 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
                  <TbCertificate className="w-6 h-6 text-slate-800" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">Official Certification</h3>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                      Lifetime
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {course.certification?.text ||
                      'A dated IFOA Flight Operations & Dispatch Completion Certificate is issued upon successful course completion.'}
                  </p>
                </div>
              </div>

              <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-7 flex items-start gap-4 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
                  <RiStackLine className="w-6 h-6 text-slate-800" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-slate-900">Delivery &amp; Format</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {course.deliveryFormat?.text ||
                      course.format ||
                      'Delivered by active airline dispatchers with extensive international flight operations experience.'}
                  </p>
                </div>
              </div>
            </div>

            {/* 5. Clean, Professional Application Callout Banner */}
            <section
              id="register"
              className="bg-gradient-to-br from-[#020617] via-slate-950 to-[#020617] rounded-3xl p-6 sm:p-8 lg:p-9 text-white shadow-lg border border-white/10 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6"
              data-purpose="registration-portal"
            >
              <div className="space-y-2 max-w-xl">
                <span className="text-xs sm:text-sm font-mono font-black uppercase tracking-widest text-white border-b-2 border-[#34E06E] pb-1 inline-block">
                  Candidate Enrollment
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                  Ready to Start Your Training?
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                  Submit your candidate application online to reserve your seat in the upcoming cohort.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Link
                  to={`/courses/${course.slug}/enroll`}
                  className="inline-flex items-center justify-center gap-2 bg-[#34E06E] hover:bg-[#28c85e] text-slate-950 font-extrabold py-3.5 px-6 rounded-xl text-xs sm:text-sm tracking-wide transition shadow-sm hover:shadow-[0_0_20px_rgba(52,224,110,0.4)] hover:-translate-y-0.5"
                >
                  <span>Apply Online</span>
                  <HiArrowUpRight className="w-4 h-4" />
                </Link>

                <a
                  href="https://wa.me/41782273103"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold py-3.5 px-5 rounded-xl text-xs sm:text-sm transition"
                >
                  <RiWhatsappFill className="w-4 h-4 text-white" />
                  <span>Admissions Chat</span>
                </a>
              </div>
            </section>
          </main>

          {/* ----------------------------------------------------------------------- */}
          {/* RIGHT COLUMN: STICKY PROGRAM SUMMARY & ENROLLMENT CARD                   */}
          {/* ----------------------------------------------------------------------- */}
          <aside className="lg:col-span-5 xl:col-span-4 sticky top-24 space-y-6">
            {/* Primary Enrollment Summary Card */}
            <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden">
              {/* Card Image Banner */}
              <div className="relative h-44 sm:h-48 overflow-hidden bg-[#020617] select-none">
                <img
                  src={course.image || bannerCourseHero}
                  alt={course.title}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded bg-[#34E06E] text-slate-950 shadow-xs">
                    Admissions Open
                  </span>
                  {course.refCode && (
                    <span className="text-[11px] font-mono text-slate-200 bg-black/70 border border-white/15 px-2.5 py-0.5 rounded">
                      {course.refCode}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Content & Action Area */}
              <div className="p-6 sm:p-7 space-y-5">
                {/* Tuition & Pricing Display */}
                <div className="space-y-1">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
                    Tuition Fee
                  </span>
                  <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {formatPrice(course.price)}
                  </div>
                  <p className="text-xs text-slate-500 font-normal">
                    + 18% GST / Track · Inclusive of official course material
                  </p>
                </div>

                {/* Main Action Buttons */}
                <div className="space-y-2.5">
                  <Link
                    to={`/courses/${course.slug}/enroll`}
                    className="w-full bg-[#34E06E] hover:bg-[#28c85e] text-slate-950 font-extrabold py-3.5 px-5 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow-[0_0_20px_rgba(52,224,110,0.4)] flex items-center justify-center gap-2"
                  >
                    <span>Enroll Now — Apply Online</span>
                    <HiArrowUpRight className="w-4 h-4" />
                  </Link>

                  <a
                    href="https://wa.me/41782273103"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold py-3 px-5 rounded-xl text-xs uppercase tracking-wider transition-all duration-200"
                  >
                    <RiWhatsappFill className="w-4 h-4 text-[#25D366]" />
                    <span>Inquire on WhatsApp</span>
                  </a>
                </div>

                {/* Key Program Specifications List */}
                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <span className="text-xs font-mono font-black uppercase tracking-widest text-slate-950 border-b-2 border-[#34E06E] pb-0.5 inline-block">
                    Program Overview
                  </span>

                  <div className="space-y-2.5 text-xs sm:text-sm">
                    <div className="flex items-center justify-between gap-4 pb-2.5 border-b border-slate-100">
                      <span className="text-slate-500 flex items-center gap-2 shrink-0">
                        <TbClockHour4 className="w-3.5 h-3.5 text-slate-400" />
                        <span>Duration</span>
                      </span>
                      <span className="font-semibold text-slate-900 text-right">
                        {course.duration || '4 Weeks'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 pb-2.5 border-b border-slate-100">
                      <span className="text-slate-500 flex items-center gap-2 shrink-0">
                        <RiCalendarEventLine className="w-3.5 h-3.5 text-slate-400" />
                        <span>Next Intake</span>
                      </span>
                      <span className="font-semibold text-slate-900 text-right">
                        {schedule.startDate ? formatDate(schedule.startDate) : '31/03/2026'}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-4 pb-2.5 border-b border-slate-100">
                      <span className="text-slate-500 flex items-center gap-2 shrink-0 pt-0.5">
                        <RiMapPin2Line className="w-3.5 h-3.5 text-slate-400" />
                        <span>Location</span>
                      </span>
                      <span className="font-semibold text-slate-900 text-right leading-snug">
                        {course.location || (isIndiaProgram ? 'New Delhi (IAA)' : 'Virtual OCC')}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-4 pb-2.5 border-b border-slate-100">
                      <span className="text-slate-500 flex items-center gap-2 shrink-0 pt-0.5">
                        <RiStackLine className="w-3.5 h-3.5 text-slate-400" />
                        <span>Delivery</span>
                      </span>
                      <span className="font-semibold text-slate-900 text-right leading-snug">
                        {schedule.mode || 'Onsite Intensive'}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <span className="text-slate-500 flex items-center gap-2 shrink-0 pt-0.5">
                        <TbCertificate className="w-3.5 h-3.5 text-slate-400" />
                        <span>Certificate</span>
                      </span>
                      <span className="font-semibold text-slate-900 text-right leading-snug">
                        IFOA Verified Certificate
                      </span>
                    </div>
                  </div>
                </div>

                {/* Key Benefits List */}
                <div className="rounded-2xl bg-slate-50 p-3.5 space-y-2.5 border border-slate-200/80 text-xs text-slate-700">
                  <div className="flex items-center gap-2.5">
                    <RiCheckboxCircleFill className="w-4 h-4 text-[#34E06E] shrink-0" />
                    <span className="font-medium text-slate-800">Active Airline Dispatcher Instructors</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <RiCheckboxCircleFill className="w-4 h-4 text-[#34E06E] shrink-0" />
                    <span className="font-medium text-slate-800">Real-world OCC Scenario-Based Drills</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <RiCheckboxCircleFill className="w-4 h-4 text-[#34E06E] shrink-0" />
                    <span className="font-medium text-slate-800">Lifetime Certificate Verification</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Admissions Assistance Card */}
            <div className="rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
                  <RiQuestionLine className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Admissions Support</h4>
                  <p className="text-[11px] text-slate-500">Inquiries &amp; Group Bookings</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Have questions regarding eligibility, cohort dates, or corporate group pricing? Our admissions officers are ready to assist.
              </p>

              <div className="pt-1">
                <a
                  href="mailto:info@theifoa.com"
                  className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 text-xs font-medium text-slate-800 transition-colors"
                >
                  <MdOutlineMail className="w-3.5 h-3.5 text-slate-500" />
                  <span>info@theifoa.com</span>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default CourseDetailView
