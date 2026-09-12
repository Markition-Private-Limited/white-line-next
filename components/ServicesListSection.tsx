'use client'
import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '../context/LanguageContext'
import _airportTransferImg from '../assets/home_service/banners/airport_transfer.webp'
import _oneWayRideImg from '../assets/home_service/banners/one_way_ride.webp'
import _cityToCityImg from '../assets/home_service/banners/city_to_city.webp'
import _dayServiceImg from '../assets/home_service/banners/day_service.webp'
import _hourlyImg from '../assets/home_service/banners/hourly_chauffer.webp'

// Order: Airport Transfer, One-Way Ride, City Trip, Day Service, Hourly Chauffeur
const STATIC = [
  { img: (_airportTransferImg as any).src, imgRight: true  }, // Airport Transfer
  { img: (_oneWayRideImg as any).src,      imgRight: false }, // One-Way Ride
  { img: (_cityToCityImg as any).src,      imgRight: true  }, // City Trip
  { img: (_dayServiceImg as any).src,      imgRight: false }, // Day Service
  { img: (_hourlyImg as any).src,          imgRight: true  }, // Hourly Chauffeur
]

const SLUGS = ['airport-transfer', 'one-way-ride', 'city-to-city', 'day-service', 'hourly-chauffeur']
const SERVICE_PAGE_URLS = [
  '/services/airport-transfer',
  '/services/one-way-ride',
  '/services/city-to-city',
  '/services/day-service',
  '/services/hourly-booking',
]

function ParallaxImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <div
      ref={ref}
      style={{
        borderRadius: 'clamp(12px, 1.2vw, 18px)',
        overflow: 'hidden',
        width: '100%',
        aspectRatio: '4 / 3',
        position: 'relative',
      }}
    >
      <motion.img
        src={src}
        alt={alt}
        style={{
          y,
          scale: 1.18,
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />
    </div>
  )
}

type ServiceItem = {
  label: string
  h1a: string; h1b: string; h1c: string
  h2a: string; h2b: string
  body: string
}

function ServiceHeading({ item }: { item: ServiceItem }) {
  return (
    <>
      {item.h1a}
      {item.h1b && <span style={{ fontWeight: 800, fontStyle: 'italic' }}>{item.h1b}</span>}
      {item.h1c}
      <br />
      {item.h2a}
      {item.h2b && <span style={{ fontWeight: 800, fontStyle: 'italic' }}>{item.h2b}</span>}
    </>
  )
}

