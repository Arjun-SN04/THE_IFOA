const mongoose = require('mongoose')

// A completed enrollment form for a course. The form definition can change
// over time, so each submission keeps its own snapshot of the sections it was
// filled against — that snapshot is what the admin view and the PDF render.
const submissionSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', index: true },
    // Denormalised so the row still reads correctly if the course is deleted.
    courseTitle: { type: String, default: '' },
    courseRefCode: { type: String, default: '' },
    courseSlug: { type: String, default: '' },

    formSchemaSnapshot: { type: mongoose.Schema.Types.Mixed, required: true },
    intake: { type: String, default: '' }, // chosen course intake label, if any
    answers: { type: mongoose.Schema.Types.Mixed, required: true },

    // Admin workflow (carried over from the old Registration flow).
    status: {
      type: String,
      enum: ['new', 'contacted', 'confirmed', 'rejected'],
      default: 'new',
      index: true
    },
    adminNotes: { type: String, default: '' },

    submittedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Submission', submissionSchema)
