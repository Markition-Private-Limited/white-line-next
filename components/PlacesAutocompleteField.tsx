'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, MapPin } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useGoogleMaps } from '../hooks/useGoogleMaps'
import styles from './AirportTransferBookingDialog.module.css'

interface Props {
  label: string
  placeholder: string
  onSelect?: (address: string) => void
}

type Prediction = { description: string; place_id: string }

declare global {
  interface Window {
    google?: {
      maps: {
        places: {
          AutocompleteService: new () => {
            getPlacePredictions: (
              request: { input: string; componentRestrictions?: { country: string } },
              callback: (results: Prediction[] | null, status: string) => void
            ) => void
          }
        }
        event: { clearInstanceListeners: (instance: unknown) => void }
      }
    }
  }
}

export default function PlacesAutocompleteField({ label, placeholder, onSelect }: Props) {
  const fieldRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const serviceRef = useRef<InstanceType<NonNullable<Window['google']>['maps']['places']['AutocompleteService']> | null>(null)

  const mapsReady = useGoogleMaps()
  const [value, setValue] = useState('')
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!mapsReady || !window.google) return
    serviceRef.current = new window.google.maps.places.AutocompleteService()
  }, [mapsReady])

  const fetchPredictions = useCallback((input: string) => {
    if (!serviceRef.current || input.length < 2) {
      setPredictions([])
      setOpen(false)
      return
    }
    serviceRef.current.getPlacePredictions(
      { input, componentRestrictions: { country: 'sa' } },
      (results, status) => {
        if (status === 'OK' && results) {
          setPredictions(results)
          setOpen(true)
        } else {
          setPredictions([])
          setOpen(false)
        }
      }
    )
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    setValue(input)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchPredictions(input), 300)
  }

  const handleSelect = (prediction: Prediction) => {
    setValue(prediction.description)
    onSelect?.(prediction.description)
    setPredictions([])
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const close = (e: PointerEvent) => {
      if (!fieldRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [open])

  const apiKeyMissing = !process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  return (
    <div ref={fieldRef} className={`${styles.field} ${styles.pickerField}`}>
      <label>{label}</label>
      <div className={styles.control}>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={apiKeyMissing ? `${placeholder} (API key missing)` : placeholder}
          aria-label={label}
          autoComplete="off"
          disabled={apiKeyMissing || !mapsReady}
        />
        <span className={styles.controlIcon}>
          {!mapsReady && !apiKeyMissing
            ? <Loader2 size={15} className="animate-spin opacity-60" />
            : <MapPin size={15} />}
        </span>
      </div>
      <AnimatePresence>
        {open && predictions.length > 0 && (
          <motion.div
            className={styles.fieldMenu}
            role="listbox"
            initial={{ opacity: 0, y: -7, scaleY: 0.97 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -7, scaleY: 0.97 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {predictions.map(p => (
              <button
                key={p.place_id}
                type="button"
                role="option"
                onPointerDown={e => { e.preventDefault(); handleSelect(p) }}
              >
                {p.description}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
