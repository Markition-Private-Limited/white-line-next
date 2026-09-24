'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarDays, MapPin, Clock, AlertCircle, LogIn } from 'lucide-react'
import Navbar from '../../layouts/Navbar'
import { useLanguage } from '../../context/LanguageContext'

const CUSTOMER_SESSION_KEY = 'whiteline.customerSession'

function readToken(): string | null {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(CUSTOMER_SESSION_KEY) ?? 'null')
    return parsed?.accessToken ?? null
  } catch { return null }
}

type Booking = {
  id: string
  // API returns camelCase
  bookingNumber?: string
  booking_number?: string
  status: string
  pickupAddress?: string
  pickup_address?: string
  dropoffAddress?: string
  dropoff_address?: string
  scheduledDatetime?: string
  scheduled_datetime?: string
  serviceType?: string
  service_type?: string
}

type ApiResult =
  | { success: boolean; data: { items: Booking[]; total?: number } }
  | { items: Booking[]; total?: number }
  | Booking[]

function getField<T>(b: Booking, camel: keyof Booking, snake: keyof Booking): T | undefined {
  return (b[camel] ?? b[snake]) as T | undefined
}

function isUpcoming(b: Booking): boolean {
  const dt = getField<string>(b, 'scheduledDatetime', 'scheduled_datetime')
  if (!dt) return false
  return new Date(dt) >= new Date()
}

const STATUS_LABEL: Record<string, { en: string; ar: string; color: string }> = {
  pending:   { en: 'Pending',      ar: 'في الانتظار',    color: '#f59e0b' },
  assigned:  { en: 'Assigned',     ar: 'تم التعيين',     color: '#3b82f6' },
  accepted:  { en: 'Confirmed',    ar: 'مؤكد',           color: '#10b981' },
  en_route:  { en: 'En Route',     ar: 'في الطريق',      color: '#6366f1' },
  arrived:   { en: 'Driver Arrived', ar: 'وصل السائق',   color: '#8b5cf6' },
  started:   { en: 'In Progress',  ar: 'جارٍ المشوار',   color: '#0ea5e9' },
  completed: { en: 'Completed',    ar: 'مكتمل',          color: '#22c55e' },
  cancelled: { en: 'Cancelled',    ar: 'ملغي',           color: '#ef4444' },
}

const SERVICE_LABEL: Record<string, { en: string; ar: string }> = {
  airport:     { en: 'Airport Transfer', ar: 'توصيل مطار'     },
  hourly:      { en: 'Hourly',           ar: 'بالساعة'        },
  city_to_city:{ en: 'City to City',     ar: 'بين المدن'       },
  half_day:    { en: 'Half Day',         ar: 'نصف يوم'        },
  full_day:    { en: 'Full Day',         ar: 'يوم كامل'       },
  one_way:     { en: 'One-Way Ride',     ar: 'مشوار باتجاه واحد'},
  city_trip:   { en: 'City Trip',        ar: 'رحلة المدن' },
  day_service: { en: 'Day Service',      ar: 'خدمة يومية'     },
}

function formatDate(iso: string | undefined, lang: string): string {
  if (!iso) return '--'
  try {
    return new Date(iso).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-GB', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    })
  } catch { return '--' }
}

function BookingCard({ booking, lang }: { booking: Booking; lang: string }) {
  const status = STATUS_LABEL[booking.status] ?? { en: booking.status, ar: booking.status, color: '#9ca3af' }
  const serviceType = getField<string>(booking, 'serviceType', 'service_type') ?? ''
  const service = SERVICE_LABEL[serviceType] ?? null
  const isRtl = lang === 'ar'
  const bookingNum = getField<string>(booking, 'bookingNumber', 'booking_number') ?? booking.id.slice(0, 8).toUpperCase()
  const pickupAddr = getField<string>(booking, 'pickupAddress', 'pickup_address')
  const dropoffAddr = getField<string>(booking, 'dropoffAddress', 'dropoff_address')
  const scheduledDt = getField<string>(booking, 'scheduledDatetime', 'scheduled_datetime')

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e9e8ec',
      borderRadius: 16,
      padding: '20px 22px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 600,
          fontSize: 13,
          color: '#1a1a2e',
          letterSpacing: '0.01em',
        }}>
          {bookingNum}
        </span>
        <span style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: status.color,
          background: `${status.color}18`,
          borderRadius: 6,
          padding: '2px 8px',
        }}>
          {isRtl ? status.ar : status.en}
        </span>
      </div>

      {(pickupAddr || dropoffAddr) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {pickupAddr && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <MapPin size={13} style={{ marginTop: 1, color: '#22c55e', flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: '#444', lineHeight: 1.4 }}>{pickupAddr}</span>
            </div>
          )}
          {dropoffAddr && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <MapPin size={13} style={{ marginTop: 1, color: '#ef4444', flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: '#444', lineHeight: 1.4 }}>{dropoffAddr}</span>
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        {scheduledDt && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <CalendarDays size={12} style={{ color: '#9ca3af' }} />
            <span style={{ fontSize: 12, color: '#6b7280' }}>{formatDate(scheduledDt, lang)}</span>
          </div>
        )}
        {service && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Clock size={12} style={{ color: '#9ca3af' }} />
            <span style={{ fontSize: 12, color: '#6b7280' }}>{isRtl ? service.ar : service.en}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '48px 24px',
      color: '#9ca3af',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12,
    }}>
      <CalendarDays size={40} style={{ color: '#d1d5db' }} />
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, margin: 0 }}>{message}</p>
    </div>
  )
}

