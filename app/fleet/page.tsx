import { Suspense } from 'react'
import type { Metadata } from 'next'
import FleetHero from '@/components/FleetHero'
import FleetCarsSection from '@/components/FleetCarsSection'
import AppSection from '@/components/AppSection'

export const metadata: Metadata = {
  title: 'Our Fleet',
  description: 'A vehicle for every occasion. Explore our premium chauffeur fleet — from executive sedans to luxury SUVs, available 24/7 across Saudi Arabia.',
}

export default function FleetPage() {
  return (
    <>
      <FleetHero />
      <Suspense>
        <FleetCarsSection />
      </Suspense>
      <AppSection />
    </>
  )
}
