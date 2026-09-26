'use client'
import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Check, Loader2, ChevronDown } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { phoneCountryCodes, type CountryCode } from '../lib/phoneCountryCodes'
import logoSvg from '../assets/fav_icon_black.svg'

const TEAL = '#00717e'
const CUSTOMER_SESSION_KEY = 'whiteline.customerSession'

type Session = { accessToken: string; refreshToken?: string }
type Profile = { fullName: string; phone: string; email: string; profileComplete: boolean }
type Step = 'phone' | 'otp' | 'profile' | 'done'
type Tab = 'login' | 'signup'

/* ── helpers copied exactly from booking dialog ──────────────────────────── */
function getRecord(v: unknown): Record<string, unknown> | null {
  return v && typeof v === 'object' && !Array.isArray(v) ? v as Record<string, unknown> : null
}
function digString(v: unknown, keys: string[]): string {
  const r = getRecord(v)
  if (!r) return ''
  for (const k of keys) {
    const d = r[k]
    if (typeof d === 'string' && d.trim()) return d.trim()
  }
  for (const nk of ['data', 'customer', 'user', 'profile']) {
    const n = digString(r[nk], keys)
    if (n) return n
  }
  return ''
}
function digBoolean(v: unknown, keys: string[]): boolean | null {
  const r = getRecord(v)
  if (!r) return null
  for (const k of keys) {
    if (typeof r[k] === 'boolean') return r[k] as boolean
    if (typeof r[k] === 'number') return r[k] === 1
  }
  for (const nk of ['data', 'customer', 'user', 'profile']) {
    const n = digBoolean(r[nk], keys)
    if (n !== null) return n
  }
  return null
}
function parseSession(v: unknown): Session | null {
  const accessToken = digString(v, ['accessToken', 'access_token', 'token', 'access'])
  if (!accessToken) return null
  const refreshToken = digString(v, ['refreshToken', 'refresh_token', 'refresh'])
  return { accessToken, refreshToken: refreshToken || undefined }
}
function parseProfile(v: unknown): Profile | null {
  const firstName = digString(v, ['firstName', 'first_name'])
  const lastName  = digString(v, ['lastName', 'last_name'])
  const fullName  = digString(v, ['fullName', 'full_name', 'name']) || [firstName, lastName].filter(Boolean).join(' ')
  const phone     = digString(v, ['phone', 'phoneNumber', 'phone_number', 'mobile'])
  const email     = digString(v, ['email', 'emailAddress', 'email_address'])
  const completeFlag = digBoolean(v, ['profileComplete', 'profile_complete', 'isProfileComplete', 'is_profile_complete', 'isComplete', 'is_complete'])
  if (!fullName && !phone && !email && completeFlag === null) return null
  return { fullName, phone, email, profileComplete: completeFlag ?? Boolean(fullName && phone && email) }
}
function storeSession(s: Session) {
  try { localStorage.setItem(CUSTOMER_SESSION_KEY, JSON.stringify(s)) } catch {}
}
async function fetchProfile(token: string): Promise<Profile | null> {
  try {
    const res = await fetch('/api/customers/profile', { headers: { Authorization: `Bearer ${token}` } })
    if (!res.ok) return null
    return parseProfile(await res.json())
  } catch { return null }
}

interface Props {
  open: boolean
  onClose: () => void
  onSuccess?: (session: Session) => void
  /** @deprecated kept for backward compat */
  onPhone?: () => void
}

const PERKS = [
  { en: 'Quick & secure login',      ar: 'تسجيل دخول سريع وآمن' },
  { en: 'Book in seconds',           ar: 'احجز خلال ثوانٍ' },
  { en: 'Manage your trips',         ar: 'أدر رحلاتك بسهولة' },
  { en: 'Exclusive member benefits', ar: 'مزايا حصرية للأعضاء' },
]

