import type { Metadata } from 'next'
import CustomerSupportHero from '@/components/CustomerSupportHero'
import CustomerSupportServicesSection from '@/components/CustomerSupportServicesSection'
import CustomerSupportActiveTripSection from '@/components/CustomerSupportActiveTripSection'
import { StatsRow } from '@/components/ExperienceSection'
import AppSection from '@/components/AppSection'

export const metadata: Metadata = {
  title: 'Customer Support',
  description: 'Professional assistance for all your client support needs. Available 24/7 to handle every ticket, journey detail, dispatcher issue and unexpected delay.',
}

export default function CustomerSupportPage() {
  return (
    <>
      <CustomerSupportHero />
      <CustomerSupportServicesSection />
      <CustomerSupportActiveTripSection />
      <div className="w-full bg-white px-6 sm:px-12 lg:px-20 pt-16 pb-2">
        <StatsRow />
      </div>
      <AppSection />
    </>
  )
}
