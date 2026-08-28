'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'
import type { StaticImageData } from 'next/image'
import { useLanguage } from '../context/LanguageContext'

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

const CARD_STATIC: { num: string; img: StaticImageData; icon: string }[] = [
  { num: '01', img: oneWayImg,    icon: _getSrc(icon1) },
  { num: '02', img: chauffeurImg, icon: _getSrc(icon2) },
  { num: '03', img: cityImg,      icon: _getSrc(icon3) },
  { num: '04', img: dayImg,       icon: _getSrc(icon4) },
  { num: '05', img: airportImg,   icon: _getSrc(icon5) },
]

type CardData = { num: string; img: StaticImageData; icon: string; title: string; desc: string; explore: string }

function useVh() {
  const [vh, setVh] = useState(0)
  useEffect(() => {
    const update = () => setVh(window.innerHeight)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return vh
}

function ServiceCard({
  card,
  index,
  containerRef,
  total,
}: {
  card: CardData
  index: number
  containerRef: React.RefObject<HTMLDivElement>
  total: number
}) {
  const targetScale = 1 - (total - 1 - index) * 0.03

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const cardScale = useTransform(
    scrollYProgress,
    [index / total, 1],
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
        <div
          className="relative w-full rounded-2xl"
          style={{
            background: '#111118',
            boxShadow: '0 12px 48px rgba(0,0,0,0.5)',
            height: 'clamp(340px, 55vw, 580px)',
          }}
        >
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <img
              src={(card.img as any).src ?? card.img}
              alt={card.title}
              className="w-full h-full object-cover object-center"
            />
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(180deg, rgba(102, 102, 102, 0) 0%, rgba(0, 0, 0, 1) 100%)',
              }}
            />
          </div>

          <span
            className="absolute top-5 left-5 text-white/50 text-sm tracking-widest select-none"
            style={{ fontFamily: 'Inter, sans-serif', fontVariantNumeric: 'tabular-nums' }}
          >
            {card.num}
          </span>

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
              {card.explore} <ArrowRight size={13} color="#D4FBFF" />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function ServicesSection() {
  const { trans } = useLanguage()
  const { services: svc } = trans
  const containerRef = useRef<HTMLDivElement>(null)
  const vh = useVh()

  const cards: CardData[] = CARD_STATIC.map((s, i) => ({
    ...s,
    title: svc.cards[i].title,
    desc: svc.cards[i].desc,
    explore: svc.explore,
  }))

  // On mobile (portrait), each card gets ~50vh of scroll; on larger screens 75vh.
  // vh===0 means SSR / not yet measured — fall back to 75vh so desktop SSR is correct.
  const perCard = vh > 0 && vh < 700 ? 50 : 75
  const sectionHeight = `${cards.length * perCard}vh`

  return (
    <section className="w-full bg-white">
      <div className="px-4 sm:px-8 pt-20 pb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-5">
          <span className="block h-px w-8" style={{ background: '#005C66' }} />
          <span
            className="text-xs tracking-[0.22em] uppercase font-medium"
            style={{ fontFamily: 'Inter, sans-serif', color: '#005C66' }}
          >
            {svc.label}
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
          {svc.h1}
          <br />
          <span style={{ fontWeight: 600, fontStyle: 'italic' }}>{svc.h2}</span>
        </h2>
        <p
          className="text-gray-400 leading-relaxed mx-auto px-6 sm:px-16 lg:px-28"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(13px, 1.5vw, 15px)',
          }}
        >
          {svc.sub}
        </p>
      </div>

      <div
        ref={containerRef}
        className="relative px-5 sm:px-8 lg:px-14"
        style={{ height: sectionHeight }}
      >
        {cards.map((card, i) => (
          <ServiceCard
            key={card.num}
            card={card}
            index={i}
            total={cards.length}
            containerRef={containerRef as React.RefObject<HTMLDivElement>}
          />
        ))}
      </div>

      <div className="h-20" />
    </section>
  )
}
