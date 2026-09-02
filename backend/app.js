const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const publicRoutes = require('./routes/publicRoutes')
const adminRoutes = require('./routes/adminRoutes')
const { notFound, errorHandler } = require('./middleware/error')
const { isConfigured: r2Configured } = require('./config/r2')

const app = express()

app.set('trust proxy', 1)

const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)

app.use(
  cors({
    origin(origin, cb) {
      // Same-origin / curl requests have no Origin header.
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
      cb(new Error(`Origin not allowed by CORS: ${origin}`))
    },
    credentials: true
  })
)

app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', r2: r2Configured() ? 'configured' : 'not configured' })
})

app.use('/api', publicRoutes)
app.use('/api/admin', adminRoutes)

app.use(notFound)
app.use(errorHandler)

module.exports = app
