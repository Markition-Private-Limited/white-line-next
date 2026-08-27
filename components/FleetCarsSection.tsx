'use client'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import img1 from '../assets/fleet/fleet_cars/d7a80bcb54b44c54b0df892188432ffdfc7832d8.png'
import img2 from '../assets/fleet/fleet_cars/691599485e74e1d3cbb8f6c39f49aeb5578fd6ce.png'
import img3 from '../assets/fleet/fleet_cars/9730275ce37a79d956cf97018fd5d7efff9eb072.png'
import img4 from '../assets/fleet/fleet_cars/208b727d44b0f0f364eab26b26e4a6c6f4dd1023.png'
import img5 from '../assets/fleet/fleet_cars/b72b5ee7a8943ff9d478aabe4a4bbd0fa23fccdf.png'
import img6 from '../assets/fleet/fleet_cars/36800e847a857961e3d7c0fd3cc8835aee05145c.png'
import img7 from '../assets/fleet/fleet_cars/25cd92e464b804bdfc7f4a27308ef114179684b0.png'
import img8 from '../assets/fleet/fleet_cars/6a75308906f8c67411508668713c07fe55f39793.png'
import img9 from '../assets/fleet/fleet_cars/639d18797c086fe84ce95ce7557301142d447951.png'
import img10 from '../assets/fleet/fleet_cars/4c70f4f03240041de539d03744139b66eda22a26.png'
import img11 from '../assets/fleet/fleet_cars/cc573eb83a069359eb0890037edea448a1c9a76a.png'
import img12 from '../assets/fleet/fleet_cars/e2c45cff1dc5b2dd448267afe5a2b1566baba0f7.png'

const _src = (i: unknown): string => (i as any).src ?? (i as string)

type Category = 'All' | 'First Class' | 'Business Class' | 'SUV' | 'Sedan' | 'Van' | 'Coaster & Bus'

const FILTERS: Category[] = ['All', 'First Class', 'Business Class', 'SUV', 'Sedan', 'Van', 'Coaster & Bus']

const CARS: { name: string; desc: string; luggages: number; persons: number; category: Exclude<Category, 'All'>; img: string }[] = [
  { name: 'Mercedes-Benz E-Class', desc: 'Spacious, versatile, and elegant', luggages: 2, persons: 5, category: 'SUV', img: _src(img1) },
  { name: 'BMW 7 Series', desc: 'Spacious, versatile, and elegant', luggages: 2, persons: 5, category: 'First Class', img: _src(img2) },
  { name: 'Mercedes-Benz E-Class (AMG)', desc: 'Spacious, versatile, and elegant', luggages: 2, persons: 5, category: 'Business Class', img: _src(img3) },
  { name: 'BMW 5 Series', desc: 'Spacious, versatile, and elegant', luggages: 2, persons: 5, category: 'SUV', img: _src(img4) },
  { name: 'Mercedes-Benz V-Class', desc: 'Spacious, versatile, and elegant', luggages: 2, persons: 5, category: 'Business Class', img: _src(img5) },
  { name: 'Chevrolet Suburban', desc: 'Spacious, versatile, and elegant', luggages: 2, persons: 5, category: 'First Class', img: _src(img6) },
  { name: 'Chevrolet Tahoe', desc: 'Spacious, versatile, and elegant', luggages: 2, persons: 5, category: 'SUV', img: _src(img7) },
  { name: 'GMC Yukon XL', desc: 'Spacious, versatile, and elegant', luggages: 2, persons: 5, category: 'Business Class', img: _src(img8) },
  { name: 'GMC Yukon', desc: 'Spacious, versatile, and elegant', luggages: 2, persons: 5, category: 'First Class', img: _src(img9) },
  { name: 'Lexus ES350', desc: 'Spacious, versatile, and elegant', luggages: 2, persons: 5, category: 'Sedan', img: _src(img10) },
  { name: 'Hyundai Staria', desc: 'Spacious, versatile, and elegant', luggages: 2, persons: 5, category: 'Van', img: _src(img11) },
  { name: 'Toyota Coaster', desc: 'Spacious, versatile, and elegant', luggages: 2, persons: 5, category: 'Coaster & Bus', img: _src(img12) },
]

