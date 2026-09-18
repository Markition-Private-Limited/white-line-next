import type { Metadata } from 'next'
import JourneysPageContent from './JourneysPageContent'

export const metadata: Metadata = { title: 'My Journeys — White Line' }

export default function JourneysPage() {
  return <JourneysPageContent />
}
