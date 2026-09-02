const PageContent = require('../models/PageContent')
const { asyncHandler } = require('../middleware/error')
const {
  PAGE_KEYS,
  PAGE_LABELS,
  SCHEMAS,
  DEFAULTS,
  mergeContent,
  isValidPage
} = require('../utils/pageContent')

// ---------- Public ----------

// GET /api/pages/:page — merged content the marketing page renders from.
const getPublicPage = asyncHandler(async (req, res) => {
  const { page } = req.params
  if (!isValidPage(page)) return res.status(404).json({ message: 'Unknown page' })

  const doc = await PageContent.findOne({ page }).lean()
  res.json({ page, data: mergeContent(DEFAULTS[page], doc?.data || {}) })
})

// ---------- Admin ----------

// GET /api/admin/pages — list of editable pages + last-updated.
const adminListPages = asyncHandler(async (req, res) => {
  const docs = await PageContent.find({ page: { $in: PAGE_KEYS } })
    .select('page updatedAt')
    .lean()
  const byPage = Object.fromEntries(docs.map((d) => [d.page, d.updatedAt]))

  res.json({
    pages: PAGE_KEYS.map((page) => ({
      page,
      label: PAGE_LABELS[page],
      updatedAt: byPage[page] || null,
      customized: Boolean(byPage[page])
    }))
  })
})

// GET /api/admin/pages/:page — schema + current (merged) values + defaults.
const adminGetPage = asyncHandler(async (req, res) => {
  const { page } = req.params
  if (!isValidPage(page)) return res.status(404).json({ message: 'Unknown page' })

  const doc = await PageContent.findOne({ page }).lean()
  res.json({
    page,
    label: PAGE_LABELS[page],
    schema: SCHEMAS[page],
    data: mergeContent(DEFAULTS[page], doc?.data || {}),
    defaults: DEFAULTS[page],
    customized: Boolean(doc)
  })
})

// PUT /api/admin/pages/:page — replace the stored override blob.
const adminUpdatePage = asyncHandler(async (req, res) => {
  const { page } = req.params
  if (!isValidPage(page)) return res.status(404).json({ message: 'Unknown page' })

  const { data } = req.body || {}
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return res.status(400).json({ message: 'data must be an object' })
  }

  const doc = await PageContent.findOneAndUpdate(
    { page },
    { $set: { data } },
    { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true }
  )
  res.json({ page, data: mergeContent(DEFAULTS[page], doc.data || {}) })
})

// DELETE /api/admin/pages/:page — revert to shipped defaults.
const adminResetPage = asyncHandler(async (req, res) => {
  const { page } = req.params
  if (!isValidPage(page)) return res.status(404).json({ message: 'Unknown page' })

  await PageContent.deleteOne({ page })
  res.json({ page, data: DEFAULTS[page] })
})

module.exports = {
  getPublicPage,
  adminListPages,
  adminGetPage,
  adminUpdatePage,
  adminResetPage
}
