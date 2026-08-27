'use client'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Navbar from '../layouts/Navbar'
import fleetBanner from '../assets/fleet/fleet_banner.jpg'

const bannerSrc = typeof fleetBanner === 'string' ? fleetBanner : (fleetBanner as { src: string }).src

function SlideButton({ label, variant = 'filled', icon }: { label: string; variant?: 'filled' | 'outline'; icon?: React.ReactNode }) {
  const isFilled = variant === 'filled'
  return (
    <button
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

export default function FleetHero() {
  return (
    <div style={{ background: '#ffffff', padding: 'clamp(6px, 0.8vw, 10px)' }}>
      <section className="relative min-h-screen bg-[#0d0d14]" style={{ borderRadius: 'clamp(14px, 1.5vw, 20px)' }}>
        <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: 'inherit' }}>
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${bannerSrc})` }} />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d14]/90 via-[#0d0d14]/55 to-[#0d0d14]/10" />
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
              <span style={{ fontWeight: 300 }}>A </span>
              <span style={{ fontWeight: 800, fontStyle: 'italic' }}>Vehicle</span>
              <span style={{ fontWeight: 300 }}> For</span>
              <br />
              <span style={{ fontWeight: 300 }}>Every Occasion</span>
            </motion.h1>

            <motion.p
              className="mb-10 max-w-2xl text-sm leading-relaxed sm:text-base"
              style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.65)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease: 'easeOut' }}
            >
              Professional assistance for all your client support needs. Available 24/7 to
              handle every ticket, journey detail, dispatcher issue and unexpected delay.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55, ease: 'easeOut' }}
            >
              <SlideButton label="Explore Our Fleet" variant="filled" icon={<ArrowRight size={14} className="ml-1" />} />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
