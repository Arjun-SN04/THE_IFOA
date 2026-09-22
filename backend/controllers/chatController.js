const Course = require('../models/Course')
const { asyncHandler } = require('../middleware/error')
const { PAGE_KEYS, DEFAULTS, mergeContent } = require('../utils/pageContent')
const PageContent = require('../models/PageContent')

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite'
const GEMINI_KEY = process.env.GEMINI_API_KEY || ''
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

const FALLBACK_REPLY =
  "I can't reach the assistant right now. For course details, schedules or enrollment help, " +
  'use the contact form on the Contact page or message us on WhatsApp at +41 78 227 3103.'

const MAX_TURNS = 12
const MAX_CHARS = 2000

// ---- Knowledge base (rebuilt at most every 5 min) --------------------------

let kbCache = { text: '', at: 0 }

function priceLine(price) {
  if (!price || price.amount == null) return 'price on request'
  const sym = price.currency === 'INR' ? '₹' : price.currency === 'EUR' ? '€' : '$'
  return `${sym}${price.amount.toLocaleString()} ${price.currency || ''}`.trim()
}

async function buildKnowledge() {
  if (kbCache.text && Date.now() - kbCache.at < 5 * 60 * 1000) return kbCache.text

  const courses = await Course.find({ status: 'published' })
    .select('title slug summary duration location price category format careerPath registrationOpen card')
    .sort({ featured: -1, order: 1 })
    .lean()

  const courseLines = courses.map((c) => {
    const bits = [
      `- ${c.title} (slug: ${c.slug})`,
      c.summary || c.card?.blurb ? `  summary: ${(c.summary || c.card?.blurb).slice(0, 300)}` : null,
      c.duration ? `  duration: ${c.duration}` : null,
      c.location ? `  location: ${c.location}` : null,
      c.format ? `  format: ${c.format}` : null,
      `  tuition: ${priceLine(c.price)}`,
      c.careerPath ? `  leads to: ${c.careerPath}` : null,
      `  detail page: /courses/${c.slug} · enrol: /courses/${c.slug}/enroll`
    ].filter(Boolean)
    return bits.join('\n')
  })

  // Pull a little copy from the editable pages for tone / facts.
  const docs = await PageContent.find({ page: { $in: PAGE_KEYS } })
    .select('page data')
    .lean()
  const byPage = Object.fromEntries(docs.map((d) => [d.page, d.data]))
  const contact = mergeContent(DEFAULTS.contact, byPage.contact || {})
  const offices = (contact.offices?.items || [])
    .map((o) => `  ${o.country}: ${o.address} · ${o.phone} · ${o.email}`)
    .join('\n')

  // Services page disciplines - the site's top-level framing of what IFOA
  // offers, plus which real course each one currently links to, so the bot
  // can answer "do you do X" with the actual course/enrol link instead of
  // just the raw course catalog.
  const services = mergeContent(DEFAULTS.services, byPage.services || {})
  const disciplineLines = (services.specialist?.disciplines || []).map((d) => {
    const links = d.courseChoices?.length
      ? d.courseChoices.map((ch) => `${ch.label}: /courses/${ch.courseSlug}`).join(', ')
      : d.courseSlug
        ? `/courses/${d.courseSlug}`
        : 'no dedicated course page yet - direct to Contact'
    return [
      `- ${d.title}: ${d.desc || d.subtitle || ''}`.trim(),
      d.audience ? `  audience: ${d.audience}` : null,
      `  page: ${links}`
    ].filter(Boolean).join('\n')
  })

  // Events page - the open-enrollment / fixed-date cohort framing.
  const events = mergeContent(DEFAULTS.events, byPage.events || {})

  kbCache = {
    at: Date.now(),
    text: [
      'PUBLISHED COURSES:',
      courseLines.join('\n') || '  (none published yet)',
      '',
      'SERVICES OFFERED (from the Services page - use these when a user asks what IFOA does or offers, and link to the specific course page listed):',
      disciplineLines.join('\n') || '  (see published courses above)',
      '',
      'EVENTS PAGE (/events): ' + (events.hero?.subtitle || 'Fixed-date, open-enrollment cohorts you can register for directly.'),
      '',
      'OFFICES:',
      offices || '  Switzerland (HQ), USA, India',
      '',
      'ENROLLMENT: send users to /courses/<slug>/enroll for a specific course, or the Contact page for anything else.',
      'WhatsApp: +41 78 227 3103.'
    ].join('\n')
  }
  return kbCache.text
}