function LuggageIcon() {
  return (
    <svg width="14" height="15" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.8125 7.21875V15.0938C7.8125 15.1808 7.77958 15.2642 7.72097 15.3258C7.66237 15.3873 7.58288 15.4219 7.5 15.4219C7.41712 15.4219 7.33763 15.3873 7.27903 15.3258C7.22042 15.2642 7.1875 15.1808 7.1875 15.0938V7.21875C7.1875 7.13173 7.22042 7.04827 7.27903 6.98673C7.33763 6.92519 7.41712 6.89062 7.5 6.89062C7.58288 6.89062 7.66237 6.92519 7.72097 6.98673C7.77958 7.04827 7.8125 7.13173 7.8125 7.21875ZM10 6.89062C9.91712 6.89062 9.83763 6.92519 9.77903 6.98673C9.72042 7.04827 9.6875 7.13173 9.6875 7.21875V15.0938C9.6875 15.1808 9.72042 15.2642 9.77903 15.3258C9.83763 15.3873 9.91712 15.4219 10 15.4219C10.0829 15.4219 10.1624 15.3873 10.221 15.3258C10.2796 15.2642 10.3125 15.1808 10.3125 15.0938V7.21875C10.3125 7.13173 10.2796 7.04827 10.221 6.98673C10.1624 6.92519 10.0829 6.89062 10 6.89062ZM12.5 6.89062C12.4171 6.89062 12.3376 6.92519 12.279 6.98673C12.2204 7.04827 12.1875 7.13173 12.1875 7.21875V15.0938C12.1875 15.1808 12.2204 15.2642 12.279 15.3258C12.3376 15.3873 12.4171 15.4219 12.5 15.4219C12.5829 15.4219 12.6624 15.3873 12.721 15.3258C12.7796 15.2642 12.8125 15.1808 12.8125 15.0938V7.21875C12.8125 7.13173 12.7796 7.04827 12.721 6.98673C12.6624 6.92519 12.5829 6.89062 12.5 6.89062ZM15.9375 5.25V17.0625C15.9375 17.3236 15.8387 17.574 15.6629 17.7586C15.4871 17.9432 15.2486 18.0469 15 18.0469H13.4375V19.6875C13.4375 19.7745 13.4046 19.858 13.346 19.9195C13.2874 19.9811 13.2079 20.0156 13.125 20.0156C13.0421 20.0156 12.9626 19.9811 12.904 19.9195C12.8454 19.858 12.8125 19.7745 12.8125 19.6875V18.0469H7.1875V19.6875C7.1875 19.7745 7.15458 19.858 7.09597 19.9195C7.03737 19.9811 6.95788 20.0156 6.875 20.0156C6.79212 20.0156 6.71263 19.9811 6.65403 19.9195C6.59542 19.858 6.5625 19.7745 6.5625 19.6875V18.0469H5C4.75136 18.0469 4.5129 17.9432 4.33709 17.7586C4.16127 17.574 4.0625 17.3236 4.0625 17.0625V5.25C4.0625 4.98893 4.16127 4.73855 4.33709 4.55394C4.5129 4.36934 4.75136 4.26562 5 4.26562H7.1875V1.96875C7.1875 1.53363 7.35212 1.11633 7.64515 0.808653C7.93817 0.500976 8.3356 0.328125 8.75 0.328125H11.25C11.4552 0.328125 11.6584 0.370561 11.8479 0.45301C12.0375 0.535459 12.2098 0.656307 12.3549 0.808653C12.4999 0.960999 12.615 1.14186 12.6936 1.34091C12.7721 1.53996 12.8125 1.7533 12.8125 1.96875V4.26562H15C15.2486 4.26562 15.4871 4.36934 15.6629 4.55394C15.8387 4.73855 15.9375 4.98893 15.9375 5.25ZM7.8125 4.26562H12.1875V1.96875C12.1875 1.70768 12.0887 1.4573 11.9129 1.27269C11.7371 1.08809 11.4986 0.984375 11.25 0.984375H8.75C8.50136 0.984375 8.2629 1.08809 8.08709 1.27269C7.91127 1.4573 7.8125 1.70768 7.8125 1.96875V4.26562ZM15.3125 5.25C15.3125 5.16298 15.2796 5.07952 15.221 5.01798C15.1624 4.95645 15.0829 4.92188 15 4.92188H5C4.91712 4.92188 4.83763 4.95645 4.77903 5.01798C4.72042 5.07952 4.6875 5.16298 4.6875 5.25V17.0625C4.6875 17.1495 4.72042 17.233 4.77903 17.2945C4.83763 17.3561 4.91712 17.3906 5 17.3906H15C15.0829 17.3906 15.1624 17.3561 15.221 17.2945C15.2796 17.233 15.3125 17.1495 15.3125 17.0625V5.25Z" fill="#005C66"/>
    </svg>
  )
}

