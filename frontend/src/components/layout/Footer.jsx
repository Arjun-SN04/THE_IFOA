import React from 'react'
import { Link } from 'react-router-dom'
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
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all shadow-sm"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/profile.php?id=100069215447113"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all shadow-sm"
                aria-label="Facebook"
                title="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/theifoa/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all shadow-sm"
                aria-label="Instagram"
                title="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/channel/UCH2vo2z3uLuPOTI1TwFaT7A"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all shadow-sm"
                aria-label="YouTube"
                title="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
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
                <Link to="/services" className="hover:text-white transition-colors">
                  Instructors
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Approvals
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Locations
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
            className="p-2 bg-white/5 hover:bg-white/20 rounded-md text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Scroll to top"
            aria-label="Scroll to top"
          >
            <span className="block font-bold">↑</span>
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
