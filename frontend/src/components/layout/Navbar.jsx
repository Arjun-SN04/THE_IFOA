import React, { useState, useEffect, useRef } from 'react'
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, ChevronRight, ChevronDown, LayoutDashboard, BookOpen, Users, LogOut } from 'lucide-react'
import ifoaLogo from '@/assets/brand/ifoa-logoweb.png'
import { useAdminAuth } from '@/context/AdminAuthContext'

const ADMIN_LINKS = [
  { name: 'Admin Dashboard', path: '/admin/courses', icon: LayoutDashboard },
  { name: 'Courses', path: '/admin/courses', icon: BookOpen },
  { name: 'Registrations', path: '/admin/registrations', icon: Users }
]

function initialsOf(name = '', email = '') {
  const source = name.trim() || email
  const parts = source.split(/[\s@._-]+/).filter(Boolean)
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || 'AD'
}

// Profile badge + dropdown shown in the header when an admin is signed in.
function AdminMenu({ admin, onLogout }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 pl-1 pr-2 py-1 hover:bg-white/10 transition"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="grid place-items-center w-7 h-7 rounded-full bg-rocket-lime text-black text-xs font-bold">
          {initialsOf(admin.name, admin.email)}
        </span>
        <span className="hidden sm:block text-xs font-semibold text-white/90 max-w-[120px] truncate">
          {admin.name || admin.email}
        </span>
        <ChevronDown className={`w-4 h-4 text-white/60 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-60 rounded-xl bg-white text-rocket-dark shadow-2xl border border-black/10 overflow-hidden z-50"
        >
          <div className="px-4 py-3 border-b border-black/5">
            <p className="text-sm font-bold truncate">{admin.name || 'IFOA Admin'}</p>
            <p className="text-xs text-gray-500 truncate">{admin.email}</p>
            <span className="mt-1 inline-block text-[10px] font-bold uppercase tracking-wider bg-rocket-lime/30 text-rocket-dark px-2 py-0.5 rounded">
              {admin.role || 'admin'}
            </span>
          </div>

          <div className="py-1">
            {ADMIN_LINKS.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition"
                role="menuitem"
              >
                <item.icon className="w-4 h-4 text-gray-400" />
                {item.name}
              </Link>
            ))}
          </div>

          <div className="border-t border-black/5 py-1">
            <button
              onClick={() => {
                setOpen(false)
                onLogout()
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
              role="menuitem"
            >
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// variant="fixed" (default) is the marketing sticky header.
// variant="static" flows in the document - used inside the admin console
// and course preview so it never overlaps other chrome.
export function Navbar({ onOpenLogin, variant = 'fixed' }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { admin, logout } = useAdminAuth()
  const isStatic = variant === 'static'

  const handleLogout = async () => {
    await logout()
    setMobileMenuOpen(false)
    navigate('/')
  }

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const shouldScroll = window.scrollY > 20
          setIsScrolled((prev) => (prev !== shouldScroll ? shouldScroll : prev))
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Events', path: '/events' },
    { name: 'Agent for Service', path: 'https://agent.theifoa.com/', external: true },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ]

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true
    if (path === '/services' && (location.pathname.startsWith('/services') || location.pathname.startsWith('/courses'))) return true
    if (path === '/events' && (location.pathname.startsWith('/events') || location.pathname.startsWith('/events-courses'))) return true
    if (path !== '/' && !path.startsWith('http') && location.pathname.startsWith(path)) return true
    return false
  }

  // Close mobile drawer on route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  return (
    <header
      className={`${isStatic ? 'relative' : 'fixed'} top-0 left-0 w-full z-50 text-white transition-all duration-300 ${
        isScrolled || mobileMenuOpen
          ? 'bg-[#020617]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl'
          : 'bg-[#020617]/85 backdrop-blur-md border-b border-white/10 shadow-lg'
      }`}
      data-purpose="sticky-navigation"
    >
      {/* Top Navbar Row */}
      <div className="h-20 w-full flex items-center">
        <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group outline-none shrink-0">
            <img
              src={ifoaLogo}
              alt="IFOA International Flight Operations Academy"
              className="h-8 sm:h-9 md:h-10 w-auto object-contain brightness-105 group-hover:scale-105 transition-transform"
            />
          </Link>

          {/* Nav Links with Smooth Underline Animation (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {navLinks.map((link) => {
              const active = isActive(link.path)
              if (link.external) {
                return (
                  <a
                    key={link.name}
                    href={link.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative py-2 text-sm font-medium text-white/80 hover:text-white transition-colors duration-200 outline-none focus:outline-none"
                  >
                    <span>{link.name}</span>
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-rocket-lime rounded-full transition-all duration-300 ease-out origin-left scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100" />
                  </a>
                )
              }
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={`group relative py-2 text-sm font-medium transition-colors duration-200 outline-none focus:outline-none ${
                    active ? 'text-white font-semibold' : 'text-white/80 hover:text-white'
                  }`}
                >
                  <span>{link.name}</span>
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-[2px] bg-rocket-lime rounded-full transition-all duration-300 ease-out origin-left ${
                      active
                        ? 'scale-x-100 opacity-100'
                        : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100'
                    }`}
                  />
                </NavLink>
              )
            })}
          </nav>

          {/* CTA Button / Admin badge & Mobile Toggle */}
          <div className="flex items-center gap-3">
            {admin ? (
              <AdminMenu admin={admin} onLogout={handleLogout} />
            ) : (
              <Link
                to="/events"
                className="hidden sm:inline-flex bg-[#34E06E] text-slate-950 px-6 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-widest hover:bg-[#28c85e] hover:shadow-[0_0_20px_rgba(52,224,110,0.45)] transition-all hover:scale-105 shadow-md"
              >
                Enroll Now
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-white hover:bg-white/10 focus:outline-none transition-colors"
              aria-label="Toggle Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#020617]/98 backdrop-blur-2xl border-t border-white/10 px-4 sm:px-6 py-6 space-y-4 max-h-[calc(100dvh-5rem)] overflow-y-auto shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const active = isActive(link.path)
              if (link.external) {
                return (
                  <a
                    key={link.name}
                    href={link.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-white/90 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <span>{link.name}</span>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </a>
                )
              }
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? 'bg-white/15 text-white font-bold'
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </Link>
              )
            })}
            {admin ? (
              <div className="pt-3 mt-2 border-t border-white/10 space-y-1">
                <div className="px-4 py-2">
                  <p className="text-sm font-bold text-white truncate">{admin.name || 'IFOA Admin'}</p>
                  <p className="text-xs text-white/50 truncate">{admin.email}</p>
                </div>
                {ADMIN_LINKS.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/90 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <item.icon className="w-4 h-4 opacity-70" />
                    {item.name}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-white/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </div>
            ) : (
              <div className="pt-4">
                <Link
                  to="/events"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full block text-center bg-[#34E06E] text-slate-950 py-3.5 rounded-full text-xs font-extrabold uppercase tracking-widest hover:bg-[#28c85e] active:scale-[0.99] transition-all shadow-lg"
                >
                  Enroll Now
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}



