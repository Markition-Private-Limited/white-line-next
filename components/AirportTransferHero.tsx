'use client'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Navbar from '../layouts/Navbar'
import Image from 'next/image'
import { useLanguage } from '../context/LanguageContext'
import banner from '../assets/services_1/services/airport_transfer/banner.jpg'
import hourlyBanner from '../assets/services_1/services/hourly/banner.webp'
import cityToCityBanner from '../assets/services_1/services/city_to_city/banner.webp'
import dayServiceBanner from '../assets/services_1/services/day_service/banner.jpg'
import oneWayRideBanner from '../assets/services_1/services/one-way/banner.jpg'
import type { ServiceDetailPageKey } from '../lib/serviceDetail'

function SlideButton({ label, variant = 'filled', icon, onClick }: { label: string; variant?: 'filled' | 'outline'; icon?: React.ReactNode; onClick?: () => void }) {
  const isFilled = variant === 'filled'
  return (
    <button
      onClick={onClick}
      className={`group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full font-medium transition-shadow ${
        isFilled ? 'bg-white text-[#0d0d14] border-2 border-white' : 'bg-transparent text-white border-2 border-white/60'
      }`}
      style={{ fontFamily: 'Inter, sans-serif', minWidth: '180px' }}
    >
      <div className={`inline-flex h-12 translate-y-0 items-center justify-center gap-2 px-6 transition duration-500 group-hover:-translate-y-[150%] ${isFilled ? 'text-[#0d0d14]' : 'text-white'}`}>
        {label}{icon}
      </div>
      <div className="absolute inline-flex h-12 w-full translate-y-[100%] items-center justify-center gap-2 text-white transition duration-500 group-hover:translate-y-0">
        <span className={`absolute h-full w-full translate-y-full skew-y-12 scale-y-0 transition duration-500 group-hover:translate-y-0 group-hover:scale-150 ${isFilled ? 'bg-[#0d0d14]' : 'bg-white/20'}`} />
        <span className="z-10 inline-flex items-center gap-2">{label}{icon}</span>
      </div>
    </button>
  )
}

const SERVICE_BOOKING_TYPE: Record<ServiceDetailPageKey, string> = {
  airportTransferPage: 'airport',
  hourlyBookingPage:   'hourly',
  cityToCityPage:      'city',
  dayServicePage:      'day',
  oneWayRidePage:      'oneWay',
}

export default function AirportTransferHero({ servicePage = 'airportTransferPage' }: { servicePage?: ServiceDetailPageKey }) {
  const { trans, dir } = useLanguage()
  const isRtl = dir === 'rtl'
  const router = useRouter()
  const { hero } = trans[servicePage]

  const bookService = () => router.push(`/?booking=${SERVICE_BOOKING_TYPE[servicePage]}`)
  const scrollDown  = () => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
  const heroImage = servicePage === 'hourlyBookingPage'
    ? hourlyBanner
    : servicePage === 'cityToCityPage'
      ? cityToCityBanner
      : servicePage === 'dayServicePage'
        ? dayServiceBanner
        : servicePage === 'oneWayRidePage'
          ? oneWayRideBanner
          : banner
  const heroAlt = servicePage === 'hourlyBookingPage'
    ? 'Hourly chauffeur service — White Line'
    : servicePage === 'cityToCityPage'
      ? 'City-to-city chauffeur service — White Line'
      : servicePage === 'dayServicePage'
        ? 'Full-day chauffeur service — White Line'
        : servicePage === 'oneWayRidePage'
          ? 'One-way urban chauffeur service — White Line'
          : 'Airport Transfer — White Line'

  return (
    <div style={{ background: '#ffffff', padding: 'clamp(6px, 0.8vw, 10px)' }}>
      <section className="relative min-h-screen bg-[#0d0d14]" style={{ borderRadius: 'clamp(14px, 1.5vw, 20px)' }}>
        <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: 'inherit' }}>
          <Image
            src={heroImage}
            alt={heroAlt}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center', transform: isRtl ? 'scaleX(-1)' : undefined }}
          />
          <div className={`absolute inset-0 ${isRtl ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-[#0d0d14]/90 via-[#0d0d14]/55 to-[#0d0d14]/10`} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d14]/70 via-transparent to-transparent" />
        </div>

        <Navbar />

        <div className="relative z-10 flex min-h-screen flex-col justify-center px-6 pb-10 pt-32 sm:px-10 lg:px-16">
          <motion.div
            className="max-w-2xl lg:max-w-4xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.h1
              className="mb-6 leading-tight text-white"
              style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(34px, 5.5vw, 68px)' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <span style={{ fontWeight: 300 }}>{hero.h1a}</span>
              <br />
              <span style={{ fontWeight: 800, fontStyle: 'italic' }}>{hero.h1b}</span>
            </motion.h1>

            <motion.p
              className="mb-10 text-sm leading-relaxed sm:text-base"
              style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.65)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease: 'easeOut' }}
            >
              {hero.sub}
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55, ease: 'easeOut' }}
            >
              <SlideButton label={hero.btn1} variant="filled" icon={isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />} onClick={bookService} />
              <SlideButton label={hero.btn2} variant="outline" onClick={scrollDown} />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
