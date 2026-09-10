'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useGoogleMaps } from '../hooks/useGoogleMaps'
import { useLanguage } from '../context/LanguageContext'
import { bookingDialogCopy } from '../lib/bookingDialogCopy'
import styles from './AirportTransferBookingDialog.module.css'

interface Props {
  label: string
  placeholder: string
  value?: PlaceValue | null
  onSelect?: (place: PlaceValue) => void
  onChange?: (place: PlaceValue | null) => void
  attempted?: boolean
}

type Prediction = {
  description: string
  place_id: string
  matched_substrings?: Array<{ length: number; offset: number }>
  structured_formatting?: {
    main_text: string
    main_text_matched_substrings?: Array<{ length: number; offset: number }>
    secondary_text?: string
  }
  terms?: Array<{ offset: number; value: string }>
  types?: string[]
}
export type PlaceValue = {
  address: string
  placeId?: string
  source: 'google' | 'manual' | 'airport'
  prediction?: Prediction
  lat?: number
  lng?: number
}

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

export default function PlacesAutocompleteField({ label, placeholder, value: selectedPlace, onSelect, onChange, attempted }: Props) {
  const { lang } = useLanguage()
  const copy = bookingDialogCopy[lang]
  const fieldRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const serviceRef = useRef<InstanceType<NonNullable<Window['google']>['maps']['places']['AutocompleteService']> | null>(null)

  const mapsReady = useGoogleMaps()
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [open, setOpen] = useState(false)
  const value = selectedPlace?.address ?? ''

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
    onChange?.(input.trim() ? { address: input, source: 'manual' } : null)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchPredictions(input), 300)
  }

  const handleSelect = (prediction: Prediction) => {
    const place: PlaceValue = { address: prediction.description, placeId: prediction.place_id, source: 'google', prediction }
    onChange?.(place)
    onSelect?.(place)
    setPredictions([])
    setOpen(false)
    // Resolve coordinates eagerly so FareStep doesn't need a second PlacesService call
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const g = (window as any).google
      if (g?.maps?.places?.PlacesService) {
        const svc = new g.maps.places.PlacesService(document.createElement('div'))
        svc.getDetails({ placeId: prediction.place_id, fields: ['geometry'] }, (result: any, status: string) => {
          if (status === 'OK' && result?.geometry?.location) {
            const resolved = { ...place, lat: result.geometry.location.lat(), lng: result.geometry.location.lng() }
            onChange?.(resolved)
            onSelect?.(resolved)
          }
        })
      }
    } catch { /* non-critical */ }
  }

  useEffect(() => {
    if (!open) return
    const close = (e: PointerEvent) => {
      if (!fieldRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [open])

  const isEmpty = attempted && !value.trim()

  return (
    <div ref={fieldRef} className={`${styles.field} ${styles.pickerField} ${isEmpty ? styles.fieldInvalid : ''}`}>
      <label>{label}</label>
      <div className={styles.control}>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          aria-label={label}
          aria-invalid={isEmpty}
          autoComplete="off"
        />
        <span className={styles.controlIcon}>
          <MapPin size={15} />
        </span>
      </div>
      <AnimatePresence initial={false}>
        {isEmpty && (
          <motion.small className={styles.fieldError} initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }}>
            {copy.validation.required}
          </motion.small>
        )}
      </AnimatePresence>
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
                aria-selected={value === p.description}
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
