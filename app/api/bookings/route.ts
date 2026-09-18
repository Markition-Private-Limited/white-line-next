import { NextRequest, NextResponse } from 'next/server'
import { fleetPost } from '../../../lib/fleetHttp'

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await req.json()
    const { status, data } = await fleetPost('/api/v1/bookings', body, { headers: { Authorization: authHeader } })
    return NextResponse.json(data, { status })
  } catch (err) {
    console.error('[bookings] failed:', err)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}
