'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Navbar from '../layouts/Navbar'
import { useLanguage } from '../context/LanguageContext'
import AirportTransferBookingDialog, { type BookingService } from './AirportTransferBookingDialog'
import heroBanner from '../assets/home/home_banner.webp'
import heroBannerMobile from '../assets/home/home_banner_mobile.webp'
import servicesBanner from '../assets/services_1/service_1_banner.webp'
import contactBanner from '../assets/contact_us/contact_banner.webp'

const HERO_BANNERS = [heroBanner, servicesBanner, contactBanner]
const HERO_BANNERS_MOBILE = [heroBannerMobile, servicesBanner, contactBanner]
import card1 from '../assets/home/home_page_banner_Sub_images/1.jpg'
import card2 from '../assets/home/home_page_banner_Sub_images/2.jpg'
import card3 from '../assets/home/home_page_banner_Sub_images/3.jpg'
import card4 from '../assets/home/home_page_banner_Sub_images/4.jpg'
import card5 from '../assets/home/home_page_banner_Sub_images/5.jpg'

// Images mapped in the same order as translations.hero.services
// Order: Airport Transfer, City-to-City, Day Service, Hourly Chauffeur, One-Way Ride
const CARD_IMAGES = [card4, card2, card5, card1, card3]

type Tilt = { rotX: number; rotY: number; imgX: number; imgY: number }

function ParallaxCard({
  img,
  title,
  desc,
  bookNow,
  isRtl = false,
  objectPosition = 'center',
  defaultPb = '40%',
  onBook,
  comingSoon = false,
  comingSoonLabel = 'Coming Soon',
}: {
  img: { src: string } | string
  title: string
  desc: string
  bookNow: string
  isRtl?: boolean
  objectPosition?: string
  defaultPb?: string
  onBook?: () => void
  comingSoon?: boolean
  comingSoonLabel?: string
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState<Tilt>({ rotX: 0, rotY: 0, imgX: 0, imgY: 0 })
  const [active, setActive] = useState(false)

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return
    const { left, top, width, height } = el.getBoundingClientRect()
    const x = (e.clientX - left) / width - 0.5
    const y = (e.clientY - top) / height - 0.5
    setTilt({ rotX: -y * 12, rotY: x * 12, imgX: x * 10, imgY: y * 10 })
  }

  const reset = () => {
    setActive(false)
    setTilt({ rotX: 0, rotY: 0, imgX: 0, imgY: 0 })
  }

  const imgSrc = typeof img === 'string' ? img : img.src

  return (
    <div
      ref={cardRef}
      onClick={comingSoon ? undefined : onBook}
      onMouseMove={comingSoon ? undefined : handleMove}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={reset}
      className="rounded-2xl p-3"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 100%)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.35)',
        boxShadow: active
          ? '0 12px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.4)'
          : '0 4px 24px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.4)',
        position: 'relative',
        zIndex: active ? 10 : 1,
        transition: 'box-shadow 0.4s ease',
        cursor: (!comingSoon && onBook) ? 'pointer' : undefined,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {comingSoon && (
        <span style={{
          position: 'absolute',
          top: 10,
          ...(isRtl ? { left: 10 } : { right: 10 }),
          background: '#005C66',
          color: '#fff',
          borderRadius: 999,
          fontSize: 9,
          padding: '4px 9px',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontFamily: 'Inter, sans-serif',
          zIndex: 20,
          pointerEvents: 'none',
        }}>
          {comingSoonLabel}
        </span>
      )}
      <div className="overflow-hidden rounded-lg mb-3 relative w-full">
        <motion.div
          className="w-full"
          animate={{ paddingBottom: active ? '100%' : defaultPb }}
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
        <Image
          src={imgSrc}
          alt={title}
          fill
          sizes="(max-width: 640px) 50vw, 20vw"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            objectPosition,
            transform: `translate(${tilt.imgX}px, ${tilt.imgY}px) scale(1.08)`,
            filter: active ? 'grayscale(0%)' : 'grayscale(100%)',
            transition: active
              ? 'transform 0.08s linear, filter 0.4s ease'
              : 'transform 0.5s ease, filter 0.6s ease',
          }}
        />
      </div>
      <p
        className="mb-0.5 text-sm font-semibold"
        style={{
          fontFamily: 'Inter, sans-serif',
          color: active ? '#D4FBFF' : '#ffffff',
          transition: 'color 0.4s ease',
        }}
      >
        {title}
      </p>
      <p
        className="mb-3 text-xs leading-snug"
        style={{
          fontFamily: 'Inter, sans-serif',
          color: active ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0.50)',
          transition: 'color 0.4s ease',
        }}
      >
        {desc}
      </p>
      {comingSoon ? (
        <span style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 12,
          color: 'rgba(255,255,255,0.42)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          fontWeight: 600,
          marginTop: 'auto',
        }}>
          {comingSoonLabel}
        </span>
      ) : (
        <button
          type="button"
          onClick={event => { event.stopPropagation(); onBook?.() }}
          className="inline-flex items-center gap-1 text-sm font-medium underline underline-offset-2"
          style={{
            fontFamily: 'Inter, sans-serif',
            color: '#D4FBFF',
            opacity: active ? 1 : 0.7,
            letterSpacing: active ? '0.01em' : '0',
            transition: 'opacity 0.4s ease, letter-spacing 0.4s ease',
            marginTop: 'auto',
            alignSelf: 'flex-start',
          }}
        >
          {bookNow} {isRtl ? <ArrowLeft size={12} /> : <ArrowRight size={12} />}
        </button>
      )}
    </div>
  )
}

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] as const } },
}

