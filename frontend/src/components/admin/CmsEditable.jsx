import { useEffect, useRef } from 'react'

// True inline editing for admin page content: the admin's live-preview iframe
// (?__preview=1, see usePageContent) renders the exact public page, and text
// wrapped in <CmsText> becomes directly contentEditable there. Edits post up
// to the parent admin tab (AdminPageEditorPage), which updates its `data`
// state and echoes it back down through the existing preview channel - same
// round trip the live-preview already used, just now driven from inside the
// iframe instead of a separate form.
export function isPreviewEditMode() {
  return typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('__preview') === '1'
}

const debounceTimers = {}

function postEdit(path, value) {
  window.parent.postMessage({ type: 'ifoa-edit-change', path, value }, window.location.origin)
}

function debouncedPostEdit(path, value) {
  clearTimeout(debounceTimers[path])
  debounceTimers[path] = setTimeout(() => postEdit(path, value), 150)
}

// Renders `value` as plain text on the real public site. Inside the admin
// preview iframe, renders the same text as an editable region in place - // no separate form field anywhere.
export function CmsText({ path, value, as: Tag = 'span', className = '' }) {
  const ref = useRef(null)
  const editing = isPreviewEditMode()

  useEffect(() => {
    if (!editing) return
    const el = ref.current
    if (!el) return
    // Only overwrite the DOM text when the field isn't focused, so the
    // round-tripped echo doesn't fight the admin's cursor mid-keystroke.
    if (document.activeElement !== el && el.innerText !== (value || '')) {
      el.innerText = value || ''
    }
  }, [value, editing])

  if (!editing) {
    return <Tag className={className}>{value}</Tag>
  }

  return (
    <Tag
      ref={ref}
      className={`${className} ifoa-cms-editable`}
      contentEditable
      suppressContentEditableWarning
      data-cms-path={path}
      // Many editable fields sit inside a button/Link whose own click
      // navigates somewhere (e.g. a CTA's label) - swallow the click here so
      // starting to edit never fires that navigation from inside the admin
      // preview iframe.
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onInput={(e) => debouncedPostEdit(path, e.currentTarget.innerText)}
      onBlur={(e) => postEdit(path, e.currentTarget.innerText)}
    />
  )
}

// Small "×" control shown over a list item (discipline card, pathway card,
// pillar, etc.) in edit mode only - removes that item from the array at
// `listPath` via the same postMessage channel as CmsText.
export function CmsRemoveItem({ listPath, index, label = 'Remove' }) {
  if (!isPreviewEditMode()) return null
  return (
    <button
      type="button"
      title={label}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        window.parent.postMessage({ type: 'ifoa-edit-remove', path: listPath, index }, window.location.origin)
      }}
      className="ifoa-cms-remove absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white text-xs font-bold shadow-md hover:bg-red-700 transition-colors cursor-pointer"
    >
      ×
    </button>
  )
}

// "+ Add" ghost tile appended after a list's rendered items in edit mode - // appends a blank item (shape given by `blank`) to the array at `listPath`.
export function CmsAddItem({ listPath, blank, label = 'Add' }) {
  if (!isPreviewEditMode()) return null
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        window.parent.postMessage({ type: 'ifoa-edit-add', path: listPath, blank }, window.location.origin)
      }}
      className="ifoa-cms-add flex min-h-[160px] w-full items-center justify-center rounded-3xl border-2 border-dashed border-emerald-400 text-emerald-700 font-bold text-sm hover:bg-emerald-50 transition-colors cursor-pointer"
    >
      + {label}
    </button>
  )
}