function PersonIcon() {
  return (
    <svg width="11" height="13" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 0C5.93913 0 4.92172 0.421427 4.17157 1.17157C3.42143 1.92172 3 2.93913 3 4C3 5.06087 3.42143 6.07828 4.17157 6.82843C4.92172 7.57857 5.93913 8 7 8C8.06087 8 9.07828 7.57857 9.82843 6.82843C10.5786 6.07828 11 5.06087 11 4C11 2.93913 10.5786 1.92172 9.82843 1.17157C9.07828 0.421427 8.06087 0 7 0ZM4 4C4 3.20435 4.31607 2.44129 4.87868 1.87868C5.44129 1.31607 6.20435 1 7 1C7.79565 1 8.55871 1.31607 9.12132 1.87868C9.68393 2.44129 10 3.20435 10 4C10 4.79565 9.68393 5.55871 9.12132 6.12132C8.55871 6.68393 7.79565 7 7 7C6.20435 7 5.44129 6.68393 4.87868 6.12132C4.31607 5.55871 4 4.79565 4 4ZM2.009 9C1.7456 8.99881 1.48456 9.04967 1.24087 9.14965C0.997178 9.24963 0.775636 9.39676 0.588965 9.58259C0.402293 9.76843 0.254169 9.98931 0.153097 10.2325C0.0520257 10.4758 -2.66686e-06 10.7366 1.02526e-10 11C1.02527e-10 12.691 0.833 13.966 2.135 14.797C3.417 15.614 5.145 16 7 16C8.855 16 10.583 15.614 11.865 14.797C13.167 13.967 14 12.69 14 11C14 10.4696 13.7893 9.96086 13.4142 9.58579C13.0391 9.21071 12.5304 9 12 9H2.009ZM1 11C1 10.447 1.448 10 2.009 10H12C12.2652 10 12.5196 10.1054 12.7071 10.2929C12.8946 10.4804 13 10.7348 13 11C13 12.309 12.378 13.284 11.327 13.953C10.257 14.636 8.735 15 7 15C5.265 15 3.743 14.636 2.673 13.953C1.623 13.283 1 12.31 1 11Z" fill="#005C66"/>
    </svg>
  )
}

