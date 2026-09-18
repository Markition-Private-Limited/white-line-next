import { NextRequest, NextResponse } from 'next/server'
import { fleetPost } from '../../../../lib/fleetHttp'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { status, data } = await fleetPost('/api/v1/public/airports/flight-lookup', body)
    return NextResponse.json(data, { status })
  } catch (err) {
    console.error('[flights/lookup] failed:', err)
    return NextResponse.json({ error: 'Failed to look up flight' }, { status: 500 })
  }
}
