import type { Metadata } from 'next'
import PageTitle from '@/components/PageTitle'
import TestimonialsHero from '@/components/TestimonialsHero'
import TestimonialsCustomerStoriesSection from '@/components/TestimonialsCustomerStoriesSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import TestimonialsVoicesSection from '@/components/TestimonialsVoicesSection'
import AppSection from '@/components/AppSection'

export const metadata: Metadata = {
  title: 'Testimonials',
  description: 'See what our passengers and business clients say about White Line — trusted for every executive journey across Saudi Arabia.',
}

export default function TestimonialsPage() {
  return (
    <>
      <PageTitle en="Testimonials | White Line" ar="آراء العملاء | White Line" />
      <TestimonialsHero />
      <TestimonialsCustomerStoriesSection />
      <TestimonialsSection />
      <TestimonialsVoicesSection />
      <AppSection />
    </>
  )
}