function CarCard({ car, index }: { car: typeof CARS[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-6% 0px' }}
      transition={{ duration: 0.65, delay: (index % 3) * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col"
      style={{
        borderRadius: 14,
        overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.07)',
        background: '#fff',
      }}
    >
      {/* Image container */}
      <div className="relative" style={{ height: 'clamp(180px, 22vw, 260px)', background: '#0d1117' }}>
        <img
          src={car.img}
          alt={car.name}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Category badge */}
        <div
          className="absolute top-3 left-3 z-10 inline-flex items-center"
          style={{
            background: '#FFFFFF20',
            border: '1px solid #FFFFFF40',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderRadius: 4,
            padding: '4px 8px',
            height: 20,
          }}
        >
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 10,
              fontWeight: 600,
              lineHeight: 1,
              letterSpacing: 0,
              color: '#fff',
              textTransform: 'uppercase',
            }}
          >
            {car.category}
          </span>
        </div>

        {/* Gradient overlay — blends image into white card section below */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0) 70%, rgba(255,255,255,0.4) 84%, rgba(255,255,255,0.85) 94%, #FFFFFF 100%)',
          }}
        />
      </div>

      {/* Info */}
      <div className="flex flex-col" style={{ padding: 'clamp(14px, 2vw, 20px) clamp(14px, 2vw, 20px) clamp(16px, 2vw, 22px)' }}>
        <p
          className="mb-1"
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(15px, 1.4vw, 17px)',
            color: '#111118',
          }}
        >
          {car.name}
        </p>
        <p
          className="mb-4"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(12px, 1vw, 13px)',
            color: '#9ca3af',
          }}
        >
          {car.desc}
        </p>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5">
            <LuggageIcon />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#374151', fontWeight: 500 }}>
              {car.luggages} Luggages
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <PersonIcon />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#374151', fontWeight: 500 }}>
              {car.persons} Persons
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function FleetCarsSection() {
  const [active, setActive] = useState<Category>('All')
  const [filterScrolledPast, setFilterScrolledPast] = useState(false)
  const [sectionVisible, setSectionVisible] = useState(false)
  const filterBarRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const filterEl = filterBarRef.current
    const sectionEl = sectionRef.current
    if (!filterEl || !sectionEl) return

    const filterObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFilterScrolledPast(false)
        } else {
          setFilterScrolledPast(entry.boundingClientRect.top < 0)
        }
      },
      { threshold: 0, rootMargin: '-10px 0px 0px 0px' }
    )

    const sectionObs = new IntersectionObserver(
      ([entry]) => setSectionVisible(entry.isIntersecting),
      { threshold: 0 }
    )

    filterObs.observe(filterEl)
    sectionObs.observe(sectionEl)
    return () => { filterObs.disconnect(); sectionObs.disconnect() }
  }, [])

  const isFloating = filterScrolledPast && sectionVisible

  const handleFilterClick = (f: Category, fromFloating = false) => {
    setActive(f)
    if (fromFloating && gridRef.current) {
      const top = gridRef.current.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  const filtered = active === 'All' ? CARS : CARS.filter(c => c.category === active)

  return (
    <section ref={sectionRef} className="w-full bg-white" style={{ padding: 'clamp(64px, 8vw, 112px) 0' }}>
      <div className="px-6 sm:px-10 lg:px-16">

        {/* Label */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <span className="block h-px w-8" style={{ background: '#005C66' }} />
          <span
            className="text-xs tracking-[0.22em] uppercase font-medium"
            style={{ fontFamily: 'Inter, sans-serif', color: '#005C66' }}
          >
            Whiteline Fleet
          </span>
        </div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center text-[#111118] leading-tight mb-5"
          style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(26px, 4vw, 48px)' }}
        >
          <span style={{ fontWeight: 300 }}>An Elite Fleet Engineered For</span>
          <br />
          <span style={{ fontWeight: 300 }}>Supreme </span>
          <span style={{ fontWeight: 800, fontStyle: 'italic' }}>Comfort And Distinction</span>
        </motion.h2>

        {/* Body */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center leading-relaxed mb-10 mx-auto"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(13px, 1.2vw, 15px)',
            color: '#9ca3af',
            maxWidth: 620,
          }}
        >
          Our meticulously maintained collection of high-end vehicles represents the absolute
          pinnacle of automotive luxury. Each model in our fleet undergoes rigorous multi-point
          inspections and pristine detailing.
        </motion.p>

        {/* Filter tabs */}
        <div ref={filterBarRef} className="flex items-center justify-center flex-wrap gap-2 mb-10">
          {FILTERS.map((f) => {
            const isActive = active === f
            return isActive ? (
              <button
                key={f}
                onClick={() => handleFilterClick(f)}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 'clamp(12px, 1vw, 13px)',
                  fontWeight: 600,
                  padding: '8px 18px',
                  borderRadius: 999,
                  border: 'none',
                  background: '#005C66',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                {f}
              </button>
            ) : (
              <button
                key={f}
                onClick={() => handleFilterClick(f)}
                className="group relative overflow-hidden"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 'clamp(12px, 1vw, 13px)',
                  fontWeight: 400,
                  padding: '8px 18px',
                  borderRadius: 999,
                  border: '1px solid #e5e7eb',
                  background: '#fff',
                  color: '#6b7280',
                  cursor: 'pointer',
                  minHeight: 36,
                }}
              >
                <span className="inline-flex items-center transition duration-500 group-hover:-translate-y-[150%]">
                  {f}
                </span>
                <span className="absolute inset-0 inline-flex items-center justify-center translate-y-full transition duration-500 group-hover:translate-y-0">
                  <span className="absolute inset-0 skew-y-12 scale-y-0 bg-[#005C66] transition duration-500 translate-y-full group-hover:translate-y-0 group-hover:scale-150" />
                  <span className="relative z-10 font-semibold text-white" style={{ fontSize: 'clamp(12px, 1vw, 13px)', fontFamily: 'Inter, sans-serif' }}>
                    {f}
                  </span>
                </span>
              </button>
            )
          })}
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="grid gap-5"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))' }}
        >
          {filtered.map((car, i) => (
            <CarCard key={car.name} car={car} index={i} />
          ))}
        </div>

      </div>

      {/* Floating filter bar */}
      <AnimatePresence>
        {isFloating && (
          <motion.div
            key="floating-filters"
            initial={{ y: -72, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -72, opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            className="fixed top-4 left-0 right-0 z-30 flex justify-center px-4 pointer-events-none"
          >
            <div
              className="pointer-events-auto flex items-center gap-2"
              style={{
                background: 'rgba(255,255,255,0.94)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: 999,
                padding: '6px 10px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.13), 0 1px 0 rgba(255,255,255,0.8) inset',
                border: '1px solid rgba(0,0,0,0.07)',
                overflowX: 'auto',
                maxWidth: 'calc(100vw - 32px)',
                scrollbarWidth: 'none',
              }}
            >
              {FILTERS.map((f) => {
                const isActive = active === f
                return isActive ? (
                  <button
                    key={f}
                    onClick={() => handleFilterClick(f, true)}
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 13,
                      fontWeight: 600,
                      padding: '7px 16px',
                      borderRadius: 999,
                      border: 'none',
                      background: '#005C66',
                      color: '#fff',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {f}
                  </button>
                ) : (
                  <button
                    key={f}
                    onClick={() => handleFilterClick(f, true)}
                    className="group relative overflow-hidden"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 13,
                      fontWeight: 400,
                      padding: '7px 16px',
                      borderRadius: 999,
                      border: '1px solid #e5e7eb',
                      background: '#fff',
                      color: '#6b7280',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      minHeight: 34,
                    }}
                  >
                    <span className="inline-flex items-center transition duration-500 group-hover:-translate-y-[150%]">
                      {f}
                    </span>
                    <span className="absolute inset-0 inline-flex items-center justify-center translate-y-full transition duration-500 group-hover:translate-y-0">
                      <span className="absolute inset-0 skew-y-12 scale-y-0 bg-[#005C66] transition duration-500 translate-y-full group-hover:translate-y-0 group-hover:scale-150" />
                      <span className="relative z-10 font-semibold text-white" style={{ fontSize: 13, fontFamily: 'Inter, sans-serif' }}>
                        {f}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
