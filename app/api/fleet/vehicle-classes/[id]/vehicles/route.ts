import { NextRequest, NextResponse } from 'next/server'
import { fetchVehiclesForClass } from '../../../../../../lib/fleetApi'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const sp = new URL(req.url).searchParams
  const toNum = (key: string) => { const v = sp.get(key); return v !== null ? parseFloat(v) : undefined }
  try {
    const vehicles = await fetchVehiclesForClass(id, {
      serviceType: sp.get('service_type') ?? undefined,
      pickupLat: toNum('pickup_lat'),
      pickupLng: toNum('pickup_lng'),
      dropoffLat: toNum('dropoff_lat'),
      dropoffLng: toNum('dropoff_lng'),
      durationHours: toNum('duration_hours'),
    })
    return NextResponse.json(vehicles, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error(`Failed to fetch vehicles for class ${id}:`, error)
    return NextResponse.json([], { headers: { 'Cache-Control': 'no-store' } })
  }
}
