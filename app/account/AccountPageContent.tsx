'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, CheckCircle2, LogIn, LogOut, AlertCircle, Pencil, X, Check, Trash2 } from 'lucide-react'
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
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

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

  async function handleDeleteAccount() {
    if (!token) return
    setDeleteLoading(true)
    setDeleteError(null)
    try {
      const res = await fetch('/api/customers/account', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('failed')
      try { localStorage.removeItem(CUSTOMER_SESSION_KEY) } catch {}
      window.dispatchEvent(new CustomEvent('whiteline:logout'))
      router.push('/')
    } catch {
      setDeleteError(isAr ? 'فشل حذف الحساب. حاول مجدداً.' : 'Failed to delete account. Please try again.')
      setDeleteLoading(false)
    }
  }

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

          {/* Sign Out */}
          <div style={{ display: 'flex', justifyContent: isAr ? 'flex-start' : 'flex-end', marginTop: 8 }}>
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
            onConfirm={() => { setLogoutOpen(false); doLogout(token, router) }}
          />

          {/* Danger zone — Delete account */}
          <div style={{ ...CARD, border: '1px solid #fee2e2', marginTop: 8 }}>
            <p style={{ ...SECTION_TITLE, color: '#dc2626' }}>
              <Trash2 size={16} style={{ color: '#dc2626' }} />
              {isAr ? 'منطقة الخطر' : 'Danger Zone'}
            </p>
            <HR />
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <p style={{ ...VALUE, fontWeight: 600, marginBottom: 4 }}>
                  {isAr ? 'حذف الحساب' : 'Delete Account'}
                </p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#6b7280', margin: 0, maxWidth: 420, lineHeight: 1.5 }}>
                  {isAr
                    ? 'سيؤدي هذا إلى حذف حسابك وجميع بياناتك بشكل دائم ولا يمكن التراجع عنه.'
                    : 'This will permanently delete your account and all associated data. This action cannot be undone.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => { setDeleteOpen(true); setDeleteError(null) }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8, flexShrink: 0,
                  fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13,
                  color: '#dc2626', background: '#fff5f5',
                  border: '1px solid #fca5a5', borderRadius: 10,
                  padding: '10px 20px', cursor: 'pointer',
                }}
              >
                <Trash2 size={14} />
                {isAr ? 'حذف الحساب' : 'Delete Account'}
              </button>
            </div>
          </div>

          {/* Delete account confirmation overlay */}
          {deleteOpen && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 1300, display: 'grid', placeItems: 'center', padding: 20, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}>
              <div style={{ background: '#fff', borderRadius: 18, padding: '32px 28px', maxWidth: 420, width: '100%', boxShadow: '0 24px 60px rgba(0,0,0,0.25)' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#fee2e2', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
                  <Trash2 size={22} color="#dc2626" />
                </div>
                <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 20, color: '#0f172a', margin: '0 0 8px', textAlign: 'center' }}>
                  {isAr ? 'هل أنت متأكد؟' : 'Are you sure?'}
                </h2>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#6b7280', margin: '0 0 24px', textAlign: 'center', lineHeight: 1.6 }}>
                  {isAr
                    ? 'سيتم حذف حسابك وجميع بياناتك بشكل دائم. لا يمكن التراجع عن هذا الإجراء.'
                    : 'Your account and all data will be permanently deleted. This cannot be undone.'}
                </p>
                {deleteError && (
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#dc2626', margin: '0 0 16px', textAlign: 'center' }}>
                    {deleteError}
                  </p>
                )}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setDeleteOpen(false)}
                    disabled={deleteLoading}
                    style={{ flex: 1, padding: '12px 0', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14, color: '#374151', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, cursor: 'pointer' }}
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading}
                    style={{ flex: 1, padding: '12px 0', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 14, color: '#fff', background: deleteLoading ? '#f87171' : '#dc2626', border: 'none', borderRadius: 12, cursor: deleteLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  >
                    {deleteLoading && <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />}
                    {deleteLoading ? (isAr ? 'جارٍ الحذف…' : 'Deleting…') : (isAr ? 'نعم، احذف حسابي' : 'Yes, delete my account')}
                  </button>
                </div>
              </div>
              <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
