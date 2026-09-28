import type { Metadata } from 'next'
import AccountPageContent from './AccountPageContent'

export const metadata: Metadata = { title: 'My Account' }

export default function AccountPage() {
  return <AccountPageContent />
}
