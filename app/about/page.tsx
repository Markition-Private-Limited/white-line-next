import type { Metadata } from 'next'
import AboutHero from '@/components/AboutHero'
import AboutWhitlineSection from '@/components/AboutWhitlineSection'
import AboutMasterySection from '@/components/AboutMasterySection'
import AboutAdvantageSection from '@/components/AboutAdvantageSection'
import AboutGoldStandardSection from '@/components/AboutGoldStandardSection'
import AppSection from '@/components/AppSection'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Discover the story behind White Line — redefining executive travel in the Kingdom with premium chauffeur services.',
}

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutWhitlineSection />
      <AboutMasterySection />
      <AboutAdvantageSection />
      <AboutGoldStandardSection />
      <AppSection />
    </>
  )
}
