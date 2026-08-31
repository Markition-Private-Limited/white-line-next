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
  title: 'City to City',
  description: 'Premium long-distance intercity chauffeur travel in private luxury vehicles across Saudi Arabia.',
}

export default function CityToCityPage() {
  return (
    <>
      <PageTitle en="City to City | White Line" ar="من مدينة إلى مدينة | White Line" />
      <AirportTransferHero servicePage="cityToCityPage" />
      <AirportTransferGallerySection servicePage="cityToCityPage" />
      <AirportTransferStepsSection servicePage="cityToCityPage" />
      <AirportTransferKeyFeaturesSection servicePage="cityToCityPage" />
      <TestimonialsSection />
      <AirportTransferFaqSection servicePage="cityToCityPage" />
      <AppSection />
    </>
  )
}
