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
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import appPhones from '../assets/global_app/app.png'
import horizontalPlane from '../assets/dialog/horizontal plane.svg'
import flightNumberSvg from '../assets/dialog/flight_number.svg'
import visaSvg from '../assets/dialog/visa.svg'
import masterSvg from '../assets/dialog/master.svg'
import amexSvg from '../assets/dialog/american_express.svg'
import cardNumberSvg from '../assets/dialog/card_number.svg'
import cvvSvg from '../assets/dialog/cvv.svg'
import shieldSvg from '../assets/dialog/shield.svg'
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
import PlacesAutocompleteField from './PlacesAutocompleteField'
import styles from './AirportTransferBookingDialog.module.css'

type BookingFor = 'self' | 'guest' | null
export type BookingService = 'airport' | 'hourly' | 'city' | 'day' | 'oneWay'
type DayDuration = 'half' | 'full'
type Props = { open: boolean; onClose: () => void; service?: BookingService }

const categoryImages: StaticImageData[] = [firstClassImg, businessClassImg, vanImg, sedanImg, suvImg]

const vehicles = [vCar1, vCar2, vCar3]
const hourlyDurations = Array.from({ length: 15 }, (_, index) => index + 2)

function useBookingDialogCopy() {
  const { lang, dir } = useLanguage()
  return { copy: bookingDialogCopy[lang], lang, dir }
}

function TextField({ label, placeholder, icon, startIcon, minLength = 2, inputType = 'text' }: { label: string; placeholder: string; icon?: React.ReactNode; startIcon?: React.ReactNode; minLength?: number; inputType?: 'text' | 'email' | 'tel' }) {
  const { copy, lang } = useBookingDialogCopy()
  const [value, setValue] = useState('')
  const trimmed = value.trim()
  const emailInvalid = inputType === 'email' && trimmed.length > 0 && !/^\S+@\S+\.\S+$/.test(trimmed)
  const phoneInvalid = inputType === 'tel' && trimmed.length > 0 && value.replace(/\D/g, '').length < 8
  const lengthInvalid = inputType === 'text' && trimmed.length > 0 && trimmed.length < minLength
  const invalid = emailInvalid || phoneInvalid || lengthInvalid
  const validationMessage = emailInvalid ? copy.validation.email : phoneInvalid ? copy.validation.phone : lengthInvalid ? copy.validation.characters(minLength) : ''

  return (
    <div className={`${styles.field} ${invalid ? styles.fieldInvalid : ''}`}>
      <label>{label}</label>
      <div className={styles.control}>
        {startIcon && <span className={styles.controlStartIcon}>{startIcon}</span>}
        <input aria-label={label} aria-invalid={invalid} type={inputType} value={value} onChange={event => setValue(event.target.value)} placeholder={placeholder} className={startIcon ? styles.inputWithStartIcon : undefined} />
        {icon && <span className={styles.controlIcon}>{icon}</span>}
      </div>
      <AnimatePresence initial={false}>
        {invalid && <motion.small className={styles.fieldError} initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }}>{validationMessage}</motion.small>}
      </AnimatePresence>
    </div>
  )
}

