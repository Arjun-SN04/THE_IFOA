import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Seo } from '@/components/common/Seo'
import { graph, organizationSchema, ORGANIZATION_ID, SITE_NAME, SITE_URL } from '@/lib/seo'
import {
  RiCompass3Line,
  RiStarFill,
  RiUser3Line,
  RiFlightTakeoffLine,
  RiCheckboxCircleFill,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiArrowRightLine,
  RiSendPlaneFill,
  RiChatQuoteLine,
  RiApps2Line
} from 'react-icons/ri'
import {
  PiAirplaneTiltFill,
  PiAirplaneTakeoffFill,
  PiAirplaneLandingFill
} from 'react-icons/pi'
import {
  TbClockHour4,
  TbCertificate,
  TbRadar2,
  TbPlaneInflight
} from 'react-icons/tb'
import {
  HiArrowUpRight,
  HiArrowRight,
  HiSparkles
} from 'react-icons/hi2'

import { usePageContent } from '@/hooks/usePageContent'
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
import courseBannerDispatcher3D from '@/assets/courses/part65-hero.png'
import courseBannerGroundOps3D from '@/assets/courses/easa-hero.png'
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
import logoDgca from '@/assets/course/standards-logos/logo-dgca.png'

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

// Content the page ships with; editable at /admin/pages/home.
const FALLBACK = {
  hero: {
    eyebrow: 'International Flight Operations Academy',
    title: 'Trained for the moment',
    titleHighlight: 'nothing goes to plan.',
    subtitle:
      'IFOA prepares flight dispatchers and OCC teams for the decisions that matter at 3am not just the ones covered on the exam.',
    primaryLabel: 'Explore Programs',
    secondaryLabel: 'Our Services',
    stats: [
      { value: '500+', label: 'PROFESSIONALS TRAINED ANNUALLY' },
      { value: '70+', label: 'AVIATION ORGANIZATIONS' },
      { value: 'FAA', label: 'PART 65 APPROVED TRAINING' },
      { value: 'Global', label: 'OPERATIONAL DELIVERY' }
    ]
  },
  featuredCourses: {
    eyebrow: 'Professional Aviation Training',
    title: 'Industry-led training for aviation professionals.',
    intro:
      'Gain the knowledge, practical skills, and operational expertise required to perform with confidence in today’s aviation environment. From initial certification to advanced and recurrent training, our programs are built around real operational requirements.',
    viewAllLabel: 'View all courses',
    cards: [
      {
        tag: 'FAA Part 65 Certification',
        duration: '12 Weeks Hybrid',
        title: 'Part 65 Commercial Flight Dispatcher License Course',
        desc: 'Comprehensive FAA Part 65 & EASA curriculum with live OCC flight simulations and guaranteed regulatory exam preparation.',
        ctaLabel: 'View Course Details'
      },
      {
        tag: 'IATA ISAGO / EASA',
        duration: '5 Weeks Station Track',
        title: 'Ground Operations & Ramp Safety Specialist Course',
        desc: 'Master airside operations, turnaround supervision, dangerous goods regulations, and ground handling collision avoidance.',
        ctaLabel: 'View Course Details'
      }
    ]
  },
  trustRating: {
    eyebrow: 'Verified Post-Training Feedback',
    title: 'Rated by the People We Trained',
    desc:
      "Every course closes with a post-training survey sent straight to our OCC teams and dispatchers. Across 458 completed surveys from 70+ aviation organizations, our training has been rated an average of 4.7 out of 5, with 98% saying they'd recommend IFOA.",
    learnMoreLabel: 'Learn more',
    ratingValue: '4.7',
    ratingSuffix: '/5',
    reviewCountLabel: '(458 verified post-training surveys)',
    badgeLabel: '98% Recommendation Rate'
  },
  pathways: {
    eyebrow: 'Global Training Pathways',
    title: 'Certification Pathways Built for Operations',
    seeMoreLabel: 'See More',
    cards: [
      {
        category: 'Initial Training',
        title: 'EASA Standards',
        desc: 'Flight Dispatch Initial Training aligned with ICAO Doc 10106 and EASA ORO.GEN.110 requirements.',
        hours: '200 Hours · Hybrid',
        linkText: 'Explore EASA Training'
      },
      {
        category: 'FAA Approved',
        title: 'FAA Part 65',
        desc: 'FAA-approved Aircraft Dispatcher certification training delivered through IFOA USA.',
        hours: '200 Hours · USA',
        linkText: 'Explore FAA Training'
      },
      {
        category: 'Multiple Certification',
        title: 'EASA + FAA',
        desc: 'Combined pathway integrating FAA Part 65 certification with European operational knowledge.',
        hours: '200 Hours · Hybrid',
        linkText: 'Explore Combined Training'
      },
      {
        category: 'Maintain Competency',
        title: 'Recurrent Training',
        desc: 'Customized recurrent programs based on the operator, regulatory framework, and fleet.',
        hours: 'Carrier-Customized',
        linkText: 'Recurrent Programs'
      },
      {
        category: 'Professional Development',
        title: 'Advanced Training',
        desc: 'Scenario-driven development for experienced dispatchers and OCC professionals.',
        hours: 'Scenario-Driven',
        linkText: 'Advanced Programs'
      },
      {
        category: 'Operational Teams',
        title: 'Specialist Training',
        desc: 'Crew Control, Ground Operations, Dangerous Goods and Train-the-Trainer programs.',
        hours: 'CBTA Modular Tracks',
        linkText: 'All Specialist Training'
      }
    ]
  },
  network: {
    eyebrow: 'Global Airline Network',
    title: 'Training Professionals for the Global Aviation Industry',
    intro:
      'Our training equips aviation professionals with the skills and expertise to pursue careers across commercial, cargo, and business aviation worldwide.'
  },
  audience: {
    eyebrow: 'Two Different Needs',
    title: 'Built for careers. Built for operations.',
    intro: 'Individuals and aviation organizations should not be forced through the same customer journey.',
    cards: [
      {
        eyebrow: 'For Individuals',
        trackBadge: 'Career Pathway',
        title: 'Become Ready for the Modern OCC',
        desc:
          'Gain the operational knowledge and practical competencies needed to perform confidently in a fast-paced airline Operations Control Centre.',
        bullet1: 'FAA Part 65 & EASA',
        bullet2: 'Scenario-Based Drills',
        ctaLabel: 'Explore Training'
      },
      {
        eyebrow: 'For Airlines',
        trackBadge: 'Airlines & OCCs',
        title: 'Training Built Around Your Operations',
        desc:
          'Customized initial, recurrent, and advanced training designed around your fleet, manuals, procedures, and operational environment.',
        bullet1: 'Customized Fleet Training',
        bullet2: 'OCC Consulting',
        ctaLabel: 'Corporate Training'
      }
    ]
  },
  testimonialsSection: {
    eyebrow: 'Verified Industry Feedback',
    title: 'Stories from Those Who Know Us Best',
    intro:
      'Operational expertise, not generic aviation education. Real-world feedback from flight dispatchers, OCC managers, and airline training leaders.',
    visualTabLabel: 'Airline Showcase',
    executiveTabLabel: 'Executive Statements',
    allTabLabel: 'All Feedback'
  },
  framework: {
    eyebrow: 'Training Framework',
    title: 'Built on global aviation standards. Designed for real operations.',
    desc:
      'Our training draws from ICAO, FAA, and EASA frameworks to deliver internationally relevant knowledge, practical operational skills, and scenario-based learning for today’s aviation professionals.'
  },
  finalCta: {
    eyebrow: 'OPERATIONAL EXCELLENCE',
    title: 'Train for the operation. Not only for the exam.',
    desc: 'Explore individual programs or discuss a customized solution for your organization.',
    ctaLabel: 'Contact IFOA'
  }
}

