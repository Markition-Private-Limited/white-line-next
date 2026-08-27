'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, ChevronDown, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import hamburgerSvg from '../assets/home/hamburger.svg'
import logoSvg from '../assets/fav_icon_black.svg'
import { useLanguage } from '../context/LanguageContext'
import { LANG_META, type LangCode, translations } from '../lib/i18n'

const BUTTON_BG = [
  'linear-gradient(0deg, rgba(0,92,102,0.55), rgba(0,92,102,0.55))',
  'linear-gradient(238.54deg, rgba(77,77,77,0.45) 4.12%, rgba(218,218,218,0.45) 48.47%, rgba(77,77,77,0.45) 86.31%)',
].join(', ')

// ── Language dropdown ──────────────────────────────────────────────────────────
function LangDropdown({ solid }: { solid: boolean }) {
  const { lang, setLang } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const current = LANG_META[lang]
  const available = Object.entries(LANG_META) as [LangCode, typeof LANG_META[LangCode]][]

  return (
    <div ref={ref} className="relative hidden md:block">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 text-sm transition-colors"
        style={{
          fontFamily: 'Inter, sans-serif',
          color: solid ? '#374151' : 'rgba(255,255,255,0.9)',
        }}
      >
        <span className={`fi fi-${current.flagCode}`} style={{ fontSize: 18, borderRadius: 3 }} />
        <span>{current.nativeLabel}</span>
        <ChevronDown
          size={14}
          className="opacity-70 transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full mt-2 z-50 overflow-hidden rounded-xl"
            style={{
              // Align to the correct side based on dir
              insetInlineStart: 0,
              minWidth: 148,
              background: 'rgba(12,14,20,0.96)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 8px 28px rgba(0,0,0,0.35)',
            }}
          >
            {available.map(([code, meta]) => (
              <button
                key={code}
                onClick={() => { setLang(code); setOpen(false) }}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-sm transition-colors text-left hover:bg-white/8"
                style={{
                  fontFamily: code === 'ar' ? 'Cairo, sans-serif' : 'Inter, sans-serif',
                  color: lang === code ? '#ffffff' : 'rgba(255,255,255,0.55)',
                  background: lang === code ? 'rgba(255,255,255,0.07)' : 'transparent',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <span className={`fi fi-${meta.flagCode}`} style={{ fontSize: 18, borderRadius: 3 }} />
                <span>{meta.nativeLabel}</span>
                {lang === code && (
                  <span className="ms-auto" style={{ color: '#005C66', fontSize: 10 }}>✓</span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Mobile lang switcher (inside drawer) ──────────────────────────────────────
function MobileLangSwitcher() {
  const { lang, setLang } = useLanguage()
  const available = Object.entries(LANG_META) as [LangCode, typeof LANG_META[LangCode]][]

  return (
    <div className="flex gap-2">
      {available.map(([code, meta]) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all"
          style={{
            fontFamily: code === 'ar' ? 'Cairo, sans-serif' : 'Inter, sans-serif',
            background: lang === code ? 'rgba(0,92,102,0.5)' : 'rgba(255,255,255,0.06)',
            color: lang === code ? '#fff' : 'rgba(255,255,255,0.45)',
            border: lang === code ? '1px solid rgba(0,92,102,0.6)' : '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <span className={`fi fi-${meta.flagCode}`} style={{ fontSize: 16, borderRadius: 2 }} />
          <span>{meta.nativeLabel}</span>
        </button>
      ))}
    </div>
  )
}

// ── Navbar ────────────────────────────────────────────────────────────────────
export default function Navbar({ solid = false }: { solid?: boolean }) {
  const { trans } = useLanguage()
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

  useEffect(() => { setDrawerOpen(false) }, [pathname])

  const isActive = (to: string) => to === '/' ? pathname === '/' : pathname.startsWith(to)

  const linkColor = solid
    ? (to: string) => isActive(to) ? '#005C66' : '#374151'
    : (to: string) => isActive(to) ? '#ffffff' : 'rgba(255,255,255,0.75)'

  return (
    <>
      <nav
        className={solid ? 'relative z-20 w-full' : 'absolute top-0 left-0 right-0 z-20'}
        style={solid
          ? { background: '#ffffff', borderBottom: '1px solid #e5e7eb', padding: '0 clamp(16px, 3vw, 40px)' }
          : { padding: '16px 24px' }}
      >
        <div
          className="mx-auto flex max-w-7xl items-center justify-between"
          style={solid
            ? { height: 64 }
            : { background: 'transparent', border: '1px solid #4A4F4B', borderRadius: 999, padding: '12px 20px' }}
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
            {trans.nav.links.map((item) => (
              <li key={item.to}>
                <Link
                  href={item.to}
                  className="flex items-center gap-1 transition-colors text-sm font-medium"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    color: linkColor(item.to),
                  }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <LangDropdown solid={solid} />

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
              <span className="inline-flex items-center px-5 transition duration-500 group-hover:-translate-y-[150%]">
                {trans.nav.download}
              </span>
              <span className="absolute inline-flex h-full w-full translate-y-[100%] items-center justify-center transition duration-500 group-hover:translate-y-0">
                <span className={`absolute inset-0 translate-y-full skew-y-12 scale-y-0 transition duration-500 group-hover:translate-y-0 group-hover:scale-150 ${solid ? 'bg-[#004d57]' : 'bg-white/20'}`} />
                <span className="relative z-10 inline-flex items-center gap-1.5">
                  {trans.nav.download} <ArrowUpRight size={13} />
                </span>
              </span>
            </button>

            <button
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full transition-colors"
              style={{ border: solid ? '1px solid #e5e7eb' : '1px solid rgba(255,255,255,0.15)' }}
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
              className="fixed top-0 bottom-0 z-50 flex flex-col"
              style={{
                insetInlineEnd: 0,
                width: 'min(340px, 88vw)',
                background: 'rgba(6,8,12,0.97)',
                backdropFilter: 'blur(40px)',
                WebkitBackdropFilter: 'blur(40px)',
                borderInlineStart: '1px solid rgba(255,255,255,0.07)',
              }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 280 }}
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
                  {trans.nav.links.map((item, i) => (
                    <motion.li
                      key={item.to}
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
                        <span style={{ opacity: 0.2, fontSize: 18 }}>›</span>
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
                <MobileLangSwitcher />
                <button
                  className="group relative w-full h-12 overflow-hidden rounded-full text-white font-semibold text-sm"
                  style={{ fontFamily: 'Inter, sans-serif', background: BUTTON_BG, border: '1px solid rgba(255,255,255,0.16)' }}
                >
                  <span className="inline-flex h-full w-full items-center justify-center transition duration-500 group-hover:-translate-y-[150%]">
                    {trans.nav.download}
                  </span>
                  <span className="absolute inset-0 inline-flex items-center justify-center translate-y-[100%] transition duration-500 group-hover:translate-y-0">
                    <span className="absolute inset-0 translate-y-full skew-y-12 scale-y-0 bg-white/20 transition duration-500 group-hover:translate-y-0 group-hover:scale-150" />
                    <span className="relative z-10 inline-flex items-center gap-1.5">
                      {trans.nav.download} <ArrowUpRight size={13} />
                    </span>
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
