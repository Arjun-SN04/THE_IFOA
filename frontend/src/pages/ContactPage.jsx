import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MapPin,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  Send,
  Building,
  User,
  Plane
} from 'lucide-react'

import { CosmicParallaxBg } from '@/components/common/CosmicParallaxBg'
import { CustomSelect } from '@/components/ui/CustomSelect'
import { usePageContent } from '@/hooks/usePageContent'
import bannerContactHero from '@/assets/partners/IOFA-banner_10@1920x1280.jpg'

// Content the page ships with; the admin can override any of it via /admin/pages/contact.
const FALLBACK = {
  hero: {
    title: "Let's talk about your operation.",
    subtitle: "Tell us who you are and what you need, and we'll route it to the right person.",
    image: null,
    cards: [
      {
        eyebrow: 'Airlines & Operators',
        title: 'Training my team',
        desc: 'Fleet-wide or role-specific training, built around your ops manual and your regulator.'
      },
      {
        eyebrow: 'Individuals',
        title: 'Becoming a dispatcher',
        desc: 'Certification pathways and course dates for individual applicants.'
      }
    ]
  },
  form: {
    eyebrow: 'SEND A MESSAGE',
    title: 'Start the conversation',
    submitLabel: 'Send Message →',
    topics: [
      'Training my OCC / dispatch team',
      'Individual dispatcher certification',
      'Consulting services',
      'Foxtrot Delta / press',
      'Something else'
    ]
  },
  offices: {
    eyebrow: 'DIRECT LINES',
    title: 'Our regional offices',
    items: [
      {
        region: 'Europe · Headquarters',
        country: 'Switzerland',
        address: 'Oberdorf 26, 4314 Zeiningen, Aargau, Switzerland',
        phone: '+41 78 227 3103',
        email: 'info@theifoa.com'
      },
      {
        region: 'Americas',
        country: 'United States',
        address: '1616 Concierge Blvd, Suite 100, Daytona Beach, FL 32117, USA',
        phone: '+1 508 838 5880',
        email: 'info-usa@theifoa.com'
      },
      {
        region: 'Asia',
        country: 'India',
        address: 'Innov8 Old Fort, 2nd Floor, Saket District Centre, New Delhi 110017, India',
        phone: '+91 98101 44034',
        email: 'info-india@theifoa.com'
      }
    ]
  },
  newsletter: {
    title: 'Prefer to just get the newsletter?',
    desc: 'One email a month: aviation insight worth reading, plus Foxtrot Delta, free.'
  }
}

