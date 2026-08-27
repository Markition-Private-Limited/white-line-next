import type { Metadata } from 'next'
import B2BLoginPage from '@/components/B2BLoginPage'

export const metadata: Metadata = {
  title: 'B2B Client Portal — Login',
  description: 'Secure login for White Line B2B corporate partners and fleet operators.',
}

export default function B2BLogin() {
  return <B2BLoginPage />
}
