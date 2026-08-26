'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import betterExpImg from '../assets/why_chose_us/better_exp.jpg'

const POINTS = [
  {
    num: '01',
    title: 'Prepared for Your Journey',
    desc: 'The vehicle is sanitized, equipped with charging options, and climate-set before you board.',
  },
  {
    num: '02',
    title: 'Connected From Booking to Arrival',
    desc: 'Instant confirmations, driver contact info, vehicle status, and invoice copies are always accessible.',
  },
  {
    num: '03',
    title: 'Designed Around You',
    desc: 'Save favorite routes, choose preferred interior setups, and tailor support requests easily.',
  },
]

export default function WhyChooseBetterExpSection() {
  const imgRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: imgRef,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <section className="w-full bg-white" style={{ padding: 'clamp(64px, 7vw, 100px) 0' }}>
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* ── Image with parallax ── */}
          <motion.div
            ref={imgRef}
            className="w-full lg:w-[48%] flex-shrink-0 overflow-hidden rounded-2xl"
            style={{ height: 'clamp(280px, 44vw, 540px)' }}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.95, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.img
              src={(betterExpImg as any).src ?? betterExpImg}
              alt="White-gloved chauffeur opening car door"
              style={{ y, scale: 1.18 }}
              className="w-full h-full object-cover object-center"
            />
          </motion.div>

          {/* ── Text ── */}
          <div className="flex-1 flex flex-col">

            {/* Label */}
            <motion.div
              className="flex items-center gap-3 mb-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <span className="block h-px w-8" style={{ background: '#005C66' }} />
              <span
                className="text-xs tracking-[0.22em] uppercase font-medium"
                style={{ fontFamily: 'Inter, sans-serif', color: '#005C66' }}
              >
                A Better Experience
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              className="text-[#111118] leading-tight mb-5"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: 'clamp(26px, 3.5vw, 44px)',
              }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.8, delay: 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <span style={{ fontWeight: 400 }}>Luxury Is How You </span>
              <span style={{ fontWeight: 800, fontStyle: 'italic' }}>Feel.</span>
            </motion.h2>

            {/* Body */}
            <motion.p
              className="leading-relaxed mb-8"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(13px, 1.3vw, 15px)',
                color: '#6b7280',
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.8, delay: 0.16, ease: 'easeOut' }}
            >
              We don't define luxury by expensive extras. For us, luxury is removing friction,
              keeping you secure, knowing your chauffeur is prepared, and having the information
              you need in a seamless way.
            </motion.p>

            {/* Points */}
            <div className="flex flex-col gap-6">
              {POINTS.map((p, i) => (
                <motion.div
                  key={p.num}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10% 0px' }}
                  transition={{ duration: 0.7, delay: 0.24 + i * 0.12, ease: 'easeOut' }}
                >
                  {/* Number badge */}
                  <div
                    className="flex-shrink-0 flex items-center justify-center rounded-lg"
                    style={{
                      width: 40,
                      height: 40,
                      background: 'rgba(0,92,102,0.10)',
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: 600,
                      fontSize: 13,
                      color: '#005C66',
                    }}
                  >
                    {p.num}
                  </div>

                  {/* Text */}
                  <div>
                    <p
                      className="mb-1"
                      style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: 700,
                        fontSize: 'clamp(14px, 1.2vw, 16px)',
                        color: '#111118',
                      }}
                    >
                      {p.title}
                    </p>
                    <p
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: 'clamp(13px, 1.1vw, 14px)',
                        color: '#6b7280',
                        lineHeight: 1.6,
                      }}
                    >
                      {p.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}


