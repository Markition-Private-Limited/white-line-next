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
  title: 'Day Service',
  description: 'Dedicated full-day professional chauffeur transportation for corporate schedules, VIP hosting, and multi-location itineraries.',
}

export default function DayServicePage() {
  return (
    <>
      <PageTitle en="Day Service | White Line" ar="خدمة اليوم الكامل | White Line" />
      <AirportTransferHero servicePage="dayServicePage" />
      <AirportTransferGallerySection servicePage="dayServicePage" />
      <AirportTransferStepsSection servicePage="dayServicePage" />
      <AirportTransferKeyFeaturesSection servicePage="dayServicePage" />
      <TestimonialsSection />
      <AirportTransferFaqSection servicePage="dayServicePage" />
      <AppSection />
    </>
  )
}
