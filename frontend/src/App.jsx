import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { HomePage } from './pages/HomePage'
import { AboutPage } from './pages/AboutPage'
import { ServicesPage } from './pages/ServicesPage'
import { EventsPage } from './pages/EventsPage'
import { ContactPage } from './pages/ContactPage'
import { AgentForServicePage } from './pages/AgentForServicePage'
import { CourseDetailPage } from './pages/CourseDetailPage'
import { CourseEnrollmentPage } from './pages/CourseEnrollmentPage'
import { LoginModal } from './components/modals/LoginModal'
import { RouteTitle } from './components/common/RouteTitle'
import { ChatWidget } from './components/common/ChatWidget'

import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext'
import { AdminLayout } from './pages/admin/AdminLayout'
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { AdminCoursesPage } from './pages/admin/AdminCoursesPage'
import { AdminCourseFormPage } from './pages/admin/AdminCourseFormPage'
import { AdminCoursePreviewPage } from './pages/admin/AdminCoursePreviewPage'
import { AdminSubmissionsPage } from './pages/admin/AdminSubmissionsPage'
import { AdminSubmissionDetailPage } from './pages/admin/AdminSubmissionDetailPage'
import { AdminFormBuilderPage } from './pages/admin/AdminFormBuilderPage'
import { AdminPagesPage } from './pages/admin/AdminPagesPage'
import { AdminPageEditorPage } from './pages/admin/AdminPageEditorPage'
import { Loader2 } from 'lucide-react'

// ScrollToTop helper on route change
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function ExternalRedirect({ to }) {
  useEffect(() => {
    window.location.replace(to)
  }, [to])
  return null
}

// Gate for any admin-only screen. Used for both the console shell and
// standalone admin pages (e.g. course preview) that render without the shell.
function RequireAdmin({ children }) {
  const { admin, loading } = useAdminAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rocket-dark">
        <Loader2 className="w-8 h-8 animate-spin text-rocket-lime" />
      </div>
    )
  }
  if (!admin) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />
  }
  return children
}

// Public site chrome: navbar + footer around the marketing pages.
function PublicSite() {
  const [loginModalOpen, setLoginModalOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-white text-rocket-dark selection:bg-rocket-lime selection:text-black">
      <Navbar onOpenLogin={() => setLoginModalOpen(true)} />

      <main className="grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events-courses" element={<Navigate to="/events" replace />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/courses/:slug" element={<CourseDetailPage />} />
          <Route path="/courses/:slug/enroll" element={<CourseEnrollmentPage />} />
          <Route path="/enroll/:slug" element={<CourseEnrollmentPage />} />
          <Route path="/enroll" element={<Navigate to="/events" replace />} />
          <Route path="/courses" element={<Navigate to="/events" replace />} />
          <Route path="/training" element={<Navigate to="/services" replace />} />
          <Route path="/compliance" element={<ExternalRedirect to="https://agent.theifoa.com/" />} />
          <Route path="/agent-for-service" element={<ExternalRedirect to="https://agent.theifoa.com/" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      <ChatWidget />

      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </div>
  )
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <RouteTitle />
      <AdminAuthProvider>
        <Routes>
          {/* Admin console */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          {/* Full-screen course preview - outside the console shell */}
          <Route
            path="/admin/courses/:id/preview"
            element={
              <RequireAdmin>
                <AdminCoursePreviewPage />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route index element={<Navigate to="/admin/courses" replace />} />
            <Route path="courses" element={<AdminCoursesPage />} />
            <Route path="courses/new" element={<AdminCourseFormPage />} />
            <Route path="courses/:id" element={<AdminCourseFormPage />} />
            <Route path="courses/:id/form" element={<AdminFormBuilderPage />} />
            <Route path="form-template" element={<AdminFormBuilderPage />} />
            <Route path="pages" element={<AdminPagesPage />} />
            <Route path="pages/:page" element={<AdminPageEditorPage />} />
            <Route path="submissions" element={<AdminSubmissionsPage />} />
            <Route path="submissions/:id" element={<AdminSubmissionDetailPage />} />
            <Route path="registrations" element={<Navigate to="/admin/submissions" replace />} />
          </Route>

          {/* Public site */}
          <Route path="/*" element={<PublicSite />} />
        </Routes>
      </AdminAuthProvider>
    </Router>
  )
}

export default App
