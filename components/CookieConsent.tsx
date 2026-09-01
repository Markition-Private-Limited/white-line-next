'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { X, ChevronDown, ChevronUp, Globe, Check } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '../context/LanguageContext'
import { LANG_META, type LangCode } from '../lib/i18n'
import logoSvg from '../assets/fav_icon_black.svg'

const STORAGE_KEY = 'wl_cookie_consent'

type ConsentState = {
  analytics: boolean
  functional: boolean
  marketing: boolean
  decided: boolean
}

const defaultConsent: ConsentState = { analytics: false, functional: false, marketing: false, decided: false }

export default function CookieConsent() {
  const { trans, dir, lang, setLang } = useLanguage()
  const t = trans.cookieConsent
  const isRtl = dir === 'rtl'
  const fontFamily = isRtl ? 'var(--font-cairo), sans-serif' : 'var(--font-inter), sans-serif'

  const [visible, setVisible] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'categories' | 'services'>('categories')
  const [consent, setConsent] = useState<ConsentState>(defaultConsent)
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null)
  const [expandedService, setExpandedService] = useState<number | null>(null)
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)

  // Close lang dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Show banner on first visit
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as ConsentState
        if (parsed.decided) return
      }
    } catch {}
    const timer = setTimeout(() => setVisible(true), 800)
    return () => clearTimeout(timer)
  }, [])

  const saveAndClose = useCallback((next: ConsentState) => {
    const final = { ...next, decided: true }
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(final)) } catch {}
    setConsent(final)
    setVisible(false)
    setModalOpen(false)
  }, [])

  const acceptAll = useCallback(() => {
    saveAndClose({ analytics: true, functional: true, marketing: true, decided: true })
  }, [saveAndClose])

  const saveSettings = useCallback(() => saveAndClose(consent), [consent, saveAndClose])

  const toggleConsent = (key: keyof Omit<ConsentState, 'decided'>) =>
    setConsent(prev => ({ ...prev, [key]: !prev[key] }))

  const categoryKeys: Array<keyof Omit<ConsentState, 'decided'>> = ['analytics', 'functional', 'marketing']

  if (!visible && !modalOpen) return null

  const langs = Object.entries(LANG_META) as [LangCode, typeof LANG_META[LangCode]][]

  return (
    <>
      {/* ── Bottom banner ───────────────────────────────────────────── */}
      {visible && !modalOpen && (
        <div
          dir={dir}
          style={{ fontFamily, zIndex: 9998 }}
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
        >
          <div className={`w-full px-6 sm:px-10 py-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 sm:gap-12 ${isRtl ? 'sm:flex-row-reverse' : ''}`}>
            {/* Logo stacked above text */}
            <div className={`flex flex-col gap-2.5 min-w-0 flex-1 ${isRtl ? 'items-end' : 'items-start'}`}>
              <Image src={logoSvg} alt="White Line" width={34} height={34} className="shrink-0" />
              <p className={`text-sm leading-relaxed text-gray-600 ${isRtl ? 'text-right' : 'text-left'}`}>
                {t.banner.text}
              </p>
              <div className={`flex gap-5 ${isRtl ? 'justify-end' : 'justify-start'}`}>
                <Link href="/privacy" className="text-sm text-[#005C66] hover:underline font-medium">{t.modal.privacyPolicy}</Link>
                <Link href="/terms" className="text-sm text-[#005C66] hover:underline font-medium">{t.modal.legalNotice}</Link>
              </div>
            </div>
            {/* Buttons — full width on mobile, side-by-side on desktop, pinned to bottom */}
            <div className={`flex gap-3 shrink-0 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <button
                onClick={() => { setModalOpen(true); setVisible(false) }}
                className="flex-1 sm:flex-none sm:min-w-[180px] px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors whitespace-nowrap"
              >
                {t.banner.moreInfo}
              </button>
              <button
                onClick={acceptAll}
                className="flex-1 sm:flex-none sm:min-w-[180px] px-6 py-3 text-sm font-semibold text-white rounded-lg transition-opacity hover:opacity-90 whitespace-nowrap"
                style={{ background: '#005C66' }}
              >
                {t.banner.acceptAll}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal ───────────────────────────────────────────────────── */}
      {modalOpen && (
        <div
          style={{ zIndex: 9999 }}
          className="fixed inset-0 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <div
            dir={dir}
            style={{ fontFamily, maxHeight: 'min(90vh, 680px)' }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col"
          >
            {/* Header */}
            <div className={`flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <Image src={logoSvg} alt="White Line" width={40} height={40} className="shrink-0" />
                <div className={isRtl ? 'text-right' : 'text-left'}>
                  <h2 className="text-xl font-bold text-gray-900 leading-tight">White Line</h2>
                  <p className="text-base font-semibold text-gray-700 mt-0.5">{t.modal.title}</p>
                </div>
              </div>

              <div className={`flex items-center gap-1 ${isRtl ? 'flex-row-reverse' : ''}`}>
                {/* Language picker */}
                <div ref={langRef} className="relative">
                  <button
                    onClick={() => setLangOpen(o => !o)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                    aria-label="Change language"
                  >
                    <Globe size={20} />
                  </button>
                  {langOpen && (
                    <div
                      className={`absolute top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden min-w-[140px] ${isRtl ? 'left-0' : 'right-0'}`}
                      style={{ zIndex: 10000 }}
                    >
                      {langs.map(([code, meta]) => (
                        <button
                          key={code}
                          onClick={() => { setLang(code); setLangOpen(false) }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${isRtl ? 'flex-row-reverse' : ''} ${code === lang ? 'text-[#005C66] font-semibold' : 'text-gray-700'}`}
                        >
                          <span className={`fi fi-${meta.flagCode} text-base`} />
                          <span className="flex-1 text-left">{meta.nativeLabel}</span>
                          {code === lang && <Check size={14} className="text-[#005C66] shrink-0" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => { setModalOpen(false); setVisible(true) }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Description */}
            <div className={`px-6 pt-5 pb-3 shrink-0 ${isRtl ? 'text-right' : 'text-left'}`}>
              <p className="text-sm text-amber-600 leading-relaxed">{t.modal.desc}</p>
              <div className={`flex gap-5 mt-2.5 ${isRtl ? 'justify-end' : 'justify-start'}`}>
                <Link href="/privacy" className="text-sm text-[#005C66] hover:underline font-medium">{t.modal.privacyPolicy}</Link>
                <Link href="/terms" className="text-sm text-[#005C66] hover:underline font-medium">{t.modal.legalNotice}</Link>
              </div>
            </div>

            {/* Tabs */}
            <div className={`flex border-b border-gray-200 px-6 shrink-0 ${isRtl ? 'flex-row-reverse' : ''}`}>
              {(['categories', 'services'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3.5 text-sm font-semibold transition-colors border-b-2 ${isRtl ? 'ml-7' : 'mr-7'} ${
                    activeTab === tab
                      ? 'border-[#005C66] text-[#005C66]'
                      : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab === 'categories' ? t.modal.tabs.categories : t.modal.tabs.services}
                </button>
              ))}
            </div>

            {/* Scrollable content — data-lenis-prevent stops Lenis hijacking scroll inside here */}
            <div
              className="flex-1 overflow-y-auto overscroll-contain"
              data-lenis-prevent
            >
              {/* Categories */}
              {activeTab === 'categories' && (
                <div className="p-5 space-y-3">
                  {t.modal.categories.map((cat, i) => {
                    const key = categoryKeys[i - 1]
                    const isExpanded = expandedCategory === i
                    const isOn = cat.required || (key ? consent[key] : false)

                    return (
                      <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          className={`w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors ${isRtl ? 'flex-row-reverse' : ''}`}
                          onClick={() => setExpandedCategory(isExpanded ? null : i)}
                        >
                          <div className={`flex items-center gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                            {/* Toggle */}
                            <div
                              role="switch"
                              aria-checked={isOn}
                              onClick={e => {
                                e.stopPropagation()
                                if (!cat.required && key) toggleConsent(key)
                              }}
                              className={`relative rounded-full transition-colors shrink-0 ${cat.required ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                              style={{ width: 44, height: 24, background: isOn ? '#005C66' : '#D1D5DB' }}
                            >
                              <span
                                className="absolute bg-white rounded-full shadow-sm"
                                style={{
                                  width: 18,
                                  height: 18,
                                  top: 3,
                                  left: isOn ? 23 : 3,
                                  transition: 'left 0.2s ease',
                                }}
                              />
                            </div>
                            <span className="text-base font-semibold text-gray-800">{cat.name}</span>
                          </div>
                          {isExpanded
                            ? <ChevronUp size={18} className="text-gray-400 shrink-0" />
                            : <ChevronDown size={18} className="text-gray-400 shrink-0" />
                          }
                        </button>
                        {isExpanded && (
                          <div className={`px-5 pb-4 pt-1 text-sm text-gray-500 leading-relaxed border-t border-gray-100 ${isRtl ? 'text-right' : 'text-left'}`}>
                            {cat.desc}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Services */}
              {activeTab === 'services' && (
                <div className="p-5 space-y-3">
                  {t.modal.services.map((svc, i) => {
                    const isExpanded = expandedService === i
                    return (
                      <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          className={`w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors ${isRtl ? 'flex-row-reverse' : ''}`}
                          onClick={() => setExpandedService(isExpanded ? null : i)}
                        >
                          <div className={isRtl ? 'text-right' : 'text-left'}>
                            <p className="text-base font-semibold text-gray-800">{svc.name}</p>
                            <p className="text-sm text-gray-400 mt-0.5">{svc.category}</p>
                          </div>
                          {isExpanded
                            ? <ChevronUp size={18} className="text-gray-400 shrink-0" />
                            : <ChevronDown size={18} className="text-gray-400 shrink-0" />
                          }
                        </button>
                        {isExpanded && (
                          <div className={`px-5 pb-5 space-y-4 border-t border-gray-100 pt-4 ${isRtl ? 'text-right' : 'text-left'}`}>
                            <div>
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">{t.modal.serviceLabels.descLabel}</p>
                              <p className="text-sm text-[#005C66] leading-relaxed">{svc.desc}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">{t.modal.serviceLabels.companyLabel}</p>
                              <p className="text-sm text-[#005C66] leading-relaxed">{svc.company}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{t.modal.serviceLabels.purposesLabel}</p>
                              <p className="text-sm text-gray-400 mb-2.5">{t.modal.serviceLabels.purposesNote}</p>
                              <div className={`flex flex-wrap gap-2 ${isRtl ? 'justify-end' : 'justify-start'}`}>
                                {svc.purposes.map((p, pi) => (
                                  <span
                                    key={pi}
                                    className="px-3 py-1.5 text-sm border border-gray-200 rounded-full text-gray-600 bg-gray-50"
                                  >
                                    {p}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-6 py-5 shrink-0">
              <div className={`flex gap-3 mb-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <button
                  onClick={saveSettings}
                  className="flex-1 py-3 text-base font-semibold text-white rounded-xl transition-opacity hover:opacity-90"
                  style={{ background: '#005C66' }}
                >
                  {t.modal.saveSettings}
                </button>
                <button
                  onClick={acceptAll}
                  className="flex-1 py-3 text-base font-semibold text-white rounded-xl transition-opacity hover:opacity-90"
                  style={{ background: '#005C66' }}
                >
                  {t.modal.acceptAll}
                </button>
              </div>
              <p className="text-sm text-center text-gray-400">{t.modal.poweredBy}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
