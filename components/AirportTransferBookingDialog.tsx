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

const hourlyDurations = Array.from({ length: 15 }, (_, index) => index + 2)

// ─── Live fleet data (vehicle-classes / vehicles-per-class) ─────────────────
// Backed by a small proxy in app/api/fleet/**, which caches the upstream
// fleet API server-side. Mirrored here with a short-lived client cache so
// reopening the booking dialog doesn't refetch on every open.
type VehicleClass = { id: string; className: string; description: string; passengerCapacity: number; luggageCapacity: number; isActive: boolean; imageUrl?: string }
type ClassVehicle = { id: string; make: string; model: string; year: number; plate_number: string; color: string; status: string; vehicle_front_photo_url: string | null }

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

async function getFleetVehicles(classId: string): Promise<ClassVehicle[]> {
  const cached = fleetVehiclesCache.get(classId)
  if (cached && Date.now() - cached.timestamp < FLEET_CACHE_TTL_MS) return cached.data
  try {
    const res = await fetch(`/api/fleet/vehicle-classes/${encodeURIComponent(classId)}/vehicles`)
    const data = res.ok ? await res.json() : []
    const list: ClassVehicle[] = Array.isArray(data) ? data : []
    fleetVehiclesCache.set(classId, { data: list, timestamp: Date.now() })
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

type VehicleCard = { key: string; image: string | null; title: string; passengers: number; bags: number }

function buildVehicleCards(activeVehicles: ClassVehicle[], activeClass: VehicleClass | null): VehicleCard[] {
  const passengers = activeClass?.passengerCapacity ?? 2
  const bags = activeClass?.luggageCapacity ?? 4
  const vehicleTitle = (vehicle: ClassVehicle) => {
    const make = vehicle.make.trim()
    const model = vehicle.model.trim()
    if (!model || model === '-') return make
    const makeLower = make.toLowerCase()
    const modelLower = model.toLowerCase()
    if (makeLower === modelLower || makeLower.includes(modelLower)) return make
    return `${make} ${model}`
  }
  return activeVehicles.map(vehicle => ({
    key: vehicle.id,
    image: vehicle.vehicle_front_photo_url,
    title: vehicleTitle(vehicle),
    passengers,
    bags,
  }))
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
  dayDuration: 'full',
  name: '',
  email: '',
  phone: '',
  bookingFor: null,
  guest: blankGuest(),
  categoryIndex: null,
  vehicle: null,
  vehicleId: null,
  otp: Array(6).fill(''),
})

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

type CountryCode = { iso: string; dial: string; name: string; nameAr?: string; len: number }
const phoneCountryCodes: CountryCode[] = [
  { iso: 'SA', dial: '+966', name: 'Saudi Arabia',             nameAr: 'السعودية',       len: 9  },
  { iso: 'AF', dial: '+93',  name: 'Afghanistan',                                         len: 9  },
  { iso: 'AL', dial: '+355', name: 'Albania',                                              len: 9  },
  { iso: 'DZ', dial: '+213', name: 'Algeria',                  nameAr: 'الجزائر',         len: 9  },
  { iso: 'AD', dial: '+376', name: 'Andorra',                                              len: 6  },
  { iso: 'AO', dial: '+244', name: 'Angola',                                               len: 9  },
  { iso: 'AG', dial: '+1268',name: 'Antigua & Barbuda',                                    len: 10 },
  { iso: 'AR', dial: '+54',  name: 'Argentina',                                            len: 10 },
  { iso: 'AM', dial: '+374', name: 'Armenia',                                              len: 8  },
  { iso: 'AU', dial: '+61',  name: 'Australia',                                            len: 9  },
  { iso: 'AT', dial: '+43',  name: 'Austria',                                              len: 10 },
  { iso: 'AZ', dial: '+994', name: 'Azerbaijan',                                           len: 9  },
  { iso: 'BS', dial: '+1242',name: 'Bahamas',                                              len: 10 },
  { iso: 'BH', dial: '+973', name: 'Bahrain',                  nameAr: 'البحرين',         len: 8  },
  { iso: 'BD', dial: '+880', name: 'Bangladesh',                                           len: 10 },
  { iso: 'BB', dial: '+1246',name: 'Barbados',                                             len: 10 },
  { iso: 'BY', dial: '+375', name: 'Belarus',                                              len: 9  },
  { iso: 'BE', dial: '+32',  name: 'Belgium',                                              len: 9  },
  { iso: 'BZ', dial: '+501', name: 'Belize',                                               len: 7  },
  { iso: 'BJ', dial: '+229', name: 'Benin',                                                len: 8  },
  { iso: 'BT', dial: '+975', name: 'Bhutan',                                               len: 8  },
  { iso: 'BO', dial: '+591', name: 'Bolivia',                                              len: 8  },
  { iso: 'BA', dial: '+387', name: 'Bosnia & Herzegovina',                                 len: 8  },
  { iso: 'BW', dial: '+267', name: 'Botswana',                                             len: 7  },
  { iso: 'BR', dial: '+55',  name: 'Brazil',                                               len: 11 },
  { iso: 'BN', dial: '+673', name: 'Brunei',                                               len: 7  },
  { iso: 'BG', dial: '+359', name: 'Bulgaria',                                             len: 9  },
  { iso: 'BF', dial: '+226', name: 'Burkina Faso',                                         len: 8  },
  { iso: 'BI', dial: '+257', name: 'Burundi',                                              len: 8  },
  { iso: 'CV', dial: '+238', name: 'Cape Verde',                                           len: 7  },
  { iso: 'KH', dial: '+855', name: 'Cambodia',                                             len: 9  },
  { iso: 'CM', dial: '+237', name: 'Cameroon',                                             len: 9  },
  { iso: 'CA', dial: '+1',   name: 'Canada',                                               len: 10 },
  { iso: 'CF', dial: '+236', name: 'Central African Republic',                             len: 8  },
  { iso: 'TD', dial: '+235', name: 'Chad',                                                 len: 8  },
  { iso: 'CL', dial: '+56',  name: 'Chile',                                                len: 9  },
  { iso: 'CN', dial: '+86',  name: 'China',                                                len: 11 },
  { iso: 'CO', dial: '+57',  name: 'Colombia',                                             len: 10 },
  { iso: 'KM', dial: '+269', name: 'Comoros',                                              len: 7  },
  { iso: 'CG', dial: '+242', name: 'Congo',                                                len: 9  },
  { iso: 'CD', dial: '+243', name: 'Congo (DRC)',                                          len: 9  },
  { iso: 'CR', dial: '+506', name: 'Costa Rica',                                           len: 8  },
  { iso: 'HR', dial: '+385', name: 'Croatia',                                              len: 9  },
  { iso: 'CU', dial: '+53',  name: 'Cuba',                                                 len: 8  },
  { iso: 'CY', dial: '+357', name: 'Cyprus',                                               len: 8  },
  { iso: 'CZ', dial: '+420', name: 'Czech Republic',                                       len: 9  },
  { iso: 'DK', dial: '+45',  name: 'Denmark',                                              len: 8  },
  { iso: 'DJ', dial: '+253', name: 'Djibouti',                                             len: 8  },
  { iso: 'DM', dial: '+1767',name: 'Dominica',                                             len: 10 },
  { iso: 'DO', dial: '+1809',name: 'Dominican Republic',                                   len: 10 },
  { iso: 'EC', dial: '+593', name: 'Ecuador',                                              len: 9  },
  { iso: 'EG', dial: '+20',  name: 'Egypt',                    nameAr: 'مصر',             len: 10 },
  { iso: 'SV', dial: '+503', name: 'El Salvador',                                          len: 8  },
  { iso: 'GQ', dial: '+240', name: 'Equatorial Guinea',                                    len: 9  },
  { iso: 'ER', dial: '+291', name: 'Eritrea',                                              len: 7  },
  { iso: 'EE', dial: '+372', name: 'Estonia',                                              len: 8  },
  { iso: 'SZ', dial: '+268', name: 'Eswatini',                                             len: 8  },
  { iso: 'ET', dial: '+251', name: 'Ethiopia',                                             len: 9  },
  { iso: 'FJ', dial: '+679', name: 'Fiji',                                                 len: 7  },
  { iso: 'FI', dial: '+358', name: 'Finland',                                              len: 10 },
  { iso: 'FR', dial: '+33',  name: 'France',                                               len: 9  },
  { iso: 'GA', dial: '+241', name: 'Gabon',                                                len: 8  },
  { iso: 'GM', dial: '+220', name: 'Gambia',                                               len: 7  },
  { iso: 'GE', dial: '+995', name: 'Georgia',                                              len: 9  },
  { iso: 'DE', dial: '+49',  name: 'Germany',                                              len: 11 },
  { iso: 'GH', dial: '+233', name: 'Ghana',                                                len: 9  },
  { iso: 'GR', dial: '+30',  name: 'Greece',                                               len: 10 },
  { iso: 'GD', dial: '+1473',name: 'Grenada',                                              len: 10 },
  { iso: 'GT', dial: '+502', name: 'Guatemala',                                            len: 8  },
  { iso: 'GN', dial: '+224', name: 'Guinea',                                               len: 9  },
  { iso: 'GW', dial: '+245', name: 'Guinea-Bissau',                                        len: 7  },
  { iso: 'GY', dial: '+592', name: 'Guyana',                                               len: 7  },
  { iso: 'HT', dial: '+509', name: 'Haiti',                                                len: 8  },
  { iso: 'HN', dial: '+504', name: 'Honduras',                                             len: 8  },
  { iso: 'HU', dial: '+36',  name: 'Hungary',                                              len: 9  },
  { iso: 'IS', dial: '+354', name: 'Iceland',                                              len: 7  },
  { iso: 'IN', dial: '+91',  name: 'India',                    nameAr: 'الهند',           len: 10 },
  { iso: 'ID', dial: '+62',  name: 'Indonesia',                                            len: 12 },
  { iso: 'IR', dial: '+98',  name: 'Iran',                     nameAr: 'إيران',           len: 10 },
  { iso: 'IQ', dial: '+964', name: 'Iraq',                     nameAr: 'العراق',          len: 10 },
  { iso: 'IE', dial: '+353', name: 'Ireland',                                              len: 9  },
  { iso: 'IL', dial: '+972', name: 'Israel',                                               len: 9  },
  { iso: 'IT', dial: '+39',  name: 'Italy',                                                len: 10 },
  { iso: 'CI', dial: '+225', name: "Côte d'Ivoire",                                        len: 10 },
  { iso: 'JM', dial: '+1876',name: 'Jamaica',                                              len: 10 },
  { iso: 'JP', dial: '+81',  name: 'Japan',                                                len: 10 },
  { iso: 'JO', dial: '+962', name: 'Jordan',                   nameAr: 'الأردن',          len: 9  },
  { iso: 'KZ', dial: '+77',  name: 'Kazakhstan',                                           len: 10 },
  { iso: 'KE', dial: '+254', name: 'Kenya',                                                len: 9  },
  { iso: 'KI', dial: '+686', name: 'Kiribati',                                             len: 5  },
  { iso: 'KW', dial: '+965', name: 'Kuwait',                   nameAr: 'الكويت',          len: 8  },
  { iso: 'KG', dial: '+996', name: 'Kyrgyzstan',                                           len: 9  },
  { iso: 'LA', dial: '+856', name: 'Laos',                                                 len: 9  },
  { iso: 'LV', dial: '+371', name: 'Latvia',                                               len: 8  },
  { iso: 'LB', dial: '+961', name: 'Lebanon',                  nameAr: 'لبنان',           len: 8  },
  { iso: 'LS', dial: '+266', name: 'Lesotho',                                              len: 8  },
  { iso: 'LR', dial: '+231', name: 'Liberia',                                              len: 8  },
  { iso: 'LY', dial: '+218', name: 'Libya',                    nameAr: 'ليبيا',           len: 9  },
  { iso: 'LI', dial: '+423', name: 'Liechtenstein',                                        len: 7  },
  { iso: 'LT', dial: '+370', name: 'Lithuania',                                            len: 8  },
  { iso: 'LU', dial: '+352', name: 'Luxembourg',                                           len: 9  },
  { iso: 'MG', dial: '+261', name: 'Madagascar',                                           len: 9  },
  { iso: 'MW', dial: '+265', name: 'Malawi',                                               len: 9  },
  { iso: 'MY', dial: '+60',  name: 'Malaysia',                                             len: 11 },
  { iso: 'MV', dial: '+960', name: 'Maldives',                                             len: 7  },
  { iso: 'ML', dial: '+223', name: 'Mali',                                                 len: 8  },
  { iso: 'MT', dial: '+356', name: 'Malta',                                                len: 8  },
  { iso: 'MH', dial: '+692', name: 'Marshall Islands',                                     len: 7  },
  { iso: 'MR', dial: '+222', name: 'Mauritania',                                           len: 8  },
  { iso: 'MU', dial: '+230', name: 'Mauritius',                                            len: 8  },
  { iso: 'MX', dial: '+52',  name: 'Mexico',                                               len: 10 },
  { iso: 'FM', dial: '+691', name: 'Micronesia',                                           len: 7  },
  { iso: 'MD', dial: '+373', name: 'Moldova',                                              len: 8  },
  { iso: 'MC', dial: '+377', name: 'Monaco',                                               len: 8  },
  { iso: 'MN', dial: '+976', name: 'Mongolia',                                             len: 8  },
  { iso: 'ME', dial: '+382', name: 'Montenegro',                                           len: 8  },
  { iso: 'MA', dial: '+212', name: 'Morocco',                  nameAr: 'المغرب',          len: 9  },
  { iso: 'MZ', dial: '+258', name: 'Mozambique',                                           len: 9  },
  { iso: 'MM', dial: '+95',  name: 'Myanmar',                                              len: 9  },
  { iso: 'NA', dial: '+264', name: 'Namibia',                                              len: 9  },
  { iso: 'NR', dial: '+674', name: 'Nauru',                                                len: 7  },
  { iso: 'NP', dial: '+977', name: 'Nepal',                                                len: 10 },
  { iso: 'NL', dial: '+31',  name: 'Netherlands',                                          len: 9  },
  { iso: 'NZ', dial: '+64',  name: 'New Zealand',                                          len: 9  },
  { iso: 'NI', dial: '+505', name: 'Nicaragua',                                            len: 8  },
  { iso: 'NE', dial: '+227', name: 'Niger',                                                len: 8  },
  { iso: 'NG', dial: '+234', name: 'Nigeria',                                              len: 10 },
  { iso: 'KP', dial: '+850', name: 'North Korea',                                          len: 10 },
  { iso: 'MK', dial: '+389', name: 'North Macedonia',                                      len: 8  },
  { iso: 'NO', dial: '+47',  name: 'Norway',                                               len: 8  },
  { iso: 'OM', dial: '+968', name: 'Oman',                     nameAr: 'عُمان',           len: 8  },
  { iso: 'PK', dial: '+92',  name: 'Pakistan',                 nameAr: 'باكستان',         len: 10 },
  { iso: 'PW', dial: '+680', name: 'Palau',                                                len: 7  },
  { iso: 'PS', dial: '+970', name: 'Palestine',                nameAr: 'فلسطين',          len: 9  },
  { iso: 'PA', dial: '+507', name: 'Panama',                                               len: 8  },
  { iso: 'PG', dial: '+675', name: 'Papua New Guinea',                                     len: 8  },
  { iso: 'PY', dial: '+595', name: 'Paraguay',                                             len: 9  },
  { iso: 'PE', dial: '+51',  name: 'Peru',                                                 len: 9  },
  { iso: 'PH', dial: '+63',  name: 'Philippines',                                          len: 10 },
  { iso: 'PL', dial: '+48',  name: 'Poland',                                               len: 9  },
  { iso: 'PT', dial: '+351', name: 'Portugal',                                             len: 9  },
  { iso: 'QA', dial: '+974', name: 'Qatar',                    nameAr: 'قطر',             len: 8  },
  { iso: 'RO', dial: '+40',  name: 'Romania',                                              len: 9  },
  { iso: 'RU', dial: '+7',   name: 'Russia',                                               len: 10 },
  { iso: 'RW', dial: '+250', name: 'Rwanda',                                               len: 9  },
  { iso: 'KN', dial: '+1869',name: 'Saint Kitts & Nevis',                                  len: 10 },
  { iso: 'LC', dial: '+1758',name: 'Saint Lucia',                                          len: 10 },
  { iso: 'VC', dial: '+1784',name: 'Saint Vincent & Grenadines',                           len: 10 },
  { iso: 'WS', dial: '+685', name: 'Samoa',                                                len: 7  },
  { iso: 'SM', dial: '+378', name: 'San Marino',                                           len: 10 },
  { iso: 'ST', dial: '+239', name: 'São Tomé & Príncipe',                                  len: 7  },
  { iso: 'SN', dial: '+221', name: 'Senegal',                                              len: 9  },
  { iso: 'RS', dial: '+381', name: 'Serbia',                                               len: 9  },
  { iso: 'SC', dial: '+248', name: 'Seychelles',                                           len: 7  },
  { iso: 'SL', dial: '+232', name: 'Sierra Leone',                                         len: 8  },
  { iso: 'SG', dial: '+65',  name: 'Singapore',                                            len: 8  },
  { iso: 'SK', dial: '+421', name: 'Slovakia',                                             len: 9  },
  { iso: 'SI', dial: '+386', name: 'Slovenia',                                             len: 8  },
  { iso: 'SB', dial: '+677', name: 'Solomon Islands',                                      len: 7  },
  { iso: 'SO', dial: '+252', name: 'Somalia',                  nameAr: 'الصومال',         len: 9  },
  { iso: 'ZA', dial: '+27',  name: 'South Africa',                                         len: 9  },
  { iso: 'KR', dial: '+82',  name: 'South Korea',                                          len: 10 },
  { iso: 'SS', dial: '+211', name: 'South Sudan',                                          len: 9  },
  { iso: 'ES', dial: '+34',  name: 'Spain',                                                len: 9  },
  { iso: 'LK', dial: '+94',  name: 'Sri Lanka',                                            len: 9  },
  { iso: 'SD', dial: '+249', name: 'Sudan',                    nameAr: 'السودان',         len: 9  },
  { iso: 'SR', dial: '+597', name: 'Suriname',                                             len: 7  },
  { iso: 'SE', dial: '+46',  name: 'Sweden',                                               len: 9  },
  { iso: 'CH', dial: '+41',  name: 'Switzerland',                                          len: 9  },
  { iso: 'SY', dial: '+963', name: 'Syria',                    nameAr: 'سوريا',           len: 9  },
  { iso: 'TW', dial: '+886', name: 'Taiwan',                                               len: 9  },
  { iso: 'TJ', dial: '+992', name: 'Tajikistan',                                           len: 9  },
  { iso: 'TZ', dial: '+255', name: 'Tanzania',                                             len: 9  },
  { iso: 'TH', dial: '+66',  name: 'Thailand',                                             len: 9  },
  { iso: 'TL', dial: '+670', name: 'Timor-Leste',                                          len: 8  },
  { iso: 'TG', dial: '+228', name: 'Togo',                                                 len: 8  },
  { iso: 'TO', dial: '+676', name: 'Tonga',                                                len: 5  },
  { iso: 'TT', dial: '+1868',name: 'Trinidad & Tobago',                                    len: 10 },
  { iso: 'TN', dial: '+216', name: 'Tunisia',                  nameAr: 'تونس',            len: 8  },
  { iso: 'TR', dial: '+90',  name: 'Turkey',                                               len: 10 },
  { iso: 'TM', dial: '+993', name: 'Turkmenistan',                                         len: 8  },
  { iso: 'TV', dial: '+688', name: 'Tuvalu',                                               len: 5  },
  { iso: 'UG', dial: '+256', name: 'Uganda',                                               len: 9  },
  { iso: 'UA', dial: '+380', name: 'Ukraine',                                              len: 9  },
  { iso: 'AE', dial: '+971', name: 'United Arab Emirates',     nameAr: 'الإمارات',        len: 9  },
  { iso: 'GB', dial: '+44',  name: 'United Kingdom',           nameAr: 'المملكة المتحدة', len: 10 },
  { iso: 'US', dial: '+1',   name: 'United States',            nameAr: 'الولايات المتحدة',len: 10 },
  { iso: 'UY', dial: '+598', name: 'Uruguay',                                              len: 8  },
  { iso: 'UZ', dial: '+998', name: 'Uzbekistan',                                           len: 9  },
  { iso: 'VU', dial: '+678', name: 'Vanuatu',                                              len: 7  },
  { iso: 'VE', dial: '+58',  name: 'Venezuela',                                            len: 10 },
  { iso: 'VN', dial: '+84',  name: 'Vietnam',                                              len: 9  },
  { iso: 'YE', dial: '+967', name: 'Yemen',                    nameAr: 'اليمن',           len: 9  },
  { iso: 'ZM', dial: '+260', name: 'Zambia',                                               len: 9  },
  { iso: 'ZW', dial: '+263', name: 'Zimbabwe',                                             len: 9  },
]

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
  const ChoiceIcon = dir === 'rtl' ? ChevronLeft : ChevronRight
  const contactComplete = booking.name.trim().length >= 2 && /^\S+@\S+\.\S+$/.test(booking.email.trim()) && booking.phone.replace(/\D/g, '').length >= 8
  const guestFieldsComplete = booking.guest.name.trim().length >= 2 && booking.guest.phone.replace(/\D/g, '').length >= 8 && /^\S+@\S+\.\S+$/.test(booking.guest.email.trim())
  const chooseBookingFor = (value: BookingFor) => {
    updateBooking({ bookingFor: value, guest: value === booking.bookingFor ? booking.guest : blankGuest() })
  }
  const continueTrip = () => {
    setAttempted(true)
    onAttempt()
    const detailsComplete = booking.bookingFor === 'self' ? contactComplete : (contactComplete && guestFieldsComplete)
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
          <PhoneField label={copy.phoneNumber} value={booking.phone} attempted={attempted} onChange={value => updateBooking({ phone: value })} />
          <TextField label={copy.emailAddress} placeholder="you@example.com" value={booking.email} inputType="email" attempted={attempted} onChange={value => updateBooking({ email: value })} />
        </div>
      )}

      {booking.bookingFor === 'guest' && (
        <>
          <div className={styles.guestPanel}>
            <h3>{copy.yourDetails}</h3>
            <p>{copy.enterYourDetails}</p>
            <TextField label={copy.fullName} placeholder={copy.namePlaceholder} value={booking.name} minLength={2} attempted={attempted} onChange={value => updateBooking({ name: value })} />
            <PhoneField label={copy.phoneNumber} value={booking.phone} attempted={attempted} onChange={value => updateBooking({ phone: value })} />
            <TextField label={copy.emailAddress} placeholder="you@example.com" value={booking.email} inputType="email" attempted={attempted} onChange={value => updateBooking({ email: value })} />
          </div>
          <div className={styles.guestPanel}>
            <h3>{copy.guestDetails}</h3>
            <p>{copy.enterGuestDetails}</p>
            <TextField label={copy.fullName} placeholder={copy.guestName} value={booking.guest.name} minLength={2} attempted={attempted} onChange={value => updateBooking({ guest: { ...booking.guest, name: value } })} />
            <PhoneField label={copy.phoneNumber} value={booking.guest.phone} attempted={attempted} onChange={value => updateBooking({ guest: { ...booking.guest, phone: value } })} />
            <TextField label={copy.emailAddress} placeholder="guest@gmail.com" value={booking.guest.email} inputType="email" attempted={attempted} onChange={value => updateBooking({ guest: { ...booking.guest, email: value } })} />
          </div>
        </>
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
  const { copy, lang } = useBookingDialogCopy()
  const [fleetClasses, setFleetClasses] = useState<VehicleClass[] | null>(null)
  const [vehiclesByClass, setVehiclesByClass] = useState<{ classId: string; data: ClassVehicle[] } | null>(null)
  const [categoryScrollIndex, setCategoryScrollIndex] = useState(0)
  const [vehicleScrollIndex, setVehicleScrollIndex] = useState(0)
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
    getFleetVehicles(activeCategoryId).then(data => { if (!cancelled) setVehiclesByClass({ classId: activeCategoryId, data }) })
    return () => { cancelled = true }
  }, [activeCategoryId])

  const activeVehicles = vehiclesByClass && vehiclesByClass.classId === activeCategoryId ? vehiclesByClass.data : null
  const activeClass = fleetClasses?.find(cls => cls.id === activeCategoryId) ?? null
  const vehicleCards = activeVehicles ? buildVehicleCards(activeVehicles, activeClass) : null
  const vehicleCount = vehicleCards?.length ?? 0
  const vehicleIndex = booking.vehicle !== null && vehicleCards?.length ? Math.min(booking.vehicle, vehicleCards.length - 1) : null
  const rideSelectionComplete = Boolean(activeCategoryId && vehicleIndex !== null)
  const service = booking.service
  const isHourly = service === 'hourly'
  const isCity = service === 'city'
  const isDay = service === 'day'
  const isOneWay = service === 'oneWay'
  const normalizeLoopIndex = (index: number, count: number) => (index % count + count) % count
  const scrollGridToIndex = useCallback((grid: HTMLDivElement | null, index: number, behavior: ScrollBehavior = 'smooth') => {
    const item = grid?.children.item(index)
    if (!(grid && item instanceof HTMLElement)) return
    const left = item.offsetLeft - (grid.clientWidth - item.offsetWidth) / 2
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
  const updateScrollIndex = useCallback((grid: HTMLDivElement, count: number, setIndex: (index: number) => void) => {
    if (count <= 0) return
    const nearestIndex = nearestLoopItemIndex(grid)
    setIndex(normalizeLoopIndex(nearestIndex, count))
  }, [nearestLoopItemIndex])
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
    vehicleScrollIndexRef.current = index
    setVehicleScrollIndex(index)
    scrollGridToIndex(vehicleGridRef.current, index)
  }
  const showCategorySlide = (index: number) => {
    categoryScrollIndexRef.current = index
    setCategoryScrollIndex(index)
    scrollGridToIndex(categoryGridRef.current, index)
  }
  const showVehicleSlide = (index: number) => {
    vehicleScrollIndexRef.current = index
    setVehicleScrollIndex(index)
    scrollGridToIndex(vehicleGridRef.current, index)
  }

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
      }))
    }
    frame = requestAnimationFrame(() => {
      scrollGridToIndex(grid, vehicleScrollIndexRef.current, 'auto')
      updateScrollIndex(grid, vehicleCount, index => {
        vehicleScrollIndexRef.current = index
        setVehicleScrollIndex(index)
      })
    })
    grid.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      grid.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [activeCategoryId, vehicleCount, vehicleScrollIndexRef, scrollGridToIndex, updateScrollIndex])

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
            {categories.length > 1 && (
              <button type="button" className={`${styles.sliderArrow} ${styles.sliderArrowLeft}`} aria-label="Previous category" disabled={categoryScrollIndex === 0} onClick={() => showCategorySlide(categoryScrollIndex - 1)}>
                <ChevronLeft size={13} strokeWidth={2.5} />
              </button>
            )}
            <div ref={categoryGridRef} className={styles.categoryGrid}>
              {categories.map((item, index) => (
                <button type="button" key={item.id ?? item.name} className={`${styles.categoryCard} ${categoryIndex === index ? styles.categoryActive : ''}`} onClick={() => selectCategory(index)}>
                  <span className={styles.categoryCopy}>
                    <strong>{item.name}</strong>
                    <small>{item.copy}</small>
                  </span>
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt="" aria-hidden="true" className={styles.categoryImg} />
                  ) : (
                    <span className={styles.categoryPlaceholder} aria-hidden="true" />
                  )}
                </button>
              ))}
            </div>
            {categories.length > 1 && (
              <button type="button" className={`${styles.sliderArrow} ${styles.sliderArrowRight}`} aria-label="Next category" disabled={categoryScrollIndex === categories.length - 1} onClick={() => showCategorySlide(categoryScrollIndex + 1)}>
                <ChevronRight size={13} strokeWidth={2.5} />
              </button>
            )}
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
              {vehicleCards.length > 1 && (
                <button type="button" className={`${styles.sliderArrow} ${styles.sliderArrowLeft}`} aria-label="Previous vehicle" disabled={vehicleScrollIndex === 0} onClick={() => showVehicleSlide(vehicleScrollIndex - 1)}>
                  <ChevronLeft size={13} strokeWidth={2.5} />
                </button>
              )}
              <div ref={vehicleGridRef} className={styles.vehicleGrid}>
                {vehicleCards.map((card, index) => (
                  <button type="button" key={card.key} className={`${styles.vehicleCard} ${vehicleIndex === index ? styles.vehicleSelected : ''}`} onClick={() => selectVehicle(index)}>
                    {card.image ? (
                      <img src={card.image} alt={card.title} className={styles.vehicleImg} />
                    ) : (
                      <span className={styles.vehicleNoImage}><CircleInfo size={20} /></span>
                    )}
                    <span className={styles.vehicleCopy}>
                      <strong>{card.title}</strong>
                      <small className={styles.vehicleSpecs} aria-label={copy.passengersAndBags}>
                        <span className={styles.vehicleSpec}><span className={styles.vehicleSpecIcon}><UsersRound size={8} /></span><span>{card.passengers}</span></span>
                        <span className={styles.vehicleSpec}><span className={styles.vehicleSpecIcon}><Luggage size={8} /></span><span>{card.bags}</span></span>
                      </small>
                    </span>
                  </button>
                ))}
              </div>
              {vehicleCards.length > 1 && (
                <button type="button" className={`${styles.sliderArrow} ${styles.sliderArrowRight}`} aria-label="Next vehicle" disabled={vehicleScrollIndex === vehicleCards.length - 1} onClick={() => showVehicleSlide(vehicleScrollIndex + 1)}>
                  <ChevronRight size={13} strokeWidth={2.5} />
                </button>
              )}
            </div>
            {vehicleCards.length > 1 && (
              <div className={styles.sliderDots}>
                {vehicleCards.map((card, index) => (
                  <button
                    key={card.key}
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
    getFleetVehicles(activeCategoryId).then(data => { if (!cancelled) setVehiclesByClass({ classId: activeCategoryId, data }) })
    return () => { cancelled = true }
  }, [activeCategoryId])

  const activeVehicles = vehiclesByClass && vehiclesByClass.classId === activeCategoryId ? vehiclesByClass.data : null
  const activeClass = fleetClasses?.find(cls => cls.id === activeCategoryId) ?? null
  const vehicleCards = activeVehicles ? buildVehicleCards(activeVehicles, activeClass) : null
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
        const res = await fetch('/api/fare/calculate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        if (cancelled) return
        if (!res.ok) { setFareError(true); setFareLoading(false); return }
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

    const scheduledDatetime = (() => {
      if (!booking.date || !booking.time) return undefined
      const d = new Date(booking.date)
      const pad = (n: number) => String(n).padStart(2, '0')
      const yyyy = d.getFullYear()
      const mm = pad(d.getMonth() + 1)
      const dd = pad(d.getDate())
      const hh = pad(booking.time.hour)
      const min = pad(booking.time.minute)
      return `${yyyy}-${mm}-${dd}T${hh}:${min}:00.000Z`
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
      const checkoutUrl: string = json?.data?.payment?.checkout_url ?? json?.payment?.checkout_url ?? ''
      if (checkoutUrl) {
        onRedirecting?.()
        window.location.href = checkoutUrl
      } else {
        onSuccess(json?.data?.booking_id ?? json?.booking_id ?? '')
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
          <div className={`${styles.fareRow} ${styles.fareErrorRow}`}><span>{copy.fareError}</span></div>
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
