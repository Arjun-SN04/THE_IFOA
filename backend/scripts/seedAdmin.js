// Creates the first admin account from SEED_ADMIN_* in .env.
// Run once: npm run seed:admin
require('dotenv').config()

const mongoose = require('mongoose')
const { connectDB } = require('../config/db')
const Admin = require('../models/Admin')

async function run() {
  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD
  const name = process.env.SEED_ADMIN_NAME || 'IFOA Admin'

  if (!email || !password) {
    console.error('Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in backend/.env first.')
    process.exit(1)
  }
  if (password.length < 8) {
    console.error('SEED_ADMIN_PASSWORD must be at least 8 characters.')
    process.exit(1)
  }

  await connectDB()

  const existing = await Admin.findOne({ email: email.toLowerCase() })
  if (existing) {
    console.log(`Admin already exists: ${existing.email}. Nothing to do.`)
  } else {
    const admin = await Admin.create({ name, email, password })
    console.log(`Created admin: ${admin.email}`)
  }

  await mongoose.disconnect()
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
