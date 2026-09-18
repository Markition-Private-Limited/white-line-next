'use client'

import Image from 'next/image'
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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import appPhones from '../assets/global_app/app.png'
import horizontalPlane from '../assets/dialog/horizontal plane.svg'
import flightNumberSvg from '../assets/dialog/flight_number.svg'
import { useLanguage } from '../context/LanguageContext'
import { bookingDialogCopy } from '../lib/bookingDialogCopy'
import { phoneCountryCodes, type CountryCode } from '../lib/phoneCountryCodes'
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
  categoryIndex: number | null
  vehicle: number | null
  vehicleId: string | null
  otp: string[]
}
type CustomerSession = { accessToken: string; refreshToken?: string }
type CustomerProfile = { fullName: string; phone: string; email: string; profileComplete: boolean }

const CUSTOMER_SESSION_KEY = 'whiteline.customerSession'
const CLIENT_AUTH_TIMEOUT_MS = 12000

const hourlyDurations = Array.from({ length: 15 }, (_, index) => index + 2)

// ─── Live fleet data (vehicle-classes / vehicles-per-class) ─────────────────
// Backed by a small proxy in app/api/fleet/**, which caches the upstream
// fleet API server-side. Mirrored here with a short-lived client cache so
// reopening the booking dialog doesn't refetch on every open.
type VehicleClass = {
  id: string
  className: string
  description: string
  passengerCapacity: number
  luggageCapacity: number
  isActive: boolean
  imageUrl?: string
  baseFare?: string | number
  perKmRate?: string | number
  hourlyRate?: string | number
  halfDayRate?: string | number
  fullDayRate?: string | number
  fullDay8hrRate?: string | number
  fullDay10hrRate?: string | number
  fullDay12hrRate?: string | number
  cityToCityRate?: string | number
  cityTransferRate?: string | number
  cityExtraKmRate?: string | number
  airportTransferRate?: string | number
  airportExtraKmRate?: string | number
  base_fare?: string | number
  per_km_rate?: string | number
  hourly_rate?: string | number
  half_day_rate?: string | number
  full_day_rate?: string | number
  full_day_8hr_rate?: string | number
  full_day_10hr_rate?: string | number
  full_day_12hr_rate?: string | number
  city_to_city_rate?: string | number
  city_transfer_rate?: string | number
  city_extra_km_rate?: string | number
  airport_transfer_rate?: string | number
  airport_extra_km_rate?: string | number
}
type ClassVehicle = { id: string; make: string; model: string; year: number; plate_number: string; color: string; status: string; vehicle_front_photo_url: string | null; base_fare?: number }

const FLEET_CACHE_TTL_MS = 5 * 60 * 1000
let fleetClassesCache: { data: VehicleClass[]; timestamp: number } | null = null
const fleetVehiclesCache = new Map<string, { data: ClassVehicle[]; timestamp: number }>()

async function getFleetClasses(): Promise<VehicleClass[]> {
  if (fleetClassesCache && Date.now() - fleetClassesCache.timestamp < FLEET_CACHE_TTL_MS) return fleetClassesCache.data
  try {
    const res = await fetch('/api/fleet/vehicle-classes')
    const data = res.ok ? await res.json() : []
    const classes: VehicleClass[] = Array.isArray(data) ? data : []
    fleetClassesCache = { data: classes, timestamp: Date.now() }
    return classes
  } catch {
    return fleetClassesCache?.data ?? []
  }
}

async function getFleetVehicles(classId: string, serviceType?: string): Promise<ClassVehicle[]> {
  const cacheKey = serviceType ? `${classId}:${serviceType}` : classId
  const cached = fleetVehiclesCache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < FLEET_CACHE_TTL_MS) return cached.data
  try {
    const qs = serviceType ? `?service_type=${encodeURIComponent(serviceType)}` : ''
    const res = await fetch(`/api/fleet/vehicle-classes/${encodeURIComponent(classId)}/vehicles${qs}`)
    const data = res.ok ? await res.json() : []
    const list: ClassVehicle[] = Array.isArray(data) ? data : []
    fleetVehiclesCache.set(cacheKey, { data: list, timestamp: Date.now() })
    return list
  } catch {
    return cached?.data ?? []
  }
}

type CategoryTile = { id?: string; name: string; copy: string; imageUrl?: string }

function buildCategoryTiles(fleetClasses: VehicleClass[] | null): CategoryTile[] {
  if (!fleetClasses) return []
  return fleetClasses.map(cls => ({
    id: cls.id,
    name: cls.className,
    copy: cls.description,
    imageUrl: cls.imageUrl || undefined,
  }))
}

type FareMeta = { type: 'perKm' | 'perHour'; amount: number } | { type: 'halfDay' | 'fullDay' }
type VehicleCard = { key: string; image: string | null; title: string; passengers: number; bags: number; fareAmount: number | null; fareMeta: FareMeta | null }

const TEMP_FLEET_IMAGES: Record<string, string> = {
  'bmw 5 series': '/temp_fleet_cars/BMW 5 Series.png',
  'bmw 7 series': '/temp_fleet_cars/BMW 7 Series.png',
  'chevrolet suburban': '/temp_fleet_cars/Chevrolet Suburban.png',
  'chevrolet tahoe': '/temp_fleet_cars/Chevrolet Tahoe.png',
  'ford taurus': '/temp_fleet_cars/Ford Taurus.png',
  'gmc yukon xl': '/temp_fleet_cars/GMC Yukon XL.png',
  'gmc yukon': '/temp_fleet_cars/[GMC Yukon.png',
  'hyundai staria': '/temp_fleet_cars/Hyundai Staria.png',
  'lexus es350': '/temp_fleet_cars/Lexus ES350.png',
  'mercedes-benz s-class': '/temp_fleet_cars/Mercedes-Benz S-Class.png',
}
const getTempFleetImage = (title: string): string | null => {
  const key = title.toLowerCase().trim()
  if (TEMP_FLEET_IMAGES[key]) return TEMP_FLEET_IMAGES[key]
  const partial = Object.keys(TEMP_FLEET_IMAGES).find(k => key.includes(k) || k.includes(key))
  return partial ? TEMP_FLEET_IMAGES[partial] : null
}

function parseFleetRate(value: string | number | null | undefined): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (typeof value !== 'string') return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function firstFleetRate(...values: Array<string | number | null | undefined>): number | null {
  for (const value of values) {
    const parsed = parseFleetRate(value)
    if (parsed !== null) return parsed
  }
  return null
}

function getServiceFare(activeClass: VehicleClass | null, service: BookingService, dayDuration: DayDuration): { amount: number | null; meta: FareMeta | null } {
  if (!activeClass) return { amount: null, meta: null }
  if (service === 'airport') {
    const amount = firstFleetRate(activeClass.airportTransferRate, activeClass.airport_transfer_rate, activeClass.baseFare, activeClass.base_fare)
    const extraKm = firstFleetRate(activeClass.airportExtraKmRate, activeClass.airport_extra_km_rate, activeClass.perKmRate, activeClass.per_km_rate)
    return { amount, meta: extraKm !== null ? { type: 'perKm', amount: extraKm } : null }
  }
  if (service === 'city') {
    const amount = firstFleetRate(activeClass.cityToCityRate, activeClass.city_to_city_rate, activeClass.cityTransferRate, activeClass.city_transfer_rate, activeClass.baseFare, activeClass.base_fare)
    const extraKm = firstFleetRate(activeClass.cityExtraKmRate, activeClass.city_extra_km_rate, activeClass.perKmRate, activeClass.per_km_rate)
    return { amount, meta: extraKm !== null ? { type: 'perKm', amount: extraKm } : null }
  }
  if (service === 'hourly') {
    const amount = firstFleetRate(activeClass.hourlyRate, activeClass.hourly_rate, activeClass.baseFare, activeClass.base_fare)
    return { amount, meta: amount !== null ? { type: 'perHour', amount } : null }
  }
  if (service === 'day') {
    const amount = dayDuration === 'full'
      ? firstFleetRate(activeClass.fullDay10hrRate, activeClass.full_day_10hr_rate, activeClass.fullDayRate, activeClass.full_day_rate, activeClass.baseFare, activeClass.base_fare)
      : firstFleetRate(activeClass.halfDayRate, activeClass.half_day_rate, activeClass.baseFare, activeClass.base_fare)
    return { amount, meta: amount !== null ? { type: dayDuration === 'full' ? 'fullDay' : 'halfDay' } : null }
  }
  const amount = firstFleetRate(activeClass.baseFare, activeClass.base_fare)
  const perKm = firstFleetRate(activeClass.perKmRate, activeClass.per_km_rate)
  return { amount, meta: perKm !== null ? { type: 'perKm', amount: perKm } : null }
}

function buildVehicleCards(activeVehicles: ClassVehicle[], activeClass: VehicleClass | null, service: BookingService, dayDuration: DayDuration): VehicleCard[] {
  const passengers = activeClass?.passengerCapacity ?? 2
  const bags = activeClass?.luggageCapacity ?? 4
  const classFare = getServiceFare(activeClass, service, dayDuration)
  const vehicleTitle = (vehicle: ClassVehicle) => {
    const make = vehicle.make.trim()
    const model = vehicle.model.trim()
    if (!model || model === '-') return make
    const makeLower = make.toLowerCase()
    const modelLower = model.toLowerCase()
    if (makeLower === modelLower || makeLower.includes(modelLower)) return make
    return `${make} ${model}`
  }
  return activeVehicles.map(vehicle => {
    const title = vehicleTitle(vehicle)
    const image = vehicle.vehicle_front_photo_url ?? getTempFleetImage(title)
    const fareAmount = typeof vehicle.base_fare === 'number' ? vehicle.base_fare : classFare.amount
    const fareMeta = typeof vehicle.base_fare === 'number' ? null : classFare.meta
    return { key: vehicle.id, image, title, passengers, bags, fareAmount, fareMeta }
  })
}

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
  dayDuration: 'half',
  name: '',
  email: '',
  phone: '',
  bookingFor: null,
  guest: blankGuest(),
  categoryIndex: 0,
  vehicle: null,
  vehicleId: null,
  otp: Array(4).fill(''),
})

const normalizePhone = (phone: string) => phone.replace(/\s/g, '')

function readCustomerSession(): CustomerSession | null {
  if (typeof window === 'undefined') return null
  try {
    const parsed = JSON.parse(window.localStorage.getItem(CUSTOMER_SESSION_KEY) ?? 'null') as Partial<CustomerSession> | null
    return parsed?.accessToken ? { accessToken: parsed.accessToken, refreshToken: parsed.refreshToken } : null
  } catch {
    return null
  }
}

function storeCustomerSession(session: CustomerSession) {
  try {
    window.localStorage?.setItem(CUSTOMER_SESSION_KEY, JSON.stringify(session))
  } catch {
    // Ignore storage failures; the current booking flow can continue in memory.
  }
}

function clearCustomerSession() {
  try {
    window.localStorage?.removeItem(CUSTOMER_SESSION_KEY)
  } catch {
    // Ignore storage failures; the OTP flow will be shown again if needed.
  }
}

function getRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null
}

function digString(value: unknown, keys: string[]): string {
  const record = getRecord(value)
  if (!record) return ''
  for (const key of keys) {
    const direct = record[key]
    if (typeof direct === 'string' && direct.trim()) return direct.trim()
  }
  for (const key of ['data', 'customer', 'user', 'profile']) {
    const nested = digString(record[key], keys)
    if (nested) return nested
  }
  return ''
}

function digBoolean(value: unknown, keys: string[]): boolean | null {
  const record = getRecord(value)
  if (!record) return null
  for (const key of keys) {
    if (typeof record[key] === 'boolean') return record[key] as boolean
    if (typeof record[key] === 'number') return record[key] === 1
  }
  for (const key of ['data', 'customer', 'user', 'profile']) {
    const nested = digBoolean(record[key], keys)
    if (nested !== null) return nested
  }
  return null
}

function parseCustomerSession(value: unknown): CustomerSession | null {
  const accessToken = digString(value, ['accessToken', 'access_token', 'token', 'access'])
  if (!accessToken) return null
  const refreshToken = digString(value, ['refreshToken', 'refresh_token', 'refresh'])
  return { accessToken, refreshToken: refreshToken || undefined }
}

function parseCustomerProfile(value: unknown): CustomerProfile | null {
  const firstName = digString(value, ['firstName', 'first_name'])
  const lastName = digString(value, ['lastName', 'last_name'])
  const fullName = digString(value, ['fullName', 'full_name', 'name']) || [firstName, lastName].filter(Boolean).join(' ')
  const phone = digString(value, ['phone', 'phoneNumber', 'phone_number', 'mobile'])
  const email = digString(value, ['email', 'emailAddress', 'email_address'])
  const completeFlag = digBoolean(value, ['profileComplete', 'profile_complete', 'isProfileComplete', 'is_profile_complete', 'isComplete', 'is_complete'])
  if (!fullName && !phone && !email && completeFlag === null) return null
  return { fullName, phone, email, profileComplete: completeFlag ?? Boolean(fullName && phone && email) }
}

async function authFetch(path: string, token: string, init: RequestInit = {}) {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), CLIENT_AUTH_TIMEOUT_MS)
  const headers = new Headers(init.headers)
  headers.set('Authorization', `Bearer ${token}`)
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  try {
    return await fetch(path, { ...init, headers, signal: controller.signal })
  } finally {
    window.clearTimeout(timeoutId)
  }
}

async function fetchCustomerProfile(token: string): Promise<CustomerProfile | null> {
  const res = await authFetch('/api/customers/profile', token)
  if (!res.ok) return null
  return parseCustomerProfile(await res.json())
}

async function refreshCustomerSession(refreshToken: string): Promise<CustomerSession | null> {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), CLIENT_AUTH_TIMEOUT_MS)
  const res = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
    signal: controller.signal,
  }).finally(() => window.clearTimeout(timeoutId))
  if (!res.ok) return null
  return parseCustomerSession(await res.json())
}

function profileToBookingUpdates(profile: CustomerProfile): Partial<BookingState> {
  return {
    name: profile.fullName,
    phone: profile.phone,
    email: profile.email,
  }
}

const airportPlace = (address: string): PlaceValue => ({ address, source: 'airport' })
const placeLabel = (place: PlaceValue | null, fallback = '--') => place?.address || fallback

const AIRPORT_COORDS: Record<string, { lat: number; lng: number }> = {
  'King Khalid International Airport (RUH)': { lat: 24.9576, lng: 46.6988 },
  'King Abdulaziz International Airport (JED)': { lat: 21.6796, lng: 39.1565 },
  'King Fahd International Airport (DMM)': { lat: 26.4712, lng: 49.7979 },
  'Prince Mohammad bin Abdulaziz International Airport (MED)': { lat: 24.5534, lng: 39.7051 },
  'مطار الملك خالد الدولي (RUH)': { lat: 24.9576, lng: 46.6988 },
  'مطار الملك عبدالعزيز الدولي (JED)': { lat: 21.6796, lng: 39.1565 },
  'مطار الملك فهد الدولي (DMM)': { lat: 26.4712, lng: 49.7979 },
  'مطار الأمير محمد بن عبدالعزيز الدولي (MED)': { lat: 24.5534, lng: 39.7051 },
}

function toApiServiceType(service: BookingService, dayDuration: DayDuration): string {
  if (service === 'airport') return 'airport'
  if (service === 'hourly') return 'hourly'
  if (service === 'city') return 'city_to_city'
  if (service === 'day') return dayDuration === 'half' ? 'half_day' : 'full_day'
  return 'one_way'
}

type LatLng = { lat: number; lng: number }

async function resolveCoords(place: PlaceValue): Promise<LatLng | null> {
  if (place.source === 'airport') return AIRPORT_COORDS[place.address] ?? null
  // Use eagerly-resolved coords stored at selection time
  if (typeof place.lat === 'number' && typeof place.lng === 'number') return { lat: place.lat, lng: place.lng }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const g = (window as any).google
  if (!g?.maps) return null
  if (place.placeId && g.maps.places?.PlacesService) {
    const detailsCoords = await new Promise<LatLng | null>(resolve => {
      const svc = new g.maps.places.PlacesService(document.createElement('div'))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      svc.getDetails({ placeId: place.placeId, fields: ['geometry'] }, (result: any, status: string) => {
        if (status === 'OK' && result?.geometry?.location) {
          resolve({ lat: result.geometry.location.lat(), lng: result.geometry.location.lng() })
        } else {
          console.error('[resolveCoords] PlacesService.getDetails failed:', status, place.placeId)
          resolve(null)
        }
      })
    })
    if (detailsCoords) return detailsCoords
  }
  if (!place.address || !g.maps.Geocoder) return null
  return new Promise(resolve => {
    const geocoder = new g.maps.Geocoder()
    geocoder.geocode({ address: place.address, componentRestrictions: { country: 'SA' } }, (results: unknown[] | null, status: string) => {
      const first = Array.isArray(results) ? results[0] as { geometry?: { location?: { lat: () => number; lng: () => number } } } : null
      if (status === 'OK' && first?.geometry?.location) {
        resolve({ lat: first.geometry.location.lat(), lng: first.geometry.location.lng() })
      } else {
        console.error('[resolveCoords] Geocoder failed:', status, place.address)
        resolve(null)
      }
    })
  })
}

type FareData = {
  base_fare?: number
  distance_fare?: number
  service_fee?: number
  subtotal?: number
  vat_amount?: number
  total_fare?: number
  distance_km?: number
  duration_minutes?: number
}

function formatBookingDate(date: Date | null, locale: string) {
  if (!date) return '--/--/----'
  const d = date instanceof Date ? date : new Date(String(date))
  return isNaN(d.getTime()) ? '--/--/----' : d.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' })
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

function TextField({ label, placeholder, value, icon, startIcon, minLength = 2, inputType = 'text', onChange, attempted }: { label: string; placeholder: string; value: string; icon?: React.ReactNode; startIcon?: React.ReactNode; minLength?: number; inputType?: 'text' | 'email'; onChange: (value: string) => void; attempted?: boolean }) {
  const { copy } = useBookingDialogCopy()
  const trimmed = value.trim()
  const isEmpty = attempted && trimmed.length === 0
  const emailInvalid = inputType === 'email' && trimmed.length > 0 && !/^\S+@\S+\.\S+$/.test(trimmed)
  const lengthInvalid = inputType === 'text' && trimmed.length > 0 && trimmed.length < minLength
  const invalid = isEmpty || emailInvalid || lengthInvalid
  const validationMessage = isEmpty ? copy.validation.required : emailInvalid ? copy.validation.email : lengthInvalid ? copy.validation.characters(minLength) : ''

  return (
    <div className={`${styles.field} ${invalid ? styles.fieldInvalid : ''}`}>
      <label>{label}</label>
      <div className={styles.control}>
        {startIcon && <span className={styles.controlStartIcon}>{startIcon}</span>}
        <input aria-label={label} aria-invalid={invalid} type={inputType} value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} className={startIcon ? styles.inputWithStartIcon : undefined} />
        {icon && <span className={styles.controlIcon}>{icon}</span>}
      </div>
      <AnimatePresence initial={false}>
        {invalid && <motion.small className={styles.fieldError} initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }}>{validationMessage}</motion.small>}
      </AnimatePresence>
    </div>
  )
}

