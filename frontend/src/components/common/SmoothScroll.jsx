import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

const LenisContext = createContext(null)

export function useLenis() {
  return useContext(LenisContext)
}

export function SmoothScroll({ children }) {
  const [lenisInstance, setLenisInstance] = useState(null)
  const lenisRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    // Only enable on clients with window available
    if (typeof window === 'undefined') return

    const lenis = new Lenis({
      duration: 0.65,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.0,
      infinite: false,
      syncTouch: false,
      autoRaf: false
    })

    lenisRef.current = lenis
    setLenisInstance(lenis)

    let rafId
    function raf(time) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }

    rafId = requestAnimationFrame(raf)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      lenis.destroy()
      lenisRef.current = null
      setLenisInstance(null)
    }
  }, [])

  // Immediately jump to top on route change without lag
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }
  }, [location.pathname])

  return (
    <LenisContext.Provider value={lenisInstance}>
      {children}
    </LenisContext.Provider>
  )
}

export default SmoothScroll
