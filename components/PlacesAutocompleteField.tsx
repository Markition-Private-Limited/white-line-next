'use client'
import { useEffect, useRef, useState } from 'react'
import { MapPin, Loader2 } from 'lucide-react'
import { useGoogleMaps } from '../hooks/useGoogleMaps'
import styles from './AirportTransferBookingDialog.module.css'

interface Props {
  label: string
  placeholder: string
  /** Optional: called with the selected address string when user picks a suggestion */
  onSelect?: (address: string) => void
}

// Minimal inline types to avoid requiring @types/google.maps
type GAutocomplete = {
  addListener: (event: string, handler: () => void) => { remove: () => void }
  getPlace: () => { formatted_address?: string; name?: string }
}

declare global {
  interface Window {
    google?: {
      maps: {
        places: {
          Autocomplete: new (
            input: HTMLInputElement,
            opts?: Record<string, unknown>
          ) => GAutocomplete
        }
        event: { clearInstanceListeners: (instance: unknown) => void }
      }
    }
  }
}

export default function PlacesAutocompleteField({ label, placeholder, onSelect }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const mapsReady = useGoogleMaps()
  const [value, setValue] = useState('')

  useEffect(() => {
    if (!mapsReady || !inputRef.current || !window.google) return

    const ac = new window.google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: 'sa' },
      types: ['geocode', 'establishment'],
      fields: ['formatted_address', 'name'],
    })

    const listener = ac.addListener('place_changed', () => {
      const place = ac.getPlace()
      const address = place.formatted_address ?? place.name ?? ''
      setValue(address)
      onSelect?.(address)
    })

    return () => {
      listener.remove()
      window.google?.maps.event.clearInstanceListeners(ac)
    }
  }, [mapsReady, onSelect])

  const apiKeyMissing = !process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  return (
    <div className={styles.field}>
      <label>{label}</label>
      <div className={styles.control}>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder={apiKeyMissing ? placeholder + ' (API key missing)' : placeholder}
          aria-label={label}
          autoComplete="off"
          disabled={apiKeyMissing}
        />
        <span className={styles.controlIcon}>
          {!mapsReady && !apiKeyMissing
            ? <Loader2 size={15} className="animate-spin opacity-60" />
            : <MapPin size={15} />
          }
        </span>
      </div>
    </div>
  )
}
