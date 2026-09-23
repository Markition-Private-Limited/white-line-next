'use client'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function BookingConfirmedContent() {
  const params = useSearchParams()

  useEffect(() => {
    async function run() {
      // PayTabs appends tran_ref on redirect; Paymob does not.
      const tranRef = params.get('tran_ref')

      // Backend appends booking_id + auth_token to both success_url and fail_url.
      // Fall back to localStorage values stored before the redirect in case the gateway
      // strips or mangles query params.
      const bookingId = params.get('booking_id') ?? (() => {
        try { return localStorage.getItem('whiteline.pendingBookingId') } catch { return null }
      })()
      const authToken = params.get('auth_token') ?? (() => {
        try { return localStorage.getItem('whiteline.pendingBookingToken') } catch { return null }
      })()

      function cleanStorage() {
        try { localStorage.removeItem('whiteline.pendingBookingId') } catch {}
        try { localStorage.removeItem('whiteline.pendingBookingToken') } catch {}
      }

      function readBookingRef(): string {
        const fromUrl = params.get('booking_number') ?? params.get('booking_id') ?? params.get('merchant_order_id') ?? null
        const fromStorage = (() => {
          try {
            const val = localStorage.getItem('whiteline.pendingBookingRef')
            if (val) localStorage.removeItem('whiteline.pendingBookingRef')
            return val
          } catch { return null }
        })()
        const ref = fromUrl ?? fromStorage ?? ''
        return (ref.startsWith('http') || ref.startsWith('/')) ? '' : ref
      }

      if (tranRef && bookingId && authToken) {
        // PayTabs path: synchronous server-verified confirmation
        cleanStorage()
        try {
          const res = await fetch('/api/bookings/manual/confirm-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify({ booking_id: bookingId, checkout_id: tranRef }),
          })
          const json = await res.json() as { paid?: boolean }
          if (res.ok && json?.paid) {
            const ref = readBookingRef()
            window.location.replace(ref ? `/?pstatus=confirmed&bid=${encodeURIComponent(ref)}` : '/?pstatus=confirmed')
          } else {
            window.location.replace('/?pstatus=failed')
          }
        } catch {
          window.location.replace('/?pstatus=failed')
        }
        return
      }

      // Paymob / fallback path (original behaviour, unchanged)
      const safeRef = readBookingRef()
      window.location.replace(safeRef ? `/?pstatus=confirmed&bid=${encodeURIComponent(safeRef)}` : '/?pstatus=confirmed')
    }

    run()
  }, [])

  return null
}
