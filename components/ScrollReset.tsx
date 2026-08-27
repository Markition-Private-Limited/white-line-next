'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollReset() {
  const pathname = usePathname()

  useEffect(() => {
    // Bypass Lenis smooth scroll — jump instantly to top on every page change
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [pathname])

  return null
}
