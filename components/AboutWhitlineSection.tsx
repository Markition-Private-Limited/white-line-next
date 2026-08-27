'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useLanguage } from '../context/LanguageContext'
import aboutImg from '../assets/about_us/about_whiteline.jpg'

const STAT_NUMS = [50, 500, 99, null]

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
  const { lang } = useLanguage()
  const count = useCountUp(num, inView, 2400 + delay * 150)
  const formatted = count === null ? null : count.toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US')
  return (
    <span dir="ltr" style={{ unicodeBidi: 'isolate' }}>
      {num === null ? suffix : `${formatted}${suffix}`}
    </span>
  )
}

function StatsRow() {
  const { trans } = useLanguage()
  const stats = trans.about.whiteline.stats.map((s, i) => ({ ...s, num: STAT_NUMS[i] }))
  const { ref, inView } = useStatsInView()
  return (
    <div
      ref={ref}
      className="grid grid-cols-2 sm:grid-cols-4"
      style={{ borderTop: '1px solid #e5e7eb' }}
    >
      {stats.map((s, i) => (
        <div
          key={i}
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
  const { trans } = useLanguage()
  const { whiteline: wl } = trans.about
  const { ref, inView } = useInView(0.1)

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
      <div className="px-6 sm:px-12 lg:px-20 flex flex-col lg:flex-row gap-12 lg:gap-20 items-center mb-20">
        {/* Text */}
        <div className="flex-1 max-w-xl" style={fadeUp(0)}>
          <h2
            className="text-[#111118] leading-tight mb-6"
            style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(28px, 4vw, 46px)' }}
          >
            <span style={{ fontWeight: 300 }}>{wl.h1}</span>
            <br />
            <span style={{ fontWeight: 800, fontStyle: 'italic' }}>{wl.h2}</span>
          </h2>
          <p
            className="leading-relaxed"
            style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(13px, 1.4vw, 15px)', color: '#828282' }}
          >
            {wl.sub}
          </p>
        </div>

        {/* Image */}
        <div
          ref={imgContainerRef}
          className="flex-shrink-0 w-full lg:w-[45%]"
          style={{
            ...fadeUp(0.2),
            borderRadius: 'clamp(12px, 1.5vw, 20px)',
            overflow: 'hidden',
            position: 'relative',
            height: 'clamp(280px, 38vw, 460px)',
          }}
        >
          <Image
            src={aboutImg}
            alt="White Line chauffeur in vehicle"
            fill
            placeholder="blur"
            sizes="(max-width: 1024px) 100vw, 45vw"
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
              transform: `translateY(${imgOffset}px)`,
              transition: 'transform 0.1s linear',
              willChange: 'transform',
            }}
          />
        </div>
      </div>

      <div className="px-6 sm:px-12 lg:px-20" style={fadeUp(0.35)}>
        <StatsRow />
      </div>
    </section>
  )
}
