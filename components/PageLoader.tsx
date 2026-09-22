'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

const MINIMUM_VISIBLE_MS = 2200
const FALLBACK_VISIBLE_MS = 6500

export default function PageLoader() {
  const [visible, setVisible] = useState(true)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const startedAt = performance.now()
    let hideTimer: ReturnType<typeof setTimeout> | undefined

    const hide = () => setVisible(false)
    const scheduleHide = () => {
      const elapsed = performance.now() - startedAt
      hideTimer = setTimeout(hide, Math.max(0, MINIMUM_VISIBLE_MS - elapsed))
    }

    if (document.readyState === 'complete') {
      scheduleHide()
    } else {
      window.addEventListener('load', scheduleHide, { once: true })
    }

    const fallbackTimer = setTimeout(hide, FALLBACK_VISIBLE_MS)

    return () => {
      window.removeEventListener('load', scheduleHide)
      clearTimeout(fallbackTimer)
      if (hideTimer) clearTimeout(hideTimer)
    }
  }, [])

  const carAnimation = prefersReducedMotion
    ? { x: 'calc(50vw - 50%)', scaleX: 1 }
    : { x: ['-36vw', '100vw', '100vw', '-36vw'], scaleX: [1, 1, -1, -1] }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.45, ease: [0.76, 0, 0.24, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            overflow: 'hidden',
            background: '#070708',
          }}
          role="status"
          aria-label="Loading page"
          aria-live="polite"
          aria-busy="true"
        >
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: [
                'linear-gradient(180deg, rgba(28,31,34,0.94) 0%, rgba(8,9,10,0.98) 42%, rgba(5,5,6,1) 100%)',
                'radial-gradient(circle at 18% 28%, rgba(247,188,92,0.22) 0%, transparent 24%)',
                'radial-gradient(circle at 86% 72%, rgba(126,179,150,0.18) 0%, transparent 28%)',
                'linear-gradient(90deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 20%)',
                'linear-gradient(0deg, rgba(255,255,255,0.028) 0 1px, transparent 1px 18%)',
              ].join(', '),
              backgroundSize: '100% 100%, 100% 100%, 100% 100%, 112px 112px, 96px 96px',
            }}
          />

          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: 'clamp(150px, 31vh, 250px)',
              transform: 'translateY(-50%)',
              background: [
                'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.045) 7%, transparent 18%, transparent 82%, rgba(255,255,255,0.04) 93%, transparent 100%)',
                'repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0 1px, transparent 1px 150px)',
                'linear-gradient(180deg, rgba(14,15,17,0.1), rgba(0,0,0,0.5))',
              ].join(', '),
              boxShadow: '0 -60px 140px rgba(255,255,255,0.035), 0 60px 140px rgba(0,0,0,0.7)',
            }}
          />

          <motion.div
            aria-hidden="true"
            initial={{ x: '-36vw', scaleX: 1 }}
            animate={carAnimation}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : {
                    duration: 3.4,
                    ease: 'easeInOut',
                    repeat: Infinity,
                    repeatType: 'loop',
                    times: [0, 0.46, 0.54, 1],
                  }
            }
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              width: 'clamp(86px, 13vw, 138px)',
              y: '-50%',
              filter: 'drop-shadow(0 18px 24px rgba(0,0,0,0.58))',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '50%',
                right: '50%',
                zIndex: 0,
                width: '140vw',
                height: 6,
                transform: 'translateY(-50%)',
                background: '#ffffff',
                boxShadow: '0 0 24px rgba(255,255,255,0.5)',
              }}
            />
            <Image
              src="/loader-car-pngwing.png"
              alt=""
              width={516}
              height={1070}
              priority
              sizes="(max-width: 640px) 86px, 13vw"
              style={{
                position: 'relative',
                zIndex: 1,
                display: 'block',
                width: '100%',
                height: 'auto',
                transform: 'rotate(90deg)',
                transformOrigin: 'center',
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
