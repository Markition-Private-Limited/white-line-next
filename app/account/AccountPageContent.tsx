'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, CheckCircle2, LogIn, AlertCircle, Pencil, X, Check } from 'lucide-react'
import Navbar from '../../layouts/Navbar'
import { useLanguage } from '../../context/LanguageContext'

const CUSTOMER_SESSION_KEY = 'whiteline.customerSession'

function readToken(): string | null {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(CUSTOMER_SESSION_KEY) ?? 'null')
    return parsed?.accessToken ?? null
  } catch { return null }
}

// Actual API shape: GET /api/v1/customers/profile returns { success, data: Profile }
type Profile = {
  id: string
  fullName: string | null
  email: string | null
  phone: string | null
  totalTrips: number | null
  averageRating: string | null
}

const CARD: React.CSSProperties = {
  background: '#fff', border: '1px solid #e9e8ec', borderRadius: 18,
  padding: '24px 24px', display: 'flex', flexDirection: 'column', gap: 20,
}
const SECTION_TITLE: React.CSSProperties = {
  fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 15, color: '#111118',
  margin: 0, display: 'flex', alignItems: 'center', gap: 8,
}
const LABEL: React.CSSProperties = {
  fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#9ca3af', fontWeight: 500,
  textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 4px',
}
const VALUE: React.CSSProperties = {
  fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#1a1a2e', margin: 0,
}
function HR() { return <div style={{ height: 1, background: '#f3f4f6' }} /> }

function Skeleton({ w = 140, h = 14 }: { w?: number; h?: number }) {
  return <div style={{ height: h, width: w, background: '#f3f4f6', borderRadius: 4 }} />
}

