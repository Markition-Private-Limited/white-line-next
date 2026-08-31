'use client'

import Image, { type StaticImageData } from 'next/image'
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
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
import { RadarGraphic, StoreButton } from './AppSection'
import styles from './AirportTransferBookingDialog.module.css'

type BookingFor = 'self' | 'guest' | null
export type BookingService = 'airport' | 'hourly' | 'city' | 'day' | 'oneWay'
type DayDuration = 'half' | 'full'
type Props = { open: boolean; onClose: () => void; service?: BookingService }

const categories: { name: string; copy: string; image: StaticImageData }[] = [
  { name: 'First Class', copy: 'Efficient transportation for daily commutes and short city trips.', image: firstClassImg },
  { name: 'Business Class', copy: 'Premium sedans with extra legroom, tailored for business.', image: businessClassImg },
  { name: 'Van', copy: 'Chauffeur-driven MPVs for groups with ample luggage.', image: vanImg },
  { name: 'Sedan', copy: 'Luxury sedans featuring leather privacy glass.', image: sedanImg },
  { name: 'SUV', copy: 'Chauffeur-driven MPVs for groups with ample luggage.', image: suvImg },
]

const vehicles = [vCar1, vCar2, vCar3]
const hourlyDurations = Array.from({ length: 15 }, (_, index) => index + 2)

function TextField({ label, placeholder, icon }: { label: string; placeholder: string; icon?: React.ReactNode }) {
  return (
    <div className={styles.field}>
      <label>{label}</label>
      <div className={styles.control}>
        <input aria-label={label} placeholder={placeholder} />
        {icon && <span className={styles.controlIcon}>{icon}</span>}
      </div>
    </div>
  )
}

function FooterActions({ back, next, nextLabel = 'Continue' }: { back: () => void; next: () => void; nextLabel?: string }) {
  return (
    <div className={styles.footerActions}>
      <button type="button" className={styles.back} onClick={back}><ArrowLeft size={20} /> Back</button>
      <button type="button" className={styles.continue} onClick={next}>{nextLabel} <ArrowRight size={16} /></button>
    </div>
  )
}

