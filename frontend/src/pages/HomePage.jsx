import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Globe,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Shield,
  Sparkles,
  Mail,
  Briefcase,
  Layers,
  Star,
  Clock,
  User,
  Building2
} from 'lucide-react'

import { CosmicParallaxBg } from '@/components/common/CosmicParallaxBg'
import hero3dMockup from '@/assets/home/hero-3d-mockup.webp'
import hero3dMockupPng from '@/assets/home/hero-3d-mockup.png'
import heroBanner from '@/assets/home/IOFA-banner_10@1920x1280.jpg'
import bannerSuccess from '@/assets/home/IOFA-banner_08@1920x1280.jpg'
import imgDHL from '@/assets/common/DHL-Austria-Initial-Training.jpeg'
import imgENAC from '@/assets/common/EANC-2025.jpg'
import worldGlobeBg from '@/assets/home/earth-cosmic-globe.jpg'
import worldMapBg from '@/assets/home/world-map-blue.png'
import ifoaIndiaLogo from '@/assets/brand/IFOA_India_blanc_orange_vert-953x1024.png'
import ifoaUsaLogo from '@/assets/brand/IFOA_USA_blanc_V-932x1024.png'
import ifoaBahrainLogo from '@/assets/brand/IFOA_BAHRAIN_Blanc_Doree.png'
import ifoaLogo from '@/assets/brand/ifoa-logoweb.png'
import imgTeamTraining from '@/assets/profile_media/dhl-austria-team-training.jpg'
import imgEnacCohort from '@/assets/profile_media/enac-training-cohort.jpg'

// Course Book Package 3D Banners
import courseBannerDispatcher3D from '@/assets/courses/course_banner_dispatcher_3d.jpg'
import courseBannerGroundOps3D from '@/assets/courses/course_banner_ground_ops_3d.jpg'
import imgFlightDispatch from '@/assets/common/Flight-Dispatch-Webpage-Small.jpg'
import imgGroundOps from '@/assets/common/aviation-ground-operations.jpg'
import imgTrainTrainer from '@/assets/common/Train-the-trainer.jpg'
import imgConsulting from '@/assets/common/aviation-consulting-support.jpg'

// Testimonial Brand Logos
import logoDHL from '@/assets/partners/DHL-150.png'
import logoAirAlsie from '@/assets/partners/Air-Alsie-150.png'
import logoJetfly from '@/assets/partners/Jetfly-150.png'
import logoComlux from '@/assets/partners/Comlux-150.png'
import logoENAC from '@/assets/partners/ENAC-150.png'
import logoChallenge from '@/assets/partners/Challenge-Group-150.png'
import logoAzerbaijan from '@/assets/partners/Azerbaijan-Airlines-150.png'
import logoSilkWayWest from '@/assets/partners/SWW-150.png'
import logoDAT from '@/assets/partners/DAT-150.png'
import logoShankhAir from '@/assets/partners/Shankh-Air-150.png'

// Official Testimonial Graphic Posters
import cardJetfly from '@/assets/testimonials/testimonial-card-1.png'
import cardChallenge from '@/assets/testimonials/testimonial-card-2.png'
import cardDAT from '@/assets/testimonials/testimonial-card-3.png'
import cardShankh from '@/assets/testimonials/testimonial-card-4.png'
import cardSilkWayWest from '@/assets/testimonials/testimonial-card-5.png'
import cardAzerbaijan from '@/assets/testimonials/testimonial-card-6.png'

// Standards Logos
import logoFaa from '@/assets/course/standards-logos/logo-faa.png'
import logoEasa from '@/assets/course/standards-logos/logo-easa.png'
import logoIcao from '@/assets/course/standards-logos/logo-icao.png'

// Strategic Partner Logos
import logoClick from '@/assets/partners/Click-Logo-150.png'
import logoDynamic from '@/assets/partners/Dynamic-Advanced-Logo-150.png'
import logoOsprey from '@/assets/partners/Osprey_logo_PNG.png'
import logoFCG from '@/assets/partners/FCG-Logo-150.png'
import logoFoxtrot from '@/assets/partners/Logo-short-Fox-Trot-AeroSolutions.png'
import logoCompass from '@/assets/partners/Compass-DeIcing-Consultancy-Logo-150.png'
import logoJester from '@/assets/partners/Jester-Logo-150.png'
import logoPrecadet from '@/assets/partners/Precadet-Logo-150.png'
import logoAirconomics from '@/assets/partners/Airconomics-Logo-150.png'

import imageData from '../../assets/image.json'

// Vite eager glob import for all downloaded partner images
const partnerImageModules = import.meta.glob('/src/assets/partners/*.{png,jpg,jpeg,svg}', {
  eager: true,
  import: 'default'
})

const excludedPartnerFilenames = new Set([
  'astra.svg',
  'DHL-Austria-Initial-Training-Zoom.jpeg',
  'EANC-2025.jpg',
  'cropped-logo_bleu_vert-Identity.png',
  'FCG-Ops-150.png',
  // Not part of the "OUR CUSTOMERS" airline/operator list (strategic partners,
  // consultancies, or logos absent from that sheet)
  'Airconomics-Logo-150.png',
  'Avincis-FKT-150-1.png',
  'Click-Logo-150.png',
  'Compass-DeIcing-Consultancy-Logo-150.png',
  'Dynamic-Advanced-Logo-150.png',
  'GetJet-Airlines-150.png',
  'Jester-Logo-150.png',
  'Jetflite-150-1.png',
  'Logo-short-Fox-Trot-AeroSolutions.png',
  'Osprey_logo_PNG.png',
  'Precadet-Logo-150.png',
  'X-Operations-150.png'
])

