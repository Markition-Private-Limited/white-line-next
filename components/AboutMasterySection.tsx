'use client'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import masteryImg from '../assets/about_us/about_us_mastery.jpg'

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

function useIsMobile() {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return mobile
}

export default function AboutMasterySection() {
  const { trans, dir } = useLanguage()
  const isRtl = dir === 'rtl'
  const { mastery } = trans.about
  const { ref: sectionRef, inView } = useInView(0.08)
  const isMobile = useIsMobile()

  const headingAreaRef = useRef<HTMLDivElement>(null)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = headingAreaRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setMouse({ x: (e.clientX - rect.left) / rect.width - 0.5, y: (e.clientY - rect.top) / rect.height - 0.5 })
  }
  const handleMouseLeave = () => setMouse({ x: 0, y: 0 })

  const containerRef = useRef<HTMLDivElement>(null)
  const [imgOffset, setImgOffset] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const center = rect.top + rect.height / 2 - window.innerHeight / 2
      setImgOffset(center * 0.16)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const fadeUp = (delay = 0): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(36px)',
    transition: `opacity 0.85s ease ${delay}s, transform 0.85s ease ${delay}s`,
  })

  const imgSrc = (masteryImg as any).src ?? masteryImg

  const CardList = ({ withFade = true }: { withFade?: boolean }) =>
    mastery.cards.map((card, i) => (
      <div
        key={i}
        className="mastery-card"
        style={{
          ...(withFade ? fadeUp(0.2 + i * 0.13) : {}),
          background: 'linear-gradient(110.72deg, rgba(255,255,255,0.552) 1.21%, rgba(196,196,196,0.092) 100%)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          padding: '30px 20px',
          minHeight: '153px',
          maxWidth: '605px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <p className="font-semibold text-white" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(13px, 1.4vw, 16px)' }}>
          {card.title}
        </p>
        <p className="leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(11px, 1.1vw, 13px)', color: 'rgba(255,255,255,0.72)' }}>
          {card.desc}
        </p>
      </div>
    ))

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="w-full bg-white"
      style={{ paddingBottom: '96px' }}
    >
      {/* Heading */}
      <div
        ref={headingAreaRef}
        className="text-center px-6"
        style={{ paddingTop: '96px', paddingBottom: '56px' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex items-center justify-center gap-3 mb-6" style={fadeUp(0)}>
          <span className="block h-px w-8" style={{ background: '#005C66' }} />
          <span className="text-xs tracking-[0.22em] uppercase font-medium" style={{ fontFamily: 'Inter, sans-serif', color: '#005C66' }}>
            {mastery.label}
          </span>
        </div>

        <h2
          className="text-[#111118] leading-tight mb-5"
          style={{ ...fadeUp(0.1), fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(28px, 4.5vw, 50px)' }}
        >
          <span style={{ fontWeight: 300 }}>{mastery.h1} </span>
          <span
            style={{
              fontWeight: 800,
              fontStyle: 'italic',
              display: 'inline-block',
              transform: `translate(${mouse.x * 26}px, ${mouse.y * 12}px)`,
              transition: 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              willChange: 'transform',
            }}
          >
            {mastery.h2}
          </span>
        </h2>

        <p
          className="mx-auto leading-relaxed"
          style={{ ...fadeUp(0.2), fontFamily: 'Inter, sans-serif', fontSize: 'clamp(13px, 1.4vw, 15px)', color: '#828282', maxWidth: '620px' }}
        >
          {mastery.sub}
        </p>
      </div>

      {/* Image + cards */}
      <div className="mx-auto px-4 sm:px-6 lg:px-10" style={{ maxWidth: '1320px' }}>
        {isMobile && (
          <div style={{ borderRadius: 'clamp(14px, 3vw, 20px)', overflow: 'hidden' }}>
            <div ref={containerRef} style={{ position: 'relative', height: '280px', overflow: 'hidden' }}>
              <img
                src={imgSrc}
                alt="White Line chauffeur service"
                style={{
                  position: 'absolute', width: '100%', height: '130%', top: '-15%',
                  objectFit: 'cover', objectPosition: 'center',
                  transform: `scaleX(-1) translateY(${imgOffset}px)`,
                  transition: 'transform 0.1s linear', willChange: 'transform',
                }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(10,12,20,0.95) 100%)' }} />
            </div>
            <div style={{ background: '#0a0c14', padding: '28px 20px 32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <CardList withFade={false} />
            </div>
          </div>
        )}

        {!isMobile && (
          <div
            ref={containerRef}
            className="relative overflow-hidden"
            style={{ borderRadius: 'clamp(14px, 1.5vw, 20px)', height: 'clamp(540px, 68vh, 780px)' }}
          >
            <img
              src={imgSrc}
              alt="White Line chauffeur service"
              style={{
                position: 'absolute', width: '100%', height: '130%', top: '-15%',
                objectFit: 'cover', objectPosition: 'center',
                transform: `scaleX(-1) translateY(${imgOffset}px)`,
                transition: 'transform 0.1s linear', willChange: 'transform',
              }}
            />
            <div
              className="absolute inset-0"
              style={{ background: isRtl
                ? 'linear-gradient(to left, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.08) 100%)'
                : 'linear-gradient(to right, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.08) 100%)' }}
            />
            <div
              className="absolute inset-y-0 flex flex-col justify-center gap-4"
              style={{ padding: 'clamp(24px, 3vw, 48px)', maxWidth: '52%', [isRtl ? 'right' : 'left']: 0 }}
            >
              <CardList />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
