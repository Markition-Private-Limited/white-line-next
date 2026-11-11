import { NextResponse } from 'next/server'
import { fleetGet } from '../../../../lib/fleetHttp'

export async function GET() {
  try {
    const result = await fleetGet('/api/v1/home/config')
    return NextResponse.json(result.data, { status: result.status })
  } catch {
    return NextResponse.json({ success: false, data: null }, { status: 500 })
  }
}
