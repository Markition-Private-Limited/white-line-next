import { NextRequest, NextResponse } from 'next/server'
import { fleetPost } from '../../../../lib/fleetHttp'

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  const path = authHeader
    ? '/api/v1/bookings/calculate-fare'
    : '/api/v1/public/bookings/calculate-fare'
  try {
    const body = await req.json()
    const options = authHeader ? { headers: { Authorization: authHeader } } : undefined
    const { status, data } = await fleetPost(path, body, options)
    return NextResponse.json(data, { status })
  } catch (err) {
    console.error('[fare/calculate] failed:', err)
    return NextResponse.json({ error: 'Failed to calculate fare' }, { status: 500 })
  }
}
