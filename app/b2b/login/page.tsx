import type { Metadata } from 'next'
import B2BLoginPage from '@/components/B2BLoginPage'
import PageTitle from '@/components/PageTitle'

export const metadata: Metadata = {
  title: 'B2B Client Portal — Login',
  description: 'Secure login for White Line B2B corporate partners and fleet operators.',
}

export default function B2BLogin() {
  return (
    <>
      <PageTitle en="B2B Client Portal — Login | White Line" ar="بوابة الشركات — تسجيل الدخول | White Line" />
      <B2BLoginPage />
    </>
  )
}
