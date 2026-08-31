import type { Metadata } from 'next'
import PageTitle from '@/components/PageTitle'
import WhyChooseUsHero from '@/components/WhyChooseUsHero'
import WhyChooseDetailSection from '@/components/WhyChooseDetailSection'
import WhyChooseQuoteSection from '@/components/WhyChooseQuoteSection'
import WhyChooseBetterExpSection from '@/components/WhyChooseBetterExpSection'
import WhyChooseFaqSection from '@/components/WhyChooseFaqSection'
import AppSection from '@/components/AppSection'

export const metadata: Metadata = {
  title: 'Why Choose Us',
  description: 'Discover what sets White Line apart in every mile — comfort, reliability, privacy, and exceptional service.',
}

export default function WhyChooseUsPage() {
  return (
    <>
      <PageTitle en="Why Choose Us | White Line" ar="لماذا White Line" />
      <WhyChooseUsHero />
      <WhyChooseDetailSection />
      <WhyChooseQuoteSection />
      <WhyChooseBetterExpSection />
      <WhyChooseFaqSection />
      <AppSection />
    </>
  )
}
