'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { RadarGraphic } from './AppSection'
import appleIcon from '../assets/global_app/apple-logo-svgrepo-com.svg'
import playIcon  from '../assets/global_app/google-play-svgrepo-com.svg'
import appImg    from '../assets/global_app/app.png'
import logoSvg   from '../assets/fav_icon_black.svg'

export default function DownloadDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { trans, dir } = useLanguage()
  const isRtl = dir === 'rtl'
  const d = trans.nav.appDialog

  // Body scroll + Lenis
  useEffect(() => {
    if (open) {
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
  }, [open])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="dl-backdrop"
            className="fixed inset-0 z-[200]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
            onClick={onClose}
          />

          {/* Centering shell */}
          <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              key="dl-modal"
              className="relative w-full"
              style={{
                maxWidth: 820,
                background: 'linear-gradient(135deg, #0b2220 0%, #0b3330 55%, #0d2a28 100%)',
                borderRadius: 24,
                border: '1px solid rgba(255,255,255,0.09)',
                boxShadow: '0 40px 100px rgba(0,0,0,0.65)',
                overflow: 'hidden',
              }}
              initial={{ opacity: 0, scale: 0.91, y: 28 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.91, y: 28 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top accent stripe */}
              <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, rgba(0,92,102,0.9) 40%, rgba(78,205,196,0.6) 60%, transparent)' }} />

              {/* Close */}
              <motion.button
                onClick={onClose}
                className="absolute top-5 flex items-center justify-center w-9 h-9 rounded-full transition-colors hover:bg-white/10 z-30"
                style={{ ...(isRtl ? { left: 20 } : { right: 20 }), border: '1px solid rgba(255,255,255,0.14)' }}
                aria-label="Close"
                whileTap={{ scale: 0.88 }}
              >
                <X size={15} color="rgba(255,255,255,0.7)" />
              </motion.button>

              {/* Two-column flex — stretches to fill modal height naturally */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: isRtl ? 'row-reverse' : 'row',
                  alignItems: 'stretch',
                  minHeight: 380,
                }}
              >
                {/* ── Left: text ── */}
                <div
                  style={{
                    flex: '1 1 0',
                    minWidth: 0,
                    padding: 'clamp(32px, 5vw, 52px)',
                    paddingTop: 'clamp(40px, 5vw, 56px)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    position: 'relative',
                    zIndex: 10,
                  }}
                >
                  {/* Radar ghost in text area */}
                  <RadarGraphic
                    style={{
                      position: 'absolute',
                      ...(isRtl ? { left: '-8%' } : { right: '-24%' }),
                      top: '10%',
                      width: '42%',
                      opacity: 0.3,
                      pointerEvents: 'none',
                      zIndex: 0,
                      transform: isRtl ? 'rotate(85deg)' : 'rotate(275deg)',
                    }}
                  />

                  <div style={{ position: 'relative', zIndex: 1 }}>
                    {/* Logo row */}
                    <motion.div
                      className="flex items-center gap-2 mb-5"
                      style={{ flexDirection: isRtl ? 'row-reverse' : 'row' }}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.05 }}
                    >
                      <img src={logoSvg.src ?? logoSvg} alt="" style={{ width: 20, height: 22, filter: 'brightness(0) invert(1)' }} />
                      <span style={{ fontFamily: 'Montserrat, sans-serif', color: '#fff', fontWeight: 600, letterSpacing: '0.18em', fontSize: 11, textTransform: 'uppercase' }}>
                        White Line
                      </span>
                    </motion.div>

                    {/* Badge */}
                    <motion.div
                      style={{ marginBottom: 16, display: 'flex', justifyContent: isRtl ? 'flex-end' : 'flex-start' }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5de0d8', background: 'rgba(93,224,216,0.1)', border: '1px solid rgba(93,224,216,0.22)', padding: '4px 13px', borderRadius: 999 }}>
                        {d.badge}
                      </span>
                    </motion.div>

                    {/* Heading */}
                    <motion.h2
                      style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(24px, 3.2vw, 38px)', fontWeight: 800, lineHeight: 1.14, color: '#ffffff', marginBottom: 12, textAlign: isRtl ? 'right' : 'left' }}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.55, delay: 0.15 }}
                    >
                      {d.h1}{' '}
                      <span style={{ fontWeight: 300, color: 'rgba(255,255,255,0.42)' }}>{d.h2}</span>
                    </motion.h2>

                    {/* Sub */}
                    <motion.p
                      style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(13px, 1.1vw, 14px)', color: 'rgba(255,255,255,0.52)', lineHeight: 1.72, marginBottom: 32, maxWidth: 380, textAlign: isRtl ? 'right' : 'left' }}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.55, delay: 0.2 }}
                    >
                      {d.sub}
                    </motion.p>

                    {/* "Available on" label */}
                    <motion.p
                      style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 14, textAlign: isRtl ? 'right' : 'left' }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.25 }}
                    >
                      {isRtl ? 'المنصات المتاحة' : 'Available on'}
                    </motion.p>

                    {/* Icon-only store buttons */}
                    <motion.div
                      style={{ display: 'flex', gap: 12, justifyContent: isRtl ? 'flex-end' : 'flex-start' }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.55, delay: 0.28 }}
                    >
                      <div style={{ background: '#fff', borderRadius: 12, padding: 13, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0,0,0,0.07)', flexShrink: 0 }}>
                        <img src={appleIcon.src ?? appleIcon} alt="App Store" style={{ width: 30, height: 30, objectFit: 'contain', display: 'block' }} />
                      </div>
                      <div style={{ background: '#fff', borderRadius: 12, padding: 13, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0,0,0,0.07)', flexShrink: 0 }}>
                        <img src={playIcon.src ?? playIcon} alt="Google Play" style={{ width: 30, height: 30, objectFit: 'contain', display: 'block' }} />
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* ── Right: app image panel — full height, fixed width ── */}
                <motion.div
                  className="hidden sm:flex items-end justify-center"
                  style={{
                    width: 'clamp(200px, 33%, 280px)',
                    flexShrink: 0,
                    alignSelf: 'stretch',
                    overflow: 'hidden',
                  }}
                  initial={{ opacity: 0, x: isRtl ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
                >
                  <img
                    src={appImg.src}
                    alt="White Line app preview"
                    style={{
                      width: '130%',
                      height: 'auto',
                      display: 'block',
                      objectFit: 'contain',
                      ...(isRtl ? { marginLeft: '-15%' } : { marginRight: '-15%' }),
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
