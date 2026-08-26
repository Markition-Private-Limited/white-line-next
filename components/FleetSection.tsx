'use client'
import { motion, useInView } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'

import car0 from '../assets/home_cars/car_image_0.png'
import car1 from '../assets/home_cars/car_image_1.png'
import car2 from '../assets/home_cars/car_image_2.png'

const _getSrc = (i: unknown) => (i as any).src ?? i as string
const CARS = [
  { img: _getSrc(car0), title: 'Premium SUV', desc: 'Spacious, versatile, and elegant. Perfect for small groups, families, and extra luggage capacity.' },
  { img: _getSrc(car1), title: 'Executive Class', desc: 'Uncompromised style and modern design. Tailored for individuals and business leaders.' },
  { img: _getSrc(car2), title: 'Luxury Sedan', desc: 'The absolute standard of executive comfort. Sleek profile with premium interior amenities.' },
  { img: _getSrc(car0), title: 'Business SUV', desc: 'Ideal for corporate events and group transfers. Combining power, comfort, and refined style.' },
  { img: _getSrc(car1), title: 'Corporate Sedan', desc: 'Sleek performance meets executive privilege. A seamless experience for the modern professional.' },
  { img: _getSrc(car2), title: 'VIP Limousine', desc: 'The pinnacle of luxury ground travel. Discreet, spacious, and impeccably appointed.' },
]

const GAP = 16

export default function FleetSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-8% 0px' })
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const touchStartX = useRef(0)

  const [containerWidth, setContainerWidth] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Track container size and mobile breakpoint
  useEffect(() => {
    const update = () => {
      if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth)
      setIsMobile(window.innerWidth < 640)
    }
    update()
    const ro = new ResizeObserver(update)
    if (containerRef.current) ro.observe(containerRef.current)
    window.addEventListener('resize', update)
    return () => { ro.disconnect(); window.removeEventListener('resize', update) }
  }, [])

  const visible = isMobile ? 1 : 3
  const totalPositions = CARS.length - visible + 1 // 4 on desktop, 6 on mobile
  const totalPositionsRef = useRef(totalPositions)
  useEffect(() => { totalPositionsRef.current = totalPositions }, [totalPositions])

  const cardWidth = containerWidth > 0
    ? (containerWidth - GAP * (visible - 1)) / visible
    : 0
  const stepWidth = cardWidth + GAP

  const startTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setCurrentIndex(p => (p + 1) % totalPositionsRef.current)
    }, 3000)
  }, [])

  useEffect(() => {
    startTimer()
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [startTimer, isMobile])

  // Reset index when visible count changes (e.g. resize crosses mobile breakpoint)
  useEffect(() => { setCurrentIndex(0) }, [visible])

  const goTo = (i: number) => {
    setCurrentIndex(i)
    startTimer()
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(delta) < 40) return
    if (delta > 0) goTo(Math.min(currentIndex + 1, totalPositions - 1))
    else goTo(Math.max(currentIndex - 1, 0))
  }

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 28 },
    animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 },
    transition: { duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] as const },
  })

  return (
    <section
      ref={sectionRef}
      className="w-full bg-white"
      style={{ paddingTop: 'clamp(60px, 8vw, 96px)', paddingBottom: 'clamp(48px, 6vw, 72px)' }}
    >
      {/* Header */}
      <div className="text-center mb-12 px-6">
        <motion.div {...fadeUp(0)} className="flex items-center justify-center gap-3 mb-5">
          <span className="block h-px w-8" style={{ background: '#005C66' }} />
          <span
            className="text-xs tracking-[0.22em] uppercase font-medium"
            style={{ fontFamily: 'Inter, sans-serif', color: '#005C66' }}
          >
            The Whiteline Fleet
          </span>
        </motion.div>

        <motion.h2
          {...fadeUp(0.1)}
          className="text-[#111118] leading-tight mb-5"
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 300,
            fontSize: 'clamp(26px, 5vw, 46px)',
          }}
        >
          Travel In Exceptional{' '}
          <span style={{ fontWeight: 700, fontStyle: 'italic' }}>Comfort.</span>
        </motion.h2>

        <motion.p
          {...fadeUp(0.18)}
          className="text-gray-400 leading-relaxed mx-auto"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(13px, 1.5vw, 15px)',
            maxWidth: 640,
          }}
        >
          A meticulously maintained collection of luxury sedans and executive vehicles,
          engineered for utmost comfort, privacy, and seamless travel across the Kingdom.
        </motion.p>
      </div>

      {/* Carousel */}
      <motion.div {...fadeUp(0.24)}>
        {/* Clip window — touch handlers enable swipe on mobile */}
        <div
          className="overflow-hidden px-5 sm:px-0"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div ref={containerRef}>
            <div
              className="flex"
              style={{
                gap: GAP,
                transform: `translateX(-${currentIndex * stepWidth}px)`,
                transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                willChange: 'transform',
              }}
            >
              {CARS.map((car, i) => (
                <div
                  key={i}
                  style={{
                    // fall back to equal width before JS measures container
                    width: cardWidth > 0
                      ? cardWidth
                      : `calc((100% - ${GAP * (visible - 1)}px) / ${visible})`,
                    flexShrink: 0,
                  }}
                >
                  <div
                    className="overflow-hidden bg-white h-full"
                    style={{
                      borderRadius: 16,
                      border: '1px solid rgba(0,0,0,0.08)',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                    }}
                  >
                    {/* Image with white bottom fade */}
                    <div className="relative w-full" style={{ aspectRatio: '4 / 3' }}>
                      <img
                        src={car.img}
                        alt={car.title}
                        className="w-full h-full object-cover object-center"
                        draggable={false}
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            'linear-gradient(to bottom, rgba(255,255,255,0) 40%, rgba(255,255,255,1) 100%)',
                        }}
                      />
                    </div>

                    {/* Text */}
                    <div className="px-6 pb-8 -mt-6 relative">
                      <h3
                        className="text-[#111118] mb-2"
                        style={{
                          fontFamily: 'Montserrat, sans-serif',
                          fontWeight: 700,
                          fontSize: 'clamp(18px, 1.8vw, 22px)',
                        }}
                      >
                        {car.title}
                      </h3>
                      <p
                        className="text-gray-400 leading-relaxed"
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: 'clamp(12px, 1.1vw, 14px)',
                        }}
                      >
                        {car.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center items-center gap-2 mt-8">
          {Array.from({ length: totalPositions }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: i === currentIndex ? 24 : 8,
                height: 8,
                borderRadius: 999,
                background: i === currentIndex ? '#111118' : '#d1d5db',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.35s ease',
              }}
            />
          ))}
        </div>
      </motion.div>
    </section>
  )
}


