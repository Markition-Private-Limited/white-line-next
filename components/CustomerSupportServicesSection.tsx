'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import sectionImg from '../assets/customer_Support/2nd_section_image.png'
import headphones from '../assets/customer_Support/headphones.svg'
import booking from '../assets/customer_Support/booking_assistance.svg'
import cancellation from '../assets/customer_Support/cancellation.svg'
import rideIssues from '../assets/customer_Support/ride_ossues.svg'

const _src = (i: unknown): string => (i as any).src ?? (i as string)

const ICONS = [_src(headphones), _src(booking), _src(cancellation), _src(rideIssues)]

function ServiceCard({ icon, title, desc, delay }: { icon: string; title: string; desc: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.75, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col"
      style={{ background: '#f4f6f8', borderRadius: 16, padding: 'clamp(20px, 2.5vw, 32px)' }}
    >
      <div className="flex items-center justify-center mb-5 flex-shrink-0" style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(0,92,102,0.08)' }}>
        <img src={icon} alt={title} style={{ width: 22, height: 22 }} />
      </div>
      <p className="mb-3" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 'clamp(15px, 1.4vw, 18px)', color: '#111118', lineHeight: 1.25 }}>
        {title}
      </p>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(13px, 1.1vw, 14px)', color: '#6b7280', lineHeight: 1.65 }}>
        {desc}
      </p>
    </motion.div>
  )
}

export default function CustomerSupportServicesSection() {
  const { trans } = useLanguage()
  const { services: s } = trans.customerSupportPage

  const imgRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: imgRef, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-10% 0px' },
    transition: { duration: 0.85, delay, ease: [0.25, 0.46, 0.45, 0.94] as const },
  })

  return (
    <section className="w-full bg-white" style={{ padding: 'clamp(72px, 8vw, 112px) 0' }}>
      <div className="px-6 sm:px-10 lg:px-16">

        <motion.div {...fadeUp(0)} className="flex items-center justify-center gap-3 mb-5">
          <span className="block h-px w-8" style={{ background: '#005C66' }} />
          <span className="text-xs tracking-[0.22em] uppercase font-medium" style={{ fontFamily: 'Inter, sans-serif', color: '#005C66' }}>
            {s.label}
          </span>
        </motion.div>

        <motion.h2 {...fadeUp(0.08)} className="text-center text-[#111118] leading-tight mb-5" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(28px, 4vw, 52px)' }}>
          <span style={{ fontWeight: 300 }}>{s.h1}</span>
          <br />
          <span style={{ fontWeight: 300 }}>{s.h2a}</span>
          <span style={{ fontWeight: 800, fontStyle: 'italic' }}>{s.h2b}</span>
        </motion.h2>

        <motion.p {...fadeUp(0.16)} className="text-center leading-relaxed mb-14 mx-auto"
          style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(13px, 1.3vw, 15px)', color: '#6b7280', maxWidth: 680 }}>
          {s.sub}
        </motion.p>

        <div className="flex flex-col lg:flex-row gap-5 lg:gap-6 items-stretch">
          <div className="flex flex-col gap-5 flex-1">
            <ServiceCard icon={ICONS[0]} title={s.cards[0].title} desc={s.cards[0].desc} delay={0.1} />
            <ServiceCard icon={ICONS[1]} title={s.cards[1].title} desc={s.cards[1].desc} delay={0.2} />
          </div>

          <motion.div ref={imgRef} className="w-full lg:w-[38%] flex-shrink-0 overflow-hidden"
            style={{ borderRadius: 'clamp(16px, 1.8vw, 22px)', height: 'clamp(300px, 48vw, 600px)' }}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }} transition={{ duration: 0.95, ease: [0.25, 0.46, 0.45, 0.94] }}>
            <motion.img src={_src(sectionImg)} alt="Luxury car interior" style={{ y, scale: 1.18 }} className="w-full h-full object-cover object-center" />
          </motion.div>

          <div className="flex flex-col gap-5 flex-1">
            <ServiceCard icon={ICONS[2]} title={s.cards[2].title} desc={s.cards[2].desc} delay={0.1} />
            <ServiceCard icon={ICONS[3]} title={s.cards[3].title} desc={s.cards[3].desc} delay={0.2} />
          </div>
        </div>
      </div>
    </section>
  )
}