function PhoneField({ label, value, onChange, attempted }: { label: string; value: string; onChange: (value: string) => void; attempted?: boolean }) {
  const { copy, lang } = useBookingDialogCopy()

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

  const trimmed = value.trim()
  const isEmpty = attempted && trimmed.length === 0
  const phoneInvalid = trimmed.length > 0 && value.replace(/\D/g, '').length < 8
  const invalid = isEmpty || phoneInvalid
  const validationMessage = isEmpty ? copy.validation.required : phoneInvalid ? copy.validation.phone : ''

  const selectCountry = (country: CountryCode) => {
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
    <div className={`${styles.field} ${invalid ? styles.fieldInvalid : ''}`} ref={wrapRef}>
      <label>{label}</label>
      <div className={styles.phoneControl}>
        <button type="button" className={styles.phoneCodeBtn} onClick={() => setOpen(o => !o)} aria-haspopup="listbox" aria-expanded={open}>
          <span className={`fi fi-${active.iso.toLowerCase()} ${styles.phoneCodeBtnFlag}`} aria-hidden="true" />
          <span>{active.dial}</span>
          <ChevronDown size={12} className={open ? styles.phoneCodeOpen : undefined} />
        </button>
        <input aria-label={label} aria-invalid={invalid} type="tel" inputMode="tel" value={localNumber} onChange={event => handleNumberChange(event.target.value)} placeholder={active.iso === 'SA' ? '501234567' : ''} className={styles.phoneNumberInput} />
        <AnimatePresence>
          {open && (
            <motion.div className={styles.phoneCodeMenu} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.16 }}>
              <div className={styles.phoneCodeSearchWrap}>
                <input
                  ref={searchRef}
                  type="text"
                  className={styles.phoneCodeSearchInput}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={lang === 'ar' ? 'ابحث عن الدولة أو الرمز...' : 'Search country or code…'}
                  autoComplete="off"
                />
              </div>
              <div className={styles.phoneCodeList}>
                {filteredCountries.length === 0 && (
                  <div className={styles.phoneCodeEmpty}>{lang === 'ar' ? 'لا توجد نتائج' : 'No results'}</div>
                )}
                {filteredCountries.map(country => (
                  <button type="button" key={country.iso} role="option" aria-selected={country.iso === selectedIso} className={country.iso === selectedIso ? styles.phoneCodeOptionActive : undefined} onClick={() => selectCountry(country)}>
                    <span className={`fi fi-${country.iso.toLowerCase()} ${styles.phoneCodeFlag}`} aria-hidden="true" />
                    {(lang === 'ar' && country.nameAr) ? country.nameAr : country.name}
                    <span className={styles.phoneCodeDial}>{country.dial}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
        <span className={`${styles.pickerControlText} ${value ? '' : styles.pickerPlaceholder}`}>{value?.address || placeholder}</span>
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
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({})
  const fieldRef = useRef<HTMLDivElement>(null)
  const controlRef = useRef<HTMLButtonElement>(null)
  const year = month.getFullYear()
  const monthIndex = month.getMonth()
  const leadingDays = (new Date(year, monthIndex, 1).getDay() + 6) % 7
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const calendarDays = [...Array.from({ length: leadingDays }, () => null), ...Array.from({ length: daysInMonth }, (_, index) => index + 1)]
  const isCurrentMonth = year === today.getFullYear() && monthIndex === today.getMonth()

  const openCalendar = () => {
    const rect = controlRef.current?.getBoundingClientRect()
    if (rect) {
      const menuHeight = 260
      const menuWidth = Math.min(280, window.innerWidth - 16)
      const spaceBelow = window.innerHeight - rect.bottom
      const openUpward = spaceBelow < menuHeight + 12 && rect.top > spaceBelow
      const top = openUpward
        ? Math.max(8, rect.top - menuHeight - 7)
        : Math.min(rect.bottom + 7, window.innerHeight - menuHeight - 8)
      let left = rect.left
      if (left + menuWidth > window.innerWidth - 8) left = window.innerWidth - menuWidth - 8
      if (left < 8) left = 8
      setMenuStyle({ position: 'fixed', top, left, width: menuWidth, zIndex: 9999 })
    }
    setOpen(c => !c)
  }

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
      <button ref={controlRef} type="button" className={styles.pickerControl} aria-expanded={open} aria-haspopup="dialog" onClick={openCalendar}>
        <span className={value ? '' : styles.pickerPlaceholder}>{formatBookingDate(value, copy.calendar.locale)}</span>
        <span className={styles.controlIcon}><CalendarDays size={16} /></span>
      </button>
      <AnimatePresence initial={false}>
        {isEmpty && <motion.small className={styles.fieldError} initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }}>{copy.validation.required}</motion.small>}
      </AnimatePresence>
      <AnimatePresence>
        {open && (
          <motion.div className={styles.calendarMenu} style={menuStyle} role="dialog" aria-label={`${label} ${copy.calendar.label}`} dir={dir} initial={{ opacity: 0, y: -7, scaleY: .97 }} animate={{ opacity: 1, y: 0, scaleY: 1 }} exit={{ opacity: 0, y: -7, scaleY: .97 }} transition={{ duration: .2, ease: 'easeOut' }}>
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

  // Sync draft when value is set externally (e.g. from PickupEstimatorDialog)
  useEffect(() => { if (value) setDraft(value) }, [value])

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
    const next = { ...draft, hour: nextPeriod === 'AM' ? draft.hour % 12 : draft.hour % 12 + 12 }
    setDraft(next)
    onChange(next)
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
              <button type="button" aria-pressed={!draft.use24Hour} className={!draft.use24Hour ? styles.clockFormatActive : ''} onClick={() => { const next = { ...draft, use24Hour: false }; setDraft(next); onChange(next) }}>{copy.timePicker.twelveHour}</button>
              <button type="button" aria-pressed={draft.use24Hour} className={draft.use24Hour ? styles.clockFormatActive : ''} onClick={() => { const next = { ...draft, use24Hour: true }; setDraft(next); onChange(next) }}>{copy.timePicker.twentyFourHour}</button>
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

function LocationScheduleFields({ booking, updateBooking, pickupLabel, pickupPlaceholder, destinationLabel, destinationPlaceholder, attempted, citiesOnly }: { booking: BookingState; updateBooking: (updates: Partial<BookingState>) => void; pickupLabel?: string; pickupPlaceholder?: string; destinationLabel?: string; destinationPlaceholder?: string; attempted: boolean; citiesOnly?: boolean }) {
  const { copy } = useBookingDialogCopy()
  const cityTypes = citiesOnly ? ['(cities)'] : undefined
  return (
    <div className={styles.fieldGrid}>
      <PlacesAutocompleteField label={pickupLabel ?? copy.pickupLocation} placeholder={pickupPlaceholder ?? copy.selectPickup} value={booking.pickup} attempted={attempted} onChange={value => updateBooking({ pickup: value })} types={cityTypes} />
      <PlacesAutocompleteField label={destinationLabel ?? copy.destination} placeholder={destinationPlaceholder ?? copy.selectDropOff} value={booking.destination} attempted={attempted} onChange={value => updateBooking({ destination: value })} types={cityTypes} />
      <DatePickerField label={copy.pickupDate} value={booking.date} attempted={attempted} onChange={date => updateBooking({ date })} />
      <TimePickerField label={copy.pickupTime} value={booking.time} attempted={attempted} onChange={time => updateBooking({ time })} />
    </div>
  )
}

function FooterActions({ back, next, nextLabel = 'Continue', showNext = true }: { back: () => void; next: () => void; nextLabel?: string; showNext?: boolean }) {
  const { copy, dir } = useBookingDialogCopy()
  const BackIcon = dir === 'rtl' ? ArrowRight : ArrowLeft
  const NextIcon = dir === 'rtl' ? ArrowLeft : ArrowRight
  return (
    <div className={styles.footerActions}>
      <button type="button" className={styles.back} onClick={back}><BackIcon size={20} /> {copy.back}</button>
      {showNext && <button type="button" className={styles.continue} onClick={next}>{nextLabel === 'Continue' ? copy.continue : nextLabel} <NextIcon size={16} /></button>}
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
  const [authAttempted, setAuthAttempted] = useState(false)
  const [authPhone, setAuthPhone] = useState(booking.phone)
  const [authOtp, setAuthOtp] = useState<string[]>(() => Array(4).fill(''))
  const [profileDraft, setProfileDraft] = useState({ name: booking.name, email: booking.email })
  const [authStep, setAuthStep] = useState<'phone' | 'otp' | 'profile'>('phone')
  const [initialSession] = useState<CustomerSession | null>(() => readCustomerSession())
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const [session, setSession] = useState<CustomerSession | null>(initialSession)
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null)
  const ChoiceIcon = dir === 'rtl' ? ChevronLeft : ChevronRight
  const contactComplete = booking.name.trim().length >= 2 && /^\S+@\S+\.\S+$/.test(booking.email.trim()) && booking.phone.replace(/\D/g, '').length >= 8
  const guestFieldsComplete = booking.guest.name.trim().length >= 2 && booking.guest.phone.replace(/\D/g, '').length >= 8 && /^\S+@\S+\.\S+$/.test(booking.guest.email.trim())
  const authMobile = normalizePhone(authPhone)
  const authPhoneComplete = /^\+966\d{9}$/.test(authMobile)
  const otpComplete = authOtp.every(digit => digit.trim().length === 1)
  const updateBookingRef = useRef(updateBooking)
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([])
  const resendToastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [resendToast, setResendToast] = useState<{ visible: boolean; phone: string }>({ visible: false, phone: '' })

  useEffect(() => {
    updateBookingRef.current = updateBooking
  }, [updateBooking])

  const applyProfile = useCallback((profile: CustomerProfile) => {
    setCustomerProfile(profile)
    setProfileDraft({ name: profile.fullName, email: profile.email })
    updateBookingRef.current(profileToBookingUpdates(profile))
  }, [])

  const resetCustomerAuth = useCallback(() => {
    clearCustomerSession()
    setSession(null)
    setCustomerProfile(null)
    setAuthStep('phone')
    setAuthLoading(false)
    setAuthError('')
  }, [])

  useEffect(() => {
    if (!initialSession?.accessToken) return
    const savedSession = initialSession
    let cancelled = false

    async function restoreCustomerSession() {
      setAuthLoading(true)
      try {
        let activeProfile = await fetchCustomerProfile(savedSession.accessToken)
        if (cancelled) return
        let activeSession = savedSession
        if (!activeProfile && savedSession.refreshToken) {
          const refreshedSession = await refreshCustomerSession(savedSession.refreshToken)
          if (cancelled) return
          if (refreshedSession) {
            storeCustomerSession(refreshedSession)
            setSession(refreshedSession)
            activeSession = refreshedSession
            activeProfile = await fetchCustomerProfile(activeSession.accessToken)
            if (cancelled) return
          }
        }
        if (!activeProfile) {
          clearCustomerSession()
          setSession(null)
          setAuthStep('phone')
          return
        }
        applyProfile(activeProfile)
        setAuthStep(activeProfile.profileComplete ? 'phone' : 'profile')
      } catch {
        if (!cancelled) resetCustomerAuth()
      } finally {
        if (!cancelled) setAuthLoading(false)
      }
    }

    restoreCustomerSession()
    return () => { cancelled = true }
  }, [applyProfile, initialSession, resetCustomerAuth])

  const chooseBookingFor = (value: BookingFor) => {
    updateBooking({ bookingFor: value, guest: value === booking.bookingFor ? booking.guest : blankGuest() })
  }
  const customerReady = Boolean(customerProfile?.profileComplete)
  const continueTrip = () => {
    setAttempted(true)
    onAttempt()
    const detailsComplete = booking.bookingFor === 'self' ? contactComplete : (contactComplete && guestFieldsComplete)
    if (!booking.bookingFor || !tripComplete || !customerReady || !detailsComplete) return
    next()
  }
  const submitPhone = async () => {
    setAuthAttempted(true)
    if (!authPhoneComplete || authLoading) return
    const isResend = authStep === 'otp'
    setAuthLoading(true)
    setAuthError('')
    try {
      const phone = authMobile
      const res = await fetch('/api/auth/customer/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: phone }),
      })
      if (!res.ok) throw new Error('send failed')
      updateBooking({ phone: authPhone })
      setAuthOtp(Array(4).fill(''))
      setAuthStep('otp')
      if (isResend) {
        if (resendToastTimer.current) clearTimeout(resendToastTimer.current)
        setResendToast({ visible: true, phone: authPhone })
        resendToastTimer.current = setTimeout(() => setResendToast(t => ({ ...t, visible: false })), 3000)
      }
    } catch {
      setAuthError(copy.otpSendError)
    } finally {
      setAuthLoading(false)
    }
  }
  const verifyOtp = async () => {
    setAuthAttempted(true)
    if (!otpComplete || authLoading) return
    setAuthLoading(true)
    setAuthError('')
    try {
      const phone = authMobile
      const otp = authOtp.join('')
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: phone, otp_code: otp, purpose: 'customer_auth' }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error('verify failed')
      const nextSession = parseCustomerSession(json)
      if (!nextSession) throw new Error('missing token')
      storeCustomerSession(nextSession)
      setSession(nextSession)
      const verifiedProfile = parseCustomerProfile(json)
      if (verifiedProfile?.profileComplete && verifiedProfile.fullName && verifiedProfile.phone && verifiedProfile.email) {
        applyProfile(verifiedProfile)
      } else {
        const fetchedProfile = await fetchCustomerProfile(nextSession.accessToken)
        if (fetchedProfile?.profileComplete) applyProfile(fetchedProfile)
        else {
          const incompleteProfile = fetchedProfile ?? verifiedProfile ?? { fullName: '', phone: authPhone, email: '', profileComplete: false }
          setCustomerProfile(incompleteProfile)
          setProfileDraft({ name: incompleteProfile.fullName || booking.name, email: incompleteProfile.email || booking.email })
          updateBooking({ phone: incompleteProfile.phone || authPhone })
          setAuthStep('profile')
        }
      }
    } catch {
      clearCustomerSession()
      setSession(null)
      setAuthError(copy.otpVerifyError)
    } finally {
      setAuthLoading(false)
    }
  }
  const completeProfile = async () => {
    setAuthAttempted(true)
    const nameValid = profileDraft.name.trim().length >= 2
    const emailValid = /^\S+@\S+\.\S+$/.test(profileDraft.email.trim())
    if (!session?.accessToken || !nameValid || !emailValid || authLoading) return
    setAuthLoading(true)
    setAuthError('')
    try {
      const body = { full_name: profileDraft.name.trim(), email: profileDraft.email.trim() }
      const res = await authFetch('/api/customers/profile/complete', session.accessToken, {
        method: 'POST',
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('complete failed')
      const profile = await fetchCustomerProfile(session.accessToken)
      if (!profile) throw new Error('profile failed')
      applyProfile({ ...profile, profileComplete: true })
      setAuthStep('phone')
    } catch {
      setAuthError(copy.profileCompleteError)
    } finally {
      setAuthLoading(false)
    }
  }
  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    setAuthOtp(current => current.map((currentDigit, currentIndex) => currentIndex === index ? digit : currentDigit))
    if (digit && index < 3) {
      otpInputRefs.current[index + 1]?.focus()
    }
  }
  const handleOtpKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !authOtp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus()
    }
  }
  const handleOtpPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
    if (!pasted) return
    event.preventDefault()
    const next = Array(4).fill('').map((_, i) => pasted[i] ?? '')
    setAuthOtp(next)
    const lastFilled = Math.min(pasted.length, 3)
    otpInputRefs.current[lastFilled]?.focus()
  }
  const renderCustomerAuth = () => {
    if (authLoading && !customerProfile && session?.accessToken) {
      return (
        <div className={styles.authPanel}>
          <p>{copy.loadingProfile}</p>
          <button type="button" className={styles.resend} onClick={resetCustomerAuth}>{copy.signInAgain}</button>
        </div>
      )
    }
    if (customerReady) return null
    return (
      <div className={styles.authPanel}>
        {authStep === 'phone' && (
          <>
            <h3>{copy.customerLoginTitle}</h3>
            <p>{copy.customerLoginBody}</p>
            <PhoneField label={copy.phoneNumber} value={authPhone} attempted={authAttempted} onChange={setAuthPhone} />
            {authAttempted && !authPhoneComplete && <small className={styles.selectionError}>{copy.ksaPhoneRequired}</small>}
            {authError && <small className={styles.selectionError}>{authError}</small>}
            <button type="button" className={styles.authAction} onClick={submitPhone} disabled={authLoading}>{authLoading ? copy.sendingOtp : copy.sendOtp}</button>
          </>
        )}
        {authStep === 'otp' && (
          <>
            <h3>{copy.otpTitle}</h3>
            <p>{copy.otpSent}</p>
            <div className={`${styles.otpBoxes} ${authAttempted && !otpComplete ? styles.otpInvalid : ''}`}>
              {authOtp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => { otpInputRefs.current[index] = el }}
                  inputMode="numeric"
                  aria-label={copy.otpDigit(index + 1)}
                  aria-invalid={authAttempted && !otpComplete}
                  maxLength={1}
                  value={digit}
                  onChange={event => handleOtpChange(index, event.target.value)}
                  onKeyDown={event => handleOtpKeyDown(index, event)}
                  onPaste={handleOtpPaste}
                />
              ))}
            </div>
            {authError && <small className={styles.selectionError}>{authError}</small>}
            <button type="button" className={styles.authAction} onClick={verifyOtp} disabled={authLoading}>{authLoading ? copy.verifyingOtp : copy.verifyOtp}</button>
            <button type="button" className={styles.resend} onClick={submitPhone} disabled={authLoading}>{copy.resendOtp}</button>
            {resendToast.visible && (
              <div className={styles.resendToast} dir={dir}>
                {copy.otpSentToast(resendToast.phone)}
              </div>
            )}
          </>
        )}
        {authStep === 'profile' && (
          <>
            <h3>{copy.completeProfileTitle}</h3>
            <p>{copy.completeProfileBody}</p>
            <TextField label={copy.fullName} placeholder={copy.namePlaceholder} value={profileDraft.name} minLength={2} attempted={authAttempted} onChange={value => setProfileDraft(current => ({ ...current, name: value }))} />
            <TextField label={copy.emailAddress} placeholder="you@example.com" value={profileDraft.email} inputType="email" attempted={authAttempted} onChange={value => setProfileDraft(current => ({ ...current, email: value }))} />
            {authError && <small className={styles.selectionError}>{authError}</small>}
            <button type="button" className={styles.authAction} onClick={completeProfile} disabled={authLoading}>{authLoading ? copy.savingProfile : copy.completeProfile}</button>
          </>
        )}
      </div>
    )
  }
  const renderYourDetails = () => (
    <div className={styles.guestPanel}>
      <h3>{copy.yourDetails}</h3>
      <p>{copy.enterYourDetails}</p>
      <TextField label={copy.fullName} placeholder={copy.namePlaceholder} value={booking.name} minLength={2} attempted={attempted} onChange={value => updateBooking({ name: value })} />
      <PhoneField label={copy.phoneNumber} value={booking.phone} attempted={attempted} onChange={value => updateBooking({ phone: value })} />
      <TextField label={copy.emailAddress} placeholder="you@example.com" value={booking.email} inputType="email" attempted={attempted} onChange={value => updateBooking({ email: value })} />
    </div>
  )

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
        customerReady ? renderYourDetails() : renderCustomerAuth()
      )}

      {booking.bookingFor === 'guest' && (
        <>
          {customerReady ? (
            <>
              {renderYourDetails()}
              <div className={styles.guestPanel}>
                <h3>{copy.guestDetails}</h3>
                <p>{copy.enterGuestDetails}</p>
                <TextField label={copy.fullName} placeholder={copy.guestName} value={booking.guest.name} minLength={2} attempted={attempted} onChange={value => updateBooking({ guest: { ...booking.guest, name: value } })} />
                <PhoneField label={copy.phoneNumber} value={booking.guest.phone} attempted={attempted} onChange={value => updateBooking({ guest: { ...booking.guest, phone: value } })} />
                <TextField label={copy.emailAddress} placeholder="guest@gmail.com" value={booking.guest.email} inputType="email" attempted={attempted} onChange={value => updateBooking({ guest: { ...booking.guest, email: value } })} />
              </div>
            </>
          ) : renderCustomerAuth()}
        </>
      )}

      <FooterActions back={booking.bookingFor ? () => chooseBookingFor(null) : back} next={continueTrip} showNext={!booking.bookingFor || customerReady} />
    </>
  )
}

