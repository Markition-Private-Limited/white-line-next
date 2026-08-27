import type { Metadata } from 'next'
import ServicesHero from '@/components/ServicesHero'
import ServicesListSection from '@/components/ServicesListSection'
import AppSection from '@/components/AppSection'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Explore White Line premium chauffeur services — airport transfers, city-to-city travel, hourly hire, and corporate accounts.',
}

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesListSection />
      <AppSection />
    </>
  )
}
