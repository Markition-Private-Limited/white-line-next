'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useRef } from 'react'
import Image from 'next/image'
import type { StaticImageData } from 'next/image'

import airportImg from '../assets/home_service/banners/airport_transfer.jpg'
import cityImg from '../assets/home_service/banners/city_to_city.jpg'
import dayImg from '../assets/home_service/banners/day_service.jpg'
import chauffeurImg from '../assets/home_service/banners/hourly_chauffer.jpg'
import oneWayImg from '../assets/home_service/banners/one_way_ride.jpg'

import icon1 from '../assets/home_service/banner_icon/1.svg'
import icon2 from '../assets/home_service/banner_icon/2.svg'
import icon3 from '../assets/home_service/banner_icon/3.svg'
import icon4 from '../assets/home_service/banner_icon/4.svg'
import icon5 from '../assets/home_service/banner_icon/5.svg'

const _getSrc = (i: unknown): string => (i as any).src ?? i as string
const CARDS: { num: string; title: string; desc: string; img: StaticImageData; icon: string }[] = [
  { num: '01', title: 'One-Way Ride', desc: 'Door-to-door premium transport from/to any destination, worry-less on budget.', img: oneWayImg, icon: _getSrc(icon1) },
  { num: '02', title: 'Hourly Chauffeur', desc: 'Book a driver on the hour, flexible throughout your busy schedule.', img: chauffeurImg, icon: _getSrc(icon2) },
  { num: '03', title: 'City to City', desc: 'Smooth and comfortable rides for all inter-city and regional trips.', img: cityImg, icon: _getSrc(icon3) },
  { num: '04', title: 'Day Service', desc: 'Professional transportation for meetings, events, and excursions.', img: dayImg, icon: _getSrc(icon4) },
  { num: '05', title: 'Airport Transfer', desc: 'Reliable and comfortable airport pick-ups and drop-offs with a professional chauffeur.', img: airportImg, icon: _getSrc(icon5) },
]

const TOTAL = CARDS.length

function ServiceCard({
  card,
  index,
  containerRef,
}: {
  card: (typeof CARDS)[0]
  index: number
  containerRef: React.RefObject<HTMLDivElement>
}) {
  const targetScale = 1 - (TOTAL - 1 - index) * 0.03

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const cardScale = useTransform(
    scrollYProgress,
    [index / TOTAL, 1],
    [1, targetScale]
  )

  return (
    <div
      className="sticky"
      style={{ top: `calc(80px + ${index * 28}px)` }}
    >
      <motion.div
        style={{ scale: cardScale, transformOrigin: 'top center' }}
        className="w-full"
      >
        {/* Card — no overflow-hidden here so icon badge border-radius isn't clipped */}
        <div
          className="relative w-full rounded-2xl"
          style={{
            background: '#111118',
            boxShadow: '0 12px 48px rgba(0,0,0,0.5)',
            height: 'clamp(340px, 55vw, 580px)',
          }}
        >
          {/* Image layer — overflow-hidden isolated so only the image is clipped */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <Image
              src={card.img}
              alt={card.title}
              fill
              placeholder="blur"
              sizes="(max-width: 768px) 100vw, 80vw"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(180deg, rgba(102, 102, 102, 0) 0%, rgba(0, 0, 0, 1) 100%)',
              }}
            />
          </div>

          {/* Number badge — top left */}
          <span
            className="absolute top-5 left-5 text-white/50 text-sm tracking-widest select-none"
            style={{ fontFamily: 'Inter, sans-serif', fontVariantNumeric: 'tabular-nums' }}
          >
            {card.num}
          </span>

          {/* Icon badge — top right, circle unaffected by parent overflow */}
          <div
            className="absolute top-4 right-4 flex items-center justify-center rounded-full"
            style={{
              width: 40,
              height: 40,
              background: 'rgba(255,255,255,0.25)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.35)',
            }}
          >
            <img src={card.icon} alt="" style={{ width: 18, height: 18 }} />
          </div>
          {/* Liquid glass text panel — floats over bottom of image */}
          <div
            className="absolute bottom-4 left-4 right-4"
            style={{
              borderRadius: 16,
              padding: 'clamp(14px, 2vw, 20px) clamp(16px, 2.5vw, 24px)',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(196,196,196,0.06) 100%)',
              backdropFilter: 'blur(22px) saturate(180%)',
              WebkitBackdropFilter: 'blur(22px) saturate(180%)',
              border: '1px solid rgba(255,255,255,0.28)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.35)',
            }}
          >
            <h3
              className="text-white font-semibold leading-tight mb-1.5"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: 'clamp(16px, 2.5vw, 22px)',
              }}
            >
              {card.title}
            </h3>
            <p
              className="text-white/60 leading-relaxed mb-3"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(11px, 1.3vw, 13px)',
              }}
            >
              {card.desc}
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-1.5 transition-opacity hover:opacity-80 underline underline-offset-2"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(11px, 1.2vw, 13px)',
                color: '#D4FBFF',
              }}
            >
              Explore Service <ArrowRight size={13} color="#D4FBFF" />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function ServicesSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section className="w-full bg-white">
      {/* Section header */}
      <div className="px-4 sm:px-8 pt-20 pb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-5">
          <span className="block h-px w-8" style={{ background: '#005C66' }} />
          <span
            className="text-xs tracking-[0.22em] uppercase font-medium"
            style={{ fontFamily: 'Inter, sans-serif', color: '#005C66' }}
          >
            Our Services
          </span>
        </div>
        <h2
          className="text-[#111118] leading-tight mb-5"
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 300,
            fontSize: 'clamp(26px, 5vw, 46px)',
          }}
        >
          One Destination Or Many.
          <br />
          <span style={{ fontWeight: 600, fontStyle: 'italic' }}>We&apos;ve Got The Ride.</span>
        </h2>
        <p
          className="text-gray-400 leading-relaxed mx-auto px-6 sm:px-16 lg:px-28"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(13px, 1.5vw, 15px)',
          }}
        >
          WhiteLane delivers premium chauffeur transportation for people who value comfort,
          reliability, and exceptional service. From airport transfers to corporate journeys,
          every ride is designed to make growing more effortless.
        </p>
      </div>

      {/* Sticky-stack scroll container — full width, modest horizontal padding */}
      <div
        ref={containerRef}
        className="relative px-5 sm:px-8 lg:px-14"
        style={{ height: `${TOTAL * 75}vh` }}
      >
        {CARDS.map((card, i) => (
          <ServiceCard
            key={card.num}
            card={card}
            index={i}
            containerRef={containerRef as React.RefObject<HTMLDivElement>}
          />
        ))}
      </div>

      <div className="h-20" />
    </section>
  )
}


