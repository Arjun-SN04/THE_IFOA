import React, { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { RiBookReadFill, RiBookOpenFill } from 'react-icons/ri'
import { PiAirplaneTakeoffFill, PiAirplaneTiltFill } from 'react-icons/pi'
import { HiArrowUpRight, HiArrowRight } from 'react-icons/hi2'
import { MdOutlineMail } from 'react-icons/md'

import { CosmicParallaxBg } from '@/components/common/CosmicParallaxBg'
import { Seo } from '@/components/common/Seo'
import { graph, organizationSchema, breadcrumbSchema } from '@/lib/seo'

// Official Magazine Issue Covers
import issue01Cover from '@/assets/magazine/foxtrot-delta-issue-01.png'
import issue02Cover from '@/assets/magazine/foxtrot-delta-issue-02.png'
import issue03Cover from '@/assets/magazine/foxtrot-delta-issue-03.png'
import bannerAviationClouds from '@/assets/profile_media/aviation-aircraft-clouds.jpg'

const FEATURED_EDITIONS = [
  {
    id: 'special-edition',
    number: 'Special Edition',
    date: 'May 2023',
    title: 'Aviation Sustainability',
    subtitle: 'Can Aviation Kick Its Contrail Habit? & Net Zero for Business Aviation',
    coverImage: issue03Cover,
    theme: 'Sustainability & Ecology',
    highlights: ['SATAVIA Contrail Science', 'AZZERA Net Zero Pathways', 'Eco-Climb Profiles']
  },
  {
    id: 'issue-02',
    number: 'Issue N°2',
    date: 'February 2023',
    title: 'Jetfly OCC & Fleet Pioneers',
    subtitle: 'Managing the World’s Largest Pilatus Fleet with High-Precision Dispatch',
    coverImage: issue02Cover,
    theme: 'Fleet Operations',
    highlights: ['Jetfly 60+ PC-12/PC-24 OCC', 'SITA EWAS Predictive Analytics', 'SATAVIA Meteorology']
  },
  {
    id: 'issue-01',
    number: 'Issue N°1',
    date: 'November 2022',
    title: 'The Indian Ocean Pearl',
    subtitle: 'Air Mauritius OCC Operations & Threat-Informed Risk Planning',
    coverImage: issue01Cover,
    theme: 'Oceanic Operations',
    highlights: ['Air Mauritius Isolated Hub', 'Osprey:Sentinel Threat Intel', 'Honeywell Forge Efficiency']
  }
]

export function FoxtrotDeltaPage() {
  const navigate = useNavigate()
  const bookshelfRef = useRef(null)

  const scrollToBookshelf = () => {
    bookshelfRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="bg-white text-rocket-dark selection:bg-[#34E06E] selection:text-slate-950" data-purpose="foxtrot-delta-page">
      <Seo
        path="/foxtrot-delta"
        title="Foxtrot Delta | IFOA Aviation Operations Magazine"
        description="Foxtrot Delta is IFOA's aviation magazine covering airline OCC operations, flight dispatch practice, operational risk planning and aviation sustainability."
        jsonLd={graph(
          organizationSchema(),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Foxtrot Delta', path: '/foxtrot-delta' }
          ])
        )}
      />
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[480px] md:min-h-[520px] flex flex-col items-center justify-center bg-[#020617] text-white pt-28 pb-16 overflow-hidden">
        {/* Ambient Aviation Backdrop */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={bannerAviationClouds}
            alt="Foxtrot Delta Magazine"
            className="w-full h-full object-cover object-center opacity-30 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/95 via-[#020617]/85 to-[#020617]" />
        </div>

        {/* Ambient Starfield */}
        <CosmicParallaxBg className="absolute inset-0 opacity-40 pointer-events-none" />

        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 text-center space-y-6 flex flex-col items-center justify-center">
          <span className="text-xs sm:text-sm font-mono font-black uppercase tracking-widest text-[#34E06E] border-b-2 border-[#34E06E] pb-1 inline-block">
            The Voice of Operational Control
          </span>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Foxtrot Delta Magazine
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-200 font-medium max-w-3xl mx-auto leading-relaxed">
            Meet the Operational Control Teams that make the Magic happen!
          </p>

          <p className="text-xs sm:text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
            The aviation industry’s first and only publication dedicated exclusively to flight dispatchers, crew controllers, and OCC personnel worldwide, spotlighting the essential roles, daily challenges, and forward-thinking innovations that shape modern aviation.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <button
              onClick={scrollToBookshelf}
              className="bg-[#34E06E] hover:bg-[#28c85e] text-slate-950 font-extrabold px-8 py-3.5 rounded-full text-xs uppercase tracking-widest transition-all duration-200 shadow-xl hover:shadow-[0_0_25px_rgba(52,224,110,0.45)] hover:scale-105 cursor-pointer flex items-center gap-2"
            >
              <RiBookReadFill className="w-4 h-4 text-slate-950" />
              <span>Explore Digital Bookshelf</span>
            </button>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-7 py-3.5 rounded-full text-xs uppercase tracking-widest transition-all duration-200 backdrop-blur-sm"
            >
              <PiAirplaneTakeoffFill className="w-4 h-4 text-slate-300" />
              <span>Explore Our Services</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. THE VOICE OF OPERATIONAL CONTROL: INTERACTIVE BOOKSHELF & FEATURED EDITIONS */}
      <section ref={bookshelfRef} id="digital-bookshelf" className="py-16 sm:py-24 bg-slate-50/70 border-b border-slate-200/80 scroll-mt-20" data-purpose="digital-bookshelf-and-collection">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">

          {/* Clean Integrated Bookshelf Container */}
          <div className="relative rounded-3xl bg-white border border-slate-200/80 shadow-[0_16px_45px_rgba(0,0,0,0.05)] overflow-hidden">
            {/* Embedded Responsive HTML5 Bookshelf */}
            <div className="w-full bg-white relative">
              <iframe
                title="Foxtrot Delta Magazine Bookshelf"
                src="https://book577146.publuu.com"
                className="w-full h-[520px] sm:h-[580px] md:h-[620px] border-0"
                allow="clipboard-write; autoplay; fullscreen"
                loading="lazy"
              />
            </div>
          </div>

          {/* Featured Editions Showcase */}
          <div className="space-y-10 pt-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-10 border-t border-slate-200/80">
              <div className="max-w-2xl space-y-3 text-left">
                <span className="text-xs sm:text-sm font-mono font-black uppercase tracking-widest text-slate-950 border-b-2 border-[#34E06E] pb-1 inline-block">
                  The Collection
                </span>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  Featured Foxtrot Delta Issues
                </h3>
                <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                  Highlights from our landmark publications covering OCC leadership, technological breakthroughs, and flight safety science.
                </p>
              </div>

              <button
                onClick={scrollToBookshelf}
                className="inline-flex items-center gap-1.5 text-xs font-bold font-mono uppercase tracking-wider text-slate-900 hover:text-[#0d6833] transition-colors self-start md:self-auto cursor-pointer group"
              >
                <span>View All on Bookshelf</span>
                <HiArrowUpRight className="w-4 h-4 text-[#0d6833] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {FEATURED_EDITIONS.map((issue) => (
                <div
                  key={issue.id}
                  className="group rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] transition-all duration-300 p-6 flex flex-col justify-between space-y-5 hover:-translate-y-1 text-left"
                >
                  <div className="space-y-4">
                    {/* Clean Magazine Cover Visual */}
                    <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.04)] group-hover:shadow-[0_10px_28px_rgba(0,0,0,0.08)] transition-all duration-500">
                      <img
                        src={issue.coverImage}
                        alt={`Foxtrot Delta ${issue.number}`}
                        className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
                      />
                    </div>

                    {/* Metadata & Title */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-black uppercase tracking-wider text-slate-950 border-b-2 border-[#34E06E] pb-0.5 inline-block">
                          {issue.number}
                        </span>
                        <span className="text-xs text-slate-400 font-medium font-mono">{issue.date}</span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug group-hover:text-[#0d6833] transition-colors">
                        {issue.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                        {issue.subtitle}
                      </p>
                    </div>

                    {/* Highlights List */}
                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 block">
                        Inside This Issue
                      </span>
                      <ul className="space-y-1.5">
                        {issue.highlights.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#34E06E] shrink-0" />
                            <span className="font-medium text-slate-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <button
                      onClick={scrollToBookshelf}
                      className="w-full bg-slate-950 hover:bg-[#34E06E] hover:text-slate-950 text-white font-bold py-2.5 px-4 rounded-xl text-xs tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md group/btn"
                    >
                      <RiBookOpenFill className="w-4 h-4 text-[#34E06E] group-hover/btn:text-slate-950 transition-colors" />
                      <span>Read Issue</span>
                      <HiArrowRight className="w-3.5 h-3.5 opacity-60 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA */}
      <section className="py-16 sm:py-20 bg-slate-50/70 text-center border-t border-slate-200/80" data-purpose="foxtrot-final-cta">
        <div className="max-w-[760px] mx-auto px-6 space-y-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
            Ready to enhance your operational competencies?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Book the most suitable training program to acquire essential decision-making skills, regulatory compliance, and peak operational performance.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/services"
              className="bg-[#34E06E] hover:bg-[#28c85e] text-slate-950 font-extrabold px-8 py-3.5 rounded-full text-xs uppercase tracking-widest transition-all duration-200 shadow-xl hover:shadow-[0_0_20px_rgba(52,224,110,0.4)] hover:scale-105 flex items-center gap-2"
            >
              <PiAirplaneTiltFill className="w-4 h-4 text-slate-950" />
              <span>Explore Training Programs</span>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold px-7 py-3.5 rounded-full text-xs uppercase tracking-widest transition-all duration-200 shadow-sm"
            >
              <MdOutlineMail className="w-4 h-4 text-slate-500" />
              <span>Contact Us</span>
              <HiArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default FoxtrotDeltaPage
