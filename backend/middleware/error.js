const multer = require('multer')

function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` })
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `Upload failed: ${err.message}` })
  }
  if (err?.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation failed',
      errors: Object.fromEntries(
        Object.entries(err.errors).map(([field, e]) => [field, e.message])
      )
    })
  }
  if (err?.code === 11000) {
    return res.status(409).json({ message: 'Duplicate value', fields: err.keyValue })
  }

  const status = err.status || 500
  if (status >= 500) console.error('[error]', err)
  res.status(status).json({ message: err.message || 'Internal server error' })
}

// Wraps an async handler so rejections reach errorHandler.
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = { notFound, errorHandler, asyncHandler }
