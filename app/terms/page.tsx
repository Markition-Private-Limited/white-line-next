import type { Metadata } from 'next'
import PageTitle from '@/components/PageTitle'
import TermsHero from '@/components/TermsHero'
import TermsContent from '@/components/TermsContent'

export const metadata: Metadata = {
  title: 'Terms & Conditions | White Line',
  description: 'Read the Terms & Conditions governing your use of White Line premium chauffeur and executive transportation services.',
}

export default function TermsPage() {
  return (
    <>
      <PageTitle en="Terms & Conditions | White Line" ar="الشروط والأحكام | وايت لاين" />
      <TermsHero />
      <TermsContent />
    </>
  )
}