function DropdownField({ label, placeholder, options }: { label: string; placeholder: string; options: string[] }) {
  const [value, setValue] = useState('')
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

  return (
    <div ref={fieldRef} className={`${styles.field} ${styles.pickerField}`}>
      <label>{label}</label>
      <button type="button" className={styles.pickerControl} aria-expanded={open} aria-haspopup="listbox" onClick={() => setOpen(current => !current)}>
        <span className={value ? '' : styles.pickerPlaceholder}>{value || placeholder}</span>
        <span className={styles.controlIcon}><LocateFixed size={15} /></span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div className={styles.fieldMenu} role="listbox" initial={{ opacity: 0, y: -7, scaleY: .97 }} animate={{ opacity: 1, y: 0, scaleY: 1 }} exit={{ opacity: 0, y: -7, scaleY: .97 }} transition={{ duration: .2, ease: 'easeOut' }}>
            {options.map(option => <button key={option} type="button" role="option" aria-selected={value === option} className={value === option ? styles.fieldOptionActive : ''} onClick={() => { setValue(option); setOpen(false) }}>{option}</button>)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function DatePickerField({ label }: { label: string }) {
  const { copy, dir } = useBookingDialogCopy()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [selected, setSelected] = useState<Date | null>(null)
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

  return (
    <div ref={fieldRef} className={`${styles.field} ${styles.pickerField}`}>
      <label>{label}</label>
      <button type="button" className={styles.pickerControl} aria-expanded={open} aria-haspopup="dialog" onClick={() => setOpen(current => !current)}>
        <span className={selected ? '' : styles.pickerPlaceholder}>{selected ? selected.toLocaleDateString(copy.calendar.locale, { day: '2-digit', month: 'short', year: 'numeric' }) : '--/--/----'}</span>
        <span className={styles.controlIcon}><CalendarDays size={16} /></span>
      </button>
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
                const active = selected?.getFullYear() === year && selected?.getMonth() === monthIndex && selected?.getDate() === day
                return <button key={day} type="button" disabled={disabled} className={active ? styles.calendarDayActive : ''} onClick={() => { setSelected(date); setOpen(false) }}>{day}</button>
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function TimePickerField({ label }: { label: string }) {
  const { lang } = useBookingDialogCopy()
  const [value, setValue] = useState('')
  const [open, setOpen] = useState(false)
  const fieldRef = useRef<HTMLDivElement>(null)
  const pickupTimes = Array.from({ length: 48 }, (_, index) => {
    const hour24 = Math.floor(index / 2)
    const minutes = index % 2 === 0 ? '00' : '30'
    const suffix = lang === 'ar' ? (hour24 >= 12 ? 'م' : 'ص') : (hour24 >= 12 ? 'PM' : 'AM')
    const hour12 = hour24 % 12 || 12
    return `${hour12}:${minutes} ${suffix}`
  })

  useEffect(() => {
    if (!open) return
    const close = (event: PointerEvent) => {
      if (!fieldRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [open])

  return (
    <div ref={fieldRef} className={`${styles.field} ${styles.pickerField}`}>
      <label>{label}</label>
      <button type="button" className={styles.pickerControl} aria-expanded={open} aria-haspopup="listbox" onClick={() => setOpen(current => !current)}>
        <span className={value ? '' : styles.pickerPlaceholder}>{value || (lang === 'ar' ? '--:-- ص' : '--:-- AM')}</span>
        <span className={styles.controlIcon}><Clock3 size={16} /></span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div className={`${styles.fieldMenu} ${styles.timeMenu}`} role="listbox" initial={{ opacity: 0, y: -7, scaleY: .97 }} animate={{ opacity: 1, y: 0, scaleY: 1 }} exit={{ opacity: 0, y: -7, scaleY: .97 }} transition={{ duration: .2, ease: 'easeOut' }}>
            {pickupTimes.map(time => <button key={time} type="button" role="option" aria-selected={value === time} className={value === time ? styles.fieldOptionActive : ''} onClick={() => { setValue(time); setOpen(false) }}>{time}</button>)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function LocationScheduleFields({ pickupLabel, pickupPlaceholder, destinationLabel, destinationPlaceholder }: { pickupLabel?: string; pickupPlaceholder?: string; destinationLabel?: string; destinationPlaceholder?: string }) {
  const { copy } = useBookingDialogCopy()
  return (
    <div className={styles.fieldGrid}>
      <PlacesAutocompleteField label={pickupLabel ?? copy.pickupLocation} placeholder={pickupPlaceholder ?? copy.selectPickup} />
      <PlacesAutocompleteField label={destinationLabel ?? copy.destination} placeholder={destinationPlaceholder ?? copy.selectDropOff} />
      <DatePickerField label={copy.pickupDate} />
      <TimePickerField label={copy.pickupTime} />
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

function BookingForSection({ bookingFor, setBookingFor, next, back }: {
  bookingFor: BookingFor
  setBookingFor: (value: BookingFor) => void
  next: () => void
  back: () => void
}) {
  const { copy, dir } = useBookingDialogCopy()
  const ChoiceIcon = dir === 'rtl' ? ChevronLeft : ChevronRight
  const continueTrip = () => {
    if (!bookingFor) setBookingFor('guest')
    else next()
  }

  return (
    <>
      <p className={styles.bookingQuestion}>{copy.bookingQuestion}</p>
      <div className={styles.choiceGrid}>
        <button type="button" className={`${styles.choice} ${bookingFor === 'self' ? styles.choiceActive : ''}`} onClick={() => setBookingFor('self')}>
          <span className={styles.choiceIcon}><UserRound size={15} /></span>
          <span className={styles.choiceCopy}><strong>{copy.forMyself}</strong><small>{copy.selfTravel}</small></span>
          <ChoiceIcon size={16} />
        </button>
        <button type="button" className={`${styles.choice} ${bookingFor === 'guest' ? styles.choiceActive : ''}`} onClick={() => setBookingFor('guest')}>
          <span className={styles.choiceIcon}><UsersRound size={15} /></span>
          <span className={styles.choiceCopy}><strong>{copy.forGuest}</strong><small>{copy.guestTravel}</small></span>
          <ChoiceIcon size={16} />
        </button>
      </div>

      {bookingFor === 'guest' && (
        <div className={styles.guestPanel}>
          <h3>{copy.guestDetails}</h3>
          <p>{copy.enterGuestDetails}</p>
          <TextField label={copy.fullName} placeholder={copy.guestName} minLength={2} />
          <TextField label={copy.phoneNumber} placeholder="+966 50 123 4567" inputType="tel" />
          <TextField label={copy.emailAddress} placeholder="guest@gmail.com" inputType="email" />
        </div>
      )}

      <FooterActions back={bookingFor === 'guest' ? () => setBookingFor(null) : back} next={continueTrip} />
    </>
  )
}

function TripDetails({ bookingFor, setBookingFor, next, back }: {
  bookingFor: BookingFor
  setBookingFor: (value: BookingFor) => void
  next: () => void
  back: () => void
}) {
  const { copy, lang } = useBookingDialogCopy()
  return (
    <>
      <p className={styles.eyebrow}>{copy.services.airport}</p>
      <h2 className={styles.title}>{copy.tripDetails}</h2>
      <p className={styles.subtitle}>{copy.tripSubtitle}</p>

      <div className={styles.fieldGrid}>
        <DropdownField label={copy.pickupAirport} placeholder={copy.selectAirport} options={copy.airports} />
        <PlacesAutocompleteField label={copy.dropOff} placeholder={copy.enterDestination} />
        <DatePickerField label={copy.flightDate} />
        <TimePickerField label={copy.pickupTime} />
        <TextField label={copy.flightNumber} placeholder={copy.flightExample} minLength={5} startIcon={<Image src={flightNumberSvg} alt="" width={20} height={18} />} />
        <div className={styles.flightRoute} aria-label={copy.flightRoutePreview} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <span className={styles.routeHalf}>{copy.from}<br />--:--</span>
          <Image className={styles.plane} src={horizontalPlane} alt="" />
          <span className={styles.routeHalf}>{copy.to}<br />--:--</span>
        </div>
      </div>

      <BookingForSection bookingFor={bookingFor} setBookingFor={setBookingFor} back={back} next={next} />
    </>
  )
}

function HourlyTripDetails({ bookingFor, setBookingFor, duration, setDuration, next, back }: {
  bookingFor: BookingFor
  setBookingFor: (value: BookingFor) => void
  duration: number
  setDuration: (value: number) => void
  next: () => void
  back: () => void
}) {
  const { copy } = useBookingDialogCopy()
  const [durationOpen, setDurationOpen] = useState(false)

  return (
    <>
      <p className={styles.eyebrow}>{copy.services.hourly}</p>
      <h2 className={styles.title}>{copy.tripDetails}</h2>
      <p className={styles.subtitle}>{copy.tripSubtitle}</p>

      <LocationScheduleFields />

      <div className={styles.durationField}>
        <label>{copy.selectDuration}</label>
        <button type="button" className={styles.durationControl} aria-expanded={durationOpen} aria-haspopup="listbox" onClick={() => setDurationOpen(open => !open)}>
          <span>{duration} {copy.hours}</span>
          <ChevronDown size={18} className={durationOpen ? styles.durationChevronOpen : ''} />
        </button>
        <AnimatePresence>
          {durationOpen && (
            <motion.div className={styles.durationMenu} role="listbox" initial={{ opacity: 0, y: -8, scaleY: .96 }} animate={{ opacity: 1, y: 0, scaleY: 1 }} exit={{ opacity: 0, y: -8, scaleY: .96 }} transition={{ duration: .2, ease: 'easeOut' }}>
              {hourlyDurations.map(hours => (
                <button key={hours} type="button" role="option" aria-selected={duration === hours} className={duration === hours ? styles.durationOptionActive : ''} onClick={() => { setDuration(hours); setDurationOpen(false) }}>
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

      <BookingForSection bookingFor={bookingFor} setBookingFor={setBookingFor} back={back} next={next} />
    </>
  )
}

function CityTripDetails({ bookingFor, setBookingFor, next, back }: {
  bookingFor: BookingFor
  setBookingFor: (value: BookingFor) => void
  next: () => void
  back: () => void
}) {
  const { copy } = useBookingDialogCopy()
  return (
    <>
      <p className={styles.eyebrow}>{copy.services.city}</p>
      <h2 className={styles.title}>{copy.tripDetails}</h2>
      <p className={styles.subtitle}>{copy.tripSubtitle}</p>

      <LocationScheduleFields />

      <BookingForSection bookingFor={bookingFor} setBookingFor={setBookingFor} back={back} next={next} />
    </>
  )
}

function OneWayTripDetails({ bookingFor, setBookingFor, next, back }: {
  bookingFor: BookingFor
  setBookingFor: (value: BookingFor) => void
  next: () => void
  back: () => void
}) {
  const { copy } = useBookingDialogCopy()
  return (
    <>
      <p className={styles.eyebrow}>{copy.services.oneWay}</p>
      <h2 className={styles.title}>{copy.tripDetails}</h2>
      <p className={styles.subtitle}>{copy.tripSubtitle}</p>

      <LocationScheduleFields destinationLabel={copy.optionalDropOff} />

      <BookingForSection bookingFor={bookingFor} setBookingFor={setBookingFor} back={back} next={next} />
    </>
  )
}

function DayTripDetails({ bookingFor, setBookingFor, dayDuration, setDayDuration, next, back }: {
  bookingFor: BookingFor
  setBookingFor: (value: BookingFor) => void
  dayDuration: DayDuration
  setDayDuration: (value: DayDuration) => void
  next: () => void
  back: () => void
}) {
  const { copy } = useBookingDialogCopy()
  return (
    <>
      <p className={styles.eyebrow}>{copy.services.day}</p>
      <h2 className={styles.title}>{copy.tripDetails}</h2>
      <p className={styles.subtitle}>{copy.tripSubtitle}</p>

      <div className={styles.dayDurationField}>
        <p>{copy.bookingDuration}</p>
        <div className={styles.dayDurationGrid}>
          <button type="button" className={`${styles.dayDurationOption} ${dayDuration === 'half' ? styles.dayDurationActive : ''}`} onClick={() => setDayDuration('half')}>
            <span className={styles.dayDurationIcon}><Clock3 size={16} /></span>
            <span><strong>{copy.halfDay}</strong><small>{copy.upTo4Hours}</small></span>
            {dayDuration === 'half' && <Check className={styles.dayDurationCheck} size={11} strokeWidth={3} />}
          </button>
          <button type="button" className={`${styles.dayDurationOption} ${dayDuration === 'full' ? styles.dayDurationActive : ''}`} onClick={() => setDayDuration('full')}>
            <span className={styles.dayDurationIcon}><Clock3 size={16} /></span>
            <span><strong>{copy.fullDay}</strong><small>{copy.upTo10Hours}</small></span>
            {dayDuration === 'full' && <Check className={styles.dayDurationCheck} size={11} strokeWidth={3} />}
          </button>
        </div>
      </div>

      <LocationScheduleFields />

      <BookingForSection bookingFor={bookingFor} setBookingFor={setBookingFor} back={back} next={next} />
    </>
  )
}

function RideStep({ back, next, service, duration, dayDuration }: { back: () => void; next: () => void; service: BookingService; duration: number; dayDuration: DayDuration }) {
  const { copy, dir } = useBookingDialogCopy()
  const [categoryIndex, setCategoryIndex] = useState(1)
  const [vehicle, setVehicle] = useState(0)
  const categories = copy.categories.map((item, index) => ({ ...item, image: categoryImages[index] }))
  const category = categories[categoryIndex].name
  const isHourly = service === 'hourly'
  const isCity = service === 'city'
  const isDay = service === 'day'
  const isOneWay = service === 'oneWay'
  const l = copy.summaryLabels
  const summaryRows = isHourly
    ? [[l.pickupDate, '20 Aug 2026'], [l.pickupTime, '07:00 AM'], [l.duration, `${duration} ${copy.hours}`], [l.category, category], [l.vehicle, 'Mercedes E-Class']]
    : isCity
      ? [[l.pickupDate, '20 Aug 2026'], [l.pickupTime, '07:00 AM'], [l.journey, copy.summaryValues.city], [l.category, category], [l.vehicle, 'Mercedes E-Class']]
      : isDay
        ? [[l.pickupDate, '20 Aug 2026'], [l.pickupTime, '07:00 AM'], [l.duration, dayDuration === 'full' ? copy.fullDay : copy.halfDay], [l.category, category], [l.vehicle, 'Mercedes E-Class']]
        : isOneWay
          ? [[l.pickupDate, '20 Aug 2026'], [l.pickupTime, '07:00 AM'], [l.journey, copy.summaryValues.oneWay], [l.category, category], [l.vehicle, 'Mercedes E-Class']]
          : [[l.flight, 'PK-753'], [l.flightDate, '20 Aug 2026'], [l.pickupTime, '07:00 AM'], [l.category, category], [l.vehicle, 'Mercedes E-Class']]
  const SummaryArrow = dir === 'rtl' ? ArrowLeft : ArrowRight

  return (
    <>
      <p className={styles.eyebrow}>{isHourly ? copy.services.hourly : isCity ? copy.services.city : isDay ? copy.services.day : isOneWay ? copy.services.oneWay : copy.services.airport}</p>
      <h2 className={styles.title}>{copy.selectRide}</h2>
      <p className={styles.subtitle}>{copy.selectRideSubtitle}</p>
      <p className={styles.categoryIntro}>{copy.chooseCategory}</p>
      <div className={styles.categoryGrid}>
        {categories.map((item, index) => (
          <button type="button" key={item.name} className={`${styles.categoryCard} ${categoryIndex === index ? styles.categoryActive : ''}`} onClick={() => setCategoryIndex(index)}>
            <strong>{item.name}</strong><small>{item.copy}</small><Image src={item.image} alt="" />
          </button>
        ))}
      </div>
      <div className={styles.vehiclePanel}>
        <p>{copy.availableVehicles(category)}</p>
        <div className={styles.vehicleGrid}>
          {vehicles.map((image, index) => (
            <button type="button" key={image.src} className={`${styles.vehicleCard} ${vehicle === index ? styles.vehicleSelected : ''}`} onClick={() => setVehicle(index)}>
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
          <div><small>{copy.pickup}</small><strong>{isHourly || isDay || isOneWay ? copy.addresses.kingFahd : isCity ? copy.addresses.riyadh : copy.addresses.airport}</strong></div>
          <SummaryArrow size={20} />
          <div><small>{isHourly || isCity || isDay ? copy.summaryDestination : copy.summaryDropOff}</small><strong>{isHourly || isDay || isOneWay ? copy.addresses.riyadhFront : isCity ? copy.addresses.jeddah : copy.addresses.riyadh}</strong></div>
        </div>
        {summaryRows.map(row => (
          <div className={styles.summaryRow} key={row[0]}><span>{row[0]}</span><span>{row[1]}</span></div>
        ))}
      </div>
      <FooterActions back={back} next={next} />
    </>
  )
}

function FareStep({ back, next, service }: { back: () => void; next: () => void; service: BookingService }) {
  const [payment, setPayment] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  })

  const updatePayment = (field: keyof typeof payment, value: string) => {
    setPayment(current => ({ ...current, [field]: value }))
  }

  const formatCardNumber = (value: string) =>
    value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4)
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
  }

  const cardNumberInvalid = payment.cardNumber.length > 0 && payment.cardNumber.replace(/\D/g, '').length < 16
  const cardNameInvalid = payment.cardName.length > 0 && payment.cardName.trim().length < 2
  const expiryInvalid = payment.expiry.length > 0 && payment.expiry.length < 5
  const cvvInvalid = payment.cvv.length > 0 && payment.cvv.length < 3
  const paymentComplete =
    payment.cardNumber.replace(/\D/g, '').length === 16 &&
    payment.cardName.trim().length >= 2 &&
    payment.expiry.length === 5 &&
    payment.cvv.length >= 3
  const isHourly = service === 'hourly'
  const isCity = service === 'city'
  const isDay = service === 'day'
  const isOneWay = service === 'oneWay'
  const { copy } = useBookingDialogCopy()

  return (
    <>
      <p className={styles.eyebrow}>{isHourly ? copy.services.hourly : isCity ? copy.services.city : isDay ? copy.services.day : isOneWay ? copy.services.oneWay : copy.services.airport}</p>
      <h2 className={styles.title}>{copy.fareSummary}</h2>
      <p className={styles.subtitle}>{copy.fareSubtitle[service]}</p>
      <div className={styles.fareCard}>
        <div className={styles.fareRow}><span>{copy.fareLabels[service]}</span><span>SAR 72.00</span></div>
        <div className={styles.fareRow}><span>{isHourly || isCity || isDay || isOneWay ? copy.serviceFee : copy.airportService}</span><span>SAR 4.33</span></div>
        <div className={styles.fareRow}><span>{copy.vat}</span><span>SAR 11.45</span></div>
        <div className={`${styles.fareRow} ${styles.fareTotal}`}><span>{copy.totalFare}</span><span>SAR 87.78</span></div>
      </div>
      <div className={styles.paymentMethodRow}>
        <p className={styles.paymentTitle}>{copy.paymentMethod}</p>
        <div className={styles.brands}>
          <span className={styles.brand}><Image src={visaSvg} alt="Visa" height={18} /></span>
          <span className={styles.brand}><Image src={amexSvg} alt="American Express" height={18} /></span>
          <span className={styles.brand}><Image src={masterSvg} alt="Mastercard" height={18} /></span>
        </div>
      </div>
      <motion.div className={styles.paymentGrid} layout>
        <motion.div className={`${styles.cardFields} ${paymentComplete ? '' : styles.cardFieldsWide}`} layout transition={{ duration: .45, ease: [0.22, 1, 0.36, 1] }}>
          <div className={styles.paymentField}><div className={`${styles.control} ${cardNumberInvalid ? styles.controlInvalid : ''}`}><span className={styles.floatingLabel}>{copy.cardNumber}</span><input aria-label={copy.cardNumber} aria-invalid={cardNumberInvalid} value={payment.cardNumber} onChange={event => updatePayment('cardNumber', formatCardNumber(event.target.value))} placeholder="4347 8977 8097 7089" inputMode="numeric" autoComplete="cc-number" maxLength={19} /><span className={styles.fieldIcon}><Image src={cardNumberSvg} alt="" width={25} height={25} /></span></div>{cardNumberInvalid && <small className={styles.fieldError}>{copy.validation.cardNumber}</small>}</div>
          <div className={styles.paymentField}><div className={`${styles.control} ${cardNameInvalid ? styles.controlInvalid : ''}`}><span className={styles.floatingLabel}>{copy.cardName}</span><input aria-label={copy.cardName} aria-invalid={cardNameInvalid} value={payment.cardName} onChange={event => updatePayment('cardName', event.target.value)} placeholder={copy.cardNamePlaceholder} autoComplete="cc-name" /></div>{cardNameInvalid && <small className={styles.fieldError}>{copy.validation.cardName}</small>}</div>
          <div className={styles.cardMiniGrid}>
            <div className={styles.paymentField}><div className={`${styles.control} ${expiryInvalid ? styles.controlInvalid : ''}`}><span className={styles.floatingLabel}>{copy.expiryDate}</span><input aria-label={copy.expiryDate} aria-invalid={expiryInvalid} value={payment.expiry} onChange={event => updatePayment('expiry', formatExpiry(event.target.value))} placeholder="MM/YY" inputMode="numeric" autoComplete="cc-exp" maxLength={5} /></div>{expiryInvalid && <small className={styles.fieldError}>{copy.validation.expiry}</small>}</div>
            <div className={styles.paymentField}><div className={`${styles.control} ${cvvInvalid ? styles.controlInvalid : ''}`}><span className={styles.floatingLabel}>{copy.cvv}</span><input aria-label={copy.cvv} aria-invalid={cvvInvalid} value={payment.cvv} onChange={event => updatePayment('cvv', event.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="123" inputMode="numeric" autoComplete="cc-csc" maxLength={4} /><span className={styles.fieldIcon}><Image src={cvvSvg} alt="" width={19} height={19} /></span></div>{cvvInvalid && <small className={styles.fieldError}>{copy.validation.cvv}</small>}</div>
          </div>
        </motion.div>
        <AnimatePresence initial={false}>
          {paymentComplete && (
            <motion.div
              className={styles.otpPanel}
              aria-live="polite"
              initial={{ opacity: 0, x: 28, scale: .97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 28, scale: .97 }}
              transition={{ duration: .38, ease: [0.22, 1, 0.36, 1] }}
              layout
            >
              <span className={styles.otpIcon}><Image src={shieldSvg} alt={copy.secureVerification} width={12} height={14} /></span>
              <h4>{copy.otpTitle}</h4>
              <p>{copy.otpSent}</p>
              <div className={styles.otpBoxes}>{[0,1,2,3].map(i => <input key={i} aria-label={copy.otpDigit(i + 1)} maxLength={1} />)}</div>
              <p>{copy.otpResend}</p>
              <button type="button" className={styles.resend}>{copy.resendOtp}</button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <FooterActions back={back} next={next} />
    </>
  )
}

function SuccessStep({ back, service }: { back: () => void; service: BookingService }) {
  const { copy, dir } = useBookingDialogCopy()
  const isRtl = dir === 'rtl'
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
        <p>{copy.receivedBody}</p>
        <span className={styles.reference}>{copy.bookingReference} <strong>WL-661699</strong></span>
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
          <StoreButton variant="apple" mini sub={copy.downloadOn} main="App Store" isRtl={isRtl} />
          <StoreButton variant="google" mini sub={copy.getItOn} main="Google Play" isRtl={isRtl} />
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
      <FooterActions back={back} next={() => undefined} nextLabel={copy.downloadApp} />
    </div>
  )
}

export default function AirportTransferBookingDialog({ open, onClose, service = 'airport' }: Props) {
  const { copy } = useBookingDialogCopy()
  const [step, setStep] = useState(0)
  const [bookingFor, setBookingFor] = useState<BookingFor>(null)
  const [duration, setDuration] = useState(2)
  const [dayDuration, setDayDuration] = useState<DayDuration>('full')
  const overlayRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const resetAndClose = useCallback(() => {
    setStep(0)
    setBookingFor(null)
    setDuration(2)
    setDayDuration('full')
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!open) return
    const prev = {
      bodyOverflow: document.body.style.overflow,
      bodyOverscroll: document.body.style.overscrollBehavior,
    }
    document.body.style.overflow = 'hidden'
    document.body.style.overscrollBehavior = 'none'
    dialogRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') resetAndClose() }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = prev.bodyOverflow
      document.body.style.overscrollBehavior = prev.bodyOverscroll
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, resetAndClose])

  useEffect(() => {
    if (!open) return
    if (overlayRef.current) overlayRef.current.scrollTop = 0
    if (dialogRef.current) dialogRef.current.scrollTop = 0
  }, [open, step])

  if (!open) return null
  const goBack = () => {
    if (step === 0) resetAndClose()
    else setStep(current => current - 1)
  }

  return (
    <div ref={overlayRef} className={styles.overlay} data-lenis-prevent onMouseDown={event => { if (event.target === event.currentTarget) resetAndClose() }}>
      <div ref={dialogRef} className={styles.dialog} data-lenis-prevent role="dialog" aria-modal="true" aria-labelledby="airport-dialog-title" tabIndex={-1}>
        <div className={styles.content}>
          <span id="airport-dialog-title" className="sr-only">{copy.services[service]} {copy.dialogLabel}</span>
          {step === 0 && service === 'airport' && <TripDetails bookingFor={bookingFor} setBookingFor={setBookingFor} back={goBack} next={() => setStep(1)} />}
          {step === 0 && service === 'hourly' && <HourlyTripDetails bookingFor={bookingFor} setBookingFor={setBookingFor} duration={duration} setDuration={setDuration} back={goBack} next={() => setStep(1)} />}
          {step === 0 && service === 'city' && <CityTripDetails bookingFor={bookingFor} setBookingFor={setBookingFor} back={goBack} next={() => setStep(1)} />}
          {step === 0 && service === 'day' && <DayTripDetails bookingFor={bookingFor} setBookingFor={setBookingFor} dayDuration={dayDuration} setDayDuration={setDayDuration} back={goBack} next={() => setStep(1)} />}
          {step === 0 && service === 'oneWay' && <OneWayTripDetails bookingFor={bookingFor} setBookingFor={setBookingFor} back={goBack} next={() => setStep(1)} />}
          {step === 1 && <RideStep service={service} duration={duration} dayDuration={dayDuration} back={goBack} next={() => setStep(2)} />}
          {step === 2 && <FareStep service={service} back={goBack} next={() => setStep(3)} />}
          {step === 3 && <SuccessStep service={service} back={goBack} />}
        </div>
      </div>
    </div>
  )
}