function BookingForSection({ bookingFor, setBookingFor, next, back }: {
  bookingFor: BookingFor
  setBookingFor: (value: BookingFor) => void
  next: () => void
  back: () => void
}) {
  const continueTrip = () => {
    if (!bookingFor) setBookingFor('guest')
    else next()
  }

  return (
    <>
      <p className={styles.bookingQuestion}>Are you making this booking for yourself or a guest?</p>
      <div className={styles.choiceGrid}>
        <button type="button" className={`${styles.choice} ${bookingFor === 'self' ? styles.choiceActive : ''}`} onClick={() => setBookingFor('self')}>
          <span className={styles.choiceIcon}><UserRound size={15} /></span>
          <span className={styles.choiceCopy}><strong>For Myself</strong><small>I&apos;ll be travelling</small></span>
          <ChevronRight size={16} />
        </button>
        <button type="button" className={`${styles.choice} ${bookingFor === 'guest' ? styles.choiceActive : ''}`} onClick={() => setBookingFor('guest')}>
          <span className={styles.choiceIcon}><UsersRound size={15} /></span>
          <span className={styles.choiceCopy}><strong>For a Guest</strong><small>Someone else will be travelling</small></span>
          <ChevronRight size={16} />
        </button>
      </div>

      {bookingFor === 'guest' && (
        <div className={styles.guestPanel}>
          <h3>Guest Details</h3>
          <p>Please enter your guest&apos;s details</p>
          <TextField label="Full Name" placeholder="Guest Name" />
          <TextField label="Phone Number" placeholder="+966 50 123 4567" />
          <TextField label="Email Address" placeholder="guest@gmail.com" />
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
  return (
    <>
      <p className={styles.eyebrow}>Airport Transfer</p>
      <h2 className={styles.title}>Trip Details</h2>
      <p className={styles.subtitle}>Tell us where and when you need your ride.</p>

      <div className={styles.fieldGrid}>
        <TextField label="Pickup Airport" placeholder="Select Airport" icon={<LocateFixed size={15} />} />
        <TextField label="Drop-off Location" placeholder="Enter Destination" icon={<LocateFixed size={15} />} />
        <TextField label="Flight Date" placeholder="--/--/----" icon={<CalendarDays size={16} />} />
        <TextField label="Pickup Time" placeholder="--:-- AM" icon={<Clock3 size={16} />} />
        <TextField label="Flight Number" placeholder="✈  e.g PK-753" />
        <div className={styles.flightRoute} aria-label="Flight route preview">
          <span className={styles.routeHalf}>From<br />--:--</span>
          <Image className={styles.plane} src={horizontalPlane} alt="" />
          <span className={styles.routeHalf}>To<br />--:--</span>
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
  const [durationOpen, setDurationOpen] = useState(false)

  return (
    <>
      <p className={styles.eyebrow}>Hourly Chauffeur</p>
      <h2 className={styles.title}>Trip Details</h2>
      <p className={styles.subtitle}>Tell us where and when you need your ride.</p>

      <div className={styles.fieldGrid}>
        <TextField label="Pickup Location" placeholder="Select Pickup location" icon={<LocateFixed size={15} />} />
        <TextField label="Destination" placeholder="Select Drop-off location" icon={<LocateFixed size={15} />} />
        <TextField label="Pickup Date" placeholder="--/--/----" icon={<CalendarDays size={16} />} />
        <TextField label="Pickup Time" placeholder="--:-- AM" icon={<Clock3 size={16} />} />
      </div>

      <div className={styles.durationField}>
        <label>Select Duration</label>
        <button type="button" className={styles.durationControl} aria-expanded={durationOpen} aria-haspopup="listbox" onClick={() => setDurationOpen(open => !open)}>
          <span>{duration} hours</span>
          <ChevronDown size={18} className={durationOpen ? styles.durationChevronOpen : ''} />
        </button>
        <AnimatePresence>
          {durationOpen && (
            <motion.div className={styles.durationMenu} role="listbox" initial={{ opacity: 0, y: -8, scaleY: .96 }} animate={{ opacity: 1, y: 0, scaleY: 1 }} exit={{ opacity: 0, y: -8, scaleY: .96 }} transition={{ duration: .2, ease: 'easeOut' }}>
              {hourlyDurations.map(hours => (
                <button key={hours} type="button" role="option" aria-selected={duration === hours} className={duration === hours ? styles.durationOptionActive : ''} onClick={() => { setDuration(hours); setDurationOpen(false) }}>
                  {hours} hours ({hours * 40} km included)
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className={styles.durationInfo}>
        <CircleInfo size={19} />
        <span><strong>Need more than 2 hours?</strong><small>Choose Half Day or Full Day options</small></span>
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
  return (
    <>
      <p className={styles.eyebrow}>City-to-City</p>
      <h2 className={styles.title}>Trip Details</h2>
      <p className={styles.subtitle}>Tell us where and when you need your ride.</p>

      <div className={styles.fieldGrid}>
        <TextField label="Pickup Location" placeholder="Select Pickup location" icon={<LocateFixed size={15} />} />
        <TextField label="Destination" placeholder="Select Drop-off location" icon={<LocateFixed size={15} />} />
        <TextField label="Pickup Date" placeholder="--/--/----" icon={<CalendarDays size={16} />} />
        <TextField label="Pickup Time" placeholder="--:-- AM" icon={<Clock3 size={16} />} />
      </div>

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
  return (
    <>
      <p className={styles.eyebrow}>One Way Ride</p>
      <h2 className={styles.title}>Trip Details</h2>
      <p className={styles.subtitle}>Tell us where and when you need your ride.</p>

      <div className={styles.fieldGrid}>
        <TextField label="Pickup Location" placeholder="Select Pickup location" icon={<LocateFixed size={15} />} />
        <TextField label="Drop-off Location (Optional)" placeholder="Select Drop-off location" icon={<LocateFixed size={15} />} />
        <TextField label="Pickup Date" placeholder="--/--/----" icon={<CalendarDays size={16} />} />
        <TextField label="Pickup Time" placeholder="--:-- AM" icon={<Clock3 size={16} />} />
      </div>

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
  return (
    <>
      <p className={styles.eyebrow}>Day Service</p>
      <h2 className={styles.title}>Trip Details</h2>
      <p className={styles.subtitle}>Tell us where and when you need your ride.</p>

      <div className={styles.dayDurationField}>
        <p>Booking Duration</p>
        <div className={styles.dayDurationGrid}>
          <button type="button" className={`${styles.dayDurationOption} ${dayDuration === 'half' ? styles.dayDurationActive : ''}`} onClick={() => setDayDuration('half')}>
            <span className={styles.dayDurationIcon}><Clock3 size={16} /></span>
            <span><strong>Half Day</strong><small>Up to 4 Hours</small></span>
            {dayDuration === 'half' && <Check className={styles.dayDurationCheck} size={11} strokeWidth={3} />}
          </button>
          <button type="button" className={`${styles.dayDurationOption} ${dayDuration === 'full' ? styles.dayDurationActive : ''}`} onClick={() => setDayDuration('full')}>
            <span className={styles.dayDurationIcon}><Clock3 size={16} /></span>
            <span><strong>Full Day</strong><small>Up to 10 hours</small></span>
            {dayDuration === 'full' && <Check className={styles.dayDurationCheck} size={11} strokeWidth={3} />}
          </button>
        </div>
      </div>

      <div className={styles.fieldGrid}>
        <TextField label="Pickup Location" placeholder="Select Pickup location" icon={<LocateFixed size={15} />} />
        <TextField label="Destination" placeholder="Select Drop-off location" icon={<LocateFixed size={15} />} />
        <TextField label="Pickup Date" placeholder="--/--/----" icon={<CalendarDays size={16} />} />
        <TextField label="Pickup Time" placeholder="--:-- AM" icon={<Clock3 size={16} />} />
      </div>

      <BookingForSection bookingFor={bookingFor} setBookingFor={setBookingFor} back={back} next={next} />
    </>
  )
}

function RideStep({ back, next, service, duration, dayDuration }: { back: () => void; next: () => void; service: BookingService; duration: number; dayDuration: DayDuration }) {
  const [category, setCategory] = useState('Business Class')
  const [vehicle, setVehicle] = useState(0)
  const isHourly = service === 'hourly'
  const isCity = service === 'city'
  const isDay = service === 'day'
  const isOneWay = service === 'oneWay'
  const summaryRows = isHourly
    ? [['Pickup Date', '20 Aug 2026'], ['Pickup Time', '07:00 AM'], ['Duration', `${duration} hours`], ['Category', category.replace(' Class', '')], ['Vehicle', 'Mercedes E-Class']]
    : isCity
      ? [['Pickup Date', '20 Aug 2026'], ['Pickup Time', '07:00 AM'], ['Journey', 'City-to-City'], ['Category', category.replace(' Class', '')], ['Vehicle', 'Mercedes E-Class']]
      : isDay
        ? [['Pickup Date', '20 Aug 2026'], ['Pickup Time', '07:00 AM'], ['Duration', dayDuration === 'full' ? 'Full Day' : 'Half Day'], ['Category', category.replace(' Class', '')], ['Vehicle', 'Mercedes E-Class']]
        : isOneWay
          ? [['Pickup Date', '20 Aug 2026'], ['Pickup Time', '07:00 AM'], ['Journey', 'One Way'], ['Category', category.replace(' Class', '')], ['Vehicle', 'Mercedes E-Class']]
    : [['Flight', 'PK-753'], ['Flight Date', '20 Aug 2026'], ['Pickup Time', '07:00 AM'], ['Category', category.replace(' Class', '')], ['Vehicle', 'Mercedes E-Class']]

  return (
    <>
      <p className={styles.eyebrow}>{isHourly ? 'Hourly Chauffeur' : isCity ? 'City-to-City' : isDay ? 'Day Service' : isOneWay ? 'One Way Ride' : 'Airport Transfer'}</p>
      <h2 className={styles.title}>Select Your Ride</h2>
      <p className={styles.subtitle}>Choose your preferred vehicle and provide passenger details.</p>
      <p className={styles.categoryIntro}>Choose the category that best fits your journey.</p>
      <div className={styles.categoryGrid}>
        {categories.map(item => (
          <button type="button" key={item.name} className={`${styles.categoryCard} ${category === item.name ? styles.categoryActive : ''}`} onClick={() => setCategory(item.name)}>
            <strong>{item.name}</strong><small>{item.copy}</small><Image src={item.image} alt="" />
          </button>
        ))}
      </div>
      <div className={styles.vehiclePanel}>
        <p>Available {category} vehicles.</p>
        <div className={styles.vehicleGrid}>
          {vehicles.map((image, index) => (
            <button type="button" key={image.src} className={`${styles.vehicleCard} ${vehicle === index ? styles.vehicleSelected : ''}`} onClick={() => setVehicle(index)}>
              <Image src={image} alt="Mercedes E-Class" />
              <span>
                <strong>Mercedes E-Class</strong>
                <small className={styles.vehicleSpecs} aria-label="2 passengers and 4 bags">
                  <span className={styles.vehicleSpec}><span className={styles.vehicleSpecIcon}><UsersRound size={8} /></span><span>2</span></span>
                  <span className={styles.vehicleSpec}><span className={styles.vehicleSpecIcon}><Luggage size={8} /></span><span>4</span></span>
                </small>
              </span>
            </button>
          ))}
        </div>
      </div>
      <h3 className={styles.reviewTitle}>Review Your Booking</h3>
      <div className={styles.summaryCard}>
        <div className={styles.routeSummary}>
          <div><small>Pickup</small><strong>{isHourly || isDay || isOneWay ? 'King Fahd Road, Riyadh' : isCity ? 'Riyadh, Saudi Arabia' : 'Riyadh International Airport, RUH'}</strong></div>
          <ArrowRight size={20} />
          <div><small>{isHourly || isCity || isDay ? 'Destination' : 'Drop Off'}</small><strong>{isHourly || isDay || isOneWay ? 'Riyadh Front, Riyadh' : isCity ? 'Jeddah, Saudi Arabia' : 'Riyadh, Saudi Arabia'}</strong></div>
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

  const paymentComplete = Object.values(payment).every(value => value.trim().length > 0)
  const isHourly = service === 'hourly'
  const isCity = service === 'city'
  const isDay = service === 'day'
  const isOneWay = service === 'oneWay'

  return (
    <>
      <p className={styles.eyebrow}>{isHourly ? 'Hourly Chauffeur' : isCity ? 'City-to-City' : isDay ? 'Day Service' : isOneWay ? 'One Way Ride' : 'Airport Transfer'}</p>
      <h2 className={styles.title}>Fare Summary</h2>
      <p className={styles.subtitle}>Your fare for this {isHourly ? 'hourly booking' : isCity ? 'city-to-city journey' : isDay ? 'day service' : isOneWay ? 'one way ride' : 'airport transfer'}.</p>
      <div className={styles.fareCard}>
        <div className={styles.fareRow}><span>{isHourly ? 'Hourly Fare' : isCity ? 'Journey Fare' : isDay ? 'Day Service Fare' : isOneWay ? 'Ride Fare' : 'Transfer Fare'}</span><span>SAR 72.00</span></div>
        <div className={styles.fareRow}><span>{isHourly || isCity || isDay || isOneWay ? 'Service Fee' : 'Airport Service'}</span><span>SAR 4.33</span></div>
        <div className={styles.fareRow}><span>VAT (15%)</span><span>SAR 11.45</span></div>
        <div className={`${styles.fareRow} ${styles.fareTotal}`}><span>Total Fare</span><span>SAR 87.78</span></div>
      </div>
      <div className={styles.paymentMethodRow}>
        <p className={styles.paymentTitle}>Payment Method</p>
        <div className={styles.brands}>
          <span className={styles.brand}><Image src={visaSvg} alt="Visa" height={18} /></span>
          <span className={styles.brand}><Image src={amexSvg} alt="American Express" height={18} /></span>
          <span className={styles.brand}><Image src={masterSvg} alt="Mastercard" height={18} /></span>
        </div>
      </div>
      <motion.div className={styles.paymentGrid} layout>
        <motion.div className={`${styles.cardFields} ${paymentComplete ? '' : styles.cardFieldsWide}`} layout transition={{ duration: .45, ease: [0.22, 1, 0.36, 1] }}>
          <div className={styles.control}><span className={styles.floatingLabel}>Card Number</span><input aria-label="Card Number" value={payment.cardNumber} onChange={event => updatePayment('cardNumber', formatCardNumber(event.target.value))} placeholder="4347 8977 8097 7089" inputMode="numeric" autoComplete="cc-number" maxLength={19} /><span className={styles.fieldIcon}><Image src={cardNumberSvg} alt="" width={25} height={25} /></span></div>
          <div className={styles.control}><span className={styles.floatingLabel}>Card Name</span><input aria-label="Card Name" value={payment.cardName} onChange={event => updatePayment('cardName', event.target.value)} placeholder="Sultan Ali" autoComplete="cc-name" /></div>
          <div className={styles.cardMiniGrid}>
            <div className={styles.control}><span className={styles.floatingLabel}>Expiry Date</span><input aria-label="Expiry Date" value={payment.expiry} onChange={event => updatePayment('expiry', formatExpiry(event.target.value))} placeholder="MM/YY" inputMode="numeric" autoComplete="cc-exp" maxLength={5} /></div>
            <div className={styles.control}><span className={styles.floatingLabel}>CVV</span><input aria-label="CVV" value={payment.cvv} onChange={event => updatePayment('cvv', event.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="123" inputMode="numeric" autoComplete="cc-csc" maxLength={4} /><span className={styles.fieldIcon}><Image src={cvvSvg} alt="" width={19} height={19} /></span></div>
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
              <span className={styles.otpIcon}><Image src={shieldSvg} alt="Secure verification" width={12} height={14} /></span>
              <h4>Enter the one-time password sent to your phone.</h4>
              <p>We&apos;ve sent a 6-digit verification code.</p>
              <div className={styles.otpBoxes}>{[0,1,2,3].map(i => <input key={i} aria-label={`OTP digit ${i + 1}`} maxLength={1} />)}</div>
              <p>Didn&apos;t get the code? Resend in 00:45</p>
              <button type="button" className={styles.resend}>Resend OTP</button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <FooterActions back={back} next={next} />
    </>
  )
}

function SuccessStep({ back, service }: { back: () => void; service: BookingService }) {
  const isHourly = service === 'hourly'
  const isCity = service === 'city'
  const isDay = service === 'day'
  const isOneWay = service === 'oneWay'
  return (
    <div className={styles.successBody}>
      <p className={styles.eyebrow}>{isHourly ? 'Hourly Chauffeur' : isCity ? 'City-to-City' : isDay ? 'Day Service' : isOneWay ? 'One Way Ride' : 'Airport Transfer'}</p>
      <h2 className={styles.title}>Request Received</h2>
      <p className={styles.subtitle}>Your fare for this {isHourly ? 'hourly booking' : isCity ? 'city-to-city journey' : isDay ? 'day service' : isOneWay ? 'one way ride' : 'airport transfer'}.</p>
      <div className={styles.successCenter}>
        <span className={styles.successCheck}><Check size={16} strokeWidth={3} /></span>
        <h3>We&apos;ve received your booking request.</h3>
        <p>Our team will find the best chauffeur for your journey and assign one to your booking.</p>
        <span className={styles.reference}>BOOKING REFERENCE <strong>WL-661699</strong></span>
      </div>
      <div className={styles.appBanner}>
        <span className={styles.appRadarClip} aria-hidden="true">
          <RadarGraphic className={styles.appRadar} />
        </span>
        <h3>Track <strong><em>Your Journey</em></strong> In The Mobile App</h3>
        <p>For live chauffeur and vehicle tracking, download the WhiteLine app.</p>
        <div className={styles.stores}>
          <StoreButton variant="apple" mini sub="Download on the" main="App Store" />
          <StoreButton variant="google" mini sub="Get it on" main="Google Play" />
        </div>
        <Image className={styles.appPhones} src={appPhones} alt="White Line mobile app" />
      </div>
      <FooterActions back={back} next={() => undefined} nextLabel="Download App" />
    </div>
  )
}

export default function AirportTransferBookingDialog({ open, onClose, service = 'airport' }: Props) {
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
          <span id="airport-dialog-title" className="sr-only">Airport transfer booking</span>
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
