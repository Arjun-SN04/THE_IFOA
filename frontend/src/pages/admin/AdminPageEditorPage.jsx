import React, { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Loader2,
  Check,
  ArrowLeft,
  RotateCcw,
  ExternalLink,
  Pencil,
  FileText,
  FileEdit,
  Eye,
  RefreshCw,
  MonitorSmartphone
} from 'lucide-react'
import { api } from '@/lib/api'
import { clone, ScalarField, StringListField, ListEditor } from '@/components/admin/SchemaFieldEditors'

const PATH_BY_PAGE = {
  services: '/services',
  about: '/about',
  contact: '/contact',
  events: '/events',
  foxtrotDelta: '/foxtrot-delta',
  courseEnrollment: null,
  courseDetail: null
}

// These two pages hold the DEFAULT/SEED chrome template new courses start
// from — each course can now override its own copy independently — so
// alongside the template fields, show a picker of the actual courses so the
// admin can jump straight into editing one course's own content/form from
// here.
const SHOWS_COURSE_PICKER = new Set(['courseDetail', 'courseEnrollment'])

function LivePreview({ page, data }) {
  const iframeRef = useRef(null)
  const debounceRef = useRef(null)
  const [iframeKey, setIframeKey] = useState(0)
  const previewPath = PATH_BY_PAGE[page]

  const sendContent = () => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'ifoa-preview-content', page, data },
      window.location.origin
    )
  }

  // Push the latest in-progress edits whenever they change, debounced so we
  // don't flood the iframe on every keystroke.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(sendContent, 200)
    return () => clearTimeout(debounceRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, iframeKey])

  // The iframe tells us when it's mounted and listening, so we can send it
  // the current state immediately (avoids a race on first load / refresh).
  useEffect(() => {
    const onMessage = (event) => {
      if (event.origin !== window.location.origin) return
      const msg = event.data
      if (msg && msg.type === 'ifoa-preview-ready' && msg.page === page) sendContent()
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, data])

  if (!previewPath) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center text-xs font-semibold text-gray-500">
        No live preview for shared template pages. Use the per-course "Preview" link below instead.
      </div>
    )
  }

  return (
    <div className="lg:sticky lg:top-6">
      <div className="overflow-hidden rounded-2xl border border-gray-200/90 bg-[#020617] shadow-xs">
        <div className="flex items-center justify-between gap-2 px-4 py-2.5">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#34E06E]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34E06E] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#34E06E]" />
            </span>
            <MonitorSmartphone className="h-3.5 w-3.5" /> Live Preview
          </span>
          <button
            type="button"
            onClick={() => setIframeKey((k) => k + 1)}
            title="Refresh preview"
            className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-bold text-slate-300 hover:bg-white/10 transition-colors"
          >
            <RefreshCw className="h-3 w-3" /> Refresh
          </button>
        </div>
        <div className="border-t border-white/5 bg-slate-900 p-3">
          <div className="overflow-hidden rounded-xl border border-white/10 bg-white">
            <iframe
              key={iframeKey}
              ref={iframeRef}
              src={`${previewPath}?__preview=1`}
              title="Live page preview"
              className="h-[70vh] w-full"
              onLoad={sendContent}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export function AdminPageEditorPage() {
  const { page } = useParams()

  const [schema, setSchema] = useState(null)
  const [data, setData] = useState(null)
  const [customized, setCustomized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [courses, setCourses] = useState(null)
  const [coursesError, setCoursesError] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      const res = await api.adminGetPage(page)
      setSchema(res.schema)
      setData(res.data)
      setCustomized(res.customized)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  useEffect(() => {
    if (!SHOWS_COURSE_PICKER.has(page)) return
    setCourses(null)
    setCoursesError('')
    api
      .adminListCourses({})
      .then((res) => setCourses(res.courses || []))
      .catch((err) => setCoursesError(err.message))
  }, [page])

  // recipe mutates a deep clone of `data`
  const mutate = (recipe) =>
    setData((prev) => {
      const next = clone(prev)
      recipe(next)
      return next
    })

  async function handleSave() {
    setSaving(true)
    setError('')
    setMessage('')
    try {
      await api.adminUpdatePage(page, data)
      setCustomized(true)
      setMessage('Saved. The public page now shows this content.')
      setTimeout(() => setMessage(''), 5000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleReset() {
    if (!window.confirm('Discard all edits and revert this page to the default content?')) return
    setSaving(true)
    setError('')
    try {
      const res = await api.adminResetPage(page)
      setData(res.data)
      setCustomized(false)
      setMessage('Reverted to default content.')
      setTimeout(() => setMessage(''), 5000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading || !schema || !data) {
    if (error) {
      return (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 max-w-3xl mx-auto">
          {error}
        </div>
      )
    }
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <Loader2 className="h-8 w-8 animate-spin text-ifoa-navy" />
        <p className="mt-3 text-xs font-semibold text-gray-500">Loading page content…</p>
      </div>
    )
  }

  const label = page.charAt(0).toUpperCase() + page.slice(1)

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
        <div>
          <Link
            to="/admin/pages"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-rocket-dark uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All pages
          </Link>
          <h1 className="text-xl sm:text-2xl font-black text-rocket-dark mt-1">{label} page content</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {customized ? (
              <span className="text-emerald-600 font-semibold">Custom content is live</span>
            ) : (
              <span className="text-amber-600 font-semibold">Currently showing default content</span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {PATH_BY_PAGE[page] && (
            <a
              href={PATH_BY_PAGE[page]}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 border border-gray-300 text-rocket-dark font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> View
            </a>
          )}
          {customized && (
            <button
              type="button"
              onClick={handleReset}
              disabled={saving}
              className="inline-flex items-center gap-1.5 border border-amber-300 text-amber-700 font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl hover:bg-amber-50 disabled:opacity-60 transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#020617] text-white hover:bg-black font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl disabled:opacity-60 transition-all shadow-sm"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin text-rocket-lime" />
            ) : (
              <Check className="w-4 h-4 text-rocket-lime" />
            )}
            <span>{saving ? 'Saving…' : 'Save Content'}</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <Check className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="lg:grid lg:grid-cols-2 lg:gap-6 lg:items-start">
      <div className="space-y-5">
        {schema.groups.map((group) => {
          const gv = data[group.k] || {}
          return (
            <div
              key={group.k}
              className="overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-xs"
            >
              <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-5 py-3.5">
                <h2 className="text-base font-extrabold text-rocket-dark">{group.label}</h2>
              </div>

              <div className="p-5 space-y-4">
                {(group.fields || []).map((f) =>
                  f.type === 'stringList' ? (
                    <StringListField
                      key={f.k}
                      label={f.label}
                      value={gv[f.k]}
                      onChange={(v) => mutate((d) => { (d[group.k] ||= {})[f.k] = v })}
                    />
                  ) : (
                    <ScalarField
                      key={f.k}
                      field={f}
                      value={gv[f.k]}
                      onChange={(v) => mutate((d) => { (d[group.k] ||= {})[f.k] = v })}
                    />
                  )
                )}

                {(group.lists || []).map((list) => (
                  <div key={list.k} className="pt-2 border-t border-gray-100">
                    <ListEditor
                      list={list}
                      value={gv[list.k]}
                      onChange={(v) => mutate((d) => { (d[group.k] ||= {})[list.k] = v })}
                    />
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-5 lg:mt-0">
        <LivePreview page={page} data={data} />
      </div>
      </div>

      {SHOWS_COURSE_PICKER.has(page) && (
        <div className="space-y-3 pt-2">
          <div className="px-1">
            <h2 className="text-base font-extrabold text-rocket-dark">Courses using this template</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              The fields above are the default template new courses start from. Each course can now
              customize its own copy below.
            </p>
          </div>

          {coursesError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
              {coursesError}
            </div>
          )}

          {!courses && !coursesError && (
            <div className="flex items-center justify-center py-10 text-gray-400">
              <Loader2 className="h-5 w-5 animate-spin text-ifoa-navy" />
            </div>
          )}

          {courses && courses.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center text-xs font-semibold text-gray-500">
              No courses yet.
            </div>
          )}

          {courses && courses.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="rounded-2xl border border-gray-200/90 bg-white p-4 shadow-xs space-y-3"
                >
                  <div>
                    <p className="text-sm font-bold text-rocket-dark leading-snug line-clamp-2">{course.title}</p>
                    <p className="text-[11px] font-semibold text-gray-400 mt-0.5">{course.slug}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Link
                      to={`/admin/courses/${course._id}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Pencil className="h-3 w-3" /> Edit Course Info
                    </Link>
                    <Link
                      to={`/admin/courses/${course._id}/content/${page}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <FileEdit className="h-3 w-3" /> Edit Page Text
                    </Link>
                    <Link
                      to={`/admin/courses/${course._id}/form`}
                      className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <FileText className="h-3 w-3" /> {course.hasCustomForm ? 'Edit Form' : 'Create Form'}
                    </Link>
                    <Link
                      to={`/admin/courses/${course._id}/preview`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Eye className="h-3 w-3" /> Preview
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminPageEditorPage
