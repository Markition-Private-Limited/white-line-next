'use client'
import { useEffect, useRef, useState } from 'react'
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

// Returns a scroll-driven parallax offset for a given container ref
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

function ParallaxImage({
  src,
  alt,
  offset,
  objectPosition = 'center',
}: {
  src: string
  alt: string
  offset: number
  objectPosition?: string
}) {
  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      style={{
        position: 'absolute',
        width: '100%',
        height: '130%',
        top: '-15%',
        objectFit: 'cover',
        objectPosition,
        transform: `translateY(${offset}px)`,
        transition: 'transform 0.1s linear',
        willChange: 'transform',
        display: 'block',
      }}
    />
  )
}

// Bottom-gradient + text overlay shared by all three cells
function CellOverlay({ title, desc }: { title: string; desc: string }) {
  return (
    <>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.35) 45%, transparent 100%)',
          borderRadius: 'inherit',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: 'clamp(16px, 2.5vw, 28px)',
        }}
      >
        <p
          className="font-bold text-white mb-1.5"
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: 'clamp(14px, 1.5vw, 18px)',
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(11px, 1.1vw, 13px)',
            color: 'rgba(255,255,255,0.70)',
            lineHeight: 1.55,
          }}
        >
          {desc}
        </p>
      </div>
    </>
  )
}

export default function AboutAdvantageSection() {
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
      {/* ── Heading ─────────────────────────────────────────────────────────── */}
      <div className="text-center px-6 mb-12">
        <div className="flex items-center justify-center gap-3 mb-6" style={fadeUp(0)}>
          <span className="block h-px w-8" style={{ background: '#005C66' }} />
          <span
            className="text-xs tracking-[0.22em] uppercase font-medium"
            style={{ fontFamily: 'Inter, sans-serif', color: '#005C66' }}
          >
            Tailored Corporate Solutions
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
          <span style={{ fontWeight: 300 }}>The WhiteLine </span>
          <span style={{ fontWeight: 800, fontStyle: 'italic' }}>Advantage</span>
        </h2>

        <p
          className="mx-auto leading-relaxed"
          style={{
            ...fadeUp(0.2),
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(13px, 1.4vw, 15px)',
            color: '#828282',
            maxWidth: '680px',
          }}
        >
          In a world where transportation is commonplace, we treat every journey as a standard of
          distinction. By combining an elite fleet, rigorously trained chauffeurs, and a relentless
          commitment to your privacy and punctuality.
        </p>
      </div>

      {/* ── Image grid ──────────────────────────────────────────────────────── */}
      <div
        className="mx-auto px-4 sm:px-6 lg:px-10"
        style={{ maxWidth: '1320px', ...fadeUp(0.3) }}
      >
        <div
          className="flex flex-col lg:flex-row"
          style={{ gap: 'clamp(8px, 1vw, 14px)', height: 'auto' }}
        >
          {/* ── Left: large image ─────────────────────────────────────────── */}
          <div
            ref={p1.ref}
            className="relative overflow-hidden flex-shrink-0 w-full lg:w-[55%]"
            style={{
              borderRadius: RADIUS,
              height: 'clamp(240px, 42vw, 520px)',
            }}
          >
            <ParallaxImage src={(img1 as any).src ?? img1} alt="Designed around your journey" offset={p1.offset} objectPosition="center top" />
            <CellOverlay
              title="Designed around your journey."
              desc="From real-time tracking to any custom destination, every detail is custom-tailored."
            />
          </div>

          {/* ── Right: two stacked images ──────────────────────────────────── */}
          <div
            className="flex flex-col flex-1"
            style={{ gap: 'clamp(8px, 1vw, 14px)' }}
          >
            {/* Top right */}
            <div
              ref={p2.ref}
              className="relative overflow-hidden"
              style={{
                borderRadius: RADIUS,
                flex: 1,
                minHeight: 'clamp(130px, 20vw, 250px)',
              }}
            >
              <ParallaxImage src={(img2 as any).src ?? img2} alt="Professional service" offset={p2.offset} objectPosition="center 20%" />
              <CellOverlay
                title="Professional service."
                desc="Experienced chauffeurs, trained strictly to prioritise comfort and discretion."
              />
            </div>

            {/* Bottom right */}
            <div
              ref={p3.ref}
              className="relative overflow-hidden"
              style={{
                borderRadius: RADIUS,
                flex: 1,
                minHeight: 'clamp(130px, 20vw, 250px)',
              }}
            >
              <ParallaxImage src={(img3 as any).src ?? img3} alt="Technology that works for you" offset={p3.offset} />
              <CellOverlay
                title="Technology that works for you."
                desc="Simple booking, automatic notifications, transparent payments, and responsive support."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


