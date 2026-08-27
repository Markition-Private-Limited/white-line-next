'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { StaticImageData } from 'next/image'

import carouselImg1 from '../assets/home_carousel/carousel-image-1.png'
import carouselImg2 from '../assets/home_carousel/carousel-image-2.png'
import carouselImg3 from '../assets/home_carousel/carousel-image-3.png'
import carouselImg4 from '../assets/home_carousel/carousel-image-4.png'
import carouselImg5 from '../assets/home_carousel/carousel-image.jpg'

const IMAGES: StaticImageData[] = [carouselImg1, carouselImg2, carouselImg3, carouselImg4, carouselImg5]

const stats = [
  { num: 50,   suffix: 'K+',  label: 'Successfully\nCompleted Rides' },
  { num: 500,  suffix: '+',   label: 'Elite\nChauffeurs' },
  { num: 99,   suffix: '%',   label: 'On-Time\nRating' },
  { num: null, suffix: '24/7',label: 'Dedicated\nSupport' },
]

const TOTAL = 5

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true) },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

function useStatsInView() {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true) },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, inView }
}

function useCountUp(target: number | null, inView: boolean, duration = 2400) {
  const [count, setCount] = useState(0)
  const hasRun = useRef(false)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!inView || target === null || hasRun.current) return
    hasRun.current = true
    let start: number | null = null

    const step = (ts: number) => {
      if (!start) start = ts
      const t = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setCount(Math.round(eased * target))
      if (t < 1) rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [inView, target, duration])

  return target === null ? null : count
}

function StatNumber({ num, suffix, inView, delay }: { num: number | null; suffix: string; inView: boolean; delay: number }) {
  const count = useCountUp(num, inView, 2400 + delay * 150)
  return (
    <span>
      {num === null ? suffix : `${count}${suffix}`}
    </span>
  )
}

function useIsMobile() {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return mobile
}

function getCardStyle(index: number, active: number, isMobile: boolean): React.CSSProperties {
  const offset = index - active
  const wrapped = ((offset + TOTAL) % TOTAL)
  const norm = wrapped > 2 ? wrapped - TOTAL : wrapped
  const abs = Math.abs(norm)

  const spacing = isMobile ? 108 : 180
  const scale = abs === 0 ? 1 : abs === 1 ? 0.76 : 0.56
  const tx = norm * spacing
  const ty = abs === 0 ? 0 : abs === 1 ? 28 : 78
  const opacity = abs === 0 ? 1 : abs === 1 ? 0.55 : (isMobile ? 0 : 0.3)
  const saturate = abs === 0 ? 1 : abs === 1 ? 0.4 : 0.1

  return {
    transform: `translateX(${tx}px) translateY(${ty}px) scale(${scale})`,
    zIndex: 10 - abs * 3,
    opacity,
    filter: `saturate(${saturate})`,
    transition: 'all 0.65s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: abs === 0 ? 'default' : 'pointer',
  }
}

export function StatsRow() {
  const { ref, inView } = useStatsInView()
  return (
    <div
      ref={ref}
      className="grid grid-cols-2 sm:grid-cols-4"
      style={{ borderTop: '1px solid #e5e7eb' }}
    >
      {stats.map((s, i) => (
        <div
          key={s.suffix}
          className={`py-8 px-6 sm:px-10 ${i < stats.length - 1 ? 'border-r border-gray-200' : ''}`}
        >
          <p
            className="font-bold mb-1"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 'clamp(30px, 4vw, 48px)',
              color: '#294244',
            }}
          >
            <StatNumber num={s.num} suffix={s.suffix} inView={inView} delay={i} />
          </p>
          <p
            className="leading-snug"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(11px, 1.2vw, 13px)',
              whiteSpace: 'pre-line',
              color: '#828282',
            }}
          >
            {s.label}
          </p>
        </div>
      ))}
    </div>
  )
}

