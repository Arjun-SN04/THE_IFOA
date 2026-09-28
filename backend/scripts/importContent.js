// Load seed-data/content.json (made by `npm run content:export`) into the
// database in MONGO_URI. Upserts by course slug / page key, so it is safe to
// re-run; people's data (admins, submissions, messages) is never touched.
//
// Run: npm run content:import
require('dotenv').config({ quiet: true })

const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const { connectDB } = require('../config/db')
const Course = require('../models/Course')
const FormSchema = require('../models/FormSchema')
const PageContent = require('../models/PageContent')

const SRC = path.join(__dirname, '..', 'seed-data', 'content.json')
// JSON has no Date type: turn ISO strings back into Dates for date fields.
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/
const revive = (v) =>
  Array.isArray(v)
    ? v.map(revive)
    : v && typeof v === 'object'
      ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, revive(x)]))
      : typeof v === 'string' && ISO.test(v)
        ? new Date(v)
        : v

async function run() {
  if (!fs.existsSync(SRC)) throw new Error(`Missing ${SRC}. Run npm run content:export first.`)
  const data = revive(JSON.parse(fs.readFileSync(SRC, 'utf8')))
  await connectDB()
  console.log(`Importing snapshot from ${data.exportedAt}`)

  const idBySlug = {}
  for (const course of data.courses) {
    const doc = await Course.findOneAndUpdate({ slug: course.slug }, { $set: course }, { upsert: true, returnDocument: 'after', runValidators: true })
    idBySlug[course.slug] = doc._id
  }
  console.log(`  courses: ${data.courses.length}`)

  let forms = 0
  for (const form of data.forms) {
    const { courseSlug, ...fields } = form
    if (form.isTemplate) {
      await FormSchema.findOneAndUpdate({ isTemplate: true }, { $set: { ...fields, course: null } }, { upsert: true })
    } else {
      const course = idBySlug[courseSlug]
      if (!course) continue
      await FormSchema.findOneAndUpdate({ course }, { $set: { ...fields, course } }, { upsert: true })
    }
    forms++
  }
  console.log(`  forms: ${forms}`)

  for (const page of data.pages) {
    await PageContent.findOneAndUpdate({ page: page.page }, { $set: page }, { upsert: true })
  }
  console.log(`  page overrides: ${data.pages.length}`)

  await mongoose.disconnect()
  console.log('Done.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
