'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useLanguage } from '../context/LanguageContext'
import featureImg from '../assets/services_1/services/airport_transfer/5.png'
import continuousIcon from '../assets/services_1/services/airport_transfer/continous.svg'
import multiStopIcon from '../assets/services_1/services/airport_transfer/multi-stop.svg'
import eliteIcon from '../assets/services_1/services/airport_transfer/elite.svg'
import executiveIcon from '../assets/services_1/services/airport_transfer/executive.svg'
import hourlyFeatureImg from '../assets/services_1/services/hourly/5.jpg'
import dayServiceFeatureImg from '../assets/services_1/services/day_service/5.jpg'
import type { ServiceDetailPageKey } from '../lib/serviceDetail'

const icons = [continuousIcon, multiStopIcon, eliteIcon, executiveIcon]

function useInView(threshold = 0.1) {
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

function useParallax(strength = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)
  useEffect(() => {
    const handle = () => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const center = rect.top + rect.height / 2 - window.innerHeight / 2
      setOffset(center * strength)
    }
    window.addEventListener('scroll', handle, { passive: true })
    handle()
    return () => window.removeEventListener('scroll', handle)
  }, [strength])
  return { ref, offset }
}

export default function AirportTransferKeyFeaturesSection({ servicePage = 'airportTransferPage' }: { servicePage?: ServiceDetailPageKey }) {
  const { trans, dir } = useLanguage()
  const isRtl = dir === 'rtl'
  const { features } = trans[servicePage]
  const sectionImage = servicePage === 'hourlyBookingPage'
    ? hourlyFeatureImg
    : servicePage === 'dayServicePage'
      ? dayServiceFeatureImg
      : featureImg
  const sectionImageAlt = servicePage === 'hourlyBookingPage'
    ? 'White Line hourly chauffeur service'
    : servicePage === 'cityToCityPage'
      ? 'White Line long-distance chauffeur service'
      : servicePage === 'dayServicePage'
        ? 'White Line full-day chauffeur service'
        : servicePage === 'oneWayRidePage'
          ? 'White Line one-way chauffeur service'
          : 'White Line airport chauffeur service'
  const { ref: sectionRef, inView } = useInView()
  const { ref: imgRef, offset } = useParallax(0.13)

  const fadeUp = (delay = 0): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 0.85s ease ${delay}s, transform 0.85s ease ${delay}s`,
  })

  const imageBlock = (
    <div
      ref={imgRef}
      className="relative overflow-hidden rounded-2xl"
      style={{ minHeight: 'clamp(380px, 55vw, 680px)' }}
    >
      <Image
        src={sectionImage}
        alt={sectionImageAlt}
        fill
        sizes="(max-width: 768px) 100vw, 45vw"
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
          transform: `translateY(${offset}px) scale(1.14)`,
          transition: 'transform 0.1s linear',
        }}
      />
    </div>
  )

  const contentBlock = (
    <div className="flex flex-col justify-center" style={fadeUp(0)}>
      {/* Label */}
      <div className="mb-5 flex items-center gap-3">
        <span className="h-px w-8 bg-[#005C66]" />
        <p
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ fontFamily: 'Inter, sans-serif', color: '#005C66' }}
        >
          {features.label}
        </p>
      </div>

      {/* Heading */}
      <h2
        className="mb-5 leading-tight text-[#0d0d14]"
        style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(26px, 3.2vw, 46px)' }}
      >
        <span style={{ fontWeight: 300 }}>{features.h1a}</span>
        <span style={{ fontWeight: 800, fontStyle: 'italic' }}>{features.h1b}</span>
        <span style={{ fontWeight: 300 }}>{features.h1c}</span>
        <br />
        <span style={{ fontWeight: 300 }}>{features.h2}</span>
      </h2>

      {/* Sub */}
      <p
        className="mb-8 text-sm leading-relaxed text-[#0d0d14]/55"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {features.sub}
      </p>

      {/* Feature rows */}
      <div className="flex flex-col gap-5">
        {features.items.map((item, i) => (
          <div
            key={i}
            className="flex gap-4"
            style={fadeUp(0.1 + i * 0.08)}
          >
            {/* Icon chip */}
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{ background: 'rgba(0,92,102,0.10)' }}
            >
              <Image src={icons[i]} alt={item.title} width={20} height={20} />
            </div>

            {/* Text */}
            <div>
              <p
                className="mb-1 text-sm font-semibold text-[#0d0d14]"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {item.title}
              </p>
              <p
                className="text-sm leading-relaxed text-[#0d0d14]/55"
                style={{ fontFamily: 'Inter, sans-serif', textAlign: isRtl ? 'start' : 'justify' }}
              >
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <section style={{ background: '#ffffff', padding: 'clamp(6px, 0.8vw, 10px)', paddingTop: 0 }}>
      <div
        ref={sectionRef}
        className="bg-white"
        style={{
          borderRadius: 'clamp(14px, 1.5vw, 20px)',
          padding: 'clamp(48px, 7vw, 100px) clamp(24px, 5vw, 80px)',
        }}
      >
        {/* Mobile: image top, content below */}
        <div className="flex flex-col gap-10 lg:hidden">
          {imageBlock}
          {contentBlock}
        </div>

        {/* Desktop: image left, content right (flipped for RTL) */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
          {isRtl ? (
            <>
              {contentBlock}
              {imageBlock}
            </>
          ) : (
            <>
              {imageBlock}
              {contentBlock}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
