'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarDays, MapPin, AlertCircle, LogIn, LogOut, Plane } from 'lucide-react'
import Navbar from '../../layouts/Navbar'
import LogoutConfirmDialog from '../../components/LogoutConfirmDialog'
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

function JourneyCard({ b, lang }: { b: Booking; lang: string }) {
  const isAr = lang === 'ar'
  const status = STATUS[b.status] ?? { en: b.status, ar: b.status, color: '#374151', bg: '#f3f4f6' }
  const payStatus = b.paymentStatus ? PAYMENT_STATUS[b.paymentStatus] ?? null : null
  const service = b.serviceType ? SERVICE[b.serviceType] : null
  const date = fmtDate(b.scheduledDatetime, lang)
  const time = fmtTime(b.scheduledDatetime)
  const fare = fmtFare(b.totalFare)

  return (
    <div style={{ background: '#fff', border: '1px solid #e9e8ec', borderRadius: 18, overflow: 'hidden' }}>
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
      </div>
    </div>
  )
}

// ── Tabs ───────────────────────────────────────────────────────────────────────

const TAB_STATUS: Record<'upcoming' | 'past' | 'canceled', string> = {
  upcoming: 'scheduled',
  past:     'completed',
  canceled: 'cancelled',
}
const TABS: { key: 'upcoming' | 'past' | 'canceled'; en: string; ar: string }[] = [
  { key: 'upcoming', en: 'Upcoming', ar: 'القادمة' },
  { key: 'past',     en: 'Past',     ar: 'السابقة' },
  { key: 'canceled', en: 'Cancelled', ar: 'الملغاة'  },
]

type Tab = 'upcoming' | 'past' | 'canceled'

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
        <Navbar solid minimal />
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
      <Navbar solid minimal />

      <main style={{ flex: 1, maxWidth: 760, width: '100%', margin: '0 auto', padding: '36px 16px 72px' }} dir={dir}>
        <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 'clamp(20px, 3vw, 26px)', color: '#111118', margin: '0 0 24px', letterSpacing: '-0.01em' }}>
          {isAr ? 'رحلاتي' : 'My Journeys'}
        </h1>

        {/* Tab strip */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#ebebf0', borderRadius: 12, padding: 4 }}>
          {TABS.map(t => {
            const active = tab === t.key
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                style={{
                  flex: 1, fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: 13,
                  padding: '9px 4px', borderRadius: 9, border: 'none', cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  background: active ? '#fff' : 'transparent',
                  color: active ? '#1a1a2e' : '#9ca3af',
                  boxShadow: active ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                {isAr ? t.ar : t.en}
                {cache[t.key] != null && cache[t.key]!.total > 0 && (
                  <span style={{ marginInlineStart: 6, fontSize: 11, borderRadius: 999, padding: '1px 6px', background: active ? '#1a1a2e' : '#d1d5db', color: active ? '#fff' : '#6b7280' }}>
                    {cache[t.key]!.total}
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
            {shown.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 24px', color: '#9ca3af' }}>
                <CalendarDays size={40} style={{ margin: '0 auto 12px', color: '#d1d5db', display: 'block' }} />
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, margin: 0 }}>
                  {isAr ? 'لا توجد رحلات هنا' : 'No journeys here'}
                </p>
              </div>
            ) : (
              <>
                {shown.map(b => <JourneyCard key={b.id} b={b} lang={lang} />)}
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
      </main>
    </div>
  )
}
