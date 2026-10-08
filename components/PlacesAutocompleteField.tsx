'use client'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { LocateFixed, MapPin, X as CloseIcon } from 'lucide-react'
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
  types?: string[]
  locationRestriction?: { lat: number; lng: number; radius: number }
  filterPrediction?: (p: Prediction) => boolean
  disableGeo?: boolean
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
  source: 'google' | 'manual' | 'airport' | 'geo'
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
              request: { input: string; componentRestrictions?: { country: string }; types?: string[]; location?: { lat: () => number; lng: () => number }; radius?: number; strictBounds?: boolean },
              callback: (results: Prediction[] | null, status: string) => void
            ) => void
          }
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Map: new (el: HTMLElement, opts: any) => any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Marker: new (opts: any) => any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Geocoder: new () => any
        event: { clearInstanceListeners: (instance: unknown) => void }
      }
    }
  }
}

type GeoState = 'idle' | 'loading' | 'confirming' | 'denied'

// Haversine distance in km between two lat/lng points
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export default function PlacesAutocompleteField({ label, placeholder, value: selectedPlace, onSelect, onChange, attempted, types, locationRestriction, filterPrediction, disableGeo }: Props) {
  const { lang, dir } = useLanguage()
  const copy = bookingDialogCopy[lang]
  const isAr = lang === 'ar'
  const fieldRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const serviceRef = useRef<InstanceType<NonNullable<Window['google']>['maps']['places']['AutocompleteService']> | null>(null)

  const mapsReady = useGoogleMaps()
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const value = selectedPlace?.address ?? ''

  // Geolocation state
  const [geoState, setGeoState] = useState<GeoState>('idle')
  const [pendingCoords, setPendingCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [pendingAddress, setPendingAddress] = useState('')
  const [modalError, setModalError] = useState('')
  const mapDivRef = useRef<HTMLDivElement>(null)
  const geoResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showDropdown = open || focused

  useEffect(() => {
    if (!mapsReady || !window.google) return
    serviceRef.current = new window.google.maps.places.AutocompleteService()
  }, [mapsReady])

  const locationRestrictionRef = useRef(locationRestriction)
  locationRestrictionRef.current = locationRestriction
  const filterPredictionRef = useRef(filterPrediction)
  filterPredictionRef.current = filterPrediction

  // Returns true if coords pass this field's location constraints.
  // All fields implicitly require Saudi Arabia (mirrors componentRestrictions: {country:'sa'}).
  // Fields with an explicit locationRestriction also apply a tighter radius check.
  // filterPrediction is intentionally skipped — it matches autocomplete text, not coordinates.
  const passesAreaCheck = useCallback((lat: number, lng: number): boolean => {
    // Saudi Arabia bounding box — mirrors the global componentRestrictions: { country: 'sa' }
    if (lat < 16.0 || lat > 32.5 || lng < 34.5 || lng > 56.0) return false
    const lr = locationRestrictionRef.current
    if (!lr) return true
    return haversineKm(lat, lng, lr.lat, lr.lng) <= lr.radius / 1000
  }, [])

  const fetchPredictions = useCallback((input: string) => {
    if (!serviceRef.current || input.length < 2) {
      setPredictions([])
      setOpen(false)
      return
    }
    const lr = locationRestrictionRef.current
    const locationFields = lr
      ? { location: { lat: () => lr.lat, lng: () => lr.lng }, radius: lr.radius, strictBounds: true }
      : {}
    serviceRef.current.getPlacePredictions(
      { input, componentRestrictions: { country: 'sa' }, ...(types ? { types } : {}), ...locationFields },
      (results, status) => {
        if (status === 'OK' && results) {
          const fn = filterPredictionRef.current
          const filtered = fn ? results.filter(fn) : results
          setPredictions(filtered)
          setOpen(filtered.length > 0)
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

  const handleFocus = () => setFocused(true)

  const handleSelect = (prediction: Prediction) => {
    const place: PlaceValue = { address: prediction.description, placeId: prediction.place_id, source: 'google', prediction }
    onChange?.(place)
    onSelect?.(place)
    setPredictions([])
    setOpen(false)
    setFocused(false)
    // Resolve coordinates eagerly so FareStep doesn't need a second PlacesService call.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const g = (window as any).google
    const applyCoords = (lat: number, lng: number) => {
      const resolved = { ...place, lat, lng }
      onChange?.(resolved)
      onSelect?.(resolved)
    }
    const tryGeocoder = () => {
      try {
        if (!g?.maps?.Geocoder) return
        new g.maps.Geocoder().geocode(
          { address: prediction.description, componentRestrictions: { country: 'SA' } },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (results: any, status: string) => {
            if (status === 'OK' && results?.[0]?.geometry?.location) {
              applyCoords(results[0].geometry.location.lat(), results[0].geometry.location.lng())
            } else {
              console.error('[PlacesAutocomplete] Geocoder fallback failed:', status)
            }
          }
        )
      } catch (err) {
        console.error('[PlacesAutocomplete] Geocoder error:', err)
      }
    }
    try {
      if (g?.maps?.places?.PlacesService) {
        const svc = new g.maps.places.PlacesService(document.createElement('div'))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        svc.getDetails({ placeId: prediction.place_id, fields: ['geometry'] }, (result: any, status: string) => {
          if (status === 'OK' && result?.geometry?.location) {
            applyCoords(result.geometry.location.lat(), result.geometry.location.lng())
          } else {
            console.error('[PlacesAutocomplete] PlacesService.getDetails failed:', status, '— trying Geocoder')
            tryGeocoder()
          }
        })
      } else {
        tryGeocoder()
      }
    } catch (err) {
      console.error('[PlacesAutocomplete] eager resolve error:', err)
      tryGeocoder()
    }
  }

  // Close dropdown on outside click
  useEffect(() => {
    if (!open && !focused) return
    const close = (e: PointerEvent) => {
      if (!fieldRef.current?.contains(e.target as Node)) {
        setOpen(false)
        setFocused(false)
      }
    }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [open, focused])

  // ── Geolocation helpers ──────────────────────────────────────────────────────

  const reverseGeocode = useCallback((lat: number, lng: number): Promise<string> => {
    return new Promise(resolve => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const g = (window as any).google
      if (!g?.maps?.Geocoder) { resolve(''); return }
      new g.maps.Geocoder().geocode(
        { location: { lat, lng } },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (results: any, status: string) => {
          resolve(status === 'OK' && results?.[0]?.formatted_address ? results[0].formatted_address : '')
        }
      )
    })
  }, [])

  const scheduleReset = (delay = 3500) => {
    if (geoResetTimer.current) clearTimeout(geoResetTimer.current)
    geoResetTimer.current = setTimeout(() => setGeoState('idle'), delay)
  }

  const handleUseCurrentLocation = () => {
    // Ignore if already in-flight or map is open
    if (geoState === 'loading' || geoState === 'confirming') return
    if (geoResetTimer.current) clearTimeout(geoResetTimer.current)
    setOpen(false)
    setFocused(false)
    setGeoState('loading')
    if (!navigator?.geolocation) {
      setGeoState('denied')
      scheduleReset()
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        const addr = await reverseGeocode(lat, lng)
        if (geoResetTimer.current) clearTimeout(geoResetTimer.current)
        // Dismiss keyboard before opening the map modal
        if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
        setPendingCoords({ lat, lng })
        setPendingAddress(addr)
        setGeoState('confirming')
      },
      () => {
        setGeoState('denied')
        scheduleReset()
      },
      { timeout: 10000, maximumAge: 60000 }
    )
  }

  const handleConfirmLocation = () => {
    if (!pendingCoords) return
    const addr = pendingAddress || `${pendingCoords.lat.toFixed(5)}, ${pendingCoords.lng.toFixed(5)}`
    // Re-validate in case user dragged the marker outside the service area
    if (!passesAreaCheck(pendingCoords.lat, pendingCoords.lng)) {
      setModalError(copy.geoOutOfArea)
      return
    }
    setModalError('')
    if (geoResetTimer.current) clearTimeout(geoResetTimer.current)
    const place: PlaceValue = { address: addr, source: 'geo', lat: pendingCoords.lat, lng: pendingCoords.lng }
    onChange?.(place)
    onSelect?.(place)
    setGeoState('idle')
    setPendingCoords(null)
    setPendingAddress('')
  }

  const handleCancelGeo = () => {
    if (geoResetTimer.current) clearTimeout(geoResetTimer.current)
    setGeoState('idle')
    setPendingCoords(null)
    setPendingAddress('')
    setModalError('')
  }

  // Initialize Google Map when modal opens
  useEffect(() => {
    if (geoState !== 'confirming' || !mapDivRef.current || !pendingCoords) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const g = (window as any).google
    if (!g?.maps?.Map) return

    const map = new g.maps.Map(mapDivRef.current, {
      center: pendingCoords,
      zoom: 16,
      disableDefaultUI: true,
      zoomControl: true,
      gestureHandling: 'greedy',
    })

    const marker = new g.maps.Marker({
      position: pendingCoords,
      map,
      draggable: true,
      title: isAr ? 'اسحب لضبط الموقع' : 'Drag to adjust',
    })

    const updateMarker = (lat: number, lng: number) => {
      marker.setPosition({ lat, lng })
      setPendingCoords({ lat, lng })
      setPendingAddress('')
      setModalError('')
      reverseGeocode(lat, lng).then(addr => setPendingAddress(addr))
    }

    marker.addListener('dragend', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pos = (marker as any).getPosition()
      updateMarker(pos.lat(), pos.lng())
    })

    // Tap/click anywhere on the map to reposition the marker
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    map.addListener('click', (e: any) => {
      updateMarker(e.latLng.lat(), e.latLng.lng())
    })

    return () => {
      try { g.maps.event.clearInstanceListeners(map) } catch { /* ignore */ }
    }
    // Only re-run when the modal opens/closes, not when pendingCoords changes (drag)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geoState])

  // ────────────────────────────────────────────────────────────────────────────

  const isEmpty = attempted && !value.trim()
  const isUnselected = attempted && !isEmpty && selectedPlace?.source === 'manual'
  const invalid = isEmpty || isUnselected

  // Map confirmation modal rendered into document.body so it escapes stacking contexts
  const mapModal = geoState === 'confirming' && typeof document !== 'undefined'
    ? createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label={copy.geoConfirmTitle}
          dir={dir}
          onClick={(e) => { if (e.target === e.currentTarget) handleCancelGeo() }}
          style={{
            position: 'fixed', inset: 0, zIndex: 1300,
            background: 'rgba(0,0,0,0.72)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 18,
            fontFamily: 'var(--font-inter), Inter, sans-serif',
          }}
        >
          <style>{`
            @media (max-width: 640px) {
              .wl-geo-overlay-inner {
                position: fixed !important;
                bottom: 0 !important;
                left: 0 !important;
                right: 0 !important;
                top: auto !important;
                width: 100% !important;
                border-radius: 16px 16px 0 0 !important;
                max-height: 88dvh !important;
                transform: none !important;
              }
              .wl-geo-map-div { height: 220px !important; }
            }
          `}</style>
          <div
            className="wl-geo-overlay-inner"
            style={{
              width: 'min(480px, 100%)',
              maxHeight: 'calc(100dvh - 36px)',
              background: '#fff',
              borderRadius: 16,
              overflow: 'visible',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
            }}
          >
            {/* Header */}
            <div style={{ padding: '14px 18px 12px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, borderRadius: '16px 16px 0 0', background: '#fff' }}>
              <span style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif', fontWeight: 700, fontSize: 16, color: '#0f172a' }}>
                {copy.geoConfirmTitle}
              </span>
              <button
                type="button"
                onClick={handleCancelGeo}
                aria-label={copy.geoCancel}
                style={{ display: 'grid', placeItems: 'center', width: 30, height: 30, flexShrink: 0, border: '1px solid #e5e7eb', borderRadius: '50%', background: 'transparent', cursor: 'pointer', color: '#6b7280' }}
              >
                <CloseIcon size={14} />
              </button>
            </div>

            {/* Map */}
            <div ref={mapDivRef} className="wl-geo-map-div" style={{ width: '100%', height: 260, flexShrink: 0, overflow: 'hidden' }} />

            {/* Address + drag hint */}
            <div style={{ padding: '12px 18px 8px', borderTop: '1px solid #f1f5f9', minHeight: 68 }}>
              <p style={{ margin: '0 0 4px', fontSize: 10.5, color: '#9ca3af', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                {copy.geoDragHint}
              </p>
              <p style={{ margin: 0, fontSize: 13, color: '#374151', lineHeight: 1.45 }}>
                {pendingAddress || (isAr ? 'جارٍ تحديد العنوان…' : 'Resolving address…')}
              </p>
              {modalError && (
                <p style={{ margin: '6px 0 0', fontSize: 11.5, color: '#dc2626', lineHeight: 1.35 }}>
                  {modalError}
                </p>
              )}
            </div>

            {/* Actions */}
            <div style={{ padding: '8px 18px 18px', display: 'flex', gap: 8, borderRadius: '0 0 16px 16px', background: '#fff' }}>
              <button
                type="button"
                onClick={handleCancelGeo}
                style={{ flex: 1, padding: '11px 0', border: '1.5px solid #e5e7eb', borderRadius: 10, background: '#fff', fontWeight: 600, fontSize: 13.5, color: '#6b7280', cursor: 'pointer' }}
              >
                {copy.geoCancel}
              </button>
              <button
                type="button"
                onClick={handleConfirmLocation}
                style={{ flex: 2, padding: '11px 0', border: 0, borderRadius: 10, background: '#00717e', fontWeight: 700, fontSize: 13.5, color: '#fff', cursor: 'pointer' }}
              >
                {copy.geoConfirmBtn}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )
    : null

  return (
    <div ref={fieldRef} className={`${styles.field} ${styles.pickerField} ${invalid ? styles.fieldInvalid : ''}`}>
      <label>{label}</label>
      <div className={styles.control}>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          aria-label={label}
          aria-invalid={invalid}
          autoComplete="off"
        />
        <span
          className={styles.controlIcon}
          style={geoState === 'loading' ? { animation: 'wlGeoSpin 1.2s ease-in-out infinite', color: '#6b7280' } : {}}
        >
          {geoState === 'loading' ? <LocateFixed size={15} /> : <MapPin size={15} />}
        </span>
      </div>

      {/* Inline geo feedback */}
      <AnimatePresence initial={false}>
        {geoState === 'loading' && (
          <motion.small
            key="geo-loading"
            className={styles.fieldError}
            style={{ color: '#fff' }}
            initial={{ opacity: 0, y: -3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
          >
            {copy.geoLocating}
          </motion.small>
        )}
        {geoState === 'denied' && (
          <motion.small
            key="geo-denied"
            className={styles.fieldError}
            initial={{ opacity: 0, y: -3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
          >
            {copy.geoDenied}
          </motion.small>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {invalid && geoState === 'idle' && (
          <motion.small className={styles.fieldError} initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }}>
            {isEmpty ? copy.validation.required : copy.validation.selectFromList}
          </motion.small>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            className={styles.fieldMenu}
            role="listbox"
            initial={{ opacity: 0, y: -7, scaleY: 0.97 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -7, scaleY: 0.97 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {/* Use current location — hidden when sibling field already used geo */}
            {!disableGeo && (
              <button
                type="button"
                role="option"
                aria-selected={false}
                onPointerDown={e => { e.preventDefault(); handleUseCurrentLocation() }}
                style={{ display: 'flex', alignItems: 'center', gap: 9, color: '#00717e', fontWeight: 600 }}
              >
                <LocateFixed size={13} style={{ flexShrink: 0 }} />
                {copy.useCurrentLocation}
              </button>
            )}

            {/* Divider when predictions also show */}
            {!disableGeo && predictions.length > 0 && (
              <div aria-hidden="true" style={{ height: 1, background: '#edf0f2', margin: '0' }} />
            )}

            {/* Regular predictions */}
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

      {/* Keyframe for loading spinner */}
      <style>{`@keyframes wlGeoSpin { 0%,100%{transform:translateY(-50%) rotate(0deg)} 50%{transform:translateY(-50%) rotate(180deg)} }`}</style>

      {mapModal}
    </div>
  )
}