function systemPrompt(kb) {
  return [
    'You are the IFOA assistant, a helpful chat bot on the International Flight Operations Academy (IFOA) website.',
    'IFOA trains flight dispatchers and flight operations / OCC staff (EASA, FAA Part 65, ICAO Doc 10106) and runs consulting for airlines.',
    '',
    'Rules:',
    '- Answer only from the information below and general aviation-training knowledge. If you do not know, say so and point the user to the Contact page.',
    '- Be concise and professional. 1-3 short sentences for most answers.',
    '- Plain text only. No markdown, no asterisks, no bold, no headings.',
    '- If you must list courses, put each on its own line as: "Course name - /courses/<slug>/enroll". Keep it to the 3 most relevant.',
    '- When one course clearly fits, recommend just that one with its enrol path.',
    '- Never invent prices, dates, or accreditations. Do not promise admission or discounts.',
    '- You cannot take payments, book seats, or change records. For those, direct users to the Contact page or WhatsApp.',
    '- Stay on IFOA / aviation-training topics. Politely decline unrelated requests in one sentence.',
    '',
    'When a user asks how to buy, book, enrol, register, or pay for a course, walk them through',
    'the ENROLLMENT PROCESS below as short numbered steps (1., 2., 3. ...), in order. If you know',
    'which course they want, use that course\'s real enrol link in step 2 and skip asking; otherwise',
    'ask which programme they want first, then give the steps.',
    '',
    'ENROLLMENT PROCESS:',
    '1. Pick a programme. Browse them on the Events page (/events) or a course page (/courses/<slug>).',
    '2. Open that course\'s application page (/courses/<slug>/enroll) and click "Enroll Now - Apply Online".',
    '3. Complete the online application form: personal and contact details, background, and select an intake if the course lists dates.',
    '4. Submit the form. You get a reference number and can download your completed application as a PDF.',
    '5. Sign the PDF and email the signed copy plus two photo-ID copies to info@theifoa.com.',
    '6. Admissions reviews your prerequisites, confirms your seat, and sends an invoice.',
    '7. Pay per the bank details on the invoice. Your place is confirmed once payment is received.',
    'For help choosing or with any step, point them to the Contact page or WhatsApp +41 78 227 3103.',
    '',
    '=== IFOA INFORMATION ===',
    kb
  ].join('\n')
}

// ---- Controller -----------------------------------------------------------

// POST /api/chat  { messages: [{ role: 'user' | 'bot', text }] }
const ask = asyncHandler(async (req, res) => {
  const raw = Array.isArray(req.body?.messages) ? req.body.messages : []
  const turns = raw
    .filter((m) => m && typeof m.text === 'string' && m.text.trim())
    .slice(-MAX_TURNS)
    .map((m) => ({
      role: m.role === 'bot' || m.role === 'model' || m.role === 'assistant' ? 'model' : 'user',
      text: m.text.trim().slice(0, MAX_CHARS)
    }))

  // Conversation must start with a user turn.
  while (turns.length && turns[0].role === 'model') turns.shift()
  if (!turns.length || turns[turns.length - 1].role !== 'user') {
    return res.status(400).json({ message: 'A user message is required.' })
  }

  if (!GEMINI_KEY) {
    return res.json({ reply: FALLBACK_REPLY, degraded: true })
  }

  let kb
  try {
    kb = await buildKnowledge()
  } catch {
    kb = '(course list unavailable)'
  }

  const body = {
    system_instruction: { parts: [{ text: systemPrompt(kb) }] },
    contents: turns.map((t) => ({ role: t.role, parts: [{ text: t.text }] })),
    generationConfig: { temperature: 0.4, maxOutputTokens: 800 }
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 20000)
  try {
    const r = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': GEMINI_KEY },
      body: JSON.stringify(body),
      signal: controller.signal
    })
    const data = await r.json().catch(() => null)
    if (!r.ok) {
      console.warn('[chat] gemini error', r.status, data?.error?.message || '')
      return res.json({ reply: FALLBACK_REPLY, degraded: true })
    }
    const reply = (data?.candidates?.[0]?.content?.parts || [])
      .map((p) => p.text)
      .filter(Boolean)
      .join('')
      .trim()
    if (!reply) return res.json({ reply: FALLBACK_REPLY, degraded: true })
    return res.json({ reply })
  } catch (err) {
    console.warn('[chat] request failed', err.message)
    return res.json({ reply: FALLBACK_REPLY, degraded: true })
  } finally {
    clearTimeout(timer)
  }
})

module.exports = { ask }
