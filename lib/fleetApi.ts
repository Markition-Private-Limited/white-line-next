// Server-side client for the White Line fleet backend.
// Used only inside Next.js Route Handlers (app/api/fleet/**) so the browser
// never talks to the backend directly — avoids CORS/mixed-content and lets us
// use Next's fetch Data Cache for a shared server-side cache layer.
//
// Note: the live response shape differs from the Swagger example in the docs
// (everything is wrapped in { success, data, timestamp }, and field names are
// camelCase — className/isActive/baseFare, not name/is_active/base_fare).
// These types reflect what the API actually returns, verified against it directly.

export type VehicleClass = {
  id: string
  className: string
  description: string
  passengerCapacity: number
  luggageCapacity: number
  exampleModels: string
  baseFare: string
  perKmRate: string
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
}

type FleetEnvelope<T> = { success: boolean; data: T; timestamp?: string; message?: string }

const FLEET_API_BASE = process.env.FLEET_API_BASE_URL ?? 'http://34.166.167.2'
const REVALIDATE_SECONDS = 300
const REQUEST_TIMEOUT_MS = 8000

function proxiedFleetImageUrl(url: string | null | undefined): string | null {
  if (!url) return null
  try {
    const imageUrl = new URL(url)
    const apiBaseUrl = new URL(FLEET_API_BASE)
    const isFleetImage =
      imageUrl.pathname.startsWith('/api/v1/public-files/') ||
      imageUrl.pathname.startsWith('/api/v1/uploads/drivers/vehicles/')
    if (imageUrl.origin !== apiBaseUrl.origin || !isFleetImage) return url
    return `/api/fleet/image?url=${encodeURIComponent(imageUrl.toString())}`
  } catch {
    return url
  }
}

async function fleetGet<T>(path: string): Promise<T> {
  const res = await fetch(`${FLEET_API_BASE}${path}`, {
    next: { revalidate: REVALIDATE_SECONDS },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })
  if (!res.ok) throw new Error(`Fleet API ${path} responded ${res.status}`)
  const envelope = (await res.json()) as FleetEnvelope<T>
  if (!envelope.success) throw new Error(`Fleet API ${path} returned success:false — ${envelope.message ?? 'no message'}`)
  return envelope.data
}

export async function fetchVehicleClasses(): Promise<VehicleClass[]> {
  const data = await fleetGet<VehicleClass[]>('/api/v1/public/customers/vehicle-classes')
  return Array.isArray(data)
    ? data
      .filter(item => item.isActive !== false)
      .map(item => ({ ...item, imageUrl: proxiedFleetImageUrl(item.imageUrl) ?? undefined }))
    : []
}

export async function fetchVehiclesForClass(id: string): Promise<ClassVehicle[]> {
  const data = await fleetGet<ClassVehicle[]>(`/api/v1/public/customers/vehicle-classes/${encodeURIComponent(id)}/vehicles`)
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
    }))
    : []
}
