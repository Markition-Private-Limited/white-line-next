'use client'
import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { CalendarDays, MapPin, AlertCircle, LogIn, LogOut, Plane, User, Phone, Car, ChevronRight } from 'lucide-react'
import Navbar from '../../layouts/Navbar'
import LogoutConfirmDialog from '../../components/LogoutConfirmDialog'
import CancellationPolicySheet from '../../components/CancellationPolicySheet'
import { useLanguage } from '../../context/LanguageContext'

const CUSTOMER_SESSION_KEY = 'whiteline.customerSession'

function readToken(): string | null {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(CUSTOMER_SESSION_KEY) ?? 'null')
    return parsed?.accessToken ?? null
  } catch { return null }
}

async function doLogout(token: string | null, router: ReturnType<typeof import('next/navigation').useRouter>) {
  try {
    if (token) await fetch('/api/auth/logout', { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
  } catch { /* best-effort */ }
  try { localStorage.removeItem(CUSTOMER_SESSION_KEY) } catch { /* ignore */ }
  try { localStorage.removeItem('whiteline.pendingBookingToken') } catch { /* ignore */ }
  try { localStorage.removeItem('whiteline.pendingBookingRef') } catch { /* ignore */ }
  try { localStorage.removeItem('whiteline.pendingBookingId') } catch { /* ignore */ }
  window.dispatchEvent(new CustomEvent('whiteline:logout'))
  router.push('/')
}

// Actual API shape: GET /api/v1/customers/bookings returns { success, data: { items, total, page, limit } }
type VehicleClass = {
  className: string
  imageUrl: string | null
}

type Booking = {
  id: string
  bookingNumber: string | null
  serviceType: string | null
  status: string
  paymentStatus: string | null
  paymentMethod: string | null
  pickupAddress: string | null
  dropoffAddress: string | null
  scheduledDatetime: string | null
  totalFare: string | null
  flightNumber: string | null
  vehicleClass: VehicleClass | null
}

// ── Label maps ─────────────────────────────────────────────────────────────────

const STATUS: Record<string, { en: string; ar: string; color: string; bg: string }> = {
  pending:   { en: 'Awaiting Driver', ar: 'بانتظار السائق', color: '#b45309', bg: '#fef3c7' },
  assigned:  { en: 'Driver Assigned', ar: 'تم تعيين السائق', color: '#1e40af', bg: '#dbeafe' },
  accepted:  { en: 'Confirmed',       ar: 'مؤكد',            color: '#065f46', bg: '#d1fae5' },
  en_route:  { en: 'En Route',        ar: 'في الطريق',       color: '#4338ca', bg: '#e0e7ff' },
  arrived:   { en: 'Driver Arrived',  ar: 'وصل السائق',      color: '#7c3aed', bg: '#ede9fe' },
  started:   { en: 'In Progress',     ar: 'جارٍ المشوار',    color: '#0369a1', bg: '#e0f2fe' },
  completed: { en: 'Completed',       ar: 'مكتمل',           color: '#166534', bg: '#dcfce7' },
  cancelled: { en: 'Cancelled',       ar: 'ملغي',            color: '#991b1b', bg: '#fee2e2' },
}

const PAYMENT_STATUS: Record<string, { en: string; ar: string; color: string; bg: string; dot: string }> = {
  paid:    { en: 'Paid',            ar: 'مدفوع',           color: '#166534', bg: '#dcfce7', dot: '#22c55e' },
  pending: { en: 'Payment Pending', ar: 'في انتظار الدفع', color: '#92400e', bg: '#fef3c7', dot: '#f59e0b' },
  failed:  { en: 'Payment Failed',  ar: 'فشل الدفع',       color: '#991b1b', bg: '#fee2e2', dot: '#ef4444' },
  refunded:{ en: 'Refunded',        ar: 'مُسترد',          color: '#1e40af', bg: '#dbeafe', dot: '#3b82f6' },
}

const SERVICE: Record<string, { en: string; ar: string }> = {
  airport:      { en: 'Airport Transfer', ar: 'توصيل مطار'        },
  hourly:       { en: 'Hourly Charter',   ar: 'استئجار بالساعة'   },
  city_to_city: { en: 'City to City',     ar: 'بين المدن'          },
  half_day:     { en: 'Half Day',         ar: 'نصف يوم'           },
  full_day:     { en: 'Full Day',         ar: 'يوم كامل'          },
  one_way:      { en: 'One-Way Ride',     ar: 'مشوار باتجاه واحد' },
  city_trip:    { en: 'City Trip',        ar: 'رحلة المدن' },
  day_service:  { en: 'Day Service',      ar: 'خدمة يومية'        },
}

// Parse directly from the ISO string to preserve the scheduled timezone offset
// e.g. "2026-09-19T06:29:00+03:00" → always shows 06:29 AM regardless of browser TZ
function fmtDate(iso: string | null | undefined, lang: string) {
  if (!iso) return ''
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return ''
  try {
    // Use noon UTC of that date to prevent any date-boundary shift
    return new Date(`${m[1]}-${m[2]}-${m[3]}T12:00:00Z`).toLocaleDateString(
      lang === 'ar' ? 'ar-SA' : 'en-GB',
      { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }
    )
  } catch { return '' }
}
function fmtTime(iso: string | null | undefined) {
  if (!iso) return ''
  const m = iso.match(/T(\d{2}):(\d{2})/)
  if (!m) return ''
  const h = parseInt(m[1], 10)
  const min = m[2]
  const period = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${min} ${period}`
}
function fmtFare(fare: string | null | undefined) {
  if (!fare) return null
  const n = parseFloat(fare)
  if (isNaN(n)) return null
  return `SAR ${n.toLocaleString('en-SA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

// ── Card ───────────────────────────────────────────────────────────────────────

// Statuses that mean the trip hasn't happened yet — if the scheduled time has
// already passed while still in one of these, the backend never resolved it.
const ACTIVE_STATUSES = new Set(['pending', 'assigned', 'accepted', 'en_route', 'arrived', 'started'])
const CANCELLABLE_STATUSES = new Set(['pending', 'assigned', 'accepted'])

function isOverdue(b: Booking): boolean {
  if (!b.scheduledDatetime || !ACTIVE_STATUSES.has(b.status)) return false
  const t = new Date(b.scheduledDatetime).getTime()
  return !isNaN(t) && t < Date.now()
}

function JourneyCard({ b, lang, onOpen }: { b: Booking; lang: string; onOpen: (id: string) => void }) {
  const isAr = lang === 'ar'
  const overdue = isOverdue(b)
  const status = overdue
    ? { en: 'Delayed', ar: 'متأخر', color: '#991b1b', bg: '#fee2e2' }
    : STATUS[b.status] ?? { en: b.status, ar: b.status, color: '#374151', bg: '#f3f4f6' }
  const payStatus = b.paymentStatus ? PAYMENT_STATUS[b.paymentStatus] ?? null : null
  const service = b.serviceType ? SERVICE[b.serviceType] : null
  const date = fmtDate(b.scheduledDatetime, lang)
  const time = fmtTime(b.scheduledDatetime)
  const fare = fmtFare(b.totalFare)

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(b.id)}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(b.id) } }}
      style={{ background: '#fff', border: '1px solid #e9e8ec', borderRadius: 18, overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.15s ease, border-color 0.15s ease' }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; (e.currentTarget as HTMLDivElement).style.borderColor = '#d1d5db' }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; (e.currentTarget as HTMLDivElement).style.borderColor = '#e9e8ec' }}
    >
      {/* Vehicle image strip — only when imageUrl exists */}
      {b.vehicleClass?.imageUrl && (
        <div style={{ height: 90, background: '#f3f4f6', overflow: 'hidden', position: 'relative' }}>
          <img
            src={b.vehicleClass.imageUrl}
            alt={b.vehicleClass.className}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
            onError={e => { (e.currentTarget.parentElement as HTMLElement).style.display = 'none' }}
          />
        </div>
      )}

      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <div>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 13, color: '#111118', margin: '0 0 3px', letterSpacing: '0.02em' }}>
              {b.bookingNumber ?? b.id.slice(0, 8).toUpperCase()}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              {b.vehicleClass?.className && (
                <span style={{ fontSize: 11, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
                  {b.vehicleClass.className}
                </span>
              )}
              {service && b.vehicleClass?.className && (
                <span style={{ fontSize: 11, color: '#d1d5db' }}>·</span>
              )}
              {service && (
                <span style={{ fontSize: 11, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
                  {isAr ? service.ar : service.en}
                </span>
              )}
            </div>
          </div>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: status.color, background: status.bg, borderRadius: 8, padding: '3px 10px', whiteSpace: 'nowrap', fontFamily: 'Inter, sans-serif', flexShrink: 0 }}>
            {isAr ? status.ar : status.en}
          </span>
        </div>

        {/* Date/time */}
        {(date || time) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <CalendarDays size={13} style={{ color: '#9ca3af', flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
              {[date, time].filter(Boolean).join(' · ')}
            </span>
          </div>
        )}

        {/* Flight number */}
        {b.flightNumber && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plane size={13} style={{ color: '#9ca3af', flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: '#374151', fontFamily: 'Inter, sans-serif' }}>{b.flightNumber}</span>
          </div>
        )}

        {/* Route */}
        {(b.pickupAddress || b.dropoffAddress) && (
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 3, flexShrink: 0 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#005C66' }} />
              {b.dropoffAddress && (
                <>
                  <div style={{ width: 1, flex: 1, background: '#d1d5db', minHeight: 16, margin: '3px 0' }} />
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', border: '2px solid #ef4444' }} />
                </>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, minWidth: 0 }}>
              {b.pickupAddress && (
                <span style={{ fontSize: 13, color: '#1a1a2e', fontFamily: 'Inter, sans-serif', lineHeight: 1.4, wordBreak: 'break-word' }}>
                  {b.pickupAddress}
                </span>
              )}
              {b.dropoffAddress && (
                <span style={{ fontSize: 13, color: '#6b7280', fontFamily: 'Inter, sans-serif', lineHeight: 1.4, wordBreak: 'break-word' }}>
                  {b.dropoffAddress}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Fare + payment status */}
        {(fare || payStatus) && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid #f3f4f6', gap: 8 }}>
            {payStatus ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: payStatus.color, background: payStatus.bg, borderRadius: 8, padding: '3px 9px', fontFamily: 'Inter, sans-serif', flexShrink: 0 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: payStatus.dot, display: 'inline-block', flexShrink: 0 }} />
                {isAr ? payStatus.ar : payStatus.en}
                {b.paymentMethod && (
                  <span style={{ fontWeight: 400, opacity: 0.7 }}>· {b.paymentMethod}</span>
                )}
              </span>
            ) : <span />}
            {fare && (
              <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 14, color: '#1a1a2e' }}>
                {fare}
              </span>
            )}
          </div>
        )}

        {/* Affordance: this card is clickable for more detail */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, paddingTop: (fare || payStatus) ? 0 : 8, borderTop: (fare || payStatus) ? 'none' : '1px solid #f3f4f6', marginTop: (fare || payStatus) ? -4 : 0 }}>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: '#005C66', fontFamily: 'Inter, sans-serif' }}>
            {isAr ? 'عرض التفاصيل' : 'View details'}
          </span>
          <ChevronRight size={13} style={{ color: '#005C66', transform: isAr ? 'rotate(180deg)' : 'none' }} />
        </div>
      </div>
    </div>
  )
}

