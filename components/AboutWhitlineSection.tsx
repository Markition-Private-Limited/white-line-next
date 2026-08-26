'use client'
import { useEffect, useRef, useState } from 'react'
import aboutImg from '../assets/about_us/about_whiteline.jpg'

const stats = [
  { num: 50,   suffix: 'K+',   label: 'Successfully\nCompleted Rides' },
  { num: 500,  suffix: '+',    label: 'Elite\nChauffeurs' },
  { num: 99,   suffix: '%',    label: 'On-Time\nRating' },
  { num: null, suffix: '24/7', label: 'Dedicated\nSupport' },
]

function useInView(threshold = 0.15) {
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

function useStatsInView() {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true) },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, inView }
}

function useCountUp(target: number | null, inView: boolean, duration = 2400) {
  const [count, setCount] = useState(0)
  const hasRun = useRef(false)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!inView || target === null || hasRun.current) return
    hasRun.current = true
    let start: number | null = null
    const step = (ts: number) => {
      if (!start) start = ts
      const t = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setCount(Math.round(eased * target))
      if (t < 1) rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [inView, target, duration])

  return target === null ? null : count
}

function StatNumber({ num, suffix, inView, delay }: { num: number | null; suffix: string; inView: boolean; delay: number }) {
  const count = useCountUp(num, inView, 2400 + delay * 150)
  return <span>{num === null ? suffix : `${count}${suffix}`}</span>
}

function StatsRow() {
  const { ref, inView } = useStatsInView()
  return (
    <div
      ref={ref}
      className="grid grid-cols-2 sm:grid-cols-4"
      style={{ borderTop: '1px solid #e5e7eb' }}
    >
      {stats.map((s, i) => (
        <div
          key={s.suffix}
          className={`py-8 px-6 sm:px-10 ${i < stats.length - 1 ? 'border-r border-gray-200' : ''}`}
        >
          <p
            className="font-bold mb-1"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 'clamp(30px, 4vw, 48px)',
              color: '#294244',
            }}
          >
            <StatNumber num={s.num} suffix={s.suffix} inView={inView} delay={i} />
          </p>
          <p
            className="leading-snug"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(11px, 1.2vw, 13px)',
              whiteSpace: 'pre-line',
              color: '#828282',
            }}
          >
            {s.label}
          </p>
        </div>
      ))}
    </div>
  )
}

export default function AboutWhitlineSection() {
  const { ref, inView } = useInView(0.1)

  // ── Scroll parallax for the right-side image ──────────────────────────────
  const imgContainerRef = useRef<HTMLDivElement>(null)
  const [imgOffset, setImgOffset] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = imgContainerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const center = rect.top + rect.height / 2 - window.innerHeight / 2
      setImgOffset(center * 0.15)
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

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="w-full bg-white"
      style={{ paddingTop: '96px', paddingBottom: '80px' }}
    >
      {/* Two-column: text | image */}
      <div className="px-6 sm:px-12 lg:px-20 flex flex-col lg:flex-row gap-12 lg:gap-20 items-center mb-20">

        {/* Left: text */}
        <div className="flex-1 max-w-xl" style={fadeUp(0)}>
          <h2
            className="text-[#111118] leading-tight mb-6"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 'clamp(28px, 4vw, 46px)',
            }}
          >
            <span style={{ fontWeight: 300 }}>Engineered For</span>
            <br />
            <span style={{ fontWeight: 800, fontStyle: 'italic' }}>Discerning Standards</span>
          </h2>

          <p
            className="leading-relaxed"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(13px, 1.4vw, 15px)',
              color: '#828282',
            }}
          >
            At White Line, luxury is not merely an aesthetic—it is a discipline. We believe that
            true executive travel requires an uncompromising dedication to precision, where every
            minute detail is anticipated before you even step inside the vehicle. Our operational
            framework is built from the ground up to serve leaders, dignitaries, and high-profile
            individuals who demand absolute perfection from their environment.
          </p>
        </div>

        {/* Right: image with scroll parallax */}
        <div
          ref={imgContainerRef}
          className="flex-shrink-0 w-full lg:w-[45%]"
          style={{
            ...fadeUp(0.2),
            borderRadius: 'clamp(12px, 1.5vw, 20px)',
            overflow: 'hidden',
            position: 'relative',
            // Fixed height so parallax has room to move
            height: 'clamp(280px, 38vw, 460px)',
          }}
        >
          <img
            src={(aboutImg as any).src ?? aboutImg}
            alt="White Line chauffeur in vehicle"
            style={{
              position: 'absolute',
              width: '100%',
              // Taller than container so translateY never reveals bg
              height: '130%',
              top: '-15%',
              objectFit: 'cover',
              objectPosition: 'center',
              transform: `translateY(${imgOffset}px)`,
              transition: 'transform 0.1s linear',
              willChange: 'transform',
              display: 'block',
            }}
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="px-6 sm:px-12 lg:px-20" style={fadeUp(0.35)}>
        <StatsRow />
      </div>
    </section>
  )
}


