'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import s1 from '../assets/services_1/s_1.jpg'
import s2 from '../assets/services_1/s_2.jpg'
import s3 from '../assets/services_1/s_3.png'
import s4 from '../assets/services_1/s_4.jpg'
import s5 from '../assets/services_1/s_5.jpg'

const _src = (i: unknown): string => (i as any).src ?? (i as string)

const SERVICES = [
  {
    label: 'One-Way Ride',
    heading: (
      <>
        Direct{' '}
        <span style={{ fontWeight: 800, fontStyle: 'italic' }}>Point-To-Point</span>
        <br />Urban Transportation
      </>
    ),
    body: 'Experience seamless, point-to-point urban transportation meticulously designed for efficiency and elegance. Whether you are heading to a high-stakes corporate briefing, a private appointment, or a critical engagement across town, our direct transit service ensures you arrive promptly and completely composed, eliminating the stress of navigation, traffic management, and unnecessary detours.',
    img: _src(s1),
    imgRight: true,
  },
  {
    label: 'Hourly Chauffeur',
    heading: (
      <>
        On-Demand Hourly
        <br />
        <span style={{ fontWeight: 800, fontStyle: 'italic' }}>Chauffeur Service</span>
      </>
    ),
    body: 'Enjoy the ultimate convenience of dedicated mobility with a private chauffeur entirely at your disposal throughout the day. Designed for dynamic, ever-changing itineraries and multiple consecutive stops, this bespoke service offers unmatched flexibility, allowing you to move through your schedule at your own pace while your vehicle and driver remain ready and waiting nearby.',
    img: _src(s2),
    imgRight: false,
  },
  {
    label: 'City To City',
    heading: (
      <>
        <span style={{ fontWeight: 800, fontStyle: 'italic' }}>Long-Distance</span>{' '}
        Intercity
        <br />Executive Travel
      </>
    ),
    body: 'Bridge the distance between major metropolitan hubs in absolute comfort and tranquility. Our intercity travel service provides a smooth, private environment within an elite luxury vehicle, allowing you to relax, prepare for upcoming engagements, or conduct confidential business uninterrupted while traveling seamlessly across regions.',
    img: _src(s3),
    imgRight: true,
  },
  {
    label: 'Day Service',
    heading: (
      <>
        Dedicated Full-Day
        <br />
        <span style={{ fontWeight: 800, fontStyle: 'italic' }}>Professional Transport</span>
      </>
    ),
    body: "Secure a dedicated professional transportation partner for your entire day's schedule. Perfect for back-to-back corporate meetings, VIP hosting, and complex multi-location event itineraries, this comprehensive service guarantees continuous vehicle availability, flawless coordination, and uncompromised discretion from your first morning departure until late into the evening.",
    img: _src(s4),
    imgRight: false,
  },
  {
    label: 'Airport Transfer',
    heading: (
      <>
        Seamless{' '}
        <span style={{ fontWeight: 800, fontStyle: 'italic' }}>Airport Transfers</span>
        <br />&amp; Flight Tracking
      </>
    ),
    body: 'Start or conclude your international journey with absolute peace of mind through our premier airport transfer service. Featuring real-time flight tracking, proactive schedule adjustments for delayed flights, and professional luggage assistance, our chauffeurs ensure a smooth, effortless transition between the terminal and your final destination.',
    img: _src(s5),
    imgRight: true,
  },
]

function ParallaxImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <div
      ref={ref}
      style={{
        borderRadius: 'clamp(12px, 1.2vw, 18px)',
        overflow: 'hidden',
        width: '100%',
        aspectRatio: '4 / 3',
        position: 'relative',
      }}
    >
      <motion.img
        src={src}
        alt={alt}
        style={{
          y,
          scale: 1.18,
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />
    </div>
  )
}

