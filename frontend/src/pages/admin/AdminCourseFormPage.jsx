import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Loader2, Plus, Trash2, Eye, FileText } from 'lucide-react'
import { api } from '@/lib/api'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { CourseCard } from '@/components/course/CourseCard'

const CATEGORIES = [
  'dispatch',
  'ground',
  'dangerous-goods',
  'train-the-trainer',
  'crew',
  'security',
  'human-factors',
  'consulting',
  'other'
]

const BLANK = {
  title: '',
  slug: '',
  refCode: '',
  branch: 'IFOA',
  category: 'dispatch',
  status: 'draft',
  featured: false,
  order: 0,
  summary: '',
  authority: '',
  format: '',
  careerPath: '',
  intakeLabel: '',
  heroImage: null,
  card: { image: null, badge: '', rating: '', reviewsLabel: '', durationLabel: '', blurb: '' },
  schedule: { mode: 'Onsite', startDate: '', endDate: '', timeText: '', timezone: '' },
  duration: '',
  location: '',
  price: { amount: '', currency: 'EUR', note: '' },
  whatYouWillLearn: { intro: '', points: [] },
  delivery: { intro: '', items: [] },
  trainingStandards: { intro: '', logos: [] },
  whoShouldAttend: { intro: '', points: [], outro: '' },
  courseContent: { intro: '', modules: [], note: '' },
  certification: { text: '', points: [] },
  registrationOpen: true,
  seats: '',
  intakes: [],
  seo: { metaTitle: '', metaDescription: '' }
}

const input =
  'w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-rocket-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rocket-lime focus:border-transparent focus:bg-white transition-all'

function Field({ label, hint, children, className = '' }) {
  return (
    <label className={`block space-y-1.5 ${className}`}>
      <span className="text-xs font-bold uppercase tracking-wider text-gray-700">{label}</span>
      {children}
      {hint && <span className="block text-[11px] text-gray-400 font-normal">{hint}</span>}
    </label>
  )
}

function Card({ title, children }) {
  return (
    <section className="rounded-2xl border border-gray-200/80 bg-white p-6 sm:p-7 space-y-5 shadow-xs">
      <h2 className="text-base font-bold text-rocket-dark pb-2 border-b border-gray-100 flex items-center gap-2">
        <span>{title}</span>
      </h2>
      {children}
    </section>
  )
}

/** Editable list of plain strings (bullets, modules). */
function StringList({ label, items, onChange, placeholder }) {
  return (
    <div className="space-y-2">
      <span className="text-xs font-bold uppercase tracking-wider text-gray-700 block">{label}</span>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            className={input}
            value={item}
            placeholder={placeholder}
            onChange={(e) => {
              const next = [...items]
              next[i] = e.target.value
              onChange(next)
            }}
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
            title="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ''])}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-rocket-dark hover:text-blue-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
      >
        <Plus className="w-3.5 h-3.5" /> Add Point
      </button>
    </div>
  )
}

// Mongo returns ISO datetimes; <input type="date"> needs yyyy-mm-dd.
function toDateInput(value) {
  if (!value) return ''
  return new Date(value).toISOString().slice(0, 10)
}

