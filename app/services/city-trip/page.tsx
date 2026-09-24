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
  title: 'City Trip',
  description: 'Direct, point-to-point chauffeur transportation within Riyadh, designed for efficiency, privacy, and punctuality.',
}

export default function CityTripPage() {
  return (
    <>
      <PageTitle en="City Trip | White Line" ar="رحلة داخل المدينة | White Line" />
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
