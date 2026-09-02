import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'

import { api } from '@/lib/api'
import { CourseDetailView } from '@/components/course/CourseDetailView'

export function CourseDetailPage() {
  const { slug } = useParams()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')

    api
      .getCourse(slug)
      .then((data) => {
        if (!cancelled) setCourse(data.course)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-rocket-dark" />
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-bold text-rocket-dark">Course not available</h1>
        <p className="text-gray-600 max-w-md">{error || 'This course could not be found.'}</p>
        <Link
          to="/events-courses"
          className="inline-flex items-center gap-2 text-sm font-bold text-rocket-dark underline"
        >
          <ArrowLeft className="w-4 h-4" /> All Events &amp; Courses
        </Link>
      </div>
    )
  }

  return <CourseDetailView course={course} />
}

export default CourseDetailPage
