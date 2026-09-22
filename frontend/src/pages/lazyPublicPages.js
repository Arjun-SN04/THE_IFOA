// Client-only, code-split versions of the public pages - imported only by
// main.jsx. Each becomes its own chunk, fetched only when a visitor actually
// navigates to that route, instead of every page shipping in the one bundle
// every visitor downloads on first load. See eagerPublicPages.js for why
// this lives in a separate file rather than alongside the eager imports.
import { lazy } from 'react'

export const lazyPublicPages = {
  HomePage: lazy(() => import('./HomePage').then((m) => ({ default: m.HomePage }))),
  NotFoundPage: lazy(() => import('./NotFoundPage').then((m) => ({ default: m.NotFoundPage }))),
  AboutPage: lazy(() => import('./AboutPage').then((m) => ({ default: m.AboutPage }))),
  ServicesPage: lazy(() => import('./ServicesPage').then((m) => ({ default: m.ServicesPage }))),
  EventsPage: lazy(() => import('./EventsPage').then((m) => ({ default: m.EventsPage }))),
  ContactPage: lazy(() => import('./ContactPage').then((m) => ({ default: m.ContactPage }))),
  CourseDetailPage: lazy(() => import('./CourseDetailPage').then((m) => ({ default: m.CourseDetailPage }))),
  CourseEnrollmentPage: lazy(() =>
    import('./CourseEnrollmentPage').then((m) => ({ default: m.CourseEnrollmentPage }))
  ),
  FoxtrotDeltaPage: lazy(() => import('./FoxtrotDeltaPage').then((m) => ({ default: m.FoxtrotDeltaPage })))
}
