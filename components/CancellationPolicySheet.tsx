'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#005C66" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

export default function CancellationPolicySheet({ open, onGotIt }: { open: boolean; onGotIt: () => void }) {
  const { trans, dir } = useLanguage()
  const c = trans.cancellationPolicy
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const cardVariants = isMobile
    ? { hidden: { y: '100%', opacity: 1 }, visible: { y: 0, opacity: 1 }, exit: { y: '100%', opacity: 1 } }
    : { hidden: { scale: 0.94, opacity: 0 }, visible: { scale: 1, opacity: 1 }, exit: { scale: 0.94, opacity: 0 } }

  const cardTransition = isMobile
    ? { type: 'spring' as const, damping: 32, stiffness: 300 }
    : { duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] as const }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="policy-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onGotIt}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1200,
            background: 'rgba(0,0,0,0.62)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: isMobile ? 'flex-end' : 'center',
            justifyContent: 'center',
            padding: isMobile ? 0 : 24,
          }}
        >
          <motion.div
            key="policy-card"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={cardTransition}
            dir={dir}
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: isMobile ? '100%' : 480,
              background: '#fff',
              borderRadius: isMobile ? '24px 24px 0 0' : 24,
              overflow: 'hidden',
              boxShadow: '0 32px 80px rgba(0,0,0,0.22), 0 8px 24px rgba(0,0,0,0.1)',
            }}
          >
            {/* Teal accent bar */}
            <div style={{ height: 4, background: 'linear-gradient(90deg, #005C66 0%, #00838f 100%)' }} />

            <div style={{ padding: '28px 28px 32px' }}>
              {/* Drag handle (mobile only) */}
              {isMobile && (
                <div style={{ width: 36, height: 4, borderRadius: 99, background: '#e5e7eb', margin: '0 auto 20px' }} />
              )}

              {/* Header */}
              <div style={{ marginBottom: 6 }}>
                <span style={{
                  display: 'inline-block',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#005C66',
                  marginBottom: 6,
                }}>
                  White Line
                </span>
                <h2 style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 700,
                  fontSize: 22,
                  color: '#111118',
                  margin: 0,
                  lineHeight: 1.2,
                }}>
                  {c.title}
                </h2>
              </div>

              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 13,
                color: '#9ca3af',
                lineHeight: 1.65,
                margin: '10px 0 24px',
              }}>
                {c.intro}
              </p>

              {/* Divider */}
              <div style={{ height: 1, background: '#f3f4f6', marginBottom: 20 }} />

              {/* Tiers */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {c.tiers.map((tier, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    <div style={{
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      background: 'rgba(0,92,102,0.08)',
                      border: '1px solid rgba(0,92,102,0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <ClockIcon />
                    </div>
                    <div style={{ paddingTop: 2 }}>
                      <p style={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        fontSize: 13.5,
                        color: '#111118',
                        margin: '0 0 2px',
                        lineHeight: 1.3,
                      }}>
                        {tier.heading}
                      </p>
                      <p style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: 12.5,
                        color: '#6b7280',
                        margin: 0,
                        lineHeight: 1.45,
                      }}>
                        {tier.sub}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Got it button */}
              <button
                type="button"
                onClick={onGotIt}
                style={{
                  marginTop: 28,
                  width: '100%',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: 15,
                  color: '#fff',
                  background: '#005C66',
                  border: 'none',
                  borderRadius: 12,
                  padding: '14px 0',
                  cursor: 'pointer',
                  letterSpacing: '0.01em',
                  boxShadow: '0 4px 14px rgba(0,92,102,0.3)',
                  transition: 'background 0.15s ease, box-shadow 0.15s ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#004d56'
                  ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 18px rgba(0,92,102,0.4)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#005C66'
                  ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 14px rgba(0,92,102,0.3)'
                }}
              >
                {c.gotIt}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
