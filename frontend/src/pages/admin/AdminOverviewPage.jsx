import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen,
  Users,
  Mail,
  ChevronRight,
  Sparkles,
  Plus,
  ExternalLink,
  FileCode,
  ArrowUpRight,
  HelpCircle
} from 'lucide-react'
import { api } from '@/lib/api'
import { PATH_BY_PAGE } from './pagesMeta'

function StatCard({ label, value, subtext, icon: Icon, tone = 'emerald', to, loading }) {
  const tones = {
    emerald: {
      bg: 'bg-emerald-50/80 text-emerald-600 border-emerald-100',
      num: 'text-slate-900',
      pill: 'bg-emerald-500/10 text-emerald-700'
    },
    blue: {
      bg: 'bg-blue-50/80 text-blue-600 border-blue-100',
      num: 'text-slate-900',
      pill: 'bg-blue-500/10 text-blue-700'
    },
    amber: {
      bg: 'bg-amber-50/80 text-amber-600 border-amber-100',
      num: 'text-slate-900',
      pill: 'bg-amber-500/10 text-amber-700'
    },
    purple: {
      bg: 'bg-purple-50/80 text-purple-600 border-purple-100',
      num: 'text-slate-900',
      pill: 'bg-purple-500/10 text-purple-700'
    }
  }
  const currentTone = tones[tone] || tones.emerald

  return (
    <Link
      to={to}
      className="group relative overflow-hidden bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold tracking-tight ${currentTone.num}`}>
              {loading ? ' - ' : value}
            </span>
          </div>
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-105 ${currentTone.bg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="font-medium text-slate-500">{subtext}</span>
        <span className="inline-flex items-center gap-1 font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">
          View <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  )
}

function SectionCard({ to, icon: Icon, title, description, badge, actionLabel = 'Open', external }) {
  const content = (
    <div className="group flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-slate-300 hover:shadow-md transition-all cursor-pointer">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-800 group-hover:bg-[#34E06E]/15 group-hover:text-emerald-700 transition-colors">
            <Icon className="h-5 w-5" />
          </span>
          {badge && (
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60">
              {badge}
            </span>
          )}
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
            {title}
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{description}</p>
        </div>
      </div>

      <div className="flex items-center justify-end pt-3 border-t border-slate-100">
        <span className="inline-flex items-center gap-1.5 bg-[#020617] group-hover:bg-[#34E06E] text-white group-hover:text-black font-extrabold text-[11px] uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all shadow-xs">
          <span>{actionLabel}</span>
          {external ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </span>
      </div>
    </div>
  )

  if (external) {
    return (
      <a href={to} target="_blank" rel="noreferrer">
        {content}
      </a>
    )
  }

  return <Link to={to}>{content}</Link>
}

export function AdminOverviewPage() {
  const [stats, setStats] = useState({
    courses: null,
    totalSubmissions: null,
    newSubmissions: null,
    totalMessages: null,
    newMessages: null
  })
  const [pages, setPages] = useState(null)

  useEffect(() => {
    api
      .adminListPages()
      .then((data) => setPages((data.pages || []).filter((p) => PATH_BY_PAGE[p.page] !== null)))
      .catch(() => setPages([]))

    api
      .adminListCourses({})
      .then((data) => setStats((prev) => ({ ...prev, courses: (data.courses || []).length })))
      .catch(() => setStats((prev) => ({ ...prev, courses: 0 })))

    api
      .adminListSubmissions({})
      .then((data) => {
        const subs = data.submissions || []
        setStats((prev) => ({
          ...prev,
          totalSubmissions: subs.length,
          newSubmissions: subs.filter((s) => s.status === 'new').length
        }))
      })
      .catch(() => setStats((prev) => ({ ...prev, totalSubmissions: 0, newSubmissions: 0 })))

    api
      .adminListContactMessages({})
      .then((data) => {
        const msgs = data.messages || []
        setStats((prev) => ({
          ...prev,
          totalMessages: msgs.length,
          newMessages: msgs.filter((m) => m.status === 'new').length
        }))
      })
      .catch(() => setStats((prev) => ({ ...prev, totalMessages: 0, newMessages: 0 })))
  }, [])

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* 1. WELCOME & QUICK ACTIONS HERO */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              IFOA Command Center
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Flight Operations Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Manage training programs, customize public website copy, configure enrollment forms, and process candidate applications in one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/admin/courses/new"
              className="inline-flex items-center gap-2 bg-[#34E06E] hover:bg-[#2bc960] text-black font-extrabold text-xs uppercase tracking-wider px-4 py-3 rounded-xl transition-all shadow-md hover:shadow-emerald-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Course</span>
            </Link>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider px-4 py-3 rounded-xl border border-white/10 transition-all cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Live Website</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. YOUR WEBSITE PAGES - every major page, one click to edit, right up front */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-black uppercase tracking-wider text-slate-900">
            Your Website Pages
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Click a page below to edit its text and images directly. Changes go live as soon as you save.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {pages === null
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[132px] rounded-2xl border border-slate-200/90 bg-white animate-pulse"
                />
              ))
            : pages.map((p) => {
                const publicPath = PATH_BY_PAGE[p.page]
                return (
                  <div
                    key={p.page}
                    className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-slate-300 hover:shadow-md transition-all"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900 truncate">{p.label}</h3>
                        <span
                          className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            p.customized
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                              : 'bg-slate-100 text-slate-500 border-slate-200/60'
                          }`}
                        >
                          {p.customized ? 'Customized' : 'Default'}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-slate-400 block mt-0.5 truncate">
                        {publicPath}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {publicPath && (
                        <a
                          href={publicPath}
                          target="_blank"
                          rel="noreferrer"
                          title="View live page"
                          className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <Link
                        to={`/admin/pages/${p.page}`}
                        className="inline-flex items-center justify-center gap-1.5 bg-[#020617] group-hover:bg-[#34E06E] text-white group-hover:text-black font-extrabold text-xs uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
                      >
                        <span>Edit</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                )
              })}
        </div>
      </section>

      {/* 3. REAL-TIME STATS SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          to="/admin/courses"
          label="Academic Programs"
          value={stats.courses}
          subtext="Active in database"
          icon={BookOpen}
          tone="emerald"
          loading={stats.courses === null}
        />
        <StatCard
          to="/admin/submissions"
          label="Candidate Registrations"
          value={stats.newSubmissions != null ? `${stats.newSubmissions} New` : ' - '}
          subtext={`${stats.totalSubmissions || 0} total applications`}
          icon={Users}
          tone="blue"
          loading={stats.newSubmissions === null}
        />
        <StatCard
          to="/admin/contact-messages"
          label="Contact Inquiries"
          value={stats.newMessages != null ? `${stats.newMessages} New` : ' - '}
          subtext={`${stats.totalMessages || 0} total messages`}
          icon={Mail}
          tone="amber"
          loading={stats.newMessages === null}
        />
      </div>

      {/* 4. CURRICULUM & FORMS SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black uppercase tracking-wider text-slate-900">
              1. Curriculum &amp; Forms
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage training programs and the default application form schema.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <SectionCard
            to="/admin/courses"
            icon={BookOpen}
            title="Courses Catalog"
            description="Manage individual training programs, syllabus modules, tuition pricing, schedules, and custom enrollment questions."
            badge="Curriculum"
            actionLabel="Manage Courses"
          />
          <SectionCard
            to="/admin/form-template"
            icon={FileCode}
            title="Default Form Template"
            description="Configure the default multi-step application form schema that new courses inherit automatically."
            badge="Form Schema"
            actionLabel="Configure Template"
          />
        </div>
      </section>

      {/* 5. ADMISSIONS & INBOUND LEADS SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black uppercase tracking-wider text-slate-900">
              2. Admissions &amp; Inbound Leads
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review and process applications and inquiries submitted by visitors.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <SectionCard
            to="/admin/submissions"
            icon={Users}
            title="Student Registrations"
            description="Review student applications submitted via the course enrollment forms, download applicant PDFs, and update enrollment statuses."
            badge="Enrollments"
            actionLabel="View Registrations"
          />
          <SectionCard
            to="/admin/contact-messages"
            icon={Mail}
            title="Contact Messages"
            description="View inquiries submitted via the public Contact Us page with sender information, topic classification, and status tracking."
            badge="Inquiries"
            actionLabel="View Messages"
          />
        </div>
      </section>

      {/* 5. QUICK OPERATIONAL CHEATSHEET */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 sm:p-6 space-y-3">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
          <HelpCircle className="w-4 h-4 text-emerald-600" />
          <span>Quick Admin Guide</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600 leading-relaxed">
          <div className="p-3 bg-white rounded-xl border border-slate-200/60 space-y-1">
            <span className="font-bold text-slate-900 block">Immediate Publishing</span>
            <p className="text-slate-500">
              Any changes made in Courses or Site Pages are live immediately upon clicking "Save Content" without redeploying.
            </p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200/60 space-y-1">
            <span className="font-bold text-slate-900 block">Step-by-Step Help (i)</span>
            <p className="text-slate-500">
              Click the "(i)" button in the top navigation bar anytime for a numbered step-by-step guide specific to the page you are on.
            </p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200/60 space-y-1">
            <span className="font-bold text-slate-900 block">Lead Status Tracking</span>
            <p className="text-slate-500">
              Keep registrations organized by toggling applicant status between New, Contacted, Confirmed, and Rejected.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminOverviewPage

