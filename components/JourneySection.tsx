'use client'
import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

import bannerImg from '../assets/home_unknown_section/banner.jpg'
import rightIcon from '../assets/home_unknown_section/right_icon_under_banner.png'

const stats = [
  { num: 50, suffix: 'K+', label: 'Completed Rides' },
  { num: 500, suffix: '+', label: 'Elite Chauffeurs' },
  { num: 99, suffix: '%', label: 'On-Time Rating' },
]

const BG = '#0d3535'

function useCountUp(target: number, inView: boolean, duration = 2400) {
  const [count, setCount] = useState(0)
  const hasRun = useRef(false)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!inView || hasRun.current) return
    hasRun.current = true
    let start: number | null = null

    const step = (ts: number) => {
      if (!start) start = ts
      const t = Math.min((ts - start) / duration, 1)
      // Cubic ease-out — rushes at the start, decelerates near target
      const eased = 1 - Math.pow(1 - t, 3)
      setCount(Math.round(eased * target))
      if (t < 1) rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [inView, target, duration])

  return count
}

function AnimatedStat({
  num, suffix, label, delay, inView,
}: {
  num: number
  suffix: string
  label: string
  delay: number
  inView: boolean
}) {
  const count = useCountUp(num, inView, 2400 + delay * 150)

  return (
    <motion.div
      className="relative z-10 text-center"
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{ duration: 0.7, delay: 0.35 + delay * 0.13, ease: 'easeOut' }}
    >
      <p
        className="text-white"
        style={{
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 600,
          fontSize: 'clamp(36px, 4vw, 56px)',
          lineHeight: 1.1,
        }}
      >
        {count}{suffix}
      </p>
      <p
        className="text-white/45"
        style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          fontSize: 'clamp(11px, 1vw, 13px)',
          lineHeight: '133%',
          letterSpacing: '-0.02em',
          marginTop: 4,
        }}
      >
        {label}
      </p>
    </motion.div>
  )
}

export default function JourneySection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-8% 0px' })

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 },
    transition: { duration: 0.85, delay, ease: [0.25, 0.46, 0.45, 0.94] as const },
  })

  return (
    <section
      ref={ref}
      className="w-full"
      style={{
        background: BG,
        padding: 'clamp(40px, 5vw, 72px) clamp(20px, 5vw, 72px)',
      }}
    >
      {/* ── Header ── */}
      <div className="text-center mb-10 sm:mb-12">
        <motion.div {...fadeUp(0)} className="flex items-center justify-center gap-3 mb-4">
          <span className="block h-px w-8" style={{ background: '#4fa8a8' }} />
          <span
            className="text-xs tracking-[0.22em] uppercase font-medium"
            style={{ fontFamily: 'Inter, sans-serif', color: '#4fa8a8' }}
          >
            More Than Transportation
          </span>
        </motion.div>

        <motion.h2
          {...fadeUp(0.1)}
          className="text-white leading-tight mb-4"
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 400,
            fontSize: 'clamp(26px, 4vw, 44px)',
          }}
        >
          Designed Around
          <br />
          <span style={{ fontWeight: 700, fontStyle: 'italic' }}>Your Journey.</span>
        </motion.h2>

        <motion.p
          {...fadeUp(0.18)}
          className="text-white/50 mx-auto leading-relaxed"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(13px, 1.3vw, 15px)',
            maxWidth: 600,
          }}
        >
          Every booking is managed to perfection, ensuring that you arrive refreshed,
          relaxed, and strictly on time.
        </motion.p>
      </div>

      {/* ── Image + Stats row ── */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-5">

        {/* Banner */}
        <motion.div
          className="relative overflow-hidden w-full lg:flex-shrink-0"
          style={{
            borderRadius: 15,
            flex: '0 0 67%',
            aspectRatio: '843 / 414',
          }}
          initial={{ opacity: 0, x: -36 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -36 }}
          transition={{ duration: 0.95, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <img
            src={(bannerImg as any).src ?? bannerImg}
            alt="Passenger in luxury vehicle"
            className="w-full h-full object-cover object-center"
          />
        </motion.div>

        {/* Stats column */}
        <motion.div
          className="relative flex flex-row justify-around lg:flex-col lg:justify-evenly flex-1 py-4"
          initial={{ opacity: 0, x: 36 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 36 }}
          transition={{ duration: 0.95, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Decorative watermark — smaller on desktop */}
          <img
            src={(rightIcon as any).src ?? rightIcon}
            alt=""
            aria-hidden
            className="hidden lg:block absolute pointer-events-none select-none"
            style={{
              opacity: 0.25,
              width: '60%',
              height: '60%',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              objectFit: 'contain',
            }}
          />

          {stats.map((s, i) => (
            <AnimatedStat
              key={s.suffix}
              num={s.num}
              suffix={s.suffix}
              label={s.label}
              delay={i}
              inView={inView}
            />
          ))}
        </motion.div>

      </div>
    </section>
  )
}


