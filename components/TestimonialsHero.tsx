'use client'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import Navbar from '../layouts/Navbar'
import Image from 'next/image'
import { useLanguage } from '../context/LanguageContext'
import banner from '../assets/testimonials/testimonials_banner.jpg'

export default function TestimonialsHero() {
  const { trans, dir } = useLanguage()
  const isRtl = dir === 'rtl'
  const { hero } = trans.testimonialsPage

  return (
    <div style={{ background: '#ffffff', padding: 'clamp(6px, 0.8vw, 10px)' }}>
      <section className="relative min-h-screen bg-[#0d0d14]" style={{ borderRadius: 'clamp(14px, 1.5vw, 20px)' }}>
        <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: 'inherit' }}>
          <Image src={banner} alt="Testimonials" fill priority sizes="100vw" style={{ objectFit: 'cover', objectPosition: 'center', transform: isRtl ? 'scaleX(-1)' : undefined }} />
          <div className={`absolute inset-0 ${isRtl ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-[#0d0d14]/90 via-[#0d0d14]/55 to-[#0d0d14]/10`} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d14]/70 via-transparent to-transparent" />
        </div>

        <Navbar />

        <div className="relative z-10 flex min-h-screen flex-col justify-center px-6 pb-10 pt-32 sm:px-10 lg:px-16">
          <motion.div className="max-w-2xl lg:max-w-4xl" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}>
            <motion.h1
              className="mb-6 leading-tight text-white"
              style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(36px, 6vw, 72px)' }}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <span style={{ fontWeight: 300 }}>{hero.h1a}</span>
              <br />
              <span style={{ fontWeight: 800, fontStyle: 'italic' }}>{hero.h1b}</span>
            </motion.h1>

            <motion.p className="mb-10 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base" style={{ fontFamily: 'Inter, sans-serif' }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.35, ease: 'easeOut' }}>
              {hero.sub}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.55, ease: 'easeOut' }}>
              <button className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full font-medium transition-shadow bg-transparent text-white border-2 border-white/60" style={{ fontFamily: 'Inter, sans-serif', minWidth: '220px' }}>
                <div className="inline-flex h-12 translate-y-0 items-center justify-center gap-2 px-6 transition duration-500 group-hover:-translate-y-[150%] text-white">
                  {hero.btn} {isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                </div>
                <div className="absolute inline-flex h-12 w-full translate-y-[100%] items-center justify-center gap-2 text-white transition duration-500 group-hover:translate-y-0">
                  <span className="absolute h-full w-full translate-y-full skew-y-12 scale-y-0 bg-white/20 transition duration-500 group-hover:translate-y-0 group-hover:scale-150" />
                  <span className="z-10 inline-flex items-center gap-2">{hero.btn} {isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}</span>
                </div>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
