import { NextRequest, NextResponse } from 'next/server'
import { fleetGet } from '../../../../lib/fleetHttp'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { searchParams } = new URL(req.url)
    const qs = searchParams.toString()
    const path = `/api/v1/customers/bookings${qs ? `?${qs}` : ''}`
    const { status, data } = await fleetGet(path, { headers: { Authorization: authHeader } })
    return NextResponse.json(data, { status })
  } catch (err) {
    console.error('[customers/bookings] failed:', err)
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}
