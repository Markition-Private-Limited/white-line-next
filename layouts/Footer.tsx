'use client'
import { ArrowUpLeft, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import logoSvg from '../assets/fav_icon_black.svg'
import { useLanguage } from '../context/LanguageContext'
import { LANG_META } from '../lib/i18n'

// hrefs never change — only labels come from translations
const ENTITY_TYPE_HREFS = ['/about', '/partners', '/terms', '/privacy']
const SERVICE_HREFS      = [
  '/services/one-way-ride',
  '/services/hourly-booking',
  '/services/city-to-city',
  '/services/day-service',
  '/services/airport-transfer',
]
const RESOURCE_HREFS     = [
  '/fleet?category=First%20Class',
  '/fleet?category=Business%20Class',
  '/fleet?category=SUV',
  '/fleet?category=Sedan',
  '/fleet?category=Van',
  '/fleet?category=Coaster%20%26%20Bus',
]
const SUPPORT_HREFS      = ['/contact', '/customer-support', '/testimonials', '/affiliates', '/cancelation']

function scrollToHash(hash: string) {
  const el = document.getElementById(hash)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - 90
  window.scrollTo({ top, behavior: 'smooth' })
}

function FooterColumn({ title, links, showArrow = false, isRTL = false }: { title: string; links: { label: string; to: string }[]; showArrow?: boolean; isRTL?: boolean }) {
  const Arrow = isRTL ? ArrowUpLeft : ArrowUpRight
  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#0a3d40', fontFamily: 'Montserrat, sans-serif' }}>
        {title}
      </h4>
      <ul className="flex flex-col gap-3 list-none m-0 p-0">
        {links.map((link) => {
          const hash = link.to.includes('#') ? link.to.split('#')[1] : null
          return (
          <li key={link.label}>
            <Link
              href={link.to}
              onClick={hash ? (e) => {
                if (window.location.pathname === '/services') {
                  e.preventDefault()
                  scrollToHash(hash)
                }
              } : undefined}
              className="group inline-flex items-center gap-1 text-sm transition-all duration-200 ease-out hover:text-[#005C66] hover:scale-[1.04] origin-inline-start"
              style={{ color: '#6b7280', fontFamily: 'Inter, sans-serif', display: 'inline-flex', transformOrigin: isRTL ? 'right' : 'left' }}
            >
              <span className="transition-all duration-200 group-hover:font-medium">{link.label}</span>
              {showArrow && (
                <Arrow
                  size={13}
                  className="flex-shrink-0 transition-all duration-200 opacity-60 group-hover:opacity-100 group-hover:text-[#005C66] group-hover:-translate-y-px group-hover:translate-x-px"
                />
              )}
            </Link>
          </li>
          )
        })}
      </ul>
    </div>
  )
}

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a href={href} aria-label={label} target="_blank" rel="noopener noreferrer"
      className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-[#005C66]/10"
      style={{ border: '1px solid #e5e4e7', color: '#005C66' }}
    >
      {children}
    </a>
  )
}

export default function Footer() {
  const { trans, lang } = useLanguage()
  const { footer: f } = trans
  const { company, services, resources, support } = f.columns
  const isRTL = LANG_META[lang].dir === 'rtl'

  const columns = [
    { col: company,   hrefs: ENTITY_TYPE_HREFS, arrow: false },
    { col: services,  hrefs: SERVICE_HREFS,      arrow: true  },
    { col: resources, hrefs: RESOURCE_HREFS,     arrow: false },
    { col: support,   hrefs: SUPPORT_HREFS,      arrow: false },
  ]

  return (
    <footer className="w-full border-t border-[var(--border)] bg-[#f9f9f9]">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_auto] lg:grid-cols-[260px_1fr]">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2.5">
              <img src={(logoSvg as { src?: string }).src ?? (logoSvg as string)} alt="White Line logo" style={{ width: 28, height: 30, flexShrink: 0 }} />
              <span className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: '#111118', fontFamily: 'Montserrat, sans-serif' }}>
                White Line
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-[220px]" style={{ color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
              {f.tagline}
            </p>
            <div className="flex items-center gap-2.5">
              <SocialIcon href="#" label="Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </SocialIcon>
              <SocialIcon href="#" label="Twitter">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
              </SocialIcon>
              <SocialIcon href="#" label="LinkedIn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
              </SocialIcon>
              <SocialIcon href="#" label="Instagram">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </SocialIcon>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {columns.map(({ col, hrefs, arrow }) => (
              <FooterColumn
                key={col.title}
                title={col.title}
                links={col.links.map((label, i) => ({ label, to: hrefs[i] ?? '#' }))}
                showArrow={arrow}
                isRTL={isRTL}
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
