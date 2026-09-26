import { NextRequest, NextResponse } from 'next/server'
import { fleetPost } from '../../../../lib/fleetHttp'

export async function POST(req: NextRequest) {
  try {
    const authorization = req.headers.get('authorization') ?? ''
    const { status, data } = await fleetPost(
      '/api/v1/auth/logout',
      {},
      authorization ? { headers: { Authorization: authorization } } : undefined
    )
    return NextResponse.json(data, { status })
  } catch (err) {
    console.error('[auth/logout] failed:', err)
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 })
  }
}
