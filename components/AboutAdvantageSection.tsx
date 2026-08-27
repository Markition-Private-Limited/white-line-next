'use client'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import img1 from '../assets/about_us/advantage.jpg'
import img2 from '../assets/about_us/advantage_2.jpg'
import img3 from '../assets/about_us/advantage_3.jpg'

const RADIUS = 'clamp(12px, 1.4vw, 18px)'

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

function useParallax(strength = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const center = rect.top + rect.height / 2 - window.innerHeight / 2
      setOffset(center * strength)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [strength])
  return { ref, offset }
}

function ParallaxImage({ src, alt, offset, objectPosition = 'center' }: { src: string; alt: string; offset: number; objectPosition?: string }) {
  return (
    <img
      src={src} alt={alt} draggable={false}
      style={{
        position: 'absolute', width: '100%', height: '130%', top: '-15%',
        objectFit: 'cover', objectPosition,
        transform: `translateY(${offset}px)`,
        transition: 'transform 0.1s linear', willChange: 'transform', display: 'block',
      }}
    />
  )
}

function CellOverlay({ title, desc }: { title: string; desc: string }) {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.35) 45%, transparent 100%)', borderRadius: 'inherit' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(16px, 2.5vw, 28px)' }}>
        <p className="font-bold text-white mb-1.5" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(14px, 1.5vw, 18px)' }}>
          {title}
        </p>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(11px, 1.1vw, 13px)', color: 'rgba(255,255,255,0.70)', lineHeight: 1.55 }}>
          {desc}
        </p>
      </div>
    </>
  )
}

export default function AboutAdvantageSection() {
  const { trans } = useLanguage()
  const { advantage } = trans.about
  const { ref: sectionRef, inView } = useInView(0.08)

  const p1 = useParallax(0.14)
  const p2 = useParallax(0.12)
  const p3 = useParallax(0.16)

  const fadeUp = (delay = 0): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(36px)',
    transition: `opacity 0.85s ease ${delay}s, transform 0.85s ease ${delay}s`,
  })

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="w-full bg-white"
      style={{ paddingTop: '96px', paddingBottom: '96px' }}
    >
      <div className="text-center px-6 mb-12">
        <div className="flex items-center justify-center gap-3 mb-6" style={fadeUp(0)}>
          <span className="block h-px w-8" style={{ background: '#005C66' }} />
          <span className="text-xs tracking-[0.22em] uppercase font-medium" style={{ fontFamily: 'Inter, sans-serif', color: '#005C66' }}>
            {advantage.label}
          </span>
        </div>
        <h2
          className="text-[#111118] leading-tight mb-5"
          style={{ ...fadeUp(0.1), fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(28px, 4.5vw, 50px)' }}
        >
          <span style={{ fontWeight: 300 }}>{advantage.h1} </span>
          <span style={{ fontWeight: 800, fontStyle: 'italic' }}>{advantage.h2}</span>
        </h2>
        <p
          className="mx-auto leading-relaxed"
          style={{ ...fadeUp(0.2), fontFamily: 'Inter, sans-serif', fontSize: 'clamp(13px, 1.4vw, 15px)', color: '#828282', maxWidth: '680px' }}
        >
          {advantage.sub}
        </p>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-10" style={{ maxWidth: '1320px', ...fadeUp(0.3) }}>
        <div className="flex flex-col lg:flex-row" style={{ gap: 'clamp(8px, 1vw, 14px)', height: 'auto' }}>
          <div ref={p1.ref} className="relative overflow-hidden flex-shrink-0 w-full lg:w-[55%]" style={{ borderRadius: RADIUS, height: 'clamp(240px, 42vw, 520px)' }}>
            <ParallaxImage src={(img1 as any).src ?? img1} alt={advantage.cells[0].title} offset={p1.offset} objectPosition="center top" />
            <CellOverlay title={advantage.cells[0].title} desc={advantage.cells[0].desc} />
          </div>
          <div className="flex flex-col flex-1" style={{ gap: 'clamp(8px, 1vw, 14px)' }}>
            <div ref={p2.ref} className="relative overflow-hidden" style={{ borderRadius: RADIUS, flex: 1, minHeight: 'clamp(130px, 20vw, 250px)' }}>
              <ParallaxImage src={(img2 as any).src ?? img2} alt={advantage.cells[1].title} offset={p2.offset} objectPosition="center 20%" />
              <CellOverlay title={advantage.cells[1].title} desc={advantage.cells[1].desc} />
            </div>
            <div ref={p3.ref} className="relative overflow-hidden" style={{ borderRadius: RADIUS, flex: 1, minHeight: 'clamp(130px, 20vw, 250px)' }}>
              <ParallaxImage src={(img3 as any).src ?? img3} alt={advantage.cells[2].title} offset={p3.offset} />
              <CellOverlay title={advantage.cells[2].title} desc={advantage.cells[2].desc} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
