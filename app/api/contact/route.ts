import { NextRequest, NextResponse } from 'next/server'

const CONTACT_API = 'http://34.166.167.2/api/v1/public/support/contact-message'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const res = await fetch(CONTACT_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await res.json().catch(() => null)

    if (!res.ok) {
      const message = Array.isArray(data?.message) ? data.message.join(' ') : data?.message
      return NextResponse.json(
        { error: message ?? 'Submission failed' },
        { status: res.status }
      )
    }

    return NextResponse.json(data ?? { success: true })
  } catch {
    return NextResponse.json({ error: 'Network error' }, { status: 500 })
  }
}
