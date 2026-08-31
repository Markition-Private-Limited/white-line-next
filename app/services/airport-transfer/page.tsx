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
  title: 'Airport Transfer',
  description: 'Premium airport transfers with real-time flight tracking, meet & greet service, and professional chauffeurs across Saudi Arabia.',
}

export default function AirportTransferPage() {
  return (
    <>
      <PageTitle en="Airport Transfer | White Line" ar="نقل المطار | White Line" />
      <AirportTransferHero />
      <AirportTransferGallerySection />
      <AirportTransferStepsSection />
      <AirportTransferKeyFeaturesSection />
      <TestimonialsSection />
      <AirportTransferFaqSection />
      <AppSection />
    </>
  )
}
