'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useLanguage } from '../context/LanguageContext'
import { RadarGraphic } from './AppSection'
import helpCar from '../assets/socials/help-car.png'

export default function SocialsHelpSection() {
  const { trans, dir } = useLanguage()
  const isRtl = dir === 'rtl'
  const { help, channels } = trans.socialsPage
  const whatsapp = channels.items[4]
  const router = useRouter()
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-10% 0px' })

  return (
    <section
      ref={sectionRef}
      style={{ background: '#ffffff', padding: 'clamp(6px, 0.8vw, 10px)', paddingTop: 0, paddingBottom: 'clamp(6px, 0.8vw, 10px)' }}
    >
      <div
        className="relative overflow-hidden"
        style={{
          borderRadius: 'clamp(14px, 1.5vw, 20px)',
          background: '#0b3330',
          minHeight: 'clamp(260px, 30vw, 420px)',
        }}
      >
        {/* Car image — left half */}
        <motion.div
          className="absolute inset-y-0"
          style={{ ...(isRtl ? { right: 0 } : { left: 0 }), width: '55%' }}
          initial={{ opacity: 0, x: isRtl ? 50 : -50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={helpCar}
            alt="White Line luxury vehicle"
            fill
            sizes="55vw"
            style={{ objectFit: 'cover', objectPosition: 'center center', transform: isRtl ? 'scaleX(-1)' : undefined }}
          />
          {/* Fade the text-facing edge into dark green */}
          <div className="absolute inset-0" style={{ background: `linear-gradient(to ${isRtl ? 'left' : 'right'}, transparent 45%, #0b3330 100%)` }} />
          {/* Subtle bottom fade */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0b3330 0%, transparent 30%)' }} />
        </motion.div>

        <RadarGraphic
          style={{
            position: 'absolute',
            bottom: 0,
            ...(isRtl ? { left: '-4%', transform: 'rotate(85deg)' } : { right: '-4%', transform: 'rotate(275deg)' }),
            width: 'clamp(260px, 30%, 520px)',
            opacity: 0.6,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* Right content panel */}
        <div
          className="relative z-10 flex flex-col justify-center"
          style={{
            marginInlineStart: '45%',
            textAlign: 'start',
            padding: 'clamp(36px, 5vw, 60px) clamp(28px, 4vw, 52px)',
            minHeight: 'clamp(260px, 30vw, 420px)',
          }}
        >
          {/* Eyebrow */}
          <motion.p
            className="mb-3 text-[10px] font-semibold uppercase tracking-widest"
            style={{ fontFamily: 'Inter, sans-serif', color: '#5d8a7a' }}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {help.label}
          </motion.p>

          <motion.h2
            className="mb-3 leading-tight text-white"
            style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(22px, 3vw, 44px)', fontWeight: 700 }}
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.38 }}
          >
            {help.h1}
          </motion.h2>

          <motion.p
            className="mb-7 text-white/90 leading-relaxed"
            style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(12px, 1vw, 14px)', fontWeight: 500, maxWidth: 340 }}
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.46 }}
          >
            {help.sub}
          </motion.p>

          <div className="flex flex-wrap items-center gap-3">
          <motion.button
            onClick={() => router.push('/contact')}
            className="inline-flex items-center gap-2"
            style={{
              background: 'transparent',
              border: '1.5px solid rgba(255,255,255,0.5)',
              borderRadius: 50,
              padding: 'clamp(10px, 1.2vw, 13px) clamp(20px, 2.5vw, 28px)',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: 'clamp(12px, 1vw, 13px)',
              color: '#fff',
              letterSpacing: '0.02em',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.62 }}
            whileHover={{ borderColor: 'rgba(255,255,255,0.9)', scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {help.btn}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d={isRtl ? 'M10 7H4M7 4l-3 3 3 3' : 'M4 7h6M9 5l3 3-3 3'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>

          <motion.a
            href={whatsapp.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2"
            style={{
              background: '#25D366',
              borderRadius: 50,
              padding: 'clamp(10px, 1.2vw, 13px) clamp(20px, 2.5vw, 28px)',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: 'clamp(12px, 1vw, 13px)',
              color: '#fff',
              textDecoration: 'none',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.05-1.32A10 10 0 1 0 12 2zm5.2 13.9c-.22.62-1.29 1.19-1.8 1.27-.46.07-1.04.1-1.68-.1a15 15 0 0 1-1.52-.56c-2.67-1.15-4.41-3.84-4.54-4.02-.13-.18-1.08-1.43-1.08-2.73s.68-1.93.92-2.2c.24-.26.52-.33.7-.33h.5c.16 0 .38-.06.59.45.22.52.74 1.8.8 1.93.07.13.11.28.02.46-.09.18-.13.28-.26.43l-.4.46c-.13.13-.27.27-.12.53.15.26.67 1.1 1.44 1.78.99.88 1.83 1.15 2.09 1.28.26.13.41.11.56-.07.15-.18.65-.76.83-1.02.17-.26.35-.22.59-.13.24.09 1.5.71 1.76.84.26.13.43.2.5.3.06.11.06.63-.16 1.25z" />
            </svg>
            {whatsapp.name}
          </motion.a>
          </div>
        </div>
      </div>
    </section>
  )
}