function ServiceBlock({
  service,
  index,
}: {
  service: (typeof SERVICES)[0]
  index: number
}) {
  const isImgRight = service.imgRight

  const textBlock = (
    <motion.div
      className="flex flex-col justify-center w-full lg:flex-1 min-w-0"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Label */}
      <div className="flex items-center gap-2.5 mb-4">
        <span className="block h-px w-7 flex-shrink-0" style={{ background: '#005C66' }} />
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#005C66',
          }}
        >
          {service.label}
        </span>
      </div>

      {/* Heading */}
      <h2
        style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: 'clamp(24px, 3vw, 38px)',
          fontWeight: 300,
          lineHeight: 1.2,
          color: '#111118',
          marginBottom: 'clamp(14px, 2vw, 20px)',
        }}
      >
        {service.heading}
      </h2>

      {/* Body */}
      <p
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 'clamp(13px, 1.1vw, 15px)',
          lineHeight: 1.75,
          color: '#6b7280',
          marginBottom: 'clamp(22px, 3vw, 32px)',
          maxWidth: 480,
        }}
      >
        {service.body}
      </p>

      {/* CTA */}
      <button
        className="group relative inline-flex h-11 items-center justify-center overflow-hidden rounded-full self-start"
        style={{ fontFamily: 'Inter, sans-serif', background: '#005C66', border: 'none', cursor: 'pointer', minWidth: 160 }}
      >
        <span className="inline-flex h-11 items-center justify-center gap-2 px-6 text-white text-sm font-semibold transition duration-500 group-hover:-translate-y-[150%]">
          Explore Service <ArrowRight size={14} />
        </span>
        <span className="absolute inline-flex h-11 w-full translate-y-full items-center justify-center gap-2 transition duration-500 group-hover:translate-y-0">
          <span className="absolute h-full w-full translate-y-full skew-y-12 scale-y-0 bg-[#004d57] transition duration-500 group-hover:translate-y-0 group-hover:scale-150" />
          <span className="relative z-10 inline-flex items-center gap-2 text-white text-sm font-semibold">
            Explore Service <ArrowRight size={14} />
          </span>
        </span>
      </button>
    </motion.div>
  )

  const imageBlock = (
    <motion.div
      className="w-full lg:flex-1 min-w-0"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.85, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <ParallaxImage src={service.img} alt={service.label} />
    </motion.div>
  )

  return (
    <div
      className={`flex flex-col gap-10 lg:gap-14 items-center ${isImgRight ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
      style={{
        paddingBlock: 'clamp(40px, 5vw, 72px)',
        borderTop: index === 0 ? 'none' : '1px solid rgba(0,0,0,0.07)',
      }}
    >
      {textBlock}
      {imageBlock}
    </div>
  )
}

export default function ServicesListSection() {
  return (
    <section className="w-full bg-white" style={{ padding: 'clamp(72px, 9vw, 120px) 0 clamp(48px, 6vw, 80px)' }}>
      <div className="px-4 sm:px-6 lg:px-6 mx-auto" style={{ maxWidth: 1400 }}>

        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="block h-px w-8" style={{ background: '#005C66' }} />
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#005C66',
              }}
            >
              Our Services
            </span>
          </div>

          <h2
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 'clamp(28px, 4vw, 50px)',
              fontWeight: 300,
              lineHeight: 1.2,
              color: '#111118',
              marginBottom: 'clamp(14px, 2vw, 20px)',
            }}
          >
            One Destination Or Many.
            <br />
            <span style={{ fontWeight: 800, fontStyle: 'italic' }}>We&apos;ve Got The Ride.</span>
          </h2>

          <p
            className="mx-auto"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(13px, 1.1vw, 15px)',
              lineHeight: 1.75,
              color: '#9ca3af',
              maxWidth: 560,
            }}
          >
            WhiteLine delivers premium chauffeur transportation for people who value comfort,
            reliability, and exceptional service. From airport transfers to corporate journeys,
            every ride is designed to make growing more effortless.
          </p>
        </motion.div>

        {/* Service blocks */}
        {SERVICES.map((s, i) => (
          <ServiceBlock key={s.label} service={s} index={i} />
        ))}

      </div>
    </section>
  )
}
