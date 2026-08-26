import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Transparent pricing for White Line premium chauffeur services.',
}

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="text-3xl font-bold text-[var(--text-h)] mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Pricing</h1>
      <p className="text-[var(--text)]" style={{ fontFamily: 'Inter, sans-serif' }}>Pricing page — coming soon.</p>
    </div>
  )
}
