'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import img1 from '../assets/home_why_choose/1.jpg'
import img2 from '../assets/home_why_choose/2.jpg'
import img3 from '../assets/home_why_choose/3.jpg'

const MotionImage = motion.create(Image)

function SlideButton({ label, icon, onClick }: { label: string; icon?: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full font-medium bg-[#005C66] text-white border-2 border-[#005C66]"
      style={{ fontFamily: 'Inter, sans-serif', minWidth: '160px' }}
    >
      <div className="inline-flex h-12 translate-y-0 items-center justify-center gap-2 px-6 transition duration-500 group-hover:-translate-y-[150%] text-white">
        {label}{icon}
      </div>
      <div className="absolute inline-flex h-12 w-full translate-y-[100%] items-center justify-center gap-2 text-white transition duration-500 group-hover:translate-y-0">
        <span className="absolute h-full w-full translate-y-full skew-y-12 scale-y-0 transition duration-500 group-hover:translate-y-0 group-hover:scale-150 bg-[#0a3b3c]" />
        <span className="z-10 inline-flex items-center gap-2">{label}{icon}</span>
      </div>
    </button>
  )
}

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true) },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

export default function WhyChooseSection() {
  const router = useRouter()
  const { ref, inView } = useInView(0.15)

  // Parallax scroll tracking on the section itself
  const { scrollYProgress } = useScroll({
    target: ref as React.RefObject<HTMLElement>,
    offset: ['start end', 'end start'],
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [80, -80])   // large left image
  const y2 = useTransform(scrollYProgress, [0, 1], [50, -50])   // top-right image
  const y3 = useTransform(scrollYProgress, [0, 1], [110, -110]) // bottom-right (fastest)

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 32 },
    animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 },
    transition: { duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] as const },
  })

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="w-full bg-white py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-10 lg:px-16">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">

          {/* ── Left: text ── */}
          <div className="flex-shrink-0 lg:w-[38%]">
            <motion.h2
              {...fadeUp(0)}
              className="text-[#111118] leading-tight mb-6"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 400,
                fontSize: 'clamp(28px, 4vw, 44px)',
              }}
            >
              Why Choose{' '}
              <span style={{ fontWeight: 700, fontStyle: 'italic' }}>Whiteline</span>
            </motion.h2>

            <motion.p
              {...fadeUp(0.15)}
              className="text-gray-400 leading-relaxed mb-8"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(13px, 1.4vw, 15px)',
              }}
            >
              Elevate your travel experience with White Line, where distinction between standard
              transit &amp; premium service is found in every meticulously detail. We replace
              uncertainty of traditional transport with uncompromising reliability.
            </motion.p>

            <motion.div {...fadeUp(0.28)}>
              <SlideButton label="Read More" icon={<ArrowRight size={14} />} onClick={() => router.push('/why-choose-us')} />
            </motion.div>
          </div>

          {/* ── Right: image grid ── */}
          <motion.div
            className="flex-1 grid gap-3"
            style={{
              gridTemplateColumns: '1.55fr 1fr',
              gridTemplateRows: '1fr 1fr',
              height: 'clamp(300px, 42vw, 480px)',
            }}
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Large image — spans both rows */}
            <div className="overflow-hidden rounded-2xl relative" style={{ gridRow: '1 / 3' }}>
              <MotionImage
                src={img1}
                alt="Luxury car on city street"
                fill
                placeholder="blur"
                sizes="(max-width: 1024px) 60vw, 35vw"
                style={{ objectFit: 'cover', objectPosition: 'center', y: y1, scale: 1.18 }}
                whileHover={{ scale: 1.26 }}
                transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            </div>

            {/* Top-right — fills exactly the first row */}
            <div className="overflow-hidden rounded-2xl relative">
              <MotionImage
                src={img2}
                alt="Chauffeur opening car door"
                fill
                placeholder="blur"
                sizes="(max-width: 1024px) 40vw, 22vw"
                style={{ objectFit: 'cover', objectPosition: 'center', y: y2, scale: 1.18 }}
                whileHover={{ scale: 1.26 }}
                transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            </div>

            {/* Bottom-right — fills exactly the second row */}
            <div className="overflow-hidden rounded-2xl relative">
              <MotionImage
                src={img3}
                alt="Chauffeur assisting passenger"
                fill
                placeholder="blur"
                sizes="(max-width: 1024px) 40vw, 22vw"
                style={{ objectFit: 'cover', objectPosition: 'center', y: y3, scale: 1.18 }}
                whileHover={{ scale: 1.26 }}
                transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}


