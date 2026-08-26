import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'News, updates, and insights from White Line luxury chauffeur services.',
}

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="text-3xl font-bold text-[var(--text-h)] mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Blog</h1>
      <p className="text-[var(--text)]" style={{ fontFamily: 'Inter, sans-serif' }}>Blog page — coming soon.</p>
    </div>
  )
}
