'use client'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function BookingConfirmedContent() {
  const params = useSearchParams()

  useEffect(() => {
    const bookingId =
      params.get('booking_id') ??
      params.get('booking_number') ??
      params.get('merchant_order_id') ??
      ''
    const url = bookingId
      ? `/?pstatus=confirmed&bid=${encodeURIComponent(bookingId)}`
      : '/?pstatus=confirmed'
    window.location.replace(url)
  }, [])

  return null
}
