import { NextRequest, NextResponse } from 'next/server'
import { fleetDelete } from '../../../../lib/fleetHttp'

export async function DELETE(req: NextRequest) {
  try {
    const authorization = req.headers.get('authorization') ?? ''
    const { status, data } = await fleetDelete('/api/v1/customers/account', authorization ? { headers: { Authorization: authorization } } : undefined)
    return NextResponse.json(data, { status })
  } catch (err) {
    console.error('[customers/account DELETE] failed:', err)
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
  }
}
