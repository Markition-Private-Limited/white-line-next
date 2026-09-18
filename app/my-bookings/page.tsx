import type { Metadata } from 'next'
import MyBookingsContent from './MyBookingsContent'

export const metadata: Metadata = { title: 'My Bookings' }

export default function MyBookingsPage() {
  return <MyBookingsContent />
}
