import React, { useEffect, useState } from 'react'
import {
  RiCheckboxCircleFill,
  RiLoader4Line,
  RiDownload2Line,
  RiAlertFill
} from 'react-icons/ri'
import { api } from '@/lib/api'
import { DynamicSection } from '@/components/formEngine/DynamicSection'
import {
  buildEmptyAnswers,
  isSectionComplete,
  isTrackableSection,
  getDetailedValidationErrors
} from '@/components/formEngine/formSchema'
import { downloadEnrollmentPdf } from '@/pdf/generateEnrollmentPdf'

export function RegistrationForm({ slug, courseTitle }) {
  const [sections, setSections] = useState(null)
  const [formAvailable, setFormAvailable] = useState(true)
  const [course, setCourse] = useState(null)
  const [answers, setAnswers] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [errors, setErrors] = useState([])
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const [done, setDone] = useState(null) // submission id
  const [pdfBusy, setPdfBusy] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setLoadError('')
    api
      .getCourseForm(slug)
      .then((data) => {
        if (cancelled) return
        const sorted = [...(data.sections || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        setFormAvailable(data.formAvailable !== false && sorted.length > 0)
        setSections(sorted)
        setCourse(data.course)
        setAnswers(buildEmptyAnswers(sorted))
      })
      .catch((err) => !cancelled && setLoadError(err.message))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [slug])

  const intakes = course?.intakes || []

  function updateSection(sectionId, sectionAnswers) {
    setAnswers((prev) => ({ ...prev, [sectionId]: sectionAnswers }))
    setFieldErrors((prev) => {
      const next = { ...prev }
      for (const key of Object.keys(next)) {
        if (key.startsWith(`${sectionId}.`)) delete next[key]
      }
      return next
    })
  }

  async function handleDownloadPdf() {
    if (!done || !sections || !answers) return
    setPdfBusy(true)
    try {
      await downloadEnrollmentPdf({
        courseTitle: courseTitle || course?.title || 'IFOA Course',
        submissionId: done.submissionId || done._id || '',
        referenceCode: done.referenceCode || '',
        submittedAt: done.createdAt || new Date().toISOString(),
        sections,
        answers,
        intakes
      })
    } catch (err) {
      console.error('PDF export failed:', err)
      alert('Could not generate PDF: ' + (err.message || 'unknown error'))
    } finally {
      setPdfBusy(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const detailed = getDetailedValidationErrors(sections, answers)

    // Require an intake choice only when the course offers intakes.
    if (intakes.length > 0) {
      for (const section of sections) {
        const f = section.fields.find((x) => x.type === 'intake' && x.required)
        if (f && !answers[section.id]?.[f.id]) {
          detailed.unshift({
            sectionId: section.id,
            fieldId: f.id,
            label: f.label || 'Intake',
            message: `${section.title}: ${f.label || 'Intake'} is required.`
          })
        }
      }
    }

    if (detailed.length > 0) {
      const map = {}
      detailed.forEach((err) => {
        map[`${err.sectionId}.${err.fieldId}`] = `${err.label} is required`
        map[err.fieldId] = `${err.label} is required`
      })
      setFieldErrors(map)
      setErrors(detailed.map((d) => d.message))
      const first = detailed[0]
      const target =
        document.getElementById(first.fieldId) ||
        document.getElementById(`field-wrap-${first.fieldId}`) ||
        document.getElementById(`section-${first.sectionId}`)
      target?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setFieldErrors({})
    setErrors([])
    setSubmitError('')
    setSubmitting(true)
    try {
      const data = await api.submitCourseForm(slug, answers)
      setDone(data.submissionId || data.id)
      window.scrollTo({
        top: (document.getElementById('register')?.offsetTop || 0) - 80,
        behavior: 'smooth'
      })
    } catch (err) {
      if (Array.isArray(err.errors) && err.errors.length) {
        setErrors(err.errors)
      } else {
        setSubmitError(err.message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDownloadPdf() {
    if (!done) return
    setPdfBusy(true)
    try {
      const { submission } = await api.getSubmission(done)
      await downloadEnrollmentPdf(submission, `IFOA-Enrollment-${done}.pdf`)
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setPdfBusy(false)
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center flex flex-col items-center gap-3">
        <RiLoader4Line className="w-7 h-7 animate-spin text-rocket-dark" />
        <p className="text-sm font-medium text-gray-500">Loading enrollment form…</p>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center space-y-2">
        <AlertTriangle className="w-8 h-8 mx-auto text-red-500" />
        <p className="text-sm font-semibold text-red-700">Could not load the enrollment form</p>
        <p className="text-xs text-red-600">{loadError}</p>
      </div>
    )
  }

  if (!formAvailable || (course && course.registrationOpen === false)) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center space-y-2">
        <AlertTriangle className="w-8 h-8 mx-auto text-amber-500" />
        <p className="text-base font-bold text-amber-900">Registration is not open yet</p>
        <p className="text-sm text-amber-700">
          The application form for this program has not been published. Contact{' '}
          <a className="underline font-semibold" href="mailto:info@theifoa.com">info@theifoa.com</a> to be
          notified when the next intake opens.
        </p>
      </div>
    )
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-rocket-lime bg-rocket-lime/10 p-8 text-center space-y-4">
        <CheckCircle2 className="w-12 h-12 mx-auto text-rocket-dark" />
        <h2 className="text-2xl font-bold text-rocket-dark">Enrollment submitted</h2>
        <p className="text-gray-700 max-w-lg mx-auto text-sm">
          Download your completed enrollment form, sign it, and email the signed copy plus two ID copies to{' '}
          <a className="font-semibold underline" href="mailto:info@theifoa.com">info@theifoa.com</a>. Our
          admissions team will confirm your place and issue the invoice.
        </p>
        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={pdfBusy}
          className="inline-flex items-center gap-2 bg-[#34E06E] hover:bg-[#28c85e] text-slate-950 font-extrabold text-sm px-6 py-3 rounded-xl shadow-md disabled:opacity-60 transition"
        >
          {pdfBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {pdfBusy ? 'Preparing PDF…' : 'Download Official PDF'}
        </button>
        <p className="text-[11px] text-gray-500">Reference: {done}</p>
      </div>
    )
  }

  const trackable = sections.filter((s) => isTrackableSection(s))
  const completed = trackable.filter((s) => isSectionComplete(s, answers[s.id])).length

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm bg-white"
    >
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 px-6 sm:px-8 py-6 sm:py-7 text-white border-b border-slate-800">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 inline-block">
              Candidate Registration Form
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
              {courseTitle || 'Flight Operations & Dispatch Program'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Please complete all required fields marked with an asterisk (<span className="text-red-400 font-bold">*</span>)
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20 shrink-0 mt-1">
            Official Intake Form
          </span>
        </div>
      </div>

      <div className="p-5 sm:p-8 bg-white">
        {errors.length > 0 && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50/90 p-4">
            <p className="text-sm font-bold text-red-900">
              Please complete all required fields ({errors.length}):
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs font-medium text-red-700">
              {errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-2">
          {sections.map((section, idx) => (
            <DynamicSection
              key={section.id}
              section={section}
              stepNumber={idx + 1}
              intakes={intakes}
              value={answers[section.id]}
              fieldErrors={fieldErrors}
              onChange={(sa) => updateSection(section.id, sa)}
            />
          ))}
        </div>

        {submitError && (
          <p className="mt-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
            {submitError}
          </p>
        )}

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-6">
          <p className="text-xs text-slate-500 font-medium">
            {trackable.length > 0
              ? `${completed} of ${trackable.length} sections complete • Encrypted & Confidential`
              : 'Encrypted & Confidential'}
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#34E06E] hover:bg-[#28c85e] text-slate-950 font-extrabold text-sm px-8 py-4 rounded-xl shadow-[0_4px_20px_rgba(52, 224, 110,0.35)] disabled:opacity-60 disabled:cursor-not-allowed transition transform hover:-translate-y-0.5"
          >
            {submitting && <RiLoader4Line className="w-4 h-4 animate-spin" />}
            {submitting ? 'Submitting Application…' : 'Submit Application Now'}
          </button>
        </div>
      </div>
    </form>
  )
}

export default RegistrationForm
