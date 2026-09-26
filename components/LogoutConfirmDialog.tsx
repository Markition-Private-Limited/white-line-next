'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'

interface Props {
  open: boolean
  onKeep: () => void
  onConfirm: () => void
}

export default function LogoutConfirmDialog({ open, onKeep, onConfirm }: Props) {
  const { lang, dir } = useLanguage()
  const isAr = lang === 'ar'

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="logout-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 1100,
            display: 'grid', placeItems: 'center', padding: 18,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-dialog-title"
          onClick={e => { if (e.target === e.currentTarget) onKeep() }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            dir={dir}
            style={{
              width: 'min(340px, 88%)',
              borderRadius: 16,
              background: '#fff',
              boxShadow: '0 16px 48px rgba(0,0,0,0.28), 0 2px 6px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              color: '#111',
            }}
          >
            {/* Red top stripe */}
            <div style={{ height: 3, background: 'linear-gradient(90deg, #dc2626 0%, #ef4444 100%)' }} />

            <div style={{ padding: '26px 24px 22px' }}>
              <h3 id="logout-dialog-title" style={{ margin: '0 0 9px', fontFamily: 'Montserrat, sans-serif', fontSize: 16, fontWeight: 700, color: '#111', lineHeight: 1.2 }}>
                {isAr ? 'تسجيل الخروج؟' : 'Sign out?'}
              </h3>
              <p style={{ margin: '0 0 22px', fontSize: 12.5, lineHeight: 1.6, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
                {isAr
                  ? 'سيتم إنهاء جلستك الحالية. يمكنك تسجيل الدخول مجدداً في أي وقت.'
                  : 'Your current session will end. You can sign back in at any time.'}
              </p>
              <div style={{ display: 'flex', gap: 9 }}>
                <button
                  type="button"
                  onClick={onConfirm}
                  style={{
                    flex: 1, minHeight: 40, padding: 0, border: 'none', borderRadius: 10,
                    background: '#dc2626', color: '#fff',
                    fontFamily: 'inherit', fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                    transition: 'background-color 0.18s ease',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#b91c1c' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#dc2626' }}
                >
                  {isAr ? 'تسجيل الخروج' : 'Sign Out'}
                </button>
                <button
                  type="button"
                  onClick={onKeep}
                  style={{
                    flex: 1, minHeight: 40, padding: 0, border: '1.5px solid #e5e7eb', borderRadius: 10,
                    background: '#fff', color: '#6b7280',
                    fontFamily: 'inherit', fontSize: 12.5, cursor: 'pointer',
                    transition: 'border-color 0.18s ease, color 0.18s ease',
                  }}
                  onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = '#c9cdd4'; b.style.color = '#374151' }}
                  onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = '#e5e7eb'; b.style.color = '#6b7280' }}
                >
                  {isAr ? 'تراجع' : 'Cancel'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
