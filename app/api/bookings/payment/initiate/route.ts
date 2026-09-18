import { NextRequest, NextResponse } from 'next/server'
import { fleetGet } from '../../../../../lib/fleetHttp'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const bookingId = searchParams.get('booking_id')
  const amount = searchParams.get('amount')
  if (!bookingId || !amount) return NextResponse.json({ error: 'Missing params' }, { status: 400 })
  try {
    const path = `/api/v1/bookings/payment/initiate?booking_id=${encodeURIComponent(bookingId)}&amount=${encodeURIComponent(amount)}`
    const { status, data } = await fleetGet(path, { headers: { Authorization: authHeader } })
    return NextResponse.json(data, { status })
  } catch (err) {
    console.error('[bookings/payment/initiate] failed:', err)
    return NextResponse.json({ error: 'Failed to initiate payment' }, { status: 500 })
  }
}
