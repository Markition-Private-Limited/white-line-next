'use client'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Navbar from '../layouts/Navbar'
import { useLanguage } from '../context/LanguageContext'
import banner from '../assets/why_chose_us/banner.webp'
// assets\why_chose_us\banner (1).webp

function SlideButton({ label, variant = 'filled', icon, href }: { label: string; variant?: 'filled' | 'outline'; icon?: React.ReactNode; href: string }) {
  const isFilled = variant === 'filled'
  return (
    <Link
      href={href}
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
    </Link>
  )
}

export default function WhyChooseUsHero() {
  const { trans, dir } = useLanguage()
  const isRtl = dir === 'rtl'
  const { hero } = trans.whyChooseUsPage
  const bannerSrc = typeof banner === 'string' ? banner : (banner as { src: string }).src
  return (
    <div style={{ background: '#ffffff', padding: 'clamp(6px, 0.8vw, 10px)' }}>
      <section className="relative min-h-screen bg-[#0d0d14]" style={{ borderRadius: 'clamp(14px, 1.5vw, 20px)' }}>
        <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: 'inherit' }}>
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${bannerSrc})`, transform: isRtl ? 'scaleX(-1)' : undefined }} />
          <div className={`absolute inset-0 ${isRtl ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-[#0d0d14]/90 via-[#0d0d14]/55 to-[#0d0d14]/10`} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d14]/70 via-transparent to-transparent" />
        </div>
        <Navbar />
        <div className="relative z-10 flex min-h-screen flex-col justify-center px-6 pb-10 pt-32 sm:px-10 lg:px-16">
          <motion.div className="max-w-xl lg:max-w-2xl" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}>
            <motion.h1
              className="mb-6 leading-tight text-white"
              style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(36px, 6vw, 72px)' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <span style={{ fontWeight: 400 }}>{hero.h1a}</span>
              <span style={{ fontWeight: 800, fontStyle: 'italic' }}>{hero.h1b}</span>
              <span style={{ fontWeight: 400 }}>{hero.h1c}</span>
              <br />
              <span style={{ fontWeight: 400 }}>{hero.h2}</span>
            </motion.h1>
            <motion.p className="mb-10 text-sm leading-relaxed text-white/70 sm:text-base" style={{ fontFamily: 'Inter, sans-serif' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.35, ease: 'easeOut' }}>
              {hero.sub}
            </motion.p>
            <motion.div className="flex flex-wrap gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.55, ease: 'easeOut' }}>
              <SlideButton label={hero.btn1} variant="filled" icon={isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />} href="/services" />
              <SlideButton label={hero.btn2} variant="outline" href="/fleet" />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}


