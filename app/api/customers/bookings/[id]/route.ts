import { NextRequest, NextResponse } from 'next/server'
import { fleetGet } from '../../../../../lib/fleetHttp'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await params
    const { status, data } = await fleetGet(`/api/v1/customers/bookings/${id}`, { headers: { Authorization: authHeader } })
    return NextResponse.json(data, { status })
  } catch (err) {
    console.error('[customers/bookings/:id] failed:', err)
    return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 })
  }
}