export default function ExperienceSection() {
  const [active, setActive] = useState(2)
  const { ref, inView } = useInView()
  const isMobile = useIsMobile()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setActive(p => (p + 1) % TOTAL)
    }, 2000)
  }

  useEffect(() => {
    startTimer()
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selectCard = (i: number) => {
    setActive(i)
    startTimer() // reset the 2-second countdown from this card
  }

  const fadeUp = (delay = 0): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(36px)',
    transition: `opacity 0.85s ease ${delay}s, transform 0.85s ease ${delay}s`,
  })

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="w-full bg-white"
      style={{ paddingTop: '80px', paddingBottom: '72px' }}
    >
      {/* Header */}
      <div className="px-6 text-center" style={fadeUp(0)}>
        {/* Label */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <span className="block h-px w-8" style={{ background: '#005C66' }} />
          <span
            className="text-xs tracking-[0.22em] uppercase font-medium"
            style={{ fontFamily: 'Inter, sans-serif', color: '#005C66' }}
          >
            The Whiteline Experience
          </span>
        </div>

        {/* Heading — lighter weight */}
        <h2
          className="text-[#111118] leading-tight mb-5"
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 300,
            fontSize: 'clamp(28px, 5vw, 46px)',
          }}
        >
          More Than A Ride. A
          <br />
          <span style={{ fontWeight: 600, fontStyle: 'italic' }}>Better Way To Move.</span>
        </h2>

        {/* Subtext — full container width */}
        <p
          className="text-gray-400 leading-relaxed mb-14 mx-auto px-6 sm:px-16 lg:px-28"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(13px, 1.5vw, 15px)',
          }}
        >
          WhiteLane delivers premium chauffeur transportation for people who value comfort,
          reliability, and exceptional service. From airport transfers to corporate journeys,
          every ride is designed to make growing more effortless.
        </p>
      </div>

      {/* Carousel */}
      <div style={{ ...fadeUp(0.18), position: 'relative' }}>

        {/* ── Mobile (unchanged behaviour) ── */}
        {isMobile && (
          <div
            className="relative mx-auto flex items-end justify-center"
            style={{ height: 310, overflow: 'hidden' }}
          >
            {/* White glow — mobile only */}
            <div
              style={{
                position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none',
                background: 'linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 8%, rgba(255,255,255,0.5) 18%, rgba(255,255,255,0) 28%, rgba(255,255,255,0) 72%, rgba(255,255,255,0.5) 82%, rgba(255,255,255,0.9) 92%, rgba(255,255,255,1) 100%)',
              }}
            />
            {Array.from({ length: TOTAL }).map((_, i) => (
              <div
                key={i}
                onClick={() => selectCard(i)}
                className="absolute"
                style={{
                  width: 158,
                  height: 224,
                  borderRadius: 18,
                  overflow: 'hidden',
                  position: 'absolute',
                  ...getCardStyle(i, active, true),
                }}
              >
                <Image
                  src={IMAGES[i]}
                  alt={`carousel ${i + 1}`}
                  fill
                  placeholder="blur"
                  sizes="158px"
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                  draggable={false}
                />
              </div>
            ))}
          </div>
        )}

        {/* ── Desktop (new layout) ── */}
        {!isMobile && (
          <div
            style={{
              position: 'relative',
              maxWidth: 946,
              margin: '0 auto',
              overflow: 'hidden',
            }}
          >
            {/* Subtle edge glow — edge-card gradients handle the main fade */}
            <div
              style={{
                position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none',
                background: 'linear-gradient(to right, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 8%, rgba(255,255,255,0) 92%, rgba(255,255,255,0.25) 100%)',
              }}
            />

            {/* Cards */}
            <div style={{ position: 'relative', height: 462 }}>
              {Array.from({ length: TOTAL }).map((_, i) => {
                const offset = i - active
                const wrapped = ((offset + TOTAL) % TOTAL)
                const pos = wrapped > 2 ? wrapped - TOTAL : wrapped // -2..2
                const abs = Math.abs(pos)

                const w = abs === 0 ? 348 : 198
                const h = abs === 0 ? 445 : 260
                const isEdge = abs === 2

                // Slot center offsets — increased gap between active and adjacent cards
                const slotCenterX = [-493, -292, 0, 292, 493][pos + 2]
                // translateX positions the card's left edge relative to container's left: 50%
                const tx = slotCenterX - w / 2

                return (
                  <div
                    key={i}
                    onClick={() => abs > 0 ? selectCard(i) : undefined}
                    style={{
                      position: 'absolute',
                      top: abs === 0 ? 0 : (445 - 260) / 2,
                      left: '50%',
                      width: w,
                      height: h,
                      borderRadius: 16,
                      overflow: 'hidden',
                      transform: `translateX(${tx}px)`,
                      zIndex: 10 - abs * 3,
                      transition: 'all 0.65s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: abs === 0 ? 'default' : 'pointer',
                    }}
                  >
                    <Image
                      src={IMAGES[i]}
                      alt={`carousel ${i + 1}`}
                      fill
                      placeholder="blur"
                      sizes="(max-width: 1200px) 348px, 348px"
                      style={{
                        objectFit: 'cover',
                        display: 'block',
                        transform: isEdge ? 'scaleX(-1)' : 'none',
                        transition: 'transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)',
                        pointerEvents: 'none',
                      }}
                      draggable={false}
                    />
                    {/* Gradient fade on edge cards — blends into white background */}
                    {pos === -2 && (
                      <div style={{
                        position: 'absolute', inset: 0, pointerEvents: 'none',
                        background: 'linear-gradient(to left, rgba(255,255,255,0) 15%, rgba(255,255,255,1) 100%)',
                      }} />
                    )}
                    {pos === 2 && (
                      <div style={{
                        position: 'absolute', inset: 0, pointerEvents: 'none',
                        background: 'linear-gradient(to right, rgba(255,255,255,0) 15%, rgba(255,255,255,1) 100%)',
                      }} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Stats — full width, no centre cap */}
      <div className="mt-16 px-6 sm:px-12 lg:px-20" style={fadeUp(0.35)}>
        <StatsRow />
      </div>
    </section>
  )
}


