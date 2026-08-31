'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useLanguage } from '../context/LanguageContext'
import phoneMockup from '../assets/services_1/services/airport_transfer/4.png'
import scheduleIcon from '../assets/services_1/services/airport_transfer/hugeicons_time-schedule.svg'
import monitorIcon from '../assets/services_1/services/airport_transfer/lineicons_monitor.svg'
import welcomeIcon from '../assets/services_1/services/airport_transfer/mdi_human-welcome.svg'
import transitIcon from '../assets/services_1/services/airport_transfer/Vector.svg'
import type { ServiceDetailPageKey } from '../lib/serviceDetail'

const icons = [scheduleIcon, monitorIcon, welcomeIcon, transitIcon]

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
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

function StepCard({
  num,
  title,
  desc,
  iconSrc,
  delay,
  inView,
  isRtl,
}: {
  num: string
  title: string
  desc: string
  iconSrc: string
  delay: number
  inView: boolean
  isRtl: boolean
}) {
  const style: React.CSSProperties = {
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
  }

  return (
    <div
      className="flex flex-col gap-4 rounded-2xl p-6"
      style={{ background: '#f5f5f3', ...style }}
    >
      <div className={`flex items-start justify-between ${isRtl ? 'flex-row-reverse' : ''}`}>
        {/* Icon chip */}
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ background: 'rgba(0,92,102,0.10)' }}
        >
          <Image src={iconSrc} alt={title} width={20} height={20} />
        </div>
        {/* Step number */}
        <span
          className="text-sm font-light text-[#0d0d14]/30"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          {num}
        </span>
      </div>
      <h3
        className="text-lg font-semibold text-[#0d0d14]"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
      >
        {title}
      </h3>
      <p
        className="text-sm leading-relaxed text-[#0d0d14]/60"
        style={{ fontFamily: 'Inter, sans-serif', textAlign: isRtl ? 'right' : 'justify' }}
      >
        {desc}
      </p>
    </div>
  )
}

export default function AirportTransferStepsSection({ servicePage = 'airportTransferPage' }: { servicePage?: ServiceDetailPageKey }) {
  const { trans, dir } = useLanguage()
  const isRtl = dir === 'rtl'
  const { steps } = trans[servicePage]
  const appAlt = servicePage === 'hourlyBookingPage'
    ? 'Hourly Booking App'
    : servicePage === 'cityToCityPage'
      ? 'City-to-City Booking App'
      : servicePage === 'dayServicePage'
        ? 'Day Service Booking App'
        : servicePage === 'oneWayRidePage'
          ? 'One-Way Ride Booking App'
          : 'Airport Transfer App'
  const { ref, inView } = useInView()

  const headerFade: React.CSSProperties = {
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(28px)',
    transition: 'opacity 0.85s ease 0s, transform 0.85s ease 0s',
  }

  const [item0, item1, item2, item3] = steps.items

  return (
    <section style={{ background: '#ffffff', padding: 'clamp(6px, 0.8vw, 10px)', paddingTop: 0 }}>
      <div
        ref={ref}
        className="bg-white"
        style={{
          borderRadius: 'clamp(14px, 1.5vw, 20px)',
          padding: 'clamp(48px, 7vw, 100px) clamp(24px, 5vw, 80px)',
        }}
      >
        {/* Header */}
        <div className="mb-14 text-center" style={headerFade}>
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#005C66]" />
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ fontFamily: 'Inter, sans-serif', color: '#005C66' }}
            >
              {steps.label}
            </p>
          </div>
          <h2
            className="mb-4 text-[#0d0d14]"
            style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(26px, 3.8vw, 52px)', lineHeight: 1.2 }}
          >
            <span style={{ fontWeight: 300 }}>{steps.h1a} </span>
            <span style={{ fontWeight: 800, fontStyle: 'italic' }}>{steps.h1b}</span>
            <br />
            <span style={{ fontWeight: 300 }}>{steps.h2}</span>
          </h2>
          <p
            className="mx-auto max-w-2xl text-sm leading-relaxed text-[#0d0d14]/55"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {steps.sub}
          </p>
        </div>

        {/* Desktop: [left 2 cards] [phone] [right 2 cards] */}
        <div className="hidden lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-6 lg:items-center">
          {/* Left cards (steps 01 & 02) */}
          <div className="flex flex-col gap-5">
            <StepCard num={item0.num} title={item0.title} desc={item0.desc} iconSrc={icons[0]} delay={0.1} inView={inView} isRtl={isRtl} />
            <StepCard num={item1.num} title={item1.title} desc={item1.desc} iconSrc={icons[1]} delay={0.2} inView={inView} isRtl={isRtl} />
          </div>

          {/* Center phone mockup */}
          <div
            className="flex items-center justify-center px-6"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.9s ease 0.05s, transform 0.9s ease 0.05s',
            }}
          >
            <div className="relative" style={{ width: 'clamp(220px, 22vw, 310px)', aspectRatio: '9/18' }}>
              <Image
                src={phoneMockup}
                alt={appAlt}
                fill
                style={{ objectFit: 'contain' }}
                sizes="(max-width: 1024px) 50vw, 310px"
              />
            </div>
          </div>

          {/* Right cards (steps 03 & 04) */}
          <div className="flex flex-col gap-5">
            <StepCard num={item2.num} title={item2.title} desc={item2.desc} iconSrc={icons[2]} delay={0.1} inView={inView} isRtl={isRtl} />
            <StepCard num={item3.num} title={item3.title} desc={item3.desc} iconSrc={icons[3]} delay={0.2} inView={inView} isRtl={isRtl} />
          </div>
        </div>

        {/* Mobile: cards stacked, phone between step 2 and 3 */}
        <div className="flex flex-col gap-5 lg:hidden">
          <StepCard num={item0.num} title={item0.title} desc={item0.desc} iconSrc={icons[0]} delay={0.05} inView={inView} isRtl={isRtl} />
          <StepCard num={item1.num} title={item1.title} desc={item1.desc} iconSrc={icons[1]} delay={0.1} inView={inView} isRtl={isRtl} />

          {/* Phone mockup */}
          <div
            className="flex justify-center py-4"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.9s ease 0.15s, transform 0.9s ease 0.15s',
            }}
          >
            <div className="relative" style={{ width: '70vw', maxWidth: '280px', aspectRatio: '9/18' }}>
              <Image
                src={phoneMockup}
                alt={appAlt}
                fill
                style={{ objectFit: 'contain' }}
                sizes="70vw"
              />
            </div>
          </div>

          <StepCard num={item2.num} title={item2.title} desc={item2.desc} iconSrc={icons[2]} delay={0.2} inView={inView} isRtl={isRtl} />
          <StepCard num={item3.num} title={item3.title} desc={item3.desc} iconSrc={icons[3]} delay={0.25} inView={inView} isRtl={isRtl} />
        </div>
      </div>
    </section>
  )
}
