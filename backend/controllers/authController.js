const Admin = require('../models/Admin')
const { signToken, setAuthCookie, clearAuthCookie } = require('../middleware/auth')
const { asyncHandler } = require('../middleware/error')

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  const admin = await Admin.findOne({ email: String(email).toLowerCase().trim() }).select('+password')
  // Same response for unknown email and wrong password.
  if (!admin || !(await admin.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  admin.lastLoginAt = new Date()
  await admin.save({ validateBeforeSave: false })

  setAuthCookie(res, signToken(admin._id))
  res.json({ admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } })
})

const logout = asyncHandler(async (req, res) => {
  clearAuthCookie(res)
  res.json({ message: 'Logged out' })
})

const me = asyncHandler(async (req, res) => {
  const { _id, name, email, role } = req.admin
  res.json({ admin: { id: _id, name, email, role } })
})

module.exports = { login, logout, me }