// ─── Flight lookup API ────────────────────────────────────────────────────────
type AviationFlight = {
  flight_date: string
  flight_status: string
  departure: { airport: string; iata: string; scheduled: string; estimated?: string | null; actual?: string | null; terminal?: string | null; gate?: string | null; delay?: number | null }
  arrival: { airport: string; iata: string; scheduled: string; estimated?: string | null; actual?: string | null; terminal?: string | null; gate?: string | null; delay?: number | null }
  airline: { name: string; iata: string }
  flight: { number: string; iata: string }
}

type FlightLookupError = 'not_found' | 'validation_error' | 'unavailable' | 'network_error'

function formatDateForApi(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

async function lookupFlight(flightNumber: string, date: Date): Promise<AviationFlight> {
  let res: Response
  try {
    res = await fetch('http://34.166.167.2/api/v1/public/airports/flight-lookup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ flight_number: flightNumber, flight_date: formatDateForApi(date) }),
    })
  } catch {
    throw new Error('network_error' satisfies FlightLookupError)
  }
  if (res.status === 400) throw new Error('validation_error' satisfies FlightLookupError)
  if (res.status === 404) throw new Error('not_found' satisfies FlightLookupError)
  if (res.status === 503) throw new Error('unavailable' satisfies FlightLookupError)
  if (!res.ok) throw new Error('unavailable' satisfies FlightLookupError)
  const body = await res.json()
  const flight: AviationFlight = body.flights?.[0]
  if (!flight) throw new Error('not_found' satisfies FlightLookupError)
  return flight
}

function flightTimeLabel(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
  } catch { return '--:--' }
}



