import { NextRequest, NextResponse } from 'next/server'
import { fetchVehiclesForClass } from '../../../../../../lib/fleetApi'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const serviceType = new URL(req.url).searchParams.get('service_type') ?? undefined
  try {
    const vehicles = await fetchVehiclesForClass(id, serviceType)
    return NextResponse.json(vehicles, {
      headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' },
    })
  } catch (error) {
    console.error(`Failed to fetch vehicles for class ${id}:`, error)
    return NextResponse.json([], { headers: { 'Cache-Control': 'no-store' } })
  }
}
