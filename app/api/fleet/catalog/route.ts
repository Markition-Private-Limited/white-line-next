import { NextResponse } from 'next/server'
import { fetchVehicleClasses, fetchPublicVehicles } from '../../../../lib/fleetApi'

export async function GET() {
  try {
    const [classes, vehicles] = await Promise.all([fetchVehicleClasses(), fetchPublicVehicles()])
    return NextResponse.json({ classes, vehicles }, {
      headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' },
    })
  } catch (error) {
    console.error('Failed to fetch fleet catalog:', error)
    return NextResponse.json({ error: 'unavailable' }, { status: 502, headers: { 'Cache-Control': 'no-store' } })
  }
}
