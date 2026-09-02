import { useEffect } from 'react'
import { useLocation, matchPath } from 'react-router-dom'

const BRAND = 'IFOA | International Flight Operations Academy'

// Ordered most-specific first. `title` is the full <title> string.
const ROUTES = [
  { pattern: '/', title: BRAND, end: true },
  { pattern: '/services', title: 'Training & Services | IFOA' },
  { pattern: '/events', title: 'Events & Courses | IFOA' },
  { pattern: '/about', title: 'About | IFOA' },
  { pattern: '/contact', title: 'Contact | IFOA' },
  { pattern: '/agent-for-service', title: 'Agent for Service | IFOA' },
  // Course detail sets its own title from the course data (CourseDetailView).
  { pattern: '/courses/:slug', title: 'Course | IFOA' },

  { pattern: '/admin/login', title: 'Admin Login | IFOA' },
  { pattern: '/admin/courses/new', title: 'New Course · Admin | IFOA' },
  { pattern: '/admin/courses/:id/preview', title: 'Course Preview · Admin | IFOA' },
  { pattern: '/admin/courses/:id/form', title: 'Enrollment Form · Admin | IFOA' },
  { pattern: '/admin/courses/:id', title: 'Edit Course · Admin | IFOA' },
  { pattern: '/admin/courses', title: 'Courses · Admin | IFOA' },
  { pattern: '/admin/form-template', title: 'Form Template · Admin | IFOA' },
  { pattern: '/admin/submissions/:id', title: 'Submission · Admin | IFOA' },
  { pattern: '/admin/submissions', title: 'Submissions · Admin | IFOA' },
  { pattern: '/admin', title: 'Admin | IFOA' }
]

// Sets document.title per route. Pages that need a data-driven title
// (e.g. a course name) may still override it in their own effect.
export function RouteTitle() {
  const { pathname } = useLocation()

  useEffect(() => {
    const hit = ROUTES.find((r) =>
      matchPath({ path: r.pattern, end: r.end ?? false }, pathname)
    )
    document.title = hit ? hit.title : BRAND
  }, [pathname])

  return null
}
