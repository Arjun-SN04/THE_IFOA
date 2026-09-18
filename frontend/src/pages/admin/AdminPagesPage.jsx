import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Loader2,
  FileText,
  ChevronRight,
  ExternalLink,
  Sparkles,
  LayoutTemplate,
  Globe,
  Layers,
  BookOpen,
  Info
} from 'lucide-react'
import { api } from '@/lib/api'

const PATH_BY_PAGE = {
  home: '/',
  services: '/services',
  about: '/about',
  contact: '/contact',
  events: '/events',
  foxtrotDelta: '/foxtrot-delta',
  courseEnrollment: null,
  courseDetail: null
}

const PAGE_DESCRIPTIONS = {
  home: 'Main landing page featuring hero animations, partner logos, highlights, and featured programs.',
  services: 'Aviation consultancy, flight dispatch training, airline setup, and regulatory compliance services.',
  events: 'Upcoming academic cohorts, workshops, webinars, and international aviation training calendar.',
  foxtrotDelta: 'IFOA official aviation magazine editions, industry insights, articles, and downloadable publications.',
  about: 'IFOA history, mission, accreditation credentials, team, and global regulatory standards.',
  contact: 'Global offices, direct inquiry channels, WhatsApp quick support, and contact form.',
  courseDetail: 'Shared header, sidebar layout, and default copy template for individual course detail pages.',
  courseEnrollment: 'Shared multi-step application form chrome and default candidate instructions.'
}

export function AdminPagesPage() {
  const [pages, setPages] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .adminListPages()
      .then((data) => setPages(data.pages || []))
      .catch((err) => setError(err.message))
  }, [])

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-xs font-semibold text-red-700 max-w-4xl mx-auto">
        {error}
      </div>
    )
  }

  if (!pages) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-[#34E06E]" />
        <p className="mt-3 text-xs font-semibold text-slate-500">Loading website CMS directory…</p>
      </div>
    )
  }

  const marketingPages = pages.filter((p) => PATH_BY_PAGE[p.page] !== null)
  const templatePages = pages.filter((p) => PATH_BY_PAGE[p.page] === null)

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* 1. HEADER HERO */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-[#34E06E]" />
          Content Management System
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">Site Pages CMS</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
          Customize headlines, hero sections, statistics, FAQs, and marketing text across all public website pages in real time.
        </p>
      </div>

      {/* 2. PUBLIC MARKETING PAGES */}
      <div className="space-y-4">
        <div>
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-600" />
            <span>Public Marketing Pages ({marketingPages.length})</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Individual standalone pages accessible directly on the website menu.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {marketingPages.map((p) => {
            const publicPath = PATH_BY_PAGE[p.page]
            const description = PAGE_DESCRIPTIONS[p.page] || 'Public marketing page content.'

            return (
              <div
                key={p.page}
                className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-slate-300 hover:shadow-md transition-all group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-800 group-hover:bg-[#34E06E]/15 group-hover:text-emerald-700 transition-colors">
                      <LayoutTemplate className="h-5 w-5" />
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        p.customized
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                          : 'bg-slate-100 text-slate-500 border-slate-200/60'
                      }`}
                    >
                      {p.customized ? 'Customized' : 'Default'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                      {p.label} Page
                    </h3>
                    <span className="font-mono text-[11px] text-slate-400 block mt-0.5">
                      {publicPath}
                    </span>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-3 border-t border-slate-100">
                  {publicPath && (
                    <a
                      href={publicPath}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider px-3 py-2 rounded-xl transition-colors cursor-pointer"
                      title="Open page in a new window"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View</span>
                    </a>
                  )}
                  <Link
                    to={`/admin/pages/${p.page}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#020617] group-hover:bg-[#34E06E] text-white group-hover:text-black font-extrabold text-xs uppercase tracking-wider px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
                  >
                    <span>Edit Copy</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 3. SHARED COURSE LAYOUT TEMPLATES */}
      {templatePages.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600" />
              <span>Shared Course Layout Templates ({templatePages.length})</span>
            </h2>
            <p className="text-xs text-slate-500">
              These pages define the master default chrome and text inherited by all course offerings unless overridden individually.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {templatePages.map((p) => {
              const description = PAGE_DESCRIPTIONS[p.page] || 'Shared course layout chrome.'

              return (
                <div
                  key={p.page}
                  className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-slate-300 hover:shadow-md transition-all group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                        <BookOpen className="h-5 w-5" />
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                          p.customized
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                            : 'bg-slate-100 text-slate-500 border-slate-200/60'
                        }`}
                      >
                        {p.customized ? 'Custom Default' : 'Factory Default'}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                        {p.label} Template
                      </h3>
                      <span className="text-[11px] text-purple-600 font-semibold block mt-0.5">
                        Master Course Template
                      </span>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                        {description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end shrink-0 pt-3 border-t border-slate-100">
                    <Link
                      to={`/admin/pages/${p.page}`}
                      className="inline-flex items-center justify-center gap-1.5 bg-[#020617] group-hover:bg-purple-600 text-white font-extrabold text-xs uppercase tracking-wider px-5 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
                    >
                      <span>Edit Master Template</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPagesPage

