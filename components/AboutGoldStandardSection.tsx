'use client'
import { useEffect, useRef, useState } from 'react'
import { Car, ShieldCheck, Users } from 'lucide-react'
import favIcon from '../assets/fav_icon_black.svg'

const cards = [
  {
    icon: <Users size={22} strokeWidth={1.6} />,
    title: 'Elite Professionals',
    desc: 'Rigorously vetted chauffeurs trained in executive etiquette and absolute confidentiality.',
  },
  {
    icon: <Car size={22} strokeWidth={1.6} />,
    title: 'Pristine Vehicles',
    desc: 'Meticulously maintained luxury sedans engineered for supreme comfort and safety.',
  },
  {
    icon: <ShieldCheck size={22} strokeWidth={1.6} />,
    title: 'Total Privacy',
    desc: 'Secure operational workflows ensuring complete discretion for dignitaries and leaders.',
  },
]

function useInView(threshold = 0.1) {
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

export default function AboutGoldStandardSection() {
  const { ref, inView } = useInView(0.08)

  const fadeUp = (delay = 0): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(32px)',
    transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
  })

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="w-full bg-white"
      style={{ paddingTop: '96px', paddingBottom: '96px' }}
    >
      {/* ── Heading ─────────────────────────────────────────────────────────── */}
      <div className="text-center px-6 mb-14">
        <div className="flex items-center justify-center gap-3 mb-6" style={fadeUp(0)}>
          <span className="block h-px w-8" style={{ background: '#005C66' }} />
          <span
            className="text-xs tracking-[0.22em] uppercase font-medium"
            style={{ fontFamily: 'Inter, sans-serif', color: '#005C66' }}
          >
            The Gold Standard
          </span>
        </div>

        <h2
          className="text-[#111118] leading-tight mb-5"
          style={{
            ...fadeUp(0.1),
            fontFamily: 'Montserrat, sans-serif',
            fontSize: 'clamp(28px, 4.5vw, 50px)',
          }}
        >
          <span style={{ fontWeight: 300 }}>Why Leaders Choose </span>
          <span style={{ fontWeight: 800, fontStyle: 'italic' }}>WhiteLine</span>
        </h2>

        <p
          className="mx-auto leading-relaxed"
          style={{
            ...fadeUp(0.2),
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(13px, 1.4vw, 15px)',
            color: '#828282',
            maxWidth: '620px',
          }}
        >
          Built on an uncompromising foundation of luxury, safety, and discretion, our service is
          tailored to meet the exacting standards of the Kingdom's elite.
        </p>
      </div>

      {/* ── Cards ───────────────────────────────────────────────────────────── */}
      <div
        className="mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5"
        style={{ maxWidth: '1200px' }}
      >
        {cards.map((card, i) => (
          <div
            key={card.title}
            style={{
              ...fadeUp(0.15 + i * 0.12),
              position: 'relative',
              overflow: 'hidden',
              background: '#f5f5f7',
              borderRadius: '20px',
              padding: '32px 28px 36px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            {/* Favicon watermark — bottom-right, very subtle */}
            <img
              src={(favIcon as any).src ?? favIcon}
              aria-hidden="true"
              style={{
                position: 'absolute',
                bottom: '-12%',
                right: '-8%',
                width: '38%',
                opacity: 0.055,
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            />

            {/* Icon badge */}
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 12,
                background: 'rgba(0, 92, 102, 0.10)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#005C66',
                flexShrink: 0,
              }}
            >
              {card.icon}
            </div>

            {/* Text */}
            <div>
              <p
                className="font-bold text-[#111118] mb-3"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: 'clamp(15px, 1.5vw, 18px)',
                }}
              >
                {card.title}
              </p>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 'clamp(12px, 1.2vw, 14px)',
                  color: '#828282',
                  lineHeight: 1.65,
                }}
              >
                {card.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}


