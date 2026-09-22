import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Loader2, Check, ArrowLeft, RotateCcw } from 'lucide-react'
import { api } from '@/lib/api'
import { clone, ScalarField, StringListField, ListEditor } from '@/components/admin/SchemaFieldEditors'

const PAGE_LABELS = {
  courseDetail: 'Course Detail',
  courseEnrollment: 'Course Enrollment'
}

// Per-course version of AdminPageEditorPage's schema-driven form - edits this
// one course's override of the courseDetail/courseEnrollment chrome template
// instead of the shared default. No course-picker (that's specific to the
// global template editor) and no live-preview iframe here - just the form.
export function AdminCoursePageContentEditor() {
  const { id, page } = useParams()

  const [course, setCourse] = useState(null)
  const [schema, setSchema] = useState(null)
  const [data, setData] = useState(null)
  const [customized, setCustomized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      const [courseRes, contentRes] = await Promise.all([
        api.adminGetCourse(id),
        api.adminGetCourseContent(id, page)
      ])
      setCourse(courseRes.course)
      setSchema(contentRes.schema)
      setData(contentRes.data)
      setCustomized(contentRes.customized)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, page])

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
      const res = await api.adminUpdateCourseContent(id, page, data)
      setData(res.data)
      setCustomized(true)
      setMessage('Saved. This course now shows this content.')
      setTimeout(() => setMessage(''), 5000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleReset() {
    if (!window.confirm('Discard this course’s edits and revert to the default template content?')) return
    setSaving(true)
    setError('')
    try {
      const res = await api.adminResetCourseContent(id, page)
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

  const label = PAGE_LABELS[page] || page

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
        <div>
          <Link
            to={`/admin/courses/${id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-rocket-dark uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to course
          </Link>
          <h1 className="text-xl sm:text-2xl font-black text-rocket-dark mt-1">
            {label} content - {course?.title || 'Course'}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {customized ? (
              <span className="text-emerald-600 font-semibold">Custom content is live for this course</span>
            ) : (
              <span className="text-amber-600 font-semibold">Currently showing default template content</span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
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
    </div>
  )
}

export default AdminCoursePageContentEditor