export default function MyBookingsContent() {
  const { lang, dir } = useLanguage()
  const router = useRouter()
  const isRtl = dir === 'rtl'

  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<'auth' | 'network' | null>(null)

  const copy = {
    en: {
      title: 'My Bookings',
      upcoming: 'Upcoming',
      past: 'Past',
      noUpcoming: 'No upcoming bookings.',
      noPast: 'No past bookings.',
      authError: 'Please sign in to view your bookings.',
      signIn: 'Sign in',
      networkError: 'Something went wrong. Please try again later.',
      loading: 'Loading your bookings…',
    },
    ar: {
      title: 'حجوزاتي',
      upcoming: 'القادمة',
      past: 'السابقة',
      noUpcoming: 'لا توجد حجوزات قادمة.',
      noPast: 'لا توجد حجوزات سابقة.',
      authError: 'يرجى تسجيل الدخول لعرض حجوزاتك.',
      signIn: 'تسجيل الدخول',
      networkError: 'حدث خطأ ما. يرجى المحاولة مجدداً لاحقاً.',
      loading: 'جارٍ تحميل حجوزاتك…',
    },
  }
  const t = lang === 'ar' ? copy.ar : copy.en

  useEffect(() => {
    const token = readToken()
    if (!token) { setError('auth'); setLoading(false); return }

    fetch('/api/customers/bookings', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async res => {
        if (res.status === 401) { setError('auth'); return }
        if (!res.ok) { setError('network'); return }
        const json: ApiResult = await res.json()
        let items: Booking[]
        if (Array.isArray(json)) {
          items = json
        } else if ('data' in json && json.data?.items) {
          items = json.data.items
        } else if ('items' in json) {
          items = json.items
        } else {
          items = []
        }
        setBookings(items)
      })
      .catch(() => setError('network'))
      .finally(() => setLoading(false))
  }, [])

  const upcoming = bookings.filter(isUpcoming)
  const past = bookings.filter(b => !isUpcoming(b))
  const shown = tab === 'upcoming' ? upcoming : past

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f8f8fa' }}>
      <Navbar solid />

      <main style={{ flex: 1, maxWidth: 720, width: '100%', margin: '0 auto', padding: '32px 16px 64px' }} dir={dir}>
        <h1 style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: 'clamp(22px, 4vw, 30px)',
          fontWeight: 700,
          color: '#1a1a2e',
          margin: '0 0 24px',
          letterSpacing: '-0.01em',
        }}>
          {t.title}
        </h1>

        {loading && (
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#9ca3af', margin: '24px 0' }}>{t.loading}</p>
        )}

        {!loading && error === 'auth' && (
          <div style={{
            background: '#fff',
            border: '1px solid #e9e8ec',
            borderRadius: 16,
            padding: '32px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
            textAlign: 'center',
          }}>
            <LogIn size={36} style={{ color: '#9ca3af' }} />
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#6b7280', margin: 0 }}>{t.authError}</p>
            <button
              type="button"
              onClick={() => router.push('/')}
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 600,
                fontSize: 13,
                padding: '10px 24px',
                background: '#1a1a2e',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                cursor: 'pointer',
              }}
            >
              {t.signIn}
            </button>
          </div>
        )}

        {!loading && error === 'network' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ef4444', marginTop: 24 }}>
            <AlertCircle size={16} />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14 }}>{t.networkError}</span>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#ebebf0', borderRadius: 12, padding: 4 }}>
              {(['upcoming', 'past'] as const).map(t2 => (
                <button
                  key={t2}
                  type="button"
                  onClick={() => setTab(t2)}
                  style={{
                    flex: 1,
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 600,
                    fontSize: 13,
                    padding: '9px 0',
                    borderRadius: 9,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    background: tab === t2 ? '#fff' : 'transparent',
                    color: tab === t2 ? '#1a1a2e' : '#9ca3af',
                    boxShadow: tab === t2 ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                  }}
                >
                  {t2 === 'upcoming' ? t.upcoming : t.past}
                  {t2 === 'upcoming' && upcoming.length > 0 && (
                    <span style={{ marginInlineStart: 6, fontSize: 11, background: '#1a1a2e', color: '#fff', borderRadius: 999, padding: '1px 6px' }}>
                      {upcoming.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {shown.length === 0
                ? <EmptyState message={tab === 'upcoming' ? t.noUpcoming : t.noPast} />
                : shown.map(b => <BookingCard key={b.id} booking={b} lang={lang} />)
              }
            </div>
          </>
        )}
      </main>
    </div>
  )
}
