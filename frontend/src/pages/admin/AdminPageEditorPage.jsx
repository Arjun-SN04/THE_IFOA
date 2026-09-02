import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Loader2,
  Check,
  Plus,
  X,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  RotateCcw,
  ExternalLink
} from 'lucide-react'
import { api } from '@/lib/api'
import ImageUploader from '@/components/admin/ImageUploader'

const PATH_BY_PAGE = {
  services: '/services',
  about: '/about',
  contact: '/contact',
  events: '/events'
}

const clone = (v) => JSON.parse(JSON.stringify(v ?? null))

function blankItem(list) {
  const item = {}
  for (const f of list.fields || []) item[f.k] = f.type === 'image' ? null : ''
  for (const sl of list.stringLists || []) item[sl.k] = []
  return item
}

function IconBtn({ onClick, title, disabled, variant = 'default', children }) {
  const variants = {
    default: 'border-gray-200 bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900',
    danger: 'border-red-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-300'
  }
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`inline-flex h-8 items-center justify-center rounded-lg border px-2.5 text-xs font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed ${variants[variant]}`}
    >
      {children}
    </button>
  )
}

const inputCls =
  'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-rocket-dark focus:border-ifoa-navy focus:outline-none focus:ring-1 focus:ring-ifoa-navy/20'

function ScalarField({ field, value, onChange }) {
  if (field.type === 'image') {
    return (
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-rocket-dark">{field.label}</label>
        <ImageUploader value={value || null} onChange={onChange} folder="pages" />
      </div>
    )
  }
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-rocket-dark">{field.label}</label>
      {field.type === 'textarea' ? (
        <textarea rows={3} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={inputCls} />
      ) : (
        <input type="text" value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={inputCls} />
      )}
    </div>
  )
}

function StringListField({ label, value, onChange }) {
  const arr = Array.isArray(value) ? value : []
  const setAt = (i, v) => onChange(arr.map((x, idx) => (idx === i ? v : x)))
  const remove = (i) => onChange(arr.filter((_, idx) => idx !== i))
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-rocket-dark">{label}</label>
      <div className="space-y-2">
        {arr.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input type="text" value={item} onChange={(e) => setAt(i, e.target.value)} className={inputCls} />
            <IconBtn onClick={() => remove(i)} title="Remove" variant="danger">
              <X className="h-3.5 w-3.5" />
            </IconBtn>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...arr, ''])}
        className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-gray-300 bg-white px-3 py-1.5 text-xs font-bold text-gray-600 hover:border-ifoa-navy hover:text-ifoa-navy transition-all"
      >
        <Plus className="h-3.5 w-3.5" /> Add
      </button>
    </div>
  )
}

function ListEditor({ list, value, onChange }) {
  const items = Array.isArray(value) ? value : []
  const setItem = (i, next) => onChange(items.map((x, idx) => (idx === i ? next : x)))
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i))
  const move = (i, dir) => {
    const j = i + dir
    if (j < 0 || j >= items.length) return
    const copy = [...items]
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
    onChange(copy)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{list.label}</span>
        <span className="rounded-md border border-gray-200 bg-white px-2 py-0.5 text-[11px] font-bold text-gray-500">
          {items.length}
        </span>
      </div>

      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                {list.itemLabel || 'Item'} {i + 1}
              </span>
              <div className="flex items-center gap-1">
                <IconBtn onClick={() => move(i, -1)} title="Move up" disabled={i === 0}>
                  <ArrowUp className="h-3.5 w-3.5" />
                </IconBtn>
                <IconBtn onClick={() => move(i, 1)} title="Move down" disabled={i === items.length - 1}>
                  <ArrowDown className="h-3.5 w-3.5" />
                </IconBtn>
                <IconBtn onClick={() => remove(i)} title="Remove" variant="danger">
                  <X className="h-3.5 w-3.5" />
                </IconBtn>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(list.fields || []).map((f) => (
                <div key={f.k} className={f.type === 'textarea' || f.type === 'image' ? 'sm:col-span-2' : ''}>
                  <ScalarField
                    field={f}
                    value={item[f.k]}
                    onChange={(v) => setItem(i, { ...item, [f.k]: v })}
                  />
                </div>
              ))}
            </div>

            {(list.stringLists || []).map((sl) => (
              <StringListField
                key={sl.k}
                label={sl.label}
                value={item[sl.k]}
                onChange={(v) => setItem(i, { ...item, [sl.k]: v })}
              />
            ))}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onChange([...items, blankItem(list)])}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-white py-2.5 text-xs font-bold text-gray-600 hover:border-ifoa-navy hover:text-ifoa-navy transition-all"
      >
        <Plus className="h-4 w-4" /> Add {list.itemLabel || 'item'}
      </button>
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
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
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

export default AdminPageEditorPage
