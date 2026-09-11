import { Suspense } from 'react'
import BookingFailedContent from './BookingFailedContent'

export const metadata = { title: 'Payment Failed | White Line' }

export default function BookingFailedPage() {
  return (
    <Suspense>
      <BookingFailedContent />
    </Suspense>
  )
}
