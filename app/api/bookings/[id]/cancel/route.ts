import { NextRequest, NextResponse } from 'next/server'
import { fleetDelete } from '../../../../../lib/fleetHttp'

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await params
    const body = await req.json().catch(() => ({}))
    const { status, data } = await fleetDelete(`/api/v1/bookings/${id}/cancel`, body, { headers: { Authorization: authHeader } })
    return NextResponse.json(data, { status })
  } catch (err) {
    console.error('[bookings/:id/cancel] failed:', err)
    return NextResponse.json({ error: 'Failed to cancel booking' }, { status: 500 })
  }
}
