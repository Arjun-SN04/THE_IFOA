import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Shield,
  Award,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Globe2,
  Building,
  Plane,
  Layers,
  HeartHandshake,
  Target,
  Zap,
  MessageSquare
} from 'lucide-react'

import { CosmicParallaxBg } from '@/components/common/CosmicParallaxBg'
import { usePageContent } from '@/hooks/usePageContent'

// Standards Logos
import logoFaa from '@/assets/course/standards-logos/logo-faa.png'
import logoEasa from '@/assets/course/standards-logos/logo-easa.png'
import logoIcao from '@/assets/course/standards-logos/logo-icao.png'

// Official Background
import imgAircraftClouds from '@/assets/profile_media/aviation-aircraft-clouds.jpg'

// Content the page ships with; editable at /admin/pages/about.
const FALLBACK = {
  hero: {
    title: 'Four years in, we became the standard other schools get measured against.',
    subtitle:
      "We stepped away from the traditional training approach in favor of Competency-Based Training and Assessment, because every dispatcher deserves training that's actually exceptional.",
    primaryLabel: 'Book a Consultation',
    secondaryLabel: 'Explore Programs',
    image: null
  },
  executive: {
    heading:
      'In just four years, we became the leading aviation training company in Europe for the education and development of flight dispatchers.',
    sub: 'A position earned through relentless commitment to quality, industry relevance, and real-world results.'
  },
  mission: {
    eyebrow: 'OUR MISSION',
    title: 'Prepared, not just certified',
    intro:
      'Our mission is simple: your team operates at the highest level of safety and efficiency, trained through programs that are effective and affordable, with never a trade-off between the two.',
    values: [
      {
        idx: '01',
        title: 'World-class, accessible',
        desc: 'We take pride in delivering world-class services at accessible prices: excellence and value for every customer we serve.'
      },
      {
        idx: '02',
        title: 'Built on trust',
        desc: "We hold the same uncompromising standard whether or not anyone's watching."
      },
      {
        idx: '03',
        title: 'Driving innovation',
        desc: 'We anchor our culture in continuous improvement, enhancing the training experience and the value we deliver, year over year.'
      }
    ]
  },
  regulatory: {
    eyebrow: 'REGULATORY ALIGNMENT',
    title: 'Designed by active professionals, aligned to the standards that matter',
    intro:
      'Our programs are trusted by top-tier airlines, designed by active aviation professionals, and aligned with the latest regulatory frameworks, including being the first aviation training organization to deliver Flight Operation and Flight Dispatch courses following the prerequisites recommended by the new ICAO Doc 10106 manual.',
    standards: [
      { title: 'EASA Standards', sub: 'ORO.GEN 110 Aligned' },
      { title: 'ICAO Standards', sub: 'Doc 10106 Framework' },
      { title: 'FAA Part 65', sub: 'Approved School' }
    ]
  },
  footprint: {
    eyebrow: 'GLOBAL FOOTPRINT',
    title: 'Operational wherever airlines fly',
    intro:
      'Three regional operational hubs supporting carriers, students, and dispatch teams across four continents.',
    regions: [
      {
        name: 'Europe HQ',
        location: 'Basel, Switzerland',
        facility: 'EuroAirport Hub',
        desc: 'European headquarters leading EASA Part-ORO aligned dispatcher certification and OCC scenario labs.'
      },
      {
        name: 'North America',
        location: 'Daytona Beach, FL',
        facility: 'IFOA USA Operations',
        desc: 'FAA-approved Flight Dispatcher certification school and 14 CFR Part 3 Agent for Service gateway.'
      },
      {
        name: 'India & Asia-Pacific',
        location: 'New Delhi, India',
        facility: 'Aerocity Training Hub',
        desc: 'South Asian operational base delivering DGCA and ICAO Doc 10106 compliant dispatcher programs.'
      }
    ]
  },
  finalCta: {
    title: 'Want to see how this plays out for your team?',
    desc: 'Talk to us about your fleet, your ops manual, and where your OCC needs to be stronger.',
    primaryLabel: 'Book a Consultation',
    secondaryLabel: 'Browse Training Programs'
  }
}