function ServiceBlock({
  item,
  img,
  imgRight,
  explore,
  index,
  slug,
  pageUrl,
  isRtl,
  comingSoon = false,
  comingSoonLabel = 'Coming Soon',
}: {
  item: ServiceItem
  img: string
  imgRight: boolean
  explore: string
  index: number
  slug: string
  pageUrl: string
  isRtl: boolean
  comingSoon?: boolean
  comingSoonLabel?: string
}) {
  const textBlock = (
    <motion.div
      className="flex flex-col justify-center w-full lg:flex-1 min-w-0"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="flex items-center gap-2.5 mb-4">
        <span className="block h-px w-7 flex-shrink-0" style={{ background: '#005C66' }} />
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#005C66',
          }}
        >
          {item.label}
        </span>
        {comingSoon && (
          <span style={{
            background: '#005C66',
            color: '#fff',
            borderRadius: 999,
            fontSize: 8,
            padding: '3px 8px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontFamily: 'Inter, sans-serif',
            flexShrink: 0,
          }}>
            {comingSoonLabel}
          </span>
        )}
      </div>

      <h2
        style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: 'clamp(24px, 3vw, 38px)',
          fontWeight: 300,
          lineHeight: 1.2,
          color: '#111118',
          marginBottom: 'clamp(14px, 2vw, 20px)',
        }}
      >
        <ServiceHeading item={item} />
      </h2>

      <p
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 'clamp(13px, 1.1vw, 15px)',
          lineHeight: 1.75,
          color: '#6b7280',
          marginBottom: 'clamp(22px, 3vw, 32px)',
          maxWidth: 480,
        }}
      >
        {item.body}
      </p>

      {comingSoon ? (
        <span
          className="inline-flex h-11 items-center justify-center rounded-full self-start px-6"
          style={{ fontFamily: 'Inter, sans-serif', background: '#e8f4f5', color: '#005C66', fontSize: 14, fontWeight: 600, letterSpacing: '0.06em', minWidth: 160, opacity: 0.7 }}
        >
          {comingSoonLabel}
        </span>
      ) : (
        <Link
          href={pageUrl}
          className="group relative inline-flex h-11 items-center justify-center overflow-hidden rounded-full self-start"
          style={{ fontFamily: 'Inter, sans-serif', background: '#005C66', minWidth: 160, textDecoration: 'none' }}
        >
          <span className="inline-flex h-11 items-center justify-center gap-2 px-6 text-white text-sm font-semibold transition duration-500 group-hover:-translate-y-[150%]">
            {explore} {isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
          </span>
          <span className="absolute inline-flex h-11 w-full translate-y-full items-center justify-center gap-2 transition duration-500 group-hover:translate-y-0">
            <span className="absolute h-full w-full translate-y-full skew-y-12 scale-y-0 bg-[#004d57] transition duration-500 group-hover:translate-y-0 group-hover:scale-150" />
            <span className="relative z-10 inline-flex items-center gap-2 text-white text-sm font-semibold">
              {explore} {isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
            </span>
          </span>
        </Link>
      )}
    </motion.div>
  )

  const imageBlock = (
    <motion.div
      className="w-full lg:flex-1 min-w-0"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.85, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <ParallaxImage src={img} alt={item.label} />
    </motion.div>
  )

  return (
    <div
      id={slug}
      className={`flex flex-col gap-10 lg:gap-14 items-center ${imgRight ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
      style={{
        paddingBlock: 'clamp(40px, 5vw, 72px)',
        borderTop: index === 0 ? 'none' : '1px solid rgba(0,0,0,0.07)',
        scrollMarginTop: 90,
      }}
    >
      {textBlock}
      {imageBlock}
    </div>
  )
}

export default function ServicesListSection() {
  const { trans, dir } = useLanguage()
  const isRtl = dir === 'rtl'
  const { list } = trans.servicesPage

  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (!hash) return
    const el = document.getElementById(hash)
    if (!el) return
    const timer = setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section id="services-list" className="w-full bg-white" style={{ padding: 'clamp(72px, 9vw, 120px) 0 clamp(48px, 6vw, 80px)' }}>
      <div className="px-4 sm:px-6 lg:px-6 mx-auto" style={{ maxWidth: 1400 }}>

        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="block h-px w-8" style={{ background: '#005C66' }} />
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#005C66',
              }}
            >
              {list.label}
            </span>
          </div>

          <h2
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 'clamp(28px, 4vw, 50px)',
              fontWeight: 300,
              lineHeight: 1.2,
              color: '#111118',
              marginBottom: 'clamp(14px, 2vw, 20px)',
            }}
          >
            {list.h1}
            <br />
            <span style={{ fontWeight: 800, fontStyle: 'italic' }}>{list.h2}</span>
          </h2>

          <p
            className="mx-auto"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(13px, 1.1vw, 15px)',
              lineHeight: 1.75,
              color: '#9ca3af',
              maxWidth: 560,
            }}
          >
            {list.sub}
          </p>
        </motion.div>

        {list.items.map((item, i) => (
          <ServiceBlock
            key={i}
            item={item}
            img={STATIC[i].img}
            imgRight={STATIC[i].imgRight}
            explore={list.explore}
            index={i}
            slug={SLUGS[i]}
            pageUrl={SERVICE_PAGE_URLS[i]}
            isRtl={isRtl}
            comingSoon={SLUGS[i] === 'one-way-ride'}
            comingSoonLabel={isRtl ? 'قريباً' : 'Coming Soon'}
          />
        ))}

      </div>
    </section>
  )
}
