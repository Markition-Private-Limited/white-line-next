import { NextRequest, NextResponse } from 'next/server'
import { fleetGet } from '../../../../lib/fleetHttp'

export async function GET(req: NextRequest) {
  try {
    const authorization = req.headers.get('authorization') ?? ''
    const { status, data } = await fleetGet('/api/v1/customers/profile', authorization ? { headers: { Authorization: authorization } } : undefined)
    return NextResponse.json(data, { status })
  } catch (err) {
    console.error('[customers/profile] failed:', err)
    return NextResponse.json({ error: 'Failed to get profile' }, { status: 500 })
  }
}