/* ─── Light-theme phone picker (same logic as booking dialog) ──────────────── */
function PhoneField({
  value,
  onChange,
  attempted,
  isAr,
}: {
  value: string
  onChange: (v: string) => void
  attempted: boolean
  isAr: boolean
}) {
  const [selectedIso, setSelectedIso] = useState<string>(() => {
    if (!value) return 'SA'
    const sorted = [...phoneCountryCodes].sort((a, b) => b.dial.length - a.dial.length)
    return sorted.find(c => value.startsWith(c.dial))?.iso ?? 'SA'
  })
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const wrapRef  = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const active = phoneCountryCodes.find(c => c.iso === selectedIso) ?? phoneCountryCodes[0]
  const local  = value.startsWith(active.dial) ? value.slice(active.dial.length).trimStart() : value

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return phoneCountryCodes
    return phoneCountryCodes.filter(c =>
      c.name.toLowerCase().includes(q) || c.nameAr?.includes(search) || c.dial.includes(q)
    )
  }, [search])

  useEffect(() => {
    if (!open) { setSearch(''); return }
    const t = setTimeout(() => searchRef.current?.focus(), 80)
    return () => clearTimeout(t)
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const selectCountry = (c: CountryCode) => {
    const digits = local.replace(/\D/g, '').slice(0, c.len)
    setSelectedIso(c.iso)
    onChange(digits.length ? `${c.dial} ${digits}` : '')
    setOpen(false)
  }

  const handleNumber = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, active.len)
    onChange(digits.length ? `${active.dial} ${digits}` : '')
  }

  const phoneDigits = value.replace(/\D/g, '').length
  const invalid = attempted && phoneDigits < 8

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      {/* Combined input row */}
      <div style={{
        display: 'flex', alignItems: 'center',
        border: `1.5px solid ${invalid ? '#ef4444' : open ? TEAL : '#e5e7eb'}`,
        borderRadius: 12,
        background: '#fff',
        minHeight: 52,
        transition: 'border-color .18s ease',
        overflow: 'visible',
      }}>
        {/* Country code trigger */}
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            height: '100%', padding: '0 10px 0 14px',
            borderInlineEnd: '1.5px solid #e5e7eb',
            background: 'transparent', border: 'none',
            borderRight: '1.5px solid #e5e7eb',
            cursor: 'pointer',
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
          <span
            className={`fi fi-${active.iso.toLowerCase()}`}
            style={{ width: 18, height: 14, borderRadius: 2, overflow: 'hidden', display: 'inline-block', flexShrink: 0, backgroundSize: 'cover' }}
            aria-hidden="true"
          />
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13.5, fontWeight: 600, color: '#374151' }}>
            {active.dial}
          </span>
          <ChevronDown
            size={13}
            color="#94a3b8"
            style={{ transition: 'transform .18s', transform: open ? 'rotate(180deg)' : 'none', flexShrink: 0 }}
          />
        </button>

        {/* Number input */}
        <input
          type="tel"
          inputMode="tel"
          value={local}
          onChange={e => handleNumber(e.target.value)}
          placeholder={active.iso === 'SA' ? '501 234 567' : ''}
          dir="ltr"
          style={{
            flex: 1, minWidth: 0, height: '100%',
            border: 'none', outline: 'none',
            fontFamily: 'Inter, sans-serif', fontSize: 15, color: '#0f172a',
            background: 'transparent',
            padding: '0 14px',
            textAlign: isAr ? 'right' : 'left',
          }}
        />
      </div>

      {invalid && (
        <p style={{ margin: '5px 0 0', fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#ef4444' }}>
          {isAr ? 'يرجى إدخال رقم جوال صحيح' : 'Please enter a valid mobile number'}
        </p>
      )}

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              insetInlineStart: 0,
              width: 270,
              borderRadius: 12,
              background: '#fff',
              boxShadow: '0 18px 45px rgba(0,0,0,0.18)',
              zIndex: 50,
              overflow: 'hidden',
            }}
          >
            {/* Search */}
            <div style={{ padding: 8, borderBottom: '1px solid #edf0f2' }}>
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={isAr ? 'ابحث عن الدولة أو الرمز...' : 'Search country or code…'}
                style={{
                  display: 'block', width: '100%', boxSizing: 'border-box',
                  padding: '6px 10px',
                  border: '1px solid #e2e5e8', borderRadius: 8,
                  background: '#f5f7f8',
                  fontFamily: 'Inter, sans-serif', fontSize: 11.5, color: '#303238',
                  outline: 'none',
                }}
              />
            </div>
            {/* List */}
            <div style={{ maxHeight: 240, overflowY: 'auto' }}>
              {filtered.length === 0 && (
                <div style={{ padding: 14, fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#9fa8b0', textAlign: 'center' }}>
                  {isAr ? 'لا توجد نتائج' : 'No results'}
                </div>
              )}
              {filtered.map(c => (
                <button
                  key={c.iso}
                  type="button"
                  onClick={() => selectCountry(c)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    width: '100%', minHeight: 36,
                    padding: '5px 12px',
                    border: 'none', borderBottom: '1px solid #edf0f2',
                    background: c.iso === selectedIso ? '#effbfc' : '#fff',
                    color: c.iso === selectedIso ? TEAL : '#303238',
                    fontFamily: 'Inter, sans-serif', fontSize: 11.5,
                    textAlign: 'start', cursor: 'pointer',
                    transition: 'background .12s ease',
                  }}
                  onMouseEnter={e => { if (c.iso !== selectedIso) (e.currentTarget as HTMLButtonElement).style.background = '#f5feff' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = c.iso === selectedIso ? '#effbfc' : '#fff' }}
                >
                  <span
                    className={`fi fi-${c.iso.toLowerCase()}`}
                    style={{ width: 18, height: 13, borderRadius: 2, overflow: 'hidden', display: 'inline-block', flexShrink: 0, backgroundSize: 'cover' }}
                    aria-hidden="true"
                  />
                  <span style={{ flex: 1 }}>{(isAr && c.nameAr) ? c.nameAr : c.name}</span>
                  <span style={{ color: '#8b939a', fontSize: 10.5, flexShrink: 0, paddingInlineStart: 8 }}>{c.dial}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Main dialog ──────────────────────────────────────────────────────────── */
export default function LoginDialog({ open, onClose, onSuccess }: Props) {
  const { lang, dir } = useLanguage()
  const isAr = lang === 'ar'

  const [tab, setTab]         = useState<Tab>('login')
  const [step, setStep]       = useState<Step>('phone')
  const [phone, setPhone]     = useState('')
  const [otp, setOtp]         = useState<string[]>(Array(4).fill(''))
  const [profile, setProfile] = useState({ name: '', email: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [session, setSession] = useState<Session | null>(null)
  const [attempted, setAttempted] = useState(false)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  const normalizedPhone = phone.replace(/\s/g, '')
  const phoneValid  = /^\+\d{8,15}$/.test(normalizedPhone)
  const otpComplete = otp.every(d => d.trim().length === 1)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      window.dispatchEvent(new CustomEvent('lenis:stop'))
    } else {
      document.body.style.overflow = ''
      window.dispatchEvent(new CustomEvent('lenis:start'))
      setTab('login'); setStep('phone'); setPhone('')
      setOtp(Array(4).fill('')); setProfile({ name: '', email: '' })
      setLoading(false); setError(''); setAttempted(false); setSession(null)
    }
    return () => {
      document.body.style.overflow = ''
      window.dispatchEvent(new CustomEvent('lenis:start'))
    }
  }, [open])

  const sendOtp = useCallback(async (isResend = false) => {
    setAttempted(true)
    if (!phoneValid || loading) return
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/customer/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: normalizedPhone }),
      })
      if (!res.ok) throw new Error()
      if (!isResend) { setOtp(Array(4).fill('')); setStep('otp'); setAttempted(false) }
    } catch {
      setError(isAr ? 'فشل إرسال رمز التحقق. حاول مجدداً.' : 'Failed to send code. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [phoneValid, loading, normalizedPhone, isAr])

  const verifyOtp = useCallback(async () => {
    setAttempted(true)
    if (!otpComplete || loading) return
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: normalizedPhone, otp_code: otp.join(''), purpose: 'customer_auth' }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error('verify failed')
      const newSession = parseSession(json)
      if (!newSession) throw new Error('no token')
      storeSession(newSession)
      setSession(newSession)
      // Mirror booking dialog: try inline first, then always fetch profile to confirm
      const inlineProfile = parseProfile(json)
      if (inlineProfile?.profileComplete && inlineProfile.fullName && inlineProfile.phone && inlineProfile.email) {
        window.dispatchEvent(new CustomEvent('whiteline:login'))
        onSuccess?.(newSession)
        setStep('done')
        setTimeout(() => window.location.reload(), 1400)
      } else {
        const fetched = await fetchProfile(newSession.accessToken)
        if (fetched?.profileComplete) {
          window.dispatchEvent(new CustomEvent('whiteline:login'))
          onSuccess?.(newSession)
          setStep('done')
          setTimeout(() => window.location.reload(), 1400)
        } else {
          const fallback = fetched ?? inlineProfile ?? { fullName: '', phone: normalizedPhone, email: '', profileComplete: false }
          setProfile({ name: fallback.fullName, email: fallback.email })
          setStep('profile')
          setAttempted(false)
        }
      }
    } catch {
      setError(isAr ? 'رمز التحقق غير صحيح. حاول مجدداً.' : 'Incorrect code. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [otpComplete, loading, normalizedPhone, otp, isAr, onSuccess, onClose])

  const completeProfile = useCallback(async () => {
    setAttempted(true)
    const nameOk  = profile.name.trim().length >= 2
    const emailOk = /^\S+@\S+\.\S+$/.test(profile.email.trim())
    if (!nameOk || !emailOk || !session || loading) return
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/customers/profile/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.accessToken}` },
        body: JSON.stringify({ full_name: profile.name.trim(), email: profile.email.trim() }),
      })
      if (!res.ok) throw new Error('complete failed')
      // Fetch profile after completion to confirm (mirrors booking dialog)
      await fetchProfile(session.accessToken)
      window.dispatchEvent(new CustomEvent('whiteline:login'))
      onSuccess?.(session)
      setStep('done')
      setTimeout(() => window.location.reload(), 1400)
    } catch {
      setError(isAr ? 'فشل حفظ البيانات. حاول مجدداً.' : 'Failed to save profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [profile, session, loading, isAr, onSuccess, onClose])

  const handleOtpChange = (i: number, v: string) => {
    const d = v.replace(/\D/g, '').slice(-1)
    setOtp(curr => curr.map((c, idx) => idx === i ? d : c))
    if (d && i < 3) otpRefs.current[i + 1]?.focus()
  }
  const handleOtpKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus()
    if (e.key === 'Enter') verifyOtp()
  }
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const p = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
    if (!p) return
    e.preventDefault()
    setOtp(Array(4).fill('').map((_, i) => p[i] ?? ''))
    otpRefs.current[Math.min(p.length, 3)]?.focus()
  }

  const stepIndex = step === 'phone' ? 0 : step === 'otp' ? 1 : 2
  const STEPS = [
    { label: isAr ? 'رقم' : 'Phone' },
    { label: isAr ? 'تحقق' : 'Verify' },
    { label: isAr ? 'اكتمل' : 'Complete' },
  ]

  const INPUT_STYLE: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    fontFamily: 'Inter, sans-serif', fontSize: 15, color: '#0f172a',
    border: '1.5px solid #e5e7eb', borderRadius: 12,
    padding: '13px 16px', outline: 'none', background: '#fff',
    transition: 'border-color .18s ease',
  }

  const BTN: React.CSSProperties = {
    width: '100%', padding: '14px 0',
    background: loading ? '#94a3b8' : TEAL,
    color: '#fff', border: 'none', borderRadius: 12,
    fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 14.5,
    cursor: loading ? 'not-allowed' : 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    transition: 'background .18s ease',
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="login-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={e => { if (e.target === e.currentTarget) onClose() }}
          style={{
            position: 'fixed', inset: 0, zIndex: 1200,
            display: 'grid', placeItems: 'center', padding: '18px',
            background: 'rgba(0,0,0,0.60)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
          }}
        >
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            dir={dir}
            style={{
              position: 'relative',
              display: 'flex',
              width: 'min(820px, 100%)',
              minHeight: 'min(640px, calc(100dvh - 36px))',
              maxHeight: 'calc(100dvh - 36px)',
              borderRadius: 20,
              overflow: 'hidden',
              boxShadow: '0 32px 80px rgba(0,0,0,0.32), 0 4px 16px rgba(0,0,0,0.12)',
            }}
          >
            {/* ── Close button — anchored to the outer popup corner ─────── */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              style={{ position: 'absolute', insetInlineEnd: 16, top: 16, width: 34, height: 34, border: '1.5px solid #d1d5db', borderRadius: '50%', background: '#fff', display: 'grid', placeItems: 'center', cursor: 'pointer', color: '#6b7280', transition: 'border-color .15s ease, color .15s ease', zIndex: 20 }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#9ca3af'; (e.currentTarget as HTMLButtonElement).style.color = '#374151' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#d1d5db'; (e.currentTarget as HTMLButtonElement).style.color = '#6b7280' }}
            >
              <X size={15} />
            </button>

            {/* ── LEFT PANEL ────────────────────────────────────────────── */}
            <div className="hidden sm:flex" style={{
              width: '42%', flexShrink: 0,
              background: '#eef0f4',
              flexDirection: 'column',
              padding: '32px 28px 28px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
                <div style={{ width: 36, height: 36, background: '#111118', borderRadius: 8, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <img src={logoSvg.src ?? logoSvg} alt="" style={{ width: 20, height: 21, filter: 'brightness(0) invert(1)' }} />
                </div>
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '0.18em', color: '#111118', textTransform: 'uppercase' }}>
                  White Line
                </span>
              </div>
              <h2 style={{ margin: '0 0 8px', fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 36, color: '#0f172a', lineHeight: 1.15, letterSpacing: '-0.01em' }}>
                {isAr ? 'أهلاً بك' : 'Welcome'}
              </h2>
              <p style={{ margin: '0 0 24px', fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#64748b', lineHeight: 1.5 }}>
                {isAr ? 'سجّل دخولك لحجز رحلتك' : 'Sign in to book your ride'}
              </p>
              <ul style={{ listStyle: 'none', margin: '0 0 auto', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {PERKS.map(p => (
                  <li key={p.en} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 20, height: 20, borderRadius: '50%', background: TEAL, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                      <Check size={11} color="#fff" strokeWidth={3} />
                    </span>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13.5, color: '#374151', fontWeight: 500 }}>
                      {isAr ? p.ar : p.en}
                    </span>
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: 28, marginLeft: -28, marginRight: -28, marginBottom: -28, borderRadius: '14px 14px 0 0', overflow: 'hidden', height: 220, position: 'relative', flexShrink: 0 }}>
                <img src="/login-hero.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 60%', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)' }} />
                <div style={{ position: 'absolute', bottom: 18, left: 18, right: 18 }}>
                  <p style={{ margin: 0, fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 20, color: '#fff', lineHeight: 1.25, letterSpacing: '-0.01em' }}>
                    {isAr ? 'رحلتك' : 'Your Journey'}<br />{isAr ? 'أولويتنا.' : 'Our Priority.'}
                  </p>
                  <div style={{ marginTop: 8, width: 36, height: 2.5, borderRadius: 2, background: TEAL }} />
                </div>
              </div>
            </div>

            {/* ── RIGHT PANEL ───────────────────────────────────────────── */}
            <div style={{ flex: 1, minWidth: 0, background: '#ffffff', display: 'flex', flexDirection: 'column', padding: '28px 36px 36px', overflowY: 'auto' }}>

              {/* Step indicator */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                {STEPS.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: '50%',
                        background: i <= stepIndex ? TEAL : 'transparent',
                        border: i <= stepIndex ? 'none' : '1.5px solid #cbd5e1',
                        display: 'grid', placeItems: 'center',
                        fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 13,
                        color: i <= stepIndex ? '#fff' : '#94a3b8',
                        transition: 'all .25s',
                      }}>
                        {i < stepIndex ? <Check size={13} strokeWidth={3} /> : i + 1}
                      </div>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600, color: i <= stepIndex ? TEAL : '#94a3b8', letterSpacing: '0.02em' }}>
                        {s.label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div style={{ width: 56, height: 2, borderRadius: 2, margin: '0 6px', marginBottom: 18, background: i < stepIndex ? TEAL : '#e2e8f0', flexShrink: 0, transition: 'background .25s' }} />
                    )}
                  </div>
                ))}
              </div>

              {/* Tabs — phone step only */}
              <AnimatePresence>
                {step === 'phone' && (
                  <motion.div
                    key="tabs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ display: 'flex', background: '#f1f5f9', borderRadius: 12, padding: 4, marginBottom: 24, gap: 4 }}
                  >
                    {(['login', 'signup'] as Tab[]).map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => { setTab(t); setError(''); setAttempted(false) }}
                        style={{
                          flex: 1, padding: '10px 0',
                          fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13.5,
                          borderRadius: 9, border: 'none', cursor: 'pointer',
                          background: tab === t ? '#fff' : 'transparent',
                          color: tab === t ? '#0f172a' : '#94a3b8',
                          boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                          transition: 'all .18s ease',
                        }}
                      >
                        {t === 'login'
                          ? (isAr ? 'تسجيل الدخول' : 'Sign In')
                          : (isAr ? 'إنشاء حساب' : 'Create Account')}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Spacer */}
              <div style={{ flex: 1 }} />

              {/* ── Content steps ── */}
              <AnimatePresence mode="wait">

                {/* PHONE */}
                {step === 'phone' && (
                  <motion.div key="phone" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    <h3 style={{ margin: '0 0 4px', fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 22, color: '#0f172a', letterSpacing: '-0.01em' }}>
                      {tab === 'login'
                        ? (isAr ? 'مرحباً بعودتك' : 'Welcome back')
                        : (isAr ? 'إنشاء حساب جديد' : 'Create your account')}
                    </h3>
                    <p style={{ margin: '0 0 20px', fontFamily: 'Inter, sans-serif', fontSize: 13.5, color: '#64748b', lineHeight: 1.6 }}>
                      {tab === 'login'
                        ? (isAr ? 'أدخل رقم جوالك لتسجيل الدخول.' : 'Enter your mobile number to sign in.')
                        : (isAr ? 'أدخل رقم جوالك وسنرسل لك رمز التحقق.' : 'Enter your mobile number to get started.')}
                    </p>
                    <div style={{ marginBottom: 16 }}>
                      <PhoneField value={phone} onChange={setPhone} attempted={attempted} isAr={isAr} />
                    </div>
                    {error && <p style={{ margin: '0 0 12px', fontFamily: 'Inter, sans-serif', fontSize: 12.5, color: '#ef4444' }}>{error}</p>}
                    <button type="button" onClick={() => sendOtp()} disabled={loading} style={BTN}>
                      {loading && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
                      {loading
                        ? (isAr ? 'جارٍ الإرسال…' : 'Sending…')
                        : (isAr ? 'إرسال رمز التحقق' : 'Send Verification Code')}
                    </button>
                  </motion.div>
                )}

                {/* OTP */}
                {step === 'otp' && (
                  <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    <h3 style={{ margin: '0 0 4px', fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 22, color: '#0f172a', letterSpacing: '-0.01em' }}>
                      {isAr ? 'تحقق من رقمك' : 'Verify your number'}
                    </h3>
                    <p style={{ margin: '0 0 6px', fontFamily: 'Inter, sans-serif', fontSize: 13.5, color: '#64748b' }}>
                      {isAr ? 'أدخل الرمز المرسل إلى' : 'Enter the 4-digit code sent to'}
                    </p>
                    <p style={{ margin: '0 0 24px', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 14, color: '#0f172a', direction: 'ltr', textAlign: isAr ? 'right' : 'left' }}>
                      {normalizedPhone}
                    </p>
                    <div style={{ display: 'flex', gap: 10, marginBottom: 16, justifyContent: 'center' }}>
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          ref={el => { otpRefs.current[i] = el }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={e => handleOtpChange(i, e.target.value)}
                          onKeyDown={e => handleOtpKey(i, e)}
                          onPaste={handleOtpPaste}
                          style={{
                            width: 56, height: 60,
                            textAlign: 'center',
                            fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 24,
                            color: '#0f172a',
                            border: `2px solid ${digit ? TEAL : '#e5e7eb'}`,
                            borderRadius: 12,
                            background: digit ? 'rgba(0,113,126,0.04)' : '#fff',
                            outline: 'none',
                            transition: 'border-color .15s ease',
                          }}
                          onFocus={e => (e.target as HTMLInputElement).style.borderColor = TEAL}
                          onBlur={e => (e.target as HTMLInputElement).style.borderColor = otp[i] ? TEAL : '#e5e7eb'}
                        />
                      ))}
                    </div>
                    {error && <p style={{ margin: '0 0 12px', textAlign: 'center', fontFamily: 'Inter, sans-serif', fontSize: 12.5, color: '#ef4444' }}>{error}</p>}
                    <button type="button" onClick={verifyOtp} disabled={loading} style={{ ...BTN, marginBottom: 10 }}>
                      {loading && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
                      {loading ? (isAr ? 'جارٍ التحقق…' : 'Verifying…') : (isAr ? 'تحقق من الرمز' : 'Verify Code')}
                    </button>
                    <button type="button" onClick={() => sendOtp(true)} disabled={loading} style={{ width: '100%', padding: '11px 0', background: 'transparent', color: '#64748b', border: '1.5px solid #e5e7eb', borderRadius: 12, fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13.5, cursor: loading ? 'not-allowed' : 'pointer', marginBottom: 8 }}>
                      {isAr ? 'إعادة إرسال الرمز' : 'Resend Code'}
                    </button>
                    <button type="button" onClick={() => { setStep('phone'); setError(''); setAttempted(false) }} style={{ display: 'block', margin: '0 auto', background: 'none', border: 'none', fontFamily: 'Inter, sans-serif', fontSize: 12.5, color: '#94a3b8', cursor: 'pointer', textDecoration: 'underline' }}>
                      {isAr ? 'تغيير رقم الجوال' : 'Change number'}
                    </button>
                  </motion.div>
                )}

                {/* PROFILE (new users) */}
                {step === 'profile' && (
                  <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    <h3 style={{ margin: '0 0 4px', fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 22, color: '#0f172a', letterSpacing: '-0.01em' }}>
                      {isAr ? 'أكمل حسابك' : 'Complete your account'}
                    </h3>
                    <p style={{ margin: '0 0 20px', fontFamily: 'Inter, sans-serif', fontSize: 13.5, color: '#64748b', lineHeight: 1.6 }}>
                      {isAr ? 'مرحباً! أدخل اسمك وبريدك لإنهاء التسجيل.' : 'Just a few more details and you\'re all set.'}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 16 }}>
                      {([
                        { key: 'name',  label: isAr ? 'الاسم الكامل' : 'Full Name',      type: 'text',  placeholder: isAr ? 'أدخل اسمك الكامل' : 'Your full name', invalid: attempted && profile.name.trim().length < 2 },
                        { key: 'email', label: isAr ? 'البريد الإلكتروني' : 'Email',     type: 'email', placeholder: isAr ? 'بريدك الإلكتروني' : 'your@email.com',  invalid: attempted && !/^\S+@\S+\.\S+$/.test(profile.email.trim()) },
                      ] as const).map(f => (
                        <div key={f.key}>
                          <label style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: 11.5, fontWeight: 700, color: '#374151', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            {f.label}
                          </label>
                          <input
                            type={f.type}
                            value={profile[f.key]}
                            onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))}
                            placeholder={f.placeholder}
                            style={{ ...INPUT_STYLE, borderColor: f.invalid ? '#ef4444' : '#e5e7eb' }}
                            onFocus={e => (e.target as HTMLInputElement).style.borderColor = TEAL}
                            onBlur={e => (e.target as HTMLInputElement).style.borderColor = f.invalid ? '#ef4444' : '#e5e7eb'}
                          />
                        </div>
                      ))}
                    </div>
                    {error && <p style={{ margin: '0 0 12px', fontFamily: 'Inter, sans-serif', fontSize: 12.5, color: '#ef4444' }}>{error}</p>}
                    <button type="button" onClick={completeProfile} disabled={loading} style={BTN}>
                      {loading && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
                      {loading ? (isAr ? 'جارٍ الحفظ…' : 'Saving…') : (isAr ? 'إنهاء التسجيل' : 'Complete Sign Up')}
                    </button>
                  </motion.div>
                )}

                {/* DONE */}
                {step === 'done' && (
                  <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
                      style={{ width: 64, height: 64, borderRadius: '50%', background: TEAL, display: 'grid', placeItems: 'center' }}
                    >
                      <Check size={30} color="#fff" strokeWidth={2.5} />
                    </motion.div>
                    <p style={{ margin: 0, fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 22, color: '#0f172a' }}>
                      {isAr ? 'تم تسجيل الدخول!' : 'You\'re signed in!'}
                    </p>
                    <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#64748b' }}>
                      {isAr ? 'مرحباً بعودتك إلى وايت لاين.' : 'Welcome back to White Line.'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Spacer */}
              <div style={{ flex: 1 }} />

              {/* Privacy */}
              <p style={{ marginTop: 24, fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#9ca3af', textAlign: 'center', lineHeight: 1.6 }}>
                {isAr ? (
                  <>
                    بالمتابعة، أنت توافق على{' '}
                    <a href="/terms"   target="_blank" rel="noopener noreferrer" style={{ color: TEAL, textDecoration: 'underline' }}>شروط الخدمة</a>
                    {' '}و{' '}
                    <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: TEAL, textDecoration: 'underline' }}>سياسة الخصوصية</a>.
                  </>
                ) : (
                  <>
                    By continuing, you agree to our{' '}
                    <a href="/terms"   target="_blank" rel="noopener noreferrer" style={{ color: TEAL, textDecoration: 'underline' }}>Terms of Service</a>
                    {' '}and{' '}
                    <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: TEAL, textDecoration: 'underline' }}>Privacy Policy</a>.
                  </>
                )}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
