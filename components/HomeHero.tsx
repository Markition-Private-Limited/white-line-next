'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Navbar from '../layouts/Navbar'
import { useLanguage } from '../context/LanguageContext'
import heroBanner from '../assets/home/home_banner.webp'
import heroBannerMobile from '../assets/home/home_banner_mobile.webp'
import logoSvg from '../assets/fav_icon_black.svg'
import card1 from '../assets/home/home_page_banner_Sub_images/1.jpg'
import card2 from '../assets/home/home_page_banner_Sub_images/2.jpg'
import card3 from '../assets/home/home_page_banner_Sub_images/3.jpg'
import card4 from '../assets/home/home_page_banner_Sub_images/4.jpg'
import card5 from '../assets/home/home_page_banner_Sub_images/5.jpg'

const CARD_IMAGES = [card4, card2, card3, card1, card5]
const OBJECT_POSITIONS = ['center', 'center', 'center', '50% 15%', 'center']

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

export default function HomeHero() {
  const { trans } = useLanguage()
  const { hero } = trans
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [navVisible, setNavVisible] = useState(true)
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const resetIdleTimer = useCallback(() => {
    setNavVisible(true)
    if (idleTimer.current) clearTimeout(idleTimer.current)
    idleTimer.current = setTimeout(() => setNavVisible(false), 3000)
  }, [])

  useEffect(() => {
    resetIdleTimer()
    window.addEventListener('scroll', resetIdleTimer, { passive: true })
    window.addEventListener('touchstart', resetIdleTimer, { passive: true })
    return () => {
      window.removeEventListener('scroll', resetIdleTimer)
      window.removeEventListener('touchstart', resetIdleTimer)
      if (idleTimer.current) clearTimeout(idleTimer.current)
    }
  }, [resetIdleTimer])

  return (
    <div style={{ background: '#ffffff', padding: 'clamp(6px, 0.8vw, 10px)' }}>
      <section
        className="relative bg-[#0d0d14] flex flex-col min-h-screen"
        style={{ borderRadius: 'clamp(14px, 1.5vw, 20px)', overflow: 'hidden' }}
      >
        {/* Desktop hero banner — mirrored, low opacity */}
        <div className="absolute inset-0 hidden lg:block pointer-events-none" style={{ borderRadius: 'inherit', zIndex: 0 }}>
          <Image
            src={heroBanner}
            alt=""
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: '30% center', transform: 'scaleX(-1)', opacity: 0.32 }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d14] via-[#0d0d14]/55 to-[#0d0d14]/10" />
        </div>

        {/* Mobile-only background image */}
        <div className="absolute inset-0 lg:hidden" style={{ borderRadius: 'inherit' }}>
          <Image
            src={heroBannerMobile}
            alt="White Line luxury fleet"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'contain', objectPosition: 'top' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d14]/90 via-[#0d0d14]/50 to-[#0d0d14]/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d14]/70 via-transparent to-transparent" />
        </div>

        <motion.div
          animate={{ opacity: navVisible ? 1 : 0, y: navVisible ? 0 : -16 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          style={{ pointerEvents: navVisible ? 'auto' : 'none' }}
        >
          <Navbar />
        </motion.div>

        {/* ── Desktop: split layout ── */}
        <div className="hidden lg:flex relative z-10 flex-1 pl-12 pr-20 xl:pl-20 xl:pr-28 pb-12 pt-6 gap-10 xl:gap-16 min-h-0">

          {/* LEFT — fixed content */}
          <div className="flex flex-col justify-between w-[42%] xl:w-[44%] shrink-0 py-4">
            {/* Headline */}
            <div className="pt-20 xl:pt-28">
              {/* Prominent brand logo */}
              <motion.div
                className="flex items-center gap-3 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <img
                  src={(logoSvg as any).src ?? logoSvg}
                  alt="White Line"
                  style={{ width: 44, height: 48, filter: 'brightness(0) invert(1)', opacity: 0.9 }}
                />
                <span
                  className="text-white font-semibold tracking-[0.22em] uppercase text-base"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  White Line
                </span>
              </motion.div>

              <motion.h1
                className="text-4xl xl:text-5xl font-medium leading-tight text-white mb-5"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {hero.line1}
                <br />
                <span className="font-extrabold italic">{hero.line2}</span>
              </motion.h1>
              <motion.p
                className="text-sm leading-relaxed text-white/75"
                style={{ fontFamily: 'Inter, sans-serif' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.3, delay: 0.45, ease: 'easeOut' }}
              >
                {hero.sub}
              </motion.p>
            </div>

            {/* Active service detail / idle hint */}
            <div>
              <AnimatePresence mode="wait">
                {activeIndex !== null ? (
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                  >
                    <p
                      className="text-xs tracking-[0.26em] uppercase text-white/30 mb-3"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {String(activeIndex + 1).padStart(2, '0')} / {String(hero.services.length).padStart(2, '0')}
                    </p>
                    <h2
                      className="text-2xl xl:text-3xl font-semibold text-white mb-3"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {hero.services[activeIndex].title}
                    </h2>
                    <p
                      className="text-sm text-white/55 mb-5 leading-relaxed max-w-xs"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {hero.services[activeIndex].desc}
                    </p>
                    <a
                      href="#"
                      className="inline-flex items-center gap-2 text-sm font-medium text-[#D4FBFF] underline underline-offset-2 hover:opacity-80 transition-opacity"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {hero.bookNow} <ArrowRight size={14} />
                    </a>
                  </motion.div>
                ) : (
                  <motion.p
                    key="hint"
                    className="text-xs text-white/20"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    Hover a service to explore
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT — accordion panels */}
          <div className="flex flex-1 gap-2.5 overflow-hidden rounded-2xl">
            {hero.services.map((s, i) => {
              const isActive = activeIndex === i
              const hasActive = activeIndex !== null
              return (
                <motion.div
                  key={i}
                  className="relative overflow-hidden rounded-2xl cursor-pointer shrink-0"
                  animate={{ flex: isActive ? 5.5 : hasActive ? 0.75 : 1 }}
                  transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {/* Background image */}
                  <img
                    src={(CARD_IMAGES[i] as any).src}
                    alt={s.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      objectPosition: OBJECT_POSITIONS[i],
                      filter: isActive ? 'grayscale(0%) brightness(1)' : 'grayscale(80%) brightness(0.75)',
                      transition: 'filter 0.65s ease',
                    }}
                  />

                  {/* Overlay gradient */}
                  <div
                    className="absolute inset-0 transition-all duration-500"
                    style={{
                      background: isActive
                        ? 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, transparent 45%, rgba(0,0,0,0.72) 100%)'
                        : 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 100%)',
                    }}
                  />

                  {/* Panel number */}
                  <span
                    className="absolute top-4 left-4 text-white/40 text-xs tracking-widest select-none"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Collapsed: vertical title */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    animate={{ opacity: isActive ? 0 : 1 }}
                    transition={{ duration: 0.22 }}
                  >
                    <span
                      className="text-white/65 text-xs font-medium tracking-widest uppercase whitespace-nowrap select-none"
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        writingMode: 'vertical-rl',
                        textOrientation: 'mixed',
                        transform: 'rotate(180deg)',
                      }}
                    >
                      {s.title}
                    </span>
                  </motion.div>

                  {/* Expanded: bottom glassmorphism pill */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 p-5 pointer-events-none"
                    animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 14 }}
                    transition={{ duration: 0.4, delay: isActive ? 0.18 : 0, ease: 'easeOut' }}
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 100%)',
                      backdropFilter: 'blur(22px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(22px) saturate(180%)',
                      borderTop: '1px solid rgba(255,255,255,0.2)',
                    }}
                  >
                    <h3
                      className="text-white font-semibold mb-1.5 whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: 'clamp(13px, 1.1vw, 17px)',
                      }}
                    >
                      {s.title}
                    </h3>
                    <p
                      className="text-white/55 leading-relaxed mb-3 line-clamp-2"
                      style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(10px, 0.9vw, 12px)' }}
                    >
                      {s.desc}
                    </p>
                    <span
                      className="inline-flex items-center gap-1.5 font-medium text-[#D4FBFF]"
                      style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(10px, 0.85vw, 12px)' }}
                    >
                      {hero.bookNow} <ArrowRight size={11} />
                    </span>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* ── Mobile: original card-grid layout ── */}
        <div className="lg:hidden relative z-10 flex min-h-screen flex-col justify-between px-6 pb-10 pt-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.h1
              className="mb-4 text-4xl font-medium leading-tight text-white"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {hero.line1}
              <br />
              <span className="font-extrabold italic">{hero.line2}</span>
            </motion.h1>
            <motion.p
              className="text-sm leading-relaxed text-white/70"
              style={{ fontFamily: 'Inter, sans-serif' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.3, delay: 0.55, ease: 'easeOut' }}
            >
              {hero.sub}
            </motion.p>
          </motion.div>

          <motion.div
            className="mt-10 grid grid-cols-2 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1, delayChildren: 0.75 } },
            }}
          >
            {hero.services.map((s, i) => (
              <motion.div
                key={i}
                variants={cardVariants}
                className="relative rounded-2xl overflow-hidden"
                style={{ paddingBottom: '70%' }}
              >
                <img
                  src={(CARD_IMAGES[i] as any).src}
                  alt={s.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ objectPosition: OBJECT_POSITIONS[i] }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(180deg, transparent 35%, rgba(0,0,0,0.88) 100%)',
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p
                    className="text-white text-xs font-semibold mb-0.5 leading-snug"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {s.title}
                  </p>
                  <p
                    className="text-white/50 text-xs leading-snug line-clamp-2"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {s.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
