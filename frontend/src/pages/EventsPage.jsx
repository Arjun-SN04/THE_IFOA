import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import {
  RiWhatsappFill,
  RiGlobeLine,
  RiNotification3Line,
  RiCheckboxCircleFill,
  RiCalendarEventLine,
  RiMapPin2Line,
  RiBuildingLine,
  RiStackLine,
  RiComputerLine
} from 'react-icons/ri'
import { TbClockHour4 } from 'react-icons/tb'
import { HiArrowUpRight, HiArrowRight } from 'react-icons/hi2'
import { MdOutlineMail } from 'react-icons/md'

import { CosmicParallaxBg } from '@/components/common/CosmicParallaxBg'
import { Reveal } from '@/components/common/Reveal'
import { CmsText, CmsRemoveItem } from '@/components/admin/CmsEditable'
import { CourseCard } from '@/components/course/CourseCard'
import { AviationIcon } from '@/components/common/AviationIcon'
import { usePageContent } from '@/hooks/usePageContent'
import { Seo } from '@/components/common/Seo'
import { readPreload } from '@/lib/preload'
import { graph, organizationSchema, breadcrumbSchema, absoluteUrl } from '@/lib/seo'
import bannerEventsHero from '@/assets/events/course_banner_dispatcher_3d.jpg'
import multipleAirImg from '@/assets/events/multiple-air.webp'

