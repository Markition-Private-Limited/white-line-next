import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Explore White Line premium chauffeur services — airport transfers, city-to-city travel, hourly hire, and corporate accounts.',
}

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="text-3xl font-bold text-[var(--text-h)] mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Services</h1>
      <p className="text-[var(--text)]" style={{ fontFamily: 'Inter, sans-serif' }}>Services page — coming soon.</p>
    </div>
  )
}
