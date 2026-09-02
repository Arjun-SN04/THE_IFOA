import React from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  BookOpen,
  Users,
  LogOut,
  Plus,
  ExternalLink,
  ShieldCheck,
  Globe,
  ChevronRight,
  FileText,
  LayoutTemplate
} from 'lucide-react'
import { useAdminAuth } from '@/context/AdminAuthContext'
import ifoaWhiteLogo from '@/assets/brand/ifoa-logoweb.png'

function NavItem({ to, icon: Icon, children, end, badge }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
          isActive
            ? 'bg-[#38b58a]/10 text-[#238b64] border border-[#38b58a]/30 shadow-xs'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div className="flex items-center gap-3">
            <Icon
              className={`w-4 h-4 shrink-0 transition-colors ${
                isActive ? 'text-[#238b64]' : 'text-slate-400 group-hover:text-slate-700'
              }`}
            />
            <span>{children}</span>
          </div>
          {badge && (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isActive
                  ? 'bg-[#38b58a]/20 text-[#238b64]'
                  : 'bg-slate-100 text-slate-500 group-hover:text-slate-700'
              }`}
            >
              {badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  )
}

export function AdminLayout() {
  const { admin, logout } = useAdminAuth()
  const location = useLocation()

  // Generate breadcrumb / title based on pathname
  const getPageInfo = () => {
    if (location.pathname === '/admin/courses/new')
      return { title: 'Create New Course', crumb: 'Curriculum', sub: 'New Course Editor' }
    if (location.pathname.endsWith('/form'))
      return { title: 'Enrollment Form Schema', crumb: 'Forms', sub: 'Custom Builder' }
    if (location.pathname === '/admin/form-template')
      return { title: 'Default Form Template', crumb: 'Forms', sub: 'Master Blueprint' }
    if (location.pathname === '/admin/pages')
      return { title: 'Site Pages & Content', crumb: 'CMS', sub: 'Static Pages' }
    if (location.pathname.startsWith('/admin/pages/'))
      return { title: 'Edit Page Content', crumb: 'CMS', sub: 'Live Content Editor' }
    if (location.pathname.startsWith('/admin/submissions'))
      return { title: 'Student Submissions', crumb: 'Admissions', sub: 'Registrations Pipeline' }
    if (/^\/admin\/courses\/[^/]+$/.test(location.pathname))
      return { title: 'Course Editor', crumb: 'Curriculum', sub: 'Course Specifications' }
    return { title: 'Courses Catalog', crumb: 'Curriculum', sub: 'All Academic Programs' }
  }

  const pageInfo = getPageInfo()

  return (
    <div className="h-screen w-screen flex flex-col bg-[#f8fafc] text-slate-900 overflow-hidden font-sans">
      {/* 1. Full-Width Top Header (Black Background) */}
      <header className="h-16 shrink-0 bg-[#020617] text-white border-b border-slate-800/90 flex items-center justify-between z-30 shadow-md">
        {/* Left: Logo container (matches w-64 of the left sidebar with border-r) + Breadcrumbs & Title */}
        <div className="flex items-center h-full">
          {/* Logo container matching exact w-64 width of left sidebar */}
          <div className="w-64 shrink-0 h-full px-5 flex items-center border-r border-slate-800/90">
            <Link to="/" className="inline-flex items-center group">
              <img
                src={ifoaWhiteLogo}
                alt="IFOA Official"
                className="h-8 w-auto object-contain brightness-105 group-hover:scale-102 transition-transform"
              />
            </Link>
          </div>

          {/* Breadcrumbs & Title */}
          <div className="px-6 sm:px-8">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <span>Admin</span>
              <ChevronRight className="w-3 h-3 text-slate-500" />
              <span>{pageInfo.crumb}</span>
              <ChevronRight className="w-3 h-3 text-slate-500" />
              <span className="text-emerald-400 font-bold">{pageInfo.sub}</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-white leading-tight">
              {pageInfo.title}
            </h1>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 px-6 sm:px-8">
          <Link
            to="/admin/courses/new"
            className="inline-flex items-center gap-2 bg-[#38b58a] hover:bg-[#2fa078] text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-emerald-500/20 active:scale-[0.99] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-white" />
            <span>New Course</span>
          </Link>

          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-200 hover:text-white border border-slate-700 bg-slate-800/80 hover:bg-slate-800 px-3.5 py-2.5 rounded-xl transition-colors"
          >
            <span>Live Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </header>

      {/* 2. Workspace Body: Left Sidebar + Main Content */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Sidebar (100% White Background) */}
        <aside className="w-64 shrink-0 bg-white text-slate-900 flex flex-col justify-between border-r border-slate-200/90 h-full select-none z-20 shadow-xs">
          {/* Navigation Links */}
          <div className="p-5 space-y-5 overflow-y-auto">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200/80 text-[10px] font-bold uppercase tracking-wider text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-[#38b58a]" />
              <span>Admin Console</span>
            </div>

            <nav className="space-y-4 pt-1">
              <div className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 pb-1">
                  Curriculum
                </div>
                <NavItem to="/admin/courses" icon={BookOpen} end>
                  Courses Catalog
                </NavItem>
                <NavItem to="/admin/courses/new" icon={Plus}>
                  Add New Course
                </NavItem>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 pb-1">
                  Admissions &amp; Leads
                </div>
                <NavItem to="/admin/submissions" icon={Users}>
                  Registrations
                </NavItem>
                <NavItem to="/admin/form-template" icon={FileText}>
                  Form Template
                </NavItem>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 pb-1">
                  Site &amp; Content
                </div>
                <NavItem to="/admin/pages" icon={LayoutTemplate}>
                  Site Pages CMS
                </NavItem>
              </div>
            </nav>
          </div>

          {/* Bottom Section: Profile & Actions */}
          <div className="p-4 border-t border-slate-200/80 space-y-2.5 bg-slate-50/80 shrink-0">
            {/* Admin User Badge */}
            <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#38b58a] to-[#207a57] text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                {admin?.name ? admin.name.substring(0, 2).toUpperCase() : 'IA'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-800 truncate">{admin?.name || 'IFOA Admin'}</p>
                <p className="text-[10px] text-slate-500 truncate">{admin?.email || 'admin@theifoa.com'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <Link
                to="/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200/80 transition-all text-center"
              >
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>Public Site</span>
              </Link>

              <button
                onClick={logout}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/80 border border-red-200/60 transition-all text-center cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Scrollable Page Body */}
        <main className="flex-1 min-w-0 p-6 sm:p-8 overflow-y-auto bg-[#f8fafc]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
