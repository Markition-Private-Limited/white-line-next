'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useLanguage } from '../context/LanguageContext'
import hourlyImg1 from '../assets/services_1/services/hourly/arabic-man-2.png'
import hourlyImg2 from '../assets/services_1/services/hourly/2.png'
import dayServiceImg3 from '../assets/services_1/services/day_service/3.png'

/* ── brand icons ─────────────────────────────────────────────────── */
function InstagramIcon() {
  return (
    <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" width={44} height={44}>
      <defs>
        <radialGradient id="ig-bg" cx="25%" cy="110%" r="140%" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#FFD600" />
          <stop offset="20%"  stopColor="#FF7A00" />
          <stop offset="45%"  stopColor="#FF0069" />
          <stop offset="75%"  stopColor="#C837AB" />
          <stop offset="100%" stopColor="#6559CA" />
        </radialGradient>
      </defs>
      <rect width="44" height="44" rx="11" fill="url(#ig-bg)" />
      <rect x="12" y="12" width="20" height="20" rx="5.5" stroke="white" strokeWidth="2.2" fill="none" />
      <circle cx="22" cy="22" r="5" stroke="white" strokeWidth="2.2" fill="none" />
      <circle cx="28.5" cy="15.5" r="1.6" fill="white" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" width={44} height={44}>
      <rect width="44" height="44" rx="11" fill="#1877F2" />
      <path d="M24.2 34V23.4H27.5l.5-4h-3.8v-2.6c0-1.15.32-1.94 2-1.94H28.1v-3.58A26 26 0 0 0 25.1 11c-3.6 0-6.1 2.2-6.1 6.25v3.15H15.9v4h3.1V34h5.2z" fill="white" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" width={44} height={44}>
      <rect width="44" height="44" rx="11" fill="#0A66C2" />
      <rect x="11" y="17.5" width="5.5" height="16.5" rx="1.2" fill="white" />
      <circle cx="13.75" cy="13.25" r="2.75" fill="white" />
      <path d="M20 34h5.5V25.4c0-2.1 1.1-3.8 3.3-3.8 2 0 3.2 1.4 3.2 3.8V34H37.5V24.6c0-5-2.8-7.4-6.8-7.4-2.8 0-4.5 1.4-5.2 2.7V17.5H20V34z" fill="white" />
    </svg>
  )
}

function WebsiteIcon() {
  return (
    <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" width={44} height={44}>
      <rect width="44" height="44" rx="11" fill="#1a1a2e" />
      <circle cx="22" cy="22" r="10" stroke="white" strokeWidth="2" fill="none" />
      <ellipse cx="22" cy="22" rx="5" ry="10" stroke="white" strokeWidth="2" fill="none" />
      <line x1="12" y1="18.5" x2="32" y2="18.5" stroke="white" strokeWidth="2" />
      <line x1="12" y1="25.5" x2="32" y2="25.5" stroke="white" strokeWidth="2" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" width={44} height={44}>
      <rect width="44" height="44" rx="11" fill="#25D366" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22 10C15.37 10 10 15.37 10 22c0 2.14.56 4.14 1.54 5.87L10 34l6.3-1.51A11.94 11.94 0 0 0 22 34c6.63 0 12-5.37 12-12S28.63 10 22 10zm-3.44 7.13c-.25-.56-.5-.57-.74-.58l-.63-.01c-.22 0-.57.08-.87.41-.3.33-1.14 1.11-1.14 2.71s1.17 3.14 1.33 3.36c.17.22 2.27 3.64 5.6 4.95 2.77 1.09 3.33.87 3.93.82.6-.06 1.93-.79 2.2-1.55.27-.76.27-1.41.19-1.55-.08-.14-.3-.22-.63-.39-.33-.17-1.93-.95-2.23-1.06-.3-.11-.52-.17-.73.17-.22.33-.84.94-.98 1.14-.14.19-.28.22-.61.08-.33-.17-1.4-.52-2.67-1.65-1-.9-1.67-2-1.87-2.34-.19-.33 0-.52.15-.68.13-.14.3-.38.45-.57.15-.2.2-.33.3-.55.1-.22.05-.41-.02-.58z"
        fill="white"
      />
    </svg>
  )
}

const ICONS: Record<string, React.ReactNode> = {
  Instagram: <InstagramIcon />,
  Facebook:  <FacebookIcon />,
  LinkedIn:  <LinkedInIcon />,
  Website:   <WebsiteIcon />,
  WhatsApp:  <WhatsAppIcon />,
  إنستغرام: <InstagramIcon />,
  فيسبوك:   <FacebookIcon />,
  لينكدإن:  <LinkedInIcon />,
  الموقع:   <WebsiteIcon />,
  واتساب:   <WhatsAppIcon />,
}

