'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import appImg    from '../assets/global_app/app.png'
import appleIcon from '../assets/global_app/apple-logo-svgrepo-com.svg'
import playIcon  from '../assets/global_app/google-play-svgrepo-com.svg'

const MotionImage = motion.create(Image)

/* ── Radar SVG (coded — matches the concentric-circle sonar look) ── */
function RadarGraphic({ className, style }: { className?: string; style?: React.CSSProperties }) {
  /* Cars/planes along the arcs — positions are [cx, cy, rotateDeg] */
  const icons = [
    { cx: 138, cy: 52,  r: -30 },
    { cx: 232, cy: 108, r:  10 },
    { cx: 82,  cy: 174, r: -55 },
    { cx: 262, cy: 220, r:  20 },
    { cx: 52,  cy: 280, r: -80 },
  ]

  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 320 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Concentric circles — centred at bottom-right (320, 380) */}
      {[120, 190, 260, 330, 400].map((r, i) => (
        <circle key={i} cx={320} cy={380} r={r} stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      ))}

      {/* Diagonal arc paths (planes/cars trace these) */}
      <path
        d="M 60 20 Q 200 80 280 260"
        stroke="rgba(255,255,255,0.13)"
        strokeWidth="1"
        strokeDasharray="6 6"
      />
      <path
        d="M 10 100 Q 160 160 300 340"
        stroke="rgba(255,255,255,0.10)"
        strokeWidth="1"
        strokeDasharray="6 6"
      />

      {/* Car icons along the arcs */}
      {icons.map(({ cx, cy, r }, i) => (
        <g key={i} transform={`translate(${cx},${cy}) rotate(${r})`}>
          {/* Body */}
          <rect x="-18" y="-8"  width="36" height="16" rx="5" fill="rgba(255,255,255,0.38)" />
          {/* Roof / cabin */}
          <rect x="-10" y="-17" width="20" height="11" rx="4" fill="rgba(255,255,255,0.26)" />
          {/* Wheels */}
          <circle cx="-11" cy="8"  r="4.5" fill="rgba(255,255,255,0.45)" />
          <circle cx=" 11" cy="8"  r="4.5" fill="rgba(255,255,255,0.45)" />
          {/* Wheel hubs */}
          <circle cx="-11" cy="8"  r="1.8" fill="rgba(255,255,255,0.7)" />
          <circle cx=" 11" cy="8"  r="1.8" fill="rgba(255,255,255,0.7)" />
        </g>
      ))}
    </svg>
  )
}

/* ── Store button ────────────────────────────────────────────────── */
function StoreButton({ variant, compact }: { variant: 'apple' | 'google'; compact?: boolean }) {
  const isApple = variant === 'apple'
  return (
    <a
      href="#"
      className="flex items-center rounded-xl"
      style={{
        background: '#fff',
        padding: compact ? '8px 12px' : '10px 18px',
        gap: compact ? 8 : 10,
        textDecoration: 'none',
        border: '1px solid rgba(0,0,0,0.10)',
        flex: compact ? '1 1 0' : undefined,
        minWidth: 0,
      }}
    >
      <img
        src={isApple ? (appleIcon as any).src ?? appleIcon : (playIcon as any).src ?? playIcon}
        alt=""
        aria-hidden="true"
        style={{ width: compact ? 26 : 36, height: compact ? 26 : 36, objectFit: 'contain', flexShrink: 0 }}
      />
      <div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 9, margin: 0, lineHeight: 1, color: '#111', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {isApple ? 'Download on the' : 'Get it on'}
        </p>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 700, margin: 0, lineHeight: 1.3, color: '#111' }}>
          {isApple ? 'App Store' : 'Google Play'}
        </p>
      </div>
    </a>
  )
}

/* ── Main component ─────────────────────────────────────────────── */

/**
 * Reusable app-download banner.
 * Drop <AppSection /> anywhere — no props needed.
 */
