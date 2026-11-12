import { NextRequest, NextResponse } from 'next/server'
import { fleetGet } from '../../../../lib/fleetHttp'

// Seed booking used in development when there is no real auth token
const DEV_SEED_BOOKING = {
  id: 'dev-seed-001',
  bookingNumber: 'WL-DEV-001',
  serviceType: 'airport',
  status: 'pending',
  paymentStatus: 'paid',
  paymentMethod: null,
  pickupAddress: 'King Khalid International Airport (RUH), Riyadh',
  dropoffAddress: 'Four Seasons Hotel Riyadh, King Fahd Road',
  scheduledDatetime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  totalFare: '460.00',
  flightNumber: 'SV123',
  vehicleClass: { className: 'First Class', imageUrl: null },
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({ success: true, data: { items: [DEV_SEED_BOOKING], total: 1, page: 1 } })
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { searchParams } = new URL(req.url)
    const qs = searchParams.toString()
    const path = `/api/v1/customers/bookings${qs ? `?${qs}` : ''}`
    const { status, data } = await fleetGet(path, { headers: { Authorization: authHeader } })
    if (process.env.NODE_ENV === 'development') {
      const body = data as { success?: boolean; data?: { items?: unknown[]; total?: number; page?: number } }
      const items = body?.data?.items ?? []
      const total = body?.data?.total ?? 0
      const page = body?.data?.page ?? 1
      return NextResponse.json({
        success: true,
        data: { items: [DEV_SEED_BOOKING, ...items], total: total + 1, page },
      }, { status })
    }
    return NextResponse.json(data, { status })
  } catch (err) {
    console.error('[customers/bookings] failed:', err)
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}
