import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  RiShieldCheckFill,
  RiCheckboxCircleFill,
  RiFileTextLine,
  RiLockLine,
  RiGlobeLine,
  RiUserStarFill
} from 'react-icons/ri'
import { HiArrowUpRight, HiArrowRight } from 'react-icons/hi2'

export function AgentForServicePage() {
  const navigate = useNavigate()
  const steps = [
    {
      num: '01',
      title: 'Fast Online Registration',
      desc: 'Fill out your FAA certificate details, current foreign residential address, and contact preferences in under 3 minutes.'
    },
    {
      num: '02',
      title: 'Immediate Compliance Filing',
      desc: 'Receive your official IFOA USA Agent for Service Designation Certificate and unique US physical address to submit to IACRA/FAA.'
    },
    {
      num: '03',
      title: 'Secure Digital Mailroom',
      desc: 'Any official FAA communications or safety directives are immediately received, scanned into your encrypted portal, and alerted to you.'
    }
  ]

  const plans = [
    {
      name: '1-Year Individual Airman',
      tagline: 'Ideal for active foreign pilots & dispatchers needing annual FAA regulatory compliance.',
      price: '$149',
      period: '/ year',
      features: [
        'Official US Physical Address for FAA Records',
        'Immediate Proof of Representation Certificate',
        'High-Resolution Digital Document Scanning',
        'Instant SMS & Email Notice of Official Inquiries',
        'Direct Assistance with FAA Address Updates'
      ],
      popular: false,
      ctaText: 'Select 1-Year Plan'
    },
    {
      name: '3-Year Multi-Year Shield',
      tagline: 'Best value for long-term international airline crew holding FAA commercial credentials.',
      price: '$349',
      period: '/ 3 years',
      features: [
        'Save 25% over annual renewal fees',
        'Priority Concierge Verification Support',
        'Automated Triennial Compliance Renewal Filing',
        'Encrypted Archive of All FAA Correspondence',
        'Complimentary IACRA Address Change Verification'
      ],
      popular: true,
      ctaText: 'Select 3-Year Plan'
    },
    {
      name: 'Corporate Fleet / Airline',
      tagline: 'Custom group management for international carriers employing foreign FAA airmen.',
      price: 'Custom',
      period: 'tailored',
      features: [
        'Centralized OCC Crew Compliance Dashboard',
        'Bulk Onboarding with Single Corporate Invoicing',
        'Dedicated FAA Regulatory Liaison Executive',
        'Automated Expiration & Status Tracking API',
        'SLA Guaranteed 2-Hour Urgent Notice Escalation'
      ],
      popular: false,
      ctaText: 'Contact Fleet Liaison'
    }
  ]

  return (
    <div className="bg-[#f9f9f9] text-[#000021]">
      {/* Responsive Hero Section */}
      <section className="py-16 sm:py-24 bg-white border-b border-black/5 relative overflow-hidden pt-28 sm:pt-32">
        <div className="max-w-[1280px] mx-auto px-5 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#34E06E]/25 text-[#0d6833] text-xs font-bold uppercase tracking-widest">
                <RiShieldCheckFill className="w-3.5 h-3.5" /> 14 CFR Part 3 FAA Requirement
              </div>
              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#000021] leading-tight">
                Effortless <span className="text-[#0d6833]">FAA Compliance</span> for Pilots and Dispatchers Worldwide
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-[#5A5A5A] leading-relaxed">
                At IFOA USA, we streamline your compliance obligations by securely assigning a dependable FAA Registered Agent for Service on your behalf. Focus on flying; we handle the legalities.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => navigate('/events-courses')}
                  className="w-full sm:w-auto bg-[#34E06E] text-[#000021] font-bold hover:bg-[#28c85e] px-8 py-6 rounded-full text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Get Your Agent Now</span>
                  <HiArrowUpRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Metric Card */}
            <div className="lg:col-span-5 mt-6 lg:mt-0">
              <div className="p-6 sm:p-8 rounded-3xl bg-[#000021] text-white space-y-6 shadow-2xl relative">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs uppercase font-bold text-[#34E06E] tracking-widest">
                      IFOA USA Compliance
                    </span>
                    <h3 className="font-display text-2xl font-bold mt-1">99.9% Success Rate</h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-[#34E06E] text-[#000021] flex items-center justify-center font-bold">
                    <RiUserStarFill className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                  Thousands of international airmen in over 65 countries trust IFOA USA to maintain their FAA active certification status without regulatory interruption.
                </p>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-[#34E06E] font-bold">
                    <RiCheckboxCircleFill className="w-4 h-4 shrink-0" /> Official Registered Office in Miami, Florida
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/80">
                    <RiCheckboxCircleFill className="w-4 h-4 text-[#34E06E] shrink-0" /> Same-day digital dispatch for incoming legal notices
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why & What Bento */}
      <section className="py-16 sm:py-24 bg-[#f9f9f9]">
        <div className="max-w-[1280px] mx-auto px-5 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0d6833] bg-[#34E06E]/25 px-3 py-1 rounded-full">
              Regulatory Overview
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#000021]">
              Why Foreign Airmen Need a US Agent
            </h2>
            <p className="text-sm sm:text-base text-[#5A5A5A]">
              Under FAA Final Rule 14 CFR Part 3, all non-US resident individuals holding or applying for FAA pilot, dispatcher, or flight engineer certificates must designate an official US Agent for Service of Process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 sm:p-8 bg-white border border-[#000021]/5 shadow-sm rounded-2xl space-y-4 hover-lift">
              <div className="w-12 h-12 rounded-xl bg-[#34E06E] flex items-center justify-center text-[#000021]">
                <RiFileTextLine className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#000021]">Mandatory FAA Mandate</h3>
              <p className="text-xs sm:text-sm text-[#5A5A5A] leading-relaxed">
                Failure to designate a valid US Agent can result in certificate suspension, rejection of new rating applications, or delayed renewal filings.
              </p>
            </Card>

            <Card className="p-6 sm:p-8 bg-white border border-[#000021]/5 shadow-sm rounded-2xl space-y-4 hover-lift">
              <div className="w-12 h-12 rounded-xl bg-[#000021] flex items-center justify-center text-[#34E06E]">
                <RiLockLine className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#000021]">Strict Confidentiality</h3>
              <p className="text-xs sm:text-sm text-[#5A5A5A] leading-relaxed">
                Your personal foreign address and certificate details remain secure. All physical mail is handled with bank-grade encryption and chain-of-custody.
              </p>
            </Card>

            <Card className="p-6 sm:p-8 bg-white border border-[#000021]/5 shadow-sm rounded-2xl space-y-4 hover-lift">
              <div className="w-12 h-12 rounded-xl bg-[#EEEEEE] flex items-center justify-center text-[#000021]">
                <RiGlobeLine className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#000021]">Global Aircrew Network</h3>
              <p className="text-xs sm:text-sm text-[#5A5A5A] leading-relaxed">
                Used by international airline pilots across Europe, Middle East, and Asia operating FAA type-rated Boeing and Airbus fleets worldwide.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 3-Step Process */}
      <section className="py-16 sm:py-24 bg-[#EEEEEE]">
        <div className="max-w-[1280px] mx-auto px-5 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0d6833] bg-[#34E06E]/30 px-3 py-1 rounded-full">
              Simple Onboarding
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#000021]">
              How the Service Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {steps.map((s, idx) => (
              <div key={idx} className="bg-white p-6 sm:p-8 rounded-2xl border border-black/5 shadow-sm space-y-4 relative">
                <span className="font-display text-3xl sm:text-4xl font-black text-[#0d6833]">
                  {s.num}
                </span>
                <h3 className="font-display text-lg sm:text-xl font-bold text-[#000021]">{s.title}</h3>
                <p className="text-xs sm:text-sm text-[#5A5A5A] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing / Plan Selection */}
      <section className="py-16 sm:py-24 bg-white" id="pricing">
        <div className="max-w-[1280px] mx-auto px-5 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#34E06E] bg-[#000021] px-4 py-1 rounded-full">
              Transparent Pricing
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#000021]">
              Choose Your Compliance Shield
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {plans.map((p, idx) => (
              <Card
                key={idx}
                className={`p-6 sm:p-8 rounded-3xl flex flex-col justify-between transition-all duration-300 relative ${
                  p.popular
                    ? 'border-2 border-[#000021] bg-[#000021] text-white shadow-2xl md:scale-105'
                    : 'border border-black/10 bg-white text-[#000021] shadow-sm hover-lift'
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-3.5 right-6 sm:right-8 bg-[#34E06E] text-[#000021] px-4 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider shadow-md">
                    Most Popular
                  </span>
                )}

                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-display text-xl sm:text-2xl font-bold">{p.name}</h3>
                    <p className={`text-xs ${p.popular ? 'text-white/70' : 'text-[#5A5A5A]'}`}>
                      {p.tagline}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-4xl sm:text-5xl font-extrabold">{p.price}</span>
                    <span className={`text-xs font-bold ${p.popular ? 'text-[#34E06E]' : 'text-[#5A5A5A]'}`}>
                      {p.period}
                    </span>
                  </div>

                  <ul className="space-y-3 pt-4 border-t border-current/10">
                    {p.features.map((feat, fidx) => (
                      <li key={fidx} className="flex items-start gap-2.5 text-xs">
                        <CheckCircle2
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            p.popular ? 'text-[#34E06E]' : 'text-[#0d6833]'
                          }`}
                        />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8 mt-6">
                  <Button
                    onClick={() => navigate('/events-courses')}
                    className={`w-full py-6 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center ${
                      p.popular
                        ? 'bg-[#34E06E] text-[#000021] hover:bg-[#28c85e] shadow-lg'
                        : 'bg-[#000021] text-white hover:bg-[#34E06E] hover:text-[#000021]'
                    }`}
                  >
                    {p.ctaText}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
