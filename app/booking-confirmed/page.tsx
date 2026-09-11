import { Suspense } from 'react'
import BookingConfirmedContent from './BookingConfirmedContent'

export const metadata = { title: 'Booking Confirmed | White Line' }

export default function BookingConfirmedPage() {
  return (
    <Suspense>
      <BookingConfirmedContent />
    </Suspense>
  )
}
