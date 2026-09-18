const { asyncHandler } = require('../middleware/error')
const NewsletterSubscriber = require('../models/NewsletterSubscriber')

// POST /api/newsletter
const subscribe = asyncHandler(async (req, res) => {
  const { email } = req.body || {}

  if (!email) {
    return res.status(400).json({ message: 'Email is required' })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'A valid email is required' })
  }

  try {
    await NewsletterSubscriber.updateOne(
      { email: email.toLowerCase().trim() },
      { $setOnInsert: { email: email.toLowerCase().trim(), createdAt: new Date() } },
      { upsert: true }
    )
  } catch (err) {
    // Duplicate key on a race is still a successful subscribe.
    if (err.code !== 11000) throw err
  }

  res.status(200).json({ message: 'Subscribed' })
})

module.exports = { subscribe }
