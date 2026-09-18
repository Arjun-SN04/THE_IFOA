import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  RiFlightTakeoffLine,
  RiUser3Line,
  RiCheckboxCircleFill,
  RiMailLine,
  RiPhoneLine,
  RiMapPin2Line,
  RiSendPlaneFill
} from 'react-icons/ri'
import { HiArrowUpRight, HiArrowRight } from 'react-icons/hi2'
import { MdOutlineMail } from 'react-icons/md'

import { CosmicParallaxBg } from '@/components/common/CosmicParallaxBg'
import { CustomSelect } from '@/components/ui/CustomSelect'
import { usePageContent } from '@/hooks/usePageContent'
import { Seo } from '@/components/common/Seo'
import { graph, organizationSchema, localBusinessSchemas, breadcrumbSchema } from '@/lib/seo'
import { api } from '@/lib/api'
import flagSwitzerland from '@/assets/contact/flag-switzerland.png'
import flagUsa from '@/assets/contact/flag-usa.png'
import flagIndia from '@/assets/contact/flag-india.jpg'
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
        badge: 'For Airlines',
        title: 'Training my team',
        desc: 'Fleet-wide or role-specific training, built around your ops manual and your regulator.',
        bullets: ['Fleet-Customized', 'OCC Consulting'],
        ctaLabel: 'Corporate Training'
      },
      {
        eyebrow: 'Individuals',
        badge: 'For Individuals',
        title: 'Becoming a dispatcher',
        desc: 'Certification pathways and course dates for individual applicants.',
        bullets: ['FAA & EASA Path', 'Direct Guidance'],
        ctaLabel: 'Explore Training'
      }
    ]
  },
  form: {
    eyebrow: 'SEND A MESSAGE',
    title: 'Start the conversation',
    submitLabel: 'Send Message',
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
        email: 'info@theifoa.com'
      },
      {
        region: 'Asia',
        country: 'India',
        address: 'Innov8 Old Fort, 2nd Floor, Saket District Centre, New Delhi 110017, India',
        phone: '+91 98101 44034',
        email: 'info@theifoa.com'
      }
    ]
  },
  newsletter: {
    title: 'Stay informed on operational developments',
    desc: 'Occasional briefings on regulatory changes, training best practices, and industry analysis. No spam.',
    successMessage: 'Subscribed! Check your inbox for confirmation.'
  }
}

