'use client'

import Image, { type StaticImageData } from 'next/image'
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Info as CircleInfo,
  Clock3,
  Luggage,
  LocateFixed,
  UserRound,
  UsersRound,
  X,
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import appPhones from '../assets/global_app/app.png'
import horizontalPlane from '../assets/dialog/horizontal plane.svg'
import flightNumberSvg from '../assets/dialog/flight_number.svg'
import firstClassImg from '../assets/dialog/first.svg'
import businessClassImg from '../assets/dialog/business_class.svg'
import vanImg from '../assets/dialog/van.svg'
import sedanImg from '../assets/dialog/sedan.svg'
import suvImg from '../assets/dialog/suv.svg'
import vCar1 from '../assets/dialog/business_Car_1.png'
import vCar2 from '../assets/dialog/business_Car_2.png'
import vCar3 from '../assets/dialog/business_Car_3.jpg'
import { useLanguage } from '../context/LanguageContext'
import { bookingDialogCopy } from '../lib/bookingDialogCopy'
import { RadarGraphic, StoreButton } from './AppSection'
import PlacesAutocompleteField, { type PlaceValue } from './PlacesAutocompleteField'
import styles from './AirportTransferBookingDialog.module.css'

type BookingFor = 'self' | 'guest' | null
export type BookingService = 'airport' | 'hourly' | 'city' | 'day' | 'oneWay'
type DayDuration = 'half' | 'full'
type Props = { open: boolean; onClose: () => void; service?: BookingService }
type TimeValue = { hour: number; minute: number; use24Hour: boolean }
type GuestDetails = { name: string; phone: string; email: string }
type BookingState = {
  service: BookingService
  pickup: PlaceValue | null
  destination: PlaceValue | null
  date: Date | null
  time: TimeValue | null
  isDeparture: boolean
  flightNumber: string
  duration: number
  dayDuration: DayDuration
  name: string
  email: string
  phone: string
  bookingFor: BookingFor
  guest: GuestDetails
  categoryIndex: number
  vehicle: number
  otp: string[]
}

const categoryImages: StaticImageData[] = [firstClassImg, businessClassImg, vanImg, sedanImg, suvImg]

const vehicles = [vCar1, vCar2, vCar3]
const hourlyDurations = Array.from({ length: 15 }, (_, index) => index + 2)

const blankGuest = (): GuestDetails => ({ name: '', phone: '', email: '' })
const createInitialBookingState = (service: BookingService): BookingState => ({
  service,
  pickup: null,
  destination: null,
  date: null,
  time: null,
  isDeparture: false,
  flightNumber: '',
  duration: 2,
  dayDuration: 'full',
  name: '',
  email: '',
  phone: '',
  bookingFor: null,
  guest: blankGuest(),
  categoryIndex: 1,
  vehicle: 0,
  otp: Array(6).fill(''),
})

const airportPlace = (address: string): PlaceValue => ({ address, source: 'airport' })
const placeLabel = (place: PlaceValue | null, fallback = '--') => place?.address || fallback

function formatBookingDate(date: Date | null, locale: string) {
  return date ? date.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' }) : '--/--/----'
}

function formatBookingTime(time: TimeValue | null, lang: string) {
  if (!time) return '--:--'
  const period = time.hour < 12 ? 'AM' : 'PM'
  const hour12 = time.hour % 12 || 12
  const displayPeriod = lang === 'ar' ? (period === 'AM' ? 'ص' : 'م') : period
  const displayHour = time.use24Hour ? time.hour : hour12
  return `${String(displayHour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}${time.use24Hour ? '' : ` ${displayPeriod}`}`
}

function useBookingDialogCopy() {
  const { lang, dir } = useLanguage()
  return { copy: bookingDialogCopy[lang], lang, dir }
}

function TextField({ label, placeholder, value, icon, startIcon, minLength = 2, inputType = 'text', onChange, attempted }: { label: string; placeholder: string; value: string; icon?: React.ReactNode; startIcon?: React.ReactNode; minLength?: number; inputType?: 'text' | 'email' | 'tel'; onChange: (value: string) => void; attempted?: boolean }) {
  const { copy } = useBookingDialogCopy()
  const trimmed = value.trim()
  const isEmpty = attempted && trimmed.length === 0
  const emailInvalid = inputType === 'email' && trimmed.length > 0 && !/^\S+@\S+\.\S+$/.test(trimmed)
  const phoneInvalid = inputType === 'tel' && trimmed.length > 0 && value.replace(/\D/g, '').length < 8
  const lengthInvalid = inputType === 'text' && trimmed.length > 0 && trimmed.length < minLength
  const invalid = isEmpty || emailInvalid || phoneInvalid || lengthInvalid
  const validationMessage = isEmpty ? copy.validation.required : emailInvalid ? copy.validation.email : phoneInvalid ? copy.validation.phone : lengthInvalid ? copy.validation.characters(minLength) : ''

  return (
    <div className={`${styles.field} ${invalid ? styles.fieldInvalid : ''}`}>
      <label>{label}</label>
      <div className={styles.control}>
        {startIcon && <span className={styles.controlStartIcon}>{startIcon}</span>}
        <input aria-label={label} aria-invalid={invalid} type={inputType} value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} maxLength={inputType === 'tel' ? 17 : undefined} className={startIcon ? styles.inputWithStartIcon : undefined} />
        {icon && <span className={styles.controlIcon}>{icon}</span>}
      </div>
      <AnimatePresence initial={false}>
        {invalid && <motion.small className={styles.fieldError} initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }}>{validationMessage}</motion.small>}
      </AnimatePresence>
    </div>
  )
}

