const mongoose = require('mongoose')

// A submission of the public contact form (ContactPage.jsx). Persisted so the
// visitor's message survives even if the notification email fails to send.
const contactMessageSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    organization: { type: String, default: '' },
    topic: { type: String, default: '' },
    message: { type: String, required: true },
    office: { type: String, default: '' },

    // Admin workflow.
    status: {
      type: String,
      enum: ['new', 'contacted', 'closed'],
      default: 'new',
      index: true
    },
    adminNotes: { type: String, default: '' }
  },
  { timestamps: true }
)

module.exports = mongoose.model('ContactMessage', contactMessageSchema)