export function HomePage() {
  const navigate = useNavigate()
  const { c } = usePageContent('home', FALLBACK)
  const [activePage, setActivePage] = useState(0)

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

  const totalPages = Math.max(1, Math.ceil(filteredTestimonials.length / reviewsPerView))
  const safePage = activePage >= totalPages ? 0 : activePage

  const timerRef = useRef(null)

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setActivePage((prev) => (prev + 1) % totalPages)
    }, 7000)
  }, [totalPages])

  useEffect(() => {
    resetTimer()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [resetTimer])

  const handleNextTestimonial = () => {
    setActivePage((prev) => (prev + 1) % totalPages)
    resetTimer()
  }

  const handlePrevTestimonial = () => {
    setActivePage((prev) => (prev === 0 ? totalPages - 1 : prev - 1))
    resetTimer()
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const trainingPathways = c.pathways.cards.map((card) => ({ ...card, link: '/events-courses' }))

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
      <Seo
        path="/"
        title="Flight Dispatcher Courses & EASA / FAA Certification | IFOA"
        description="Train as a certified flight dispatcher with IFOA. EASA ORO.GEN.110 and FAA Part 65 flight operations courses taught by active airline dispatchers."
        jsonLd={graph(
          organizationSchema(),
          {
            '@type': 'WebSite',
            '@id': `${SITE_URL}/#website`,
            url: SITE_URL,
            name: SITE_NAME,
            publisher: { '@id': ORGANIZATION_ID },
            inLanguage: 'en'
          }
        )}
      />
      {/* BEGIN: HeroSection */}
      <section className="relative w-full min-h-[100dvh] lg:h-[100dvh] lg:max-h-[1080px] text-white overflow-hidden border-b border-white/10 flex flex-col justify-between" data-purpose="hero-content">
        <CosmicParallaxBg
          className="cosmic-parallax-bg min-h-[100dvh] lg:h-full flex flex-col justify-between pt-20 sm:pt-24 lg:pt-22 xl:pt-24 pb-4 sm:pb-5 px-4 sm:px-6 lg:px-8"
          contentClassName="justify-between flex-1 flex flex-col h-full w-full max-w-[1280px] mx-auto"
        >
          {/* Main Hero Grid Content (Auto-centered vertically in available viewport) */}
          <div className="w-full my-auto py-2 sm:py-4 lg:py-1 flex-1 flex items-center">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 items-center w-full">
              {/* Left Column: Typography & CTAs */}
              <div className="lg:col-span-7 space-y-3 sm:space-y-4 lg:space-y-3.5 xl:space-y-5 text-left">
                {/* Eyebrow Label with Green Underline */}
                <div className="inline-flex items-center pb-1 border-b border-white text-white text-[11px] sm:text-xs font-mono font-medium tracking-widest uppercase w-fit">
                  <span>{c.hero.eyebrow}</span>
                </div>

                {/* Main Headline & Subtitle */}
                <div className="space-y-3 sm:space-y-3.5 max-w-2xl">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
                    {c.hero.title} <br className="hidden sm:inline" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-300">
                      {c.hero.titleHighlight}
                    </span>
                  </h1>

                  <p className="text-slate-300 text-xs sm:text-sm md:text-base lg:text-sm xl:text-base leading-relaxed max-w-xl font-normal">
                    {c.hero.subtitle}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
                    <button
                      onClick={() => navigate('/events-courses')}
                      className="liquid-btn group gap-2.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all shadow-xl cursor-pointer"
                    >
                      <span className="leading-none font-bold">{c.hero.primaryLabel}</span>
                    </button>
                    <button
                      onClick={() => navigate('/services')}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/20 hover:border-white/40 hover:bg-white/10 text-white text-xs font-mono uppercase tracking-wider transition-all cursor-pointer backdrop-blur-xs group"
                    >
                      <span>{c.hero.secondaryLabel}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: 3D Aircraft & Learning Platform Visual */}
              <div className="lg:col-span-5 relative flex items-center justify-center">
                {/* Ambient glow accent behind mockup */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72 bg-[#34E06E]/15 rounded-full blur-3xl pointer-events-none -z-10" />
                <div className="relative w-full max-w-[280px] sm:max-w-[340px] md:max-w-[400px] lg:max-w-[440px] xl:max-w-[500px] 2xl:max-w-[560px] animate-float-slow">
                  <picture className="block">
                    <source srcSet={hero3dMockup} type="image/webp" />
                    <img
                      src={hero3dMockupPng}
                      alt="IFOA Flight Operations Training & Certification Platform"
                      className="w-full max-h-[32vh] sm:max-h-[38vh] lg:max-h-[42vh] xl:max-h-[46vh] object-contain select-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.65)] pointer-events-none mx-auto"
                      loading="eager"
                      fetchPriority="high"
                    />
                  </picture>
                </div>
              </div>
            </div>
          </div>

          {/* Key Stats & Accreditations Metric Strip (Inside Hero - Viewport-Fitted) */}
          <div className="w-full pt-3 sm:pt-4 border-t border-white/15 mt-auto pb-1 sm:pb-2 shrink-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-white/15">
              {/* Metric 1 */}
              <div className="px-2 sm:px-4 md:px-6 lg:px-8 py-1.5 sm:py-2 first:pl-0 space-y-0.5 sm:space-y-1">
                <p className="text-xl sm:text-2xl lg:text-2xl xl:text-3xl font-extrabold text-white tracking-tight">
                  {c.hero.stats[0].value}
                </p>
                <p className="text-[10px] sm:text-[11px] md:text-xs font-mono font-bold uppercase tracking-wider text-slate-200 leading-tight">
                  {c.hero.stats[0].label}
                </p>
              </div>

              {/* Metric 2 */}
              <div className="px-2 sm:px-4 md:px-6 lg:px-8 py-1.5 sm:py-2 pt-1.5 md:pt-2 space-y-0.5 sm:space-y-1">
                <p className="text-xl sm:text-2xl lg:text-2xl xl:text-3xl font-extrabold text-white tracking-tight">
                  {c.hero.stats[1].value}
                </p>
                <p className="text-[10px] sm:text-[11px] md:text-xs font-mono font-bold uppercase tracking-wider text-slate-200 leading-tight">
                  {c.hero.stats[1].label}
                </p>
              </div>

              {/* Metric 3 */}
              <div className="px-2 sm:px-4 md:px-6 lg:px-8 py-1.5 sm:py-2 pt-1.5 md:pt-2 space-y-0.5 sm:space-y-1">
                <p className="text-xl sm:text-2xl lg:text-2xl xl:text-3xl font-extrabold text-[#34E06E] tracking-tight">
                  {c.hero.stats[2].value}
                </p>
                <p className="text-[10px] sm:text-[11px] md:text-xs font-mono font-bold uppercase tracking-wider text-[#34E06E] leading-tight">
                  {c.hero.stats[2].label}
                </p>
              </div>

              {/* Metric 4 */}
              <div className="px-2 sm:px-4 md:px-6 lg:px-8 py-1.5 sm:py-2 pt-1.5 md:pt-2 last:pr-0 space-y-0.5 sm:space-y-1">
                <p className="text-xl sm:text-2xl lg:text-2xl xl:text-3xl font-extrabold text-white tracking-tight">
                  {c.hero.stats[3].value}
                </p>
                <p className="text-[10px] sm:text-[11px] md:text-xs font-mono font-bold uppercase tracking-wider text-slate-200 leading-tight">
                  {c.hero.stats[3].label}
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
                {c.featuredCourses.eyebrow}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-rocket-dark">
                {c.featuredCourses.title}
              </h2>
              <p className="text-base sm:text-lg text-gray-500 font-normal">
                {c.featuredCourses.intro}
              </p>
            </div>

            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-black/15 text-xs font-bold uppercase tracking-wider text-rocket-dark hover:bg-black hover:text-white hover:border-black transition-all shrink-0 self-start md:self-auto group shadow-xs"
            >
              <span>{c.featuredCourses.viewAllLabel}</span>
              <HiArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-slate-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </Link>
          </div>

          {/* Courses Grid (2-Column High-Impact Cards with Clean Photography) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto">
            {/* Card 1: Flight Dispatcher Part 65 */}
            <div className="group rounded-3xl overflow-hidden border border-slate-200/80 bg-white hover:border-slate-300 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
              {/* Top Clean Course Book Banner - Fully Visible */}
              <div className="relative aspect-[3/2] w-full overflow-hidden bg-white select-none flex items-center justify-center border-b border-slate-100">
                <img
                  src={courseBannerDispatcher3D}
                  alt="Commercial Flight Dispatcher License Course"
                  className="w-full h-full object-contain object-center group-hover:scale-[1.03] transition-transform duration-500 select-none p-2"
                />
              </div>

              {/* Bottom Clean White Area */}
              <div className="p-6 sm:p-7 text-left space-y-4 bg-white flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  {/* Top Scope / Tag & Duration row */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[11px] font-mono font-extrabold uppercase tracking-wider text-slate-950 border-b-2 border-[#34E06E] pb-0.5 inline-block">
                      {c.featuredCourses.cards[0].tag}
                    </span>

                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-600 bg-slate-100/90 px-2.5 py-0.5 rounded-full">
                      <TbClockHour4 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{c.featuredCourses.cards[0].duration}</span>
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug group-hover:text-[#34E06E] transition-colors">
                    {c.featuredCourses.cards[0].title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {c.featuredCourses.cards[0].desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => navigate('/events-courses')}
                    className="inline-flex items-center justify-between w-full text-xs sm:text-sm font-bold text-slate-900 group-hover:text-slate-900 transition-colors py-1 cursor-pointer"
                  >
                    <span>{c.featuredCourses.cards[0].ctaLabel}</span>
                    <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center transition-colors shrink-0">
                      <HiArrowUpRight className="w-4 h-4 text-slate-700 group-hover:text-slate-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Ground Operations & Ramp Safety */}
            <div className="group rounded-3xl overflow-hidden border border-slate-200/80 bg-white hover:border-slate-300 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
              {/* Top Clean Course Book Banner - Fully Visible */}
              <div className="relative aspect-[3/2] w-full overflow-hidden bg-white select-none flex items-center justify-center border-b border-slate-100">
                <img
                  src={courseBannerGroundOps3D}
                  alt="Ground Operations & Ramp Safety Specialist Course"
                  className="w-full h-full object-contain object-center group-hover:scale-[1.03] transition-transform duration-500 select-none p-2"
                />
              </div>

              {/* Bottom Clean White Area */}
              <div className="p-6 sm:p-7 text-left space-y-4 bg-white flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  {/* Top Scope / Tag & Duration row */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[11px] font-mono font-extrabold uppercase tracking-wider text-slate-950 border-b-2 border-[#34E06E] pb-0.5 inline-block">
                      {c.featuredCourses.cards[1].tag}
                    </span>

                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-600 bg-slate-100/90 px-2.5 py-0.5 rounded-full">
                      <TbClockHour4 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{c.featuredCourses.cards[1].duration}</span>
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug group-hover:text-[#34E06E] transition-colors">
                    {c.featuredCourses.cards[1].title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {c.featuredCourses.cards[1].desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => navigate('/events-courses')}
                    className="inline-flex items-center justify-between w-full text-xs sm:text-sm font-bold text-slate-900 group-hover:text-slate-900 transition-colors py-1 cursor-pointer"
                  >
                    <span>{c.featuredCourses.cards[1].ctaLabel}</span>
                    <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center transition-colors shrink-0">
                      <HiArrowUpRight className="w-4 h-4 text-slate-700 group-hover:text-slate-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BEGIN: Accredited Training Programs Trust & Verified Rating Showcase */}
      <section className="pt-2 pb-14 sm:pb-16 bg-white" data-purpose="course-trust-rating-banner">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="relative overflow-hidden rounded-[28px] sm:rounded-[36px] bg-gradient-to-br from-slate-950 via-[#0B132B] to-[#020617] text-white p-7 sm:p-10 md:p-12 border border-slate-800/80 shadow-[0_24px_60px_rgba(2,6,23,0.18)]">
            {/* Subtle radar contour rings matching IFOA aviation aesthetic */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              viewBox="0 0 1000 400"
            >
              <circle cx="820" cy="200" r="140" stroke="#34E06E" strokeWidth="1" strokeDasharray="4 4" fill="none" />
              <circle cx="820" cy="200" r="230" stroke="white" strokeWidth="1" opacity="0.4" fill="none" />
              <circle cx="820" cy="200" r="330" stroke="#34E06E" strokeWidth="1" opacity="0.3" fill="none" />
              <circle cx="820" cy="200" r="450" stroke="white" strokeWidth="1" opacity="0.2" fill="none" />
              <circle cx="120" cy="80" r="180" stroke="white" strokeWidth="1" opacity="0.2" fill="none" />
              <circle cx="120" cy="80" r="300" stroke="#34E06E" strokeWidth="1" opacity="0.2" fill="none" />
            </svg>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Headline & Description */}
              <div className="lg:col-span-7 space-y-3.5 text-left">
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#34E06E] border-b border-[#34E06E]/40 pb-0.5 inline-block">
                  {c.trustRating.eyebrow}
                </span>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight font-display">
                  {c.trustRating.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-xl">
                  {c.trustRating.desc}{' '}
                  <button
                    onClick={() => {
                      const el = document.getElementById('testimonials') || document.querySelector('[data-purpose="from-the-operation-grid"]')
                      if (el) el.scrollIntoView({ behavior: 'smooth' })
                      else navigate('/events-courses')
                    }}
                    className="font-bold text-[#34E06E] hover:text-white underline underline-offset-4 transition-colors cursor-pointer inline-block"
                  >
                    {c.trustRating.learnMoreLabel}
                  </button>
                </p>
              </div>

              {/* Right Column: Prominent Rating & Vivid Stars */}
              <div className="lg:col-span-5 flex flex-col items-start lg:items-center justify-center space-y-2 lg:border-l lg:border-white/10 lg:pl-8">
                <div className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight font-sans">
                  {c.trustRating.ratingValue}<span className="text-2xl sm:text-3xl md:text-4xl font-medium text-[#34E06E]">{c.trustRating.ratingSuffix}</span>
                </div>

                {/* 5 Vivid Gold Stars */}
                <div className="flex items-center gap-1.5 py-1">
                  {[...Array(5)].map((_, i) => (
                    <RiStarFill key={i} className="w-6 h-6 sm:w-8 sm:h-8 text-[#FFB800] drop-shadow-[0_0_12px_rgba(255,184,0,0.35)]" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm font-medium text-slate-400 tracking-wide font-mono">
                  {c.trustRating.reviewCountLabel}
                </p>

                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono font-bold text-slate-300">

                    <span>{c.trustRating.badgeLabel}</span>
                  </span>
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
                {c.pathways.eyebrow}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                {c.pathways.title}
              </h2>
            </div>

            {/* Navigation Controls & See More Button */}
            <div className="flex flex-wrap items-center gap-4 self-start sm:self-auto">
              <Link
                to="/events"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition-all duration-200 shadow-md hover:scale-105 cursor-pointer group"
              >
                <span>{c.pathways.seeMoreLabel}</span>
                <HiArrowUpRight className="w-3.5 h-3.5 text-slate-950 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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
                    <RiArrowLeftSLine className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextPathway}
                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/20 hover:text-white text-slate-300 border border-white/10 flex items-center justify-center transition-all duration-200 cursor-pointer"
                    aria-label="Next Pathway"
                  >
                    <RiArrowRightSLine className="w-5 h-5" />
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
                          <span className="text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase block h-5 flex items-center">
                            {item.category}
                          </span>
                          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug group-hover:text-[#34E06E] transition-colors min-h-[3.25rem] flex items-start">
                            {item.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed min-h-[4.25rem]">
                            {item.desc}
                          </p>
                        </div>

                        <div className="mt-auto space-y-3 pt-4 border-t border-white/10">
                          <div className="text-xs text-[#34E06E] font-mono font-semibold tracking-wide">
                            {item.hours}
                          </div>
                          <Link
                            to={item.link}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-white/90 hover:text-white transition-colors group/link"
                          >
                            <span>{item.linkText}</span>
                            <HiArrowRight className="w-3.5 h-3.5 text-[#34E06E] group-hover/link:translate-x-1 transition-transform" />
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
            {c.network.eyebrow}
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-rocket-dark">
            {c.network.title}
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-500 max-w-2xl mx-auto font-normal">
            {c.network.subtitle}
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


      {/* 4. DUAL AUDIENCE VALUE PROPOSITION */}
      <section className="py-16 sm:py-24 bg-slate-50/70 border-b border-slate-200/80" data-purpose="dual-audience">
        <div className="max-w-[1280px] mx-auto px-6 space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2.5 max-w-xl">
              <span className="text-xs sm:text-sm font-mono font-black uppercase tracking-widest text-slate-950 border-b-2 border-[#34E06E] pb-1 inline-block">
                {c.audience.eyebrow}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-rocket-dark leading-tight">
                {c.audience.title}
              </h2>
            </div>
          </div>

          {/* Dual Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Card 1: For Individuals */}
            <div className="rounded-3xl bg-white border border-slate-200/90 p-8 sm:p-9 flex flex-col justify-between space-y-6 text-slate-900 shadow-xs hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 group">
              <div className="space-y-4">
                {/* Header Row: Clean Eyebrow & Track Badge */}
                <div className="flex items-center justify-between gap-3 min-h-[1.75rem]">
                  <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono font-black uppercase tracking-widest text-slate-950 border-b-2 border-[#34E06E] pb-1">
                    <RiUser3Line className="w-4 h-4 text-slate-700" />
                    <span>{c.audience.cards[0].eyebrow}</span>
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                    {c.audience.cards[0].trackBadge}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug group-hover:text-black transition-colors pt-1 min-h-[4rem] flex items-start">
                  {c.audience.cards[0].title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed font-normal min-h-[3.75rem]">
                  {c.audience.cards[0].desc}
                </p>

                {/* Feature Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-xs sm:text-sm text-slate-700 min-h-[3rem]">
                  <div className="flex items-center gap-2.5">
                    <RiCheckboxCircleFill className="w-4 h-4 text-[#34E06E] shrink-0" />
                    <span className="font-semibold text-slate-800">{c.audience.cards[0].bullet1}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <RiCheckboxCircleFill className="w-4 h-4 text-[#34E06E] shrink-0" />
                    <span className="font-semibold text-slate-800">{c.audience.cards[0].bullet2}</span>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-2">
                <Button
                  onClick={() => navigate('/events-courses')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#34E06E] hover:bg-[#28c85e] text-slate-950 font-extrabold px-6 py-3.5 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow-[0_0_20px_rgba(52,224,110,0.4)] cursor-pointer"
                >
                  <span>{c.audience.cards[0].ctaLabel}</span>
                  <HiArrowUpRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Card 2: For Organizations */}
            <div className="rounded-3xl bg-white border border-slate-200/90 p-8 sm:p-9 flex flex-col justify-between space-y-6 text-slate-900 shadow-xs hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 group">
              <div className="space-y-4">
                {/* Header Row: Clean Eyebrow & Track Badge */}
                <div className="flex items-center justify-between gap-3 min-h-[1.75rem]">
                  <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono font-black uppercase tracking-widest text-slate-950 border-b-2 border-[#34E06E] pb-1">
                    <RiFlightTakeoffLine className="w-4 h-4 text-slate-700" />
                    <span>{c.audience.cards[1].eyebrow}</span>
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                    {c.audience.cards[1].trackBadge}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug group-hover:text-black transition-colors pt-1 min-h-[4rem] flex items-start">
                  {c.audience.cards[1].title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed font-normal min-h-[3.75rem]">
                  {c.audience.cards[1].desc}
                </p>

                {/* Feature Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-xs sm:text-sm text-slate-700 min-h-[3rem]">
                  <div className="flex items-center gap-2.5">
                    <RiCheckboxCircleFill className="w-4 h-4 text-[#34E06E] shrink-0" />
                    <span className="font-semibold text-slate-800">{c.audience.cards[1].bullet1}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <RiCheckboxCircleFill className="w-4 h-4 text-[#34E06E] shrink-0" />
                    <span className="font-semibold text-slate-800">{c.audience.cards[1].bullet2}</span>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-2">
                <Button
                  onClick={() => navigate('/services')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3.5 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-sm cursor-pointer"
                >
                  <span>{c.audience.cards[1].ctaLabel}</span>
                  <HiArrowUpRight className="w-4 h-4" />
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
              <span className="text-xs sm:text-sm font-mono font-black uppercase tracking-widest text-slate-950 border-b-2 border-[#34E06E] pb-1 inline-block">
                {c.testimonialsSection.eyebrow}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {c.testimonialsSection.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {c.testimonialsSection.intro}
              </p>
            </div>

            {/* Carousel Arrow Controls */}
            <div className="flex items-center gap-3 shrink-0 self-start md:self-end">
              <span className="text-xs font-mono font-bold text-slate-400">
                {String(safePage + 1).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handlePrevTestimonial}
                  className="w-9 h-9 rounded-full bg-white hover:bg-slate-900 hover:text-white text-slate-700 border border-slate-200 flex items-center justify-center transition-all duration-200 shadow-xs cursor-pointer active:scale-95"
                  aria-label="Previous Reviews"
                >
                  <RiArrowLeftSLine className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextTestimonial}
                  className="w-9 h-9 rounded-full bg-white hover:bg-slate-900 hover:text-white text-slate-700 border border-slate-200 flex items-center justify-center transition-all duration-200 shadow-xs cursor-pointer active:scale-95"
                  aria-label="Next Reviews"
                >
                  <RiArrowRightSLine className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Clean Segmented Tab Filters */}
          <div className="flex items-center justify-start flex-wrap gap-4">
            <div className="inline-flex items-center p-1.5 bg-slate-100/90 rounded-2xl sm:rounded-full border border-slate-200/90 shadow-2xs gap-1 sm:gap-1.5 flex-wrap">
              {[
                {
                  id: 'visual',
                  label: c.testimonialsSection.visualTabLabel,
                  count: testimonials.filter((t) => t.cardImage).length,
                  icon: RiFlightTakeoffLine
                },
                {
                  id: 'executive',
                  label: c.testimonialsSection.executiveTabLabel,
                  count: testimonials.filter((t) => !t.cardImage).length,
                  icon: RiChatQuoteLine
                },
                {
                  id: 'all',
                  label: c.testimonialsSection.allTabLabel,
                  count: testimonials.length,
                  icon: RiApps2Line
                }
              ].map((tab) => {
                const isActive = feedbackTab === tab.id
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setFeedbackTab(tab.id)
                      setActivePage(0)
                      resetTimer()
                    }}
                    className={`relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-bold font-mono tracking-wide transition-all duration-300 flex items-center gap-2 cursor-pointer select-none group ${
                      isActive
                        ? 'bg-slate-950 text-white shadow-md'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-white/80'
                    }`}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 transition-colors ${
                        isActive ? 'text-[#34E06E]' : 'text-slate-400 group-hover:text-slate-700'
                      }`}
                    />
                    <span>{tab.label}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-tight transition-colors ${
                        isActive
                          ? 'bg-white/15 text-[#34E06E]'
                          : 'bg-slate-200/80 text-slate-600 group-hover:bg-slate-300/80 group-hover:text-slate-900'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 3 Review Cards in One Row (Fixed Height + Butter-Smooth Motion) */}
          <div className="relative min-h-[470px] sm:min-h-[490px] md:min-h-[500px] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${feedbackTab}-${safePage}`}
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch w-full"
              >
                {filteredTestimonials
                  .slice(safePage * reviewsPerView, safePage * reviewsPerView + reviewsPerView)
                  .map((item, idx) => (
                    <div key={idx} className="flex flex-col h-[460px] sm:h-[480px] md:h-[490px]">
                      {item.cardImage ? (
                        /* Visual Card Display: Fixed Height + Clean Presentation */
                        <div className="w-full h-full rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-4 sm:p-5 flex flex-col justify-between group overflow-hidden">
                          {/* Top Row: Company Logo & Category Badge */}
                          <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 shrink-0 h-10">
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
                              <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-slate-950 border-b border-[#34E06E] pb-0.5 whitespace-nowrap">
                                {item.badge}
                              </span>
                            )}
                          </div>

                          {/* Middle: Full Uncropped Graphic Endorsement inside Flex Area */}
                          <div className="flex-1 w-full min-h-0 pt-3 flex items-center justify-center overflow-hidden">
                            <img
                              src={item.cardImage}
                              alt={`${item.company} Endorsement`}
                              className="max-h-full max-w-full w-auto h-auto object-contain select-none rounded-xl transition-transform duration-500 group-hover:scale-[1.01]"
                            />
                          </div>
                        </div>
                      ) : (
                        /* Executive Text Card: Fixed Height + Clean Typography */
                        <div className="w-full h-full rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between group overflow-hidden">
                          {/* Top Row: Airline Logo & Badge */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 shrink-0 h-11">
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
                              <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-slate-950 border-b border-[#34E06E] pb-0.5 whitespace-nowrap">
                                {item.badge}
                              </span>
                            )}
                          </div>

                          {/* Center: Full Quote inside Flex Area */}
                          <div className="flex-1 my-auto flex flex-col justify-center py-4 space-y-2 overflow-hidden">
                            <span className="text-3xl font-serif text-slate-400 leading-none block select-none">
                              “
                            </span>
                            <blockquote className="text-xs sm:text-sm font-normal text-slate-700 leading-relaxed italic line-clamp-6">
                              {item.quote}
                            </blockquote>
                          </div>

                          {/* Bottom: Author Credentials */}
                          <div className="pt-4 border-t border-slate-100 space-y-0.5 shrink-0">
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
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Clean Grouped Logo Selector (Simple pairs of logos with active green underline) */}
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 pt-4 border-t border-slate-200/60">
            {Array.from({ length: totalPages }, (_, pageIdx) => {
              const isCurrentPage = safePage === pageIdx
              const pageItems = filteredTestimonials.slice(
                pageIdx * reviewsPerView,
                pageIdx * reviewsPerView + reviewsPerView
              )

              return (
                <button
                  key={pageIdx}
                  onClick={() => {
                    setActivePage(pageIdx)
                    resetTimer()
                  }}
                  className={`group relative pb-2.5 transition-all duration-300 flex items-center gap-4 sm:gap-7 cursor-pointer border-b-2 ${isCurrentPage
                    ? 'border-[#34E06E] opacity-100 scale-100'
                    : 'border-transparent opacity-40 hover:opacity-80'
                    }`}
                  aria-label={`View group ${pageIdx + 1}`}
                >
                  {pageItems.map((item, itemIdx) => (
                    <div key={itemIdx} className="h-8 sm:h-9 flex items-center justify-center">
                      {item.logo ? (
                        <img
                          src={item.logo}
                          alt={item.company}
                          draggable={false}
                          className={`h-5 sm:h-6 max-w-[85px] sm:max-w-[105px] w-auto object-contain transition-all select-none pointer-events-none ${isCurrentPage
                            ? 'grayscale-0'
                            : 'grayscale group-hover:grayscale-0'
                            }`}
                        />
                      ) : (
                        <span
                          className={`text-xs sm:text-sm font-bold tracking-tight whitespace-nowrap ${isCurrentPage ? 'text-slate-900' : 'text-slate-500'
                            }`}
                        >
                          {item.company}
                        </span>
                      )}
                    </div>
                  ))}
                </button>
              )
            })}
          </div>

        </div>
      </section>
      {/* END: From the Operation */}

      {/* BEGIN: Training Framework (International standards. Local operational relevance.) */}
      <section className="py-16 sm:py-24 bg-white text-rocket-dark border-b border-slate-200/80" data-purpose="training-framework-standards">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: 4 Standard Authority Cards (FAA, EASA, ICAO, DGCA) */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
              {/* FAA Box */}
              <div className="rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col items-center justify-center p-4 text-center group">
                <img
                  src={logoFaa}
                  alt="FAA"
                  className="h-10 sm:h-12 w-auto max-w-[85px] object-contain select-none mb-2 group-hover:scale-105 transition-transform"
                />
                <span className="text-xs font-bold text-slate-900 tracking-wider uppercase">
                  FAA
                </span>
                <span className="text-[10px] font-mono text-slate-400">Part 65</span>
              </div>

              {/* EASA Box */}
              <div className="rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col items-center justify-center p-4 text-center group">
                <img
                  src={logoEasa}
                  alt="EASA"
                  className="h-10 sm:h-12 w-auto max-w-[85px] object-contain select-none mb-2 group-hover:scale-105 transition-transform"
                />
                <span className="text-xs font-bold text-slate-900 tracking-wider uppercase">
                  EASA
                </span>
                <span className="text-[10px] font-mono text-slate-400">ORO.GEN 110</span>
              </div>

              {/* ICAO Box */}
              <div className="rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col items-center justify-center p-4 text-center group">
                <img
                  src={logoIcao}
                  alt="ICAO"
                  className="h-10 sm:h-12 w-auto max-w-[85px] object-contain select-none mb-2 group-hover:scale-105 transition-transform"
                />
                <span className="text-xs font-bold text-slate-900 tracking-wider uppercase">
                  ICAO
                </span>
                <span className="text-[10px] font-mono text-slate-400">Doc 10106</span>
              </div>

              {/* DGCA Box */}
              <div className="rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col items-center justify-center p-4 text-center group">
                <img
                  src={logoDgca}
                  alt="DGCA"
                  className="h-10 sm:h-12 w-auto max-w-[85px] object-contain select-none mb-2 group-hover:scale-105 transition-transform"
                />
                <span className="text-xs font-bold text-slate-900 tracking-wider uppercase">
                  DGCA
                </span>
                <span className="text-[10px] font-mono text-slate-400">India CAR</span>
              </div>
            </div>

            {/* Right Column: Training Framework Narrative */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs sm:text-sm font-mono font-black uppercase tracking-widest text-slate-950 border-b-2 border-[#34E06E] pb-1 inline-block">
                {c.framework.eyebrow}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-rocket-dark leading-tight">
                {c.framework.title}
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 font-normal leading-relaxed">
                {c.framework.desc}
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
                {c.finalCta.eyebrow}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
                {c.finalCta.title}
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-emerald-50 max-w-xl font-normal leading-relaxed">
                {c.finalCta.desc}
              </p>
            </div>

            <div className="relative z-10 shrink-0">
              <Button
                onClick={() => navigate('/contact')}
                className="bg-[#34E06E] text-slate-950 hover:bg-[#28c85e] font-extrabold px-7 py-3.5 rounded-full text-xs uppercase tracking-wider shadow-lg hover:shadow-[0_0_25px_rgba(52,224,110,0.4)] transition-all hover:scale-105 inline-flex items-center gap-2.5 cursor-pointer group"
              >
                <span>{c.finalCta.ctaLabel}</span>
                <RiSendPlaneFill className="w-4 h-4 text-slate-950 group-hover:translate-x-0.5 transition-transform" />
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
