'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useLanguage } from '../context/LanguageContext'
import img1 from '../assets/services_1/services/airport_transfer/1.jpg'
import img2 from '../assets/services_1/services/airport_transfer/2.jpg'
import img3 from '../assets/services_1/services/airport_transfer/3.jpg'
import hourlyImg1 from '../assets/services_1/services/hourly/1.jpg'
import hourlyImg2 from '../assets/services_1/services/hourly/2.png'
import hourlyImg3 from '../assets/services_1/services/hourly/3.png'
import cityToCityImg1 from '../assets/services_1/services/city_to_city/1.jpg'
import cityToCityImg2 from '../assets/services_1/services/city_to_city/2.jpg'
import cityToCityImg3 from '../assets/services_1/services/city_to_city/3.jpg'
import dayServiceImg1 from '../assets/services_1/services/day_service/1.jpg'
import dayServiceImg2 from '../assets/services_1/services/day_service/2.jpg'
import dayServiceImg3 from '../assets/services_1/services/day_service/3.jpg'
import oneWayRideImg1 from '../assets/services_1/services/one-way/1.jpg'
import oneWayRideImg2 from '../assets/services_1/services/one-way/2.png'
import oneWayRideImg3 from '../assets/services_1/services/one-way/3.jpg'
import type { ServiceDetailPageKey } from '../lib/serviceDetail'

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

export default function AirportTransferGallerySection({ servicePage = 'airportTransferPage' }: { servicePage?: ServiceDetailPageKey }) {
  const { trans, dir } = useLanguage()
  const isRtl = dir === 'rtl'
  const { overview } = trans[servicePage]
  const [galleryImg1, galleryImg2, galleryImg3] = servicePage === 'hourlyBookingPage'
    ? [hourlyImg1, hourlyImg2, hourlyImg3]
    : servicePage === 'cityToCityPage'
      ? [cityToCityImg1, cityToCityImg2, cityToCityImg3]
      : servicePage === 'dayServicePage'
        ? [dayServiceImg1, dayServiceImg2, dayServiceImg3]
        : servicePage === 'oneWayRidePage'
          ? [oneWayRideImg1, oneWayRideImg2, oneWayRideImg3]
          : [img1, img2, img3]
  const serviceAlt = servicePage === 'hourlyBookingPage'
    ? 'Hourly chauffeur service'
    : servicePage === 'cityToCityPage'
      ? 'City-to-city chauffeur service'
      : servicePage === 'dayServicePage'
        ? 'Full-day chauffeur service'
        : servicePage === 'oneWayRidePage'
          ? 'One-way urban chauffeur service'
          : 'Airport transfer service'
  const { ref: sectionRef, inView } = useInView()

  const { ref: img1Ref, offset: off1 } = useParallax(0.10)
  const { ref: img2Ref, offset: off2 } = useParallax(0.14)
  const { ref: img3Ref, offset: off3 } = useParallax(0.08)

  const fadeUp = (delay = 0): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(32px)',
    transition: `opacity 0.85s ease ${delay}s, transform 0.85s ease ${delay}s`,
  })

  const textCol = (
    <div className="flex flex-col justify-center" style={fadeUp(0)}>
      {/* Label */}
      <div className="mb-5 flex items-center gap-3">
        <span className="h-px w-8 bg-[#5d8a7a]" />
        <p
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ fontFamily: 'Inter, sans-serif', color: '#5d8a7a' }}
        >
          {overview.label}
        </p>
      </div>

      {/* Heading */}
      <h2
        className="mb-6 leading-tight text-[#0d0d14]"
        style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(26px, 3.5vw, 48px)' }}
      >
        <span style={{ fontWeight: 300 }}>{overview.h1a} </span>
        <span style={{ fontWeight: 800, fontStyle: 'italic' }}>{overview.h1b}</span>
        <br />
        <span style={{ fontWeight: 300 }}>{overview.h2}</span>
      </h2>

      {/* Body */}
      <p
        className="leading-relaxed text-[#0d0d14]/60"
        style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(13px, 1.1vw, 15px)', textAlign: isRtl ? 'start' : 'justify' }}
      >
        {overview.body}
      </p>
    </div>
  )

  const imageCol = (
    <div className="grid grid-cols-2 gap-3" style={{ ...fadeUp(0.2), minHeight: '380px' }}>
      {/* Large left image */}
      <div ref={img1Ref} className="relative overflow-hidden rounded-2xl row-span-2" style={{ minHeight: '360px' }}>
        <Image
          src={galleryImg1}
          alt={serviceAlt}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            transform: `translateY(${off1}px) scale(1.15)`,
            transition: 'transform 0.1s linear',
          }}
        />
      </div>

      {/* Top-right image */}
      <div ref={img2Ref} className="relative overflow-hidden rounded-2xl" style={{ minHeight: '172px' }}>
        <Image
          src={galleryImg2}
          alt="Chauffeur opening car door"
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            transform: `translateY(${off2}px) scale(1.15)`,
            transition: 'transform 0.1s linear',
          }}
        />
      </div>

      {/* Bottom-right image */}
      <div ref={img3Ref} className="relative overflow-hidden rounded-2xl" style={{ minHeight: '172px' }}>
        <Image
          src={galleryImg3}
          alt={`${serviceAlt} luxury vehicle`}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            transform: `translateY(${off3}px) scale(1.15)`,
            transition: 'transform 0.1s linear',
          }}
        />
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
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {isRtl ? (
            <>
              {imageCol}
              {textCol}
            </>
          ) : (
            <>
              {textCol}
              {imageCol}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
