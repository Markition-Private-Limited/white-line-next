'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { Play } from 'lucide-react'
import guy1 from '../assets/testimonials/guy_1.jpg'
import guy2 from '../assets/testimonials/guy_2.jpg'
import guy3 from '../assets/testimonials/guy_3.jpg'

const _src = (i: unknown): string => (i as any).src ?? (i as string)

const VOICES = [
  { img: _src(guy1), name: 'Khalid Al-Mansouri', role: 'Chairman, Apex Group' },
  { img: _src(guy2), name: 'Tariq Al-Rashid',    role: 'Managing Director, Riyadh Capital' },
  { img: _src(guy3), name: 'Faisal Al-Zahrani',  role: 'CEO of Gulf Ventures' },
  { img: _src(guy1), name: 'Sultan Al-Harbi',     role: 'Executive Director, NovaCorp' },
  { img: _src(guy2), name: 'Nasser Al-Qassim',   role: 'Partner, Al-Qassim Holdings' },
]

const GAP = 'clamp(10px, 1.5vw, 18px)'

function VoiceCard({ voice, scrollYProgress }: { voice: typeof VOICES[0]; scrollYProgress: MotionValue<number> }) {
  const y = useTransform(scrollYProgress, [0, 1], ['-7%', '7%'])

  return (
    <div
      className="relative flex-shrink-0 overflow-hidden"
      style={{
        borderRadius: 'clamp(14px, 1.5vw, 20px)',
        aspectRatio: '3 / 4',
      }}
    >
      {/* Parallax image */}
      <motion.img
        src={voice.img}
        alt={voice.name}
        style={{ y, scale: 1.18, zIndex: 0, position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Bottom gradient — white fade */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0) 11.34%, rgba(255,255,255,0) 52%, #FFFFFF 100%)',
          zIndex: 1,
        }}
      />

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 2 }}>
        <button
          aria-label="Play testimonial"
          className="flex items-center justify-center rounded-full bg-white/90 transition-transform hover:scale-110 active:scale-95"
          style={{ width: 56, height: 56, boxShadow: '0 4px 20px rgba(0,0,0,0.25)' }}
        >
          <Play size={20} fill="#005C66" color="#005C66" style={{ marginLeft: 3 }} />
        </button>
      </div>

      {/* Name & role */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-5" style={{ zIndex: 2 }}>
        <p
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(14px, 1.4vw, 18px)',
            color: '#111118',
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {voice.name}
        </p>
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: 'clamp(11px, 1vw, 13px)',
            color: '#6b7280',
            margin: '4px 0 0',
          }}
        >
          {voice.role}
        </p>
      </div>
    </div>
  )
}

