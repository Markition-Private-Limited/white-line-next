import { NextRequest, NextResponse } from 'next/server'
import { fleetPost } from '../../../../../lib/fleetHttp'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { booking_id, checkout_id } = body as { booking_id?: string; checkout_id?: string }
    if (!booking_id || !checkout_id) {
      return NextResponse.json({ error: 'booking_id and checkout_id required' }, { status: 400 })
    }
    const authHeader = req.headers.get('authorization') ?? ''
    const { status, data } = await fleetPost(
      `/api/v1/public/bookings/manual-booking/${booking_id}/confirm-payment`,
      { checkout_id },
      { headers: { Authorization: authHeader } }
    )
    return NextResponse.json(data, { status })
  } catch (err) {
    console.error('[bookings/manual/confirm-payment] failed:', err)
    return NextResponse.json({ error: 'Failed to confirm payment' }, { status: 500 })
  }
}
