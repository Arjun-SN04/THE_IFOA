const mongoose = require('mongoose')
const slugify = require('slugify')

// An image stored in Cloudflare R2. `key` is kept so the object can be deleted
// when the course is updated or removed.
const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    key: { type: String, default: '' },
    alt: { type: String, default: '' }
  },
  { _id: false }
)

// Small logo + caption block, used by "Course Delivery" (School / Format).
const deliveryItemSchema = new mongoose.Schema(
  {
    label: { type: String, default: '' },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    image: { type: imageSchema, default: null }
  },
  { _id: false }
)

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true, lowercase: true, trim: true },
    refCode: { type: String, default: '', trim: true }, // e.g. IPIN2501
    branch: { type: String, default: 'IFOA', trim: true }, // IFOA / IFOA India / IFOA USA ...
    category: {
      type: String,
      enum: ['dispatch', 'ground', 'dangerous-goods', 'train-the-trainer', 'crew', 'security', 'human-factors', 'consulting', 'other'],
      default: 'dispatch',
      index: true
    },
    status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },

    summary: { type: String, default: '' },
    heroImage: { type: imageSchema, default: null },

    // ---- Catalog card display ----
    authority: { type: String, default: '' }, // "EASA / FAA Part 65 Standards"
    format: { type: String, default: '' }, // "Hybrid Online + In-Person Simulator Sessions"
    careerPath: { type: String, default: '' }, // target roles on completion
    intakeLabel: { type: String, default: '' }, // "Rolling Monthly Admissions" when there is no fixed date

    // Per-course overrides for the Events & Courses catalog card. Any empty
    // field falls back to a sensible default at render time.
    card: {
      image: { type: imageSchema, default: null }, // card banner; falls back to heroImage
      badge: { type: String, default: '' }, // top-right pill; falls back to `authority`
      rating: { type: Number, default: null }, // e.g. 5
      reviewsLabel: { type: String, default: '' }, // e.g. "480+ Reviews"
      durationLabel: { type: String, default: '' }, // bottom pill; falls back to `duration`
      blurb: { type: String, default: '' } // card summary; falls back to `summary`
    },

    // ---- Fact cards (Duration / Start / Location / Price) ----
    schedule: {
      mode: { type: String, enum: ['Onsite', 'Online', 'Hybrid'], default: 'Onsite' },
      startDate: { type: Date, default: null },
      endDate: { type: Date, default: null },
      timeText: { type: String, default: '' }, // "MO - FRI 0900AM - 0500PM IST"
      timezone: { type: String, default: '' }
    },
    duration: { type: String, default: '' }, // "4 Weeks"
    location: { type: String, default: '' }, // "New Delhi"
    price: {
      amount: { type: Number, default: null },
      currency: { type: String, default: 'EUR' },
      note: { type: String, default: '' } // "18% GST must be added to the price mentioned"
    },

    // ---- Body sections ----
    whatYouWillLearn: {
      intro: { type: String, default: '' },
      points: { type: [String], default: [] }
    },
    delivery: {
      intro: { type: String, default: '' },
      items: { type: [deliveryItemSchema], default: [] }
    },
    trainingStandards: {
      intro: { type: String, default: '' },
      logos: { type: [imageSchema], default: [] }
    },
    whoShouldAttend: {
      intro: { type: String, default: '' },
      points: { type: [String], default: [] },
      outro: { type: String, default: '' }
    },
    courseContent: {
      intro: { type: String, default: '' },
      modules: { type: [String], default: [] },
      note: { type: String, default: '' }
    },
    certification: {
      text: { type: String, default: '' },
      points: { type: [String], default: [] }
    },

    registrationOpen: { type: Boolean, default: true },
    seats: { type: Number, default: null },

    // Scheduled intakes offered for this course. An `intake` field in the
    // enrollment form lists these (active ones) as its options.
    intakes: {
      type: [
        new mongoose.Schema(
          {
            label: { type: String, required: true, trim: true },
            startDate: { type: Date, default: null },
            isActive: { type: Boolean, default: true }
          },
          { _id: false }
        )
      ],
      default: []
    },

    seo: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' }
    }
  },
  { timestamps: true }
)

courseSchema.index({ title: 'text', summary: 'text' })

// Slug from title, kept unique by appending a counter.
// Mongoose 9 does not pass `next` to async hooks — resolve/throw instead.
courseSchema.pre('validate', async function generateSlug() {
  if (this.slug && !this.isModified('title')) return
  if (this.slug && this.isModified('slug')) {
    this.slug = slugify(this.slug, { lower: true, strict: true })
    return
  }

  const base = slugify(this.title || 'course', { lower: true, strict: true })
  let candidate = base
  let n = 1
  // eslint-disable-next-line no-await-in-loop
  while (await this.constructor.exists({ slug: candidate, _id: { $ne: this._id } })) {
    n += 1
    candidate = `${base}-${n}`
  }
  this.slug = candidate
})

// Every R2 key referenced anywhere on the document, so the controller can
// clean up objects that are no longer used.
courseSchema.methods.imageKeys = function imageKeys() {
  const keys = []
  if (this.heroImage?.key) keys.push(this.heroImage.key)
  if (this.card?.image?.key) keys.push(this.card.image.key)
  for (const item of this.delivery?.items || []) {
    if (item.image?.key) keys.push(item.image.key)
  }
  for (const logo of this.trainingStandards?.logos || []) {
    if (logo.key) keys.push(logo.key)
  }
  return keys
}

module.exports = mongoose.model('Course', courseSchema)