export default function TestimonialsVoicesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(3)

  useEffect(() => {
    const update = () => setVisible(window.innerWidth < 640 ? 1 : 3)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => { setIndex(0) }, [visible])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const maxIndex = VOICES.length - visible
  const prev = () => setIndex(i => Math.max(i - 1, 0))
  const next = () => setIndex(i => Math.min(i + 1, maxIndex))

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-10% 0px' },
    transition: { duration: 0.85, delay, ease: [0.25, 0.46, 0.45, 0.94] as const },
  })

  return (
    <section
      ref={sectionRef}
      className="w-full bg-white"
      style={{ padding: 'clamp(72px, 8vw, 112px) 0' }}
    >
      <div className="px-6 sm:px-10 lg:px-16">

        {/* Label */}
        <motion.div {...fadeUp(0)} className="flex items-center justify-center gap-3 mb-5">
          <span className="block h-px w-8" style={{ background: '#005C66' }} />
          <span
            className="text-xs tracking-[0.22em] uppercase font-medium"
            style={{ fontFamily: 'Inter, sans-serif', color: '#005C66' }}
          >
            Voices of Distinction
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          {...fadeUp(0.08)}
          className="text-center text-[#111118] leading-tight mb-5"
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: 'clamp(26px, 4vw, 52px)',
          }}
        >
          <span style={{ fontWeight: 300 }}>Trusted By Those Who Demand</span>
          <br />
          <span style={{ fontWeight: 800, fontStyle: 'italic' }}>Absolute Excellence</span>
        </motion.h2>

        {/* Body */}
        <motion.p
          {...fadeUp(0.16)}
          className="text-center leading-relaxed mb-14 mx-auto"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(13px, 1.3vw, 15px)',
            color: '#6b7280',
            maxWidth: 640,
          }}
        >
          Hear firsthand from the corporate leaders, dignitaries, and discerning travelers who rely
          on White Line to elevate their journeys, protect their privacy, and deliver uncompromised
          luxury across every mile.
        </motion.p>

        {/* Carousel with arrows */}
        <motion.div {...fadeUp(0.22)} className="relative">

          {/* Left arrow */}
          <button
            onClick={prev}
            disabled={index === 0}
            aria-label="Previous"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 flex items-center justify-center transition-opacity disabled:opacity-30"
            style={{
              width: 47.5,
              height: 50,
              borderRadius: 33,
              border: '1px solid #C7C7C7',
              background: '#FFFFFF',
              padding: 14,
            }}
          >
            <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.94888 0.163834C9.00945 0.108433 9.08034 0.0655044 9.1575 0.0375002C9.23466 0.00949593 9.31659 -0.0030359 9.39859 0.000620404C9.4806 0.00427671 9.56108 0.0240495 9.63545 0.0588097C9.70981 0.09357 9.7766 0.142637 9.832 0.203209C9.94389 0.32554 10.0026 0.487308 9.99522 0.652927C9.99156 0.734932 9.97179 0.815415 9.93703 0.889779C9.90227 0.964143 9.8532 1.03093 9.79263 1.08633L2.08263 8.12508H19.3714C19.5371 8.12508 19.6961 8.19093 19.8133 8.30814C19.9305 8.42535 19.9964 8.58432 19.9964 8.75008C19.9964 8.91584 19.9305 9.07482 19.8133 9.19203C19.6961 9.30924 19.5371 9.37508 19.3714 9.37508H2.08638L9.79263 16.4101C9.85328 16.4654 9.90245 16.5321 9.93731 16.6064C9.97218 16.6808 9.99207 16.7612 9.99584 16.8432C9.99961 16.9252 9.9872 17.0072 9.9593 17.0844C9.9314 17.1616 9.88857 17.2326 9.83325 17.2932C9.77793 17.3539 9.71121 17.403 9.63689 17.4379C9.56257 17.4728 9.48211 17.4927 9.4001 17.4964C9.3181 17.5002 9.23615 17.4878 9.15894 17.4599C9.08174 17.432 9.01078 17.3892 8.95013 17.3338L0.305125 9.44133C0.196769 9.34233 0.113173 9.21927 0.0610668 9.08205C0.00896012 8.94484 -0.0102011 8.79731 0.00512544 8.65133C0.0288877 8.42296 0.135636 8.21124 0.305125 8.05633L8.94888 0.163834Z" fill="#005C66"/>
            </svg>
          </button>

          {/* Cards viewport */}
          <div className="overflow-hidden">
            <div
              className="flex"
              style={{
                gap: GAP,
                transform: `translateX(calc(-${index} * (100% / ${visible} + ${GAP} / ${visible} * (${visible} - 1) / ${visible})))`,
                transition: 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {VOICES.map((v, i) => (
                <div
                  key={i}
                  style={{ width: `calc((100% - ${GAP} * ${visible - 1}) / ${visible})`, flexShrink: 0 }}
                >
                  <VoiceCard voice={v} scrollYProgress={scrollYProgress} />
                </div>
              ))}
            </div>
          </div>

          {/* Right arrow */}
          <button
            onClick={next}
            disabled={index >= Math.max(maxIndex, 0)}
            aria-label="Next"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 flex items-center justify-center transition-opacity disabled:opacity-30"
            style={{
              width: 47.5,
              height: 50,
              borderRadius: 33,
              border: '1px solid #C7C7C7',
              background: '#FFFFFF',
              padding: 14,
            }}
          >
            <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(180deg)' }}>
              <path d="M8.94888 0.163834C9.00945 0.108433 9.08034 0.0655044 9.1575 0.0375002C9.23466 0.00949593 9.31659 -0.0030359 9.39859 0.000620404C9.4806 0.00427671 9.56108 0.0240495 9.63545 0.0588097C9.70981 0.09357 9.7766 0.142637 9.832 0.203209C9.94389 0.32554 10.0026 0.487308 9.99522 0.652927C9.99156 0.734932 9.97179 0.815415 9.93703 0.889779C9.90227 0.964143 9.8532 1.03093 9.79263 1.08633L2.08263 8.12508H19.3714C19.5371 8.12508 19.6961 8.19093 19.8133 8.30814C19.9305 8.42535 19.9964 8.58432 19.9964 8.75008C19.9964 8.91584 19.9305 9.07482 19.8133 9.19203C19.6961 9.30924 19.5371 9.37508 19.3714 9.37508H2.08638L9.79263 16.4101C9.85328 16.4654 9.90245 16.5321 9.93731 16.6064C9.97218 16.6808 9.99207 16.7612 9.99584 16.8432C9.99961 16.9252 9.9872 17.0072 9.9593 17.0844C9.9314 17.1616 9.88857 17.2326 9.83325 17.2932C9.77793 17.3539 9.71121 17.403 9.63689 17.4379C9.56257 17.4728 9.48211 17.4927 9.4001 17.4964C9.3181 17.5002 9.23615 17.4878 9.15894 17.4599C9.08174 17.432 9.01078 17.3892 8.95013 17.3338L0.305125 9.44133C0.196769 9.34233 0.113173 9.21927 0.0610668 9.08205C0.00896012 8.94484 -0.0102011 8.79731 0.00512544 8.65133C0.0288877 8.42296 0.135636 8.21124 0.305125 8.05633L8.94888 0.163834Z" fill="#005C66"/>
            </svg>
          </button>

        </motion.div>
      </div>
    </section>
  )
}
