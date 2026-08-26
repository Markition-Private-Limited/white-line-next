'use client'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

const FIELDS = [
  { label: 'FROM', value: 'King Shaka International Airport' },
  { label: 'TO', value: 'Umhlanga Rocks' },
  { label: 'PASSENGERS', value: '3 Adults, 2 Bags' },
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-10% 0px' },
  transition: { duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] as const },
})

export default function CustomerSupportActiveTripSection() {
  return (
    <section className="w-full bg-white" style={{ padding: 'clamp(32px, 5vw, 64px) clamp(24px, 5vw, 64px)' }}>
      <div
        className="w-full mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-8"
        style={{
          background: '#0c2626',
          borderRadius: 'clamp(16px, 1.8vw, 24px)',
          padding: 'clamp(36px, 6vw, 64px)',
          maxWidth: '100%',
        }}
      >
        {/* Left: copy */}
        <div className="flex-1 flex flex-col items-start">
          {/* Label */}
          <motion.div {...fadeUp(0)} className="flex items-center gap-3 mb-6">
            <span className="block h-px w-8" style={{ background: '#4a9e9e' }} />
            <span
              className="text-xs tracking-[0.22em] uppercase font-medium"
              style={{ fontFamily: 'Inter, sans-serif', color: '#4a9e9e' }}
            >
              Active Trip Support
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            {...fadeUp(0.08)}
            className="mb-6 leading-tight text-white"
            style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(30px, 4vw, 52px)' }}
          >
            <span style={{ fontWeight: 300 }}>On The Road?</span>
            <br />
            <span style={{ fontWeight: 800, fontStyle: 'italic' }}>{"We've Got You."}</span>
          </motion.h2>

          {/* Body */}
          <motion.p
            {...fadeUp(0.16)}
            className="mb-10 leading-relaxed"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(13px, 1.2vw, 15px)',
              color: 'rgba(255,255,255,0.55)',
              maxWidth: 440,
            }}
          >
            Whether matching a fleeting slot, looking up route variants, or speaking with
            active drivers, our system remains synchronized.
          </motion.p>

          {/* CTA */}
          <motion.div {...fadeUp(0.24)}>
            <button
              className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full text-sm font-medium"
              style={{
                fontFamily: 'Inter, sans-serif',
                background: '#ffffff',
                color: '#0c2626',
                minWidth: 180,
              }}
            >
              <div className="inline-flex h-12 translate-y-0 items-center justify-center gap-2 px-6 transition duration-500 group-hover:-translate-y-[150%] text-[#0c2626]">
                Contact Dispatch <ChevronRight size={14} />
              </div>
              <div className="absolute inline-flex h-12 w-full translate-y-[100%] items-center justify-center gap-2 text-white transition duration-500 group-hover:translate-y-0">
                <span className="absolute h-full w-full translate-y-full skew-y-12 scale-y-0 bg-[#3ab0bc] transition duration-500 group-hover:translate-y-0 group-hover:scale-150" />
                <span className="z-10 inline-flex items-center gap-2">Contact Dispatch <ChevronRight size={14} /></span>
              </div>
            </button>
          </motion.div>
        </div>

        {/* Right: Create Journey card */}
        <motion.div
          {...fadeUp(0.12)}
          className="w-full lg:w-[46%] flex-shrink-0 flex flex-col"
          style={{
            background: '#1d3e3e',
            borderRadius: 16,
            padding: 'clamp(22px, 3vw, 32px)',
          }}
        >
          {/* Card header */}
          <div className="flex items-center justify-between" style={{ paddingBottom: 18, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <span
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(15px, 1.4vw, 17px)',
                color: '#ffffff',
              }}
            >
              Create Journey
            </span>
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 13,
                color: 'rgba(255,255,255,0.38)',
              }}
            >
              Active Map
            </span>
          </div>

          {/* Fields */}
          <div className="flex flex-col gap-3 mt-5 mb-5">
            {FIELDS.map(({ label, value }) => (
              <div
                key={label}
                className="flex flex-col"
                style={{
                  background: '#29494D',
                  borderRadius: 10,
                  padding: '13px 18px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: '0.16em',
                    color: 'rgba(255,255,255,0.38)',
                    marginBottom: 6,
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 'clamp(13px, 1.1vw, 15px)',
                    fontWeight: 400,
                    color: 'rgba(255,255,255,0.9)',
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              className="flex-1 rounded-full text-white text-sm font-semibold transition-colors hover:bg-white/10 text-center"
              style={{
                fontFamily: 'Inter, sans-serif',
                border: '1px solid rgba(255,255,255,0.22)',
                padding: '14px 20px',
                background: 'transparent',
              }}
            >
              Check Rates
            </button>
            <button
              className="flex-1 rounded-full text-sm font-semibold transition-opacity hover:opacity-90 text-center"
              style={{
                fontFamily: 'Inter, sans-serif',
                background: '#ffffff',
                color: '#0c2424',
                padding: '14px 20px',
              }}
            >
              Book Support
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