export function ContactPage() {
  const { c } = usePageContent('contact', FALLBACK)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    organization: '',
    topic: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterSuccess, setNewsletterSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 700)
  }

  const handleNewsletter = (e) => {
    e.preventDefault()
    if (!newsletterEmail) return
    setNewsletterSuccess(true)
    setNewsletterEmail('')
  }

  const offices = c.offices.items

  return (
    <div className="bg-white text-rocket-dark selection:bg-[#38b58a] selection:text-white" data-purpose="contact-page">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[460px] md:min-h-[500px] flex flex-col items-center justify-center bg-[#020617] text-white pt-28 pb-16 overflow-hidden">
        {/* Ambient Aviation Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={c.hero.image?.url || bannerContactHero}
            alt="IFOA Operations and Global Consultation"
            className="w-full h-full object-cover object-center opacity-35 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/90 via-[#020617]/75 to-[#020617]" />
        </div>

        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 space-y-10">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
              {c.hero.title}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-slate-300 font-normal leading-relaxed">
              {c.hero.subtitle}
            </p>
          </div>

          {/* Fork Cards (Airlines vs Individuals) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {c.hero.cards.map((card, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white/5 border border-white/10 hover:border-[#38b58a]/40 p-6 space-y-2 transition-all"
              >
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#38b58a]">
                  {card.eyebrow}
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight">{card.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTACT SECTION (FORM + REGIONAL OFFICES) */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80" data-purpose="contact-main">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            {/* Left: Contact Form */}
            <div className="lg:col-span-7 flex flex-col space-y-6 h-full">
              <div className="space-y-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#38b58a] block">
                  {c.form.eyebrow}
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-rocket-dark">
                  {c.form.title}
                </h2>
              </div>

              <div className="rounded-3xl bg-slate-50/70 border border-slate-200/90 p-7 sm:p-9 shadow-sm flex-1 flex flex-col justify-between">
                {submitted ? (
                  <div className="text-center py-12 space-y-4 animate-in fade-in duration-300 my-auto">
                    <div className="w-16 h-16 rounded-full bg-[#38b58a]/10 text-[#38b58a] flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-rocket-dark">
                      Message Transmitted
                    </h3>
                    <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                      Thank you for contacting IFOA. An operational specialist from the appropriate regional desk will review your details and reach out within 24 hours.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="text-xs font-bold uppercase tracking-wider text-[#38b58a] hover:underline pt-2 cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 flex-1 flex flex-col justify-between">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider">
                          First Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Jane"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm text-rocket-dark placeholder:text-slate-400 focus:outline-none focus:border-[#38b58a] transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm text-rocket-dark placeholder:text-slate-400 focus:outline-none focus:border-[#38b58a] transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="jane.doe@airline.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm text-rocket-dark placeholder:text-slate-400 focus:outline-none focus:border-[#38b58a] transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider">
                        Organization
                      </label>
                      <input
                        type="text"
                        placeholder="Airline, operator, or 'individual'"
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm text-rocket-dark placeholder:text-slate-400 focus:outline-none focus:border-[#38b58a] transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider">
                        I'm interested in
                      </label>
                      <CustomSelect
                        value={formData.topic || c.form.topics[0]}
                        onChange={(val) => setFormData({ ...formData, topic: val })}
                        options={c.form.topics}
                      />
                    </div>

                    <div className="space-y-1.5 flex-1 flex flex-col">
                      <label className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider">
                        Message
                      </label>
                      <textarea
                        placeholder="Tell us about your fleet, your team size, or your timeline."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full flex-1 min-h-[110px] px-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm text-rocket-dark placeholder:text-slate-400 focus:outline-none focus:border-[#38b58a] transition-all resize-y"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#38b58a] hover:bg-[#2ea87c] text-white font-bold text-xs uppercase tracking-widest py-4 rounded-full transition-all duration-200 shadow-lg hover:shadow-emerald-500/20 cursor-pointer shrink-0"
                    >
                      {loading ? 'Transmitting...' : c.form.submitLabel}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Right: Regional Offices */}
            <div className="lg:col-span-5 flex flex-col space-y-6 h-full">
              <div className="space-y-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#38b58a] block">
                  {c.offices.eyebrow}
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-rocket-dark">
                  {c.offices.title}
                </h2>
              </div>

              <div className="flex-1 flex flex-col justify-between gap-4">
                {offices.map((office, idx) => (
                  <div
                    key={idx}
                    className="rounded-3xl bg-slate-50/70 border border-slate-200/90 hover:bg-white hover:border-[#38b58a]/40 hover:shadow-lg transition-all duration-300 p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#38b58a] block">
                        {office.region}
                      </span>
                      <h3 className="text-lg font-bold text-rocket-dark tracking-tight">
                        {office.country}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed pt-1">
                        {office.address}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-200/70 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Phone:</span>
                        <a
                          href={`tel:${office.phone.replace(/[^0-9+]/g, '')}`}
                          className="font-semibold text-rocket-dark hover:text-[#38b58a] transition-colors"
                        >
                          {office.phone}
                        </a>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Email:</span>
                        <a
                          href={`mailto:${office.email}`}
                          className="font-semibold text-rocket-dark hover:text-[#38b58a] transition-colors"
                        >
                          {office.email}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. NEWSLETTER BOX */}
      <section className="py-16 sm:py-20 bg-slate-50/60" data-purpose="newsletter-strip">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="rounded-3xl bg-[#020617] text-white p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-2 max-w-lg">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {c.newsletter.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                {c.newsletter.desc}
              </p>
            </div>

            {newsletterSuccess ? (
              <div className="inline-flex items-center gap-2 text-[#38b58a] text-xs font-mono font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Subscribed! Check your inbox for confirmation.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="flex flex-wrap sm:flex-nowrap gap-3 w-full md:w-auto">
                <input
                  type="email"
                  required
                  placeholder="you@airline.com"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full sm:w-72 px-4 py-3 rounded-full bg-white/10 border border-white/15 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#38b58a] transition-all"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-[#38b58a] hover:bg-[#2ea87c] text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full transition-all duration-200 shadow-md cursor-pointer whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