export function ContactPage() {
  const { c } = usePageContent('contact', FALLBACK)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    organization: '',
    topic: c.form.topics[0] || 'Training my OCC / dispatch team',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterSuccess, setNewsletterSuccess] = useState(false)
  const [newsletterLoading, setNewsletterLoading] = useState(false)
  const [newsletterError, setNewsletterError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.sendContact(formData)
      setSubmitted(true)
    } catch (err) {
      setError(err.message || 'Could not send your message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleNewsletter = async (e) => {
    e.preventDefault()
    if (!newsletterEmail) return
    setNewsletterError('')
    setNewsletterLoading(true)
    try {
      await api.subscribeNewsletter(newsletterEmail)
      setNewsletterSuccess(true)
      setNewsletterEmail('')
    } catch (err) {
      setNewsletterError(err.message || 'Could not subscribe. Please try again.')
    } finally {
      setNewsletterLoading(false)
    }
  }

  const cards = c.hero.cards
  const offices = c.offices.items

  return (
    <div className="bg-white text-rocket-dark selection:bg-[#34E06E] selection:text-slate-950" data-purpose="contact-page">
      <Seo
        path="/contact"
        title="Contact IFOA | Flight Dispatch Training Enquiries"
        description="Contact IFOA's flight operations training team in Switzerland, the United States or India for course dates, eligibility and airline training programmes."
        jsonLd={graph(
          organizationSchema(),
          localBusinessSchemas(),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Contact', path: '/contact' }
          ])
        )}
      />
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[460px] md:min-h-[500px] flex flex-col items-center justify-center bg-[#020617] text-white pt-28 pb-16 overflow-hidden">
        {/* Ambient Aviation Background Art */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={c.hero.image?.url || bannerContactHero}
            alt="IFOA Aviation Operations Contact"
            className="w-full h-full object-cover object-center opacity-30 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/90 via-[#020617]/75 to-[#020617]" />
        </div>

        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 text-center space-y-6 flex flex-col items-center justify-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            {c.hero.title}
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            {c.hero.subtitle}
          </p>

          {/* Clean 2-Column Audience Direct Routing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl pt-6">
            {cards.map((card, idx) => {
              const isAirline = idx === 0
              return (
                <div
                  key={idx}
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      topic: isAirline
                        ? 'Training my OCC / dispatch team'
                        : 'Individual dispatcher certification'
                    }))
                    document.getElementById('contact-main-section')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="rounded-3xl bg-white/[0.06] hover:bg-white/[0.1] backdrop-blur-md border border-white/15 hover:border-white/30 p-7 sm:p-8 flex flex-col justify-between space-y-5 text-white shadow-2xl transition-all duration-300 cursor-pointer text-left hover:-translate-y-1"
                >
                  <div className="space-y-3.5">
                    {/* Badge Header */}
                    <div className="flex items-center justify-between min-h-[1.75rem]">
                      {isAirline ? (
                        <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-black uppercase tracking-wider text-white border-b-2 border-[#34E06E] pb-0.5">
                          <RiFlightTakeoffLine className="w-3.5 h-3.5 text-slate-300" />
                          <span>{card.badge || 'For Airlines'}</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-black uppercase tracking-wider text-[#34E06E] border-b-2 border-[#34E06E] pb-0.5">
                          <RiUser3Line className="w-3.5 h-3.5 text-[#34E06E]" />
                          <span>{card.badge || 'For Individuals'}</span>
                        </div>
                      )}

                      <span className="text-[11px] text-slate-400 font-semibold tracking-wide uppercase font-mono">
                        {card.eyebrow || (isAirline ? 'Airlines & OCCs' : 'Career Pathway')}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug min-h-[3.25rem] flex items-start">
                      {card.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal min-h-[3.75rem]">
                      {card.desc}
                    </p>

                    {/* Feature Highlights */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3.5 border-t border-white/10 text-xs text-slate-200 font-medium min-h-[3rem]">
                      {(card.bullets || []).map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-center gap-1.5">
                          <RiCheckboxCircleFill
                            className={`w-3.5 h-3.5 shrink-0 ${isAirline ? 'text-slate-300' : 'text-[#34E06E]'}`}
                          />
                          <span>{bullet}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto pt-2">
                    {isAirline ? (
                      <button
                        type="button"
                        className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-5 py-2.5 rounded-full text-xs transition-colors inline-flex items-center gap-2 cursor-pointer w-fit"
                      >
                        <span>{card.ctaLabel || 'Corporate Training'}</span>
                        <HiArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="bg-[#34E06E] hover:bg-[#28c85e] text-slate-950 font-extrabold px-5 py-2.5 rounded-full text-xs transition-colors inline-flex items-center gap-2 cursor-pointer w-fit shadow-md hover:shadow-[0_0_15px_rgba(52,224,110,0.4)]"
                      >
                        <span>{card.ctaLabel || 'Explore Training'}</span>
                        <HiArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTACT SECTION (FORM + REGIONAL OFFICES) */}
      <section id="contact-main-section" className="py-16 sm:py-24 bg-white border-b border-slate-200/80 scroll-mt-20" data-purpose="contact-main">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            {/* Left: Contact Form */}
            <div className="lg:col-span-7 flex flex-col space-y-6 h-full">
              <div className="space-y-2">
                <span className="text-xs sm:text-sm font-mono font-black uppercase tracking-widest text-slate-950 border-b-2 border-[#34E06E] pb-1 inline-block">
                  {c.form.eyebrow}
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-rocket-dark">
                  {c.form.title}
                </h2>
              </div>

              <div className="rounded-3xl bg-slate-50/70 border border-slate-200/90 p-7 sm:p-9 shadow-sm flex-1 flex flex-col justify-between">
                {submitted ? (
                  <div className="text-center py-12 space-y-4 animate-in fade-in duration-300 my-auto">
                    <div className="w-16 h-16 rounded-full bg-slate-100 text-[#34E06E] flex items-center justify-center mx-auto">
                      <RiCheckboxCircleFill className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-rocket-dark">
                      Message Transmitted
                    </h3>
                    <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                      Thank you for contacting IFOA. An operational specialist from the appropriate regional desk will review your details and reach out within 24 hours.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="text-xs font-bold uppercase tracking-wider text-[#34E06E] hover:underline pt-2 cursor-pointer"
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
                          className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm text-rocket-dark placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all"
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
                          className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm text-rocket-dark placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all"
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
                        className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm text-rocket-dark placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all"
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
                        className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm text-rocket-dark placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all"
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
                        className="w-full flex-1 min-h-[110px] px-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm text-rocket-dark placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all resize-y"
                      />
                    </div>

                    {error ? (
                      <p className="text-xs font-semibold text-red-600 text-center">{error}</p>
                    ) : null}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#34E06E] hover:bg-[#28c85e] text-slate-950 font-extrabold text-xs uppercase tracking-widest py-4 rounded-full transition-all duration-200 shadow-lg hover:shadow-[0_0_20px_rgba(52,224,110,0.4)] cursor-pointer shrink-0 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                    >
                      <span>
                        {loading
                          ? 'Transmitting...'
                          : (c.form.submitLabel || 'Send Message').replace(/[→\->]/g, '').trim()}
                      </span>
                      {!loading && (
                        <RiSendPlaneFill className="w-4 h-4 text-slate-950 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Right: Regional Offices */}
            <div className="lg:col-span-5 flex flex-col space-y-6 h-full">
              <div className="space-y-2">
                <span className="text-xs sm:text-sm font-mono font-black uppercase tracking-widest text-slate-950 border-b-2 border-[#34E06E] pb-1 inline-block">
                  {c.offices.eyebrow}
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-rocket-dark">
                  {c.offices.title}
                </h2>
              </div>

              <div className="flex-1 flex flex-col justify-between gap-4">
                {offices.map((office, idx) => {
                  const name = (office.country || '').toLowerCase()
                  const flagImg = name.includes('switzerland')
                    ? flagSwitzerland
                    : name.includes('united states') || name.includes('usa')
                    ? flagUsa
                    : name.includes('india')
                    ? flagIndia
                    : [flagSwitzerland, flagUsa, flagIndia][idx] || flagSwitzerland

                  return (
                    <div
                      key={idx}
                      className="group rounded-3xl bg-[#020617] border border-white/10 hover:border-white/25 shadow-xl hover:shadow-2xl transition-all duration-300 p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4 relative overflow-hidden text-white min-h-[190px]"
                    >
                      {/* Ambient Flag Background Art */}
                      <div className="absolute right-0 top-0 bottom-0 w-3/5 sm:w-1/2 overflow-hidden pointer-events-none z-0">
                        <img
                          src={flagImg}
                          alt=""
                          className="w-full h-full object-cover object-center opacity-25 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700 select-none filter contrast-125"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/75 to-transparent" />
                      </div>

                      <div className="relative z-10 space-y-1.5 max-w-sm">
                        <span className="text-[10px] font-mono font-black uppercase tracking-wider text-[#34E06E] border-b border-[#34E06E]/40 pb-0.5 inline-block">
                          {office.region}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight pt-1">
                          {office.country}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed pt-0.5">
                          {office.address}
                        </p>
                      </div>

                      <div className="relative z-10 pt-3.5 border-t border-white/10 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-mono">Phone:</span>
                          <a
                            href={`tel:${office.phone.replace(/[^0-9+]/g, '')}`}
                            className="font-semibold text-white hover:text-[#34E06E] transition-colors"
                          >
                            {office.phone}
                          </a>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-mono">Email:</span>
                          <a
                            href={`mailto:${office.email}`}
                            className="font-semibold text-white hover:text-[#34E06E] transition-colors"
                          >
                            {office.email}
                          </a>
                        </div>
                      </div>
                    </div>
                  )
                })}
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
              <div className="inline-flex items-center gap-2 text-[#34E06E] text-xs font-mono font-bold">
                <RiCheckboxCircleFill className="w-4 h-4" />
                <span>{c.newsletter.successMessage}</span>
              </div>
            ) : (
              <div className="w-full md:w-auto space-y-2">
                <form onSubmit={handleNewsletter} className="flex flex-wrap sm:flex-nowrap gap-3 w-full md:w-auto">
                  <input
                    type="email"
                    required
                    placeholder="you@airline.com"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full sm:w-72 px-4 py-3 rounded-full bg-white/10 border border-white/15 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={newsletterLoading}
                    className="w-full sm:w-auto bg-[#34E06E] hover:bg-[#28c85e] disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-full transition-all duration-200 shadow-md cursor-pointer whitespace-nowrap"
                  >
                    {newsletterLoading ? 'Subscribing…' : 'Subscribe'}
                  </button>
                </form>
                {newsletterError && (
                  <p className="text-xs font-mono text-red-400">{newsletterError}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
