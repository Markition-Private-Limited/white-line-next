import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const res = await fetch('http://34.166.167.2/api/v1/public/bookings/manual-booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ error: 'Failed to submit booking' }, { status: 500 })
  }
}