export function AdminCourseFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState(BLANK)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    api
      .adminGetCourse(id)
      .then(({ course }) => {
        setForm({
          ...BLANK,
          ...course,
          schedule: {
            ...BLANK.schedule,
            ...course.schedule,
            startDate: toDateInput(course.schedule?.startDate),
            endDate: toDateInput(course.schedule?.endDate)
          },
          price: { ...BLANK.price, ...course.price, amount: course.price?.amount ?? '' },
          card: { ...BLANK.card, ...course.card, rating: course.card?.rating ?? '' },
          seats: course.seats ?? '',
          intakes: (course.intakes || []).map((i) => ({
            label: i.label || '',
            startDate: toDateInput(i.startDate),
            isActive: i.isActive !== false
          }))
        })
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const set = (key) => (e) => {
    const value = e?.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const setNested = (section, key) => (e) => {
    const value = e?.target ? e.target.value : e
    setForm((prev) => ({ ...prev, [section]: { ...prev[section], [key]: value } }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const payload = {
        ...form,
        order: Number(form.order) || 0,
        seats: form.seats === '' ? null : Number(form.seats),
        schedule: {
          ...form.schedule,
          startDate: form.schedule.startDate || null,
          endDate: form.schedule.endDate || null
        },
        card: {
          ...form.card,
          rating: form.card.rating === '' ? null : Number(form.card.rating)
        },
        price: {
          ...form.price,
          amount: form.price.amount === '' ? null : Number(form.price.amount)
        },
        intakes: form.intakes
          .filter((i) => i.label.trim())
          .map((i) => ({ label: i.label.trim(), startDate: i.startDate || null, isActive: i.isActive !== false }))
      }

      if (isEdit) {
        await api.adminUpdateCourse(id, payload)
      } else {
        const { course } = await api.adminCreateCourse(payload)
        navigate(`/admin/courses/${course._id}`, { replace: true })
      }
      navigate('/admin/courses')
    } catch (err) {
      setError(err.message)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-12 border border-gray-200/80 text-center flex flex-col items-center justify-center gap-3 max-w-4xl mx-auto my-8">
        <Loader2 className="w-8 h-8 animate-spin text-rocket-dark" />
        <p className="text-sm font-medium text-gray-500">Loading course curriculum…</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto pb-20">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
        <div>
          <Link
            to="/admin/courses"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-rocket-dark transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Courses
          </Link>
          <h1 className="text-xl sm:text-2xl font-black text-rocket-dark mt-1">
            {isEdit ? 'Edit Course Program' : 'Create New Course Program'}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {isEdit && (
            <Link
              to={`/admin/courses/${id}/form`}
              title="Customise this course's enrollment form"
              className="inline-flex items-center gap-2 border border-gray-300 text-rocket-dark font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <FileText className="w-4 h-4" /> Enrollment Form
            </Link>
          )}
          {isEdit && (
            <a
              href={`/admin/courses/${id}/preview`}
              target="_blank"
              rel="noreferrer"
              title="Opens the last saved version in a new tab"
              className="inline-flex items-center gap-2 border border-gray-300 text-rocket-dark font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Eye className="w-4 h-4" /> Preview
            </a>
          )}
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#020617] text-white hover:bg-black font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl disabled:opacity-60 transition-all shadow-sm hover:scale-[1.02]"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin text-rocket-lime" />}
            <span>{saving ? 'Saving…' : 'Save Course'}</span>
          </button>
        </div>
      </div>

      {isEdit && (
        <p className="text-xs text-gray-400 -mt-2">
          Preview opens the last <span className="font-semibold">saved</span> version - save first to see recent edits.
        </p>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">{error}</p>
      )}

      <Card title="Basics">
        <Field label="Title">
          <input className={input} value={form.title} onChange={set('title')} required />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Slug" hint="Leave blank to generate from the title">
            <input className={input} value={form.slug} onChange={set('slug')} />
          </Field>
          <Field label="Reference Code" hint="e.g. IPIN2501">
            <input className={input} value={form.refCode} onChange={set('refCode')} />
          </Field>
          <Field label="Branch">
            <input className={input} value={form.branch} onChange={set('branch')} />
          </Field>
          <Field label="Category">
            <select className={input} value={form.category} onChange={set('category')}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Status">
            <select className={input} value={form.status} onChange={set('status')}>
              <option value="draft">Draft (hidden)</option>
              <option value="published">Published (live)</option>
            </select>
          </Field>
          <Field label="Sort order" hint="Lower shows first">
            <input type="number" className={input} value={form.order} onChange={set('order')} />
          </Field>
        </div>
        <Field label="Summary" hint="Shown under the title on the catalog card">
          <textarea rows={3} className={input} value={form.summary} onChange={set('summary')} />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Authority badge" hint="e.g. EASA / FAA Part 65 Standards">
            <input className={input} value={form.authority} onChange={set('authority')} />
          </Field>
          <Field label="Format" hint="e.g. Hybrid Online + In-Person Simulator Sessions">
            <input className={input} value={form.format} onChange={set('format')} />
          </Field>
          <Field label="Target roles" hint="Shown as 'Target Roles' on the card">
            <input className={input} value={form.careerPath} onChange={set('careerPath')} />
          </Field>
          <Field label="Intake label" hint="Used when there is no fixed start date">
            <input className={input} value={form.intakeLabel} onChange={set('intakeLabel')} />
          </Field>
        </div>
        <div className="flex flex-wrap gap-6 pt-1">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={set('featured')}
              className="w-4 h-4 accent-rocket-dark"
            />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.registrationOpen}
              onChange={set('registrationOpen')}
              className="w-4 h-4 accent-rocket-dark"
            />
            Registration open
          </label>
        </div>
      </Card>

      <Card title="Hero Image">
        <ImageUploader
          value={form.heroImage}
          onChange={(v) => setForm((prev) => ({ ...prev, heroImage: v }))}
          folder="courses"
        />
      </Card>

      <Card title="Catalog Card">
        <p className="text-[11px] text-gray-400 -mt-1">
          Controls how this course looks on the Events &amp; Courses grid. Blank fields fall back to
          the hero image, summary, authority and duration above.
        </p>

        <div className="grid lg:grid-cols-2 gap-6 items-start">
          <div className="space-y-4">
            <ImageUploader
              label="Card image"
              value={form.card.image}
              onChange={(v) => setForm((prev) => ({ ...prev, card: { ...prev.card, image: v } }))}
              folder="course-cards"
            />
            <Field label="Badge" hint="Top-right pill - defaults to Authority badge">
              <input className={input} value={form.card.badge} onChange={setNested('card', 'badge')} />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Rating" hint="0–5">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  className={input}
                  value={form.card.rating}
                  onChange={setNested('card', 'rating')}
                />
              </Field>
              <Field label="Reviews label" hint='e.g. "480+ Reviews"'>
                <input
                  className={input}
                  value={form.card.reviewsLabel}
                  onChange={setNested('card', 'reviewsLabel')}
                />
              </Field>
            </div>
            <Field label="Duration pill" hint="Bottom-right pill - defaults to Duration">
              <input
                className={input}
                value={form.card.durationLabel}
                onChange={setNested('card', 'durationLabel')}
              />
            </Field>
            <Field label="Card blurb" hint="Defaults to Summary">
              <textarea
                rows={3}
                className={input}
                value={form.card.blurb}
                onChange={setNested('card', 'blurb')}
              />
            </Field>
          </div>

          <div className="lg:sticky lg:top-4">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Live preview</p>
            <div className="rounded-2xl bg-gray-100 p-4">
              <CourseCard course={form} preview />
            </div>
          </div>
        </div>
      </Card>

      <Card title="Schedule & Pricing">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Mode">
            <select className={input} value={form.schedule.mode} onChange={setNested('schedule', 'mode')}>
              <option>Onsite</option>
              <option>Online</option>
              <option>Hybrid</option>
            </select>
          </Field>
          <Field label="Duration" hint="e.g. 4 Weeks">
            <input className={input} value={form.duration} onChange={set('duration')} />
          </Field>
          <Field label="Start date">
            <input
              type="date"
              className={input}
              value={form.schedule.startDate}
              onChange={setNested('schedule', 'startDate')}
            />
          </Field>
          <Field label="End date">
            <input
              type="date"
              className={input}
              value={form.schedule.endDate}
              onChange={setNested('schedule', 'endDate')}
            />
          </Field>
          <Field label="Time text" hint="e.g. MO - FRI 0900AM - 0500PM IST">
            <input
              className={input}
              value={form.schedule.timeText}
              onChange={setNested('schedule', 'timeText')}
            />
          </Field>
          <Field label="Timezone" hint="e.g. IST, CET">
            <input
              className={input}
              value={form.schedule.timezone}
              onChange={setNested('schedule', 'timezone')}
            />
          </Field>
          <Field label="Location">
            <input className={input} value={form.location} onChange={set('location')} />
          </Field>
          <Field label="Seats" hint="Optional">
            <input type="number" className={input} value={form.seats} onChange={set('seats')} />
          </Field>
          <Field label="Price">
            <input
              type="number"
              className={input}
              value={form.price.amount}
              onChange={setNested('price', 'amount')}
            />
          </Field>
          <Field label="Currency">
            <input
              className={input}
              value={form.price.currency}
              onChange={setNested('price', 'currency')}
            />
          </Field>
          <Field label="Price note" className="sm:col-span-2" hint="e.g. 18% GST must be added">
            <input className={input} value={form.price.note} onChange={setNested('price', 'note')} />
          </Field>
        </div>
      </Card>

      <Card title="Enrollment Intakes">
        <p className="text-[11px] text-gray-400 -mt-1">
          Scheduled intakes offered for this course. If the enrollment form has an “Intake” field, these
          active entries become its options. Leave empty for a single rolling intake.
        </p>
        {form.intakes.map((intake, i) => (
          <div key={i} className="rounded-lg border border-black/10 p-4 grid sm:grid-cols-[1fr_170px_auto_auto] gap-3 items-end">
            <Field label="Label" hint="e.g. March 2026 — New Delhi">
              <input
                className={input}
                value={intake.label}
                onChange={(e) => {
                  const next = [...form.intakes]
                  next[i] = { ...intake, label: e.target.value }
                  setForm((prev) => ({ ...prev, intakes: next }))
                }}
              />
            </Field>
            <Field label="Start date">
              <input
                type="date"
                className={input}
                value={intake.startDate}
                onChange={(e) => {
                  const next = [...form.intakes]
                  next[i] = { ...intake, startDate: e.target.value }
                  setForm((prev) => ({ ...prev, intakes: next }))
                }}
              />
            </Field>
            <label className="flex items-center gap-2 text-sm pb-2.5">
              <input
                type="checkbox"
                checked={intake.isActive !== false}
                onChange={(e) => {
                  const next = [...form.intakes]
                  next[i] = { ...intake, isActive: e.target.checked }
                  setForm((prev) => ({ ...prev, intakes: next }))
                }}
                className="w-4 h-4 accent-rocket-dark"
              />
              Active
            </label>
            <button
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, intakes: prev.intakes.filter((_, x) => x !== i) }))}
              className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors mb-1"
              title="Remove intake"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setForm((prev) => ({ ...prev, intakes: [...prev.intakes, { label: '', startDate: '', isActive: true }] }))
          }
          className="inline-flex items-center gap-1.5 text-xs font-bold text-rocket-dark hover:text-blue-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add intake
        </button>
      </Card>

      {isEdit && (
        <Card title="Enrollment Form">
          <p className="text-sm text-gray-600 -mt-1">
            The multi-section form candidates fill on the course page. Fully customisable — sections, fields,
            field types, required flags and order.
          </p>
          <Link
            to={`/admin/courses/${id}/form`}
            className="inline-flex items-center gap-2 bg-ifoa-navy text-slate-950 font-extrabold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl hover:bg-ifoa-navy-light transition-colors w-fit"
          >
            <FileText className="w-4 h-4" /> Edit enrollment form
          </Link>
        </Card>
      )}

      <Card title="What You Will Learn">
        <Field label="Intro">
          <textarea
            rows={3}
            className={input}
            value={form.whatYouWillLearn.intro}
            onChange={setNested('whatYouWillLearn', 'intro')}
          />
        </Field>
        <StringList
          label="Points"
          items={form.whatYouWillLearn.points}
          onChange={(points) =>
            setForm((prev) => ({ ...prev, whatYouWillLearn: { ...prev.whatYouWillLearn, points } }))
          }
        />
      </Card>

      <Card title="Course Delivery">
        <Field label="Intro">
          <textarea
            rows={2}
            className={input}
            value={form.delivery.intro}
            onChange={setNested('delivery', 'intro')}
          />
        </Field>

        {form.delivery.items.map((item, i) => (
          <div key={i} className="rounded-lg border border-black/10 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Block {i + 1}
              </span>
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    delivery: { ...prev.delivery, items: prev.delivery.items.filter((_, x) => x !== i) }
                  }))
                }
                className="text-gray-400 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Label" hint="e.g. School / Format">
                <input
                  className={input}
                  value={item.label}
                  onChange={(e) => {
                    const items = [...form.delivery.items]
                    items[i] = { ...item, label: e.target.value }
                    setForm((prev) => ({ ...prev, delivery: { ...prev.delivery, items } }))
                  }}
                />
              </Field>
              <Field label="Title">
                <input
                  className={input}
                  value={item.title}
                  onChange={(e) => {
                    const items = [...form.delivery.items]
                    items[i] = { ...item, title: e.target.value }
                    setForm((prev) => ({ ...prev, delivery: { ...prev.delivery, items } }))
                  }}
                />
              </Field>
            </div>
            <Field label="Description">
              <textarea
                rows={2}
                className={input}
                value={item.description}
                onChange={(e) => {
                  const items = [...form.delivery.items]
                  items[i] = { ...item, description: e.target.value }
                  setForm((prev) => ({ ...prev, delivery: { ...prev.delivery, items } }))
                }}
              />
            </Field>
            <ImageUploader
              label="Logo"
              value={item.image}
              folder="delivery"
              onChange={(image) => {
                const items = [...form.delivery.items]
                items[i] = { ...item, image }
                setForm((prev) => ({ ...prev, delivery: { ...prev.delivery, items } }))
              }}
            />
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            setForm((prev) => ({
              ...prev,
              delivery: {
                ...prev.delivery,
                items: [...prev.delivery.items, { label: '', title: '', description: '', image: null }]
              }
            }))
          }
          className="inline-flex items-center gap-1.5 text-xs font-bold text-rocket-dark hover:underline"
        >
          <Plus className="w-3.5 h-3.5" /> Add delivery block
        </button>
      </Card>

      <Card title="Training Standards">
        <Field label="Intro">
          <textarea
            rows={4}
            className={input}
            value={form.trainingStandards.intro}
            onChange={setNested('trainingStandards', 'intro')}
          />
        </Field>
        <ImageUploader
          label="Accreditation logos"
          multiple
          folder="standards"
          value={form.trainingStandards.logos}
          onChange={(logos) =>
            setForm((prev) => ({ ...prev, trainingStandards: { ...prev.trainingStandards, logos } }))
          }
        />
      </Card>

      <Card title="Who Should Attend">
        <Field label="Intro">
          <textarea
            rows={2}
            className={input}
            value={form.whoShouldAttend.intro}
            onChange={setNested('whoShouldAttend', 'intro')}
          />
        </Field>
        <StringList
          label="Audience bullets"
          items={form.whoShouldAttend.points}
          onChange={(points) =>
            setForm((prev) => ({ ...prev, whoShouldAttend: { ...prev.whoShouldAttend, points } }))
          }
        />
        <Field label="Closing paragraph">
          <textarea
            rows={3}
            className={input}
            value={form.whoShouldAttend.outro}
            onChange={setNested('whoShouldAttend', 'outro')}
          />
        </Field>
      </Card>

      <Card title="Course Content">
        <Field label="Intro">
          <textarea
            rows={2}
            className={input}
            value={form.courseContent.intro}
            onChange={setNested('courseContent', 'intro')}
          />
        </Field>
        <StringList
          label="Modules"
          items={form.courseContent.modules}
          onChange={(modules) =>
            setForm((prev) => ({ ...prev, courseContent: { ...prev.courseContent, modules } }))
          }
        />
        <Field label="Note">
          <input
            className={input}
            value={form.courseContent.note}
            onChange={setNested('courseContent', 'note')}
          />
        </Field>
      </Card>

      <Card title="Certification">
        <Field label="Text">
          <textarea
            rows={3}
            className={input}
            value={form.certification.text}
            onChange={setNested('certification', 'text')}
          />
        </Field>
        <StringList
          label="Bullets"
          items={form.certification.points}
          onChange={(points) =>
            setForm((prev) => ({ ...prev, certification: { ...prev.certification, points } }))
          }
        />
      </Card>

      <Card title="SEO">
        <Field label="Meta title">
          <input className={input} value={form.seo.metaTitle} onChange={setNested('seo', 'metaTitle')} />
        </Field>
        <Field label="Meta description">
          <textarea
            rows={2}
            className={input}
            value={form.seo.metaDescription}
            onChange={setNested('seo', 'metaDescription')}
          />
        </Field>
      </Card>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-rocket-dark text-white font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-lg hover:bg-black disabled:opacity-60 transition"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saving ? 'Saving…' : 'Save Course'}
        </button>
      </div>
    </form>
  )
}

export default AdminCourseFormPage
