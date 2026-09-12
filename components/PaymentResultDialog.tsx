'use client'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, X, Clock, MessageCircle, ArrowLeft, ArrowRight } from 'lucide-react'
import appPhones from '../assets/global_app/app.png'
import { useLanguage } from '../context/LanguageContext'
import { bookingDialogCopy } from '../lib/bookingDialogCopy'
import { RadarGraphic, StoreButton } from './AppSection'
import styles from './AirportTransferBookingDialog.module.css'

interface Props {
  type: 'confirmed' | 'failed'
  bookingId: string | null
  onClose: () => void
}

export default function PaymentResultDialog({ type, bookingId, onClose }: Props) {
  const { lang, dir } = useLanguage()
  const copy = bookingDialogCopy[lang]
  const bc = useLanguage().trans.bookingConfirmed
  const bf = useLanguage().trans.bookingFailed
  const isRtl = dir === 'rtl'
  const BackIcon = isRtl ? ArrowRight : ArrowLeft
  const isSuccess = type === 'confirmed'

  const statusItems = [
    { label: bc.statusPayment,   done: true },
    { label: bc.statusBooking,   done: true },
    { label: bc.statusChauffeur, done: false },
    { label: bc.statusFinal,     done: false },
  ]

  return (
    <AnimatePresence>
      <motion.div
        key="pr-overlay"
        className={styles.overlay}
        data-lenis-prevent
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        <motion.div
          key="pr-dialog"
          className={styles.dialog}
          dir={dir}
          role="dialog"
          aria-modal="true"
          data-lenis-prevent
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Close */}
          <button type="button" className={styles.closeButton} aria-label="Close" onClick={onClose}>
            <X size={16} strokeWidth={2.5} />
          </button>

          <div className={styles.content}>
            {isSuccess ? (
              <div className={styles.successBody}>
                {/* Eyebrow */}
                <p className={styles.eyebrow}>{bc.eyebrow}</p>

                {/* Title */}
                <h2 className={styles.title}>{bc.title} <em>{bc.titleAccent}</em></h2>

                {/* Subtitle */}
                <p className={styles.subtitle}>{bc.subtitle}</p>

                {/* Success center */}
                <div className={styles.successCenter}>
                  <span className={styles.successCheck}>
                    <Check size={26} strokeWidth={3} />
                  </span>
                  <h3 className={styles.successHeadline}>{copy.receivedTitle}</h3>
                  <p className={styles.successNote}>{copy.receivedBody}</p>

                  {/* Booking reference */}
                  <div className={styles.referenceBlock}>
                    <span className={styles.referenceLabel}>{copy.bookingReference}</span>
                    <strong className={styles.referenceId}>{bookingId ?? '—'}</strong>
                  </div>
                </div>

                {/* Status list */}
                <div style={{
                  marginTop: 18,
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.1)',
                  overflow: 'hidden',
                  width: '100%',
                }}>
                  {statusItems.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '11px 16px',
                        borderBottom: i < statusItems.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                        flexDirection: isRtl ? 'row-reverse' : 'row',
                        fontFamily: 'var(--font-inter), sans-serif',
                      }}
                    >
                      {item.done ? (
                        <span style={{
                          flexShrink: 0, width: 18, height: 18, borderRadius: '50%',
                          background: 'rgba(120,255,162,0.2)', border: '1px solid rgba(120,255,162,0.4)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
                            <path d="M1 3.5L3.5 6L9 1" stroke="#78ffa2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      ) : (
                        <span style={{
                          flexShrink: 0, width: 18, height: 18, borderRadius: '50%',
                          border: '1.5px solid rgba(255,255,255,0.2)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.25)' }} />
                        </span>
                      )}
                      <span style={{ fontSize: 12.5, fontWeight: 500, color: '#fff' }}>
                        {item.label}
                      </span>
                      {!item.done && (
                        <span style={{
                          marginInlineStart: 'auto',
                          display: 'flex', alignItems: 'center', gap: 4,
                          fontSize: 9, fontWeight: 600, color: '#f59e0b',
                          background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)',
                          borderRadius: 20, padding: '2px 8px',
                        }}>
                          <Clock size={8} strokeWidth={2} />
                          {bc.statusPending}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Note */}
                <p style={{
                  marginTop: 12, fontSize: 11, lineHeight: 1.6,
                  color: 'rgba(255,255,255,0.5)',
                  textAlign: isRtl ? 'right' : 'left',
                  fontFamily: 'var(--font-inter), sans-serif',
                }}>
                  {bc.noteBody}
                </p>

                {/* WhatsApp */}
                <div style={{ marginTop: 14, display: 'flex', justifyContent: 'center' }}>
                  <a
                    href="https://wa.me/966563117770"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 7,
                      padding: '9px 20px', borderRadius: 999,
                      background: '#25D366', color: '#fff',
                      fontSize: 12, fontWeight: 600, textDecoration: 'none',
                      fontFamily: 'var(--font-inter), sans-serif',
                    }}
                  >
                    <MessageCircle size={14} strokeWidth={2} />
                    {bc.whatsapp}
                  </a>
                </div>

                {/* App banner — exact copy from SuccessStep */}
                <div className={styles.appBanner}>
                  <span className={styles.appRadarClip} aria-hidden="true">
                    <RadarGraphic
                      className={styles.appRadar}
                      style={{
                        right: isRtl ? 'auto' : undefined,
                        left: isRtl ? '13%' : undefined,
                        transform: isRtl ? 'rotate(85deg)' : undefined,
                      }}
                    />
                  </span>
                  <h3>{copy.trackJourney}</h3>
                  <p>{copy.trackBody}</p>
                  <div className={styles.stores}>
                    <StoreButton variant="apple" mini sub={copy.downloadOn} main={lang === 'ar' ? 'قريباً' : 'Coming Soon'} isRtl={isRtl} />
                    <StoreButton variant="google" mini sub={copy.getItOn} main={lang === 'ar' ? 'قريباً' : 'Coming Soon'} isRtl={isRtl} />
                  </div>
                  <Image
                    className={styles.appPhones}
                    src={appPhones}
                    alt={copy.mobileAppAlt}
                    style={{
                      right: isRtl ? 'auto' : undefined,
                      left: isRtl ? '20px' : undefined,
                    }}
                  />
                </div>

                {/* Footer: close */}
                <div className={styles.footerActions} style={{ justifyContent: 'flex-end' }}>
                  <button type="button" className={styles.continue} onClick={onClose}>
                    {copy.downloadApp}
                    {isRtl ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                  </button>
                </div>
              </div>
            ) : (
              /* Failure state */
              <div className={styles.successBody}>
                <p className={styles.eyebrow}>{bf.eyebrow}</p>
                <h2 className={styles.title}>
                  {bf.title} <em style={{ color: '#f87171' }}>{bf.titleAccent}</em>
                </h2>
                <p className={styles.subtitle}>{bf.subtitle}</p>

                <div className={styles.successCenter}>
                  <span style={{
                    display: 'grid', width: 56, height: 56, placeItems: 'center',
                    borderRadius: '50%', color: '#f87171',
                    background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.3)',
                    flexShrink: 0,
                  }}>
                    <X size={26} strokeWidth={2} />
                  </span>
                  <p className={styles.successNote} style={{ marginTop: 14 }}>{bf.body}</p>
                </div>

                <div style={{ marginTop: 24, display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <a
                    href="https://wa.me/966563117770"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 7,
                      padding: '10px 20px', borderRadius: 999,
                      background: '#25D366', color: '#fff',
                      fontSize: 12, fontWeight: 600, textDecoration: 'none',
                      fontFamily: 'var(--font-inter), sans-serif',
                    }}
                  >
                    <MessageCircle size={14} strokeWidth={2} />
                    {bf.contactSupport}
                  </a>
                </div>

                <div className={styles.footerActions}>
                  <button type="button" className={styles.back} onClick={onClose}>
                    <BackIcon size={20} /> {bf.tryAgain}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
