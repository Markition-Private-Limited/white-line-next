'use client'
import { useState } from 'react'
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react'
import Navbar from '../layouts/Navbar'
import b2bBanner from '../assets/b2b/b2b_login.png'
import logoSvg from '../assets/fav_icon_black.svg'

const bannerSrc = (b2bBanner as any).src ?? b2bBanner
const logoSrc = (logoSvg as any).src ?? logoSvg

export default function B2BLoginPage() {
  const [tab, setTab] = useState<'login' | 'signup'>('login')
  const [showPass, setShowPass] = useState(false)
  const [remember, setRemember] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* ── Navbar — full width white bar ─────────────────── */}
      <Navbar solid />

      {/* ── Split layout ──────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row flex-1">
      {/* ── Left: Image panel ─────────────────────────────── */}
      <div className="relative w-full lg:w-1/2 h-[48vh] lg:h-auto flex-shrink-0 overflow-hidden" style={{ minHeight: 'calc(100vh - 64px)' }}>
        {/* Banner */}
        <img
          src={bannerSrc}
          alt="B2B"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top-left: logo + portal title */}
        <div className="absolute top-0 left-0 pt-6 lg:pt-8 px-6 lg:px-10 z-10">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-0.5">
              <img
                src={logoSrc}
                alt="White Line"
                style={{ width: 28, height: 30, filter: 'brightness(0) invert(1)' }}
              />
              <span
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: 7,
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  color: 'rgba(255,255,255,0.55)',
                  textTransform: 'uppercase',
                }}
              >
                WHITE LINE
              </span>
            </div>
            <h1
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: 'clamp(16px, 2vw, 22px)',
                fontWeight: 600,
                color: '#fff',
                letterSpacing: '0.01em',
              }}
            >
              B2B Client Portal
            </h1>
          </div>
        </div>

        {/* Bottom: tagline */}
        <div className="absolute bottom-14 lg:bottom-16 left-0 right-0 px-6 lg:px-10 z-10 text-center lg:text-left">
          <p
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 'clamp(22px, 3.2vw, 36px)',
              fontWeight: 700,
              fontStyle: 'italic',
              color: '#fff',
              marginBottom: 8,
              lineHeight: 1.2,
            }}
          >
            Precision in Motion
          </p>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(12px, 1.1vw, 14px)',
              color: 'rgba(255,255,255,0.6)',
              maxWidth: 420,
              lineHeight: 1.6,
              margin: '0 auto',
            }}
            className="lg:mx-0"
          >
            The command center for the world's most elite chauffeur logistics operations.
          </p>
        </div>

        {/* Footer strip */}
        <div
          className="absolute bottom-0 left-0 right-0 px-6 lg:px-10 py-3 flex items-center justify-between z-10"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            © 2026 Elite Chauffeur Logistics
          </span>
          <div className="hidden sm:flex items-center gap-4">
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.35)', cursor: 'pointer' }}>Privacy Policy</span>
            <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 10 }}>|</span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.35)', cursor: 'pointer' }}>Terms &amp; Conditions</span>
          </div>
        </div>
      </div>

      {/* ── Right: Form panel ──────────────────────────────── */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col items-center justify-center px-6 py-10 lg:py-0 relative">
        {/* Large faded logo watermark — desktop only */}
        <div className="hidden lg:flex absolute inset-0 items-center justify-center pointer-events-none select-none" style={{ zIndex: 0 }}>
          <img
            src={logoSrc}
            alt=""
            style={{ width: 220, height: 240, opacity: 0.05, filter: 'grayscale(1)' }}
          />
        </div>

        {/* Card */}
        <div
          className="relative w-full z-10"
          style={{
            maxWidth: 440,
            background: '#fff',
            borderRadius: 20,
            boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
            padding: 'clamp(24px, 4vw, 40px)',
          }}
        >
          {/* Tabs */}
          <div className="flex" style={{ borderBottom: '1px solid #e5e7eb', marginBottom: 28 }}>
            {(['login', 'signup'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1,
                  paddingBottom: 14,
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 15,
                  fontWeight: tab === t ? 600 : 400,
                  color: tab === t ? '#005C66' : '#9ca3af',
                  background: 'none',
                  border: 'none',
                  borderBottom: tab === t ? '2px solid #005C66' : '2px solid transparent',
                  marginBottom: -1,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textTransform: t === 'signup' ? 'none' : undefined,
                }}
              >
                {t === 'login' ? 'Login' : 'Sign UP'}
              </button>
            ))}
          </div>

          {/* Email */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: '#374151', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
              Email Address
            </label>
            <div
              className="flex items-center gap-3"
              style={{ background: '#f3f4f6', borderRadius: 10, padding: '0 14px', height: 48, border: '1px solid transparent' }}
            >
              <Mail size={16} color="#9ca3af" strokeWidth={1.6} />
              <input
                type="email"
                placeholder="Enter your email address"
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 14,
                  color: '#111118',
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 20 }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
              <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: '#374151', textTransform: 'uppercase' }}>
                Password
              </label>
              <button
                style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500, color: '#005C66', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                Forgot Password?
              </button>
            </div>
            <div
              className="flex items-center gap-3"
              style={{ background: '#f3f4f6', borderRadius: 10, padding: '0 14px', height: 48, border: '1px solid transparent' }}
            >
              <Lock size={16} color="#9ca3af" strokeWidth={1.6} />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Enter your password"
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 14,
                  color: '#111118',
                }}
              />
              <button
                onClick={() => setShowPass(v => !v)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
              >
                {showPass ? <EyeOff size={16} color="#9ca3af" /> : <Eye size={16} color="#9ca3af" />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <label
            className="flex items-center gap-2.5 cursor-pointer select-none"
            style={{ marginBottom: 28 }}
            onClick={() => setRemember(v => !v)}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                border: `1.5px solid ${remember ? '#005C66' : '#d1d5db'}`,
                background: remember ? '#005C66' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.2s',
              }}
            >
              {remember && (
                <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                  <path d="M1 3.5L3.5 6L8 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#6b7280' }}>Remember me</span>
          </label>

          {/* Submit */}
          <button
            className="group relative w-full overflow-hidden flex items-center justify-center gap-2"
            style={{
              height: 52,
              borderRadius: 999,
              background: '#005C66',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              fontSize: 15,
              fontWeight: 600,
              color: '#fff',
            }}
          >
            <span className="inline-flex items-center gap-2 transition duration-500 group-hover:-translate-y-[150%]">
              Login to Dashboard <ArrowRight size={16} />
            </span>
            <span className="absolute inset-0 inline-flex items-center justify-center gap-2 translate-y-full transition duration-500 group-hover:translate-y-0">
              <span className="absolute inset-0 skew-y-12 scale-y-0 bg-[#004d57] transition duration-500 translate-y-full group-hover:translate-y-0 group-hover:scale-150" />
              <span className="relative z-10 inline-flex items-center gap-2 text-white font-semibold">
                Login to Dashboard <ArrowRight size={16} />
              </span>
            </span>
          </button>
        </div>
      </div>
      </div>
    </div>
  )
}
