import React from 'react'
import { Link } from 'react-router-dom'
import { RiLinkedinFill, RiFacebookFill, RiInstagramLine, RiYoutubeFill, RiArrowUpLine } from 'react-icons/ri'
import ifoaLogo from '@/assets/brand/ifoa-logoweb.png'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-[#020617] pt-16 pb-12 border-t border-white/10 text-white select-none" data-purpose="main-footer">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-14 items-start">
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
              International Flight Operations Academy. Professional education and development for Flight Dispatch and Operational Control.
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-2">
              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/71556135/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#0077B5] flex items-center justify-center text-white transition-all shadow-sm group"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <RiLinkedinFill className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" />
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/profile.php?id=100069215447113"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#1877F2] flex items-center justify-center text-white transition-all shadow-sm group"
                aria-label="Facebook"
                title="Facebook"
              >
                <RiFacebookFill className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" />
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/theifoa/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-gradient-to-tr hover:from-amber-500 hover:to-rose-500 flex items-center justify-center text-white transition-all shadow-sm group"
                aria-label="Instagram"
                title="Instagram"
              >
                <RiInstagramLine className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" />
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/channel/UCH2vo2z3uLuPOTI1TwFaT7A"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#FF0000] flex items-center justify-center text-white transition-all shadow-sm group"
                aria-label="YouTube"
                title="YouTube"
              >
                <RiYoutubeFill className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Training Links */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-bold text-sm text-white tracking-tight">
              Training
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Initial
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Recurrent
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Advanced
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Specialist
                </Link>
              </li>
            </ul>
          </div>

          {/* IFOA Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-bold text-sm text-white tracking-tight">
              IFOA
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/foxtrot-delta" className="hover:text-[#34E06E] transition-colors font-medium">
                  Foxtrot Delta Magazine
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Instructors & Services
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Locations & Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Locations */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-bold text-sm text-white tracking-tight">
              Locations
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <span>Basel</span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-300">Switzerland</span>
              </li>
              <li className="flex items-center gap-2">
                <span>Daytona Beach</span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-300">USA</span>
              </li>
              <li className="flex items-center gap-2">
                <span>New Delhi</span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-300">India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {currentYear} International Flight Operations Academy GmbH · Professional Flight Dispatcher Certification</p>

          <button
            onClick={scrollToTop}
            className="group flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-[#34E06E] text-slate-400 hover:text-slate-950 border border-white/10 hover:border-[#34E06E] transition-all duration-300 shadow-sm hover:shadow-[0_0_20px_rgba(52,224,110,0.35)] cursor-pointer"
            title="Scroll to top"
            aria-label="Scroll to top"
          >
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider">Top</span>
            <RiArrowUpLine className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
