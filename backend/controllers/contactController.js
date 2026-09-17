const { asyncHandler } = require('../middleware/error')
const { sendMail } = require('../utils/mailer')

const OFFICE_INBOX = {
  switzerland: 'info@theifoa.com',
  usa: 'info@theifoa.com',
  india: 'info@theifoa.com'
}

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

// POST /api/contact
const send = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, organization, topic, message, office } = req.body || {}

  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({ message: 'firstName, lastName, email and message are required' })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'A valid email is required' })
  }

  const to = OFFICE_INBOX[office] || OFFICE_INBOX.switzerland

  const text = [
    `Name: ${firstName} ${lastName}`,
    `Email: ${email}`,
    organization ? `Organization: ${organization}` : null,
    topic ? `Topic: ${topic}` : null,
    '',
    message
  ]
    .filter(Boolean)
    .join('\n')

  const html = `
    <p><strong>Name:</strong> ${escapeHtml(firstName)} ${escapeHtml(lastName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    ${organization ? `<p><strong>Organization:</strong> ${escapeHtml(organization)}</p>` : ''}
    ${topic ? `<p><strong>Topic:</strong> ${escapeHtml(topic)}</p>` : ''}
    <p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>
  `

  await sendMail({
    to,
    replyTo: email,
    subject: `New website enquiry: ${topic || 'General'} — ${firstName} ${lastName}`,
    text,
    html
  })

  res.status(200).json({ message: 'Message sent' })
})

module.exports = { send }