export function AboutPage() {
  const navigate = useNavigate()
  const { c } = usePageContent('about', FALLBACK)

  const coreValues = c.mission.values
  const regions = c.footprint.regions

  return (
    <div className="bg-white text-rocket-dark selection:bg-[#38b58a] selection:text-white" data-purpose="about-page">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[460px] md:min-h-[500px] flex flex-col items-center justify-center bg-[#020617] text-white pt-28 pb-16 overflow-hidden">
        {/* Ambient Aviation Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={c.hero.image?.url || imgAircraftClouds}
            alt="IFOA Aviation History and Standards"
            className="w-full h-full object-cover object-center opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/90 via-[#020617]/75 to-[#020617]" />
        </div>

        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 text-center space-y-6 flex flex-col items-center justify-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            {c.hero.title}
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            {c.hero.subtitle}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate('/contact')}
              className="bg-[#38b58a] hover:bg-[#2ea87c] text-white font-bold px-8 py-3.5 rounded-full text-xs uppercase tracking-widest transition-all duration-200 shadow-xl hover:scale-105 cursor-pointer"
            >
              {c.hero.primaryLabel}
            </button>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-7 py-3.5 rounded-full text-xs uppercase tracking-widest transition-all duration-200"
            >
              <span>{c.hero.secondaryLabel}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#38b58a]" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. EXECUTIVE CLAIM / LEADERSHIP CALLOUT */}
      <section className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200/80" data-purpose="executive-claim">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm p-8 sm:p-12 md:p-14 border-l-4 border-l-[#38b58a] space-y-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-rocket-dark tracking-tight leading-relaxed">
              {c.executive.heading}
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-500 font-mono">
              {c.executive.sub}
            </p>
          </div>
        </div>
      </section>

      {/* 3. OUR MISSION & CORE VALUES */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80" data-purpose="mission-values">
        <div className="max-w-[1280px] mx-auto px-6 space-y-12">
          <div className="max-w-2xl space-y-2.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#38b58a] block">
              {c.mission.eyebrow}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-rocket-dark leading-tight">
              {c.mission.title}
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 font-normal leading-relaxed">
              {c.mission.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coreValues.map((val) => (
              <div
                key={val.idx}
                className="group rounded-3xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:border-[#38b58a]/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-8 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <span className="text-xs font-mono font-bold text-[#38b58a] bg-[#38b58a]/10 px-2.5 py-0.5 rounded-full inline-block">
                    {val.idx}
                  </span>
                  <h3 className="text-xl font-bold text-rocket-dark tracking-tight leading-snug group-hover:text-[#38b58a] transition-colors">
                    {val.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. REGULATORY ALIGNMENT & ACCREDITATION */}
      <section className="py-16 sm:py-24 bg-slate-50/60 border-b border-slate-200/80" data-purpose="regulatory-alignment">
        <div className="max-w-[1280px] mx-auto px-6 space-y-12">
          <div className="max-w-3xl space-y-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#38b58a] block">
              {c.regulatory.eyebrow}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-rocket-dark leading-tight">
              {c.regulatory.title}
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 font-normal leading-relaxed">
              {c.regulatory.intro}
            </p>
          </div>

          {/* Official Standards Logo Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {c.regulatory.standards.map((std, idx) => (
              <div
                key={idx}
                className="rounded-3xl bg-white border border-slate-200/90 shadow-sm p-7 flex items-center gap-5 hover:shadow-xl hover:border-[#38b58a]/40 transition-all duration-300"
              >
                <img
                  src={[logoEasa, logoIcao, logoFaa][idx] || logoIcao}
                  alt=""
                  className="h-11 w-auto object-contain shrink-0"
                />
                <div>
                  <strong className="text-base font-bold text-rocket-dark block">{std.title}</strong>
                  <span className="text-xs text-slate-500 font-medium">{std.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. GLOBAL FOOTPRINT */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80" data-purpose="global-footprint">
        <div className="max-w-[1280px] mx-auto px-6 space-y-12">
          <div className="max-w-2xl space-y-2.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#38b58a] block">
              {c.footprint.eyebrow}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-rocket-dark leading-tight">
              {c.footprint.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
              {c.footprint.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {regions.map((reg, idx) => (
              <div
                key={idx}
                className="group rounded-3xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:border-[#38b58a]/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-8 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-3">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#38b58a]">
                    {reg.name}
                  </span>
                  <h3 className="text-xl font-bold text-rocket-dark tracking-tight">
                    {reg.location}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    {reg.facility}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed pt-2 border-t border-slate-200/60">
                    {reg.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FINAL CONSULTATION CTA */}
      <section className="py-16 sm:py-24 bg-slate-50/60 text-center" data-purpose="about-final-cta">
        <div className="max-w-[800px] mx-auto px-6 space-y-6">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-rocket-dark leading-tight">
            {c.finalCta.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-xl mx-auto">
            {c.finalCta.desc}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate('/contact')}
              className="bg-[#38b58a] hover:bg-[#2ea87c] text-white font-bold px-8 py-3.5 rounded-full text-xs uppercase tracking-widest transition-all duration-200 shadow-xl hover:scale-105 cursor-pointer"
            >
              {c.finalCta.primaryLabel}
            </button>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-rocket-dark font-bold px-7 py-3.5 rounded-full text-xs uppercase tracking-widest transition-all duration-200 shadow-sm"
            >
              <span>{c.finalCta.secondaryLabel}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#38b58a]" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
