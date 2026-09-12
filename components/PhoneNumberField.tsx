'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { phoneCountryCodes } from '../lib/phoneCountryCodes'

export default function PhoneNumberField({
  value,
  onChange,
  onBlur,
  isRtl,
  lang,
  error,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  isRtl?: boolean
  lang?: 'en' | 'ar'
  error?: string
  placeholder?: string
}) {
  const [selectedIso, setSelectedIso] = useState<string>(() => {
    if (!value) return 'SA'
    const sorted = [...phoneCountryCodes].sort((a, b) => b.dial.length - a.dial.length)
    return sorted.find(c => value.startsWith(c.dial))?.iso ?? 'SA'
  })
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const wrapRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const active = phoneCountryCodes.find(c => c.iso === selectedIso) ?? phoneCountryCodes[0]
  const localNumber = value.startsWith(active.dial) ? value.slice(active.dial.length).trimStart() : value

  const filteredCountries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return phoneCountryCodes
    return phoneCountryCodes.filter(c =>
      c.name.toLowerCase().includes(q) ||
      (c.nameAr?.includes(searchQuery)) ||
      c.dial.includes(q)
    )
  }, [searchQuery])

  useEffect(() => {
    if (!open) { setSearchQuery(''); return }
    const t = setTimeout(() => searchRef.current?.focus(), 80)
    return () => clearTimeout(t)
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (event: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const selectCountry = (countryIso: string) => {
    const country = phoneCountryCodes.find(c => c.iso === countryIso)
    if (!country) return
    const digits = localNumber.replace(/\D/g, '').slice(0, country.len)
    setSelectedIso(country.iso)
    onChange(digits.length ? `${country.dial} ${digits}` : '')
    setOpen(false)
  }

  const handleNumberChange = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, active.len)
    onChange(digits.length ? `${active.dial} ${digits}` : '')
  }

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: '#fff',
          border: `1.5px solid ${error ? '#fca5a5' : '#e5e7eb'}`,
          borderRadius: 10,
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          style={{
            display: 'flex',
            flex: '0 0 auto',
            alignItems: 'center',
            gap: 5,
            height: '100%',
            padding: '11px 8px 11px 14px',
            border: 0,
            borderInlineEnd: '1.5px solid #e5e7eb',
            color: '#111118',
            background: 'transparent',
            font: 'inherit',
            fontFamily: 'Inter, sans-serif',
            fontSize: 14,
            fontWeight: 500,
            whiteSpace: 'nowrap',
            cursor: 'pointer',
          }}
        >
          <span className={`fi fi-${active.iso.toLowerCase()}`} aria-hidden="true" style={{ width: 18, height: 13, borderRadius: 2, flexShrink: 0 }} />
          <span>{active.dial}</span>
          <ChevronDown size={13} style={{ transform: open ? 'rotate(180deg)' : undefined, transition: 'transform .18s ease', opacity: 0.6 }} />
        </button>
        <input
          type="tel"
          inputMode="tel"
          aria-invalid={!!error}
          value={localNumber}
          onChange={e => handleNumberChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder ?? (active.iso === 'SA' ? '501234567' : '')}
          style={{
            flex: 1,
            minWidth: 0,
            border: 0,
            outline: 0,
            padding: '11px 14px',
            color: '#111118',
            background: 'transparent',
            font: 'inherit',
            fontFamily: 'Inter, sans-serif',
            fontSize: 14,
            direction: 'ltr',
            textAlign: isRtl ? 'right' : 'left',
          }}
        />
      </div>

      {open && (
        <div
          style={{
            position: 'absolute',
            zIndex: 40,
            top: 'calc(100% + 7px)',
            insetInlineStart: 0,
            width: 280,
            maxWidth: '100%',
            borderRadius: 12,
            background: '#fff',
            boxShadow: '0 18px 45px rgba(0,0,0,.18)',
            border: '1px solid #ebebeb',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: 8, borderBottom: '1px solid #edf0f2' }}>
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={lang === 'ar' ? 'ابحث عن الدولة أو الرمز...' : 'Search country or code…'}
              autoComplete="off"
              style={{
                display: 'block',
                width: '100%',
                padding: '6px 10px',
                border: '1px solid #e2e5e8',
                borderRadius: 8,
                background: '#f5f7f8',
                font: 'inherit',
                fontFamily: 'Inter, sans-serif',
                fontSize: 12.5,
                color: '#303238',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ maxHeight: 240, overflowY: 'auto' }}>
            {filteredCountries.length === 0 && (
              <div style={{ padding: 14, fontSize: 12, color: '#9fa8b0', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
                {lang === 'ar' ? 'لا توجد نتائج' : 'No results'}
              </div>
            )}
            {filteredCountries.map(country => (
              <button
                type="button"
                key={country.iso}
                role="option"
                aria-selected={country.iso === selectedIso}
                onClick={() => selectCountry(country.iso)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  width: '100%',
                  minHeight: 36,
                  padding: '5px 12px',
                  border: 0,
                  borderBottom: '1px solid #edf0f2',
                  color: country.iso === selectedIso ? '#017b87' : '#303238',
                  background: country.iso === selectedIso ? '#effbfc' : '#fff',
                  font: 'inherit',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 12.5,
                  textAlign: 'start',
                  cursor: 'pointer',
                }}
              >
                <span className={`fi fi-${country.iso.toLowerCase()}`} aria-hidden="true" style={{ width: 18, height: 13, borderRadius: 2, flexShrink: 0 }} />
                {(lang === 'ar' && country.nameAr) ? country.nameAr : country.name}
                <span style={{ marginInlineStart: 'auto', paddingInlineStart: 8, color: '#8b939a', fontSize: 11, flexShrink: 0 }}>{country.dial}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
