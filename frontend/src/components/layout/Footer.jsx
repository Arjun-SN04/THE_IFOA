import React from 'react'
import { Link } from 'react-router-dom'
import { RiLinkedinFill, RiFacebookFill, RiInstagramLine, RiYoutubeFill, RiArrowUpLine } from 'react-icons/ri'
import ifoaLogo from '@/assets/shared/brand/ifoa-logoweb.webp'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-[#020617] pt-16 pb-12 border-t border-white/10 text-white select-none" data-purpose="main-footer">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-8 gap-10 lg:gap-8 mb-14 items-start">
          {/* Brand Info & Mission */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3">
              <img
                src={ifoaLogo}
                alt="IFOA"
                className="h-9 sm:h-10 w-auto object-contain brightness-110 hover:scale-105 transition-transform"
              />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm font-normal">
              International Flight Operations Academy. World-class flight dispatch education, FAA Part 65 certification, and EASA ORO.GEN.110 operational compliance.
            </p>

            {/* Circular Social Media Links matching reference */}
            <div className="flex items-center gap-2.5 pt-2">
              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/71556135/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#34E06E] text-slate-300 hover:text-slate-950 flex items-center justify-center transition-all duration-200 shadow-sm"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <RiLinkedinFill className="w-4 h-4" />
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/profile.php?id=100069215447113"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#34E06E] text-slate-300 hover:text-slate-950 flex items-center justify-center transition-all duration-200 shadow-sm"
                aria-label="Facebook"
                title="Facebook"
              >
                <RiFacebookFill className="w-4 h-4" />
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/theifoa/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#34E06E] text-slate-300 hover:text-slate-950 flex items-center justify-center transition-all duration-200 shadow-sm"
                aria-label="Instagram"
                title="Instagram"
              >
                <RiInstagramLine className="w-4 h-4" />
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/channel/UCH2vo2z3uLuPOTI1TwFaT7A"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#34E06E] text-slate-300 hover:text-slate-950 flex items-center justify-center transition-all duration-200 shadow-sm"
                aria-label="YouTube"
                title="YouTube"
              >
                <RiYoutubeFill className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-bold text-sm text-white tracking-tight">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#34E06E] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/foxtrot-delta" className="hover:text-[#34E06E] transition-colors font-medium">
                  Foxtrot Delta
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-bold text-sm text-white tracking-tight">
              Services
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Initial Dispatch
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Recurrent Refresher
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Dangerous Goods
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  OCC Consulting
                </Link>
              </li>
              <li>
                <a
                  href="https://agent.theifoa.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Agent for Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {currentYear} International Flight Operations Academy GmbH · Professional Flight Dispatcher Certification</p>

          <button
            onClick={scrollToTop}
            className="group inline-flex items-center gap-2 py-1 text-slate-400 hover:text-white transition-colors duration-200 cursor-pointer"
            title="Back to top"
            aria-label="Back to top"
          >
            <span className="text-xs font-semibold tracking-wide">Back to top</span>
            <span className="w-7 h-7 rounded-full border border-slate-600 group-hover:border-[#34E06E] group-hover:text-[#34E06E] flex items-center justify-center transition-colors duration-200">
              <RiArrowUpLine className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
            </span>
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