function useInViewOnce(threshold = 0.1) {
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

export default function SocialChannelsSection() {
  const { trans, dir } = useLanguage()
  const isRtl = dir === 'rtl'
  const { channels } = trans.socialsPage
  const { ref: sectionRef, inView } = useInViewOnce()

  const fadeUp = (delay = 0): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
  })

  const leftCol = (
    <div className="flex flex-col justify-center" style={fadeUp(0)}>
      <div className="mb-5 flex items-center gap-3">
        <span className="h-px w-8 bg-[#5d8a7a]" />
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ fontFamily: 'Inter, sans-serif', color: '#5d8a7a' }}>
          {channels.label}
        </p>
      </div>

      <h2 className="mb-3 leading-tight text-[#0d0d14]" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(26px, 3.5vw, 46px)', fontWeight: 700 }}>
        {channels.h1}
      </h2>
      <p className="mb-8 text-[#0d0d14]/55 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(13px, 1.1vw, 15px)' }}>
        {channels.sub}
      </p>

      {/* Social cards */}
      <div className="flex flex-col gap-3">
        {channels.items.map((item, i) => (
          <a
            key={i}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4"
            style={{
              ...fadeUp(0.05 + i * 0.07),
              textDecoration: 'none',
              background: '#f8f8fa',
              border: '1px solid rgba(13,13,20,0.07)',
              borderRadius: 14,
              padding: '14px 16px',
              transition: 'background 0.2s, border-color 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => {
              const t = e.currentTarget
              t.style.background = '#f0f6f4'
              t.style.borderColor = 'rgba(93,138,122,0.35)'
              t.style.boxShadow = '0 2px 12px rgba(93,138,122,0.12)'
            }}
            onMouseLeave={e => {
              const t = e.currentTarget
              t.style.background = '#f8f8fa'
              t.style.borderColor = 'rgba(13,13,20,0.07)'
              t.style.boxShadow = 'none'
            }}
          >
            <div className="flex-shrink-0">
              {ICONS[item.name] ?? <WebsiteIcon />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#0d0d14] leading-tight" style={{ fontFamily: 'Inter, sans-serif', fontSize: 14 }}>
                {item.name}
              </p>
              <p className="text-[#0d0d14]/45 text-xs mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                {item.desc}
              </p>
            </div>
            <div className="flex-shrink-0 w-8 h-8 rounded-full border border-[#0d0d14]/12 flex items-center justify-center group-hover:border-[#5d8a7a]/50 transition-colors duration-200" style={{ background: '#fff' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d={isRtl ? 'M10 7H4M7 4l-3 3 3 3' : 'M4 7h6M7 4l3 3-3 3'} stroke="#0d0d14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </a>
        ))}
      </div>
    </div>
  )

  const rightCol = (
    <div className="grid grid-cols-2 gap-3" style={{ ...fadeUp(0.2), minHeight: '420px' }}>
      {/* Large main image */}
      <div className="relative overflow-hidden rounded-2xl row-span-2" style={{ minHeight: '380px' }}>
        <Image
          src={hourlyImg1}
          alt="White Line luxury chauffeur experience"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{
            objectFit: 'cover',
            objectPosition: '30% 20%',
            filter: 'grayscale(1)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d14]/72 via-[#0d0d14]/20 to-transparent" />
        <div className="absolute bottom-5 left-5 right-5">
          <p className="text-[#5d8a7a] text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>
            {channels.gridLabel}
          </p>
          <p className="text-white leading-tight" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(18px, 2vw, 26px)', fontWeight: 300 }}>
            {channels.gridH1}
            <br />
            <em style={{ fontWeight: 800 }}>{channels.gridH2}</em>
          </p>
        </div>
      </div>

      {/* Top-right image */}
      <div className="relative overflow-hidden rounded-2xl" style={{ minHeight: '185px' }}>
        <Image
          src={hourlyImg2}
          alt="White Line fleet interior"
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
        <div className="absolute inset-0 bg-[#0d0d14]/50" />
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-white font-semibold leading-snug" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(13px, 1.4vw, 17px)' }}>
            {channels.gridSub1}<br />{channels.gridSub2}<br />
            {channels.gridSub3}<br />{channels.gridSub4}
          </p>
        </div>
      </div>

      {/* Bottom-right image */}
      <div className="relative overflow-hidden rounded-2xl" style={{ minHeight: '185px' }}>
        <Image
          src={dayServiceImg3}
          alt="White Line luxury interior"
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
        <div className="absolute inset-0 bg-[#0d0d14]/45" />
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-white font-semibold leading-snug" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(13px, 1.4vw, 17px)' }}>
            {channels.gridInfo1}<br />{channels.gridInfo2}<br />
            {channels.gridInfo3}<br />{channels.gridInfo4}
          </p>
        </div>
      </div>
    </div>
  )

  return (
    <section style={{ background: '#ffffff', padding: 'clamp(6px, 0.8vw, 10px)', paddingTop: 0 }}>
      <div
        ref={sectionRef}
        className="bg-white"
        style={{
          borderRadius: 'clamp(14px, 1.5vw, 20px)',
          padding: 'clamp(32px, 7vw, 100px) clamp(24px, 5vw, 80px)',
        }}
      >
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {isRtl ? (
            <>
              {rightCol}
              {leftCol}
            </>
          ) : (
            <>
              {leftCol}
              {rightCol}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
