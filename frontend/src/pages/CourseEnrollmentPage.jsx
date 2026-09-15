import React, { useEffect, useState } from 'react'
import { Link, Navigate, useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Award,
  ShieldCheck,
  CheckCircle2,
  MessageSquare,
  Mail,
  Loader2,
  Sparkles,
  BookOpen
} from 'lucide-react'

import { api } from '@/lib/api'
import { CosmicParallaxBg } from '@/components/common/CosmicParallaxBg'
import RegistrationForm from '@/components/course/RegistrationForm'

// Standards Logos
import logoFaa from '@/assets/course/standards-logos/logo-faa.png'
import logoEasa from '@/assets/course/standards-logos/logo-easa.png'
import logoIcao from '@/assets/course/standards-logos/logo-icao.png'
import bannerCourseHero from '@/assets/courses/course_banner_dispatcher_3d.jpg'

export function CourseEnrollmentPage() {
  const { slug: paramSlug } = useParams()
  const navigate = useNavigate()

  const activeSlug = paramSlug || ''

  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!activeSlug) return
    let cancelled = false
    setLoading(true)
    setError('')

    api
      .getCourse(activeSlug)
      .then((data) => {
        if (!cancelled) setCourse(data.course)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Course could not be loaded.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [activeSlug])

  const formatPrice = (price) => {
    if (!price || price.amount == null) return 'Contact Admissions'
    if (price.currency === 'INR') {
      return `₹${price.amount.toLocaleString('en-IN')}`
    }
    return `${price.currency} ${price.amount.toLocaleString()}`
  }

  const formatDate = (isoString) => {
    if (!isoString) return ''
    try {
      const d = new Date(isoString)
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
    } catch {
      return isoString
    }
  }

  // No course in the URL — send visitors to the programs list to pick one.
  if (!activeSlug) {
    return <Navigate to="/events" replace />
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-[#34E06E]" />
        <p className="text-sm font-semibold text-slate-600">Loading Official Application Portal…</p>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 px-6 text-center bg-slate-50">
        <h1 className="text-2xl font-bold text-slate-900">Application Portal Not Found</h1>
        <p className="text-slate-600 max-w-md">{error || 'This program could not be loaded for enrollment.'}</p>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-sm hover:brightness-95 transition"
        >
          <ArrowLeft className="w-4 h-4" /> View All Open Programs
        </Link>
      </div>
    )
  }

  const schedule = course.schedule || {}

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* 1. Header Banner with Dark Frosted Space Theme */}
      <section className="relative bg-[#020617] text-white pt-28 pb-14 border-b border-white/10 overflow-hidden">
        <CosmicParallaxBg className="absolute inset-0 opacity-40 pointer-events-none" />

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          {/* Breadcrumbs */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <span>/</span>
            <Link to="/events" className="hover:text-white transition">Events &amp; Programs</Link>
            <span>/</span>
            <Link to={`/courses/${course.slug}`} className="hover:text-white transition line-clamp-1 max-w-[200px] sm:max-w-xs">
              {course.title?.replace(/[\u2013\u2014]/g, '-')}
            </Link>
            <span>/</span>
            <span className="text-white font-semibold">Online Enrollment</span>
          </div>

          {/* Heading */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <span className="text-xs sm:text-sm font-mono font-black uppercase tracking-widest text-[#34E06E] border-b-2 border-[#34E06E] pb-1 inline-block">
                Official Candidate Intake Portal
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {course.title?.replace(/[\u2013\u2014]/g, '-')}
              </h1>
              <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
                Complete your official admission form below. Once received, our admissions panel reviews prerequisites and issues your official placement offer.
              </p>
            </div>

            {/* Link Back to Course Details */}
            <Link
              to={`/courses/${course.slug}`}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 border border-white/15 px-4 py-2.5 rounded-xl transition shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Course Overview</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Main 2-Column Application Layout */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

          {/* Left Sticky Sidebar: Course Highlights & Details */}
          <aside className="lg:col-span-4 sticky top-24 space-y-6">
            {/* Course Summary Card */}
            <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden p-6 space-y-6">
              {/* Image & Title Header */}
              <div className="space-y-3">
                <div className="h-36 rounded-2xl overflow-hidden bg-slate-900 relative">
                  <img
                    src={course.image || bannerCourseHero}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-black bg-[#34E06E] px-2.5 py-0.5 rounded-full shadow-2xs">
                      Official Intake
                    </span>
                    <span className="text-[11px] font-mono text-slate-200 bg-black/60 px-2 py-0.5 rounded">
                      {course.refCode || 'IFOA-OPS'}
                    </span>
                  </div>
                </div>

                <h2 className="text-lg font-bold text-slate-900 leading-snug">
                  {course.title?.replace(/[\u2013\u2014]/g, '-')}
                </h2>
              </div>

              {/* Tuition & Pricing */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                  Course Tuition
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {formatPrice(course.price)}
                </div>
                <p className="text-[11px] text-slate-500 font-normal">
                  + 18% GST · Inclusive of official course material &amp; examination
                </p>
              </div>

              {/* Key Quick Metadata */}
              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-100">
                  <span className="text-slate-500 flex items-center gap-2 shrink-0">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>Duration</span>
                  </span>
                  <strong className="text-slate-900 text-right font-bold">{course.duration || '4 Weeks'}</strong>
                </div>

                <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-100">
                  <span className="text-slate-500 flex items-center gap-2 shrink-0">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>Next Intake</span>
                  </span>
                  <strong className="text-slate-900 text-right font-bold">
                    {schedule.startDate ? formatDate(schedule.startDate) : '31/03/2026'}
                  </strong>
                </div>

                <div className="flex items-start justify-between gap-4 py-2 border-b border-slate-100">
                  <span className="text-slate-500 flex items-center gap-2 shrink-0 pt-0.5">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>Location</span>
                  </span>
                  <strong className="text-slate-900 text-right font-bold leading-snug">
                    {course.location || 'New Delhi (IAA)'}
                  </strong>
                </div>

                <div className="flex items-start justify-between gap-4 py-2 border-b border-slate-100">
                  <span className="text-slate-500 flex items-center gap-2 shrink-0 pt-0.5">
                    <Award className="w-4 h-4 text-slate-400" />
                    <span>Credential</span>
                  </span>
                  <strong className="text-slate-900 text-right font-bold leading-snug">
                    IFOA Flight Dispatch Cert
                  </strong>
                </div>
              </div>

              {/* Regulatory Accreditations Strip */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Standards &amp; Accreditation
                </span>
                <div className="flex items-center justify-between gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <img src={logoFaa} alt="FAA" className="h-6 w-auto object-contain" />
                  <img src={logoEasa} alt="EASA" className="h-6 w-auto object-contain" />
                  <img src={logoIcao} alt="ICAO" className="h-6 w-auto object-contain" />
                </div>
              </div>

              {/* Admissions WhatsApp Support Box */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 space-y-2 text-xs">
                <strong className="font-bold text-[#0d6833] block">Need Admissions Assistance?</strong>
                <p className="text-slate-600 leading-relaxed">
                  Have questions regarding eligibility, visa letters, or payment schedules?
                </p>
                <a
                  href="https://wa.me/41782273103"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#0d6833] hover:underline pt-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat with Admissions on WhatsApp</span>
                </a>
              </div>
            </div>
          </aside>

          {/* Right Main Column: Full Registration Form */}
          <main className="lg:col-span-8">
            <RegistrationForm slug={course.slug} courseTitle={course.title?.replace(/[\u2013\u2014]/g, '-')} />
          </main>

        </div>
      </div>
    </div>
  )
}

export default CourseEnrollmentPage
