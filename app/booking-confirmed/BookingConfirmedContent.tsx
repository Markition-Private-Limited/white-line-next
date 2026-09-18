'use client'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function BookingConfirmedContent() {
  const params = useSearchParams()

  useEffect(() => {
    const fromUrl =
      params.get('booking_number') ??
      params.get('booking_id') ??
      params.get('merchant_order_id') ??
      null
    const fromStorage = (() => {
      try {
        const val = localStorage.getItem('whiteline.pendingBookingRef')
        if (val) localStorage.removeItem('whiteline.pendingBookingRef')
        return val
      } catch { return null }
    })()
    const bookingRef = fromUrl ?? fromStorage ?? ''
    const isUrlLike = bookingRef.startsWith('http') || bookingRef.startsWith('/')
    const safeRef = isUrlLike ? '' : bookingRef
    const url = safeRef
      ? `/?pstatus=confirmed&bid=${encodeURIComponent(safeRef)}`
      : '/?pstatus=confirmed'
    window.location.replace(url)
  }, [])

  return null
}
