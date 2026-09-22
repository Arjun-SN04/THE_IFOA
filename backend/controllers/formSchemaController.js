const FormSchema = require('../models/FormSchema')
const Course = require('../models/Course')
const { asyncHandler } = require('../middleware/error')
const { defaultFormSchema } = require('../utils/defaultFormSchema')

// ---------- Template (the default cloned into new courses) ----------

async function getOrCreateTemplate() {
  let template = await FormSchema.findOne({ isTemplate: true })
  if (!template) {
    template = await FormSchema.create({ isTemplate: true, sections: defaultFormSchema.sections })
  }
  return template
}

// GET /api/admin/form-template
const getTemplate = asyncHandler(async (req, res) => {
  const template = await getOrCreateTemplate()
  res.json({ schema: template })
})

// PUT /api/admin/form-template
const updateTemplate = asyncHandler(async (req, res) => {
  const { sections } = req.body || {}
  if (!Array.isArray(sections)) {
    return res.status(400).json({ message: 'sections must be an array' })
  }
  const template = await getOrCreateTemplate()
  template.sections = sections
  await template.save()
  res.json({ schema: template })
})

// ---------- Per-course schema ----------

// GET /api/admin/courses/:id/form-schema
// Returns the course's own schema, or the template sections as a starting
// point (with `usingTemplate: true`) if the course has none yet.
const getCourseSchema = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).select('_id title slug intakes').lean()
  if (!course) return res.status(404).json({ message: 'Course not found' })

  const schema = await FormSchema.findOne({ course: course._id })
  if (schema) {
    return res.json({ schema, course, usingTemplate: false })
  }

  const template = await getOrCreateTemplate()
  res.json({
    schema: { course: course._id, sections: template.sections },
    course,
    usingTemplate: true
  })
})

// PUT /api/admin/courses/:id/form-schema
const updateCourseSchema = asyncHandler(async (req, res) => {
  const { sections } = req.body || {}
  if (!Array.isArray(sections)) {
    return res.status(400).json({ message: 'sections must be an array' })
  }
  const course = await Course.findById(req.params.id).select('_id')
  if (!course) return res.status(404).json({ message: 'Course not found' })

  const schema = await FormSchema.findOneAndUpdate(
    { course: course._id },
    { $set: { sections, isTemplate: false } },
    { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true }
  )
  res.json({ schema, usingTemplate: false })
})

// DELETE /api/admin/courses/:id/form-schema - revert to the template.
const resetCourseSchema = asyncHandler(async (req, res) => {
  await FormSchema.deleteOne({ course: req.params.id })
  const template = await getOrCreateTemplate()
  res.json({
    schema: { course: req.params.id, sections: template.sections },
    usingTemplate: true
  })
})

// ---------- Public ----------

// GET /api/courses/:slug/form - the live form a student fills.
const getPublicCourseForm = asyncHandler(async (req, res) => {
  const course = await Course.findOne({ slug: req.params.slug, status: 'published' })
    .select('_id title slug registrationOpen intakes')
    .lean()
  if (!course) return res.status(404).json({ message: 'Course not found' })

  // No template fallback: a course only has a live public form once the admin
  // has actually built one for it. Otherwise the enrollment page shows a
  // "registration not open" state instead of a generic default form.
  const schema = await FormSchema.findOne({ course: course._id }).lean()

  res.json({
    course: {
      _id: course._id,
      title: course.title,
      slug: course.slug,
      registrationOpen: course.registrationOpen,
      intakes: (course.intakes || []).filter((i) => i.isActive)
    },
    formAvailable: Boolean(schema),
    sections: schema ? schema.sections : []
  })
})

module.exports = {
  getTemplate,
  updateTemplate,
  getCourseSchema,
  updateCourseSchema,
  resetCourseSchema,
  getPublicCourseForm,
  getOrCreateTemplate
}
