// Snapshot the site content from the database in MONGO_URI into
// seed-data/content.json, so it can be loaded into another database
// (e.g. production) with `npm run content:import`.
//
// Included: courses, enrollment forms (incl. the default template) and
// editable page content. NOT included: admins, submissions, contact
// messages, newsletter subscribers (people's data stays where it is).
//
// Run: npm run content:export
require('dotenv').config({ quiet: true })

const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const { connectDB } = require('../config/db')
const Course = require('../models/Course')
const FormSchema = require('../models/FormSchema')
const PageContent = require('../models/PageContent')

const OUT = path.join(__dirname, '..', 'seed-data', 'content.json')
const strip = ({ _id, __v, createdAt, updatedAt, ...rest }) => rest

async function run() {
  await connectDB()

  const courses = await Course.find({}).sort({ order: 1 }).lean()
  const slugById = Object.fromEntries(courses.map((c) => [String(c._id), c.slug]))

  const forms = (await FormSchema.find({}).lean()).map((f) => {
    const { course, ...rest } = strip(f)
    return { ...rest, courseSlug: course ? slugById[String(course)] || null : null }
  })

  const pages = (await PageContent.find({}).lean()).map(strip)

  const snapshot = {
    exportedAt: new Date().toISOString(),
    courses: courses.map(strip),
    forms: forms.filter((f) => f.isTemplate || f.courseSlug),
    pages
  }
  fs.mkdirSync(path.dirname(OUT), { recursive: true })
  fs.writeFileSync(OUT, JSON.stringify(snapshot, null, 2))
  console.log(
    `Exported ${snapshot.courses.length} courses, ${snapshot.forms.length} forms, ${snapshot.pages.length} page overrides -> ${path.relative(process.cwd(), OUT)}`
  )
  await mongoose.disconnect()
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
