import React, { useEffect, useRef } from 'react';

/**
 * Responsive, high-performance cosmic parallax starfield from TMS.
 * - 3 distinct star layers (small, medium, big) with continuous upward drift
 * - 3D cursor parallax response with smooth 0.08 lerp
 * - Density matched to 2000x2000 area ratio
 */
export const CosmicParallaxBg = ({
  className = '',
  contentClassName = 'justify-center',
  children,
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const mouseRef = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;
    let smallStars = [];
    let mediumStars = [];
    let bigStars = [];

    // Initialize stars matching TMS density (700 small, 200 medium, 100 big per 2000x2000 area)
    const initStars = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      width = rect.width || window.innerWidth;
      height = rect.height || window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      const areaRatio = (width * height) / (2000 * 2000);
      const smallCount = Math.max(250, Math.floor(700 * areaRatio));
      const mediumCount = Math.max(70, Math.floor(200 * areaRatio));
      const bigCount = Math.max(35, Math.floor(100 * areaRatio));

      smallStars = Array.from({ length: smallCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
      }));

      mediumStars = Array.from({ length: mediumCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
      }));

      bigStars = Array.from({ length: bigCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
      }));
    };

    initStars();

    const handleResize = () => {
      initStars();
    };

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      mouseRef.current.targetX = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      mouseRef.current.targetY = (e.clientY - innerHeight / 2) / (innerHeight / 2);
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    const render = () => {
      // Smooth mouse lerp identical to TMS
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#FFFFFF';

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;

      // Layer 1: Small stars (1px by 1px, 50s speed, 18px mouse parallax)
      const smallOffsetX = mouseX * 18;
      const smallOffsetY = mouseY * 18;
      for (let i = 0; i < smallStars.length; i++) {
        const star = smallStars[i];
        star.y -= 0.67;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }
        let drawX = (star.x + smallOffsetX) % width;
        let drawY = (star.y + smallOffsetY) % height;
        if (drawX < 0) drawX += width;
        if (drawY < 0) drawY += height;
        ctx.fillRect(Math.floor(drawX), Math.floor(drawY), 1, 1);
      }

      // Layer 2: Medium stars (2px by 2px, 100s speed, 40px mouse parallax)
      const medOffsetX = mouseX * 40;
      const medOffsetY = mouseY * 40;
      for (let i = 0; i < mediumStars.length; i++) {
        const star = mediumStars[i];
        star.y -= 0.33;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }
        let drawX = (star.x + medOffsetX) % width;
        let drawY = (star.y + medOffsetY) % height;
        if (drawX < 0) drawX += width;
        if (drawY < 0) drawY += height;
        ctx.fillRect(Math.floor(drawX), Math.floor(drawY), 2, 2);
      }

      // Layer 3: Big stars (3px by 3px, 150s speed, 75px mouse parallax)
      const bigOffsetX = mouseX * 75;
      const bigOffsetY = mouseY * 75;
      for (let i = 0; i < bigStars.length; i++) {
        const star = bigStars[i];
        star.y -= 0.22;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }
        let drawX = (star.x + bigOffsetX) % width;
        let drawY = (star.y + bigOffsetY) % height;
        if (drawX < 0) drawX += width;
        if (drawY < 0) drawY += height;
        ctx.fillRect(Math.floor(drawX), Math.floor(drawY), 3, 3);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={
        children
          ? `relative w-full h-full overflow-hidden bg-[radial-gradient(ellipse_at_bottom,_#0f172a_0%,_#020617_100%)] ${className}`
          : `absolute inset-0 w-full h-full pointer-events-none overflow-hidden bg-[radial-gradient(ellipse_at_bottom,_#0f172a_0%,_#020617_100%)] ${className}`
      }
    >
      {/* 60fps Deep Space Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        style={{ willChange: 'transform' }}
      />

      {children && (
        <div className={`relative z-10 w-full h-full flex-1 flex flex-col ${contentClassName}`}>
          {children}
        </div>
      )}
    </div>
  );
};

export default CosmicParallaxBg;
