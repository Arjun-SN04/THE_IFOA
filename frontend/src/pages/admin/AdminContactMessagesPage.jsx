import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, Mail, Clock, Phone, CheckCircle2, Search, Trash2, ChevronRight } from 'lucide-react'
import { api } from '@/lib/api'

const STATUSES = ['new', 'contacted', 'closed']

const STATUS_BADGE = {
  new: 'bg-blue-50 text-blue-700 border-blue-200',
  contacted: 'bg-amber-50 text-amber-700 border-amber-200',
  closed: 'bg-emerald-50 text-emerald-700 border-emerald-200'
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

export function AdminContactMessagesPage() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('all')
  const [q, setQ] = useState('')
  const [busyId, setBusyId] = useState(null)

  function load() {
    setLoading(true)
    setError('')
    api
      .adminListContactMessages({ status, q })
      .then((d) => setMessages(d.messages))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  async function handleDelete(m) {
    const name = `${m.firstName} ${m.lastName}`
    if (!window.confirm(`Delete message from "${name}"? This cannot be undone.`)) return
    setBusyId(m._id)
    try {
      await api.adminDeleteContactMessage(m._id)
      setMessages((prev) => prev.filter((x) => x._id !== m._id))
    } catch (err) {
      alert(err.message)
    } finally {
      setBusyId(null)
    }
  }

  const counts = useMemo(() => {
    const c = { new: 0, contacted: 0, closed: 0 }
    for (const m of messages) c[m.status] = (c[m.status] || 0) + 1
    return c
  }, [messages])

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Stat label="Total" value={messages.length} tone="text-rocket-dark"
          icon={{ C: Mail, bg: 'bg-purple-50 text-purple-600' }} />
        <Stat label="New" value={counts.new} tone="text-blue-600"
          icon={{ C: Clock, bg: 'bg-blue-50 text-blue-600' }} />
        <Stat label="Contacted" value={counts.contacted} tone="text-amber-600"
          icon={{ C: Phone, bg: 'bg-amber-50 text-amber-600' }} />
        <Stat label="Closed" value={counts.closed} tone="text-emerald-600"
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
              placeholder="Search name, email, message…"
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
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">{error}</div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-200/80 text-center flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-rocket-dark" />
          <p className="text-sm font-medium text-gray-500">Loading messages…</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-200/80 text-center space-y-2">
          <p className="text-sm font-bold text-rocket-dark">No contact messages found</p>
          <p className="text-xs text-gray-500">Enquiries submitted through the public contact form appear here.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[820px]">
              <thead>
                <tr className="bg-gray-50/75 border-b border-gray-200 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  <th className="px-6 py-3.5">Contact</th>
                  <th className="px-5 py-3.5">Topic</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Received</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {messages.map((m) => (
                  <tr key={m._id} className="hover:bg-gray-50/75 transition-colors group">
                    <td className="px-6 py-4">
                      <Link
                        to={`/admin/contact-messages/${m._id}`}
                        className="font-bold text-rocket-dark group-hover:text-blue-600 transition-colors"
                      >
                        {m.firstName} {m.lastName}
                      </Link>
                      <p className="text-xs text-gray-400">{m.email}</p>
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold text-gray-600">{m.topic || '—'}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${
                          STATUS_BADGE[m.status] || STATUS_BADGE.new
                        }`}
                      >
                        <span className="capitalize">{m.status}</span>
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-600">
                      {new Date(m.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDelete(m)}
                          disabled={busyId === m._id}
                          title="Delete"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <Link
                          to={`/admin/contact-messages/${m._id}`}
                          className="inline-flex items-center gap-1 rounded-xl bg-[#020617] hover:bg-[#34E06E] text-white hover:text-black px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider transition-all shadow-2xs"
                        >
                          <span>View</span>
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminContactMessagesPage
