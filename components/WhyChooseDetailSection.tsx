'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import clearDiffImg from '../assets/why_chose_us/clear_differnece.jpg'
import aboutWhitelineImg from '../assets/why_chose_us/about_whiteline.png'

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
    <div
      ref={ref}
      className="overflow-hidden rounded-2xl w-full h-full"
    >
      <motion.img
        src={src}
        alt={alt}
        style={{ y, scale: 1.18 }}
        className="w-full h-full object-cover object-center"
      />
    </div>
  )
}

function Label({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="block h-px w-8" style={{ background: '#005C66' }} />
      <span
        className="text-xs tracking-[0.22em] uppercase font-medium"
        style={{ fontFamily: 'Inter, sans-serif', color: '#005C66' }}
      >
        {text}
      </span>
    </div>
  )
}

function useInView() {
  const ref = useRef<HTMLDivElement>(null)
  return { ref }
}

export default function WhyChooseDetailSection() {
  const { ref: ref1 } = useInView()
  const { ref: ref2 } = useInView()

  return (
    <section className="w-full bg-white" style={{ paddingTop: 96, paddingBottom: 96 }}>
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 flex flex-col gap-24">

        {/* ── Row 1: text left, image right ── */}
        <motion.div
          ref={ref1}
          className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Text */}
          <div className="flex-shrink-0 lg:w-[45%] flex flex-col justify-center">
            <h2
              className="text-[#111118] leading-tight mb-6"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: 'clamp(26px, 3.5vw, 42px)',
              }}
            >
              <span style={{ fontWeight: 400 }}>Why Leaders Choose White</span>
              <br />
              <span style={{ fontWeight: 400 }}>Line For </span>
              <span style={{ fontWeight: 800, fontStyle: 'italic' }}>Executive Travel</span>
            </h2>
            <p
              className="leading-relaxed"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(13px, 1.3vw, 15px)',
                color: '#6b7280',
              }}
            >
              In a fast-paced world where ordinary transportation often overlooks the finer nuances
              of comfort and security, White Line stands apart by treating every single journey as a
              true standard of distinction. We understand that for corporate leaders, dignitaries,
              and high-profile individuals, travel is not merely about reaching a physical
              destination—it is a critical extension of your professional standing, personal
              standards, and peace of mind.
            </p>
          </div>

          {/* Image */}
          <div className="flex-1 w-full" style={{ height: 'clamp(260px, 42vw, 500px)' }}>
            <ParallaxImage src={(clearDiffImg as any).src ?? clearDiffImg} alt="Luxury car beside private jet" />
          </div>
        </motion.div>

        {/* ── Row 2: image left, text right ── */}
        <motion.div
          ref={ref2}
          className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Image */}
          <div className="flex-1 w-full" style={{ height: 'clamp(260px, 42vw, 500px)' }}>
            <ParallaxImage src={(aboutWhitelineImg as any).src ?? aboutWhitelineImg} alt="Rolls Royce key and grille" />
          </div>

          {/* Text */}
          <div className="flex-shrink-0 lg:w-[45%] flex flex-col justify-center">
            <h2
              className="text-[#111118] leading-tight mb-6"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: 'clamp(26px, 3.5vw, 42px)',
              }}
            >
              <span style={{ fontWeight: 400 }}>Designed For </span>
              <span style={{ fontWeight: 800, fontStyle: 'italic' }}>Every Scale</span>
              <br />
              <span style={{ fontWeight: 400 }}>Of Corporate Travel</span>
            </h2>
            <p
              className="leading-relaxed"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(13px, 1.3vw, 15px)',
                color: '#6b7280',
              }}
            >
              True luxury is defined by effortless execution, and our operational philosophy is
              built to adapt seamlessly to your exact requirements, no matter the scale. Whether you
              require a single, highly confidential airport transfer for a key executive arrival or
              an entire luxury fleet reserved for a multi-day international corporate summit, our
              advanced logistics framework handles the complexity behind the scenes so you don't
              have to.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  )
}


