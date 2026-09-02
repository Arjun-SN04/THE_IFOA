import React, { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Loader2,
  Pencil,
  Trash2,
  ExternalLink,
  Plus,
  Eye,
  Search,
  BookOpen,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  RotateCcw,
  Plane,
  Layers,
  Award,
  ShieldCheck,
  Briefcase,
  AlertTriangle,
  X,
  Sparkles,
  Calendar,
  DollarSign
} from 'lucide-react'
import { api } from '@/lib/api'

// Helper to get category visual tone and icon
function getCategoryMeta(category = '') {
  switch (category.toLowerCase()) {
    case 'dispatch':
      return { label: 'Flight Dispatch', icon: Plane, color: 'text-blue-600 bg-blue-50 border-blue-200/60' }
    case 'ground':
    case 'ramp':
      return { label: 'Ground Operations', icon: Layers, color: 'text-sky-600 bg-sky-50 border-sky-200/60' }
    case 'train-the-trainer':
      return { label: 'Train the Trainer', icon: Award, color: 'text-purple-600 bg-purple-50 border-purple-200/60' }
    case 'security':
    case 'sms':
      return { label: 'SMS & Risk', icon: ShieldCheck, color: 'text-amber-600 bg-amber-50 border-amber-200/60' }
    case 'consulting':
      return { label: 'Airline Consulting', icon: Briefcase, color: 'text-emerald-600 bg-emerald-50 border-emerald-200/60' }
    default:
      return { label: 'Aviation Program', icon: BookOpen, color: 'text-slate-600 bg-slate-50 border-slate-200/60' }
  }
}

