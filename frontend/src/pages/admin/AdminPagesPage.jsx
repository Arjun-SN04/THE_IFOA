import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, FileText, ChevronRight, ExternalLink } from 'lucide-react'
import { api } from '@/lib/api'

const PATH_BY_PAGE = {
  services: '/services',
  about: '/about',
  contact: '/contact',
  events: '/events'
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
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
        {error}
      </div>
    )
  }

  if (!pages) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <Loader2 className="h-8 w-8 animate-spin text-ifoa-navy" />
        <p className="mt-3 text-xs font-semibold text-gray-500">Loading pages…</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
          Overview / Site Content
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-rocket-dark mt-1">Site Pages</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Edit the copy, cards and lists shown on each public marketing page.
        </p>
      </div>

      <div className="space-y-3">
        {pages.map((p) => (
          <div
            key={p.page}
            className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200/90 bg-white p-4 sm:p-5 shadow-xs hover:border-ifoa-navy/40 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#38b58a]/10 text-[#38b58a]">
                <FileText className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-rocket-dark truncate">{p.label} page</p>
                <p className="text-[11px] text-gray-500">
                  {p.customized ? (
                    <span className="text-emerald-600 font-semibold">
                      Customized
                      {p.updatedAt ? ` · ${new Date(p.updatedAt).toLocaleDateString()}` : ''}
                    </span>
                  ) : (
                    <span className="text-gray-400 font-semibold">Using default content</span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {PATH_BY_PAGE[p.page] && (
                <a
                  href={PATH_BY_PAGE[p.page]}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 border border-gray-300 text-rocket-dark font-bold text-xs uppercase tracking-wider px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> View
                </a>
              )}
              <Link
                to={`/admin/pages/${p.page}`}
                className="inline-flex items-center gap-1.5 bg-[#020617] text-white hover:bg-black font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-xl transition-all"
              >
                Edit <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminPagesPage
