const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'IFOA Admin', trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, select: false, minlength: 8 },
    role: { type: String, enum: ['admin', 'editor'], default: 'admin' },
    lastLoginAt: { type: Date, default: null }
  },
  { timestamps: true }
)

// Mongoose 9 does not pass `next` to async hooks - resolve/throw instead.
adminSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 12)
})

adminSchema.methods.comparePassword = function comparePassword(plain) {
  return bcrypt.compare(plain, this.password)
}

module.exports = mongoose.model('Admin', adminSchema)
