'use client'
import { useState } from 'react'
import { CalendarDays, Star, Users, ChevronRight, User } from 'lucide-react'
import Navbar from '../../layouts/Navbar'
import { useLanguage } from '../../context/LanguageContext'

// ── Types & mock data ──────────────────────────────────────────────────────────

type MockBooking = {
  id: string
  bookingNumber: string
  status: string
  serviceType: string
  pickupAddress: string
  dropoffAddress: string
  scheduledDatetime: string
  chauffeur: { name: string; rating: number } | null
  passengers: number
  fare: string
}

const d = 86400000
const now = Date.now()

const MOCK: Record<'upcoming' | 'past' | 'canceled', MockBooking[]> = {
  upcoming: [
    {
      id: '1', bookingNumber: 'WL-AF82K1', status: 'confirmed', serviceType: 'airport',
      pickupAddress: 'King Khalid International Airport (RUH), Terminal 5',
      dropoffAddress: 'Intercontinental Riyadh Hotel, King Fahd Road',
      scheduledDatetime: new Date(now + 2 * d).toISOString(),
      chauffeur: { name: 'Mohammed Al-Rashidi', rating: 4.9 }, passengers: 2, fare: 'SAR 180.00',
    },
    {
      id: '2', bookingNumber: 'WL-BT44X2', status: 'pending', serviceType: 'hourly',
      pickupAddress: 'Four Seasons Hotel Riyadh at Kingdom Centre',
      dropoffAddress: 'Al Faisaliah Tower, Olaya Street, Riyadh',
      scheduledDatetime: new Date(now + 5 * d).toISOString(),
      chauffeur: null, passengers: 1, fare: 'SAR 320.00',
    },
  ],
  past: [
    {
      id: '3', bookingNumber: 'WL-CX99P3', status: 'completed', serviceType: 'airport',
      pickupAddress: 'JW Marriott Hotel Riyadh, King Fahad Road',
      dropoffAddress: 'King Abdulaziz International Airport (JED), Terminal 1',
      scheduledDatetime: new Date(now - 3 * d).toISOString(),
      chauffeur: { name: 'Khalid Al-Otaibi', rating: 4.8 }, passengers: 3, fare: 'SAR 450.00',
    },
    {
      id: '4', bookingNumber: 'WL-DM12Q4', status: 'completed', serviceType: 'city_to_city',
      pickupAddress: 'Hilton Riyadh Hotel & Residences, Musa Ibn Nusayr Street',
      dropoffAddress: 'Hyatt Regency Jeddah Corniche, Jeddah',
      scheduledDatetime: new Date(now - 10 * d).toISOString(),
      chauffeur: { name: 'Fahad Al-Ghamdi', rating: 5.0 }, passengers: 2, fare: 'SAR 890.00',
    },
  ],
  canceled: [
    {
      id: '5', bookingNumber: 'WL-EK33W5', status: 'cancelled', serviceType: 'hourly',
      pickupAddress: 'Riyadh Park Mall, Northern Ring Branch Road',
      dropoffAddress: 'Saudi National Museum, King Fahd Road',
      scheduledDatetime: new Date(now - 1 * d).toISOString(),
      chauffeur: null, passengers: 1, fare: 'SAR 150.00',
    },
  ],
}

// ── Label maps ─────────────────────────────────────────────────────────────────

const STATUS: Record<string, { en: string; ar: string; color: string; bg: string }> = {
  pending:   { en: 'Pending',   ar: 'في الانتظار', color: '#b45309', bg: '#fef3c7' },
  confirmed: { en: 'Confirmed', ar: 'مؤكد',        color: '#065f46', bg: '#d1fae5' },
  accepted:  { en: 'Confirmed', ar: 'مؤكد',        color: '#065f46', bg: '#d1fae5' },
  assigned:  { en: 'Assigned',  ar: 'تم التعيين',  color: '#1e40af', bg: '#dbeafe' },
  completed: { en: 'Completed', ar: 'مكتمل',       color: '#166534', bg: '#dcfce7' },
  cancelled: { en: 'Cancelled', ar: 'ملغي',        color: '#991b1b', bg: '#fee2e2' },
}

const SERVICE: Record<string, { en: string; ar: string }> = {
  airport:      { en: 'Airport Transfer', ar: 'توصيل مطار'       },
  hourly:       { en: 'Hourly Charter',   ar: 'استئجار بالساعة'  },
  city_to_city: { en: 'City to City',     ar: 'بين المدن'         },
  half_day:     { en: 'Half Day',         ar: 'نصف يوم'          },
  full_day:     { en: 'Full Day',         ar: 'يوم كامل'         },
  one_way:      { en: 'One-Way Ride',     ar: 'مشوار باتجاه واحد'},
}

function fmtDate(iso: string, lang: string) {
  try { return new Date(iso).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) }
  catch { return '' }
}
function fmtTime(iso: string, lang: string) {
  try { return new Date(iso).toLocaleTimeString(lang === 'ar' ? 'ar-SA' : 'en-GB', { hour: '2-digit', minute: '2-digit', hour12: true }) }
  catch { return '' }
}

// ── Booking card ───────────────────────────────────────────────────────────────

