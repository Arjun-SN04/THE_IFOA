import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Users,
  Search,
  BookOpen,
  Send,
  MessageSquare,
  Shield,
  Layers,
  Globe,
  Mail,
  Bell
} from 'lucide-react'

import { CosmicParallaxBg } from '@/components/common/CosmicParallaxBg'
import { CourseCard } from '@/components/course/CourseCard'
import { AviationIcon } from '@/components/common/AviationIcon'
import { usePageContent } from '@/hooks/usePageContent'
import bannerEventsHero from '@/assets/courses/course_banner_dispatcher_3d.jpg'

// Content the page ships with; editable at /admin/pages/events.
const FALLBACK = {
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
    emptyDesc: 'New cohorts are published here as admissions open. Leave your email below to be notified.'
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

export function EventsPage() {
  const navigate = useNavigate()
  const [notifyEmail, setNotifyEmail] = useState('')
  const [notifySuccess, setNotifySuccess] = useState(false)
  const [liveCourses, setLiveCourses] = useState([])
  const { c } = usePageContent('events', FALLBACK)

  useEffect(() => {
    api
      .listCourses()
      .then((data) => setLiveCourses(data.courses || []))
      .catch(() => setLiveCourses([]))
  }, [])

  const curriculumModules = c.curriculum.modules
  const recentCohorts = c.recent.cohorts

  const handleNotifySubmit = (e) => {
    e.preventDefault()
    if (notifyEmail.trim()) {
      setNotifySuccess(true)
      setTimeout(() => {
        setNotifyEmail('')
        setNotifySuccess(false)
      }, 4000)
    }
  }

  return (
    <div className="bg-white text-rocket-dark selection:bg-[#38b58a] selection:text-white" data-purpose="events-page">
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
            {c.hero.title}
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            {c.hero.subtitle}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="#open-enrollment-programs"
              className="bg-[#38b58a] hover:bg-[#2ea87c] text-white font-bold px-7 py-3 rounded-full text-xs uppercase tracking-widest transition-all duration-200 shadow-lg hover:shadow-emerald-500/25 hover:scale-105 cursor-pointer"
            >
              {c.hero.primaryLabel}
            </a>
            <a
              href="https://wa.me/41782273103"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-6 py-3 rounded-full text-xs uppercase tracking-widest transition-all duration-200"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#38b58a]" />
              <span>Inquire on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. OPEN ENROLLMENTS & INTAKES */}
      <section id="open-enrollment-programs" className="py-20 sm:py-24 bg-slate-50/60 border-b border-slate-200/80 scroll-mt-24" data-purpose="open-enrollment-programs">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
            <div className="max-w-2xl space-y-2.5">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#38b58a] border-b-2 border-[#38b58a] pb-1 inline-block">
                {c.programs.eyebrow}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                {c.programs.title}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                {c.programs.intro}
              </p>
            </div>

            <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white px-4 py-2 rounded-xl border border-slate-200/80 shadow-2xs">

              <span>{c.programs.badge}</span>
            </div>
          </div>

          {/* Intakes Cards List — driven by published courses from the admin console */}
          <div className="space-y-4">
            {liveCourses.length === 0 && (
              <div className="rounded-3xl bg-white border border-dashed border-slate-300 p-10 text-center space-y-2">
                <p className="text-base font-bold text-slate-900">{c.programs.emptyTitle}</p>
                <p className="text-sm text-slate-600">
                  {c.programs.emptyDesc}
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
                  className="group rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200 p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  {/* Left Info */}
                  <div className="space-y-2.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 font-medium">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#2b8f6c] border-b-2 border-[#38b58a] pb-0.5 inline-block mr-1">
                        {course.refCode || `INTAKE 0${idx + 1}`}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="inline-flex items-center gap-1.5 text-slate-600">
                        <Globe className="w-3.5 h-3.5 text-slate-400" />
                        {course.schedule?.mode || 'Virtual'}
                      </span>
                      {durationLabel && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="inline-flex items-center gap-1.5 text-slate-600">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {durationLabel}
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug group-hover:text-[#2b8f6c] transition-colors">
                      {course.title}
                    </h3>
                  </div>

                  {/* Right Status & Action */}
                  <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="flex flex-col md:items-end text-left md:text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Next Intake
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-800">
                        {nextDate}
                      </span>
                    </div>

                    <Link
                      to={`/courses/${course.slug}/enroll`}
                      className="inline-flex items-center justify-center gap-2 bg-[#020617] hover:bg-[#38b58a] text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all duration-200 shadow-2xs hover:shadow-md cursor-pointer shrink-0"
                    >
                      <span>Register Interest</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Email Notification Bar */}
          <div className="rounded-3xl bg-[#020617] text-white p-8 sm:p-10 border border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 max-w-lg">
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#38b58a] uppercase tracking-wider">
                <Bell className="w-4 h-4" />
                <span>{c.alerts.eyebrow}</span>
              </div>
              <h4 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
                {c.alerts.title}
              </h4>
              <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
                {c.alerts.desc}
              </p>
            </div>

            <form onSubmit={handleNotifySubmit} className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
              <div className="relative w-full sm:w-80">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  placeholder="you@airline.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-[#38b58a] focus:ring-2 focus:ring-[#38b58a]/20 transition-all"
                />
              </div>
              <button
                type="submit"
                className="bg-[#38b58a] hover:bg-[#2ea87c] text-white font-bold text-xs uppercase tracking-wider px-7 py-3 rounded-xl transition-all duration-200 shadow-md hover:scale-105 cursor-pointer shrink-0"
              >
                {notifySuccess ? 'Notified!' : c.alerts.buttonLabel}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 3. CURRICULUM OVERVIEW */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80" data-purpose="curriculum-overview">
        <div className="max-w-[1280px] mx-auto px-6 space-y-12">
          <div className="max-w-2xl space-y-2.5">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#38b58a] border-b-2 border-[#38b58a] pb-1 inline-block">
              {c.curriculum.eyebrow}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-rocket-dark leading-tight">
              {c.curriculum.title}
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 font-normal leading-relaxed">
              {c.curriculum.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
            {curriculumModules.map((mod, idx) => (
              <div
                key={idx}
                className="group rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-[#38b58a]/40 hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0d6833] flex items-center justify-center border border-emerald-200/60 shadow-2xs group-hover:bg-[#38b58a] group-hover:text-white group-hover:border-[#38b58a] transition-colors">
                        <AviationIcon name={mod.iconName} className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-700">
                        {mod.num}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                      PHASE {mod.num}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-rocket-dark tracking-tight leading-snug group-hover:text-[#38b58a] transition-colors min-h-[42px] flex items-center">
                    {mod.title}
                  </h3>
                  <div className="space-y-1.5 pt-3 border-t border-slate-100">
                    {mod.items.map((item, i) => (
                      <div
                        key={i}
                        className="py-1.5 px-2.5 rounded-xl bg-slate-50/80 text-slate-700 text-xs font-medium border border-slate-100"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-500 font-mono">
            {c.curriculum.footnote}
          </p>
        </div>
      </section>

      {/* 4. RECENT COHORTS */}
      <section className="py-16 sm:py-24 bg-slate-50/60 border-b border-slate-200/80" data-purpose="recent-cohorts">
        <div className="max-w-[1280px] mx-auto px-6 space-y-12">
          <div className="max-w-2xl space-y-2.5">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#38b58a] border-b-2 border-[#38b58a] pb-1 inline-block">
              {c.recent.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {c.recent.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
              {c.recent.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {recentCohorts.map((cohort, idx) => (
              <div
                key={idx}
                className="group rounded-3xl bg-white border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:border-[#38b58a]/40 hover:-translate-y-1.5 transition-all duration-300 p-7 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  {/* Top Bar: Code & Delivered status */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-[#38b58a] bg-[#38b58a]/10 border border-[#38b58a]/20 px-3 py-1 rounded-lg">
                      {cohort.code}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#38b58a]" />
                      <span>Completed</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-snug group-hover:text-[#38b58a] transition-colors">
                    {cohort.title}
                  </h3>

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200/70 px-3 py-1.5 rounded-xl">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{cohort.dates}</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200/70 px-3 py-1.5 rounded-xl">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{cohort.location}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 font-normal leading-relaxed pt-1">
                    {cohort.description}
                  </p>
                </div>

                {/* Bottom Action */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-slate-500 truncate">
                    {cohort.pricing}
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate('/contact')}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#38b58a] hover:text-[#2ea87c] transition-colors cursor-pointer group/btn shrink-0"
                  >
                    <span>Inquire dates</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FINAL FLEET-WIDE CTA */}
      <section className="py-16 sm:py-24 bg-white text-center" data-purpose="events-final-cta">
        <div className="max-w-[800px] mx-auto px-6 space-y-6">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-rocket-dark leading-tight">
            {c.finalCta.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-xl mx-auto">
            {c.finalCta.desc}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate('/contact')}
              className="bg-[#38b58a] hover:bg-[#2ea87c] text-white font-bold px-8 py-3.5 rounded-full text-xs uppercase tracking-widest transition-all duration-200 shadow-xl hover:scale-105 cursor-pointer"
            >
              {c.finalCta.primaryLabel}
            </button>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-rocket-dark font-bold px-7 py-3.5 rounded-full text-xs uppercase tracking-widest transition-all duration-200"
            >
              <span>{c.finalCta.secondaryLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
