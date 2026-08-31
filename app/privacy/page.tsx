import type { Metadata } from 'next'
import PageTitle from '@/components/PageTitle'
import PrivacyPolicyHero from '@/components/PrivacyPolicyHero'
import PrivacyPolicyContent from '@/components/PrivacyPolicyContent'

export const metadata: Metadata = {
  title: 'Privacy Policy | White Line',
  description: 'Learn how White Line collects, uses, and protects your personal information when you use our premium chauffeur services.',
}

export default function PrivacyPage() {
  return (
    <>
      <PageTitle en="Privacy Policy | White Line" ar="سياسة الخصوصية | وايت لاين" />
      <PrivacyPolicyHero />
      <PrivacyPolicyContent />
    </>
  )
}
