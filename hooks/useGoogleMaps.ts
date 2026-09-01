'use client'
import { useEffect, useState } from 'react'

// Singleton promise so the script is injected only once per page
let _loadPromise: Promise<void> | null = null

function loadScript(apiKey: string): Promise<void> {
  if (_loadPromise) return _loadPromise
  if (typeof window !== 'undefined' && (window as Record<string, unknown>).google) {
    _loadPromise = Promise.resolve()
    return _loadPromise
  }
  _loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => {
      _loadPromise = null
      reject(new Error('Google Maps failed to load'))
    }
    document.head.appendChild(script)
  })
  return _loadPromise
}

export function useGoogleMaps(): boolean {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!key) return
    loadScript(key)
      .then(() => setReady(true))
      .catch(() => {})
  }, [])

  return ready
}
