'use client'

import { useEffect, useState } from 'react'

export type VehicleClass = {
  id: string
  className: string
  description: string
  passengerCapacity: number
  luggageCapacity: number
  exampleModels?: string
  imageUrl?: string
}

export function useFleetClasses() {
  const [fleetClasses, setFleetClasses] = useState<VehicleClass[] | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch('/api/fleet/vehicle-classes')
      .then(res => res.ok ? res.json() as Promise<VehicleClass[]> : Promise.resolve([]))
      .then(data => {
        if (!cancelled) setFleetClasses(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        if (!cancelled) setFleetClasses([])
      })

    return () => {
      cancelled = true
    }
  }, [])

  return fleetClasses
}