// Content the page ships with; editable at /admin/pages/events.
const FALLBACK = {
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
    emptyDesc: 'New cohorts are published here as admissions open. Leave your email below to be notified.'
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
    intro: "A look at the open-enrollment programs we've successfully delivered across our global hubs.",
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

const formatIntakeDate = (isoString) => {
  if (!isoString) return null
  try {
    return new Date(isoString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  } catch {
    return null
  }
}

function getModeIcon(mode = '') {
  const m = String(mode).toLowerCase()
  if (m.includes('onsite') || m.includes('in-person') || m.includes('classroom') || m.includes('station')) {
    return <RiBuildingLine className="w-3.5 h-3.5 text-slate-500 shrink-0" />
  }
  if (m.includes('hybrid') || m.includes('blended')) {
    return <RiStackLine className="w-3.5 h-3.5 text-slate-500 shrink-0" />
  }
  if (m.includes('online') || m.includes('virtual') || m.includes('distance')) {
    return <RiComputerLine className="w-3.5 h-3.5 text-slate-500 shrink-0" />
  }
  return <RiGlobeLine className="w-3.5 h-3.5 text-slate-500 shrink-0" />
}

// Events lists fixed-date, open-enrollment cohorts. Every other discipline
// (Crew Control, Dangerous Goods, Train the Trainer, etc.) is discovered from
// the Services page instead, so only the flagship Flight Dispatch programmes
// (EASA and FAA) show here.
const EVENTS_SLUGS = ['flight-dispatcher-initial-certification', 'aircraft-dispatcher-training-faa-part-65']

export function EventsPage() {
  const navigate = useNavigate()
  const [liveCourses, setLiveCourses] = useState(() => (readPreload('courses') || []).filter((course) => EVENTS_SLUGS.includes(course.slug)))
  const { c } = usePageContent('events', FALLBACK)

  useEffect(() => {
    api
      .listCourses()
      .then((data) => setLiveCourses((data.courses || []).filter((course) => EVENTS_SLUGS.includes(course.slug))))
      .catch(() => setLiveCourses([]))
  }, [])

  return (
    <div className="bg-white text-rocket-dark selection:bg-[#34E06E] selection:text-slate-950" data-purpose="events-page">
      <Seo
        path="/events"
        title="Flight Dispatcher Course Dates & Upcoming Intakes | IFOA"
        description="Open-enrollment flight dispatcher and flight operations courses with confirmed start dates in New Delhi, Europe and online. Find the next available intake."
        jsonLd={graph(
          organizationSchema(),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Events & Programs', path: '/events' }
          ]),
          liveCourses.length > 0 && {
            '@type': 'ItemList',
            name: 'Upcoming IFOA training intakes',
            itemListElement: liveCourses.map((course, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: course.title,
              url: absoluteUrl(`/courses/${course.slug}`)
            }))
          }
        )}
      />
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[460px] md:min-h-[500px] flex flex-col items-center justify-center bg-[#020617] text-white pt-28 pb-16 overflow-hidden">
        {/* Ambient Aviation Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={c.hero.image?.url || bannerEventsHero}
            alt="IFOA Training Events and Courses"
            className="w-full h-full object-cover object-center opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/90 via-[#020617]/75 to-[#020617]" />
        </div>

        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 text-center space-y-6 flex flex-col items-center justify-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            <CmsText path="hero.title" value={c.hero.title} />
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            <CmsText path="hero.subtitle" value={c.hero.subtitle} />
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="#open-enrollment-programs"
              className="bg-[#34E06E] hover:bg-[#28c85e] text-slate-950 font-extrabold px-7 py-3 rounded-full text-xs uppercase tracking-widest transition-all duration-200 shadow-lg hover:shadow-[0_0_20px_rgba(52,224,110,0.4)] hover:scale-105 cursor-pointer"
            >
              <CmsText path="hero.primaryLabel" value={c.hero.primaryLabel} />
            </a>
            <a
              href="https://wa.me/41782273103"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-6 py-3 rounded-full text-xs uppercase tracking-widest transition-all duration-200"
            >
              <RiWhatsappFill className="w-4 h-4 text-white" />
              <span>
                <CmsText path="hero.secondaryLabel" value={c.hero.secondaryLabel} />
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. OPEN ENROLLMENTS & INTAKES */}
      <Reveal as="section" id="open-enrollment-programs" className="py-20 sm:py-24 bg-slate-50/60 border-b border-slate-200/80 scroll-mt-24" data-purpose="open-enrollment-programs">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
            <div className="max-w-2xl space-y-2.5">
              <span className="text-xs sm:text-sm font-mono font-black uppercase tracking-widest text-slate-950 border-b-2 border-[#34E06E] pb-1 inline-block">
                <CmsText path="programs.eyebrow" value={c.programs.eyebrow} />
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                <CmsText path="programs.title" value={c.programs.title} />
              </h2>
              <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                <CmsText path="programs.intro" value={c.programs.intro} />
              </p>
            </div>

            <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white px-4 py-2 rounded-xl border border-slate-200/80 shadow-2xs">
              <span>
                <CmsText path="programs.badge" value={c.programs.badge} />
              </span>
            </div>
          </div>

          {/* Intakes Cards List - driven by published courses from the admin console */}
          <div className="space-y-4">
            {liveCourses.length === 0 && (
              <div className="rounded-3xl bg-white border border-dashed border-slate-300 p-10 text-center space-y-2">
                <p className="text-base font-bold text-slate-900">
                  <CmsText path="programs.emptyTitle" value={c.programs.emptyTitle} />
                </p>
                <p className="text-sm text-slate-600">
                  <CmsText path="programs.emptyDesc" value={c.programs.emptyDesc} />
                </p>
              </div>
            )}

            {liveCourses.map((course, idx) => {
              const nextDate =
                formatIntakeDate(course.schedule?.startDate) ||
                course.intakeLabel ||
                'To be announced'
              const durationLabel = course.duration || course.card?.durationLabel
              return (
                <div
                  key={course._id || course.slug || idx}
                  className="group rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200 p-5 sm:px-7 sm:py-5 flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  {/* Left Info Column */}
                  <div className="space-y-2.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-900 bg-slate-100 border border-slate-200/80 px-2.5 py-0.5 rounded-md shrink-0 inline-flex items-center justify-center text-center sm:w-[116px]">
                        {course.refCode || `INTAKE 0${idx + 1}`}
                      </span>

                      <span className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200/70 px-2.5 py-0.5 rounded-full shrink-0 sm:w-[96px]">
                        {getModeIcon(course.schedule?.mode)}
                        <span>{course.schedule?.mode || 'Virtual'}</span>
                      </span>

                      {durationLabel && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-50/80 border border-slate-200/60 px-2.5 py-0.5 rounded-full shrink-0">
                          <TbClockHour4 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{durationLabel}</span>
                        </span>
                      )}
                    </div>

                    <Link
                      to={`/courses/${course.slug}`}
                      className="block text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug group-hover:text-[#34E06E] transition-colors"
                    >
                      {course.title}
                    </Link>
                  </div>

                  {/* Right Status & Action Column (Responsive Stack on Mobile) */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between md:justify-end gap-3 sm:gap-6 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 w-full md:w-auto">
                    <div className="flex items-center justify-between sm:flex-col sm:items-start md:items-end text-left md:text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Next Intake
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-800 whitespace-nowrap">
                        {nextDate}
                      </span>
                    </div>

                    <Link
                      to={`/courses/${course.slug}`}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#020617] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all duration-150 shadow-2xs hover:shadow-md cursor-pointer shrink-0 sm:min-w-[160px]"
                    >
                      <span>Register Interest</span>
                      <HiArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Reveal>

      {/* 3. WHAT YOU DEVELOP */}
      <Reveal as="section" className="py-16 sm:py-24 bg-white border-b border-slate-200/80" data-purpose="what-you-develop">
        <div className="max-w-[1280px] mx-auto px-6 space-y-12">
          {/* Header Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end justify-between">
            <div className="lg:col-span-7 space-y-3">
              <span className="text-xs sm:text-sm font-mono font-black uppercase tracking-widest text-slate-950 border-b-2 border-[#34E06E] pb-1 inline-block">
                <CmsText path="develop.eyebrow" value={c.develop.eyebrow} />
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                <CmsText path="develop.title" value={c.develop.title} />
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                <CmsText path="develop.intro" value={c.develop.intro} />
              </p>
            </div>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: '01',
                title: 'Anticipate',
                desc: 'Identify developing operational constraints and understand their potential impact before they affect the flight.'
              },
              {
                num: '02',
                title: 'Decide',
                desc: 'Build situational awareness and make structured operational decisions using available information.'
              },
              {
                num: '03',
                title: 'Coordinate',
                desc: "Understand the dispatcher's role within the wider operation and coordinate effectively with operational stakeholders."
              },
              {
                num: '04',
                title: 'Optimize',
                desc: 'Balance safety, compliance, operational constraints and available resources rather than simply following predefined tasks.'
              }
            ].map((pillar, idx) => (
              <div
                key={idx}
                className="group rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-slate-300 hover:-translate-y-1.5 transition-all duration-300 p-7 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <span className="text-xs font-mono font-black text-slate-950 border-b-2 border-[#34E06E] pb-0.5 inline-block">
                    {pillar.num}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-snug group-hover:text-[#34E06E] transition-colors min-h-[1.75rem] flex items-start">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal min-h-[4.5rem]">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* 4. FROM THEORY TO THE AIRCRAFT (B737-NG OPERATIONAL TRAINING) */}
      <Reveal as="section" className="py-16 sm:py-24 bg-[#0a0f1d] text-white border-b border-slate-800" data-purpose="b737-operational-training">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest text-[#34E06E] inline-block">
                  <CmsText path="theoryToAircraft.eyebrow" value={c.theoryToAircraft.eyebrow} />
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  <CmsText path="theoryToAircraft.title" value={c.theoryToAircraft.title} />
                </h2>
              </div>

              <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-xl">
                <CmsText path="theoryToAircraft.intro" value={c.theoryToAircraft.intro} />
              </p>

              {/* Module Tags */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                {(c.theoryToAircraft.tags || []).map((tag, idx) => (
                  <span
                    key={idx}
                    className="relative inline-flex items-center gap-2 pl-3.5 pr-6 py-2 rounded-xl text-xs font-semibold tracking-wide text-slate-200 bg-slate-900/90 border border-slate-800/90 shadow-2xs hover:border-slate-700 transition-colors cursor-default"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34E06E] shrink-0" />
                    <span>
                      <CmsText path={`theoryToAircraft.tags.${idx}`} value={tag} />
                    </span>
                    <CmsRemoveItem listPath="theoryToAircraft.tags" index={idx} label="Remove tag" />
                  </span>
                ))}
              </div>
            </div>

            {/* Right Card: B737-NG Aircraft Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative w-full rounded-3xl overflow-hidden border border-slate-800 bg-[#0f172a] shadow-2xl aspect-video">
                <img
                  src={multipleAirImg}
                  alt="B737-NG Aircraft Fleet Operations"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </Reveal>


      {/* 5. FINAL FLEET-WIDE CTA */}
      <Reveal as="section" className="py-16 sm:py-24 bg-white text-center" data-purpose="events-final-cta">
        <div className="max-w-[800px] mx-auto px-6 space-y-6">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-rocket-dark leading-tight">
            <CmsText path="finalCta.title" value={c.finalCta.title} />
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-xl mx-auto">
            <CmsText path="finalCta.desc" value={c.finalCta.desc} />
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate('/contact')}
              className="bg-[#34E06E] hover:bg-[#28c85e] text-slate-950 font-extrabold px-8 py-3.5 rounded-full text-xs uppercase tracking-widest transition-all duration-200 shadow-xl hover:scale-105 cursor-pointer"
            >
              <CmsText path="finalCta.primaryLabel" value={c.finalCta.primaryLabel} />
            </button>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-rocket-dark font-bold px-7 py-3.5 rounded-full text-xs uppercase tracking-widest transition-all duration-200 group"
            >
              <span>
                <CmsText path="finalCta.secondaryLabel" value={c.finalCta.secondaryLabel} />
              </span>
              <HiArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  )
}
