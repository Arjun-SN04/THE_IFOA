const mongoose = require('mongoose')
const Course = require('../models/Course')
const FormSchema = require('../models/FormSchema')
const Submission = require('../models/Submission')
const { asyncHandler } = require('../middleware/error')
const { validateAnswers, findIntakeFieldId } = require('../utils/validateAnswers')

const STATUSES = ['new', 'contacted', 'confirmed', 'rejected']

// ---------- Public ----------

// POST /api/courses/:slug/register
const create = asyncHandler(async (req, res) => {
  const course = await Course.findOne({ slug: req.params.slug, status: 'published' })
  if (!course) return res.status(404).json({ message: 'Course not found' })
  if (!course.registrationOpen) {
    return res.status(409).json({ message: 'Registration is closed for this course' })
  }

  const { answers } = req.body || {}
  if (!answers || typeof answers !== 'object') {
    return res.status(400).json({ message: 'answers is required' })
  }

  const schema = await FormSchema.findOne({ course: course._id }).lean()
  if (!schema) {
    return res.status(409).json({ message: 'Registration is not open for this course' })
  }
  const sections = schema.sections

  const errors = validateAnswers(sections, answers)

  const intakeRef = findIntakeFieldId(sections)
  const intake = intakeRef ? answers[intakeRef.sectionId]?.[intakeRef.fieldId] || '' : ''

  // Enforce the intake choice only when the course actually offers intakes.
  if (intakeRef) {
    const section = sections.find((s) => s.id === intakeRef.sectionId)
    const field = section?.fields.find((f) => f.id === intakeRef.fieldId)
    const activeIntakes = (course.intakes || []).filter((i) => i.isActive)
    if (field?.required && activeIntakes.length > 0 && !intake) {
      errors.push(`${section.title}: ${field.label || 'Intake'} is required.`)
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors })
  }

  const submission = await Submission.create({
    course: course._id,
    courseTitle: course.title,
    courseRefCode: course.refCode,
    courseSlug: course.slug,
    formSchemaSnapshot: sections,
    intake,
    answers
  })

  res.status(201).json({
    message:
      'Enrollment received. Download your completed form below and email the signed copy to info@theIFOA.com.',
    submissionId: submission._id,
    id: submission._id
  })
})

// GET /api/submissions/:id - used by the public success screen to render the PDF.
const getPublicOne = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ message: 'Submission not found' })
  }
  const submission = await Submission.findById(req.params.id)
    .select('formSchemaSnapshot answers intake courseTitle courseRefCode submittedAt')
    .lean()
  if (!submission) return res.status(404).json({ message: 'Submission not found' })
  res.json({ submission })
})

// ---------- Admin ----------

// GET /api/admin/submissions?course=&status=&q=
const list = asyncHandler(async (req, res) => {
  const { course, status, q } = req.query
  const filter = {}
  if (course) filter.course = course
  if (status && status !== 'all') filter.status = status

  let submissions = await Submission.find(filter)
    .populate('course', 'title slug refCode')
    .sort({ submittedAt: -1 })
    .lean()

  if (q) {
    const needle = String(q).toLowerCase()
    submissions = submissions.filter((s) => {
      const hay = (
        JSON.stringify(s.answers || {}) +
        ' ' +
        (s.courseTitle || '') +
        ' ' +
        (s.intake || '')
      ).toLowerCase()
      return hay.includes(needle)
    })
  }

  res.json({ count: submissions.length, submissions })
})

// GET /api/admin/submissions/:id
const getOne = asyncHandler(async (req, res) => {
  const submission = await Submission.findById(req.params.id)
    .populate('course', 'title slug refCode')
    .lean()
  if (!submission) return res.status(404).json({ message: 'Submission not found' })
  res.json({ submission })
})

// PUT /api/admin/submissions/:id - edit answers and/or workflow fields.
const update = asyncHandler(async (req, res) => {
  const submission = await Submission.findById(req.params.id)
  if (!submission) return res.status(404).json({ message: 'Submission not found' })

  const { answers, status, adminNotes } = req.body || {}

  if (answers !== undefined) {
    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ message: 'answers must be an object' })
    }
    const errors = validateAnswers(submission.formSchemaSnapshot, answers)
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors })
    }
    submission.answers = answers

    const intakeRef = findIntakeFieldId(submission.formSchemaSnapshot)
    if (intakeRef) {
      const next = answers[intakeRef.sectionId]?.[intakeRef.fieldId]
      if (next) submission.intake = next
    }
  }

  if (status !== undefined) {
    if (!STATUSES.includes(status)) {
      return res.status(400).json({ message: `status must be one of: ${STATUSES.join(', ')}` })
    }
    submission.status = status
  }
  if (adminNotes !== undefined) submission.adminNotes = adminNotes

  await submission.save()
  res.json({ submission })
})

// DELETE /api/admin/submissions/:id
const remove = asyncHandler(async (req, res) => {
  const deleted = await Submission.findByIdAndDelete(req.params.id)
  if (!deleted) return res.status(404).json({ message: 'Submission not found' })
  res.json({ message: 'Submission deleted' })
})

// GET /api/admin/registrations/legacy - read-only view of the pre-dynamic-form
// Registration rows so historical data stays reachable.
const listLegacyRegistrations = asyncHandler(async (req, res) => {
  let Registration
  try {
    Registration = require('../models/Registration')
  } catch {
    return res.json({ count: 0, registrations: [] })
  }
  const registrations = await Registration.find({})
    .populate('course', 'title slug refCode')
    .sort({ createdAt: -1 })
    .lean()
  res.json({ count: registrations.length, registrations })
})

module.exports = { create, getPublicOne, list, getOne, update, remove, listLegacyRegistrations }
