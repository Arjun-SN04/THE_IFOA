import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { RiBookReadFill, RiBookOpenFill } from 'react-icons/ri'
import { PiAirplaneTakeoffFill, PiAirplaneTiltFill } from 'react-icons/pi'
import { HiArrowUpRight, HiArrowRight } from 'react-icons/hi2'
import { MdOutlineMail } from 'react-icons/md'

import { CosmicParallaxBg } from '@/components/common/CosmicParallaxBg'
import { Reveal } from '@/components/common/Reveal'
import { CmsText } from '@/components/admin/CmsEditable'
import { Seo } from '@/components/common/Seo'
import { graph, organizationSchema, breadcrumbSchema } from '@/lib/seo'
import { usePageContent } from '@/hooks/usePageContent'

// Official Magazine Issue Covers
import issue01Cover from '@/assets/foxtrotDelta/foxtrot-delta-issue-01.webp'
import issue02Cover from '@/assets/foxtrotDelta/foxtrot-delta-issue-02.webp'
import issue03Cover from '@/assets/foxtrotDelta/foxtrot-delta-issue-03.webp'
import bannerAviationClouds from '@/assets/shared/photos/aviation-aircraft-clouds.jpg'

// Cover images are local static assets keyed by edition ID; the rest of the
// edition's copy (title, dates, highlights, etc.) is admin-editable.
const EDITION_COVERS = {
  'special-edition': issue03Cover,
  'issue-02': issue02Cover,
  'issue-01': issue01Cover
}

// Content the page ships with; editable at /admin/pages/foxtrotDelta.
const FALLBACK = {
  hero: {
    eyebrow: 'The Voice of Operational Control',
    title: 'Foxtrot Delta Magazine',
    subtitle: 'Meet the Operational Control Teams that make the Magic happen!',
    description:
      'The aviation industry’s first and only publication dedicated exclusively to flight dispatchers, crew controllers, and OCC personnel worldwide, spotlighting the essential roles, daily challenges, and forward-thinking innovations that shape modern aviation.',
    exploreLabel: 'Explore Digital Bookshelf',
    servicesLabel: 'Explore Our Services'
  },
  collection: {
    eyebrow: 'The Collection',
    title: 'Featured Foxtrot Delta Issues',
    intro:
      'Highlights from our landmark publications covering OCC leadership, technological breakthroughs, and flight safety science.',
    viewAllLabel: 'View All on Bookshelf',
    editions: [
      {
        id: 'special-edition',
        number: 'Special Edition',
        date: 'May 2023',
        title: 'Aviation Sustainability',
        subtitle: 'Can Aviation Kick Its Contrail Habit? & Net Zero for Business Aviation',
        theme: 'Sustainability & Ecology',
        readLabel: 'Read Issue',
        highlights: ['SATAVIA Contrail Science', 'AZZERA Net Zero Pathways', 'Eco-Climb Profiles']
      },
      {
        id: 'issue-02',
        number: 'Issue N°2',
        date: 'February 2023',
        title: 'Jetfly OCC & Fleet Pioneers',
        subtitle: 'Managing the World’s Largest Pilatus Fleet with High-Precision Dispatch',
        theme: 'Fleet Operations',
        readLabel: 'Read Issue',
        highlights: ['Jetfly 60+ PC-12/PC-24 OCC', 'SITA EWAS Predictive Analytics', 'SATAVIA Meteorology']
      },
      {
        id: 'issue-01',
        number: 'Issue N°1',
        date: 'November 2022',
        title: 'The Indian Ocean Pearl',
        subtitle: 'Air Mauritius OCC Operations & Threat-Informed Risk Planning',
        theme: 'Oceanic Operations',
        readLabel: 'Read Issue',
        highlights: ['Air Mauritius Isolated Hub', 'Osprey:Sentinel Threat Intel', 'Honeywell Forge Efficiency']
      }
    ]
  },
  finalCta: {
    title: 'Ready to enhance your operational competencies?',
    desc:
      'Book the most suitable training program to acquire essential decision-making skills, regulatory compliance, and peak operational performance.',
    exploreLabel: 'Explore Training Programs',
    contactLabel: 'Contact Us'
  }
}