export default function AppSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-10% 0px' })

  return (
    <section
      ref={sectionRef}
      className="w-full bg-white"
      style={{ overflowX: 'clip' }}
    >

      {/* ══════════════ DESKTOP ══════════════ */}
      <div
        className="hidden sm:block"
        style={{ padding: 'clamp(16px, 3vw, 48px)' }}
      >
        {/* Outer: relative + no overflow → phone bleeds vertically */}
        <div className="relative" style={{ borderRadius: 20 }}>

          {/* Card: overflow-hidden clips the bg + radar to the rounded card */}
          <div
            className="relative overflow-hidden"
            style={{
              borderRadius: 20,
              background: '#0b3330',
              minHeight: 'clamp(200px, 22vw, 300px)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {/* Radar — anchored to bottom-right corner of the card */}
            <RadarGraphic
              style={{
                position: 'absolute',
                right: '-6%',
                bottom: '0%',
                width: 'clamp(280px, 24%, 580px)',
                opacity: 0.7,
                pointerEvents: 'none',
                zIndex: 0,
                transform: 'rotate(275deg)',
              }}
            />

            {/* Left text block */}
            <div
              className="relative z-10"
              style={{
                padding: 'clamp(36px, 5vw, 64px)',
                maxWidth: 'clamp(340px, 58%, 660px)',
              }}
            >
              <motion.h2
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  color: '#fff',
                  fontSize: 'clamp(22px, 3vw, 44px)',
                  fontWeight: 300,
                  lineHeight: 1.2,
                  marginBottom: 14,
                }}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <span style={{ whiteSpace: 'nowrap' }}>
                  Professional{' '}
                  <em style={{ fontWeight: 800, fontStyle: 'italic' }}>chauffeurs</em>
                </span>
                <br />at your fingertips
              </motion.h2>

              <motion.p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  color: 'rgba(255,255,255,0.58)',
                  fontSize: 'clamp(12px, 1.1vw, 14px)',
                  lineHeight: 1.7,
                  marginBottom: 28,
                  maxWidth: 480,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                Download the Whiteline Chauffeur Hailing™ app to hail chauffeurs on demand in select cities.
              </motion.p>

              <motion.div
                className="flex gap-3 flex-wrap"
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <StoreButton variant="apple" />
                <StoreButton variant="google" />
              </motion.div>
            </div>
          </div>

          {/* Phone — absolute on the OUTER div, bleeds above & below the card */}
          <div
            style={{
              position: 'absolute',
              right: '3%',
              top: '50%',
              transform: 'translateY(-50%)',
              height: '148%',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              zIndex: 10,
            }}
          >
            <MotionImage
              src={appImg}
              alt="Whiteline app screens"
              placeholder="blur"
              style={{ height: '100%', width: 'auto', display: 'block' }}
              initial={{ opacity: 0, x: 130, scale: 0.95 }}
              animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
              transition={{ duration: 1.1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      </div>

      {/* ══════════════ MOBILE ══════════════ */}
      <div className="block sm:hidden px-4 py-8">
        <div
          className="relative overflow-hidden"
          style={{ borderRadius: 20, background: '#0b3330' }}
        >
          {/* Radar — bottom-right corner */}
          <RadarGraphic
            style={{
              position: 'absolute',
              bottom: '-10%',
              right: '-12%',
              width: '75%',
              opacity: 0.55,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          {/* Content */}
          <div className="relative z-10 px-6 pt-8 pb-0">
            <motion.h2
              style={{
                fontFamily: 'Montserrat, sans-serif',
                color: '#fff',
                fontSize: 'clamp(24px, 7vw, 32px)',
                fontWeight: 300,
                lineHeight: 1.18,
                marginBottom: 12,
              }}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Professional{' '}
              <em style={{ fontWeight: 700, fontStyle: 'italic' }}>Chauffeurs</em>
              <br />At Your Fingertips
            </motion.h2>

            <motion.p
              style={{
                fontFamily: 'Inter, sans-serif',
                color: 'rgba(255,255,255,0.62)',
                fontSize: 14,
                lineHeight: 1.65,
                marginBottom: 24,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Download the Whiteline Chauffeur Hailing™ app to hail chauffeurs on demand in select cities.
            </motion.p>

            <motion.div
              className="flex gap-2"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ marginBottom: 32 }}
            >
              <StoreButton variant="apple" compact />
              <StoreButton variant="google" compact />
            </motion.div>

            <MotionImage
              src={appImg}
              alt="Whiteline app screens"
              placeholder="blur"
              initial={{ opacity: 0, x: 60 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: 'block',
                width: '110%',
                marginLeft: '-5%',
                objectFit: 'contain',
              }}
            />
          </div>
        </div>
      </div>

    </section>
  )
}


