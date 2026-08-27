'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, ChevronDown, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import hamburgerSvg from '../assets/home/hamburger.svg'
import logoSvg from '../assets/fav_icon_black.svg'

function USFlag() {
  const W = 22, H = 16
  const sh = H / 13
  const cw = W * 0.385
  const ch = sh * 7

  // 50 stars: 9 rows alternating 6 and 5
  const stars: [number, number][] = []
  const rows = [6, 5, 6, 5, 6, 5, 6, 5, 6]
  const rh = ch / 10
  rows.forEach((count, r) => {
    const gap = cw / (count + 1)
    for (let c = 0; c < count; c++) {
      stars.push([gap * (c + 1), rh * 0.75 + r * rh])
    }
  })

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 2, flexShrink: 0, display: 'block' }}>
      <defs>
        <clipPath id="uf">
          <rect width={W} height={H} rx="1.6" />
        </clipPath>
      </defs>
      <g clipPath="url(#uf)">
        {Array.from({ length: 13 }, (_, i) => (
          <rect key={i} x={0} y={i * sh} width={W} height={sh} fill={i % 2 === 0 ? '#B22234' : '#FFFFFF'} />
        ))}
        <rect x={0} y={0} width={cw} height={ch} fill="#3C3B6E" />
        {stars.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={0.55} fill="#FFFFFF" />
        ))}
      </g>
    </svg>
  )
}

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Fleet', to: '/fleet' },
  { label: 'B2B', to: '/b2b/login' },
  { label: 'Contact Us', to: '/contact' },
]

const BUTTON_BG = [
  'linear-gradient(0deg, rgba(0,92,102,0.55), rgba(0,92,102,0.55))',
  'linear-gradient(238.54deg, rgba(77,77,77,0.45) 4.12%, rgba(218,218,218,0.45) 48.47%, rgba(77,77,77,0.45) 86.31%)',
].join(', ')

