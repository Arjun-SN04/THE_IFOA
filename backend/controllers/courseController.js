const Course = require('../models/Course')
const { asyncHandler } = require('../middleware/error')
const { deleteObject } = require('../config/r2')

// Fields a client is never allowed to set directly.
const PROTECTED = ['_id', 'createdAt', 'updatedAt', '__v']

function sanitize(body) {
  const out = { ...body }
  for (const field of PROTECTED) delete out[field]
  return out
}

// ---------- Public ----------

// GET /api/courses?category=&q=&featured=
const listPublic = asyncHandler(async (req, res) => {
  const { category, q, featured } = req.query
  const filter = { status: 'published' }
  if (category && category !== 'all') filter.category = category
  if (featured === 'true') filter.featured = true
  if (q) filter.$text = { $search: q }

  const courses = await Course.find(filter)
    .sort({ featured: -1, order: 1, 'schedule.startDate': 1, createdAt: -1 })
    .lean()

  res.json({ count: courses.length, courses })
})

// GET /api/courses/:slug
const getBySlug = asyncHandler(async (req, res) => {
  const course = await Course.findOne({ slug: req.params.slug, status: 'published' }).lean()
  if (!course) return res.status(404).json({ message: 'Course not found' })
  res.json({ course })
})

// ---------- Admin ----------

// GET /api/admin/courses — includes drafts
const listAdmin = asyncHandler(async (req, res) => {
  const { status, q } = req.query
  const filter = {}
  if (status && status !== 'all') filter.status = status
  if (q) filter.title = { $regex: q, $options: 'i' }

  const courses = await Course.find(filter).sort({ updatedAt: -1 }).lean()
  res.json({ count: courses.length, courses })
})

// GET /api/admin/courses/:id
const getById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).lean()
  if (!course) return res.status(404).json({ message: 'Course not found' })
  res.json({ course })
})

// POST /api/admin/courses
const create = asyncHandler(async (req, res) => {
  const course = await Course.create(sanitize(req.body))
  res.status(201).json({ course })
})

// PUT /api/admin/courses/:id
const update = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
  if (!course) return res.status(404).json({ message: 'Course not found' })

  const keysBefore = new Set(course.imageKeys())
  course.set(sanitize(req.body))
  await course.save()

  // Drop R2 objects the course no longer references.
  const keysAfter = new Set(course.imageKeys())
  for (const key of keysBefore) {
    if (!keysAfter.has(key)) {
      // Orphaned files must not fail the update.
      deleteObject(key).catch((err) => console.warn('[r2] cleanup failed', key, err.message))
    }
  }

  res.json({ course })
})

// DELETE /api/admin/courses/:id
const remove = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
  if (!course) return res.status(404).json({ message: 'Course not found' })

  for (const key of course.imageKeys()) {
    deleteObject(key).catch((err) => console.warn('[r2] cleanup failed', key, err.message))
  }
  await course.deleteOne()

  res.json({ message: 'Course deleted' })
})

module.exports = { listPublic, getBySlug, listAdmin, getById, create, update, remove }
