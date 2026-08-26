import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Explore White Line portfolio of luxury chauffeur experiences.',
}

export default function PortfolioPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="text-3xl font-bold text-[var(--text-h)] mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Portfolio</h1>
      <p className="text-[var(--text)]" style={{ fontFamily: 'Inter, sans-serif' }}>Portfolio page — coming soon.</p>
    </div>
  )
}
