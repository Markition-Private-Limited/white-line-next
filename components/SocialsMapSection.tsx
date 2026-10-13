'use client'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'

function useInViewOnce(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
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

export default function SocialsMapSection() {
  const { trans } = useLanguage()
  const { map } = trans.socialsPage
  const { ref: sectionRef, inView } = useInViewOnce()

  const fadeUp = (delay = 0): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
  })

  return (
    <section style={{ background: '#ffffff', padding: 'clamp(6px, 0.8vw, 10px)', paddingTop: 0 }}>
      <div
        ref={sectionRef}
        style={{
          borderRadius: 'clamp(14px, 1.5vw, 20px)',
          padding: 'clamp(32px, 5vw, 72px) clamp(24px, 5vw, 80px)',
          background: '#fff',
        }}
      >
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left: text */}
          <div style={fadeUp(0)}>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-[#5d8a7a]" />
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ fontFamily: 'Inter, sans-serif', color: '#5d8a7a' }}>
                {map.label}
              </p>
            </div>

            <h2 className="leading-tight text-[#0d0d14] mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(26px, 3.5vw, 46px)', fontWeight: 700 }}>
              {map.h1}
            </h2>
            <p className="mb-6 leading-tight text-[#0d0d14]" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(20px, 2.5vw, 34px)', fontWeight: 300, fontStyle: 'italic' }}>
              {map.h1b}
            </p>
            <p className="mb-8 text-[#0d0d14]/60 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(13px, 1.1vw, 15px)' }}>
              {map.sub}
            </p>

            {/* Address */}
            <div className="flex items-start gap-3" style={fadeUp(0.1)}>
              <div className="flex-shrink-0 mt-1">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2C7.24 2 5 4.24 5 7c0 4.25 5 11 5 11s5-6.75 5-11c0-2.76-2.24-5-5-5z" fill="#5d8a7a" />
                  <circle cx="10" cy="7" r="2" fill="white" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-[#0d0d14] mb-1" style={{ fontFamily: 'Inter, sans-serif', fontSize: 14 }}>
                  {map.address1}
                </p>
                <p className="text-[#0d0d14]/55 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', fontSize: 13 }}>
                  {map.address2}<br />
                  {map.address3}<br />
                  {map.address4}
                </p>
              </div>
            </div>
          </div>

          {/* Right: map */}
          <div
            style={{
              ...fadeUp(0.2),
              borderRadius: 'clamp(12px, 1.2vw, 18px)',
              overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
              border: '1px solid rgba(0,0,0,0.08)',
            }}
          >
            <iframe
              src="https://maps.google.com/maps?q=WHITE+LINE,+Secondary+No+4240,+Al+Murooj+District,+Riyadh+12282,+Saudi+Arabia&ll=24.7604507,46.672475&z=18&output=embed"
              width="100%"
              height="400"
              style={{ display: 'block', border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="White Line Office Location"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
