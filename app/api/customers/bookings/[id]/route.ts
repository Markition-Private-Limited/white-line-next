import { NextRequest, NextResponse } from 'next/server'
import { fleetGet } from '../../../../../lib/fleetHttp'

const DEV_SEED_DETAIL = {
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
  baseFare: '460.00',
  distanceFare: null,
  serviceFee: '0.00',
  vatAmount: '69.00',
  vehicleClass: {
    className: 'First Class',
    description: 'Premium luxury sedan',
    imageUrl: null,
    passengerCapacity: 3,
    luggageCapacity: 3,
    exampleModels: 'Mercedes-Benz S-Class, BMW 7 Series',
  },
  driver: null,
  vehicle: null,
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authHeader = req.headers.get('Authorization')
  if (process.env.NODE_ENV === 'development') {
    const { id } = await params
    if (id === 'dev-seed-001') return NextResponse.json({ success: true, data: DEV_SEED_DETAIL })
  }
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { id } = await params
    const { status, data } = await fleetGet(`/api/v1/customers/bookings/${id}`, { headers: { Authorization: authHeader } })
    return NextResponse.json(data, { status })
  } catch (err) {
    console.error('[customers/bookings/:id] failed:', err)
    return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 })
  }
}