export function FoxtrotDeltaPage() {
  const bookshelfRef = useRef(null)
  const { c } = usePageContent('foxtrotDelta', FALLBACK)
  const featuredEditions = c.collection.editions.map((e, i) => ({ ...e, _path: `collection.editions.${i}` }))

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
            <CmsText path="hero.eyebrow" value={c.hero.eyebrow} />
          </span>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            <CmsText path="hero.title" value={c.hero.title} />
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-200 font-medium max-w-3xl mx-auto leading-relaxed">
            <CmsText path="hero.subtitle" value={c.hero.subtitle} />
          </p>

          <p className="text-xs sm:text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
            <CmsText path="hero.description" value={c.hero.description} />
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <button
              onClick={scrollToBookshelf}
              className="bg-[#34E06E] hover:bg-[#28c85e] text-slate-950 font-extrabold px-8 py-3.5 rounded-full text-xs uppercase tracking-widest transition-all duration-200 shadow-xl hover:shadow-[0_0_25px_rgba(52,224,110,0.45)] hover:scale-105 cursor-pointer flex items-center gap-2"
            >
              <RiBookReadFill className="w-4 h-4 text-slate-950" />
              <span>
                <CmsText path="hero.exploreLabel" value={c.hero.exploreLabel} />
              </span>
            </button>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-7 py-3.5 rounded-full text-xs uppercase tracking-widest transition-all duration-200 backdrop-blur-sm"
            >
              <PiAirplaneTakeoffFill className="w-4 h-4 text-slate-300" />
              <span>
                <CmsText path="hero.servicesLabel" value={c.hero.servicesLabel} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. THE VOICE OF OPERATIONAL CONTROL: INTERACTIVE BOOKSHELF & FEATURED EDITIONS */}
      <Reveal as="section" ref={bookshelfRef} id="digital-bookshelf" className="py-16 sm:py-24 bg-slate-50/70 border-b border-slate-200/80 scroll-mt-20" data-purpose="digital-bookshelf-and-collection">
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
                  <CmsText path="collection.eyebrow" value={c.collection.eyebrow} />
                </span>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  <CmsText path="collection.title" value={c.collection.title} />
                </h3>
                <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                  <CmsText path="collection.intro" value={c.collection.intro} />
                </p>
              </div>

              <button
                onClick={scrollToBookshelf}
                className="inline-flex items-center gap-1.5 text-xs font-bold font-mono uppercase tracking-wider text-slate-900 hover:text-[#34E06E] transition-colors self-start md:self-auto cursor-pointer group"
              >
                <span>
                  <CmsText path="collection.viewAllLabel" value={c.collection.viewAllLabel} />
                </span>
                <HiArrowUpRight className="w-4 h-4 text-slate-700 group-hover:text-[#34E06E] transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredEditions.map((issue) => (
                <div
                  key={issue.id}
                  className="group rounded-3xl bg-white border border-slate-200/90 hover:border-slate-300 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between space-y-5 hover:-translate-y-1 text-left"
                >
                  <div className="space-y-4">
                    {/* Clean Magazine Cover Visual */}
                    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.04)] group-hover:shadow-[0_10px_28px_rgba(0,0,0,0.08)] transition-all duration-500">
                      <img
                        src={EDITION_COVERS[issue.id]}
                        alt={`Foxtrot Delta ${issue.number}`}
                        className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
                      />
                    </div>

                    {/* Metadata & Title */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2 min-h-[1.75rem]">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200/90">
                          <CmsText path={`${issue._path}.number`} value={issue.number} />
                        </span>
                        <span className="text-xs text-slate-500 font-medium font-mono">
                          <CmsText path={`${issue._path}.date`} value={issue.date} />
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug min-h-[3.25rem] flex items-start">
                        <CmsText path={`${issue._path}.title`} value={issue.title} />
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed min-h-[3.5rem]">
                        <CmsText path={`${issue._path}.subtitle`} value={issue.subtitle} />
                      </p>
                    </div>

                    {/* Highlights List */}
                    <div className="pt-3.5 border-t border-slate-100 space-y-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 block">
                        Inside This Issue
                      </span>
                      <div className="space-y-1.5 min-h-[6.5rem]">
                        {issue.highlights.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-50/80 border border-slate-100 text-xs text-slate-700"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#34E06E] shrink-0" />
                            <span className="font-semibold text-slate-800 truncate">
                              <CmsText path={`${issue._path}.highlights.${idx}`} value={item} />
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-3 border-t border-slate-100">
                    <button
                      onClick={scrollToBookshelf}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md group/btn"
                    >
                      <RiBookOpenFill className="w-4 h-4 text-[#34E06E] transition-colors" />
                      <span>
                        <CmsText path={`${issue._path}.readLabel`} value={issue.readLabel} />
                      </span>
                      <HiArrowRight className="w-3.5 h-3.5 opacity-60 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* 6. FINAL CTA */}
      <Reveal as="section" className="py-16 sm:py-20 bg-slate-50/70 text-center border-t border-slate-200/80" data-purpose="foxtrot-final-cta">
        <div className="max-w-[760px] mx-auto px-6 space-y-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
            <CmsText path="finalCta.title" value={c.finalCta.title} />
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            <CmsText path="finalCta.desc" value={c.finalCta.desc} />
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/services"
              className="bg-[#34E06E] hover:bg-[#28c85e] text-slate-950 font-extrabold px-8 py-3.5 rounded-full text-xs uppercase tracking-widest transition-all duration-200 shadow-xl hover:shadow-[0_0_20px_rgba(52,224,110,0.4)] hover:scale-105 flex items-center gap-2"
            >
              <PiAirplaneTiltFill className="w-4 h-4 text-slate-950" />
              <span>
                <CmsText path="finalCta.exploreLabel" value={c.finalCta.exploreLabel} />
              </span>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold px-7 py-3.5 rounded-full text-xs uppercase tracking-widest transition-all duration-200 shadow-sm"
            >
              <MdOutlineMail className="w-4 h-4 text-slate-500" />
              <span>
                <CmsText path="finalCta.contactLabel" value={c.finalCta.contactLabel} />
              </span>
              <HiArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  )
}

export default FoxtrotDeltaPage