function DropdownField({ label, placeholder, value, options, onChange, attempted }: { label: string; placeholder: string; value: PlaceValue | null; options: string[]; onChange: (value: PlaceValue) => void; attempted?: boolean }) {
  const { copy } = useBookingDialogCopy()
  const [open, setOpen] = useState(false)
  const fieldRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (event: PointerEvent) => {
      if (!fieldRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [open])

  const isEmpty = attempted && !value

  return (
    <div ref={fieldRef} className={`${styles.field} ${styles.pickerField} ${isEmpty ? styles.fieldInvalid : ''}`}>
      <label>{label}</label>
      <button type="button" className={styles.pickerControl} aria-expanded={open} aria-haspopup="listbox" onClick={() => setOpen(current => !current)}>
        <span className={value ? '' : styles.pickerPlaceholder}>{value?.address || placeholder}</span>
        <span className={styles.controlIcon}><LocateFixed size={15} /></span>
      </button>
      <AnimatePresence initial={false}>
        {isEmpty && <motion.small className={styles.fieldError} initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }}>{copy.validation.required}</motion.small>}
      </AnimatePresence>
      <AnimatePresence>
        {open && (
          <motion.div className={styles.fieldMenu} role="listbox" initial={{ opacity: 0, y: -7, scaleY: .97 }} animate={{ opacity: 1, y: 0, scaleY: 1 }} exit={{ opacity: 0, y: -7, scaleY: .97 }} transition={{ duration: .2, ease: 'easeOut' }}>
            {options.map(option => <button key={option} type="button" role="option" aria-selected={value?.address === option} className={value?.address === option ? styles.fieldOptionActive : ''} onClick={() => { onChange(airportPlace(option)); setOpen(false) }}>{option}</button>)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function DatePickerField({ label, value, onChange, attempted }: { label: string; value: Date | null; onChange: (date: Date | null) => void; attempted?: boolean }) {
  const { copy, dir } = useBookingDialogCopy()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [open, setOpen] = useState(false)
  const [month, setMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const fieldRef = useRef<HTMLDivElement>(null)
  const year = month.getFullYear()
  const monthIndex = month.getMonth()
  const leadingDays = (new Date(year, monthIndex, 1).getDay() + 6) % 7
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const calendarDays = [...Array.from({ length: leadingDays }, () => null), ...Array.from({ length: daysInMonth }, (_, index) => index + 1)]
  const isCurrentMonth = year === today.getFullYear() && monthIndex === today.getMonth()

  useEffect(() => {
    if (!open) return
    const close = (event: PointerEvent) => {
      if (!fieldRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [open])

  const isEmpty = attempted && !value

  return (
    <div ref={fieldRef} className={`${styles.field} ${styles.pickerField} ${isEmpty ? styles.fieldInvalid : ''}`}>
      <label>{label}</label>
      <button type="button" className={styles.pickerControl} aria-expanded={open} aria-haspopup="dialog" onClick={() => setOpen(current => !current)}>
        <span className={value ? '' : styles.pickerPlaceholder}>{formatBookingDate(value, copy.calendar.locale)}</span>
        <span className={styles.controlIcon}><CalendarDays size={16} /></span>
      </button>
      <AnimatePresence initial={false}>
        {isEmpty && <motion.small className={styles.fieldError} initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }}>{copy.validation.required}</motion.small>}
      </AnimatePresence>
      <AnimatePresence>
        {open && (
          <motion.div className={`${styles.fieldMenu} ${styles.calendarMenu}`} role="dialog" aria-label={`${label} ${copy.calendar.label}`} dir={dir} initial={{ opacity: 0, y: -7, scaleY: .97 }} animate={{ opacity: 1, y: 0, scaleY: 1 }} exit={{ opacity: 0, y: -7, scaleY: .97 }} transition={{ duration: .2, ease: 'easeOut' }}>
            <div className={styles.calendarHeader}>
              <button type="button" disabled={isCurrentMonth} onClick={() => setMonth(current => new Date(current.getFullYear(), current.getMonth() - 1, 1))}><ChevronLeft size={16} /></button>
              <strong>{month.toLocaleDateString(copy.calendar.monthLocale, { month: 'long', year: 'numeric' })}</strong>
              <button type="button" onClick={() => setMonth(current => new Date(current.getFullYear(), current.getMonth() + 1, 1))}><ChevronRight size={16} /></button>
            </div>
            <div className={styles.calendarWeekdays}>{copy.calendar.weekdays.map(day => <span key={day}>{day}</span>)}</div>
            <div className={styles.calendarGrid}>
              {calendarDays.map((day, index) => {
                if (!day) return <span key={`empty-${index}`} />
                const date = new Date(year, monthIndex, day)
                const disabled = date < today
                const active = value?.getFullYear() === year && value?.getMonth() === monthIndex && value?.getDate() === day
                return <button key={day} type="button" disabled={disabled} className={active ? styles.calendarDayActive : ''} onClick={() => { onChange(date); setOpen(false) }}>{day}</button>
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const CLOCK_HOURS_12 = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
const CLOCK_HOURS_24_OUTER = [0, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
const CLOCK_HOURS_24_INNER = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
const CLOCK_MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]

function TimePickerField({ label, value, onChange, attempted }: { label: string; value: TimeValue | null; onChange: (time: TimeValue) => void; attempted?: boolean }) {
  const { copy, lang } = useBookingDialogCopy()
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'hour' | 'minute'>('hour')
  const [draft, setDraft] = useState<TimeValue>(() => value ?? { hour: 12, minute: 0, use24Hour: false })
  const fieldRef = useRef<HTMLDivElement>(null)
  const controlRef = useRef<HTMLButtonElement>(null)
  const clockRef = useRef<HTMLDivElement>(null)
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({})
  // Keep mode accessible inside pointer-event closures without stale capture
  const modeRef = useRef(mode)
  useEffect(() => { modeRef.current = mode }, [mode])

  const openMenu = () => {
    const rect = controlRef.current?.getBoundingClientRect()
    if (rect) {
      const menuHeight = 380
      const menuWidth = 228
      const spaceBelow = window.innerHeight - rect.bottom
      const openUpward = spaceBelow < menuHeight + 12 && rect.top > spaceBelow
      const top = openUpward
        ? Math.max(8, rect.top - menuHeight - 7)
        : Math.min(rect.bottom + 7, window.innerHeight - menuHeight - 8)
      let left = rect.left
      if (left + menuWidth > window.innerWidth - 8) left = window.innerWidth - menuWidth - 8
      if (left < 8) left = 8
      setMenuStyle({ position: 'fixed', top, left, width: menuWidth })
    }
    setMode('hour')
    setOpen(c => !c)
  }

  const period: 'AM' | 'PM' = draft.hour < 12 ? 'AM' : 'PM'
  const hour12 = draft.hour % 12 || 12
  const displayPeriod = lang === 'ar' ? (period === 'AM' ? 'ص' : 'م') : period
  const displayHour = draft.use24Hour ? draft.hour : hour12
  const displayValue = formatBookingTime(draft, lang)

  const handAngle = mode === 'hour'
    ? (draft.hour % 12) * 30 - 90
    : draft.minute / 60 * 360 - 90
  const handLength = mode === 'hour' && draft.use24Hour && draft.hour > 0 && draft.hour <= 12 ? '24%' : '38%'

  useEffect(() => {
    if (!open) return
    const close = (e: PointerEvent) => {
      if (!fieldRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [open])

  const valueFromPointer = (clientX: number, clientY: number): number => {
    const rect = clockRef.current?.getBoundingClientRect()
    if (!rect) return 0
    const dx = clientX - (rect.left + rect.width / 2)
    const dy = clientY - (rect.top + rect.height / 2)
    let angle = Math.atan2(dy, dx) + Math.PI / 2
    if (angle < 0) angle += 2 * Math.PI
    const clockIndex = Math.round(angle / (Math.PI / 6)) % 12
    if (modeRef.current === 'minute') return Math.round(angle / (2 * Math.PI) * 60) % 60
    if (!draft.use24Hour) return CLOCK_HOURS_12[clockIndex]

    const distanceFromCenter = Math.hypot(dx, dy)
    const isOuterRing = distanceFromCenter > Math.min(rect.width, rect.height) * 0.31
    return (isOuterRing ? CLOCK_HOURS_24_OUTER : CLOCK_HOURS_24_INNER)[clockIndex]
  }

  const applyValue = (value: number) => {
    const next = modeRef.current === 'hour' ? { ...draft, hour: value } : { ...draft, minute: value }
    setDraft(next)
    onChange(next)
  }

  const handleClockPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    applyValue(valueFromPointer(e.clientX, e.clientY))

    const onMove = (ev: PointerEvent) => applyValue(valueFromPointer(ev.clientX, ev.clientY))
    const onUp = () => {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', onUp)
      if (modeRef.current === 'hour') setMode('minute')
      else setOpen(false)
    }
    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', onUp)
  }

  const setPeriod = (nextPeriod: 'AM' | 'PM') => {
    setDraft(current => {
      const next = { ...current, hour: nextPeriod === 'AM' ? current.hour % 12 : current.hour % 12 + 12 }
      onChange(next)
      return next
    })
  }

  const handleClockKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const isHour = mode === 'hour'
    const max = isHour ? (draft.use24Hour ? 23 : 12) : 59
    const current = isHour ? (draft.use24Hour ? draft.hour : hour12) : draft.minute
    let next: number | null = null

    if (event.key === 'ArrowUp' || event.key === 'ArrowRight') next = current === max ? (isHour && !draft.use24Hour ? 1 : 0) : current + 1
    if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') next = current === (isHour && !draft.use24Hour ? 1 : 0) ? max : current - 1
    if (event.key === 'Home') next = isHour && !draft.use24Hour ? 1 : 0
    if (event.key === 'End') next = max
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (isHour) setMode('minute')
      else {
        onChange(draft)
        setOpen(false)
      }
      return
    }
    if (next === null) return

    event.preventDefault()
    if (isHour) {
      const nextTime = { ...draft, hour: draft.use24Hour ? next : (period === 'PM' ? next % 12 + 12 : next % 12) }
      setDraft(nextTime)
      onChange(nextTime)
    } else {
      const nextTime = { ...draft, minute: next }
      setDraft(nextTime)
      onChange(nextTime)
    }
  }

  const hourNumbers = draft.use24Hour
    ? [
        ...CLOCK_HOURS_24_OUTER.map((value, index) => ({ value, index, radius: 38 })),
        ...CLOCK_HOURS_24_INNER.map((value, index) => ({ value, index, radius: 24 })),
      ]
    : CLOCK_HOURS_12.map((value, index) => ({ value, index, radius: 38 }))
  const numbers = mode === 'hour'
    ? hourNumbers
    : CLOCK_MINUTES.map((value, index) => ({ value, index, radius: 38 }))

  return (
    <div ref={fieldRef} className={`${styles.field} ${styles.pickerField} ${attempted && !value ? styles.fieldInvalid : ''}`}>
      <label>{label}</label>
      <button ref={controlRef} type="button" className={styles.pickerControl} aria-label={`${label}: ${value ? displayValue : copy.validation.required}`} aria-expanded={open} aria-haspopup="dialog"
        onClick={openMenu}>
        <span className={value ? '' : styles.pickerPlaceholder} aria-live="polite">{value ? displayValue : '--:--'}</span>
        <span className={styles.controlIcon}><Clock3 size={16} /></span>
      </button>
      <AnimatePresence initial={false}>
        {attempted && !value && <motion.small className={styles.fieldError} initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }}>{copy.validation.required}</motion.small>}
      </AnimatePresence>
      <AnimatePresence>
        {open && (
          <motion.div className={styles.clockMenu} style={menuStyle} role="dialog" aria-label={label}
            initial={{ opacity: 0, y: 7, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 7, scale: 0.97 }} transition={{ duration: 0.2, ease: 'easeOut' }}>
            <div className={styles.clockHeader}>
              <div className={styles.clockDisplay}>
                <button type="button" aria-label={copy.timePicker.editHour} aria-pressed={mode === 'hour'} className={`${styles.clockDisplayPart} ${mode === 'hour' ? styles.clockDisplayActive : ''}`} onClick={() => setMode('hour')}>
                  {String(displayHour).padStart(2, '0')}
                </button>
                <span className={styles.clockColon}>:</span>
                <button type="button" aria-label={copy.timePicker.editMinute} aria-pressed={mode === 'minute'} className={`${styles.clockDisplayPart} ${mode === 'minute' ? styles.clockDisplayActive : ''}`} onClick={() => setMode('minute')}>
                  {String(draft.minute).padStart(2, '0')}
                </button>
              </div>
              {!draft.use24Hour && (
                <div className={styles.clockPeriod} aria-label={copy.timePicker.period} role="group">
                  <button type="button" aria-pressed={period === 'AM'} className={`${styles.clockPeriodBtn} ${period === 'AM' ? styles.clockPeriodActive : ''}`} onClick={() => setPeriod('AM')}>{lang === 'ar' ? 'ص' : 'AM'}</button>
                  <button type="button" aria-pressed={period === 'PM'} className={`${styles.clockPeriodBtn} ${period === 'PM' ? styles.clockPeriodActive : ''}`} onClick={() => setPeriod('PM')}>{lang === 'ar' ? 'م' : 'PM'}</button>
                </div>
              )}
            </div>
            <div className={styles.clockFormat} role="group" aria-label={copy.timePicker.timeFormat}>
              <button type="button" aria-pressed={!draft.use24Hour} className={!draft.use24Hour ? styles.clockFormatActive : ''} onClick={() => setDraft(current => { const next = { ...current, use24Hour: false }; onChange(next); return next })}>{copy.timePicker.twelveHour}</button>
              <button type="button" aria-pressed={draft.use24Hour} className={draft.use24Hour ? styles.clockFormatActive : ''} onClick={() => setDraft(current => { const next = { ...current, use24Hour: true }; onChange(next); return next })}>{copy.timePicker.twentyFourHour}</button>
            </div>
            <div ref={clockRef} className={`${styles.clockFace} ${draft.use24Hour && mode === 'hour' ? styles.clockFace24 : ''}`} onPointerDown={handleClockPointerDown} onKeyDown={handleClockKeyDown} style={{ touchAction: 'none' }}
              role="slider" tabIndex={0} aria-label={mode === 'hour' ? copy.timePicker.hour : copy.timePicker.minute}
              aria-valuemin={mode === 'hour' && !draft.use24Hour ? 1 : 0} aria-valuemax={mode === 'hour' ? (draft.use24Hour ? 23 : 12) : 59}
              aria-valuenow={mode === 'hour' ? displayHour : draft.minute} aria-valuetext={mode === 'hour' ? copy.timePicker.selectedHour(displayHour, draft.use24Hour ? undefined : displayPeriod) : copy.timePicker.selectedMinute(draft.minute)}>
              <div className={styles.clockTrack} />
              <div className={styles.clockHand} style={{ width: handLength, transform: `rotate(${handAngle}deg)` }} />
              <div className={styles.clockCenter} />
              {numbers.map(({ value, index, radius }) => {
                const angle = (index * 30 - 90) * (Math.PI / 180)
                const x = 50 + radius * Math.cos(angle)
                const y = 50 + radius * Math.sin(angle)
                const isActive = mode === 'hour' ? draft.hour === value : draft.minute === value && draft.minute % 5 === 0
                return (
                  <span key={`${radius}-${value}`}
                    className={`${styles.clockNum} ${isActive ? styles.clockNumActive : ''}`}
                    style={{ left: `${x}%`, top: `${y}%` }}
                    aria-hidden="true">
                    {mode === 'minute' || draft.use24Hour ? String(value).padStart(2, '0') : value}
                  </span>
                )
              })}
            </div>
            <p className={styles.clockHint}>{mode === 'hour' ? copy.timePicker.selectHour : copy.timePicker.selectMinute}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const tripIsComplete = (booking: BookingState) => Boolean(booking.pickup && booking.destination && booking.date && booking.time)

function LocationScheduleFields({ booking, updateBooking, pickupLabel, pickupPlaceholder, destinationLabel, destinationPlaceholder, attempted }: { booking: BookingState; updateBooking: (updates: Partial<BookingState>) => void; pickupLabel?: string; pickupPlaceholder?: string; destinationLabel?: string; destinationPlaceholder?: string; attempted: boolean }) {
  const { copy } = useBookingDialogCopy()
  return (
    <div className={styles.fieldGrid}>
      <PlacesAutocompleteField label={pickupLabel ?? copy.pickupLocation} placeholder={pickupPlaceholder ?? copy.selectPickup} value={booking.pickup} attempted={attempted} onChange={value => updateBooking({ pickup: value })} />
      <PlacesAutocompleteField label={destinationLabel ?? copy.destination} placeholder={destinationPlaceholder ?? copy.selectDropOff} value={booking.destination} attempted={attempted} onChange={value => updateBooking({ destination: value })} />
      <DatePickerField label={copy.pickupDate} value={booking.date} attempted={attempted} onChange={date => updateBooking({ date })} />
      <TimePickerField label={copy.pickupTime} value={booking.time} attempted={attempted} onChange={time => updateBooking({ time })} />
    </div>
  )
}

function FooterActions({ back, next, nextLabel = 'Continue' }: { back: () => void; next: () => void; nextLabel?: string }) {
  const { copy, dir } = useBookingDialogCopy()
  const BackIcon = dir === 'rtl' ? ArrowRight : ArrowLeft
  const NextIcon = dir === 'rtl' ? ArrowLeft : ArrowRight
  return (
    <div className={styles.footerActions}>
      <button type="button" className={styles.back} onClick={back}><BackIcon size={20} /> {copy.back}</button>
      <button type="button" className={styles.continue} onClick={next}>{nextLabel === 'Continue' ? copy.continue : nextLabel} <NextIcon size={16} /></button>
    </div>
  )
}

function BookingForSection({ booking, updateBooking, next, back, tripComplete, onAttempt }: {
  booking: BookingState
  updateBooking: (updates: Partial<BookingState>) => void
  next: () => void
  back: () => void
  tripComplete: boolean
  onAttempt: () => void
}) {
  const { copy, dir } = useBookingDialogCopy()
  const [attempted, setAttempted] = useState(false)
  const ChoiceIcon = dir === 'rtl' ? ChevronLeft : ChevronRight
  const selfComplete = booking.name.trim().length >= 2 && /^\S+@\S+\.\S+$/.test(booking.email.trim()) && booking.phone.replace(/\D/g, '').length >= 8
  const guestComplete = booking.guest.name.trim().length >= 2 && booking.guest.phone.replace(/\D/g, '').length >= 8 && /^\S+@\S+\.\S+$/.test(booking.guest.email.trim())
  const chooseBookingFor = (value: BookingFor) => {
    updateBooking({ bookingFor: value, guest: value === booking.bookingFor ? booking.guest : blankGuest() })
  }
  const continueTrip = () => {
    setAttempted(true)
    onAttempt()
    const detailsComplete = booking.bookingFor === 'self' ? selfComplete : guestComplete
    if (!booking.bookingFor || !tripComplete || !detailsComplete) return
    next()
  }

  return (
    <>
      <p className={styles.bookingQuestion}>{copy.bookingQuestion}</p>
      <div className={styles.choiceGrid} role="group" aria-label={copy.bookingQuestion}>
        <button type="button" aria-pressed={booking.bookingFor === 'self'} className={`${styles.choice} ${booking.bookingFor === 'self' ? styles.choiceActive : ''} ${attempted && !booking.bookingFor ? styles.choiceError : ''}`} onClick={() => chooseBookingFor('self')}>
          <span className={styles.choiceIcon}><UserRound size={15} /></span>
          <span className={styles.choiceCopy}><strong>{copy.forMyself}</strong><small>{copy.selfTravel}</small></span>
          <ChoiceIcon size={16} />
        </button>
        <button type="button" aria-pressed={booking.bookingFor === 'guest'} className={`${styles.choice} ${booking.bookingFor === 'guest' ? styles.choiceActive : ''} ${attempted && !booking.bookingFor ? styles.choiceError : ''}`} onClick={() => chooseBookingFor('guest')}>
          <span className={styles.choiceIcon}><UsersRound size={15} /></span>
          <span className={styles.choiceCopy}><strong>{copy.forGuest}</strong><small>{copy.guestTravel}</small></span>
          <ChoiceIcon size={16} />
        </button>
      </div>
      {attempted && !booking.bookingFor && <small className={styles.selectionError}>{copy.validation.required}</small>}

      {booking.bookingFor === 'self' && (
        <div className={styles.guestPanel}>
          <h3>{copy.yourDetails}</h3>
          <p>{copy.enterYourDetails}</p>
          <TextField label={copy.fullName} placeholder={copy.namePlaceholder} value={booking.name} minLength={2} attempted={attempted} onChange={value => updateBooking({ name: value })} />
          <TextField label={copy.phoneNumber} placeholder="+966 50 123 4567" value={booking.phone} inputType="tel" attempted={attempted} onChange={value => updateBooking({ phone: value })} />
          <TextField label={copy.emailAddress} placeholder="you@example.com" value={booking.email} inputType="email" attempted={attempted} onChange={value => updateBooking({ email: value })} />
        </div>
      )}

      {booking.bookingFor === 'guest' && (
        <div className={styles.guestPanel}>
          <h3>{copy.guestDetails}</h3>
          <p>{copy.enterGuestDetails}</p>
          <TextField label={copy.fullName} placeholder={copy.guestName} value={booking.guest.name} minLength={2} attempted={attempted} onChange={value => updateBooking({ guest: { ...booking.guest, name: value } })} />
          <TextField label={copy.phoneNumber} placeholder="+966 50 123 4567" value={booking.guest.phone} inputType="tel" attempted={attempted} onChange={value => updateBooking({ guest: { ...booking.guest, phone: value } })} />
          <TextField label={copy.emailAddress} placeholder="guest@gmail.com" value={booking.guest.email} inputType="email" attempted={attempted} onChange={value => updateBooking({ guest: { ...booking.guest, email: value } })} />
        </div>
      )}

      <FooterActions back={booking.bookingFor ? () => chooseBookingFor(null) : back} next={continueTrip} />
    </>
  )
}

function TripDetails({ booking, updateBooking, next, back }: {
  booking: BookingState
  updateBooking: (updates: Partial<BookingState>) => void
  next: () => void
  back: () => void
}) {
  const { copy, lang } = useBookingDialogCopy()
  const [attempted, setAttempted] = useState(false)
  const tripComplete = Boolean(tripIsComplete(booking) && booking.flightNumber.trim().length >= 5)
  const changeDirection = (departure: boolean) => {
    if (departure === booking.isDeparture) return
    updateBooking({ isDeparture: departure, pickup: null, destination: null })
  }
  return (
    <>
      <p className={styles.eyebrow}>{copy.services.airport}</p>
      <h2 className={styles.title}>{copy.tripDetails}</h2>
      <p className={styles.subtitle}>{copy.tripSubtitle}</p>

      <div className={styles.directionSwitcher}>
        <button type="button" className={!booking.isDeparture ? styles.directionActive : ''} onClick={() => changeDirection(false)}>
          {copy.arrival}
        </button>
        <button type="button" className={booking.isDeparture ? styles.directionActive : ''} onClick={() => changeDirection(true)}>
          {copy.departure}
        </button>
      </div>

      <div className={styles.fieldGrid}>
        {booking.isDeparture ? (
          <>
            <PlacesAutocompleteField key="departure-pickup" label={copy.pickupLocation} placeholder={copy.selectPickup} value={booking.pickup} attempted={attempted} onChange={value => updateBooking({ pickup: value })} />
            <DropdownField key="departure-airport" label={copy.dropOffAirport} placeholder={copy.selectAirport} value={booking.destination} options={copy.airports} attempted={attempted} onChange={value => updateBooking({ destination: value })} />
          </>
        ) : (
          <>
            <DropdownField key="arrival-airport" label={copy.pickupAirport} placeholder={copy.selectAirport} value={booking.pickup} options={copy.airports} attempted={attempted} onChange={value => updateBooking({ pickup: value })} />
            <PlacesAutocompleteField key="arrival-destination" label={copy.dropOff} placeholder={copy.enterDestination} value={booking.destination} attempted={attempted} onChange={value => updateBooking({ destination: value })} />
          </>
        )}
        <DatePickerField label={copy.flightDate} value={booking.date} attempted={attempted} onChange={date => updateBooking({ date })} />
        <TimePickerField label={copy.pickupTime} value={booking.time} attempted={attempted} onChange={time => updateBooking({ time })} />
        <TextField label={copy.flightNumber} placeholder={copy.flightExample} value={booking.flightNumber} minLength={5} attempted={attempted} onChange={flightNumber => updateBooking({ flightNumber })} startIcon={<Image src={flightNumberSvg} alt="" width={20} height={18} />} />
        <div className={styles.flightRoute} aria-label={copy.flightRoutePreview} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <span className={styles.routeHalf}>{copy.from}<br />--:--</span>
          <Image className={styles.plane} src={horizontalPlane} alt="" />
          <span className={styles.routeHalf}>{copy.to}<br />--:--</span>
        </div>
      </div>

      <BookingForSection booking={booking} updateBooking={updateBooking} back={back} next={next} tripComplete={tripComplete} onAttempt={() => setAttempted(true)} />
    </>
  )
}

function HourlyTripDetails({ booking, updateBooking, next, back }: {
  booking: BookingState
  updateBooking: (updates: Partial<BookingState>) => void
  next: () => void
  back: () => void
}) {
  const { copy } = useBookingDialogCopy()
  const [durationOpen, setDurationOpen] = useState(false)
  const [attempted, setAttempted] = useState(false)

  return (
    <>
      <p className={styles.eyebrow}>{copy.services.hourly}</p>
      <h2 className={styles.title}>{copy.tripDetails}</h2>
      <p className={styles.subtitle}>{copy.tripSubtitle}</p>

      <LocationScheduleFields booking={booking} updateBooking={updateBooking} attempted={attempted} />

      <div className={styles.durationField}>
        <label>{copy.selectDuration}</label>
        <button type="button" className={styles.durationControl} aria-expanded={durationOpen} aria-haspopup="listbox" onClick={() => setDurationOpen(open => !open)}>
          <span>{booking.duration} {copy.hours}</span>
          <ChevronDown size={18} className={durationOpen ? styles.durationChevronOpen : ''} />
        </button>
        <AnimatePresence>
          {durationOpen && (
            <motion.div className={styles.durationMenu} role="listbox" initial={{ opacity: 0, y: -8, scaleY: .96 }} animate={{ opacity: 1, y: 0, scaleY: 1 }} exit={{ opacity: 0, y: -8, scaleY: .96 }} transition={{ duration: .2, ease: 'easeOut' }}>
              {hourlyDurations.map(hours => (
                <button key={hours} type="button" role="option" aria-selected={booking.duration === hours} className={booking.duration === hours ? styles.durationOptionActive : ''} onClick={() => { updateBooking({ duration: hours }); setDurationOpen(false) }}>
                  {hours} {copy.hours} ({hours * 40} {copy.km} {copy.included})
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className={styles.durationInfo}>
        <CircleInfo size={19} />
        <span><strong>{copy.needMore}</strong><small>{copy.chooseDayOption}</small></span>
        <ChevronDown size={16} />
      </div>

      <BookingForSection booking={booking} updateBooking={updateBooking} back={back} next={next} tripComplete={tripIsComplete(booking)} onAttempt={() => setAttempted(true)} />
    </>
  )
}

function CityTripDetails({ booking, updateBooking, next, back }: {
  booking: BookingState
  updateBooking: (updates: Partial<BookingState>) => void
  next: () => void
  back: () => void
}) {
  const { copy } = useBookingDialogCopy()
  const [attempted, setAttempted] = useState(false)
  return (
    <>
      <p className={styles.eyebrow}>{copy.services.city}</p>
      <h2 className={styles.title}>{copy.tripDetails}</h2>
      <p className={styles.subtitle}>{copy.tripSubtitle}</p>

      <LocationScheduleFields booking={booking} updateBooking={updateBooking} attempted={attempted} />

      <BookingForSection booking={booking} updateBooking={updateBooking} back={back} next={next} tripComplete={tripIsComplete(booking)} onAttempt={() => setAttempted(true)} />
    </>
  )
}

function OneWayTripDetails({ booking, updateBooking, next, back }: {
  booking: BookingState
  updateBooking: (updates: Partial<BookingState>) => void
  next: () => void
  back: () => void
}) {
  const { copy } = useBookingDialogCopy()
  const [attempted, setAttempted] = useState(false)
  return (
    <>
      <p className={styles.eyebrow}>{copy.services.oneWay}</p>
      <h2 className={styles.title}>{copy.tripDetails}</h2>
      <p className={styles.subtitle}>{copy.tripSubtitle}</p>

      <LocationScheduleFields booking={booking} updateBooking={updateBooking} destinationLabel={copy.dropOff} attempted={attempted} />

      <BookingForSection booking={booking} updateBooking={updateBooking} back={back} next={next} tripComplete={tripIsComplete(booking)} onAttempt={() => setAttempted(true)} />
    </>
  )
}

function DayTripDetails({ booking, updateBooking, next, back }: {
  booking: BookingState
  updateBooking: (updates: Partial<BookingState>) => void
  next: () => void
  back: () => void
}) {
  const { copy } = useBookingDialogCopy()
  const [attempted, setAttempted] = useState(false)
  return (
    <>
      <p className={styles.eyebrow}>{copy.services.day}</p>
      <h2 className={styles.title}>{copy.tripDetails}</h2>
      <p className={styles.subtitle}>{copy.tripSubtitle}</p>

      <div className={styles.dayDurationField}>
        <p>{copy.bookingDuration}</p>
        <div className={styles.dayDurationGrid}>
          <button type="button" className={`${styles.dayDurationOption} ${booking.dayDuration === 'half' ? styles.dayDurationActive : ''}`} onClick={() => updateBooking({ dayDuration: 'half' })}>
            <span className={styles.dayDurationIcon}><Clock3 size={16} /></span>
            <span><strong>{copy.halfDay}</strong><small>{copy.upTo4Hours}</small></span>
            {booking.dayDuration === 'half' && <Check className={styles.dayDurationCheck} size={11} strokeWidth={3} />}
          </button>
          <button type="button" className={`${styles.dayDurationOption} ${booking.dayDuration === 'full' ? styles.dayDurationActive : ''}`} onClick={() => updateBooking({ dayDuration: 'full' })}>
            <span className={styles.dayDurationIcon}><Clock3 size={16} /></span>
            <span><strong>{copy.fullDay}</strong><small>{copy.upTo10Hours}</small></span>
            {booking.dayDuration === 'full' && <Check className={styles.dayDurationCheck} size={11} strokeWidth={3} />}
          </button>
        </div>
      </div>

      <LocationScheduleFields booking={booking} updateBooking={updateBooking} attempted={attempted} />

      <BookingForSection booking={booking} updateBooking={updateBooking} back={back} next={next} tripComplete={tripIsComplete(booking)} onAttempt={() => setAttempted(true)} />
    </>
  )
}

function RideStep({ back, next, booking, updateBooking }: { back: () => void; next: () => void; booking: BookingState; updateBooking: (updates: Partial<BookingState>) => void }) {
  const { copy, dir, lang } = useBookingDialogCopy()
  const categories = copy.categories.map((item, index) => ({ ...item, image: categoryImages[index] }))
  const categoryIndex = Math.min(booking.categoryIndex, categories.length - 1)
  const category = categories[categoryIndex].name
  const service = booking.service
  const isHourly = service === 'hourly'
  const isCity = service === 'city'
  const isDay = service === 'day'
  const isOneWay = service === 'oneWay'
  const l = copy.summaryLabels
  const summaryRows = isHourly
    ? [[l.pickupDate, formatBookingDate(booking.date, copy.calendar.locale)], [l.pickupTime, formatBookingTime(booking.time, lang)], [l.duration, `${booking.duration} ${copy.hours}`], [l.category, category], [l.vehicle, `Mercedes E-Class #${booking.vehicle + 1}`]]
    : isCity
      ? [[l.pickupDate, formatBookingDate(booking.date, copy.calendar.locale)], [l.pickupTime, formatBookingTime(booking.time, lang)], [l.journey, copy.summaryValues.city], [l.category, category], [l.vehicle, `Mercedes E-Class #${booking.vehicle + 1}`]]
      : isDay
        ? [[l.pickupDate, formatBookingDate(booking.date, copy.calendar.locale)], [l.pickupTime, formatBookingTime(booking.time, lang)], [l.duration, booking.dayDuration === 'full' ? copy.fullDay : copy.halfDay], [l.category, category], [l.vehicle, `Mercedes E-Class #${booking.vehicle + 1}`]]
        : isOneWay
          ? [[l.pickupDate, formatBookingDate(booking.date, copy.calendar.locale)], [l.pickupTime, formatBookingTime(booking.time, lang)], [l.journey, copy.summaryValues.oneWay], [l.category, category], [l.vehicle, `Mercedes E-Class #${booking.vehicle + 1}`]]
          : [[l.flight, booking.flightNumber || '--'], [l.flightDate, formatBookingDate(booking.date, copy.calendar.locale)], [l.pickupTime, formatBookingTime(booking.time, lang)], [l.category, category], [l.vehicle, `Mercedes E-Class #${booking.vehicle + 1}`]]
  const SummaryArrow = dir === 'rtl' ? ArrowLeft : ArrowRight

  return (
    <>
      <p className={styles.eyebrow}>{isHourly ? copy.services.hourly : isCity ? copy.services.city : isDay ? copy.services.day : isOneWay ? copy.services.oneWay : copy.services.airport}</p>
      <h2 className={styles.title}>{copy.selectRide}</h2>
      <p className={styles.subtitle}>{copy.selectRideSubtitle}</p>
      <p className={styles.categoryIntro}>{copy.chooseCategory}</p>
      <div className={styles.categoryGrid}>
        {categories.map((item, index) => (
          <button type="button" key={item.name} className={`${styles.categoryCard} ${categoryIndex === index ? styles.categoryActive : ''}`} onClick={() => updateBooking({ categoryIndex: index })}>
            <strong>{item.name}</strong><small>{item.copy}</small><Image src={item.image} alt="" />
          </button>
        ))}
      </div>
      <div className={styles.vehiclePanel}>
        <p>{copy.availableVehicles(category)}</p>
        <div className={styles.vehicleGrid}>
          {vehicles.map((image, index) => (
            <button type="button" key={image.src} className={`${styles.vehicleCard} ${booking.vehicle === index ? styles.vehicleSelected : ''}`} onClick={() => updateBooking({ vehicle: index })}>
              <Image src={image} alt="Mercedes E-Class" />
              <span>
                <strong>Mercedes E-Class</strong>
                <small className={styles.vehicleSpecs} aria-label={copy.passengersAndBags}>
                  <span className={styles.vehicleSpec}><span className={styles.vehicleSpecIcon}><UsersRound size={8} /></span><span>2</span></span>
                  <span className={styles.vehicleSpec}><span className={styles.vehicleSpecIcon}><Luggage size={8} /></span><span>4</span></span>
                </small>
              </span>
            </button>
          ))}
        </div>
      </div>
      <h3 className={styles.reviewTitle}>{copy.reviewBooking}</h3>
      <div className={styles.summaryCard}>
        <div className={styles.routeSummary}>
          <div><small>{copy.pickup}</small><strong>{placeLabel(booking.pickup)}</strong></div>
          <SummaryArrow size={20} />
          <div><small>{isHourly || isCity || isDay ? copy.summaryDestination : copy.summaryDropOff}</small><strong>{placeLabel(booking.destination)}</strong></div>
        </div>
        {summaryRows.map(row => (
          <div className={styles.summaryRow} key={row[0]}><span>{row[0]}</span><span>{row[1]}</span></div>
        ))}
      </div>
      <FooterActions back={back} next={next} />
    </>
  )
}

function FareStep({ back, next, booking }: { back: () => void; next: () => void; booking: BookingState; updateBooking: (updates: Partial<BookingState>) => void }) {
  const { copy, dir, lang } = useBookingDialogCopy()
  const service = booking.service
  const isHourly = service === 'hourly'
  const isCity = service === 'city'
  const isDay = service === 'day'
  const isOneWay = service === 'oneWay'
  const SummaryArrow = dir === 'rtl' ? ArrowLeft : ArrowRight
  const categories = copy.categories.map((item, index) => ({ ...item, image: categoryImages[index] }))
  const category = categories[Math.min(booking.categoryIndex, categories.length - 1)].name
  const serviceSpecific = isHourly
    ? `${booking.duration} ${copy.hours}`
    : isDay ? (booking.dayDuration === 'full' ? copy.fullDay : copy.halfDay)
    : isCity ? copy.summaryValues.city
    : isOneWay ? copy.summaryValues.oneWay
    : booking.flightNumber || '--'

  return (
    <>
      <p className={styles.eyebrow}>{isHourly ? copy.services.hourly : isCity ? copy.services.city : isDay ? copy.services.day : isOneWay ? copy.services.oneWay : copy.services.airport}</p>
      <h2 className={styles.title}>{copy.fareSummary}</h2>
      <p className={styles.subtitle}>{copy.fareSubtitle[service]}</p>

      <div className={styles.summaryCard}>
        <div className={styles.routeSummary}>
          <div><small>{copy.pickup}</small><strong>{placeLabel(booking.pickup)}</strong></div>
          <SummaryArrow size={20} />
          <div><small>{isHourly || isCity || isDay ? copy.summaryDestination : copy.summaryDropOff}</small><strong>{placeLabel(booking.destination)}</strong></div>
        </div>
        <div className={styles.summaryRow}><span>{service === 'airport' ? copy.summaryLabels.flightDate : copy.summaryLabels.pickupDate}</span><span>{formatBookingDate(booking.date, copy.calendar.locale)}</span></div>
        <div className={styles.summaryRow}><span>{copy.summaryLabels.pickupTime}</span><span>{formatBookingTime(booking.time, lang)}</span></div>
        <div className={styles.summaryRow}><span>{isHourly || isDay ? copy.summaryLabels.duration : service === 'airport' ? copy.summaryLabels.flight : copy.summaryLabels.journey}</span><span>{serviceSpecific}</span></div>
        <div className={styles.summaryRow}><span>{copy.summaryLabels.category}</span><span>{category}</span></div>
        <div className={styles.summaryRow}><span>{copy.summaryLabels.vehicle}</span><span>{`Mercedes E-Class #${booking.vehicle + 1}`}</span></div>
      </div>

      <div className={styles.fareCard}>
        <div className={styles.fareRow}><span>{copy.baseFare}</span><span>⃁ 150.00</span></div>
        <div className={styles.fareRow}><span>{copy.vat}</span><span>⃁ 22.50</span></div>
        <div className={`${styles.fareRow} ${styles.fareTotal}`}><span>{copy.totalFare}</span><span>⃁ 172.50</span></div>
      </div>

      <FooterActions back={back} next={next} />
    </>
  )
}

function SuccessStep({ back, onDone, booking }: { back: () => void; onDone: () => void; booking: BookingState }) {
  const { copy, dir, lang } = useBookingDialogCopy()
  const isRtl = dir === 'rtl'
  const service = booking.service
  const isHourly = service === 'hourly'
  const isCity = service === 'city'
  const isDay = service === 'day'
  const isOneWay = service === 'oneWay'
  return (
    <div className={styles.successBody}>
      <p className={styles.eyebrow}>{isHourly ? copy.services.hourly : isCity ? copy.services.city : isDay ? copy.services.day : isOneWay ? copy.services.oneWay : copy.services.airport}</p>
      <h2 className={styles.title}>{copy.requestReceived}</h2>
      <p className={styles.subtitle}>{copy.fareSubtitle[service]}</p>
      <div className={styles.successCenter}>
        <span className={styles.successCheck}><Check size={16} strokeWidth={3} /></span>
        <h3>{copy.receivedTitle}</h3>
        <span className={styles.reference}>{copy.bookingReference} <strong>{`${service.toUpperCase()}-${formatBookingDate(booking.date, 'en-GB').replace(/\s/g, '').replace(/,/g, '')}`}</strong></span>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        background: 'linear-gradient(135deg, #f0faf9 0%, #e8f5f4 100%)',
        border: '1px solid rgba(0, 92, 102, 0.18)',
        borderRadius: 16,
        padding: '18px 20px',
        margin: '20px 0',
      }}>
        <span style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 36, height: 36, borderRadius: '50%',
          background: '#005C66', flexShrink: 0,
        }}>
          <Check size={15} strokeWidth={2.5} color="#fff" />
        </span>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 13,
          color: '#004a52',
          lineHeight: 1.65,
          margin: 0,
          fontWeight: 500,
        }}>
          {copy.receivedBody}
        </p>
      </div>
      <div className={styles.appBanner}>
        <span className={styles.appRadarClip} aria-hidden="true">
          <RadarGraphic
            className={styles.appRadar}
            style={{
              right: isRtl ? 'auto' : undefined,
              left: isRtl ? '13%' : undefined,
              transform: isRtl ? 'rotate(85deg)' : undefined,
            }}
          />
        </span>
        <h3>{copy.trackJourney}</h3>
        <p>{copy.trackBody}</p>
        <div className={styles.stores}>
          <StoreButton variant="apple" mini sub={copy.downloadOn} main={lang === 'ar' ? 'قريباً' : 'Coming Soon'} isRtl={isRtl} />
          <StoreButton variant="google" mini sub={copy.getItOn} main={lang === 'ar' ? 'قريباً' : 'Coming Soon'} isRtl={isRtl} />
        </div>
        <Image
          className={styles.appPhones}
          src={appPhones}
          alt={copy.mobileAppAlt}
          style={{
            right: isRtl ? 'auto' : undefined,
            left: isRtl ? '20px' : undefined,
          }}
        />
      </div>
      <FooterActions back={back} next={onDone} nextLabel={copy.downloadApp} />
    </div>
  )
}

function CancelConfirmDialog({ onKeep, onConfirm }: { onKeep: () => void; onConfirm: () => void }) {
  const { copy, dir } = useBookingDialogCopy()
  return (
    <div className={styles.cancelOverlay} role="dialog" aria-modal="true" aria-labelledby="cancel-dialog-title">
      <motion.div
        className={styles.cancelCard}
        dir={dir}
        initial={{ opacity: 0, scale: 0.94, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 10 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={styles.cancelStripe} />
        <div className={styles.cancelCardBody}>
          <h3 id="cancel-dialog-title" className={styles.cancelTitle}>{copy.cancelTitle}</h3>
          <p className={styles.cancelBody}>{copy.cancelBody}</p>
          <div className={styles.cancelActions}>
            <button type="button" className={styles.cancelYes} onClick={onConfirm}>{copy.cancelYes}</button>
            <button type="button" className={styles.cancelKeep} onClick={onKeep}>{copy.cancelKeepBooking}</button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function AirportTransferBookingDialog({ open, onClose, service = 'airport' }: Props) {
  const { copy, dir } = useBookingDialogCopy()
  const [step, setStep] = useState(0)
  const [booking, setBooking] = useState<BookingState>(() => createInitialBookingState(service))
  const [confirmClose, setConfirmClose] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const updateBooking = useCallback((updates: Partial<BookingState>) => {
    setBooking(current => ({ ...current, ...updates }))
  }, [])

  const resetAndClose = useCallback(() => {
    setStep(0)
    setBooking(createInitialBookingState(service))
    setConfirmClose(false)
    onClose()
  }, [onClose, service])

  const requestClose = useCallback(() => {
    if (step === 3) {
      resetAndClose()
    } else {
      setConfirmClose(true)
    }
  }, [step, resetAndClose])

  useEffect(() => {
    if (!open) return
    const prev = {
      bodyOverflow: document.body.style.overflow,
      bodyOverscroll: document.body.style.overscrollBehavior,
    }
    document.body.style.overflow = 'hidden'
    document.body.style.overscrollBehavior = 'none'
    dialogRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') requestClose() }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = prev.bodyOverflow
      document.body.style.overscrollBehavior = prev.bodyOverscroll
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, requestClose])

  useEffect(() => {
    if (!open) return
    const onBeforeUnload = (event: BeforeUnloadEvent) => { event.preventDefault() }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [open])

  useEffect(() => {
    if (!open) return
    if (overlayRef.current) overlayRef.current.scrollTop = 0
    if (dialogRef.current) dialogRef.current.scrollTop = 0
  }, [open, step])

  if (!open) return null

  const goBack = () => {
    if (step === 0) requestClose()
    else setStep(current => current - 1)
  }

  return (
    <div ref={overlayRef} className={styles.overlay} data-lenis-prevent>
      <div ref={dialogRef} className={styles.dialog} dir={dir} data-lenis-prevent role="dialog" aria-modal="true" aria-labelledby="airport-dialog-title" tabIndex={-1}>
        <button type="button" className={styles.closeButton} aria-label={copy.closeLabel} onClick={requestClose}>
          <X size={15} strokeWidth={2} />
        </button>
        <div className={styles.content}>
          <span id="airport-dialog-title" className="sr-only">{copy.services[service]} {copy.dialogLabel}</span>
          {step === 0 && service === 'airport' && <TripDetails booking={booking} updateBooking={updateBooking} back={goBack} next={() => setStep(1)} />}
          {step === 0 && service === 'hourly' && <HourlyTripDetails booking={booking} updateBooking={updateBooking} back={goBack} next={() => setStep(1)} />}
          {step === 0 && service === 'city' && <CityTripDetails booking={booking} updateBooking={updateBooking} back={goBack} next={() => setStep(1)} />}
          {step === 0 && service === 'day' && <DayTripDetails booking={booking} updateBooking={updateBooking} back={goBack} next={() => setStep(1)} />}
          {step === 0 && service === 'oneWay' && <OneWayTripDetails booking={booking} updateBooking={updateBooking} back={goBack} next={() => setStep(1)} />}
          {step === 1 && <RideStep booking={booking} updateBooking={updateBooking} back={goBack} next={() => setStep(2)} />}
          {step === 2 && <FareStep booking={booking} updateBooking={updateBooking} back={goBack} next={() => setStep(3)} />}
          {step === 3 && <SuccessStep booking={booking} back={goBack} onDone={resetAndClose} />}
        </div>
        <AnimatePresence>
          {confirmClose && (
            <CancelConfirmDialog onKeep={() => setConfirmClose(false)} onConfirm={resetAndClose} />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
