// Seeds (or refreshes) the default enrollment-form template - the schema new
// courses start from. Safe to re-run.
//   npm run seed:form-template            # create only if missing
//   npm run seed:form-template -- --force # overwrite the existing template
require('dotenv').config()

const mongoose = require('mongoose')
const { connectDB } = require('../config/db')
const FormSchema = require('../models/FormSchema')
const { defaultFormSchema } = require('../utils/defaultFormSchema')

async function run() {
  const force = process.argv.includes('--force')
  await connectDB()

  const existing = await FormSchema.findOne({ isTemplate: true })
  if (existing && !force) {
    console.log('Form template already exists. Pass --force to overwrite. Nothing to do.')
  } else if (existing) {
    existing.sections = defaultFormSchema.sections
    await existing.save()
    console.log(`Form template overwritten (${existing.sections.length} sections).`)
  } else {
    const created = await FormSchema.create({
      isTemplate: true,
      sections: defaultFormSchema.sections
    })
    console.log(`Form template created (${created.sections.length} sections).`)
  }

  await mongoose.disconnect()
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
