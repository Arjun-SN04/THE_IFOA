import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Loader2,
  Users,
  Clock,
  CheckCircle2,
  Phone,
  Search,
  FileText,
  Download,
  Trash2,
  ChevronRight,
  ChevronDown
} from 'lucide-react'
import { api } from '@/lib/api'
import { openEnrollmentPdf, downloadEnrollmentPdf } from '@/pdf/generateEnrollmentPdf'
import { getSubmissionQuickInfo } from '@/components/formEngine/formSchema'

const STATUSES = ['new', 'contacted', 'confirmed', 'rejected']

const STATUS_BADGE = {
  new: 'bg-blue-50 text-blue-700 border-blue-200',
  contacted: 'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-rose-50 text-rose-700 border-rose-200'
}

function Stat({ label, value, icon: Icon, tone }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{label}</p>
        <p className={`text-2xl font-black ${tone || 'text-rocket-dark'}`}>{value}</p>
      </div>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${Icon.bg}`}>
        <Icon.C className="w-5 h-5" />
      </div>
    </div>
  )
}

export function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('all')
  const [course, setCourse] = useState('')
  const [q, setQ] = useState('')
  const [busyId, setBusyId] = useState(null)
  const [legacy, setLegacy] = useState(null)
  const [legacyOpen, setLegacyOpen] = useState(false)

  useEffect(() => {
    api
      .adminListCourses()
      .then((d) => setCourses(d.courses))
      .catch(() => {})
  }, [])

  function load() {
    setLoading(true)
    setError('')
    api
      .adminListSubmissions({ status, course, q })
      .then((d) => setSubmissions(d.submissions))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, course])

  async function handleDelete(s, name) {
    if (!window.confirm(`Delete submission for "${name}"? This cannot be undone.`)) return
    setBusyId(s._id)
    try {
      await api.adminDeleteSubmission(s._id)
      setSubmissions((prev) => prev.filter((x) => x._id !== s._id))
    } catch (err) {
      alert(err.message)
    } finally {
      setBusyId(null)
    }
  }

  async function loadLegacy() {
    if (legacy) {
      setLegacyOpen((o) => !o)
      return
    }
    try {
      const d = await api.adminListLegacyRegistrations()
      setLegacy(d.registrations || [])
      setLegacyOpen(true)
    } catch (err) {
      alert(err.message)
    }
  }

  const counts = useMemo(() => {
    const c = { new: 0, contacted: 0, confirmed: 0, rejected: 0 }
    for (const s of submissions) c[s.status] = (c[s.status] || 0) + 1
    return c
  }, [submissions])

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Stat label="Total" value={submissions.length} tone="text-rocket-dark"
          icon={{ C: Users, bg: 'bg-purple-50 text-purple-600' }} />
        <Stat label="New" value={counts.new} tone="text-blue-600"
          icon={{ C: Clock, bg: 'bg-blue-50 text-blue-600' }} />
        <Stat label="Contacted" value={counts.contacted} tone="text-amber-600"
          icon={{ C: Phone, bg: 'bg-amber-50 text-amber-600' }} />
        <Stat label="Confirmed" value={counts.confirmed} tone="text-emerald-600"
          icon={{ C: CheckCircle2, bg: 'bg-emerald-50 text-emerald-600' }} />
      </div>

      <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            load()
          }}
          className="flex items-center gap-2 flex-1 max-w-md"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, email, any answer…"
              className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rocket-lime bg-gray-50/50"
            />
          </div>
          <button
            type="submit"
            className="text-xs font-bold uppercase tracking-wider bg-gray-100 hover:bg-gray-200 text-rocket-dark px-4 py-2.5 rounded-xl transition-colors"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-gray-100 p-1 rounded-xl">
            {['all', ...STATUSES].map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  status === s ? 'bg-white text-rocket-dark shadow-xs' : 'text-gray-500 hover:text-rocket-dark'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <select
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-xs font-semibold text-rocket-dark focus:outline-none focus:ring-2 focus:ring-rocket-lime"
          >
            <option value="">All courses</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">{error}</div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-200/80 text-center flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-rocket-dark" />
          <p className="text-sm font-medium text-gray-500">Loading submissions…</p>
        </div>
      ) : submissions.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-200/80 text-center space-y-2">
          <p className="text-sm font-bold text-rocket-dark">No submissions found</p>
          <p className="text-xs text-gray-500">Enrollment form submissions appear here, filterable by course.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[820px]">
              <thead>
                <tr className="bg-gray-50/75 border-b border-gray-200 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  <th className="px-6 py-3.5">Applicant</th>
                  <th className="px-5 py-3.5">Course</th>
                  <th className="px-5 py-3.5">Intake</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Submitted</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {submissions.map((s) => {
                  const info = getSubmissionQuickInfo(s)
                  return (
                    <tr key={s._id} className="hover:bg-gray-50/75 transition-colors group">
                      <td className="px-6 py-4">
                        <Link
                          to={`/admin/submissions/${s._id}`}
                          className="font-bold text-rocket-dark group-hover:text-blue-600 transition-colors"
                        >
                          {info.name}
                        </Link>
                        <p className="text-xs text-gray-400">{info.email || 'no email'}</p>
                      </td>
                      <td className="px-5 py-4 text-xs font-semibold text-gray-600">
                        {s.course?.title || s.courseTitle || '—'}
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-500">{s.intake || '—'}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${
                            STATUS_BADGE[s.status] || STATUS_BADGE.new
                          }`}
                        >
                          <span className="capitalize">{s.status}</span>
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-600">
                        {new Date(s.submittedAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEnrollmentPdf(s)}
                            title="View PDF"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-rocket-dark hover:bg-gray-100 transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => downloadEnrollmentPdf(s, `IFOA-Enrollment-${s._id}.pdf`)}
                            title="Download PDF"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-rocket-dark hover:bg-gray-100 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(s, info.name)}
                            disabled={busyId === s._id}
                            title="Delete"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <Link
                            to={`/admin/submissions/${s._id}`}
                            className="inline-flex items-center gap-1 rounded-lg bg-ifoa-navy px-3 py-1.5 text-xs font-bold text-white hover:bg-ifoa-navy-light transition-all"
                          >
                            View <ChevronRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Legacy registrations (pre-dynamic-form) */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <button
          onClick={loadLegacy}
          className="w-full flex items-center justify-between px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <span>Legacy registrations (read-only)</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${legacyOpen ? 'rotate-180' : ''}`} />
        </button>
        {legacyOpen && legacy && (
          <div className="border-t border-gray-100 p-4">
            {legacy.length === 0 ? (
              <p className="text-xs text-gray-400 px-2 py-3">No legacy registrations.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[600px]">
                  <thead className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    <tr>
                      <th className="px-3 py-2">Name</th>
                      <th className="px-3 py-2">Email</th>
                      <th className="px-3 py-2">Course</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {legacy.map((r) => (
                      <tr key={r._id}>
                        <td className="px-3 py-2 font-semibold text-rocket-dark">
                          {[r.firstName, r.middleName, r.lastName].filter(Boolean).join(' ')}
                        </td>
                        <td className="px-3 py-2 text-gray-500">{r.email}</td>
                        <td className="px-3 py-2 text-gray-500">
                          {r.course?.title || r.courseTitle || '—'}
                        </td>
                        <td className="px-3 py-2 capitalize text-gray-500">{r.status}</td>
                        <td className="px-3 py-2 text-gray-400">
                          {new Date(r.createdAt).toLocaleDateString('en-GB')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminSubmissionsPage
