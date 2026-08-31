import type { Metadata } from 'next'
import PageTitle from '@/components/PageTitle'
import AirportTransferHero from '@/components/AirportTransferHero'
import AirportTransferGallerySection from '@/components/AirportTransferGallerySection'
import AirportTransferStepsSection from '@/components/AirportTransferStepsSection'
import AirportTransferKeyFeaturesSection from '@/components/AirportTransferKeyFeaturesSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import AirportTransferFaqSection from '@/components/AirportTransferFaqSection'
import AppSection from '@/components/AppSection'

export const metadata: Metadata = {
  title: 'One-Way Ride',
  description: 'Direct point-to-point urban chauffeur transportation designed for efficiency, privacy, and punctuality.',
}

export default function OneWayRidePage() {
  return (
    <>
      <PageTitle en="One-Way Ride | White Line" ar="رحلة باتجاه واحد | White Line" />
      <AirportTransferHero servicePage="oneWayRidePage" />
      <AirportTransferGallerySection servicePage="oneWayRidePage" />
      <AirportTransferStepsSection servicePage="oneWayRidePage" />
      <AirportTransferKeyFeaturesSection servicePage="oneWayRidePage" />
      <TestimonialsSection />
      <AirportTransferFaqSection servicePage="oneWayRidePage" />
      <AppSection />
    </>
  )
}
