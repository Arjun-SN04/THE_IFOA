const mongoose = require('mongoose')

const newsletterSubscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true
  },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('NewsletterSubscriber', newsletterSubscriberSchema)
