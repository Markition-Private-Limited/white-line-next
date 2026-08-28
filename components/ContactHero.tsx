'use client'
import { motion } from 'framer-motion'
import Navbar from '../layouts/Navbar'
import Image from 'next/image'
import { useLanguage } from '../context/LanguageContext'
import contactBanner from '../assets/contact_us/contact_banner.webp'

export default function ContactHero() {
  const { trans, dir } = useLanguage()
  const isRtl = dir === 'rtl'
  const { hero } = trans.contactPage

  return (
    <div style={{ background: '#ffffff', padding: 'clamp(6px, 0.8vw, 10px)' }}>
      <section className="relative min-h-screen bg-[#0d0d14]" style={{ borderRadius: 'clamp(14px, 1.5vw, 20px)' }}>
        <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: 'inherit' }}>
          <Image
            src={contactBanner}
            alt="Contact White Line"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center', transform: isRtl ? 'scaleX(-1)' : undefined }}
          />
          <div className={`absolute inset-0 ${isRtl ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-[#0d0d14]/88 via-[#0d0d14]/50 to-[#0d0d14]/10`} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d14]/60 via-transparent to-transparent" />
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
              style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(36px, 6vw, 72px)' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <span style={{ fontWeight: 300 }}>{hero.h1a}</span>
              <br />
              <span style={{ fontWeight: 800, fontStyle: 'italic' }}>{hero.h1b}</span>
            </motion.h1>

            <motion.p
              className="max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base"
              style={{ fontFamily: 'Inter, sans-serif' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease: 'easeOut' }}
            >
              {hero.sub}
            </motion.p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