function getCleanPartnerName(label, filename) {
  let name = (label || '').trim()
  for (const suffix of [' 150 1', ' 150', ' 1', ' PNG']) {
    if (name.endsWith(suffix)) {
      name = name.slice(0, -suffix.length)
    }
  }
  name = name.replace(/\s+Logo\s*$/i, '').replace(/^Logo\s+/i, '').replace(/^Logo\s+short\s+/i, '').replace(/^Short\s+/i, '').trim()
  if (filename.includes('Fox-Trot') || filename.includes('Foxtrot')) return 'Foxtrot AeroSolutions'
  if (name.toLowerCase() === 'fcg' || name.toLowerCase() === 'fcg ops') return 'FCG Ops'
  if (name.toLowerCase() === 'avincis fkt') return 'Avincis'
  if (name.toLowerCase() === 'g ops') return 'G-OPS'
  if (name.toLowerCase() === 'wilderoe') return 'Widerøe'
  return name
}

const seenPartnerNames = new Set()
const partnerLogos = []

for (const item of imageData) {
  if (
    (item.category === 'Partner & Airline Logos' || item.type === 'partner_logo') &&
    !excludedPartnerFilenames.has(item.masterFilename)
  ) {
    const cleanName = getCleanPartnerName(item.label, item.masterFilename)
    if (!seenPartnerNames.has(cleanName)) {
      seenPartnerNames.add(cleanName)
      // Resolved by the Vite glob above; every marquee logo lives in src/assets/partners.
      const localSrc = partnerImageModules[`/src/assets/partners/${item.masterFilename}`]
      partnerLogos.push({
        name: cleanName,
        filename: item.masterFilename,
        url: localSrc
      })
    }
  }
}