export default function HomeHero() {
  const { trans, dir } = useLanguage()
  const isRtl = dir === 'rtl'
  const { hero } = trans
  const [bannerIndex, setBannerIndex] = useState(0)
  const heroSlide = hero.slides[bannerIndex] ?? hero.slides[0]

  useEffect(() => {
    const timer = setInterval(() => setBannerIndex(i => (i + 1) % 3), 5000)
    return () => clearInterval(timer)
  }, [])

  const [bookingType, setBookingType] = useState<BookingService | null>(() => {
    if (typeof window === 'undefined') return null
    const params = new URLSearchParams(window.location.search)
    const booking = params.get('booking') as BookingService | null
    const valid: BookingService[] = ['airport', 'hourly', 'city', 'day', 'oneWay']
    return booking && valid.includes(booking) ? booking : null
  })

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const booking = params.get('booking') as BookingService | null
    const valid: BookingService[] = ['airport', 'hourly', 'city', 'day', 'oneWay']
    if (booking && valid.includes(booking)) {
      history.replaceState(null, '', window.location.pathname)
    }
  }, [])

  const bookingForCard = (index: number) => {
    if (index === 0) return () => setBookingType('airport')
    if (index === 1) return () => setBookingType('city')
    if (index === 2) return () => setBookingType('day')
    if (index === 3) return () => setBookingType('hourly')
    if (index === 4) return () => setBookingType('oneWay')
    return undefined
  }

  return (
    <div style={{ background: '#ffffff', padding: 'clamp(6px, 0.8vw, 10px)' }}>
      <section className="relative min-h-screen bg-[#0d0d14]" style={{ borderRadius: 'clamp(14px, 1.5vw, 20px)' }}>

        {/* Banner — rotates between 3 images every 5s with crossfade */}
        <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: 'inherit' }}>
          {HERO_BANNERS_MOBILE.map((src, i) => (
            <Image
              key={`m${i}`}
              src={src}
              alt="White Line luxury fleet"
              fill
              priority={i === 0}
              sizes="100vw"
              className="block sm:hidden"
              style={{
                objectFit: 'cover',
                objectPosition: 'center top',
                transform: isRtl ? 'scaleX(-1)' : undefined,
                opacity: bannerIndex === i ? 1 : 0,
                transition: 'opacity 1.2s ease-in-out',
              }}
            />
          ))}
          {HERO_BANNERS.map((src, i) => (
            <Image
              key={`d${i}`}
              src={src}
              alt="White Line luxury fleet"
              fill
              priority={i === 0}
              sizes="100vw"
              className="hidden sm:block"
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
                transform: isRtl ? 'scaleX(-1)' : undefined,
                opacity: bannerIndex === i ? 1 : 0,
                transition: 'opacity 1.2s ease-in-out',
              }}
            />
          ))}
          <div className={`absolute inset-0 ${isRtl ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-[#0d0d14]/90 via-[#0d0d14]/50 to-[#0d0d14]/10`} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d14]/70 via-transparent to-transparent" />
        </div>

        <Navbar />

        <div className="relative z-10 flex min-h-screen flex-col justify-between px-6 pb-10 pt-32 sm:px-10 lg:px-16">

          {/* Heading */}
          <motion.div
            className="max-w-xl pt-6 sm:pt-10 lg:max-w-3xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={bannerIndex}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <h1
                  className="mb-4 text-4xl font-medium leading-tight text-white sm:text-5xl lg:text-6xl"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {heroSlide.line1}
                  <br />
                  <span className="font-extrabold italic">{heroSlide.line2}</span>
                </h1>
                <p
                  className="max-w-xl lg:max-w-3xl text-sm leading-relaxed text-white/70 sm:text-base"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {heroSlide.sub}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Cards */}
          <motion.div
            className="mt-10 sm:mt-16 grid grid-cols-2 gap-4 sm:gap-3 sm:grid-cols-3 lg:grid-cols-5"
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.75 } } }}
          >
            {hero.services.map((s, i) => (
              <motion.div key={i} className="relative h-full" variants={cardVariants}>
                {/* ── Mobile: direct render, taller image ── */}
                <div className="sm:hidden h-full">
                  <ParallaxCard
                    img={CARD_IMAGES[i]}
                    title={s.title}
                    desc={s.desc}
                    bookNow={hero.bookNow}
                    isRtl={isRtl}
                    defaultPb="70%"
                    objectPosition={i === 2 ? '50% 15%' : 'center'}
                    onBook={bookingForCard(i)}
                    comingSoon={i === 4}
                    comingSoonLabel={dir === 'rtl' ? 'قريباً' : 'Coming Soon'}
                  />
                </div>
                {/* ── Sm+: ghost sizes the cell; card expands upward on hover ── */}
                <div className="hidden sm:block">
                  <div className="rounded-2xl p-3 pointer-events-none select-none" style={{ visibility: 'hidden' }} aria-hidden="true">
                    <div className="mb-3 w-full" style={{ paddingBottom: '40%' }} />
                    <p className="mb-0.5 text-sm font-semibold">&nbsp;</p>
                    <p className="mb-3 text-xs leading-snug">&nbsp;</p>
                    <span className="text-sm font-medium">&nbsp;</span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0">
                    <ParallaxCard
                      img={CARD_IMAGES[i]}
                      title={s.title}
                      desc={s.desc}
                      bookNow={hero.bookNow}
                      isRtl={isRtl}
                      objectPosition={i === 2 ? '50% 15%' : 'center'}
                      onBook={bookingForCard(i)}
                      comingSoon={i === 4}
                      comingSoonLabel={dir === 'rtl' ? 'قريباً' : 'Coming Soon'}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>
      <AirportTransferBookingDialog key={bookingType ?? 'closed'} open={bookingType !== null} service={bookingType ?? 'airport'} onClose={() => setBookingType(null)} />
    </div>
  )
}