function FlightAutoFillDialog({ flight, onConfirm }: {
  flight: AviationFlight
  onConfirm: () => void
}) {
  const { copy, dir } = useBookingDialogCopy()
  return (
    <div className={styles.cancelOverlay} role="dialog" aria-modal="true" aria-labelledby="flight-autofill-title">
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
          <h3 id="flight-autofill-title" className={styles.cancelTitle}>{copy.flightAutoFillTitle}</h3>
          <p className={styles.cancelBody}>{copy.flightAutoFillBody}</p>
          <div style={{ background: '#f8f9fb', borderRadius: 10, padding: '10px 14px', marginBottom: 18, fontSize: 12, color: '#374151', lineHeight: 1.7 }}>
            <div><strong>{flight.airline.name}</strong> · {flight.flight.iata}</div>
            <div>{flight.departure.iata} → {flight.arrival.iata}</div>
            <div style={{ color: '#00717e', fontWeight: 600 }}>
              {copy.flightDate}: {flight.flight_date}
            </div>
          </div>
          <div className={styles.cancelActions}>
            <button type="button" className={styles.cancelKeep} style={{ flex: 'none', width: '100%' }} onClick={onConfirm}>{copy.flightAutoFillConfirm}</button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

const MINUTE_OPTIONS = [5, 10, 15, 20, 30, 45, 60, 90, 120]
const TIME_SLOTS: { h: number; m: number; label: string }[] = Array.from({ length: 49 }, (_, i) => {
  if (i === 48) return { h: 0, m: 0, label: '24:00' }
  return { h: Math.floor(i / 2), m: (i % 2) * 30, label: `${Math.floor(i / 2)}:${((i % 2) * 30).toString().padStart(2, '0')}` }
})

function PickupEstimatorDialog({ flight, onConfirm, onClose }: {
  flight: AviationFlight
  onConfirm: (time: TimeValue) => void
  onClose: () => void
}) {
  const { copy, dir } = useBookingDialogCopy()
  const [tab, setTab] = useState<'minutes' | 'time'>('minutes')
  const [selectedMinutes, setSelectedMinutes] = useState<number | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<{ h: number; m: number } | null>(null)

  const canConfirm = tab === 'minutes' ? selectedMinutes !== null : selectedSlot !== null

  const handleConfirm = () => {
    if (tab === 'minutes' && selectedMinutes !== null) {
      const { h, m } = addMinutes(flight.arrival.scheduled, selectedMinutes)
      onConfirm({ hour: h, minute: m, use24Hour: true })
    } else if (tab === 'time' && selectedSlot) {
      onConfirm({ hour: selectedSlot.h, minute: selectedSlot.m, use24Hour: true })
    }
  }

  return (
    <div className={styles.cancelOverlay} role="dialog" aria-modal="true" aria-labelledby="pickup-estimator-title">
      <motion.div
        className={styles.estimatorCard}
        dir={dir}
        initial={{ opacity: 0, scale: 0.94, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 10 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={styles.cancelStripe} />
        <div className={styles.estimatorBody}>
          <h3 id="pickup-estimator-title" className={styles.estimatorTitle}>{copy.pickupEstimatorTitle}</h3>
          <div className={styles.estimatorTabs}>
            <button type="button" className={tab === 'minutes' ? styles.estimatorTabActive : styles.estimatorTab} onClick={() => setTab('minutes')}>{copy.pickupEstimatorByMinutes}</button>
            <button type="button" className={tab === 'time' ? styles.estimatorTabActive : styles.estimatorTab} onClick={() => setTab('time')}>{copy.pickupEstimatorByTime}</button>
          </div>
          {tab === 'minutes' && (
            <div className={styles.minutePills}>
              {MINUTE_OPTIONS.map(min => (
                <button key={min} type="button" className={selectedMinutes === min ? styles.minutePillActive : styles.minutePill} onClick={() => setSelectedMinutes(min)}>
                  {copy.pickupEstimatorAfterArrival(min)}
                </button>
              ))}
            </div>
          )}
          {tab === 'time' && (
            <div className={styles.timeSlotScroll}>
              <div className={styles.timeSlotGrid}>
                {TIME_SLOTS.map(slot => {
                  const active = selectedSlot?.h === slot.h && selectedSlot?.m === slot.m && slot.label !== '24:00'
                    || (slot.label === '24:00' && selectedSlot?.h === 0 && selectedSlot?.m === 0 && selectedSlot !== null)
                  return (
                    <button key={slot.label} type="button" className={active ? styles.timeSlotActive : styles.timeSlot} onClick={() => setSelectedSlot({ h: slot.h, m: slot.m })}>
                      {slot.label}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
          <div className={styles.estimatorActions}>
            <button type="button" className={styles.cancelKeep} disabled={!canConfirm} onClick={handleConfirm}>{copy.pickupEstimatorConfirm}</button>
            <button type="button" className={styles.cancelYes} onClick={onClose}>{copy.pickupEstimatorBack}</button>
          </div>
        </div>
      </motion.div>
    </div>
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
  const [flightStatus, setFlightStatus] = useState<'idle' | 'loading' | 'success' | 'not_found' | 'unavailable' | 'validation_error' | 'network_error'>('idle')
  const [flightData, setFlightData] = useState<AviationFlight | null>(null)
  const [showAutoFill, setShowAutoFill] = useState(false)
  const [showPickupEstimator, setShowPickupEstimator] = useState(false)

  const tripComplete = Boolean(tripIsComplete(booking) && booking.flightNumber.trim().length >= 5)

  const changeDirection = (departure: boolean) => {
    if (departure === booking.isDeparture) return
    updateBooking({ isDeparture: departure, pickup: null, destination: null })
  }

  // Debounced flight lookup — requires both flight number (≥5 chars) and date
  useEffect(() => {
    const num = booking.flightNumber.trim().replace(/[\s-]/g, '')
    if (num.length < 5 || !booking.date) {
      setFlightStatus('idle')
      setFlightData(null)
      setShowAutoFill(false)
      return
    }
    setFlightStatus('loading')
    setFlightData(null)
    setShowAutoFill(false)
    const t = setTimeout(() => {
      lookupFlight(num, booking.date!)
        .then(data => {
          setFlightData(data)
          setFlightStatus('success')
          setShowAutoFill(true)
        })
        .catch((err: Error) => {
          const code = err.message as FlightLookupError
          setFlightStatus(code === 'not_found' ? 'not_found' : code === 'validation_error' ? 'validation_error' : code === 'network_error' ? 'network_error' : 'unavailable')
        })
    }, 700)
    return () => clearTimeout(t)
  }, [booking.flightNumber, booking.date])

  const handleAutoFillConfirm = () => {
    if (!flightData) return
    const iata = booking.isDeparture ? flightData.departure.iata : flightData.arrival.iata
    const matched = copy.airports.find(a => a.includes(`(${iata})`))
    const updates: Partial<BookingState> = {}
    if (matched) {
      if (booking.isDeparture) updates.destination = airportPlace(matched)
      else updates.pickup = airportPlace(matched)
    }
    updateBooking(updates)
    setShowAutoFill(false)
    if (!booking.isDeparture) setShowPickupEstimator(true)
  }

  const handleEstimatorConfirm = (time: TimeValue) => {
    updateBooking({ time })
    setShowPickupEstimator(false)
  }

  const depIata = flightData?.departure.iata ?? '--'
  const arrIata = flightData?.arrival.iata ?? '--'
  const depTime = flightData ? flightTimeLabel(flightData.departure.scheduled) : '--:--'
  const arrTime = flightData ? flightTimeLabel(flightData.arrival.scheduled) : '--:--'

  return (
    <>
      {showAutoFill && flightData && (
        <AnimatePresence>
          <FlightAutoFillDialog
            flight={flightData}
            onConfirm={handleAutoFillConfirm}
          />
        </AnimatePresence>
      )}
      {showPickupEstimator && flightData && (
        <AnimatePresence>
          <PickupEstimatorDialog
            flight={flightData}
            onConfirm={handleEstimatorConfirm}
            onClose={() => setShowPickupEstimator(false)}
          />
        </AnimatePresence>
      )}

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
        {/* Flight number first — it's mandatory and drives the rest */}
        <div style={{ gridColumn: '1 / -1' }}>
          <TextField label={copy.flightNumber} placeholder={copy.flightExample} value={booking.flightNumber} minLength={5} attempted={attempted} onChange={flightNumber => updateBooking({ flightNumber })} startIcon={<Image src={flightNumberSvg} alt="" width={20} height={18} />} />
        </div>

        <DatePickerField label={copy.flightDate} value={booking.date} attempted={attempted} onChange={date => updateBooking({ date })} />
        <TimePickerField label={copy.pickupTime} value={booking.time} attempted={attempted} onChange={time => updateBooking({ time })} />

        {/* Flight status feedback */}
        {booking.flightNumber.trim().replace(/[\s-]/g, '').length >= 5 && !booking.date && flightStatus === 'idle' && (
          <small className={styles.flightStatusHint} style={{ gridColumn: '1 / -1' }}>{copy.flightLookupDateNeeded}</small>
        )}
        {flightStatus === 'loading' && (
          <small className={styles.flightStatusHint} style={{ gridColumn: '1 / -1' }}>{copy.flightLookupLoading}</small>
        )}
        {flightStatus === 'not_found' && (
          <small className={styles.flightStatusError} style={{ gridColumn: '1 / -1' }}>{copy.flightLookupNotFound(booking.flightNumber.trim())}</small>
        )}
        {flightStatus === 'validation_error' && (
          <small className={styles.flightStatusError} style={{ gridColumn: '1 / -1' }}>{copy.flightLookupValidationError}</small>
        )}
        {flightStatus === 'unavailable' && (
          <small className={styles.flightStatusError} style={{ gridColumn: '1 / -1' }}>{copy.flightLookupUnavailable}</small>
        )}
        {flightStatus === 'network_error' && (
          <small className={styles.flightStatusError} style={{ gridColumn: '1 / -1' }}>{copy.flightLookupNetworkError}</small>
        )}

        {/* Route preview (shown when flight found) */}
        <div className={styles.flightRoute} aria-label={copy.flightRoutePreview} dir="ltr">
          <span className={styles.routeHalf}>{depIata}<br />{depTime}</span>
          <Image className={styles.plane} src={horizontalPlane} alt="" />
          <span className={styles.routeHalf}>{arrIata}<br />{arrTime}</span>
        </div>

        {/* Airport / location fields — appear after flight section */}
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
  const [attempted, setAttempted] = useState(false)

  return (
    <>
      <p className={styles.eyebrow}>{copy.services.hourly}</p>
      <h2 className={styles.title}>{copy.tripDetails}</h2>
      <p className={styles.subtitle}>{copy.tripSubtitle}</p>

      <LocationScheduleFields booking={booking} updateBooking={updateBooking} attempted={attempted} />

      <div className={styles.durationField}>
        <label>{copy.selectDuration}</label>
        <div className={styles.durationControl}>
          <span>{booking.duration} {copy.hours}</span>
        </div>
      </div>

      <div
        className={styles.durationInfo}
        role="button"
        tabIndex={0}
        onClick={() => updateBooking({ service: 'day' })}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); updateBooking({ service: 'day' }) } }}
      >
        <CircleInfo size={19} />
        <span><strong>{copy.needMore}</strong><small>{copy.chooseDayOption}</small></span>
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

      <LocationScheduleFields booking={booking} updateBooking={updateBooking} attempted={attempted} citiesOnly />

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
  const { copy, lang } = useBookingDialogCopy()
  const [fleetClasses, setFleetClasses] = useState<VehicleClass[] | null>(null)
  const [vehiclesByClass, setVehiclesByClass] = useState<{ classId: string; data: ClassVehicle[] } | null>(null)
  const [categoryScrollIndex, setCategoryScrollIndex] = useState(0)
  const [vehicleScrollIndex, setVehicleScrollIndex] = useState(0)
  const [vehicleVisibleSlots, setVehicleVisibleSlots] = useState(() => typeof window === 'undefined' || window.innerWidth > 640 ? 2 : 1)
  const categoryGridRef = useRef<HTMLDivElement>(null)
  const vehicleGridRef = useRef<HTMLDivElement>(null)
  const categoryScrollIndexRef = useRef(0)
  const vehicleScrollIndexRef = useRef(0)

  useEffect(() => {
    let cancelled = false
    getFleetClasses().then(data => { if (!cancelled) setFleetClasses(data) })
    return () => { cancelled = true }
  }, [])

  const categories = buildCategoryTiles(fleetClasses)
  const categoryIndex = booking.categoryIndex !== null && categories.length > 0 ? Math.min(booking.categoryIndex, categories.length - 1) : null
  const category = categoryIndex !== null ? (categories[categoryIndex]?.name ?? '') : ''
  const activeCategoryId = categoryIndex !== null ? categories[categoryIndex]?.id : undefined

  useEffect(() => {
    if (!activeCategoryId) return
    let cancelled = false
    getFleetVehicles(activeCategoryId, toApiServiceType(booking.service, booking.dayDuration)).then(data => {
      if (!cancelled) {
        setVehiclesByClass({ classId: activeCategoryId, data })
        if (booking.vehicle === null && data.length > 0) {
          updateBooking({ vehicle: 0, vehicleId: data[0].id })
        }
      }
    })
    return () => { cancelled = true }
  }, [activeCategoryId, booking.service, booking.dayDuration])

  const service = booking.service
  const activeVehicles = vehiclesByClass && vehiclesByClass.classId === activeCategoryId ? vehiclesByClass.data : null
  const activeClass = fleetClasses?.find(cls => cls.id === activeCategoryId) ?? null
  const vehicleCards = activeVehicles ? buildVehicleCards(activeVehicles, activeClass, service, booking.dayDuration) : null
  const vehicleCount = vehicleCards?.length ?? 0
  const vehicleMaxScrollIndex = Math.max(0, vehicleCount - vehicleVisibleSlots)
  const vehicleIndex = booking.vehicle !== null && vehicleCards?.length ? Math.min(booking.vehicle, vehicleCards.length - 1) : null
  const rideSelectionComplete = Boolean(activeCategoryId && vehicleIndex !== null)
  const isHourly = service === 'hourly'
  const isCity = service === 'city'
  const isDay = service === 'day'
  const isOneWay = service === 'oneWay'
  const normalizeLoopIndex = (index: number, count: number) => (index % count + count) % count
  const scrollGridToIndex = useCallback((grid: HTMLDivElement | null, index: number, behavior: ScrollBehavior = 'smooth', align: 'center' | 'start' = 'center') => {
    const item = grid?.children.item(index)
    if (!(grid && item instanceof HTMLElement)) return
    const left = align === 'start' ? item.offsetLeft : item.offsetLeft - (grid.clientWidth - item.offsetWidth) / 2
    grid.scrollTo({ left, behavior })
  }, [])
  const nearestLoopItemIndex = useCallback((grid: HTMLDivElement) => {
    const children = Array.from(grid.children).filter((child): child is HTMLElement => child instanceof HTMLElement)
    if (children.length === 0) return 0
    const viewportCenter = grid.scrollLeft + grid.clientWidth / 2
    return children.reduce((bestIndex, child, index) => {
      const childCenter = child.offsetLeft + child.offsetWidth / 2
      const best = children[bestIndex]
      const bestCenter = best.offsetLeft + best.offsetWidth / 2
      return Math.abs(childCenter - viewportCenter) < Math.abs(bestCenter - viewportCenter) ? index : bestIndex
    }, 0)
  }, [])
  const nearestStartItemIndex = useCallback((grid: HTMLDivElement) => {
    const children = Array.from(grid.children).filter((child): child is HTMLElement => child instanceof HTMLElement)
    if (children.length === 0) return 0
    return children.reduce((bestIndex, child, index) => {
      const best = children[bestIndex]
      return Math.abs(child.offsetLeft - grid.scrollLeft) < Math.abs(best.offsetLeft - grid.scrollLeft) ? index : bestIndex
    }, 0)
  }, [])
  const updateScrollIndex = useCallback((grid: HTMLDivElement, count: number, setIndex: (index: number) => void, maxIndex = count - 1, align: 'center' | 'start' = 'center') => {
    if (count <= 0) return
    const nearestIndex = align === 'start' ? nearestStartItemIndex(grid) : nearestLoopItemIndex(grid)
    setIndex(Math.min(normalizeLoopIndex(nearestIndex, count), Math.max(0, maxIndex)))
  }, [nearestLoopItemIndex, nearestStartItemIndex])
  const selectCategory = (index: number) => {
    updateBooking({ categoryIndex: index, vehicle: null, vehicleId: null })
    categoryScrollIndexRef.current = index
    vehicleScrollIndexRef.current = 0
    setCategoryScrollIndex(index)
    setVehicleScrollIndex(0)
    scrollGridToIndex(categoryGridRef.current, index)
  }
  const selectVehicle = (index: number) => {
    updateBooking({ vehicle: index, vehicleId: vehicleCards?.[index]?.key ?? null })
    const scrollIndex = Math.min(index, vehicleMaxScrollIndex)
    vehicleScrollIndexRef.current = scrollIndex
    setVehicleScrollIndex(scrollIndex)
    scrollGridToIndex(vehicleGridRef.current, scrollIndex, 'smooth', 'start')
  }
  const showCategorySlide = (index: number) => {
    categoryScrollIndexRef.current = index
    setCategoryScrollIndex(index)
    scrollGridToIndex(categoryGridRef.current, index)
  }
  const showVehicleSlide = (index: number) => {
    const scrollIndex = Math.min(Math.max(index, 0), vehicleMaxScrollIndex)
    vehicleScrollIndexRef.current = scrollIndex
    setVehicleScrollIndex(scrollIndex)
    scrollGridToIndex(vehicleGridRef.current, scrollIndex, 'smooth', 'start')
  }
  const formatFleetRate = (value: number) => value.toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US', {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  })
  const formatFareMeta = (meta: FareMeta | null) => {
    if (!meta) return null
    if (meta.type === 'perKm') return copy.farePerKm(formatFleetRate(meta.amount))
    if (meta.type === 'perHour') return copy.farePerHour
    return meta.type === 'fullDay' ? copy.fareFullDay : copy.fareHalfDay
  }

  useEffect(() => {
    const updateVisibleSlots = () => setVehicleVisibleSlots(window.innerWidth <= 640 ? 1 : 2)
    updateVisibleSlots()
    window.addEventListener('resize', updateVisibleSlots)
    return () => window.removeEventListener('resize', updateVisibleSlots)
  }, [])

  useEffect(() => {
    const grid = categoryGridRef.current
    if (!grid || categories.length <= 1) return
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => updateScrollIndex(grid, categories.length, index => {
        categoryScrollIndexRef.current = index
        setCategoryScrollIndex(index)
      }))
    }
    frame = requestAnimationFrame(() => {
      scrollGridToIndex(grid, categoryScrollIndexRef.current, 'auto')
      updateScrollIndex(grid, categories.length, index => {
        categoryScrollIndexRef.current = index
        setCategoryScrollIndex(index)
      })
    })
    grid.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      grid.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [categories.length, categoryScrollIndexRef, scrollGridToIndex, categoryGridRef, updateScrollIndex])

  useEffect(() => {
    vehicleScrollIndexRef.current = 0
    const grid = vehicleGridRef.current
    if (!grid || vehicleCount <= 1) return
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => updateScrollIndex(grid, vehicleCount, index => {
        vehicleScrollIndexRef.current = index
        setVehicleScrollIndex(index)
      }, vehicleMaxScrollIndex, 'start'))
    }
    frame = requestAnimationFrame(() => {
      scrollGridToIndex(grid, vehicleScrollIndexRef.current, 'auto', 'start')
      updateScrollIndex(grid, vehicleCount, index => {
        vehicleScrollIndexRef.current = index
        setVehicleScrollIndex(index)
      }, vehicleMaxScrollIndex, 'start')
    })
    grid.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      grid.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [activeCategoryId, vehicleCount, vehicleMaxScrollIndex, vehicleScrollIndexRef, scrollGridToIndex, updateScrollIndex])

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const grid = e.currentTarget as HTMLDivElement
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return
      const canScrollLeft = grid.scrollLeft > 0
      const canScrollRight = grid.scrollLeft < grid.scrollWidth - grid.clientWidth - 1
      if ((e.deltaY < 0 && canScrollLeft) || (e.deltaY > 0 && canScrollRight)) {
        e.preventDefault()
        grid.scrollLeft += e.deltaY
      }
    }
    const categoryGrid = categoryGridRef.current
    const vehicleGrid = vehicleGridRef.current
    if (categoryGrid) categoryGrid.addEventListener('wheel', onWheel, { passive: false })
    if (vehicleGrid) vehicleGrid.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      if (categoryGrid) categoryGrid.removeEventListener('wheel', onWheel)
      if (vehicleGrid) vehicleGrid.removeEventListener('wheel', onWheel)
    }
  }, [categories.length, vehicleCards])

  return (
    <>
      <p className={styles.eyebrow}>{isHourly ? copy.services.hourly : isCity ? copy.services.city : isDay ? copy.services.day : isOneWay ? copy.services.oneWay : copy.services.airport}</p>
      <h2 className={styles.title}>{copy.selectRide}</h2>
      <p className={styles.categoryIntro}>{copy.chooseCategory}</p>
      {fleetClasses === null ? (
        <div className={styles.categorySkeletonGrid} aria-hidden="true">
          {[68, 55, 72].map((w, i) => (
            <div key={i} className={styles.categorySkeletonCard}>
              <span className={styles.categorySkeletonLine} style={{ width: `${w}%`, height: 10 }} />
              <span className={styles.categorySkeletonLine} style={{ width: 44, height: 7 }} />
            </div>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <p className={styles.vehicleEmpty}>{lang === 'ar' ? 'لا توجد فئات مركبات متاحة.' : 'No vehicle classes available.'}</p>
      ) : (
        <>
          <div className={styles.carouselWrap}>
            <div ref={categoryGridRef} className={styles.categoryGrid}>
              {categories.map((item, index) => (
                <button type="button" key={item.id ?? item.name} className={`${styles.categoryCard} ${categoryIndex === index ? styles.categoryActive : ''}`} onClick={() => selectCategory(index)}>
                  <span className={styles.categoryCopy}>
                    <strong>{item.name}</strong>
                    <small>{item.copy}</small>
                  </span>
                </button>
              ))}
            </div>
          </div>
          {categories.length > 1 && (
            <div className={styles.sliderDots}>
              {categories.map((item, index) => (
                <button
                  key={item.id ?? item.name}
                  type="button"
                  className={`${styles.sliderDot} ${categoryScrollIndex === index ? styles.sliderDotActive : ''}`}
                  aria-label={copy.categoryDotLabel(index + 1)}
                  aria-current={categoryScrollIndex === index ? 'true' : undefined}
                  onClick={() => showCategorySlide(index)}
                />
              ))}
            </div>
          )}
        </>
      )}
      <div className={styles.vehiclePanel}>
        {category && <p>{copy.availableVehicles(category)}</p>}
        {!category ? (
          <p className={styles.vehicleEmpty}>{lang === 'ar' ? 'اختر فئة مركبة لعرض السيارات.' : 'Choose a vehicle class to view vehicles.'}</p>
        ) : vehicleCards === null ? (
          <div className={styles.vehicleGrid} aria-hidden="true">
            {[0, 1, 2].map(i => (
              <div key={i} className={styles.vehicleSkeletonCard}>
                <div className={`${styles.vehicleSkeletonMedia} ${styles.skeletonShimmer}`} />
                <div className={styles.vehicleSkeletonCopy}>
                  <div className={`${styles.vehicleSkeletonLine} ${styles.skeletonShimmer}`} style={{ width: '70%', height: 10 }} />
                  <div className={`${styles.vehicleSkeletonLine} ${styles.skeletonShimmer}`} style={{ width: '50%', height: 8 }} />
                </div>
              </div>
            ))}
          </div>
        ) : vehicleCards.length === 0 ? (
          <p className={styles.vehicleEmpty}>{lang === 'ar' ? 'لا توجد سيارات متاحة لهذه الفئة.' : 'No vehicles available for this class.'}</p>
        ) : (
          <>
            <div className={styles.carouselWrap}>
              {vehicleMaxScrollIndex > 0 && (
                <button type="button" className={`${styles.sliderArrow} ${styles.sliderArrowLeft}`} aria-label="Previous vehicle" disabled={vehicleScrollIndex === 0} onClick={() => showVehicleSlide(vehicleScrollIndex - 1)}>
                  <ChevronLeft size={13} strokeWidth={2.5} />
                </button>
              )}
              <div ref={vehicleGridRef} className={styles.vehicleGrid}>
                {vehicleCards.map((card, index) => {
                  const fareMeta = formatFareMeta(card.fareMeta)
                  return (
                  <button type="button" key={card.key} className={`${styles.vehicleCard} ${vehicleIndex === index ? styles.vehicleSelected : ''}`} onClick={() => selectVehicle(index)}>
                    {card.image ? (
                      <img src={card.image} alt={card.title} className={styles.vehicleImg} />
                    ) : (
                      <span className={styles.vehicleNoImage}><CircleInfo size={20} /></span>
                    )}
                    <span className={styles.vehicleCopy}>
                      <span className={styles.vehicleDetails}>
                        <strong>{card.title}</strong>
                        <small className={styles.vehicleSpecs} aria-label={copy.passengersAndBags}>
                          <span className={styles.vehicleSpec}><span className={styles.vehicleSpecIcon}><UsersRound size={10} /></span><span>{card.passengers}</span></span>
                          <span className={styles.vehicleSpec}><span className={styles.vehicleSpecIcon}><Luggage size={10} /></span><span>{card.bags}</span></span>
                        </small>
                      </span>
                      {card.fareAmount !== null && (
                        <span className={styles.vehicleFare}>
                          <span className={styles.vehicleFareLabel}>{copy.fareFrom}</span>
                          <span className={styles.vehicleFareAmount} dir="ltr">
                            {formatFleetRate(card.fareAmount)}
                            <Image src="/riyal_Currency.svg" alt="SAR" width={11} height={11} className={styles.vehicleFareCurrency} />
                          </span>
                          {fareMeta && (
                            <span className={styles.vehicleFareMeta} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                              {fareMeta}
                            </span>
                          )}
                        </span>
                      )}
                    </span>
                  </button>
                  )
                })}
              </div>
              {vehicleMaxScrollIndex > 0 && (
                <button type="button" className={`${styles.sliderArrow} ${styles.sliderArrowRight}`} aria-label="Next vehicle" disabled={vehicleScrollIndex >= vehicleMaxScrollIndex} onClick={() => showVehicleSlide(vehicleScrollIndex + 1)}>
                  <ChevronRight size={13} strokeWidth={2.5} />
                </button>
              )}
            </div>
            {vehicleMaxScrollIndex > 0 && (
              <div className={styles.sliderDots}>
                {Array.from({ length: vehicleMaxScrollIndex + 1 }, (_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`${styles.sliderDot} ${vehicleScrollIndex === index ? styles.sliderDotActive : ''}`}
                    aria-label={copy.vehicleDotLabel(index + 1)}
                    aria-current={vehicleScrollIndex === index ? 'true' : undefined}
                    onClick={() => showVehicleSlide(index)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <FooterActions back={back} next={next} showNext={rideSelectionComplete} />
    </>
  )
}

function BookingReviewSummary({ booking, category, vehicleLabel }: { booking: BookingState; category: string; vehicleLabel: string }) {
  const { copy, dir, lang } = useBookingDialogCopy()
  const service = booking.service
  const isHourly = service === 'hourly'
  const isCity = service === 'city'
  const isDay = service === 'day'
  const isOneWay = service === 'oneWay'
  const categorySummary = category || '--'
  const vehicleSummary = vehicleLabel || '--'
  const l = copy.summaryLabels
  const summaryRows = isHourly
    ? [[l.pickupDate, formatBookingDate(booking.date, copy.calendar.locale)], [l.pickupTime, formatBookingTime(booking.time, lang)], [l.duration, `${booking.duration} ${copy.hours}`], [l.category, categorySummary], [l.vehicle, vehicleSummary]]
    : isCity
      ? [[l.pickupDate, formatBookingDate(booking.date, copy.calendar.locale)], [l.pickupTime, formatBookingTime(booking.time, lang)], [l.journey, copy.summaryValues.city], [l.category, categorySummary], [l.vehicle, vehicleSummary]]
      : isDay
        ? [[l.pickupDate, formatBookingDate(booking.date, copy.calendar.locale)], [l.pickupTime, formatBookingTime(booking.time, lang)], [l.duration, booking.dayDuration === 'full' ? copy.fullDay : copy.halfDay], [l.category, categorySummary], [l.vehicle, vehicleSummary]]
        : isOneWay
          ? [[l.pickupDate, formatBookingDate(booking.date, copy.calendar.locale)], [l.pickupTime, formatBookingTime(booking.time, lang)], [l.journey, copy.summaryValues.oneWay], [l.category, categorySummary], [l.vehicle, vehicleSummary]]
          : [[l.flight, booking.flightNumber || '--'], [l.flightDate, formatBookingDate(booking.date, copy.calendar.locale)], [l.pickupTime, formatBookingTime(booking.time, lang)], [l.category, categorySummary], [l.vehicle, vehicleSummary]]
  const SummaryArrow = dir === 'rtl' ? ArrowLeft : ArrowRight

  return (
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
  )
}

function useSelectedFleetLabels(booking: BookingState) {
  const [fleetClasses, setFleetClasses] = useState<VehicleClass[] | null>(null)
  const [vehiclesByClass, setVehiclesByClass] = useState<{ classId: string; data: ClassVehicle[] } | null>(null)

  useEffect(() => {
    let cancelled = false
    getFleetClasses().then(data => { if (!cancelled) setFleetClasses(data) })
    return () => { cancelled = true }
  }, [])

  const categories = buildCategoryTiles(fleetClasses)
  const categoryIndex = booking.categoryIndex !== null && categories.length > 0 ? Math.min(booking.categoryIndex, categories.length - 1) : null
  const category = categoryIndex !== null ? (categories[categoryIndex]?.name ?? '') : ''
  const activeCategoryId = categoryIndex !== null ? categories[categoryIndex]?.id : undefined

  useEffect(() => {
    if (!activeCategoryId) return
    let cancelled = false
    getFleetVehicles(activeCategoryId, toApiServiceType(booking.service, booking.dayDuration)).then(data => { if (!cancelled) setVehiclesByClass({ classId: activeCategoryId, data }) })
    return () => { cancelled = true }
  }, [activeCategoryId, booking.service, booking.dayDuration])

  const activeVehicles = vehiclesByClass && vehiclesByClass.classId === activeCategoryId ? vehiclesByClass.data : null
  const activeClass = fleetClasses?.find(cls => cls.id === activeCategoryId) ?? null
  const vehicleCards = activeVehicles ? buildVehicleCards(activeVehicles, activeClass, booking.service, booking.dayDuration) : null
  const vehicleLabel = booking.vehicle !== null && vehicleCards ? (vehicleCards[Math.min(booking.vehicle, vehicleCards.length - 1)]?.title ?? '') : ''

  return { category, vehicleLabel }
}

function ReviewStep({ back, next, booking }: { back: () => void; next: () => void; booking: BookingState }) {
  const { copy } = useBookingDialogCopy()
  const { category, vehicleLabel } = useSelectedFleetLabels(booking)
  const service = booking.service
  const isHourly = service === 'hourly'
  const isCity = service === 'city'
  const isDay = service === 'day'
  const isOneWay = service === 'oneWay'

  return (
    <>
      <p className={styles.eyebrow}>{isHourly ? copy.services.hourly : isCity ? copy.services.city : isDay ? copy.services.day : isOneWay ? copy.services.oneWay : copy.services.airport}</p>
      <h2 className={styles.title}>{copy.reviewBooking}</h2>
      <p className={styles.subtitle}>{copy.reviewSubtitle}</p>
      <BookingReviewSummary booking={booking} category={category} vehicleLabel={vehicleLabel} />
      <FooterActions back={back} next={next} />
    </>
  )
}

function FareAmount({ value }: { value: number | undefined }) {
  const amount = typeof value === 'number' && isFinite(value) ? value.toFixed(2) : '0.00'
  return (
    <span className={styles.fareAmount} dir="ltr">
      {amount} <Image src="/riyal_Currency.svg" alt="SAR" width={13} height={13} className={styles.riyalIcon} />
    </span>
  )
}

function FareStep({ back, onSuccess, onRedirecting, booking }: { back: () => void; onSuccess: (bookingId: string) => void; onRedirecting?: () => void; booking: BookingState; updateBooking: (updates: Partial<BookingState>) => void }) {
  const { copy, dir } = useBookingDialogCopy()
  const { category, vehicleLabel } = useSelectedFleetLabels(booking)
  const service = booking.service
  const isHourly = service === 'hourly'
  const isCity = service === 'city'
  const isDay = service === 'day'
  const isOneWay = service === 'oneWay'
  const [fleetClasses, setFleetClasses] = useState<VehicleClass[] | null>(null)
  const [fare, setFare] = useState<FareData | null>(null)
  const [fareLoading, setFareLoading] = useState(true)
  const [fareError, setFareError] = useState(false)
  const [fareApiErrorMessage, setFareApiErrorMessage] = useState<string | null>(null)
  const [pickupCoords, setPickupCoords] = useState<LatLng | null>(null)
  const [dropoffCoords, setDropoffCoords] = useState<LatLng | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(false)

  useEffect(() => {
    let cancelled = false
    getFleetClasses().then(data => { if (!cancelled) setFleetClasses(data) })
    return () => { cancelled = true }
  }, [])

  const categories = buildCategoryTiles(fleetClasses)
  const categoryIndex = booking.categoryIndex !== null && categories.length > 0 ? Math.min(booking.categoryIndex, categories.length - 1) : null
  const activeCategoryId = categoryIndex !== null ? categories[categoryIndex]?.id : undefined

  useEffect(() => {
    if (!activeCategoryId) return
    let cancelled = false
    setFareLoading(true)
    setFareError(false)
    setFareApiErrorMessage(null)
    Promise.all([
      booking.pickup ? resolveCoords(booking.pickup) : Promise.resolve(null),
      booking.destination ? resolveCoords(booking.destination) : Promise.resolve(null),
    ]).then(async ([pCoords, dCoords]) => {
      if (cancelled) return
      if (!pCoords) { setFareError(true); setFareLoading(false); return }
      setPickupCoords(pCoords)
      setDropoffCoords(dCoords)
      const body: Record<string, unknown> = {
        vehicle_class_id: activeCategoryId,
        service_type: toApiServiceType(service, booking.dayDuration),
        pickup_lat: pCoords.lat,
        pickup_lng: pCoords.lng,
      }
      if (dCoords) { body.dropoff_lat = dCoords.lat; body.dropoff_lng = dCoords.lng }
      if (isHourly) body.duration_hours = booking.duration
      try {
        const fareSession = readCustomerSession()
        const fareHeaders: Record<string, string> = { 'Content-Type': 'application/json' }
        if (fareSession?.accessToken) fareHeaders['Authorization'] = `Bearer ${fareSession.accessToken}`
        const res = await fetch('/api/fare/calculate', { method: 'POST', headers: fareHeaders, body: JSON.stringify(body) })
        if (cancelled) return
        if (!res.ok) {
          try {
            const errJson = await res.json()
            const msg: string = errJson?.message ?? ''
            const fareApiErrors = copy.fareApiErrors ?? {}
            let matched: string | null = null
            if (msg.toLowerCase().includes('city_to_city') || msg.toLowerCase().includes('riyadh')) {
              matched = fareApiErrors['city_to_city_riyadh'] ?? null
            }
            if (matched) setFareApiErrorMessage(matched)
          } catch { /* ignore */ }
          setFareError(true); setFareLoading(false); return
        }
        const json = await res.json()
        const fareData: FareData = json?.data ?? json
        if (!cancelled) { setFare(fareData); setFareLoading(false) }
      } catch {
        if (!cancelled) { setFareError(true); setFareLoading(false) }
      }
    })
    return () => { cancelled = true }
  }, [activeCategoryId, service, booking.pickup, booking.destination, booking.dayDuration, booking.duration, isHourly])

  const handleSubmit = async () => {
    if (!pickupCoords || !activeCategoryId || fareLoading || fareError || !fare || submitting) return
    setSubmitting(true)
    setSubmitError(false)

    const pad = (n: number) => String(n).padStart(2, '0')
    const scheduledDatetime = (() => {
      if (!booking.date || !booking.time) return undefined
      const d = new Date(booking.date)
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(booking.time.hour)}:${pad(booking.time.minute)}:00.000Z`
    })()

    const body: Record<string, unknown> = {
      vehicle_class_id: activeCategoryId,
      service_type: toApiServiceType(service, booking.dayDuration),
      scheduled_datetime: scheduledDatetime,
      pickup_lat: pickupCoords.lat,
      pickup_lng: pickupCoords.lng,
      pickup_address: booking.pickup?.address ?? '',
      name: booking.name,
      email: booking.email,
      phone: booking.phone.replace(/\s/g, ''),
      success_url: `${window.location.origin}/booking-confirmed`,
      fail_url: `${window.location.origin}/booking-failed`,
    }
    if (booking.vehicleId) body.vehicle_id = booking.vehicleId
    if (dropoffCoords) { body.dropoff_lat = dropoffCoords.lat; body.dropoff_lng = dropoffCoords.lng }
    if (booking.destination?.address) body.dropoff_address = booking.destination.address
    if (isHourly) body.duration_hours = booking.duration
    if (service === 'day' && booking.dayDuration === 'full') body.full_day_hours = 10
    if (service === 'airport' && booking.flightNumber.trim()) body.flight_number = booking.flightNumber.trim()
    if (booking.bookingFor === 'guest') {
      body.guest = {
        name: booking.guest.name,
        email: booking.guest.email,
        phone: booking.guest.phone.replace(/\s/g, ''),
      }
    }
    try {
      const res = await fetch('/api/bookings/manual', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const json = await res.json()
      if (!res.ok) { setSubmitError(true); setSubmitting(false); return }
      const bookingNumber: string = json?.booking_number ?? json?.data?.booking_number ?? ''
      const checkoutUrl: string = json?.payment?.checkout_url ?? json?.data?.payment?.checkout_url ?? ''
      if (checkoutUrl) {
        if (bookingNumber) { try { localStorage.setItem('whiteline.pendingBookingRef', bookingNumber) } catch {} }
        onRedirecting?.()
        window.location.href = checkoutUrl
      } else {
        onSuccess(bookingNumber || json?.booking_id || json?.data?.booking_id || '')
      }
    } catch {
      setSubmitError(true)
      setSubmitting(false)
    }
  }

  const BackIcon = dir === 'rtl' ? ArrowRight : ArrowLeft
  const NextIcon = dir === 'rtl' ? ArrowLeft : ArrowRight

  return (
    <>
      <p className={styles.eyebrow}>{isHourly ? copy.services.hourly : isCity ? copy.services.city : isDay ? copy.services.day : isOneWay ? copy.services.oneWay : copy.services.airport}</p>
      <h2 className={styles.title}>{copy.fareSummary}</h2>
      <p className={styles.subtitle}>{copy.fareSubtitle[service]}</p>

      <BookingReviewSummary booking={booking} category={category} vehicleLabel={vehicleLabel} />

      {fareLoading && (
        <div className={styles.fareSkeletonCard} aria-hidden="true">
          {[['55%', '18%'], ['60%', '15%'], ['48%', '20%'], ['52%', '22%'], ['44%', '26%']].map(([l, r], i) => (
            <div key={i} className={styles.fareSkeletonRow}>
              <div className={`${styles.fareSkeletonPill} ${styles.skeletonShimmer}`} style={{ width: l, height: 11, borderRadius: 5 }} />
              <div className={`${styles.fareSkeletonPill} ${styles.skeletonShimmer}`} style={{ width: r, height: 11, borderRadius: 5 }} />
            </div>
          ))}
        </div>
      )}

      {!fareLoading && fareError && (
        <div className={styles.fareCard}>
          <div className={`${styles.fareRow} ${styles.fareErrorRow}`}><span>{fareApiErrorMessage ?? copy.fareError}</span></div>
        </div>
      )}

      {!fareLoading && !fareError && fare && (
        <div className={styles.fareCard}>
          <div className={styles.fareRow}><span>{copy.baseFare}</span><FareAmount value={fare.base_fare} /></div>
          {(fare.service_fee ?? 0) > 0 && <div className={styles.fareRow}><span>{copy.serviceFee}</span><FareAmount value={fare.service_fee} /></div>}
          <div className={styles.fareRow}><span>{copy.vat}</span><FareAmount value={fare.vat_amount} /></div>
          <div className={`${styles.fareRow} ${styles.fareTotal}`}><span>{copy.totalFare}</span><FareAmount value={fare.total_fare} /></div>
        </div>
      )}

      {submitError && (
        <div className={styles.fareCard} style={{ marginTop: 10 }}>
          <div className={`${styles.fareRow} ${styles.fareErrorRow}`}><span>{copy.bookingSubmitError}</span></div>
        </div>
      )}
      <div className={styles.footerActions}>
        <button type="button" className={styles.back} onClick={back}><BackIcon size={20} /> {copy.back}</button>
        <button
          type="button"
          className={styles.continue}
          onClick={handleSubmit}
          disabled={submitting || fareLoading || fareError}
        >
          {submitting ? copy.submitting : copy.confirmBooking} {!submitting && <NextIcon size={16} />}
        </button>
      </div>
    </>
  )
}

function SuccessStep({ back, onDone, booking, bookingId }: { back: () => void; onDone: () => void; booking: BookingState; bookingId: string | null }) {
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
      <p className={styles.subtitle}>{copy.successSubtitle}</p>

      <div className={styles.successCenter}>
        <span className={styles.successCheck}><Check size={26} strokeWidth={3} /></span>
        <h3 className={styles.successHeadline}>{copy.receivedTitle}</h3>
        <p className={styles.successNote}>{copy.receivedBody}</p>
        <div className={styles.referenceBlock}>
          <span className={styles.referenceLabel}>{copy.bookingReference}</span>
          <strong className={styles.referenceId}>{bookingId ?? `${service.toUpperCase()}-${formatBookingDate(booking.date, 'en-GB').replace(/\s/g, '').replace(/,/g, '')}`}</strong>
        </div>
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
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [redirecting, setRedirecting] = useState(false)
  const redirectingRef = useRef(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const updateBooking = useCallback((updates: Partial<BookingState>) => {
    setBooking(current => ({ ...current, ...updates }))
  }, [])

  const resetAndClose = useCallback(() => {
    setStep(0)
    setBooking(createInitialBookingState(service))
    setConfirmClose(false)
    setBookingId(null)
    onClose()
  }, [onClose, service])

  const requestClose = useCallback(() => {
    if (step === 4) {
      resetAndClose()
    } else {
      setConfirmClose(true)
    }
  }, [step, resetAndClose])

  useEffect(() => {
    if (open) dialogRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    const prev = {
      bodyOverflow: document.body.style.overflow,
      bodyOverscroll: document.body.style.overscrollBehavior,
    }
    document.body.style.overflow = 'hidden'
    document.body.style.overscrollBehavior = 'none'
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
    const onBeforeUnload = (event: BeforeUnloadEvent) => { if (!redirectingRef.current) event.preventDefault() }
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
      <div ref={dialogRef} className={styles.dialog} dir={dir} data-lenis-prevent role="dialog" aria-modal="true" aria-labelledby="airport-dialog-title" tabIndex={-1} style={redirecting ? { overflow: 'hidden' } : undefined}>
        <button type="button" className={styles.closeButton} aria-label={copy.closeLabel} onClick={requestClose}>
          <X size={15} strokeWidth={2} />
        </button>
        <div className={styles.content}>
          <span id="airport-dialog-title" className="sr-only">{copy.services[booking.service]} {copy.dialogLabel}</span>
          {step === 0 && booking.service === 'airport' && <TripDetails booking={booking} updateBooking={updateBooking} back={goBack} next={() => setStep(1)} />}
          {step === 0 && booking.service === 'hourly' && <HourlyTripDetails booking={booking} updateBooking={updateBooking} back={goBack} next={() => setStep(1)} />}
          {step === 0 && booking.service === 'city' && <CityTripDetails booking={booking} updateBooking={updateBooking} back={goBack} next={() => setStep(1)} />}
          {step === 0 && booking.service === 'day' && <DayTripDetails booking={booking} updateBooking={updateBooking} back={goBack} next={() => setStep(1)} />}
          {step === 0 && booking.service === 'oneWay' && <OneWayTripDetails booking={booking} updateBooking={updateBooking} back={goBack} next={() => setStep(1)} />}
          {step === 1 && <RideStep booking={booking} updateBooking={updateBooking} back={goBack} next={() => setStep(2)} />}
          {step === 2 && <ReviewStep booking={booking} back={goBack} next={() => setStep(3)} />}
          {step === 3 && <FareStep booking={booking} updateBooking={updateBooking} back={goBack} onSuccess={(id) => { setBookingId(id); setStep(4) }} onRedirecting={() => { redirectingRef.current = true; setRedirecting(true) }} />}
          {step === 4 && <SuccessStep booking={booking} bookingId={bookingId} back={goBack} onDone={resetAndClose} />}
        </div>
        <AnimatePresence>
          {confirmClose && (
            <CancelConfirmDialog onKeep={() => setConfirmClose(false)} onConfirm={resetAndClose} />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {redirecting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{
                position: 'absolute', inset: 0, zIndex: 60,
                borderRadius: 'inherit',
                background: 'rgba(20,20,20,0.92)',
                backdropFilter: 'blur(8px)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 16, padding: '32px 24px', textAlign: 'center',
              }}
            >
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
                <circle cx="22" cy="22" r="18" stroke="rgba(255,255,255,0.12)" strokeWidth="3" />
                <motion.circle
                  cx="22" cy="22" r="18"
                  stroke="#4ecdc4" strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="113"
                  strokeDashoffset="85"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  style={{ transformOrigin: '22px 22px' }}
                />
              </svg>
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 16, color: '#fff', margin: 0 }}>
                {copy.redirectingTitle}
              </p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.55)', margin: 0, maxWidth: 280, lineHeight: 1.6 }}>
                {copy.redirectingBody}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
