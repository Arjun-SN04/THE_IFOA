import React from 'react'
import { Plus, X, ArrowUp, ArrowDown } from 'lucide-react'
import ImageUploader from '@/components/admin/ImageUploader'

// Shared schema-driven form building blocks used by both the global
// page-content editor (AdminPageEditorPage) and the per-course chrome-text
// editor (AdminCoursePageContentEditor). Both drive off the same
// SCHEMAS[page] shape from backend/utils/pageContent.js - groups of
// fields/lists - so the rendering internals live here once.

export const clone = (v) => JSON.parse(JSON.stringify(v ?? null))

export function blankItem(list) {
  const item = {}
  for (const f of list.fields || []) item[f.k] = f.type === 'image' ? null : ''
  for (const sl of list.stringLists || []) item[sl.k] = []
  return item
}

export function IconBtn({ onClick, title, disabled, variant = 'default', children }) {
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

export const inputCls =
  'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-rocket-dark focus:border-ifoa-navy focus:outline-none focus:ring-1 focus:ring-ifoa-navy/20'

export function ScalarField({ field, value, onChange }) {
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

export function StringListField({ label, value, onChange }) {
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

export function ListEditor({ list, value, onChange }) {
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
