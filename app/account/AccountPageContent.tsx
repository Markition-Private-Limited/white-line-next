'use client'
import { useState } from 'react'
import { User, Mail, Settings, CheckCircle2, Bell, ChevronDown } from 'lucide-react'
import Navbar from '../../layouts/Navbar'
import { useLanguage } from '../../context/LanguageContext'

// ── Shared styles ──────────────────────────────────────────────────────────────

const CARD: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e9e8ec',
  borderRadius: 18,
  padding: '24px 24px',
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
}

const SECTION_TITLE: React.CSSProperties = {
  fontFamily: 'Montserrat, sans-serif',
  fontWeight: 700,
  fontSize: 15,
  color: '#111118',
  margin: 0,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
}

const LABEL: React.CSSProperties = {
  fontFamily: 'Inter, sans-serif',
  fontSize: 11,
  color: '#9ca3af',
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  margin: '0 0 4px',
}

const VALUE: React.CSSProperties = {
  fontFamily: 'Inter, sans-serif',
  fontSize: 14,
  color: '#1a1a2e',
  margin: 0,
}

function HR() {
  return <div style={{ height: 1, background: '#f3f4f6' }} />
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={LABEL}>{label}</p>
      <p style={VALUE}>{value}</p>
    </div>
  )
}

// ── Cards ──────────────────────────────────────────────────────────────────────

function PersonalInfoCard({ lang }: { lang: string }) {
  const isAr = lang === 'ar'
  return (
    <div style={CARD}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={SECTION_TITLE}>
          <User size={16} style={{ color: '#005C66' }} />
          {isAr ? 'المعلومات الشخصية' : 'Personal Information'}
        </p>
        <button type="button" style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600, color: '#005C66', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
          {isAr ? 'تعديل' : 'Edit'}
        </button>
      </div>
      <HR />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 18 }}>
        <Field label={isAr ? 'الاسم الكامل' : 'Full Name'} value="Tauqeer Ahmad" />
        <Field label={isAr ? 'رقم الجوال' : 'Mobile Number'} value="+966 50 123 4567" />
        <Field label={isAr ? 'الشركة' : 'Company'} value="—" />
        <Field label={isAr ? 'الموقع الأساسي' : 'Primary Location'} value="Riyadh, Saudi Arabia" />
      </div>
    </div>
  )
}

function EmailCard({ lang }: { lang: string }) {
  const isAr = lang === 'ar'
  return (
    <div style={CARD}>
      <p style={SECTION_TITLE}>
        <Mail size={16} style={{ color: '#005C66' }} />
        {isAr ? 'البريد الإلكتروني' : 'Email Address'}
      </p>
      <HR />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p style={{ ...LABEL, marginBottom: 4 }}>{isAr ? 'البريد الإلكتروني' : 'Email'}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={VALUE}>tauqeer@example.com</span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 3,
              fontSize: 11, fontWeight: 600, color: '#065f46',
              background: '#d1fae5', borderRadius: 6, padding: '2px 8px',
              fontFamily: 'Inter, sans-serif',
            }}>
              <CheckCircle2 size={10} />
              {isAr ? 'موثق' : 'Verified'}
            </span>
          </div>
        </div>
        <button type="button" style={{
          fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: 13,
          color: '#1a1a2e', background: 'transparent', border: '1.5px solid #e5e7eb',
          borderRadius: 10, padding: '8px 18px', cursor: 'pointer',
        }}>
          {isAr ? 'تغيير البريد' : 'Change Email'}
        </button>
      </div>
    </div>
  )
}

function SelectField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={LABEL}>{label}</p>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px', background: '#f8f8fa',
        border: '1px solid #e5e7eb', borderRadius: 10, cursor: 'pointer',
      }}>
        <span style={{ ...VALUE, fontSize: 13 }}>{value}</span>
        <ChevronDown size={14} style={{ color: '#9ca3af' }} />
      </div>
    </div>
  )
}

function ToggleRow({ label, desc, on }: { label: string; desc: string; on: boolean }) {
  const [enabled, setEnabled] = useState(on)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
      <div>
        <p style={{ ...VALUE, fontSize: 13, fontWeight: 500, margin: '0 0 2px' }}>{label}</p>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#9ca3af', margin: 0 }}>{desc}</p>
      </div>
      <button
        type="button"
        onClick={() => setEnabled(e => !e)}
        aria-pressed={enabled}
        style={{
          width: 40, height: 22, borderRadius: 999, flexShrink: 0, marginTop: 2,
          background: enabled ? '#005C66' : '#d1d5db',
          border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
        }}
      >
        <div style={{
          position: 'absolute', top: 3, width: 16, height: 16, borderRadius: '50%',
          background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          left: enabled ? 21 : 3, transition: 'left 0.2s',
        }} />
      </button>
    </div>
  )
}

function PreferencesCard({ lang }: { lang: string }) {
  const isAr = lang === 'ar'
  return (
    <div style={CARD}>
      <p style={SECTION_TITLE}>
        <Settings size={16} style={{ color: '#005C66' }} />
        {isAr ? 'تفضيلات الحساب' : 'Account Preferences'}
      </p>
      <HR />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        <SelectField label={isAr ? 'لغة العرض' : 'Display Language'} value={isAr ? 'العربية' : 'English'} />
        <SelectField label={isAr ? 'العملة المفضلة' : 'Preferred Currency'} value="SAR — Saudi Riyal" />
      </div>
      <HR />
      <div>
        <p style={{ ...SECTION_TITLE, fontSize: 13, marginBottom: 16 }}>
          <Bell size={14} style={{ color: '#6b7280' }} />
          {isAr ? 'إشعارات السفر' : 'Travel Notifications'}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ToggleRow
            label={isAr ? 'تحديثات الحجز' : 'Booking Updates'}
            desc={isAr ? 'تلقي إشعارات عند تغيير حالة الحجز' : 'Get notified when your booking status changes'}
            on={true}
          />
          <ToggleRow
            label={isAr ? 'تذكيرات الرحلة' : 'Trip Reminders'}
            desc={isAr ? 'تذكيرات قبل وقت الالتقاء' : 'Reminders before your pickup time'}
            on={true}
          />
          <ToggleRow
            label={isAr ? 'عروض وتحديثات' : 'Offers & Updates'}
            desc={isAr ? 'أخبار المنصة والعروض الترويجية' : 'Platform news and promotional offers'}
            on={false}
          />
        </div>
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function AccountPageContent() {
  const { lang, dir } = useLanguage()
  const isAr = lang === 'ar'

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
          {isAr ? 'حسابي' : 'My Account'}
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <PersonalInfoCard lang={lang} />
          <EmailCard lang={lang} />
          <PreferencesCard lang={lang} />
        </div>
      </main>
    </div>
  )
}