// ── Inline name editor ─────────────────────────────────────────────────────────
function NameField({ value, token, onSaved, lang }: {
  value: string | null
  token: string
  onSaved: (name: string) => void
  lang: string
}) {
  const isAr = lang === 'ar'
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value ?? '')
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { if (editing) inputRef.current?.focus() }, [editing])

  async function save() {
    const trimmed = draft.trim()
    if (!trimmed) { setErr(isAr ? 'الاسم مطلوب' : 'Name is required'); return }
    setSaving(true); setErr(null)
    try {
      const res = await fetch('/api/customers/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ full_name: trimmed }),
      })
      if (!res.ok) { setErr(isAr ? 'فشل التحديث' : 'Update failed'); return }
      onSaved(trimmed)
      setEditing(false)
    } catch {
      setErr(isAr ? 'فشل التحديث' : 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  if (!editing) {
    return (
      <div>
        <p style={LABEL}>{isAr ? 'الاسم الكامل' : 'Full Name'}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <p style={VALUE}>{value || '—'}</p>
          <button
            type="button"
            onClick={() => { setDraft(value ?? ''); setEditing(true) }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600, color: '#005C66', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <Pencil size={12} />
            {isAr ? 'تعديل' : 'Edit'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <p style={LABEL}>{isAr ? 'الاسم الكامل' : 'Full Name'}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <input
          ref={inputRef}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditing(false) }}
          disabled={saving}
          style={{
            fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#1a1a2e',
            border: '1.5px solid #005C66', borderRadius: 8, padding: '6px 10px',
            outline: 'none', minWidth: 180, background: '#fff',
          }}
        />
        <button
          type="button"
          onClick={save}
          disabled={saving}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600, color: '#fff', background: '#005C66', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}
        >
          <Check size={13} />
          {saving ? (isAr ? 'جاري الحفظ…' : 'Saving…') : (isAr ? 'حفظ' : 'Save')}
        </button>
        <button
          type="button"
          onClick={() => { setEditing(false); setErr(null) }}
          disabled={saving}
          style={{ display: 'inline-flex', alignItems: 'center', fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#6b7280', background: 'transparent', border: '1px solid #e5e7eb', borderRadius: 8, padding: '6px 10px', cursor: 'pointer' }}
        >
          <X size={13} />
        </button>
      </div>
      {err && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#ef4444', margin: '4px 0 0' }}>{err}</p>}
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function AccountPageContent() {
  const { lang, dir } = useLanguage()
  const router = useRouter()
  const isAr = lang === 'ar'
  const [profile, setProfile] = useState<Profile | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<'auth' | 'network' | null>(null)

  useEffect(() => {
    const t = readToken()
    if (!t) { setError('auth'); setLoading(false); return }
    setToken(t)

    fetch('/api/customers/profile', { headers: { Authorization: `Bearer ${t}` } })
      .then(async res => {
        if (res.status === 401) { setError('auth'); return }
        if (!res.ok) { setError('network'); return }
        const json = await res.json()
        // Backend returns { success: true, data: { fullName, email, phone, ... } }
        const p = json?.data ?? json
        setProfile({
          id: p.id ?? '',
          fullName: p.fullName ?? null,
          email: p.email ?? p.user?.email ?? null,
          phone: p.phone ?? p.user?.mobile ?? null,
          totalTrips: p.totalTrips ?? null,
          averageRating: p.averageRating ?? null,
        })
      })
      .catch(() => setError('network'))
      .finally(() => setLoading(false))
  }, [])

  if (!loading && error === 'auth') {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#f8f8fa' }}>
        <Navbar solid minimal />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#fff', border: '1px solid #e9e8ec', borderRadius: 16, padding: '40px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center', maxWidth: 360 }}>
            <LogIn size={36} style={{ color: '#9ca3af' }} />
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#6b7280', margin: 0 }}>
              {isAr ? 'يرجى تسجيل الدخول لعرض حسابك.' : 'Please sign in to view your account.'}
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
          {isAr ? 'حسابي' : 'My Account'}
        </h1>

        {!loading && error === 'network' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ef4444', marginBottom: 20 }}>
            <AlertCircle size={16} />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14 }}>
              {isAr ? 'تعذّر تحميل بيانات الملف الشخصي.' : 'Could not load profile data.'}
            </span>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Personal Information */}
          <div style={CARD}>
            <p style={SECTION_TITLE}>
              <User size={16} style={{ color: '#005C66' }} />
              {isAr ? 'المعلومات الشخصية' : 'Personal Information'}
            </p>
            <HR />

            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 18 }}>
                {[100, 130].map((w, i) => (
                  <div key={i}><Skeleton w={60} h={9} /><div style={{ marginTop: 6 }} /><Skeleton w={w} /></div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 18 }}>
                {token && (
                  <NameField
                    value={profile?.fullName ?? null}
                    token={token}
                    onSaved={name => setProfile(prev => prev ? { ...prev, fullName: name } : prev)}
                    lang={lang}
                  />
                )}
                <div>
                  <p style={LABEL}>{isAr ? 'رقم الجوال' : 'Mobile Number'}</p>
                  <p style={VALUE}>{profile?.phone || '—'}</p>
                </div>
              </div>
            )}

            {/* Stats */}
            {!loading && profile && (
              <>
                <HR />
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 22, color: '#005C66', margin: '0 0 2px' }}>
                      {profile.totalTrips ?? 0}
                    </p>
                    <p style={{ ...LABEL, textTransform: 'none', letterSpacing: 0, fontSize: 12 }}>
                      {isAr ? 'إجمالي الرحلات' : 'Total Trips'}
                    </p>
                  </div>
                  {profile.averageRating != null && parseFloat(profile.averageRating) > 0 && (
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 22, color: '#f59e0b', margin: '0 0 2px' }}>
                        {parseFloat(profile.averageRating).toFixed(1)}
                      </p>
                      <p style={{ ...LABEL, textTransform: 'none', letterSpacing: 0, fontSize: 12 }}>
                        {isAr ? 'متوسط التقييم' : 'Avg Rating'}
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Email */}
          <div style={CARD}>
            <p style={SECTION_TITLE}>
              <Mail size={16} style={{ color: '#005C66' }} />
              {isAr ? 'البريد الإلكتروني' : 'Email Address'}
            </p>
            <HR />
            {loading ? (
              <Skeleton w={200} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <p style={{ ...LABEL, marginBottom: 4 }}>{isAr ? 'البريد الإلكتروني' : 'Email'}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={VALUE}>{profile?.email || '—'}</span>
                    {profile?.email && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 600, color: '#065f46', background: '#d1fae5', borderRadius: 6, padding: '2px 8px', fontFamily: 'Inter, sans-serif' }}>
                        <CheckCircle2 size={10} />
                        {isAr ? 'موثق' : 'Verified'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
