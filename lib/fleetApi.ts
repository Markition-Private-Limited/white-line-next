// Server-side client for the White Line fleet backend.
// Used only inside Next.js Route Handlers (app/api/fleet/**) so the browser
// never talks to the backend directly — avoids CORS/mixed-content and lets us
// use Next's fetch Data Cache for a shared server-side cache layer.
//
// Note: the live response shape differs from the Swagger example in the docs
// (everything is wrapped in { success, data, timestamp }, and field names are
// camelCase — className/isActive/baseFare, not name/is_active/base_fare).
// These types reflect what the API actually returns, verified against it directly.

import { fleetGet } from './fleetHttp'

export type VehicleClass = {
  id: string
  className: string
  description: string
  passengerCapacity: number
  luggageCapacity: number
  exampleModels: string
  sortOrder?: number
  baseFare: string
  perKmRate: string
  perMinuteRate?: string
  hourlyRate?: string
  halfDayRate?: string
  fullDayRate?: string
  cityToCityRate?: string
  serviceFee?: string
  hourlyMinHours?: number
  halfDayHours?: number
  fullDay8hrRate?: string
  fullDay10hrRate?: string
  fullDay12hrRate?: string
  fullDayExtraHrRate?: string
  cityTransferRate?: string
  cityFreeKm?: number
  cityExtraKmRate?: string
  airportTransferRate?: string
  airportFreeKm?: number
  airportExtraKmRate?: string
  isActive: boolean
  imageUrl?: string
}

export type ClassVehicle = {
  id: string
  make: string
  model: string
  year: number
  plate_number: string
  color: string
  status: string
  vehicle_front_photo_url: string | null
  base_fare?: number
}

export type PublicVehicle = {
  id: string
  make: string
  model: string
  year: number
  color: string
  displayImage: string | null
  classId: string
  className: string
}

type FleetEnvelope<T> = { success: boolean; data: T; timestamp?: string; message?: string }

if (!process.env.FLEET_API_BASE_URL) {
  throw new Error('FLEET_API_BASE_URL is not set. Add it to .env.local (e.g. FLEET_API_BASE_URL=http://34.166.167.2)')
}
const FLEET_API_BASE = process.env.FLEET_API_BASE_URL

function proxiedFleetImageUrl(url: string | null | undefined): string | null {
  if (!url) return null
  try {
    const apiBaseUrl = new URL(FLEET_API_BASE)
    const imageUrl = new URL(url, apiBaseUrl)
    if (imageUrl.hostname === 'localhost' || imageUrl.hostname === '127.0.0.1') {
      imageUrl.protocol = apiBaseUrl.protocol
      imageUrl.hostname = apiBaseUrl.hostname
      imageUrl.port = apiBaseUrl.port
    }
    if (imageUrl.hostname !== apiBaseUrl.hostname) return url
    return `/api/fleet/image?url=${encodeURIComponent(imageUrl.toString())}`
  } catch {
    return url
  }
}

async function fleetGetData<T>(path: string): Promise<T> {
  const { status, data } = await fleetGet<FleetEnvelope<T>>(path)
  if (status < 200 || status >= 300) throw new Error(`Fleet API ${path} responded ${status}`)
  const envelope = data
  if (!envelope.success) throw new Error(`Fleet API ${path} returned success:false — ${envelope.message ?? 'no message'}`)
  return envelope.data
}

export async function fetchVehicleClasses(serviceType?: string): Promise<VehicleClass[]> {
  const qs = serviceType ? `?service_type=${encodeURIComponent(serviceType)}` : ''
  const data = await fleetGetData<VehicleClass[]>(`/api/v1/public/customers/vehicle-classes${qs}`)
  return Array.isArray(data)
    ? data
      .filter(item => item.isActive !== false)
      .map(item => ({ ...item, imageUrl: proxiedFleetImageUrl(item.imageUrl) ?? undefined }))
    : []
}

export async function fetchVehiclesForClass(id: string, serviceType?: string): Promise<ClassVehicle[]> {
  const qs = serviceType ? `?service_type=${encodeURIComponent(serviceType)}` : ''
  const data = await fleetGetData<ClassVehicle[]>(`/api/v1/public/customers/vehicle-classes/${encodeURIComponent(id)}/vehicles${qs}`)
  return Array.isArray(data)
    ? data.map(item => ({
      id: item.id,
      make: item.make,
      model: item.model,
      year: item.year,
      plate_number: item.plate_number,
      color: item.color,
      status: item.status,
      vehicle_front_photo_url: proxiedFleetImageUrl(item.vehicle_front_photo_url),
      base_fare: typeof item.base_fare === 'number' ? item.base_fare : undefined,
    }))
    : []
}

type RawPublicVehicle = {
  id: string
  make: string
  model: string
  year: number
  color: string
  display_image?: string | null
  vehicle_class?: { id: string; class_name: string }
}

// Public pricing endpoint: one call returns every vehicle with its class and display_image.
export async function fetchPublicVehicles(): Promise<PublicVehicle[]> {
  const data = await fleetGetData<{ items: RawPublicVehicle[] }>('/api/v1/public/pricing/vehicles')
  const items = Array.isArray(data?.items) ? data.items : []
  return items
    .filter(v => v.vehicle_class)
    .map(v => ({
      id: v.id,
      make: v.make,
      model: v.model,
      year: v.year,
      color: v.color,
      displayImage: proxiedFleetImageUrl(v.display_image),
      classId: v.vehicle_class!.id,
      className: v.vehicle_class!.class_name,
    }))
}
