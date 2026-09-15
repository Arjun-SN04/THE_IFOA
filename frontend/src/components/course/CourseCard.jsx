import React from 'react'
import { Link } from 'react-router-dom'
import { Star, Clock, ArrowRight } from 'lucide-react'

import bannerDispatcher from '@/assets/courses/course_banner_dispatcher_3d.jpg'
import bannerGroundOps from '@/assets/courses/course_banner_ground_ops_3d.jpg'

// Single source of truth for the Events & Courses catalog card. Used by the
// public catalog and by the admin editor's live preview. Every `card.*`
// override falls back to a course-level field or a sensible default.
// Treat "" / null / undefined as "not set" so blank admin fields fall back.
const first = (...vals) => vals.find((v) => v !== '' && v !== null && v !== undefined)

export function resolveCard(course = {}) {
  const c = course.card || {}
  const isGround = course.category === 'ground' || course.category === 'ramp'
  const rating = first(c.rating, course.rating, 5)

  return {
    image: first(c.image?.url, course.heroImage?.url, isGround ? bannerGroundOps : bannerDispatcher),
    badge: first(c.badge, course.authority, isGround ? 'IATA ISAGO / EASA' : 'EASA / FAA Part 65'),
    badgeTone: isGround ? 'ground' : 'default',
    rating: Number(rating).toFixed(1),
    reviews: first(c.reviewsLabel, '480+ Reviews'),
    duration: first(
      c.durationLabel,
      course.duration,
      isGround ? '4 Weeks Station Track' : '12 Weeks Hybrid'
    ),
    blurb: first(
      c.blurb,
      course.summary,
      course.whatYouWillLearn?.intro,
      'Comprehensive aviation programme aligned with international regulatory standards.'
    )
  }
}

export function CourseCard({ course, preview = false }) {
  const v = resolveCard(course)
  const title = course.title || 'Untitled course'

  const Banner = (
    <div className="relative h-[220px] sm:h-[240px] overflow-hidden bg-[#020617] select-none">
      <img
        src={v.image}
        alt={title}
        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 select-none"
      />
    </div>
  )

  return (
    <div className="group rounded-3xl overflow-hidden border border-slate-200/80 bg-white hover:border-slate-300 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      {Banner}

      <div className="p-5 sm:p-6 text-left space-y-4 bg-white flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Top Scope / Tag & Duration row */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            {v.badge ? (
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200 pb-0.5 inline-block">
                {v.badge}
              </span>
            ) : <span />}

            {/* Clean Duration Tag */}
            {v.duration && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-600 bg-slate-100/90 px-2.5 py-0.5 rounded-full max-w-full">
                <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate max-w-[160px] sm:max-w-[200px]">{v.duration}</span>
              </span>
            )}
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug group-hover:text-black transition-colors line-clamp-2">
            {title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal line-clamp-3">
            {v.blurb}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-slate-900 text-xs font-bold ml-1">{v.rating}</span>
            <span className="text-slate-400 text-xs font-normal">({v.reviews})</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          {preview ? (
            <div className="inline-flex items-center justify-between w-full text-xs sm:text-sm font-bold text-slate-900 transition-colors py-1">
              <span>View Course Details</span>
              <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-slate-900 group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                <ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-white transition-all" />
              </div>
            </div>
          ) : (
            <Link
              to={`/courses/${course.slug}`}
              className="inline-flex items-center justify-between w-full text-xs sm:text-sm font-bold text-slate-900 transition-colors py-1"
            >
              <span>View Course Details</span>
              <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-slate-900 group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                <ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default CourseCard
