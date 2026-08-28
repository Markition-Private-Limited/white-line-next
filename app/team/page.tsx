import type { Metadata } from 'next'
import PageTitle from '@/components/PageTitle'

export const metadata: Metadata = {
  title: 'Our Team',
  description: 'Meet the professionals behind White Line luxury chauffeur services.',
}

export default function TeamPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <PageTitle en="Our Team | White Line" ar="فريقنا | White Line" />
      <h1 className="text-3xl font-bold text-[var(--text-h)] mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Our Team</h1>
      <p className="text-[var(--text)]" style={{ fontFamily: 'Inter, sans-serif' }}>Team page — coming soon.</p>
    </div>
  )
}
