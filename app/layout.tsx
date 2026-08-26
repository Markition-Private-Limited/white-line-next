import type { Metadata } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import LenisProvider from '@/providers/LenisProvider'
import Footer from '@/layouts/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const montserrat = Montserrat({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-montserrat', display: 'swap' })

export const metadata: Metadata = {
  title: {
    default: 'White Line',
    template: '%s | White Line',
  },
  description: 'White Line brings together premium chauffeur services and modern technology to create a transportation experience built around comfort, reliability, privacy, and exceptional service.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body suppressHydrationWarning>
        <LenisProvider>
          {children}
          <Footer />
        </LenisProvider>
      </body>
    </html>
  )
}
