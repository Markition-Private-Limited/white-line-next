import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#005C66]" style={{ fontFamily: 'Inter, sans-serif' }}>
        404
      </p>
      <h1 className="mb-4 text-4xl font-bold text-[#111118] sm:text-5xl" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        Page Not Found
      </h1>
      <p className="mb-8 max-w-md text-sm leading-relaxed text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
        The page you are looking for does not exist or has been moved. Head back to the homepage to continue your journey.
      </p>
      <Link
        href="/"
        className="inline-flex h-12 items-center justify-center rounded-full bg-[#0d0d14] px-8 text-sm font-semibold text-white transition-opacity hover:opacity-80"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        Back to Home
      </Link>
    </div>
  )
}
