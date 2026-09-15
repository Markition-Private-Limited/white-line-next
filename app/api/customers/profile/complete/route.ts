import { NextRequest, NextResponse } from 'next/server'
import { fleetPost } from '../../../../../lib/fleetHttp'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const authorization = req.headers.get('authorization') ?? ''
    const { status, data } = await fleetPost('/api/v1/customers/profile/complete', body, authorization ? { headers: { Authorization: authorization } } : undefined)
    return NextResponse.json(data, { status })
  } catch (err) {
    console.error('[customers/profile/complete] failed:', err)
    return NextResponse.json({ error: 'Failed to complete profile' }, { status: 500 })
  }
}
