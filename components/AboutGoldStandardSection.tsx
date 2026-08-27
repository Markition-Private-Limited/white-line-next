'use client'
import { useEffect, useRef, useState } from 'react'
import { Car, ShieldCheck, Users } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import favIcon from '../assets/fav_icon_black.svg'

const CARD_ICONS = [
  <Users size={22} strokeWidth={1.6} />,
  <Car size={22} strokeWidth={1.6} />,
  <ShieldCheck size={22} strokeWidth={1.6} />,
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
  const { trans } = useLanguage()
  const { goldStandard: gs } = trans.about
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
      <div className="text-center px-6 mb-14">
        <div className="flex items-center justify-center gap-3 mb-6" style={fadeUp(0)}>
          <span className="block h-px w-8" style={{ background: '#005C66' }} />
          <span className="text-xs tracking-[0.22em] uppercase font-medium" style={{ fontFamily: 'Inter, sans-serif', color: '#005C66' }}>
            {gs.label}
          </span>
        </div>
        <h2
          className="text-[#111118] leading-tight mb-5"
          style={{ ...fadeUp(0.1), fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(28px, 4.5vw, 50px)' }}
        >
          <span style={{ fontWeight: 300 }}>{gs.h1} </span>
          <span style={{ fontWeight: 800, fontStyle: 'italic' }}>{gs.h2}</span>
        </h2>
        <p
          className="mx-auto leading-relaxed"
          style={{ ...fadeUp(0.2), fontFamily: 'Inter, sans-serif', fontSize: 'clamp(13px, 1.4vw, 15px)', color: '#828282', maxWidth: '620px' }}
        >
          {gs.sub}
        </p>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5" style={{ maxWidth: '1200px' }}>
        {gs.cards.map((card, i) => (
          <div
            key={i}
            style={{
              ...fadeUp(0.15 + i * 0.12),
              position: 'relative', overflow: 'hidden',
              background: '#f5f5f7', borderRadius: '20px',
              padding: '32px 28px 36px',
              display: 'flex', flexDirection: 'column', gap: '20px',
            }}
          >
            <img
              src={(favIcon as any).src ?? favIcon}
              aria-hidden="true"
              style={{ position: 'absolute', bottom: '-12%', right: '-8%', width: '38%', opacity: 0.055, pointerEvents: 'none', userSelect: 'none' }}
            />
            <div style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(0, 92, 102, 0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#005C66', flexShrink: 0 }}>
              {CARD_ICONS[i]}
            </div>
            <div>
              <p className="font-bold text-[#111118] mb-3" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(15px, 1.5vw, 18px)' }}>
                {card.title}
              </p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(12px, 1.2vw, 14px)', color: '#828282', lineHeight: 1.65 }}>
                {card.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