export function HomePage() {
  const navigate = useNavigate()
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  const strategicPartners = [
    { name: 'Click Aviation Network', logo: logoClick, category: 'Global Trip Support & OCC' },
    { name: 'Dynamic Advanced Training', logo: logoDynamic, category: 'Aviation Safety & Cabin Training' },
    { name: 'Osprey Flight Solutions', logo: logoOsprey, category: 'Aviation Risk & Intelligence' },
    { name: 'FCG OPS', logo: logoFCG, category: 'Flight Control & Ground Handling' },
    { name: 'Fox-Trot AeroSolutions', logo: logoFoxtrot, category: 'Aeronautical Consulting & Audits' },
    { name: 'Compass Ramp & De-Icing', logo: logoCompass, category: 'Ramp Safety & De-Icing Experts' },
    { name: 'Jester', logo: logoJester, category: 'Crew & Dispatch Solutions' },
    { name: 'Precadet', logo: logoPrecadet, category: 'Aviation Candidate Selection' },
    { name: 'AIRconomics', logo: logoAirconomics, category: 'Aviation Business Consulting' }
  ]

  const testimonials = [
    {
      name: 'Challenge Group',
      role: 'Duty Manager Team Member / Initial Training · 2026',
      company: 'Challenge Group',
      logo: logoChallenge,
      cardImage: cardChallenge,
      invertOnDark: false,
      logoSize: 'h-10 max-w-[150px]',
      quote:
        'In an environment where we rely heavily on automation, revisiting the basics reinforced core principles and improved overall situational understanding.',
      badge: 'Initial Training'
    },
    {
      name: 'Fabrice Laroye',
      role: 'Nominated Person Crew Training / Jetfly',
      company: 'Jetfly',
      logo: logoJetfly,
      cardImage: cardJetfly,
      invertOnDark: true,
      logoSize: 'h-11 max-w-[150px]',
      quote:
        "It's by far the best “DG non-Carry” course I've taken, and it's very relevant to our operations. You highlighted the noticeable items of our OMs and provided specific approval for a better understanding of our crews' day-to-day work and responsibilities.",
      badge: 'Crew Training Accredited'
    },
    {
      name: 'Danish Air Transport',
      role: 'Flight Dispatch Team Member / Recurrent Training · 2025',
      company: 'DAT',
      logo: logoDAT,
      cardImage: cardDAT,
      invertOnDark: false,
      logoSize: 'h-10 max-w-[130px]',
      quote: 'Great training, it was an amazing time',
      badge: 'Recurrent Training'
    },
    {
      name: 'Silk Way West Airlines',
      role: 'Flight Dispatch Team Member / EDTO & Recurrent Training · 2026',
      company: 'Silk Way West Airlines',
      logo: logoSilkWayWest,
      cardImage: cardSilkWayWest,
      invertOnDark: false,
      logoSize: 'h-9 max-w-[150px]',
      quote:
        'The training strengthened my confidence in applying the procedures in real operations.',
      badge: 'EDTO & Recurrent Training'
    },
    {
      name: 'Shankh Aviation',
      role: 'Safety Manager / Train the Trainer · 2025',
      company: 'Shankh Air',
      logo: logoShankhAir,
      cardImage: cardShankh,
      invertOnDark: false,
      logoSize: 'h-9 max-w-[150px]',
      quote:
        'The training session was utterly exceptional, the instructor was exceedingly knowledgeable.',
      badge: 'Train the Trainer'
    },
    {
      name: 'Azerbaijan Airlines',
      role: 'Flight Dispatch Team Member / Recurrent Training · 2026',
      company: 'Azerbaijan Airlines',
      logo: logoAzerbaijan,
      cardImage: cardAzerbaijan,
      invertOnDark: false,
      logoSize: 'h-10 max-w-[160px]',
      quote:
        'The most beneficial part was the scenario-based training and the focus on operational decision-making.',
      badge: 'Recurrent Training'
    },
    {
      name: 'Filipe Sanches',
      role: 'OCC Manager / DHL Austria',
      company: 'DHL Austria',
      logo: logoDHL,
      cardImage: null,
      invertOnDark: false,
      logoSize: 'h-8 max-w-[130px]',
      quote:
        'High-quality and tailored training is vital for Flight Operation personnel, but it is also challenging to find in the market. IFOA provides precisely what a high-standard operator looks for. Choosing IFOA is really a no-brainer, as Training quality and flexibility are always guaranteed.',
      badge: 'Operational Control Certified'
    },
    {
      name: 'Hans Jorgen Westen',
      role: 'Deputy Ground Operations Manager / Air Alsie',
      company: 'Air Alsie',
      logo: logoAirAlsie,
      cardImage: null,
      invertOnDark: true,
      logoSize: 'h-11 max-w-[160px]',
      quote:
        'We selected The International Flight Operations Academy due to the fact, that we rely on high-quality training for our Dispatch staff. The training we received from IFOA was very professional and fully met our expectations. IFOA is highly recommendable.',
      badge: 'Flight Operations Validated'
    },
    {
      name: 'Syed Ahmed Zahid',
      role: 'Head of Operations Control / Comlux',
      company: 'Comlux',
      logo: logoComlux,
      cardImage: null,
      invertOnDark: true,
      logoSize: 'h-12 max-w-[160px]',
      quote:
        "IFOA stands out for several reasons. First and foremost, the depth of expertise and professionalism displayed by your team is truly remarkable. From the instructors' in-depth knowledge to the well-structured curriculum, IFOA's commitment to excellence is evident at every step.",
      badge: 'Operations Control Verified'
    },
    {
      name: 'Norbert Papon',
      role: 'Training Manager Flight Dispatch / ENAC',
      company: 'ENAC',
      logo: logoENAC,
      cardImage: null,
      invertOnDark: true,
      logoSize: 'h-11 max-w-[160px]',
      quote:
        "Collaborating with IFOA has been an enriching experience. Their contributions consistently enhance our programs, especially in the Dispatcher courses and Master's programs, making them more robust and up-to-date.",
      badge: 'Academic Partnership Accredited'
    }
  ]

  const operationalTeamPhotos = [
    {
      src: imgTeamTraining,
      alt: 'DHL Flight Operations Team Training',
      objectPos: 'object-top'
    },
    {
      src: imgEnacCohort,
      alt: 'ENAC & University Aviation Training Cohort',
      objectPos: 'object-center'
    }
  ]
  const [photoIndex, setPhotoIndex] = useState(0)

  useEffect(() => {
    const photoTimer = setInterval(() => {
      setPhotoIndex((prev) => (prev + 1) % 2)
    }, 5000)
    return () => clearInterval(photoTimer)
  }, [])

  const [feedbackTab, setFeedbackTab] = useState('visual') // 'visual' | 'executive' | 'all'

  const filteredTestimonials = testimonials.filter((item) => {
    if (feedbackTab === 'visual') return Boolean(item.cardImage)
    if (feedbackTab === 'executive') return !item.cardImage
    return true
  })

  const [reviewsPerView, setReviewsPerView] = useState(3)

  useEffect(() => {
    const updateReviewsPerView = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth >= 1024) setReviewsPerView(3)
        else if (window.innerWidth >= 640) setReviewsPerView(2)
        else setReviewsPerView(1)
      }
    }
    updateReviewsPerView()
    window.addEventListener('resize', updateReviewsPerView)
    return () => window.removeEventListener('resize', updateReviewsPerView)
  }, [])

  const timerRef = useRef(null)

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % filteredTestimonials.length)
    }, 6500)
  }, [filteredTestimonials.length])

  useEffect(() => {
    resetTimer()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [resetTimer])

  const handleNextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % filteredTestimonials.length)
    resetTimer()
  }

  const handlePrevTestimonial = () => {
    setActiveTestimonial((prev) => (prev === 0 ? filteredTestimonials.length - 1 : prev - 1))
    resetTimer()
  }

  const logoScrollRef = useRef(null)
  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)
  const hasMovedRef = useRef(false)

  const handleMouseDown = (e) => {
    if (!logoScrollRef.current) return
    isDraggingRef.current = true
    hasMovedRef.current = false
    startXRef.current = e.pageX - logoScrollRef.current.offsetLeft
    scrollLeftRef.current = logoScrollRef.current.scrollLeft
  }

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !logoScrollRef.current) return
    e.preventDefault()
    const x = e.pageX - logoScrollRef.current.offsetLeft
    const walk = (x - startXRef.current) * 1.5
    if (Math.abs(walk) > 4) {
      hasMovedRef.current = true
    }
    logoScrollRef.current.scrollLeft = scrollLeftRef.current - walk
  }

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false
  }

  const isFirstMountRef = useRef(true)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false
      return
    }
    if (!logoScrollRef.current) return
    const activeEl = logoScrollRef.current.querySelector(`[data-logo-index="${activeTestimonial}"]`)
    if (activeEl && logoScrollRef.current) {
      const containerLeft = logoScrollRef.current.getBoundingClientRect().left
      const elLeft = activeEl.getBoundingClientRect().left
      const offset = elLeft - containerLeft - (logoScrollRef.current.clientWidth / 2) + (activeEl.clientWidth / 2)
      logoScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' })
    }
  }, [activeTestimonial])

  const trainingPathways = [
    {
      category: 'Initial Training',
      title: 'EASA Standards',
      desc: 'Flight Dispatch Initial Training aligned with ICAO Doc 10106 and EASA ORO.GEN.110 requirements.',
      hours: '175 Hours · Hybrid',
      linkText: 'Explore EASA Training',
      link: '/events-courses'
    },
    {
      category: 'FAA Approved',
      title: 'FAA Part 65',
      desc: 'FAA-approved Aircraft Dispatcher certification training delivered through IFOA USA.',
      hours: '200 Hours · USA',
      linkText: 'Explore FAA Training',
      link: '/events-courses'
    },
    {
      category: 'Multiple Certification',
      title: 'EASA + FAA',
      desc: 'Combined pathway integrating FAA Part 65 certification with European operational knowledge.',
      hours: '200 Hours · Hybrid',
      linkText: 'Explore Combined Training',
      link: '/events-courses'
    },
    {
      category: 'Maintain Competency',
      title: 'Recurrent Training',
      desc: 'Customized recurrent programs based on the operator, regulatory framework, and fleet.',
      hours: 'Carrier-Customized',
      linkText: 'Recurrent Programs',
      link: '/events-courses'
    },
    {
      category: 'Professional Development',
      title: 'Advanced Training',
      desc: 'Scenario-driven development for experienced dispatchers and OCC professionals.',
      hours: 'Scenario-Driven',
      linkText: 'Advanced Programs',
      link: '/events-courses'
    },
    {
      category: 'Operational Teams',
      title: 'Specialist Training',
      desc: 'Crew Control, Ground Operations, Dangerous Goods and Train-the-Trainer programs.',
      hours: 'CBTA Modular Tracks',
      linkText: 'All Specialist Training',
      link: '/events-courses'
    }
  ]

  const [pathwayIndex, setPathwayIndex] = useState(0)
  const [cardsPerView, setCardsPerView] = useState(3)

  useEffect(() => {
    const updateCardsPerView = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth >= 1024) setCardsPerView(3)
        else if (window.innerWidth >= 640) setCardsPerView(2)
        else setCardsPerView(1)
      }
    }
    updateCardsPerView()
    window.addEventListener('resize', updateCardsPerView)
    return () => window.removeEventListener('resize', updateCardsPerView)
  }, [])

  const totalPathwayPages = Math.ceil(trainingPathways.length / cardsPerView)

  useEffect(() => {
    setPathwayIndex(0)
  }, [cardsPerView])

  const handleNextPathway = () => {
    setPathwayIndex((prev) => (prev + 1) % totalPathwayPages)
  }

  const handlePrevPathway = () => {
    setPathwayIndex((prev) => (prev === 0 ? totalPathwayPages - 1 : prev - 1))
  }

  const services = [
    {
      title: 'Flight Dispatch Initial',
      role: 'EASA & FAA Standard Certification',
      link: '/services',
      image: imgFlightDispatch,
      desc: 'Earn a Flight Dispatcher certification meeting both EASA and FAA Part 65 standards with live OCC simulator scenarios.'
    },
    {
      title: 'Ground Operations',
      role: 'ISAGO & Ramp Safety Standards',
      link: '/services',
      image: imgGroundOps,
      desc: 'Boost your operational skills to actively enhance turnaround safety on airport and FBO ramps worldwide.'
    },
    {
      title: 'Train the Trainer',
      role: 'ICAO CBTA Instructional Pedagogy',
      link: '/services',
      image: imgTrainTrainer,
      desc: 'Master competency-based adult learning techniques and instructional methods tailored to aviation requirements.'
    },
    {
      title: 'Consulting & OCC Audits',
      role: 'Airline Modernization & Support',
      link: '/services',
      image: imgConsulting,
      desc: 'Transform operational control challenges into results with our specialized aviation consulting expertise.'
    }
  ]


  return (
    <div className="font-sans text-rocket-dark bg-white">
      {/* BEGIN: HeroSection */}
      <section className="relative w-full min-h-screen min-h-[100dvh] text-white overflow-hidden border-b border-white/10 flex flex-col" data-purpose="hero-content">
        <CosmicParallaxBg
          className="cosmic-parallax-bg min-h-screen min-h-[100dvh] flex flex-col justify-between pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-6 sm:pb-8 px-4 sm:px-6 lg:px-8"
          contentClassName="justify-between flex-1 flex flex-col h-full"
        >
          <div className="max-w-[1280px] w-full mx-auto my-auto py-4 sm:py-6 lg:py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-center">
              {/* Left Column: Typography & CTAs */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-left">
                {/* Eyebrow Label with Green Underline */}
                <div className="inline-flex items-center pb-1 border-b border-white text-white text-xs sm:text-[13px] font-mono font-medium tracking-widest uppercase w-fit">
                  <span>International Flight Operations Academy</span>
                </div>

                {/* Main Headline & Subtitle */}
                <div className="space-y-4 sm:space-y-5 max-w-2xl">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
                    Trained for the moment <br className="hidden sm:inline" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-300">
                      nothing goes to plan.
                    </span>
                  </h1>

                  <p className="text-slate-300 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed max-w-xl font-normal">
                    IFOA prepares flight dispatchers and OCC teams for the decisions that matter at 3am not just the ones covered on the exam.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2 sm:pt-3">
                    <button
                      onClick={() => navigate('/events-courses')}
                      className="liquid-btn group gap-2.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all shadow-xl cursor-pointer"
                    >
                      <span className="leading-none font-bold">Explore Programs</span>
                      <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform flex-shrink-0" />
                    </button>
                    <button
                      onClick={() => navigate('/services')}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/20 hover:border-white/40 hover:bg-white/10 text-white text-xs font-mono uppercase tracking-wider transition-all cursor-pointer backdrop-blur-xs group"
                    >
                      <span>Our Services</span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: 3D Aircraft & Learning Platform Visual */}
              <div className="lg:col-span-5 relative flex items-center justify-center">
                {/* Ambient glow accent behind mockup */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 bg-[#34E06E]/15 rounded-full blur-3xl pointer-events-none -z-10" />
                <div className="relative w-full max-w-120 sm:max-w-140 lg:max-w-none lg:w-[130%] animate-float-slow">
                  <picture className="block">
                    <source srcSet={hero3dMockup} type="image/webp" />
                    <img
                      src={hero3dMockupPng}
                      alt="IFOA Flight Operations Training & Certification Platform"
                      className="w-full h-auto object-contain select-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.65)] pointer-events-none"
                      loading="eager"
                      fetchPriority="high"
                    />
                  </picture>
                </div>
              </div>
            </div>
          </div>

          {/* Key Stats & Accreditations Metric Strip (Inside Hero - Clean Minimalist) */}
          <div className="max-w-[1280px] w-full mx-auto pt-4 sm:pt-6 lg:pt-8 border-t border-white/15 mt-6 sm:mt-8 md:mt-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-white/15">
              {/* Metric 1 */}
              <div className="px-2 sm:px-4 md:px-8 py-2 first:pl-0 space-y-1 sm:space-y-1.5">
                <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                  500+
                </p>
                <p className="text-[11px] sm:text-xs md:text-[13px] font-mono font-bold uppercase tracking-wider text-slate-200 leading-tight">
                  PROFESSIONALS TRAINED ANNUALLY
                </p>
              </div>

              {/* Metric 2 */}
              <div className="px-2 sm:px-4 md:px-8 py-2 pt-2 md:pt-2 space-y-1 sm:space-y-1.5">
                <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                  70+
                </p>
                <p className="text-[11px] sm:text-xs md:text-[13px] font-mono font-bold uppercase tracking-wider text-slate-200 leading-tight">
                  AVIATION ORGANIZATIONS
                </p>
              </div>

              {/* Metric 3 */}
              <div className="px-2 sm:px-4 md:px-8 py-2 pt-2 md:pt-2 space-y-1 sm:space-y-1.5">
                <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#34E06E] tracking-tight">
                  FAA
                </p>
                <p className="text-[11px] sm:text-xs md:text-[13px] font-mono font-bold uppercase tracking-wider text-[#34E06E] leading-tight">
                  PART 65 APPROVED TRAINING
                </p>
              </div>

              {/* Metric 4 */}
              <div className="px-2 sm:px-4 md:px-8 py-2 pt-2 md:pt-2 last:pr-0 space-y-1 sm:space-y-1.5">
                <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                  Global
                </p>
                <p className="text-[11px] sm:text-xs md:text-[13px] font-mono font-bold uppercase tracking-wider text-slate-200 leading-tight">
                  OPERATIONAL DELIVERY
                </p>
              </div>
            </div>
          </div>
        </CosmicParallaxBg>
      </section>
      {/* END: HeroSection */}

      {/* BEGIN: Featured Courses Section (Modern High-Impact Course Cards) */}
      <section className="pt-12 sm:pt-16 pb-6 sm:pb-8 bg-white" data-purpose="featured-courses">
        <div className="max-w-[1280px] mx-auto px-6">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-6">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs sm:text-sm font-mono font-black uppercase tracking-widest text-slate-950 border-b-2 border-[#34E06E] pb-1 inline-block">
                Accredited Training Programs
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-rocket-dark">
                Instructor-led programs, measurable outcomes.
              </h2>
              <p className="text-base sm:text-lg text-gray-500 font-normal">
                From initial flight dispatcher certification to recurrent training for established airline operations control teams, every programme is delivered by active industry practitioners and aligned with EASA, FAA and ICAO standards.
              </p>
            </div>

            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-black/15 text-xs font-bold uppercase tracking-wider text-rocket-dark hover:bg-black hover:text-white hover:border-black transition-all shrink-0 self-start md:self-auto group shadow-xs"
            >
              <span>View all courses</span>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
            </Link>
          </div>

          {/* Courses Grid (2-Column High-Impact Cards with Clean Photography) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto">
            {/* Card 1: Flight Dispatcher Part 65 */}
            <div className="group rounded-3xl overflow-hidden border border-slate-200/80 bg-white hover:border-slate-300 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
              {/* Top Clean Course Book Banner */}
              <div className="relative h-[240px] sm:h-[280px] overflow-hidden bg-[#020617] select-none">
                <img
                  src={courseBannerDispatcher3D}
                  alt="Commercial Flight Dispatcher License Course"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 select-none"
                />
              </div>

              {/* Bottom Clean White Area */}
              <div className="p-6 sm:p-7 text-left space-y-4 bg-white flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  {/* Top Scope / Tag & Duration row */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[11px] font-mono font-extrabold uppercase tracking-wider text-slate-950 border-b-2 border-[#34E06E] pb-0.5 inline-block">
                      FAA Part 65 Certification
                    </span>

                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-600 bg-slate-100/90 px-2.5 py-0.5 rounded-full">
                      <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>12 Weeks Hybrid</span>
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug group-hover:text-slate-900 transition-colors">
                    Part 65 Commercial Flight Dispatcher License Course
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    Comprehensive FAA Part 65 &amp; EASA curriculum with high-stress live OCC flight simulations and guaranteed regulatory exam preparation.
                  </p>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-slate-900 text-xs font-bold ml-1">5.0</span>
                    <span className="text-slate-400 text-xs font-normal">(480+ Reviews)</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => navigate('/events-courses')}
                    className="inline-flex items-center justify-between w-full text-xs sm:text-sm font-bold text-slate-900 group-hover:text-slate-900 transition-colors py-1 cursor-pointer"
                  >
                    <span>View Course Details</span>
                    <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center transition-colors shrink-0">
                      <ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Ground Operations & Ramp Safety */}
            <div className="group rounded-3xl overflow-hidden border border-slate-200/80 bg-white hover:border-slate-300 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
              {/* Top Clean Course Book Banner */}
              <div className="relative h-[240px] sm:h-[280px] overflow-hidden bg-[#020617] select-none">
                <img
                  src={courseBannerGroundOps3D}
                  alt="Ground Operations & Ramp Safety Specialist Course"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 select-none"
                />
              </div>

              {/* Bottom Clean White Area */}
              <div className="p-6 sm:p-7 text-left space-y-4 bg-white flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  {/* Top Scope / Tag & Duration row */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[11px] font-mono font-extrabold uppercase tracking-wider text-slate-950 border-b-2 border-[#34E06E] pb-0.5 inline-block">
                      IATA ISAGO / EASA
                    </span>

                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-600 bg-slate-100/90 px-2.5 py-0.5 rounded-full">
                      <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>4 Weeks Station Track</span>
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug group-hover:text-slate-900 transition-colors">
                    Ground Operations &amp; Ramp Safety Specialist Course
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    Master airside operations, turnaround supervision, dangerous goods regulations, and ground handling collision avoidance.
                  </p>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-slate-900 text-xs font-bold ml-1">4.9</span>
                    <span className="text-slate-400 text-xs font-normal">(320+ Reviews)</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => navigate('/events-courses')}
                    className="inline-flex items-center justify-between w-full text-xs sm:text-sm font-bold text-slate-900 group-hover:text-slate-900 transition-colors py-1 cursor-pointer"
                  >
                    <span>View Course Details</span>
                    <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center transition-colors shrink-0">
                      <ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* BEGIN: Training Pathways Smart Shifting Carousel */}
      <section className="w-full bg-[#020617] border-t border-white/10 text-white py-12 sm:py-16 overflow-hidden" data-purpose="training-pathways-carousel">
        <div className="max-w-[1280px] mx-auto px-6 space-y-8">
          {/* Header Row with Eyebrow and Carousel Navigation Controls */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div className="space-y-2">
              <span className="text-xs sm:text-sm font-mono font-black uppercase tracking-widest text-[#34E06E] border-b-2 border-[#34E06E] pb-1 inline-block">
                Global Training Pathways
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                Certification Pathways Built for Operations
              </h2>
            </div>

            {/* Navigation Controls & See More Button */}
            <div className="flex flex-wrap items-center gap-4 self-start sm:self-auto">
              <Link
                to="/events"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition-all duration-200 shadow-md hover:scale-105 cursor-pointer group"
              >
                <span>See More</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-950 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-400 font-semibold">
                  0{pathwayIndex + 1} / 0{totalPathwayPages}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handlePrevPathway}
                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/20 hover:text-white text-slate-300 border border-white/10 flex items-center justify-center transition-all duration-200 cursor-pointer"
                    aria-label="Previous Pathway"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextPathway}
                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/20 hover:text-white text-slate-300 border border-white/10 flex items-center justify-center transition-all duration-200 cursor-pointer"
                    aria-label="Next Pathway"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Slide Window - 100% Clean Grid View with 0 Card Cutoffs */}
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${pathwayIndex * 100}%)`
              }}
            >
              {Array.from({ length: totalPathwayPages }).map((_, pageIdx) => {
                const pageCards = trainingPathways.slice(
                  pageIdx * cardsPerView,
                  pageIdx * cardsPerView + cardsPerView
                )
                return (
                  <div
                    key={pageIdx}
                    className="w-full shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
                  >
                    {pageCards.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-7 rounded-3xl bg-white/[0.04] border border-white/10 hover:border-slate-400 hover:bg-white/[0.07] transition-all duration-300 flex flex-col justify-between space-y-6 group"
                      >
                        <div className="space-y-3">
                          <span className="text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase block">
                            {item.category}
                          </span>
                          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug group-hover:text-[#34E06E] transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                            {item.desc}
                          </p>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-white/10">
                          <div className="text-xs text-[#34E06E] font-mono font-semibold tracking-wide">
                            {item.hours}
                          </div>
                          <Link
                            to={item.link}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-white/90 hover:text-white transition-colors group/link"
                          >
                            <span>{item.linkText}</span>
                            <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Pagination Indicators */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {Array.from({ length: totalPathwayPages }).map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setPathwayIndex(dotIdx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${dotIdx === pathwayIndex
                  ? 'w-8 bg-[#34E06E]'
                  : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                aria-label={`Go to slide ${dotIdx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>


      {/* BEGIN: Global Airline Network Infinite Marquee */}
      <section className="pt-10 sm:pt-14 pb-10 sm:pb-14 bg-white border-b border-black/5 overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6 text-center space-y-2 mb-6 sm:mb-8">
          <span className="text-xs sm:text-sm font-mono font-black uppercase tracking-widest text-slate-950 border-b-2 border-[#34E06E] pb-1 inline-block">
            Global Airline Network
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-rocket-dark">
            Airlines &amp; Operators Where Our Professionals Excel
          </h2>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Our certified flight dispatchers and operations specialists build careers across leading commercial, cargo, and business aviation carriers worldwide.
          </p>
        </div>

        <div className="max-w-[1280px] mx-auto px-6">
          <div className="relative w-full overflow-hidden flex items-center py-2">
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            <div className="marquee-viewport flex overflow-hidden select-none w-full">
              <div
                className="flex shrink-0 items-center gap-8 sm:gap-12 animate-marquee pr-8 sm:pr-12 py-2"
                style={{ animationDuration: '60s' }}
              >
                {partnerLogos.map((partner, index) => (
                  <div
                    key={`p1-${partner.name}-${index}`}
                    className="flex items-center justify-center shrink-0 px-1 opacity-90 hover:opacity-100 transition-opacity duration-200"
                    title={partner.name}
                  >
                    <img
                      src={partner.url}
                      alt={partner.name || `Airline Logo ${index + 1}`}
                      loading="eager"
                      decoding="async"
                      draggable={false}
                      className="h-7 sm:h-9 w-auto object-contain"
                    />
                  </div>
                ))}
              </div>
              <div
                aria-hidden="true"
                className="flex shrink-0 items-center gap-8 sm:gap-12 animate-marquee pr-8 sm:pr-12 py-2"
                style={{ animationDuration: '60s' }}
              >
                {partnerLogos.map((partner, index) => (
                  <div
                    key={`p2-${partner.name}-${index}`}
                    className="flex items-center justify-center shrink-0 px-1 opacity-90 hover:opacity-100 transition-opacity duration-200"
                    title={partner.name}
                  >
                    <img
                      src={partner.url}
                      alt={partner.name || `Airline Logo ${index + 1}`}
                      loading="eager"
                      decoding="async"
                      draggable={false}
                      className="h-7 sm:h-9 w-auto object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* END: Global Airline Network Infinite Marquee */}

      {/* BEGIN: Audience Pathways (Built for careers. Built for operations.) */}
      <section className="relative w-full bg-white text-rocket-dark py-10 sm:py-14 border-b border-black/5 overflow-hidden" data-purpose="audience-split-pathways">
        <div className="max-w-[1280px] mx-auto px-6 relative z-10 space-y-8 sm:space-y-10">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs sm:text-sm font-mono font-black uppercase tracking-widest text-slate-950 border-b-2 border-[#34E06E] pb-1 inline-block">
                Two Different Needs
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-rocket-dark leading-tight">
                Built for careers. Built for operations.
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md font-normal leading-relaxed">
              Individuals and aviation organizations should not be forced through the same customer journey.
            </p>
          </div>

          {/* Dual Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Card 1: For Individuals */}
            <div className="rounded-2xl bg-white border border-slate-200 p-7 sm:p-9 flex flex-col justify-between space-y-6 text-slate-900 shadow-sm hover:shadow-md hover:border-slate-300 transition-shadow duration-300">
              <div className="space-y-4">
                {/* Badge Header */}
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-semibold uppercase tracking-wide text-emerald-800">
                    <User className="w-3.5 h-3.5 text-emerald-700" />
                    <span>For Individuals</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-semibold tracking-wide uppercase">
                    Career Pathway
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug">
                  Build your Operational Control career.
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Find the right certification, understand the pathway and develop the competencies required in a modern OCC.
                </p>

                {/* Feature Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-4 border-t border-slate-100 text-sm text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>FAA Part 65 &amp; EASA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>100% Practical Scenarios</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  onClick={() => navigate('/events-courses')}
                  className="bg-ifoa-navy hover:bg-ifoa-navy-light text-slate-950 font-semibold px-6 py-3 rounded-full text-sm transition-colors inline-flex items-center gap-2 cursor-pointer w-fit"
                >
                  <span>Explore Training</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Card 2: For Organizations */}
            <div className="rounded-2xl bg-white border border-slate-200 p-7 sm:p-9 flex flex-col justify-between space-y-6 text-slate-900 shadow-sm hover:shadow-md hover:border-slate-300 transition-shadow duration-300">
              <div className="space-y-4">
                {/* Badge Header */}
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-[11px] font-semibold uppercase tracking-wide">
                    <Building2 className="w-3.5 h-3.5 text-slate-300" />
                    <span>For Airlines</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-semibold tracking-wide uppercase">
                    Airlines &amp; OCCs
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug">
                  Build stronger operational capability.
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Initial, recurrent and customized training adapted to your operations manuals, fleet, approvals, network and operational risks.
                </p>

                {/* Feature Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-4 border-t border-slate-100 text-sm text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-slate-900 shrink-0" />
                    <span>Fleet-Customized Syllabus</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-slate-900 shrink-0" />
                    <span>OCC Audits &amp; Consulting</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  onClick={() => navigate('/services')}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-3 rounded-full text-sm transition-colors inline-flex items-center gap-2 cursor-pointer w-fit"
                >
                  <span>Corporate Training</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* END: Audience Pathways */}

      {/* BEGIN: From the Operation (Clean 3-Column Review Grid Showcase) */}
      <section className="py-14 sm:py-20 bg-[#f8fafc] border-y border-slate-200/80 text-rocket-dark" data-purpose="from-the-operation-grid">
        <div className="max-w-[1280px] mx-auto px-6 space-y-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-slate-200/60">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest text-[#15803d] inline-block">
                Verified Industry Feedback
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Stories from Those Who Know Us Best
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Operational expertise, not generic aviation education. Real-world feedback from flight dispatchers, OCC managers, and airline training leaders.
              </p>
            </div>

            {/* Carousel Arrow Controls */}
            <div className="flex items-center gap-3 shrink-0 self-start md:self-end">
              <span className="text-xs font-mono font-bold text-slate-400">
                {String(activeTestimonial + 1).padStart(2, '0')} / {String(filteredTestimonials.length).padStart(2, '0')}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handlePrevTestimonial}
                  className="w-9 h-9 rounded-full bg-white hover:bg-slate-900 hover:text-white text-slate-700 border border-slate-200 flex items-center justify-center transition-all duration-200 shadow-xs cursor-pointer active:scale-95"
                  aria-label="Previous Reviews"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextTestimonial}
                  className="w-9 h-9 rounded-full bg-white hover:bg-slate-900 hover:text-white text-slate-700 border border-slate-200 flex items-center justify-center transition-all duration-200 shadow-xs cursor-pointer active:scale-95"
                  aria-label="Next Reviews"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Clean Segmented Tab Filters */}
          <div className="flex items-center justify-start flex-wrap gap-4">
            <div className="inline-flex items-center p-1 bg-slate-200/80 rounded-xl border border-slate-300/60 shadow-xs">
              <button
                onClick={() => {
                  setFeedbackTab('visual')
                  setActiveTestimonial(0)
                  resetTimer()
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  feedbackTab === 'visual'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Airline Showcase ({testimonials.filter((t) => t.cardImage).length})
              </button>
              <button
                onClick={() => {
                  setFeedbackTab('executive')
                  setActiveTestimonial(0)
                  resetTimer()
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  feedbackTab === 'executive'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Executive Statements ({testimonials.filter((t) => !t.cardImage).length})
              </button>
              <button
                onClick={() => {
                  setFeedbackTab('all')
                  setActiveTestimonial(0)
                  resetTimer()
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  feedbackTab === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Feedback ({testimonials.length})
              </button>
            </div>
          </div>

          {/* 3 Review Cards in One Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {Array.from(
              { length: Math.min(reviewsPerView, filteredTestimonials.length) },
              (_, i) => filteredTestimonials[(activeTestimonial + i) % filteredTestimonials.length]
            ).map((item, idx) => (
              <div key={idx} className="flex flex-col h-full">
                {item.cardImage ? (
                  /* Visual Card Display: Clean Minimal Presentation */
                  <div className="w-full h-full rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-4 sm:p-5 flex flex-col justify-between group">
                    {/* Top Row: Company Logo & Category Badge */}
                    <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 shrink-0">
                      <div className="flex items-center h-8">
                        {item.logo ? (
                          <img
                            src={item.logo}
                            alt={item.company}
                            className="h-6 sm:h-7 max-w-[130px] w-auto object-contain select-none"
                          />
                        ) : (
                          <span className="text-sm font-bold text-slate-900 tracking-wide">
                            {item.company}
                          </span>
                        )}
                      </div>
                      {item.badge && (
                        <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-[#15803d] border-b border-[#34E06E] pb-0.5 whitespace-nowrap">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    {/* Middle: Full Uncropped Graphic Endorsement */}
                    <div className="my-auto pt-3 w-full rounded-xl overflow-hidden bg-white flex items-center justify-center">
                      <img
                        src={item.cardImage}
                        alt={`${item.company} Endorsement`}
                        className="w-full h-auto object-contain select-none rounded-xl transition-transform duration-500 group-hover:scale-[1.01]"
                      />
                    </div>
                  </div>
                ) : (
                  /* Executive Text Card: Clean Minimal Typography */
                  <div className="w-full h-full rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between group">
                    {/* Top Row: Airline Logo & Badge */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                      <div className="flex items-center h-8">
                        {item.logo ? (
                          <img
                            src={item.logo}
                            alt={item.company}
                            className="h-7 max-w-[130px] w-auto object-contain select-none"
                          />
                        ) : (
                          <span className="text-base font-bold text-slate-900 tracking-wide">
                            {item.company}
                          </span>
                        )}
                      </div>
                      {item.badge && (
                        <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-[#15803d] border-b border-[#34E06E] pb-0.5 whitespace-nowrap">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    {/* Center: Full Quote */}
                    <div className="py-4 my-auto space-y-2">
                      <span className="text-3xl font-serif text-[#15803d] leading-none block select-none">
                        “
                      </span>
                      <blockquote className="text-xs sm:text-sm font-normal text-slate-700 leading-relaxed italic">
                        {item.quote}
                      </blockquote>
                    </div>

                    {/* Bottom: Author Credentials */}
                    <div className="pt-4 border-t border-slate-100 space-y-0.5">
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-mono tracking-wide">
                        {item.role}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Draggable Airline Selector Bar (Highlights All Currently Visible Cards) */}
          <div className="relative w-full overflow-hidden shrink-0 pt-2 border-t border-slate-200/60">
            <div
              ref={logoScrollRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              className="flex items-center justify-start sm:justify-center gap-3 sm:gap-5 overflow-x-auto no-scrollbar py-2 px-1 cursor-grab active:cursor-grabbing select-none"
              style={{ scrollBehavior: 'smooth' }}
            >
              {filteredTestimonials.map((item, idx) => {
                const visibleCount = Math.min(reviewsPerView, filteredTestimonials.length)
                const visibleIndices = Array.from(
                  { length: visibleCount },
                  (_, i) => (activeTestimonial + i) % filteredTestimonials.length
                )
                const isCurrentlyVisible = visibleIndices.includes(idx)

                return (
                  <button
                    key={idx}
                    data-logo-index={idx}
                    onClick={() => {
                      if (hasMovedRef.current) return
                      setActiveTestimonial(idx)
                      resetTimer()
                    }}
                    className={`h-10 px-3 py-1.5 transition-all duration-200 flex items-center justify-center shrink-0 cursor-pointer rounded-t-lg ${
                      isCurrentlyVisible
                        ? 'opacity-100 scale-105 border-b-2 border-[#15803d] bg-emerald-50/50 font-bold shadow-2xs'
                        : 'opacity-40 hover:opacity-85 hover:scale-105 border-b-2 border-transparent bg-transparent'
                    }`}
                    title={item.company || item.name}
                  >
                    {item.logo ? (
                      <img
                        src={item.logo}
                        alt={item.company}
                        draggable={false}
                        className="h-5 sm:h-6 max-w-[90px] w-auto object-contain select-none pointer-events-none"
                      />
                    ) : (
                      <span
                        className={`text-[11px] font-bold whitespace-nowrap select-none ${
                          isCurrentlyVisible ? 'text-[#15803d]' : 'text-slate-500'
                        }`}
                      >
                        {item.company}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

        </div>
      </section>
      {/* END: From the Operation */}

      {/* BEGIN: Training Framework (International standards. Local operational relevance.) */}
      <section className="py-16 sm:py-24 bg-white text-rocket-dark border-b border-slate-200/80" data-purpose="training-framework-standards">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: 3 Standard Authority Cards (FAA, EASA, ICAO) */}
            <div className="lg:col-span-5 flex items-center justify-start gap-4 sm:gap-6">
              {/* FAA Box */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col items-center justify-center p-3 text-center">
                <img
                  src={logoFaa}
                  alt="FAA"
                  className="h-10 sm:h-12 w-auto max-w-[80px] object-contain select-none mb-1.5"
                />
                <span className="text-xs font-bold text-rocket-dark tracking-wider uppercase">
                  FAA
                </span>
              </div>

              {/* EASA Box */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col items-center justify-center p-3 text-center">
                <img
                  src={logoEasa}
                  alt="EASA"
                  className="h-10 sm:h-12 w-auto max-w-[80px] object-contain select-none mb-1.5"
                />
                <span className="text-xs font-bold text-rocket-dark tracking-wider uppercase">
                  EASA
                </span>
              </div>

              {/* ICAO Box */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col items-center justify-center p-3 text-center">
                <img
                  src={logoIcao}
                  alt="ICAO"
                  className="h-10 sm:h-12 w-auto max-w-[80px] object-contain select-none mb-1.5"
                />
                <span className="text-xs font-bold text-rocket-dark tracking-wider uppercase">
                  ICAO
                </span>
              </div>
            </div>

            {/* Right Column: Training Framework Narrative */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs sm:text-sm font-mono font-black uppercase tracking-widest text-slate-950 border-b-2 border-[#34E06E] pb-1 inline-block">
                Training Framework
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-rocket-dark leading-tight">
                International standards. Local operational relevance.
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 font-normal leading-relaxed">
                The program is structured around the applicable international Flight Dispatcher training framework while incorporating the Indian regulatory and operational environment. Regulatory references must be validated against the current approved program before production publication.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* END: Training Framework */}

      {/* BEGIN: Train for the Operation Green Callout Banner */}
      <section className="py-12 sm:py-16 bg-white" data-purpose="train-for-operation-cta">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="relative rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-[#020617] p-8 sm:p-11 md:p-12 text-white shadow-2xl border border-white/10 overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8">
            {/* Ambient Background Accents */}
            <div className="absolute -right-16 -top-16 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-16 -bottom-16 w-60 h-60 bg-emerald-900/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-2.5 max-w-2xl">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-100 block">
                OPERATIONAL EXCELLENCE
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
                Train for the operation. Not only for the exam.
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-emerald-50 max-w-xl font-normal leading-relaxed">
                Explore individual programs or discuss a customized solution for your organization.
              </p>
            </div>

            <div className="relative z-10 shrink-0">
              <Button
                onClick={() => navigate('/contact')}
                className="bg-[#34E06E] text-slate-950 hover:bg-[#28c85e] font-extrabold px-7 py-3.5 rounded-full text-xs uppercase tracking-wider shadow-lg hover:shadow-[0_0_25px_rgba(52,224,110,0.4)] transition-all hover:scale-105 inline-flex items-center gap-2.5 cursor-pointer"
              >
                <span>Contact IFOA</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* END: Train for the Operation */}

    </div>
  )
}

export default HomePage
