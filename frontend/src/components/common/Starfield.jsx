import React, { useEffect, useRef } from 'react'

export function Starfield({ density = 280, className = '' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId
    let width = (canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth)
    let height = (canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight)

    const handleResize = () => {
      if (!canvas.parentElement) return
      const dpr = window.devicePixelRatio || 1
      width = canvas.parentElement.offsetWidth
      height = canvas.parentElement.offsetHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr, dpr)
    }

    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    window.addEventListener('resize', handleResize)

    // Generate stars
    const stars = Array.from({ length: density }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() < 0.7 ? Math.random() * 1 + 0.5 : Math.random() * 1.5 + 1.2,
      baseAlpha: Math.random() * 0.7 + 0.3,
      twinkleSpeed: Math.random() * 0.03 + 0.01,
      phase: Math.random() * Math.PI * 2,
      color: Math.random() < 0.15 ? '#b0e0ff' : '#ffffff'
    }))

    let time = 0
    const render = () => {
      time += 1
      ctx.clearRect(0, 0, width, height)

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i]
        const alpha = star.baseAlpha + Math.sin(time * star.twinkleSpeed + star.phase) * 0.3
        const clampedAlpha = Math.max(0.1, Math.min(1, alpha))

        ctx.fillStyle = star.color
        ctx.globalAlpha = clampedAlpha
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()

        // Subtle glow for larger stars
        if (star.size > 1.8) {
          ctx.globalAlpha = clampedAlpha * 0.3
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size * 2.2, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [density])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none select-none z-0 ${className}`}
      style={{ display: 'block' }}
    />
  )
}

export default Starfield
