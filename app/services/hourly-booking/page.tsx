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
  title: 'Hourly Booking',
  description: 'Flexible hourly chauffeur service with a private luxury vehicle and professional driver at your disposal across Saudi Arabia.',
}

export default function HourlyBookingPage() {
  return (
    <>
      <PageTitle en="Hourly Booking | White Line" ar="الحجز بالساعة | White Line" />
      <AirportTransferHero servicePage="hourlyBookingPage" />
      <AirportTransferGallerySection servicePage="hourlyBookingPage" />
      <AirportTransferStepsSection servicePage="hourlyBookingPage" />
      <AirportTransferKeyFeaturesSection servicePage="hourlyBookingPage" />
      <TestimonialsSection />
      <AirportTransferFaqSection servicePage="hourlyBookingPage" />
      <AppSection />
    </>
  )
}
