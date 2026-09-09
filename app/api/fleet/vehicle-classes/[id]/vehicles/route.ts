import { NextResponse } from 'next/server'
import { fetchVehiclesForClass } from '../../../../../../lib/fleetApi'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const vehicles = await fetchVehiclesForClass(id)
    return NextResponse.json(vehicles, {
      headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' },
    })
  } catch (error) {
    console.error(`Failed to fetch vehicles for class ${id}:`, error)
    return NextResponse.json([], { headers: { 'Cache-Control': 'no-store' } })
  }
}
