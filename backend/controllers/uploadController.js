const { uploadBuffer, deleteObject, isConfigured } = require('../config/r2')
const { asyncHandler } = require('../middleware/error')

// POST /api/admin/uploads  (multipart, field name: "files", optional ?folder=)
const uploadImages = asyncHandler(async (req, res) => {
  if (!isConfigured()) {
    return res.status(503).json({
      message: 'Cloudflare R2 is not configured. Fill the R2_* values in backend/.env'
    })
  }
  if (!req.files?.length) {
    return res.status(400).json({ message: 'No files received (expected field "files")' })
  }

  const folder = /^[a-z0-9-]+$/i.test(req.query.folder || '') ? req.query.folder : 'courses'

  const images = await Promise.all(
    req.files.map((file) =>
      uploadBuffer({
        buffer: file.buffer,
        originalName: file.originalname,
        contentType: file.mimetype,
        folder
      })
    )
  )

  res.status(201).json({ images })
})

// DELETE /api/admin/uploads?key=courses/123-abc.png
const removeImage = asyncHandler(async (req, res) => {
  const { key } = req.query
  if (!key) return res.status(400).json({ message: 'key query param is required' })

  await deleteObject(key)
  res.json({ message: 'Deleted' })
})

module.exports = { uploadImages, removeImage }
