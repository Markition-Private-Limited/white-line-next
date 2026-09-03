'use client'
import { motion, useInView } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { StaticImageData } from 'next/image'
import { useLanguage } from '../context/LanguageContext'

import farah from '../assets/home_customers/farah.jpg'
import raza2 from '../assets/home_customers/raza-2.jpg'
import raza from '../assets/home_customers/raza.jpg'
import sultan from '../assets/home_customers/sultan.jpg'

// Images in the same order as translations.testimonials.reviews
const REVIEW_IMAGES: StaticImageData[] = [raza, sultan, farah, raza2, sultan, farah, raza, raza2]

const GAP = 12
const DESKTOP_VISIBLE = 4
const MOBILE_VISIBLE = 1

type ReviewItem = { img: StaticImageData; name: string; role: string; stars: number; text: string }

function TestimonialCard({ r }: { r: ReviewItem }) {
  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ borderRadius: 10, boxShadow: '0 8px 20px rgba(0,0,0,0.08)', background: '#fff' }}
    >
      {/* Profile header — grey background */}
      <div
        style={{
          background: '#f3f3f3',
          padding: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          minHeight: 120,
        }}
      >
        <img
          src={(r.img as any).src ?? r.img}
          alt={r.name}
          style={{
            width: 80,
            height: 80,
            objectFit: 'cover',
            objectPosition: 'center 21%',
            borderRadius: 7,
            flexShrink: 0,
            display: 'block',
          }}
        />
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              margin: '0 0 4px',
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(15px, 1.4vw, 18px)',
              fontWeight: 700,
              lineHeight: 1.12,
              color: '#202020',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {r.name}
          </p>
          <p
            style={{
              margin: 0,
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(11px, 1vw, 13px)',
              color: '#7c7c7c',
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
            }}
          >
            {r.role}
          </p>
        </div>
      </div>

      {/* Review body — white, stars float above */}
      <div
        style={{
          position: 'relative',
          padding: '35px 22px 20px',
          minHeight: 140,
          textAlign: 'center',
          flex: 1,
          background: '#fff',
        }}
      >
        {/* Stars pill — floats between header and body */}
        <div
          style={{
            position: 'absolute',
            top: -17,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 120,
            height: 34,
            borderRadius: '7px 7px 0 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            background: '#fff',
            color: '#f2c936',
            fontSize: 15,
            boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
          }}
        >
          {Array.from({ length: r.stars }).map((_, i) => (
            <span key={i}>★</span>
          ))}
        </div>

        <p
          style={{
            margin: 0,
            fontFamily: 'Inter, sans-serif',
            color: '#818181',
            fontSize: 'clamp(12px, 1.1vw, 15px)',
            lineHeight: 1.68,
            fontWeight: 400,
          }}
        >
          {r.text}
        </p>
      </div>
    </div>
  )
}

export default function TestimonialsSection() {
  const { trans, dir } = useLanguage()
  const { testimonials: t } = trans
  const REVIEWS: ReviewItem[] = t.reviews.map((r, i) => ({ ...r, img: REVIEW_IMAGES[i], stars: 5 }))

  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-8% 0px' })
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const touchStartX = useRef(0)

  const [containerWidth, setContainerWidth] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

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

  const visible = isMobile ? MOBILE_VISIBLE : DESKTOP_VISIBLE
  const totalPositions = REVIEWS.length - visible + 1
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
    }, 3500)
  }, [])

  useEffect(() => {
    startTimer()
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [startTimer, isMobile])

  useEffect(() => { setCurrentIndex(0) }, [visible])

  const goTo = (i: number) => { setCurrentIndex(i); startTimer() }

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX }
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
      id="customer-reviews"
      ref={sectionRef}
      className="w-full bg-white"
      style={{ paddingTop: 'clamp(32px, 4vw, 48px)', paddingBottom: 'clamp(56px, 7vw, 80px)' }}
    >
      <div className="px-6 sm:px-10 lg:px-16">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div {...fadeUp(0)} className="flex items-center justify-center gap-3 mb-5">
          <span className="block h-px w-8" style={{ background: '#005C66' }} />
          <span
            className="text-xs tracking-[0.22em] uppercase font-medium"
            style={{ fontFamily: 'Inter, sans-serif', color: '#005C66' }}
          >
            {t.label}
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
          {t.h1}{' '}
          <span style={{ fontWeight: 700, fontStyle: 'italic' }}>{t.h2}</span>
          {t.h3 ? <>{' '}{t.h3}</> : null}
        </motion.h2>

        <motion.p
          {...fadeUp(0.18)}
          className="text-gray-400 leading-relaxed mx-auto"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(13px, 1.5vw, 15px)',
            maxWidth: 620,
          }}
        >
          {t.sub}
        </motion.p>
      </div>

      {/* Carousel */}
      <motion.div {...fadeUp(0.24)}>
        <div
          className="overflow-hidden"
          dir="ltr"
          style={{ paddingTop: 32, paddingBottom: 32 }}
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
              {REVIEWS.map((r, i) => (
                <div
                  key={i}
                  dir={dir}
                  style={{
                    width: cardWidth > 0
                      ? cardWidth
                      : `calc((100% - ${GAP * (visible - 1)}px) / ${visible})`,
                    flexShrink: 0,
                  }}
                >
                  <TestimonialCard r={r} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center items-center gap-2 mt-2">
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
      </div>
    </section>
  )
}



