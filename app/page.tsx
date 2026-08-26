import type { Metadata } from 'next'
import HomeHero from '@/components/HomeHero'
import ExperienceSection from '@/components/ExperienceSection'
import ServicesSection from '@/components/ServicesSection'
import WhyChooseSection from '@/components/WhyChooseSection'
import JourneySection from '@/components/JourneySection'
import FleetSection from '@/components/FleetSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import AppSection from '@/components/AppSection'

export const metadata: Metadata = {
  title: 'White Line',
  description: 'White Line brings together premium chauffeur services and modern technology to create a transportation experience built around comfort, reliability, privacy, and exceptional service.',
}

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <ExperienceSection />
      <ServicesSection />
      <WhyChooseSection />
      <JourneySection />
      <FleetSection />
      <TestimonialsSection />
      <AppSection />
    </>
  )
}
