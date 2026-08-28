'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import customerStoriesImg from '../assets/testimonials/customer_stories.jpg'
import reviewerImg from '../assets/home_customers/sultan.jpg'

const _src = (i: unknown): string => (i as any).src ?? (i as string)

export default function TestimonialsCustomerStoriesSection() {
  const { trans, dir } = useLanguage()
  const isRtl = dir === 'rtl'
  const { stories } = trans.testimonialsPage

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

        <motion.div {...fadeUp(0)} className="flex items-center gap-3 mb-5">
          <span className="block h-px w-8" style={{ background: '#005C66' }} />
          <span className="text-xs tracking-[0.22em] uppercase font-medium" style={{ fontFamily: 'Inter, sans-serif', color: '#005C66' }}>
            {stories.label}
          </span>
        </motion.div>

        <motion.h2 {...fadeUp(0.08)} className="text-[#111118] leading-tight mb-4" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(28px, 4vw, 52px)' }}>
          <span style={{ fontWeight: 300 }}>{stories.h1}</span>
          <br />
          <span style={{ fontWeight: 300 }}>{stories.h2a}</span>
          <span style={{ fontWeight: 800, fontStyle: 'italic' }}>{stories.h2b}</span>
        </motion.h2>

        <motion.p {...fadeUp(0.16)} className="leading-relaxed mb-14"
          style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(13px, 1.3vw, 15px)', color: '#6b7280', maxWidth: 640 }}>
          {stories.sub}
        </motion.p>

        <div className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12">
          <motion.div ref={imgRef} className="w-full lg:w-[52%] flex-shrink-0 overflow-hidden rounded-2xl"
            style={{ height: 'clamp(300px, 46vw, 560px)' }}
            initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }} transition={{ duration: 0.95, ease: [0.25, 0.46, 0.45, 0.94] }}>
            <motion.img src={_src(customerStoriesImg)} alt="Passenger in a premium White Line vehicle" style={{ y, scale: 1.18 }} className="w-full h-full object-cover object-center" />
          </motion.div>

          <motion.div {...fadeUp(0.2)} className="flex-1 flex">
            <div className="w-full flex flex-col justify-center rounded-2xl" style={{ background: '#f6f6f6', padding: 'clamp(32px, 4vw, 52px)' }}>
              <div className="flex items-center justify-center mb-8 flex-shrink-0" style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(0,92,102,0.10)' }}>
                <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: isRtl ? 'scaleX(-1)' : undefined }}>
                  <path d="M0 16V9.6C0 4.267 3.2 1.067 9.6 0L10.4 1.6C7.733 2.133 5.867 3.2 4.8 4.8 3.733 6.4 3.2 8 3.2 9.6H6.4V16H0ZM11.2 16V9.6C11.2 4.267 14.4 1.067 20.8 0L21.6 1.6C18.933 2.133 17.067 3.2 16 4.8 14.933 6.4 14.4 8 14.4 9.6H17.6V16H11.2Z" fill="#005C66" />
                </svg>
              </div>

              <motion.blockquote {...fadeUp(0.28)} className="text-[#111118] leading-snug mb-10 flex-1"
                style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 500, fontSize: 'clamp(18px, 2.2vw, 26px)', fontStyle: 'normal' }}>
                {stories.quote}
              </motion.blockquote>

              <div className="w-full mb-8" style={{ height: 1, background: '#e0e0e0' }} />

              <motion.div {...fadeUp(0.36)} className="flex items-center gap-4">
                <img src={_src(reviewerImg)} alt={stories.reviewerName}
                  style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center 15%', flexShrink: 0 }} />
                <div>
                  <p style={{ margin: 0, fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 'clamp(13px, 1.2vw, 15px)', color: '#111118' }}>
                    {stories.reviewerName}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#9ca3af' }}>{stories.reviewerRole}</span>
                    <span style={{ color: '#d1d5db', fontSize: 12 }}>•</span>
                    <span className="flex items-center gap-[3px]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#d4a017" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ))}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
