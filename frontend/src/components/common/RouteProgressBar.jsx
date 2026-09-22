import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export function RouteProgressBar() {
  const location = useLocation()
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    // Reset and trigger smooth progress on route changes
    setIsDone(false)
    setVisible(true)
    setProgress(30)

    const t1 = setTimeout(() => {
      setProgress(75)
    }, 70)

    const t2 = setTimeout(() => {
      setProgress(100)
      setIsDone(true)
    }, 180)

    const t3 = setTimeout(() => {
      setVisible(false)
      setProgress(0)
    }, 450)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [location.pathname, location.search])

  if (!visible && progress === 0) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none h-[3px] overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-[#28c85e] via-[#34E06E] to-[#6ee7b7] transition-all"
        style={{
          width: `${progress}%`,
          transitionDuration: isDone ? '200ms' : '120ms',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: isDone ? 0 : 1,
          boxShadow: '0 0 12px rgba(52, 224, 110, 0.85), 0 0 4px rgba(52, 224, 110, 0.5)'
        }}
      />
    </div>
  )
}
