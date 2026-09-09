import { NextResponse } from 'next/server'
import { fetchVehicleClasses } from '../../../../lib/fleetApi'

export async function GET() {
  try {
    const classes = await fetchVehicleClasses()
    return NextResponse.json(classes, {
      headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' },
    })
  } catch (error) {
    console.error('Failed to fetch vehicle classes:', error)
    // Empty array (not an error status) so the client falls back to its static fleet data gracefully.
    return NextResponse.json([], { headers: { 'Cache-Control': 'no-store' } })
  }
}
