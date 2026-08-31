'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import clearDiffImg from '../assets/why_chose_us/clear_differnece.jpg'
import aboutWhitelineImg from '../assets/why_chose_us/about_whiteline.png'
import { useLanguage } from '../context/LanguageContext'

function ParallaxImage({
  src,
  alt,
}: {
  src: string
  alt: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <div ref={ref} className="overflow-hidden rounded-2xl w-full h-full">
      <motion.img
        src={src}
        alt={alt}
        style={{ y, scale: 1.18 }}
        className="w-full h-full object-cover object-center"
      />
    </div>
  )
}

export default function WhyChooseDetailSection() {
  const { trans, dir } = useLanguage()
  const isRtl = dir === 'rtl'
  const { detail } = trans.whyChooseUsPage

  return (
    <section className="w-full bg-white" style={{ paddingTop: 96, paddingBottom: 96 }}>
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 flex flex-col gap-24">

        {/* ── Row 1: text left, image right (flipped for RTL) ── */}
        <motion.div
          className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {isRtl ? (
            <>
              {/* RTL: image first (visual left) */}
              <div className="flex-1 w-full" style={{ height: 'clamp(260px, 42vw, 500px)' }}>
                <ParallaxImage src={(clearDiffImg as any).src ?? clearDiffImg} alt="Luxury car beside private jet" />
              </div>
              <div className="flex-shrink-0 lg:w-[45%] flex flex-col justify-center">
                <h2
                  className="text-[#111118] leading-tight mb-6"
                  style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(26px, 3.5vw, 42px)' }}
                >
                  <span style={{ fontWeight: 400 }}>{detail.row1.h1}</span>
                  <br />
                  <span style={{ fontWeight: 800, fontStyle: 'italic' }}>{detail.row1.h2}</span>
                </h2>
                <p
                  className="leading-relaxed"
                  style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(13px, 1.3vw, 15px)', color: '#6b7280', textAlign: 'start' }}
                >
                  {detail.row1.body}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="flex-shrink-0 lg:w-[45%] flex flex-col justify-center">
                <h2
                  className="text-[#111118] leading-tight mb-6"
                  style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(26px, 3.5vw, 42px)' }}
                >
                  <span style={{ fontWeight: 400 }}>{detail.row1.h1}</span>
                  <br />
                  <span style={{ fontWeight: 800, fontStyle: 'italic' }}>{detail.row1.h2}</span>
                </h2>
                <p
                  className="leading-relaxed"
                  style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(13px, 1.3vw, 15px)', color: '#6b7280' }}
                >
                  {detail.row1.body}
                </p>
              </div>
              <div className="flex-1 w-full" style={{ height: 'clamp(260px, 42vw, 500px)' }}>
                <ParallaxImage src={(clearDiffImg as any).src ?? clearDiffImg} alt="Luxury car beside private jet" />
              </div>
            </>
          )}
        </motion.div>

        {/* ── Row 2: image left, text right (flipped for RTL) ── */}
        <motion.div
          className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {isRtl ? (
            <>
              <div className="flex-shrink-0 lg:w-[45%] flex flex-col justify-center">
                <h2
                  className="text-[#111118] leading-tight mb-6"
                  style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(26px, 3.5vw, 42px)' }}
                >
                  <span style={{ fontWeight: 400 }}>{detail.row2.h1}</span>
                  <span style={{ fontWeight: 800, fontStyle: 'italic' }}>{detail.row2.h2}</span>
                  <br />
                  <span style={{ fontWeight: 400 }}>{detail.row2.h3}</span>
                </h2>
                <p
                  className="leading-relaxed"
                  style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(13px, 1.3vw, 15px)', color: '#6b7280', textAlign: 'start' }}
                >
                  {detail.row2.body}
                </p>
              </div>
              <div className="flex-1 w-full" style={{ height: 'clamp(260px, 42vw, 500px)' }}>
                <ParallaxImage src={(aboutWhitelineImg as any).src ?? aboutWhitelineImg} alt="Rolls Royce key and grille" />
              </div>
            </>
          ) : (
            <>
              <div className="flex-1 w-full" style={{ height: 'clamp(260px, 42vw, 500px)' }}>
                <ParallaxImage src={(aboutWhitelineImg as any).src ?? aboutWhitelineImg} alt="Rolls Royce key and grille" />
              </div>
              <div className="flex-shrink-0 lg:w-[45%] flex flex-col justify-center">
                <h2
                  className="text-[#111118] leading-tight mb-6"
                  style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(26px, 3.5vw, 42px)' }}
                >
                  <span style={{ fontWeight: 400 }}>{detail.row2.h1}</span>
                  <span style={{ fontWeight: 800, fontStyle: 'italic' }}>{detail.row2.h2}</span>
                  <br />
                  <span style={{ fontWeight: 400 }}>{detail.row2.h3}</span>
                </h2>
                <p
                  className="leading-relaxed"
                  style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(13px, 1.3vw, 15px)', color: '#6b7280' }}
                >
                  {detail.row2.body}
                </p>
              </div>
            </>
          )}
        </motion.div>

      </div>
    </section>
  )
}