function JourneyCard({ b, lang }: { b: MockBooking; lang: string }) {
  const isAr = lang === 'ar'
  const status = STATUS[b.status] ?? { en: b.status, ar: b.status, color: '#374151', bg: '#f3f4f6' }
  const service = SERVICE[b.serviceType]

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e9e8ec',
      borderRadius: 18,
      padding: '20px 22px',
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div>
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 14, color: '#111118', margin: '0 0 3px', letterSpacing: '0.03em' }}>
            {b.bookingNumber}
          </p>
          {service && (
            <span style={{ fontSize: 11, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
              {isAr ? service.ar : service.en}
            </span>
          )}
        </div>
        <span style={{
          fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase',
          color: status.color, background: status.bg, borderRadius: 8, padding: '3px 10px',
          whiteSpace: 'nowrap', fontFamily: 'Inter, sans-serif',
        }}>
          {isAr ? status.ar : status.en}
        </span>
      </div>

      {/* Date */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <CalendarDays size={13} style={{ color: '#9ca3af', flexShrink: 0 }} />
        <span style={{ fontSize: 13, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
          {fmtDate(b.scheduledDatetime, lang)} · {fmtTime(b.scheduledDatetime, lang)}
        </span>
      </div>

      {/* Route */}
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 3, flexShrink: 0 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#005C66' }} />
          <div style={{ width: 1, flex: 1, background: '#d1d5db', minHeight: 20, margin: '3px 0' }} />
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', border: '2px solid #ef4444' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 13, color: '#1a1a2e', fontFamily: 'Inter, sans-serif', lineHeight: 1.4, wordBreak: 'break-word' }}>
            {b.pickupAddress}
          </span>
          <span style={{ fontSize: 13, color: '#6b7280', fontFamily: 'Inter, sans-serif', lineHeight: 1.4, wordBreak: 'break-word' }}>
            {b.dropoffAddress}
          </span>
        </div>
      </div>

      {/* Chauffeur + fare */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
        {b.chauffeur ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, #005C66 0%, #007d8a 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <User size={15} color="#fff" />
            </div>
            <div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600, color: '#1a1a2e', margin: '0 0 2px' }}>
                {b.chauffeur.name}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Star size={10} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                <span style={{ fontSize: 11, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>{b.chauffeur.rating.toFixed(1)}</span>
                <span style={{ fontSize: 10, color: '#d1d5db' }}>·</span>
                <Users size={10} style={{ color: '#9ca3af' }} />
                <span style={{ fontSize: 11, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>{b.passengers}</span>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={15} color="#9ca3af" />
            </div>
            <span style={{ fontSize: 12, color: '#9ca3af', fontFamily: 'Inter, sans-serif' }}>
              {isAr ? 'لم يُعيَّن سائق بعد' : 'Chauffeur not assigned'}
            </span>
          </div>
        )}
        <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 14, color: '#1a1a2e' }}>
          {b.fare}
        </span>
      </div>

      {/* CTA */}
      <button
        type="button"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          width: '100%', padding: '10px 0',
          fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: 13,
          color: '#005C66', background: 'transparent',
          border: '1.5px solid #005C66', borderRadius: 10, cursor: 'pointer',
        }}
      >
        {isAr ? 'عرض الرحلة' : 'View Journey'}
        <ChevronRight size={14} />
      </button>
    </div>
  )
}

// ── Tab config ─────────────────────────────────────────────────────────────────

type Tab = 'upcoming' | 'past' | 'canceled'

const TABS: { key: Tab; en: string; ar: string }[] = [
  { key: 'upcoming', en: 'Upcoming', ar: 'القادمة' },
  { key: 'past',     en: 'Past',     ar: 'السابقة' },
  { key: 'canceled', en: 'Canceled', ar: 'الملغاة'  },
]

// ── Page ───────────────────────────────────────────────────────────────────────

export default function JourneysPageContent() {
  const { lang, dir } = useLanguage()
  const isAr = lang === 'ar'
  const [tab, setTab] = useState<Tab>('upcoming')
  const shown = MOCK[tab]

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f8f8fa' }}>
      <Navbar solid minimal />

      <main
        style={{ flex: 1, maxWidth: 760, width: '100%', margin: '0 auto', padding: '36px 16px 72px' }}
        dir={dir}
      >
        <h1 style={{
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 700,
          fontSize: 'clamp(20px, 3vw, 26px)',
          color: '#111118',
          margin: '0 0 24px',
          letterSpacing: '-0.01em',
        }}>
          {isAr ? 'رحلاتي' : 'My Journeys'}
        </h1>

        {/* Tab strip */}
        <div style={{
          display: 'flex', gap: 4, marginBottom: 20,
          background: '#ebebf0', borderRadius: 12, padding: 4,
        }}>
          {TABS.map(t => {
            const active = tab === t.key
            const count = MOCK[t.key].length
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                style={{
                  flex: 1,
                  fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: 13,
                  padding: '9px 4px', borderRadius: 9, border: 'none', cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  background: active ? '#fff' : 'transparent',
                  color: active ? '#1a1a2e' : '#9ca3af',
                  boxShadow: active ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                {isAr ? t.ar : t.en}
                {count > 0 && (
                  <span style={{
                    marginInlineStart: 6, fontSize: 11, borderRadius: 999, padding: '1px 6px',
                    background: active ? '#1a1a2e' : '#d1d5db',
                    color: active ? '#fff' : '#6b7280',
                  }}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {shown.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 24px', color: '#9ca3af' }}>
              <CalendarDays size={40} style={{ margin: '0 auto 12px', color: '#d1d5db', display: 'block' }} />
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, margin: 0 }}>
                {isAr ? 'لا توجد رحلات' : 'No journeys here'}
              </p>
            </div>
          ) : (
            shown.map(b => <JourneyCard key={b.id} b={b} lang={lang} />)
          )}
        </div>
      </main>
    </div>
  )
}
