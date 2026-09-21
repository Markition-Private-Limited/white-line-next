'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import logoSvg from '../assets/fav_icon_black.svg'

type Shard = {
  width: string
  height: number
  top?: string
  right?: string
  bottom?: string
  left?: string
  rotate: number
  color: string
  delay: number
}

type Rail = {
  top?: string
  right?: string
  bottom?: string
  left?: string
  width: number
  rotate: number
  opacity: number
}

const shards: Shard[] = [
  {
    width: 'min(54vw, 520px)',
    height: 76,
    top: '18%',
    left: '-9%',
    rotate: -16,
    color: 'linear-gradient(90deg, transparent, rgba(0,92,102,0.14), rgba(255,255,255,0.18))',
    delay: 0.06,
  },
  {
    width: 'min(46vw, 460px)',
    height: 58,
    top: '23%',
    right: '-5%',
    rotate: 13,
    color: 'linear-gradient(90deg, rgba(194,159,92,0.18), rgba(255,255,255,0.24), transparent)',
    delay: 0.16,
  },
  {
    width: 'min(62vw, 680px)',
    height: 112,
    bottom: '14%',
    left: '-14%',
    rotate: 11,
    color: 'linear-gradient(90deg, transparent, rgba(16,17,22,0.055), rgba(0,92,102,0.10))',
    delay: 0.24,
  },
  {
    width: 'min(40vw, 420px)',
    height: 46,
    bottom: '23%',
    right: '8%',
    rotate: -21,
    color: 'linear-gradient(90deg, rgba(255,255,255,0.16), rgba(194,159,92,0.16), transparent)',
    delay: 0.34,
  },
] 

const rails: Rail[] = [
  { top: '10%', left: '7%', width: 180, rotate: -12, opacity: 0.2 },
  { top: '38%', right: '8%', width: 124, rotate: 18, opacity: 0.26 },
  { bottom: '12%', left: '18%', width: 220, rotate: 9, opacity: 0.16 },
  { bottom: '31%', right: '18%', width: 96, rotate: -28, opacity: 0.2 },
]