export function AdminCoursesPage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedId, setCopiedId] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  async function load() {
    setLoading(true)
    setError('')
    try {
      const data = await api.adminListCourses({ status })
      setCourses(data.courses || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await api.adminDeleteCourse(deleteTarget._id)
      setCourses((prev) => prev.filter((c) => c._id !== deleteTarget._id))
      setDeleteTarget(null)
    } catch (err) {
      alert(err.message)
    } finally {
      setDeleting(false)
    }
  }

  // Filtered courses based on search & category
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        c.title?.toLowerCase().includes(q) ||
        c.slug?.toLowerCase().includes(q) ||
        c.refCode?.toLowerCase().includes(q) ||
        c.authority?.toLowerCase().includes(q)

      const matchesCat =
        categoryFilter === 'all' ||
        c.category?.toLowerCase() === categoryFilter.toLowerCase()

      return matchesSearch && matchesCat
    })
  }, [courses, searchQuery, categoryFilter])

  const totalCount = courses.length
  const publishedCount = courses.filter((c) => c.status === 'published').length
  const draftCount = courses.filter((c) => c.status === 'draft').length
  const publishedPercent = totalCount > 0 ? Math.round((publishedCount / totalCount) * 100) : 0

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      {/* 1. TOP STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5">
        {/* Total Courses Card */}
        <div className="relative overflow-hidden bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all group">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Curriculum</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{totalCount}</span>
                <span className="text-xs font-semibold text-slate-500">programs</span>
              </div>
              <p className="text-xs text-slate-500 font-medium pt-1">
                Active in academy database
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>Global Coverage</span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              Active
            </span>
          </div>
        </div>

        {/* Published Courses Card */}
        <div className="relative overflow-hidden bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all group">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Published Online</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-emerald-600 tracking-tight">{publishedCount}</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  {publishedPercent}% Live
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium pt-1">
                Open for enrollment &amp; registration
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>Public Catalog</span>
            <span className="text-emerald-600 font-bold">
              Live on Site
            </span>
          </div>
        </div>

        {/* Drafts Card */}
        <div className="relative overflow-hidden bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all group">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Drafts &amp; Staging</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-amber-600 tracking-tight">{draftCount}</span>
                <span className="text-xs font-semibold text-slate-500">pending</span>
              </div>
              <p className="text-xs text-slate-500 font-medium pt-1">
                {draftCount === 0 ? 'All courses are live and published' : 'Courses hidden from public view'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 group-hover:scale-105 transition-transform">
              <Clock className="w-6 h-6 text-amber-500" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>Staging Mode</span>
            <span className="text-slate-600 font-semibold">{draftCount === 0 ? '0 Pending' : 'Review Needed'}</span>
          </div>
        </div>
      </div>

      {/* 2. UNIFIED SEARCH, FILTER & ACTION TOOLBAR */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl w-fit">
            {[
              { id: 'all', label: 'All Courses', count: totalCount },
              { id: 'published', label: 'Published', count: publishedCount },
              { id: 'draft', label: 'Drafts', count: draftCount }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatus(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  status === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    status === tab.id ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Input & Category Dropdown */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 flex-1 lg:max-w-xl lg:justify-end">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search title, ref code, slug…"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-9 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="dispatch">Flight Dispatch</option>
              <option value="ground">Ground Operations</option>
              <option value="train-the-trainer">Train the Trainer</option>
              <option value="security">SMS &amp; Risk</option>
              <option value="consulting">Airline Consulting</option>
            </select>

            {/* Reload Button */}
            <button
              onClick={load}
              title="Refresh Catalog"
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            >
              <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm px-5 py-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 text-red-500" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* 3. COURSES TABLE */}
      {loading ? (
        <div className="bg-white rounded-2xl p-16 border border-slate-200/90 text-center flex flex-col items-center justify-center gap-3 shadow-xs">
          <Loader2 className="w-8 h-8 animate-spin text-[#38b58a]" />
          <p className="text-sm font-bold text-slate-700">Loading Academic Catalog…</p>
          <p className="text-xs text-slate-400">Fetching courses and regulatory data</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 border border-dashed border-slate-300 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <BookOpen className="w-7 h-7" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <p className="text-base font-bold text-slate-900">No matching programs found</p>
            <p className="text-xs text-slate-500">
              Try adjusting your search query or status filter to find the course you are looking for.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/admin/courses/new"
              className="inline-flex items-center gap-2 bg-[#020617] hover:bg-[#38b58a] text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Create New Course</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 select-none">
                  <th className="px-6 py-4">Course &amp; Identifier</th>
                  <th className="px-5 py-4">Authority &amp; Code</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Schedule &amp; Mode</th>
                  <th className="px-5 py-4">Tuition</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredCourses.map((course) => {
                  const meta = getCategoryMeta(course.category)
                  const CategoryIcon = meta.icon
                  const formattedDate = course.schedule?.startDate
                    ? new Date(course.schedule.startDate).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })
                    : null

                  return (
                    <tr
                      key={course._id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Course Title & Slug */}
                      <td className="px-6 py-4.5 max-w-sm">
                        <div className="flex items-start gap-3.5">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${meta.color}`}>
                            <CategoryIcon className="w-4 h-4" />
                          </div>
                          <div className="space-y-1 min-w-0">
                            <Link
                              to={`/admin/courses/${course._id}`}
                              className="font-bold text-slate-900 hover:text-emerald-600 transition-colors leading-snug line-clamp-1 block"
                              title={course.title}
                            >
                              {course.title}
                            </Link>

                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-mono text-slate-400 truncate max-w-[200px]">
                                /{course.slug}
                              </span>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(course.slug, `slug-${course._id}`)}
                                className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors cursor-pointer"
                                title="Copy slug"
                              >
                                {copiedId === `slug-${course._id}` ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Authority & Ref Code */}
                      <td className="px-5 py-4.5">
                        <div className="space-y-1">
                          {course.refCode ? (
                            <span className="inline-block font-mono text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded-md">
                              {course.refCode}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs">-</span>
                          )}
                          <p className="text-[11px] text-slate-500 font-medium truncate max-w-[150px]">
                            {course.authority || meta.label}
                          </p>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4.5">
                        <span
                          className={`inline-flex items-center text-xs font-bold px-3 py-1 rounded-full border ${
                            course.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                              : 'bg-amber-50 text-amber-700 border-amber-200/80'
                          }`}
                        >
                          <span className="capitalize">{course.status}</span>
                        </span>
                      </td>

                      {/* Start Date & Format */}
                      <td className="px-5 py-4.5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{formattedDate || 'Rolling / On Demand'}</span>
                          </div>
                          <span className="inline-block text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {course.schedule?.mode || course.format?.split(' ')[0] || 'Standard'}
                          </span>
                        </div>
                      </td>

                      {/* Tuition */}
                      <td className="px-5 py-4.5">
                        {course.price?.amount != null ? (
                          <div className="font-bold text-slate-900 text-xs sm:text-sm">
                            {course.price.currency === 'INR' ? '₹' : course.price.currency === 'EUR' ? '€' : '$'}
                            {course.price.amount.toLocaleString()}{' '}
                            <span className="text-[10px] font-semibold text-slate-400 uppercase">
                              {course.price.currency}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs font-medium text-slate-400 italic">On request</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4.5 text-right">
                        <div className="inline-flex items-center gap-1 p-1 bg-slate-50 border border-slate-200/80 rounded-xl">
                          <a
                            href={`/admin/courses/${course._id}/preview`}
                            target="_blank"
                            rel="noreferrer"
                            title="Preview Course Details"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-white hover:shadow-xs transition-all cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </a>

                          {course.status === 'published' && (
                            <a
                              href={`/courses/${course.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              title="Open Live Public Page"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-white hover:shadow-xs transition-all cursor-pointer"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}

                          <Link
                            to={`/admin/courses/${course._id}`}
                            title="Edit Course"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-white hover:shadow-xs transition-all cursor-pointer"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => setDeleteTarget(course)}
                            title="Delete Course"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 hover:shadow-xs transition-all cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-6 py-3.5 bg-slate-50/80 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>
              Showing <strong className="text-slate-800">{filteredCourses.length}</strong> of{' '}
              <strong className="text-slate-800">{courses.length}</strong> total programs
            </span>
            <span className="text-[11px] text-slate-400">IFOA Flight Operations Academic Management</span>
          </div>
        </div>
      )}

      {/* 4. DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in-0 duration-150">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Delete Course Program?</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Are you sure you want to permanently delete{' '}
                  <strong className="text-slate-900">"{deleteTarget.title}"</strong>? This will remove its curriculum, syllabus data, and uploaded media.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs font-mono text-slate-600">
              Ref: <span className="font-bold text-slate-900">{deleteTarget.refCode || 'N/A'}</span> | Slug: /{deleteTarget.slug}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm hover:shadow-red-500/25 cursor-pointer"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                <span>Delete Program</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminCoursesPage
