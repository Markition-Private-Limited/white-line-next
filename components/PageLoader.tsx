'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'

const MINIMUM_VISIBLE_MS = 2200
const FALLBACK_VISIBLE_MS = 6500

// Streaks are distributed across the road band centred on the horizon
const STREAKS = [
  { top: '10%', width: 105, duration: '2.65s', delay: '-1.20s' },
  { top: '20%', width: 62,  duration: '2.15s', delay: '-.35s'  },
  { top: '30%', width: 145, duration: '3.05s', delay: '-2.10s' },
  { top: '40%', width: 84,  duration: '2.40s', delay: '-1.45s' },
  { top: '50%', width: 175, duration: '3.25s', delay: '-2.75s' },
  { top: '60%', width: 70,  duration: '2.30s', delay: '-.80s'  },
  { top: '70%', width: 128, duration: '2.90s', delay: '-1.90s' },
  { top: '78%', width: 52,  duration: '2.05s', delay: '-.55s'  },
  { top: '86%', width: 155, duration: '3.15s', delay: '-2.40s' },
  { top: '93%', width: 92,  duration: '2.50s', delay: '-1.15s' },
]

const FAINT_STREAKS = [
  { top: '15%', delay: '-.80s'  },
  { top: '38%', delay: '-1.35s' },
  { top: '62%', delay: '-.25s'  },
  { top: '82%', delay: '-1.65s' },
]

export default function PageLoader() {
  const [visible, setVisible] = useState(true)
  const prefersReducedMotion = useReducedMotion()
  const { trans, dir } = useLanguage()
  const isRtl = dir === 'rtl'

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

  // Streaks always travel LTR (road surface direction independent of car)
  const streakKeyframe = isRtl
    ? `@keyframes wlStreak{0%{transform:translateX(0);opacity:0}9%{opacity:.46}74%{opacity:.30}100%{transform:translateX(calc(-100vw - 450px));opacity:0}}`
    : `@keyframes wlStreak{0%{transform:translateX(0);opacity:0}9%{opacity:.46}74%{opacity:.30}100%{transform:translateX(calc(100vw + 450px));opacity:0}}`

  const faintKeyframe = isRtl
    ? `@keyframes wlFaint{from{transform:translateX(0);opacity:0}12%{opacity:.32}80%{opacity:.20}to{transform:translateX(calc(-100vw - 350px));opacity:0}}`
    : `@keyframes wlFaint{from{transform:translateX(0);opacity:0}12%{opacity:.32}80%{opacity:.20}to{transform:translateX(calc(100vw + 350px));opacity:0}}`

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
            background: 'linear-gradient(180deg,#111314 0%,#0a0b0c 42%,#050606 67%,#020202 100%)',
            direction: dir,
          }}
          role="status"
          aria-label="Loading page"
          aria-live="polite"
          aria-busy="true"
        >
          <style>{`
            ${streakKeyframe}
            ${faintKeyframe}
            @keyframes wlContact{0%,100%{opacity:.10}10%,82%{opacity:.42}}
            @keyframes wlProgress{0%{transform:translateX(-520%)}55%{transform:translateX(270%)}100%{transform:translateX(570%)}}
          `}</style>

          {/* Environment */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: [
                'linear-gradient(180deg,rgba(255,255,255,.012),transparent 38%)',
                'radial-gradient(ellipse at 50% 45%,rgba(255,255,255,.018),transparent 52%)',
              ].join(', '),
            }}
          />

          {/* Horizon glow */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: '50%',
              height: 1,
              background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.055) 18%,rgba(255,255,255,.09) 50%,rgba(255,255,255,.055) 82%,transparent)',
              opacity: 0.65,
            }}
          />

          {/* Road band — centred on the horizon so streaks sit around the car */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: '44%',
              height: '56%',
              overflow: 'hidden',
              background: 'linear-gradient(180deg,rgba(255,255,255,.012) 0%,rgba(255,255,255,.005) 18%,rgba(0,0,0,.12) 100%)',
            }}
          >
            {/* Top edge highlight */}
            <div style={{
              position: 'absolute',
              left: 0, right: 0, top: 0, height: 1,
              background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.07) 20%,rgba(255,255,255,.12) 50%,rgba(255,255,255,.07) 80%,transparent)',
            }} />

            {/* Speed streaks centred on the road */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
              {STREAKS.map((s, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    [isRtl ? 'right' : 'left']: -220,
                    top: s.top,
                    height: 1,
                    width: s.width,
                    borderRadius: 999,
                    background: 'linear-gradient(90deg,transparent 0%,rgba(255,255,255,.08) 8%,rgba(255,255,255,.30) 52%,rgba(255,255,255,.08) 88%,transparent 100%)',
                    boxShadow: '0 0 6px rgba(255,255,255,.025)',
                    animation: prefersReducedMotion ? 'none' : `wlStreak ${s.duration} linear ${s.delay} infinite`,
                  } as React.CSSProperties}
                />
              ))}
              {FAINT_STREAKS.map((s, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    [isRtl ? 'right' : 'left']: -180,
                    top: s.top,
                    height: 1,
                    width: 48,
                    background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.14),transparent)',
                    animation: prefersReducedMotion ? 'none' : `wlFaint 2s linear ${s.delay} infinite`,
                  } as React.CSSProperties}
                />
              ))}
            </div>
          </div>

          {/* Car — rides the horizon */}
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
              zIndex: 10,
              filter: 'drop-shadow(0 12px 15px rgba(0,0,0,.82)) drop-shadow(0 0 2px rgba(255,255,255,.08))',
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: '13%',
                right: '10%',
                bottom: 0,
                height: 9,
                borderRadius: '50%',
                background: 'radial-gradient(ellipse,rgba(255,255,255,.12),rgba(255,255,255,.035) 38%,transparent 72%)',
                filter: 'blur(4px)',
                zIndex: -1,
                animation: prefersReducedMotion ? 'none' : 'wlContact 3.4s linear infinite',
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

          {/* Loading label + progress bar */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: '50%',
              bottom: '8%',
              transform: 'translateX(-50%)',
              width: 'min(390px, 40vw)',
              textAlign: 'center',
              zIndex: 20,
            }}
          >
            <p style={{
              margin: '0 0 12px',
              color: 'rgba(255,255,255,.45)',
              font: '500 9px/1 Arial, sans-serif',
              letterSpacing: isRtl ? '.12em' : '.46em',
              textTransform: isRtl ? 'none' : 'uppercase',
              whiteSpace: 'nowrap',
              fontFamily: isRtl ? 'Arial, sans-serif' : 'Arial, sans-serif',
            }}>
              {trans.loader.label}
            </p>
            <div style={{
              width: '100%',
              height: 1,
              background: 'rgba(255,255,255,.09)',
              overflow: 'hidden',
            }}>
              <span style={{
                display: 'block',
                width: '23%',
                height: '100%',
                background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.55),#fff)',
                boxShadow: '0 0 9px rgba(255,255,255,.22)',
                animation: prefersReducedMotion ? 'none' : 'wlProgress 1.8s cubic-bezier(.4,0,.2,1) infinite',
              }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
