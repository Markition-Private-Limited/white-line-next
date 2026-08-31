import type { Metadata } from 'next'
import PageTitle from '@/components/PageTitle'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about White Line luxury chauffeur services.',
}

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <PageTitle en="FAQ | White Line" ar="الأسئلة الشائعة | White Line" />
      <h1 className="text-3xl font-bold text-[var(--text-h)] mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>FAQ</h1>
      <p className="text-[var(--text)]" style={{ fontFamily: 'Inter, sans-serif' }}>FAQ page — coming soon.</p>
    </div>
  )
}