export default function Navbar({ solid = false }: { solid?: boolean }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden'
      window.dispatchEvent(new CustomEvent('lenis:stop'))
    } else {
      document.body.style.overflow = ''
      window.dispatchEvent(new CustomEvent('lenis:start'))
    }
    return () => {
      document.body.style.overflow = ''
      window.dispatchEvent(new CustomEvent('lenis:start'))
    }
  }, [drawerOpen])

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false) }, [pathname])

  const isActive = (to: string) => to === '/' ? pathname === '/' : pathname.startsWith(to)

  const linkColor = solid
    ? (to: string) => isActive(to) ? '#005C66' : '#374151'
    : (to: string) => isActive(to) ? '#ffffff' : 'rgba(255,255,255,0.75)'

  return (
    <>
      <nav
        className={solid ? 'relative z-20 w-full' : 'absolute top-0 left-0 right-0 z-20'}
        style={solid ? { background: '#ffffff', borderBottom: '1px solid #e5e7eb', padding: '0 clamp(16px, 3vw, 40px)' } : { padding: '16px 24px' }}
      >
        <div
          className="mx-auto flex max-w-7xl items-center justify-between"
          style={solid ? { height: 64 } : { background: 'transparent', border: '1px solid #4A4F4B', borderRadius: 999, padding: '12px 20px' }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <img
              src={logoSvg.src ?? logoSvg}
              alt="White Line logo"
              style={{ width: 28, height: 30, filter: solid ? 'none' : 'brightness(0) invert(1)' }}
            />
            <span
              className="font-semibold tracking-[0.18em] text-sm uppercase"
              style={{ fontFamily: 'Montserrat, sans-serif', color: solid ? '#111118' : '#fff' }}
            >
              White Line
            </span>
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden lg:flex items-center gap-7 list-none m-0 p-0">
            {NAV_LINKS.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.to}
                  className="flex items-center gap-1 transition-colors text-sm font-medium"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    color: linkColor(item.to),
                  }}
                >
                  {item.label}
                  {item.dropdown && <ChevronDown size={14} className="opacity-70" />}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button
              className="hidden md:flex items-center gap-1.5 text-sm transition-colors"
              style={{ fontFamily: 'Inter, sans-serif', color: solid ? '#374151' : 'rgba(255,255,255,0.9)' }}
            >
              <USFlag />
              <span>English</span>
              <ChevronDown size={14} className="opacity-70" />
            </button>

            <button
              className="group hidden sm:inline-flex relative h-10 items-center justify-center overflow-hidden rounded-full text-sm font-semibold"
              style={{
                fontFamily: 'Inter, sans-serif',
                background: solid ? '#005C66' : BUTTON_BG,
                border: solid ? 'none' : '1px solid rgba(255,255,255,0.18)',
                color: '#fff',
                minWidth: 140,
              }}
            >
              <span className="inline-flex items-center px-5 transition duration-500 group-hover:-translate-y-[150%]">Download Now</span>
              <span className="absolute inline-flex h-full w-full translate-y-[100%] items-center justify-center transition duration-500 group-hover:translate-y-0">
                <span className={`absolute inset-0 translate-y-full skew-y-12 scale-y-0 transition duration-500 group-hover:translate-y-0 group-hover:scale-150 ${solid ? 'bg-[#004d57]' : 'bg-white/20'}`} />
                <span className="relative z-10 inline-flex items-center gap-1.5">Download Now <ArrowUpRight size={13} /></span>
              </span>
            </button>

            <button
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full transition-colors"
              style={{
                border: solid ? '1px solid #e5e7eb' : '1px solid rgba(255,255,255,0.15)',
              }}
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              <img
                src={hamburgerSvg.src ?? hamburgerSvg}
                alt=""
                style={{ width: 18, height: 18, filter: solid ? 'brightness(0)' : 'none' }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
              style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
              onClick={() => setDrawerOpen(false)}
            />

            <motion.aside
              key="drawer"
              className="fixed top-0 right-0 bottom-0 z-50 flex flex-col"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 280 }}
              style={{
                width: 'min(340px, 88vw)',
                background: 'rgba(6,8,12,0.97)',
                backdropFilter: 'blur(40px)',
                WebkitBackdropFilter: 'blur(40px)',
                borderLeft: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div className="flex items-center justify-between px-7 pt-8 pb-8">
                <Link href="/" onClick={() => setDrawerOpen(false)} className="flex items-center gap-2.5">
                  <img src={logoSvg.src ?? logoSvg} alt="White Line logo" style={{ width: 24, height: 26, filter: 'brightness(0) invert(1)' }} />
                  <span className="text-white font-semibold tracking-[0.18em] text-xs uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    White Line
                  </span>
                </Link>

                <motion.button
                  onClick={() => setDrawerOpen(false)}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
                  style={{ border: '1px solid rgba(255,255,255,0.14)' }}
                  aria-label="Close menu"
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={15} color="rgba(255,255,255,0.75)" />
                </motion.button>
              </div>

              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginInline: 28 }} />

              <nav className="flex-1 overflow-y-auto px-7 pt-6" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}>
                <ul className="list-none m-0 p-0 flex flex-col">
                  {NAV_LINKS.map((item, i) => (
                    <motion.li
                      key={item.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.07 + i * 0.055, duration: 0.38, ease: 'easeOut' }}
                    >
                      <Link
                        href={item.to}
                        onClick={() => setDrawerOpen(false)}
                        className="flex items-center justify-between py-5 transition-colors"
                        style={{
                          fontFamily: 'Montserrat, sans-serif',
                          fontSize: 'clamp(17px, 4vw, 20px)',
                          fontWeight: 500,
                          borderBottom: '1px solid rgba(255,255,255,0.06)',
                          letterSpacing: '0.02em',
                          color: isActive(item.to) ? '#ffffff' : 'rgba(255,255,255,0.55)',
                        }}
                      >
                        {item.label}
                        {item.dropdown
                          ? <ChevronDown size={15} style={{ opacity: 0.35 }} />
                          : <span style={{ opacity: 0.2, fontSize: 18 }}>›</span>
                        }
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              <motion.div
                className="px-7 pb-10 pt-6 flex flex-col gap-4"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.48, duration: 0.42, ease: 'easeOut' }}
              >
                <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 4 }} />
                <button className="flex items-center gap-2 text-white/40 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <USFlag />
                  <span>English</span>
                  <ChevronDown size={12} style={{ opacity: 0.6 }} />
                </button>
                <button
                  className="group relative w-full h-12 overflow-hidden rounded-full text-white font-semibold text-sm"
                  style={{ fontFamily: 'Inter, sans-serif', background: BUTTON_BG, border: '1px solid rgba(255,255,255,0.16)' }}
                >
                  <span className="inline-flex h-full w-full items-center justify-center transition duration-500 group-hover:-translate-y-[150%]">Download Now</span>
                  <span className="absolute inset-0 inline-flex items-center justify-center translate-y-[100%] transition duration-500 group-hover:translate-y-0">
                    <span className="absolute inset-0 translate-y-full skew-y-12 scale-y-0 bg-white/20 transition duration-500 group-hover:translate-y-0 group-hover:scale-150" />
                    <span className="relative z-10 inline-flex items-center gap-1.5">Download Now <ArrowUpRight size={13} /></span>
                  </span>
                </button>
              </motion.div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