// ── Detail dialog ────────────────────────────────────────────────────────────────

type VehicleClassDetail = VehicleClass & {
  description: string | null
  passengerCapacity: number | null
  luggageCapacity: number | null
  exampleModels: string | null
}

type BookingDetail = Omit<Booking, 'vehicleClass'> & {
  vehicleClass: VehicleClassDetail | null
  driverName: string | null
  driverPhone: string | null
  vehiclePlate: string | null
  vehicleColor: string | null
  vehicleMake: string | null
  vehicleModel: string | null
  vehicleYear: number | null
  baseFare: string | null
  distanceFare: string | null
  serviceFee: string | null
  vatAmount: string | null
}

function parseDetail(json: unknown): BookingDetail | null {
  const dataBlock = (json as Record<string, unknown>)?.data ?? json
  if (!dataBlock || typeof dataBlock !== 'object') return null
  const rec = dataBlock as Record<string, unknown>
  const driver = rec.driver as Record<string, unknown> | undefined
  const vehicle = rec.vehicle as Record<string, unknown> | undefined
  const vehicleClass = rec.vehicleClass as Record<string, unknown> | undefined
  return {
    id: String(rec.id ?? ''),
    bookingNumber: (rec.bookingNumber as string) ?? null,
    serviceType: (rec.serviceType as string) ?? null,
    status: (rec.status as string) ?? 'pending',
    paymentStatus: (rec.paymentStatus as string) ?? null,
    paymentMethod: (rec.paymentMethod as string) ?? null,
    pickupAddress: (rec.pickupAddress as string) ?? null,
    dropoffAddress: (rec.dropoffAddress as string) ?? null,
    scheduledDatetime: (rec.scheduledDatetime as string) ?? null,
    totalFare: (rec.totalFare as string) ?? null,
    flightNumber: (rec.flightNumber as string) ?? null,
    vehicleClass: vehicleClass
      ? {
          className: (vehicleClass.className as string) ?? '',
          imageUrl: (vehicleClass.imageUrl as string) ?? null,
          description: (vehicleClass.description as string) ?? null,
          passengerCapacity: typeof vehicleClass.passengerCapacity === 'number' ? vehicleClass.passengerCapacity : null,
          luggageCapacity: typeof vehicleClass.luggageCapacity === 'number' ? vehicleClass.luggageCapacity : null,
          exampleModels: (vehicleClass.exampleModels as string) ?? null,
        }
      : null,
    driverName: (driver?.fullName as string) ?? (driver?.name as string) ?? null,
    driverPhone: (driver?.phone as string) ?? (driver?.phoneNumber as string) ?? null,
    vehiclePlate: (vehicle?.plateNumber as string) ?? (vehicle?.plate_number as string) ?? (vehicle?.plate as string) ?? null,
    vehicleColor: (vehicle?.color as string) ?? null,
    vehicleMake: (vehicle?.make as string) ?? null,
    vehicleModel: (vehicle?.model as string) ?? null,
    vehicleYear: typeof vehicle?.year === 'number' ? (vehicle.year as number) : null,
    baseFare: (rec.baseFare as string) ?? null,
    distanceFare: (rec.distanceFare as string) ?? null,
    serviceFee: (rec.serviceFee as string) ?? null,
    vatAmount: (rec.vatAmount as string) ?? null,
  }
}

function DetailRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
      <span style={{ color: '#9ca3af', flexShrink: 0, marginTop: 1 }}>{icon}</span>
      <span style={{ fontSize: 13, color: '#374151', fontFamily: 'Inter, sans-serif', lineHeight: 1.5 }}>{children}</span>
    </div>
  )
}

function BookingDetailDialog({ id, lang, dir, onClose, onCancelled }: {
  id: string | null
  lang: string
  dir: string
  onClose: () => void
  onCancelled: (bookingId: string) => void
}) {
  const isAr = lang === 'ar'
  const [detail, setDetail] = useState<BookingDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<'auth' | 'network' | null>(null)
  const [imgFailed, setImgFailed] = useState(false)
  const [cancelStep, setCancelStep] = useState<null | 'policy' | 'confirm' | 'loading' | 'done' | 'error'>(null)
  const [cancelReason, setCancelReason] = useState('')
  const [cancelErrMsg, setCancelErrMsg] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setDetail(null); setErr(null); setImgFailed(false); setCancelStep(null); setCancelReason(''); setCancelErrMsg(null)
    if (!id) return
    const token = readToken()
    if (!token) { setErr('auth'); return }
    setLoading(true)
    fetch(`/api/customers/bookings/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(json => setDetail(parseDetail(json)))
      .catch(() => setErr('network'))
      .finally(() => setLoading(false))
  }, [id])

  // Lock background scroll (and pause Lenis smooth-scroll) while the dialog is open
  useEffect(() => {
    if (id) {
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
  }, [id])

  // Prevent Lenis from intercepting wheel/touch events inside the dialog so
  // native overflow-y: auto scroll works. stopPropagation stops the event before
  // it reaches Lenis's listener on window; we don't call preventDefault so the
  // browser still handles the scroll natively.
  useEffect(() => {
    const el = scrollRef.current
    if (!el || !id) return
    const stop = (e: WheelEvent | TouchEvent) => e.stopPropagation()
    el.addEventListener('wheel', stop, { passive: true })
    el.addEventListener('touchmove', stop, { passive: true })
    return () => {
      el.removeEventListener('wheel', stop)
      el.removeEventListener('touchmove', stop)
    }
  }, [id])

  // Cancellation is blocked within 2 hours of pickup (backend rule — we mirror it client-side)
  const cutoffPassed = detail?.scheduledDatetime
    ? (() => {
        const ms = new Date(detail.scheduledDatetime!).getTime()
        return !isNaN(ms) && (ms - Date.now()) < 2 * 60 * 60 * 1000
      })()
    : false
  const canCancel = detail ? CANCELLABLE_STATUSES.has(detail.status) && !cutoffPassed : false
  const showCutoffNotice = detail ? CANCELLABLE_STATUSES.has(detail.status) && cutoffPassed : false

  async function cancelBooking() {
    const token = readToken()
    if (!token || !detail) return
    setCancelStep('loading')
    try {
      const res = await fetch(`/api/bookings/${detail.id}/cancel`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason: cancelReason.trim() }),
      })
      if (res.ok) {
        setCancelStep('done')
        setTimeout(() => { onCancelled(detail.id); onClose() }, 2200)
      } else if (res.status === 400) {
        setCancelErrMsg(isAr
          ? 'انتهت فترة الإلغاء. يُسمح بالإلغاء قبل ساعتين أو أكثر من موعد الرحلة.'
          : 'Cancellation window has passed. Cancellations must be made more than 2 hours before pickup.')
        setCancelStep('error')
      } else {
        setCancelErrMsg(isAr ? 'تعذر إلغاء الحجز. يرجى المحاولة مجدداً.' : 'Could not cancel booking. Please try again.')
        setCancelStep('error')
      }
    } catch {
      setCancelErrMsg(isAr ? 'تعذر إلغاء الحجز. يرجى المحاولة مجدداً.' : 'Could not cancel booking. Please try again.')
      setCancelStep('error')
    }
  }

  const status = detail ? (STATUS[detail.status] ?? { en: detail.status, ar: detail.status, color: '#374151', bg: '#f3f4f6' }) : null
  const service = detail?.serviceType ? SERVICE[detail.serviceType] : null
  const date = detail ? fmtDate(detail.scheduledDatetime, lang) : ''
  const time = detail ? fmtTime(detail.scheduledDatetime) : ''
  const fare = detail ? fmtFare(detail.totalFare) : null

  return (
    <AnimatePresence>
      {id && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
          style={{ position: 'fixed', inset: 0, zIndex: 1100, display: 'grid', placeItems: 'center', padding: 'clamp(10px, 4vw, 18px)', boxSizing: 'border-box', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)' }}
          role="dialog" aria-modal="true"
          onClick={e => { if (e.target === e.currentTarget) onClose() }}
        >
          <motion.div
            ref={scrollRef}
            initial={{ opacity: 0, scale: 0.96, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            dir={dir}
            data-lenis-prevent
            style={{ width: 'min(420px, 100%)', maxWidth: '100%', maxHeight: 'calc(100dvh - 40px)', overflowY: 'auto', borderRadius: 18, background: '#fff', boxShadow: '0 16px 48px rgba(0,0,0,0.28)', overflowX: 'hidden', boxSizing: 'border-box' }}
          >
            {loading && (
              <div style={{ padding: '40px 24px', textAlign: 'center' }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#9ca3af' }}>
                  {isAr ? 'جاري التحميل…' : 'Loading…'}
                </span>
              </div>
            )}

            {!loading && err && (
              <div style={{ padding: '40px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <AlertCircle size={28} style={{ color: '#ef4444' }} />
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#6b7280' }}>
                  {err === 'auth'
                    ? (isAr ? 'يرجى تسجيل الدخول.' : 'Please sign in.')
                    : (isAr ? 'تعذر تحميل تفاصيل الحجز.' : 'Could not load booking details.')}
                </span>
                <button type="button" onClick={onClose} style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#374151', background: 'transparent', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 16px', cursor: 'pointer' }}>
                  {isAr ? 'إغلاق' : 'Close'}
                </button>
              </div>
            )}

            {!loading && !err && detail && (() => {
              const hasImage = !!detail.vehicleClass?.imageUrl && !imgFailed
              return (
              <>
                {hasImage && (
                  <div style={{ height: 130, background: '#f3f4f6', overflow: 'hidden' }}>
                    <img
                      src={detail.vehicleClass!.imageUrl!}
                      alt={detail.vehicleClass!.className}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={() => setImgFailed(true)}
                    />
                  </div>
                )}

                <div style={{ padding: 'clamp(14px, 5vw, 22px)', display: 'flex', flexDirection: 'column', gap: 14, boxSizing: 'border-box' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                    <div>
                      <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 15, color: '#111118', margin: '0 0 3px' }}>
                        {detail.bookingNumber ?? detail.id.slice(0, 8).toUpperCase()}
                      </p>
                      {service && (
                        <span style={{ fontSize: 12, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>{isAr ? service.ar : service.en}</span>
                      )}
                    </div>
                    {status && (
                      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: status.color, background: status.bg, borderRadius: 8, padding: '3px 10px', whiteSpace: 'nowrap', fontFamily: 'Inter, sans-serif', flexShrink: 0 }}>
                        {isAr ? status.ar : status.en}
                      </span>
                    )}
                  </div>

                  {(date || time) && <DetailRow icon={<CalendarDays size={14} />}>{[date, time].filter(Boolean).join(' · ')}</DetailRow>}
                  {detail.flightNumber && <DetailRow icon={<Plane size={14} />}>{detail.flightNumber}</DetailRow>}

                  {/* Fleet details */}
                  {(detail.vehicleClass?.className || detail.vehicleMake) && (() => {
                    const makeStr = detail.vehicleMake ?? ''
                    const modelStr = detail.vehicleModel ?? ''
                    const modelPart = modelStr && !makeStr.toLowerCase().includes(modelStr.toLowerCase()) ? modelStr : ''
                    const exactName = [makeStr || null, modelPart || null, detail.vehicleYear].filter(Boolean).join(' ')
                    return (
                    <div style={{ background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: 12, padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <Car size={14} style={{ color: '#005C66', flexShrink: 0 }} />
                        <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 13, color: '#111118' }}>
                          {exactName || detail.vehicleClass?.className}
                        </span>
                        {exactName && detail.vehicleClass?.className && (
                          <span style={{ fontSize: 11, color: '#9ca3af', fontFamily: 'Inter, sans-serif' }}>
                            {detail.vehicleClass.className}
                          </span>
                        )}
                        {detail.vehiclePlate && (
                          <span style={{ fontSize: 11, color: '#6b7280', fontFamily: 'Inter, sans-serif', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 6, padding: '1px 7px' }}>
                            {detail.vehiclePlate}
                          </span>
                        )}
                      </div>
                      {!exactName && detail.vehicleClass?.exampleModels && !detail.vehiclePlate && (
                        <span style={{ fontSize: 11.5, color: '#9ca3af', fontFamily: 'Inter, sans-serif', wordBreak: 'break-word' }}>
                          {isAr ? `أمثلة على السيارات: ${detail.vehicleClass.exampleModels}` : `e.g. ${detail.vehicleClass.exampleModels}`}
                        </span>
                      )}
                      {detail.vehicleClass?.description && (
                        <span style={{ fontSize: 12, color: '#6b7280', fontFamily: 'Inter, sans-serif', lineHeight: 1.5, wordBreak: 'break-word' }}>{detail.vehicleClass.description}</span>
                      )}
                    </div>
                    )
                  })()}

                  {detail.driverName && <DetailRow icon={<User size={14} />}>{detail.driverName}</DetailRow>}
                  {detail.driverPhone && <DetailRow icon={<Phone size={14} />}>{detail.driverPhone}</DetailRow>}

                  {(detail.pickupAddress || detail.dropoffAddress) && (
                    <div style={{ display: 'flex', gap: 10 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 3, flexShrink: 0 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#005C66' }} />
                        {detail.dropoffAddress && (
                          <>
                            <div style={{ width: 1, flex: 1, background: '#d1d5db', minHeight: 16, margin: '3px 0' }} />
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', border: '2px solid #ef4444' }} />
                          </>
                        )}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, minWidth: 0 }}>
                        {detail.pickupAddress && <span style={{ fontSize: 13, color: '#1a1a2e', fontFamily: 'Inter, sans-serif', lineHeight: 1.4, wordBreak: 'break-word' }}>{detail.pickupAddress}</span>}
                        {detail.dropoffAddress && <span style={{ fontSize: 13, color: '#6b7280', fontFamily: 'Inter, sans-serif', lineHeight: 1.4, wordBreak: 'break-word' }}>{detail.dropoffAddress}</span>}
                      </div>
                    </div>
                  )}

                  {(detail.baseFare || detail.distanceFare || detail.serviceFee || detail.vatAmount || fare) && (
                    <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <p style={{ margin: '0 0 2px', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {isAr ? 'تفاصيل السعر' : 'Fare breakdown'}
                      </p>
                      {detail.baseFare && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 12.5, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>{isAr ? 'سعر الرحلة' : 'Trip fare'}</span>
                          <span style={{ fontSize: 12.5, color: '#374151', fontFamily: 'Inter, sans-serif' }}>{fmtFare(detail.baseFare)}</span>
                        </div>
                      )}
                      {/* distanceFare/serviceFee are components already folded into baseFare on this
                          endpoint (verified: baseFare + vatAmount ≈ totalFare) — shown as notes only,
                          not summed, to avoid a breakdown that visibly doesn't add up. */}
                      {(!!detail.distanceFare || !!detail.serviceFee) && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, paddingInlineStart: 10 }}>
                          {detail.distanceFare && (
                            <span style={{ fontSize: 11.5, color: '#9ca3af', fontFamily: 'Inter, sans-serif' }}>
                              {isAr ? `يشمل مسافة: ${fmtFare(detail.distanceFare)}` : `includes distance: ${fmtFare(detail.distanceFare)}`}
                            </span>
                          )}
                          {detail.serviceFee && Number(detail.serviceFee) > 0 && (
                            <span style={{ fontSize: 11.5, color: '#9ca3af', fontFamily: 'Inter, sans-serif' }}>
                              {isAr ? `يشمل رسوم خدمة: ${fmtFare(detail.serviceFee)}` : `includes service fee: ${fmtFare(detail.serviceFee)}`}
                            </span>
                          )}
                        </div>
                      )}
                      {detail.vatAmount && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 12.5, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>{isAr ? 'ضريبة القيمة المضافة' : 'VAT'}</span>
                          <span style={{ fontSize: 12.5, color: '#374151', fontFamily: 'Inter, sans-serif' }}>{fmtFare(detail.vatAmount)}</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, marginTop: 2, borderTop: '1px dashed #e5e7eb' }}>
                        <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 13, color: '#1a1a2e' }}>{isAr ? 'الإجمالي' : 'Total'}</span>
                        {fare && <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 16, color: '#1a1a2e' }}>{fare}</span>}
                      </div>
                      {detail.paymentStatus && PAYMENT_STATUS[detail.paymentStatus] && (
                        <span style={{ display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: PAYMENT_STATUS[detail.paymentStatus].color, background: PAYMENT_STATUS[detail.paymentStatus].bg, borderRadius: 8, padding: '3px 9px', fontFamily: 'Inter, sans-serif' }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: PAYMENT_STATUS[detail.paymentStatus].dot, display: 'inline-block' }} />
                          {isAr ? PAYMENT_STATUS[detail.paymentStatus].ar : PAYMENT_STATUS[detail.paymentStatus].en}
                          {detail.paymentMethod && <span style={{ fontWeight: 400, opacity: 0.7 }}>· {detail.paymentMethod}</span>}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Cancel flow */}
                  <CancellationPolicySheet
                    open={cancelStep === 'policy'}
                    onGotIt={() => setCancelStep('confirm')}
                  />

                  {cancelStep === 'confirm' && (
                    <div style={{ background: '#fff7f7', border: '1px solid #fecaca', borderRadius: 12, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        <AlertCircle size={16} style={{ color: '#dc2626', flexShrink: 0, marginTop: 1 }} />
                        <div>
                          <p style={{ margin: '0 0 3px', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13, color: '#dc2626' }}>
                            {isAr ? 'هل تريد إلغاء هذا الحجز؟' : 'Cancel this booking?'}
                          </p>
                          <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#6b7280', lineHeight: 1.5 }}>
                            {isAr ? 'لا يمكن التراجع عن هذا الإجراء. تتم معالجة المبالغ المستردة خارج النظام.' : 'This cannot be undone. Refunds are handled outside the system.'}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <textarea
                          value={cancelReason}
                          onChange={e => setCancelReason(e.target.value.slice(0, 100))}
                          placeholder={isAr ? 'سبب الإلغاء' : 'Reason for cancellation'}
                          rows={2}
                          maxLength={100}
                          style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#374151', background: '#fff', border: `1px solid ${cancelReason.trim() ? '#fca5a5' : '#ef4444'}`, borderRadius: 8, padding: '8px 10px', resize: 'vertical', outline: 'none', width: '100%', boxSizing: 'border-box' }}
                          dir={dir}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          {!cancelReason.trim() && (
                            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#dc2626' }}>
                              {isAr ? 'مطلوب' : 'Required'}
                            </span>
                          )}
                          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: cancelReason.length >= 90 ? '#dc2626' : '#9ca3af', marginInlineStart: 'auto' }}>
                            {cancelReason.length}/100
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          type="button"
                          onClick={cancelBooking}
                          disabled={!cancelReason.trim()}
                          style={{ flex: 1, fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 12.5, color: '#fff', background: cancelReason.trim() ? '#dc2626' : '#fca5a5', border: 'none', borderRadius: 10, padding: '9px 14px', cursor: cancelReason.trim() ? 'pointer' : 'not-allowed' }}
                        >
                          {isAr ? 'تأكيد الإلغاء' : 'Confirm Cancellation'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setCancelStep(null)}
                          style={{ flex: 1, fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 12.5, color: '#374151', background: 'transparent', border: '1px solid #e5e7eb', borderRadius: 10, padding: '9px 14px', cursor: 'pointer' }}
                        >
                          {isAr ? 'احتفظ بالحجز' : 'Keep Booking'}
                        </button>
                      </div>
                    </div>
                  )}

                  {cancelStep === 'loading' && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 0' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#005C66" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }}>
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#005C66' }}>
                        {isAr ? 'جاري الإلغاء…' : 'Cancelling…'}
                      </span>
                      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                    </div>
                  )}

                  {cancelStep === 'done' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '12px 14px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#166534' }}>
                        {isAr ? 'تم إلغاء الحجز بنجاح.' : 'Booking cancelled successfully.'}
                      </span>
                    </div>
                  )}

                  {cancelStep === 'error' && (
                    <div style={{ background: '#fff7f7', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        <AlertCircle size={14} style={{ color: '#dc2626', flexShrink: 0, marginTop: 1 }} />
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12.5, color: '#dc2626', lineHeight: 1.5 }}>{cancelErrMsg}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCancelStep(null)}
                        style={{ alignSelf: 'flex-start', fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600, color: '#374151', background: 'transparent', border: '1px solid #e5e7eb', borderRadius: 8, padding: '6px 14px', cursor: 'pointer' }}
                      >
                        {isAr ? 'حسناً' : 'OK'}
                      </button>
                    </div>
                  )}

                  {/* Cutoff notice — status is cancellable but window has passed */}
                  {showCutoffNotice && !cancelStep && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7, background: '#fefce8', border: '1px solid #fde68a', borderRadius: 10, padding: '10px 12px' }}>
                      <AlertCircle size={14} style={{ color: '#b45309', flexShrink: 0, marginTop: 1 }} />
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12.5, color: '#92400e', lineHeight: 1.5 }}>
                        {isAr
                          ? 'لا يمكن الإلغاء — انتهت فترة الإلغاء (أقل من ساعتين قبل الرحلة).'
                          : 'Cancellation unavailable — less than 2 hours before pickup.'}
                      </span>
                    </div>
                  )}

                  {/* Bottom action row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    {canCancel && !cancelStep && (
                      <button
                        type="button"
                        onClick={() => setCancelStep('policy')}
                        style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 12.5, color: '#dc2626', background: 'transparent', border: '1px solid #fca5a5', borderRadius: 10, padding: '9px 18px', cursor: 'pointer' }}
                      >
                        {isAr ? 'إلغاء الحجز' : 'Cancel Booking'}
                      </button>
                    )}
                    <span style={{ flex: 1 }} />
                    {cancelStep !== 'done' && (
                      <button
                        type="button"
                        onClick={onClose}
                        disabled={cancelStep === 'loading'}
                        style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 12.5, color: '#374151', background: 'transparent', border: '1px solid #e5e7eb', borderRadius: 10, padding: '9px 18px', cursor: cancelStep === 'loading' ? 'not-allowed' : 'pointer', opacity: cancelStep === 'loading' ? 0.5 : 1 }}
                      >
                        {isAr ? 'إغلاق' : 'Close'}
                      </button>
                    )}
                  </div>
                </div>
              </>
              )
            })()}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── Tabs ───────────────────────────────────────────────────────────────────────

const TAB_STATUS: Record<'upcoming' | 'in_progress' | 'past' | 'canceled', string> = {
  upcoming:    'scheduled',
  in_progress: 'in_progress',
  past:        'completed',
  canceled:    'cancelled',
}
const TABS: { key: 'upcoming' | 'in_progress' | 'past' | 'canceled'; en: string; ar: string }[] = [
  { key: 'upcoming',    en: 'Scheduled',   ar: 'المجدولة' },
  { key: 'in_progress', en: 'In Progress', ar: 'الجارية' },
  { key: 'past',        en: 'Completed',   ar: 'المكتملة' },
  { key: 'canceled',    en: 'Cancelled',   ar: 'الملغاة'  },
]

type Tab = 'upcoming' | 'in_progress' | 'past' | 'canceled'

type TabCache = { items: Booking[]; total: number; page: number }

function parseItems(json: unknown): { items: Booking[]; total: number; page: number } {
  const dataBlock = (json as Record<string, unknown>)?.data ?? json
  const raw: Record<string, unknown>[] = Array.isArray((dataBlock as Record<string, unknown>)?.items)
    ? (dataBlock as Record<string, unknown[]>).items as Record<string, unknown>[]
    : Array.isArray(dataBlock) ? dataBlock as Record<string, unknown>[]
    : []
  const total = Number((dataBlock as Record<string, unknown>)?.total ?? raw.length)
  const page  = Number((dataBlock as Record<string, unknown>)?.page ?? 1)

  const items: Booking[] = raw.map(b => ({
    id: String(b.id ?? ''),
    bookingNumber: (b.bookingNumber as string) ?? null,
    serviceType: (b.serviceType as string) ?? null,
    status: (b.status as string) ?? 'pending',
    paymentStatus: (b.paymentStatus as string) ?? null,
    paymentMethod: (b.paymentMethod as string) ?? null,
    pickupAddress: (b.pickupAddress as string) ?? null,
    dropoffAddress: (b.dropoffAddress as string) ?? null,
    scheduledDatetime: (b.scheduledDatetime as string) ?? null,
    totalFare: (b.totalFare as string) ?? null,
    flightNumber: (b.flightNumber as string) ?? null,
    vehicleClass: b.vehicleClass
      ? { className: (b.vehicleClass as Record<string, string>).className ?? '', imageUrl: (b.vehicleClass as Record<string, string>).imageUrl ?? null }
      : null,
  }))
  return { items, total, page }
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function JourneysPageContent() {
  const { lang, dir } = useLanguage()
  const router = useRouter()
  const isAr = lang === 'ar'

  const [tab, setTab] = useState<Tab>('upcoming')
  const [cache, setCache] = useState<Partial<Record<Tab, TabCache>>>({})
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<'auth' | 'network' | null>(null)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [detailId, setDetailId] = useState<string | null>(null)

  function handleCancelled(bookingId: string) {
    setCache(prev => {
      const next = { ...prev }
      for (const key of Object.keys(next) as Tab[]) {
        if (next[key]) {
          next[key] = {
            ...next[key]!,
            items: next[key]!.items.filter(b => b.id !== bookingId),
            total: Math.max(0, next[key]!.total - 1),
          }
        }
      }
      return next
    })
    setDetailId(null)
  }

  const current = cache[tab]
  const shown = current?.items
  const hasMore = current ? current.items.length < current.total : false

  async function fetchPage(pageNum: number, append: boolean) {
    const token = readToken()
    if (!token) { setError('auth'); return }

    append ? setLoadingMore(true) : setLoading(true)
    try {
      const res = await fetch(
        `/api/customers/bookings?status=${TAB_STATUS[tab]}&page=${pageNum}&limit=10`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (res.status === 401) { setError('auth'); return }
      if (!res.ok) { setError('network'); return }
      const json = await res.json()
      const parsed = parseItems(json)
      setCache(prev => {
        const existing = prev[tab]?.items ?? []
        return {
          ...prev,
          [tab]: {
            items: append ? [...existing, ...parsed.items] : parsed.items,
            total: parsed.total,
            page: parsed.page,
          },
        }
      })
    } catch {
      setError('network')
    } finally {
      append ? setLoadingMore(false) : setLoading(false)
    }
  }

  useEffect(() => {
    if (cache[tab] !== undefined) return
    fetchPage(1, false)
  }, [tab])

  if (error === 'auth') {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#f8f8fa' }}>
        <Navbar frosted />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#fff', border: '1px solid #e9e8ec', borderRadius: 16, padding: '40px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center', maxWidth: 360 }}>
            <LogIn size={36} style={{ color: '#9ca3af' }} />
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#6b7280', margin: 0 }}>
              {isAr ? 'يرجى تسجيل الدخول لعرض رحلاتك.' : 'Please sign in to view your journeys.'}
            </p>
            <button type="button" onClick={() => router.push('/')} style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: 13, padding: '10px 24px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer' }}>
              {isAr ? 'تسجيل الدخول' : 'Sign in'}
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f8f8fa' }}>
      <Navbar frosted />

      <main style={{ flex: 1, maxWidth: 760, width: '100%', margin: '0 auto', padding: '36px 16px 72px' }} dir={dir}>
        <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 'clamp(20px, 3vw, 26px)', color: '#111118', margin: '0 0 24px', letterSpacing: '-0.01em' }}>
          {isAr ? 'رحلاتي' : 'My Journeys'}
        </h1>

        {/* Tab strip */}
        <div
          className="no-scrollbar"
          style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#ebebf0', borderRadius: 12, padding: 4, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}
        >
          {TABS.map(t => {
            const active = tab === t.key
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                style={{
                  flex: '1 1 110px', whiteSpace: 'nowrap', textAlign: 'center', fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: 13,
                  padding: '9px 12px', borderRadius: 9, border: 'none', cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  background: active ? '#fff' : 'transparent',
                  color: active ? '#1a1a2e' : '#9ca3af',
                  boxShadow: active ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                {isAr ? t.ar : t.en}
                {cache[t.key] != null && cache[t.key]!.items.filter(b => b.paymentStatus === 'paid').length > 0 && (
                  <span style={{ marginInlineStart: 6, fontSize: 11, borderRadius: 999, padding: '1px 6px', background: active ? '#1a1a2e' : '#d1d5db', color: active ? '#fff' : '#6b7280' }}>
                    {cache[t.key]!.items.filter(b => b.paymentStatus === 'paid').length}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Content */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ background: '#fff', border: '1px solid #e9e8ec', borderRadius: 18, overflow: 'hidden' }}>
                <div style={{ height: 90, background: '#f3f4f6' }} />
                <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ height: 14, width: 140, background: '#f3f4f6', borderRadius: 4 }} />
                    <div style={{ height: 22, width: 70, background: '#f3f4f6', borderRadius: 8 }} />
                  </div>
                  <div style={{ height: 12, width: 160, background: '#f3f4f6', borderRadius: 4 }} />
                  <div style={{ height: 12, width: '75%', background: '#f3f4f6', borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error === 'network' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ef4444' }}>
            <AlertCircle size={16} />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14 }}>
              {isAr ? 'حدث خطأ ما. يرجى المحاولة مجدداً.' : 'Something went wrong. Please try again.'}
            </span>
          </div>
        )}

        {!loading && !error && shown != null && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {shown.filter(b => b.paymentStatus === 'paid').length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 24px', color: '#9ca3af' }}>
                <CalendarDays size={40} style={{ margin: '0 auto 12px', color: '#d1d5db', display: 'block' }} />
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, margin: 0 }}>
                  {isAr ? 'لا توجد رحلات هنا' : 'No journeys here'}
                </p>
              </div>
            ) : (
              <>
                {shown.filter(b => b.paymentStatus === 'paid').map(b => <JourneyCard key={b.id} b={b} lang={lang} onOpen={setDetailId} />)}
                {hasMore && (
                  <button
                    type="button"
                    onClick={() => fetchPage((current?.page ?? 1) + 1, true)}
                    disabled={loadingMore}
                    style={{
                      fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: 13,
                      padding: '12px 0', borderRadius: 12, border: '1.5px solid #e5e7eb',
                      background: '#fff', color: '#374151', cursor: loadingMore ? 'not-allowed' : 'pointer',
                      opacity: loadingMore ? 0.6 : 1, width: '100%',
                    }}
                  >
                    {loadingMore
                      ? (isAr ? 'جاري التحميل…' : 'Loading…')
                      : (isAr ? `تحميل المزيد (${current!.total - shown.length} متبقية)` : `Load more (${current!.total - shown.length} remaining)`)}
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {/* Sign Out */}
        <div style={{ display: 'flex', justifyContent: isAr ? 'flex-start' : 'flex-end', marginTop: 32 }}>
          <button
            type="button"
            onClick={() => setLogoutOpen(true)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13,
              color: '#dc2626', background: 'transparent',
              border: '1px solid #fca5a5', borderRadius: 10,
              padding: '10px 20px', cursor: 'pointer',
            }}
          >
            <LogOut size={15} />
            {isAr ? 'تسجيل الخروج' : 'Sign Out'}
          </button>
        </div>
        <LogoutConfirmDialog
          open={logoutOpen}
          onKeep={() => setLogoutOpen(false)}
          onConfirm={() => { setLogoutOpen(false); doLogout(readToken(), router) }}
        />
        <BookingDetailDialog
          id={detailId}
          lang={lang}
          dir={dir}
          onClose={() => setDetailId(null)}
          onCancelled={handleCancelled}
        />
      </main>
    </div>
  )
}