export default function PageLoader() {
  const [visible, setVisible] = useState(true)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const hide = () => setVisible(false)

    if (document.readyState === 'complete') {
      const t = setTimeout(hide, 1150)
      return () => clearTimeout(t)
    }

    window.addEventListener('load', hide)
    const fallback = setTimeout(hide, 4200)
    return () => {
      window.removeEventListener('load', hide)
      clearTimeout(fallback)
    }
  }, [])

  const exitDuration = prefersReducedMotion ? 0 : 0.85

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: exitDuration, ease: [0.76, 0, 0.24, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            background: '#ffffff',
            color: '#101116',
          }}
          aria-live="polite"
          aria-busy="true"
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: [
                'linear-gradient(180deg, #ffffff 0%, #f6f9f9 45%, #ffffff 100%)',
                'linear-gradient(132deg, rgba(0,92,102,0.11) 0%, transparent 31%, rgba(194,159,92,0.15) 64%, transparent 100%)',
                'repeating-linear-gradient(100deg, rgba(16,17,22,0.018) 0 1px, transparent 1px 18px)',
              ].join(', '),
            }}
          />

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              position: 'absolute',
              inset: 'clamp(14px, 3.2vw, 42px)',
              border: '1px solid rgba(16,17,22,0.09)',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.7)',
              pointerEvents: 'none',
            }}
          />

          <motion.div
            aria-hidden="true"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            style={{
              position: 'absolute',
              top: '9%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'min(92vw, 980px)',
              textAlign: 'center',
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
              fontSize: 'clamp(54px, 13vw, 156px)',
              fontWeight: 700,
              lineHeight: 0.9,
              color: 'transparent',
              WebkitTextStroke: '1px rgba(16,17,22,0.06)',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            WHITE LINE
          </motion.div>

          {shards.map((shard, index) => (
            <motion.div
              key={index}
              aria-hidden="true"
              initial={prefersReducedMotion ? false : { opacity: 0, x: index % 2 === 0 ? -80 : 80, scaleX: 0.82 }}
              animate={{ opacity: 1, x: 0, scaleX: 1 }}
              transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1], delay: shard.delay }}
              style={{
                position: 'absolute',
                width: shard.width,
                height: shard.height,
                top: shard.top,
                right: shard.right,
                bottom: shard.bottom,
                left: shard.left,
                transform: `rotate(${shard.rotate}deg)`,
                transformOrigin: 'center',
                background: shard.color,
                border: '1px solid rgba(255,255,255,0.58)',
                boxShadow: '0 22px 70px rgba(16,17,22,0.06)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
              }}
            />
          ))}

          {rails.map((rail, index) => (
            <motion.div
              key={index}
              aria-hidden="true"
              initial={prefersReducedMotion ? false : { scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: rail.opacity }}
              transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1], delay: 0.18 + index * 0.08 }}
              style={{
                position: 'absolute',
                top: rail.top,
                right: rail.right,
                bottom: rail.bottom,
                left: rail.left,
                width: rail.width,
                height: 2,
                transform: `rotate(${rail.rotate}deg)`,
                transformOrigin: 'left',
                background: 'linear-gradient(90deg, transparent, #005C66, #c29f5c, transparent)',
              }}
            />
          ))}

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
            style={{
              position: 'relative',
              display: 'flex',
              width: 'min(88vw, 620px)',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 28,
              padding: '0 22px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: 'clamp(166px, 30vw, 250px)',
                height: 'clamp(166px, 30vw, 250px)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <motion.span
                aria-hidden="true"
                animate={prefersReducedMotion ? undefined : { rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  border: '1px solid transparent',
                  borderTopColor: 'rgba(0,92,102,0.34)',
                  borderLeftColor: 'rgba(194,159,92,0.28)',
                }}
              />
              <motion.span
                aria-hidden="true"
                animate={prefersReducedMotion ? undefined : { rotate: -360 }}
                transition={{ duration: 5.8, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  inset: '13%',
                  borderRadius: '50%',
                  border: '1px solid transparent',
                  borderRightColor: 'rgba(16,17,22,0.14)',
                  borderBottomColor: 'rgba(0,92,102,0.28)',
                }}
              />
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.78, rotate: -8 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1.08, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                style={{
                  position: 'relative',
                  display: 'grid',
                  width: 'clamp(118px, 21vw, 172px)',
                  height: 'clamp(118px, 21vw, 172px)',
                  placeItems: 'center',
                  borderRadius: '50%',
                  background: 'linear-gradient(150deg, rgba(255,255,255,0.98), rgba(247,249,248,0.9))',
                  border: '1px solid rgba(16,17,22,0.10)',
                  boxShadow: '0 36px 95px rgba(16,17,22,0.16), inset 0 1px 0 rgba(255,255,255,0.95)',
                  overflow: 'hidden',
                }}
              >
                <motion.span
                  aria-hidden="true"
                  initial={prefersReducedMotion ? false : { x: '-160%' }}
                  animate={prefersReducedMotion ? { x: 0 } : { x: '160%' }}
                  transition={{ duration: 1.7, repeat: Infinity, repeatDelay: 0.55, ease: [0.76, 0, 0.24, 1] }}
                  style={{
                    position: 'absolute',
                    inset: '-18% auto -18% 0',
                    width: '42%',
                    transform: 'skewX(-18deg)',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.75), transparent)',
                  }}
                />
                <Image
                  src={logoSvg}
                  alt="White Line"
                  width={68}
                  height={72}
                  priority
                  style={{
                    position: 'relative',
                    width: 'clamp(52px, 9.5vw, 78px)',
                    height: 'auto',
                    display: 'block',
                  }}
                />
              </motion.div>
            </div>

            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.34 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontSize: 'clamp(31px, 7.4vw, 62px)',
                  fontWeight: 700,
                  color: '#101116',
                  lineHeight: 0.95,
                }}
              >
                White Line
              </span>
              <span
                style={{
                  width: 'min(76vw, 390px)',
                  fontFamily: 'var(--font-inter), Inter, sans-serif',
                  fontSize: 'clamp(13px, 2.5vw, 16px)',
                  fontWeight: 500,
                  color: 'rgba(16,17,22,0.54)',
                  lineHeight: 1.55,
                }}
              >
                Preparing your premium chauffeur experience
              </span>
            </motion.div>

            <div
              style={{
                position: 'relative',
                width: 'min(82vw, 430px)',
                height: 8,
                overflow: 'hidden',
                background: 'rgba(16,17,22,0.075)',
                border: '1px solid rgba(16,17,22,0.08)',
                boxShadow: '0 16px 40px rgba(16,17,22,0.08)',
              }}
            >
              <motion.div
                initial={{ x: '-96%' }}
                animate={prefersReducedMotion ? { x: 0 } : { x: '96%' }}
                transition={{ duration: 1.45, ease: [0.76, 0, 0.24, 1], repeat: Infinity, repeatDelay: 0.16 }}
                style={{
                  width: '72%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, #005C66 24%, #101116 50%, #c29f5c 77%, transparent)',
                }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? false : { scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.25, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.34 }}
            style={{
              position: 'absolute',
              bottom: 'clamp(14px, 3.2vw, 42px)',
              left: 'clamp(14px, 3.2vw, 42px)',
              right: 'clamp(14px, 3.2vw, 42px)',
              height: 1,
              transformOrigin: 'center',
              background: 'linear-gradient(90deg, transparent, rgba(0,92,102,0.34), rgba(194,159,92,0.30), transparent)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
