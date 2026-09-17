const nodemailer = require('nodemailer')

let transporter = null

function getTransporter() {
  if (transporter) return transporter
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return null

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })
  return transporter
}

function isConfigured() {
  return !!getTransporter()
}

async function sendMail({ to, replyTo, subject, text, html }) {
  const t = getTransporter()
  if (!t) throw new Error('Mail is not configured')
  return t.sendMail({
    from: `"IFOA Website" <${process.env.SMTP_USER}>`,
    to,
    replyTo,
    subject,
    text,
    html
  })
}

module.exports = { sendMail, isConfigured }
