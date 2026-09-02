const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')

function cookieName() {
  return process.env.COOKIE_NAME || 'ifoa_admin_token'
}

function signToken(adminId) {
  return jwt.sign({ sub: String(adminId) }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  })
}

function setAuthCookie(res, token) {
  res.cookie(cookieName(), token, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/'
  })
}

function clearAuthCookie(res) {
  res.clearCookie(cookieName(), { path: '/' })
}

async function requireAdmin(req, res, next) {
  try {
    const bearer = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null
    const token = req.cookies?.[cookieName()] || bearer

    if (!token) return res.status(401).json({ message: 'Not authenticated' })

    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const admin = await Admin.findById(payload.sub)
    if (!admin) return res.status(401).json({ message: 'Account no longer exists' })

    req.admin = admin
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired session' })
  }
}

module.exports = { signToken, setAuthCookie, clearAuthCookie, requireAdmin, cookieName }
