'use client'
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { VehicleClass, PublicVehicle } from '../lib/fleetApi'

export type { VehicleClass, PublicVehicle }

export type FleetState = {
  /** Active classes that have at least one vehicle, ordered by sortOrder */
  classes: VehicleClass[]
  vehiclesByClass: Record<string, PublicVehicle[]>
  loading: boolean
  error: boolean
}

const defaultState: FleetState = { classes: [], vehiclesByClass: {}, loading: true, error: false }

const FleetContext = createContext<FleetState>(defaultState)

export function FleetProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FleetState>(defaultState)

  useEffect(() => {
    let cancelled = false
    fetch('/api/fleet/catalog')
      .then(r => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<{ classes: VehicleClass[]; vehicles: PublicVehicle[] }>
      })
      .then(({ classes, vehicles }) => {
        if (cancelled) return
        const vehiclesByClass: Record<string, PublicVehicle[]> = {}
        vehicles.forEach(v => { (vehiclesByClass[v.classId] ??= []).push(v) })
        const live = classes
          .filter(c => c.isActive !== false && (vehiclesByClass[c.id]?.length ?? 0) > 0)
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
        setState({ classes: live, vehiclesByClass, loading: false, error: false })
      })
      .catch(() => {
        if (!cancelled) setState({ classes: [], vehiclesByClass: {}, loading: false, error: true })
      })
    return () => { cancelled = true }
  }, [])

  const value = useMemo(() => state, [state])
  return <FleetContext.Provider value={value}>{children}</FleetContext.Provider>
}

export function useFleet() {
  return useContext(FleetContext)
}
